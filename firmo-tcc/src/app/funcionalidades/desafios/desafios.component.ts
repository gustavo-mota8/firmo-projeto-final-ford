import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesafioService } from '../../core/servicos/desafio.service';
import { Desafio } from '../../core/modelos/desafio.model';
import { CartaoDesafioComponent } from '../../compartilhado/componentes/cartao-desafio/cartao-desafio.component';

type FiltroTipo = 'todos' | 'individual' | 'grupo' | 'gratuito' | 'caucao';

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CartaoDesafioComponent],
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.css']
})
export class DesafiosComponent implements OnInit {
  desafios: Desafio[] = [];
  filtroAtual: FiltroTipo = 'todos';
  termoBusca: string = '';

  constructor(private desafioService: DesafioService) {}

  ngOnInit(): void {
    this.desafioService.desafios$.subscribe(desafios => {
      this.desafios = desafios;
    });
  }

  definirFiltro(filtro: FiltroTipo): void {
    this.filtroAtual = filtro;
  }

  get desafiosFiltrados(): Desafio[] {
    return this.desafios.filter(desafio => {
      // Filtro por termo de busca
      const termo = this.termoBusca.toLowerCase().trim();
      const bateBusca = !termo ||
        desafio.nome.toLowerCase().includes(termo) ||
        desafio.descricao.toLowerCase().includes(termo) ||
        desafio.arbitro.toLowerCase().includes(termo);

      if (!bateBusca) return false;

      // Filtro por categoria
      switch (this.filtroAtual) {
        case 'individual':
          return desafio.tipo === 'individual';
        case 'grupo':
          return desafio.tipo === 'grupo';
        case 'gratuito':
          return desafio.formato === 'gratuito';
        case 'caucao':
          return desafio.formato === 'caucao';
        case 'todos':
        default:
          return true;
      }
    });
  }
}
