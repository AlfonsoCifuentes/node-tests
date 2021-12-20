const http = require("http");

const fs = require("fs");

const PORT = 3000;

const htmlAResponder = `<html>
<body>
    <h1>
        Servidor de pruebas
    </h1>
    <h3>
        Usando content type HTML
    </h3>
</body>
</html>`;

// const usuarios = [
//   { id: 1, nombre: "Alfonso", apellido: "Cifuentes", edad: 38 },
//   { id: 2, nombre: "Trent", apellido: "Reznor", edad: 45 },
// ];

const requestHandler = (request, response) => {
  // console.log ("Petición que nos llega: ", request);
  // console.log ("______________________________");
  // console.log ("Respuesta que podemos dar: ", response);
  if (request.url === "/") {
    response.setHeader("Content-Type", "text/html");
    response.end(htmlAResponder);
    return;
  }
  if (request.url === "/usuarios") {
    fs.readFile("./usuarios.json", (error, datos) => {
      if (error) {
        response.writeHead(500);
        response.end("Error en servidor, vuelva a intentarlo luego");
        return;
      }

      //const usuarios = JSON.parse(datos); //No hace falta porque ya es Json
      response.setHeader("Content-Type", "application/json");
      response.end(datos);
    });
    
    return;
  }

  response.writeHead(404);
  response.end("Elemento no encontrado");
};

const server = http.createServer(requestHandler);

server.listen(PORT, (error) => {
  if (error) {
    console.error("Error al arrancar el servidor :(");
  }

  console.log("Servidor arrancado con éxito");
});
