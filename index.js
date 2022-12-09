import GOTDatabase from "./models/GOTDatabase.js";
import bodyparser from "body-parser";
import express from "express";
import mysql from "mysql2";
import path from "path";

// Constants
const showLimit = 10;
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

app.use(bodyparser.urlencoded({ extended: true }));

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
app.set("views", [
    "./views"
]);

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

app.get('/search', (req, res) => {
    res.redirect('/search/1');
})
app.get('/search/:page', async (req, res) => {
    const conn = await db.connect();
    let numBook = 1;
    let source = "";
    let page = req.params.page;

    // res.render('search');

    if (req.body.source !== undefined && req.body.book) {
        numBook = req.body.book;
        source = req.body.source;
    }
    let results_all = await db.getSourceCall(conn, numBook, source);
    let totalPage = results_all.length / showLimit;
    let results = await db.getSourceCall(conn, numBook, source, showLimit, page);
    console.log(req.body);
    let data = { source, numBook, results, totalPage };
    res.render('search', data);
})