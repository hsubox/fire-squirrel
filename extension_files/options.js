var DEFAULT_OLD_WORD = "girl";
var DEFAULT_NEW_WORD = "squirrel";

function setWords(old_word, new_word, callback) {
  chrome.storage.sync.set({
    "old_word": form.elements.old_word.value,
    "new_word": form.elements.new_word.value,
  }, callback);
}

function getWords() {
  chrome.storage.sync.get(["old_word", "new_word"], function(items) {
    form.elements.old_word.value = items.old_word;
    form.elements.new_word.value = items.new_word;
  });
}

var form = document.querySelector("form");
getWords();

form.addEventListener("submit", function(event) {
  event.preventDefault();
  if (form.elements.old_word.value.trim() == "" || form.elements.new_word.value.trim() == "") {
    alert("Fields cannot be empty!");
  } else {
    setWords(form.elements.old_word.value, form.elements.new_word.value, getWords);
  }
});
