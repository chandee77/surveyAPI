
require('dotenv').config()
const express = require('express');
const mysql = require('mysql2/promise'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const port = 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: 'your server details here',
    user: 'your user here',
    password: 'your password here',
    database: 'your DB Name',
  };

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}
  
 

  const getUserByUsername = async (username) => {
    const connection = await mysql.createConnection(dbConfig);
  
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.end();
    }
  };

  const getAssignmentByUserId = async (userId) => {
    const connection = await mysql.createConnection(dbConfig);
  
    try {
      const [rows] = await connection.execute('SELECT blockNo,mrcbNo FROM assignment WHERE userId = ?', [userId]);
  
      return rows.length > 0 ? rows : null;
    } finally {
      connection.end();
    }
  };

 



  app.post('/api/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try{
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
      connection.end();
      if (rows.length === 0) {
        return res.json({ message: 'Incorrect username.' });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (passwordMatch) {
        const accesToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({accesToken:accesToken});
      } else {
        return res.json({ message: 'Incorrect password.' });
      }
    }catch (error) {
      return res.json(error);
    }
   
  });
  

app.get('/', (req, res) => {
  res.send('Hello,Welcome to Survey API.. !');
});

app.get('/api/user/:username', authenticateToken,async (req, res) => {
    const username = req.params.username;
  
    try {
      const user = await getUserByUsername(username);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/assignment',authenticateToken,  async (req, res) => {
    const userId = req.user.uId;
  
    try {
      const assignment = await getAssignmentByUserId(userId);
  
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ error: 'assignment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 

  app.post('/register',authenticateToken, isAdmin, async (req, res) => {
    try {
      const { uId, username, password } = req.body;

      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only admin users can register new users.' });
      }
  
      if(!password)
      {
        return res.json({message : 'Invalid data'})
      }
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create a MySQL connection
      const connection = await mysql.createConnection(dbConfig);
  
      const [result] = await connection.execute(
        'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
        [username, hashedPassword]
      );
  
      // Close the connection
      await connection.end();
  
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

function isAdmin(req, res, next) {
  const userRole = req.user && req.user.userRole;
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Permission denied. Only admin users are allowed.' });
  }
  next();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
