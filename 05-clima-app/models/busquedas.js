import axios from 'axios';
import fs from 'fs';

class Busquedas {
  historial = [];
  dbPath = './db/database.json';

  constructor() {
    this.leerDB();
  }
  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(' ');
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(' ');
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lang: 'es',
      units: 'metric',
    };
  }

  async ciudad(lugar = '') {
    // petición http
    try {
      // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/BOGOTA.json?proximity=ip&language=es&access_token=pk.eyJ1Ijoic3BhcnRhbml2IiwiYSI6ImNsbWE2N2czejBtM2MzY3FmZHlzNjV4ZjcifQ.MeEmHgJ9ktLSzhyk3tu_Mw');
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });
      const resp = await intance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return []; // retornar los lugares
    }
  }

  async climaLugar(lat, lon) {
    try {
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const resp = await intance.get();
      const { weather, main } = resp.data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }
  agregarHistorial(lugar = '') {
    //TODO: Prevenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 4);
    this.historial.unshift(lugar.toLocaleLowerCase());
    //  Grabar en DB
    this.guardarDB();
    // Leer en DB
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDB() {
    // Debe de existir
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

    const { historial } = JSON.parse(info);

    this.historial = historial;
    // this.historial = { ...this.historial, data };
  }
}

export { Busquedas };
