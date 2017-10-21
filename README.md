# Application WEB de l'ASLB

## Présentation

Ce projet a pour but de rendre accéssible les informations liées à l'Association Sportive de La Boursidière.

Ces informations peuvent etre la liste des partenaires, des présentations générales, ou le planning ou les membres peuvent s'inscrire.

L'application WEB est en cours de développement

## Comment l'installer sur son poste ?

### Prérequis

Pour développer sur ce projet, vous aurez besoin des softs suivants :

- Git bash
- NodeJs 6.11.x
- MongoDB installé en tant que service
- Visual Studio Code (Recommandé en tant qu'éditeur de texte de développemet, mais vous pouvez utiliser votre IDE préféré)

Si vous n'avez pas de moyen de lancer un serveur web pour tester l'appli, il vous faudra en plus

- Ruby

### Comment lancer l'application

L'application contient deux parties : une partie back-end (protecteApi) et une partie front-end (ui)

Premierement, il vous faudra installer toutes les dépendances des deux parties, en lancant cette commande dans les deux dossiers :

```shell
npm i
```

Lorsque les dépendances sont installées, vous serez alors en mesure de lancer l'application. 

Pour lancer le serveur NodeJS, il suffira de se placer dans le dossier du back-end et de lancer la commande : 

```shell
npm start
```
Cette commande permet de construire le serveur back-end en compilant les dernieres modifications.

Les changements de code sont pris a chaud si cette commande est lancée

Le serveur écoute par défaut sur le port 3000.

Pour lancer la construction de l'application JS, vous pouvez lancer la commande :

```shell
npm run watch
```

Cette commande permet de reconstruire le JS a chaud apres chaque changement. Le JS est généré dans le dossier 'dist'

Si vous n'avez pas de serveur pour lancer l'application en local, vous pouvez lancer le script bash "run_server.sh", qui vous permettra d'accéder a l'application à l'adresse suivante :

`localhost:8080/`

