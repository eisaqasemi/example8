const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory user storage (in a real app, you'd use a database)
let users = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    age: 30,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    age: 25,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    age: 35,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
  },
  { 
    id: 4, 
    name: 'Alice Brown', 
    email: 'alice@example.com', 
    age: 28,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
  },
  { 
    id: 5, 
    name: 'Charlie Wilson', 
    email: 'charlie@example.com', 
    age: 32,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
  }
];

// Helper function to generate new user ID
const generateId = () => {
  return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
};

// GET /api/users - List all users
app.get('/api/users', (req, res) => {
  try {
    // Optional query parameters for filtering
    const { name, email, minAge, maxAge } = req.query;
    let filteredUsers = [...users];

    // Filter by name (case-insensitive)
    if (name) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Filter by email (case-insensitive)
    if (email) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    // Filter by age range
    if (minAge) {
      filteredUsers = filteredUsers.filter(user => user.age >= parseInt(minAge));
    }
    if (maxAge) {
      filteredUsers = filteredUsers.filter(user => user.age <= parseInt(maxAge));
    }

    res.json({
      success: true,
      count: filteredUsers.length,
      users: filteredUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get a specific user
app.get('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete a user
app.delete('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// POST /api/users - Create a new user (bonus endpoint)
app.post('/api/users', (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Basic validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and age are required'
      });
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const newUser = {
      id: generateId(),
      name,
      email,
      age: parseInt(age)
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// POST /api/login - Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// POST /api/register - Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // Basic validation
    if (!name || !email || !password || !age) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and age are required'
      });
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: generateId(),
      name,
      email,
      age: parseInt(age),
      password: hashedPassword
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        name: newUser.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`List users: http://localhost:${PORT}/api/users`);
  console.log(`Login: POST http://localhost:${PORT}/api/login`);
  console.log(`Register: POST http://localhost:${PORT}/api/register`);
  console.log(`Delete user: DELETE http://localhost:${PORT}/api/users/:id`);
});

module.exports = app; 