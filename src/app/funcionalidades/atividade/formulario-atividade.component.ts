import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesafioService } from '../../core/servicos/desafio.service';
import { AtividadeService } from '../../core/servicos/atividade.service';
import { UsuarioService } from '../../core/servicos/usuario.service';
import { Desafio, CategoriaMetrica } from '../../core/modelos/desafio.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { Atividade } from '../../core/modelos/atividade.model';

@Component({
  selector: 'app-formulario-atividade',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './formulario-atividade.component.html',
  styleUrls: ['./formulario-atividade.component.css']
})
export class FormularioAtividadeComponent implements OnInit {
  desafioId: number = 1;
  desafio: Desafio | undefined;
  usuario: Usuario | null = null;

  tipoAtividade: string = '';
  /** Valor genérico da métrica (km, min, sessões ou personalizado) */
  valorMetrica: number = 0;
  tempo: string = '';
  codigoValidacao: string = '';
  imagemComprovacao: string = '';
  nomeArquivoComprovacao: string = 'comprovacao_firmo.png';

  enviando: boolean = false;
  atividadeEnviada: Atividade | null = null;

  // Campos de confronto presencial
  equipe1: string = '';
  equipe2: string = '';
  placar1: number | null = null;
  placar2: number | null = null;
  vencedor: string = '';
  dataConfronto: string = new Date().toISOString().split('T')[0]; // Hoje por padrão
  observacao: string = '';

  constructor(
    private route: ActivatedRoute,
    private desafioService: DesafioService,
    private atividadeService: AtividadeService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(u => {
      this.usuario = u;
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.desafioId = idParam ? parseInt(idParam, 10) : 1;
      this.desafio = this.desafioService.obterDesafioPorId(this.desafioId);

      // Pré-preenche o tipo de atividade com a modalidade do desafio
      if (this.desafio) {
        this.tipoAtividade = this.desafio.modalidade;
        this.valorMetrica = this.valorMetricaPadrao;
        this.tempo = this.tempoPadrao;
      }

      // Gera automaticamente o código único de 4 dígitos
      this.gerarCodigoComprovacao();
    });
  }

  // ── Getters derivados do desafio ────────────────────────────────

  get categoriaMetrica(): CategoriaMetrica {
    return this.desafio?.categoriaMetrica || 'distancia';
  }

  get unidade(): string {
    return this.desafio?.unidade || 'km';
  }

  /** Exibe campo de distância apenas para desafios de distância */
  get exibirCampoDistancia(): boolean {
    return this.categoriaMetrica === 'distancia';
  }

  /** Exibe campo de duração para desafios de academia/yoga e similares */
  get exibirCampoDuracao(): boolean {
    return this.categoriaMetrica === 'duracao';
  }

  /** Exibe campo de sessões para esportes coletivos */
  get exibirCampoSessoes(): boolean {
    return this.categoriaMetrica === 'sessoes';
  }

  /** Exibe campo genérico para desafios personalizados */
  get exibirCampoPersonalizado(): boolean {
    return this.categoriaMetrica === 'personalizado';
  }

  get labelCampoMetrica(): string {
    if (this.exibirCampoDistancia)    return `Distância (${this.unidade})`;
    if (this.exibirCampoDuracao)      return `Duração (${this.unidade})`;
    if (this.exibirCampoSessoes)      return `Nº de ${this.unidade.charAt(0).toUpperCase() + this.unidade.slice(1)}`;
    return `Resultado (${this.unidade})`;
  }

  get placeholderCampoMetrica(): string {
    if (this.exibirCampoDistancia)  return 'Ex: 5.0';
    if (this.exibirCampoDuracao)    return 'Ex: 60';
    if (this.exibirCampoSessoes)    return 'Ex: 1';
    return 'Ex: 1';
  }

  get valorMetricaPadrao(): number {
    if (this.exibirCampoDistancia)  return 5.0;
    if (this.exibirCampoDuracao)    return 60;
    if (this.exibirCampoSessoes)    return 1;
    return 1;
  }

  get tempoPadrao(): string {
    return this.exibirCampoDuracao ? `${this.valorMetricaPadrao} min` : '60 min';
  }

  get ehDesafioCaucao(): boolean {
    return this.desafio?.formato === 'caucao';
  }

  // ── Ações ────────────────────────────────────────────────────────

  gerarCodigoComprovacao(): void {
    this.codigoValidacao = Math.floor(1000 + Math.random() * 9000).toString();
  }

  aoSelecionarArquivo(evento: Event): void {
    const elementoInput = evento.target as HTMLInputElement;
    if (elementoInput.files && elementoInput.files[0]) {
      const arquivo = elementoInput.files[0];
      this.nomeArquivoComprovacao = arquivo.name;

      const leitor = new FileReader();
      leitor.onload = () => {
        this.imagemComprovacao = leitor.result as string;
      };
      leitor.readAsDataURL(arquivo);
    }
  }

  submeterAtividade(): void {
    const isPresencial = this.desafio?.local === 'presencial';

    if (isPresencial) {
      if (!this.equipe1 || !this.equipe2 || !this.vencedor || !this.dataConfronto) {
        alert('Preencha as equipes, o vencedor e a data do confronto.');
        return;
      }
      this.valorMetrica = 1; // 1 unidade de confronto
    } else {
      if (!this.valorMetrica || this.valorMetrica <= 0) {
        alert(`Por favor, informe um valor válido para: ${this.labelCampoMetrica}.`);
        return;
      }
      if (!this.codigoValidacao) {
        this.gerarCodigoComprovacao();
      }
    }

    // Sincroniza o campo "tempo" para durações diretas
    if (this.exibirCampoDuracao && this.valorMetrica > 0) {
      this.tempo = `${this.valorMetrica} ${this.unidade}`;
    }

    this.enviando = true;

    const novaAtividade = this.atividadeService.registrarAtividade({
      desafioId: this.desafioId,
      participante: this.usuario?.nome || 'Gustavo Mota',
      usuarioId: this.usuario?.id || 1,
      tipo: this.tipoAtividade,
      valorMetrica: Number(this.valorMetrica),
      unidade: this.unidade,
      tempo: this.tempo,
      comprovacao: isPresencial ? undefined : (this.imagemComprovacao || undefined),
      codigoValidacao: isPresencial ? undefined : this.codigoValidacao,
      equipe1: isPresencial ? this.equipe1 : undefined,
      equipe2: isPresencial ? this.equipe2 : undefined,
      placar1: isPresencial ? (this.placar1 || 0) : undefined,
      placar2: isPresencial ? (this.placar2 || 0) : undefined,
      vencedor: isPresencial ? this.vencedor : undefined,
      dataConfronto: isPresencial ? this.dataConfronto : undefined,
      observacao: isPresencial ? this.observacao : undefined
    });

    this.enviando = false;
    this.atividadeEnviada = novaAtividade;
  }
}
