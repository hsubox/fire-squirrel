var DEFAULT_OLD_WORD = "girl";
var DEFAULT_NEW_WORD = "squirrel";

function matchCase(text, pattern) {
    // uses the first letter to determine if word is capitalized; second letter to determine if all letters in word are capitalized
    firstLetter = pattern.charCodeAt(0);
    secondLetter = pattern.charCodeAt(1);

    if (firstLetter >= 65 && firstLetter < 65 + 26) {
      if (secondLetter >= 65 && secondLetter < 65 + 26) {
        return text.toUpperCase();
      }
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    return text.toLowerCase();
}

function findAndReplaceDOMText(old_word, new_word) {
  $('body :not(script) :not(iframe)').contents().filter(function() {
    return this.nodeType === 3; // Text node
  }).each(function() {
    this.nodeValue = this.nodeValue.replace(new RegExp(old_word, 'gi'), function(match) {
      return matchCase(new_word, match);
    });
  });
};

chrome.storage.sync.get(["old_word", "new_word"], function(items) {
  var old_word = items.old_word;
  var new_word = items.new_word;

  $('document').ready(function() {
    setTimeout(findAndReplaceDOMText.bind(null, old_word, new_word), 1000);
  });
});
