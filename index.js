require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.DB_PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ashfatul-islam.n5mxo6a.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   const database = client.db("AshfatulDB");
   const projects = database.collection("Projects");
   try {
      app.get("/", (req, res) => {
         res.send("Project Server Is Running");
      });

      app.post("/projects", (req, res) => {
         const data = req.body;
         const result = projects.insertOne(data);
         res.send(result);
      });
   } catch (error) {
      console.log(error);
   }
}
run().catch(console.dir);

app.listen(port);
