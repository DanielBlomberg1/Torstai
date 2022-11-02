# Torstai
DiscordJS bot, intended to be used with voice commands

# How to install

###### 1 create .env file from .env.example with your discord api token
###### 2 create mongodb cluster and get a connection token for .env file
###### 3 npm install
###### 4 npm start

# Usage In your server

###### First of all you should configure the bot with /configure, 
###### if you want the bot to communicate with your music bot make sure to add command prefix that it uses.
###### The bot should now follow you around the server.

# Words that it currently Knows

## Soita
###### calls the play command of the music bot

## Skippaa / Banaani on
###### calls the skip command of the music bot

## tyhjennä
###### calls the clear command of the music bot

# Language Settings

###### Default language detection is for Finnish 
###### To change this go to src/Bot.ts and change it there to your preferred value eq. en_US
###### Almost all commands are made with finnish in mind but some ones might with other languages too use with discretion
