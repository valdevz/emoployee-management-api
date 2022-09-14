const express = require('express'),
      app  = express(),
      router = express.Router(),
      dbConfig = require('./Config/dbConfig'),
      Routes = require('./Routes/index'),
      bodyParser = require('body-parser'),
      cors = require( 'cors' ),
      PORT = process.env.PORT || 4100;
      require("dotenv").config(),
      path = require('path');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.listen(PORT, () => {
  console.log(`API is running on port : ${PORT}`)
})

app.use('/v1/api/', Routes)

app.use((req, res, next) => {
  res.status(404).send('Error: Not found.')
})

app.get('*',(req, res) => {
  res.status(404).send('Error: Not found.')
});

dbConfig.connectDb(process.env.DATABASE_HOST);