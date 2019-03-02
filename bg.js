var cfg = {rmd: []}

// helper for badge text
const setBadgeText = (n, tab) => browser.browserAction.
	setBadgeText({tabId: tab.id, text: ((n > 0) ? ("" + n) : "")})

// outgoing messages
// to tabs
const broadcastConf = conf => browser.tabs.query({}).then(tabs =>
	{for(let tab of tabs) sendConfigTo(tab, conf)})
const sendConfigTo = (tab, conf) => browser.tabs.sendMessage(tab.id,
	{event: MSG_CONFIG, config: cfg}).catch(e => {})

// incoming messages
const handler = (msg, snd) => {
	let resp = {}
	switch (msg.event) {
		// from tabs
		case MSG_UPDATE:
			setBadgeText(msg.filtered.length, snd.tab)
			break

		// from tabs
		case MSG_REQUEST_CONF:
			resp = cfg
			break

		// from popup/main
		case MSG_BLOCK:
			cfg.rmd.push({href: msg.href, nm: msg.nm})
			browser.storage.local.set(cfg)
			broadcastConf(cfg)
			break

		// from main
		case MSG_UNBLOCK_ALL:
			cfg.rmd = []
			browser.storage.local.set(cfg)
			broadcastConf(cfg)
			break

		// from popup
		case MSG_UNBLOCK:
			cfg.rmd = cfg.rmd.filter(x => x.href !== msg.href)
			browser.storage.local.set(cfg)
			broadcastConf(cfg)
			break
	}
	return Promise.resolve(resp)
}

// initialize
browser.storage.local.get().then(v => {
	if (v && v.rmd) cfg.rmd = v.rmd
	broadcastConf(cfg)
}, e => broadcastConf(cfg))
browser.runtime.onMessage.addListener(handler)
