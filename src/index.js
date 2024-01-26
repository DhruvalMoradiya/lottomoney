const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer')
const cors = require('cors');
const session = require('express-session');

app.get('/', (req, res) => {
  res.send('Hello, this is the root endpoint!');
});

app.use(cors());
const Url = process.env.url;
const PORT = process.env.PORT;
const allowedOrigins = ['http://localhost:3000', 'http://3.26.54.251:3000'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,authorization, adminid,');
  res.setHeader('Access-Control-Expose-Headers', 'stickerdeletepass');
  next();
});


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(bodyParser.json());
app.use(multer().any())
// app.use(multer().array("files"))
// app.use(multer().any());
// Replace 'YOUR_GOOGLE_CLIENT_ID' and 'YOUR_GOOGLE_CLIENT_SECRET' with your actual credentials

mongoose.connect(Url, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))
 
    
app.use('/', route);


app.listen(PORT, function () {
    console.log('Express app running on port ' + (PORT))
});
