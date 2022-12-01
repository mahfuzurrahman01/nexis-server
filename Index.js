const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())

//Mongodb set up
const uri = `mongodb+srv://nexis:${process.env.DB_PASS}@cluster0.w6iptv2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run() {
    try {
        const userCollection = client.db('User collection').collection('users')
        
    }
    finally {

    }
}

run().catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.send('Start running..........')
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})