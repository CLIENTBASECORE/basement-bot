import { ColorRoleDef, PingRoleDef, ShowRoleDef, DomainMirror } from '../types/index.js';

export const BASEMENT_COLORS = {
  white: 0xffffff,
  pureWhite: 0xffffff,
  silver: 0xd4d4d8,
  platinum: 0xe4e4e7,
  ash: 0xa1a1aa,
  gray: 0x71717a,
  slate: 0x27272a,
  card: 0x18181b,
  charcoal: 0x121214,
  obsidian: 0x010101,
  black: 0x000001,

  // Mapped theme aliases for complete monochrome styling across all embeds
  emerald: 0xffffff, // Primary embed border & accent -> crisp pure white
  mint: 0xf4f4f5,
  cyan: 0xd4d4d8,
  violet: 0xffffff,
  amber: 0xd4d4d8,
  rose: 0x71717a,
  border: 0x27272a,
};

// Aliases for compatibility
export const ZENOX_COLORS = BASEMENT_COLORS;

export const BASEMENT_BRANDING = {
  name: 'Basement',
  wordmark: 'basement.',
  tagline: 'Stream Movies & Series on Basement',
  avatarUrl: 'https://basementx.lol/icon.png',
  bannerUrl: 'https://basementx.lol/og-image.jpg',
  websiteUrl: 'https://basementx.lol',
  supportDiscord: 'https://discord.gg/mYvhW9FNC9',
  version: '2.5.0-PRO',
};

// Aliases for compatibility
export const ZENOX_BRANDING = BASEMENT_BRANDING;

export const DEFAULT_COLOR_ROLES: ColorRoleDef[] = [
  { id: 'pure_white', name: 'Pure White', emoji: '⚪', hex: '#ffffff' },
  { id: 'platinum', name: 'Platinum', emoji: '🪙', hex: '#e4e4e7' },
  { id: 'silver', name: 'Silver', emoji: '🥈', hex: '#d4d4d8' },
  { id: 'ash_gray', name: 'Ash Gray', emoji: '🔘', hex: '#a1a1aa' },
  { id: 'slate', name: 'Slate', emoji: '🗿', hex: '#71717a' },
  { id: 'graphite', name: 'Graphite', emoji: '✏️', hex: '#3f3f46' },
  { id: 'midnight', name: 'Midnight', emoji: '⚫', hex: '#010101' },
];

export const DEFAULT_PING_ROLES: PingRoleDef[] = [
  {
    id: 'content_update',
    name: 'Content Update',
    description: 'New movies, 4K remuxes & trending series released on basementx.lol',
    emoji: '1️⃣',
  },
  {
    id: 'movie_night',
    name: 'Movie Night',
    description: 'Community watch parties, voice room streams & polls',
    emoji: '2️⃣',
  },
  {
    id: 'site_updates',
    name: 'Site Updates',
    description: 'Domain mirrors, player fixes, scraper health & alerts',
    emoji: '3️⃣',
  },
];

export const DEFAULT_SHOW_ROLES: ShowRoleDef[] = [
  { id: 'love_island', name: 'Love Island', emoji: '🏝️', genre: 'Reality TV', memberCount: 1420 },
  { id: 'the_mentalist', name: 'The Mentalist', emoji: '🧠', genre: 'Mystery / Crime', memberCount: 890 },
  { id: 'the_rookie', name: 'The Rookie', emoji: '🚓', genre: 'Police Procedural', memberCount: 1150 },
  { id: 'prison_break', name: 'Prison Break', emoji: '⛓️', genre: 'Action / Thriller', memberCount: 1730 },
  { id: 'rick_and_morty', name: 'Rick and Morty', emoji: '🧪', genre: 'Sci-Fi / Animation', memberCount: 2310 },
  { id: 'reacher', name: 'Reacher', emoji: '👊', genre: 'Crime / Action', memberCount: 1640 },
  { id: 'stranger_things', name: 'Stranger Things', emoji: '🚲', genre: 'Sci-Fi / Horror', memberCount: 2840 },
  { id: 'the_boys', name: 'The Boys', emoji: '⚡', genre: 'Superhero / Satire', memberCount: 1980 },
];

export const DEFAULT_MIRRORS: DomainMirror[] = [
  { domain: 'basementx.lol', region: 'Global Official Site', status: 'active', isOfficial: true, cloudflareProtected: true },
  { domain: 'stream.basementx.lol', region: 'Ultra-Fast HLS Playback Server', status: 'active', isOfficial: true, cloudflareProtected: true },
  { domain: 'proxy.basementx.lol', region: 'Anti-ISP DNS Bypass Gateway', status: 'active', isOfficial: true, cloudflareProtected: true },
  { domain: 'cdn.basementx.lol', region: 'Multi-CDN 4K Edge Node', status: 'active', isOfficial: true, cloudflareProtected: true },
  { domain: 'mirror.basementx.lol', region: 'Emergency Failover Mirror', status: 'backup', isOfficial: true, cloudflareProtected: true },
];
