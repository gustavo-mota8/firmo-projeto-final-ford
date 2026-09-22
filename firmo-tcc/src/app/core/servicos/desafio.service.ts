import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Desafio } from '../modelos/desafio.model';

const CHAVE_STORAGE = 'firmo_desafios';

const DESAFIOS_INICIAIS: Desafio[] = [
  {
    id: 1,
    nome: 'Corrida 50K — Setembro',
    descricao: 'Supere seus limites correndo 50 km ao longo do mês. Suas corridas devem ser registradas via GPS com comprovação em imagem e validadas pelo árbitro oficial.',
    tipo: 'grupo',
    formato: 'caucao',
    entrada: 30,
    pote: 600,
    objetivo: 50,
    unidade: 'km',
    progressoUsuario: 37.5,
    duracao: '30 dias',
    arbitro: 'Carlos Almeida',
    participantesCount: 20,
    premiacao: 'Top 3',
    dataFim: '30/09/2026',
    regras: [
      'Mínimo de 3 km por atividade submetida',
      'Comprovação por print de GPS ou aplicativo de corrida com o código de validação visível',
      'Validação obrigatória pelo árbitro em até 24 horas',
      'Pote distribuído entre o Top 3 ao término do período'
    ],
    inscrito: true
  },
  {
    id: 2,
    nome: 'Pedal 100K — Primavera',
    descricao: 'Pedale 100 km em 15 dias para garantir seu compromisso e concorrer ao pote da temporada de primavera.',
    tipo: 'grupo',
    formato: 'caucao',
    entrada: 50,
    pote: 1250,
    objetivo: 100,
    unidade: 'km',
    progressoUsuario: 62.0,
    duracao: '15 dias',
    arbitro: 'Fernanda Lima',
    participantesCount: 25,
    premiacao: 'Top 3',
    dataFim: '15/10/2026',
    regras: [
      'Ciclismo de rua ou mountain bike',
      'Gravação contínua com distância e tempo verificáveis',
      'Comprovação por foto do ciclocomputador ou app com código'
    ],
    inscrito: true
  },
  {
    id: 3,
    nome: 'Constância 21 Dias — Caminhada Diária',
    descricao: 'Desenvolva o hábito da atividade física diária com caminhadas leves e saudáveis de no mínimo 2 km por dia.',
    tipo: 'individual',
    formato: 'gratuito',
    entrada: 0,
    pote: 0,
    objetivo: 42,
    unidade: 'km',
    progressoUsuario: 0,
    duracao: '21 dias',
    arbitro: 'Carlos Almeida',
    participantesCount: 54,
    premiacao: 'Medalha Digital',
    dataFim: '21/10/2026',
    regras: [
      'Mínimo de 2 km por dia',
      'Submissão diária até às 23:59',
      'Validação direta pelo árbitro'
    ],
    inscrito: false
  },
  {
    id: 4,
    nome: 'Desafio 42K Solo — Caução Individual',
    descricao: 'Seu compromisso com você mesmo. Deposite sua caução e receba-a de volta integralmente se cumprir a meta dentro do prazo.',
    tipo: 'individual',
    formato: 'caucao',
    entrada: 40,
    pote: 40,
    objetivo: 42,
    unidade: 'km',
    progressoUsuario: 0,
    duracao: '10 dias',
    arbitro: 'Mariana Souza',
    participantesCount: 1,
    premiacao: 'Devolução de 100% da Caução',
    dataFim: '10/10/2026',
    regras: [
      'Acumule 42 km no prazo estipulado',
      'Devolução garantida ao atingir a meta comprovada',
      'Sem margem para desistência'
    ],
    inscrito: false
  }
];

@Injectable({
  providedIn: 'root'
})
export class DesafioService {
  private desafiosSubject = new BehaviorSubject<Desafio[]>(this.carregarDoStorage());
  public desafios$: Observable<Desafio[]> = this.desafiosSubject.asObservable();

  constructor() {}

  public obterDesafios(): Desafio[] {
    return this.desafiosSubject.value;
  }

  public obterDesafioPorId(id: number): Desafio | undefined {
    return this.desafiosSubject.value.find(d => d.id === id);
  }

  public criarDesafio(novo: {
    nome: string;
    tipo: 'individual' | 'grupo';
    formato: 'gratuito' | 'caucao';
    entrada: number;
    objetivo: number;
    duracao: string;
    premiacao: string;
    arbitro: string;
    descricao?: string;
  }): Desafio {
    const lista = this.desafiosSubject.value;
    const novoId = lista.length > 0 ? Math.max(...lista.map(d => d.id)) + 1 : 1;
    const participantesIniciais = novo.tipo === 'individual' ? 1 : 8;
    const poteEstimado = novo.formato === 'caucao' ? novo.entrada * participantesIniciais : 0;

    const desafioCriado: Desafio = {
      id: novoId,
      nome: novo.nome,
      descricao: novo.descricao || `Desafio de ${novo.objetivo} km com duração de ${novo.duracao}. Compromisso assumido na Firmo.`,
      tipo: novo.tipo,
      formato: novo.formato,
      entrada: novo.formato === 'caucao' ? novo.entrada : 0,
      pote: poteEstimado,
      objetivo: novo.objetivo,
      unidade: 'km',
      progressoUsuario: 0,
      duracao: novo.duracao,
      arbitro: novo.arbitro,
      participantesCount: participantesIniciais,
      premiacao: novo.premiacao,
      dataFim: '30 dias a partir de hoje',
      regras: [
        `Comprovação por imagem de aplicativo GPS`,
        `Código de validação de 4 dígitos obrigatório`,
        `Arbitragem conduzida por ${novo.arbitro}`
      ],
      inscrito: true
    };

    const listaAtualizada = [desafioCriado, ...lista];
    this.salvar(listaAtualizada);
    return desafioCriado;
  }

  public entrarNoDesafio(id: number): void {
    const lista = this.desafiosSubject.value.map(d => {
      if (d.id === id && !d.inscrito) {
        const novosParticipantes = d.participantesCount + 1;
        const novoPote = d.formato === 'caucao' ? d.pote + d.entrada : 0;
        return {
          ...d,
          inscrito: true,
          participantesCount: novosParticipantes,
          pote: novoPote
        };
      }
      return d;
    });

    this.salvar(lista);
  }

  public atualizarProgressoDesafio(id: number, kmAdicional: number): void {
    const lista = this.desafiosSubject.value.map(d => {
      if (d.id === id) {
        const novoProgresso = Number((d.progressoUsuario + kmAdicional).toFixed(1));
        return {
          ...d,
          progressoUsuario: Math.min(novoProgresso, d.objetivo)
        };
      }
      return d;
    });

    this.salvar(lista);
  }

  private carregarDoStorage(): Desafio[] {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro de storage
    }
    return DESAFIOS_INICIAIS;
  }

  private salvar(desafios: Desafio[]): void {
    this.desafiosSubject.next(desafios);
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(desafios));
    } catch {
      // Ignora erro de gravação
    }
  }
}
