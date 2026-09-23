import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesafioService } from '../../core/servicos/desafio.service';
import { Desafio, CategoriaMetrica } from '../../core/modelos/desafio.model';
import { CartaoDesafioComponent } from '../../compartilhado/componentes/cartao-desafio/cartao-desafio.component';

interface OpcaoModalidade {
  nome: string;
  emoji: string;
  categoriaMetrica: CategoriaMetrica;
  unidade: string;
}

@Component({
  selector: 'app-criar-desafio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CartaoDesafioComponent],
  templateUrl: './criar-desafio.component.html',
  styleUrls: ['./criar-desafio.component.css']
})
export class CriarDesafioComponent {
  nome: string = 'Novo Desafio Firmo';
  tipo: 'individual' | 'grupo' = 'grupo';
  formato: 'gratuito' | 'caucao' = 'caucao';
  entrada: number = 30;
  objetivo: number = 50;
  local: 'presencial' | 'online' = 'online';
  dataInicio: string = '';
  dataFim: string = '';
  premiacao: string = 'Top 3';
  arbitro: string = 'Carlos Almeida';
  descricao: string = '';

  modalidadeSelecionada: string = 'Corrida';

  readonly modalidades: OpcaoModalidade[] = [
    { nome: 'Corrida',      emoji: '🏃', categoriaMetrica: 'distancia',    unidade: 'km' },
    { nome: 'Ciclismo',     emoji: '🚴', categoriaMetrica: 'distancia',    unidade: 'km' },
    { nome: 'Natação',      emoji: '🏊', categoriaMetrica: 'distancia',    unidade: 'km' },
    { nome: 'Futebol',      emoji: '⚽', categoriaMetrica: 'sessoes',      unidade: 'partidas' },
    { nome: 'Futevôlei',    emoji: '🏐', categoriaMetrica: 'sessoes',      unidade: 'partidas' },
    { nome: 'Vôlei',        emoji: '🏐', categoriaMetrica: 'sessoes',      unidade: 'jogos' },
    { nome: 'Basquete',     emoji: '🏀', categoriaMetrica: 'sessoes',      unidade: 'jogos' },
    { nome: 'Academia',     emoji: '🏋️', categoriaMetrica: 'duracao',      unidade: 'min' },
    { nome: 'Outro',        emoji: '🏅', categoriaMetrica: 'personalizado', unidade: '' }
  ];

  unidadePersonalizada: string = '';

  arbitrosDisponiveis: string[] = [
    'Eu mesmo',
    'Carlos Almeida',
    'Fernanda Lima',
    'Mariana Souza',
    'Ricardo Mendes'
  ];

  criando: boolean = false;
  mensagemSucesso: string = '';

  constructor(
    private desafioService: DesafioService,
    private router: Router
  ) {}

  get modalidadeAtual(): OpcaoModalidade {
    return this.modalidades.find(m => m.nome === this.modalidadeSelecionada)
      || this.modalidades[0];
  }

  get categoriaMetricaAtual(): CategoriaMetrica {
    return this.modalidadeAtual.categoriaMetrica;
  }

  get unidadeAtual(): string {
    if (this.categoriaMetricaAtual === 'personalizado') {
      return this.unidadePersonalizada || 'unidades';
    }
    return this.modalidadeAtual.unidade;
  }

  get labelObjetivo(): string {
    const cat = this.categoriaMetricaAtual;
    if (cat === 'distancia')    return `Meta de Distância (${this.unidadeAtual})`;
    if (cat === 'duracao')      return `Meta de Duração (${this.unidadeAtual})`;
    if (cat === 'sessoes')      return `Número de ${this.unidadeAtual.charAt(0).toUpperCase() + this.unidadeAtual.slice(1)}`;
    return `Objetivo (${this.unidadeAtual})`;
  }

  get placeholderObjetivo(): string {
    const cat = this.categoriaMetricaAtual;
    if (cat === 'distancia')  return 'Ex: 50';
    if (cat === 'duracao')    return 'Ex: 600 (10 sessões de 60 min)';
    if (cat === 'sessoes')    return 'Ex: 21';
    return 'Ex: 10';
  }

  get poteEstimado(): number {
    if (this.formato === 'gratuito') return 0;
    const participantesEstimados = this.tipo === 'grupo' ? 20 : 1;
    return this.entrada * participantesEstimados;
  }

  get previaDesafio(): Desafio {
    return {
      id: 999,
      nome: this.nome || 'Novo Desafio Firmo',
      descricao: this.descricao || 'Desafio criado na Firmo para transformar intenção em compromisso.',
      tipo: this.tipo,
      formato: this.formato,
      entrada: this.formato === 'caucao' ? this.entrada : 0,
      pote: this.poteEstimado,
      objetivo: this.objetivo || 10,
      unidade: this.unidadeAtual,
      modalidade: this.modalidadeSelecionada,
      categoriaMetrica: this.categoriaMetricaAtual,
      local: this.local,
      progressoUsuario: 0,
      dataInicio: this.dataInicio || '24/09/2026',
      arbitro: this.arbitro,
      participantesCount: this.tipo === 'grupo' ? 20 : 1,
      premiacao: this.premiacao,
      dataFim: this.dataFim || 'Em breve',
      regras: [
        'Comprovação por foto com código físico na cena',
        'Código de validação anti-fraude',
        'Validação em até 24h'
      ],
      inscrito: true
    };
  }

  salvarDesafio(): void {
    if (!this.nome || this.objetivo <= 0) {
      alert('Por favor, preencha o nome e o objetivo do desafio.');
      return;
    }

    if (this.categoriaMetricaAtual === 'personalizado' && !this.unidadePersonalizada.trim()) {
      alert('Por favor, informe a unidade personalizada do desafio.');
      return;
    }

    this.criando = true;

    const novoDesafio = this.desafioService.criarDesafio({
      nome: this.nome,
      tipo: this.tipo,
      formato: this.formato,
      entrada: this.formato === 'caucao' ? this.entrada : 0,
      objetivo: this.objetivo,
      local: this.local,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      premiacao: this.premiacao,
      arbitro: this.arbitro,
      descricao: this.descricao,
      modalidade: this.modalidadeSelecionada,
      categoriaMetrica: this.categoriaMetricaAtual,
      unidade: this.unidadeAtual
    });

    this.mensagemSucesso = 'Desafio criado com sucesso! Redirecionando...';

    setTimeout(() => {
      this.router.navigate(['/desafios', novoDesafio.id]);
    }, 900);
  }
}
