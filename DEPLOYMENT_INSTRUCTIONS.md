# Deployment Instructions

## Deploying to Render

This application can be deployed to Render using the following steps:

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following build settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Node Version: 18.x or higher

### Frontend Deployment

1. Create a new Web Service on Render for the frontend
2. Connect your GitHub repository
3. Set the following build settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npx serve -s dist`
   - Node Version: 18.x or higher

### Environment Variables

For the frontend, create the following environment variables:
- `VITE_API_BASE_URL`: The URL of your backend API (e.g., `https://your-backend-url.onrender.com/api`)

## Local Development

To run locally:

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Database Considerations

This application uses lowdb for data persistence. For production deployments, consider migrating to a proper database solution like PostgreSQL or MongoDB for better scalability and reliability.