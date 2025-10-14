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

  Math = Math;

  currentMessageIndex = 0;
  progress = 0;
  private messageInterval?: any;
  private progressInterval?: any;

  loadingMessages: Record<string, LoadingMessage[]> = {
    student: [
      { text: 'Cargando tu sesión de práctica...', emoji: '📘' },
      { text: 'Revisando preguntas de ejemplo...', emoji: '✏️' },
      { text: 'Preparando simulacro...', emoji: '📝' },
      { text: 'Fortaleciendo competencias...', emoji: '📊' },
      { text: '¡Listo para continuar tu preparación!', emoji: '🎓' },
    ],
    professor: [
      { text: 'Organizando banco de preguntas...', emoji: '📂' },
      { text: 'Cargando material de apoyo...', emoji: '📖' },
      { text: 'Configurando simulacros...', emoji: '📝' },
      { text: 'Analizando resultados previos...', emoji: '📊' },
      { text: 'Listo para guiar la preparación...', emoji: '👨‍🏫' },
    ],
    library: [
      { text: 'Accediendo a material de estudio...', emoji: '📚' },
      { text: 'Clasificando competencias...', emoji: '📑' },
      { text: 'Preparando guías de repaso...', emoji: '📓' },
      { text: 'Buscando referencias académicas...', emoji: '🔎' },
      { text: 'Cargando recursos relevantes...', emoji: '📘' },
    ],
    graduation: [
      { text: 'Comprobando tu avance...', emoji: '📊' },
      { text: 'Verificando logros obtenidos...', emoji: '🏅' },
      { text: 'Consolidando tus resultados...', emoji: '📑' },
      { text: '¡Cada paso te acerca al éxito!', emoji: '🌟' },
      { text: 'Preparando tu camino a la graduación...', emoji: '🎓' },
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
