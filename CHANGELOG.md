# Change Log - workspace-tools

This log was last generated on Tue, 15 Sep 2020 17:40:30 GMT and should not be manually modified.

<!-- Start content -->

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
