(function() {
  const DEFAULT_OLD_WORD = "girl";
  const DEFAULT_NEW_WORD = "squirrel";
  const DEFAULT_CHANGE_SCOPE = "change-texts";
  const DEFAULT_URL_LIST = "";
  const DEFAULT_URL_SCOPE = "blacklist";

  chrome.runtime.onInstalled.addListener(function(details) {
    getExistingOptionsOnInstall()
    .then((oldOptions) => {
      const {
        oldWord,
        newWord,
        changeScope,
        urlList,
        urlScope,
      } = oldOptions;
      const newOptions = {
        oldWord: oldWord || DEFAULT_OLD_WORD,
        newWord: newWord || DEFAULT_NEW_WORD,
        changeScope: changeScope || DEFAULT_CHANGE_SCOPE,
        urlList: urlList || DEFAULT_URL_LIST,
        urlScope: urlScope || DEFAULT_URL_SCOPE,
      };
      clearExistingOptionsOnInstall()
      .then(() => {
        setNewOptionsOnInstall(newOptions)
        .then(() => {
          if (details.reason === "install") {
            chrome.runtime.openOptionsPage();
          }
        });
      });
    });
  });

  function getExistingOptionsOnInstall() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        "oldWord",
        "newWord",
        "changeScope",
        "urlList",
        "urlScope",
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
      const {
        oldWord,
        newWord,
        changeScope,
        urlList,
        urlScope
      } = options;
      chrome.storage.sync.set({
        oldWord,
        newWord,
        changeScope,
        urlList,
        urlScope,
      }, resolve);
    });
  }
})();
