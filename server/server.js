// Allows for the use of stored sensitive information in a .env file
console.log('hello');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

require('dotenv').config();
// require('./auth');

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(200).json(null);
}

const apiPgRouter = require('./routes/api');
const apiMySQLRouter = require('./routes/apiMySQL');
const authController = require('./controllers/authController');
const app = express();
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {},
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
const PORT = 3000;

// -------------
/** I don't think we need routes for home, but we w
 * Home
 * Login
 * Display
 * Logout
 */

// Parse incoming requests with a json body
app.use(express.json());
// Parse incoming requests with url encoded payloads
app.use(express.urlencoded({ extended: true }));

// app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// app.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     successRedirect: 'http://localhost:8080/display/access',
//     failureRedirect: '/',
//   })
// );

// app.get('/auth/failure', (req, res) => {
//   res.send('something went wrong');
// });

app.get('/oauth', authController.initiateAuth, (req, res) => {
  res.sendStatus(200);
});

app.get('/google/callback', authController.getToken, (req, res) => {
  res.sendStatus(200);
});

// app.get('/protected', (req, res) => {
//   if (req.user) res.status(200).json(req.user);
//   else res.status(200).json(null);
// });

// app.get('/logout', (req, res) => {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(400).send('Unable to log out', err);
//       } else {
//         res.status(200).json({ logout: true });
//       }
//     });
//   } else {
//     res.send('session not found');
//   }
// });

// Implementation is flexibile, can change if needed
// Note: currently working on the mySQL routes
// app.use('/apimysql', apiMySQLRouter);
// app.use('/api', apiPgRouter);

// statically serve everything in the build folder on the route '/build'
if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.join(__dirname, '../dist')));
  // serve index.html on the route '/'

  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });

  app.get('/login', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });

  app.get('/signup', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });

  app.get('/display/access', isLoggedIn, (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });

  app.get('/display/access/:id', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

// Catch-all error handler
app.use('*', (req, res) => {
  res.sendStatus(404);
});

// Global error handler, any middleware function passing next(err) will follow this structure
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: 'An error occurred. This is the global error handler.',
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
