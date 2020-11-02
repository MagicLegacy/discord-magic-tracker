'use strict';

import {CommandCollection} from './Command/CommandCollection';
import {PingCommand} from "./Command/PingCommand";
import {TrackerCommand} from "./Command/TrackerCommand";
import {CommandInterface} from "./Command/CommandInterface";
import Discord from "discord.js";

// Create an instance of a Discord client
const client = new Discord.Client();

let commands: CommandCollection = new CommandCollection();
commands.push(new TrackerCommand());
commands.push(new PingCommand());


//~ Listen for app ready
client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {

    let input: string = message.content;
    let command: CommandInterface | null = commands.getCommand(message.content);

    //~ Not a command, skip
    if (command === null) {
        console.log('skip non command message: ' + message.content);
        return;
    }

    //~ Command need help, display the help
    if (command.needHelp(input)) {
        command.help(message);
        return;
    }

    //~ Otherwise, analyse & handle command
    command.handle(message);
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('xxxxxxxx');
