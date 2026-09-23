import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AtividadeService } from '../../../core/servicos/atividade.service';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  @Input() abertoMobile: boolean = false;
  @Output() fecharMobile = new EventEmitter<void>();

  totalPendentes: number = 0;

  constructor(private atividadeService: AtividadeService) {}

  ngOnInit(): void {
    this.atividadeService.atividades$.subscribe(atividades => {
      this.totalPendentes = atividades.filter(a => a.status === 'pendente').length;
    });
  }
}
