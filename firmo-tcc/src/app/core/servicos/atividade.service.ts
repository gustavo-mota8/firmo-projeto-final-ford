import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Atividade } from '../modelos/atividade.model';

const CHAVE_STORAGE = 'firmo_atividades';

// Mock de comprovação visual moderno representando o participante, o contexto do treino e o código físico em papel na cena
export function gerarComprovacaoMock(codigo: string, distancia: number, tempo: string, participante: string): string {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="100%" height="100%" fill="%230f172a"/><rect x="16" y="16" width="608" height="368" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="56" cy="56" r="22" fill="%232563eb"/><text x="56" y="63" fill="white" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">🏃</text><text x="90" y="52" fill="%23f8fafc" font-size="17" font-family="sans-serif" font-weight="bold">${participante}</text><text x="90" y="70" fill="%2394a3b8" font-size="12" font-family="sans-serif">Registro de Atividade • Evidência com Código Físico</text><rect x="36" y="96" width="568" height="114" rx="12" fill="%230f172a" stroke="%23334155"/><path d="M56 175 Q 130 120, 200 150 T 340 115 T 460 170 T 570 140" fill="none" stroke="%2338bdf8" stroke-width="4" stroke-linecap="round"/><circle cx="56" cy="175" r="6" fill="%2310b981"/><circle cx="570" cy="140" r="7" fill="%23ef4444"/><text x="50" y="118" fill="%2364748b" font-size="11" font-family="sans-serif" font-weight="bold">TELEMETRIA GPS DA ATIVIDADE</text><rect x="36" y="226" width="270" height="138" rx="10" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><rect x="48" y="238" width="16" height="16" rx="3" fill="%23d97706"/><text x="70" y="251" fill="%2392400e" font-size="10.5" font-family="sans-serif" font-weight="bold">CÓDIGO FÍSICO PRESENTE NA CENA</text><text x="171" y="312" fill="%2378350f" font-size="38" font-family="monospace" font-weight="900" text-anchor="middle" letter-spacing="4">${codigo}</text><text x="171" y="344" fill="%23b45309" font-size="11" font-family="sans-serif" text-anchor="middle">Manuscrito em papel durante a foto</text><rect x="322" y="226" width="282" height="138" rx="10" fill="%230f172a" stroke="%23334155"/><text x="342" y="256" fill="%2394a3b8" font-size="12" font-family="sans-serif">DISTÂNCIA TOTAL</text><text x="342" y="286" fill="%2338bdf8" font-size="22" font-family="sans-serif" font-weight="bold">${distancia.toFixed(1)} km</text><text x="475" y="256" fill="%2394a3b8" font-size="12" font-family="sans-serif">TEMPO</text><text x="475" y="286" fill="%2310b981" font-size="22" font-family="sans-serif" font-weight="bold">${tempo}</text><text x="342" y="332" fill="%2364748b" font-size="11.5" font-family="sans-serif">Autenticidade física + telemetria Firmo</text></svg>`;
}

const COMPROVACAO_MOCK_PADRAO = gerarComprovacaoMock('4821', 5.0, '32 min', 'Gustavo Mota');

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
    comprovacao: gerarComprovacaoMock('3109', 8.0, '45 min', 'João Silva'),
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
    comprovacao: gerarComprovacaoMock('9214', 6.2, '38 min', 'Lucas Rocha'),
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
      comprovacao: dados.comprovacao || gerarComprovacaoMock(dados.codigoValidacao, dados.distancia, dados.tempo, dados.participante),
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
