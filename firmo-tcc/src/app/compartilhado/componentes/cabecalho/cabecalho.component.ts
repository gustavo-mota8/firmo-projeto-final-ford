import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../../core/servicos/usuario.service';
import { AtividadeService } from '../../../core/servicos/atividade.service';
import { Usuario } from '../../../core/modelos/usuario.model';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit {
  @Output() alternarMenu = new EventEmitter<void>();

  usuario: Usuario | null = null;
  totalPendentes: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private atividadeService: AtividadeService
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(u => {
      this.usuario = u;
    });

    this.atividadeService.atividades$.subscribe(atividades => {
      this.totalPendentes = atividades.filter(a => a.status === 'pendente').length;
    });
  }
}
