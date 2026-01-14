# Club Employés — Expérience locale

Petit site statique d'expérimentation A/B (2 offres) — contenu client-side (HTML/CSS/JS) et serveur collecteur Python.

Contenu:
- `Club Employés.html` — page principale (ouvrir via HTTP)
- `config.txt` — configuration des offres et mentions
- `collector_server.py` — serveur minimal pour recevoir POST /submit et écrire `resultat.txt` et `ip.txt`
- `resultat.txt`, `ip.txt` — sorties

Déployer sur GitHub Pages:
1. Initialiser le repo, commit et push (voir commandes plus bas).
2. Activer GitHub Pages depuis `main` branch (Settings → Pages) ou créer `gh-pages` branch.

Remarques:
- Le serveur `collector_server.py` doit être lancé localement pour collecter les réponses (ne fonctionne pas côté client sur GitHub Pages).
- Pour collecte côté serveur hébergé, adapter/deployer `collector_server.py` sur un serveur (DigitalOcean, Heroku, VPS) et mettre à jour l'URL dans la page.
