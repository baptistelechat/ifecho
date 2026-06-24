---
id: ZBLK-033
type: blocker
date: 2026-06-24
tags:
  [
    pwa,
    service-worker,
    workbox,
    useRegisterSW,
    onNeedRefresh,
    controllerchange,
    vite-plugin-pwa,
    autoUpdate,
  ]
---

# ZBLK-033 — `useRegisterSW`/`onNeedRefresh` ne fire pas au 2e cycle SW

| Friction                                                                                                 | Cause réelle                                                                                                                                                                                                             | Solution                                                                                                     | Statut |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------ |
| Après un 1er toast de MAJ réussi, les builds suivants ne déclenchaient plus rien — plus aucun event reçu | `registerType: "autoUpdate"` court-circuite workbox-window — `onNeedRefresh` ne refire jamais après le 1er cycle. Workbox prend le contrôle immédiatement, sans repasser par l'état "waiting" nécessaire à useRegisterSW | Abandon de `useRegisterSW`, remplacement par l'événement natif `controllerchange` avec `hadController` guard | résolu |

## Références

- [BDR-055](../../decisions/BDR-055.md) — controllerchange + auto-reload pour MAJ PWA
- voir aussi GLRN-150 — `useRegisterSW` non fiable après 2e cycle SW
- voir aussi GLRN-151 — `controllerchange` + `hadController` guard
