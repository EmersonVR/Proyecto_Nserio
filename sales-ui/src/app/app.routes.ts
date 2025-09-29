import { Routes } from '@angular/router';
import { PredictionsPageComponent } from './features/predictions/predictions-page/predictions-page';

export const routes: Routes = [
  { path: '', component: PredictionsPageComponent },
  { path: '**', redirectTo: '' },
];
