# User Management API

A simple Node.js REST API for managing users with endpoints to list and delete users.

## Features

- **List Users**: GET endpoint to retrieve all users with optional filtering
- **Delete Users**: DELETE endpoint to remove users by ID
- **Get User**: GET endpoint to retrieve a specific user by ID
- **Create User**: POST endpoint to add new users (bonus feature)
- **Filtering**: Query parameters for filtering users by name, email, and age
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Basic security middleware with Helmet and CORS

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   # Production
   npm start
   
   # Development (with auto-restart)
   npm run dev
   ```

The server will start on port 3000 (or the port specified in the `PORT` environment variable).

## API Endpoints

### 1. List Users
**GET** `/api/users`

Returns all users with optional filtering.

**Query Parameters:**
- `name` - Filter by name (case-insensitive partial match)
- `email` - Filter by email (case-insensitive partial match)
- `minAge` - Filter by minimum age
- `maxAge` - Filter by maximum age

**Example Requests:**
```bash
# Get all users
curl http://localhost:3000/api/users

# Filter by name
curl http://localhost:3000/api/users?name=john

# Filter by age range
curl http://localhost:3000/api/users?minAge=25&maxAge=35
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30
    }
  ]
}
```

### 2. Delete User
**DELETE** `/api/users/:id`

Deletes a user by their ID.

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedUser": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

### 3. Get User (Bonus)
**GET** `/api/users/:id`

Returns a specific user by ID.

**Example Request:**
```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

### 4. Create User (Bonus)
**POST** `/api/users`

Creates a new user.

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "age": 25
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "email": "newuser@example.com", "age": 25}'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 6,
    "name": "New User",
    "email": "newuser@example.com",
    "age": 25
  }
}
```

### 5. Health Check
**GET** `/health`

Returns server status.

**Example Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found (user not found)
- `500` - Internal Server Error

## Sample Data

The API comes with 5 sample users pre-loaded:
- John Doe (john@example.com, age 30)
- Jane Smith (jane@example.com, age 25)
- Bob Johnson (bob@example.com, age 35)
- Alice Brown (alice@example.com, age 28)
- Charlie Wilson (charlie@example.com, age 32)

## Testing with curl

Here are some example curl commands to test the API:

```bash
# Health check
curl http://localhost:3000/health

# List all users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/1

# Filter users by name
curl http://localhost:3000/api/users?name=john

# Create new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "age": 30}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## Notes

- This implementation uses in-memory storage for simplicity
- In a production environment, you'd want to use a proper database
- The API includes basic validation and error handling
- CORS is enabled for cross-origin requests
- Helmet is used for basic security headers 