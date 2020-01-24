function save_options() {
  const hiddenCompanies = document.getElementById('hiddenCompanies').value;
  const hiddenLocations = document.getElementById('hiddenLocations').value;

  chrome.storage.sync.set({
    hiddenCompanies: hiddenCompanies.split(',').map(x => x.trim()),
    hiddenLocations: hiddenLocations.split(',').map(x => x.trim())
  }, () => {restore_options()});
}

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
