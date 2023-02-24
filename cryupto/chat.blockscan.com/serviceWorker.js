const blockscanChat = "blockscan-chat"
const assets = [
    "/",
    "/assets/css/theme.css",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(blockscanChat).then(cache => {
            /*cache.addAll(assets)*/
        })
    )
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
});

self.addEventListener('push', function (e) {
    let options = {
        body: 'From ' + truncatemiddle(e.data.text(),16),
        icon: '/assets/img/icons/icon-48-48.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'Open', title: 'Open',
            },
            {
                action: 'close', title: 'Close',
            },
        ]
    };
    e.waitUntil(
        self.registration.showNotification('New Message', options)
    );
});

function truncatemiddle(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;
    separator = separator || '...';
    let sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars + 1) +
        separator +
        fullStr.substr(fullStr.length - backChars);
}

self.addEventListener('notificationclick', function (event) {
    //For root applications: just change "'./'" to "'/'"
    //Very important having the last forward slash on "new URL('./', location)..."
    const rootUrl = new URL('./', location).href;
    event.notification.close();
    event.waitUntil(
        clients.matchAll().then(matchedClients => {
            for (let client of matchedClients) {
                if (client.url.indexOf(rootUrl) >= 0) {
                    return client.focus();
                }
            }
            return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
        })
    );
});