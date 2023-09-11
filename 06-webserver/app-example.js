import http from 'http';

http
  .createServer((req, res) => {
    console.log(req);
    res.setHeader('Content-Disposition','attachment; filename=list.csv')
    res.writeHead(200, { 'Content-Type': 'application/csv' });

    const persona = {
      id: 1,
      nombre: 'Camilo',
    };
    // res.write(JSON.stringify(persona));
    res.write('id, nombre\n')
    res.write('1, Camilo\n')
    res.write('2, Maria\n')
    res.write('3, Juan\n')
    res.write('4, Pedro\n')
    // res.write('Hola Mundo');
    res.end();
  })
  .listen(8080);

console.log('Escuchando el puerto', 8080);
