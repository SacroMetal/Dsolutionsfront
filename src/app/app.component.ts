import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { environment } from '../../src/environments/environment';
declare const Swal: any;

interface ApiResponse {
  data: number;
  message: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private apiGlobalUrl = environment.apiGlobalUrl;
  usuarios: any[] = [];
  modalAbierto = false;

  nuevoUsuario = {
    name: '',
    email: '',
    edad: null
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>(`${this.apiGlobalUrl}/listarUsuarios`)
      .subscribe(
        (data) => {
          this.usuarios = data;
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);
        }
      );
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  agregarUsuario() {
    const nameValidate  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const edadValidate  = /^[0-9]+$/;

    if (!this.nuevoUsuario.name || !nameValidate.test(this.nuevoUsuario.name)) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Nombre inválido: solo debe contener letras y espacios!"
      });
      return;
    }

    if (!this.nuevoUsuario.email || !emailValidate.test(this.nuevoUsuario.email)) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Correo inválido: debe tener un formato válido!"
      });
      return;
    }

    if (!this.nuevoUsuario.edad || !edadValidate.test(String(this.nuevoUsuario.edad))) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Edad inválida: debe contener solo números!"
      });
      return;
    }

    this.http.post<ApiResponse>(`${this.apiGlobalUrl}/crearUsuarios`, new HttpParams()
    .set('name', this.nuevoUsuario.name)
    .set('email', this.nuevoUsuario.email)
    .set('edad', this.nuevoUsuario.edad), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .subscribe(
      (response) => {
        if (response.data === 1) {
          Swal.fire({
            icon: "success",
            title: "Usuario agregado",
            text: response.message
          });

          this.usuarios.push({ ...this.nuevoUsuario, id: this.usuarios.length + 1 });
          this.cerrarModal();
          this.nuevoUsuario = { name: '', email: '', edad: null };
        }

      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: 'Error al agregar usuario:', error
        });
        return;
      }
    );

  }
}
