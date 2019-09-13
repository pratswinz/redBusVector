const mongodb = require('../controller/connector');

module.exports = (req, res, next) => {
    mongodb.connect()
    .then(connector => {
        const dbo = connector.db("vector-db");
        const sortQuery = { totalScore: -1 };
        let response = {
            "rank": 1,
            "toppers": []
        };

        let rank = 0;

        dbo.collection("scores").find().sort(sortQuery).toArray((err, result) => {
            if(err) throw err;
            for(let i = 0; i < result.length; i++){
                if(req.query.userId && result[i].userId === req.query.userId){
                    rank = i+1;
                    break;
                }
                rank = i+1
            }
        } )

        dbo.collection("scores").find().sort(sortQuery).limit(3).toArray((err, result) => {
            if(err) throw err;
            // connector.close();
            response.toppers = result;
            response.rank = rank === 0 ? 1 : rank;
            res.send(response);
        });
    })
}