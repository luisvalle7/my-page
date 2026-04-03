import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../commons/menu/menu.component';

type Highlight = {
  title: string;
  description: string;
};

type Step = {
  title: string;
  detail: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly highlights: Highlight[] = [
    {
      title: 'Catálogo actualizado',
      description: 'Gestión completa de televisores con resolución, pulgadas y precios en tiempo real.'
    },
    {
      title: 'Controles inteligentes',
      description: 'Administra controles remotos compatibles y vincúlalos con un televisor en segundos.'
    },
    {
      title: 'Sincronización inmediata',
      description: 'Cada acción del frontend se replica automáticamente en la API de Spring Boot.'
    }
  ];

  readonly steps: Step[] = [
    {
      title: 'Explora los televisores',
      detail: 'Consulta, crea o edita modelos desde la sección Televisores.'
    },
    {
      title: 'Configura los controles',
      detail: 'Añade controles remotos y relaciónalos con el televisor adecuado.'
    },
    {
      title: 'Mantente en contacto',
      detail: 'Comparte tus requerimientos desde la sección Contacto para seguir iterando.'
    }
  ];
}
