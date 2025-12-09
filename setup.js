/**
 * Script d'initialisation pour le TP3 - Modélisation avancée MongoDB
 *
 * Ce script crée toutes les collections et données de test nécessaires
 * pour réaliser les exercices du TP.
 *
 * Usage dans mongosh :
 *   load("setup.js")
 *
 * Ou depuis le terminal :
 *   mongosh "mongodb+srv://..." --file setup.js
 */

print("=".repeat(60))
print("🚀 Initialisation du TP3 - Modélisation avancée MongoDB")
print("=".repeat(60))

// ============================================================
// PHASE 1 : Données pour Embedding vs Référencement
// ============================================================
print("\n📚 Phase 1 : Création des données Embedding/Référencement...")

// Exercice 1 : Blog
db.authors.drop()
db.authors.insertMany([
    {
        _id: "author1",
        name: "Alice Martin",
        email: "alice@example.com",
        bio: "Développeuse passionnée par MongoDB",
        articles: [
            {title: "Introduction à MongoDB", date: new Date("2024-01-10"), views: 1250},
            {title: "Les index en pratique", date: new Date("2024-01-15"), views: 890}
        ]
    },
    {
        _id: "author2",
        name: "Bob Dupont",
        email: "bob@example.com",
        bio: "Architecte données NoSQL",
        articles: [
            {title: "Modélisation avancée", date: new Date("2024-01-20"), views: 2100}
        ]
    }
])
print("  ✓ Collection 'authors' créée (2 documents)")

// Exercice 2 : E-commerce
db.orders.drop()
db.orders.insertMany([
    {
        _id: "order1",
        customer: "Alice Martin",
        date: new Date(),
        status: "completed",
        items: [
            {product_id: "prod1", name: "Laptop", price: 1299, quantity: 1},
            {product_id: "prod2", name: "Souris", price: 29, quantity: 2}
        ],
        total: 1357
    },
    {
        _id: "order2",
        customer: "Bob Dupont",
        date: new Date(),
        status: "pending",
        items: [
            {product_id: "prod3", name: "Clavier", price: 89, quantity: 1}
        ],
        total: 89
    }
])
print("  ✓ Collection 'orders' créée (2 documents)")

// ============================================================
// PHASE 2 : Données pour les Design Patterns
// ============================================================
print("\n🎨 Phase 2 : Création des données Design Patterns...")

// Exercice 6-7 : Pattern Subset (posts avec commentaires)
db.posts_v1.drop()
db.posts_v2.drop()
db.comments.drop()

// Version 1 : Sans pattern (pour comparaison)
const commentsV1 = []
for (let i = 0; i < 100; i++) {
    commentsV1.push({
        user: `user_${i % 20}`,
        text: `Commentaire numéro ${i}. Lorem ipsum dolor sit amet.`,
        date: new Date(Date.now() - i * 60000)
    })
}
db.posts_v1.insertOne({
    _id: "post1",
    title: "Mon article de blog",
    content: "Contenu de l'article sur MongoDB...",
    author: "alice",
    comments: commentsV1
})
print("  ✓ Collection 'posts_v1' créée (1 document avec 100 commentaires)")

// Version 2 : Avec Pattern Subset
db.posts_v2.insertOne({
    _id: "post1",
    title: "Mon article de blog",
    content: "Contenu de l'article sur MongoDB...",
    author: "alice",
    comment_count: 100,
    recent_comments: commentsV1.slice(0, 10)  // Seulement les 10 derniers
})

// Collection séparée pour tous les commentaires
for (let i = 0; i < 100; i++) {
    db.comments.insertOne({
        post_id: "post1",
        user: `user_${i % 20}`,
        text: `Commentaire numéro ${i}`,
        date: new Date(Date.now() - i * 60000)
    })
}
print("  ✓ Collections 'posts_v2' et 'comments' créées (Pattern Subset)")

