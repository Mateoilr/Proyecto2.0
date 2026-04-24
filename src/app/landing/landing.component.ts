import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  // Variable para controlar si el menú lateral del login está abierto o cerrado
  isLoginMenuOpen: boolean = false;

  // ================= CONFIGURACIÓN DEL CARRUSEL DINÁMICO =================
  currentSlide = 0;
  slideInterval: any;
  
  // Aquí puedes editar el contenido de cada imagen y la posición del texto
  slides = [
    {
      image: '/assets/inicio.png',
      title: 'Confianza y precisión en tus resultados',
      features: ['Personal Certificado', 'Resultados exactos'],
      top: '60%',  // Qué tan abajo empieza el texto (0% es arriba pegado, 100% es abajo)
      left: '10%'  // Qué tan a la izquierda empieza (0% es izquierda pegada)
    },
    {
      image: '/assets/inicio2.png',
      title: 'Tecnología médica de última generación',
      features: ['Diagnóstico Exacto', 'Procesos Automatizados', 'Equipos Philips'],
      top: '60%',
      left: '10%'  // Más del 50% lo empuja hacia el lado derecho
    },
    {
      image: '/assets/inicio3.png',
      title: 'Atención Profesional y Humana',
      features: ['Personal Capacitado', 'Resultados Confiables', 'Ética Médica'],
      top: '60%',
      left: '30%'
    },
    {
      image: '/assets/inicio4.png',
      title: '',
      features: [],
      top: '60%',
      left: '5%'
    }
  ];

  // Configuración del degradado para las imágenes del carrusel
  // Puedes editar esta cadena para cambiar el degradado según lo desees
  gradient: string = 'linear-gradient(to right, rgba(48, 157, 157, 0.95) 0%, rgba(48, 157, 157, 0.6) 50%, transparent 100%)';
  // ======================================================================

  // Inicia el temporizador cuando el componente carga
  ngOnInit() {
    this.startTimer();
  }

  // Limpia el temporizador si el componente se destruye (cambias de página)
  ngOnDestroy() {
    this.clearTimer();
  }

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

  // ================= LÓGICA DEL CARRUSEL =================

  // Lógica del temporizador (30000 milisegundos = 30 segundos)
  startTimer() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 30000); 
  }

  clearTimer() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Botón Siguiente (con ciclo infinito)
  nextSlide() {
    this.currentSlide = (this.currentSlide === this.slides.length - 1) ? 0 : this.currentSlide + 1;
    this.resetTimer(); // Reinicia los 30s si el usuario presiona la flecha manualmente
  }

  // Botón Anterior (con ciclo infinito)
  prevSlide() {
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
    this.resetTimer(); 
  }

  // Resetea el tiempo para que no cambie de golpe si acabas de dar clic
  resetTimer() {
    this.clearTimer();
    this.startTimer();
  }
}