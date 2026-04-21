import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  // Variable para controlar si el menú lateral del login está abierto o cerrado
  isLoginMenuOpen: boolean = false;

  // Función para alternar el menú
  toggleLoginMenu() {
    this.isLoginMenuOpen = !this.isLoginMenuOpen;
  }

  // Función para el scroll suave a las secciones
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}