import { createApp } from './main';

let cachedServer: any;

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await createApp();
  }
  return cachedServer(req, res);
}
