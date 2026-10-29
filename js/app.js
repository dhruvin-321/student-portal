/**
 * app.js — StudentHub Main Application Controller
 * Connects auth, nav, data, rendering and user interactions
 */

import { fetchDataset, saveLocal } from './api.js';
import { filterItems, sortItems, paginate, uniqueValues, exportCSV } from './dataUtils.js';
import {
  renderEvents, renderStudents, renderCourses,
  renderFaqs, renderInquiries, renderPagination
} from './render.js';

// ── STATE ──────────────────────────────────────────────────────────────────
const state = {
  tab: 'events',
  data: { events:[], students:[], courses:[], faqs:[], inquiries:[] },
  filtered: [],
  page: 1,
  perPage: 6,
  search: '',
  category: 'ALL',
  status: 'ALL',
  sort: 'default',
  user: { name: 'Admin', role: 'Admin', email: '' }
};

// ── DOM ────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const DOM = {
  body: document.body,
  themeBtn:   $('btn-theme'),
  logoutBtn:  $('btn-logout'),
  userNm:     $('user-nm'),
  userRl:     $('user-rl'),
  userAv:     $('user-av'),
  pageTitle:  $('page-title'),
  pageCount:  $('page-count'),
  addStudBtn: $('btn-add-student'),
  exportBtn:  $('btn-export'),
  searchInp:  $('search-inp'),
  filterCat:  $('filter-category'),
  filterSt:   $('filter-status'),
  sortBy:     $('sort-by'),
  pageSize:   $('page-size'),
  resetBtn:   $('btn-reset'),
  loading:    $('state-loading'),
  error:      $('state-error'),
  errMsg:     $('err-msg'),
  retryBtn:   $('btn-retry'),
  dataArea:   $('data-area'),
  pagination: $('pagination'),
  toasts:     $('toasts'),
  // Modals
  modalStudentView: $('modal-student-view'),
  modalStudentViewBody: $('modal-student-view-body'),
  modalStudentForm: $('modal-student-form'),
  modalStudentFormTitle: $('student-form-title'),
  modalEventReg: $('modal-event-reg'),
  modalEventRegBody: $('modal-event-reg-body'),
};

// ── TABS CONFIG ────────────────────────────────────────────────────────────
const TABS = {
  events: {
    label: 'Campus Events',
    sortOptions: [
      { v:'default', l:'Default Order' },
      { v:'date_asc', l:'Date (Earliest)' },
      { v:'date_desc', l:'Date (Latest)' },
      { v:'title_asc', l:'Title A–Z' },
      { v:'attendees_desc', l:'Most Attended' }
    ],
    searchFields: ['title','description','location','category'],
    categoryField: 'category',
    statusField: 'status'
  },
  students: {
    label: 'Students',
    sortOptions: [
      { v:'default', l:'Default Order' },
      { v:'name_asc', l:'Name A–Z' },
      { v:'name_desc', l:'Name Z–A' },
      { v:'gpa_desc', l:'GPA High–Low' },
      { v:'gpa_asc', l:'GPA Low–High' },
      { v:'semester_asc', l:'Semester Asc' },
    ],
    searchFields: ['name','rollNo','email','department'],
    categoryField: 'department',
    statusField: 'status'
  },
  courses: {
    label: 'Courses',
    sortOptions: [
      { v:'default', l:'Default Order' },
      { v:'title_asc', l:'Title A–Z' },
      { v:'credits_desc', l:'Credits High–Low' },
      { v:'enrolled_desc', l:'Most Enrolled' }
    ],
    searchFields: ['title','code','instructor','department','description'],
    categoryField: 'department',
    statusField: 'status'
  },
  faqs: {
    label: 'FAQs',
    sortOptions: [
      { v:'default', l:'Default Order' },
      { v:'views_desc', l:'Most Viewed' },
      { v:'helpfulCount_desc', l:'Most Helpful' },
      { v:'question_asc', l:'Question A–Z' }
    ],
    searchFields: ['question','answer','category'],
    categoryField: 'category',
    statusField: null
  },
  inquiries: {
    label: 'Registration',
    sortOptions: [],
    searchFields: ['name','email','course'],
    categoryField: 'course',
    statusField: 'status'
  }
};

