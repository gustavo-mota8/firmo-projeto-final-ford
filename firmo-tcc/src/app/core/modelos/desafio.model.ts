export type CategoriaMetrica = 'distancia' | 'duracao' | 'sessoes' | 'personalizado';

export interface Desafio {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'individual' | 'grupo';
  formato: 'gratuito' | 'caucao';
  entrada: number;
  pote: number;
  /** Valor numérico da meta (km, min, sessões ou unidade personalizada) */
  objetivo: number;
  /** Unidade de exibição da meta: 'km', 'min', 'sessões', ou string livre */
  unidade: string;
  /** Modalidade esportiva: 'Corrida', 'Ciclismo', 'Futebol', 'Academia', etc. */
  modalidade: string;
  /** Define qual métrica é usada no registro e no progresso do desafio */
  categoriaMetrica: CategoriaMetrica;
  progressoUsuario: number;
  duracao: string;
  arbitro: string;
  participantesCount: number;
  premiacao: string;
  dataFim: string;
  regras: string[];
  inscrito: boolean;
}
