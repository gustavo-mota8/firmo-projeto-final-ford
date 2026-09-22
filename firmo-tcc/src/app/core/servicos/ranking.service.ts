import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemRanking } from '../modelos/ranking.model';

const CHAVE_STORAGE = 'firmo_rankings';

interface TabelaRanking {
  [desafioId: number]: ItemRanking[];
}

const RANKINGS_INICIAIS: TabelaRanking = {
  1: [
    {
      posicao: 1,
      usuarioId: 2,
      nome: 'João Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      distancia: 45.0,
      pontos: 380,
      ehUsuarioAtual: false
    },
    {
      posicao: 2,
      usuarioId: 3,
      nome: 'Lucas Rocha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      distancia: 42.0,
      pontos: 350,
      ehUsuarioAtual: false
    },
    {
      posicao: 3,
      usuarioId: 4,
      nome: 'Maria Costa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      distancia: 40.0,
      pontos: 330,
      ehUsuarioAtual: false
    },
    {
      posicao: 4,
      usuarioId: 1,
      nome: 'Gustavo Mota',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      distancia: 37.5,
      pontos: 320,
      ehUsuarioAtual: true
    },
    {
      posicao: 5,
      usuarioId: 5,
      nome: 'Pedro Lima',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      distancia: 32.0,
      pontos: 290,
      ehUsuarioAtual: false
    }
  ],
  2: [
    {
      posicao: 1,
      usuarioId: 6,
      nome: 'Rodrigo Faro',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      distancia: 85.0,
      pontos: 520,
      ehUsuarioAtual: false
    },
    {
      posicao: 2,
      usuarioId: 1,
      nome: 'Gustavo Mota',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      distancia: 62.0,
      pontos: 410,
      ehUsuarioAtual: true
    },
    {
      posicao: 3,
      usuarioId: 7,
      nome: 'Camila Nogueira',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      distancia: 58.0,
      pontos: 390,
      ehUsuarioAtual: false
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private rankingsSubject = new BehaviorSubject<TabelaRanking>(this.carregarDoStorage());
  public rankings$: Observable<TabelaRanking> = this.rankingsSubject.asObservable();

  constructor() {}

  public obterRankingPorDesafio(desafioId: number): ItemRanking[] {
    const rankings = this.rankingsSubject.value;
    return rankings[desafioId] || [];
  }

  public obterPosicaoUsuario(desafioId: number, usuarioId: number): number {
    const lista = this.obterRankingPorDesafio(desafioId);
    const item = lista.find(i => i.usuarioId === usuarioId);
    return item ? item.posicao : 0;
  }

  public atualizarDistanciaUsuario(
    desafioId: number,
    usuarioId: number,
    kmAdicional: number,
    pontosAdicionais: number
  ): void {
    const rankings = { ...this.rankingsSubject.value };
    const lista = rankings[desafioId] ? [...rankings[desafioId]] : [];

    const index = lista.findIndex(i => i.usuarioId === usuarioId);
    if (index >= 0) {
      const atual = lista[index];
      lista[index] = {
        ...atual,
        distancia: Number((atual.distancia + kmAdicional).toFixed(1)),
        pontos: atual.pontos + pontosAdicionais
      };
    } else {
      lista.push({
        posicao: lista.length + 1,
        usuarioId,
        nome: 'Gustavo Mota',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        distancia: kmAdicional,
        pontos: pontosAdicionais,
        ehUsuarioAtual: true
      });
    }

    // Reordena por distância decrescente e recalcula posições
    lista.sort((a, b) => b.distancia - a.distancia);
    const listaReordenada = lista.map((item, idx) => ({
      ...item,
      posicao: idx + 1
    }));

    rankings[desafioId] = listaReordenada;
    this.salvar(rankings);
  }

  private carregarDoStorage(): TabelaRanking {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro
    }
    return RANKINGS_INICIAIS;
  }

  private salvar(rankings: TabelaRanking): void {
    this.rankingsSubject.next(rankings);
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(rankings));
    } catch {
      // Ignora erro
    }
  }
}
