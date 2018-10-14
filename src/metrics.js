import http from 'http';

const Prometheus = require('prom-client');

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics();

export const guildGauge = new Prometheus.Gauge({
  name: 'bot_guild_gauge',
  help: 'The amount of guilds the bot is in',
});

export const messagesSentCounter = new Prometheus.Counter({
  name: 'bot_messages_sent',
  help: 'The amount of messages the bot has sent',
  labelNames: ['server'],
});

export function createServer() {
  const port = process.env.METRICS_PORT || 3000;
  http.createServer((req, res) => {
    if (req.url === '/metrics') {
      const register = Prometheus.register;
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
