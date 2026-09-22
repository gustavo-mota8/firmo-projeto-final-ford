import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Atividade } from '../modelos/atividade.model';

const CHAVE_STORAGE = 'firmo_atividades';

// Mock de comprovação visual com SVG moderno simulando app de corrida/GPS
const COMPROVACAO_MOCK_PADRAO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%230f172a"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="80" cy="70" r="28" fill="%232563eb"/><path d="M72 70l6 6 12-12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="124" y="66" fill="%23f8fafc" font-size="20" font-family="sans-serif" font-weight="bold">Treino de Corrida Matinal</text><text x="124" y="88" fill="%2394a3b8" font-size="14" font-family="sans-serif">GPS Track Conectado • Firmo Sync</text><rect x="50" y="125" width="500" height="130" rx="12" fill="%230f172a" stroke="%231e293b"/><path d="M70 210 Q 150 150, 220 180 T 360 140 T 480 200 T 520 170" fill="none" stroke="%2338bdf8" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="210" r="6" fill="%2310b981"/><circle cx="520" cy="170" r="7" fill="%23ef4444"/><text x="50" y="295" fill="%2394a3b8" font-size="13" font-family="sans-serif">DISTÂNCIA</text><text x="50" y="325" fill="%2338bdf8" font-size="24" font-family="sans-serif" font-weight="bold">5.00 km</text><text x="210" y="295" fill="%2394a3b8" font-size="13" font-family="sans-serif">RITMO MÉDIO</text><text x="210" y="325" fill="%23f8fafc" font-size="24" font-family="sans-serif" font-weight="bold">6:24 /km</text><text x="370" y="295" fill="%2394a3b8" font-size="13" font-family="sans-serif">TEMPO TOTAL</text><text x="370" y="325" fill="%2310b981" font-size="24" font-family="sans-serif" font-weight="bold">32m 00s</text><rect x="440" y="45" width="110" height="34" rx="8" fill="%2322c55e" fill-opacity="0.15" stroke="%2322c55e"/><text x="495" y="67" fill="%234ade80" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">CÓD: 4821</text></svg>`;

const ATIVIDADES_INICIAIS: Atividade[] = [
  {
    id: 1,
    desafioId: 1,
    participante: 'Gustavo Mota',
    usuarioId: 1,
    tipo: 'Corrida',
    distancia: 5.0,
    tempo: '32 min',
    comprovacao: COMPROVACAO_MOCK_PADRAO,
    codigoValidacao: '4821',
    status: 'pendente',
    dataEnvio: 'Hoje, às 07:15'
  },
  {
    id: 2,
    desafioId: 1,
    participante: 'João Silva',
    usuarioId: 2,
    tipo: 'Corrida',
    distancia: 8.0,
    tempo: '45 min',
    comprovacao: COMPROVACAO_MOCK_PADRAO,
    codigoValidacao: '3109',
    status: 'aprovada',
    dataEnvio: 'Ontem, às 18:30'
  },
  {
    id: 3,
    desafioId: 1,
    participante: 'Lucas Rocha',
    usuarioId: 3,
    tipo: 'Corrida',
    distancia: 6.2,
    tempo: '38 min',
    comprovacao: COMPROVACAO_MOCK_PADRAO,
    codigoValidacao: '9214',
    status: 'aprovada',
    dataEnvio: 'Ontem, às 06:45'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {
  private atividadesSubject = new BehaviorSubject<Atividade[]>(this.carregarDoStorage());
  public atividades$: Observable<Atividade[]> = this.atividadesSubject.asObservable();

  constructor() {}

  public obterAtividades(): Atividade[] {
    return this.atividadesSubject.value;
  }

  public obterAtividadesPendentes(): Atividade[] {
    return this.atividadesSubject.value.filter(a => a.status === 'pendente');
  }

  public obterAtividadesPorDesafio(desafioId: number): Atividade[] {
    return this.atividadesSubject.value.filter(a => a.desafioId === desafioId);
  }

  public obterAtividadesPorUsuario(usuarioId: number): Atividade[] {
    return this.atividadesSubject.value.filter(a => a.usuarioId === usuarioId);
  }

  public registrarAtividade(dados: {
    desafioId: number;
    participante: string;
    usuarioId: number;
    tipo: string;
    distancia: number;
    tempo: string;
    comprovacao?: string;
    codigoValidacao: string;
  }): Atividade {
    const lista = this.atividadesSubject.value;
    const novoId = lista.length > 0 ? Math.max(...lista.map(a => a.id)) + 1 : 1;

    const novaAtividade: Atividade = {
      id: novoId,
      desafioId: dados.desafioId,
      participante: dados.participante,
      usuarioId: dados.usuarioId,
      tipo: dados.tipo,
      distancia: dados.distancia,
      tempo: dados.tempo,
      comprovacao: dados.comprovacao || COMPROVACAO_MOCK_PADRAO,
      codigoValidacao: dados.codigoValidacao,
      status: 'pendente',
      dataEnvio: 'Hoje, há poucos minutos'
    };

    const listaAtualizada = [novaAtividade, ...lista];
    this.salvar(listaAtualizada);
    return novaAtividade;
  }

  public aprovarAtividade(id: number): Atividade | undefined {
    let atividadeAprovada: Atividade | undefined;

    const lista = this.atividadesSubject.value.map(a => {
      if (a.id === id) {
        atividadeAprovada = { ...a, status: 'aprovada' as const };
        return atividadeAprovada;
      }
      return a;
    });

    if (atividadeAprovada) {
      this.salvar(lista);
    }
    return atividadeAprovada;
  }

  public rejeitarAtividade(id: number, motivo: string): Atividade | undefined {
    let atividadeRejeitada: Atividade | undefined;

    const lista = this.atividadesSubject.value.map(a => {
      if (a.id === id) {
        atividadeRejeitada = {
          ...a,
          status: 'rejeitada' as const,
          motivoRejeicao: motivo
        };
        return atividadeRejeitada;
      }
      return a;
    });

    if (atividadeRejeitada) {
      this.salvar(lista);
    }
    return atividadeRejeitada;
  }

  private carregarDoStorage(): Atividade[] {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro
    }
    return ATIVIDADES_INICIAIS;
  }

  private salvar(atividades: Atividade[]): void {
    this.atividadesSubject.next(atividades);
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(atividades));
    } catch {
      // Ignora erro
    }
  }
}
