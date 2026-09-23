import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { UsuarioService } from './core/servicos/usuario.service';
import { DesafioService } from './core/servicos/desafio.service';
import { AtividadeService } from './core/servicos/atividade.service';
import { RankingService } from './core/servicos/ranking.service';

describe('Firmo MVP — Testes do Fluxo Principal', () => {
  let usuarioService: UsuarioService;
  let desafioService: DesafioService;
  let atividadeService: AtividadeService;
  let rankingService: RankingService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        UsuarioService,
        DesafioService,
        AtividadeService,
        RankingService
      ]
    }).compileComponents();

    usuarioService = TestBed.inject(UsuarioService);
    desafioService = TestBed.inject(DesafioService);
    atividadeService = TestBed.inject(AtividadeService);
    rankingService = TestBed.inject(RankingService);
  });

  it('deve inicializar a aplicação com sucesso', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve carregar o usuário inicial Gustavo Mota e desafio Corrida 50K', () => {
    const usuario = usuarioService.obterUsuarioAtual();
    expect(usuario.nome).toBe('Gustavo Mota');

    const desafio = desafioService.obterDesafioPorId(1);
    expect(desafio).toBeDefined();
    expect(desafio?.nome).toContain('Corrida 50K');
    expect(desafio?.progressoUsuario).toBe(37.5);
    expect(desafio?.objetivo).toBe(50);
  });

  it('deve verificar o ranking inicial do Desafio 1 com Gustavo na 4ª posição', () => {
    const ranking = rankingService.obterRankingPorDesafio(1);
    expect(ranking.length).toBe(5);

    const posicaoGustavo = rankingService.obterPosicaoUsuario(1, 1);
    expect(posicaoGustavo).toBe(4);
  });

  it('deve executar o fluxo completo: registrar atividade -> pendente -> árbitro aprova -> progresso e ranking atualizados', () => {
    // 1. Registra uma atividade de 5 km
    const novaAtividade = atividadeService.registrarAtividade({
      desafioId: 1,
      participante: 'Gustavo Mota',
      usuarioId: 1,
      tipo: 'Corrida',
      distancia: 5.0,
      tempo: '32 min',
      codigoValidacao: '4821'
    });

    expect(novaAtividade.status).toBe('pendente');
    expect(novaAtividade.codigoValidacao).toBe('4821');

    // 2. O árbitro Carlos Almeida aprova a atividade
    const aprovada = atividadeService.aprovarAtividade(novaAtividade.id);
    expect(aprovada?.status).toBe('aprovada');

    // 3. Atualiza progresso do desafio (+5 km)
    desafioService.atualizarProgressoDesafio(1, 5.0);
    const desafioAtualizado = desafioService.obterDesafioPorId(1);
    expect(desafioAtualizado?.progressoUsuario).toBe(42.5);

    // 4. Atualiza ranking com pontos (+50 pts)
    rankingService.atualizarDistanciaUsuario(1, 1, 5.0, 50);

    // 5. Gustavo agora tem 42.5 km e deve ultrapassar Lucas (42.0 km) e Maria (40.0 km), assumindo a 2ª posição!
    const rankingAtualizado = rankingService.obterRankingPorDesafio(1);
    const novaPosicaoGustavo = rankingService.obterPosicaoUsuario(1, 1);

    expect(novaPosicaoGustavo).toBe(2);
    expect(rankingAtualizado[1].nome).toBe('Gustavo Mota');
    expect(rankingAtualizado[1].distancia).toBe(42.5);

    // 6. Atualiza saldo geral do usuário
    usuarioService.adicionarPontosEKm(5.0, 50);
    const usuarioAtualizado = usuarioService.obterUsuarioAtual();
    expect(usuarioAtualizado.totalKm).toBe(190.5);
  });

  it('deve permitir criar um novo desafio com entrada e pote estimado', () => {
    const novoDesafio = desafioService.criarDesafio({
      nome: 'Desafio Noturno 10K',
      tipo: 'grupo',
      formato: 'caucao',
      entrada: 25,
      objetivo: 10,
      duracao: '7 dias',
      premiacao: 'Top 3',
      arbitro: 'Carlos Almeida'
    });

    expect(novoDesafio.id).toBeDefined();
    expect(novoDesafio.nome).toBe('Desafio Noturno 10K');
    expect(novoDesafio.pote).toBe(200); // 25 * 8 participantes iniciais
    expect(desafioService.obterDesafioPorId(novoDesafio.id)).toBeDefined();
  });

  it('deve permitir rejeitar uma atividade informando o motivo', () => {
    const atividade = atividadeService.registrarAtividade({
      desafioId: 1,
      participante: 'Gustavo Mota',
      usuarioId: 1,
      tipo: 'Corrida',
      distancia: 10.0,
      tempo: '55 min',
      codigoValidacao: '9999'
    });

    const rejeitada = atividadeService.rejeitarAtividade(atividade.id, 'A comprovação não está clara');
    expect(rejeitada?.status).toBe('rejeitada');
    expect(rejeitada?.motivoRejeicao).toBe('A comprovação não está clara');
  });
});
