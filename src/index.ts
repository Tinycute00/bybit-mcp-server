import { FastMCP } from 'fastmcp';
import { registerTools } from '../bybit-mcp-server/src/core/tools';
import { registerResources } from '../bybit-mcp-server/src/core/resources';
import { registerPrompts } from '../bybit-mcp-server/src/core/prompts';

async function main() {
  const mcp = new FastMCP({
    name: "MCP Server",
    version: "1.0.0"
  });

  registerResources(mcp);
  registerTools(mcp);
  registerPrompts(mcp);

  await mcp.start();
  console.log('Bybit MCP Server started successfully');
}

main().catch(console.error);
