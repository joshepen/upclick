'use strict';

function renderAll() { renderSide(); renderMain(); }

function filterBtn(name, color, count, pressed, onclick) {
  return el('button', { type: 'button', class: 'filter', 'aria-pressed': String(pressed), onclick: onclick },
    el('span', { class: color ? 'dot' : 'dot all', style: color ? '--c:' + color : '' }),
    el('span', { class: 'nm', text: name }),
    el('span', { class: 'count', text: String(count) }));
}

function renderSide() {
  var sc = {}, tc = {};
  state.tasks.forEach(function (t) {
    sc[t.statusId] = (sc[t.statusId] || 0) + 1;
    t.tags.forEach(function (g) { tc[g] = (tc[g] || 0) + 1; });
  });
  var sItems = [filterBtn('All statuses', null, state.tasks.length, ui.status === 'all', function () { setFilter('status', 'all'); })];
  state.statuses.forEach(function (s) {
    sItems.push(filterBtn(s.name, s.color, sc[s.id] || 0, ui.status === s.id, function () { setFilter('status', ui.status === s.id ? 'all' : s.id); }));
  });
  $('#statusList').replaceChildren.apply($('#statusList'), sItems);

  var tItems = [];
  if (!state.tags.length) {
    tItems.push(el('p', { class: 'side-hint', text: 'No tags yet. Add one when you create a task, or choose Manage.' }));
  } else {
    tItems.push(filterBtn('All tags', null, state.tasks.length, ui.tag === 'all', function () { setFilter('tag', 'all'); }));
    state.tags.forEach(function (g) {
      tItems.push(filterBtn(g.name, g.color, tc[g.id] || 0, ui.tag === g.id, function () { setFilter('tag', ui.tag === g.id ? 'all' : g.id); }));
    });
  }
  $('#tagList').replaceChildren.apply($('#tagList'), tItems);
}

function setFilter(kind, val) { ui[kind] = val; save(); renderAll(); }

function cmpDeadline(a, b) {
  if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline) || a.created.localeCompare(b.created);
  if (a.deadline) return -1;
  if (b.deadline) return 1;
  return a.created.localeCompare(b.created);
}

function visibleTasks() {
  var q = search.trim().toLowerCase();
  var list = state.tasks.filter(function (t) {
    if (ui.status !== 'all' && t.statusId !== ui.status) return false;
    if (ui.tag !== 'all' && t.tags.indexOf(ui.tag) < 0) return false;
    if (ui.status === 'all' && !ui.showFinished && isFinished(t)) return false;
    if (q) {
      var hay = t.description.toLowerCase();
      t.tags.forEach(function (id) { var g = tagById(id); if (g) hay += ' ' + g.name.toLowerCase(); });
      hay += ' ' + (t.statusText || '').toLowerCase();
      var s = statusById(t.statusId); if (s) hay += ' ' + s.name.toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });
  function idx(t) { return state.statuses.findIndex(function (s) { return s.id === t.statusId; }); }
  switch (ui.sort) {
    case 'created-new': list.sort(function (a, b) { return b.created.localeCompare(a.created); }); break;
    case 'created-old': list.sort(function (a, b) { return a.created.localeCompare(b.created); }); break;
    case 'status': list.sort(function (a, b) { return idx(a) - idx(b) || cmpDeadline(a, b); }); break;
    case 'alpha': list.sort(function (a, b) { return a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }); }); break;
    default: list.sort(function (a, b) { return (isFinished(a) - isFinished(b)) || cmpDeadline(a, b); });
  }
  return list;
}

function linkChip(t, st) {
  if (!st || !st.requiresLink) return null;
  if (st.linkKind === 'text') {
    var tlabel = (st.linkLabel || 'Reference') + ':';
    if (!t.statusText) {
      return el('button', { type: 'button', class: 'linkchip missing', onclick: function () { openTask(t.id, { focusLink: true }); } },
        svg(ICON_PERSON), el('span', { class: 'lbl', text: tlabel }), el('span', { class: 'tx', text: 'add a name or note' }));
    }
    return el('button', { type: 'button', class: 'linkchip ref', title: 'Edit task', onclick: function () { openTask(t.id); } },
      svg(ICON_PERSON), el('span', { class: 'lbl', text: tlabel }), el('span', { class: 'tx', text: t.statusText }));
  }
  var label = (st.linkLabel || 'Linked to') + ':';
  var ref = t.statusRef ? taskById(t.statusRef) : null;
  if (!ref) {
    return el('button', { type: 'button', class: 'linkchip missing', onclick: function () { openTask(t.id, { focusLink: true }); } },
      svg(ICON_LINK), el('span', { class: 'lbl', text: label }),
      el('span', { class: 'tx', text: t.statusRef ? 'that task no longer exists' : 'choose a task' }));
  }
  var done = isFinished(ref);
  return el('button', { type: 'button', class: 'linkchip' + (done ? ' resolved' : ''), title: done ? 'That task is finished. Open it.' : 'Open linked task', onclick: function () { openTask(ref.id); } },
    svg(ICON_LINK), el('span', { class: 'lbl', text: label }), el('span', { class: 'tx', text: short(ref.description, 60) }),
    done ? el('span', { class: 'ok', text: 'finished' }) : null);
}

