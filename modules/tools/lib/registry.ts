import { AgentDefinition } from "@/modules/agents/lib/definition";
import { calculatorTool } from "./calculator";
import { readWebPageTool } from "./read-webpage";
import { weatherTool } from "./weather";
import { webSearchTool } from "./web-search";
import { StructuredTool } from "@langchain/core/tools";
import { isCustomToolConfig } from "@/modules/builder/lib/custom-tool";
import { buildCustomTool } from "./custom-http";

const builtInTools: Record<string, StructuredTool> = {
  calculator: calculatorTool,
  weather: weatherTool,
  web_search: webSearchTool,
  read_webpage: readWebPageTool,
};

export function getToolsForAgent(definition: AgentDefinition) {
  const tools: StructuredTool[] = [];

  for (const t of definition.tools) {
    if (isCustomToolConfig(t.config)) {
      tools.push(buildCustomTool(t.config));
      continue;
    }

    const builtIn = builtInTools[t.toolId];
    if (builtIn) {
      tools.push(builtIn);
    }
  }

  return tools;
}
