# MagicLegacy / discord-magic-tracker

Discord Bot to add some command about magic.


## Install
Download latest version and put it on our server.

`~$ tsc && nodemon dist/`

## Config
To enable the bot, you must create a bot application on discord and get the token to put in `secrets.yaml` file

```yaml
discord:

  bot:
    token: 'xxxxxxxxxxxx' # Put your app bot token here

```

## Available commands

### `!ping`
 Basic command to verify if the bot is active & respond correctly
 
 
### `!result`
Command to track result in given channel

#### Alias
 * `!results`
 * `!register`

#### help
You can type `!result` or `!result help` to display the help in discord

 > Command Help: 
 > !result nb_victory nb_defeat
 > !results nb_victory nb_defeat
 > !register nb_victory nb_defeat
