---
id: ZBLK-036
type: blocker
date: 2026-06-25
tags:
  [departmentCode, GeoLocation, propagation, interface, useLocation, vigilance]
---

# ZBLK-036 — `departmentCode` extrait dans `parseContext()` mais absent de `GeoLocation`

| Friction                                                                                | Cause réelle                                                                                                                                             | Solution                                                                                                                                  | Statut |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `useVigilanceData` recevait `undefined` comme departmentCode — aucune requête ODS émise | `departmentCode` correctement extrait par `parseContext()` mais champ absent de l'interface `GeoLocation`, donc non stocké ni propagé dans `setLocation` | Ajout de `departmentCode?: string` dans `GeoLocation` (types/index.ts) ; propagé dans `detectLocation` (GPS) et `setFromCommune` (search) | résolu |

## Références

- [BDR-061](../../decisions/BDR-061.md) — Feature vigilance liée
