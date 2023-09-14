# Costco-API
## Backend API

The backend of this project is built using Node.js, Express, and Mongoose. It provides endpoints to manage products, users, and categories.

### Prerequisites

Before running the backend, make sure you have the following installed:

- Node.js
- MongoDB
- Express 
- Nodemon (for auto-reloading)

### Getting Started

1. Navigate to the `backend` directory.
2. Install dependencies with `npm install`.
3. Start the server with `nodemon index`.

### Available Endpoints

- `GET /api/products`: Get a list of all products.
- `GET /api/products/:id`: Get details of a specific product.
- `POST /api/products`: Create a new product.
- `PUT /api/products/:id`: Update an existing product.
- `DELETE /api/products/:id`: Delete a product.

- `GET /api/users`: Get a list of all users.
- `GET /api/users/:id`: Get details of a specific user.
- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update an existing user.
- `DELETE /api/users/:id`: Delete a user.

- `GET /api/categories`: Get a list of all categories.
- `GET /api/categories/:id`: Get details of a specific category.
- `POST /api/categories`: Create a new category.
- `PUT /api/categories/:id`: Update an existing category.
- `DELETE /api/categories/:id`: Delete a category.

### Database Configuration

Ensure you have MongoDB running on your machine. You can configure the database connection in `backend/config/db.js`.

### Authentication

User authentication is handled using JSON Web Tokens (JWT). Make sure to include the token in the request headers for protected routes.

For more detailed API documentation, refer to the [API Documentation](API_DOCUMENTATION.md) file.


