import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DesafioService } from '../../core/servicos/desafio.service';
import { RankingService } from '../../core/servicos/ranking.service';
import { AtividadeService } from '../../core/servicos/atividade.service';
import { UsuarioService } from '../../core/servicos/usuario.service';
import { Desafio } from '../../core/modelos/desafio.model';
import { ItemRanking } from '../../core/modelos/ranking.model';
import { Atividade } from '../../core/modelos/atividade.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { BarraProgressoComponent } from '../../compartilhado/componentes/barra-progresso/barra-progresso.component';
import { ListaRankingComponent } from '../../compartilhado/componentes/lista-ranking/lista-ranking.component';
import { CartaoEstatisticaComponent } from '../../compartilhado/componentes/cartao-estatistica/cartao-estatistica.component';

@Component({
  selector: 'app-detalhe-desafio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BarraProgressoComponent,
    ListaRankingComponent,
    CartaoEstatisticaComponent
  ],
  templateUrl: './detalhe-desafio.component.html',
  styleUrls: ['./detalhe-desafio.component.css']
})
export class DetalheDesafioComponent implements OnInit {
  desafio: Desafio | undefined;
  ranking: ItemRanking[] = [];
  atividadesDoDesafio: Atividade[] = [];
  usuario: Usuario | null = null;
  posicaoUsuario: number = 0;
  abaSelecionada: 'ranking' | 'regras' | 'atividades' = 'ranking';

  constructor(
    private route: ActivatedRoute,
    private desafioService: DesafioService,
    private rankingService: RankingService,
    private atividadeService: AtividadeService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(u => {
      this.usuario = u;
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? parseInt(idParam, 10) : 1;
      this.carregarDesafio(id);
    });
  }

  carregarDesafio(id: number): void {
    this.desafioService.desafios$.subscribe(() => {
      this.desafio = this.desafioService.obterDesafioPorId(id);
      this.atualizarRankingEAtividades(id);
    });

    this.rankingService.rankings$.subscribe(() => {
      this.atualizarRankingEAtividades(id);
    });

    this.atividadeService.atividades$.subscribe(() => {
      this.atividadesDoDesafio = this.atividadeService.obterAtividadesPorDesafio(id);
    });
  }

  atualizarRankingEAtividades(desafioId: number): void {
    this.ranking = this.rankingService.obterRankingPorDesafio(desafioId);
    if (this.usuario) {
      this.posicaoUsuario = this.rankingService.obterPosicaoUsuario(desafioId, this.usuario.id);
    }
  }

  entrarNoDesafio(): void {
    if (!this.desafio) return;
    this.desafioService.entrarNoDesafio(this.desafio.id);
    if (this.usuario) {
      this.rankingService.adicionarUsuarioAoRanking(this.desafio.id, this.usuario);
    }
  }

  selecionarAba(aba: 'ranking' | 'regras' | 'atividades'): void {
    this.abaSelecionada = aba;
  }
}
