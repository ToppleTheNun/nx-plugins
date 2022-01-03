import { AssetPattern } from "../../types";

export interface PackageExecutorSchema {
  main: string;
  outputPath: string;
  watch?: boolean;
  sourceMap?: boolean;

  assets?: AssetPattern[];

  verbose?: boolean;

  outputFileName?: string;
}

export interface NormalizedPackageExecutorSchema extends PackageExecutorSchema {
  watch: boolean;

  root?: string;
  sourceRoot?: string;
  projectRoot?: string;
}
