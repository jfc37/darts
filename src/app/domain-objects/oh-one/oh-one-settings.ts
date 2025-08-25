/**
 * Different settings for an oh one game
 */
export class OhOneSettings {
    public startingPoints: number = 8;
    public canExitOnASingle: boolean = false;
    public canExitOnADouble: boolean = true;
    public canExitOnATriple: boolean = true;

    public static setSettings(settings: OhOneSettings) {
        SETTINGS = settings;
    }

    public static getSettings(): OhOneSettings {
        return SETTINGS;
    }
}

let SETTINGS = new OhOneSettings();