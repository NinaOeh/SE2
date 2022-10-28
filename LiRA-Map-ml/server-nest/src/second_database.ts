import * as dotenv from "dotenv";
dotenv.config();

const { 
    DB_FRICTION_HOST,
    DB_FRICTION_PORT,
    DB_FRICTION_USERNAME,
    DB_FRICTION_PASSWORD,
    DB_FRICTION_DATABASE,
    DB_FRICTION_SSH_HOST,
    DB_FRICTION_SSH_USER,
    DB_FRICTION_SSH_PASSWORD
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

export const FRICTION_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : DB_FRICTION_HOST,
        port: DB_FRICTION_PORT,
        user : DB_FRICTION_USERNAME,
        password : DB_FRICTION_PASSWORD,
        database : DB_FRICTION_DATABASE
    },
}