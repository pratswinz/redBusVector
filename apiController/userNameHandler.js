const mongodb = require('../controller/connector');
const uuid = require('uuid');

module.exports = (req, res, next) => {
    mongodb.connect()
    .then(connector => {
        const dbo = connector.db("vector-db");
        const query = { userId: req.query.userId };
        dbo.collection("scores").find(query).toArray((err, result) => {
            if(result.length === 0){
                res.send(true);
            }else{
                res.send(false);
            }
        })
    })
}