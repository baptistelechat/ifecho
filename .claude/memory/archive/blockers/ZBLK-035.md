---
id: ZBLK-035
type: blocker
date: 2026-06-25
tags: [meteofrance, portail, gmail, institutional-email, blocked, opendatasoft]
---

# ZBLK-035 — Portail Météo-France inaccessible avec email Gmail

| Friction                                                                    | Cause réelle                                                                                                        | Solution                                                                               | Statut |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| Connexion au portail API Météo-France échouait avec "invalid tenant domain" | Portail MF réservé aux domaines institutionnels — Gmail (@gmail.com) rejeté à l'authentification Microsoft/Azure AD | Fallback sur OpenDataSoft dataset officiel MF — données identiques, CORS, sans clé API | résolu |

## Références

- [BDR-061](../../decisions/BDR-061.md) — Décision source vigilance → ODS
- [LRN-054](../../learnings/LRN-054.md) — OpenDataSoft pattern
