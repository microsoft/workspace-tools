# Change Log - workspace-tools

This log was last generated on Fri, 07 Jan 2022 17:07:22 GMT and should not be manually modified.

<!-- Start content -->

## 0.18.1

Fri, 07 Jan 2022 17:07:22 GMT

### Patches

- bump ts to 4.5 and fixed typing issues with caught errors as unknown (kchau@microsoft.com)

## 0.18.0

Fri, 07 Jan 2022 00:04:32 GMT

### Minor changes

- speed up workspace-tools - reducing weight and adding caches - lazy load pkg mgr helpers (kchau@microsoft.com)

## 0.17.0

Thu, 02 Dec 2021 17:11:12 GMT

### Minor changes

- Implements NPM workspaces support to parseLockFile utility. (riacarmin@microsoft.com)

## 0.16.2

Thu, 03 Jun 2021 20:23:22 GMT

### Patches

- get the right default remote branch (kchau@microsoft.com)

## 0.16.1

Thu, 27 May 2021 20:04:05 GMT

### Patches

- getting rid of console logs from the library (kchau@microsoft.com)

## 0.16.0

Tue, 25 May 2021 21:47:27 GMT

### Minor changes

- Fix #24: Add support for different upstream branches (dannyvv@microsoft.com)

## 0.15.1

Wed, 19 May 2021 21:05:10 GMT

### Patches

- slimming down pnpm lockfile parsing (kchau@microsoft.com)

## 0.15.0

Fri, 23 Apr 2021 23:35:26 GMT

### Minor changes

- fixes the checkchange command; support lerna (previous checkin) (kchau@microsoft.com)

## 0.14.1

Fri, 23 Apr 2021 23:03:54 GMT

### Patches

- move lockfile implementations behind a lazy load in lockfile.ts (kchau@microsoft.com)

## 0.14.0

Mon, 12 Apr 2021 16:25:24 GMT

### Minor changes

- feat: Only include HEAD commits in 'recent commits' (asgramme@microsoft.com)

## 0.13.0

Mon, 12 Apr 2021 05:59:38 GMT

### Minor changes

- Add support for more commit command options (nickykalu@microsoft.com)

## 0.12.3

Tue, 23 Feb 2021 20:08:54 GMT

### Patches

- fixing up the rush package detection code (kchau@microsoft.com)

## 0.12.2

Tue, 16 Feb 2021 23:49:29 GMT

### Patches

- fetchRemote() fix to be more specific if branch is provided (kchau@microsoft.com)

## 0.12.1

Tue, 16 Feb 2021 23:13:38 GMT

### Patches

- adding back the maxbuffer options to git - got lost in translation (kchau@microsoft.com)

## 0.12.0

Tue, 16 Feb 2021 22:41:15 GMT

### Minor changes

- adding missing git functions into workspace-tools from beachball repo (kchau@microsoft.com)

## 0.11.0

Wed, 27 Jan 2021 20:58:49 GMT

### Minor changes

- Adding NPM 7 Workspaces implementation. (fecamina@microsoft.com)

## 0.10.3

Tue, 26 Jan 2021 09:28:35 GMT

### Patches

- fix: Detect changed package(s) in nested monorepo (oliver.kuruma@gmail.com)

## 0.10.2

Mon, 30 Nov 2020 18:53:38 GMT

### Patches

- Allow a much bigger buffer for getting changed packages (kchau@microsoft.com)

## 0.10.1

Mon, 19 Oct 2020 20:24:42 GMT

### Patches

- replaced matcher with multimatch (kchau@microsoft.com)

## 0.10.0

Mon, 12 Oct 2020 16:27:40 GMT

### Minor changes

- Introduce getWorkspaceRoot() (bewegger@microsoft.com)

## 0.9.8

Tue, 15 Sep 2020 17:45:13 GMT

### Patches

- added repository information in package.json (david@lannoye.net)

## 0.9.7

Tue, 15 Sep 2020 17:40:30 GMT

### Patches

- support scoped package matches to match regardless of scopes (kchau@microsoft.com)

## 0.9.6

Thu, 10 Sep 2020 23:43:54 GMT

### Patches

- no more requires (kchau@microsoft.com)

## 0.9.5

Thu, 10 Sep 2020 23:36:23 GMT

### Patches

- do not do dynamic require (kchau@microsoft.com)

## 0.9.4

Mon, 31 Aug 2020 23:19:25 GMT

### Patches

- add extended-info to getPackageInfos (kchau@microsoft.com)

## 0.9.3

Wed, 19 Aug 2020 23:27:31 GMT

### Patches

- fixes the case where deps with no dependencies are not added the edges in the subgraph calculation (kchau@microsoft.com)

## 0.9.2

Wed, 19 Aug 2020 22:44:02 GMT

### Patches

- adding subgraph support get transitive consumer (kchau@microsoft.com)

## 0.9.1

Sun, 09 Aug 2020 03:46:17 GMT

### Patches

- handle nested change detection (kchau@microsoft.com)

## 0.9.0

Fri, 17 Jul 2020 19:16:04 GMT

### Minor changes

- Add a new env variable to allow one to pick the preferred workspace manager (kchau@microsoft.com)

## 0.8.0

Fri, 19 Jun 2020 17:53:56 GMT

### Minor changes

- adding getTransitiveProviders and renamed getTransitiveDependencies to getTransitiveConsumers (kchau@microsoft.com)

## 0.7.6

Tue, 26 May 2020 16:55:44 GMT

### Patches

- fixes an issue with globby so that workspaces matches are found correctly (kchau@microsoft.com)

## 0.7.5

Mon, 25 May 2020 18:15:11 GMT

### Patches

- speeding up getRushWorkspaces by skipping the slow rush config reader by a simple json reader (kchau@microsoft.com)

## 0.7.4

Sat, 23 May 2020 22:54:25 GMT

### Patches

- adding unstaged changes in the changed packges (kchau@microsoft.com)

## 0.7.3

Sat, 23 May 2020 19:57:45 GMT

### Patches

- Adding a getChangedPackages() function (#1) (kchau@microsoft.com)

## 0.4.0

Fri, 15 May 2020 18:10:15 GMT

### Minor changes

- Integrating additional workspace utilities from the backfill package (kchau@microsoft.com)

## 0.3.3

Wed, 13 May 2020 00:54:54 GMT

### Patches

- Merge branch 'master' of https://github.com/kenotron/workspace-tools (kchau@microsoft.com)

## 0.3.2

Wed, 13 May 2020 00:52:56 GMT

### Patches

- using matcher instead of multimatch for the scope (kchau@microsoft.com)

## 0.3.1

Tue, 12 May 2020 16:43:14 GMT

### Patches

- expose depedent map (kchau@microsoft.com)

## 0.3.0

Tue, 12 May 2020 01:25:52 GMT

### Minor changes

- includes the scoped packages functions (kchau@microsoft.com)

## 0.2.1

Tue, 12 May 2020 01:00:31 GMT

### Patches

- fix the typing pointer (kchau@microsoft.com)

## 0.2.0

Tue, 12 May 2020 00:58:34 GMT

### Minor changes

- adds declaration (kchau@microsoft.com)

## 0.1.1

Tue, 12 May 2020 00:55:50 GMT

### Patches

- caching graph (kchau@microsoft.com)
