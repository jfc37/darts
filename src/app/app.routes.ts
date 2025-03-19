import { Routes } from '@angular/router';
import { GameSelectionContainer } from './pages/game-selection/game-selection.container';

export const routes: Routes = [
    {
        path: '',
        component: GameSelectionContainer,
        title: 'Darts | Game Selection'
    }
];
