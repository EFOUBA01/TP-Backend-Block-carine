# API Blog - Projet Carine

Ce projet est une API Backend permettant de gérer des articles de blog.

## 🚀 Installation
1. Ouvrir le dossier dans VS Code.
2. Installer les outils : `npm install express sqlite3`
3. Lancer le serveur : `node server.js`

## 🛠 Points d'accès (Endpoints)
- **GET** `/api/articles` : Voir tous les articles.
- **GET** `/api/articles/search?query=...` : Rechercher un article.
- **POST** `/api/articles` : Créer un article (JSON).
- **PUT** `/api/articles/:id` : Modifier un article.
- **DELETE** `/api/articles/:id` : Supprimer un article.

## 📝 Technologies
- Node.js & Express
- Base de données : SQLite3
- Tests : Postman