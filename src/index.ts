import app from './app';  // Importer l'application configurée
import 'dotenv/config';
import { config } from "./config/config";



// Démarrer le serveur
app.listen(config.PORT, () => {
    console.log(`Server is running on https://localhost:${config.PORT}`);
});