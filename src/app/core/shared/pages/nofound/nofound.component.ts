import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-nofound',
  imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
  templateUrl: './nofound.component.html',
  styleUrl: './nofound.component.scss',
})
export default class NofoundComponent {}
