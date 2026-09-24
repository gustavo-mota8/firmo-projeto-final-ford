import { Routes } from '@angular/router';
import { InicioComponent } from './funcionalidades/inicio/inicio.component';
import { DesafiosComponent } from './funcionalidades/desafios/desafios.component';
import { CriarDesafioComponent } from './funcionalidades/criar-desafio/criar-desafio.component';
import { DetalheDesafioComponent } from './funcionalidades/detalhe-desafio/detalhe-desafio.component';
import { FormularioAtividadeComponent } from './funcionalidades/atividade/formulario-atividade.component';
import { ValidacaoComponent } from './funcionalidades/validacao/validacao.component';
import { PerfilComponent } from './funcionalidades/perfil/perfil.component';
import { LoginComponent } from './funcionalidades/login/login.component';
import { CadastroComponent } from './funcionalidades/cadastro/cadastro.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'home', component: InicioComponent, canActivate: [authGuard] },
  { path: 'desafios', component: DesafiosComponent, canActivate: [authGuard] },
  { path: 'desafios/criar', component: CriarDesafioComponent, canActivate: [authGuard] },
  { path: 'desafios/:id', component: DetalheDesafioComponent, canActivate: [authGuard] },
  { path: 'desafios/:id/atividade', component: FormularioAtividadeComponent, canActivate: [authGuard] },
  { path: 'validacao', component: ValidacaoComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
