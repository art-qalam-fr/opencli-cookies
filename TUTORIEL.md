# TUTORIEL — opencli-cookies

Installer l'adaptateur `cookies` pour OpenCLI chez un collaborateur, étape par étape.
Temps estimé : **5 minutes**.

---

## Étape 0 — Prérequis (une seule fois)

Il faut **OpenCLI** installé et son extension Chrome active :

```bash
# 1. Installer le CLI (Node 18+ requis)
npm i -g @jackwener/opencli

# 2. Premier run : crée ~/.opencli (daemon, runtime, clis/)
opencli doctor
```

Puis l'**extension Chrome** (Browser Bridge) :

```
Chrome → chrome://extensions → activer « Mode développeur »
→ « Charger l'extension non empaquetée » → %USERPROFILE%\.opencli\extension
```

Ou lancer Chrome directement avec :

```bat
chrome.exe --load-extension=%USERPROFILE%\.opencli\extension
```

**Vérification** — `opencli doctor` doit afficher :

```
[OK] Daemon: running on port 19825
[OK] Extension: connected
```

Si « Extension: not connected » → Chrome n'est pas lancé avec l'extension.

---

## Étape 1 — Installer l'adaptateur (3 méthodes, au choix)

### Méthode A — npm via le repo GitHub (recommandé)

Le dépôt `art-qalam-fr/opencli-cookies` est public — aucune clé requise.

```bash
npm i -g github:art-qalam-fr/opencli-cookies
```

### Méthode B — npm via le tarball

Récupérer `opencli-cookies-1.0.0.tgz` (fichier partagé) puis :

```bash
npm i -g opencli-cookies-1.0.0.tgz
```

### Méthode C — copie manuelle (sans npm)

1. Télécharger/cloner le repo
2. Copier le dossier `clis/cookies/` vers :

```
%USERPROFILE%\.opencli\clis\cookies\
```

Arborescence attendue après copie :

```
C:\Users\<toi>\.opencli\
└── clis\
    └── cookies\
        ├── dump.js
        └── export.js
```

> ⚠️ Le dossier `clis` n'existe peut-être pas encore — le créer.
> Les imports `@jackwener/opencli/...` se résolvent via
> `~/.opencli/node_modules` (créé par opencli au premier run — d'où l'étape 0).

---

## Étape 2 — Vérifier l'installation

```bash
opencli cookies --help
```

Doit afficher `dump` et `export`.

```bash
opencli cookies dump --domain github.com
```

Doit lister les cookies GitHub (valeurs masquées `GH1.…29 (len=26)`).

---

## Étape 3 — Utiliser

| Besoin | Commande |
|---|---|
| Inspecter les cookies d'un site | `opencli cookies dump --domain x.com` |
| Cibler une URL précise | `opencli cookies dump --url https://x.com/page` |
| Un seul cookie | `opencli cookies dump --domain x.com --name auth_token` |
| Voir les valeurs | ajouter `--reveal` ⚠️ sensible |
| Exporter (Cookie-Editor) | `opencli cookies export --domain x.com --out cookies-x.json` |
| Export vers Thot-Agents | `opencli cookies export --domain x.com --out ~/.thot-agents/x-cookies.json` |

**Format de sortie** : `-f yaml|json|table|csv` (ex : `opencli cookies dump --domain x.com -f json`).

**Flags en sortie** : `S` = Secure, `H` = HttpOnly, puis sameSite.

---

## Dépannage

| Symptôme | Cause | Fix |
|---|---|---|
| `Unknown command 'cookies'` | adaptateur pas dans `~/.opencli/clis/` | vérifier l'arborescence étape 1C |
| `Extension: not connected` | Chrome sans l'extension | relancer Chrome avec `--load-extension=...` |
| `Daemon: not running` | daemon arrêté | `opencli doctor` le redémarre |
| `Cannot find module '@jackwener/opencli/registry'` | `~/.opencli/node_modules` absent | lancer `opencli doctor` une fois |
| Zéro cookie retourné | pas logué au site dans Chrome | se connecter dans Chrome puis réessayer |

## Sécurité

Les cookies **sont** des sessions. `dump` masque les valeurs par défaut,
`export` n'écrit que dans un fichier (`--out`). Ne jamais committer un
export — le mettre dans `~/.opencli/` ou un dossier gitignoré.

## Désinstaller

```bash
npm uninstall -g opencli-cookies        # si installé via npm
# ou supprimer ~/.opencli/clis/cookies/ à la main
```
