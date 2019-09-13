const MongoClient = require('mongodb').MongoClient;
const keys = require('../config/keys');

var dbConnection = "";

const connect = () => {
    return new Promise((resolve, reject) => {
        
        if (dbConnection) {
            console.log("Already Connected to DB");
            return resolve(dbConnection);
        }

        const options = {
            "useNewUrlParser": true,
            "poolSize": 10
        };
        
        MongoClient.connect(keys.mongoURI, options, (err, db) => {
            if(err){
                console.log("Error in connecting to db");
                reject(err);
                return
            }
            
            console.log("Connected to DB");
            dbConnection = db;
            resolve(db);
        })
    })
}

exports.connect = connect;