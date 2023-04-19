const {MongoClient, ServerApiVersion} = require('mongodb');

let dbConnection 

module.exports = {
    connectToDB:(cb)=>{
        const URI ='mongodb+srv://vinhqua:Quang123@cluster0.uvd1bzz.mongodb.net/bookstore'
        MongoClient.connect(URI,{serverApi:{version:ServerApiVersion.v1,strict:true,deprecationErrors:true}})
        .then(client=>{
            dbConnection= client.db()
            return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        });
    },
    getDB:()=> dbConnection
}

