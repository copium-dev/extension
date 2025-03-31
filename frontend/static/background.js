/**
 * Background script for LinkedIn Job Tracker Extension
 * 
 * This script handles:
 * - Message communication between content scripts and the extension
 * - Storage of tracked job data
 * - Notifications and badge updates
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message.action);
  
  switch (message.action) {
    case 'trackJob':
      handleJobTracking(message.jobData, sendResponse);
      return true;
      
    case 'getTrackedJobs':
      getTrackedJobs(sendResponse);
      return true;
      
    case 'clearData':
      clearAllData(sendResponse);
      return true;
      
    case 'commentEditorFound':
      console.log("Comment editor found:", message.details);
      sendResponse({ success: true });
      return false;
  }
});

async function handleJobTracking(jobData, sendResponse) {
  try {
    const result = await chrome.storage.local.get('trackedJobs');
    const trackedJobs = result.trackedJobs || [];
    const isDuplicate = trackedJobs.some(job => job.link === jobData.link);
    
    if (isDuplicate) {
      sendResponse({ 
        success: false, 
        message: "This job is already being tracked",
        isDuplicate: true
      });
      return;
    }
    
    const newJob = {
      ...jobData,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      status: "Applied"
    };
    
    trackedJobs.push(newJob);
    
    await chrome.storage.local.set({ trackedJobs });
    
    sendResponse({ 
      success: true, 
      message: "Job tracked successfully", 
      jobCount: trackedJobs.length 
    });
    
  } catch (error) {
    console.error("Error storing job data:", error);
    sendResponse({ 
      success: false, 
      message: "Error tracking job: " + error.message 
    });
  }
}

async function getTrackedJobs(sendResponse) {
  try {
    const result = await chrome.storage.local.get('trackedJobs');
    const trackedJobs = result.trackedJobs || [];
    sendResponse({ 
      success: true, 
      jobs: trackedJobs 
    });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    sendResponse({ 
      success: false, 
      message: "Error retrieving jobs: " + error.message 
    });
  }
}

async function clearAllData(sendResponse) {
  try {
    await chrome.storage.local.remove('trackedJobs');
    sendResponse({ 
      success: true, 
      message: "All job data cleared" 
    });
  } catch (error) {
    console.error("Error clearing data:", error);
    sendResponse({ 
      success: false, 
      message: "Error clearing data: " + error.message 
    });
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("LinkedIn Job Tracker extension installed/updated");
});
