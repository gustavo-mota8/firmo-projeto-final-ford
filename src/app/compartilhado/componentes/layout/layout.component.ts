import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from '../cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { NavegacaoMobileComponent } from '../navegacao-mobile/navegacao-mobile.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CabecalhoComponent, MenuLateralComponent, NavegacaoMobileComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  menuAbertoMobile: boolean = false;

  alternarMenuMobile(): void {
    this.menuAbertoMobile = !this.menuAbertoMobile;
  }

  fecharMenuMobile(): void {
    this.menuAbertoMobile = false;
  }
}
