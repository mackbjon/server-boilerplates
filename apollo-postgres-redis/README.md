<div align="center">
  <h1>Apollo+Postgres+Redis App</h1>
  <p><h3 align="center">Ready-to-deploy jumping-off point for a variety of use cases</h3></p>
</div>

<hr>

<div align="center">
  <h2>Quick Start</h2>
</div>

#### 1. Initialize project by cloning and then deleting existing git repo

<sub> Do not forget to add the period '.' at the end of the 'git clone' command </sub>

```
mkdir my-simple-app
cd my-simple-app
git clone --depth=1 https://github.com/mackbjon/server-templates.git my-simple-app
rm -rf .git
```

#### 2. Navigate to simple apollo-postgres-redis app, add new git repo and install dependencies

```
cd apollo-postgres-redis/
git init
npm install
```

#### 3. Create .env, Procfile.dev, and add environment variables and development commands

```
touch .env
touch Procfile.dev
```

<sub> Add the following code to your .env file (PORT does not have to be 4000): </sub>

```
NODE_ENV="development"
PORT=4000
```

<sub> Add the following code to your Procfile.dev file: </sub>

```
web: npm run start:dev
worker: npm run worker:dev
```

<div align="center">
  <h2>Create Cloud App, Databases and Initialize Data</h2>
</div>

#### 1. Install Heroku CLI if you have not already

[Download instructions for Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### 2. Log-in to Heroku Client

<sub> Pressing any key after entering the 'heroku login' command will take you to Heroku's website where you can log-in or sign-up if you do not already have an account </sub>

```
heroku login
```

<sub> Once logged-in return to command line </sub>

#### 3. Create Heroku app

```
heroku create
```

#### 4. Create Postgres database

```
heroku addons:create heroku-postgresql:hobby-dev
```

#### 5. Add UUID Postgres extension

<sub> While not mandatory, UUIDs are are a ubiquitous and essential feature of any database </sub>

<sub> First, open a psql terminal with the following command: </sub>

```
heroku pg:psql
```

<sub> Next, install the UUID extension and close out of psql terminal with the following commands: </sub>

```
CREATE EXTENSION "uuid-ossp";
quit
```

#### 6. Create Redis database

```
heroku addons:create heroku-redis:hobby-dev
```

<sub> This may take a while </sub>

#### 7. Get your newly created database URLs

<sub> The following command will expose the DATABASE_URL string - this begins with postgres:// - and your REDIS_URL string which begins with redis:// </sub>

```
heroku config
```

#### 8. Copy database URLs to your .env file

<sub> Add the following code to your .env file (everything following 'postgres://' to be replaced with your DATABASE_URL string - and everything following 'redis://' to be replaced with your REDIS_URL string): </sub>

```
TEST_DATABASE_URL="postgres://YOUR-DB-STRING-HERE"
TEST_REDIS_URL="redis://YOUR-OTHER-DB-STRING-HERE"
```

#### 9. Run migration, seed database and initialize Prisma client

<sub> Modify src/data/migrations and src/data/seeds to suit your database needs </sub>

```
npm run data:initDev
```

<div align="center">
  <h2>Run App and Deploy to Cloud</h2>
</div>

#### 1. Make initial git commit and make sure development server runs correctly

```
git add .
git commit -m "Initial commit"
npm run dev
```

#### 2. Push code to Heroku

```
git push heroku master
```

#### 3. Ensure app has a worker process running

```
heroku ps:scale worker=1
```

#### 4. Open your app in web browser

```
heroku open
```

<sub> Your app's address can also be found with the 'npm run app:info' command and will be listed after 'Web URL' </sub>
