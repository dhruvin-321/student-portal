/** Escape HTML to prevent XSS */
export function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ── EVENTS ─────────────────────────────────────────────────────────────────
export function renderEvents(items, container, { onRegister } = {}) {
  if (!items?.length) { container.innerHTML = emptyState('📅','No Events Found','Try adjusting your filters.'); return; }

  container.innerHTML = `<div class="events-grid">${items.map(e => {
    const full = e.attendees >= (e.capacity || 200);
    return `
    <article class="event-card" data-id="${e.id}">
      <div>
        <div class="event-top">
          <span class="tag tag-${esc(e.category)}">${esc(e.category)}</span>
          <span class="status-tag st-${esc(e.status)}">${esc(e.status)}</span>
        </div>
        <div class="event-title">${esc(e.title)}</div>
        <div class="event-desc">${esc(e.description)}</div>
      </div>
      <div>
        <div class="event-meta">
          <span class="meta-item">📍 ${esc(e.location)}</span>
          <span class="meta-item">🗓️ ${esc(e.date)}</span>
          <span class="meta-item">👥 ${esc(e.attendees)}${e.capacity ? ' / '+e.capacity : ''}</span>
        </div>
        <button class="event-register-btn" data-id="${e.id}" ${full?'disabled':''}>
          ${full ? 'Seats Full' : '🎟️ Register / RSVP'}
        </button>
      </div>
    </article>`;
  }).join('')}</div>`;

  container.querySelectorAll('.event-register-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => onRegister?.(+btn.dataset.id));
  });
}

