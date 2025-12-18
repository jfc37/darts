import { Injectable } from '@angular/core';
import { OhOneGamePhase } from '../../domain-objects/oh-one/oh-one-game-phase';
import { OhOnePlayer } from '../../domain-objects/oh-one/oh-one-player';
import { OhOneSettings } from '../../domain-objects/oh-one/oh-one-settings';
import { Hit } from '../../domain-objects/hit';

@Injectable({
    providedIn: 'root'
})
export class OhOneGameService {

    constructor() { }

    public createGame(): OhOneGame {
        return OhOneGame.InitialseNewGame();
    }
}


export class OhOneGame {
    public phase: OhOneGamePhase = OhOneGamePhase.SelectPlayers;
    public players!: OhOnePlayer[];
    private history: OhOneSnapshot[] = [];

    public get activePlayer() {
        return this.players.find(x => x.isActive)!;
    }

    private _settings: OhOneSettings = OhOneSettings.getSettings();

    private constructor() {

    }

    public setPlayers(players: string[]) {
        this.players = players.map(player => OhOnePlayer.NewPlayer(player));
        this.players[0].isActive = true;
        this.phase = OhOneGamePhase.SelectSettings;
    }

    public setSettings(settings: OhOneSettings) {
        OhOneSettings.setSettings(settings);
        this._settings = OhOneSettings.getSettings();
        this.players.forEach(player => player.points = this._settings.startingPoints);

        this.phase = OhOneGamePhase.Play;
    }

    public recordRound(hits: Hit[]) {
        this.saveSnapshot();
        this.activePlayer.recordRound(hits);

        if (this.activePlayer.points == 0) {
            this.phase = OhOneGamePhase.GameOver;
            return;
        }

        this.changeToNextPlayer();
    }

    public undoLastTurn() {
        const previous = this.history.pop();
        if (!previous) {
            return;
        }

        this.players = previous.players.map(player => {
            const clone = OhOnePlayer.NewPlayer(player.name);
            clone.isActive = player.isActive;
            clone.points = player.points;
            clone.busts = player.busts;
            return clone;
        });
        this.phase = previous.phase;
    }

    public get canUndo() {
        return this.history.length > 0;
    }

    public static InitialseNewGame(): OhOneGame {
        return new OhOneGame();
    }

    private changeToNextPlayer() {
        const currentPlayerIndex = this.players.indexOf(this.activePlayer);
        this.activePlayer.isActive = false;
        const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
        this.players[nextPlayerIndex].isActive = true;
    }

    private saveSnapshot() {
        this.history.push({
            phase: this.phase,
            players: this.players.map(player => ({
                name: player.name,
                points: player.points,
                busts: player.busts,
                isActive: player.isActive
            }))
        });
    }
}

interface OhOneSnapshot {
    phase: OhOneGamePhase;
    players: {
        name: string;
        points: number;
        busts: number;
        isActive: boolean;
    }[];
}




