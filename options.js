function save_options() {
  // get values from fields
  const hiddenCompanies = document.getElementById('hiddenCompanies').value;
  const badWords = document.getElementById('badWords').value;

  // update stored values, then update UI with newly saved values
  chrome.storage.local.set({
    hiddenCompanies: hiddenCompanies.split(',').map(x => x.trim()),
    badWords: badWords.split(',').map(x => x.trim())
  }, () => {restore_options()});
}


// updates UI with the latest stored values
function restore_options() {
  chrome.storage.local.get(['hiddenCompanies', 'badWords'], (x) => {
    document.getElementById('hiddenCompanies').value = x.hiddenCompanies;
    document.getElementById('badWords').value = x.badWords;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
chrome.storage.onChanged.addListener(() => {restore_options()})
