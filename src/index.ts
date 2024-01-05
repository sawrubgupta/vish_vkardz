import express from 'express';
import initRoutes from './app';
import initDb from './db';
import initDbV2 from './dbV2';

const port= process.env.PORT || 5000;
const app = express();
app.use(express.urlencoded({ extended: false, limit: '1gb' }));
 
initRoutes(app) 
initDb; 
initDbV2;

app.listen(port, () => {
  console.log(`Express server listening on ${port} `);
});
   
export default app; 