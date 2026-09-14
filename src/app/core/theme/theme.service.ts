import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('finly-theme');
    if (savedTheme === 'dark') {
      this.setTheme(true);
    } else {
      this.setTheme(false);
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode());
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('finly-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('finly-theme', 'light');
    }
  }
}
