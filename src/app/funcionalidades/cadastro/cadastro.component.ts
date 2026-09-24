import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <img src="logo-firmo.png" alt="Logo FIRMO" class="auth-logo" />
          <h2>Crie sua conta</h2>
          <p>Junte-se ao FIRMO hoje mesmo</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Nome completo</label>
            <input type="text" id="name" name="name" [(ngModel)]="name" required placeholder="Digite seu nome completo" />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="Digite seu e-mail" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="password">Senha</label>
              <input type="password" id="password" name="password" [(ngModel)]="password" required placeholder="Crie uma senha" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmar</label>
              <input type="password" id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword" required placeholder="Repita a senha" />
            </div>
          </div>
          
          <div class="privacy-group">
            <label class="checkbox-container">
              <input type="checkbox" name="privacyPolicy" [(ngModel)]="privacyPolicy" required />
              <span class="checkmark"></span>
              <span class="privacy-text">
                Li e aceito a <a href="#" (click)="$event.preventDefault(); showPrivacyPolicy = true">Política de Privacidade</a>
              </span>
            </label>
          </div>

          <button type="submit" [disabled]="!isFormValid()" class="auth-btn">Cadastrar</button>
        </form>
        
        <div class="auth-footer">
          <p>Já tem uma conta? <a routerLink="/login">Faça login</a></p>
        </div>
        
        <div class="privacy-modal-overlay" *ngIf="showPrivacyPolicy" (click)="showPrivacyPolicy = false">
          <div class="privacy-modal" (click)="$event.stopPropagation()">
            <h3>Política de Privacidade</h3>
            <p>Coletamos apenas seu <strong>nome</strong> e <strong>e-mail</strong>. Estes dados são utilizados exclusivamente para sua identificação e acesso seguro à plataforma FIRMO.</p>
            <p>Não compartilhamos suas informações com terceiros e seguimos as melhores práticas de proteção de dados.</p>
            <button type="button" class="btn-close" (click)="showPrivacyPolicy = false">Entendi</button>
          </div>
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
      max-width: 480px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      color: #e6f1ff;
      position: relative;
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
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-row .form-group {
      flex: 1;
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
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
    
    .privacy-group {
      margin: 24px 0;
    }
    .checkbox-container {
      display: flex;
      align-items: flex-start;
      position: relative;
      cursor: pointer;
      font-size: 14px;
      user-select: none;
    }
    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .checkmark {
      position: relative;
      top: 2px;
      left: 0;
      height: 18px;
      width: 18px;
      background-color: #0a192f;
      border: 1px solid #233554;
      border-radius: 4px;
      margin-right: 12px;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .checkbox-container:hover input ~ .checkmark {
      border-color: #007bff;
    }
    .checkbox-container input:checked ~ .checkmark {
      background-color: #007bff;
      border-color: #007bff;
    }
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }
    .privacy-text {
      color: #a8b2d1;
      line-height: 1.5;
    }
    .privacy-text a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
    }
    .privacy-text a:hover {
      text-decoration: underline;
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

    .privacy-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(2, 8, 19, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      backdrop-filter: blur(4px);
    }
    .privacy-modal {
      background-color: #112240;
      border: 1px solid #233554;
      border-radius: 12px;
      padding: 32px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 24px 48px rgba(0,0,0,0.5);
    }
    .privacy-modal h3 {
      margin: 0 0 16px;
      color: #ccd6f6;
      font-size: 20px;
    }
    .privacy-modal p {
      color: #8892b0;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .privacy-modal strong {
      color: #ccd6f6;
    }
    .btn-close {
      width: 100%;
      padding: 12px;
      background-color: #233554;
      color: #ccd6f6;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 8px;
    }
    .btn-close:hover {
      background-color: #304566;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 30px 20px;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class CadastroComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  privacyPolicy = false;
  showPrivacyPolicy = false;

  constructor(private authService: AuthService, private router: Router) {}

  isFormValid(): boolean {
    return !!(this.name && this.email && this.password && this.confirmPassword && 
              this.password === this.confirmPassword && this.privacyPolicy);
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.authService.login();
      this.router.navigate(['/home']);
    }
  }
}
