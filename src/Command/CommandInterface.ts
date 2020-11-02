import {Message} from "discord.js";

export interface CommandInterface
{
    /**
     * @param {string} input
     * @return {void}
     */
    support(input: string): boolean;

    /**
     * @param {Message} message
     * @return {void}
     */
    handle(message: Message): void;

    /**
     * @param {Message} message
     * @return {void}
     */
    help(message: Message): void;

    /**
     * @param {string} input
     * @return {boolean}
     */
    needHelp(input: string): boolean;
}