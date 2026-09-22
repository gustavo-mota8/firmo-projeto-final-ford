import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemRanking } from '../../../core/modelos/ranking.model';

@Component({
  selector: 'app-item-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-ranking.component.html',
  styleUrls: ['./item-ranking.component.css']
})
export class ItemRankingComponent {
  @Input({ required: true }) item!: ItemRanking;
  @Input() unidade: string = 'km';
}
