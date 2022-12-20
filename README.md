# LiRA Map, DTU Software Engineering 2 project, 2022

This project is the final submission of the course Software Engineering 2 at DTU. It extends the existing LiRA Map project that can be found in the following [repository](https://github.com/PeacefulOtter/LiRA-Map/tree/ml). 

The project containts a web application that runs on this [server](http://se2-a.compute.dtu.dk:3000) or can be deployed locally, when following the instructions. Furthermore it contains a stand-alone database pipeline to query data from the LiRA DB and insert it into the Friction DB, mapping each measurement to the most likely OSM wayId and calculating the friction value. All information on how to run the database pipeline can be found in the READ-ME document in the *database_setup* directory. 


# Instructions to run the application locally in DEVELOPMENT mode

To run the application locally in a Linux environment the following steps need to be followed

## 1. Clone the LiRA-Map repo
```console
git clone https://github.com/NinaOeh/SE2.git
cd SE2/LiRA-Map-ml
```

## 2. Start the Client 
```console
~/LiRA-Map$ cd client
~/LiRA-Map/client$ npm install
~/LiRA-Map/client$ npm start
```

## 3. Set up the Server
$\rightarrow$ the environment parameters are secret to contributors of the LiRA project. If you are just visiting please use the already build website that is linked in the text above
```console
~/LiRA-Map$ cd server-nest
~/LiRA-Map/server-nest$ nano .env
```

### The .env file must follow the format:
```
DB_USER_LIRA=<LIRA-CAR-DB-USER>
DB_PWD_LIRA=<LIRA-CAR-DB-PWD>
DB_USER_VIS=<SERGI-DB-USER>
DB_PWD_VIS=<SERGI-DB-PWD>
DB_USER_POSTGIS=<JUN-DB-USER>
DB_PWD_POSTGIS=<JUN-DB-USER>
DB_USER_FRICTION=<FRICTION-DB-USER>
DB_PWD_FRICTION=<FRICTION-DB-PWD>
```

## 4. Start the Server
```console
~/LiRA-Map/server-nest$ npm install
~/LiRA-Map/server-nest$ npm start
```

# Instructions to deploy the application locally in PRODUCTION mode

To deploy the application in a Linux environment the following steps need to be followed

## 1. Install local dependencies
```console
npm install -g serve pm2
```

## 2. Clone the LiRA-Map repo
```console
git clone https://github.com/NinaOeh/SE2.git
cd LiRA-Map
```

## 3. Start the Client 
```console
~/LiRA-Map$ cd client
~/LiRA-Map/client$ npm install
~/LiRA-Map/client$ npm run build
~/LiRA-Map/client$ pm2 serve build 3000 --spa --name client
```

## 4. Set up the Server
$\rightarrow$ the environment parameters are secret to contributors of the LiRA project. If you are just visiting please use the already build website that is linked in the text above
```console
~/LiRA-Map$ cd server-nest
~/LiRA-Map/server-nest$ nano .env
```

### The .env file must follow the format:
```
DB_USER_LIRA=<LIRA-CAR-DB-USER>
DB_PWD_LIRA=<LIRA-CAR-DB-PWD>
DB_USER_VIS=<SERGI-DB-USER>
DB_PWD_VIS=<SERGI-DB-PWD>
DB_USER_POSTGIS=<JUN-DB-USER>
DB_PWD_POSTGIS=<JUN-DB-USER>
DB_USER_FRICTION=<FRICTION-DB-USER>
DB_PWD_FRICTION=<FRICTION-DB-PWD>
```

## 5. Start the Server
```console
~/LiRA-Map/server-nest$ npm install
~/LiRA-Map/server-nest$ npm run build
~/LiRA-Map/server-nest$ pm2 start dist/main.js --name server
```
