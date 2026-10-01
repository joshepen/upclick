'use strict';

function toast(msg) {
  Array.prototype.forEach.call(document.querySelectorAll('.toast'), function (x) { x.remove(); });
  var open = document.querySelectorAll('dialog[open]');
  var host = open.length ? open[open.length - 1] : document.body;
  var t = el('div', { class: 'toast', role: 'status', text: msg });
  host.append(t);
  requestAnimationFrame(function () { t.classList.add('show'); });
  setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 250); }, 3000);
}

function confirmBox(o) {
  return new Promise(function (resolve) {
    var d = $('#confirmDialog');
    $('#cTitle').textContent = o.title;
    $('#cBody').textContent = o.body;
    var ok = $('#cOk');
    ok.textContent = o.confirm || 'Confirm';
    ok.className = 'btn ' + (o.danger === false ? 'primary' : 'danger');
    d.returnValue = '';
    d.addEventListener('close', function () { resolve(d.returnValue === 'ok'); }, { once: true });
    d.showModal();
    $('#cCancel').focus();
  });
}

