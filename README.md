# 👟 FreshWare — E-commerce Streetwear & Luxe

> **Stay Fresh. Stay Ahead.**

Site e-commerce complet pour la marque FreshWare, spécialisée dans la revente de vêtements luxe et streetwear à prix accessibles.

---

## 🚀 Lancement rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm run dev

# 3. Ouvrir dans votre navigateur
# → http://localhost:5173
```

### Build production
```bash
npm run build
npm run preview
```

---

## 📁 Structure du projet

```
freshware/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # Point d'entrée React
    ├── App.jsx           # Application complète (components + pages)
    ├── index.css         # Styles globaux + Tailwind
    └── data/
        └── products.js   # Données mockées (15 produits + avis)
```

---

## ✨ Fonctionnalités

### Pages
- **🏠 Accueil** — Hero banner animé, Best Sellers, Nouveautés, Catégories, Avis clients
- **📦 Catalogue** — Filtres (catégorie, nouveau, best seller, recherche, tri par prix/note)
- **🔍 Produit** — Images, description, tailles, prix, bouton panier, produits similaires
- **🛒 Panier** — Gestion des quantités, calcul total, livraison gratuite dès 100€
- **💳 Checkout** — Formulaire livraison + paiement (CB/PayPal/Revolut), simulation commande
- **👤 Compte** — Inscription/Connexion, historique commandes
- **❤️ Wishlist** — Favoris persistants dans la session

### Features
- 🏷️ Badges "Limited" et "New" sur les produits
- ❤️ Système de favoris (wishlist) avec compteur navbar
- 🔍 Barre de recherche dans la navbar et le catalogue
- 🎬 Animations d'apparition des produits (IntersectionObserver)
- 🍞 Breadcrumb sur les pages produit
- 🔔 Notifications toast (ajout panier, wishlist)
- 📱 Responsive : mobile, tablette, desktop
- 🌙 Dark mode natif
- ⚡ Hover effects et transitions fluides

---

## 🎨 Design

- **Palette** : Noir profond (#030303) + Blanc + Bleu électrique (#3b82f6)
- **Typographie** : Bebas Neue (titres) + Inter (corps)
- **Style** : Futuriste minimaliste inspiré Nike/StockX
- **Grille CSS** : Responsive 2/3/4 colonnes

---

## 🛍️ Catalogue produits

15 produits mockés répartis en 5 catégories :
- **Sneakers** : Air Phantom X, Forum Low Cloud, Dunk Low Panda, Speedcat OG
- **Maillots** : PSG Away 2024, Real Madrid Home
- **Bas** : Cargo Tech Wide, Track Pant Velour, Mesh Short Gradient
- **Hauts** : Oversized Tee Acid, Hoodie Chrome Logo, Windbreaker Neon
- **Accessoires** : Cap Structured 6-Panel, Tote Bag Heavy Canvas, Crossbody Sling Tech

---

## 💳 Paiement simulé

Le checkout simule les 3 méthodes de paiement :
- Carte bancaire
- PayPal
- Revolut

---

## 🚚 Livraison

- Internationale
- 7 à 12 jours ouvrés
- Gratuite dès 100€ de commande

---

## 🛠️ Stack technique

| Outil | Version |
|-------|---------|
| React | 18.x |
| Vite | 6.x |
| Tailwind CSS | 3.x |
| Google Fonts | Bebas Neue + Inter |

---

*FreshWare © 2026 — Stay Fresh. Stay Ahead.*
