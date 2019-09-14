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
                                event.sessionEndTime = moment().parseZone().format("YYYY-MM-DD HH:mm");
                                event.score = score;
                                doc.sessionActive = false;
                            }
                        })
                        dbo.collection("scores").save(doc);
                        // connector.close();
                        res.end("Updated records");
                        return;
                    }
                })
            } else {
                res.end("Session Id not received");
                return;
            }
            res.end("Updated records");
        }).catch(err => {
            console.log("Error ", err);
        })
}