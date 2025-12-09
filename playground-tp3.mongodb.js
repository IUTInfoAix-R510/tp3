/* global use, db */
/* eslint-disable no-undef */

// ============================================================================
// TP3 : Modélisation avancée et patterns de conception MongoDB
// Fichier d'exercices interactif - BUT3 Informatique
// ============================================================================
//
// INFORMATIONS ÉTUDIANT (à compléter)
// ------------------------------------
// Nom      : ___________________
// Prénom   : ___________________
// Groupe   : ___________________
// Date     : ___________________
//
// ============================================================================
//
// Instructions :
// 1. Ouvrir ce fichier dans VS Code avec l'extension MongoDB for VS Code
// 2. Connectez-vous à votre cluster Atlas
// 3. IMPORTANT : Exécutez d'abord le script setup.js pour initialiser les données
//    load("setup.js")
// 4. Exécutez les blocs de code avec Ctrl+Alt+R (ou clic droit > Run)
// 5. Complétez les exercices dans les zones "// TODO"
// 6. Committez régulièrement votre travail
//
// ============================================================================

// ----------------------------------------------------------------------------
// CONFIGURATION INITIALE
// ----------------------------------------------------------------------------

// Sélectionner la base de données tp3
use("tp3");

// Vérifier que les données sont bien chargées
db.getCollectionNames();

// ############################################################################
// PHASE 1 : LES FONDAMENTAUX DE LA MODÉLISATION
// ############################################################################

// ============================================================================
// Exercice 1 : Blog - Auteur et Articles
// ============================================================================
// Objectif : Comprendre l'embedding avec la collection authors
// Difficulté : ⭐☆☆ (1/3)
//
// Questions :
// a) Examinez la structure d'un document auteur
// b) Écrivez une requête pour trouver l'auteur qui a écrit "Les index en pratique"
// c) Calculez le total des vues pour Alice Martin
// ============================================================================

// Voir la structure d'un document auteur
db.authors.findOne();

// TODO a) : Examiner la structure


// TODO b) : Trouver l'auteur de "Les index en pratique"


// TODO c) : Calculer le total des vues pour Alice Martin



// ============================================================================
// Exercice 2 : Commande et Produits
// ============================================================================
// Objectif : Comprendre quand choisir embedding vs référencement
// Difficulté : ⭐☆☆ (1/3)
//
// Questions :
// a) Examinez la structure d'une commande
// b) Listez toutes les commandes contenant un "Laptop"
// c) Calculez le montant total de toutes les commandes
// ============================================================================

// Voir la structure d'une commande
db.orders.findOne();

// TODO a) : Examiner la structure


// TODO b) : Commandes contenant un "Laptop"


// TODO c) : Montant total de toutes les commandes



// ============================================================================
// Exercice 3 : Utilisateur et Adresses
// ============================================================================
// Objectif : Modéliser une relation 1:N (un utilisateur, plusieurs adresses)
// Difficulté : ⭐⭐☆ (2/3)
//
// Réfléchissez : Quelle approche choisiriez-vous ?
// - Embedding : adresses dans le document utilisateur
// - Référencement : collection séparée d'adresses
//
// Justifiez votre choix en commentaire.
// ============================================================================

// TODO : Proposer un schéma de document utilisateur avec adresses
// Écrivez votre proposition de schéma en commentaire ou avec db.test.insertOne()



// ============================================================================
// Exercice 4 : Cours et Étudiants
// ============================================================================
// Objectif : Modéliser une relation N:N (plusieurs cours, plusieurs étudiants)
// Difficulté : ⭐⭐☆ (2/3)
//
// Contraintes à considérer :
// - Un cours peut avoir des centaines d'étudiants
// - Un étudiant suit généralement 5-10 cours
// - On veut souvent afficher le nom du cours avec la liste des étudiants
//
// Proposez un schéma adapté.
// ============================================================================

// TODO : Proposer un schéma pour la relation Cours-Étudiants



// ============================================================================
// Exercice 5 : Quiz récapitulatif
// ============================================================================
// Objectif : Consolider vos connaissances
// Difficulté : ⭐☆☆ (1/3)
//
// Répondez aux questions suivantes en commentaires :
// ============================================================================

// TODO : Répondre aux questions

// Q1 : Quelle est la taille maximale d'un document MongoDB ?
// Réponse :

// Q2 : Citez 2 avantages de l'embedding
// Réponse :

// Q3 : Citez 2 avantages du référencement
// Réponse :

// Q4 : Dans quel cas l'embedding est-il déconseillé ?
// Réponse :



// ############################################################################
// PHASE 2 : LES DESIGN PATTERNS MONGODB
// ############################################################################

