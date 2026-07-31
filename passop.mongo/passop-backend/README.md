# PassOP Backend

## Deploy to Render

1. Create a new Web Service on Render.
2. Connect this repository.
3. Set the following environment variables:
   - PORT: 3000
   - MONGO_URL: your MongoDB Atlas connection string
   - NODE_ENV: production
   - FRONTEND_URL: your frontend URL (for CORS)
4. Build Command: leave blank or use `npm install`
5. Start Command: `npm start`

## Deploy to Railway

1. Create a new project and connect the repository.
2. Add the same environment variables.
3. Start Command: `npm start`

## Local run

```bash
npm install
npm start
```
