'use strict'

$('#newTask').addEventListener('click', function () {
  openTask(null)
})
$('#manageStatuses').addEventListener('click', function () {
  openManage('statuses')
})
$('#manageTags').addEventListener('click', function () {
  openManage('tags')
})
$('#search').addEventListener('input', function (e) {
  search = e.target.value
  renderMain()
})
$('#sort').addEventListener('change', function (e) {
  ui.sort = e.target.value
  ui.tempSort = e.target.value
  save()
  renderMain()
})
$('#showFinished').addEventListener('change', function (e) {
  ui.showFinished = e.target.checked
  save()
  renderMain()
})

$('#resetBtn').addEventListener('click', function () {
  confirmBox({
    title: 'Reset UpClick?',
    body: 'This deletes every task, status and tag saved in this browser and starts from scratch. It can’t be undone.',
    confirm: 'Reset everything',
  }).then(function (ok) {
    if (!ok) return
    try {
      localStorage.removeItem(KEY)
    } catch (e) {
      /* storage unavailable */
    }
    setState(defaultState())
    search = ''
    $('#search').value = ''
    save()
    renderAll()
    toast('UpClick was reset.')
  })
})

$('#cOk').addEventListener('click', function () {
  $('#confirmDialog').close('ok')
})
$('#cCancel').addEventListener('click', function () {
  $('#confirmDialog').close('cancel')
})
document.addEventListener('click', function (e) {
  var b = e.target.closest('[data-close]')
  if (b) {
    var d = b.closest('dialog')
    if (d) d.close()
  }
})
;[taskDlg, mDlg].forEach(function (d) {
  d.addEventListener('click', function (e) {
    if (e.target === d) d.close()
  })
})
mDlg.addEventListener('close', function () {
  renderAll()
})

window.addEventListener('storage', function (e) {
  if (e.key !== KEY && e.key !== null) return
  setState(load())
  renderAll()
  if (mDlg.open) renderManage()
})

/* ================= start ================= */
setState(load())
renderAll()
