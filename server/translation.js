let PatternSchema = require('./model').PatternModel;

module.exports = function (text, dictionary) {
  let simplePatterns = PatternSchema.find({target: 'ukr', source: 'en', type: 'simple'});
  let complexPatterns = PatternSchema.find({target: 'ukr', source: 'en', type: 'complex'});
  if (dictionary) {
    let words = dictionary.ukr || dictionary;
    for (let pat in complexPatterns) {
      if (complexPatterns.hasOwnProperty(pat)) {
        for (let word in words) {
          if (words.hasOwnProperty(word)) {
            text = text.replace(new RegExp(`${pat.part1_from}${word}${pat.part2_from}`, 'g'),
              `${pat.part1_to}${words[word]}${pat.part2_to}`);
            text = text.replace(new RegExp(word, 'g'), words[word]);
          }
        }
      }
    }
  }
  for (let pat in simplePatterns) {
    if (simplePatterns.hasOwnProperty(pat)) {
      text = text.replace(pat.part1_from, pat.part1_to);
    }
  }
  return text;
};
