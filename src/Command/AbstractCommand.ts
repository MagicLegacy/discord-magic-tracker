import {Message} from "discord.js";
import {CommandInterface} from "./CommandInterface";

/**
 * Abstract Command class
 */
export abstract class AbstractCommand implements CommandInterface
{
    /** @property {string[]} helpCommands */
    protected helpCommands: Array<string> = [];

    /** @property {string[]} helpParameters */
    protected helpParameters: Array<string> = [];

    /**
     * @param {Message} message
     * @return {void}
     */
    abstract handle(message: Message): void;

    /**
     * @param {string} input
     * @return {boolean}
     */
    public support(input: string): boolean
    {
        return (this.helpCommands.includes(this.getCommand(input)));
    }

    /**
     * @param {Message} message
     * @return {void}
     */
    public help(message: Message): void
    {
        let help: Array<string> = [];

        help.push('> **Command Help: **');
        for(let index = 0; index < this.helpCommands.length; index++) {
            if (this.helpParameters.length > 0) {
                help.push('> `' + this.helpCommands[index] + ' ' + this.helpParameters.join(' ') + '`');
            } else {
                help.push('> `' + this.helpCommands[index] + '`');
            }
        }

        this.deleteMessage(message);
        message.channel.send(help.join("\n"));
    }

    /**
     * @param {string} input
     * @return {boolean}
     */
    public needHelp(input: string): boolean
    {
        let commandArguments: Array<string> = this.getArguments(input);

        if (commandArguments.length === 0) {
            return true;
        }

        return (commandArguments[0] === 'help' || commandArguments[0] === 'aide');
    }

    /**
     * @param message
     * @protected
     */
    protected deleteMessage(message: Message): void
    {
        let command: string = this.getCommand(message.content);

        // Delete a message
        message.delete()
            .then(msg => console.log(`Deleted command from ${msg.author.username} (command: ${command})`))
            .catch(console.error);
    }

    /**
     * @param {string} input
     * @return {string}
     */
    protected getCommand(input: string): string
    {
        let inputs: Array<string> = this.parseInput(input, 1);

        return inputs[0];
    }

    /**
     * @param {string} input
     * @return {string[]}
     */
    protected getArguments(input: string): Array<string>
    {
        let inputs: Array<string> = this.parseInput(input);

        //~ Remove command
        inputs.shift();

        return inputs;
    }

    /**
     * @param {string} input
     * @protected
     */
    protected debug(input: string): void
    {
        let command: string = this.getCommand(input);
        let commandArguments: Array<string> = this.getArguments(input);
        let commandArgumentsString: string = '';

        for (let index = 0; index < commandArguments.length; index++) {
            commandArgumentsString += ' p:' + commandArguments[index];
        }

        console.log('command: ' + command + commandArgumentsString);
    }

    /**
     * @param {string} input
     * @param {number} elements
     * @return {string[]}
     * @protected
     */
    protected parseInput(input: string, elements: number | null = null): Array<string>
    {
        if (elements !== null) {
            return input.split(' ', elements);
        }

        return input.split(' ');
    }
}