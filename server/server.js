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
  ConfigModel = require('./model').ConfigModel,
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

app.post('/login', (req, res) => {
  console.log('login');
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
  console.log('profile GET');
  if (req.session.authorized) {
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
        res.status(404).json({message: 'Користувач не знайдений'});
      }
    });
  } else {
    res.status(500).json({message: 'Доступ заборонено'});
  }
});

app.post('/profile', (req, res) => {
  console.log('profile POST');
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

app.post('/patterns', (req, res) => {
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
      res.json({message: 'pattern successfully added'});
    })
  } else {
    res.status(500).json({message: 'Щось пішло не так'});
  }
});

app.post('/registration', (req, res) => {
  console.log('reg');
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
        let config = new ConfigModel({
          user_id: user._id,
          translation_type: 0
        });
        config.save(function(err) {
          if (err) {
            throw err;
          }
          res.json({message: 'Успішно'});
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

app.get('/config', (req, res) => {
  console.log('config GET');
  if (req.session.authorized) {
    ConfigModel.findOne({user_id: req.session.user_id}, (err, config) => {
      if (err) {
        throw err;
      }
      if (config) {
        res.json({translation_type: config.translation_type});
      } else {
        res.status(404).json({message: 'Щось пішло не так'});
      }
    });
  } else {
    res.status(500).json({message: 'Доступ заборонено'});
  }
});

app.post('/config', (req, res) => {
  console.log('config POST');
  if (req.session.authorized) {
    if (typeof req.body.translation_type.type === 'number') {
      res.status(500).json({message: 'Щось пішло не так'});
      return;
    }
    ConfigModel.findOne({user_id: req.session.user_id}, (err, config) => {
      if (err) {
        throw err;
      }
      if (config) {
        config.translation_type = req.body.translation_type;
        config.save(function (err) {
          if (err) {
            throw err;
          }
          res.json({message: 'Успішно'});
        });
      } else {
        config = new ConfigModel({
          user_id: req.session.user_id,
          translation_type: req.body.translation_type
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
  console.log('translate');
  if (req.session.authorized && req.body.text && req.body.translation_type) {
    let textToTranslate = translationFunction(req.body.text);
    console.log(textToTranslate);
    axios.post('https://translation.googleapis.com/language/translate/v2?key=AIzaSyBCLIhjQdT5IDkBrICZhCikMzju_zdwJk4',{
      source: 'en',
      target: 'ukr',
      format: 'text',
      q: textToTranslate
    })
      .then((response) => {
        let text = response.data.data.translations[0].translatedText;
        res.json({message: 'Успішно', text});
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