// Exercice 8 : Pattern Computed (produits avec avis)
db.products.drop()
db.products_v2.drop()

db.products.insertOne({
    _id: "prod1",
    name: "Laptop Gaming",
    price: 1299,
    reviews: [
        {user: "alice", rating: 5, text: "Excellent!"},
        {user: "bob", rating: 4, text: "Très bien"},
        {user: "carol", rating: 5, text: "Parfait"},
        {user: "dave", rating: 3, text: "Correct"},
        {user: "eve", rating: 5, text: "Super"}
    ]
})

db.products_v2.insertOne({
    _id: "prod1",
    name: "Laptop Gaming",
    price: 1299,
    stats: {
        review_count: 5,
        rating_sum: 22,
        rating_avg: 4.4,
        rating_distribution: {5: 3, 4: 1, 3: 1, 2: 0, 1: 0}
    },
    recent_reviews: [
        {user: "eve", rating: 5, text: "Super", date: new Date()}
    ]
})
print("  ✓ Collections 'products' et 'products_v2' créées (Pattern Computed)")

// Exercice 9 : Pattern Bucket (données capteurs)
db.sensor_v1.drop()
db.sensor_v2.drop()

// Version 1 : Un document par mesure
for (let i = 0; i < 288; i++) {
    db.sensor_v1.insertOne({
        sensor_id: "ENV-001",
        timestamp: new Date(Date.now() - (287 - i) * 5 * 60000),
        temperature: 20 + Math.random() * 5,
        humidity: 45 + Math.random() * 10
    })
}
print("  ✓ Collection 'sensor_v1' créée (288 documents - 24h de mesures)")

// Version 2 : Pattern Bucket (groupé par heure)
const buckets = {}
for (let i = 0; i < 288; i++) {
    const timestamp = new Date(Date.now() - (287 - i) * 5 * 60000)
    const hourKey = new Date(timestamp)
    hourKey.setMinutes(0, 0, 0)
    const key = hourKey.toISOString()

    if (!buckets[key]) {
        buckets[key] = {
            sensor_id: "ENV-001",
            bucket_start: hourKey,
            bucket_type: "hourly",
            samples: [],
            stats: {count: 0, temp_sum: 0, temp_min: 100, temp_max: -100}
        }
    }

    const temp = 20 + Math.random() * 5
    buckets[key].samples.push({
        t: timestamp.getMinutes(),
        temp: Math.round(temp * 10) / 10,
        hum: Math.round((45 + Math.random() * 10) * 10) / 10
    })
    buckets[key].stats.count++
    buckets[key].stats.temp_sum += temp
    buckets[key].stats.temp_min = Math.min(buckets[key].stats.temp_min, temp)
    buckets[key].stats.temp_max = Math.max(buckets[key].stats.temp_max, temp)
}

for (const bucket of Object.values(buckets)) {
    bucket.stats.temp_avg = Math.round(bucket.stats.temp_sum / bucket.stats.count * 10) / 10
    db.sensor_v2.insertOne(bucket)
}
print("  ✓ Collection 'sensor_v2' créée (" + Object.keys(buckets).length + " buckets horaires)")

