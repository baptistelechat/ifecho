---
id: ZBLK-005
type: blocker
date: 2026-06-20
tags: [shadcn, windows, path-alias, components, cli]
---

# ZBLK-005 — shadcn composants créés dans `@\components\ui\` (Windows)

| Friction                                                                                                                                                                           | Cause réelle                                                                                                                                 | Solution                                                                                                   | Statut |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| Après `pnpm dlx shadcn@latest add button card badge input`, les fichiers apparaissent dans `@\components\ui\` à la racine. Les imports `@/components/ui/button` échouent au build. | Sur Windows, le CLI shadcn interprète littéralement l'alias `@` au lieu de le résoudre via `components.json` → crée un dossier `@\` physique | Lire les fichiers dans `@\`, les recréer dans `src/components/ui/`, puis `Remove-Item -Recurse -Force "@"` | résolu |

## Références

- voir aussi GLRN-121
