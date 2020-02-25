chrome.contextMenus.create({
  id: "add-to-hidden-companies",
  title: "Add '%s' to hidden companies",
  contexts: ["selection"]
})

chrome.contextMenus.create({
  id: "add-to-hidden-locations",
  title: "Add '%s' to hidden locations",
  contexts: ["selection"]
})

chrome.contextMenus.onClicked.addListener((info) => {
  chrome.storage.sync.get({
    hiddenCompanies: '',
    hiddenLocations: ''
  }, (x) => {
      if (info.menuItemId == "add-to-hidden-companies"){
        const hiddenCompanies = x.hiddenCompanies
        const company = info.selectionText.trim()
        hiddenCompanies.push(company)
        chrome.storage.sync.set({hiddenCompanies: hiddenCompanies}, (x) => {
          alert(`Added ${company} to hidden companies`)
        })
      } else if (info.menuItemId == "add-to-hidden-locations") {
        const hiddenLocations = x.hiddenLocations
        const location = info.selectionText.trim()
        hiddenLocations.push(location)
        chrome.storage.sync.set({hiddenLocations: hiddenLocations}, (x) => {
          alert(`Added ${location} to hidden locations`)
        })
      } else {
        alert("error saving options")
      }
    })
  });