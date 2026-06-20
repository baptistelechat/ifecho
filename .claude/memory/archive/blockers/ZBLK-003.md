---
id: ZBLK-003
type: blocker
date: 2026-06-20
tags: [formatter, hooks, vscode, stale-content, edit-tool, markdown]
---

# ZBLK-003 — Formatter hook → VS Code affiche contenu périmé après Edit

| Friction                                                                                                                                   | Cause réelle                                                                                                                                                                                                                              | Solution                                                                                                                                       | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Baptiste voyait l'ancienne formule de l'algo dans VS Code même après plusieurs edits de l'agent. Baptiste croyait que l'agent hallucinait. | Le hook PostToolUse (formatter) reformate le fichier après chaque Edit, modifiant les whitespaces dans les tableaux markdown. VS Code ne recharge pas automatiquement → affiche une version périmée. Le fichier sur disque était correct. | Baptiste a rechargé le fichier dans VS Code ("Revert File"). Pour l'agent : re-lire le fichier avant chaque Edit suivant. Voir aussi GLRN-103. | résolu |
