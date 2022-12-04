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
