const listRes = all => {
	document.querySelector("#hdr b").innerText = all.length

	var lst = document.querySelector("#lst")
    var q
	while (q = lst.lastChild) lst.removeChild(q)

	for (let rs of all) {
		lst.appendChild(makeLine(rs.href, rs.nm))
	}
}

const makeLine = (href, text) => {
	var ln = document.createElement("div")
	ln.classList.add(RSNM_CN)
	ln.appendChild(makeButton(href, h => {}))
	var tx = document.createElement("span")
	tx.addEventListener("click", e => browser.tabs.create({
		active: false, url: href
	}))
	tx.innerText = text
	ln.appendChild(tx)
	return ln
}

const makeButton = href => {
	var b = document.createElement("a")
	b.classList.add(BUTN_CN)
	b.addEventListener("click", e => {
		e.preventDefault()
		e.stopPropagation()
		unblock(href)
		return false
	})
	return b
}

const broadcast = msg =>
	browser.tabs.query({}).then(t => {for (let tab of t)
		{browser.tabs.sendMessage(tab.id, msg).then(i => refresh())}})

const unblock = href => broadcast({event: MSG_UNBLOCK, path: href})
const unblockAll = () => broadcast({event: MSG_UNBLOCK_ALL})

document.getElementById("reset").addEventListener("click", e => unblockAll())

const refresh = () => browser.storage.local.get().then(i => listRes(i.rmd))
refresh()