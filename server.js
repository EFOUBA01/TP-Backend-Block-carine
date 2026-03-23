const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

const db = new sqlite3.Database('./blog.db');

// Création de la table
db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT, contenu TEXT, auteur TEXT, date TEXT, categorie TEXT, tags TEXT
)`);

// 1. CRÉER (POST /api/articles)
app.post('/api/articles', (req, res) => {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;
    if(!titre || !auteur) return res.status(400).json({error: "Titre et auteur obligatoires"});
    
    const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [titre, contenu, auteur, date, categorie, tags], function(err) {
        res.status(201).json({ id: this.lastID, message: "Article créé !" });
    });
});

// 2. RECHERCHER (GET /api/articles/search?query=texte) - BONUS
app.get('/api/articles/search', (req, res) => {
    const query = req.query.query;
    db.all("SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?", [`%${query}%`, `%${query}%`], (err, rows) => {
        res.json({ results: rows });
    });
});

// 3. LIRE TOUT OU FILTRER (GET /api/articles) - OPTIONNEL
app.get('/api/articles', (req, res) => {
    const { categorie, date } = req.query;
    let sql = "SELECT * FROM articles WHERE 1=1";
    let params = [];
    
    if(categorie) { sql += " AND categorie = ?"; params.push(categorie); }
    if(date) { sql += " AND date = ?"; params.push(date); }

    db.all(sql, params, (err, rows) => res.json({ articles: rows }));
});

// 4. LIRE UN SEUL (GET /api/articles/:id)
app.get('/api/articles/:id', (req, res) => {
    db.get("SELECT * FROM articles WHERE id = ?", [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ error: "Article non trouvé" });
        res.json(row);
    });
});

// 5. MODIFIER (PUT /api/articles/:id)
app.put('/api/articles/:id', (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;
    db.run(`UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?`, 
    [titre, contenu, categorie, tags, req.params.id], () => res.json({ message: "Article mis à jour !" }));
});

// 6. SUPPRIMER (DELETE /api/articles/:id)
app.delete('/api/articles/:id', (req, res) => {
    db.run(`DELETE FROM articles WHERE id = ?`, [req.params.id], () => res.json({ message: "Supprimé !" }));
});

app.listen(3000, () => console.log("✅ Serveur complet (Recherche + Filtres) prêt sur le port 3000"));