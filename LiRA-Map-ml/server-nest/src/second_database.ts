import * as dotenv from "dotenv";
dotenv.config();

const { 
    DB_USER, DB_PASSWORD, 
    DB_USER_VIS, DB_PASSWORD_VIS, 
    DB_USER_POSTGIS, DB_PWD_POSTGIS 
} = process.env;


const BASE_CONFIG = {
    client: 'pg',
    debug: true,
    useNullAsDefault: true,
    pool: {
        min: 2,
        max: 10,
        "createTimeoutMillis": 3000,
        "acquireTimeoutMillis": 30000,
        "idleTimeoutMillis": 30000,
        "reapIntervalMillis": 1000,
        "createRetryIntervalMillis": 100,
        "propagateCreateError": false
    },
    log: {
        warn(msg: any) { console.log('warning', msg); },
        error(msg: any) { console.log('error', msg); },
        deprecate(msg: any) { console.log('deprecate', msg); },
        debug(msg: any) { console.log('debug', msg); },
    }
}

export const LIRA_FILTERED_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liradb.compute.dtu.dk", // "liradbdev.compute.dtu.dk",
        port: 5435,
        user : "postgres",
        password : "postgres",
        database : "FrictionDB",
    },
}

const mysql = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();const dbServer = {
    host: process.env.DB_FRICTION_HOST,
    port: process.env.DB_FRICTION_PORT,
    user: process.env.DB_FRICTION_USERNAME,
    password: process.env.DB_FRICTION_PASSWORD,
    database: process.env.DB_FRICTION_DATABASE
}
const tunnelConfig = {
    host: process.env.DB_FRICTION_SSH_HOST,
    port: 22,
    username: process.env.DB_FRICTION_SSH_USER,
    password: process.env.DB_FRICTION_SSH_PASSWORD
}
const forwardConfig = {
    srcHost: '127.0.0.1',
    srcPort: 5435,
    dstHost: dbServer.host,
    dstPort: dbServer.port
};
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) reject(err);
             const updatedDbServer = {
                 ...dbServer,
                 stream
            };
            const connection =  mysql.createConnection(updatedDbServer);
           connection.connect((error) => {
            if (error) {
                reject(error);
            }
            resolve(connection);
            });        });
    }).connect(tunnelConfig);
});