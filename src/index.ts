'use strict';

import {Config} from "./Config/Config";
import {DiscordClient} from "./Client/DiscordClient";
import {CommandCollection} from './Command/CommandCollection';
import {PingCommand} from "./Command/PingCommand";
import {TrackerCommand} from "./Command/TrackerCommand";
import {CacheFilesystem} from "./Cache/CacheFilesytem";


let config = new Config('./config');
let cache  = new CacheFilesystem('./cache');

let commands: CommandCollection = new CommandCollection();
commands.push(new TrackerCommand(cache));
commands.push(new PingCommand());

let client: DiscordClient = new DiscordClient(commands, config.get('secrets', 'discord'));
client.start();

