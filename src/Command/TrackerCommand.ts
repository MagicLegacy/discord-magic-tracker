'use strict';

import {AbstractCommand} from "./AbstractCommand";
import {Message} from "discord.js";
import {Score} from "../Tracker/Score";

/**
 * Tracker Command class
 */
export class TrackerCommand extends AbstractCommand
{
    /**
     * Class constructor
     */
    public constructor()
    {
        super();

        this.helpCommands = [
            '!result',
            '!results',
        ];

        this.helpParameters = [
            'nb_victory',
            'nb_defeat',
        ];
    }

    /**
     * @param {Message} message
     * @return {void}
     */
    public handle(message: Message): void
    {
        let input: string = message.content;

        this.debug(input);

        let score: Score | null = this.getScore(input);

        if (score === null) {
            message.channel.send('Invalid command! Can you retry with the following usage :arrow_down:');

            this.help(message);
            return;
        }

        message.channel.send('Score: ' + score.getNbVictory() + ' ' + score.getNbDefeat() + ' (win rate: ' + score.getWinRatePercent() + ')');

        this.deleteMessage(message);
    }

    /**
     *
     * @param input
     */
    private getScore(input: string): Score | null
    {
        let parameters: Array<string> = this.getParameters(input);

        if (parameters.length !== 2) {
            return null;
        }

        let nbVictory: number = parseInt(parameters.shift() ?? '0');
        let nbDefeat: number = parseInt(parameters.shift() ?? '0');

        if (isNaN(nbVictory) || isNaN(nbDefeat)) {
            return null;
        }

        if (nbVictory < 0 || nbVictory > 50 || nbDefeat < 0 || nbDefeat > 50) {
            return null;
        }

        return new Score(nbVictory, nbDefeat);
    }
}