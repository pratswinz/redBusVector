const mongodb = require('../controller/connector');
const moment = require('moment');

module.exports = (req, res, next) => {
    mongodb.connect()
        .then(connector => {
            const dbo = connector.db("vector-db");
            const query = { userId: req.query.userId };
            const sessionId = req.query.sessionId || "";
            const score = !isNaN(req.query.score) ? parseInt(req.query.score) : 0;
            if (sessionId != "") {
                dbo.collection("scores").find(query).forEach((doc) => {
                    if (doc.sessionActive) {
                        doc.totalScore += score;
                        doc.sessionList.forEach(event => {
                            if (event.sessionId === sessionId) {
                                sessionActive = true;
                                event.sessionEndTime = moment().format("YYYY-MM-DD HH:mm");
                                event.score = score;
                                doc.sessionActive = false;
                            }
                        })
                        dbo.collection("scores").save(doc);
                        // connector.close();
                        res.send("Updated records");
                        return;
                    }
                })
            } else {
                res.send("Session Id not received");
                return;
            }
            res.send("Updated records");
        }).catch(err => {
            console.log("Error ", err);
        })
}