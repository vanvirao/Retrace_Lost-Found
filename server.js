require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL!");
});

const app = express();

app.use(cors());
app.use(express.json());


app.get("/items", (req, res) => {

    db.query("SELECT * FROM items", (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

app.get("/items/search", (req, res) => {

    const query = req.query.keyword;

    if (!query) {
        return res.status(400).json({
            message: "Please enter a search keyword"
        });
    }

    const keywords = query.toLowerCase().split(" ");

    let conditions = [];
    let values = [];

    keywords.forEach(keyword => {

        const search = `%${keyword}%`;

        conditions.push(`
            (item_name LIKE ?
            OR description LIKE ?
            OR category LIKE ?
            OR location LIKE ?)
        `);

        values.push(search, search, search, search);
    });

    const sql = `
        SELECT * FROM items
        WHERE ${conditions.join(" AND ")}
    `;

    db.query(sql, values, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

 app.get("/items/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const sql = "SELECT * FROM items WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json(results[0]);
    });
});

app.post("/items", (req, res) => {

    const {
        type,
        item_name,
        description,
        category,
        location,
        date,
        posted_by,
        contact
    } = req.body;

    const sql = `
        INSERT INTO items
        (type, item_name, description, category, location, date, posted_by, contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [type, item_name, description, category, location, date, posted_by, contact],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Item posted successfully",
                id: result.insertId
            });
        }
    );
});

app.put("/items/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const {
        type,
        item_name,
        description,
        category,
        location,
        date,
        status,
        posted_by,
        contact
    } = req.body;

    const sql = `
        UPDATE items
        SET type = ?,
            item_name = ?,
            description = ?,
            category = ?,
            location = ?,
            date = ?,
            status = ?,
            posted_by = ?,
            contact = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            type,
            item_name,
            description,
            category,
            location,
            date,
            status,
            posted_by,
            contact,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }

            res.json({
                message: "Item updated successfully",
                id: id
            });
        }
    );
});

app.delete("/items/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const sql = "DELETE FROM items WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json({
            message: "Item deleted successfully",
            id: id
        });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});