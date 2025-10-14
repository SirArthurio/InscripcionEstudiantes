import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { CurrentStore } from '../../auth/store/current.store';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    AvatarModule,
    TagModule,
    PasswordModule,
    DialogModule,
    ToastModule
  ],
  templateUrl: './config-profile.html'
})
export class ConfigurationComponent{
  // Services
  private fb = inject(FormBuilder);
  private alertService = inject(AlertasService);
  
  // Store
  currentStore = inject(CurrentStore);
  
  // Signals
  // Forms
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  

  
  loadUserData() {
    const user = this.currentStore.user();
    const userRole = user?.role;
    
    if (user && userRole) {
      let userData: any = null;
      
      if (userRole === 'student') {
        userData = this.currentStore.student();
      } else if (userRole === 'superadmin') {
        userData = this.currentStore.superadmin();
      }
      
      this.profileForm.patchValue({
        name: user.username || userData?.name || '',
        email: user.institutionalEmail || userData?.email || '',
        phone: userData?.phone || '',
        address: userData?.address || ''
      });
    }
  }
  
  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'student': 'Estudiante',
      'superadmin': 'Super Administrador',
      'admin': 'Administrador',
      'teacher': 'Profesor'
    };
    return roleMap[role] || role;
  }
  
  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'student': 'info',
      'superadmin': 'danger',
      'admin': 'warning',
      'teacher': 'success'
    };
    return colorMap[role] || 'info';
  }
  
  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
}