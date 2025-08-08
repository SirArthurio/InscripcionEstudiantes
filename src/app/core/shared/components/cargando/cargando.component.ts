import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
interface LoadingMessage {
  text: string;
  emoji: string;
}

@Component({
  selector: 'app-cargando',
  imports: [CommonModule],
  templateUrl: './cargando.component.html',
  styleUrl: './cargando.component.scss',
})
export default class CargandoComponent implements OnInit, OnDestroy {
  @Input() message?: string;
  @Input() showProgress = true;
  @Input() showCharacter = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'student' | 'professor' | 'library' | 'graduation' =
    'student';

  // Agregar esta línea para usar Math en el template
  Math = Math;

  currentMessageIndex = 0;
  progress = 0;
  private messageInterval?: any;
  private progressInterval?: any;

  loadingMessages: Record<string, LoadingMessage[]> = {
    student: [
      { text: 'Preparando tu aula virtual...', emoji: '📚' },
      { text: 'Cargando tus materias favoritas...', emoji: '💖' },
      { text: 'Organizando tu horario de clases...', emoji: '📅' },
      { text: '¡Casi listo para estudiar!', emoji: '✨' },
      { text: 'Conectando con tus compañeros...', emoji: '👥' },
    ],
    professor: [
      { text: 'Preparando el salón de clases...', emoji: '🏫' },
      { text: 'Cargando material didáctico...', emoji: '📖' },
      { text: 'Organizando evaluaciones...', emoji: '📝' },
      { text: '¡Listo para enseñar!', emoji: '🎓' },
      { text: 'Conectando con estudiantes...', emoji: '👨‍🏫' },
    ],
    library: [
      { text: 'Buscando en la biblioteca...', emoji: '📚' },
      { text: 'Catalogando recursos...', emoji: '📋' },
      { text: 'Organizando por categorías...', emoji: '🗂️' },
      { text: '¡Información encontrada!', emoji: '🔍' },
      { text: 'Preparando resultados...', emoji: '✨' },
    ],
    graduation: [
      { text: 'Preparando tu ceremonia...', emoji: '🎓' },
      { text: 'Verificando logros académicos...', emoji: '🏆' },
      { text: 'Organizando reconocimientos...', emoji: '🥇' },
      { text: '¡Felicitaciones graduado!', emoji: '🎉' },
      { text: 'Celebrando tu éxito...', emoji: '🌟' },
    ],
  };

  ngOnInit() {
    this.startMessageRotation();
    if (this.showProgress) {
      this.startProgressAnimation();
    }
  }

  ngOnDestroy() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private startMessageRotation() {
    this.messageInterval = setInterval(() => {
      this.currentMessageIndex =
        (this.currentMessageIndex + 1) % this.getCurrentMessages().length;
    }, 2000);
  }

  private startProgressAnimation() {
    this.progressInterval = setInterval(() => {
      this.progress += Math.random() * 15;
      if (this.progress >= 100) {
        this.progress = 100;
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }
      }
    }, 300);
  }

  getCurrentMessages(): LoadingMessage[] {
    return this.loadingMessages[this.variant];
  }

  getCurrentMessage(): LoadingMessage {
    const messages = this.getCurrentMessages();
    return messages[this.currentMessageIndex] || messages[0];
  }

  get customMessage(): string {
    return this.message || this.getCurrentMessage().text;
  }

  get messageEmoji(): string {
    return this.getCurrentMessage().emoji;
  }
}
