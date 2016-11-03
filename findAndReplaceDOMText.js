function findAndReplaceDOMText(old_word, new_word) {
  $('body :not(script)').contents().filter(function() {
    return this.nodeType === 3; // Text node
  }).each(function() {
    this.nodeValue = this.nodeValue.replace(new RegExp(old_word, 'gi'), new_word);
  });
};

chrome.storage.sync.get(["old_word", "new_word"], function(items) {
  var old_word = items.old_word || "girl";
  var new_word = items.new_word || "squirrel";
  $('document').ready(findAndReplaceDOMText(old_word, new_word));
});
