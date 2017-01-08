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

function handleText(node, old_word, new_word) {
  var re = new RegExp(old_word, 'gi');
  if (re.test(node.nodeValue)) { // prevent infinite looping
    node.nodeValue = node.nodeValue.replace(re, function(match) {
      return matchCase(new_word, match);
    });
  }
}

function walk(node, old_word, new_word) {
  switch(node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragement
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling;
        walk(child, old_word, new_word);
        child = next;
      }
      break;
    case 3: // Text node
      handleText(node, old_word, new_word);
      break;
  }
}

function findAndReplaceDOMText(old_word, new_word) {
  // watch for future changes
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      walk(mutation.target, old_word, new_word);
    });
  });
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });

  // initial pass
  walk(document.body, old_word, new_word);
};

chrome.storage.sync.get(["old_word", "new_word"], function(items) {
  var old_word = items.old_word;
  var new_word = items.new_word;
  findAndReplaceDOMText(old_word, new_word);
});