// ── STUDENTS ────────────────────────────────────────────────────────────────
export function renderStudents(items, container, { onView, onEdit, onDelete } = {}, role='Student') {
  if (!items?.length) { container.innerHTML = emptyState('🎓','No Students Found','Try searching or adjusting filters.'); return; }

  const isAdmin = role === 'Admin';
  const rows = items.map(s => {
    const initials = s.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    const gpaC = s.gpa>=3.7?'gpa-hi':s.gpa<3.0?'gpa-lo':'gpa-mid';
    return `<tr data-id="${s.id}">
      <td>
        <div class="student-cell">
          <div class="stu-av">${initials}</div>
          <div>
            <div class="stu-name">${esc(s.name)}</div>
            <div class="stu-email">${esc(s.email)}</div>
          </div>
        </div>
      </td>
      <td><code>${esc(s.rollNo)}</code></td>
      <td>${esc(s.department)}</td>
      <td>Sem ${esc(s.semester)}</td>
      <td><span class="gpa-badge ${gpaC}">${Number(s.gpa).toFixed(2)}</span></td>
      <td><span class="status-tag st-${esc(s.status)}">${esc(s.status)}</span></td>
      <td>
        <div class="tbl-actions">
          <button class="tbl-btn btn-view" data-id="${s.id}">View</button>
          ${isAdmin?`<button class="tbl-btn btn-edit" data-id="${s.id}">Edit</button>
          <button class="tbl-btn tbl-btn-del btn-del" data-id="${s.id}">Delete</button>`:''}
        </div>
      </td>
    </tr>`;
  }).join('');

  container.innerHTML = `<div class="table-wrap"><table class="data-table">
    <thead><tr>
      <th>Student</th><th>Roll No.</th><th>Department</th>
      <th>Semester</th><th>GPA</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;

  container.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', ()=> onView?.(+b.dataset.id)));
  container.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', ()=> onEdit?.(+b.dataset.id)));
  container.querySelectorAll('.btn-del').forEach(b  => b.addEventListener('click', ()=> onDelete?.(+b.dataset.id)));
}

// ── COURSES ─────────────────────────────────────────────────────────────────
export function renderCourses(items, container) {
  if (!items?.length) { container.innerHTML = emptyState('📚','No Courses Found','Try adjusting filters.'); return; }

  container.innerHTML = `<div class="courses-grid">${items.map(c => `
    <article class="course-card">
      <div class="course-code-row">
        <span class="course-code">${esc(c.code)}</span>
        <span class="status-tag st-${esc(c.status)}">${esc(c.status)}</span>
      </div>
      <div class="course-title">${esc(c.title)}</div>
      <div class="course-instructor">👨‍🏫 ${esc(c.instructor)}</div>
      <div class="course-desc">${esc(c.description)}</div>
      <div class="course-footer">
        <span>🏛 ${esc(c.department)}</span>
        <span>⭐ ${esc(c.credits)} credits</span>
        <span>Sem ${esc(c.semester)}</span>
        <span>Enrolled: ${esc(c.enrolled)}/${esc(c.capacity)}</span>
      </div>
    </article>`).join('')}</div>`;
}

// ── FAQS ────────────────────────────────────────────────────────────────────
export function renderFaqs(items, container, { onHelpful } = {}) {
  if (!items?.length) { container.innerHTML = emptyState('❓','No FAQs Found','Try changing the category.'); return; }

  container.innerHTML = `<div class="faqs-list">${items.map(f => `
    <div class="faq-card" data-id="${f.id}">
      <div class="faq-head" tabindex="0" role="button" aria-expanded="false">
        <div class="faq-q-wrap">
          <span class="faq-q-badge">Q</span>
          <span class="faq-question">${esc(f.question)}</span>
        </div>
        <div class="faq-meta-right">
          <span class="faq-cat-tag">${esc(f.category)}</span>
          <span class="faq-arrow">▼</span>
        </div>
      </div>
      <div class="faq-body">
        <div class="faq-answer">${esc(f.answer)}</div>
        <div class="faq-stats">
          <span>Updated: ${esc(f.dateUpdated)} &bull; 👁 ${esc(f.views)} views</span>
          <button class="btn-helpful" data-id="${f.id}">👍 Helpful (${esc(f.helpfulCount)})</button>
        </div>
      </div>
    </div>`).join('')}</div>`;

  container.querySelectorAll('.faq-head').forEach(head => {
    const toggle = () => {
      const card = head.closest('.faq-card');
      const open = card.classList.toggle('open');
      head.setAttribute('aria-expanded', open);
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
  });

  container.querySelectorAll('.btn-helpful').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); onHelpful?.(+btn.dataset.id, btn); })
  );
}

// ── INQUIRIES (Practical 7) ─────────────────────────────────────────────────
export function renderInquiries(items, container, { onSubmit, onExport } = {}) {
  const rows = (!items?.length)
    ? `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem;">No registrations yet.</td></tr>`
    : items.map(q => `<tr>
        <td>
          <div class="stu-name">${esc(q.name)}</div>
          <div class="stu-email">${esc(q.email)}</div>
        </td>
        <td><code>${esc(q.phone)}</code></td>
        <td>${esc(q.course)}</td>
        <td style="font-size:0.8rem;color:var(--text-muted);max-width:200px;">${esc(q.message||'—')}</td>
        <td><span class="status-tag st-${esc((q.status||'New').replace(' ','-'))}">${esc(q.status||'New')}</span></td>
      </tr>`).join('');

  container.innerHTML = `
  <div class="reg-layout">
    <div class="reg-form-card">
      <h3>📝 Course Registration Inquiry</h3>
      <p class="sub">Fill in your details to register interest in a course. (Practical 7 — PHP Form Integration)</p>

      <div class="reg-success" id="reg-ok">✅ Registration submitted successfully!</div>

      <form class="rform" id="reg-form" novalidate>
        <div class="rfield" id="rf-name">
          <label for="ri-name">Full Name *</label>
          <input type="text" id="ri-name" placeholder="e.g. Priya Patel">
          <span class="ferr">Name must be letters only (min 3 chars).</span>
        </div>
        <div class="rfield" id="rf-email">
          <label for="ri-email">Email Address *</label>
          <input type="email" id="ri-email" placeholder="priya@gmail.com">
          <span class="ferr">Enter a valid email address.</span>
        </div>
        <div class="rfield" id="rf-phone">
          <label for="ri-phone">Phone Number *</label>
          <input type="tel" id="ri-phone" maxlength="10" placeholder="10-digit number">
          <span class="ferr">Must be exactly 10 digits.</span>
        </div>
        <div class="rfield" id="rf-course">
          <label for="ri-course">Course Interested In *</label>
          <select id="ri-course">
            <option value="">-- Select Course --</option>
            <option>Computer Science</option>
            <option>Information Technology</option>
            <option>Electronics</option>
            <option>Mechanical</option>
            <option>Civil</option>
          </select>
          <span class="ferr">Please select a course.</span>
        </div>
        <div class="rfield">
          <label for="ri-msg">Message / Purpose</label>
          <textarea id="ri-msg" rows="3" placeholder="Tell us why you are interested..."></textarea>
        </div>
        <button type="submit" class="btn-sm btn-primary" style="width:100%;height:40px;justify-content:center;">🚀 Submit Registration</button>
      </form>
    </div>

    <div class="reg-table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;gap:0.5rem;flex-wrap:wrap;">
        <h3>Submitted Registrations (${items?.length ?? 0})</h3>
        <button class="btn-sm btn-outline" id="reg-export-btn">📥 Download CSV</button>
      </div>
      <div class="table-wrap" style="max-height:440px;overflow-y:auto;">
        <table class="data-table">
          <thead><tr>
            <th>Applicant</th><th>Phone</th><th>Course</th><th>Message</th><th>Status</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </div>`;

  // Form validation & submission
  const form = container.querySelector('#reg-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    const nameEl  = form.querySelector('#ri-name');
    const emailEl = form.querySelector('#ri-email');
    const phoneEl = form.querySelector('#ri-phone');
    const courseEl= form.querySelector('#ri-course');
    const msgEl   = form.querySelector('#ri-msg');

    const setErr = (id, bad) => { form.querySelector(id).classList.toggle('has-err', bad); if(bad) ok=false; };
    setErr('#rf-name',   !/^[a-zA-Z\s]{3,}$/.test(nameEl.value.trim()));
    setErr('#rf-email',  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim()));
    setErr('#rf-phone',  !/^\d{10}$/.test(phoneEl.value.trim()));
    setErr('#rf-course', !courseEl.value);

    if (!ok) return;
    onSubmit?.({
      name:    nameEl.value.trim(),
      email:   emailEl.value.trim(),
      phone:   phoneEl.value.trim(),
      course:  courseEl.value,
      message: msgEl.value.trim(),
      status:  'New',
      timestamp: new Date().toISOString().replace('T',' ').slice(0,19)
    });
    form.reset();
    const ok2 = container.querySelector('#reg-ok');
    if(ok2){ ok2.style.display='block'; setTimeout(()=>ok2.style.display='none',4000); }
  });

  container.querySelector('#reg-export-btn')?.addEventListener('click', () => onExport?.());
}

