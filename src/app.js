import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// load environment variables
const token = process.env.DISCORD_TOKEN;

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// define the discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// set commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = await fs.readdir(foldersPath);
// console.log(`Loading commands from ${foldersPath}`);
// console.log(`Found command folders: ${commandFolders.join(", ")}`);

// Load all commands
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = await fs.readdir(commandsPath);
  for (const file of commandFiles) {
    if (file.endsWith(".js")) {
      const commandName = file.replace(".js", "");
      const filePath = path.join("file:///", commandsPath, file);
      try {
        // Import the command
        const command = (await import(filePath))[commandName];
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        console.error(`Error importing command from ${filePath}:`, error);
      }
    }
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
