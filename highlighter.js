const jobDescClassName = 'jobs-details'

  const jobDescriptionElements = document.getElementsByClassName(jobDescClassName);


  function highlight(options){
    console.log(options)
  }

  let jobDescriptionNode
  if (jobDescriptionElements.length) {
    jobDescriptionNode = jobDescriptionElements[0]
    console.log(jobDescriptionNode)
  } else {
    console.log(`${jobDescClassName} not found`)
  }

  // call checkJobs() whenever changes observed in job-search-results node
  // const jobDescObserver = new MutationObserver((mutationList) => {
  //   console.log('mutation!')
  //   highlight(mutationList)
  // });

  console.log(typeof jobDescriptionNode)
  // specify what to observe, and what events to observe for, and start observing
  // jobDescObserver.observe(jobDescriptionNode, {
  //   childList: true,
  //   subtree: true
  // });

