import fs, { readFileSync } from 'fs';

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class Busquedas {
  historial = [];
  dbPath = './db/database.json';
  constructor() {
    
    this.leerDB();
   
  }

  get historialCapitalizado(){
    

    return this.historial.map ( lugar => {
        let palabras = lugar.split(' ');
        palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

        return palabras.join(' ');
    });
  }

  get paramsMAPBOX() {
    return {
      access_token: process.env.MAPBOX_KEY || '',
      limit: 5,
      language: 'es',
    };
  }

  get paramsOPENWEATHER(){
    return {
        limit: 5,
        appid: process.env.OPENWEATHER_KEY || '',
        units: 'metric',
        lang: 'es',
      };
  }

  async ciudad(ubicacion = '') {
    
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ubicacion}.json?`,
        params: this.paramsMAPBOX,
      });

      const resp = await instance.get();

      return resp.data.features.map((ubicacion) => ({
        id: ubicacion.id,
        nombre: ubicacion.place_name,
        lng: ubicacion.center[0],
        lat: ubicacion.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(latitud,longitud){
    try {
        
        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
            params: {...this.paramsOPENWEATHER,
                lat: latitud,
                lon: longitud
            }

          });
        const resp = await instance.get();  
        
        const {weather,main} = resp.data;
   
          return {
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
          }
    
    }catch(error){
        console.log(error);
    }
  } 

  agregarHistorial(lugar = ''){

    if(this.historial.includes(lugar.toLocaleLowerCase())){
        return;
    }

    this.historial = this.historial.splice(0,5);
    
    this.historial.unshift(lugar.toLocaleLowerCase());

    this.guardarDB();
  }

  guardarDB(){
        const payload= {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath,JSON.stringify(payload))
  }

  leerDB(){

        if(fs.existsSync(this.dbPath)){

            const info = readFileSync(this.dbPath,{encoding: 'utf-8'})
            const data = JSON.parse(info);
            
            this.historial = data.historial;
            

        }
  }
}

export {Busquedas};
