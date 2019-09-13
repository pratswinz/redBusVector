const mongodb = require("../controller/connector");
const moment = require('moment');

module.exports = (req, res, next) => {
    mongodb.connect()
    .then(connector => {
        const dbo = connector.db("vector-db");
        const query = {userId: req.query.userId};
        //const newValues = { sessionActive: false, sessionList: {$set: {sessionEndTime: moment().format("YYYY-MM-DD HH:mm")} } };
        dbo.collection("scores").find(query).forEach(doc => {
            doc.sessionList.forEach(event => {
                if(event.sessionId === req.query.sessionId){
                    event.sessionEndTime = moment().format("YYYY-MM-DD HH:mm");
                    doc.sessionActive = false;
                }
            })
            dbo.collection("scores").save(doc);
        });
        
    })
}