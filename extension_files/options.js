var form = document.querySelector("form");

form.addEventListener("submit", function(event) {
  if (!form.elements.old_word.value || !form.elements.new_word.value) {
    alert("Fields cannot be empty!");
    return;
  }

  event.preventDefault();
  chrome.storage.sync.set({
    "old_word": form.elements.old_word.value,
    "new_word": form.elements.new_word.value,
  }, function(){});
});

chrome.storage.sync.get(["old_word", "new_word"], function(items) {
  if (!items.old_word || !items.new_word) {
    chrome.storage.sync.set({
      "old_word": "girl",
      "new_word": "squirrel",
    }, function(){});
    form.elements.old_word.value = items.old_word;
    form.elements.new_word.value = items.new_word;
  } else {
    form.elements.old_word.value = items.old_word;
    form.elements.new_word.value = items.new_word;
  }
});
