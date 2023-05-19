const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('port is running on server')
})

//actionToys
//ZKIt4hB1iIGCdsJH



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://actionToys:ZKIt4hB1iIGCdsJH@cluster0.rxkguw5.mongodb.net/?retryWrites=true&w=majority";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toysCollection = client.db("actionDB").collection("toys")

        app.get('/toys', async (req, res) => {
            const cursor = await toysCollection.find().toArray()
            res.send(cursor)
        })

        app.get('/toys/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await toysCollection.findOne(query)
            res.send(result)
        })

        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})
