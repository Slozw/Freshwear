# 📸 Comment ajouter tes propres photos à FreshWare

## 🖼️ Option 1 — Photos hébergées en ligne (recommandé)

C'est la méthode la plus simple. Tu mets tes photos sur un service gratuit et tu colles l'URL dans le code.

### Services gratuits recommandés :
| Service | Lien | Limite gratuite |
|---------|------|-----------------|
| **Cloudinary** | cloudinary.com | 25 GB |
| **Imgbb** | imgbb.com | Illimité |
| **Unsplash** (photos libres) | unsplash.com | Illimité |
| **Supabase Storage** | supabase.com | 1 GB |

### Étapes avec Imgbb (le plus simple) :
1. Va sur **imgbb.com**
2. Clique "Upload image" → sélectionne ta photo
3. Copie le lien "Direct link"
4. Colle cette URL dans le code

---

## 🗂️ Option 2 — Photos dans le projet (dossier public/)

1. Crée un dossier `public/images/` dans ton projet
2. Mets tes photos dedans (ex: `sneaker1.jpg`)
3. Dans le code, remplace l'URL par `/images/sneaker1.jpg`

```
freshware/
├── public/
│   └── images/
│       ├── hero.jpg          ← Photo du hero
│       ├── sneaker1.jpg      ← Photos produits
│       ├── sneaker2.jpg
│       └── ...
```

---

## 📝 Où modifier les photos dans le code ?

### Photo du HERO (grande photo d'accueil)
Dans `src/App.jsx`, cherche "FreshWare hero" :
```jsx
<img
  src="https://TON-URL-ICI.jpg"   // ← Change cette URL
  alt="FreshWare hero"
/>
```

### Photos des PRODUITS
Dans `src/data/products.js`, chaque produit a un tableau `images` :
```js
{
  id: 1,
  name: "Air Phantom X",
  images: [
    "https://TON-URL-PHOTO-1.jpg",    // ← Photo principale
    "https://TON-URL-PHOTO-2.jpg",    // ← Photo secondaire (optionnel)
  ],
  ...
}
```

### Photo de la section ÉDITORIALE (split image/texte)
Dans `src/App.jsx`, cherche "Photo éditoriale" :
```jsx
<img src="https://TON-URL-ICI.jpg" alt="Hoodie" .../>
```

---

## 📐 Tailles recommandées pour les photos

| Type | Dimensions | Format |
|------|-----------|--------|
| Hero principal | 1600×1000 px | JPG/WEBP |
| Produit (portrait) | 600×800 px | JPG/WEBP |
| Section éditoriale | 900×700 px | JPG/WEBP |

---

# 🚂 Déployer sur Railway (version corrigée)

## Prérequis
- Un compte Railway (railway.app)
- Un compte GitHub

## Méthode recommandée — Via GitHub

### Étape 1 : Mettre le projet sur GitHub
```bash
# Dans le dossier freshware/
unzip freshware-ecommerce.zip && cd freshware

git init
git add .
git commit -m "FreshWare v1 - forest green"

# Sur github.com : créer un nouveau repo vide "freshware"
# Puis :
git remote add origin https://github.com/TON_USERNAME/freshware.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Railway
1. Va sur **railway.app** → "New Project"
2. → "Deploy from GitHub repo"
3. Sélectionne ton repo `freshware`
4. Railway détecte automatiquement Node.js
5. Dans **Settings → Variables**, vérifie que c'est vide (rien à ajouter)
6. Le build se lance automatiquement ✅
7. Va dans **Settings → Networking → Generate Domain** pour avoir ton URL

### Ce qui se passe automatiquement :
```
Railway lit nixpacks.toml → installe Node 20
→ npm install
→ npm run build  (crée le dossier dist/)
→ npx serve dist --single  (démarre le serveur)
```

---

## ⚡ Méthode rapide — Via Railway CLI
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Dans le dossier freshware/
railway login
railway init       # Choisir "Empty project"
railway up         # Déploie le projet
railway domain     # Génère l'URL publique
```

---

## 🐛 Problèmes courants et solutions

| Problème | Solution |
|---------|----------|
| Erreur "Cannot find module" | Vérifier que `npm install` s'est bien lancé |
| Page blanche | Vérifier le `startCommand` dans railway.toml |
| 404 sur les routes | Le `--single` dans la commande serve gère ça |
| Build échoue | Vérifier que Node 18+ est utilisé |

---

## 🔄 Mettre à jour le site après modification

```bash
# Après avoir modifié des fichiers :
git add .
git commit -m "Mise à jour photos produits"
git push

# Railway redéploie automatiquement ! ✅
```
