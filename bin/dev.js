const dotenv = require('dotenv');
const express = require('express');
const { handler } = require('../dist/index');

dotenv.config();

const app = express();

const { OLOSTEP_API_KEY, PORT } = process.env;

if (OLOSTEP_API_KEY === undefined) {
    console.log('`OLOSTEP_API_KEY` not set. Set it in environment or .env file.');
    process.exit(1);
}

app.get('/', async (req, res) => {
    const args = {};
    for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
            args[key] = value;
        }
    }

    const event = {
        body: JSON.stringify({
            args,
            secrets: {
                OLOSTEP_API_KEY
            }
        })
    };

    const result = await handler(event);
    res.status(result.statusCode).send(result.body);
});

const port = PORT || 3000;
app.listen(port, () => {
    console.log(`Local development server running on port ${port}`);
});



