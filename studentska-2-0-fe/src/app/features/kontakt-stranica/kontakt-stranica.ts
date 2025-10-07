import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kontakt-stranica',
  imports: [MatIconModule],
  templateUrl: '../shared/placeholder.html',
  styleUrl: '../shared/placeholder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KontaktStranica {}
