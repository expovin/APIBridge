const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config')


class Mongo {
    constructor(){
        this.conn="";

        var _this=this;
        MongoClient.connect(config.mongo.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            _this.conn = db.db(config.mongo.dbName);
        });
    }


    getRoute(route){
        var query = { route: route };
        console.log(query);
        return new Promise ((fulfill, reject) =>{
            this.conn.collection("Routes").find(query).toArray(function(err, result) {
                if (err) reject(err);

                
                fulfill (result);
            });   
        })
             
    }

    close(){
        this.conn.close();
    }
}

module.exports = Mongo
