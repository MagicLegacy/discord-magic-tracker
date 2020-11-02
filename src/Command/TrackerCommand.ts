'use strict';

import {AbstractCommand} from "./AbstractCommand";
import {Message} from "discord.js";

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

        this.commands = [
            '!result',
            '!results',
            '!register',
        ];

        this.parameters = [
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
        this.debug(message.content);
        this.deleteMessage(message);

        message.channel.send('Tracker command!');
    }
}