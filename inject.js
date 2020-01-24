function checkJobs(options){
		const jobs = document.getElementsByClassName('artdeco-list__item');
		console.log(options)

		for (var i = 0; i < jobs.length; i++){
				const companyName = jobs[i].getElementsByClassName('job-card-search__company-name')[0] ? jobs[i].getElementsByClassName('job-card-search__company-name')[0].textContent.trim() : false

				const companyLocation = jobs[i].getElementsByClassName('job-card-search__location')[0] ? jobs[i].getElementsByClassName('job-card-search__location')[0].textContent.trim() : false
				
				const jobTitle = jobs[i].getElementsByClassName('job-card-search__title')[0] ? jobs[i].getElementsByClassName('job-card-search__title')[0].textContent.trim() : false

				if (!!companyName && !!companyLocation && !!jobTitle){
					if (options.hiddenCompanies.includes(companyName) || options.hiddenLocations.some(x => {return companyLocation.includes(x)})){
						jobs[i].setAttribute('bvs_ext', 'hidden')
					} else {
						jobs[i].setAttribute('bvs_ext', 'ok')
					}
				} else {
					jobs[i].setAttribute('bvs_ext', 'err')
				}
	}
}

chrome.storage.sync.get(['hiddenCompanies','hiddenLocations'], (x) => {
	const hiddenCompanies = x.hiddenCompanies;
	const hiddenLocations = x.hiddenLocations;

	const observer = new MutationObserver((mutationsList, observer) => {
		checkJobs({
			hiddenCompanies: hiddenCompanies,
			hiddenLocations: hiddenLocations
		});
	});
	
	const resultsNode = document.getElementsByClassName('jobs-search-results')[0];
	observer.observe(resultsNode, {
		//attributes: true,
		childList: true,
		subtree: true
	});

});

