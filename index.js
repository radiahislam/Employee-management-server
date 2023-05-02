const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// ########### Connect with MongoDb Start ############
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8qhbzp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// ########### Connect with MongoDb End ############

// ************* Async Function start ***************
async function run() {
  try {
    const adminDatabase = client.db("admindbs").collection("clients");
    const usersDatabase = client.db("admindbs").collection("users");
    const taskDatabase = client.db("admindbs").collection("task");
    const employDatabase = client.db("employdbs").collection("leaves");
    const attendanceDatabase = client.db("employdbs").collection("attendance");

    // ********** Users DBS start **************
    app.get("/users", async (req, res) => {
      const cursor = await usersDatabase.find({}).toArray();
      res.send(cursor);
    });

    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersDatabase.insertOne(body);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      console.log(filter);
      const result = await usersDatabase.deleteOne(filter);
      res.send(result);
    });
    // ********** Users DBS end ****************

    // ********** Clients DBS start **************
    app.get("/clients", async (req, res) => {
      const cursor = await adminDatabase.find({}).toArray();
      res.send(cursor);
    });

    app.post("/clients", async (req, res) => {
      const body = req.body;
      const result = await adminDatabase.insertOne(body);
      res.send(result);
    });

    app.delete("/clients/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await adminDatabase.deleteOne(filter);
      res.send(result);
    });
    // ********** Clients DBS end **************
    
    // ********** Task section start ***********
    app.get("/task", async (req, res) => {
      const cursor = await taskDatabase.find({}).toArray();
      res.send(cursor);
    });

    app.post("/task", async (req, res) => {
      const body = req.body;
      const result = await taskDatabase.insertOne(body);
      res.send(result);
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskDatabase.deleteOne(filter);
      res.send(result);
    });
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTask = {
        $set: {
          title: user.title,
          priority: user.priority,
          date: user.date,
          details: user.details,
        },
      };
      const result = await taskDatabase.updateOne(filter, updateTask, options);
      res.send(result);
    });
    // ********** Task section end ***********

    // *************** Employ AttendanceDatabase start****************
    app.get("/attendance", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = attendanceDatabase.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/attendance", async (req, res) => {
      const body = req.body;
      const result = await attendanceDatabase.insertOne(body);
      res.send(result);
    });
    // *************** Employ AttendanceDatabase End****************

    // *************** Employ Leaves start****************
    app.get("/leaves", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = employDatabase.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/leaves", async (req, res) => {
      const body = req.body;
      const result = await employDatabase.insertOne(body);
      res.send(result);
    });

    app.put("/leaves/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTask = {
        $set: {
          email: user.email,
          date: user.date,
          type: user.type,
          status: user.status,
          reason: user.reason,
        },
      };
      const result = await employDatabase.updateOne(
        filter,
        updateTask,
        options
      );
      res.send(result);
    });
    app.delete("/leaves/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await employDatabase.deleteOne(filter);
      res.send(result);
    });
    // *************** Employ Leaves end******************
  } finally {
  }
}
run().catch(console.dir);
// ************* Async Function End ***************

app.get("/", (req, res) => {
  res.send("Running...");
});

app.listen(port, () => {
  console.log(`Employee management running on port ${port}`);
});
