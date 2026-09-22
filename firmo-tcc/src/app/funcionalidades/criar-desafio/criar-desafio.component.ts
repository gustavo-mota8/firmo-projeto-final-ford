import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesafioService } from '../../core/servicos/desafio.service';
import { Desafio } from '../../core/modelos/desafio.model';
import { CartaoDesafioComponent } from '../../compartilhado/componentes/cartao-desafio/cartao-desafio.component';

@Component({
  selector: 'app-criar-desafio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CartaoDesafioComponent],
  templateUrl: './criar-desafio.component.html',
  styleUrls: ['./criar-desafio.component.css']
})
export class CriarDesafioComponent {
  nome: string = 'Corrida 50K — Setembro';
  tipo: 'individual' | 'grupo' = 'grupo';
  formato: 'gratuito' | 'caucao' = 'caucao';
  entrada: number = 30;
  objetivo: number = 50;
  duracao: string = '30 dias';
  premiacao: string = 'Top 3';
  arbitro: string = 'Carlos Almeida';
  descricao: string = 'Complete 50 km com comprovação via GPS e validação oficial por árbitro.';

  arbitrosDisponiveis: string[] = [
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
      unidade: 'km',
      progressoUsuario: 0,
      duracao: this.duracao,
      arbitro: this.arbitro,
      participantesCount: this.tipo === 'grupo' ? 20 : 1,
      premiacao: this.premiacao,
      dataFim: 'Em 30 dias',
      regras: [
        'Comprovação por imagem de app de corrida',
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

    this.criando = true;

    const novoDesafio = this.desafioService.criarDesafio({
      nome: this.nome,
      tipo: this.tipo,
      formato: this.formato,
      entrada: this.formato === 'caucao' ? this.entrada : 0,
      objetivo: this.objetivo,
      duracao: this.duracao,
      premiacao: this.premiacao,
      arbitro: this.arbitro,
      descricao: this.descricao
    });

    this.mensagemSucesso = 'Desafio criado com sucesso! Redirecionando...';

    setTimeout(() => {
      this.router.navigate(['/desafios', novoDesafio.id]);
    }, 900);
  }
}