// ============================================================================
// Exercice 6 : Découvrir le problème des tableaux illimités
// ============================================================================
// Objectif : Comprendre pourquoi les tableaux qui grandissent sont problématiques
// Difficulté : ⭐☆☆ (1/3)
//
// La collection posts_v1 contient un post avec 100 commentaires embarqués.
// ============================================================================

// Voir la taille du document avec tous les commentaires
const postV1 = db.posts_v1.findOne({ _id: "post1" });
Object.bsonsize(postV1);

// TODO : Répondre aux questions en commentaires

// Q1 : Quelle est la taille du document en octets ?
// Réponse :

// Q2 : Si le post devient viral avec 100 000 commentaires, quel problème survient ?
// Réponse :

// Q3 : Quel pattern pourrait résoudre ce problème ?
// Réponse :



// ============================================================================
// Exercice 7 : Appliquer le Pattern Subset
// ============================================================================
// Objectif : Implémenter le pattern Subset pour optimiser les lectures
// Difficulté : ⭐⭐☆ (2/3)
//
// La collection posts_v2 utilise le pattern Subset : seuls les 10 derniers
// commentaires sont dans le document, les autres sont dans la collection comments.
// ============================================================================

// Comparer les tailles
const postV2 = db.posts_v2.findOne({ _id: "post1" });
print("Taille posts_v1:", Object.bsonsize(postV1), "octets");
print("Taille posts_v2:", Object.bsonsize(postV2), "octets");

// TODO a) : Écrire une requête pour afficher un post avec ses 10 commentaires récents
// (utiliser posts_v2)


// TODO b) : Écrire un pipeline d'agrégation avec $lookup pour récupérer
// TOUS les commentaires d'un post depuis la collection comments


// TODO c) : Écrire une requête pour ajouter un nouveau commentaire
// (mettre à jour recent_comments avec $push et $slice, et incrémenter comment_count)



// ============================================================================
// Exercice 8 : Appliquer le Pattern Computed
// ============================================================================
// Objectif : Pré-calculer les statistiques pour éviter les agrégations coûteuses
// Difficulté : ⭐⭐☆ (2/3)
//
// Comparez products (avec tous les avis) et products_v2 (avec stats pré-calculées)
// ============================================================================

// Version sans pattern : calculer la moyenne à chaque lecture
db.products.aggregate([
    { $match: { _id: "prod1" } },
    { $unwind: "$reviews" },
    { $group: {
        _id: "$_id",
        avgRating: { $avg: "$reviews.rating" },
        count: { $sum: 1 }
    }}
]);

// Version avec pattern : lecture directe
db.products_v2.findOne({ _id: "prod1" }, { "stats.rating_avg": 1, "stats.review_count": 1 });

// TODO a) : Écrire une fonction updateProductStats qui met à jour les statistiques
// après l'ajout d'un nouvel avis (rating: 4, user: "frank", text: "Bon produit")


// TODO b) : Quelle est la complexité de lecture avec et sans le pattern ?
// Réponse en commentaire :



// ============================================================================
// Exercice 9 : Appliquer le Pattern Bucket (Séries temporelles)
// ============================================================================
// Objectif : Optimiser le stockage des données de capteurs
// Difficulté : ⭐⭐⭐ (3/3)
//
// Comparez sensor_v1 (1 doc par mesure) et sensor_v2 (buckets horaires)
// ============================================================================

// Compter les documents dans chaque version
print("sensor_v1:", db.sensor_v1.countDocuments(), "documents");
print("sensor_v2:", db.sensor_v2.countDocuments(), "documents");

// TODO a) : Calculer la température moyenne des dernières 24h avec sensor_v1


// TODO b) : Calculer la température moyenne des dernières 24h avec sensor_v2
// (utiliser les stats pré-calculées dans les buckets)


// TODO c) : Écrire une requête pour ajouter une nouvelle mesure dans un bucket
// (utiliser $push pour ajouter dans samples et mettre à jour les stats)



// ============================================================================
// Exercice 10 : Synthèse - Combiner les patterns
// ============================================================================
// Objectif : Concevoir un schéma utilisant plusieurs patterns
// Difficulté : ⭐⭐⭐ (3/3)
//
// Scénario : Concevoir le schéma pour un système de monitoring de capteurs
// qui doit :
// - Stocker des milliers de mesures par capteur par jour
// - Afficher rapidement les dernières mesures
// - Calculer des statistiques (min, max, moyenne) par heure
// - Permettre la consultation de l'historique complet
// ============================================================================

