# Club Employés — Expérience locale

Petit site statique d'expérimentation A/B (2 offres) — contenu client-side (HTML/CSS/JS), serveur collecteur Python et backend Deno optionnel.

Contenu:
- `Club Employés.html` — page principale (ouvrir via HTTP)
- `config.txt` — configuration des offres et mentions
- `collector_server.py` — serveur minimal pour recevoir POST /submit et écrire `resultat.txt` et `ip.txt`
- `collector_server.ts` — équivalent Deno qui reçoit les mêmes payloads et écrit dans `resultat.csv` + `ip.txt`
- `resultat.txt`, `resultat.csv`, `ip.txt` — sorties (la workflow GitHub alimente désormais le CSV)

Note: If you host the site on GitHub Pages, you can keep using GitHub Issues + Actions to collect submissions:
- The page opens a prefilled "New issue" when a visitor sélectionne une offre.
- A GitHub Actions workflow (`.github/workflows/collect_issues.yml`) écoute les issues ouvertes, extrait les champs, les ajoute dans `resultat.csv` (et `ip.txt`) puis pousse la mise à jour sur la branche `gh-pages`.
- Cette approche évite tout backend externe et centralise les réponses dans le dépôt. Le nom GitHub de l'utilisateur est enregistré (pas l'IP publique dans ce cas).

Déployer sur GitHub Pages:
1. Initialiser le repo, commit et push (voir commandes plus bas).
2. Activer GitHub Pages depuis `main` branch (Settings → Pages) ou créer `gh-pages` branch.

Remarques:
- Le serveur `collector_server.py` doit être lancé localement pour collecter les réponses (ne fonctionne pas côté client sur GitHub Pages).
- Pour collecte côté serveur hébergé, adapter/deployer `collector_server.py` sur un serveur (DigitalOcean, Heroku, VPS) et mettre à jour l'URL dans la page.

## Backend Deno (optionnel)

Pour éviter d'exposer un token GitHub et collecter les réponses depuis n'importe quel navigateur, déploie un petit backend Deno:

1. Lance `collector_server.ts` avec `deno run --allow-net --allow-read --allow-write collector_server.ts`. Il écoute sur `:8000` par défaut et fournit `/submit`, `/ips` et `/has_responded`.
2. Dans `config.txt`, remplis `collector_endpoint` avec l'URL complète (par exemple `https://mon-api.example.com/submit`). La page enverra chaque sélection vers cet endpoint via `fetch`.
3. Le backend ajoute les réponses dans `resultat.csv` et garde la trace des IP uniques dans `ip.txt`. Le format est identique à la sortie `resultat.txt` (champ `mention;Periode;Type Mention;ID;Timestamp;OfferId`).
4. Tu peux toujours conserver `collector_server.py` si tu veux rester sur Python, mais Deno simplifie le déploiement sur Deno Deploy, Fly.io ou autre.

Le champ `collector_endpoint` est vide par défaut pour permettre le fonctionnement local sans backend. Mets seulement l'adresse du serveur Deno que tu veux utiliser.
