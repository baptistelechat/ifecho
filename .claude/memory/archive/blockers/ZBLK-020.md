---
id: ZBLK-020
type: blocker
date: 2026-06-21
tags: [framer-motion, import, module-not-found, motion-react, carousel]
---

# ZBLK-020 — `import from "motion/react"` → module not found

| Friction                                                                                    | Cause réelle                                                                                                                    | Solution                                 | Statut |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------ |
| `import { motion } from "motion/react"` → runtime error "Cannot find module 'motion/react'" | `"motion/react"` n'est pas dans les `node_modules` de ce projet — framer-motion v12 exporte uniquement depuis `"framer-motion"` | `import { motion } from "framer-motion"` | résolu |

## Références

- [LRN-022](../../learnings/LRN-022.md) — `"framer-motion"` est le bon import path, pas `"motion/react"`
