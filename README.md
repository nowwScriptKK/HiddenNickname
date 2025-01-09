# HiddenNickname
Replace Nicknames - README en Français
Description

Replace Nicknames est une extension Firefox qui remplace les surnoms des utilisateurs sur les sites chatiw.com et chatiw.fr par des mots aléatoires. Elle permet également de basculer entre le surnom original et le surnom généré aléatoirement grâce à un bouton dédié.
Fonctionnalités

    Remplacement automatique des surnoms sur les pages ciblées.
    Génération de surnoms uniques et aléatoires.
    Bouton pour basculer entre le surnom original et le surnom généré.
    Interface intuitive et design minimaliste.

Installation
Étape 1 : Télécharger le code source

    Clonez ou téléchargez ce projet sous forme de fichier ZIP à partir de son dépôt GitHub ou d’une autre source.
    Extrayez le contenu du fichier ZIP dans un dossier de votre choix.

Étape 2 : Activer le mode développeur dans Firefox

    Ouvrez Firefox.
    Tapez about:debugging#/runtime/this-firefox dans la barre d’adresse et appuyez sur Entrée.
    Cliquez sur Charger un module complémentaire temporaire.

Étape 3 : Charger l’extension

    Dans la fenêtre de sélection de fichier, naviguez jusqu’au dossier où vous avez extrait le projet.
    Sélectionnez le fichier manifest.json.
    L’extension sera maintenant activée temporairement dans Firefox.

Utilisation
1. Naviguer sur les sites cibles

    Rendez-vous sur chatiw.com ou chatiw.fr.
    L'extension commencera automatiquement à remplacer les surnoms des utilisateurs visibles dans le chat.

2. Basculer entre les surnoms

    Chaque surnom modifié est accompagné d'un bouton Toggle.
    Cliquez sur ce bouton pour basculer entre le surnom généré et le surnom original.

3. Fonctionnement en arrière-plan

    L'extension surveille les nouveaux messages ou utilisateurs ajoutés et met à jour les surnoms automatiquement.

Structure des fichiers

    manifest.json : Déclare les permissions et la configuration de l'extension.
    script.js : Code principal pour remplacer les surnoms et gérer les interactions.
    Styles intégrés : Appliqués dynamiquement pour styliser le bouton Toggle.

Limitations

    L’extension fonctionne uniquement avec Firefox en mode développeur (chargement temporaire).
    Pour une utilisation permanente, l’extension doit être signée par Mozilla.

Contribution

    Forkez ce projet.
    Apportez vos modifications.
    Soumettez une pull request avec une description claire de vos changements.