// TODO : Proposer un schéma de document combinant les patterns
// Subset (dernières mesures) + Bucket (historique) + Computed (statistiques)

// Écrivez votre proposition en commentaire ou avec un exemple de document :



// ============================================================================
// Exercice 11 : Pattern Attribute pour les métadonnées flexibles
// ============================================================================
// Objectif : Utiliser le pattern Attribute pour des spécifications variables
// Difficulté : ⭐⭐☆ (2/3)
//
// La collection sensors_catalog contient des capteurs avec des specs variables
// ============================================================================

// Voir la structure d'un capteur
db.sensors_catalog.findOne();

// TODO a) : Trouver tous les capteurs qui mesurent en "celsius"


// TODO b) : Trouver les capteurs avec une précision (precision) inférieure à 1


// TODO c) : Lister toutes les unités de mesure distinctes utilisées



// ============================================================================
// Exercice 12 : Pattern Outlier pour gérer les capteurs "viraux"
// ============================================================================
// Objectif : Gérer les documents qui dépassent la normale
// Difficulté : ⭐⭐⭐ (3/3)
//
// La collection sensors_alerts contient des capteurs avec alertes.
// Certains capteurs génèrent énormément d'alertes (outliers).
// ============================================================================

// Voir les deux types de capteurs
db.sensors_alerts.find().forEach(s => {
    print(s.name, "- alertes:", s.alert_count, "- overflow:", s.has_overflow);
});

// TODO a) : Écrire une requête pour récupérer toutes les alertes d'un capteur
// (gérer le cas où has_overflow est true)


// TODO b) : Écrire une fonction pour ajouter une alerte à un capteur
// (si > 100 alertes, déplacer dans alerts_overflow et mettre has_overflow: true)



// ############################################################################
// PHASE 3 : PATTERNS ARCHITECTURAUX
// ############################################################################

// ============================================================================
// Exercice 13 : Implémenter le Versioning
// ============================================================================
// Objectif : Garder un historique des modifications de configuration
// Difficulté : ⭐⭐☆ (2/3)
//
// La collection sensor_configs contient la configuration actuelle.
// La collection sensor_configs_history stockera l'historique.
// ============================================================================

// Voir la configuration actuelle
db.sensor_configs.findOne();

// TODO a) : Écrire une fonction updateConfigWithHistory qui :
// 1. Copie le document actuel dans sensor_configs_history
// 2. Met à jour le document avec les nouvelles valeurs
// 3. Incrémente la version


// TODO b) : Modifier le sampling_interval de SENS-001 à 600 secondes
// en utilisant votre fonction


// TODO c) : Afficher l'historique des versions pour SENS-001



// ============================================================================
// Exercice 14 : Pattern Polymorphic pour les événements
// ============================================================================
// Objectif : Stocker différents types d'événements dans une même collection
// Difficulté : ⭐⭐☆ (2/3)
//
// La collection events contient des événements de types différents :
// measurement, alert, maintenance
// ============================================================================

// Voir les différents types d'événements
db.events.find().forEach(e => print(e.type, "-", e.sensor_id));

// TODO a) : Compter le nombre d'événements par type


// TODO b) : Trouver toutes les alertes non acquittées (acknowledged: false)


// TODO c) : Écrire un pipeline qui affiche pour chaque capteur :
// - Le nombre de mesures
// - Le nombre d'alertes
// - La dernière maintenance



// ############################################################################
// PHASE 4 : CAS PRATIQUE - SYSTÈME IOT STEAMCITY
// ############################################################################

// ============================================================================
// Exercice 15 : Créer et interroger les données IoT
// ============================================================================
// Objectif : Manipuler les données de capteurs SteamCity
// Difficulté : ⭐⭐☆ (2/3)
// ============================================================================

// Voir l'état actuel des capteurs
db.current_state.find({}, { _id: 1, "location.zone": 1, status: 1 });

// TODO a) : Lister tous les capteurs de la zone "centre-ville"


// TODO b) : Trouver le capteur avec le niveau de batterie le plus bas


// TODO c) : Afficher les dernières lectures de température pour chaque capteur



// ============================================================================
// Exercice 16 : Agrégation par zone
// ============================================================================
// Objectif : Calculer des statistiques par zone géographique
// Difficulté : ⭐⭐☆ (2/3)
// ============================================================================

// TODO a) : Calculer la température moyenne par zone


// TODO b) : Compter le nombre de capteurs par zone et par statut


// TODO c) : Trouver la zone avec le plus haut niveau de CO2 moyen



// ============================================================================
// Exercice 17 : Détecter les capteurs offline
// ============================================================================
// Objectif : Identifier les capteurs qui ne répondent plus
// Difficulté : ⭐⭐☆ (2/3)
// ============================================================================

