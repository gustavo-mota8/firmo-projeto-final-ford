export interface Atividade {
  id: number;
  desafioId: number;
  participante: string;
  usuarioId: number;
  tipo: string;
  distancia: number;
  tempo: string;
  comprovacao: string;
  codigoValidacao: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  dataEnvio: string;
  motivoRejeicao?: string;
}
