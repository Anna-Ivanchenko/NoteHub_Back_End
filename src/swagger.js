import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Notes API',
    description: 'REST API for managing notes with authentication',
  },
  servers: [
    {
      url: 'https://nodejs-hw-5-xp1z.onrender.com',
      description: 'Production (Render)',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const outputFile = './swagger-output.json';
const routes = [
  './routes/authRoutes.js',
  './routes/notesRoutes.js',
  './routes/userRoutes.js',
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
