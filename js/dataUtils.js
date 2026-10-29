/**
 * dataUtils.js — filter, sort, paginate, and export helpers
 */

// ── GENERIC FILTER ────────────────────────────────────────────────────────
export function filterItems(items, { search='', category='ALL', status='ALL', fields=[] } = {}) {
  const q = search.trim().toLowerCase();
  return items.filter(item => {
    if (q) {
      const hay = fields.map(f => String(item[f]||'')).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (category !== 'ALL') {
      if ((item.category||item.department||'') !== category) return false;
    }
    if (status !== 'ALL') {
      if ((item.status||'') !== status) return false;
    }
    return true;
  });
}

// ── SORT ─────────────────────────────────────────────────────────────────
export function sortItems(items, sortKey) {
  if (!sortKey || sortKey === 'default') return items;
  const [key, dir] = sortKey.split('_');
  const asc = dir !== 'desc';
  return [...items].sort((a, b) => {
    const av = a[key] ?? ''; const bv = b[key] ?? '';
    if (typeof av === 'number' && typeof bv === 'number') return asc ? av-bv : bv-av;
    return asc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}

// ── PAGINATE ─────────────────────────────────────────────────────────────
export function paginate(items, page=1, perPage=6) {
  const total      = items.length;
  const totalPages = Math.max(1, Math.ceil(total/perPage));
  const safePage   = Math.min(Math.max(1,page), totalPages);
  const start      = (safePage-1)*perPage;
  return {
    slice: items.slice(start, start+perPage),
    meta: {
      totalRecords: total,
      totalPages,
      currentPage: safePage,
      perPage,
      startIndex: total===0 ? 0 : start+1,
      endIndex: Math.min(start+perPage, total)
    }
  };
}

// ── EXTRACT UNIQUE VALUES ─────────────────────────────────────────────────
export function uniqueValues(items, field) {
  return [...new Set(items.map(i => i[field]).filter(Boolean))].sort();
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────
export function exportCSV(items, filename='export.csv') {
  if (!items?.length) return;
  const keys = Object.keys(items[0]);
  const header = keys.join(',');
  const body   = items.map(r => keys.map(k => `"${String(r[k]??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([header+'\n'+body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
