const mongodb = require('../controller/connector');
const moment = require('moment');

module.exports = (req, res, next) => {
    mongodb.connect()
        .then(connector => {
            const dbo = connector.db("vector-db");
            const query = { userId: req.query.userId };
            const sessionId = req.query.sessionId || "";
            const score = typeof req.query.score === "number" ? req.query.score : 0;
            if (sessionId != "") {
                dbo.collection("scores").find(query).forEach((doc) => {
                    doc.totalScore += score;
                    doc.sessionList.forEach(event => {
                        if (event.sessionId === sessionId) {
                            event.sessionEndTime = moment().format("YYYY-MM-DD HH:mm");
                            event.score = score;
                            doc.sessionActive = false;
                        }
                    })
                    dbo.collection("scores").save(doc);
                    connector.close();
                    res.send("Updated records");
                })
            } else {
                res.send("");
            }
        }).catch(err => {
            console.log("Error ", err);
        })
}