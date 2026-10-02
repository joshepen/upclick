'use strict'

var menu = $('#statusMenu'),
  menuAnchor = null
function openStatusMenu(taskId, anchor) {
  var t = taskById(taskId)
  if (!t) return
  closeMenu()
  menu.replaceChildren.apply(
    menu,
    state.statuses.map(function (s) {
      return el(
        'button',
        {
          type: 'button',
          role: 'menuitemradio',
          'aria-checked': String(s.id === t.statusId),
          onclick: function () {
            closeMenu()
            changeStatus(taskId, s.id)
          },
        },
        el('span', { class: 'dot', style: '--c:' + s.color }),
        el('span', { text: s.name }),
        s.requiresLink ? el('span', { class: 'note', text: 'links a task' }) : null,
      )
    }),
  )
  menu.hidden = false
  var r = anchor.getBoundingClientRect()
  var mh = menu.offsetHeight,
    mw = menu.offsetWidth
  var top = r.bottom + 6
  if (top + mh > window.innerHeight - 8) top = Math.max(8, r.top - mh - 6)
  menu.style.top = top + 'px'
  menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - mw - 8)) + 'px'
  menuAnchor = anchor
  anchor.setAttribute('aria-expanded', 'true')
  ;(menu.querySelector('[aria-checked="true"]') || menu.firstChild).focus()
}
function closeMenu() {
  if (menu.hidden) return
  menu.hidden = true
  if (menuAnchor) menuAnchor.setAttribute('aria-expanded', 'false')
}
menu.addEventListener('keydown', function (e) {
  var items = Array.prototype.slice.call(menu.querySelectorAll('button'))
  var i = items.indexOf(document.activeElement)
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    items[(i + 1) % items.length].focus()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    items[(i - 1 + items.length) % items.length].focus()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    var a = menuAnchor
    closeMenu()
    if (a) a.focus()
  } else if (e.key === 'Tab') {
    closeMenu()
  }
})
document.addEventListener('click', function (e) {
  if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('.pill')) closeMenu()
})
window.addEventListener('resize', closeMenu)
window.addEventListener('scroll', closeMenu, true)
