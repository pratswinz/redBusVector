const mongodb = require('../controller/connector');

module.exports = (req, res, next) => {
    mongodb.connect()
        .then(connector => {
            const dbo = connector.db("vector-db");
            const query = { userId: req.body.userId };
            dbo.collection("scores").find(query).toArray((err, result) => {
                if (err) throw err;
                if (result.length === 1) {
                    const newValues = { $set: { totalScore: parseInt(result[0].totalScore) + parseInt(req.body.score) } };
                    dbo.collection("scores").updateOne(query, newValues, (err, resultRec) => {
                        if (err) {
                            throw err;
                        }
                        connector.close();
                        res.send("records updated");
                    })
                } else {
                    const obj = {
                        userId: req.body.userId,
                        totalScore: parseInt(req.body.score)
                    }
                    dbo.collection("scores").insertOne(obj, (err, resultRec) => {
                        if (err) throw err;
                        connector.close();
                        res.send("records updated");
                    })

                }
            })
        }).catch(err => {
            console.log("Error ", err);
        })
}