// ── SHOW / HIDE ────────────────────────────────────────────────────────────
function showLoading() {
  DOM.loading.style.display  = 'flex';
  DOM.error.style.display    = 'none';
  DOM.dataArea.style.display = 'none';
  DOM.pagination.style.display = 'none';
}
function showError(msg) {
  DOM.loading.style.display  = 'none';
  DOM.error.style.display    = 'flex';
  DOM.errMsg.textContent     = msg;
  DOM.dataArea.style.display = 'none';
}
function showData() {
  DOM.loading.style.display = 'none';
  DOM.error.style.display   = 'none';
  DOM.dataArea.style.display = 'block';
}

// ── TOAST ──────────────────────────────────────────────────────────────────
function toast(msg, type='info') {
  const icons = { success:'✅', info:'ℹ️', danger:'❌' };
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.innerHTML = `${icons[type]||''} ${msg}`;
  DOM.toasts.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

// ── MODAL ─────────────────────────────────────────────────────────────────
function openModal(el) { el?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(el){ el?.classList.remove('open'); document.body.style.overflow=''; }

// ── THEME ─────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('sh_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  DOM.themeBtn.textContent = saved==='dark' ? '☀️' : '🌙';
}
function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr==='dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  DOM.themeBtn.textContent = next==='dark' ? '☀️' : '🌙';
  localStorage.setItem('sh_theme', next);
}

// ── USER INFO ─────────────────────────────────────────────────────────────
function loadAuth() {
  const raw = sessionStorage.getItem('sh_auth');
  if (!raw) { window.location.replace('./login.html'); return; }
  try {
    const auth = JSON.parse(raw);
    state.user = { name: auth.name||'User', role: auth.role||'Student', email: auth.email||'' };
  } catch { window.location.replace('./login.html'); }
}

function updateUserUI() {
  const { name, role } = state.user;
  DOM.userNm.textContent = name;
  DOM.userRl.textContent = role;
  DOM.userAv.textContent = name.charAt(0).toUpperCase();
}

// ── TOOLBAR SETUP (populate selects per tab) ───────────────────────────────
function buildToolbar(tab) {
  const cfg = TABS[tab];

  // Sort options
  DOM.sortBy.innerHTML = cfg.sortOptions.map(o=>
    `<option value="${o.v}">${o.l}</option>`
  ).join('') || '<option value="default">Default</option>';

  // Category options
  const cats = uniqueValues(state.data[tab], cfg.categoryField);
  DOM.filterCat.innerHTML = `<option value="ALL">All ${cfg.categoryField==='department'?'Departments':'Categories'}</option>` +
    cats.map(c=>`<option value="${c}">${c}</option>`).join('');

  // Status options
  if (cfg.statusField) {
    const stats = uniqueValues(state.data[tab], cfg.statusField);
    DOM.filterSt.innerHTML = `<option value="ALL">All Status</option>` +
      stats.map(s=>`<option value="${s}">${s}</option>`).join('');
    DOM.filterSt.style.display = '';
  } else {
    DOM.filterSt.style.display = 'none';
  }

  // Add Student button visibility
  DOM.addStudBtn.style.display = (tab==='students' && state.user.role==='Admin') ? '' : 'none';

  // Export button visibility
  DOM.exportBtn.style.display = tab==='inquiries' ? 'none' : '';

  // Toolbar visibility
  const $toolbar = document.getElementById('toolbar');
  $toolbar.style.display = tab==='inquiries' ? 'none' : '';

  DOM.pageTitle.textContent = cfg.label;

  // Reset filter state
  state.search   = '';
  state.category = 'ALL';
  state.status   = 'ALL';
  state.sort     = 'default';
  state.page     = 1;
  DOM.searchInp.value = '';
  DOM.filterCat.value = 'ALL';
  DOM.filterSt.value  = 'ALL';
  DOM.sortBy.value    = 'default';
}

