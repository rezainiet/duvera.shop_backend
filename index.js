const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
require('dotenv').config();

// Use environment variables for the MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gszte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        await client.connect();
        console.log('Database connected');
        const ordersCollection = client.db('duvera').collection('orders');

        app.get('/orders', async (req, res) => {
            try {
                const orders = await ordersCollection.find({}).toArray();
                res.send(orders);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch orders' });
            }
        });

        app.post('/create-order', async (req, res) => {
            try {
                const order = req.body;
                const result = await ordersCollection.insertOne(order);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to create order' });
            }
        });

        app.delete("/delete-order/:id", async (req, res) => {
            try {
                const orderID = new ObjectId(req.params.id);
                const result = await ordersCollection.deleteOne({ _id: orderID });
                if (result.deletedCount === 0) {
                    res.status(404).send({ error: 'Order not found' });
                } else {
                    res.send({ message: 'Order deleted successfully' });
                }
            } catch (error) {
                res.status(500).send({ error: 'Failed to delete order' });
            }
        });
    } finally {
        // Optional: close the client connection if you want to clean up resources
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('App is configuring...');
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
