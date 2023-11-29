import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "discord.js";
import { Routes } from 'discord-api-types/v10';

import "../init";

const commands = [
  new SlashCommandBuilder()
    .setName("analyze")
    .addStringOption((option) =>
      option
        .setName("log")
        .setDescription("A WarcraftLogs link.")
        .setRequired(true)
    )
    .setDescription("Get a link to WoWAnalyzer for this log."),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!), {
  body: commands,
});
