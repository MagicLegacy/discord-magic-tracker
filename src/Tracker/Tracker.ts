'use strict';

import {Score} from "./Score";
import {CacheException} from "../Exception/CacheException";

/**
 * Class tracker
 */
export class Tracker
{
    /** @property {string} id */
    private readonly id: string = '';

    /** @property {Score} score */
    private score: Score;

    /** @property {number} timestamp */
    private timestamp: number;

    /**
     * Class constructor
     *
     * @param {string} id
     * @param {number} timestamp
     */
    public constructor(id: string, timestamp: number | null = null)
    {
        this.id    = id;
        this.score = new Score(0, 0);

        this.timestamp = timestamp ?? Date.now();
    }

    /**
     * @return {string}
     */
    public getId(): string
    {
        return this.id;
    }

    /**
     * @return {Score}
     */
    public getScore(): Score
    {
        return this.score;
    }

    /**
     * @return {number}
     */
    public getTimestamp(): number
    {
        return this.timestamp;
    }

    /**
     * @param {Score} score
     * @param {boolean} doResetTimestamp
     * @return void
     */
    public addScore(score: Score, doResetTimestamp: boolean = true): void
    {
        this.score.addScore(score);

        if (doResetTimestamp) {
            this.resetTimestamp();
        }
    }

    /**
     * @param {Score} score
     * @return void
     */
    public setScore(score: Score): void
    {
        this.score = score;

        this.resetTimestamp();
    }

    /**
     * @return void
     */
    public resetTimestamp(): void
    {
        this.timestamp = Date.now();
    }

    /**
     * @return string
     */
    public toString(): string
    {
        return JSON.stringify({
            id: this.getId(),
            timestamp: this.getTimestamp(),
            score: {
                nbVictory: this.getScore().getNbVictory(),
                nbDefeat: this.getScore().getNbDefeat()
            }
        });
    }

    /**
     *
     * @param {string} json
     */
    public static jsonParse(json: string): Tracker
    {
        let object: any = JSON.parse(json);
        let tracker: Tracker;

        if (object.id === undefined || object.id === null) {
            throw new CacheException('Invalid cache json tracker object');
        }

        tracker = new Tracker(object.id, object.timestamp ?? null);
        tracker.addScore(new Score(object.score.nbVictory ?? 0, object.score.nbDefeat ?? 0), false);

        return tracker;
    }
}