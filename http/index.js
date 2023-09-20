import { app } from '../server.js';
import { Map } from './map.js';

export default app;

app.get('/api/server-url', (req, res) => {
  res.json({ SERVER_URL: process.env.CORS_ORIGIN });
});

app.get('/api/map', (req, res) => {
  res.json({ map: Map });
});
