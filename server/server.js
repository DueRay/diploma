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
  UserModel = require('./model').UserModel,
  ConfigModel = require('./model').ConfigModel;

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
    res.status(500).json({message: 'Щось пішло не так'});
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
          res.json({message: 'Успішно', user: {username: user.username, created_at: user.created_at}});
        } else {
          res.status(500).json({message: 'Помилка'});
        }
      });
    } else {
      res.status(404).json({message: 'Користувач не знайдений'});
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
        res.status(404).json({message: 'Користувач не знайдений'});
      }
    });
  } else {
    res.status(500).json({message: 'Доступ заборонено'});
  }
});

app.post('/profile', (req, res) => {
  if (req.session.authorized) {
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
            res.status(500).json({message: 'Вже існує'});
          } else {
            user.username = req.body.username;
            user.updated_at = moment().valueOf();
            user.save(function(err) {
              if (err) {
                throw err;
              }
              res.json({message: 'Успішно'});
            });
          }
        });
      } else {
        res.status(404).json({message: 'Користувач не знайдений'});
      }
    })
  } else {
    res.status(500).json({message: 'Доступ заборонено'});
  }
});

app.post('/registration', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(500).json({message: 'Щось пішло не так'});
    return;
  }
  UserModel.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      res.status(500).json({message: 'Вже існує'});
    } else {
      user = new UserModel({
        username: req.body.username,
        password: req.body.password,
        created_at: moment().valueOf()
      });
      user.save(function(err) {
        if (err) {
          throw err;
        }
        res.json({message: 'Успішно'});
      });
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({message: 'Good bye'});
});

app.get('/config', (req, res) => {
  if (req.session.authorized) {
    ConfigModel.findOne({user_id: req.session.user_id}, (err, config) => {
      if (err) {
        throw err;
      }
      if (config) {
        res.json({translate_type: config.translate_type});
      } else {
        res.status(404).json({message: 'Щось пішло не так'});
      }
    });
  } else {
    res.status(500).json({message: 'Доступ заборонено'});
  }
});

app.post('/config', (req, res) => {
  if (req.session.authorized) {
    if (!req.body.translate_type) {
      res.status(500).json({message: 'Щось пішло не так'});
      return;
    }
    ConfigModel.findOne({user_id: req.session.user_id}, (err, config) => {
      if (err) {
        throw err;
      }
      if (config) {
        config.translate_type = req.body.translate_type;
        config.save(function (err) {
          if (err) {
            throw err;
          }
          res.json({message: 'Успішно'});
        });
      } else {
        config = new ConfigModel({
          translate_type: req.body.translate_type
        });
        config.save(function (err) {
          if (err) {
            throw err;
          }
          res.json({message: 'Успішно'});
        });
      }
    });
  }
});

app.post('/translate', (req, res) => {
  if (req.session.authorized && req.body.text) {
    axios.post('https://translation.googleapis.com/language/translate/v2?key=AIzaSyBCLIhjQdT5IDkBrICZhCikMzju_zdwJk4',{
      source: 'en',
      target: 'ukr',
      format: 'text',
      q: req.body.text
    })
      .then((response) => {
        res.json({message: 'Успішно', text: response.data.data.translations[0].translatedText})
      }, (error) => {
        res.status(500).json({message: 'Щось пішло не так', error: error.response.data});
      })

  } else {
    res.status(500).json({message: 'Доступ заборонено'});
  }
});

app.listen(5000, () => {
  console.log('Listening...')
});
