require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.DB_PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

      app.post("/projects", async (req, res) => {
         const data = req.body;
         const tags = data.tags.split(",");
         const setData = {
            title: data.title,
            photo: data.photo,
            description: data.description,
            date: data.date,
            tags: tags,
            github: data.github,
            liveSite: data.liveSite,
         };
         const result = await projects.insertOne(setData);
         res.send(result);
      });

      app.get("/projects", async (req, res) => {
         const max = parseInt(req.query.limit);
         const result = await projects
            .find()
            .sort({ date: -1 })
            .limit(max)
            .toArray();
         res.send(result);
      });

      app.delete("/project/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = projects.deleteOne(query);
         res.send(result);
      });

      app.get("/update-project/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await projects.findOne(query);
         res.send(result);
      });
      app.put("/update-project/:id", async (req, res) => {
         const id = req.params.id;
         const data = req.body;
         const tags = data.tags.split(",");
         const setData = {
            $set: {
               title: data.title,
               photo: data.photo,
               description: data.description,
               date: data.date,
               tags: tags,
               github: data.github,
               liveSite: data.liveSite,
            },
         };
         const query = { _id: new ObjectId(id) };
         const result = projects.updateOne(query, setData);
         res.send(result);
      });
   } catch (error) {
      console.log(error);
   }
}
run().catch(console.dir);

app.listen(port);
