---
id: ZBLK-010
type: blocker
date: 2026-06-21
tags: [shadcn, cva, button, compound-variant, size, variant, design-pattern]
---

# ZBLK-010 — Compound variant CVA tenté pour merger couleur + size icône

| Friction                                                                                                                                                                      | Cause réelle                                                                                                                                                                | Solution                                                                                                                      | Statut |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------ |
| Bouton GPS utilisait `variant="ember" size="icon"` — tentative de créer un `compoundVariants` pour que `variant="ember"` sans `size` implique automatiquement le sizing icône | Mauvaise modélisation : couleur et forme sont deux dimensions orthogonales dans CVA — les merger crée de la complexité inutile. De plus `ember` = `default` (primary color) | Supprimer le variant `ember` (doublon de `default`), garder `size="icon"` pour la forme. Usage final : `<Button size="icon">` | résolu |

## Références

- voir aussi GLRN-128 — `default` = `bg-primary`, variante ember était un doublon
