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

let PatternSchema = new Schema({
  source: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String },
  part1_from: { type: String, required: true, index: { unique: true } },
  part2_from: { type: String },
  part1_to: { type: String, required: true },
  part2_to: { type: String }
});

UserSchema.methods.encrypt = function(new_password, cb) {
  let user = this;

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(new_password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      cb();
    });
  });
};

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
  PatternModel: mongoose.model('Pattern', PatternSchema)
};
