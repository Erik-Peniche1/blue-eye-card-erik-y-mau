import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Card, ViewState } from '../../models/card.model';
import { YugiohService } from '../../services/yugioh.service';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  @Input() card: Card | null = null;
  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();

  state: ViewState = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private yugiohService: YugiohService
  ) {}

  ngOnInit(): void {
    if (this.card) {
      this.state = 'success';
      return;
    }

    // Si no se proporcionó por Input, revisar parámetros de la ruta (/card/:id)
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.loadCardById(cardId);
    } else {
      this.state = 'empty';
    }
  }

  loadCardById(id: string): void {
    this.state = 'loading';
    this.errorMessage = '';

    this.yugiohService.getCardById(id).subscribe({
      next: (card) => {
        if (card) {
          this.card = card;
          this.state = 'success';
        } else {
          this.state = 'empty';
        }
      },
      error: (err) => {
        console.error('Error al cargar detalle de carta:', err);
        this.errorMessage = 'No fue posible cargar los detalles de la carta. Intenta nuevamente.';
        this.state = 'error';
      }
    });
  }

  onClose(): void {
    if (this.isModal) {
      this.close.emit();
    } else {
      this.router.navigate(['/']);
    }
  }

  get isMonster(): boolean {
    return !!this.card?.type && this.card.type.toLowerCase().includes('monster');
  }

  get isSpell(): boolean {
    return !!this.card?.type && this.card.type.toLowerCase().includes('spell');
  }

  get isTrap(): boolean {
    return !!this.card?.type && this.card.type.toLowerCase().includes('trap');
  }
}
