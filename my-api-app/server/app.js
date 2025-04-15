import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5173;
const apiKeys = new Map();
// Middleware to validate API key
function validateApiKey(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!apiKey || !apiKeys.has(apiKey)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
    }
    next();
}
// Route to generate a new API key
app.post('/generate-key', (req, res) => {
    const apiKey = uuidv4(); // Generate a unique key
    const userName = req.query.user || 'anonymous'; // Optional user identifier
    apiKeys.set(apiKey, userName); // Store the key with an associated user
    res.json({ apiKey, message: `API key generated for ${userName}` });
});
// Route to get protected data (requires valid API key)
app.get('/protected-data', validateApiKey, (req, res) => {
    res.json({ data: 'This is protected data', user: apiKeys.get(req.header('x-api-key')) });
});
// Route to revoke an API key
app.delete('/revoke-key', (req, res) => {
    const apiKey = req.query.apiKey;
    if (apiKeys.delete(apiKey)) {
        res.json({ message: 'API key revoked successfully' });
    } else {
        res.status(404).json({ error: 'API key not found' });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});