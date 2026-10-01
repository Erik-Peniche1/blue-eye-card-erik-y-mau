import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input({ required: true }) card!: Card;
  @Output() selectCard = new EventEmitter<Card>();

  onCardClick(): void {
    this.selectCard.emit(this.card);
  }

  get isMonster(): boolean {
    return !!this.card.type && this.card.type.toLowerCase().includes('monster');
  }

  get isSpell(): boolean {
    return !!this.card.type && this.card.type.toLowerCase().includes('spell');
  }

  get isTrap(): boolean {
    return !!this.card.type && this.card.type.toLowerCase().includes('trap');
  }
}
