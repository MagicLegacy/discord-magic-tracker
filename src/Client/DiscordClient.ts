import Discord, {Client, Message} from "discord.js";
import {CommandInterface} from "../Command/CommandInterface";
import {CommandCollection} from "../Command/CommandCollection";

/**
 * Discord Client
 */
export class DiscordClient
{
    /** @property {Client} client */
    private readonly client: Client;

    /** @property {CommandCollection} commands */
    private readonly commands: CommandCollection;

    /** @property {any} config */
    private readonly config: any;

    /**
     * Class constructor
     */
    public constructor(commands: CommandCollection, config: any)
    {
        this.client = new Discord.Client();
        this.client.on('ready', this.onReady);
        this.client.on('message', message => this.onMessage(message));

        this.config   = config;
        this.commands = commands;
    }

    /**
     * start client
     */
    public start(): void
    {
        this.client.login(this.config.bot.token);
    }

    /**
     * When client is ready
     */
    public onReady(): void
    {
        console.log('I am ready :)');
    }

    /**
     * @param message
     */
    public onMessage(message: Message): void
    {
        let input: string = message.content;
        let command: CommandInterface | null = this.commands.getCommand(input);

        //~ Not a command, skip
        if (command === null) {
            console.log('skip non command message: ' + input);
            return;
        }

        //~ Command need help, display the help
        if (command.needHelp(input)) {
            command.help(message);
            return;
        }

        //~ Otherwise, analyse & handle command
        command.handle(message);
    }
}