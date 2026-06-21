---
id: ZBLK-012
type: blocker
date: 2026-06-21
tags: [react, tailwind, input, button, intrinsic-height, layout-shift, css, inline-edit]
---

# ZBLK-012 — Layout shift `<input>` vs `<button>` malgré reset CSS

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| Le chiffre de température descend lors du passage lecture→édition malgré `p-0 border-0` sur l'input | `<input>` intrinsic height définie par le navigateur, pas par padding/border. `p-0 border-0` n'a aucun effet sur cette hauteur. | Conteneur `div.flex.h-[1em]` (= hauteur du texte courant) + `h-full` sur l'input pour hériter de cette hauteur fixe | résolu |

## Références

- [LRN-007](../../learnings/LRN-007.md) — pattern intrinsic height fix
