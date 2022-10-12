"use strict"

const jobItemClassName = 'job-card-container'
const jobListClassName = 'jobs-search-results-list'
const jobTitleClassName = 'job-card-list__title'
const companyNameClassName = 'job-card-container__primary-description'
const jobIdAttribute = 'data-job-id'
const jobFooterClassName = 'job-card-container__footer-wrapper'
const pageListClassName = 'artdeco-pagination__pages'

function checkJobs(options){
  const jobs = document.getElementsByClassName(jobItemClassName);

  for (var i = 0; i < jobs.length; i++){

    let companyName = jobs[i].getElementsByClassName	(companyNameClassName)[0].innerText
    let jobTitle = jobs[i].getElementsByClassName(jobTitleClassName)[0].innerText
    let jobId = jobs[i].getAttribute(jobIdAttribute)
    let footerContents = jobs[i].getElementsByClassName(jobFooterClassName)[0].innerText

    console.log(jobId, companyName, jobTitle, footerContents)

    if (!!companyName){ companyName = companyName.trim() }
    if (!!jobTitle){ jobTitle = jobTitle.trim() }
    console.log(options.hiddenCompanies) 
    if (!!companyName && !!jobTitle){
      if (options.hiddenCompanies.includes(companyName)){
        hideResult(jobs[i], companyName)
      }
      else if (footerContents.includes('Promoted')) {
        hideResult(jobs[i])
      }
      else {
        jobs[i].setAttribute('linkedin-results-filter-ext', 'ok')
      }
    } else {
      jobs[i].setAttribute('linkedin-results-filter-ext', 'err')
    }
  }
}

function hideResult(result, reason){
	result.setAttribute('linkedin-results-filter-ext', 'hidden')
}

// get current user settings from storage
chrome.storage.local.get('hiddenCompanies', (x) => {
	const hiddenCompanies = x.hiddenCompanies;
	const resultsNode = document.getElementsByClassName(jobListClassName)[0];

	// call checkJobs() whenever changes observed in job-search-results node
	const observer = new MutationObserver(() => {
		checkJobs({ hiddenCompanies });
	});
	
	// specify what to observe, and what events to observe for, and start observing
	observer.observe(resultsNode, {
		childList: true,
		subtree: true
	});

  checkJobs({ hiddenCompanies });

});

// document.addEventListener('DOMContentLoaded', () => {
//   const pageList = document.getElementsByClassName(pageListClassName)[0]
//   console.log(pageList)
//   pageList.addEventListener('click', () => {
//   })
// })
