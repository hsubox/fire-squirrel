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
  form.elements.old_word.value = items.old_word;
  form.elements.new_word.value = items.new_word;
});
