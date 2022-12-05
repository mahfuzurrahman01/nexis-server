const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()
var jwt = require('jsonwebtoken');
//middleware
app.use(cors())
app.use(express.json())

//verify jwt
//verifyJwt
const verifyJwt = (req, res, next) => {
    const authHeaders = req.headers.authorization
    if (!authHeaders) {
        res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeaders.split(' ')[1]

    jwt.verify(token, process.env.TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
}




//Mongodb set up
const uri = `mongodb+srv://nexis01:${process.env.DB_PASS}@cluster0.ayfrszi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const logInUsersCollection = client.db('urbanCollection').collection('loggedInUsers')
        const signUpUsersCollection = client.db('urbanCollection').collection('signUpUsers')
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await signUpUsersCollection.findOne(query)
            if (user) {
                const token = jwt.sign({ email }, process.env.TOKEN, { expiresIn: '24h' })
                return res.send({ token: token })
            }
            res.status(403).send({ accessToken: '' })
        })
        app.post('/signUp', async (req, res) => {
            const body = req.body;
            const result = await signUpUsersCollection.insertOne(body)
            res.send(result)
        })

        app.post('/signIn', async (req, res) => {
            const body = req.body;
            const result = await logInUsersCollection.insertOne(body)
            res.send(result)
        })
        //get all the sign in users
        app.get('/allUsers', verifyJwt, async (req, res) => {
            const query = {}
            const users = await signUpUsersCollection.find(query).toArray()
            res.send(users)
        })
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