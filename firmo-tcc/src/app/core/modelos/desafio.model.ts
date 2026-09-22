export interface Desafio {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'individual' | 'grupo';
  formato: 'gratuito' | 'caucao';
  entrada: number;
  pote: number;
  objetivo: number;
  unidade: string;
  progressoUsuario: number;
  duracao: string;
  arbitro: string;
  participantesCount: number;
  premiacao: string;
  dataFim: string;
  regras: string[];
  inscrito: boolean;
}
