import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';

const CHAVE_STORAGE = 'firmo_usuario';

const USUARIO_INICIAL: Usuario = {
  id: 1,
  nome: 'Gustavo Mota',
  email: 'gustavo@firmo.app',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  pontos: 320,
  desafiosAtivos: 2,
  desafiosConcluidos: 4,
  atividadesValidadas: 18,
  totalKm: 185.5
};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<Usuario>(this.carregarDoStorage());
  public usuario$: Observable<Usuario> = this.usuarioSubject.asObservable();

  constructor() {}

  public obterUsuarioAtual(): Usuario {
    return this.usuarioSubject.value;
  }

  public adicionarPontosEKm(km: number, pontos: number): void {
    const usuarioAtual = this.usuarioSubject.value;
    const usuarioAtualizado: Usuario = {
      ...usuarioAtual,
      pontos: usuarioAtual.pontos + pontos,
      totalKm: Number((usuarioAtual.totalKm + km).toFixed(1)),
      atividadesValidadas: usuarioAtual.atividadesValidadas + 1
    };

    this.salvar(usuarioAtualizado);
  }

  private carregarDoStorage(): Usuario {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Caso localStorage não esteja acessível
    }
    return USUARIO_INICIAL;
  }

  private salvar(usuario: Usuario): void {
    this.usuarioSubject.next(usuario);
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(usuario));
    } catch {
      // Ignora falha de escrita no storage
    }
  }
}
