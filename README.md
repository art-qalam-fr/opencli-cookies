<p align="center">
  <img src="https://raw.githubusercontent.com/art-qalam-fr/Hephaistos-Kit/main/logo/hephaistos-kit_banderole.jfif" alt="Hephaistos-Kit" width="640"/>
</p>

> Ce dépôt est un **composant MCP du [Hephaistos-Kit](https://github.com/art-qalam-fr/Hephaistos-Kit)** —
> utilisable seul, mais conçu pour être cloné en sous-module et installé via `mcp/install.ps1`.
>
> ✍️ Élaboré par **art-qalam-fr**.

---

# opencli-cookies

Adaptateur [OpenCLI](https://github.com/jackwener/opencli) maison : expose la lecture du **jar complet de cookies** du profil Chrome (y compris `HttpOnly`, ce que `document.cookie` ne voit pas) via l'extension Browser Bridge.

📖 **[TUTORIEL.md](TUTORIEL.md)** — installation pas à pas (npm, tarball ou copie manuelle) pour un collaborateur.

## Prérequis

```bash
npm i -g @jackwener/opencli
opencli doctor        # crée ~/.opencli, vérifie daemon + extension Chrome
```

Chrome doit être lancé avec l'extension Browser Bridge chargée
(`chrome.exe --load-extension=%USERPROFILE%\.opencli\extension`).

## Installation

```bash
# depuis un tarball partagé
npm i -g opencli-cookies-1.0.0.tgz

# ou depuis le repo
npm i -g github:art-qalam-fr/opencli-cookies

# ou en local depuis les sources
npm i -g .
```

Le `postinstall` copie l'adaptateur dans `~/.opencli/clis/cookies/`.
Vérif : `opencli cookies --help` → `dump`, `export`.

## Commandes

```bash
# Inspection masquée (valeurs tronquées par défaut)
opencli cookies dump --domain github.com
opencli cookies dump --url https://x.com --name auth_token

# En clair (sensible)
opencli cookies dump --domain x.com --reveal

# Export Cookie-Editor JSON (valeurs -> fichier uniquement)
opencli cookies export --domain x.com --out cookies-x.json
```

Le JSON produit par `export` est au format **Cookie-Editor** — compatible
avec les flux `configure <channel>-cookies` et les imports manuels.

## Sécurité

Les cookies = sessions actives. Le `dump` masque les valeurs par défaut,
`export` n'écrit que dans un fichier. Gardez les exports hors du contrôle
de version (`.gitignore`, `~/.opencli/`).

## Désinstallation

```bash
npm uninstall -g opencli-cookies   # retire aussi ~/.opencli/clis/cookies
```
