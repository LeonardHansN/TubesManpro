import mysql from "mysql2";
const table = "interactions"
let pool;

export default class GOTDatabase {
    constructor(poolOptions) {
        pool = mysql.createPool(poolOptions);
    }

    // Method untuk membuat koneksi ke DB
    connect = () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
    };
    getBookNum = async () => {
        const conn = await this.connect();
        const sqlquery = `SELECT DISTINCT(book) FROM ${table}`;
        return new Promise((resolve, reject) => {
            conn.query(sqlquery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    getSourceCall = (conn, bookNum, src, showLimit = 0, page = 0) => {
        let sqlquery = `
        SELECT * FROM interactions
        WHERE book =?
        AND source like ?
        ORDER BY weight desc
        `
        let data_query = [bookNum, `%${src}%`]
        if (showLimit > 0 && page > 0) {
            sqlquery += ` LIMIT ?, ?`;
            let startPage = (page - 1) * showLimit;
            data_query.push(startPage)
            data_query.push(showLimit)
        }
        return new Promise((resolve, reject) => {
            conn.query(sqlquery, data_query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    // Method-method untuk mengambil data dari database
    getTop10Interactions = (conn, bookNum) => {
        const sqlquery = `
            SELECT 
                source,
                sum(weight) as totweight
            FROM interactions
            WHERE book = ?
            GROUP BY source
            ORDER BY totweight DESC
            LIMIT 10;`;
        return new Promise((resolve, reject) => {
            conn.query(sqlquery, [bookNum], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
}
