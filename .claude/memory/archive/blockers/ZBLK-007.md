---
id: ZBLK-007
type: blocker
date: 2026-06-20
tags: [vite, typescript, path, dirname, types-node, build]
---

# ZBLK-007 — Build error `Cannot find module 'path'` + `Cannot find name '__dirname'`

| Friction                                                                                                                                                                    | Cause réelle                                                                                                            | Solution                  | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------ |
| `vite.config.ts` utilise `import path from 'path'` et `path.resolve(__dirname, './src')` → TypeScript échoue : `Cannot find module 'path'` + `Cannot find name '__dirname'` | `@types/node` absent du projet — non inclus dans la création manuelle alors que Vite scaffolding l'ajoute implicitement | `pnpm add -D @types/node` | résolu |
