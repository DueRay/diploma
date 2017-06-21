let PatternSchema = require('./model').PatternModel;

module.exports = function (text, dictionary, cb, res) {
  PatternSchema.find({target: 'ukr', source: 'en', type: 'complex'}, (err, patterns) => {
    if (err) {
      throw err;
    }
    if (dictionary) {
      let words = dictionary.ukr || dictionary;
      for (let word in words) {
        if (words.hasOwnProperty(word)) {
          for (let pat in patterns) {
            if (patterns.hasOwnProperty(pat)) {
              text = text.replace(new RegExp(`${patterns[pat].part1_from}${word}${patterns[pat].part2_from}`, 'g'),
                `${patterns[pat].part1_to}${words[word]}${patterns[pat].part2_to}`);
            }
          }
          text = text.replace(new RegExp(word, 'g'), words[word]);
        }
      }
    }
    PatternSchema.find({target: 'ukr', source: 'en', type: 'simple'}, (err, small_patterns) => {
      if (err) {
        throw err;
      }
      for (let pat in small_patterns) {
        if (small_patterns.hasOwnProperty(pat)) {
          text = text.replace(new RegExp(small_patterns[pat].part1_from, 'g'), small_patterns[pat].part1_to);
        }
      }
      cb(text, res);
    });
  });
};
