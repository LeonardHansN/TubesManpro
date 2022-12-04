import GOTDatabase from "./models/GOTDatabase.js";
import express from "express";
import mysql from "mysql2";
import path, { resolve } from "path";

// Constants
const _root = 'public';
const PORT = 8080;
const _dbconfig = {
    user: "root",
    password: "",
    database: "got",
    host: "localhost",
};

// ============================================================================
// Init

const app = express();

// Connect SQL
const sqlConnectConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "got",
};
const connection = mysql.createConnection(sqlConnectConfig);
const db = new GOTDatabase(_dbconfig);

// Menggunakan folder "public" untuk menyimpan file yang dapat diakses umum.
app.use(express.static(path.resolve(_root)));
// ============================================================================
// Menggunakan view engine ejs
app.set('view engine', 'ejs');

// ============================================================================
// Listen ke port 8080. Akses dengan url http://localhost:8080/
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
// ============================================================================

// ============================================================================
// Router

app.get('/', (req, res) => {
    res.sendFile('MainMenu.html', { root: _root })
});
app.get('/api/search', (req, res) => {
    const bookNum = req.query.bookNum;
    const chara_src = req.query.source;
    if (!isNaN(req.query.bookNum) && !isNaN(req.query.source)) {
        const conn = await db.connect();
        let result = await db.getSourceCall(conn, bookNum, source);
        conn.release();
        res.json(result);
    }
});

app.get('/top10char', async (req, res) => {
    const bookNum = req.query.bookNum;
    if (!isNaN(req.query.bookNum)) {
        const conn = await db.connect();
        let result = await db.getTop10Interactions(conn, bookNum);
        conn.release();

        const names = [];
        const totWeight = [];

        for (let i = 0; i < result.length; i++) {
            names.push(result[i].source);
            totWeight.push(parseInt(result[i].totweight));
        }

        const data = {
            'x': names,
            'y': totWeight
        }

        res.json(data);
    } else {
        res.sendFile('top10char.html', { root: _root })
    }
});

// const getBySource = (conn, source) => {
//     return new Promise((resolve, reject) => {
//         const sql = 'SELECT * FROM interaction WHERE source LIKE?';
//         conn.query(sql, source, (err, result) => {
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(result);
//             }
//         });
//     });
// };

app.get('/search', async (req,res) => {
    const conn = await db.connect();
    res.render('search');

    if(req.body.source !== undefined && req.body.book){
        const numBook = req.body.book;
        const source = req.body.source;
        const data = await getSourceCall(conn, numBook, source);
        res.render('search', {
            results: data
        });
    }
})