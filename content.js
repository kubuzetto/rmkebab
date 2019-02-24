(() => {
	"use strict"
	if (window.kebabRemoved) return
	window.kebabRemoved = true

	let filt = []

	// class names
	const RESN_CN = "restaurantName"
	const REMD_CN = "removedKebab"
	const RSLS_CN = "ys-reslist"
	const ITEM_CN = "ys-item"
	const HEAD_CN = "head"

	const hasch = (rt, cn) => {
		var b = rt.getElementsByClassName(cn)
		if (b && b.length > 0) return b[0]
		return null
	}

	const haslink = (conf, href) => {
		let l = conf.rmd.filter(x => x.href === href)
		if (l && l.length > 0) return l
		return null
	}

	const applyFilter = (conf, nd = document.body) => {
		let filtered = []
		let its = nd.getElementsByClassName(ITEM_CN)
		if (!its || its.length == 0) return filtered
		for (let it of its) {
			let hd = hasch(it, HEAD_CN)
			if (hd) {
				let ln = hasch(hd, RESN_CN)
				if (ln) {
					let link = ln.href
					let nm = ln.textContent.trim()
					if (!hasch(hd, "rmkebab-btn")) {
						let callback = () => block(link, nm)
						hd.prepend(makeButton(callback))
					}
					let entry = haslink(conf, ln.href)
					if (entry) {
						it.classList.add(REMD_CN)
						if (filtered.filter(x => x.href == link) == 0)
							filtered.push({href: link, nm: nm})
					} else while (it.classList.contains(REMD_CN))
						it.classList.remove(REMD_CN)
				}
			}
		}
		return filtered
	}

	const updateConfig = c => {
		if (c) {
			filt = applyFilter(c)
			sendCurrent(filt)
		} else requestConfig()
	}

	// outgoing messages
	// to bg
	const requestConfig = () => browser.runtime.sendMessage({event: MSG_REQUEST_CONF}).
		then(c => updateConfig(c), e => updateConfig(null))
	// to bg
	const block = (href, name) => browser.runtime.sendMessage(
		{event: MSG_BLOCK, href: href, nm: name})
	// to bg / popup
	const sendCurrent = filtered => browser.runtime.sendMessage({
		event: MSG_UPDATE, filtered: filtered})

	// incoming messages
	const handler = (msg, snd, sendResponse) => {
		switch (msg.event) {
			// from bg
			case MSG_CONFIG:
				updateConfig(msg.config)
				break
			// from popup
			case MSG_REQUEST_FILT:
				sendResponse(filt)
				break
		}
	}

	// initialize
	browser.runtime.onMessage.addListener(handler)
	var reslists = document.getElementsByClassName(RSLS_CN)
	if (reslists) {
		let mo = new MutationObserver(ms => {
			filt = [].concat.apply([], reslists.map(r => applyFilter(cfg, r)))
			sendCurrent(filt)
		})
		for (let reslist of reslists) mo.observe(reslist, {subtree: true, childList: true})
	}
	requestConfig()
})()
