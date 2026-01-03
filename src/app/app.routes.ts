import { Routes } from '@angular/router';
import { GameSelectionContainer } from './pages/game-selection/game-selection.container';
import { KillerContainer } from './pages/killer/killer.container';
import { GolfContainer } from './pages/golf/golf.container';
import { TargetPracticeContainer } from './pages/target-practice/target-practice.container';
import { TeamGolfContainer } from './pages/team-golf/team-golf.container';
import { MultiplierPracticeContainer } from './pages/multiplier-practice/multiplier-practice.container';
import { CricketContainer } from './pages/cricket/cricket.container';
import { OhOneContainer } from './pages/oh-one/oh-one.container';
import { KillerPracticeContainer } from './pages/killer-practice/killer-practice.container';

export const routes: Routes = [
    {
        path: '',
        component: GameSelectionContainer,
        title: 'Darts | Game Selection'
    },
    {
        path: '01',
        component: OhOneContainer,
        title: 'Darts | 01'
    },
    {
        path: 'cricket',
        component: CricketContainer,
        title: 'Darts | Cricket'
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
        path: 'killer-practice',
        component: KillerPracticeContainer,
        title: 'Darts | Killer Practice'
    },
    {
        path: 'target-practice',
        component: TargetPracticeContainer,
        title: 'Darts | Target Practice'
    },
    {
        path: 'multiplier-practice',
        component: MultiplierPracticeContainer,
        title: 'Darts | Multiplier Practice'
    },
];
