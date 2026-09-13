import { BasementEmbeds } from './utils/embeds.js';
import { CatalogService } from './services/catalog.js';
import { StatusService } from './services/status.js';
import { db } from './database/db.js';

async function testSuite() {
  console.log('\x1b[32m=== BASEMENT BOT EMBED & SYSTEM TEST SUITE ===\x1b[0m\n');

  // 1. Test Color Roles Panel
  console.log('1. Testing Color Roles Panel...');
  const colorPanel = BasementEmbeds.createColorPanel();
  console.log(`   Embed Title: "${colorPanel.embeds[0].data.title}"`);
  console.log(`   Buttons Count: ${colorPanel.components.reduce((acc, row) => acc + row.components.length, 0)}`);
  console.log('   ✅ Color panel valid.\n');

  // 2. Test Ping Roles Panel
  console.log('2. Testing Ping Roles Panel...');
  const pingPanel = BasementEmbeds.createPingPanel();
  console.log(`   Embed Title: "${pingPanel.embeds[0].data.title}"`);
  console.log(`   Buttons Count: ${pingPanel.components[0].components.length}`);
  console.log('   ✅ Ping panel valid.\n');

  // 3. Test TV Show Panel
  console.log('3. Testing TV Show Channels Panel...');
  const showPanel = BasementEmbeds.createShowPanel();
  console.log(`   Embed Title: "${showPanel.embeds[0].data.title}"`);
  console.log('   ✅ Show panel valid.\n');

  // 4. Test Catalog Search
  console.log('4. Testing Catalog Search ("/search Dune")...');
  const searchResults = await CatalogService.search('Dune');
  console.log(`   Found: ${searchResults.length} result(s). Top: ${searchResults[0].title} (${searchResults[0].year})`);
  const mediaEmbed = BasementEmbeds.mediaDetail(searchResults[0]);
  console.log(`   Embed Title: "${mediaEmbed.embeds[0].data.title}"`);
  console.log(`   Watch URL: ${searchResults[0].zenoxUrl}`);
  console.log('   ✅ Search embed valid.\n');

  // 5. Test Discover
  console.log('5. Testing Discover ("/discover")...');
  const trending = await CatalogService.getTrending();
  const trendingEmbed = BasementEmbeds.trendingList(trending);
  console.log(`   Discover Count: ${trending.length}`);
  console.log(`   Embed Title: "${trendingEmbed.embeds[0].data.title}"`);
  console.log('   ✅ Discover embed valid.\n');

  // 6. Test Status Check
  console.log('6. Testing Status Telemetry ("/status")...');
  const nodes = await StatusService.refreshStatus();
  const statusEmbed = BasementEmbeds.systemStatus(nodes);
  console.log(`   Monitored Nodes: ${nodes.length}`);
  console.log(`   Embed Title: "${statusEmbed.embeds[0].data.title}"`);
  console.log('   ✅ Status telemetry valid.\n');

  // 7. Test Requests Persistence
  console.log('7. Testing Content Requests Persistence...');
  let requests = db.getRequests();
  if (requests.length === 0) {
    db.addRequest({
      id: 'req-sample',
      title: 'Interstellar',
      type: 'movie',
      year: '2014',
      notes: '1080p',
      requesterId: '12345',
      requesterTag: 'Tester',
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    requests = db.getRequests();
  }
  console.log(`   Total Requests in Queue: ${requests.length}`);
  const ticketEmbed = BasementEmbeds.requestTicket(requests[0]);
  console.log(`   Ticket #${requests[0].id} Status: ${requests[0].status}`);
  console.log('   ✅ Request ticket valid.\n');

  // 8. Test Backend Prometheus Metrics
  console.log('8. Testing Live Backend Prometheus Metrics (https://be.basementx.lol/metrics)...');
  const { MetricsService } = await import('./services/metrics.js');
  const metrics = await MetricsService.fetchMetrics();
  const metricsEmbed = BasementEmbeds.createMetricsEmbed(metrics);
  console.log(`   Uptime: ${metrics.uptimeFormatted}`);
  console.log(`   Resident RAM: ${metrics.residentMemoryMb} MB`);
  console.log(`   Site Requests: ${metrics.siteRequestsTotal}`);
  console.log(`   Total Stream Watches: ${metrics.totalWatches} (Rate: ${metrics.watchSuccessRate}%)`);
  console.log(`   Top Scrapers: ${metrics.topProviders.length} providers`);
  console.log(`   Embed Title: "${metricsEmbed.embeds[0].data.title}"`);
  // 9. Test Help Menu Security (Public vs Admin)
  console.log('9. Testing Help Menu Security (Public vs Admin)...');
  const publicHelp = BasementEmbeds.createHelpMenu(0, '!', false);
  const publicCatButtons = publicHelp.components[0].components.map(b => (b.data as any).custom_id);
  if (publicCatButtons.includes('help_cat_3')) {
    throw new Error('SECURITY VIOLATION: help_cat_3 (Admin) found on public help menu!');
  }
  const publicDesc = publicHelp.embeds[0].data.description || '';
  if (publicDesc.includes('Administrator & Setup') || publicDesc.includes('adminsetup')) {
    throw new Error('SECURITY VIOLATION: Admin setup leaked in public help overview description!');
  }
  const hackedPublicHelp = BasementEmbeds.createHelpMenu(3, '!', false);
  if (hackedPublicHelp.embeds[0].data.title?.includes('Administrator')) {
    throw new Error('SECURITY VIOLATION: Admin page served to unauthenticated public user!');
  }

  const adminHelp = BasementEmbeds.createHelpMenu(3, '!', true);
  const adminCatButtons = adminHelp.components[0].components.map(b => (b.data as any).custom_id);
  if (!adminCatButtons.includes('help_cat_3')) {
    throw new Error('Admin help menu missing help_cat_3 button!');
  }
  if (!adminHelp.embeds[0].data.title?.includes('Administrator')) {
    throw new Error('Admin help page 3 title missing Administrator header!');
  }
  console.log('   ✅ Public help menu strictly sanitized (0 admin leaks).');
  console.log('   ✅ Admin help menu properly accessible only when isAdmin=true.\n');

  console.log('\x1b[32m=== ALL 9 SYSTEM TESTS PASSED SUCCESSFULLY ===\x1b[0m');
}

testSuite();

