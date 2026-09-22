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

  atividadeRejeitando: Atividade | null = null;
  motivoRejeicao: string = 'A comprovação não está clara';

  mensagemFeedback: {
    tipo: 'sucesso' | 'erro';
    titulo: string;
    detalhe: string;
  } | null = null;

  modalEvidenciaAberta: boolean = false;
  evidenciaSelecionada: string = '';

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

  aprovar(atividade: Atividade): void {
    // 1. Aprova no AtividadeService
    this.atividadeService.aprovarAtividade(atividade.id);

    // 2. Pontos proporcionais (50 pontos base + 10 por km)
    const pontosCalculados = Math.round(atividade.distancia * 10);

    // 3. Atualiza no DesafioService (aumenta o progresso do usuário)
    this.desafioService.atualizarProgressoDesafio(atividade.desafioId, atividade.distancia);

    // 4. Atualiza no RankingService (sobe de posição no ranking)
    this.rankingService.atualizarDistanciaUsuario(
      atividade.desafioId,
      atividade.usuarioId,
      atividade.distancia,
      pontosCalculados
    );

    // 5. Atualiza no UsuarioService (saldo total de km e pontos)
    this.usuarioService.adicionarPontosEKm(atividade.distancia, pontosCalculados);

    // Nova posição no ranking
    const novaPosicao = this.rankingService.obterPosicaoUsuario(atividade.desafioId, atividade.usuarioId);

    this.mensagemFeedback = {
      tipo: 'sucesso',
      titulo: 'Atividade aprovada com sucesso!',
      detalhe: `Progresso e ranking atualizados! ${atividade.participante} alcançou a posição #${novaPosicao} com +${atividade.distancia} km!`
    };

    setTimeout(() => {
      this.mensagemFeedback = null;
    }, 6000);
  }

  iniciarRejeicao(atividade: Atividade): void {
    this.atividadeRejeitando = atividade;
    this.motivoRejeicao = 'A comprovação não está clara';
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

  verEvidencia(url: string): void {
    this.evidenciaSelecionada = url;
    this.modalEvidenciaAberta = true;
  }

  fecharModalEvidencia(): void {
    this.modalEvidenciaAberta = false;
    this.evidenciaSelecionada = '';
  }
}
