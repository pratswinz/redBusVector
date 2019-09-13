const MongoClient = require('mongodb').MongoClient;
const keys = require('../config/keys');

const connect = () => {
    console.log(keys.mongoURI);
    return new Promise((resolve, reject) => {
        MongoClient.connect(keys.mongoURI, { useNewUrlParser: true }, (err, db) => {
            if(err){
                console.log("Error in connecting to db");
                reject(err);
                return
            }
            console.log("Connected to DB");
            resolve(db);
        })
    })
}

exports.connect = connect;