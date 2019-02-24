// event names
const MSG_REQUEST_FILT = "reqfl"
const MSG_REQUEST_CONF = "reqcf"
const MSG_UNBLOCK_ALL  = "uball"
const MSG_UNBLOCK      = "unblk"
const MSG_UPDATE       = "updbg"
const MSG_CONFIG       = "confg"
const MSG_BLOCK        = "block"

// make 'x' button
const makeButton = callback => {
	var b = document.createElement("a")
	b.classList.add("rmkebab-btn")
	b.addEventListener("click", e => {
		e.preventDefault()
		e.stopPropagation()
		callback()
		return false
	})
	return b
}

const AMO_URL = "https://addons.mozilla.org/en-US/firefox/addon/remove-kebab"
const HOMEPAGE_URL = "https://github.com/kubuzetto/rmkebab"
