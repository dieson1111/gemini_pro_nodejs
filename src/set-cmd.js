import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

// load environment variables
const TOKEN = process.env.DISCORD_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set commands
const commands = []
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = await fs.readdir(foldersPath)

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
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON())
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

const rest = new REST({}).setToken(TOKEN)
try {
  console.log('Started refreshing application (/) commands.')

  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
    body: commands,
  })

  console.log('Successfully reloaded application (/) commands.')
} catch (error) {
  console.error(error)
}
