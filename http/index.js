import { app } from '../server.js'

export default app;

app.get('/api/server-url', (req, res) => {
    res.json({ SERVER_URL: process.env.CORS_ORIGIN });
});
