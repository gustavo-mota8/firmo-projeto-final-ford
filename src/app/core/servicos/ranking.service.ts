import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemRanking } from '../modelos/ranking.model';

const CHAVE_STORAGE = 'firmo_rankings';
const VERSAO_DADOS = 'v5'; // Incrementar ao alterar RANKINGS_INICIAIS para invalidar cache
const CHAVE_VERSAO = 'firmo_rankings_versao';

interface TabelaRanking {
  [desafioId: number]: ItemRanking[];
}

const BASE_RANKINGS: TabelaRanking = {
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

const TARGET_COUNTS: { [id: number]: number } = {
  1: 20,
  2: 25,
  3: 20,
  4: 1,
  5: 12,
  6: 54
};

const TARGET_METRICS: { [id: number]: number } = {
  1: 50,
  2: 100,
  3: 21,
  4: 600,
  5: 12,
  6: 42
};

const NOMES_FICTICIOS = [
  'Carlos Eduardo', 'Ana Beatriz', 'Felipe Santos', 'Mariana Costa', 'Rafael Silva',
  'Juliana Alves', 'Thiago Moreira', 'Letícia Lima', 'Bruno Fernandes', 'Camila Rocha',
  'Rodrigo Mendes', 'Amanda Ribeiro', 'Lucas Oliveira', 'Beatriz Gomes', 'Mateus Martins',
  'Fernanda Souza', 'Gabriel Almeida', 'Larissa Ferreira', 'Pedro Carvalho', 'Vitória Dias',
  'Diego Cardoso', 'Carolina Castro', 'Leonardo Barbosa', 'Isabella Melo', 'Marcelo Pinto',
  'Sophia Cavalcanti', 'Henrique Azevedo', 'Laura Farias', 'Eduardo Correia', 'Alice Teixeira',
  'Vinícius Pires', 'Manuela Nogueira', 'Tiago Machado', 'Giovanna Freitas', 'Caio Moura',
  'Valentina Ramos', 'Arthur Monteiro', 'Helena Batista', 'Victor Guedes', 'Lorena Viana',
  'André Borges', 'Clara Vieira', 'Daniel Moraes', 'Júlia Duarte', 'Renato Peixoto'
];

const RANKINGS_INICIAIS: TabelaRanking = (() => {
  const tabela: TabelaRanking = { ...BASE_RANKINGS };
  let nextId = 1000;
  
  for (const desafioId of Object.keys(TARGET_COUNTS)) {
    const id = Number(desafioId);
    const target = TARGET_COUNTS[id];
    const lista = tabela[id] ? [...tabela[id]] : [];
    const maxMetrica = TARGET_METRICS[id] || 50;
    
    // Nomes diferentes para cada desafio (embaralha a lista e pega sequencial)
    let nomesDisponiveis = [...NOMES_FICTICIOS].sort(() => Math.random() - 0.5);
    
    while (lista.length < target) {
      let nomeEscolhido = nomesDisponiveis.pop();
      if (!nomeEscolhido) {
        nomesDisponiveis = [...NOMES_FICTICIOS].sort(() => Math.random() - 0.5);
        nomeEscolhido = nomesDisponiveis.pop() || `Atleta ${nextId}`;
      }

      lista.push({
        posicao: 0,
        usuarioId: nextId,
        nome: nomeEscolhido,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeEscolhido)}&background=random`,
        distancia: Number((Math.random() * maxMetrica).toFixed(1)),
        pontos: Math.floor(Math.random() * 800),
        ehUsuarioAtual: false
      });
      nextId++;
    }
    
    lista.sort((a, b) => b.distancia - a.distancia);
    lista.forEach((item, idx) => item.posicao = idx + 1);
    tabela[id] = lista;
  }
  
  return tabela;
})();

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private rankingsSubject = new BehaviorSubject<TabelaRanking>(this.carregarDoStorage());
  public rankings$: Observable<TabelaRanking> = this.rankingsSubject.asObservable();

  constructor() { }

  public obterTodosRankings(): TabelaRanking {
    return this.rankingsSubject.value;
  }

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
    pontosAdicionais: number,
    nomeParticipante: string = 'Gustavo Mota'
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
        nome: nomeParticipante,
        avatar: usuarioId === 1 ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nomeParticipante),
        distancia: kmAdicional,
        pontos: pontosAdicionais,
        ehUsuarioAtual: usuarioId === 1
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

  public adicionarUsuarioAoRanking(desafioId: number, usuario: { id: number, nome: string, avatar: string }): void {
    const rankings = { ...this.rankingsSubject.value };
    const lista = rankings[desafioId] ? [...rankings[desafioId]] : [];

    if (!lista.find(i => i.usuarioId === usuario.id)) {
      lista.push({
        posicao: lista.length + 1,
        usuarioId: usuario.id,
        nome: usuario.nome,
        avatar: usuario.avatar,
        distancia: 0,
        pontos: 0,
        ehUsuarioAtual: true
      });
      rankings[desafioId] = lista;
      this.salvar(rankings);
    }
  }

  private carregarDoStorage(): TabelaRanking {
    try {
      const versaoSalva = localStorage.getItem(CHAVE_VERSAO);
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      // Se a versão dos dados mudou, descarta o cache e usa os dados iniciais atualizados
      if (versaoSalva !== VERSAO_DADOS) {
        localStorage.removeItem(CHAVE_STORAGE);
        localStorage.setItem(CHAVE_VERSAO, VERSAO_DADOS);
        return RANKINGS_INICIAIS;
      }
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
