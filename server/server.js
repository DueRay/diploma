const bodyParser = require('body-parser'),
  express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  MongoStore = require('connect-mongo')(session),
  cors = require('cors'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  logger = require('loglevel'),
  axios = require('axios'),
  lodash = require('lodash'),
  UserModel = require('./model').UserModel,
  PatternModel = require('./model').PatternModel,
  translationFunction = require('./translation');

logger.setLevel(0);

let uriString = 'mongodb://localhost/diploma';

mongoose.connect(uriString, (err) => {
  if (err) {
    console.log ('ERROR connecting to: ' + uriString + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uriString);
  }
});

let app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(cookieParser());
app.use(session({
  secret: 'diploma work',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authCheck = (req, res, next) => {
  if (req.session.authorized && req.session.user_id) {
    next();
  } else {
    res.status(500).json({message: 'Secret zone!!! Authorization required', error_code: 100});
  }
};

const googleTranslate = (text, res) => {
  console.log(text);
  axios.post('https://translation.googleapis.com/language/translate/v2?key=AIzaSyBCLIhjQdT5IDkBrICZhCikMzju_zdwJk4',{
    source: 'en',
    target: 'ukr',
    format: 'text',
    q: text
  })
    .then((response) => {
      let text = response.data.data.translations[0].translatedText;
      res.json({text});
    }, () => {
      res.status(500).json({message: 'Something went wrong. Try again later', error_code: 102});
    })
};

app.post('/login', (req, res) => {
  console.log('login');
  if (!req.body.username || !req.body.password) {
    res.status(500).json({message: 'Something missing', error_code: 101});
    return;
  }
  UserModel.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (isMatch) {
          req.session.authorized = true;
          req.session.user_id = user._id;
          res.json({username: user.username, created_at: user.created_at});
        } else {
          res.status(500).json({message: 'Invalid username or password', error_code: 104});
        }
      });
    } else {
      res.status(404).json({message: 'User not found', error_code: 105});
    }
  });
});

app.get('/profile', authCheck, (req, res) => {
  console.log('profile GET');
  UserModel.findOne({_id: req.session.user_id}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      res.json({
        username: user.username,
        created_at: user.created_at,
        updated_at: user.updated_at
      });
    } else {
      res.status(404).json({message: 'User not found', error_code: 105});
    }
  });
});

app.post('/profile', authCheck, (req, res) => {
  console.log('profile POST');
  if (!req.body.username) {
    res.json({message: 'nothing to change'});
    return;
  }
  UserModel.findOne({_id: req.session.user_id}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      UserModel.findOne({username: req.body.username}, (err, new_user) => {
        if (err) {
          throw err;
        }
        if (new_user) {
          res.status(500).json({message: 'Already exist', error_code: 103});
        } else {
          user.username = req.body.username;
          user.updated_at = moment().valueOf();
          user.save(function(err) {
            if (err) {
              throw err;
            }
            res.json({message: 'successful'});
          });
        }
      });
    } else {
      res.status(404).json({message: 'User not found', error_code: 105});
    }
  });
});

app.post('/profile/password', authCheck, (req, res) => {
  console.log('password POST');
  if (!req.body.password && !req.body.new_password) {
    res.stutus(500).json({message: 'Something missing', error_code: 101});
    return;
  }
  UserModel.findOne({_id: req.session.user_id}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (isMatch) {
          user.encrypt(req.body.new_password, () => {
            user.save(function (err) {
              if (err) {
                throw err;
              }
              res.json({message: 'successful'});
            });
          });
        } else {
          res.status(500).json({message: 'Invalid password', error_code: 104});
        }
      });
    } else {
      res.status(404).json({message: 'User not found', error_code: 105});
    }
  });
});

app.post('/patterns', authCheck, (req, res) => {
  if (req.body.type && req.body.part1_from && req.body.part1_to && req.body.target && req.body.source) {
    let pat = new PatternModel({
      type: req.body.type,
      source: req.body.source,
      target: req.body.target,
      part1_from: req.body.part1_from,
      part1_to: req.body.part1_to,
      part2_from: req.body.part2_from,
      part2_to: req.body.part2_to
    });
    pat.save(function(err) {
      if (err) {
        throw err;
      }
      res.json({message: 'successful'});
    })
  } else {
    res.status(500).json({message: 'Something missing', error_code: 101});
  }
});

app.post('/registration', (req, res) => {
  console.log('reg');
  if (!req.body.username || !req.body.password) {
    res.status(500).json({message: 'Something missing', error_message: 101});
    return;
  }
  UserModel.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      res.status(500).json({message: 'Already exist', error_code: 103});
    } else {
      user = new UserModel({
        username: req.body.username,
        created_at: moment().valueOf()
      });
      user.encrypt(req.body.password, () => {
        user.save(function(err) {
          if (err) {
            throw err;
          }
          res.json({message: 'successful'});
        });
      });
    }
  });
});

app.post('/logout', (req, res) => {
  console.log('logout');
  req.session.destroy();
  res.json({message: 'Good bye'});
});

app.post('/translate', authCheck, (req, res) => {
  console.log('translate');
  if (req.body.text) {
    if (req.body.dictionary) {
      translationFunction(req.body.text, JSON.parse(req.body.dictionary), googleTranslate, res);
    } else {
      translationFunction(req.body.text, null, googleTranslate, res);
    }

  } else {
    res.status(500).json({message: 'Something missing', error_code: 101});
  }
});

app.use((req, res) => {
  res.status(404).json({message: 'Not Found'});
});

app.listen(5000, () => {
  console.log('Listening...')
});
