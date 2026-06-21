---
id: ZBLK-025
type: blocker
date: 2026-06-21
tags: [react-doctor, rtk, windows, json, stdout, temp-path, bash, python]
---

# ZBLK-025 — JSON react-doctor non parsable via RTK/Windows

| Friction                                                                                                                                                                                | Cause réelle                                                                                                                                                                                           | Solution                                                                                                                 | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------ |
| `rtk pnpm lint` retourne exit 2 + "JSON parse failed". Pipe `--json \|` vers Python échoue. `$TEMP` sur Windows → backslashes → Python unicode error. `C:/` → permission refusée (Bash) | react-doctor exit code 1 quand il trouve des diagnostics (comportement normal, pas un crash). RTK traite exit 1 comme erreur. Chemins Windows incompatibles avec Bash/Python pour fichiers temporaires | Rediriger `--json > ./rd_final.json` dans le CWD projet, lire avec `python -c` en chemin relatif. Supprimer après usage. | résolu |
