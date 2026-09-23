import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Desafio, CategoriaMetrica } from '../modelos/desafio.model';

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
    modalidade: 'Corrida',
    categoriaMetrica: 'distancia',
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
    modalidade: 'Ciclismo',
    categoriaMetrica: 'distancia',
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
    nome: 'Liga Futevôlei — 21 Partidas',
    descricao: 'Reúna sua turma e dispute 21 partidas de futevôlei em 30 dias. Cada partida deve ser registrada com comprovação e validada pelo árbitro oficial da liga.',
    tipo: 'grupo',
    formato: 'caucao',
    entrada: 20,
    pote: 400,
    objetivo: 21,
    unidade: 'partidas',
    modalidade: 'Futevôlei',
    categoriaMetrica: 'sessoes',
    progressoUsuario: 0,
    duracao: '30 dias',
    arbitro: 'Carlos Almeida',
    participantesCount: 20,
    premiacao: 'Top 3',
    dataFim: '21/10/2026',
    regras: [
      'Cada partida contabiliza 1 ponto de progresso',
      'Comprovação por foto da quadra com todos os participantes',
      'Código físico deve estar visível na foto',
      'Validação obrigatória pelo árbitro em até 24h'
    ],
    inscrito: false
  },
  {
    id: 4,
    nome: 'Academia em Dia — 600 min',
    descricao: 'Comprometa-se com 600 minutos de treino na academia em 30 dias. Registre cada sessão, comprove sua presença e ganhe sua caução de volta ao bater a meta.',
    tipo: 'individual',
    formato: 'caucao',
    entrada: 40,
    pote: 40,
    objetivo: 600,
    unidade: 'min',
    modalidade: 'Academia',
    categoriaMetrica: 'duracao',
    progressoUsuario: 0,
    duracao: '30 dias',
    arbitro: 'Mariana Souza',
    participantesCount: 1,
    premiacao: 'Devolução de 100% da Caução',
    dataFim: '30/10/2026',
    regras: [
      'Mínimo de 30 min por sessão registrada',
      'Comprovação por foto na academia com código físico visível',
      'Cada sessão deve ser submetida no mesmo dia',
      'Devolução garantida ao atingir 600 min comprovados'
    ],
    inscrito: false
  },
  {
    id: 5,
    nome: 'Vôlei toda semana — 12 Jogos',
    descricao: 'Comprometa-se a jogar vôlei ao menos 3 vezes por semana durante 30 dias. Acumule 12 jogos registrados e valide seu comprometimento.',
    tipo: 'grupo',
    formato: 'gratuito',
    entrada: 0,
    pote: 0,
    objetivo: 12,
    unidade: 'jogos',
    modalidade: 'Vôlei',
    categoriaMetrica: 'sessoes',
    progressoUsuario: 0,
    duracao: '30 dias',
    arbitro: 'Ricardo Mendes',
    participantesCount: 12,
    premiacao: 'Medalha Digital',
    dataFim: '30/10/2026',
    regras: [
      'Mínimo de 1 set por registro',
      'Foto com pelo menos um companheiro de equipe e o código físico',
      'Máximo de 1 jogo computado por dia'
    ],
    inscrito: false
  },
  {
    id: 6,
    nome: 'Corrida Matinal — 21 Dias',
    descricao: 'Desenvolva o hábito da corrida matinal com no mínimo 2 km por dia, por 21 dias consecutivos.',
    tipo: 'individual',
    formato: 'gratuito',
    entrada: 0,
    pote: 0,
    objetivo: 42,
    unidade: 'km',
    modalidade: 'Corrida',
    categoriaMetrica: 'distancia',
    progressoUsuario: 0,
    duracao: '21 dias',
    arbitro: 'Fernanda Lima',
    participantesCount: 54,
    premiacao: 'Medalha Digital',
    dataFim: '14/10/2026',
    regras: [
      'Mínimo de 2 km por dia',
      'Submissão diária até às 23:59',
      'Validação direta pelo árbitro'
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
    modalidade?: string;
    categoriaMetrica?: CategoriaMetrica;
    unidade?: string;
  }): Desafio {
    const lista = this.desafiosSubject.value;
    const novoId = lista.length > 0 ? Math.max(...lista.map(d => d.id)) + 1 : 1;
    const participantesIniciais = novo.tipo === 'individual' ? 1 : 8;
    const poteEstimado = novo.formato === 'caucao' ? novo.entrada * participantesIniciais : 0;
    const modalidade = novo.modalidade || 'Corrida';
    const categoriaMetrica: CategoriaMetrica = novo.categoriaMetrica || 'distancia';
    const unidade = novo.unidade || 'km';

    const desafioCriado: Desafio = {
      id: novoId,
      nome: novo.nome,
      descricao: novo.descricao || `Desafio de ${novo.objetivo} ${unidade} com duração de ${novo.duracao}. Compromisso assumido na Firmo.`,
      tipo: novo.tipo,
      formato: novo.formato,
      entrada: novo.formato === 'caucao' ? novo.entrada : 0,
      pote: poteEstimado,
      objetivo: novo.objetivo,
      unidade,
      modalidade,
      categoriaMetrica,
      progressoUsuario: 0,
      duracao: novo.duracao,
      arbitro: novo.arbitro,
      participantesCount: participantesIniciais,
      premiacao: novo.premiacao,
      dataFim: '30 dias a partir de hoje',
      regras: [
        `Comprovação por foto com código físico na cena`,
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

  public atualizarProgressoDesafio(id: number, valorAdicional: number): void {
    const lista = this.desafiosSubject.value.map(d => {
      if (d.id === id) {
        const novoProgresso = Number((d.progressoUsuario + valorAdicional).toFixed(1));
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
        const parsed: Desafio[] = JSON.parse(salvo);
        // Retrocompatibilidade: garante campos novos em desafios salvos sem eles
        return parsed.map(d => ({
          ...d,
          modalidade: d.modalidade || 'Corrida',
          categoriaMetrica: d.categoriaMetrica || 'distancia'
        }));
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
