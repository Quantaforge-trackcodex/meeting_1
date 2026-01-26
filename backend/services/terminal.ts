import { FastifyRequest } from 'fastify';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Docker = require('dockerode');
import process from 'process';
import fs from 'fs';
import path from 'path';

const docker = new Docker(
    process.platform === 'win32'
        ? { socketPath: '//./pipe/docker_engine' }
        : undefined
);

const LOG_FILE = path.join(process.cwd(), 'terminal-error.log');

export class TerminalService {
    static async handleConnection(connection: any, req: FastifyRequest) {
        const { workspaceId } = req.params as any;

        // Fastify 5 / @fastify/websocket handling
        // connection is a SocketStream, connection.socket is the raw WebSocket
        const socket = connection.socket || connection;

        console.log(`🔌 Terminal connection attempt for workspace: ${workspaceId}`);
        fs.appendFileSync(LOG_FILE, `\n--- Connection: ${new Date().toISOString()} ---\n`);

        if (!socket || typeof socket.on !== 'function') {
            const errorMsg = "Critical: No valid WebSocket found on connection object.";
            console.error(errorMsg);
            fs.appendFileSync(LOG_FILE, `${errorMsg}\nConnection keys: ${Object.keys(connection || {})}\n`);
            return;
        }

        try {
            const containerName = `trackcodex-${workspaceId}`;
            const container = docker.getContainer(containerName);

            // Verify container status
            try {
                await container.inspect();
            } catch (err: any) {
                fs.appendFileSync(LOG_FILE, `Inspect failed: ${err.message}\n`);
                socket.send('\r\n\x1b[31m[System] Container not found or not running.\x1b[0m\r\n');
                socket.close();
                return;
            }

            // Create and start exec
            const exec = await container.exec({
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
                Cmd: ['sh']
            });

            const stream = await exec.start({
                hijack: true,
                stdin: true
            });

            if (!stream) {
                throw new Error("Terminal stream could not be initialized.");
            }

            // Docker Stream -> WebSocket
            stream.on('data', (chunk: Buffer) => {
                if (socket.readyState === 1) { // OPEN
                    socket.send(chunk.toString('utf-8'));
                }
            });

            stream.on('error', (err: any) => {
                fs.appendFileSync(LOG_FILE, `Docker Stream Error: ${err.stack}\n`);
                if (socket.readyState === 1) socket.close();
            });

            stream.on('end', () => {
                if (socket.readyState === 1) {
                    socket.send('\r\n[System] Session ended.\r\n');
                    socket.close();
                }
            });

            // WebSocket -> Docker Stream
            socket.on('message', (data: any) => {
                if (stream && stream.writable) {
                    stream.write(data.toString());
                }
            });

            socket.on('close', () => {
                fs.appendFileSync(LOG_FILE, `WebSocket closed by client.\n`);
                if (stream) stream.end();
            });

            socket.on('error', (err: any) => {
                fs.appendFileSync(LOG_FILE, `WebSocket Error: ${err.stack}\n`);
            });

            socket.send('\r\n\x1b[32m[System] Terminal ready.\x1b[0m\r\n$ ');

        } catch (error: any) {
            fs.appendFileSync(LOG_FILE, `Fatal Error: ${error.stack}\n`);
            console.error("Terminal Failure (logged)");
            if (socket.readyState === 1) {
                socket.send(`\r\n\x1b[31m[Critical Error] ${error.message}\x1b[0m\r\n`);
                socket.close();
            }
        }
    }
}
