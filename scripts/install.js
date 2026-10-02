// postinstall / uninstall — copie l'adaptateur dans ~/.opencli/clis/cookies
// (~/.opencli est le runtime utilisateur d'OpenCLI, créé au premier `opencli` run).
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', 'clis', 'cookies');
const DEST = path.join(os.homedir(), '.opencli', 'clis', 'cookies');
const remove = process.argv.includes('--remove');

try {
    if (remove) {
        if (fs.existsSync(DEST)) {
            fs.rmSync(DEST, { recursive: true, force: true });
            console.log(`[opencli-cookies] adaptateur retiré de ${DEST}`);
        } else {
            console.log('[opencli-cookies] rien à retirer.');
        }
        process.exit(0);
    }

    const runtimeDir = path.join(os.homedir(), '.opencli');
    if (!fs.existsSync(runtimeDir)) {
        console.log('[opencli-cookies] ~/.opencli absent — lancez `opencli doctor` une fois après `npm i -g @jackwener/opencli`, puis ré-installez ce package.');
        // On copie quand même : le dossier sera prêt quand opencli s'initialisera.
    }
    fs.mkdirSync(path.dirname(DEST), { recursive: true });
    fs.cpSync(SRC, DEST, { recursive: true });
    console.log(`[opencli-cookies] adaptateur installé → ${DEST}`);
    console.log('[opencli-cookies] vérifier : opencli cookies --help');
} catch (e) {
    // postinstall ne doit jamais faire échouer l'installation
    console.warn(`[opencli-cookies] avertissement postinstall : ${e.message}`);
}
