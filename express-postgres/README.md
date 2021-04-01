<div align="center">
  <h1>Simple Express+Postgres App</h1>
  <p><h3 align="center">Ready-to-deploy Express+Postgres App jumping-off point for a variety of use cases</h3></p>
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

#### 2. Navigate to simple express-postgres app, add new git repo and install dependencies

```
cd express-postgres/
git init
npm install
```

#### 3. Create .env file and add environment variables

```
touch .env
```

<sub> Add the following code to your .env file (PORT does not have to be 4000): </sub>

```
NODE_ENV="development"
PORT=4000
```

<div align="center">
  <h2>Create Cloud App and Database</h2>
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

<sub> You will need to be in the folder where you created a new git repo e.g., _my-simple-app/express/_ </sub>

```
heroku create
```

#### 4. Create Postgres database

```
heroku addons:create heroku-postgresql:hobby-dev
```

#### 5. Get your newly created database URL

<sub> The following command will expose the DATABASE_URL string - this begins with postgres:// </sub>

```
heroku config
```

#### 6. Copy database URL to your .env file

<sub> Add the following code to your .env file (everything follow 'postgres://' to be replaced with your DATABASE_URL string): </sub>

```
DATABASE_URL="postgres://YOUR-DB-STRING-HERE"
```

<sub> Your app's address will be listed after 'Web URL'. Ctrl-Click to visit if in VSCode or copy/paste to web browser </sub>

#### 7. Run an initial migration and seed database

<sub> Modify src/data/migrations and src/data/seeds to suit your database needs </sub>

```
npm run db --type=migrate
npm run db --type=seed
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
#### 2. Open cloud app in web browser

```
heroku open
```
<sub> Your app's address can also be found with the 'npm run app:info' command and will be listed after 'Web URL' </sub>