// Exercice 11 : Pattern Attribute (catalogue capteurs)
db.sensors_catalog.drop()
db.sensors_catalog.insertMany([
    {
        _id: "SENS-TEMP-001",
        name: "Thermomètre extérieur",
        type: "temperature",
        manufacturer: "SensorCo",
        specs: [
            {key: "unit", value: "celsius", type: "string"},
            {key: "precision", value: 0.1, type: "number", unit: "°C"},
            {key: "range_min", value: -40, type: "number", unit: "°C"},
            {key: "range_max", value: 85, type: "number", unit: "°C"}
        ]
    },
    {
        _id: "SENS-AIR-001",
        name: "Analyseur d'air",
        type: "air_quality",
        manufacturer: "AirTech",
        specs: [
            {key: "particles", value: ["PM2.5", "PM10"], type: "array"},
            {key: "co2_range", value: 5000, type: "number", unit: "ppm"},
            {key: "accuracy", value: 3, type: "number", unit: "%"}
        ]
    },
    {
        _id: "SENS-NOISE-001",
        name: "Sonomètre urbain",
        type: "noise",
        manufacturer: "AcoustiSense",
        specs: [
            {key: "range_min", value: 30, type: "number", unit: "dB"},
            {key: "range_max", value: 130, type: "number", unit: "dB"},
            {key: "weighting", value: "A", type: "string"}
        ]
    }
])
db.sensors_catalog.createIndex({"specs.key": 1, "specs.value": 1})
print("  ✓ Collection 'sensors_catalog' créée (3 types de capteurs)")

// Exercice 12 : Pattern Outlier
db.sensors_alerts.drop()
db.alerts_overflow.drop()
db.sensors_alerts.insertMany([
    {
        _id: "SENS-NORMAL-001",
        name: "Capteur parc municipal",
        location: "Parc Jourdan",
        has_overflow: false,
        alert_count: 3,
        alerts: [
            {date: new Date("2024-01-10"), type: "temp_high", value: 32},
            {date: new Date("2024-01-15"), type: "temp_high", value: 31},
            {date: new Date("2024-02-01"), type: "humidity_low", value: 20}
        ]
    },
    {
        _id: "SENS-OUTLIER-001",
        name: "Capteur zone industrielle",
        location: "Zone Industrielle Les Milles",
        has_overflow: true,
        alert_count: 2547,
        alerts: [
            {date: new Date("2024-03-15T10:30:00"), type: "co2_high", value: 1100},
            {date: new Date("2024-03-15T10:25:00"), type: "pm25_high", value: 78},
            {date: new Date("2024-03-15T10:20:00"), type: "co2_high", value: 1050}
        ]
    }
])
print("  ✓ Collections 'sensors_alerts' et 'alerts_overflow' créées (Pattern Outlier)")

// ============================================================
// PHASE 3 : Données pour les Patterns Architecturaux
// ============================================================
print("\n🏗️  Phase 3 : Création des données Patterns Architecturaux...")

// Exercice 13 : Versioning
db.sensor_configs.drop()
db.sensor_configs_history.drop()
db.sensor_configs.insertOne({
    _id: "SENS-001",
    version: 1,
    name: "Capteur Rotonde",
    sampling_interval: 300,
    thresholds: {temp_max: 35, co2_max: 1000},
    updated_at: new Date(),
    updated_by: "admin"
})
print("  ✓ Collections 'sensor_configs' et 'sensor_configs_history' créées")

// Exercice 14 : Polymorphic
db.events.drop()
db.events.insertMany([
    {
        type: "measurement",
        timestamp: new Date(),
        sensor_id: "SENS-001",
        data: {temperature: 28.5, humidity: 55, co2: 450}
    },
    {
        type: "alert",
        timestamp: new Date(Date.now() - 30000),
        sensor_id: "SENS-001",
        severity: "warning",
        message: "Température élevée",
        threshold: 25,
        value: 28.5,
        acknowledged: false
    },
    {
        type: "maintenance",
        timestamp: new Date(Date.now() - 60000),
        sensor_id: "SENS-001",
        technician: "Jean Dupont",
        actions: ["battery_check", "calibration"],
        duration_minutes: 30
    },
    {
        type: "measurement",
        timestamp: new Date(Date.now() - 120000),
        sensor_id: "SENS-002",
        data: {temperature: 22, humidity: 48}
    },
    {
        type: "alert",
        timestamp: new Date(Date.now() - 90000),
        sensor_id: "SENS-002",
        severity: "critical",
        message: "Capteur offline",
        acknowledged: false
    }
])
db.events.createIndex({sensor_id: 1, timestamp: -1}, {partialFilterExpression: {type: "measurement"}})
print("  ✓ Collection 'events' créée (5 événements polymorphiques)")

