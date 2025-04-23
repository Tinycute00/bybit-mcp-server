import { FastMCP } from 'fastmcp';
import { startServer } from './server';

async function main() {
  const mcp = new FastMCP();
  await startServer(mcp);
}

main().catch(console.error);
