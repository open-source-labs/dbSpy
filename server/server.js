const express = require("express");

const path = require("path");
const app = express();

const dataRouter = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log("server running ");
app.use('/api', dataRouter);






// End of code 











// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });

app.listen(3000); //listens on port 3000 -> http://localhost:3000/

module.exports = app;