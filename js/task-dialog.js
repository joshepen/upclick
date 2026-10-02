'use strict'

var taskDlg = $('#taskDialog')
var draft = null

function wouldCycle(candidateId, selfId) {
  var seen = {},
    cur = candidateId
  while (cur && !seen[cur]) {
    if (cur === selfId) return true
    seen[cur] = 1
    var t = taskById(cur)
    if (!t) return false
    var st = statusById(t.statusId)
    if (!isTaskLink(st)) return false
    cur = t.statusRef
  }
  return false
}
function eligibleLinks() {
  var self = draft.id
  return state.tasks.filter(function (t) {
    return t.id !== self && !(self && wouldCycle(t.id, self))
  })
}

function openTask(id, opts) {
  opts = opts || {}
  var t = id ? taskById(id) : null
  if (id && !t) return
  if (t) {
    draft = {
      id: t.id,
      statusId: t.statusId,
      statusRef: t.statusRef || '',
      statusText: t.statusText || '',
      tags: t.tags.slice(),
    }
  } else {
    draft = {
      id: null,
      statusId: defaultNewStatus().id,
      statusRef: '',
      statusText: '',
      tags: ui.tag !== 'all' ? [ui.tag] : [],
    }
  }
  if (opts.statusId) draft.statusId = opts.statusId
  $('#taskDialogTitle').textContent = t ? 'Edit task' : 'New task'
  $('#fDesc').value = t ? t.description : opts.description || ''
  $('#fDeadline').value = t ? t.deadline : ''
  fillStatusSelect()
  renderTagPicker()
  updateLinkField()
  $('#fCreated').textContent = t ? 'Created ' + fmtFull(t.created) : ''
  $('#fCreated').hidden = !t
  $('#fDelete').hidden = !t
  $('#fNewTag').value = ''
  hideError()
  if (!taskDlg.open) taskDlg.showModal()
  requestAnimationFrame(function () {
    var target = $('#fDesc')
    if (opts.focusLink) {
      if (!$('#fTextWrap').hidden) target = $('#fText')
      else if (!$('#fLinkWrap').hidden && !$('#fLink').disabled) target = $('#fLink')
    }
    target.focus()
  })
}

function fillStatusSelect() {
  var sel = $('#fStatus')
  sel.replaceChildren.apply(
    sel,
    state.statuses.map(function (s) {
      return el('option', { value: s.id, text: s.name })
    }),
  )
  sel.value = draft.statusId
}
function updateLinkField() {
  var st = statusById(draft.statusId)
  var wrap = $('#fLinkWrap'),
    tw = $('#fTextWrap')
  wrap.hidden = true
  tw.hidden = true
  if (!st || !st.requiresLink) return
  if (st.linkKind === 'text') {
    tw.hidden = false
    $('#fTextLabel').textContent = st.linkLabel || 'Reference'
    $('#fText').value = draft.statusText
    return
  }
  wrap.hidden = false
  $('#fLinkLabel').textContent = st.linkLabel || 'Linked task'
  var sel = $('#fLink')
  var opts = eligibleLinks()
  function optFor(t, fin) {
    return el('option', {
      value: t.id,
      text: short(t.description, 70) + (fin ? ' (finished)' : ''),
    })
  }
  var nodes = [
    el('option', { value: '', text: opts.length ? 'Choose a task…' : 'No other tasks yet' }),
  ]
  opts
    .filter(function (t) {
      return !isFinished(t)
    })
    .forEach(function (t) {
      nodes.push(optFor(t, false))
    })
  // opts.filter(isFinished).forEach(function (t) { nodes.push(optFor(t, true)); });
  sel.replaceChildren.apply(sel, nodes)
  if (
    !opts.some(function (t) {
      return t.id === draft.statusRef
    })
  )
    draft.statusRef = ''
  sel.value = draft.statusRef
  sel.disabled = !opts.length
  $('#fLinkHint').textContent = opts.length
    ? ''
    : 'Create another task first, then come back to link it.'
}
function renderTagPicker() {
  var box = $('#fTags')
  if (!state.tags.length) {
    box.replaceChildren(el('span', { class: 'hint', text: 'No tags yet. Create one below.' }))
    return
  }
  box.replaceChildren.apply(
    box,
    state.tags.map(function (g) {
      return el(
        'button',
        {
          type: 'button',
          class: 'tagbtn',
          'data-id': g.id,
          style: '--c:' + g.color,
          'aria-pressed': String(draft.tags.indexOf(g.id) >= 0),
          onclick: function () {
            var i = draft.tags.indexOf(g.id)
            if (i >= 0) draft.tags.splice(i, 1)
            else draft.tags.push(g.id)
            renderTagPicker()
            var b = box.querySelector('[data-id="' + g.id + '"]')
            if (b) b.focus()
          },
        },
        el('span', { class: 'dot', style: '--c:' + g.color }),
        g.name,
      )
    }),
  )
}
function showError(msg) {
  var e = $('#fError')
  e.textContent = msg
  e.hidden = false
}
function hideError() {
  $('#fError').hidden = true
}

