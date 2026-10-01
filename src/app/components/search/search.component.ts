import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Card, ViewState } from '../../models/card.model';
import { YugiohService } from '../../services/yugioh.service';
import { CardComponent } from '../card/card.component';
import { CardDetailComponent } from '../card-detail/card-detail.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, CardDetailComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchTerm = '';
  cards: Card[] = [];
  selectedCard: Card | null = null;
  state: ViewState = 'empty';
  errorMessage = '';

  // RxJS Subject para emitir los términos ingresados por el usuario
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(private yugiohService: YugiohService) {}

  ngOnInit(): void {
    /**
     * RF-01: Implementación con operadores RxJS:
     * - debounceTime(400): Espera 400ms después de que el usuario deja de escribir.
     * - distinctUntilChanged(): Evita peticiones redundantes si el término no cambió.
     * - switchMap(): Cancela peticiones HTTP previas pendientes y se suscribe al nuevo Observable.
     */
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap((term) => {
        if (term.trim().length > 0) {
          this.state = 'loading';
          this.errorMessage = '';
        }
      }),
      switchMap((term) => {
        const trimmed = term.trim();
        if (!trimmed) {
          this.state = 'empty';
          this.cards = [];
          return [];
        }
        return this.yugiohService.searchCards(trimmed);
      })
    ).subscribe({
      next: (results: Card[]) => {
        this.cards = results;
        if (!this.searchTerm.trim()) {
          this.state = 'empty';
        } else if (results.length > 0) {
          this.state = 'success';
        } else {
          this.state = 'empty';
        }
      },
      error: (err) => {
        console.error('Error durante la búsqueda de cartas:', err);
        this.state = 'error';
        this.errorMessage = 'Hubo un error al comunicarse con la API de YGOPRODeck. Por favor verifica tu conexión o intenta nuevamente.';
      }
    });

    // Realizar una búsqueda inicial representativa para que la vista inicial sea atractiva
    this.setPresetTerm('Dark Magician');
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onInput(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  setPresetTerm(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  onSelectCard(card: Card): void {
    this.selectedCard = card;
  }

  closeDetail(): void {
    this.selectedCard = null;
  }

  retry(): void {
    if (this.searchTerm.trim()) {
      this.searchSubject.next(this.searchTerm);
    }
  }
}
