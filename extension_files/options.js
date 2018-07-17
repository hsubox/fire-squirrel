(function() {
  function setOptions(oldWord, newWord, changeScope, urlList, urlScope, callback) {
    chrome.storage.sync.set({
      oldWord,
      newWord,
      changeScope,
      urlList,
      urlScope,
    }, callback);
  }

  function getOptions() {
    chrome.storage.sync.get([
      "oldWord",
      "newWord",
      "changeScope",
      "urlList",
      "urlScope",
    ], function(options) {
      form.elements['old-word'].value = options.oldWord;
      form.elements['new-word'].value = options.newWord;
      for (let option of form.elements['change-scope']) {
        if (options.changeScope == option.id) {
          option.checked = true;
        }
      }
      form.elements['url-list'].value = options.urlList || "";
      for (let option of form.elements['url-scope']) {
        if (options.urlScope == option.id) {
          option.checked = true;
        }
      }
    });
  }

  const form = document.querySelector("form");
  getOptions();

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    let changeScope = "change-texts";
    for (let option of form.elements["change-scope"]) {
      if (option.checked) {
        changeScope = option.id;
      }
    }

    let urlScope = "blacklist";
    for (let option of form.elements["url-scope"]) {
      if (option.checked) {
        urlScope = option.id;
      }
    }

    if (form.elements['old-word'].value.trim() == "" || form.elements['new-word'].value.trim() == "") {
      alert("Fields cannot be empty!");
    } else {
      setOptions(
        form.elements['old-word'].value,
        form.elements['new-word'].value,
        changeScope,
        form.elements['url-list'].value,
        urlScope,
        getOptions,
      );
    }
  });
})();
