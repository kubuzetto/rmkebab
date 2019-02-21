(() => {
	"use strict"
	if (window.kebabRemoved) return
	window.kebabRemoved = true

	var cfg = {rmd: []}

	// make button
	const makeButton = (ln, fn) => {
		var b = document.createElement("a")
		b.setAttribute("relHref", ln.href)
		b.setAttribute("relNm", ln.textContent.trim())
		b.classList.add(BUTN_CN)
		b.addEventListener("click", e => {
			e.preventDefault()
			e.stopPropagation()
			fn(e.target.getAttribute("relHref"),
			   e.target.getAttribute("relNm"))
			return false
		})
		return b
	}

	const hasch = (rt, cn) => {
		var b = rt.getElementsByClassName(cn)
		if (b && b.length > 0) return b[0]
		return null
	}
	
	const haslink = href => {
		let l = cfg.rmd.filter(x => x.href === href)
		if (l && l.length > 0) return l
		return null
	}

	const applyFilter = nd => {
		let its = nd.getElementsByClassName(ITEM_CN)
		if (!its || its.length == 0) return
		
		let filtered = []
		for (let it of its) {
			let hd = hasch(it, HEAD_CN)
			if (hd) {
				let ln = hasch(hd, RESN_CN)
				if (ln) {
					if (!hasch(hd, BUTN_CN))
						hd.prepend(makeButton(ln, block))
					let entry = haslink(ln.href)
					if (entry) {
						it.classList.add(REMD_CN)
						filtered.push(entry)
					} else while (it.classList.contains(REMD_CN))
						it.classList.remove(REMD_CN)
				}
			}
		}
		browser.runtime.sendMessage({
			event: MSG_REFRESH,
			filtered: filtered,
			all: cfg.rmd
		})
	}

	const block = (href, nm) => {
		handler({event: MSG_BLOCK, path: href, name: nm})
	}

	const mutate = (trg = document.body) => {
		handler({event: MSG_MUTATION, target: trg})
	}

	// message handler
	const handler = msg => {
		switch (msg.event) {
			case MSG_MUTATION:
				applyFilter(msg.target)
				break

			case MSG_UNBLOCK_ALL:
				cfg.rmd = []
				browser.storage.local.set(cfg)
				mutate()
				break

			case MSG_UNBLOCK:
				cfg.rmd = cfg.rmd.filter(x => x.href !== msg.path)
				browser.storage.local.set(cfg)
				mutate()
				break

			case MSG_BLOCK:
				cfg.rmd.push({href: msg.path, nm: msg.name})
				browser.storage.local.set(cfg)
				mutate()
				break
		}
	}

	// initialize
	browser.storage.local.get().then(c => {
		if (c && c.rmd) cfg.rmd = c.rmd
		browser.runtime.onMessage.addListener(handler)
		var reslists = document.getElementsByClassName(RSLS_CN);
		if (reslists) {
			let mo = new MutationObserver(ms =>
				{ms.forEach(m => mutate(m.target))})
			let mocfg = {subtree: true, childList: true}
			for (let reslist of reslists) mo.observe(reslist, mocfg)
		}
		mutate()
	})
})()
