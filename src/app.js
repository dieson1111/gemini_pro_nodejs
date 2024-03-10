import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

// load environment variables
const token = process.env.DISCORD_TOKEN

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// define the discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

// set commands
client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = await fs.readdir(foldersPath)
// console.log(`Loading commands from ${foldersPath}`);
// console.log(`Found command folders: ${commandFolders.join(", ")}`);

// Load all commands
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = await fs.readdir(commandsPath)
  for (const file of commandFiles) {
    if (file.endsWith('.js')) {
      const commandName = file.replace('.js', '')
      const filePath = path.join('file:///', commandsPath, file)
      try {
        // Import the command
        const command = (await import(filePath))[commandName]
        console.log(`Registering command: ${commandName}`)
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command)
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          )
        }
      } catch (error) {
        console.error(`Error importing command from ${filePath}:`, error)
      }
    }
  }
}

// load all events
const eventFiles = (await fs.readdir(path.join(__dirname, 'events'))).filter(
  (file) => file.endsWith('.js')
)

for (const file of eventFiles) {
  const eventName = file.replace('.js', '')
  const filePath = path.join('file:///', __dirname, 'events', file)
  const event = (await import(filePath))[eventName]
  console.log(`Registering event: ${eventName}`)
  // console.log(event)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
}

client.login(token)
