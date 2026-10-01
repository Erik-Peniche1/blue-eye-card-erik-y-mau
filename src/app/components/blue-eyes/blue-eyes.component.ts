import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, ViewState } from '../../models/card.model';
import { YugiohService } from '../../services/yugioh.service';
import { CardComponent } from '../card/card.component';
import { CardDetailComponent } from '../card-detail/card-detail.component';

@Component({
  selector: 'app-blue-eyes',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, CardDetailComponent],
  templateUrl: './blue-eyes.component.html',
  styleUrls: ['./blue-eyes.component.css']
})
export class BlueEyesComponent implements OnInit {
  allCards: Card[] = [];
  filteredCards: Card[] = [];
  uniqueExpansions: string[] = [];
  selectedExpansion = 'ALL';
  selectedCard: Card | null = null;

  state: ViewState = 'loading';
  errorMessage = '';

  constructor(
    private yugiohService: YugiohService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBlueEyesCollection();
  }

  loadBlueEyesCollection(): void {
    this.state = 'loading';
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.yugiohService.getBlueEyesCards().subscribe({
      next: (cards: Card[]) => {
        this.allCards = cards;
        this.uniqueExpansions = this.yugiohService.extractUniqueSets(cards);
        this.applyFilter();

        if (cards.length > 0) {
          this.state = 'success';
        } else {
          this.state = 'empty';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar la colección Blue-Eyes:', err);
        this.state = 'error';
        this.errorMessage = 'No fue posible cargar la colección de cartas Blue-Eyes. Por favor verifica tu conexión a internet.';
        this.cdr.markForCheck();
      }
    });
  }

  onExpansionChange(newExpansion: string): void {
    this.selectedExpansion = newExpansion;
    this.applyFilter();
    this.cdr.markForCheck();
  }

  applyFilter(): void {
    this.filteredCards = this.yugiohService.filterCardsBySet(this.allCards, this.selectedExpansion);
  }

  resetFilter(): void {
    this.selectedExpansion = 'ALL';
    this.applyFilter();
    this.cdr.markForCheck();
  }

  onSelectCard(card: Card): void {
    this.selectedCard = card;
  }

  closeDetail(): void {
    this.selectedCard = null;
  }
}
