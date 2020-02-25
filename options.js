function save_options() {
  // get values from fields
  const hiddenCompanies = document.getElementById('hiddenCompanies').value;
  const hiddenLocations = document.getElementById('hiddenLocations').value;

  // update stored values, then update UI with newly saved values
  chrome.storage.sync.set({
    hiddenCompanies: hiddenCompanies.split(',').map(x => x.trim()),
    hiddenLocations: hiddenLocations.split(',').map(x => x.trim())
  }, () => {restore_options()});
}

// updates UI with the latest stored values
function restore_options() {
  chrome.storage.sync.get({
    hiddenCompanies: '',
    hiddenLocations: ''
  }, (x) => {
    document.getElementById('hiddenCompanies').value = x.hiddenCompanies;
    document.getElementById('hiddenLocations').value = x.hiddenLocations;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
chrome.storage.onChanged.addListener(() => {restore_options()})