// ── APPLY FILTERS & RENDER ─────────────────────────────────────────────────
function applyAndRender() {
  const tab = state.tab;
  const cfg = TABS[tab];

  let items = state.data[tab];
  items = filterItems(items, {
    search:   state.search,
    category: state.category,
    status:   state.status,
    fields:   cfg.searchFields
  });
  items = sortItems(items, state.sort);
  state.filtered = items;

  // Pagination not shown for inquiries (handled in render)
  if (tab === 'inquiries') {
    DOM.pageCount.textContent = `${items.length} records`;
    showData();
    renderInquiries(state.data.inquiries, DOM.dataArea, {
      onSubmit: handleInquirySubmit,
      onExport: () => exportCSV(state.data.inquiries, 'registrations.csv')
    });
    DOM.pagination.style.display = 'none';
    return;
  }

  const { slice, meta } = paginate(items, state.page, state.perPage);
  DOM.pageCount.textContent = `${meta.totalRecords} record${meta.totalRecords!==1?'s':''}`;

  showData();

  switch (tab) {
    case 'events':
      renderEvents(slice, DOM.dataArea, { onRegister: openEventRegModal });
      break;
    case 'students':
      renderStudents(slice, DOM.dataArea, {
        onView:   openStudentView,
        onEdit:   openStudentEdit,
        onDelete: deleteStudent
      }, state.user.role);
      break;
    case 'courses':
      renderCourses(slice, DOM.dataArea);
      break;
    case 'faqs':
      renderFaqs(slice, DOM.dataArea, { onHelpful: handleFaqHelpful });
      break;
  }

  renderPagination(meta, DOM.pagination, (p) => {
    state.page = p;
    applyAndRender();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateNavBadges();
}

// ── LOAD DATASET ─────────────────────────────────────────────────────────
async function loadTab(tab) {
  state.tab = tab;

  // Already loaded
  if (state.data[tab]?.length) {
    buildToolbar(tab);
    applyAndRender();
    return;
  }

  showLoading();
  try {
    state.data[tab] = await fetchDataset(tab);
    buildToolbar(tab);
    applyAndRender();
  } catch(err) {
    showError(`Could not load data: ${err.message}`);
  }
}

// ── NAV BADGE COUNTS ─────────────────────────────────────────────────────
function updateNavBadges() {
  const tabs = ['events','students','courses','faqs','inquiries'];
  tabs.forEach(t => {
    const el = document.getElementById(`badge-${t}`);
    if (el) el.textContent = state.data[t]?.length ?? 0;
  });
}

// ── EVENTS: RSVP MODAL ────────────────────────────────────────────────────
function openEventRegModal(id) {
  const event = state.data.events.find(e => e.id === id);
  if (!event) return;
  const code = 'EVT-' + Math.random().toString(36).slice(2,7).toUpperCase();
  DOM.modalEventRegBody.innerHTML = `
    <div class="ticket-card">
      <div class="ticket-event">${event.title}</div>
      <div class="ticket-meta">📍 ${event.location} &bull; 🗓️ ${event.date}</div>
      <div class="ticket-code">${code}</div>
      <div class="ticket-name">Registered for: ${state.user.name}</div>
    </div>
    <p style="font-size:0.82rem;color:var(--text-muted);">
      Save your registration code. Show it at the venue entry desk. 
      Capacity: ${event.attendees} / ${event.capacity || 'Unlimited'}.
    </p>`;
  openModal(DOM.modalEventReg);
  toast('Registered for event!', 'success');

  // Increment attendee count
  const ev = state.data.events.find(e=>e.id===id);
  if(ev && ev.attendees < (ev.capacity||9999)) {
    ev.attendees++;
    saveLocal('events', state.data.events);
  }
}

// ── STUDENTS: VIEW MODAL ─────────────────────────────────────────────────
function openStudentView(id) {
  const s = state.data.students.find(s=>s.id===id);
  if (!s) return;
  const initials = s.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
  const gpaC = s.gpa>=3.7?'gpa-hi':s.gpa<3.0?'gpa-lo':'gpa-mid';
  DOM.modalStudentViewBody.innerHTML = `
    <div class="stu-profile-head">
      <div class="stu-profile-av">${initials}</div>
      <div>
        <div style="font-size:1.1rem;font-weight:800;color:var(--text);">${s.name}</div>
        <div style="font-size:0.82rem;color:var(--text-muted);">${s.email}</div>
        <span class="status-tag st-${s.status}" style="margin-top:.3rem;display:inline-block;">${s.status}</span>
      </div>
    </div>
    <div class="stu-profile-grid">
      <div class="stu-profile-field"><span class="spf-label">Roll Number</span><span class="spf-value">${s.rollNo}</span></div>
      <div class="stu-profile-field"><span class="spf-label">Department</span><span class="spf-value">${s.department}</span></div>
      <div class="stu-profile-field"><span class="spf-label">Semester</span><span class="spf-value">${s.semester}</span></div>
      <div class="stu-profile-field"><span class="spf-label">GPA</span><span class="spf-value"><span class="gpa-badge ${gpaC}">${Number(s.gpa).toFixed(2)}</span></span></div>
    </div>`;
  openModal(DOM.modalStudentView);
}

// ── STUDENTS: ADD / EDIT ──────────────────────────────────────────────────
let editStudentId = null;

function openStudentAdd() {
  editStudentId = null;
  DOM.modalStudentFormTitle.textContent = 'Add Student';
  $('sf-name').value=''; $('sf-roll').value=''; $('sf-email').value='';
  $('sf-dept').value='Computer Science'; $('sf-sem').value='5';
  $('sf-gpa').value='3.50'; $('sf-status').value='Active';
  document.querySelectorAll('.mfield.has-err').forEach(f=>f.classList.remove('has-err'));
  openModal(DOM.modalStudentForm);
}

function openStudentEdit(id) {
  const s = state.data.students.find(s=>s.id===id);
  if (!s) return;
  editStudentId = id;
  DOM.modalStudentFormTitle.textContent = 'Edit Student';
  $('sf-name').value=s.name; $('sf-roll').value=s.rollNo; $('sf-email').value=s.email;
  $('sf-dept').value=s.department; $('sf-sem').value=s.semester;
  $('sf-gpa').value=s.gpa; $('sf-status').value=s.status;
  document.querySelectorAll('.mfield.has-err').forEach(f=>f.classList.remove('has-err'));
  openModal(DOM.modalStudentForm);
}

function saveStudent() {
  // Validation
  let ok = true;
  const setE = (id, errId, bad) => {
    $(`sf-${id}`)?.closest('.mfield')?.classList.toggle('has-err',bad);
    if(bad) ok=false;
  };
  setE('name', null, !/^[a-zA-Z\s]{2,}$/.test($('sf-name').value.trim()));
  setE('roll', null, !$('sf-roll').value.trim());
  setE('email',null, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('sf-email').value.trim()));
  const gv = parseFloat($('sf-gpa').value);
  setE('gpa',  null, isNaN(gv)||gv<0||gv>4);
  if (!ok) return;

  if (editStudentId) {
    const idx = state.data.students.findIndex(s=>s.id===editStudentId);
    if(idx>-1) {
      state.data.students[idx] = { ...state.data.students[idx],
        name: $('sf-name').value.trim(), rollNo: $('sf-roll').value.trim(),
        email: $('sf-email').value.trim(), department: $('sf-dept').value,
        semester: +$('sf-sem').value, gpa: gv, status: $('sf-status').value
      };
      toast('Student updated.','success');
    }
  } else {
    const maxId = Math.max(0,...state.data.students.map(s=>s.id));
    state.data.students.unshift({
      id: maxId+1,
      name:       $('sf-name').value.trim(),
      rollNo:     $('sf-roll').value.trim(),
      email:      $('sf-email').value.trim(),
      department: $('sf-dept').value,
      semester:   +$('sf-sem').value,
      gpa:        gv,
      status:     $('sf-status').value
    });
    toast('Student added.','success');
  }

  saveLocal('students', state.data.students);
  closeModal(DOM.modalStudentForm);
  applyAndRender();
}

function deleteStudent(id) {
  const s = state.data.students.find(s=>s.id===id);
  if (!s || !confirm(`Delete student "${s.name}"?`)) return;
  state.data.students = state.data.students.filter(s=>s.id!==id);
  saveLocal('students', state.data.students);
  toast('Student deleted.','danger');
  applyAndRender();
}

// ── FAQ HELPFUL ───────────────────────────────────────────────────────────
function handleFaqHelpful(id, btn) {
  const f = state.data.faqs.find(f=>f.id===id);
  if (!f) return;
  f.helpfulCount = (f.helpfulCount||0)+1;
  saveLocal('faqs', state.data.faqs);
  btn.textContent = `👍 Helpful (${f.helpfulCount})`;
  toast('Thanks for your feedback!','success');
}

// ── INQUIRY SUBMIT ────────────────────────────────────────────────────────
function handleInquirySubmit(record) {
  state.data.inquiries.unshift(record);
  saveLocal('inquiries', state.data.inquiries);
  applyAndRender();
  toast('Registration submitted!','success');
}

// ── PRELOAD BADGE COUNTS ──────────────────────────────────────────────────
async function preloadBadges() {
  const tabs = ['events','students','courses','faqs','inquiries'];
  for (const t of tabs) {
    if (!state.data[t]?.length) {
      try { state.data[t] = await fetchDataset(t); } catch { /* skip */ }
    }
  }
  updateNavBadges();
}

// ── SETUP LISTENERS ───────────────────────────────────────────────────────
function setupListeners() {
  // Nav tabs
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      loadTab(btn.dataset.tab);
    });
  });

  // Theme
  DOM.themeBtn.addEventListener('click', toggleTheme);

  // Logout
  DOM.logoutBtn.addEventListener('click', () => {
    if (confirm('Sign out of StudentHub?')) {
      sessionStorage.removeItem('sh_auth');
      window.location.href = './login.html';
    }
  });

  // Retry
  DOM.retryBtn.addEventListener('click', () => loadTab(state.tab));

  // Export
  DOM.exportBtn.addEventListener('click', () => {
    const items = state.filtered.length ? state.filtered : state.data[state.tab];
    exportCSV(items, `${state.tab}.csv`);
    toast('CSV exported.','info');
  });

  // Add student
  DOM.addStudBtn.addEventListener('click', openStudentAdd);
  $('btn-save-student').addEventListener('click', saveStudent);

  // Search
  DOM.searchInp.addEventListener('input', () => {
    state.search = DOM.searchInp.value;
    state.page = 1;
    applyAndRender();
  });

  // Filters
  DOM.filterCat.addEventListener('change', () => { state.category=DOM.filterCat.value; state.page=1; applyAndRender(); });
  DOM.filterSt.addEventListener('change',  () => { state.status=DOM.filterSt.value;    state.page=1; applyAndRender(); });
  DOM.sortBy.addEventListener('change',    () => { state.sort=DOM.sortBy.value;         state.page=1; applyAndRender(); });
  DOM.pageSize.addEventListener('change',  () => { state.perPage=+DOM.pageSize.value;   state.page=1; applyAndRender(); });

  // Reset
  DOM.resetBtn.addEventListener('click', () => {
    state.search=''; state.category='ALL'; state.status='ALL'; state.sort='default'; state.page=1;
    DOM.searchInp.value=''; DOM.filterCat.value='ALL'; DOM.filterSt.value='ALL'; DOM.sortBy.value='default';
    applyAndRender();
  });

  // Modal close (via data-close attr)
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal($(btn.dataset.close)));
  });

  // Modal close on bg click
  [DOM.modalStudentView, DOM.modalStudentForm, DOM.modalEventReg].forEach(m => {
    m?.addEventListener('click', e => { if(e.target===m) closeModal(m); });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {
      [DOM.modalStudentView, DOM.modalStudentForm, DOM.modalEventReg].forEach(m=>closeModal(m));
    }
  });
}

// ── INIT ──────────────────────────────────────────────────────────────────
async function init() {
  loadAuth();
  initTheme();
  updateUserUI();
  setupListeners();
  await loadTab('events');
  preloadBadges(); // async preload others for badge counts
}

init();
