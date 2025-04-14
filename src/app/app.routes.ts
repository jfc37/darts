import { Routes } from '@angular/router';
import { GameSelectionContainer } from './pages/game-selection/game-selection.container';
import { KillerContainer } from './pages/killer/killer.container';
import { GolfContainer } from './pages/golf/golf.container';
import { TargetPracticeContainer } from './pages/target-practice/target-practice.container';
import { TeamGolfContainer } from './pages/team-golf/team-golf.container';

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
        path: 'team-golf',
        component: TeamGolfContainer,
        title: 'Darts | Golf 2v2'
    },
    {
        path: 'killer',
        component: KillerContainer,
        title: 'Darts | Killer'
    },
    {
        path: 'target-practice',
        component: TargetPracticeContainer,
        title: 'Darts | Target Practice'
    },
];
