---
id: ZBLK-029
type: blocker
date: 2026-06-22
tags:
  [
    pwa,
    vercel,
    manifest,
    401,
    deployment-protection,
    beforeinstallprompt,
    preview,
  ]
---

# ZBLK-029 — Vercel Auth 401 bloque `beforeinstallprompt` sur preview deployment

| Friction                                                                                                                             | Cause réelle                                                                                                                                                   | Solution                                                                                                                              | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Bouton d'installation absent sur Android Chrome + PC via URL Vercel preview, SW visible dans DevTools mais aucun prompt natif Chrome | `manifest.json` retourne 401 (Vercel Authentication active sur preview deployment) → Chrome abandonne la validation PWA silencieusement sans erreur JS visible | Désactiver Vercel Authentication (Settings → Deployment Protection) avant de tester, ou tester sur branche `main` (prod) non protégée | résolu |

## Références

- voir aussi GLRN-138 — Vercel Auth preview deployments → manifest.json 401 (pattern global)
