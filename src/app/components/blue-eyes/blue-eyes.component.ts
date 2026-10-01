import { Component, OnInit } from '@angular/core';
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

  constructor(private yugiohService: YugiohService) {}

  ngOnInit(): void {
    this.loadBlueEyesCollection();
  }

  /**
   * RF-04: Consulta a la API para recuperar cartas del arquetipo Blue-Eyes.
   * RF-05: Procesa las impresiones y genera automáticamente la lista de expansiones sin duplicados.
   */
  loadBlueEyesCollection(): void {
    this.state = 'loading';
    this.errorMessage = '';

    this.yugiohService.getBlueEyesCards().subscribe({
      next: (cards: Card[]) => {
        this.allCards = cards;

        // RF-05: Generación automática de lista única de expansiones sin duplicados
        this.uniqueExpansions = this.yugiohService.extractUniqueSets(cards);

        // Aplica el filtro inicial ('ALL')
        this.applyFilter();

        if (cards.length > 0) {
          this.state = 'success';
        } else {
          this.state = 'empty';
        }
      },
      error: (err) => {
        console.error('Error al cargar la colección Blue-Eyes:', err);
        this.state = 'error';
        this.errorMessage = 'No se pudo cargar la colección de cartas Blue-Eyes desde YGOPRODeck. Por favor verifica tu conexión a internet.';
      }
    });
  }

  /**
   * RF-06: Filtro dinámico por expansión seleccionada.
   */
  onExpansionChange(newExpansion: string): void {
    this.selectedExpansion = newExpansion;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredCards = this.yugiohService.filterCardsBySet(this.allCards, this.selectedExpansion);
  }

  resetFilter(): void {
    this.selectedExpansion = 'ALL';
    this.applyFilter();
  }

  onSelectCard(card: Card): void {
    this.selectedCard = card;
  }

  closeDetail(): void {
    this.selectedCard = null;
  }
}
