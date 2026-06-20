---
id: ZBLK-002
type: blocker
date: 2026-06-20
tags: [fcm, push-notifications, infrastructure, cost, agent-oscillation]
---

# ZBLK-002 — Oscillation agent sur l'infra notifications

| Friction                                                                                                                                      | Cause réelle                                                                                                                                   | Solution                                                                                                | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| 3+ itérations (VAPID individuel → Supabase pg_cron → GitHub Actions → Cloudflare Workers → RPi) avant de converger sur une solution zéro coût | Évaluation séquentielle de chaque outil sans comprendre le modèle de coût de FCM Topics. L'agent revalorisait des outils précédemment écartés. | Baptiste a proposé le RPi ; déblocage par la compréhension que FCM Topics = coût O(topics) pas O(users) | résolu |

## Références

- [LRN-004](../../learnings/LRN-004.md) — FCM Topics : modèle de coût extrait du déblocage
- [BDR-004](../../decisions/BDR-004.md) — Décision finale : FCM Topics + RPi
