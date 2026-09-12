import axios from 'axios';

export interface ProviderMetric {
  name: string;
  success: number;
  failed: number;
  total: number;
  successRate: string;
}

export interface BasementMetrics {
  uptimeSeconds: number;
  uptimeFormatted: string;
  residentMemoryBytes: number;
  residentMemoryMb: string;
  heapUsedBytes: number;
  heapUsedMb: string;
  heapTotalBytes: number;
  heapTotalMb: string;
  cpuSecondsTotal: number;
  eventLoopLagMs: string;
  nodeVersion: string;

  siteRequestsTotal: number;
  toolsUsage: {
    default: number;
    extension: number;
    desktop: number;
  };

  totalWatches: number;
  successfulWatches: number;
  failedWatches: number;
  watchSuccessRate: string;
  topProviders: ProviderMetric[];

  captchas: {
    gatePassed: number;
    gateFailed: number;
    registerPassed: number;
    total: number;
    gateSuccessRate: string;
  };

  errorBreakdown: Record<string, number>;
  totalErrors: number;

  fetchedAt: number;
}

interface MetricSample {
  name: string;
  labels: Record<string, string>;
  value: number;
}

export class MetricsService {
  public static METRICS_URL = 'https://be.basementx.lol/metrics';

  public static async fetchMetrics(): Promise<BasementMetrics> {
    const res = await axios.get(this.METRICS_URL, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Basement-Bot-Admin-Telemetry/1.0',
        Accept: 'text/plain',
      },
    });

    const text = String(res.data || '');
    return this.parsePrometheusMetrics(text);
  }

  public static parsePrometheusMetrics(rawText: string): BasementMetrics {
    const lines = rawText.split('\n');
    const samples: MetricSample[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const spaceIdx = trimmed.lastIndexOf(' ');
      if (spaceIdx === -1) continue;

      const head = trimmed.substring(0, spaceIdx).trim();
      const valStr = trimmed.substring(spaceIdx + 1).trim();
      const value = parseFloat(valStr);
      if (isNaN(value)) continue;

      let name = head;
      const labels: Record<string, string> = {};

      const braceStart = head.indexOf('{');
      const braceEnd = head.lastIndexOf('}');
      if (braceStart !== -1 && braceEnd > braceStart) {
        name = head.substring(0, braceStart).trim();
        const labelBody = head.substring(braceStart + 1, braceEnd);
        const labelRegex = /([a-zA-Z_0-9]+)="([^"]*)"/g;
        let match;
        while ((match = labelRegex.exec(labelBody)) !== null) {
          labels[match[1]] = match[2];
        }
      }

      samples.push({ name, labels, value });
    }

    // Process Start Time & Uptime
    const startSample = samples.find(s => s.name === 'process_start_time_seconds');
    const startTimeSec = startSample ? startSample.value : Math.floor(Date.now() / 1000);
    const uptimeSeconds = Math.max(0, Math.floor(Date.now() / 1000 - startTimeSec));

    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeFormatted = days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;

    // Memory
    const rss = samples.find(s => s.name === 'process_resident_memory_bytes')?.value || 0;
    const heapUsed = samples.find(s => s.name === 'nodejs_heap_size_used_bytes')?.value || 0;
    const heapTotal = samples.find(s => s.name === 'nodejs_heap_size_total_bytes')?.value || 0;
    const cpuTotal = samples.find(s => s.name === 'process_cpu_seconds_total')?.value || 0;

    // Node & Event Loop
    const lagSample = samples.find(s => s.name === 'nodejs_eventloop_lag_mean_seconds');
    const eventLoopLagMs = lagSample ? (lagSample.value * 1000).toFixed(2) : '0.12';
    const versionSample = samples.find(s => s.name === 'nodejs_version_info');
    const nodeVersion = versionSample?.labels?.version ? `Node.js ${versionSample.labels.version}` : 'Node.js LTS';

    // Hostnames (Total Web Site Requests)
    const siteRequestsTotal = samples
      .filter(s => s.name === 'hostnames')
      .reduce((acc, s) => acc + s.value, 0);

    // Tools Usage
    const tools = samples.filter(s => s.name === 'tools');
    const toolsUsage = {
      default: tools.find(s => s.labels.name === 'default')?.value || 0,
      extension: tools.find(s => s.labels.name === 'extension')?.value || 0,
      desktop: tools.find(s => s.labels.name === 'desktop')?.value || 0,
    };

    // Watches (Stream Sessions)
    const watchSamples = samples.filter(s => s.name === 'watches');
    const totalWatches = watchSamples.reduce((acc, s) => acc + s.value, 0);
    const successfulWatches = watchSamples
      .filter(s => s.labels.success === 'true')
      .reduce((acc, s) => acc + s.value, 0);
    const failedWatches = watchSamples
      .filter(s => s.labels.success === 'false')
      .reduce((acc, s) => acc + s.value, 0);
    const watchSuccessRate = totalWatches > 0 ? ((successfulWatches / totalWatches) * 100).toFixed(1) : '100.0';

    // Provider Scraper Breakdown
    const providerMap = new Map<string, { success: number; failed: number }>();
    for (const w of watchSamples) {
      const p = w.labels.provider || 'unknown';
      const cur = providerMap.get(p) || { success: 0, failed: 0 };
      if (w.labels.success === 'true') {
        cur.success += w.value;
      } else {
        cur.failed += w.value;
      }
      providerMap.set(p, cur);
    }

    const topProviders: ProviderMetric[] = Array.from(providerMap.entries())
      .map(([name, stat]) => {
        const total = stat.success + stat.failed;
        const rate = total > 0 ? ((stat.success / total) * 100).toFixed(1) : '0.0';
        return {
          name,
          success: stat.success,
          failed: stat.failed,
          total,
          successRate: rate,
        };
      })
      .sort((a, b) => b.total - a.total);

    // Captchas
    const captchaSamples = samples.filter(s => s.name === 'captchas');
    const gatePassed = captchaSamples
      .filter(s => s.labels.kind === 'gate' && s.labels.success === 'true')
      .reduce((acc, s) => acc + s.value, 0);
    const gateFailed = captchaSamples
      .filter(s => s.labels.kind === 'gate' && s.labels.success === 'false')
      .reduce((acc, s) => acc + s.value, 0);
    const registerPassed = captchaSamples
      .filter(s => s.labels.kind === 'register' && s.labels.success === 'true')
      .reduce((acc, s) => acc + s.value, 0);
    const totalCaptchas = captchaSamples.reduce((acc, s) => acc + s.value, 0);
    const totalGate = gatePassed + gateFailed;
    const gateSuccessRate = totalGate > 0 ? ((gatePassed / totalGate) * 100).toFixed(1) : '100.0';

    // Errors
    const errorSamples = samples.filter(s => s.name === 'errors');
    const errorBreakdown: Record<string, number> = {};
    let totalErrors = 0;
    for (const err of errorSamples) {
      const st = err.labels.status || 'unknown';
      errorBreakdown[st] = (errorBreakdown[st] || 0) + err.value;
      totalErrors += err.value;
    }

    return {
      uptimeSeconds,
      uptimeFormatted,
      residentMemoryBytes: rss,
      residentMemoryMb: (rss / (1024 * 1024)).toFixed(1),
      heapUsedBytes: heapUsed,
      heapUsedMb: (heapUsed / (1024 * 1024)).toFixed(1),
      heapTotalBytes: heapTotal,
      heapTotalMb: (heapTotal / (1024 * 1024)).toFixed(1),
      cpuSecondsTotal: Math.round(cpuTotal),
      eventLoopLagMs,
      nodeVersion,
      siteRequestsTotal,
      toolsUsage,
      totalWatches,
      successfulWatches,
      failedWatches,
      watchSuccessRate,
      topProviders,
      captchas: {
        gatePassed,
        gateFailed,
        registerPassed,
        total: totalCaptchas,
        gateSuccessRate,
      },
      errorBreakdown,
      totalErrors,
      fetchedAt: Date.now(),
    };
  }
}
