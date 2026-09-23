import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AtividadeService } from '../../../core/servicos/atividade.service';

@Component({
  selector: 'app-navegacao-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navegacao-mobile.component.html',
  styleUrls: ['./navegacao-mobile.component.css']
})
export class NavegacaoMobileComponent implements OnInit {
  totalPendentes: number = 0;

  constructor(private atividadeService: AtividadeService) {}

  ngOnInit(): void {
    this.atividadeService.atividades$.subscribe(atividades => {
      this.totalPendentes = atividades.filter(a => a.status === 'pendente').length;
    });
  }
}
