import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/servicos/usuario.service';
import { AtividadeService } from '../../core/servicos/atividade.service';
import { DesafioService } from '../../core/servicos/desafio.service';
import { Usuario } from '../../core/modelos/usuario.model';
import { Atividade } from '../../core/modelos/atividade.model';
import { Desafio } from '../../core/modelos/desafio.model';
import { CartaoEstatisticaComponent } from '../../compartilhado/componentes/cartao-estatistica/cartao-estatistica.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, CartaoEstatisticaComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  minhasAtividades: Atividade[] = [];
  meusDesafios: Desafio[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private atividadeService: AtividadeService,
    private desafioService: DesafioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(u => {
      this.usuario = u;
      if (u) {
        this.minhasAtividades = this.atividadeService.obterAtividadesPorUsuario(u.id);
      }
    });

    this.desafioService.desafios$.subscribe(desafios => {
      this.meusDesafios = desafios.filter(d => d.inscrito);
    });

    this.atividadeService.atividades$.subscribe(() => {
      if (this.usuario) {
        this.minhasAtividades = this.atividadeService.obterAtividadesPorUsuario(this.usuario.id);
      }
    });
  }

  reiniciarDadosMock(): void {
    if (confirm('Deseja reiniciar todos os dados simulados para a demonstração original?')) {
      localStorage.clear();
      window.location.reload();
    }
  }
}
