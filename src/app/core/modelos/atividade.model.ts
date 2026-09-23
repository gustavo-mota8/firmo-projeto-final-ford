export interface Atividade {
  id: number;
  desafioId: number;
  participante: string;
  usuarioId: number;
  tipo: string;
  /** Valor genérico da métrica acumulada (km, min, sessões ou unidade livre do desafio) */
  valorMetrica: number;
  /** @deprecated Mantido para compatibilidade; equivale a valorMetrica em desafios de distância */
  distancia?: number;
  tempo: string;
  comprovacao?: string;
  codigoValidacao?: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  dataEnvio: string;
  motivoRejeicao?: string;
  // Campos para desafios presenciais
  equipe1?: string;
  equipe2?: string;
  placar1?: number;
  placar2?: number;
  vencedor?: string;
  dataConfronto?: string;
  observacao?: string;
}
