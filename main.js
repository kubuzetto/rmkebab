const renderItems = items => {
    var q
	var lst = document.querySelector("#lst")
	while (q = lst.lastChild) lst.removeChild(q)
	if (items) for (let rs of items)
		lst.appendChild(renderItem(rs.href, rs.nm))
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

const update = () => browser.storage.local.get().then(f => renderItems(f.rmd), e => renderItems(null))

// outgoing messages
const unblock = href => browser.runtime.sendMessage({event: MSG_UNBLOCK, href: href}).then(update)
const unblockAll = href => browser.runtime.sendMessage({event: MSG_UNBLOCK_ALL}).then(update)

document.getElementById("unblockall").addEventListener("click", e => unblockAll())
update()
