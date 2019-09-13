const mongodb = require('../controller/connector');
const moment = require('moment');

module.exports = (req, res, next) => {
    mongodb.connect()
    .then(connector => {
        const dbo = connector.db("vector-db");
        dbo.collection("scores").find().forEach(doc => {
            doc.sessionActive = false;
            doc.sessionList.forEach(event => {
                if(event.sessionEndTime == null){
                    event.sessionEndTime = moment().format("YYYY-MM-DD HH:mm");
                }
            });
            dbo.collection("scores").save(doc);
        });
        res.send("Cleared");
    })
}