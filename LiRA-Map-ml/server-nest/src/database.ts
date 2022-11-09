
import * as dotenv from "dotenv";
dotenv.config();

<<<<<<< HEAD
const { 
    DB_USER, DB_PASSWORD, 
    DB_USER_VIS, DB_PASSWORD_VIS, 
    DB_USER_POSTGIS, DB_PWD_POSTGIS,
    LIRA_DB_SERVER,
    LIRA_DB_USER, LIRA_DB_PASSWORD,
    LIRA_DB_DATABASE
=======
const {
    DB_USER, DB_PASSWORD,
    DB_USER_VIS, DB_PASSWORD_VIS,
    DB_USER_POSTGIS, DB_PWD_POSTGIS,
    DB_USER_FRICTION, DB_PASSWORD_FRICTION
>>>>>>> a1a84c963646a747355a79eb1bb767085fb16c4f
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
<<<<<<< HEAD
        host : LIRA_DB_SERVER,
        port: 5435,
        user : LIRA_DB_USER,
        password : LIRA_DB_PASSWORD,
        database : LIRA_DB_DATABASE
=======
        host: "liradb.compute.dtu.dk", // "liradbdev.compute.dtu.dk",
        port: 5435,
        user: "guest",
        password: "V2GjxQVn",
        database: "postgres",
>>>>>>> a1a84c963646a747355a79eb1bb767085fb16c4f
    },
}


export const VISUAL_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host: "liravisualization.postgres.database.azure.com",
        port: 5432,
        user: DB_USER_VIS,
        password: DB_PASSWORD_VIS,
        database: "postgres",
        ssl: true
    },
}

export const POSTGIS_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host: "liradb.postgres.database.azure.com",
        port: 5432,
        user: DB_USER_POSTGIS,
        password: DB_PWD_POSTGIS,
        database: "postgis",
        ssl: true
    },
}

export const FRICTION_DB_CONFIG = {
    ...BASE_CONFIG,
    connection: {
        host: "localhost",
        port: 5432,
        user: DB_USER_FRICTION,
        password: DB_PASSWORD_FRICTION,
        database: "FrictionDB",
    }
}