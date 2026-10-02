// cookies export — exporte les cookies au format JSON Cookie-Editor
// (compatible `thot-agents configure <channel>-cookies` / imports manuels).
// Les valeurs vont UNIQUEMENT dans le fichier --out, jamais sur stdout.
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cli, Strategy } from '@jackwener/opencli/registry';
import { ArgumentError, CommandExecutionError, EmptyResultError } from '@jackwener/opencli/errors';

const SAME_SITE_MAP = {
    unspecified: 'unspecified',
    no_restriction: 'no_restriction',
    lax: 'lax',
    strict: 'strict',
};

cli({
    site: 'cookies',
    name: 'export',
    access: 'read',
    description: 'Export cookies (HttpOnly included) to a Cookie-Editor-compatible JSON file.',
    strategy: Strategy.COOKIE,
    browser: true,
    navigateBefore: false,
    siteSession: 'persistent',
    args: [
        { name: 'url', type: 'string', required: false, help: 'URL complète (ex: https://x.com).' },
        { name: 'domain', type: 'string', required: false, help: 'Domaine (ex: x.com) — inclut les sous-domaines.' },
        { name: 'out', type: 'string', required: true, help: 'Fichier de sortie JSON (format Cookie-Editor).' },
    ],
    columns: ['file', 'count', 'domains'],
    func: async (page, kwargs) => {
        const url = kwargs.url ? String(kwargs.url).trim() : '';
        const domain = kwargs.domain ? String(kwargs.domain).trim() : '';
        const out = String(kwargs.out ?? '').trim();
        if (!url && !domain) {
            throw new ArgumentError('cookies export : fournir --url ou --domain.');
        }
        if (!out) {
            throw new ArgumentError('cookies export : --out requis.');
        }
        const filter = {};
        if (url) filter.url = url;
        if (domain) filter.domain = domain;
        const cookies = await page.getCookies(filter);
        if (!cookies.length) {
            throw new EmptyResultError('cookies export', `aucun cookie pour ${JSON.stringify(filter)}`);
        }
        const payload = cookies.map((c) => {
            const row = {
                name: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                secure: !!c.secure,
                httpOnly: !!c.httpOnly,
                sameSite: SAME_SITE_MAP[c.sameSite] ?? 'unspecified',
                session: !!c.session,
                hostOnly: !!c.hostOnly,
            };
            if (!c.session && c.expirationDate) row.expirationDate = c.expirationDate;
            return row;
        });
        const target = path.resolve(out);
        try {
            fs.mkdirSync(path.dirname(target), { recursive: true });
            fs.writeFileSync(target, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
        } catch (e) {
            throw new CommandExecutionError(`écriture impossible : ${e.message}`);
        }
        return [{
            file: target,
            count: payload.length,
            domains: [...new Set(payload.map((c) => c.domain))].join(', '),
        }];
    },
});
