import { normalizePath } from "@nrwl/devkit";
import {
  NormalizedPackageExecutorSchema,
  PackageExecutorSchema,
} from "../schema";

export const normalizePackageOptions = (
  options: PackageExecutorSchema,
  root: string,
  sourceRoot: string,
  projectRoot: string
): NormalizedPackageExecutorSchema => {
  return {
    ...options,
    root: normalizePath(root),
    sourceRoot: normalizePath(sourceRoot),
    projectRoot: normalizePath(projectRoot),
    main: normalizePath(options.main),
    outputPath: normalizePath(options.outputPath),
    watch: options.watch ?? false,
    outputFileName: options.outputFileName ?? "index.css",
  };
};
