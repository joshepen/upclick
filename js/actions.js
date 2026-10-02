'use strict'

function addTask(f) {
  var t = {
    id: uid(),
    description: f.description.trim(),
    created: new Date().toISOString(),
    deadline: f.deadline || '',
    statusId: f.statusId,
    statusRef: f.statusRef || null,
    statusText: f.statusText || '',
    tags: f.tags || [],
    doneFrom: null,
  }
  state.tasks.push(t)
  justAdded = t.id
  save()
  renderAll()
  return t
}

function toggleDone(id) {
  var t = taskById(id)
  if (!t) return
  if (isFinished(t)) {
    var back = statusById(t.doneFrom)
    var target =
      back && !back.finished && !back.requiresLink
        ? back
        : state.statuses.find(function (s) {
            return !s.finished && !s.requiresLink
          }) ||
          state.statuses.find(function (s) {
            return !s.finished
          })
    if (!target) {
      toast('Add a status that isn’t marked finished so this task can be reopened.')
      return
    }
    t.statusId = target.id
    t.doneFrom = null
    if (!target.requiresLink) clearRefs(t)
  } else {
    var fin = state.statuses.find(function (s) {
      return s.finished
    })
    if (!fin) {
      toast('Turn on “Counts as finished” for a status in Manage statuses to finish tasks.')
      return
    }
    t.doneFrom = t.statusId
    t.statusId = fin.id
    t.deadline = new Date().toLocaleDateString('en-CA')
    clearRefs(t)
    justDone = id
  }
  save()
  renderAll()
}

function changeStatus(id, statusId) {
  var t = taskById(id),
    st = statusById(statusId)
  if (!t || !st || t.statusId === statusId) return
  if (st.requiresLink) {
    openTask(id, { statusId: statusId, focusLink: true })
    return
  }
  var prev = t.statusId,
    prevFin = isFinished(t)
  t.statusId = statusId
  clearRefs(t)
  t.doneFrom = st.finished && !prevFin ? prev : st.finished ? t.doneFrom : null
  save()
  renderAll()
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(function (t) {
    return t.id !== id
  })
  state.tasks.forEach(function (t) {
    if (t.statusRef === id) t.statusRef = null
  })
  save()
  renderAll()
}
