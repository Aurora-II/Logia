# Logia
Défi Soixante Circuits : Programme permettant d'afficher la météo de villes différentes toutes les 30 secondes. Utilise l'API Open Weather Map.

Comment utiliser Logia ?

En résumé :
  - Télécharger le programme
  - Ouvrir un terminal et aller dans le dossier "Logia", puis taper la commande "**npm install express socket.io nodemon**"
  - Placer votre clé API à la ligne 45 du fichier app.js
  - Démarrer le server avec "**nodemon server**"
  - Aller sur "http://localhost:3000"

En détails :
  - Récupérez tous les fichiers sur le Git.
  - Ouvrir un terminal, puis aller dans le dossier Logia contenant les dossiers : html et public
  - Maintenant, il va falloir installer les modules permettant au programme de fonctionner. Ici on va avoir besoin de Express, Socket.io et Nodemon, vous pouvez les installer avec cette commande : "**npm install express socket.io nodemon**"
  - A présent, pour pouvoir utiliser l'API, il va falloir s'inscrire sur ce site : https://rapidapi.com/community/api/open-weather-map/
  - Une fois cela fait, il faut s'inscrire sur l'API "Open Weather Map", c'est ce qui permet de récupérer les informations sur la météo.
  - Vous pouvez récupérer la clé API dans la fenêtre de droite après avoir lancé un Endpoint. Elle se trouve dans le code snippets, à la ligne "x-rapidapi-key"
  - Il ne reste plus qu'à placer la clé API dans le programme, à la ligne 45.
  - Retournez dans le terminal de commande et rentrez "**nodemon server**".
  - Aller sur http://localhost:3000 et vous pourrez voir le programme se lancer automatiquement.

Problème connu : 
  Si l'on rafraichi la page, les sockets existantes restent connectées et de nouvelles se créent par-dessus. Cela provoque donc des erreurs de MaxListenerExceedWarning et le chronomètre avance de n secondes au lieu de 1 (le n étant le nombre de fois où on l'a rafraichi la page). 
  J'ai essayé de fermer les sockets lors de la déconnnexion et après leur utilisation mais cela ne fonctionne pas. J'ai aussi essayé de reprendre la solution à ce problème : https://stackoverflow.com/questions/41924713/node-js-socket-io-page-refresh-multiple-connections mais cela ne fonctionnait toujours pas alors j'ai décidé de contourner le problème en écrivant "io.once". La socket ne se lance qu'une seule fois dès que le serveur est lancé. Le problème existe toujours puisque cela empêche le chronomètre de se relancer après un rafraichissement mais au moins il n'y a pas d'aberrations visuelles telles qu'un chronomètre avançant de plusieurs secondes.
