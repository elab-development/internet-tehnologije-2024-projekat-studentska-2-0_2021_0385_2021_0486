import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  errorMessages = input<Record<string, string>>({});
  fieldName = input<string>('');
  serverErrors = input<Record<string, string[]>>({});


  getErrorMessage(): string | null {
    const control = this.control();
    if (!control.touched || control.valid) {
      return null;
    }

    const errors = control.errors;
    if (!errors) return null;

    const errorMessages = this.errorMessages();
    for (const errorKey of Object.keys(errors)) {
      if (errorMessages[errorKey]) {
        return errorMessages[errorKey];
      }
    }

    const label = this.label();
    if (errors['required']) {
      return `${label} je obavezno.`;
    }
    
    if (errors['email']) {
      return 'Unesite validan email.';
    }
    
    if (errors['minlength']) {
      return `${label} mora imati najmanje ${errors['minlength'].requiredLength} karaktera.`;
    }
    
    if (errors['maxlength']) {
      return `${label} može imati najviše ${errors['maxlength'].requiredLength} karaktera.`;
    }

    return 'Polje je neispravno.';
  }

 
  getServerErrorMessage(): string | null {
    const fieldName = this.fieldName();
    const serverErrors = this.serverErrors();
    
    if (!fieldName || !serverErrors[fieldName]) {
      return null;
    }
    
    if (serverErrors[fieldName] && serverErrors[fieldName].length > 0) {
      return serverErrors[fieldName][0];
    }
    
    return null;
  }

  shouldShowError(): boolean {
    const control = this.control();
    const hasValidationError = control.touched && control.invalid;
    const hasServerError = !!this.getServerErrorMessage();
    return hasValidationError || hasServerError;
  }
}