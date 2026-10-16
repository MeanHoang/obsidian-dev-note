// Nhân viên (role) của workflow my-ship và nhân vật anime vẽ bằng SVG.
// Bộ vẽ lấy nguyên từ mockup (Obsidian: AI Office/mockup/ai-office-mockup.html).

const ROLES = {
  product: { name: 'Product', vn: 'Sản phẩm', color: '#8e5bd6' },
  scout: { name: 'Scout', vn: 'Trinh sát code', color: '#3b6fb6' },
  parent: { name: 'Parent', vn: 'Trưởng nhóm', color: '#4b5563' },
  implementer: { name: 'Implementer', vn: 'Lập trình', color: '#2f8a4f' },
  verifier: { name: 'Verifier', vn: 'Kiểm chứng', color: '#c98a12' },
  reviewer: { name: 'Reviewer', vn: 'Review', color: '#c0442f' },
  // Phòng trực FB (my-bot)
  watcher: { name: 'Trực tin', vn: 'Watcher đọc Messenger', color: '#3b8fa6' },
  bot: { name: 'Bot', vn: 'Session trả lời', color: '#b05a8a' },
  scheduler: { name: 'Lịch trực', vn: 'Job định kỳ', color: '#d0743c' },
  secretary: { name: 'Thư ký', vn: 'Quản lý phòng ban', color: '#2f6f5e' },
  // Phòng ý tưởng (idea-lab) — trưởng phòng dùng chung 'parent'
  observer: { name: 'Quan sát', vn: 'Hành vi & ma sát', color: '#3b7f9e' },
  trend: { name: 'Xu thế', vn: 'Dịch chuyển 2026–2035', color: '#7b5bc4' },
  market: { name: 'Thị trường', vn: 'Đối thủ & ai trả tiền', color: '#2f8a6a' },
  shaper: { name: 'Phác SP', vn: 'App nhỏ nhất + kiểm chứng', color: '#d07a2c' },
  critic: { name: 'Phản biện', vn: 'Tìm lý do giết ý tưởng', color: '#b8433a' },
  checker: { name: 'Kiểm nguồn', vn: 'Mở lại từng câu trích', color: '#b08a1a' },
  // Phòng tài chính (finance-lab) — trưởng phòng dùng 'parent', phản biện dùng 'critic'
  news: { name: 'Tin tức', vn: 'Tin và phát biểu 24 giờ', color: '#3b6fb6' },
  macro: { name: 'Vĩ mô', vn: 'Lãi suất, USD, Fed', color: '#2f6f5e' },
  technical: { name: 'Kỹ thuật', vn: 'Đọc nến bằng số', color: '#7b5bc4' },
  vietnam: { name: 'Việt Nam', vn: 'SJC và tỷ giá', color: '#c0442f' },
};

const BOT_STATE_VN = { idle: 'Rảnh', working: 'Đang làm', waiting: 'Chờ anh', error: 'Lỗi', done: 'Xong' };

const AVA = {
  product: { hair: '#7a4a2c', style: 'long', eye: '#7a45b8', skin: '#ffe1c9', acc: 'star' },
  scout: { hair: '#2c2c3a', style: 'short', eye: '#2f5d9e', skin: '#f7d6b8', acc: 'glasses' },
  parent: { hair: '#3a2a22', style: 'spiky', eye: '#4a4a4a', skin: '#f3cfae', acc: 'headset' },
  implementer: { hair: '#e0893c', style: 'messy', eye: '#2f7a46', skin: '#ffe0c4', acc: 'headphones' },
  verifier: { hair: '#e9c35c', style: 'ponytail', eye: '#b06b00', skin: '#ffe6d2', acc: 'none' },
  reviewer: { hair: '#1f1f2a', style: 'bob', eye: '#a8322a', skin: '#f8dac2', acc: 'redglasses' },
  watcher: { hair: '#3a3f52', style: 'short', eye: '#2f6f86', skin: '#f6d5b9', acc: 'headset' },
  bot: { hair: '#e39bbd', style: 'bob', eye: '#8a3d6b', skin: '#ffe3d3', acc: 'glasses' },
  scheduler: { hair: '#a2502a', style: 'long', eye: '#8a4b1f', skin: '#ffe2cc', acc: 'pencil' },
  secretary: { hair: '#5b3424', style: 'ponytail', eye: '#8a3d6b', skin: '#ffe4d4', acc: 'headset' },
  observer: { hair: '#2e3a4a', style: 'short', eye: '#2f6f86', skin: '#f7d6b8', acc: 'glasses' },
  trend: { hair: '#6a3fa0', style: 'long', eye: '#6a3fa0', skin: '#ffe1c9', acc: 'star' },
  market: { hair: '#1f3a2e', style: 'spiky', eye: '#2f7a46', skin: '#f3cfae', acc: 'none' },
  shaper: { hair: '#e0893c', style: 'messy', eye: '#a85a1c', skin: '#ffe0c4', acc: 'pencil' },
  critic: { hair: '#1f1f2a', style: 'bob', eye: '#a8322a', skin: '#f8dac2', acc: 'redglasses' },
  checker: { hair: '#e9c35c', style: 'ponytail', eye: '#8a6a00', skin: '#ffe6d2', acc: 'glasses' },
  news: { hair: '#2c2c3a', style: 'bob', eye: '#2f5d9e', skin: '#f7d6b8', acc: 'headset' },
  macro: { hair: '#4a3626', style: 'short', eye: '#2f6f5e', skin: '#f3cfae', acc: 'glasses' },
  technical: { hair: '#6a3fa0', style: 'spiky', eye: '#6a3fa0', skin: '#ffe0c4', acc: 'headphones' },
  vietnam: { hair: '#1f1f2a', style: 'long', eye: '#a8322a', skin: '#ffe4d4', acc: 'star' },
};

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 255) + amt);
  const b = clamp((n & 255) + amt);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/** Chuỗi SVG của một nhân vật. Biểu cảm đổi theo trạng thái (working/waiting/error/done/idle). */
