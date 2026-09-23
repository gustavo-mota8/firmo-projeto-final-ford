import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cartao-estatistica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartao-estatistica.component.html',
  styleUrls: ['./cartao-estatistica.component.css']
})
export class CartaoEstatisticaComponent {
  @Input() titulo: string = '';
  @Input() valor: string | number = '';
  @Input() subtitulo: string = '';
  @Input() tipoDestaque: 'padrao' | 'sucesso' | 'ouro' | 'azul' = 'padrao';
  @Input() icone: string = '';
}
