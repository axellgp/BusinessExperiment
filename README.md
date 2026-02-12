# Club Employés - Experience locale
# Petit site statique d'experimentation A/B (deux offres) : tout se passe cote client, le JSON de `config.txt` definit les offres, les mentions et la piste de collecte des selections.

Contenu :
- `Club Employés.html` - la page principale (ouvre via HTTP pour charger le config en direct)
- `config.txt` - configuration des offres, des mentions et du `collector_endpoint`
- `collector_server.py` - serveur Python minimal pour faire des tests locaux (ecrit `resultat.txt` et `ip.txt`)
- `google-sheets-collector.gs` - Apps Script pret a ecrire les enregistrements dans une Google Sheets
- `resultat.txt` / `resultat.csv` / `ip.txt` - exemples de sorties maintenues par les collecteurs

Note : si tu publies sur GitHub Pages, l'issue pre-remplie reste une option (voir `.github/workflows/collect_issues.yml`). La page ouvre un nouvel issue quand un visiteur choisit une offre, et le workflow extrait les champs pour mettre a jour `resultat.csv` et `ip.txt` sans exposer d'IP publique.

Deployer sur GitHub Pages :
1. Commit & push la branche qui contient `Club Employés.html` et compagnies.
2. Active Pages depuis `main` (Settings -> Pages) ou pousse sur `gh-pages`.

Remarques :
- Pour des tests hors ligne, lance `collector_server.py` (avec `python collector_server.py`) et pointe `collector_endpoint` vers `http://localhost:8000/submit`.
- Le champ `collector_endpoint` est vide par defaut ; remplis-le uniquement avec l'URL de ton collector.

## Collecter les réponses dans Google Sheets

Tu peux laisser tomber le backend personnalise et ecrire directement les selections dans la feuille Google Sheets partagee (https://docs.google.com/spreadsheets/d/10v131_vrtgxOotywspDvjD1kZyqZ4LCslu9gCc8htjM/edit?usp=sharing) grace a `google-sheets-collector.gs` :

1. Ouvre la feuille partagee ci-dessus. Si tu preferes un espace prive, fais `Fichier -> Creer une copie` et conserve ton nouvel ID (`docs.google.com/spreadsheets/d/TON_ID/edit`). Dans `google-sheets-collector.gs`, le `SHEET_ID` pointe deja vers la feuille partagee, change-le uniquement si tu utilises ta copie.
2. Dans la feuille, va dans `Extensions -> Apps Script`, colle le contenu de `google-sheets-collector.gs` (ou copie-le depuis le fichier du projet) et sauvegarde. Le nom de l'onglet (`Club Collect`) peut etre adapte, assure-toi juste que la constante `SHEET_NAME` correspond.
3. Clique la premiere fois sur le bouton de lecture (Run) pour autoriser le script a modifier la feuille. Une fenetre te demandera de te connecter ; accepte les permissions.
4. Choisis `Deploy -> Nouveau deploiement`, selectionne `Application web`, definis `Executer en tant que : Moi` et `Qui a acces : Toute personne, meme anonyme`. Copie l'URL finale (elle ressemble a `https://script.google.com/macros/s/XXXX/exec`).
5. Cole cette URL dans `collector_endpoint` de `config.txt`. La page enverra maintenant chaque soumission vers l'Apps Script en `Content-Type: text/plain` pour eviter les preflights, et le script append une ligne contenant l'horodatage, l'ID de l'offre, la periode, le type de mention et l'IP.
6. Le script ecrit directement dans la feuille (ligne par ligne) : tu peux ajouter des filtres, creer un tableau ou un tableau croise pour suivre les resultats.

Une fois deploye, teste en ouvrant la page principale, selectionne une offre et verifie l'apparition d'une ligne dans la feuille. Si tu veux conserver les donnees ailleurs, telecharge le CSV avec les boutons d'administration ou ecris-les dans un autre outil.
