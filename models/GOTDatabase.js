import mysql from "mysql2";

var pool;

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

    getSourceCall = (conn, bookNum, src, showLimit = 0, page = 0) => {
        const sqlquery = `
        SELECT target,COUNT(target) AS 'count' FROM interactions
        WHERE book =?
        AND source like ?
        GROUP by target
        ORDER BY count desc;
        `
        let data_query = [bookNum, `%${src}%`]
        if (showLimit > 0 && page > 0) {

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
