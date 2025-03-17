declare global {
  const axe: {
    run(context?: HTMLElement, options?: any): Promise<AxeResults>;
    source: string;
  };

  interface AxeResults {
    violations: AxeViolation[];
    passes: AxePass[];
    incomplete: AxeIncomplete[];
  }

  interface AxeViolation {
    id: string;
    impact: string;
    description: string;
    nodes: AxeNode[];
  }

  interface AxePass {
    id: string;
    nodes: AxeNode[];
  }

  interface AxeIncomplete {
    id: string;
    nodes: AxeNode[];
  }

  interface AxeNode {
    html: string;
    target: string[];
    failureSummary: string[];
  }
}

export {};