function taskRow(t) {
  var st = statusById(t.statusId);
  var fin = !!(st && st.finished);
  var check = el('button', {
    type: 'button', class: 'check' + (fin ? ' on' : '') + (justDone === t.id ? ' just' : ''),
    'aria-label': fin ? 'Reopen task' : 'Mark task finished', title: fin ? 'Reopen' : 'Mark finished',
    onclick: function () { toggleDone(t.id); }
  }, svg(ICON_CHECK));

  var tagChips = state.tags.filter(function (g) { return t.tags.indexOf(g.id) >= 0; }).map(function (g) {
    return el('span', { class: 'chip', style: '--c:' + g.color, text: g.name });
  });
  var lc = linkChip(t, st);
  var body = el('div', { class: 'body' },
    el('button', { type: 'button', class: 'desc', title: 'Edit task', onclick: function () { openTask(t.id); }, text: t.description }),
    (tagChips.length || lc) ? el('div', { class: 'tl' }, tagChips, lc) : null);

  var pill = el('button', { type: 'button', class: 'pill', style: '--c:' + (st ? st.color : '#6B7BA8'), 'aria-haspopup': 'menu', 'aria-expanded': 'false', title: 'Change status' },
    el('span', { class: 'dot', style: '--c:' + (st ? st.color : '#6B7BA8') }),
    el('span', { class: 'nm', text: st ? st.name : 'No status' }), svg(ICON_CHEV));
  pill.addEventListener('click', function () {
    if (!menu.hidden && menuAnchor === pill) closeMenu(); else openStatusMenu(t.id, pill);
  });

  var dl = el('div', { class: 'dl' });
  if (t.deadline) {
    var rel = fin ? { text: '', overdue: false } : relDeadline(t.deadline);
    if (rel.overdue) dl.classList.add('overdue');
    dl.append(document.createTextNode(fmtDay(t.deadline)));
    if (rel.text) dl.append(el('small', { text: rel.text }));
  } else {
    dl.append(el('span', { class: 'muted', text: 'No deadline' }));
  }
  var created = el('div', { class: 'created', title: fmtFull(t.created), text: fmtCreated(t.created) });

  return el('div', { class: 'task' + (fin ? ' is-done' : '') + (justAdded === t.id ? ' flash' : ''), role: 'listitem' },
    check, body, el('div', { class: 'cells' }, el('div', { class: 'c-status' }, pill), dl, created));
}

function renderMain() {
  var list = visibleTasks();
  $('#sort').value = ui.sort;
  $('#showFinished').checked = ui.showFinished;
  $('#showFinished').disabled = ui.status !== 'all';

  $('#taskCount').textContent = list.length === state.tasks.length
    ? state.tasks.length + (state.tasks.length === 1 ? ' Task' : ' tasks')
    : list.length + ' of ' + state.tasks.length + ' Tasks';

  var chips = [];
  if (ui.status !== 'all' && statusById(ui.status)) chips.push(clearChip('Status: ' + statusById(ui.status).name, function () { ui.status = 'all'; save(); renderAll(); }));
  if (ui.tag !== 'all' && tagById(ui.tag)) chips.push(clearChip('Tag: ' + tagById(ui.tag).name, function () { ui.tag = 'all'; save(); renderAll(); }));
  if (search.trim()) chips.push(clearChip('Search: ' + search.trim(), function () { search = ''; $('#search').value = ''; renderMain(); }));
  $('#activeFilters').replaceChildren.apply($('#activeFilters'), chips);

  var board = $('#board');
  if (!state.tasks.length) {
    board.replaceChildren(el('div', { class: 'empty' },
      el('h2', { text: 'No tasks yet' }),
      el('p', { text: 'Create a task to populate this list.' }),
      el('button', { type: 'button', class: 'btn primary', onclick: function () { openTask(null); }, text: 'New task' })));
  } else if (!list.length) {
    board.replaceChildren(el('div', { class: 'empty' },
      el('h2', { text: 'No tasks match' }),
      el('p', { text: 'Try a different search, or clear the filters to see every task.' }),
      el('button', { type: 'button', class: 'btn', onclick: clearFilters, text: 'Clear filters' })));
  } else {
    var head = el('div', { class: 'thead', 'aria-hidden': 'true' }, el('span'), el('span', { text: 'Task' }), el('span', { text: 'Status' }), el('span', { text: 'Deadline' }), el('span', { text: 'Created' }));
    var rows = el('div', { role: 'list' }, list.map(taskRow));
    board.replaceChildren(head, rows);
  }
  var flash = $('.task.flash');
  justDone = null; justAdded = null;
  if (flash) flash.scrollIntoView({ block: 'nearest' });
}

function clearChip(text, onclick) {
  return el('button', { type: 'button', class: 'chip clear', onclick: onclick, 'aria-label': 'Clear filter: ' + text }, text, el('span', { 'aria-hidden': 'true', text: '×' }));
}
function clearFilters() {
  ui.status = 'all'; ui.tag = 'all'; search = ''; $('#search').value = ''; save(); renderAll();
}

