const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require("path");
const axios = require('axios');
require("dotenv").config({ path: path.resolve(__dirname, '/.env') });

const uri = "mongodb+srv://nmeetul:nusrat355!@cluster0.dgshfcp.mongodb.net/?retryWrites=true&w=majority";
const databaseAndCollection = { db: "CMSC335_DB", collection: "cakeOrders" };

const app = express();
let port = process.argv[2];

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'templates'));
app.set('views', path.join(__dirname, '/'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// this is for stopping the server
process.stdin.on('readable', () => {
    const dataInput = process.stdin.read();
    if (dataInput !== null) {
        const command = String(dataInput).trim();
        if (command === "stop") {
            console.log("Shutting down the server");
            process.exit(0);
        } else {
            console.log("Type 'stop' to shut down the server");
        }
    }
});


app.get('/', async (req, res) => {
    res.render('homePage');
});

app.get('/applicationForm', (req, res) => {
    res.render('applicationForm');
});


/* app.get('/', async (req, res) => {
    res.render(path.join(__dirname, 'homePage'));
});

app.get('/applicationForm', (req, res) => {
    res.render(path.join(__dirname, 'applicationForm'));
}); */


app.post('/insert', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();

        const newApplicant = {
            name: req.body.name,
            email: req.body.email,
            num: parseInt(req.body.num),
            bginfo: req.body.bginfo
        };

        await insertApplicant(client, databaseAndCollection, newApplicant);

        res.render('dataPage', newApplicant);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});


async function insertApplicant(client, databaseAndCollection, newApplicant) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newApplicant);
    console.log(`Applicant entry created with id ${result.insertedId}`);
}

app.listen(port, () => {
    console.log(`Web server started running at http://localhost:${port}`);
    console.log(`Stop to shutdown server: `);
});