// ── PAGINATION ───────────────────────────────────────────────────────────────
export function renderPagination(meta, container, onChange) {
  const { totalRecords, totalPages, currentPage, startIndex, endIndex } = meta;
  if (!totalRecords) { container.innerHTML=''; container.style.display='none'; return; }
  container.style.display = 'flex';

  let btns = '';
  for (let i=1; i<=totalPages; i++) {
    btns += `<button class="pg-btn${i===currentPage?' active':''}" data-p="${i}">${i}</button>`;
  }

  container.innerHTML = `
    <div class="pg-info">Showing <strong>${startIndex}–${endIndex}</strong> of <strong>${totalRecords}</strong></div>
    <div class="pg-btns">
      <button class="pg-btn" id="pg-prev" ${currentPage===1?'disabled':''}>‹ Prev</button>
      ${btns}
      <button class="pg-btn" id="pg-next" ${currentPage===totalPages?'disabled':''}>Next ›</button>
    </div>`;

  container.querySelectorAll('.pg-btn[data-p]').forEach(b =>
    b.addEventListener('click', () => onChange?.(+b.dataset.p))
  );
  container.querySelector('#pg-prev')?.addEventListener('click', () => { if(currentPage>1) onChange?.(currentPage-1); });
  container.querySelector('#pg-next')?.addEventListener('click', () => { if(currentPage<totalPages) onChange?.(currentPage+1); });
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function emptyState(icon, title, sub) {
  return `<div class="empty-state">
    <div class="empty-icon">${icon}</div>
    <h3>${title}</h3>
    <p>${sub}</p>
  </div>`;
}
