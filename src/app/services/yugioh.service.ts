import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Card, CardApiResponse } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class YugiohService {
  private readonly baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  constructor(private http: HttpClient) {}

  /**
   * Busca cartas por nombre parcial o completo (fname).
   */
  searchCards(term: string): Observable<Card[]> {
    const trimmed = term.trim();
    if (!trimmed) {
      return of([]);
    }

    const url = `${this.baseUrl}?fname=${encodeURIComponent(trimmed)}`;
    return this.http.get<CardApiResponse>(url).pipe(
      map(response => response.data || []),
      catchError((error: HttpErrorResponse) => {
        // La API devuelve 400 cuando no hay cartas con esa búsqueda
        if (error.status === 400) {
          return of([]);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera todas las cartas del arquetipo Blue-Eyes.
   */
  getBlueEyesCards(): Observable<Card[]> {
    const url = `${this.baseUrl}?archetype=Blue-Eyes`;
    return this.http.get<CardApiResponse>(url).pipe(
      map(response => response.data || []),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return of([]);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene el detalle de una carta por ID.
   */
  getCardById(id: number | string): Observable<Card | null> {
    const url = `${this.baseUrl}?id=${id}`;
    return this.http.get<CardApiResponse>(url).pipe(
      map(response => (response.data && response.data.length > 0 ? response.data[0] : null)),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Extrae la lista única de expansiones ordenadas alfabéticamente.
   */
  extractUniqueSets(cards: Card[]): string[] {
    const setNames = new Set<string>();
    for (const card of cards) {
      if (card.card_sets && Array.isArray(card.card_sets)) {
        for (const set of card.card_sets) {
          if (set.set_name) {
            setNames.add(set.set_name.trim());
          }
        }
      }
    }
    return Array.from(setNames).sort((a, b) => a.localeCompare(b));
  }

  /**
   * Filtra cartas por el nombre de la expansión seleccionada.
   */
  filterCardsBySet(cards: Card[], setName: string): Card[] {
    if (!setName || setName === 'ALL') {
      return cards;
    }
    return cards.filter(card =>
      card.card_sets?.some(s => s.set_name.toLowerCase() === setName.toLowerCase())
    );
  }
}
