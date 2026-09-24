import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <img src="logo-firmo.png" alt="Logo FIRMO" class="auth-logo" />
          <h2>Bem-vindo ao FIRMO</h2>
          <p>Faça login para acessar sua conta</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="Digite seu e-mail" />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" [(ngModel)]="password" required placeholder="Digite sua senha" />
          </div>
          <button type="submit" [disabled]="!email || !password" class="auth-btn">Entrar</button>
        </form>
        <div class="auth-footer">
          <p>Ainda não tem uma conta? <a routerLink="/cadastro">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a192f 0%, #172a45 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .auth-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
    }
    .auth-card {
      background-color: #112240;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      color: #e6f1ff;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-logo {
      height: 48px;
      width: auto;
      margin-bottom: 16px;
    }
    .auth-header h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
      color: #ccd6f6;
    }
    .auth-header p {
      margin: 0;
      color: #8892b0;
      font-size: 15px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #a8b2d1;
    }
    .form-group input {
      width: 100%;
      padding: 12px 16px;
      background-color: #0a192f;
      border: 1px solid #233554;
      border-radius: 8px;
      color: #ccd6f6;
      font-size: 15px;
      box-sizing: border-box;
      transition: all 0.3s ease;
    }
    .form-group input::placeholder {
      color: #495670;
    }
    .form-group input:focus {
      outline: none;
      border-color: #64ffda;
      box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.15);
    }
    /* Fallback highlight using original 'azul' if preferred, but let's stick to a modern blue */
    .form-group input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
    .auth-btn {
      width: 100%;
      padding: 14px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 10px;
    }
    .auth-btn:hover:not(:disabled) {
      background-color: #0056b3;
      transform: translateY(-1px);
    }
    .auth-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .auth-btn:disabled {
      background-color: #233554;
      color: #495670;
      cursor: not-allowed;
    }
    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: #8892b0;
    }
    .auth-footer a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    .auth-footer a:hover {
      color: #0056b3;
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .auth-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.email && this.password) {
      this.authService.login();
      this.router.navigate(['/home']);
    }
  }
}
