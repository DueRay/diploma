let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_FACTOR = 10;

let UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date },
  updated_at: { type: Date }
});

let ConfigSchema = new Schema({
  user_id: { type: String, required: true, index: { unique: true } },
  translation_type: {type: Number, required: true }
});

UserSchema.pre('save', function(next) {
  let user = this;

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
  ConfigModel: mongoose.model('Config', ConfigSchema)
};
