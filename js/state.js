'use strict'

var state, ui
var storageOk = true
var search = ''
var justDone = null,
  justAdded = null

function defaultState() {
  return {
    v: 1,
    statuses: [
      {
        id: uid(),
        name: 'To do',
        color: '#6B7BA8',
        requiresLink: false,
        linkLabel: '',
        finished: false,
      },
      {
        id: uid(),
        name: 'In progress',
        color: '#3346F0',
        requiresLink: false,
        linkLabel: '',
        finished: false,
      },
      {
        id: uid(),
        name: 'Waiting',
        color: '#D98A00',
        requiresLink: true,
        linkLabel: 'Waiting on',
        finished: false,
      },
      {
        id: uid(),
        name: 'Done',
        color: '#1F8A5B',
        requiresLink: false,
        linkLabel: '',
        finished: true,
      },
    ],
    tags: [],
    tasks: [],
    ui: { status: 'all', tag: 'all', sort: 'deadline', showFinished: true },
  }
}

function normalize(d) {
  var base = defaultState()
  if (!d || typeof d !== 'object') return base
  var statuses = (Array.isArray(d.statuses) ? d.statuses : [])
    .filter(function (x) {
      return x && x.id && x.name
    })
    .map(function (x) {
      return {
        id: String(x.id),
        name: String(x.name),
        color: HEX.test(x.color) ? x.color : '#6B7BA8',
        requiresLink: !!x.requiresLink,
        linkKind: x.linkKind === 'text' ? 'text' : 'task',
        linkLabel: String(x.linkLabel || ''),
        finished: !!x.finished,
      }
    })
  if (!statuses.length) statuses = base.statuses
  var tags = (Array.isArray(d.tags) ? d.tags : [])
    .filter(function (x) {
      return x && x.id && x.name
    })
    .map(function (x) {
      return {
        id: String(x.id),
        name: String(x.name),
        color: HEX.test(x.color) ? x.color : '#6B7BA8',
      }
    })
  var tasks = (Array.isArray(d.tasks) ? d.tasks : [])
    .filter(function (x) {
      return x && x.id
    })
    .map(function (x) {
      return {
        id: String(x.id),
        description: String(x.description || ''),
        created: typeof x.created === 'string' ? x.created : new Date().toISOString(),
        deadline: /^\d{4}-\d{2}-\d{2}$/.test(x.deadline || '') ? x.deadline : '',
        statusId: x.statusId,
        statusRef: x.statusRef || null,
        statusText: String(x.statusText || '').slice(0, 200),
        tags: Array.isArray(x.tags) ? x.tags : [],
        doneFrom: x.doneFrom || null,
      }
    })
  var sid = {},
    tid = {},
    kid = {}
  statuses.forEach(function (s) {
    sid[s.id] = 1
  })
  tags.forEach(function (g) {
    tid[g.id] = 1
  })
  tasks.forEach(function (t) {
    kid[t.id] = 1
  })
  tasks.forEach(function (t) {
    if (!sid[t.statusId]) t.statusId = statuses[0].id
    t.tags = t.tags.filter(function (x) {
      return tid[x]
    })
    if (t.statusRef && (!kid[t.statusRef] || t.statusRef === t.id)) t.statusRef = null
  })
  var u = Object.assign({}, base.ui, d.ui || {})
  if (u.status !== 'all' && !sid[u.status]) u.status = 'all'
  if (u.tag !== 'all' && !tid[u.tag]) u.tag = 'all'
  if (SORTS.indexOf(u.sort) < 0) u.sort = 'deadline'
  u.showFinished = u.showFinished !== false
  return { v: 1, statuses: statuses, tags: tags, tasks: tasks, ui: u }
}

function load() {
  try {
    var raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    return normalize(JSON.parse(raw))
  } catch (e) {
    return defaultState()
  }
}
function setState(s) {
  state = s
  ui = s.ui
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    storageOk = true
  } catch (e) {
    if (storageOk) {
      storageOk = false
      toast('This browser blocked saving, so your changes will be lost when you close the page.')
    }
  }
}

function statusById(id) {
  return state.statuses.find(function (s) {
    return s.id === id
  })
}
function tagById(id) {
  return state.tags.find(function (g) {
    return g.id === id
  })
}
function taskById(id) {
  return state.tasks.find(function (t) {
    return t.id === id
  })
}
function isFinished(t) {
  var s = statusById(t.statusId)
  return !!(s && s.finished)
}
function isTaskLink(st) {
  return !!(st && st.requiresLink && st.linkKind !== 'text')
}
function isTextLink(st) {
  return !!(st && st.requiresLink && st.linkKind === 'text')
}
function defaultLabel(kind) {
  return kind === 'text' ? 'Reference' : 'Linked to'
}
function clearRefs(t) {
  t.statusRef = null
  t.statusText = ''
}
function nextColor(list) {
  var used = list.map(function (x) {
    return x.color.toUpperCase()
  })
  var free = PALETTE.find(function (c) {
    return used.indexOf(c) < 0
  })
  return free || PALETTE[list.length % PALETTE.length]
}
function nameTaken(list, name, except) {
  return list.some(function (x) {
    return x !== except && x.name.toLowerCase() === name.toLowerCase()
  })
}
function defaultNewStatus() {
  var f = ui.status !== 'all' ? statusById(ui.status) : null
  if (f && !f.requiresLink) return f
  return (
    state.statuses.find(function (s) {
      return !s.requiresLink && !s.finished
    }) ||
    state.statuses.find(function (s) {
      return !s.requiresLink
    }) ||
    state.statuses[0]
  )
}
