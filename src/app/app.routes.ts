import { Routes } from '@angular/router';
import { GameSelectionContainer } from './pages/game-selection/game-selection.container';
import { KillerContainer } from './pages/killer/killer.container';

export const routes: Routes = [
    {
        path: '',
        component: GameSelectionContainer,
        title: 'Darts | Game Selection'
    },
    {
        path: 'killer',
        component: KillerContainer,
        title: 'Darts | Killer'
    },
];
