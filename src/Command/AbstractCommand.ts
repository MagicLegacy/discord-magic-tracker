import {Message} from "discord.js";
import {CommandInterface} from "./CommandInterface";

/**
 * Abstract Command class
 */
export abstract class AbstractCommand implements CommandInterface
{
    /** @property {string[]} commands */
    protected commands: Array<string> = [];

    /** @property {string[]} parameters */
    protected parameters: Array<string> = [];

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
        return (this.commands.includes(this.getCommand(input)));
    }

    /**
     * @param {Message} message
     * @return {void}
     */
    public help(message: Message): void
    {
        let help: Array<string> = [];

        help.push('> **Command Help: **');
        for(let index = 0; index < this.commands.length; index++) {
            if (this.parameters.length > 0) {
                help.push('> `' + this.commands[index] + ' ' + this.parameters.join(' ') + '`');
            } else {
                help.push('> `' + this.commands[index] + '`');
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
        let parameters: Array<string> = this.getParameters(input);

        if (parameters.length === 0) {
            return true;
        }

        return (parameters[0] === 'help' || parameters[0] === 'aide');
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
    protected getParameters(input: string): Array<string>
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
        let parameters: Array<string> = this.getParameters(input);
        let parametersString: string = '';

        for (let index = 0; index < parameters.length; index++) {
            parametersString += ' p:' + parameters[index];
        }

        console.log('command: ' + command + parametersString);
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