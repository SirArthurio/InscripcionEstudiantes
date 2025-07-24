import { Component, input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

interface header {
  title: string;
  subtitle: string;
  periodo: string;
}
interface content {
  name: string;
  code: string;
  carrer: string;
}
@Component({
  selector: 'app-header-dashboard',
  imports: [AvatarModule],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.scss',
})
export class HeaderDashboardComponent {
  header = input<header | null>(null);
  user = input<content | null>({
    name: 'pepe',
    code: '2020',
    carrer: 'ing sistemas',
  });
}
