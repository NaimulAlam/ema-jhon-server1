const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dspyj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
//middlewire here
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, {
  keepAlive: 1,
  connectTimeoutMS: 3000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
  // console.log("Database Connected");
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    // console.log(products);
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //sending single product
  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  //sending data on specific id value
  app.post("/productsByKeys", (req, res) => {
    const productsKey = req.body;
    productsCollection
      .find({ key: { $in: productsKey } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen( process.env.PORT || port );
