import { Component } from '@angular/core';

@Component({
  selector: 'no-info',
  template: `
    <div class="flex flex-col items-center justify-center h-full text-center p-6">
      <div class="w-24 h-24 mb-4 animate-bounce-slow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-full text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 17h5l-1.405-1.405M4 6h16M4 10h16M4 14h10"
          />
        </svg>
      </div>

      <!-- Mensaje -->
      <h2 class="text-xl font-semibold text-gray-600">Sin competencias encontradas</h2>
      <p class="text-gray-400 mt-2 max-w-sm">
        Aún no se han agregado competencias. Porfavor espera una convocatoria o selecciona una.
      </p>
    </div>
  `,
  styles: [`
    .animate-bounce-slow {
      animation: bounce 3s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `]
})
export class noInfo {}
