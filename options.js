// Saves options to chrome.storage.sync.
function saveOptions() {
	console.log('in save options');

  const reloadPageVal = document.getElementById('reload_page_after_extension_reload').checked;
  const selectedExtensionVal = document.getElementById('extension_select').value;
  chrome.storage.sync.set({
    'reloadPage': reloadPageVal,
    'selectedExtension': selectedExtensionVal
  }, function () {
    // Update status to let user know options were saved.
    const statusEl = document.getElementById('status');

    statusEl.textContent = 'Options saved.';
    setTimeout(function () {
      statusEl.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({
    'reloadPage': false,
    'selectedExtension': ''
  }, function (items) {
    document.getElementById('reload_page_after_extension_reload').checked = items.reloadPage;
    document.getElementById('extension_select').value = items.selectedExtension;
  });
}

// Loads available unpacked extensions into the dropdown
function loadExtensions() {
  const selectEl = document.getElementById('extension_select');

  chrome.management.getAll(function (extensions) {
    // Clear existing options except the "All extensions" option
    selectEl.innerHTML = '<option value="">All unpacked extensions</option>';

    for (const ext of extensions) {
      if ((ext.installType === 'development') &&
          (ext.enabled === true) &&
          (ext.name !== 'Extensions Reloader')) {

        const option = document.createElement('option');
        option.value = ext.id;
        option.textContent = ext.name;
        selectEl.appendChild(option);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadExtensions();
  restoreOptions();
});
document.getElementById('save').addEventListener('click', saveOptions);
