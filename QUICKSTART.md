# ⚡ Quick Start — Checklist Setup Firebase

## 📋 Votre checklist de configuration

Suivez ces étapes pour activer Firebase:

### 🔵 Phase 1: Firebase Console (5 min)

- [ ] Allez sur [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Cliquez **"Ajouter un projet"**
- [ ] Nom du projet: `club-employes-sondage`
- [ ] Acceptez les conditions et créez
- [ ] Une fois créé, cliquez **"Continuer"**

### 🔵 Phase 2: App Web (3 min)

- [ ] Menu gauche → Cliquez l'icône `</>` (Web)
- [ ] Surnom: `Club Employés Site`
- [ ] Laissez les autres options par défaut
- [ ] Cliquez **"Créer l'app"**
- [ ] **COPIE la configuration JavaScript** que vous voyez (elle contient apiKey, authDomain, etc.)

### 🔵 Phase 3: Realtime Database (3 min)

- [ ] Menu gauche → **"Realtime Database"**
- [ ] Cliquez **"Créer une base de données"**
- [ ] Région: Choisissez France ou proche (`europe-west1`)
- [ ] Mode: **"Commencer en mode test"** (pour dev/test)
- [ ] Cliquez **"Activer"**
- [ ] **COPIE l'URL** de la base (ex: `https://club-employes-sondage.firebaseio.com`)

### 🔵 Phase 4: Remplir config.txt (2 min)

- [ ] Ouvrez [config.txt](config.txt)
- [ ] Remplacez la section `firebase_config`:

```json
"firebase_config": {
  "apiKey": "VOTRE_API_KEY_ICI",
  "authDomain": "VOTRE_AUTH_DOMAIN_ICI",
  "databaseURL": "L_URL_DE_LA_BASE_ICI",
  "projectId": "VOTRE_PROJECT_ID_ICI",
  "storageBucket": "VOTRE_STORAGE_BUCKET_ICI",
  "messagingSenderId": "VOTRE_MESSAGING_SENDER_ID_ICI",
  "appId": "VOTRE_APP_ID_ICI"
}
```

Les valeurs viennent de l'étape 2.

- [ ] Sauvegardez `config.txt`

### 🔵 Phase 5: Tester (2 min)

- [ ] Ouvrez le fichier HTML dans le navigateur
- [ ] Choisissez une offre (ex: "Vacance d'Hiver")
- [ ] Ouvrez la console (F12) → Onglet "Console"
- [ ] Vérifiez qu'il n'y a pas d'erreurs (messages rouges)
- [ ] Allez dans Admin → Mot passe: `aqsl`
- [ ] ✅ Vous devriez voir la réponse dans le tableau!

### 🔵 Phase 6 (OPTIONNEL): Règles de sécurité

⚠️ **À faire avant d'ouvrir au public!**

- [ ] Firebase Console → **Realtime Database** → Onglet **"Règles"**
- [ ] Remplacez le contenu par:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "responses": {
      ".write": true,
      ".read": "root.auth.uid !== null"
    }
  }
}
```

- [ ] Cliquez **"Publier"**

---

## 🎬 Premiers tests

### Test 1: Soumettre une réponse
```
1. Ouvrez le site dans un onglet normal
2. Cliquez sur une offre
3. Attendez que le bouton dise "Merci 😊"
4. ✅ Réponse enregistrée
```

### Test 2: Voir la réponse au dashboard
```
1. Ouvrez Admin (coin supérieur droit)
2. Mot de passe: aqsl
3. ✅ Vous devriez voir votre réponse dans le tableau!
```

### Test 3: Exporter en CSV
```
1. Restez connecté au dashboard
2. Cliquez "📥 Exporter CSV"
3. Ouvrez le fichier dans Excel
4. ✅ Vous voyez: Date, Offre, Temps de réponse, IP, etc.
```

### Test 4: Filtrer par date
```
1. Dashboard actif
2. Sélectionnez les dates
3. Cliquez "Appliquer filtres"
4. ✅ Le tableau se met à jour
```

---

## ⚠️ Si ça ne marche pas

### Symptôme: "Firebase is not defined"
**Solution:**
- Vérifiez que la config Firebase dans `config.txt` est valide
- Ouvrez l'onglet "Console" (F12) pour voir l'erreur complète

### Symptôme: Les données vont en local mais pas Firebase
**Solution:**
- Vérifiez la `databaseURL` dans `config.txt` (elle doit commencer par `https://`)
- Assurez-vous que la base de données Realtime existe dans Firebase
- Vérifiez les règles: mode TEST = tout le monde peut écrire

### Symptôme: Admin dashboard vide
**Solution:**
- Rafraîchissez la page
- Les données peuvent être juste en local storage si Firebase n'a pas fonctionné
- Vérifiez qu'une réponse a bien été enregistrée

### Symptôme: Données en Français mais certains textes en Anglais
**Solution:**
- C'est normal. Les clés JSON sont en anglais pour la base de données.
- L'interface est en français.

---

## 🎯 Changer le mot de passe admin

1. Ouvrez [config.txt](config.txt)
2. Trouvez: `"admin_password": "aqsl"`
3. Remplacez `"aqsl"` par votre mot de passe
4. Sauvegardez
5. ✅ La prochaine connexion utilisera le nouveau mot de passe

Exemple:
```json
"admin_password": "JeSuisAdmin2026!"
```

---

## 📚 Documentation complète

- **Configuration avancée**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Utilisation admin**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- **Tous les changements**: [CHANGELOG.md](CHANGELOG.md)

---

## 🚀 Vous êtes prêt!

Une fois cette liste complétée:
✅ Firebase est actif  
✅ Les réponses sont collectées  
✅ Le dashboard admin fonctionne  
✅ Vous pouvez exporter en CSV  

**Temps total de setup: ~15 min** ⏱️

---

**Avez-vous une question?** Consultez les fichiers de documentation ou la console navigateur (F12).

**Bonne chance! 🎉**
