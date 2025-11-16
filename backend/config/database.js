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
            keepAliveInitialDelay: 0,
            // Add connection timeout settings
            connectTimeout: 10000, // 10 seconds
            acquireTimeout: 60000, // 60 seconds to acquire connection from pool
            timeout: 60000, // 60 seconds query timeout
            // Reconnection settings
            reconnect: true,
            // Note: mysql2 pool automatically handles reconnections on query execution
        };
        if (this.ssl) poolOptions.ssl = this.ssl;

        this.pool = mysql.createPool(poolOptions);

        // Keep-alive ping to prevent idle disconnects on providers like Render
        // Reduced interval to 30 seconds to keep connections more active
        this.keepAliveTimer = setInterval(async () => {
            try {
                await this.pool.query('SELECT 1');
            } catch (error) {
                // Log keep-alive errors but don't throw - pool will handle reconnection
                if (error.code !== 'ECONNRESET' && error.code !== 'PROTOCOL_CONNECTION_LOST') {
                    console.warn('Keep-alive ping error:', error.message);
                }
            }
        }, 30 * 1000); // 30 seconds instead of 60

        console.log('Database pool created successfully');
        return this.pool;
    }

    async query(sql, params = [], retries = 3) {
        let lastError;
        
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const pool = this.createPool();
                const [rows] = await pool.execute(sql, params);
                const sqlType = sql.trim().toUpperCase();
                if (sqlType.startsWith('INSERT') || sqlType.startsWith('UPDATE') || sqlType.startsWith('DELETE')) {
                    return { insertId: rows.insertId, affectedRows: rows.affectedRows };
                }
                return rows;
            } catch (error) {
                lastError = error;
                
                // Check if it's a connection error that can be retried
                const isConnectionError = error.code === 'ECONNRESET' || 
                                        error.code === 'PROTOCOL_CONNECTION_LOST' ||
                                        error.code === 'ETIMEDOUT' ||
                                        error.code === 'ECONNREFUSED' ||
                                        error.fatal === true;
                
                if (isConnectionError && attempt < retries - 1) {
                    const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
                    console.warn(`Database connection error (attempt ${attempt + 1}/${retries}): ${error.code || error.message}. Retrying in ${delay}ms...`);
                    
                    // Try to recreate the pool if connection was lost
                    if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
                        try {
                            // Force pool to reconnect by recreating the pool
                            // This ensures fresh connections are established
                            const oldPool = this.pool;
                            this.pool = null;
                            
                            // Close old pool gracefully if possible
                            if (oldPool) {
                                try {
                                    await oldPool.end().catch(() => {});
                                } catch (closeError) {
                                    // Ignore close errors, we're recreating anyway
                                }
                            }
                            
                            // Recreate the pool for fresh connections
                            this.createPool();
                            console.log('Pool recreated after connection reset');
                        } catch (poolError) {
                            console.warn('Error handling pool reconnection:', poolError.message);
                            // Final fallback: try to recreate pool one more time
                            try {
                                this.pool = null;
                                this.createPool();
                            } catch (recreateError) {
                                console.error('Failed to recreate pool:', recreateError.message);
                            }
                        }
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                // If not a connection error or out of retries, throw immediately
                console.error('Query error:', error);
                throw error;
            }
        }
        
        // If we exhausted all retries, throw the last error
        console.error('Query failed after all retries:', lastError);
        throw lastError;
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

