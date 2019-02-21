const setBadgeText = n => {
	if (n == 0) {
		browser.browserAction.setBadgeText({text: ""})
		browser.browserAction.disable()
	} else {
		browser.browserAction.enable()
		browser.browserAction.setBadgeText({text: "" + n})
	}
}

const refresh = url => {
	browser.storage.local.get()
		.then(i => setBadgeText(i.rmd.length))
}

const hdl = (msg, snd) => {
	switch (msg.event) {
		case MSG_REFRESH:
			refresh(snd.url)
			break
	}
}
refresh(null)

browser.runtime.onMessage.addListener(hdl)
