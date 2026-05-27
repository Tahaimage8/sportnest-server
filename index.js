const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("sportNestDB");
    const facilities = db.collection("facilities");
    const bookingCollection = db.collection("bookings");

    app.get("/facilities", async (req, res) => {
      const { search, type, ownerEmail, limit } = req.query;

      const query = {};

      // Search by facility name
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      //type
      if (type) {
        const typeList = type.split(",");

        query.facility_type = {
          $in: typeList.map((item) => new RegExp(`^${item}$`, "i")),
        };
      }

      //owner email
      if (ownerEmail) {
        query.owner_email = ownerEmail;
      }

      const result = await facilities
        .find(query)
        .limit(limit ? parseInt(limit) : 0)
        .toArray();

      res.send(result);
    });

    app.get("/my-facilities/:email", async (req, res) => {
      const { email } = req.params;

      const result = await facilities.find({ owner_email: email }).toArray();

      res.send(result);
    });
    app.get(`/facilities/:id`, async (req, res) => {
      const { id } = req.params;
      const result = await facilities.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/facilities", async (req, res) => {
      const newFacility = req.body;
      const result = await facilities.insertOne(newFacility);
      res.send(result);
    });

    app.patch("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const updatedFacility = req.body;

      const result = await facilities.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFacility },
      );

      res.send(result);
    });

    app.delete("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const result = await facilities.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });

    app.get("/booking/:userId", async (req, res) => {
      const { userId } = req.params;

      const result = await bookingCollection.find({ userId: userId }).toArray();

      res.json(result);
    });

    app.delete("/booking/:bookingId", async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(bookingId),
      });
      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Server Is Running Fine");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
