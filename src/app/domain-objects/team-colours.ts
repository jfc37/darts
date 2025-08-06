/**
 * Colours for two teams
 * Allows toggling of team colours
 */
export const TeamColours = {
    _colours: [
        '#0094C6',
        '#A14A76'
    ],

    getForTeam: function (teamNumber: number): string {
        return this._colours[teamNumber];
    },

    teamTwo: function () {
        return this._colours[1];
    },

    toggleColours: function () {
        const newTeam2Colour = this._colours[0];
        const newTeam1Colour = this._colours[1];
        this._colours[0] = newTeam1Colour;
        this._colours[1] = newTeam2Colour;
    }
}