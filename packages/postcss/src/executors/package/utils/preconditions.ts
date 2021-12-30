import { ExecutorContext } from "@nrwl/devkit";
import { readCachedProjectGraph } from "@nrwl/workspace/src/core/project-graph";
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
} from "@nrwl/workspace/src/utilities/buildable-libs-utils";

export function requireRootAndSourceRoot(context: ExecutorContext) {
  const { sourceRoot, root } = context.workspace.projects[context.projectName];
  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }
  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`);
  }
  return { sourceRoot, root };
}

export function requireDependentProjectsToBeBuilt(context: ExecutorContext) {
  const projGraph = readCachedProjectGraph();
  const { dependencies } = calculateProjectDependencies(
    projGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName
  );

  if (
    !checkDependentProjectsHaveBeenBuilt(
      context.root,
      context.projectName,
      context.targetName,
      dependencies
    )
  ) {
    throw new Error(
      `${context.projectName} requires dependencies to be built first`
    );
  }
}
