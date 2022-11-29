
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

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ewvrucy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db("wildPhoto").collection("services");
    
    app.get('/services',async (req,res) =>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
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