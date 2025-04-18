const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CheckMe Backend',
        description: 'Description'
    },
    host: 'localhost:5050'
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
    require('./server.js'); // Your project's root file
});