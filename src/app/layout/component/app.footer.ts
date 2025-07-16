import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `<div class="layout-footer">
    Universidad Popular del cesar
    <a
      href="https://unicesar.edu.co"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary font-bold hover:underline"
      >UNICESAR</a
    >
  </div>`,
})
export class AppFooter {}
