import { createServer, type Server } from 'node:http';
import next from 'next';

const HOST = '127.0.0.1';
const PORT = 3000;

function listen(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = (error: Error) => reject(error);
    server.once('error', onError);
    server.listen(PORT, HOST, () => {
      server.off('error', onError);
      resolve();
    });
  });
}

function closeServer(server: Server): Promise<void> {
  if (!server.listening) {
    server.closeAllConnections();
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections();
  });
}

export default async function globalSetup() {
  const app = next({ dev: false, dir: process.cwd(), hostname: HOST, port: PORT });
  let server: Server | undefined;

  const teardown = async () => {
    if (server) await closeServer(server);
    await app.close();
  };

  try {
    await app.prepare();
    const handle = app.getRequestHandler();
    server = createServer((request, response) => {
      void handle(request, response);
    });
    await listen(server);
    return teardown;
  } catch (error) {
    try {
      await teardown();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], 'Playwright server setup and cleanup failed');
    }
    throw error;
  }
}
