
const express = require('express');
const cors =require('cors');
const app = express();
require('dotenv').config();
const port =process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ewvrucy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db("wildPhoto").collection("services");
    const reviewCollection = client.db("wildPhoto").collection("reviews");
    
    app.get('/services-home',async (req,res) =>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    })
    app.get('/services',async (req,res) =>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
  });

  ////reviews/--------------------------

  app.get('/reviews', async (req, res) => {
    let query = {};

    if (req.query.email) {
        query = {
            email: req.query.email
        }
    }
    if (req.query.service) {
      query = {
        service : req.query.service
      }
  }
   
    
      const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

///////////----------------------------
 
app.post('/reviews', async (req, res) => {
  const review = req.body;
  const result = await orderCollection.insertOne(review);
  res.send(result);
});

app.patch('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const status = req.body.status
  const query = { _id: ObjectId(id) }
  const updatedDoc = {
      $set:{
          status: status
      }
  }
  const result = await reviewCollection.updateOne(query, updatedDoc);
  res.send(result);
})


app.delete('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await reviewCollection.deleteOne(query);
  res.send(result);
})

  }
  finally{

  }

}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('wild server is running')
})






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })  ;