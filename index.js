const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aea2zks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const touristSpotCollection = client.db("tourMaster").collection("touristSpots");
    const spotCollection = client.db("tourMaster").collection("allSpots");
    const countryCollection = client.db("tourMaster").collection("countries");

    app.get("/touristSpot", async (req, res) => {
      const result = await touristSpotCollection.find().toArray();
      res.send(result);
    });
    app.get("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.get("/allSpots", async (req, res) => {
      const filter=req.query
      console.log(filter)
      const query={}
      const options={
        sort :{
          average_cost : filter.sort === 'asc' ? 1 : -1
        }
      }
      const result = await spotCollection.find(query,options).toArray();
      res.send(result);
    });

    app.post("/allSpots", async (req, res) => {
      const spotData = req.body;
      const result = await spotCollection.insertOne(spotData);
      res.send(result);
    });

    app.get("/allSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    app.delete("/allSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    // get all spots added by Specefic User
    app.get("/allSpots/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "creator.email": email };
      const result = await spotCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/allSpot/:id", async (req, res) => {
      const id = req.params.id;
      const spotData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDocs = {
        $set: {
          ...spotData,
        },
      };
      const result = await spotCollection.updateOne(query, updateDocs, options);
      res.send(result);
    });

    // country api
    app.get("/country", async (req, res) => {
      const result = await countryCollection.find().toArray();
      res.send(result);
    });
    app.get("/country/:country_name", async (req, res) => {
      const country_name = req.params.country_name;
      const query = { country: country_name };
      const result = await spotCollection.find(query).toArray();
      res.send(result);
    });

 


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tourMAster server is running");
});
app.listen(port, () => {
  console.log(`tour Master running on port ${port}`);
});
