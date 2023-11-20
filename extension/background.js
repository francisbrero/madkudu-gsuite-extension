// Function to retrieve the stored API key
function getApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['apiKey'], function(result) {
            if (chrome.runtime.lastError) {
                reject(new Error('Error retrieving the API key'));
            } else {
                resolve(result.apiKey);
            }
        });
    });
}

// Function to make an API call for a given email
async function callApiForEmail(email, apiKey) {
    const apiUrl = `https://app.madkudu.com/api/v1/org/3327/persons?email=${encodeURIComponent(email)}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.type === 'emailsFound') {
        try {
            const apiKey = await getApiKey();
            const results = await Promise.all(request.data.map(email => callApiForEmail(email, apiKey)));
            // Handle the results as needed
            console.log('API call results:', results);
            sendResponse({ status: 'success', data: results });
        } catch (error) {
            console.error('Error processing emails:', error);
            sendResponse({ status: 'error', message: error.message });
        }
    }
    return true; // Indicate that we will respond asynchronously
});

// Function to initialize the background script
function initialize() {
    console.log('Background script initialized');
}

initialize();

// When sending response back to content script
sendResponse({ status: 'success', data: results });

