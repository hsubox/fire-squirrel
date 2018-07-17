(function() {
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

  function handleText(node, oldWord, newWord) {
    const re = new RegExp(oldWord, 'gi');
    if (re.test(node.nodeValue)) { // prevent infinite looping
      node.nodeValue = node.nodeValue.replace(re, function(match) {
        return matchCase(newWord, match);
      });
    }
  }

  function handleUrl(node, oldWord, newWord) {
    const re = new RegExp(oldWord, 'gi');
    if (re.test(node.href)) { // prevent infinite looping
      node.href = node.href.replace(re, function(match) {
        return matchCase(newWord, match);
      });
    }
  }

  function walk(node, oldWord, newWord, changeScope) {
    switch(node.nodeType) {
      case 1: // Element
        if (changeScope === 'change-links' && node.href) {
          handleUrl(node, oldWord, newWord);
        }
        // don't break here!
      case 9: // Document
      case 11: // Document fragement
        let child = node.firstChild;
        while (child) {
          const next = child.nextSibling;
          walk(child, oldWord, newWord, changeScope);
          child = next;
        }
        break;
      case 3: // Text node
        handleText(node, oldWord, newWord);
        break;
    }
  }

  function findAndReplaceDOMText(oldWord, newWord, changeScope) {
    if (changeScope === 'change-none') {
      return;
    }
    // watch for future changes
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        walk(mutation.target, oldWord, newWord, changeScope);
      });
    });
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });

    // initial pass
    walk(document.body, oldWord, newWord, changeScope);
  };

  chrome.storage.sync.get([
    "oldWord",
    "newWord",
    "changeScope",
    "urlList",
    "urlScope",
  ], function(options) {
    const {
      oldWord,
      newWord,
      changeScope,
      urlList,
      urlScope,
    } = options;

    const urlSet = new Set(urlList.split(',').map(url => url.trim()));
    const hostInList = urlSet.has(window.location.host);

    if (
      (urlScope === 'blacklist' && !hostInList) ||
      (urlScope === 'whitelist' && hostInList)
    ) {
      findAndReplaceDOMText(oldWord, newWord, changeScope);
    }
  });
})();
