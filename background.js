chrome.contextMenus.create({
  id: "add-to-hidden-companies",
  title: "Add '%s' to hidden companies",
  contexts: ["selection"]
})


chrome.contextMenus.onClicked.addListener((info) => {
  chrome.storage.local.get('hiddenCompanies', (res) => {
    if (info.menuItemId == "add-to-hidden-companies"){
      const hiddenCompanies = res.hiddenCompanies
      const company = info.selectionText.trim()
      hiddenCompanies.push(company)
      chrome.storage.local.set({hiddenCompanies: hiddenCompanies}, () => {
        alert(`Added ${company} to hidden companies`)
      })
    }
    else { alert("error saving options") }
  })
});


// on install, check if settings already exist, and if not, add default value
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['hiddenCompanies', 'badWords'], (res) => {
    if (res.hiddenCompanies === undefined) { chrome.storage.local.set({'hiddenCompanies': []}) }
    if (res.badWords === undefined) { chrome.storage.local.set({'badWords': []}) }
  })
})
