const mongoose = require('mongoose');


function connectDb(dbUrl) {

  mongoose.connect(dbUrl, { useUnifiedTopology: true})
    .then(result => {
      console.log('MongoDB connected..........', );
    })
    .catch(reason => {
      console.log('DB Eroor: ', reason);
      process.exit(1);
    })
}


module.exports = {
  connectDb
}