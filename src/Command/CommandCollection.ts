/**
 * Class CommandCollection
 */
import {CommandInterface} from "./CommandInterface";

export class CommandCollection
{
    /** @property {string} command */
    private commands: Array<CommandInterface> = [];

    /**
     * @param {CommandInterface} command
     * @return {void}
     */
    public push(command: CommandInterface): void
    {
        this.commands.push(command);
    }

    /**
     * @return {CommandInterface}|null
     */
    public pop(): CommandInterface | null
    {
        let command: CommandInterface | undefined = this.commands.pop();

        if (!command) {
            return null;
        }

        return command;
    }

    /**
     * @param input
     * @return {CommandInterface}|null
     */
    public getCommand(input: string): CommandInterface | null
    {
        let numberOfCommands: number = this.commands.length;
        for(let index: number = 0; index < numberOfCommands; index++) {
            if (this.commands[index].support(input)) {
                return this.commands[index];
            }
        }

        return null;
    }
}
