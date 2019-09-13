const mongodb = require('../controller/connector');

module.exports = (req, res, next) => {
    mongodb.connect()
    .then(connector => {
        const dbo = connector.db("vector-db");
        const sortQuery = { totalScore: -1 };
        dbo.collection("scores").find().sort(sortQuery).limit(25).toArray((err, result) => {
            if(err) throw err;
            connector.close();
            res.send("Sent");
        })
    })
}