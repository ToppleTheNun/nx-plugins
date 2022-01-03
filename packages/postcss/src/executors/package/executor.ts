import { ExecutorContext } from "@nrwl/devkit";
import { PackageExecutorSchema } from "./schema";
import { normalizePackageOptions } from "./utils/normalize-options";
import { readAndCompileCss } from "./utils/postcss";
import {
  requireDependentProjectsToBeBuilt,
  requireRootAndSourceRoot,
} from "./utils/preconditions";

export async function packageExecutor(
  rawOptions: PackageExecutorSchema,
  context: ExecutorContext
) {
  const { sourceRoot, root } = requireRootAndSourceRoot(context);
  requireDependentProjectsToBeBuilt(context);

  const options = normalizePackageOptions(
    rawOptions,
    context.root,
    sourceRoot,
    root
  );

  await readAndCompileCss(options);
  return {
    success: true,
  };
}

export default packageExecutor;
