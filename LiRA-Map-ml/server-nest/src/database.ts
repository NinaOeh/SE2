//ELiot Ullmo

import * as dotenv from "dotenv";
dotenv.config();

const { 
    DB_USER, DB_PASSWORD, 
    DB_USER_VIS, DB_PWD_VIS, 
    DB_USER_POSTGIS, DB_PWD_POSTGIS,
    DB_USER_FRICTION, DB_PWD_FRICTION,
    LIRA_DB_SERVER,
    DB_USER_LIRA, DB_PWD_LIRA,
    LIRA_DB_DATABASE
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

export const LIRA_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liradbdev.compute.dtu.dk", // "liradb.compute.dtu.dk",
        port: 5432,//5435,
        user : DB_USER_LIRA, //"guest",
        password : DB_PWD_LIRA, //"V2GjxQVn",
        database : "postgres"
    },
}


export const VISUAL_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liravisualization.postgres.database.azure.com",
        port: 5432,
        user : DB_USER_VIS,
        password : DB_PWD_VIS,
        database : "postgres",
        ssl: true
    },
}

export const POSTGIS_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host : "liradb.postgres.database.azure.com",
        port: 5432,
        user : DB_USER_POSTGIS, //postgres
        password : DB_PWD_POSTGIS, //postgres
        database : "postgis",
        ssl: true
    },
}

export const FRICTION_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host: "localhost", 
        port: 5432,
        // debug:true,
        user: DB_USER_FRICTION,
        password: DB_PWD_FRICTION,
        database: "postgres",
    }
}
