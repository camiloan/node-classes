import express from 'express';
import hbs from 'hbs';
import * as url from 'url';
import 'dotenv/config';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port =process.env.PORT;

// Handlebars
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Servir contenido estático
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home', {
    nombre: 'Camilo Bolaños',
    titulo: 'Curso de Node',
  });
});

app.get('/generic', (req, res) => {
  res.render('generic', {
    nombre: 'Camilo Bolaños',
    titulo: 'Curso de Node',
  });
});

app.get('/elements', (req, res) => {
  res.render('elements', {
    nombre: 'Camilo Bolaños',
    titulo: 'Curso de Node',
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
