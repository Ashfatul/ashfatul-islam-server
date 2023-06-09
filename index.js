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
   const user = database.collection("user");
   const social = database.collection("social");
   const skillsCategory = database.collection("skillsCategory");
   const skills = database.collection("skills");
   try {
      app.get("/", (req, res) => {
         res.send("Project Server Is Running");
      });

      app.get("/user", async (req, res) => {
         const query = { role: "admin" };
         const data = await user.findOne(query);
         res.send(data);
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
         const skipProject = parseInt(req.query.skip);
         const result = await projects
            .find()
            .sort({ date: -1 })
            .limit(max)
            .skip(skipProject)
            .toArray();
         res.send(result);
      });

      app.delete("/project/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = projects.deleteOne(query);
         res.send(result);
      });

      app.patch("/update-user-profile", async (req, res) => {
         const data = req.body;
         const options = { upsert: true };
         const query = { role: "admin" };
         const result = await user.updateOne(query, { $set: data }, options);
         res.send(result);
      });

      app.patch("/social-links", async (req, res) => {
         const data = req.body;
         const options = { upsert: true };
         const query = { role: "links" };
         const result = await social.updateOne(query, { $set: data }, options);
         res.send(result);
      });

      app.get("/social-links", async (req, res) => {
         const query = { role: "links" };
         const result = await social.findOne(query);
         res.send(result);
      });

      app.get("/update-project/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await projects.findOne(query);
         res.send(result);
      });

      app.get("/skills-category", async (req, res) => {
         const sortBy = { order: 1 };
         const result = await skillsCategory.find().sort(sortBy).toArray();
         res.send(result);
      });

      app.get("/skills/category/:id", async (req, res) => {
         const id = req.params.id;
         const query = { parentCategoryID: id };
         const sortBy = { order: 1 };
         const result = await skills.find(query).sort(sortBy).toArray();
         res.send(result);
      });

      app.post("/skills-category", async (req, res) => {
         const data = req.body;
         const result = skillsCategory.insertOne(data);
         res.send(result);
      });

      app.delete("/skills-category/delete/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = skillsCategory.deleteOne(query);
         res.send(result);
      });

      app.post("/add-skill", async (req, res) => {
         const data = req.body;
         const result = skills.insertOne(data);
         res.send(result);
      });

      app.get("/skills", async (req, res) => {
         const sortBy = { order: 1 };
         const result = await skills.find().sort(sortBy).toArray();
         res.send(result);
      });

      app.delete("/skills/delete/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await skills.deleteOne(query);
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
