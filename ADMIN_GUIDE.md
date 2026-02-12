# Guide Rapide — Admin Dashboard

## 🔑 Accès Admin

1. Cliquez sur le bouton **"Admin"** (en haut à droite)
2. Entrez le mot de passe: **`aqsl`**
3. Cliquez **"Se connecter"**

Une fois connecté, le tableau de bord s'ouvre automatiquement.

## 📊 Tableau de Bord — Vue d'ensemble

Le dashboard affiche:

### Statistiques en haut
```
┌─────────────────┬──────────────────┬──────────┬────────┐
│ Total réponses  │ Temps moyen (s)  │  Hyver   │  Été   │
│       42        │      3.5         │    24    │   18   │
└─────────────────┴──────────────────┴──────────┴────────┘
```

### Tableau de réponses (scrollable)
Liste complète avec colonnes:
- **Date/Heure** — Quand la réponse a été enregistrée
- **Offre** — L'option choisie (hyver ou ete)
- **Mention** — Si une mention badge était affichée
- **Temps de réponse** — Secondes avant de cliquer
- **IP** — Adresse IP du répondant
- **Session ID** — Identifiant unique de la session navigateur

## 🔍 Filtrer les réponses

### Filtres disponibles:

**1. Plage de dates**
- Cliquez dans **"Du"** pour sélectionner la date de début
- Cliquez dans **"Au"** pour sélectionner la date de fin
- Le système cherche automatiquement les réponses dans cette plage

**2. Par offre**
- Sélectionnez dans le dropdown:
  - "" (tous les offres)
  - "hyver" (vacances d'hiver)
  - "ete" (vacances d'été)

**3. Appliquer les filtres**
- Cliquez **"Appliquer filtres"**
- Le tableau se met à jour immédiatement

**4. Réinitialiser**
- Cliquez **"Réinitialiser"** pour effacer tous les filtres

### Exemple de workflow:
```
1. Je veux voir les réponses du 10 au 12 février uniquement pour l'été
2. Date du: 10/02/2026
3. Date au: 12/02/2026
4. Offre: ete
5. Cliquez "Appliquer filtres"
6. ✅ Tableau affiche uniquement les réponses correspondantes
```

## 📥 Exporter les données

### CSV (pour Excel, Sheets, etc.)
```
Cliquez "📥 Exporter CSV"
↓
Télécharge: reponses_sondage.csv
↓
Ouvrez dans Excel ou Google Sheets
```

**Format CSV:**
```csv
"Date/Heure";"Offre";"Mention";"Type Mention";"Temps Réponse (s)";"IP";"Session ID"
"12/02/2026 14:30";"hyver";"oui";"Favoris";"2.50";"192.168.1.1";"_abc_1"
"12/02/2026 14:32";"ete";"non";"";"3.15";"192.168.1.2";"_def_2"
```

### JSON (pour développeurs/intégrations)
```
Cliquez "📋 Exporter JSON"
↓
Télécharge: reponses_sondage.json
↓
Format brut pour traitement programmé
```

**Format JSON:**
```json
[
  {
    "timestamp": "2026-02-12T14:30:45.123Z",
    "offerId": "hyver",
    "period": "hyver",
    "mention": "oui",
    "mentionType": "✨ Le Favoris",
    "responseTime": 2.5,
    "ip": "192.168.1.1",
    "sessionId": "_abc_1"
  }
]
```

## 🔐 Changer le mot de passe admin

1. Ouvrez [config.txt](config.txt)
2. Trouvez la ligne: `"admin_password": "aqsl"`
3. Remplacez `"aqsl"` par votre nouveau mot de passe
4. Sauvegardez
5. La prochaine connexion admin utilisera le nouveau mot de passe

Exemple:
```json
"admin_password": "MonMotDePasse123!"
```

## 🚪 Se déconnecter

- Cliquez **"Déconnexion"** dans le dashboard OU
- Cliquez **"Déconnexion"** dans le menu Admin (coin supérieur droit)

La session admin reste active jusqu'à fermeture du navigateur.

## 📱 Données collectées pour chaque réponse

```
✅ Timestamp    → Date/heure ISO complète
✅ Offre        → Quelle offre a été choisie (hyver/ete)
✅ Mention      → Oui/non si un badge était affichée
✅ Temps réc.   → Secondes entre arrivée et clic (mesure l'intérêt)
✅ IP           → Adresse IP publique du répondant
✅ Session ID   → Identifiant de session unique (pour dédupliquer)
```

## 💡 Cas d'usage

### Analyser l'engagement
```
Filtrez par offre (ex: "hyver")
Relevez la colonne "Temps Réponse"
= Les temps courts = clics rapides = décision rapide
= Les temps longs = décision réfléchie
= Temps moyen  = indicateur d'engagement
```

### Gérer les doublons
```
Chaque répondant a un "Session ID" unique
Si le même ID apparaît plusieurs fois = même personne, session différente
Vous pouvez les filtrer manuellement ou via Excel
```

### Exporter pour présentation
```
CSV → Excel → Graphiques
Créez des tableaux croisés dynamiques
Générez des histogrammes par offre
Analysez les pics de réponses par date
```

## ⚠️ Limitation importante

- Le dashboard admin **charge les données de Firebase + local storage**
- Non actualisé en temps réel (rafraîchissement manuel)
- Pour une analyse temps réel, consultez Firebase Console directement

## 🔧 Raccourcis

| Action | Bouton |
|--------|--------|
| Ouvrir admin | "Admin" |
| Dashboard complet | "Exporter CSV" (après auth) |
| Réinitialiser filtres | "Réinitialiser" |
| Sortir dashboard | "Déconnexion" |

---

**Besoin d'aide?**  
Consultez [FIREBASE_SETUP.md](FIREBASE_SETUP.md) pour la configuration initiale.
