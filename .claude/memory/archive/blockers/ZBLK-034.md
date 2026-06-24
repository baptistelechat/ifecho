---
id: ZBLK-034
type: blocker
date: 2026-06-24
tags:
  [
    pwa,
    service-worker,
    og-image,
    vercel,
    diagnosis,
    navigation-privee,
    vercel-json,
  ]
---

# ZBLK-034 — Mauvais diagnostic : `/og-image.png` retourne l'app (Vercel SPA rewriting)

| Friction                                                                                                                             | Cause réelle                                                                                                                    | Solution                                                                                                                                        | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `/og-image.png` retournait l'app dans le navigateur → diagnostic erroné : Vercel SPA rewriting → création inutile d'un `vercel.json` | Service Worker PWA interceptait la requête dans le navigateur normal. Navigation privée = pas de SW = image servie correctement | Test en navigation privée → isolation comportement réseau réel vs SW. `vercel.json` supprimé via git reset --hard + force push + Promote Vercel | résolu |

## Références

- voir aussi GLRN-154 — SW PWA masque comportement serveur dans navigateur normal
- voir aussi GLRN-155 — Vercel ne redéploie pas sur force push → Promote manuel
