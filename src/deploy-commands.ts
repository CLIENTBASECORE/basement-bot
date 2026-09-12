import { REST, Routes } from 'discord.js';
import { ALL_COMMANDS } from './commands/index.js';
import { CONFIG } from './config.js';

export async function deployCommands(): Promise<void> {
  if (!CONFIG.DISCORD_TOKEN) {
    console.warn('[Basement Deploy] No DISCORD_TOKEN provided. Skipping slash command deployment to Discord Gateway.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(CONFIG.DISCORD_TOKEN);
  const commandData = ALL_COMMANDS.map(c => c.data.toJSON());

  try {
    console.log(`[Basement Deploy] Registering ${commandData.length} application (/) commands...`);

    if (CONFIG.GUILD_ID) {
      // Clear any previous global commands to prevent duplicate entries in the server
      console.log('[Basement Deploy] Purging any legacy global commands to prevent duplication...');
      await rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), { body: [] });
      console.log('[Basement Deploy] Global commands cleared.');

      // Guild-specific registration (instant propagation)
      await rest.put(
        Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
        { body: commandData }
      );
      console.log(`[Basement Deploy] Successfully registered ${commandData.length} unique commands to Guild: ${CONFIG.GUILD_ID}`);
    } else {
      // Global registration
      await rest.put(
        Routes.applicationCommands(CONFIG.CLIENT_ID),
        { body: commandData }
      );
      console.log('[Basement Deploy] Successfully registered commands globally.');
    }
  } catch (error) {
    console.error('[Basement Deploy] Error deploying slash commands:', error);
  }
}

// Allow direct execution: `node dist/deploy-commands.js`
if (process.argv[1]?.endsWith('deploy-commands.ts') || process.argv[1]?.endsWith('deploy-commands.js')) {
  deployCommands();
}
