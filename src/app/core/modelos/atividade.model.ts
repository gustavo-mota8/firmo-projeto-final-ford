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
}
