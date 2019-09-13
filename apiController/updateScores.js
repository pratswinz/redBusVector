const mongodb = require('../controller/connector');
const moment = require('moment');

module.exports = (req, res, next) => {
    mongodb.connect()
        .then(connector => {
            const dbo = connector.db("vector-db");
            const query = { userId: req.query.userId };
            dbo.collection("scores").find(query).forEach((doc) => {
                doc.totalScore += parseInt(req.query.score);
                doc.sessionList.forEach(event => {
                    if (event.sessionId === req.query.sessionId) {
                        event.sessionEndTime = moment().format("YYYY-MM-DD HH:mm");
                        event.score = req.query.score;
                        doc.sessionActive = false;
                    }
                })
                dbo.collection("scores").save(doc);
                connector.close();
                res.send("Updated records");
            })
        }).catch(err => {
            console.log("Error ", err);
        })
}