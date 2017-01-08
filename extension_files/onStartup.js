var DEFAULT_OLD_WORD = "girl";
var DEFAULT_NEW_WORD = "squirrel";

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    "old_word": DEFAULT_OLD_WORD,
    "new_word": DEFAULT_NEW_WORD,
  }, function(){
    chrome.runtime.openOptionsPage();
  });
});
