import express from 'express';
import initRoutes from './app';
import initDb from './db';

const port= process.env.PORT || 5000;
const app = express();
app.use(express.urlencoded({ extended: false, limit: '1gb' }));

initDb;
initRoutes(app) 

app.listen(port, () => {
  console.log(`Express server listening on ${port} `);
});
  
export default app;