import { defaultUtilities } from "./default";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";

/** npm has no overrides of the default behaviors */
export const npmUtilities: WorkspaceUtilities = { ...defaultUtilities };
