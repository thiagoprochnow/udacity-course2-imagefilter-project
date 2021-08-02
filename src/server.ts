import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './util/sequelize';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { V0MODELS } from './models/model.index';
import { AuthRouter, requireAuth } from './user/routes/auth.router';

(async () => {

  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.use('/auth/',AuthRouter);

  // endpoint to filter an image from a public url.
  app.get('/filteredimage/', requireAuth, async (req, res) => {
    let { image_url } = req.query;

    // Verify if image url is set, if not, return 400
    if ( !image_url ) {
      return res.status(400)
                .send(`image_url is required`);
    }

    // Try to filter image with passed url, if success, returns image, else returns 500 error
    try{
      let file = await filterImageFromURL(image_url);
      res.status(200).sendFile(file, () => {
        deleteLocalFiles([file])
      })
    } catch (error) {
      res.status(500).send("Error getting image from URL")
    }
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();