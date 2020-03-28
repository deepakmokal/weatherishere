const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
  const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
getData();

async function getData(){
    const response = await fetch('/api');
    const data = await response.json();

    for(let item of data){
       
        
        try{
           
            const marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
            let txt = ` The weather informartion if 

            <strong>City:</strong> ${item.weather_time}  ${item.weather.icon}
            Temprature: ${item.weather.temperature} &deg;F 
            Atmosphere: ${item.weather.summary}
            Value:${item.air.value}
            Unit: ${item.air.unit}
            Parameters: ${item.air.parameter} 
            Windspeed: ${item.weather.windSpeed}    
            Dew point: ${item.weather.dewPoint}
            Humidity: ${item.weather.humidity}
            Last updated: ${item.air.lastUpdated }`
        
        marker.bindPopup(txt);
    
            
        }catch(error){
            console.log(error)
        }
    }
   
}

