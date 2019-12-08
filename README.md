# payment-processing-service

NodeJS based service with connector to mongoDB. Ready to be deployed to AWS and use Cloud DB.

## Folder Structure
* __tests__ - contains tests that can be started from root folder by `npm test`
* handlers - usual express handlers.
* other - (optional) one more nodejs app for development purposes.
* services - modules for separating extra logic. Good place to introduce new functionality.
* server.js - listener (server)
* app.js - application
* routes.js - express routes
* config.js - single point of configuration.
* package.json - dependencies.
* package-lock.json - dependencies used by last execution.

## Quick Start
1. Check out and configure `.env` file.

```text
NODE_ENV=development
DB_HOST=xxx.xxx.xxx.xxx
DB_PORT=27017
DB_SCHEMA=payments
CUSTOME_SERVICE_URI=<Service that needs to be notified, example: http://xxx.xxx.xxx.xxx:PORT/notify>
IP_RESOLVER_KEY=<key coming there>
IP_RESOLVER_URI=<Service that can resolve IP country, example: http://api.xxxxx.com/
API_PORT=3000
SERVICE_NAME=
```

2. Initialize application: `npm install`
3. Start application: `npm start` 


## Usage
- Follow quick start steps to initialize project locally.
- Create `.env` file with content:
```text
NODE_ENV=development
DB_HOST=localhost
DB_PORT=27017
DB_SCHEMA=payments
CUSTOME_SERVICE_URI=http://localhost:3004/notify
IP_RESOLVER_KEY=
IP_RESOLVER_URI=
API_PORT=3000
SERVICE_NAME=
```
- Additionally, from `other` folder, another service can be started server for simulate real services, `npm start`.
- For production new `.env` should be created with `NODE_ENV=production`.

## Database
Steps to prepare database.
- Pull the container: `docker pull mongo`
- Run the container: `docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:latest`
- Execute shell on running container: `docker exec -it mongodb bash`
- Connect to client: `mongo`
- Create database: `use payments`
- (optional) `db.createCollection("payments")`
- (optional) `db.createCollection("notifications")`

## Testing
Present integration tests as it's covering almost all business logic.
While application configured, up and running, then from root folder run `npm test`. It will start `Jest` testing framework. Tests will check ability to store data to database, retrieve required entities and modify them. For performance tests run command: `npm run-script test-perf`. Notification and IP-resolving logic excluded from tests.

## Logging
Default logging level is INFO. For easiest integration with logging analyzers, format JSON. Logger sending logs to 3 places: console and 2 files. One file for all logs another one only for errors.
Use `LOG_LEVEL` in .env for set proper logging level.
```text
    emerg 
    alert 
    crit 
    error 
    warning 
    notice 
    info 
    debug
```