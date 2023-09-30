document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.jobDetails) {
            const jobDetailsElement = document.getElementById('job-details');
            jobDetailsElement.textContent = message.jobDetails;

            console.log("Step 7: Job details displayed in the popup");
        }
    });

    const viewFrequenciesButton = document.getElementById('view-frequencies-button');
    viewFrequenciesButton.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('chart.html') });
    });

    const clearDataButton = document.getElementById('clear-data-button');
    clearDataButton.addEventListener('click', () => {
        // Send a request to your Node.js server to clear the data
        fetch('http://localhost:8000/clear-data', {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data cleared successfully:", data);
            })
            .catch(error => {
                console.error("Error clearing data:", error);
            });
    });
});
