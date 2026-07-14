import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chips-preview',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatCardModule, FormsModule],
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">
      <h2>Panel de Control de Colores (Desarrollo Local)</h2>
      <p>Cada etiqueta tiene su propia variable independiente. Usa el selector para ajustarla en tiempo real.</p>

      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <mat-card *ngFor="let cat of categories" style="flex: 1; min-width: 350px;">
          <mat-card-header>
            <mat-card-title>{{ cat.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content style="padding: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
            
            <div *ngFor="let item of cat.items" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px; border: 1px solid #eee; border-radius: 8px;">
              <mat-chip [style.background-color]="item.value" [style.color]="'#ffffff'" style="font-size: 12px; min-width: 100px; text-align: center;">
                {{ item.label }}
              </mat-chip>
              <input type="color" [(ngModel)]="item.value" (input)="updateColor(item.variable, item.value)" style="width: 40px; height: 30px; cursor: pointer; border: none; padding: 0;">
            </div>

          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class ChipsPreviewComponent implements OnInit {
  categories = [
    {
      title: '1. Estados de la Orden',
      items: [
        { label: 'CREADA', variable: '--c-ord-creada', value: '#a78bfa' },
        { label: 'EN_PROCESO', variable: '--c-ord-proceso', value: '#589bf7' },
        { label: 'COMPLETADA', variable: '--c-ord-completada', value: '#6ee7b7' },
        { label: 'CERRADA', variable: '--c-ord-cerrada', value: '#8a919e' },
        { label: 'CANCELADA', variable: '--c-ord-cancelada', value: '#e04a4a' }
      ]
    },
    {
      title: '2. Estados del Examen',
      items: [
        { label: 'PENDIENTE', variable: '--c-exa-pendiente', value: '#f5ba22' },
        { label: 'EN_PROCESO', variable: '--c-exa-proceso', value: '#589bf7' },
        { label: 'COMPLETADO', variable: '--c-exa-completado', value: '#6ee7b7' },
        { label: 'CANCELADO', variable: '--c-exa-cancelado', value: '#e04a4a' }
      ]
    },
    {
      title: '3. Estados de Resultados',
      items: [
        { label: 'REGISTRADO', variable: '--c-res-registrado', value: '#45b6b5' },
        { label: 'VALIDADO', variable: '--c-res-validado', value: '#6ee7b7' },
        { label: 'RECHAZADO', variable: '--c-res-rechazado', value: '#e04a4a' },
        { label: 'ENTREGADO', variable: '--c-res-entregado', value: '#8a919e' }
      ]
    },
    {
      title: '4. Prioridad',
      items: [
        { label: 'NORMAL', variable: '--c-pri-normal', value: '#45b6b5' },
        { label: 'URGENTE', variable: '--c-pri-urgente', value: '#e04a4a' }
      ]
    },
    {
      title: '5. Roles de Usuario',
      items: [
        { label: 'ADMINISTRADOR', variable: '--c-rol-admin', value: '#8552d6' },
        { label: 'SECRETARIO', variable: '--c-rol-secretario', value: '#45b6b5' },
        { label: 'LABORATORISTA', variable: '--c-rol-laboratorista', value: '#589bf7' },
        { label: 'VALIDADOR', variable: '--c-rol-validador', value: '#6ee7b7' }
      ]
    },
    {
      title: '6. Acciones de Auditoría',
      items: [
        { label: 'CREATE', variable: '--c-aud-create', value: '#6ee7b7' },
        { label: 'UPDATE', variable: '--c-aud-update', value: '#45b6b5' },
        { label: 'DELETE', variable: '--c-aud-delete', value: '#e04a4a' },
        { label: 'LOGIN', variable: '--c-aud-login', value: '#589bf7' },
        { label: 'LOGOUT', variable: '--c-aud-logout', value: '#8a919e' }
      ]
    },
    {
      title: '7. Estado de Usuarios',
      items: [
        { label: 'ACTIVE', variable: '--c-usr-active', value: '#6ee7b7' },
        { label: 'INACTIVE', variable: '--c-usr-inactive', value: '#e04a4a' }
      ]
    }
  ];

  ngOnInit() {
    this.readComputedStyles();
  }

  readComputedStyles() {
    const root = document.documentElement;
    const computedStyles = getComputedStyle(root);
    this.categories.forEach(cat => {
      cat.items.forEach(c => {
        const val = computedStyles.getPropertyValue(c.variable).trim();
        if (val) c.value = val;
      });
    });
  }

  updateColor(variable: string, value: string) {
    document.documentElement.style.setProperty(variable, value);
  }
}
