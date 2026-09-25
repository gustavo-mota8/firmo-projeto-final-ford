import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from './compartilhado/componentes/cabecalho/cabecalho.component';
import { MenuLateralComponent } from './compartilhado/componentes/menu-lateral/menu-lateral.component';
import { NavegacaoMobileComponent } from './compartilhado/componentes/navegacao-mobile/navegacao-mobile.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CabecalhoComponent,
    MenuLateralComponent,
    NavegacaoMobileComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  menuAbertoMobile: boolean = false;

  constructor(public authService: AuthService) {}

  alternarMenuMobile(): void {
    this.menuAbertoMobile = !this.menuAbertoMobile;
  }

  fecharMenuMobile(): void {
    this.menuAbertoMobile = false;
  }
}
