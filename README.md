# Exemple de projet Node.js avec TypeScript et Express

## Description

Ce projet est une application **Node.js** utilisant **TypeScript** et **Express** pour créer un serveur API REST. Il est structuré avec des dossiers pour les contrôleurs, les services, les modèles, et utilise Jest pour les tests unitaires.

### Structure du fichier `.env`

```env
CERT_CERT_PATH=src/config/certificates/cert.pem
CERT_KEY_PATH=src/config/certificates/key.pem
CLUSTER_URI=mongodb+srv://<user>:<password>@<cluster_name>/<database_name>?retryWrites=true&w=majority
DB_URI_TEST=mongodb+srv://<user>:<password>@<cluster_name>/<database_name_test>?retryWrites=true&w=majority
JWT_SECRET=<SECRET>
NODE_ENV=<test | develop | production>
PORT=<3000> 
SESSION_SECRET=<SECRET>
```