$('#fStatus').addEventListener('change', function (e) {
  draft.statusId = e.target.value
  hideError()
  updateLinkField()
})
$('#fLink').addEventListener('change', function (e) {
  draft.statusRef = e.target.value
  hideError()
})
$('#fText').addEventListener('input', function (e) {
  draft.statusText = e.target.value
  hideError()
})

function createTag(name) {
  name = name.trim()
  if (!name) return null
  if (nameTaken(state.tags, name)) {
    toast('The tag “' + name + '” already exists.')
    return null
  }
  var g = { id: uid(), name: name, color: nextColor(state.tags) }
  state.tags.push(g)
  save()
  return g
}
function addTagFromTaskDialog() {
  var input = $('#fNewTag')
  var g = createTag(input.value)
  if (!g) {
    input.focus()
    return
  }
  draft.tags.push(g.id)
  input.value = ''
  renderTagPicker()
  renderSide()
  input.focus()
}
$('#fAddTag').addEventListener('click', addTagFromTaskDialog)
$('#fNewTag').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTagFromTaskDialog()
  }
})

function saveTask() {
  var desc = $('#fDesc').value.trim()
  if (!desc) {
    showError('Add a description so you can recognize this task later.')
    $('#fDesc').focus()
    return
  }
  var st = statusById(draft.statusId)
  var isText = isTextLink(st)
  if (isTaskLink(st) && !draft.statusRef) {
    showError(
      'Choose a task for “' + (st.linkLabel || 'Linked task') + '”, or pick a different status.',
    )
    $('#fLink').focus()
    return
  }
  if (isText && !draft.statusText.trim()) {
    showError(
      'Enter a name or note for “' +
        (st.linkLabel || 'Reference') +
        '”, or pick a different status.',
    )
    $('#fText').focus()
    return
  }
  var deadline = $('#fDeadline').value
  console.log('AAA', deadline)
  var ref = isTaskLink(st) ? draft.statusRef : null
  var refText = isText ? draft.statusText.trim() : ''
  if (draft.id) {
    var t = taskById(draft.id)
    var prevId = t.statusId,
      prevFin = isFinished(t)
    t.description = desc
    t.deadline = deadline
    t.statusId = st.id
    t.statusRef = ref
    t.statusText = refText
    t.tags = draft.tags.slice()
    t.doneFrom = st.finished ? (prevFin ? t.doneFrom : prevId) : null
    save()
    renderAll()
    toast('Task saved')
  } else {
    addTask({
      description: desc,
      deadline: deadline,
      statusId: st.id,
      statusRef: ref,
      statusText: refText,
      tags: draft.tags.slice(),
    })
    toast('Task added')
  }
  taskDlg.close()
}
$('#fSave').addEventListener('click', saveTask)
$('#fDesc').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    saveTask()
  }
})

$('#fDelete').addEventListener('click', function () {
  var t = taskById(draft.id)
  if (!t) return
  var n = state.tasks.filter(function (x) {
    return x.statusRef === t.id
  }).length
  var body =
    '“' +
    short(t.description, 60) +
    '” will be removed for good.' +
    (n
      ? ' ' +
        n +
        (n === 1 ? ' other task points' : ' other tasks point') +
        ' to it and will need a new link.'
      : '')
  confirmBox({ title: 'Delete this task?', body: body, confirm: 'Delete task' }).then(
    function (ok) {
      if (!ok) return
      deleteTask(t.id)
      taskDlg.close()
      toast('Task deleted')
    },
  )
})
