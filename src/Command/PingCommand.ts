import {AbstractCommand} from "./AbstractCommand";
import {Message} from "discord.js";

/**
 * Ping Command class
 */
export class PingCommand extends AbstractCommand
{
    /**
     * Class constructor
     */
    public constructor()
    {
        super();

        this.helpCommands = [
            '!ping',
        ];

        this.helpParameters = [];
    }

    /**
     * @param {Message} message
     * @return {void}
     */
    public handle(message: Message): void
    {
        this.debug(message.content);
        this.deleteMessage(message);

        message.channel.send('Hey, how are you ?');
    }

    /**
     * @param {string} input
     * @return {boolean}
     */
    public needHelp(input: string): boolean
    {
        return false;
    }
}