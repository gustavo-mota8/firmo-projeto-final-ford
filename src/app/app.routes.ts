import { Routes } from '@angular/router';
import { InicioComponent } from './funcionalidades/inicio/inicio.component';
import { DesafiosComponent } from './funcionalidades/desafios/desafios.component';
import { CriarDesafioComponent } from './funcionalidades/criar-desafio/criar-desafio.component';
import { DetalheDesafioComponent } from './funcionalidades/detalhe-desafio/detalhe-desafio.component';
import { FormularioAtividadeComponent } from './funcionalidades/atividade/formulario-atividade.component';
import { ValidacaoComponent } from './funcionalidades/validacao/validacao.component';
import { PerfilComponent } from './funcionalidades/perfil/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: InicioComponent },
  { path: 'desafios', component: DesafiosComponent },
  { path: 'desafios/criar', component: CriarDesafioComponent },
  { path: 'desafios/:id', component: DetalheDesafioComponent },
  { path: 'desafios/:id/atividade', component: FormularioAtividadeComponent },
  { path: 'validacao', component: ValidacaoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: 'home' }
];
