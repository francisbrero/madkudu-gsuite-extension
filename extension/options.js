var madkuduAPIKey;
// allow to store the parameters that were input by the user
// Saves options to chrome.storage
function save_options() {
    madkuduAPIKey = document.getElementById('madkuduAPIKey').value;
  chrome.storage.sync.set({
    madkuduAPIKey: madkuduAPIKey
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores state using the preferences
// stored in chrome.storage.
function restore_options() {
  var status = document.getElementById('status');
  status.textContent = 'Please set your preferences.';
  // Use default value 
  chrome.storage.sync.get({
    madkuduAPIKey: 'YOUR_API_KEY',
  }, function(items) {
    document.getElementById('madkuduAPIKey').value = items.madkuduAPIKey;
  });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', 
  save_options);