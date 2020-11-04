'use strict';

import {AbstractCommand} from "./AbstractCommand";
import {Message} from "discord.js";
import {Score} from "../Tracker/Score";
import {Tracker} from "../Tracker/Tracker";
import {CacheInterface} from "../Cache/CacheInterface";
import {InvalidCommandArgumentsException} from "../Exception/InvalidCommandArgumentException";
import {CacheException} from "../Exception/CacheException";
import {InvalidChannelTrackerException} from "../Exception/InvalidChannelTrackerException";

/**
 * Tracker Command class
 */
export class TrackerCommand extends AbstractCommand
{
    /** @property {CacheInterface} cache */
    private readonly cache: CacheInterface;

    /** @property {boolean} isFixSubCommand */
    private isFixSubCommand: boolean = false;

    /**
     * Class constructor
     */
    public constructor(cache: CacheInterface)
    {
        super();

        this.helpCommands = [
            '!result',
            '!results',
            '!resultat',
            '!resultats',
            '!résultat',
            '!résultats',
        ];

        this.helpParameters = [
            '[fix|view]',
            'nb_victory',
            'nb_defeat',
        ];

        this.cache = cache;
    }

    /**
     * @param {Message} message
     * @return {void}
     */
    public handle(message: Message): void
    {
        try {

            let input: string = message.content;
            let tracker: Tracker = this.getTracker(message);
            let args: any = this.getCommandArguments(input);

            console.log(message.author);

            this.assertChannelCanRegisterResult(tracker, args.isFix);

            if (args.isView) {
                this.handleView(message, tracker);
            } else if (args.isFix) {
                this.handleFix(message, tracker, args.score);
            } else {
                this.handleRegister(message, tracker, args.score);
            }

            this.deleteMessage(message);

        } catch (exception) {

            if (exception instanceof InvalidCommandArgumentsException) {
                console.log(exception.message);

                message.channel.send('Invalid command! Can you retry with the following usage :arrow_down:');
                this.help(message);
                return;
            }

            if (exception instanceof InvalidChannelTrackerException) {
                console.log(exception.message);
                message.channel.send('Ce channel n\'autorise pas l\'enregistrement de résultats. Si c\'est une erreur, veuillez contacter un Planeswalker pour fixer le problème :)');
            }
        }
    }

    /**
     * @param {Message} message
     * @param {Tracker} tracker
     * @return void
     */
    protected handleView(message: Message, tracker: Tracker): void
    {
        message.channel.send(tracker.getScore().toString());
    }

    /**
     * @param {Message} message
     * @param {Tracker} tracker
     * @param {Score} score
     * @return void
     */
    protected handleFix(message: Message, tracker: Tracker, score: Score): void
    {
        //~ Reset score
        tracker.setScore(score);

        //~ Save tracker
        this.save(tracker);

        //~ Display view after fix
        message.channel.send(tracker.getScore().toString());
    }

    /**
     * @param {Message} message
     * @param {Tracker} tracker
     * @param {Score} score
     * @return void
     */
    protected handleRegister(message: Message, tracker: Tracker, score: Score): void
    {
        //~ Add score to the tracker
        tracker.addScore(score);

        //~ Save tracker
        this.save(tracker);

        //~ Display view after register @todo remove
        message.channel.send(tracker.getScore().toString());
    }

    /**
     * @param {string} input
     * @return {object}
     */
    private getCommandArguments(input: string): any
    {
        let args: Array<string> = this.getArguments(input);
        let commandArguments: any = {};

        if (args.length < 1 || args.length > 3) {
            throw new InvalidCommandArgumentsException('The command takes 2 or 3 arguments');
        }

        //~ Check for sub command
        let subCommand: string | null = args[0] ?? null;

        if (subCommand === null || (args.length !== 2 && subCommand !== 'fix' && subCommand !== 'view')) {
            throw new InvalidCommandArgumentsException('Unknown first arguments!');
        }

        commandArguments.isFix      = (subCommand === 'fix');
        commandArguments.isView     = (subCommand === 'view');
        commandArguments.isRegister = (subCommand !== 'fix' && subCommand !== 'view');
        commandArguments.score      = null;

        //~ view sub command, so return
        if (commandArguments.isView) {
            return commandArguments;
        }

        //~ fix command, drop the sub command & continue
        if (commandArguments.isFix) {
            args.shift();
        }

        //~ Get score
        let nbVictory: number = parseInt(args.shift() ?? '0');
        let nbDefeat: number = parseInt(args.shift() ?? '0');

        if (isNaN(nbVictory) || isNaN(nbDefeat)) {
            throw new InvalidCommandArgumentsException('Invalid number of victory or defeats');
        }

        if (nbVictory < 0 || nbVictory > 50 || nbDefeat < 0 || nbDefeat > 50) {
            throw new InvalidCommandArgumentsException('Number of victory or defeat must be in the following range: [0, 50]');
        }

        commandArguments.score = new Score(nbVictory, nbDefeat);

        return commandArguments;
    }

    /**
     * @param {Message} message
     * @return {Tracker}
     */
    private getTracker(message: Message): Tracker
    {
        let tracker: Tracker;

        try {
            tracker = this.load(message.channel.id);
        } catch (exception) {
            tracker = new Tracker(message.channel.id);
        }

        return tracker;
    }

    /**
     * @return {Tracker}
     */
    private load(channelId: string): Tracker
    {
        let data: any = this.cache.get('tracker.' + channelId);

        if (data === null || typeof data !== 'string' ) {
            throw new CacheException('No data or not string data in cache!');
        }

        return Tracker.jsonParse(data);
    }

    /**
     * @param {Tracker} tracker
     * @return void
     */
    private save(tracker: Tracker): void
    {
        this.cache.set('tracker.' + tracker.getId(), tracker.toString());
    }

    /**
     * @param {Tracker} tracker
     * @param {boolean} isFixSubCommand
     * @return void
     */
    private assertChannelCanRegisterResult(tracker: Tracker, isFixSubCommand: boolean): void
    {
        if (!this.cache.has('tracker.' + tracker.getId()) && !isFixSubCommand) {
            throw new InvalidChannelTrackerException('This channel cannot register result!');
        }
    }
}