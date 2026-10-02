// cookies dump — liste les cookies du profil Chrome (HttpOnly inclus)
// via chrome.cookies.getAll à travers l'extension Browser Bridge.
// Par défaut les valeurs sont masquées ; --reveal pour les afficher,
// `cookies export` pour les écrire dans un fichier (Cookie-Editor JSON).
import { cli, Strategy } from '@jackwener/opencli/registry';
import { ArgumentError, EmptyResultError } from '@jackwener/opencli/errors';

function maskValue(v) {
    if (v == null) return '';
    const s = String(v);
    if (s.length <= 8) return '…(len=' + s.length + ')';
    return s.slice(0, 4) + '…' + s.slice(-2) + ' (len=' + s.length + ')';
}

cli({
    site: 'cookies',
    name: 'dump',
    access: 'read',
    description: 'List Chrome profile cookies (HttpOnly included) filtered by URL or domain.',
    strategy: Strategy.COOKIE,
    browser: true,
    navigateBefore: false,
    siteSession: 'persistent',
    args: [
        { name: 'url', type: 'string', required: false, help: 'URL complète (ex: https://x.com) — cookies visibles pour cette URL.' },
        { name: 'domain', type: 'string', required: false, help: 'Domaine (ex: x.com) — inclut les sous-domaines.' },
        { name: 'name', type: 'string', required: false, help: 'Nom exact de cookie.' },
        { name: 'reveal', type: 'boolean', default: false, help: 'Afficher les valeurs en clair (sensible !).' },
        { name: 'limit', type: 'int', default: 100, help: 'Nombre max de cookies.' },
    ],
    columns: ['name', 'domain', 'path', 'expires', 'flags', 'value'],
    func: async (page, kwargs) => {
        const url = kwargs.url ? String(kwargs.url).trim() : '';
        const domain = kwargs.domain ? String(kwargs.domain).trim() : '';
        const name = kwargs.name ? String(kwargs.name).trim() : '';
        if (!url && !domain && !name) {
            throw new ArgumentError('cookies dump : fournir --url, --domain ou --name (un jar entier n\'est pas exportable en un coup).');
        }
        const filter = {};
        if (url) filter.url = url;
        if (domain) filter.domain = domain;
        if (name) filter.name = name;
        const cookies = await page.getCookies(filter);
        if (!cookies.length) {
            throw new EmptyResultError('cookies dump', `aucun cookie pour ${JSON.stringify(filter)}`);
        }
        const limit = Math.max(1, Number(kwargs.limit ?? 100));
        const reveal = !!kwargs.reveal;
        return cookies.slice(0, limit).map((c) => ({
            name: c.name,
            domain: c.domain,
            path: c.path,
            expires: c.session ? 'session' : (c.expirationDate ? new Date(c.expirationDate * 1000).toISOString().slice(0, 10) : ''),
            flags: [c.secure ? 'S' : '', c.httpOnly ? 'H' : '', c.sameSite || ''].filter(Boolean).join(' '),
            value: reveal ? c.value : maskValue(c.value),
        }));
    },
});
