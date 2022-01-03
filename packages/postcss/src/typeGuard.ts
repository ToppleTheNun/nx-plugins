import { AssetGlob } from "@nrwl/workspace/src/utilities/assets";
import { AssetPattern } from "./types";

export function isString(assetPattern: AssetPattern): assetPattern is string {
  return typeof assetPattern === "string";
}

export function isAssetGlob(
  assetPattern: AssetPattern
): assetPattern is AssetGlob {
  return (
    typeof assetPattern === "object" &&
    !!assetPattern.input &&
    !!assetPattern.output &&
    !!assetPattern.glob
  );
}
