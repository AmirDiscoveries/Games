let currentLevel = 1;
let draggedNode = null;
let workflowState = {};

const levels = {
  1: {
    title: "Level 1: Basic Data Flow",
    availableNodes: [
      { id: 'set-var', type: 'trigger', title: 'Set Variable', subtitle: 'value: Hello World', icon: '📝' },
      { id: 'function', type: 'action', title: 'Function', subtitle: 'processData()', icon: '⚡' },
      { id: 'output', type: 'output', title: 'Output', subtitle: 'format: JSON', icon: '📤' }
    ],
    workflow: ['set-var', 'function', 'output'],
    solution: ['set-var', 'function', 'output']
  },
  2: {
    title: "Level 2: Conditional Logic",
    availableNodes: [
      { id: 'form-trigger', type: 'trigger', title: 'On form submission', subtitle: 'form submit', icon: '📋' },
      { id: 'if-condition', type: 'condition', title: 'If Condition', subtitle: 'Check input', icon: '🔀' },
      { id: 'send-message', type: 'action', title: 'Send Message', subtitle: 'notify user', icon: '💬' },
      { id: 'no-operation', type: 'action', title: 'No Operation', subtitle: 'skip', icon: '➡️' }
    ],
    workflow: ['form-trigger', 'if-condition', 'send-message', 'no-operation'],
    solution: ['form-trigger', 'if-condition', 'send-message', 'no-operation']
  },
  3: {
    title: "Level 3: API Integration",
    availableNodes: [
      { id: 'chat-trigger', type: 'trigger', title: 'On chat', subtitle: 'chat message', icon: '💭' },
      { id: 'ai-agent', type: 'model', title: 'AI Agent', subtitle: 'GPT handler', icon: '🤖' },
      { id: 'weather', type: 'action', title: 'Get Weather', subtitle: 'OpenWeather API', icon: '🌤️' },
      { id: 'air-quality', type: 'action', title: 'Air Quality', subtitle: 'AQI API', icon: '🌬️' },
      { id: 'gmail', type: 'action', title: 'Send Email', subtitle: 'via Gmail', icon: '📧' }
    ],
    workflow: ['chat-trigger', 'ai-agent', 'weather', 'air-quality', 'gmail'],
    solution: ['chat-trigger', 'ai-agent', 'weather', 'air-quality', 'gmail']
  }
};

function initLevel(level) {
  currentLevel = level;
  const data = levels[level];
  document.getElementById('level-title').textContent = data.title;
  document.getElementById('current-level').textContent = data.title;
  document.querySelector('.progress-indicator').textContent = `${level}/3`;
  renderNodes(data.availableNodes);
  renderWorkflow(data.workflow);
  workflowState = {};
  clearFeedback();
  
  // Hide all descriptions first
  document.querySelectorAll('.level-desc').forEach(desc => {
    desc.classList.remove('active');
  });
  
  // Show current level description
  document.getElementById(`level-${level}-desc`).classList.add('active');
}

function renderNodes(nodes) {
  const palette = document.getElementById('node-palette');
  palette.innerHTML = '';
  nodes.forEach(node => {
    const el = document.createElement('div');
    el.className = 'node';
    el.draggable = true;
    el.dataset.nodeId = node.id;
    el.innerHTML = `<div class="node-icon icon-${node.type}">${node.icon}</div>
      <div class="node-info">
        <div class="node-title">${node.title}</div>
        <div class="node-subtitle">${node.subtitle}</div>
      </div>`;
    el.addEventListener('dragstart', e => {
      draggedNode = e.target;
      e.target.classList.add('dragging');
    });
    el.addEventListener('dragend', e => {
      e.target.classList.remove('dragging');
    });
    palette.appendChild(el);
  });
}

function renderWorkflow(workflow) {
  const area = document.getElementById('workflow-area');
  area.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'workflow-row';
  workflow.forEach((_, idx) => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.dataset.position = idx;
    zone.textContent = 'Drop here';
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('highlight');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('highlight'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedNode && !zone.classList.contains('filled')) {
        const nodeId = draggedNode.dataset.nodeId;
        const node = levels[currentLevel].availableNodes.find(n => n.id === nodeId);
        workflowState[idx] = node;
        zone.innerHTML = `<div class="node-icon icon-${node.type}">${node.icon}</div>
          <div style="font-size: 0.8rem; text-align: center;">${node.title}</div>`;
        zone.classList.add('filled');
        zone.classList.remove('highlight');
        draggedNode.style.display = 'none';
        draggedNode = null;
      }
    });
    row.appendChild(zone);
    if (idx < workflow.length - 1) {
      const connector = document.createElement('div');
      connector.className = 'workflow-connector';
      row.appendChild(connector);
    }
  });
  area.appendChild(row);
}

function testWorkflow() {
  const expected = levels[currentLevel].solution;
  const actual = expected.map((_, i) => workflowState[i]?.id || null);
  const pass = expected.every((id, i) => id === actual[i]);
  showFeedback(pass ? '🎉 Excellent! Workflow completed successfully!' : '❌ Workflow incomplete or incorrect. Check the node order!', pass ? 'success' : 'error');
  if (pass && currentLevel < 3) {
    setTimeout(() => {
      if (confirm(`Great job! Ready for Level ${currentLevel + 1}?`)) {
        selectLevel(currentLevel + 1);
      }
    }, 2000);
  }
}

function resetWorkflow() {
  workflowState = {};
  document.querySelectorAll('.drop-zone').forEach(z => {
    z.classList.remove('filled', 'highlight');
    z.textContent = 'Drop here';
  });
  document.querySelectorAll('.node').forEach(n => (n.style.display = 'flex'));
  clearFeedback();
}

function showFeedback(message, type) {
  const feedback = document.getElementById('feedback');
  feedback.innerHTML = `<div class="${type}-message">${message}</div>`;
  setTimeout(() => {
    feedback.querySelector(`.${type}-message`).classList.add('show');
  }, 100);
}

function clearFeedback() {
  document.getElementById('feedback').innerHTML = '';
}

function toggleDropdown() {
  document.getElementById('dropdown-content').classList.toggle('show');
  document.getElementById('dropdown-arrow').classList.toggle('open');
}

function selectLevel(level) {
  document.getElementById('current-level').textContent = levels[level].title;
  document.getElementById('dropdown-content').classList.remove('show');
  document.getElementById('dropdown-arrow').classList.remove('open');
  initLevel(level);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.level-dropdown')) {
    document.getElementById('dropdown-content').classList.remove('show');
    document.getElementById('dropdown-arrow').classList.remove('open');
  }
});

window.onload = () => initLevel(1);