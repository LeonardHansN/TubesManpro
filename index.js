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
// Method untuk mencari duplikat dalam array of objects.
var containsDuplicate = (arr) => {
    let mapRes = mapItems(arr);
    return mapRes.some(function(item, idx){ 
        return mapRes.indexOf(item) != idx 
    });
}

var mapItems = (arr) => {
    return arr.map((item) => {
        return item.name
    });
}

var indexOfIdInArray = (arr, id) => {
    return arr.findIndex(item => item.id === id);
}
// ============================================================================
// Router

app.get('/', (req, res) => {
    res.render('MainMenu', { root: _root })
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
        // res.sendFile('top10char.html', { root: _root })
        res.render('top10char');
    }
});

app.get('/graph', async (req, res) => {
    const bookNum = req.query.bookNum;
    if (!isNaN(req.query.bookNum)) {
        const conn = await db.connect();
        let result = await db.getTop10Weight(conn, bookNum);
        conn.release();

        const edges = [];
        const nodes = [];

        for (let i = 0; i < result.length; i++) {
            const sourceName = result[i].source;
            const targetName = result[i].target;

            if (indexOfIdInArray(nodes, sourceName) < 0){
                const newNode = {id:sourceName, label:sourceName};
                nodes.push(newNode);
            }

            if (indexOfIdInArray(nodes, targetName) < 0){
                const newNode = {id:targetName, label:targetName};
                nodes.push(newNode);
            }

            const newEdge = { 
                from: sourceName, 
                to: targetName, 
                label: ''+result[i].weight, 
                font: { align: "horizontal" } 
            };

            edges.push(newEdge);
        };

        const data = {
            nodes: nodes,
            edges: edges
        };

        res.json(data);
    } else {
        res.render('graph');
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

    if (req.query.source !== undefined && req.query.book) {
        numBook = req.query.book;
        source = req.query.source;
    }
    let numBooks = await db.getBookNum(conn);
    let results_all = await db.getSourceCall(conn, numBook, source);
    let totalPage = Math.ceil(results_all.length / showLimit);
    let results = await db.getSourceCall(conn, numBook, source, showLimit, page);
    conn.release();
    let sebelumnya = parseInt(page) - 1;
    let selanjutnya = parseInt(page) + 1;
    let url_page = "/search/";
    let filter = `?book=${numBook}&source=${source}`;

    // console.log(req.body);
    let data = { source, numBook, numBooks, results, totalPage, page, sebelumnya, selanjutnya, url_page, filter };
    res.render('search', data);
})