const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.host = process.env.DB_HOST || 'localhost';
        this.db_name = process.env.DB_NAME || 'safebite';
        this.username = process.env.DB_USER || 'root';
        this.password = process.env.DB_PASSWORD || '';
        this.connection = null;
    }

    async getConnection() {
        try {
            if (!this.connection) {
                this.connection = await mysql.createConnection({
                    host: this.host,
                    user: this.username,
                    password: this.password,
                    database: this.db_name,
                    charset: 'utf8mb4',
                    timezone: '+00:00',
                    connectTimeout: 10000,
                    timeout: 10000
                });
                
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
            // For INSERT operations, we need to return the full result object
            // For SELECT operations, we return just the rows
            if (sql.trim().toUpperCase().startsWith('INSERT')) {
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
                    // For INSERT operations, we need to return the full result object
                    // For SELECT operations, we return just the rows
                    if (sql.trim().toUpperCase().startsWith('INSERT')) {
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

