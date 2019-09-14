const mongodb = require('../controller/connector');
const moment = require('moment')
const uuid = require('uuid');

module.exports = (req, res, next) => {
    mongodb.connect()
    .then(connector => {
        const dbo = connector.db("vector-db");
        const query = {userId: req.query.userId};
        dbo.collection("scores").find(query).toArray((err, result) => {

            if (!Array.isArray(result)) {
                result = [];
            }

            if(result.length === 1){
                if(!result[0].sessionActive){
                    const sessionId = uuid.v4();
                    const sessionObj = { $set:{sessionActive: true}, $push: {sessionList: { sessionId: sessionId, sessionStartTime:  moment().format("YYYY-MM-DD HH:mm"), sessionEndTime: null, score: 0} }};
                    dbo.collection("scores").updateOne(query, sessionObj, (err, resultRec) => {
                        if(err) throw err;
                        // connector.close();
                        res.send(sessionId);
                    })
                }else{
                    res.send(false);
                }
            }else{
                const sessionId = uuid.v4();
                const sessionObj = {
                    userId: req.query.userId,
                    sessionActive: true,
                    sessionList: [
                        {
                            sessionId: sessionId,
                            sessionStartTime: moment().parseZone().format("YYYY-MM-DD HH:mm"),
                            sessionEndTime: null,
                            score: 0
                        }
                    ],
                    totalScore: 0
                };
                const dbo = connector.db("vector-db");
                dbo.collection("scores").insertOne(sessionObj,(err, resultRec) => {
                    if(err) throw err;
                    // connector.close();
                    res.send(sessionId);
                })
            }
        })
    })
}