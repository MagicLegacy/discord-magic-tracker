
export class Score
{
    /** @property {number} nbVictory */
    private nbVictory: number = 0;

    /** @property {number} nbDefeat */
    private nbDefeat: number = 0;

    /**
     * Class constructor
     *
     * @param {number} nbVictory
     * @param {number} nbDefeat
     */
    public constructor(nbVictory: number, nbDefeat: number)
    {
        this.nbVictory = nbVictory;
        this.nbDefeat  = nbDefeat;
    }

    /**
     * Add score to current score.
     *
     * @param {Score} score
     */
    public addScore(score: Score): void
    {
        this.nbVictory += score.getNbVictory();
        this.nbDefeat  += score.getNbDefeat();
    }

    /**
     * return {string}
     */
    public getWinRate(): string
    {
        let nbMatches: number = this.getNbMatches();

        if (nbMatches === 0) {
            return '-';
        }

        let percent: number = (this.nbVictory / nbMatches) * 100;

        return percent.toPrecision(4) + '%';
    }

    /**
     * @return {number}
     */
    public getNbVictory(): number
    {
        return this.nbVictory;
    }

    /**
     * @return {number}
     */
    public getNbDefeat(): number
    {
        return this.nbDefeat;
    }

    /**
     * @return {number}
     */
    public getNbMatches(): number
    {
        return (this.nbVictory + this.nbDefeat);
    }

    public toString(): string
    {
        return '> **Résultat cumulés** : `' + this.getNbVictory() + '-' + this.getNbDefeat() +
            '`, soit un winrate de `' + this.getWinRate() + '` sur `' + this.getNbMatches() + '` parties'
        ;
    }
}