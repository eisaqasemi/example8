# Login Endpoints Documentation

This document describes the login and registration endpoints added to the user management API.

## Endpoints

### 1. POST /api/login

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 2. POST /api/register

Registers a new user and returns a JWT token.

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "newpassword123",
  "age": 25
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 6,
    "name": "New User",
    "email": "newuser@example.com",
    "age": 25
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Name, email, password, and age are required"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## Pre-existing Users

The following users are available for testing (all have password: `password`):

- john@example.com
- jane@example.com
- bob@example.com
- alice@example.com
- charlie@example.com

## Testing

Run the test file to see the endpoints in action:

```bash
node test-login.js
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Authentication tokens expire after 24 hours
3. **Input Validation**: All required fields are validated
4. **Secure Error Messages**: Generic error messages prevent user enumeration

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token signing (defaults to 'your-secret-key-change-in-production')
- `PORT`: Server port (defaults to 3000)

## Usage Examples

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password"}'

# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "testpass123", "age": 25}'
```

### Using JavaScript/Node.js

```javascript
const axios = require('axios');

// Login
const loginResponse = await axios.post('http://localhost:3000/api/login', {
  email: 'john@example.com',
  password: 'password'
});

console.log('Token:', loginResponse.data.token);

// Register
const registerResponse = await axios.post('http://localhost:3000/api/register', {
  name: 'New User',
  email: 'newuser@example.com',
  password: 'newpassword123',
  age: 25
});

console.log('New user token:', registerResponse.data.token);
``` 