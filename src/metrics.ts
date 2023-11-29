import http from 'http';
import { collectDefaultMetrics, Gauge, Counter, Histogram, register } from "prom-client";

collectDefaultMetrics();

export const guildGauge = new Gauge({
  name: 'bot_guild_gauge',
  help: 'The amount of guilds the bot is in',
});

export const messagesSentCounter = new Counter({
  name: 'bot_messages_sent',
  help: 'The amount of messages the bot has sent',
  labelNames: ['server'],
});

export const reportResponseLatencyHistogram = new Histogram({
  name: 'bot_report_response_latency',
  help: 'The time it took to respond to a report',
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
});

export function createServer() {
  const port = process.env.METRICS_PORT || 3000;
  http.createServer((req, res) => {
    if (req.url === '/metrics') {
      res.setHeader('Connection', 'close');
      res.setHeader('Content-Type', register.contentType);
      res.write(register.metrics());
      res.end();
    }
    res.statusCode = 404;
    res.statusMessage = 'Not found';
    res.end();
  }).listen(port);
  console.log('/metrics is available at port', port);
}
