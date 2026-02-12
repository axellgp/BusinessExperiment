# Configuration Firebase — Club Employés

## 🎯 Vue d'ensemble

Le site de sondage utilise maintenant **Firebase Realtime Database** pour collecter et gérer les réponses. Toutes les données sont stockées sécurisement, et vous avez accès à un **tableau de bord admin** pour visualiser, filtrer et exporter les réponses.

## 📊 Données collectées

Pour chaque réponse, le système enregistre:
- ✅ **Offre choisie** (hyver, été)
- ⏱️ **Temps de réponse** (en secondes)
- 🌐 **Adresse IP** du répondant
- 🏷️ **Type de mention** affichée (si applicable)
- 📅 **Date/heure complète** (ISO 8601)
- 🔑 **ID de session** unique
- ✔️ **Mention ou pas** (oui/non)

## 🚀 Configuration Firebase

### Étape 1: Créer un projet Firebase

1. Accédez à [Firebase Console](https://console.firebase.google.com)
2. Cliquez sur **"Ajouter un projet"**
3. Entrez le nom de votre projet (ex: `club-employes-sondage`)
4. Acceptez les conditions et créez le projet

### Étape 2: Ajouter une application Web

1. Dans la console Firebase, cliquez sur **"Ajouter une application"**
2. Choisissez **Web** (icône `</>`）
3. Entrez un surnom (ex: `Club Employés Site`)
4. Cochez **"Héberger avec Firebase Hosting"** (optionnel)
5. Cliquez sur **"Créer l'app"**
6. **Copie la configuration Firebase** qui s'affiche

La configuration ressemblera à:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxx",
  authDomain: "club-employes-sondage.firebaseapp.com",
  databaseURL: "https://club-employes-sondage.firebaseio.com",
  projectId: "club-employes-sondage",
  storageBucket: "club-employes-sondage.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### Étape 3: Configurer la base de données

1. Dans le menu gauche, allez à **"Realtime Database"**
2. Cliquez sur **"Créer une base de données"**
3. Sélectionnez **votre région** (ex: France: `europe-west1`) 
4. Choisissez **"Commencer en mode test"** (temporaire pour développement)
   - ⚠️ Pour la production, configurez les règles de sécurité (voir section Sécurité)
5. Cliquez sur **"Activer"**

### Étape 4: Insérer la configuration dans config.txt

Remplacez les valeurs dans la section `firebase_config` de [config.txt](config.txt):

```json
"firebase_config": {
  "apiKey": "AIzaSyDxxxxxxxxxxxxxxxxxx",
  "authDomain": "club-employes-sondage.firebaseapp.com",
  "databaseURL": "https://club-employes-sondage.firebaseio.com",
  "projectId": "club-employes-sondage",
  "storageBucket": "club-employes-sondage.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abc123def456"
}
```

## 🔐 Sécuriser votre base de données

### Recommandations pour la Production

Dans Firebase Console, allez à **"Realtime Database"** → **"Règles"**, remplacez le contenu par:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "responses": {
      ".write": true,
      ".read": true
    }
  }
}
```

Cela permet:
- ✅ Tout le monde peut écrire les réponses (soumettre le formulaire)
- 🔒 Seuls les utilisateurs authentifiés peuvent lire les données

### Authentification admin

Pour l'authentification admin:
1. Allez à **"Authentication"** → **"Fournisseurs de connexion"**
2. Activez **"Email/Mot de passe"**
3. Le mot de passe admin est configuré dans `config.txt`

## 📱 Utilisation du site

### Pour les répondants

1. Ouvrez le site
2. L'IP et le temps de réponse sont collectés automatiquement
3. Cliquez sur **"Choisir cette offre"**
4. ✅ La réponse est sauvegardée localement ET dans Firebase

### Pour l'admin

1. Cliquez sur le bouton **"Admin"** en haut à droite
2. Entrez le mot de passe (`aqsl` par défaut)
3. Vous accédez au **Tableau de Bord**

#### Fonctionnalités Admin:

- 📊 **Statistiques en direct**
  - Total des réponses
  - Temps moyen de réponse
  - Répartition par offre

- 🔍 **Filtrer les réponses**
  - Par plage de dates
  - Par offre (hyver / été)
  - Les données se rechargent automatiquement

- 📥 **Exporter les données**
  - **CSV** (format tableur, ouvrable dans Excel, Sheets, etc.)
  - **JSON** (format brut pour intégrations)

- 📋 **Tableau de réponses** avec:
  - Date/heure
  - Offre choisie
  - Mention (oui/non)
  - Temps de réponse
  - IP du répondant
  - ID de session unique

## 🔄 Données locales + Firebase

Le système est **hybride**:
- Les réponses sont d'abord **sauvegardées localement** dans le navigateur
- Puis envoyées à **Firebase Realtime Database**
- Le tableau de bord fusionne les deux sources automatiquement
- Les doublons sont supprimés via la clé `sessionId + timestamp`

## 📊 Analyser les données

### Exporter en CSV

1. **Admin** → **Exporter CSV**
2. Ouvrez le fichier dans:
   - 📊 Google Sheets
   - 📈 Excel
   - 🐍 Python (pandas)
   - Tout autre outil d'analyse

Format CSV:
```
"Date/Heure";"Offre";"Mention";"Type Mention";"Temps Réponse (s)";"IP";"Session ID"
"12/02/2026 14:30:45";"hyver";"oui";"✨ Le Favoris";"2.50";"192.168.1.100";"_abc123_1739366445000"
```

### Interroger Firebase directement

1. Allez dans **Firebase Console** → **Realtime Database**
2. Les réponses sont stockées sous: `responses/{id}`
3. Chaque ID contient un objet avec tous les champs

## 🛠️ Dépannage

### Firebase ne se connecte pas
- ✅ Vérifiez que la configuration dans `config.txt` est correcte
- ✅ Assurez-vous que la base de données Firebase est en mode **"Test"** ou les règles sont configurées
- ✅ Vérifiez la console navigateur (F12) pour les erreurs

### Les réponses n'apparaissent pas au dashboard
- ✅ Rafraîchissez la page
- ✅ Vérifiez que vous êtes connecté au panel admin
- ✅ Les données peuvent être en local uniquement si Firebase n'est pas accessible

### Erreur d'authentification admin
- ✅ Mot de passe par défaut: `aqsl`
- ✅ Vous pouvez le changer dans `config.txt` clé: `"admin_password": "votre_mot_de_passe"`

## 📚 Ressources

- [Firebase Documentation](https://firebase.google.com/docs/database)
- [Firebase Console](https://console.firebase.google.com)
- [Règles Firebase](https://firebase.google.com/docs/database/security)

## ✉️ Support

Pour toute question sur la configuration, consultez la documentation Firebase ou contactez votre développeur.

---

**Version**: 2.0 (Firebase Realtime Database)  
**Dernière mise à jour**: février 2026
