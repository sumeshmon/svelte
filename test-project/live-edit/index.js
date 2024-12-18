import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

process.env.LOCAL_LIVE_EDIT = 1;
process.env.PUBLIC_BACKOFFICE = 'http://localhost:3900/';

const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: './vite.config.js',
    root: __dirname,
    server: {
        port: 8080
    }
});
await server.listen().then((event) => {
    const PORT = 3900;
    const LOCAL_LIVE_EDIT_PORT = event.config.server.port;
    const liveEditServer = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'text/html');
        const filePath = path.join(__dirname, 'index.html');

        fs.readFile(filePath, 'utf8', (err, fileContent) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading the page');
            } else {
                const renderedContent = fileContent.replace('{{port}}', LOCAL_LIVE_EDIT_PORT);
                res.writeHead(200);
                res.end(renderedContent);
            }
        });
    });

    liveEditServer.listen(PORT, () => {
        console.log(`Live Server is running on http://localhost:${PORT}`);
        console.log(`EasyPage Server is running on http://localhost:${event.config.server.port}`);
    });
});
server.bindCLIShortcuts({ print: true });
