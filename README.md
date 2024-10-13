# Discord Study Bot

A Discord bot designed to help students study by providing various features such as flashcards and reminders.

## Features
- Create, manage, and quiz yourself on flashcards.
- Set reminders.
- More to be added soon.

## Prerequisites
You will need to have met the following:
- You have installed [Node.js](https://nodejs.org/en/download/).
- You have a Discord account and have created a bot on the [Discord Developer Portal](https://discord.com/developers/applications).

## Setup
1. **Clone the repository**  
   Clone this repo:

   ```bash
   git clone https://github.com/BowlerM/Study-Bot.git

2. **Install Dependencies**
    To install the dependencies required for this bot run:

   ```bash
   npm install

4. **Configuration**
    Create a `config.json` file within the `/src` folder using `/src/config-sample.json` as a template for your config file.

## Running the bot
To run the bot use:

```bash
node index.js
```

## Deploying commands
Every time you modify an existing command or add/remove a command run:

```bash
node deploy-commands.js
```
To deploy the command changes to the bot
