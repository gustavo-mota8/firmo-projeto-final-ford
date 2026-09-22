import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/servicos/usuario.service';
import { DesafioService } from '../../core/servicos/desafio.service';
import { RankingService } from '../../core/servicos/ranking.service';
import { Usuario } from '../../core/modelos/usuario.model';
import { Desafio } from '../../core/modelos/desafio.model';
import { ItemRanking } from '../../core/modelos/ranking.model';
import { CartaoEstatisticaComponent } from '../../compartilhado/componentes/cartao-estatistica/cartao-estatistica.component';
import { BarraProgressoComponent } from '../../compartilhado/componentes/barra-progresso/barra-progresso.component';
import { ListaRankingComponent } from '../../compartilhado/componentes/lista-ranking/lista-ranking.component';
import { CartaoDesafioComponent } from '../../compartilhado/componentes/cartao-desafio/cartao-desafio.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CartaoEstatisticaComponent,
    BarraProgressoComponent,
    ListaRankingComponent,
    CartaoDesafioComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  usuario: Usuario | null = null;
  desafioAtual: Desafio | null = null;
  outrosDesafios: Desafio[] = [];
  rankingDesafioAtual: ItemRanking[] = [];
  posicaoUsuario: number = 4;

  constructor(
    private usuarioService: UsuarioService,
    private desafioService: DesafioService,
    private rankingService: RankingService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.usuarioService.usuario$.subscribe(u => {
      this.usuario = u;
    });

    this.desafioService.desafios$.subscribe(desafios => {
      // O desafio atual em destaque é o primeiro inscrito (Corrida 50K)
      this.desafioAtual = desafios.find(d => d.inscrito) || desafios[0] || null;
      this.outrosDesafios = desafios.filter(d => d.id !== this.desafioAtual?.id);

      if (this.desafioAtual && this.usuario) {
        this.carregarRanking(this.desafioAtual.id, this.usuario.id);
      }
    });

    this.rankingService.rankings$.subscribe(() => {
      if (this.desafioAtual && this.usuario) {
        this.carregarRanking(this.desafioAtual.id, this.usuario.id);
      }
    });
  }

  carregarRanking(desafioId: number, usuarioId: number): void {
    this.rankingDesafioAtual = this.rankingService.obterRankingPorDesafio(desafioId);
    this.posicaoUsuario = this.rankingService.obterPosicaoUsuario(desafioId, usuarioId);
  }
}
