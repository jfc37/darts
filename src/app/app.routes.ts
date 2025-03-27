import { Routes } from '@angular/router';
import { GameSelectionContainer } from './pages/game-selection/game-selection.container';
import { KillerContainer } from './pages/killer/killer.container';
import { GolfContainer } from './pages/golf/golf.container';

export const routes: Routes = [
    {
        path: '',
        component: GameSelectionContainer,
        title: 'Darts | Game Selection'
    },
    {
        path: 'golf',
        component: GolfContainer,
        title: 'Darts | Golf'
    },
    {
        path: 'killer',
        component: KillerContainer,
        title: 'Darts | Killer'
    },
];
