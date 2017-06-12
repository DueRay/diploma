let bodyParser = require('body-parser'),
  express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  MongoStore = require('connect-mongo')(session),
  cors = require('cors'),
  mongoose = require('mongoose'),
  UserModel = require('./model').UserModel;

let uriString = 'mongodb://localhost/diploma';

mongoose.connect(uriString, (err) => {
  if (err) {
    console.log ('ERROR connecting to: ' + uriString + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uriString);
  }
});

let app = express();

app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: 'diploma work',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(500).json({message: 'something missing'});
    return;
  }
  let user = UserModel.findOne({username: req.body.username}, (err, user) => {
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (isMatch) {
          req.session.authorized = true;
          req.session.user_id = user._id;
          res.json({message: 'login successful'});
        } else {
          res.status(500).json({message: 'bad login'});
        }
      });
    } else {
      res.status(404).json({message: 'no user'});
    }
  });
});

app.get('/profile', (req, res) => {
  if (req.session.authorized) {
    UserModel.findOne({_id: req.session.user_id}, (err, user) => {
      if (err) {
        throw err;
      }
      if (user) {
        res.json({username: user.username});
      } else {
        res.status(404).json({message: 'not found'});
      }
    });
  } else {
    res.status(500).json({message: 'login first'});
  }
});

app.post('/profile', (req, res) => {
  if (req.session.authorized) {
    UserModel.findOne({_id: req.session.user_id}, (err, user) => {
      if (err) {
        throw err;
      }
      if (user) {
        user.username = req.body.username;
        user.save(function(err) {
          if (err) {
            throw err;
          }
          res.json({message: 'change profile successful'});
        });
      } else {
        res.status(404).json({message: 'not found'});
      }
    })
  } else {
    res.status(500).json({message: 'login first'});
  }
});

app.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(500).json({message: 'something missing'});
    return;
  }
  let user = new UserModel({
    username: req.body.username,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) {
      throw err;
    }
    res.json({message: 'register successful'});
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({message: 'Good bye'});
});

app.post('/translate', (req, res) => {
  if (req.session.authorized) {

  } else {
    res.status(500).json({message: 'Login first'});
  }
});

app.listen(5000, () => {
  console.log('Listening...')
});