// TODO a) : Trouver les capteurs dont la dernière lecture date de plus de 30 minutes


// TODO b) : Créer une alerte pour chaque capteur offline trouvé



// ============================================================================
// Exercice 18 : Simuler des mesures et créer des buckets
// ============================================================================
// Objectif : Implémenter le pattern Bucket pour les nouvelles mesures
// Difficulté : ⭐⭐⭐ (3/3)
// ============================================================================

// TODO a) : Créer une fonction addMeasurementToBucket qui :
// - Ajoute une mesure au bucket de l'heure courante
// - Crée le bucket s'il n'existe pas
// - Met à jour les statistiques du bucket


// TODO b) : Simuler l'ajout de 10 mesures pour le capteur SENS-001



// ============================================================================
// Exercice 19 : Synthèse - Dashboard temps réel
// ============================================================================
// Objectif : Créer un pipeline d'agrégation pour alimenter un dashboard
// Difficulté : ⭐⭐⭐ (3/3)
// ============================================================================

// TODO : Créer un pipeline avec $facet qui retourne en une seule requête :
// - summary: nombre total de capteurs, nombre online, nombre offline
// - zones: statistiques par zone (température moyenne, humidité moyenne)
// - alerts: les 5 dernières alertes (capteurs avec CO2 > seuil ou PM2.5 > seuil)
// - lowBattery: capteurs avec batterie < 30%



// ############################################################################
// PHASE 5 : OPTIMISATION ET BONNES PRATIQUES
// ############################################################################

// ============================================================================
// Exercice 20 : Analyser et optimiser une requête avec explain()
// ============================================================================
// Objectif : Utiliser explain() pour comprendre l'exécution des requêtes
// Difficulté : ⭐⭐☆ (2/3)
// ============================================================================

// Créer une collection de test avec 10000 documents
db.perf_test.drop();
for (let i = 0; i < 10000; i++) {
    db.perf_test.insertOne({
        sensor_id: `SENS-${String(i % 100).padStart(3, '0')}`,
        timestamp: new Date(Date.now() - i * 60000),
        temperature: 20 + Math.random() * 10,
        zone: ["nord", "sud", "est", "ouest"][i % 4]
    });
}

// TODO a) : Exécuter cette requête avec explain("executionStats")
// et noter le nombre de documents examinés
db.perf_test.find({
    sensor_id: "SENS-042",
    timestamp: { $gte: new Date(Date.now() - 3600000) }
});


// TODO b) : Créer un index approprié pour optimiser cette requête


// TODO c) : Ré-exécuter explain() et comparer les résultats
// Répondre en commentaire : Quelle amélioration observez-vous ?



// ============================================================================
// Exercice 21 : Bulk operations vs insertions unitaires
// ============================================================================
// Objectif : Comparer les performances des opérations en masse
// Difficulté : ⭐⭐☆ (2/3)
// ============================================================================

// TODO a) : Mesurer le temps pour insérer 1000 documents un par un
db.bulk_test_slow.drop();
// Votre code ici (utiliser console.time/console.timeEnd ou Date.now())


// TODO b) : Mesurer le temps pour insérer 1000 documents avec insertMany
db.bulk_test_fast.drop();
// Votre code ici


// TODO c) : Quel est le ratio de performance ? Répondre en commentaire



// ============================================================================
// Exercice 22 : Mettre en place un index TTL
// ============================================================================
// Objectif : Configurer l'expiration automatique des documents
// Difficulté : ⭐⭐☆ (2/3)
// ============================================================================

// Créer une collection de logs temporaires
db.ttl_demo.drop();
db.ttl_demo.insertMany([
    { message: "Log récent", createdAt: new Date() },
    { message: "Log ancien", createdAt: new Date(Date.now() - 3600000) }
]);

// TODO a) : Créer un index TTL qui supprime les documents après 1 heure


// TODO b) : Vérifier que l'index a bien été créé


// TODO c) : En commentaire, expliquez dans quels cas un index TTL est utile



// ============================================================================
// FIN DU TP3
// ============================================================================
//
// Félicitations ! Vous avez terminé le TP3 sur la modélisation avancée MongoDB.
//
// Points clés à retenir :
// - Choisir entre embedding et référencement selon le cas d'usage
// - Utiliser les patterns (Subset, Computed, Bucket, Attribute, Outlier)
// - Optimiser avec les index et les opérations bulk
// - Concevoir des schémas adaptés aux patterns d'accès
//
// N'oubliez pas de committer votre travail !
// ============================================================================
