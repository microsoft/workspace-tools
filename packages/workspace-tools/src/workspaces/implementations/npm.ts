import { makeWorkspaceUtilities } from "./makeWorkspaceUtilities";

// npm uses all the default implementations and doesn't support catalogs
export const npmUtilities = makeWorkspaceUtilities("npm");
