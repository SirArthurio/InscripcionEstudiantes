import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #container
      class="pointer-events-none absolute inset-0 overflow-hidden"
      [style.border-radius]="resolvedBorderRadius"
    >
      <!-- Top border -->
      <div
        class="absolute top-0 left-0 animate-beam-horizontal"
        [style.width]="'100%'"
        [style.height.px]="borderWidth"
        [style.background]="horizontalGradient"
        [style.animation-duration.s]="duration"
        [style.animation-delay.s]="-delay"
        [style.animation-direction]="reverse ? 'reverse' : 'normal'"
      ></div>

      <!-- Right border -->
      <div
        class="absolute top-0 right-0 animate-beam-vertical"
        [style.width.px]="borderWidth"
        [style.height]="'100%'"
        [style.background]="verticalGradient"
        [style.animation-duration.s]="duration"
        [style.animation-delay.s]="-(delay + duration / 4)"
        [style.animation-direction]="reverse ? 'reverse' : 'normal'"
      ></div>

      <!-- Bottom border -->
      <div
        class="absolute bottom-0 right-0 animate-beam-horizontal-reverse"
        [style.width]="'100%'"
        [style.height.px]="borderWidth"
        [style.background]="horizontalGradientReverse"
        [style.animation-duration.s]="duration"
        [style.animation-delay.s]="-(delay + duration / 2)"
        [style.animation-direction]="reverse ? 'reverse' : 'normal'"
      ></div>

      <!-- Left border -->
      <div
        class="absolute bottom-0 left-0 animate-beam-vertical-reverse"
        [style.width.px]="borderWidth"
        [style.height]="'100%'"
        [style.background]="verticalGradientReverse"
        [style.animation-duration.s]="duration"
        [style.animation-delay.s]="-(delay + (3 * duration) / 4)"
        [style.animation-direction]="reverse ? 'reverse' : 'normal'"
      ></div>
    </div>
  `,
  styles: [
    `
      @keyframes beam-horizontal {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes beam-vertical {
        0% {
          transform: translateY(-100%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100%);
          opacity: 0;
        }
      }

      @keyframes beam-horizontal-reverse {
        0% {
          transform: translateX(100%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateX(-100%);
          opacity: 0;
        }
      }

      @keyframes beam-vertical-reverse {
        0% {
          transform: translateY(100%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100%);
          opacity: 0;
        }
      }

      .animate-beam-horizontal {
        animation-name: beam-horizontal;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      .animate-beam-vertical {
        animation-name: beam-vertical;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      .animate-beam-horizontal-reverse {
        animation-name: beam-horizontal-reverse;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      .animate-beam-vertical-reverse {
        animation-name: beam-vertical-reverse;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
    `,
  ],
})
export class CartaComponent implements OnInit {
  @Input() duration: number = 4;
  @Input() delay: number = 0;
  @Input() colorFrom: string = 'var(--primary-color, #3b82f6)';
  @Input() colorTo: string = 'var(--secondary-color, #8b5cf6)';
  @Input() reverse: boolean = false;
  @Input() borderWidth: number = 2;
  @Input() borderRadius: string | number = 'md'; // Acepta tanto string como number
  @Input() beamLength: number = 30;

  horizontalGradient: string = '';
  verticalGradient: string = '';
  horizontalGradientReverse: string = '';
  verticalGradientReverse: string = '';
  resolvedBorderRadius: string = '';

  // Mapeo de valores de Tailwind CSS a píxeles
  private tailwindRadiusMap: { [key: string]: string } = {
    none: '0px',
    sm: '0.125rem', // 2px
    '': '0.25rem', // 4px (default)
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px', // Completamente redondeado
  };

  ngOnInit() {
    this.resolvedBorderRadius = this.resolveBorderRadius();
    this.updateGradients();

    // Actualizar la variable CSS para el offset-path
    document.documentElement.style.setProperty(
      '--border-radius',
      this.resolvedBorderRadius
    );
  }

  private resolveBorderRadius(): string {
    // Si es un número, convertir a píxeles
    if (typeof this.borderRadius === 'number') {
      return `${this.borderRadius}px`;
    }

    // Si es un string, verificar si está en el mapeo de Tailwind
    if (typeof this.borderRadius === 'string') {
      // Si está en el mapeo, usar el valor correspondiente
      if (this.tailwindRadiusMap.hasOwnProperty(this.borderRadius)) {
        return this.tailwindRadiusMap[this.borderRadius];
      }

      // Si es un valor CSS válido (ej: "10px", "1rem"), usarlo directamente
      if (this.borderRadius.match(/^\d+(\.\d+)?(px|rem|em|%)$/)) {
        return this.borderRadius;
      }

      // Si no es reconocido, usar el valor por defecto
      return this.tailwindRadiusMap['md'];
    }

    return this.tailwindRadiusMap['md'];
  }

  private updateGradients() {
    const transparent = 'transparent';
    const beamSize = this.beamLength;
    const fadeSize = (100 - beamSize) / 2;

    this.horizontalGradient = `linear-gradient(90deg, ${transparent} 0%, ${
      this.colorFrom
    } ${fadeSize}%, ${this.colorTo} ${50}%, ${this.colorFrom} ${
      100 - fadeSize
    }%, ${transparent} 100%)`;
    this.verticalGradient = `linear-gradient(180deg, ${transparent} 0%, ${
      this.colorFrom
    } ${fadeSize}%, ${this.colorTo} ${50}%, ${this.colorFrom} ${
      100 - fadeSize
    }%, ${transparent} 100%)`;
    this.horizontalGradientReverse = `linear-gradient(270deg, ${transparent} 0%, ${
      this.colorFrom
    } ${fadeSize}%, ${this.colorTo} ${50}%, ${this.colorFrom} ${
      100 - fadeSize
    }%, ${transparent} 100%)`;
    this.verticalGradientReverse = `linear-gradient(0deg, ${transparent} 0%, ${
      this.colorFrom
    } ${fadeSize}%, ${this.colorTo} ${50}%, ${this.colorFrom} ${
      100 - fadeSize
    }%, ${transparent} 100%)`;
  }
}
