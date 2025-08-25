/**
 * Represents the current phase of the game
 */
export enum OhOneGamePhase {
    SelectPlayers = 'select-players',

    SelectSettings = 'select-settings',

    /**
     * Playing the game
     */
    Play = 'play',

    /**
     * The game has ended
     */
    GameOver = 'game-over'
}