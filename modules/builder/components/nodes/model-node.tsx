"use client";

import { AppIcon } from "@/components/app-icon";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export function ModelNode({ data }: NodeProps) {
  return (
    <div className="min-w-35 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-medium">
        <AppIcon name="model" className="size-3.5" />
        Model
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {(data.modelId as string) ?? "gpt-4o-mini"}
      </p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
