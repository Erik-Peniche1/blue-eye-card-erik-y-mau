import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
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

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private yugiohService: YugiohService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      tap((term) => {
        const trimmed = term.trim();
        if (trimmed.length > 0) {
          this.state = 'loading';
          this.errorMessage = '';
          this.cdr.markForCheck();
        } else {
          this.state = 'empty';
          this.cards = [];
          this.cdr.markForCheck();
        }
      }),
      switchMap((term) => {
        const trimmed = term.trim();
        if (!trimmed) {
          return of([]);
        }
        return this.yugiohService.searchCards(trimmed).pipe(
          catchError((err) => {
            console.error('Error en búsqueda de cartas:', err);
            this.state = 'error';
            this.errorMessage = 'No fue posible consultar la base de datos de cartas.';
            this.cdr.markForCheck();
            return of([]);
          })
        );
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
        this.cdr.markForCheck();
      }
    });

    // Se deja el buscador vacío al iniciar por especificación
    this.state = 'empty';
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
