<div align="center">
  <h1>Simple Express Apps</h1>
  <p><h3 align="center">Ready-to-deploy Express jumping-off point for a variety of use cases</h3></p>
</div>

<hr>

## Quick Start

#### 1. Clone base project folder

```
git clone https://github.com/mackbjon/server-boilerplates.git --depth=1
```

#### 2. Navigate to app you desire & install dependencies

Example below goes to simple express app

```
cd express/
npm install
```

#### 3. Create .env file and add environment variables

```
touch .env
```

Add at minimum the following code to your .env file (PORT does not have to be 4000)

```
NODE_ENV="development"
PORT=4000
```

#### 4. Start development server

```
npm run dev
```

You can navigate to http://localhost:4000 to see the response from your server
