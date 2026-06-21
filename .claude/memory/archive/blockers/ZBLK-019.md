---
id: ZBLK-019
type: blocker
date: 2026-06-21
tags: [color, green, tailwind, timeline, consistency]
---

# ZBLK-019 — Deux verts différents dans la timeline

| Friction                                                                                                          | Cause réelle                                                                                     | Solution                                                                                                  | Statut |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------ |
| Incohérence visuelle : barres de la meilleure heure et des heures favorables dans des teintes de vert différentes | Utilisation de deux classes distinctes dans `getBarColor` — référence de couleur non centralisée | Unifier sur `bg-verdict-good` pour toutes les barres favorables via la fonction `getBarColor` centralisée | résolu |
