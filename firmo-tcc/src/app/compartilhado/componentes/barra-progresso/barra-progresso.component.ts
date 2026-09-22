import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-progresso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barra-progresso.component.html',
  styleUrls: ['./barra-progresso.component.css']
})
export class BarraProgressoComponent {
  @Input() valorAtual: number = 0;
  @Input() valorTotal: number = 100;
  @Input() unidade: string = 'km';
  @Input() mostrarRotulo: boolean = true;
  @Input() mostrarPorcentagem: boolean = true;

  get porcentagem(): number {
    if (!this.valorTotal || this.valorTotal <= 0) return 0;
    const calculo = (this.valorAtual / this.valorTotal) * 100;
    return Math.min(Math.max(Math.round(calculo), 0), 100);
  }
}
