import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { BlueEyesComponent } from './components/blue-eyes/blue-eyes.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent, title: 'Buscador de Cartas - Yu-Gi-Oh!' },
  { path: 'blue-eyes', component: BlueEyesComponent, title: 'Blue-Eyes Collection' },
  { path: 'card/:id', component: CardDetailComponent, title: 'Detalle de Carta' },
  { path: '**', redirectTo: 'search' }
];
