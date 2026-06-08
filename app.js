const APP_VERSION = "v0.1.0 Alpha";
const channels = [
  { group: 'Emergency Operations', name: 'state-eoc-command', desc: 'Statewide EOC command and coordination', roles: ['State EOC Director','Emergency Operations','State Agency'] },
  { group: 'Emergency Operations', name: 'eoc-operations', desc: 'Operational coordination between EOCs and field units', roles: ['State EOC Director','Emergency Operations','Local EOC','State Agency','Local Agency'] },
  { group: 'Emergency Operations', name: 'local-eoc-coordination', desc: 'County and municipal EOC coordination', roles: ['State EOC Director','Emergency Operations','Local EOC','Local Agency'] },
  { group: 'Law Enforcement', name: 'leo-command', desc: 'Law enforcement command coordination', roles: ['State EOC Director','Emergency Operations','LEO','State Patrol'] },
  { group: 'Law Enforcement', name: 'state-patrol', desc: 'State patrol operations and transportation security', roles: ['State EOC Director','Emergency Operations','State Patrol'] },
  { group: 'Fire Rescue', name: 'fire-command', desc: 'Fire command, rescue, hazmat, and USAR coordination', roles: ['State EOC Director','Emergency Operations','Fire'] },
  { group: 'EMS / Medical', name: 'ems-command', desc: 'EMS command, triage, medical transport, and hospital coordination', roles: ['State EOC Director','Emergency Operations','Medic'] },
  { group: 'State & Local Agencies', name: 'state-local-agencies', desc: 'State and local agency coordination', roles: ['State EOC Director','Emergency Operations','State Agency','Local Agency','Local EOC'] },
  { group: 'Weather Operations', name: 'weather-briefings', desc: 'Weather briefings, warning coordination, and impact timing', roles: ['State EOC Director','Emergency Operations','Weather Operations','Local EOC','State Agency','Local Agency'] },
  { group: 'Incident Rooms', name: 'INC-2026-001-severe-weather', desc: 'Active incident room: Severe Weather Response', roles: ['State EOC Director','Emergency Operations','Local EOC','LEO','Medic','Fire','State Patrol','State Agency','Local Agency','Weather Operations'] }
];

let user = null;
let activeChannel = channels[0];
let incidentCounter = 1;
let messages = JSON.parse(localStorage.getItem('responsenetMessages') || '{}');

const loginPanel = document.getElementById('loginPanel');
const channelList = document.getElementById('channelList');
const mainApp = document.getElementById('mainApp');
const messagesEl = document.getElementById('messages');
const channelTitle = document.getElementById('channelTitle');
const channelDesc = document.getElementById('channelDesc');
const currentUser = document.getElementById('currentUser');
const currentRole = document.getElementById('currentRole');

function nowStamp() {
  return new Date().toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

function canAccess(channel) {
  return user && channel.roles.includes(user.role);
}

function seedMessages() {
  channels.forEach(channel => {
    if (!messages[channel.name]) messages[channel.name] = [];
  });
  if (!messages['state-eoc-command'].length) {
    messages['state-eoc-command'].push({
      sender: 'System', role: 'Audit', priority: 'Priority', time: nowStamp(),
      text: 'Secure room initialized. Verify agency identity before sharing operational information.'
    });
  }
  if (!messages['INC-2026-001-severe-weather'].length) {
    messages['INC-2026-001-severe-weather'].push({
      sender: 'Weather Operations', role: 'Weather Operations', priority: 'Urgent', time: nowStamp(),
      text: 'SITREP template ready: hazard, timing, locations affected, resources needed, and next operational period.'
    });
  }
  save();
}

function save() {
  localStorage.setItem('responsenetMessages', JSON.stringify(messages));
}

function renderChannels() {
  channelList.innerHTML = '';
  let currentGroup = '';
  channels.filter(canAccess).forEach(channel => {
    if (channel.group !== currentGroup) {
      currentGroup = channel.group;
      const group = document.createElement('div');
      group.className = 'group-title';
      group.textContent = currentGroup;
      channelList.appendChild(group);
    }
    const btn = document.createElement('button');
    btn.className = 'channel' + (channel.name === activeChannel.name ? ' active' : '');
    btn.textContent = `# ${channel.name}`;
    btn.onclick = () => {
      activeChannel = channel;
      renderChannels();
      renderMessages();
    };
    channelList.appendChild(btn);
  });
}

function renderMessages() {
  channelTitle.textContent = `#${activeChannel.name}`;
  channelDesc.textContent = activeChannel.desc;
  messagesEl.innerHTML = '';
  (messages[activeChannel.name] || []).forEach(msg => {
    const article = document.createElement('article');
    article.className = 'message';
    article.innerHTML = `
      <div class="message-header">
        <span><strong>${escapeHtml(msg.sender)}</strong> • ${escapeHtml(msg.role)} • ${escapeHtml(msg.time)}</span>
        <span class="badge ${escapeHtml(msg.priority)}">${escapeHtml(msg.priority)}</span>
      </div>
      <div>${escapeHtml(msg.text)}</div>
    `;
    messagesEl.appendChild(article);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function login() {
  const name = document.getElementById('nameInput').value.trim() || 'Responder';
  const role = document.getElementById('roleInput').value;
  const code = document.getElementById('codeInput').value.trim();
  if (code !== 'EOC2026') {
    alert('Invalid demo access code. Use EOC2026.');
    return;
  }
  user = { name, role };
  activeChannel = channels.find(ch => ch.roles.includes(role)) || channels[0];
  loginPanel.classList.add('hidden');
  channelList.classList.remove('hidden');
  mainApp.classList.remove('hidden');
  currentUser.textContent = name;
  currentRole.textContent = role;
  renderChannels();
  renderMessages();
}

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('messageForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('messageInput');
  const priority = document.getElementById('priorityInput').value;
  const text = input.value.trim();
  if (!text || !user) return;
  messages[activeChannel.name].push({ sender: user.name, role: user.role, priority, time: nowStamp(), text });
  input.value = '';
  save();
  renderMessages();
});

document.querySelectorAll('[data-priority]').forEach(btn => {
  btn.addEventListener('click', () => document.getElementById('priorityInput').value = btn.dataset.priority);
});

document.querySelectorAll('.template').forEach(btn => {
  btn.addEventListener('click', () => document.getElementById('messageInput').value = btn.textContent + ': ');
});

document.getElementById('createIncidentBtn').addEventListener('click', () => {
  incidentCounter += 1;
  const id = `INC-2026-${String(incidentCounter).padStart(3,'0')}-new-incident`;
  const channel = {
    group: 'Incident Rooms', name: id, desc: 'New multi-agency incident coordination room',
    roles: ['State EOC Director','Emergency Operations','Local EOC','LEO','Medic','Fire','State Patrol','State Agency','Local Agency','Weather Operations']
  };
  channels.push(channel);
  messages[id] = [{ sender: 'System', role: 'Audit', priority: 'Priority', time: nowStamp(), text: 'Incident room created. Assign IC, Operations, Planning, Logistics, and PIO roles.' }];
  activeChannel = channel;
  document.getElementById('incidentCount').textContent = incidentCounter;
  save();
  renderChannels();
  renderMessages();
});

seedMessages();
