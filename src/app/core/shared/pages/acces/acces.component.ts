import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-acces',
  imports: [
    ButtonModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
    ButtonModule,
  ],
  templateUrl: './acces.component.html',
  styleUrl: './acces.component.scss',
})
export class AccesComponent {}
