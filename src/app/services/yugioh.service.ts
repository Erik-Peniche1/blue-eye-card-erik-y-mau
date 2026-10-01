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
   * RF-01: Busca cartas por nombre parcial o completo.
   * Utiliza el parámetro `fname` de la API de YGOPRODeck.
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
        // La API de YGOPRODeck responde con 400 cuando no encuentra cartas coincidentes
        if (error.status === 400) {
          return of([]);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * RF-04: Recupera todas las cartas del arquetipo Blue-Eyes.
   * Utiliza el parámetro `archetype=Blue-Eyes`.
   */
  getBlueEyesCards(): Observable<Card[]> {
    const url = `${this.baseUrl}?archetype=Blue-Eyes`;
    return this.http.get<CardApiResponse>(url).pipe(
      map(response => response.data || []),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * RF-03: Obtiene la información detallada de una carta específica por su ID.
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
   * RF-05: Extrae la lista única de expansiones (sets) a partir de un arreglo de cartas.
   * Elimina duplicados utilizando un Set de JavaScript y ordena alfabéticamente.
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
   * RF-06: Filtra las cartas que pertenecen a una expansión específica.
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
