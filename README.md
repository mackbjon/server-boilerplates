<div align="center">
  <h1>Simple Express Apps</h1>
  <p><h3 align="center">Ready-to-deploy Express jumping-off point for a variety of use cases</h3></p>
</div>

<hr>

<div align="center">
  <h2>Quick Start</h2>
</div>

#### 1. Clone base project folder

```
git clone https://github.com/mackbjon/server-boilerplates.git --depth=1
```

#### 2. Navigate to app you desire & install dependencies

<sub> Example below goes to simple express app: </sub>

```
cd express/
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
