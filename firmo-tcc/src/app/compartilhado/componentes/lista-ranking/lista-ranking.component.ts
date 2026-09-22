import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemRanking } from '../../../core/modelos/ranking.model';
import { ItemRankingComponent } from '../item-ranking/item-ranking.component';

@Component({
  selector: 'app-lista-ranking',
  standalone: true,
  imports: [CommonModule, ItemRankingComponent],
  templateUrl: './lista-ranking.component.html',
  styleUrls: ['./lista-ranking.component.css']
})
export class ListaRankingComponent {
  @Input() itens: ItemRanking[] = [];
  @Input() unidade: string = 'km';
  @Input() titulo: string = 'Ranking do Desafio';
  @Input() limite?: number;

  get itensExibidos(): ItemRanking[] {
    if (this.limite && this.limite > 0) {
      return this.itens.slice(0, this.limite);
    }
    return this.itens;
  }
}
