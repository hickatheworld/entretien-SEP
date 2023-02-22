# API Hôtel du Lac Blanc

## Authentification
Cet API utilise l'authentification par [JWT](https://fr.wikipedia.org/wiki/JSON_Web_Token). 

### Obtenir un token
Pour obtenir un token, il faut envoyer une requête POST à `/auth/login` avec corps JSON suivant :
| Nom | Description |
| --- | --- |
| `username` | Nom d'utilisateur |
| `password` | Mot de passe |

Si les identifiants sont corrects, le serveur renvoie la réponse suivante :
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY3NzA3MjkwNCwiaWF0IjoxNjc3MDcyOTA0fQ.OQbU2cGagqpVy_Hg4JlBQmkqhrxZ7KWjjBlppFcuxuA",
    "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY3NzA3MjkwNCwiaWF0IjoxNjc3MDcyOTA0fQ.TJpWWsGJxjR6maIis0iywr-ZIHX9soePFQuXCb0M35I"
}
```
Pour autoriser les requêtes à l'API, il faut ajouter le token dans le header `Authorization` de la requête, sous la forme `Bearer <token>`.

Il est recommandé de stocker l'`access_token` dans `localStorage` et le `refresh_token` dans un cookie `httpOnly`. Ce cookie sera utilisé pour rafraîchir le token d'accès.

Le token d'accès expire au bout d'une heure et le token de rafraîchissement au bout de 7 jours.

### Rafraîchir un token
Pour obtenir un nouveau token d'accès après l'expiration du précédent, envoyez une requête POST à `/auth/refresh`. Le cookie `refresh_token` doit être présent dans la requête.

Si le token est valide, le serveur renvoie la réponse suivante :
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhdWxsZWZsb24iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzcwNzMzMDIsImV4cCI6MTY3NzA3NjkwMn0.tRX1Qt67Fn9nuyeOCLkEkQF-O62PNlZY_lDzL6keB5Q"
}
```
Après l'expiration du token de rafraîchissement, il faut se reconnecter.

## Endpoints

### Chambres

#### GET /rooms/all
Renvoie la liste des chambres de l'hôtel

**Exemple de réponse**
```json
{
    "result": [
        {
            "id": 1,
            "capacity": 2,
            "price": 20
        },
        {
            "id": 2,
            "capacity": 1,
            "price": 15
        },
        {
            "id": 25,
            "capacity": 2,
            "price": 150
        },
        {
            "id": 55,
            "capacity": 5,
            "price": 90
        },
        {
            "id": 125,
            "capacity": 1,
            "price": 550
        }
    ]
}
```
#### GET /rooms/booked
Renvoie la liste des chambres réservées

**Exemple de réponse**
```json
{
    "result": [
        {
            "id": 25,
            "capacity": 2,
            "price": 150
        },
        {
            "id": 55,
            "capacity": 5,
            "price": 90
        }
    ]
}
```

#### GET /rooms/available
Renvoie la liste des chambres disponibles

**Exemple de réponse**
```json
{
	"result": [
		{
			"id": 1,
			"capacity": 2,
			"price": 20
		},
		{
			"id": 2,
			"capacity": 1,
			"price": 15
		},
		{
			"id": 125,
			"capacity": 1,
			"price": 550
		}
	]
}
```

#### GET /rooms/:id
Renvoie les détails d'une chambre.

**Paramètres**
| Nom | Description |
| --- | --- |
| `id` | Identifiant de la chambre |

**Exemple de réponse**
```json
{
	"result": {
		"id": 1,
		"capacity": 2,
		"price": 20
	}
}
```

### Réservations

#### GET /reservations/:id
Renvoie les détails d'une réservation.

**Paramètres**
| Nom | Description |
| --- | --- |
| `id` | Identifiant de la réservation |

**Exemple de réponse**
```json
{
    "result": {
        "id": "453f9096",
        "room": 25,
        "name": "Jean-François L'Éxemple",
        "phone": "+33612345678",
        "email": "jflexemple@efrei.net",
        "start": "2004-02-11T11:00:00.000Z",
        "end": "2004-02-18T11:00:00.000Z"
    }
}
```

#### GET /reservations/of/:room
Renvoie les réservations d'une chambre.
**Paramètres**
| Nom | Description |
| --- | --- |
| `room` | Identifiant de la chambre |

**Paramètres de requête**
| Nom | Description |
| --- | --- |
| `includePast` | Si la Exemple de réponse doit inclure les réservations passées (`false` par défaut) |

**Exemple de réponses**

*Avec `includePast = false`*
```json
{
	"result": [
		{
			"id": "PbnGywNH",
			"room": 25,
			"name": "Jean-François L'Éxemple",
			"phone": "+33612345678",
			"email": "jflexemple@efrei.net",
			"start": "2023-02-11T11:00:00.000Z",
			"end": "2023-02-18T11:00:00.000Z"
		},
		{
			"id": "v8rPR9Yv",
			"room": 25,
			"name": "Jean-François L'Éxemple",
			"phone": "+33612345678",
			"email": "jflexemple@efrei.net",
			"start": "2023-04-21T11:00:00.000Z",
			"end": "2023-04-27T11:00:00.000Z"
		}
	]
}
```
*Avec `includePast = true`*
```json
{
	"result": [
		{
			"id": "453f9096",
			"room": 25,
			"name": "Jean-François L'Éxemple",
			"phone": "+33612345678",
			"email": "jflexemple@efrei.net",
			"start": "2004-02-11T11:00:00.000Z",
			"end": "2004-02-18T11:00:00.000Z"
    	},
		{
			"id": "PbnGywNH",
			"room": 25,
			"name": "Jean-François L'Éxemple",
			"phone": "+33612345678",
			"email": "jflexemple@efrei.net",
			"start": "2023-02-11T11:00:00.000Z",
			"end": "2023-02-18T11:00:00.000Z"
		},
		{
			"id": "v8rPR9Yv",
			"room": 25,
			"name": "Jean-François L'Éxemple",
			"phone": "+33612345678",
			"email": "jflexemple@efrei.net",
			"start": "2023-04-21T11:00:00.000Z",
			"end": "2023-04-27T11:00:00.000Z"
		}
	]
}
```

#### POST /reservations/create
Crée une réservation et renvoie son identifiant.

**Corps de la requête**
| Nom | Description |
| --- | --- |
| `room` | Identifiant de la chambre |
| `name` | Nom du client |
| `phone` | Numéro de téléphone du client |
| `email` | Adresse email du client |
| `start` | Date de début de la réservation |
| `end` | Date de fin de la réservation |

**Exemple**
```json
{
    "data": {
        "room": 25,
        "name": "Jean-François L'Éxemple",
        "email": "jflexemple@efrei.net",
        "phone": "+33612345678",
        "start": "2004-02-11T12:00:00",
        "end": "2004-02-18T12:00:00"
    }
}
```
**Exemple de réponse**
```json
{
    "result": "453f9096"
}
```

#### PATCH /reservations/edit/:id
Modifie une réservation.

**Paramètres**
| Nom | Description |
| --- | --- |
| `id` | Identifiant de la réservation |

**Corps de la requête**

*Mêmes propriétés que pour la création d'une réservation, mais toutes sont optionnelles.*

#### DELETE /reservations/delete/:id
Supprime une réservation.

**Paramètres**
| Nom | Description |
| --- | --- |
| `id` | Identifiant de la réservation |