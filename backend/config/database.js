const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.host = process.env.DB_HOST;
        this.db_name = process.env.DB_NAME;
        this.username = process.env.DB_USER;
        this.password = process.env.DB_PASSWORD;
        this.port = parseInt(process.env.DB_PORT, 10) || 3306;
        // Enable SSL when DB_SSL=true. You can control certificate verification via DB_SSL_REJECT_UNAUTHORIZED (default true)
        this.ssl = (process.env.DB_SSL === 'true')
            ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
            : undefined;

        this.pool = null;
        this.keepAliveTimer = null;
    }

    createPool() {
        if (this.pool) return this.pool;
        const poolOptions = {
            host: this.host,
            port: this.port,
            user: this.username,
            password: this.password,
            database: this.db_name,
            charset: 'utf8mb4',
            timezone: '+00:00',
            waitForConnections: true,
            connectionLimit: parseInt(process.env.DB_POOL_LIMIT, 10) || 5,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        };
        if (this.ssl) poolOptions.ssl = this.ssl;

        this.pool = mysql.createPool(poolOptions);

        // Keep-alive ping to prevent idle disconnects on providers like Render
        this.keepAliveTimer = setInterval(async () => {
            try {
                await this.pool.query('SELECT 1');
            } catch (_) {}
        }, 60 * 1000);

        console.log('Database pool created successfully');
        return this.pool;
    }

    async query(sql, params = []) {
        try {
            const pool = this.createPool();
            const [rows] = await pool.execute(sql, params);
            const sqlType = sql.trim().toUpperCase();
            if (sqlType.startsWith('INSERT') || sqlType.startsWith('UPDATE') || sqlType.startsWith('DELETE')) {
                return { insertId: rows.insertId, affectedRows: rows.affectedRows };
            }
            return rows;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }

    async closeConnection() {
        if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
        }
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('Database pool closed');
        }
    }
}

// Create singleton instance
const database = new Database();

module.exports = database;

