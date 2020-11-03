'use strict';

import {Config} from "./Config/Config";
import {DiscordClient} from "./Client/DiscordClient";
import {CommandCollection} from './Command/CommandCollection';
import {PingCommand} from "./Command/PingCommand";
import {TrackerCommand} from "./Command/TrackerCommand";


let config = new Config('./config');

let commands: CommandCollection = new CommandCollection();
commands.push(new TrackerCommand());
commands.push(new PingCommand());

let client: DiscordClient = new DiscordClient(commands, config.get('secrets', 'discord'));
client.start();

