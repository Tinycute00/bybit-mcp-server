import { FastMCP } from '@fastmcp/core';
import { startServer } from './server';

async function main() {
  const mcp = new FastMCP();
  await startServer(mcp);
}

main().catch(console.error);
