(function() {
  const DEFAULT_OLD_WORD = "girl";
  const DEFAULT_NEW_WORD = "squirrel";
  const DEFAULT_CHANGE_SCOPE = "change-texts";

  chrome.runtime.onInstalled.addListener(function() {
    getExistingOptionsOnInstall()
    .then((oldOptions) => {
      const {
        old_word,
        new_word,
        oldWord,
        newWord,
        changeScope,
      } = oldOptions;
      const newOptions = {
        oldWord: old_word || oldWord || DEFAULT_OLD_WORD,
        newWord: new_word || newWord || DEFAULT_NEW_WORD,
        changeScope: changeScope || DEFAULT_CHANGE_SCOPE,
      };
      clearExistingOptionsOnInstall()
      .then(() => {
        setNewOptionsOnInstall(newOptions)
        .then(() => {
          chrome.runtime.openOptionsPage();
        });
      });
    });
  });

  function getExistingOptionsOnInstall() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        "old_word",
        "new_word",
        "oldWord",
        "newWord",
        "changeScope",
      ], (options) => {
        resolve(options);
      });
    });
  }

  function clearExistingOptionsOnInstall() {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(resolve);
    });
  }

  function setNewOptionsOnInstall(options) {
    return new Promise((resolve) => {
      const { oldWord, newWord, changeScope } = options;
      chrome.storage.sync.set({
        oldWord,
        newWord,
        changeScope,
      }, resolve);
    });
  }
})();
