/**
 * Different settings for a golf game
 */
export class GolfSettings {
    public numberOfHoles: number = 18;

    // If true, triples are worth -3 strokes
    // Otherwise, triples are worth -2 strokes
    public albatrossOnTriple: boolean = false;

    public static setSettings(settings: GolfSettings) {
        SETTINGS = settings;
    }

    public static getSettings(): GolfSettings {
        return SETTINGS;
    }
}

let SETTINGS = new GolfSettings();