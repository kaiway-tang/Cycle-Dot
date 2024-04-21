const express = require('express');        
const cors = require('cors');                    
const { MongoClient, Timestamp } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const mongoConnectionString = 'mongodb+srv://Kaiway:R3quirement$@cycledot.rihksa7.mongodb.net/?retryWrites=true&w=majority&appName=CycleDot'; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let dbClient;

// Connect to MongoDB using connection pooling
async function connectToDatabase() {
  if (!dbClient) {
    try {
      dbClient = await MongoClient.connect(mongoConnectionString);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
  return dbClient.db('location_data');
}

// Route to save location
app.post('/api/savelocation', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const locationsCollection = db.collection('locations');
    const result = await locationsCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).send('Error saving location');
  }
});

// Route to get all locations
app.get('/api/locations', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const locationsCollection = db.collection('locations');
    const results = await locationsCollection.find().toArray();
    res.send(results);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).send('Error fetching locations');
  }
});

app.post('/create-account', async (req, res) =>{
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('users');
    const result = await userCollection.insertOne({
      username: req.body.status,
      password: req.body.robo_thrusters,
      age: 5, 
      timestamp: new Date().toString()
    });

    res.json("very g");
    console.log("all g");
  } catch {
    
  }
}

)

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;
