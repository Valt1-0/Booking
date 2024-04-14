# Utiliser une image Node.js
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers nécessaires dans le conteneur
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel le serveur Node.js écoute
EXPOSE 4000

# Commande à exécuter lorsque le conteneur démarre
CMD ["npm", "start"]
