---
id: ZBLK-030
type: blocker
date: 2026-06-23
tags: [satori, font, woff2, og-image, error, fontsource]
---

# ZBLK-030 — Satori refus woff2 lors génération OG

| Friction                                                                                           | Cause réelle                                                                                                                                                                          | Solution                                                                                                                                                               | Statut |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `satori()` lève `"Unsupported OpenType signature wOF2"` au premier run du script `generate-og.mjs` | Satori ne supporte pas le format woff2 (OpenType Web Font v2). `@fontsource/inter` distribue les deux formats — `.woff2` et `.woff` — et les chemins initiaux pointaient sur `.woff2` | Changer les deux chemins de police : `inter-latin-400-normal.woff2` et `inter-latin-700-normal.woff2` → `inter-latin-400-normal.woff` et `inter-latin-700-normal.woff` | résolu |

## Références

voir aussi GLRN-145 — Satori woff2 non supporté (global)
