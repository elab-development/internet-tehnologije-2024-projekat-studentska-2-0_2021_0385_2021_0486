import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent {
  // Required inputs
  text = input.required<string>();
  
  // Optional inputs with defaults
  type = input<'button' | 'submit'>('button');
  variant = input<'basic' | 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab'>('raised');
  color = input<'primary' | 'accent' | 'warn' | ''>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  
  // Loading and disabled states
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  
  // Icon support
  icon = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  loadingText = input<string>('');
  
  // Click event
  clicked = output<Event>();

  /**
   * Handles button click
   */
  onClick(event: Event) {
    if (!this.loading() && !this.disabled()) {
      this.clicked.emit(event);
    }
  }

  /**
   * Gets the button text based on loading state
   */
  getDisplayText(): string {
    if (this.loading() && this.loadingText()) {
      return this.loadingText();
    }
    return this.text();
  }

  /**
   * Determines if button should be disabled
   */
  isDisabled(): boolean {
    return this.disabled() || this.loading();
  }

  /**
   * Gets CSS classes for size
   */
  getSizeClass(): string {
    switch (this.size()) {
      case 'small':
        return 'action-button-small';
      case 'large':
        return 'action-button-large';
      default:
        return 'action-button-medium';
    }
  }
}