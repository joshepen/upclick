'use strict';

var mDlg = $('#manageDialog'), mMode = 'statuses';
function openManage(mode) { mMode = mode; renderManage(); mDlg.showModal(); }
function renderManage() {
  $('#manageTitle').textContent = mMode === 'statuses' ? 'Manage statuses' : 'Manage tags';
  var body = $('#manageBody');
  body.replaceChildren.apply(body, mMode === 'statuses' ? statusManager() : tagManager());
}
function refocus(sel) { var n = $('#manageBody').querySelector(sel); if (n) n.focus(); }

function renameItem(kind, item, input) {
  var v = input.value.trim();
  if (!v) { input.value = item.name; toast('A name is required.'); return; }
  if (nameTaken(state[kind], v, item)) { input.value = item.name; toast('“' + v + '” already exists.'); return; }
  item.name = v; save(); renderAll();
}
function colorInput(item) {
  return el('input', { class: 'swatch', type: 'color', value: item.color, 'aria-label': 'Color', onchange: function (e) { item.color = e.target.value; save(); renderAll(); } });
}

function statusManager() {
  var list = el('div', { class: 'mlist' }, state.statuses.map(function (s, i) {
    var last = i === state.statuses.length - 1;
    var kindSel = el('select', {
      class: 'in', 'aria-label': 'What the reference holds', 'data-focus': 'kind-' + s.id,
      onchange: function (e) {
        var nk = e.target.value, ok = s.linkKind === 'text' ? 'text' : 'task';
        if (nk === ok) return;
        s.linkKind = nk;
        if (s.linkLabel === defaultLabel(ok)) s.linkLabel = defaultLabel(nk);
        state.tasks.forEach(function (t) { if (t.statusId === s.id) { if (nk === 'text') t.statusRef = null; else t.statusText = ''; } });
        save(); renderManage(); renderAll();
        refocus('[data-focus="kind-' + s.id + '"]');
      }
    }, el('option', { value: 'task', text: 'Reference another task' }), el('option', { value: 'text', text: 'Reference text, such as a person' }));
    kindSel.value = s.linkKind === 'text' ? 'text' : 'task';
    var labelIn = el('input', {
      class: 'in', type: 'text', value: s.linkLabel, maxlength: '30', placeholder: 'Label, e.g. Waiting on', 'aria-label': 'Label shown on tasks with this status', 'data-focus': 'label-' + s.id,
      onchange: function (e) { s.linkLabel = e.target.value.trim() || defaultLabel(s.linkKind);  e.target.value = s.linkLabel; save(); renderAll(); }
    });
    return el('div', { class: 'mrow' },
      el('div', { class: 'mrow-top' },
        colorInput(s),
        el('input', { class: 'in', type: 'text', value: s.name, maxlength: '40', 'aria-label': 'Status name', onchange: function (e) { renameItem('statuses', s, e.target); } }),
        el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Move up', 'data-focus': 'up-' + s.id, disabled: i === 0, onclick: function () { moveStatus(i, -1, 'up-' + s.id); }, text: '↑' }),
        el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Move down', 'data-focus': 'down-' + s.id, disabled: last, onclick: function () { moveStatus(i, 1, 'down-' + s.id); }, text: '↓' }),
        el('button', { type: 'button', class: 'btn small ghost warn', disabled: state.statuses.length <= 1, onclick: function () { deleteStatus(s); }, text: 'Delete' })),
      el('div', { class: 'mrow-opts' },
        el('label', { class: 'check-label' },
          el('input', {
            type: 'checkbox', checked: s.requiresLink, onchange: function (e) {
              s.requiresLink = e.target.checked;
              if (s.requiresLink && !s.linkLabel) s.linkLabel = defaultLabel(s.linkKind);
              if (!s.requiresLink) state.tasks.forEach(function (t) { if (t.statusId === s.id) clearRefs(t); });
              save(); renderManage(); renderAll();
              if (s.requiresLink) refocus('[data-focus="label-' + s.id + '"]');
            }
          }), 'Ask for a reference'),
        s.requiresLink ? kindSel : null,
        s.requiresLink ? labelIn : null,
        el('label', { class: 'check-label' },
          el('input', { type: 'checkbox', checked: s.finished, onchange: function (e) { s.finished = e.target.checked; save(); renderAll(); } }), 'Counts as finished')));
  }));

  var addIn = el('input', { class: 'in', type: 'text', maxlength: '40', placeholder: 'New status name', 'aria-label': 'New status name', id: 'mAddIn' });
  function add() {
    var name = addIn.value.trim(); if (!name) { addIn.focus(); return; }
    if (nameTaken(state.statuses, name)) { toast('“' + name + '” already exists.'); return; }
    state.statuses.push({ id: uid(), name: name, color: nextColor(state.statuses), requiresLink: false, linkLabel: '', finished: false });
    save(); renderManage(); renderAll();
    var rows = $('#manageBody').querySelectorAll('.mrow'); if (rows.length) rows[rows.length - 1].scrollIntoView({ block: 'nearest' });
    refocus('#mAddIn');
  }
  addIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  return [
    el('p', { class: 'intro', text: 'Statuses show where each task stands. Turn on “Ask for a reference” to let a status point at another task or hold a short note, like a Waiting status that names the task or the person you’re waiting on.' }),
    list,
    el('div', { class: 'madd' }, addIn, el('button', { type: 'button', class: 'btn', onclick: add, text: 'Add status' }))
  ];
}
function moveStatus(i, dir, focusKey) {
  var j = i + dir; if (j < 0 || j >= state.statuses.length) return;
  var tmp = state.statuses[i]; state.statuses[i] = state.statuses[j]; state.statuses[j] = tmp;
  save(); renderManage(); renderAll();
  refocus('[data-focus="' + focusKey + '"]');
}
function deleteStatus(s) {
  if (state.statuses.length <= 1) return;
  var used = state.tasks.filter(function (t) { return t.statusId === s.id; });
  var target = state.statuses.find(function (x) { return x.id !== s.id && !x.requiresLink; }) || state.statuses.find(function (x) { return x.id !== s.id; });
  function finish() {
    used.forEach(function (t) { t.statusId = target.id; t.doneFrom = null; if (!target.requiresLink) clearRefs(t); });
    state.statuses = state.statuses.filter(function (x) { return x !== s; });
    if (ui.status === s.id) ui.status = 'all';
    save(); renderManage(); renderAll();
    toast('Status deleted');
  }
  if (!used.length) { finish(); return; }
  confirmBox({
    title: 'Delete “' + s.name + '”?',
    body: used.length + (used.length === 1 ? ' task uses this status and will move to “' : ' tasks use this status and will move to “') + target.name + '”.',
    confirm: 'Delete status'
  }).then(function (ok) { if (ok) finish(); });
}

