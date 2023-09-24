# Simple WS server for browser game

Main elements are:
- **pnpm** - efficient packet manager
- **nodemon** - restart your app when code changes
- **eslint** and **prettier** - for code formatting and keeping style uniform
- **husky** - pre-commit hooks with auto fixing and formating

**NOTE:** **pnpm** and **npm** can be used interchangeably.

## Development

0. Clone the repo: `git clone --recursive git@github.com:AlexRazor1337/od-server.git`  
1. Install deps: `npm i`  
~~2. Install husky: `npm run prepare`~~  
3. Fill the `.env` file:  
    ```env
    NODE_ENV=development
    ADMIN_PORT=8001
    ADMIN_PASSWORD=testtest
    PORT=3000
    CORS_ORIGIN=localhost:3000
    ```
4. Run server in development mode: `npm run dev`
5. Now you can open the game in the browser via `localhost:3000`  
  To skip login, use `localhost:3000/?dev`
