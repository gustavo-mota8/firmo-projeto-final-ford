import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesafioService } from '../../core/servicos/desafio.service';
import { AtividadeService } from '../../core/servicos/atividade.service';
import { UsuarioService } from '../../core/servicos/usuario.service';
import { Desafio } from '../../core/modelos/desafio.model';
import { Usuario } from '../../core/modelos/usuario.model';
import { Atividade } from '../../core/modelos/atividade.model';

@Component({
  selector: 'app-formulario-atividade',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './formulario-atividade.component.html',
  styleUrls: ['./formulario-atividade.component.css']
})
export class FormularioAtividadeComponent implements OnInit {
  desafioId: number = 1;
  desafio: Desafio | undefined;
  usuario: Usuario | null = null;

  tipoAtividade: string = 'Corrida';
  distancia: number = 5.0;
  tempo: string = '32 min';
  codigoValidacao: string = '4821';
  imagemComprovacao: string = '';
  nomeArquivoComprovacao: string = 'gps_treino_firmo.png';

  enviando: boolean = false;
  atividadeEnviada: Atividade | null = null;

  tiposDisponiveis: string[] = ['Corrida', 'Caminhada', 'Ciclismo'];

  constructor(
    private route: ActivatedRoute,
    private desafioService: DesafioService,
    private atividadeService: AtividadeService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(u => {
      this.usuario = u;
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.desafioId = idParam ? parseInt(idParam, 10) : 1;
      this.desafio = this.desafioService.obterDesafioPorId(this.desafioId);
    });

    // Gera um código de validação de 4 dígitos caso vazio
    if (!this.codigoValidacao) {
      this.gerarNovoCodigo();
    }
  }

  gerarNovoCodigo(): void {
    this.codigoValidacao = Math.floor(1000 + Math.random() * 9000).toString();
  }

  aoSelecionarArquivo(evento: Event): void {
    const elementoInput = evento.target as HTMLInputElement;
    if (elementoInput.files && elementoInput.files[0]) {
      const arquivo = elementoInput.files[0];
      this.nomeArquivoComprovacao = arquivo.name;

      const leitor = new FileReader();
      leitor.onload = () => {
        this.imagemComprovacao = leitor.result as string;
      };
      leitor.readAsDataURL(arquivo);
    }
  }

  submeterAtividade(): void {
    if (!this.distancia || this.distancia <= 0) {
      alert('Por favor, informe uma distância válida.');
      return;
    }

    if (!this.codigoValidacao) {
      this.gerarNovoCodigo();
    }

    this.enviando = true;

    const novaAtividade = this.atividadeService.registrarAtividade({
      desafioId: this.desafioId,
      participante: this.usuario?.nome || 'Gustavo Mota',
      usuarioId: this.usuario?.id || 1,
      tipo: this.tipoAtividade,
      distancia: Number(this.distancia),
      tempo: this.tempo,
      comprovacao: this.imagemComprovacao || undefined,
      codigoValidacao: this.codigoValidacao
    });

    this.enviando = false;
    this.atividadeEnviada = novaAtividade;
  }
}
