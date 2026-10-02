'use strict'

function pad(n) {
  return String(n).padStart(2, '0')
}
function todayStr() {
  var d = new Date()
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}
function dayNum(str) {
  var p = str.split('-').map(Number)
  return Math.round(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000)
}
function fmtDay(str) {
  var p = str.split('-').map(Number)
  var opts = { month: 'short', day: 'numeric' }
  if (p[0] !== new Date().getFullYear()) opts.year = 'numeric'
  return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(undefined, opts)
}
function fmtCreated(iso) {
  var d = new Date(iso)
  var opts = { month: 'short', day: 'numeric' }
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString(undefined, opts)
}
function fmtFull(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
function relDeadline(str) {
  var diff = dayNum(str) - dayNum(todayStr())
  if (diff < 0)
    return { text: diff === -1 ? '1 day overdue' : -diff + ' days overdue', overdue: true }
  if (diff === 0) return { text: 'Due today', overdue: false }
  if (diff === 1) return { text: 'Due tomorrow', overdue: false }
  if (diff <= 7) return { text: 'In ' + diff + ' days', overdue: false }
  return { text: '', overdue: false }
}
