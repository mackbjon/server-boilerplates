<div align="center">
  <h1>Simple Express Apps</h1>
  <p><h3 align="center">Ready-to-deploy Express jumping-off point for a variety of use cases</h3></p>
</div>

<hr>

<div align="center">
  <h2>Quick Start</h2>
</div>

#### 1. Initialize project by cloning repo and deleting existing git repo

<sub> Do not forget to add the period '.' at the end of the 'git clone' command </sub>

```
mkdir my-simple-app
cd my-simple-app
git clone --depth=1 https://github.com/mackbjon/server-boilerplates.git .
rm -rf .git
```

#### 2. Navigate to simple express app, install dependencies and add git repo

```
cd express/
git init
npm install
```

#### 3. Create .env file and add environment variables

```
touch .env
```

<sub> Add at minimum the following code to your .env file (PORT does not have to be 4000): </sub>

```
NODE_ENV="development"
PORT=4000
```

#### 4. Start development server

```
npm run dev
```

<sub> You can navigate to http://localhost:4000 to see the response from your server: </sub>

<div align="center">
  <h2>Deploy App to the Cloud</h2>
</div>

#### 1. Install Heroku CLI if you have not already

[Download instructions for Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### 2. Log-in to Heroku Client

<sub> Pressing any key after the 'heroku login' command will take you to Heroku's website where you can log-in or sign-up if you do not already have an account </sub>

```
heroku login
```

<sub> Once logged-in return to command line </sub>

#### 3. Make initial git commit and create Heroku app

<sub> You will need to be in the folder where you initialized git repo e.g. my-simple-app/express/ </sub>

```
git add .
git commit -m "Initial commit"
heroku create
```

#### 4. Push your code to Heroku

```
git push heroku master
```

<sub> Your app is now live and accessible via the web! </sub>

#### 5. Run app by navigating to URL in web browser

```
npm run app:info
```

<sub> Your app's address will be listed after 'Web URL'. Ctrl-Click to visit if in VSCode or copy/paste to web browser </sub>
