import app from './app';  // Importer l'application configurée
import 'dotenv/config';
import mongoose, { connect, ConnectOptions } from 'mongoose';
import { config } from "./config/config";
import { logger } from './utils/logger';
import https from 'https';
import os from 'os';
import fs from 'fs';
import Product from './models/product.model';
import path from 'path';

const IP_ADDR = getLocalIPAddress();
const port = config.PORT || 3000;
const CLUSTER_URL = config.CLUSTER_URL || "mongodb+srv://raphaelpaquin19:banana78@cluster0.sdueo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectOptions: ConnectOptions = {
    dbName: "products",
    serverApi: { version: "1", deprecationErrors: true, strict: true }
};

const run = async () => {
    logger.info(`=== connecting to : ${config.CLUSTER_URL} ===`);

    // await seed(); // Run this to seed the database

    await connect(CLUSTER_URL, connectOptions);
}

run().catch(err => logger.error(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error to mongo db"));
db.once('open', () => {
    console.log('=== Connected to MongoDb Collection ===');
});

if (config.ENV === "production") {
    // Démarrer le serveur
    app.listen(port, () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
    });
  } else {
  
    const httpsOptions: https.ServerOptions = {
      key: fs.readFileSync(path.resolve(config.CERT_KEY ?? "")),
      cert: fs.readFileSync(path.resolve(config.CERT_CERT ?? "")),
    };
  
    // Step 10. Create and start the HTTPS server
    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`Server is running on https://${IP_ADDR}:${port}`);
    });
    
  }


// Used to seed our collection 
const seed = async () => {
    const productNames = [
        "Eco-Friendly Bamboo Desk", "Ergonomic Office Chair", "Adjustable Standing Desk",
        "Solid Oak Bookshelf", "Compact Computer Desk", "Leather Executive Chair",
        "Modern Glass Coffee Table", "Minimalist Writing Desk", "Vintage Oak Cabinet",
        "Rustic Farmhouse Table", "Premium Workstation Desk", "Antique Mahogany Desk",
        "Contemporary Corner Desk", "Reclaimed Wood Study Table", "White Gloss Console Table",
        "Industrial Metal Desk", "Small Space Foldable Desk", "Portable Laptop Stand",
        "Cherry Wood Writing Table", "Dual Monitor Desk Riser", "Floating Wall Desk",
        "Convertible Desk Bed", "Child-Sized Study Desk", "Tempered Glass Writing Desk",
        "Smart Desk with USB Ports", "Sleek Black Office Table", "Heavy-Duty Workbench",
        "Minimalist Scandinavian Desk", "Classic Roll-Top Desk", "Compact Rolling Cart"
    ];

    for (let i = 0; i < productNames.length; i++) {
        const productData = {
            description: `A high-quality piece of furniture, perfect for enhancing your workspace. Item ${i + 1}`,
            name: productNames[i],
            price: Math.floor(Math.random() * 500) + 50,  
            quantity: Math.floor(Math.random() * 10) + 1, 
        };
        const product = new Product(productData);
        await product.save();
        logger.info(`Product "${productData.name}" saved successfully.`);
    }

    logger.info('All products have been saved to the database.');
}

function getLocalIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const addresses = networkInterfaces[interfaceName];
      for (const address of addresses ?? []) {
        if (address.family === 'IPv4' && !address.internal) {
          return address.address;
        }
      }
    }
    return 'IP address not found';
  }