const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.host = process.env.DB_HOST;
        this.db_name = process.env.DB_NAME;
        this.username = process.env.DB_USER;
        this.password = process.env.DB_PASSWORD;
        this.port = parseInt(process.env.DB_PORT, 10);
        // Enable SSL when DB_SSL=true. You can control certificate verification via DB_SSL_REJECT_UNAUTHORIZED (default true)
        this.ssl = (process.env.DB_SSL === 'true')
            ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
            : undefined;
        this.connection = null;
    }

    async getConnection() {
        try {
            if (!this.connection) {
                const connectionOptions = {
                    host: this.host,
                    port: this.port,
                    user: this.username,
                    password: this.password,
                    database: this.db_name,
                    charset: 'utf8mb4',
                    timezone: '+00:00',
                    connectTimeout: 10000
                };

                if (this.ssl) {
                    connectionOptions.ssl = this.ssl;
                }

                this.connection = await mysql.createConnection(connectionOptions);
                
                console.log('Database connected successfully');
            }
            return this.connection;
        } catch (error) {
            console.error('Database connection error:', error);
            console.error('Connection details:', {
                host: this.host,
                user: this.username,
                database: this.db_name,
                hasPassword: !!this.password
            });
            throw new Error(`Connection error: ${error.message}`);
        }
    }

    async query(sql, params = []) {
        try {
            const connection = await this.getConnection();
            const [rows, fields] = await connection.execute(sql, params);
            // For INSERT/UPDATE/DELETE operations, we need to return the full result object
            // For SELECT operations, we return just the rows
            const sqlType = sql.trim().toUpperCase();
            if (sqlType.startsWith('INSERT') || sqlType.startsWith('UPDATE') || sqlType.startsWith('DELETE')) {
                return { insertId: rows.insertId, affectedRows: rows.affectedRows };
            }
            return rows;
        } catch (error) {
            console.error('Query error:', error);
            // If connection is lost, try to reconnect
            if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ETIMEDOUT') {
                console.log('Connection lost, attempting to reconnect...');
                this.connection = null;
                try {
                    const connection = await this.getConnection();
                    const [rows, fields] = await connection.execute(sql, params);
                    // For INSERT/UPDATE/DELETE operations, we need to return the full result object
                    // For SELECT operations, we return just the rows
                    const sqlType = sql.trim().toUpperCase();
                    if (sqlType.startsWith('INSERT') || sqlType.startsWith('UPDATE') || sqlType.startsWith('DELETE')) {
                        return { insertId: rows.insertId, affectedRows: rows.affectedRows };
                    }
                    return rows;
                } catch (retryError) {
                    console.error('Reconnection failed:', retryError);
                    throw retryError;
                }
            }
            throw error;
        }
    }

    async closeConnection() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            console.log('Database connection closed');
        }
    }
}

// Create singleton instance
const database = new Database();

module.exports = database;

