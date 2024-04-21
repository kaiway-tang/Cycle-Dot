const express = require('express');        
const cors = require('cors');                    
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000; // Or any other port you prefer

const mongoConnectionString = 'mongodb+srv://Kaiway:R3quirement$@cycledot.rihksa7.mongodb.net/?retryWrites=true&w=majority&appName=CycleDot'; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Define your routes here
app.get('/api', (req, res) => {
  res.send("WORKING");
});

app.post('/api/savelocation', (req, res) => {
  MongoClient.connect(mongoConnectionString)
    .then(client => {
      const db = client.db('location_data');
      const locationsCollection = db.collection('locations');
      locationsCollection.insertOne(req.body)
        .then(result => res.send(result))
        .catch(error => {
          console.error(error);
          res.status(500).send('Error saving location');
        })
        .finally(() => client.close());
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error connecting to database');
    });
});

app.get('/api/locations', (req, res) => {
  MongoClient.connect(mongoConnectionString)
    .then(client => {
      const db = client.db('location_data');
      const locationsCollection = db.collection('locations');
      locationsCollection.find().toArray()
        .then(results => res.send(results))
        .catch(error => {
          console.error(error);
          res.status(500).send('Error fetching locations');
        })
        .finally(() => client.close());
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error connecting to database');
    });
});

// Connect to MongoDB and start server
MongoClient.connect(mongoConnectionString)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch(error => console.error(error));

module.exports = app;