function avatarSvg(role, state = 'working') {
  const a = AVA[role] || AVA.parent;
  const shirt = (ROLES[role] || ROLES.parent).color;
  const H = a.hair;
  const Hd = shade(H, -25);
  const sk = a.skin;
  const skd = shade(sk, -22);
  const ink = '#2a1a14';
  const st = state;

  const back =
    {
      long: `<path d="M13 30 Q12 9 32 9 Q52 9 51 30 L53 54 Q44 58 40 50 L24 50 Q20 58 11 54 Z" fill="${Hd}"/>`,
      bob: `<path d="M12.5 33 Q11 9 32 9 Q53 9 51.5 33 L51 44 Q45 47 42 42 L22 42 Q19 47 13 44 Z" fill="${Hd}"/>`,
      ponytail: `<path d="M47 20 Q62 22 58 42 Q57 50 52 52 Q55 40 47 31 Z" fill="${Hd}"/><circle cx="48.5" cy="21" r="2.6" fill="#ff6b8a"/>`,
    }[a.style] || '';
  const fringe = {
    long: `<path d="M15.5 31 Q14 11 32 11 Q50 11 48.5 31 Q47 22 41 19.5 L37 25 L34.5 19 Q27 25 18.5 24.5 Z" fill="${H}"/>`,
    bob: `<path d="M15.5 33 Q14 11 32 11 Q50 11 48.5 33 Q48 22 44 18 Q36 24 22 21 Q17 24 15.5 33 Z" fill="${H}"/>`,
    ponytail: `<path d="M16 30 Q15 11 32 11 Q49 11 48 30 Q45 20 38 18.5 Q34 24 25 22 Q19 23 16 30 Z" fill="${H}"/>`,
    short: `<path d="M16 29 Q15 11 32 11 Q49 11 48 29 Q46 20 39 18.5 Q33 23 25 21 Q19 22 16 29 Z" fill="${H}"/>`,
    spiky: `<path d="M16 29 L13.5 19 L19.5 20.5 L19 12 L25.5 16 L29.5 7.5 L33.5 15 L40 8.5 L41.5 16.5 L48.5 13.5 L47 21.5 L50.5 27 Q44 20 33 21 Q22 21 16 29 Z" fill="${H}"/>`,
    messy: `<path d="M15.5 30 Q13 14 24 11 Q30 7 38 10 Q50 12 48.5 30 Q46 22 42 21 L40 25 L37 20 L33 25 L30 20 L26 25 L23 21 Q18 23 15.5 30 Z" fill="${H}"/>`,
  }[a.style];
  const eye = (cx) => {
    if (st === 'done')
      return `<path d="M${cx - 3} 33.5 Q${cx} 29.5 ${cx + 3} 33.5" stroke="${ink}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
    if (st === 'idle')
      return `<path d="M${cx - 3} 32.8 Q${cx} 34.2 ${cx + 3} 32.8" stroke="${ink}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    if (st === 'error')
      return cx < 32
        ? `<path d="M${cx - 2.6} 30 L${cx + 2.4} 32.6 L${cx - 2.6} 35.2" stroke="${ink}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<path d="M${cx + 2.6} 30 L${cx - 2.4} 32.6 L${cx + 2.6} 35.2" stroke="${ink}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<ellipse cx="${cx}" cy="32.6" rx="2.9" ry="3.9" fill="${ink}"/><ellipse cx="${cx}" cy="33.4" rx="2.1" ry="2.7" fill="${a.eye}"/><circle cx="${cx - 1}" cy="31.3" r="1.15" fill="#fff"/><circle cx="${cx + 1}" cy="34.3" r=".55" fill="#fff"/><path d="M${cx - 3.6} 29 Q${cx} 27.2 ${cx + 3.6} 29" stroke="${ink}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  };
  const brows =
    st === 'waiting'
      ? `<path d="M23 26.2 Q26 24.6 29 26" stroke="${Hd}" stroke-width="1.2" fill="none"/><path d="M35 26 Q38 24.6 41 26.2" stroke="${Hd}" stroke-width="1.2" fill="none"/>`
      : st === 'working'
        ? `<path d="M23.2 26.6 L28.6 27.4" stroke="${Hd}" stroke-width="1.2"/><path d="M35.4 27.4 L40.8 26.6" stroke="${Hd}" stroke-width="1.2"/>`
        : '';
  const mouth = {
    working: `<path d="M30.2 40.2 Q32 41.2 33.8 40.2" stroke="${ink}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
    done: `<path d="M29 39 Q32 43.6 35 39 Z" fill="#c2475a"/>`,
    waiting: `<ellipse cx="32" cy="40.6" rx="1.5" ry="1.9" fill="#c2475a"/>`,
    error: `<path d="M28.8 41.4 q1.6 -1.6 3.2 0 t3.2 0" stroke="${ink}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
    idle: `<path d="M30.6 40.4 H33.4" stroke="${ink}" stroke-width="1.1" stroke-linecap="round"/>`,
  }[st];
  const acc = {
    star: `<path d="M44 15.5 l1.3 2.7 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4z" fill="#ffd34d" stroke="#d9a400" stroke-width=".5"/>`,
    glasses: `<g stroke="#3a3a46" stroke-width="1.2" fill="rgba(255,255,255,.18)"><circle cx="26" cy="32.6" r="4.8"/><circle cx="38" cy="32.6" r="4.8"/></g><path d="M30.8 32.4 H33.2" stroke="#3a3a46" stroke-width="1.2"/>`,
    redglasses: `<g stroke="#c0442f" stroke-width="1.4" fill="rgba(255,255,255,.15)"><rect x="21" y="29" width="10" height="7.4" rx="2.4"/><rect x="33" y="29" width="10" height="7.4" rx="2.4"/></g><path d="M31 32 H33" stroke="#c0442f" stroke-width="1.4"/>`,
    headset: `<path d="M14.5 31 Q14 10 32 10 Q50 10 49.5 31" stroke="#30343b" stroke-width="2.4" fill="none"/><rect x="11.5" y="27" width="5.5" height="10" rx="2.5" fill="#30343b"/><rect x="47" y="27" width="5.5" height="10" rx="2.5" fill="#30343b"/><path d="M14 36.5 Q16 43 25 42" stroke="#30343b" stroke-width="1.5" fill="none"/><circle cx="25.5" cy="42" r="1.4" fill="#30343b"/>`,
    headphones: `<path d="M14.5 30 Q14 9 32 9 Q50 9 49.5 30" stroke="#2f8a4f" stroke-width="3" fill="none"/><rect x="10.5" y="26" width="7" height="11" rx="3.4" fill="#2f8a4f"/><rect x="46.5" y="26" width="7" height="11" rx="3.4" fill="#2f8a4f"/><circle cx="14" cy="31.5" r="1.6" fill="#bff0d0"/><circle cx="50" cy="31.5" r="1.6" fill="#bff0d0"/>`,
    pencil: `<g transform="rotate(-35 47 22)"><rect x="44" y="12" width="3.4" height="15" fill="#ffcc4d"/><path d="M44 27 L45.7 31 L47.4 27 Z" fill="#f1d6b0"/><rect x="44" y="11" width="3.4" height="2.4" fill="#e66"/></g>`,
    none: '',
  }[a.acc];
  const sweat =
    st === 'error'
      ? `<path d="M48.5 21 q3.2 4.2 0 6.4 q-3.2 -2.2 0 -6.4z" fill="#7cc4ff" stroke="#4aa3e8" stroke-width=".5"/>`
      : '';
  return `<svg viewBox="0 0 64 64" aria-hidden="true">${back}<path d="M9 64 Q11 47.5 32 46.5 Q53 47.5 55 64 Z" fill="${shirt}"/><path d="M25 47.5 L32 54.5 L39 47.5 Q32 49.5 25 47.5 Z" fill="#fff" opacity=".92"/><rect x="28.2" y="41" width="7.6" height="7.5" rx="2" fill="${skd}"/><ellipse cx="16.6" cy="33" rx="2.4" ry="3.2" fill="${skd}"/><ellipse cx="47.4" cy="33" rx="2.4" ry="3.2" fill="${skd}"/><ellipse cx="32" cy="30.5" rx="15.6" ry="15.8" fill="${sk}"/><path d="M18 38 Q32 48.5 46 38 Q41 46.5 32 46.5 Q23 46.5 18 38 Z" fill="${sk}"/>${fringe}${brows}${eye(26)}${eye(38)}<ellipse cx="21.8" cy="37.6" rx="2.7" ry="1.4" fill="#ff8fa3" opacity=".55"/><ellipse cx="42.2" cy="37.6" rx="2.7" ry="1.4" fill="#ff8fa3" opacity=".55"/>${mouth}${acc}${sweat}</svg>`;
}