function tagManager() {
  var counts = {};
  state.tasks.forEach(function (t) { t.tags.forEach(function (g) { counts[g] = (counts[g] || 0) + 1; }); });
  var nodes = [el('p', { class: 'intro', text: 'Tags group related tasks. Add them to any task, then filter by tag from the sidebar.' })];
  if (state.tags.length) {
    nodes.push(el('div', { class: 'mlist' }, state.tags.map(function (g) {
      var n = counts[g.id] || 0;
      return el('div', { class: 'mrow' }, el('div', { class: 'mrow-top' },
        colorInput(g),
        el('input', { class: 'in', type: 'text', value: g.name, maxlength: '30', 'aria-label': 'Tag name', onchange: function (e) { renameItem('tags', g, e.target); } }),
        el('span', { class: 'use', text: n + (n === 1 ? ' task' : ' tasks') }),
        el('button', { type: 'button', class: 'btn small ghost warn', onclick: function () { deleteTag(g, n); }, text: 'Delete' })));
    })));
  } else {
    nodes.push(el('p', { class: 'hint', text: 'No tags yet. Add your first one below.' }));
  }
  var addIn = el('input', { class: 'in', type: 'text', maxlength: '30', placeholder: 'New tag name', 'aria-label': 'New tag name', id: 'mAddIn' });
  function add() {
    if (!addIn.value.trim()) { addIn.focus(); return; }
    if (!createTag(addIn.value)) return;
    renderManage(); renderAll(); refocus('#mAddIn');
  }
  addIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  nodes.push(el('div', { class: 'madd' }, addIn, el('button', { type: 'button', class: 'btn', onclick: add, text: 'Add tag' })));
  return nodes;
}
function deleteTag(g, n) {
  function finish() {
    state.tags = state.tags.filter(function (x) { return x !== g; });
    state.tasks.forEach(function (t) { t.tags = t.tags.filter(function (id) { return id !== g.id; }); });
    if (ui.tag === g.id) ui.tag = 'all';
    save(); renderManage(); renderAll();
    toast('Tag deleted');
  }
  if (!n) { finish(); return; }
  confirmBox({ title: 'Delete “' + g.name + '”?', body: 'It will be removed from ' + n + (n === 1 ? ' task.' : ' tasks.'), confirm: 'Delete tag' }).then(function (ok) { if (ok) finish(); });
}

