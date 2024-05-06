let originalBadgeColor = '';

function updateBadge(price) {
    chrome.action.setBadgeText({ text: price.toString() });

    if (originalBadgeColor === '') {
        chrome.action.getBadgeBackgroundColor({}, result => {
            originalBadgeColor = result;
        });
    }

    chrome.action.setBadgeBackgroundColor({ color: [255, 215, 0, 255] });

    
    setTimeout(() => {
        chrome.action.setBadgeBackgroundColor({ color: originalBadgeColor });
    }, 1000); // (1 second)
}

function fetchevernodePrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=evernode&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            const evernodePrice = parseFloat(data.evernode.usd);
            const formattedPrice = `${evernodePrice.toFixed(3)}`;
            updateBadge(formattedPrice);
        })
        .catch(error => {
            console.error('Error fetching XRP price:', error);
            updateBadge('Error');
        });
}

chrome.runtime.onInstalled.addListener(() => {
    fetchevernodePrice();
});

chrome.runtime.onStartup.addListener(() => {
    fetchevernodePrice();
});

chrome.action.onClicked.addListener(() => {
    fetchevernodePrice();
});

chrome.idle.onStateChanged.addListener(state => {
    if (state === 'active') {
        fetchevernodePrice();
    }
});

setInterval(fetchevernodePrice, 300000); //5 Minutes