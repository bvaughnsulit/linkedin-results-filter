"use strict"

const jobItemClassName = 'job-card-container'
const jobListClassName = 'jobs-search-results-list'
const jobTitleClassName = 'job-card-list__title'
const companyNameClassName = 'job-card-container__company-name'
const jobFooterClassName = 'job-card-container__footer-wrapper'
// const pageListClassName = 'artdeco-pagination__pages'
const metadataItemClassName = 'job-card-container__metadata-item'
const workplaceTypeClassName = 'job-card-container__metadata-item--workplace-type'

const jobDescClassName = 'jobs-search__job-details'
const jobDescId = 'job-details'

function checkJobs(options){
  console.log('checking jobs...')

  const jobs = document.getElementsByClassName(jobItemClassName);
  console.log(`found ${jobs.length} ${jobItemClassName}`)

  for (var i = 0; i < jobs.length; i++){

    const companyNameElements = jobs[i].getElementsByClassName(companyNameClassName)
    let companyName
    if (companyNameElements.length) {
      companyName = companyNameElements[0].innerText
    } else {
      console.log(`${companyNameClassName} not found`)
    }

    const jobTitleElements = jobs[i].getElementsByClassName(jobTitleClassName)
    let jobTitle
    if (jobTitleElements.length) {
      jobTitle = jobTitleElements[0].innerText
    } else {
      console.log(`${jobItemClassName} not found`)
    }

    const footerElements = jobs[i].getElementsByClassName(jobFooterClassName)
    let footerContents
    if (footerElements.length) {
      footerContents = footerElements[0].innerText
    } else {
      console.log(`${jobFooterClassName} not found`)
    }

    const metadata= jobs[i].getElementsByClassName(metadataItemClassName)
    let location 
    if (metadata.length) {
      // assumes that location will always be the first item of metadata
      location = metadata[0].innerText
      
      for (let j = 1; j < metadata.length; j++){
        const metadataItem = metadata[j]
        if (!metadataItem.className.includes(workplaceTypeClassName)){
          // console.log(`hiding ${metadataItem.innerText}`)
          metadataItem.innerText = ''
        }
      }
    } else {
      console.log(`${metadataItemClassName} not found`)
    }

    const workplaceTypeElements = jobs[i].getElementsByClassName(workplaceTypeClassName)
    const workplaceType = workplaceTypeElements.length ?
        workplaceTypeElements[0].innerText.trim() :
        ''

    if (!!companyName){ companyName = companyName.trim() }
    if (!!jobTitle){ jobTitle = jobTitle.trim() }

    if (!!companyName && !!jobTitle){

      let hasBadWordMatch;

      for (let j = 0; j < options.badWords.length; j++){
        if (options.badWords[j].test(jobTitle)) {
          hasBadWordMatch = true;
          break
        }
      }

      const debugInfo = [jobTitle, companyName, location.trim(), workplaceType]

      if (hasBadWordMatch) {
        setCustomAttribute(jobs[i], 'hidden', debugInfo)
      }
      else if (options.hiddenCompanies.has(companyName)){
        setCustomAttribute(jobs[i], 'hidden', debugInfo)
      }
      else if (workplaceType === 'On-site' || workplaceType === 'Hybrid'){
        setCustomAttribute(jobs[i], 'hidden', debugInfo)
      }
      else if (footerContents.includes('Promoted')) {
        setCustomAttribute(jobs[i], 'promoted')
      }
      else {
        setCustomAttribute(jobs[i], 'ok')
      }

    }
    else {
      setCustomAttribute(jobs[i], 'err')
    }
  }
}

function highlight(mutationsArr) {
  console.log(mutationsArr.length)
  const descDiv = document.getElementById(jobDescId)
  const descHtml = descDiv.innerHTML.toString()

  // for(const e of mutationsArr){
  //   if ( e.target.parentElement && e.target.parentElement.id === jobDescId ) {
  //     const text = descHtml.replace('a','aaaaa')
  //     console.log(descHtml, text)
  //     descDiv.innerHTML = text
  //     break;
  //   }
  // }
}

const setCustomAttribute = (element, value, debugInfo) => {
  element.setAttribute('linkedin-results-filter-ext', value)
  if (debugInfo){ 
    console.log(value, debugInfo.toString())
  }
}

// get current user settings from storage
chrome.storage.local.get(['hiddenCompanies', 'badWords'], (x) => {
	let hiddenCompanies = arrToMap(x.hiddenCompanies);
  let badWords = arrToRegExArr(x.badWords)

	const jobListElements = document.getElementsByClassName(jobListClassName);
  let jobListNode
  if (jobListElements.length) {
    jobListNode = jobListElements[0]
  } else {
    console.log(`${jobItemClassName} not found`)
  }

  const jobDescObserver = new MutationObserver((mutationList) => {
    highlight(mutationList)
  });

  const jobDescElements = document.getElementsByClassName(jobDescClassName)
  let jobDescNode
  if (jobDescElements.length){
    jobDescNode = jobDescElements[0]
    console.log(jobDescNode)

    jobDescObserver.observe(jobDescNode, {
      childList: true,
      subtree: true
    });
  }
  else {
    console.log(`${jobDescClassName} not found`)
  }


	// call checkJobs() whenever changes observed in job-search-results node
	const jobListObserver = new MutationObserver(() => {
		checkJobs({ hiddenCompanies, badWords });
	});
	
	// specify what to observe, and what events to observe for, and start observing
	jobListObserver.observe(jobListNode, {
		childList: true,
		subtree: true
	});

  checkJobs({ hiddenCompanies, badWords });
  
  // when options are changed, reload options and update dom accordingly 
  chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(['hiddenCompanies', 'badWords'], (res) => {
      hiddenCompanies = arrToMap(res.hiddenCompanies);
      badWords = arrToRegExArr(res.badWords)
      checkJobs({ hiddenCompanies, badWords })
    })
  })
});

const arrToMap = (arr) => {
  return new Map(arr.map(x => [x, '']))
}

const arrToRegExArr = (arr) => {
  return arr.map(x => new RegExp(`.*${x}.*`, 'i'))
}
