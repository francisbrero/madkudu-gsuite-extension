// Function to extract email addresses from the webpage
function extractEmails(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    let emails = text.match(emailRegex);
    return emails ? Array.from(new Set(emails)) : []; // Removes duplicates
}

// Function to send emails to the background script or another handler
function sendEmails(emails) {
    if (emails.length > 0) {
        chrome.runtime.sendMessage({ type: 'emailsFound', data: emails }, function(response) {
            console.log('Response from background:', response);
        });
    }
}

// Main function to extract and send emails
function main() {
    console.log('Content script loaded');
    const bodyText = document.body.innerText; // Gets the text content of the body
    const emails = extractEmails(bodyText); // Extract emails from the text content
    console.log('Emails found:', emails);
    sendEmails(emails); // Send the emails for further processing
    createSidebar(); // Create the sidebar
}

// Function to create the sidebar
function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'myExtensionSidebar';
    sidebar.style.cssText = 'position: fixed; top: 0; right: 0; width: 300px; height: 100%; background: white; z-index: 1000; overflow-y: auto; border-left: 1px solid #ccc;';
    document.body.appendChild(sidebar);
}

// Function to update the sidebar with emails and their corresponding data
function updateSidebar(emailsData) {
    const sidebar = document.getElementById('myExtensionSidebar');
    emailsData.forEach(emailData => {
        const section = document.createElement('div');
        const header = document.createElement('div');
        const content = document.createElement('pre');

        header.textContent = emailData.email;
        header.style.cssText = 'padding: 10px; background: #f0f0f0; border-bottom: 1px solid #ddd; cursor: pointer;';
        content.style.cssText = 'display: none; padding: 10px;';

        content.textContent = JSON.stringify(emailData.data, null, 2);

        header.addEventListener('click', function() {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        section.appendChild(header);
        section.appendChild(content);
        sidebar.appendChild(section);
    });
}


// Run the main function when the content script is loaded
main();

// Run the main function when a click is performed
document.addEventListener('click', main);

// Add listener for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'apiResults') {
        const emailsData = request.data.map((result, index) => ({ email: emails[index], data: result }));
        updateSidebar(emailsData);
    }
});
