const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('port is running on server')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxkguw5.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

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

        app.post('/toys/', async(req, res) => {
            const addToys = req.body
            const result = await toysCollection.insertOne(addToys)
            res.send(result)
        })

        app.get('/mytoys',async(req, res)=>{
            // console.log(req.query.email)
            const email = req.query.email
            console.log(email)
            const query = {email: email}
            const cursor =  toysCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })

        app.patch('/toys/:id', async (req, res) => {
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const updateToy = req.body 
            const updateData = {
                $set: {
                    name : updateToy.name, 
                    subcategory : updateToy.subcategory, 
                    quantity : updateToy.quantity, 
                    price : updateToy.price, 
                    rating : updateToy.rating, 
                    picture : updateToy.picture,
                    description : updateToy.description
                }
            }
            const result = await toysCollection.updateOne(filter, updateData)
            res.send(result)
        })

        app.delete("/toys/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
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
