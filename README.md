# ⚡ BASEMENT | Pure Discord Cinema Bot

<div align="center">
  <h3>basement. • Stream Movies & Series</h3>
  <p>Ultra-sleek, aesthetic Discord Bot tailored for the <a href="https://basementx.lol">basementx.lol</a> streaming community.</p>
</div>

---

## 🌌 Overview & Features

* **Visual Identity**: Pitch-black canvas (`#080808`), dark slate glass embeds, Outfit & Inter typography, and emerald neon accents (`#22c55e`).
* **100% Native Discord Experience**: Pure standalone Discord bot with zero external dashboard requirements.
* **Custom Prefix Support (`!`) & Slash Commands (`/`)**: Use standard slash commands or lightning-fast custom prefix commands (e.g. `!help`, `!movie`, `!random action`, `!status`, `!prefix <symbol>`).
* **Interactive Help Menu**: Rich, 4-page categorized embed manual with buttons to jump between categories or browse page-by-page.
* **Live TMDB Catalog Integration**:
  - Live TMDB daily trending chart (`/trending`, `!trending`) with verified ratings and review counts.
  - Dynamic `/random` (and `!random <genre>`) pulling real titles by genre (Action, Comedy, Horror, Sci-Fi, Drama, etc.) or sampled across live Trending, Popular, and Top-Rated pools.
* **Community Watch Parties**:
  - Click **🍿 Host Watch Party** on any movie card to instantly spawn a community event with live countdowns, real-time attendee RSVPs, and direct links to the **Basement Watch Party Room**.
* **Cinema AI Assistant (`/chat` & Mentions)**: Intelligent conversational cinema concierge for movie trivia, genre recommendations, streaming advice, and platform guides.
* **Bot Dispatcher (`/say`)**: Allows server administrators to speak or broadcast styled embeds through Basement into any channel.
* **Public Community Requests (`/request` & `/requests`)**:
  - `/request`: Submit titles to be added to the Basement catalog (posts an interactive request ticket).
  - `/requests list`: Community board showing pending, approved, and added titles.
  - Interactive staff buttons (**Approve**, **Mark Added**, **Reject**) to resolve tickets with automatic user DM notifications.
* **Server Setup & Administration (`/adminsetup`)**:
  - Auto-creates and syncs 7 neon color roles (`Pink`, `Purple`, `Blue`, `Green`, `Orange`, `Yellow`, `Red`).
  - Auto-provisions TV show / movie discussion access roles.
  - Configures dedicated admin chat channel, media requests routing, and custom prefix.
* **Admin Exclusivity & Security**:
  - All admin commands (`/say`, `/announce`, `/panel`, `/adminsetup`, `/requests resolve`) strictly require **Administrator** permissions and are enforced to run exclusively within the configured **Admin Chat Channel**.

---

## 🛠️ Commands

### 🍿 Public Community Commands (Usable in All Channels by Everyone)
| Slash Command | Prefix Format | Description |
| :--- | :--- | :--- |
| **`/help`** | `!help [category]` | Interactive categorized command manual with navigation buttons |
| **`/search`** | `!search <query>` / `!movie <title>` | Search TMDB & basementx.lol catalog with direct 4K stream links |
| **`/trending`** | `!trending` / `!top` | View today's top 5 trending movies and series on Basement (live TMDB) |
| **`/random`** | `!random [genre]` / `!roll` | Curated dynamic high-rated title (e.g. `!random action`, `!random comedy`) |
| **`/request`** | `!request <type> <title> \| [notes]` | Request a title to be added (posts a public request card) |
| **`/requests`** | `!requests [list]` | View community requests and live catalog approval status |
| **`/watchparty`** | `!watchparty <title> \| <minutes> \| [link]` | Host a synced watch party with interactive RSVP buttons |
| **`/nowplaying`** | `!nowplaying <title> \| [year] \| [quality]` | Broadcast what you are currently watching to the community feed |
| **`/status`** | `!status` / `!ping` | Check official streaming platform health for basementx.lol |
| **`/domain`** | `!domain` / `!site` | Get working anti-ISP streaming mirrors and direct CDNs |
| **`/chat`** | `!chat <prompt>` *(or ping `@Basement`)* | Talk with Basement cinema AI assistant |
| **`/botinfo`** | `!botinfo` | View bot gateway latency, process uptime, and system telemetry |

### 🛡️ Administrator Commands (Restricted to Admin Chat)
| Slash Command | Prefix Format | Description |
| :--- | :--- | :--- |
| **`/say`** | `!say <#channel> <message>` | Send a message or styled embed through Basement |
| **`/requests resolve`** | `!requests resolve <id> <status> [notes]` | Approve, add, or reject a request ticket |
| **`/announce`** | `!announce <#channel> <title> \| <message>` | Broadcast a cinema-grade announcement embed |
| **`/panel`** | `!panel <type> [#channel]` | Deploy color picker, notification pings, or TV show panels |
| **`/adminsetup`** | `!adminsetup <subcommand>` | Full server configuration suite |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your Discord credentials:
```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here
GUILD_ID=your_discord_guild_id_here
ADMIN_CHANNEL_ID=your_admin_chat_channel_id_here
TMDB_API_KEY=your_tmdb_api_key_here
BASEMENT_BASE_URL=https://basementx.lol
```

### 3. Build & Run
```bash
npm run build
npm start
```
