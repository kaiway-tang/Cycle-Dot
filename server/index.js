const express = require('express');        
const cors = require('cors');                    
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000; // Or any other port you prefer

const mongoConnectionString = 'mongodb+srv://Kaiway:R3quirement$@cycledot.rihksa7.mongodb.net/?retryWrites=true&w=majority&appName=CycleDot'; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

let locationsCollection = {};
app.get('/api', (req, res) => {
  res.send("WORKING");
});

    // Route to save location
    app.post('/api/savelocation', (req, res) => {
      locationsCollection.insertOne(req.body)
        .then(result => res.send(result))
        .catch(error => console.error(error));
    });

    app.get('/api/locations', (req, res) => {
      locationsCollection.find().toArray()
        .then(results => res.send(results))
        .catch(error => console.error(error));
    });

// Connect to MongoDB
MongoClient.connect(mongoConnectionString)
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('location_data');
    locationsCollection = db.collection('locations');

    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch(error => console.error(error));

module.exports = app;

