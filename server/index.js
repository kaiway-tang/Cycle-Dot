const express = require('express');        
const cors = require('cors');                    
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3001; // Or any other port you prefer

const mongoConnectionString = 'mongodb+srv://Kaiway:R3quirement$@cycledot.rihksa7.mongodb.net/?retryWrites=true&w=majority&appName=CycleDot'; 

// Middleware
app.use(cors(
  {
    origin: ["https://deploy-menn-1whq.vercel.app"]
  }
));
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(mongoConnectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('location_data');
    const locationsCollection = db.collection('locations');

    // Route to save location
    app.post('/savelocation', (req, res) => {
      locationsCollection.insertOne(req.body)
        .then(result => res.send(result))
        .catch(error => console.error(error));
    });

    app.get('/locations', (req, res) => {
      locationsCollection.find().toArray()
        .then(results => res.send(results))
        .catch(error => console.error(error));
    });

    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch(error => console.error(error));

