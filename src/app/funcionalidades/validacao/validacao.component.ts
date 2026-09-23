import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AtividadeService } from '../../core/servicos/atividade.service';
import { DesafioService } from '../../core/servicos/desafio.service';
import { RankingService } from '../../core/servicos/ranking.service';
import { UsuarioService } from '../../core/servicos/usuario.service';
import { Atividade } from '../../core/modelos/atividade.model';

@Component({
  selector: 'app-validacao',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './validacao.component.html',
  styleUrls: ['./validacao.component.css']
})
export class ValidacaoComponent implements OnInit {
  atividades: Atividade[] = [];
  atividadesPendentes: Atividade[] = [];
  atividadesAvaliadas: Atividade[] = [];

  codigosIdentificados: { [id: number]: string } = {};

  atividadeRejeitando: Atividade | null = null;
  motivoRejeicao: string = 'Código não corresponde ou não está visível na evidência';

  mensagemFeedback: {
    tipo: 'sucesso' | 'erro';
    titulo: string;
    detalhe: string;
  } | null = null;

  modalEvidenciaAberta: boolean = false;
  evidenciaSelecionada: string = '';
  atividadeModalAtual: Atividade | null = null;

  motivosRapidosRejeicao: string[] = [
    'Código não corresponde ou não está visível na evidência',
    'Participante não aparece na foto',
    'Evidência não corresponde à atividade',
    'Comprovação ilegível ou incompleta'
  ];

  constructor(
    private atividadeService: AtividadeService,
    private desafioService: DesafioService,
    private rankingService: RankingService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarAtividades();
  }

  carregarAtividades(): void {
    this.atividadeService.atividades$.subscribe(todas => {
      this.atividades = todas;
      this.atividadesPendentes = todas.filter(a => a.status === 'pendente');
      this.atividadesAvaliadas = todas.filter(a => a.status !== 'pendente');
    });
  }

  obterDesafio(desafioId: number) {
    return this.desafioService.obterDesafioPorId(desafioId);
  }

  exigeCodigoFisico(atividade: Atividade): boolean {
    const desafio = this.obterDesafio(atividade.desafioId);
    return desafio?.formato === 'caucao' && desafio?.local !== 'presencial';
  }

  codigoCorresponde(atividade: Atividade): boolean {
    const identificado = (this.codigosIdentificados[atividade.id] || '').trim();
    return identificado === atividade.codigoValidacao;
  }

  confirmarCodigoIdentificado(atividade: Atividade, codigo?: string): void {
    this.codigosIdentificados[atividade.id] = codigo || atividade.codigoValidacao || '';
  }

  limparCodigoIdentificado(atividade: Atividade): void {
    this.codigosIdentificados[atividade.id] = '';
  }

  aprovar(atividade: Atividade): void {
    if (this.exigeCodigoFisico(atividade) && !this.codigoCorresponde(atividade)) {
      this.mensagemFeedback = {
        tipo: 'erro',
        titulo: 'Código físico não conferido!',
        detalhe: `Para desafios com caução online, a atividade só pode ser aprovada se o código físico na evidência for verificado e corresponder ao código esperado (${atividade.codigoValidacao}). Caso o código não confira, rejeite a atividade.`
      };

      setTimeout(() => {
        this.mensagemFeedback = null;
      }, 6000);
      return;
    }

    // 1. Aprova no AtividadeService
    this.atividadeService.aprovarAtividade(atividade.id);

    const desafio = this.obterDesafio(atividade.desafioId);
    const unidade = desafio ? desafio.unidade : '';

    // 2. Pontos proporcionais (50 pontos base + 10 por km/unidade)
    const pontosCalculados = Math.round(atividade.valorMetrica * 10);

    // 3. Atualiza no DesafioService (aumenta o progresso do usuário)
    this.desafioService.atualizarProgressoDesafio(atividade.desafioId, atividade.valorMetrica);

    let ganhadores = [atividade.participante];

    if (desafio?.local === 'presencial' && atividade.vencedor && atividade.vencedor !== 'Empate') {
      // Split the winner string by " + ", " e ", ","
      ganhadores = atividade.vencedor.split(/\s*\+\s*|\s+e\s+|\s*,\s*/).filter(nome => nome.trim() !== '');
    } else if (desafio?.local === 'presencial' && atividade.vencedor === 'Empate') {
      ganhadores = [];
    }

    // 4. Atualiza no RankingService para cada ganhador (ou remetente se online)
    ganhadores.forEach(ganhador => {
      this.rankingService.atualizarDistanciaUsuario(
        atividade.desafioId,
        atividade.usuarioId, // This might just map the first user id, but ranking uses nomeParticipante to find/create
        atividade.valorMetrica,
        pontosCalculados,
        ganhador.trim()
      );
    });

    // 5. Atualiza no UsuarioService (saldo total de km e pontos) - para o remetente apenas
    this.usuarioService.adicionarPontosEKm(atividade.valorMetrica, pontosCalculados);

    // Nova posição no ranking do rementente (ou primeiro ganhador)
    const nomeExibicao = ganhadores.length > 0 ? ganhadores.join(' e ') : atividade.participante;
    const novaPosicao = this.rankingService.obterPosicaoUsuario(atividade.desafioId, atividade.usuarioId);

    this.mensagemFeedback = {
      tipo: 'sucesso',
      titulo: 'Atividade aprovada com sucesso!',
      detalhe: desafio?.local === 'presencial' 
        ? `Resultado registrado! ${nomeExibicao} recebeu os pontos da vitória no ranking.`
        : `Autenticidade verificada! ${atividade.participante} alcançou a posição #${novaPosicao} no ranking com +${atividade.valorMetrica} ${unidade}!`
    };

    setTimeout(() => {
      this.mensagemFeedback = null;
    }, 6000);
  }

  iniciarRejeicao(atividade: Atividade): void {
    this.atividadeRejeitando = atividade;
    if (this.exigeCodigoFisico(atividade) && !this.codigoCorresponde(atividade)) {
      this.motivoRejeicao = 'Código não corresponde ou não está visível na evidência';
    } else {
      this.motivoRejeicao = 'A comprovação não está clara';
    }
  }

  selecionarMotivo(motivo: string): void {
    this.motivoRejeicao = motivo;
  }

  cancelarRejeicao(): void {
    this.atividadeRejeitando = null;
  }

  confirmarRejeicao(): void {
    if (!this.atividadeRejeitando) return;

    this.atividadeService.rejeitarAtividade(this.atividadeRejeitando.id, this.motivoRejeicao);

    this.mensagemFeedback = {
      tipo: 'erro',
      titulo: 'Atividade rejeitada',
      detalhe: `A atividade de ${this.atividadeRejeitando.participante} foi rejeitada. Motivo: "${this.motivoRejeicao}".`
    };

    this.atividadeRejeitando = null;

    setTimeout(() => {
      this.mensagemFeedback = null;
    }, 5000);
  }

  verEvidencia(atividade: Atividade): void {
    this.evidenciaSelecionada = atividade.comprovacao || '';
    this.atividadeModalAtual = atividade;
    this.modalEvidenciaAberta = true;
  }

  fecharModalEvidencia(): void {
    this.modalEvidenciaAberta = false;
    this.evidenciaSelecionada = '';
    this.atividadeModalAtual = null;
  }
}
