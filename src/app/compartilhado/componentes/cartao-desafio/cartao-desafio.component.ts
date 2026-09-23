import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Desafio } from '../../../core/modelos/desafio.model';
import { BarraProgressoComponent } from '../barra-progresso/barra-progresso.component';

@Component({
  selector: 'app-cartao-desafio',
  standalone: true,
  imports: [CommonModule, RouterModule, BarraProgressoComponent],
  templateUrl: './cartao-desafio.component.html',
  styleUrls: ['./cartao-desafio.component.css']
})
export class CartaoDesafioComponent {
  @Input({ required: true }) desafio!: Desafio;
  @Input() mostrarProgresso: boolean = true;
}
