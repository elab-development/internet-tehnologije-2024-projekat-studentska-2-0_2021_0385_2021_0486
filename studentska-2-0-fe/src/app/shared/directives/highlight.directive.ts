import { Directive, ElementRef, HostListener, input, Renderer2, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  // Konfiguracija boja
  highlightColor = input<string>('#e3f2fd');
  originalColor = input<string>('');
  hoverScale = input<number>(1.02);
  duration = input<string>('200ms');
  
  private originalBackground = '';
  private originalTransform = '';
  private originalTransition = '';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    // Čuva originalne stilove
    this.originalBackground = this.el.nativeElement.style.backgroundColor || '';
    this.originalTransform = this.el.nativeElement.style.transform || '';
    this.originalTransition = this.el.nativeElement.style.transition || '';
    
    // Postavlja transition za smooth animaciju
    this.renderer.setStyle(
      this.el.nativeElement, 
      'transition', 
      `all ${this.duration()} ease-in-out`
    );
    
    // Dodaje cursor pointer
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeHighlight();
  }

  @HostListener('focus') onFocus() {
    this.highlight();
  }

  @HostListener('blur') onBlur() {
    this.removeHighlight();
  }

  private highlight() {
    // Menja background color
    this.renderer.setStyle(
      this.el.nativeElement, 
      'background-color', 
      this.highlightColor()
    );
    
    // Dodaje scale efekat
    this.renderer.setStyle(
      this.el.nativeElement, 
      'transform', 
      `scale(${this.hoverScale()})`
    );
    
    // Dodaje box-shadow
    this.renderer.setStyle(
      this.el.nativeElement, 
      'box-shadow', 
      '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
    );
  }

  private removeHighlight() {
    // Vraća originalne stilove
    const originalBg = this.originalColor() || this.originalBackground;
    this.renderer.setStyle(
      this.el.nativeElement, 
      'background-color', 
      originalBg
    );
    
    this.renderer.setStyle(
      this.el.nativeElement, 
      'transform', 
      this.originalTransform
    );
    
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }
}