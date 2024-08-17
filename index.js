const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
require('dotenv').config();


// `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbc3sln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const uri = "mongodb+srv://luster321:N8LFL890X6C1BMSU@cluster0.gszte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        client.connect();
        console.log('database connected')
        const ordersCollection = client.db('duvera').collection('orders');

        app.get('/orders', async (req, res) => {
            const orders = await ordersCollection.find({}).toArray()
            res.send(orders);
        })
    }

    finally {
        // jnjsf
        // console.log('here is finally')
    }
};




run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('App is configuring...')
});


app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});

