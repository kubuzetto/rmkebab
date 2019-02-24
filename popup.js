const renderItems = items => {
    var q
	document.querySelector("#hdr b").innerText = items.length
	var lst = document.querySelector("#lst")
	while (q = lst.lastChild) lst.removeChild(q)
	if (items) for (let rs of items) lst.appendChild(renderItem(rs.href, rs.nm))
}

const renderItem = (href, text) => {
	var ln = document.createElement("div")
	ln.classList.add("restnm")
	let callback = () => unblock(href)
	ln.appendChild(makeButton(callback))
	var tx = document.createElement("span")
	tx.addEventListener("click", e => browser.tabs.create({active: false, url: href}))
	tx.innerText = text
	ln.appendChild(tx)
	return ln
}

const toLastTab = cb => browser.tabs.query({active: true, lastFocusedWindow: true}).
	then(tabs => {if (tabs && tabs.length == 1) cb(tabs[0])})

// outgoing messages
// to bg
const unblock = href => browser.runtime.sendMessage({event: MSG_UNBLOCK, href: href})
// to tab
const requestFiltered = toLastTab(tab =>
	browser.tabs.sendMessage(tab.id, {event: MSG_REQUEST_FILT}).then
		(f => renderItems(f), e => renderItems(null)))


// incoming messages
const handler = (msg, snd, sendResponse) => {
	switch (msg.event) {
		// from tabs
		case MSG_UPDATE:
			toLastTab(tab => {if (tab.id == snd.tab.id) renderItems(msg.filtered)})
			break
	}
}

// initialize
browser.runtime.onMessage.addListener(handler)
document.getElementById("refresh").addEventListener("click", e => requestFiltered())
document.getElementById("seeall").addEventListener("click", e =>
	browser.tabs.create({active: true, url: "/main.html"}))
document.getElementById("amo").addEventListener("click", e =>
	browser.tabs.create({active: true, url: AMO_URL}))
document.getElementById("homepage").addEventListener("click", e =>
	browser.tabs.create({active: true, url: HOMEPAGE_URL}))
requestFiltered()