// ============================================================
// PHASE 4 : Données pour le cas pratique IoT
// ============================================================
print("\n💡 Phase 4 : Création des données IoT SteamCity...")

db.current_state.drop()
db.raw_measurements.drop()
db.hourly_buckets.drop()

// Capteurs avec état actuel
const zones = ["centre-ville", "gare", "campus", "port", "colline"]
const capteurs = []

for (let i = 1; i <= 10; i++) {
    const isOffline = i === 3 || i === 7
    capteurs.push({
        _id: `SENS-00${i}`,
        location: {
            zone: zones[(i - 1) % 5],
            coordinates: [5.44 + i * 0.01, 43.52 + i * 0.01],
            address: `Capteur ${zones[(i - 1) % 5]} #${i}`
        },
        status: isOffline ? "offline" : "online",
        last_reading: {
            timestamp: new Date(Date.now() - (isOffline ? 45 * 60000 : 2 * 60000)),
            temperature: 18 + i * 1.5 + Math.random() * 3,
            humidity: 35 + i * 3 + Math.random() * 5,
            co2: 350 + i * 25 + Math.random() * 50,
            pm25: 8 + Math.random() * 15
        },
        battery_level: Math.max(20, 100 - i * 8),
        thresholds: {
            temperature: {min: 10, max: 35},
            co2: {max: 1000},
            pm25: {max: 50}
        }
    })
}

db.current_state.insertMany(capteurs)
db.current_state.createIndex({"location.zone": 1})
db.current_state.createIndex({status: 1})
print("  ✓ Collection 'current_state' créée (10 capteurs)")

// Mesures brutes (dernière heure)
const now = new Date()
now.setMinutes(0, 0, 0)

for (let i = 0; i < 12; i++) {
    for (let s = 1; s <= 5; s++) {
        db.raw_measurements.insertOne({
            sensor_id: `SENS-00${s}`,
            timestamp: new Date(now.getTime() + i * 5 * 60000),
            temperature: 20 + Math.sin(i / 3) * 3 + Math.random() * 2,
            humidity: 45 + Math.cos(i / 4) * 5 + Math.random() * 3,
            co2: 400 + i * 5 + Math.random() * 20,
            pm25: 12 + Math.random() * 8
        })
    }
}
db.raw_measurements.createIndex({sensor_id: 1, timestamp: -1})
print("  ✓ Collection 'raw_measurements' créée (60 mesures)")

// ============================================================
// PHASE 5 : Collections pour les exercices d'optimisation
// ============================================================
print("\n🔧 Phase 5 : Préparation des collections d'optimisation...")

db.perf_test.drop()
db.bulk_test_slow.drop()
db.bulk_test_fast.drop()
db.ttl_demo.drop()

print("  ✓ Collections de test nettoyées (prêtes pour les exercices)")

// ============================================================
// Création des index recommandés
// ============================================================
print("\n📇 Création des index...")

db.comments.createIndex({post_id: 1, date: -1})
db.sensor_v1.createIndex({sensor_id: 1, timestamp: -1})
db.sensor_v2.createIndex({sensor_id: 1, bucket_start: -1})
db.events.createIndex({type: 1, timestamp: -1})

print("  ✓ Index créés sur les collections principales")

// ============================================================
// Résumé
// ============================================================
print("\n" + "=".repeat(60))
print("✅ Initialisation terminée avec succès!")
print("=".repeat(60))

print("\n📊 Collections créées :")
const collections = db.getCollectionNames().sort()
collections.forEach(c => {
    const count = db.getCollection(c).countDocuments()
    print(`   - ${c}: ${count} document(s)`)
})

print("\n🎯 Vous pouvez maintenant commencer les exercices du TP3!")
print("   Consultez le README.md pour les instructions.\n")
