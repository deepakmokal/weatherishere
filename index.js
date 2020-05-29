const express = require('express');
const cors = require('cors')
var favicon = require('serve-favicon');
var path = require('path');
const Datastore = require('nedb')
const app = express();
const fetch = require('node-fetch');
require('dotenv').config()
const port = process.env.PORT || 3000;
const timestamp = Date.now();
const database = new Datastore('database.db');
app.use(cors());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,"public")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(express.json({limit:'1mb'}));
app.listen(port, ()=>{console.log(`api server is runnning on ${port}`)});
database.loadDatabase();

app.get('/api',(request, response)=>{
    database.find({}, (error, data)=>{
        if(error){
            response.end();
            return;
        }
        response.json(data);
    })
});


app.post('/api', (request, response)=>{
    const data = request.body;
    data.timestamp = timestamp;
    
    database.insert(data);
    
    // response.json({
    //     'status': 'success',
    //     'latitude': data.latitude,
    //     'longitude': data.longitude,
    //     'timestamp': timestamp 
    // });
});

app.get('/weather/:latlon', async(request,response)=>{
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}`;
    const weather_fetch = await fetch(weather_url);
    const weather_data = await weather_fetch.json();

    
    const openaq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const openaq_fetch = await fetch(openaq_url);
    const openaq_data = await openaq_fetch.json();
    
    const data = {
        weather: weather_data,
        openaq: openaq_data
    }
    response.json(data);
    
})


