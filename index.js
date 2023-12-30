const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const router = require('./router');
const { fail } = require('assert');
const { MongoClient } = require('mongodb');

const flash = require('express-flash');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Example if you're using EJS

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'simeon',
  resave: false,
  saveUninitialized: true,
  cookie: { secure:true }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(flash());

app.use('/', router)
app.listen(PORT, () => {
    console.log('Server is running on ${PORT}');
});

// const mongoDBUri = 'mongodb+srv://simeon:MQSd7SIBSsnIffPU@cluster0.ndntkkc.mongodb.net/?retryWrites=true&w=majority';

// const client = new MongoClient(mongoDBUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   ssl: true,
//   sslValidate: false,
//   // If using a self-signed certificate, you may also need the following line
//   // sslCert: fs.readFileSync('path/to/self-signed-cert.pem'),
// });

// async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log('Connected successfully to MongoDB');
    
//     // Further operations
//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// }

// connectToMongoDB();

// // mongoose.connect(mongoDBUri);

// // const db = mongoose.connection;

// // db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// // db.once('open', () => {
// //   console.log('Connected to MongoDB!');
// // });



// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // const uri = "mongodb+srv://simeon:MQSd7SIBSsnIffPU@cluster0.ndntkkc.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   }
// // });

// // async function run() {
// //   try {
// //     // Connect the client to the server	(optional starting in v4.7)
// //     await client.connect();
// //     // Send a ping to confirm a successful connection
// //     await client.db("admin").command({ ping: 1 });
// //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     await client.close();
// //   }
// // }
// // run().catch(console.dir);
