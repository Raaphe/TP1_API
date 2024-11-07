import app from './app';  // Importer l'application configurée
import 'dotenv/config';
import mongoose, { connect, ConnectOptions } from 'mongoose';
import { config } from "./config/config";
import { logger } from './utils/logger';
import Product from './models/product.model';

const PORT = config.PORT;
const connectOptions: ConnectOptions = {
    dbName: "products",
    serverApi: { version: "1", deprecationErrors: true, strict: true }
};

const run = async () => {
    logger.info(`=== connecting to : ${config.CLUSTER_URL} ===`);

    await connect(config.CLUSTER_URL ?? "", connectOptions);

    // Array of fictitious product names
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

    // Save each product in the array to the database
    for (let i = 0; i < productNames.length; i++) {
        const productData = {
            description: `A high-quality piece of furniture, perfect for enhancing your workspace. Item ${i + 1}`,
            name: productNames[i],
            price: Math.floor(Math.random() * 500) + 50,  // Random price between 50 and 550
            quantity: Math.floor(Math.random() * 10) + 1,  // Random quantity between 1 and 10
        };
        const product = new Product(productData);
        await product.save();
        logger.info(`Product "${productData.name}" saved successfully.`);
    }

    logger.info('All products have been saved to the database.');
}

run().catch(err => logger.error(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error to mongo db"));
db.once('open', () => {
    console.log('=== Connected to MongoDb Collection ===');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
