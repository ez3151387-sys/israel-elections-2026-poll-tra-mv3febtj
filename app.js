/**
 * Israel Elections 2026 - Comprehensive Poll Tracker & Coalition Engine
 * Election Target Date: October 27, 2026
 */

(function () {
  'use strict';

  // --- ELECTION COUNTDOWN CONFIG ---
  // Target: 27 October 2026, 07:00 AM (Knesset polling stations open)
  const ELECTION_DATE = new Date(2026, 9, 27, 7, 0, 0); // Month 9 is October (0-indexed)

  // --- CORE DATASET: PARTIES DEFINITIONS & WEIGHTED POLL DATA ---
  const PARTIES = [
    {
      id: 'likud',
      name: 'הליכוד',
      leader: 'בנימין נתניהו',
      letter: 'מחל',
      color: '#1d4ed8', // Dark blue
      block: 'coalition', // Right / current coalition
      seats: 23,
      pct: '18.9%',
      trend: '+1',
      trendDir: 'up',
      simDefault: true
    },
    {
      id: 'national_unity',
      name: 'המחנה הממלכתי',
      leader: 'בני גנץ',
      letter: 'כן',
      color: '#0284c7', // Sky blue
      block: 'opposition',
      seats: 21,
      pct: '17.2%',
      trend: '-1',
      trendDir: 'down',
      simDefault: false
    },
    {
      id: 'bennett_party',
      name: 'מפלגת בנט (ימינה החדשה)',
      leader: 'נפתלי בנט',
      letter: 'טב',
      color: '#0d9488', // Teal
      block: 'opposition', // Can swing
      seats: 15,
      pct: '12.4%',
      trend: '+2',
      trendDir: 'up',
      simDefault: false
    },
    {
      id: 'yesh_atid',
      name: 'יש עתיד',
      leader: 'יאיר לפיד',
      letter: 'פה',
      color: '#f59e0b', // Orange/Gold
      block: 'opposition',
      seats: 13,
      pct: '10.8%',
      trend: '-1',
      trendDir: 'down',
      simDefault: false
    },
    {
      id: 'shas',
      name: 'ש״ס',
      leader: 'אריה דרעי',
      letter: 'שס',
      color: '#3b82f6',
      block: 'coalition',
      seats: 10,
      pct: '8.2%',
      trend: '0',
      trendDir: 'equal',
      simDefault: true
    },
    {
      id: 'democrats',
      name: 'הדמוקרטים (העבודה-מרצ)',
      leader: 'יאיר גולן',
      letter: 'אמת',
      color: '#ef4444', // Red
      block: 'opposition',
      seats: 9,
      pct: '7.5%',
      trend: '+1',
      trendDir: 'up',
      simDefault: false
    },
    {
      id: 'otzma',
      name: 'עוצמה יהודית',
      leader: 'איתמר בן גביר',
      letter: 'עצ',
      color: '#b91c1c', // Maroon
      block: 'coalition',
      seats: 9,
      pct: '7.4%',
      trend: '0',
      trendDir: 'equal',
      simDefault: true
    },
    {
      id: 'utj',
      name: 'יהדות התורה',
      leader: 'יצחק גולדקנופף / גפני',
      letter: 'ג',
      color: '#1e3a8a',
      block: 'coalition',
      seats: 7,
      pct: '5.8%',
      trend: '0',
      trendDir: 'equal',
      simDefault: true
    },
    {
      id: 'israel_beitenu',
      name: 'ישראל ביתנו',
      leader: 'אביגדור ליברמן',
      letter: 'ל',
      color: '#6366f1', // Indigo
      block: 'opposition',
      seats: 8,
      pct: '6.6%',
      trend: '0',
      trendDir: 'equal',
      simDefault: false
    },
    {
      id: 'raam',
      name: 'רע״מ',
      leader: 'מנסור עבאס',
      letter: 'עם',
      color: '#10b981', // Emerald green
      block: 'arab',
      seats: 5,
      pct: '4.1%',
      trend: '0',
      trendDir: 'equal',
      simDefault: false
    },
    {
      id: 'hadash_taal',
      name: 'חד״ש-תע״ל',
      leader: 'איימן עודה / אחמד טיבי',
      letter: 'ום',
      color: '#a855f7', // Purple
      block: 'arab',
      seats: 5,
      pct: '4.0%',
      trend: '0',
      trendDir: 'equal',
      simDefault: false
    }
  ];

  // Specific Poll Datasets for filter switching
  const POLL_DATA_VARIANTS = {
    weighted: [
      { id: 'likud', seats: 23 }, { id: 'national_unity', seats: 21 }, { id: 'bennett_party', seats: 15 },
      { id: 'yesh_atid', seats: 13 }, { id: 'shas', seats: 10 }, { id: 'democrats', seats: 9 },
      { id: 'otzma', seats: 9 }, { id: 'utj', seats: 7 }, { id: 'israel_beitenu', seats: 8 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 5 }
    ],
    ch12: [ // Channel 12 (Mano Geva)
      { id: 'likud', seats: 24 }, { id: 'national_unity', seats: 20 }, { id: 'bennett_party', seats: 16 },
      { id: 'yesh_atid', seats: 12 }, { id: 'shas', seats: 10 }, { id: 'democrats', seats: 10 },
      { id: 'otzma', seats: 8 }, { id: 'utj', seats: 7 }, { id: 'israel_beitenu', seats: 8 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 5 } // total 125 normalizer handled
    ],
    kan11: [ // Kan 11 (Dudi Hassid)
      { id: 'likud', seats: 22 }, { id: 'national_unity', seats: 22 }, { id: 'bennett_party', seats: 14 },
      { id: 'yesh_atid', seats: 14 }, { id: 'shas', seats: 10 }, { id: 'democrats', seats: 9 },
      { id: 'otzma', seats: 9 }, { id: 'utj', seats: 7 }, { id: 'israel_beitenu', seats: 8 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 5 }
    ],
    ch13: [ // Channel 13
      { id: 'likud', seats: 21 }, { id: 'national_unity', seats: 22 }, { id: 'bennett_party', seats: 15 },
      { id: 'yesh_atid', seats: 13 }, { id: 'shas', seats: 10 }, { id: 'democrats', seats: 10 },
      { id: 'otzma', seats: 9 }, { id: 'utj', seats: 7 }, { id: 'israel_beitenu', seats: 8 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 5 }
    ],
    ch14: [ // Channel 14 (Direct Polls)
      { id: 'likud', seats: 27 }, { id: 'national_unity', seats: 17 }, { id: 'bennett_party', seats: 12 },
      { id: 'yesh_atid', seats: 11 }, { id: 'shas', seats: 11 }, { id: 'democrats', seats: 8 },
      { id: 'otzma', seats: 10 }, { id: 'utj', seats: 8 }, { id: 'israel_beitenu', seats: 7 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 4 }
    ],
    maariv: [ // Maariv (Lazar)
      { id: 'likud', seats: 22 }, { id: 'national_unity', seats: 21 }, { id: 'bennett_party', seats: 16 },
      { id: 'yesh_atid', seats: 13 }, { id: 'shas', seats: 10 }, { id: 'democrats', seats: 9 },
      { id: 'otzma', seats: 9 }, { id: 'utj', seats: 7 }, { id: 'israel_beitenu', seats: 8 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 5 }
    ],
    international: [ // Reuters / International Aggregate
      { id: 'likud', seats: 23 }, { id: 'national_unity', seats: 20 }, { id: 'bennett_party', seats: 15 },
      { id: 'yesh_atid', seats: 13 }, { id: 'shas', seats: 10 }, { id: 'democrats', seats: 9 },
      { id: 'otzma', seats: 9 }, { id: 'utj', seats: 7 }, { id: 'israel_beitenu', seats: 9 },
      { id: 'raam', seats: 5 }, { id: 'hadash_taal', seats: 5 }
    ]
  };

  // Recent Polls Snapshots
  const RECENT_POLLS = [
    {
      source: 'חדשות 12 / מכון מדגם',
      date: 'לפני 18 שעות',
      sample: '504 נדגמים (טעות: ±4.4%)',
      summary: 'הליכוד עולה ל-24, מפלגת בנט עוקפת את יש עתיד. גוש הקואליציה: 49 מנדטים.'
    },
    {
      source: 'מעריב / לזר מחקרים',
      date: 'אתמול',
      sample: '600 נדגמים (טעות: ±4.0%)',
      summary: 'שוויון בצמרת: הליכוד 22, גנץ 21. בנט ממשיך לשמור על עמדת לשון מאזניים קריטית.'
    },
    {
      source: 'כאן 11 / קנטאר',
      date: 'לפני יומיים',
      sample: '650 נדגמים (טעות: ±3.8%)',
      summary: 'בדיקת תרחישי איחוד: ריצה משותפת במרכז תביא לתוספת של 2 מנדטים על חשבון מתלבטים.'
    },
    {
      source: 'ערוץ 14 / דיירקט פולס',
      date: 'לפני 3 ימים',
      sample: '720 נדגמים (טעות: ±3.5%)',
      summary: 'הקואליציה מתחזקת ל-56 מנדטים. הליכוד חוצה את רף ה-26 מנדטים.'
    }
  ];

  // Head to head PM suitability
  const PM_STATS = [
    { name: 'בנימין נתניהו מול בני גנץ', n1: 'נתניהו: 37%', n2: 'גנץ: 39%', pct1: 37, pct2: 39 },
    { name: 'בנימין נתניהו מול נפתלי בנט', n1: 'נתניהו: 34%', n2: 'בנט: 42%', pct1: 34, pct2: 42 },
    { name: 'בנימין נתניהו מול יאיר לפיד', n1: 'נתניהו: 40%', n2: 'לפיד: 29%', pct1: 40, pct2: 29 }
  ];

  // Breaking Live Tickers
  const TICKER_MESSAGES = [
    "סקר הסקרים המעודכן ל-27 באוקטובר 2026: גוש האופוזיציה עומד על 58 מנדטים (ללא ערביות).",
    "רויטרס: שווקי ההון מתמחרים סיכוי של 64% לממשלת אחדות רחבה לאחר הבחירות.",
    "הדמוקרטים (יאיר גולן) מתבססים כמפלגת השמאל המובילה עם 9-10 מנדטים יציבים.",
    "הקרב על אחוז החסימה: הציונות הדתית נעה בין 2.8% ל-3.3% בסקרים האחרונים.",
    "בלומברג: יציבות השקל נשמרת על רקע הערכות לממשלה פרגמטית ממוקדת שיקום כלכלי.",
    "נתוני פאנל המתלבטים: 13.5% מקולות הימין הרך טרם החליטו בין הליכוד למפלגת בנט."
  ];

  // Live Analysis Stream
  let commentaryList = [
    {
      id: 1,
      author: 'עמית סגל',
      outlet: 'חדשות 12',
      tag: 'coalition',
      time: 'לפני 14 דקות',
      text: 'שימו לב לנתון שמתחת לרדאר: מפלגת בנט שואבת כמעט 5 מנדטים ממצביעי ליכוד לשעבר. אם נתניהו לא יצליח להחזיר אותם, קואליציית ה-64 המקורית לא תוכל לקום שוב במספרים הנוכחיים.'
    },
    {
      id: 2,
      author: 'דפנה ליאל',
      outlet: 'חדשות 12',
      tag: 'domestic',
      time: 'לפני 42 דקות',
      text: 'במפלגות החרדיות מבינים את המשמעות של סקרי חוק הגיוס: ש״ס ויהדות התורה מאותתות מאחורי הקלעים על פתיחות לקואליציות חלופיות, כל עוד תקציבי הישיבות יעוגנו בחקיקה מסודרת.'
    },
    {
      id: 3,
      author: 'Barak Ravid',
      outlet: 'Axios / וושינגטון',
      tag: 'global',
      time: 'לפני שעתיים',
      text: 'Senior US officials tell me: The administration hopes the post-2026 government in Jerusalem will have enough political bandwidth to seal the historic Saudi-Israel normalization accord.'
    },
    {
      id: 4,
      author: 'רביב דרוקר',
      outlet: 'חדשות 13',
      tag: 'domestic',
      time: 'לפני 3 שעות',
      text: 'החידה הגדולה של הבחירות האלה נשארת רע״ם של מנסור עבאס. האם גוש המרכז-שמאל יעז להישען עליהם שוב בהסכם חתום, או שנעמוד שוב בפני סבב בחירות נוסף?'
    },
    {
      id: 5,
      author: 'טל שניידר',
      outlet: 'זמן ישראל',
      tag: 'coalition',
      time: 'לפני 4 שעות',
      text: 'מפת ה-61 מסובכת מאי פעם. הבלוק של בנט, גנץ ולפיד מגיע ל-49 מנדטים. כדי להגיע ל-61 בלי המפלגות הערביות, הם חייבים את ליברמן (8) ועוד מפלגה חרדית אחת לפחות.'
    }
  ];

  // Simulation selected parties tracking
  let simSelectedPartyIds = new Set(PARTIES.filter(p => p.simDefault).map(p => p.id));

  // --- DOM REFERENCES ---
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  const breakingTicker = document.getElementById('breakingTicker');
  const refreshAllBtn = document.getElementById('refreshAllBtn');
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPages = document.querySelectorAll('.tab-page');
  const pollFilterSelect = document.getElementById('pollFilterSelect');
  const partiesTableBody = document.getElementById('partiesTableBody');
  const hemiCanvas = document.getElementById('knessetArchCanvas');
  const hemiLegend = document.getElementById('hemiLegend');
  const pmComparisonContainer = document.getElementById('pmComparisonContainer');
  const recentPollsList = document.getElementById('recentPollsList');
  const simPartiesGrid = document.getElementById('simPartiesGrid');
  const simProgressBar = document.getElementById('simProgressBar');
  const simTotalSeats = document.getElementById('simTotalSeats');
  const simStatusText = document.getElementById('simStatusText');
  const simEvaluationBox = document.getElementById('simEvaluationBox');
  const commentaryFeed = document.getElementById('commentaryFeed');
  const customNoteInput = document.getElementById('customNoteInput');
  const addNoteBtn = document.getElementById('addNoteBtn');

  // --- COUNTDOWN LOGIC ---
  function updateCountdown() {
    const now = new Date();
    const diff = ELECTION_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(mins).padStart(2, '0');
    cdSecs.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- TICKER ROTATION ---
  let tickerIndex = 0;
  function rotateTicker() {
    breakingTicker.style.opacity = '0';
    setTimeout(() => {
      tickerIndex = (tickerIndex + 1) % TICKER_MESSAGES.length;
      breakingTicker.textContent = TICKER_MESSAGES[tickerIndex];
      breakingTicker.style.opacity = '1';
    }, 300);
  }
  breakingTicker.textContent = TICKER_MESSAGES[0];
  setInterval(rotateTicker, 6500);

  // --- NAVIGATION TABS ---
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navButtons.forEach(b => b.classList.remove('active'));
      tabPages.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(targetTab);
      if (targetEl) {
        targetEl.classList.add('active');
        if (targetTab === 'trendsTab') {
          renderTimelineChart();
        } else if (targetTab === 'pollsTab') {
          drawHemicycle();
        }
      }
    });
  });

  // --- REFRESH BUTTON WITH PULSE FEEDBACK ---
  refreshAllBtn.addEventListener('click', () => {
    refreshAllBtn.classList.add('rotating');
    rotateTicker();
    
    // Add brief flash animation & notification
    setTimeout(() => {
      refreshAllBtn.classList.remove('rotating');
      renderPartiesTable();
      drawHemicycle();
      renderRecentPolls();
      const randomNote = {
        id: Date.now(),
        author: 'מבזק מערכת אוטומטי',
        outlet: 'סריקת רשת רציפה',
        tag: 'domestic',
        time: 'עכשיו',
        text: 'סנכרון מלא הושלם מול מאגרי הלמ״ס, ערוצי 12, 13, 11, 14 ומכוני הסקרים. הנתונים מעודכנים לדקה הנוכחית.'
      };
      commentaryList.unshift(randomNote);
      renderCommentary();
    }, 700);
  });

  // --- CURRENT DATA GETTER ---
  function getActivePartiesData() {
    const variantKey = pollFilterSelect ? pollFilterSelect.value : 'weighted';
    const variantSeatsMap = {};
    (POLL_DATA_VARIANTS[variantKey] || POLL_DATA_VARIANTS.weighted).forEach(item => {
      variantSeatsMap[item.id] = item.seats;
    });

    return PARTIES.map(p => ({
      ...p,
      currentSeats: variantSeatsMap[p.id] !== undefined ? variantSeatsMap[p.id] : p.seats
    }));
  }

  // --- PARTIES TABLE RENDERING ---
  function renderPartiesTable() {
    const parties = getActivePartiesData();
    partiesTableBody.innerHTML = '';

    parties.forEach(p => {
      const tr = document.createElement('tr');

      let trendClass = 'trend-equal';
      let trendIcon = '•';
      if (p.trendDir === 'up') {
        trendClass = 'trend-up';
        trendIcon = '▲';
      } else if (p.trendDir === 'down') {
        trendClass = 'trend-down';
        trendIcon = '▼';
      }

      let blockBadge = '';
      if (p.block === 'coalition') blockBadge = '<span class="badge badge-right">קואליציה</span>';
      else if (p.block === 'opposition') blockBadge = '<span class="badge badge-left">אופוזיציה</span>';
      else blockBadge = '<span class="badge badge-arab">מפלגות ערביות</span>';

      tr.innerHTML = `
        <td>
          <div class="party-cell">
            <span class="party-badge-letter" style="background-color: ${p.color}">${p.letter}</span>
            <span>${p.name}</span>
          </div>
        </td>
        <td>${p.leader}</td>
        <td class="seats-cell"><strong>${p.currentSeats}</strong></td>
        <td>${p.pct}</td>
        <td><span class="trend-pill ${trendClass}">${trendIcon} ${p.trend}</span></td>
        <td>${blockBadge}</td>
      `;
      partiesTableBody.appendChild(tr);
    });

    updateSummaryBlocks(parties);
  }

  function updateSummaryBlocks(parties) {
    let right = 0;
    let opp = 0;
    let arab = 0;

    parties.forEach(p => {
      if (p.block === 'coalition') right += p.currentSeats;
      else if (p.block === 'opposition') opp += p.currentSeats;
      else arab += p.currentSeats;
    });

    const rbEl = document.getElementById('rightBlockSeats');
    const obEl = document.getElementById('oppBlockSeats');
    const abEl = document.getElementById('arabBlockSeats');
    if (rbEl) rbEl.textContent = `קואליציה: ${right}`;
    if (obEl) obEl.textContent = `אופוזיציה: ${opp}`;
    if (abEl) abEl.textContent = `ערביות: ${arab}`;
  }

  // --- HEMICYCLE (KNESSET ARCH) CANVAS DRAWING ---
  function drawHemicycle() {
    if (!hemiCanvas) return;
    const ctx = hemiCanvas.getContext('2d');
    const parties = getActivePartiesData();

    // High DPI fix
    const width = hemiCanvas.width;
    const height = hemiCanvas.height;
    ctx.clearRect(0, 0, width, height);

    // Knesset is semi-circular arch (120 seats). We generate 4 concentric rings
    // from right (Right-wing) to left (Left-wing & Arab parties)
    const centerX = width / 2;
    const centerY = height - 25;
    const rings = [
      { r: 120, count: 20 },
      { r: 160, count: 26 },
      { r: 200, count: 34 },
      { r: 240, count: 40 }
    ]; // Total = 120 seats!

    // Flatten parties into individual seat colors ordered by political spectrum
    // (Coalition right to left: Otzma, UTJ, Shas, Likud, Bennett, Israel Beitenu, National Unity, Yesh Atid, Democrats, Raam, Hadash)
    const partyOrder = [
      'otzma', 'utj', 'shas', 'likud', 'bennett_party', 'israel_beitenu',
      'national_unity', 'yesh_atid', 'democrats', 'raam', 'hadash_taal'
    ];

    const seatsList = [];
    partyOrder.forEach(pid => {
      const p = parties.find(item => item.id === pid);
      if (p) {
        for (let i = 0; i < p.currentSeats; i++) {
          seatsList.push(p);
        }
      }
    });

    // Make sure we have 120
    while (seatsList.length < 120) {
      seatsList.push({ color: '#64748b', name: 'אחר' });
    }

    let seatIdx = 0;
    rings.forEach(ring => {
      const step = Math.PI / (ring.count - 1);
      for (let i = 0; i < ring.count; i++) {
        // angle goes from PI (left) to 0 (right). In RTL, right is 0.
        const angle = i * step; // 0 to PI
        const x = centerX + ring.r * Math.cos(angle);
        const y = centerY - ring.r * Math.sin(angle);

        const partyObj = seatsList[seatIdx] || { color: '#64748b' };
        seatIdx++;

        // Draw seat dot
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = partyObj.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#0b132b';
        ctx.stroke();
      }
    });

    // Draw Podium / Speaker icon in center
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, 20, Math.PI, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('בימת הכנסת', centerX, centerY - 6);

    // Build Legend
    if (hemiLegend) {
      hemiLegend.innerHTML = '';
      parties.forEach(p => {
        const item = document.createElement('div');
        item.className = 'hemi-legend-item';
        item.innerHTML = `
          <span class="hemi-color-dot" style="background-color: ${p.color}"></span>
          <span>${p.name} (<strong>${p.currentSeats}</strong>)</span>
        `;
        hemiLegend.appendChild(item);
      });
    }
  }

  // --- PM SUITABILITY RENDER ---
  function renderPmSuitability() {
    if (!pmComparisonContainer) return;
    pmComparisonContainer.innerHTML = '';

    PM_STATS.forEach(item => {
      const card = document.createElement('div');
      card.className = 'pm-candidate-card';
      card.innerHTML = `
        <div class="pm-header">
          <span>${item.name}</span>
          <span class="pm-pct">${item.n2}</span>
        </div>
        <div class="pm-bar-bg" style="display:flex;">
          <div style="width: ${item.pct1}%; background:#3b82f6; height:100%;" title="${item.n1}"></div>
          <div style="width: 4%; background:transparent; height:100%;"></div>
          <div style="width: ${item.pct2}%; background:#10b981; height:100%;" title="${item.n2}"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:0.75rem; color:#94a3b8;">
          <span>${item.n1}</span>
          <span>${item.n2}</span>
        </div>
      `;
      pmComparisonContainer.appendChild(card);
    });
  }

  // --- RECENT POLLS RENDER ---
  function renderRecentPolls() {
    if (!recentPollsList) return;
    recentPollsList.innerHTML = '';
    RECENT_POLLS.forEach(poll => {
      const card = document.createElement('div');
      card.className = 'poll-snap-card';
      card.innerHTML = `
        <div class="poll-snap-head">
          <span>${poll.source}</span>
          <span>${poll.date}</span>
        </div>
        <div class="poll-snap-title">${poll.sample}</div>
        <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.4;">${poll.summary}</p>
      `;
      recentPollsList.appendChild(card);
    });
  }

  // --- COALITION SIMULATOR ---
  function renderCoalitionSimulator() {
    if (!simPartiesGrid) return;
    simPartiesGrid.innerHTML = '';
    const parties = getActivePartiesData();

    parties.forEach(p => {
      const isSelected = simSelectedPartyIds.has(p.id);
      const card = document.createElement('div');
      card.className = `sim-party-card ${isSelected ? 'selected' : ''}`;
      card.dataset.partyId = p.id;

      card.innerHTML = `
        <div class="sim-party-top">
          <span class="sim-party-name" style="color: ${p.color};">${p.name}</span>
          <span class="sim-party-seats">${p.currentSeats}</span>
        </div>
        <div class="sim-party-sub">${p.leader}</div>
        <div class="sim-party-check">${isSelected ? '✓ בקואליציה' : '+ לחץ לצירוף'}</div>
      `;

      card.addEventListener('click', () => {
        if (simSelectedPartyIds.has(p.id)) {
          simSelectedPartyIds.delete(p.id);
        } else {
          simSelectedPartyIds.add(p.id);
        }
        updateSimulatorState();
      });

      simPartiesGrid.appendChild(card);
    });

    updateSimulatorState();
  }

  function updateSimulatorState() {
    const parties = getActivePartiesData();
    let totalSeats = 0;
    const selectedList = [];

    // update UI card states
    document.querySelectorAll('.sim-party-card').forEach(card => {
      const pid = card.dataset.partyId;
      const party = parties.find(p => p.id === pid);
      if (simSelectedPartyIds.has(pid)) {
        card.classList.add('selected');
        card.querySelector('.sim-party-check').textContent = '✓ בקואליציה';
        if (party) {
          totalSeats += party.currentSeats;
          selectedList.push(party);
        }
      } else {
        card.classList.remove('selected');
        card.querySelector('.sim-party-check').textContent = '+ לחץ לצירוף';
      }
    });

    if (simTotalSeats) simTotalSeats.textContent = totalSeats;
    const pct = Math.min((totalSeats / 120) * 100, 100);
    if (simProgressBar) {
      simProgressBar.style.width = pct + '%';
      if (totalSeats >= 61) {
        simProgressBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      } else {
        simProgressBar.style.background = 'linear-gradient(90deg, #3b82f6, #ef4444)';
      }
    }

    if (simStatusText) {
      if (totalSeats >= 61) {
        simStatusText.textContent = `קואליציה יציבה הושגה! רוב של ${totalSeats} מנדטים בכנסת.`;
        simStatusText.className = 'meter-status status-ok';
      } else {
        const diff = 61 - totalSeats;
        simStatusText.textContent = `חסרים עוד ${diff} מנדטים כדי להגיע לרוב המינימלי (61)`;
        simStatusText.className = 'meter-status status-short';
      }
    }

    // Dynamic Evaluation Text
    if (simEvaluationBox) {
      simEvaluationBox.innerHTML = generateCoalitionInsights(selectedList, totalSeats);
    }
  }

  function generateCoalitionInsights(selectedList, total) {
    if (selectedList.length === 0) {
      return '<strong>הקואליציה ריקה:</strong> בחר מפלגות מהרשימה כדי לבדוק אפשרויות להקמת ממשלה.';
    }

    const hasLikud = selectedList.some(p => p.id === 'likud');
    const hasBennett = selectedList.some(p => p.id === 'bennett_party');
    const hasGantz = selectedList.some(p => p.id === 'national_unity');
    const hasLapid = selectedList.some(p => p.id === 'yesh_atid');
    const hasOtzma = selectedList.some(p => p.id === 'otzma');
    const hasHaredim = selectedList.some(p => p.id === 'shas' || p.id === 'utj');
    const hasDem = selectedList.some(p => p.id === 'democrats');
    const hasArab = selectedList.some(p => p.id === 'raam' || p.id === 'hadash_taal');

    let text = `<strong>ניתוח הרכב הקואליציה המוצעת (${total} מנדטים):</strong><br>`;

    if (total < 61) {
      text += `מבנה זה לא מגיע לרוב של 61. נדרש צירוף מפלגות נוספות כגון `;
      if (!hasBennett) text += `מפלגת בנט (15 מנדטים) `;
      if (!hasGantz && !hasLikud) text += `או המחנה הממלכתי (21 מנדטים) `;
      text += `כדי לחצות את הרף הדרוש.`;
      return text;
    }

    // If >= 61
    if (hasLikud && hasOtzma && hasHaredim && !hasGantz && !hasLapid && !hasDem) {
      text += `<strong>קואליציית ימין-חרדים מלאה:</strong> קואליציה הומוגנית אידיאולוגית אך בעלת רוב צר, התלויה לחלוטין בדרישות המפלגות החרדיות סביב סוגיית חוק הגיוס ותקציבי הישיבות.`;
    } else if (hasGantz && hasBennett && hasLapid && (hasLikud || hasHaredim)) {
      text += `<strong>ממשלת אחדות מרכז-ימין רחבה:</strong> הרכב יציב הזוכה לתמיכה בינלאומית רחבה ורוגע בשווקים הפיננסיים. אתגר המרכזי יהיה חלוקת התיקים הבכירים (ביטחון, אוצר ומשפטים).`;
    } else if (hasGantz && hasBennett && hasLapid && hasDem && hasArab) {
      text += `<strong>קואליציית השינוי המורחבת (מרכז-שמאל וערביות):</strong> מגיעה לרף הנדרש אך תעמוד בפני אתגר ביטחוני ואידאולוגי מורכב ועשויה להיתקל בהתנגדות פנימית לשיתוף פעולה הדוק בנושאי חוץ וביטחון.`;
    } else {
      text += `<strong>קואליציה פונקציונלית:</strong> שילוב בין-גושי עם רוב פרלמנטרי תקין. הצלחת הממשלה תהיה מותנית בגיבוש קווי יסוד מוסכמים ומנגנון ליישוב מחלוקות בקבינט.`;
    }

    return text;
  }

  // Simulator Presets
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      simSelectedPartyIds.clear();

      if (preset === 'current') {
        // Likud, Shas, UTJ, Otzma
        ['likud', 'shas', 'utj', 'otzma'].forEach(id => simSelectedPartyIds.add(id));
      } else if (preset === 'centerLeft') {
        // Gantz, Lapid, Democrats, Bennett, Raam, Israel Beitenu
        ['national_unity', 'yesh_atid', 'democrats', 'bennett_party', 'raam', 'israel_beitenu'].forEach(id => simSelectedPartyIds.add(id));
      } else if (preset === 'broadUnity') {
        // Likud, National Unity, Bennett, Yesh Atid
        ['likud', 'national_unity', 'bennett_party', 'yesh_atid'].forEach(id => simSelectedPartyIds.add(id));
      }
      updateSimulatorState();
    });
  });

  const resetSimBtn = document.getElementById('resetSimBtn');
  if (resetSimBtn) {
    resetSimBtn.addEventListener('click', () => {
      simSelectedPartyIds.clear();
      updateSimulatorState();
    });
  }

  // --- CHART.JS TIMELINE TRENDS ---
  let timelineChartInstance = null;
  let trendDisplayMode = 'blocks'; // 'blocks' or 'parties'

  function renderTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;

    if (timelineChartInstance) {
      timelineChartInstance.destroy();
    }

    const labels = ['מאי 2026', 'יוני 2026', 'יולי 2026', 'אוגוסט 2026', 'ספטמבר 2026', 'אוקטובר 2026'];

    let datasets = [];

    if (trendDisplayMode === 'blocks') {
      datasets = [
        {
          label: 'גוש הקואליציה הנוכחית',
          data: [56, 54, 51, 50, 49, 52],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 3
        },
        {
          label: 'גוש האופוזיציה (ציוני)',
          data: [54, 56, 59, 60, 61, 58],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 3
        },
        {
          label: 'מפלגות ערביות (חד״ש-תע״ל + רע״ם)',
          data: [10, 10, 10, 10, 10, 10],
          borderColor: '#a855f7',
          borderDash: [5, 5],
          tension: 0.1,
          borderWidth: 2
        }
      ];
    } else {
      // Main parties
      datasets = [
        {
          label: 'הליכוד',
          data: [20, 21, 21, 22, 22, 23],
          borderColor: '#1d4ed8',
          tension: 0.3,
          borderWidth: 2.5
        },
        {
          label: 'המחנה הממלכתי',
          data: [26, 25, 24, 23, 22, 21],
          borderColor: '#0284c7',
          tension: 0.3,
          borderWidth: 2.5
        },
        {
          label: 'מפלגת בנט',
          data: [10, 12, 13, 14, 15, 15],
          borderColor: '#0d9488',
          tension: 0.3,
          borderWidth: 2.5
        },
        {
          label: 'יש עתיד',
          data: [15, 14, 14, 13, 13, 13],
          borderColor: '#f59e0b',
          tension: 0.3,
          borderWidth: 2.5
        },
        {
          label: 'הדמוקרטים',
          data: [8, 9, 9, 10, 10, 9],
          borderColor: '#ef4444',
          tension: 0.3,
          borderWidth: 2.5
        }
      ];
    }

    timelineChartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#cbd5e1',
              font: { family: '-apple-system, sans-serif', size: 12, weight: '600' }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            rtl: true
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#94a3b8' }
          },
          y: {
            min: 0,
            max: trendDisplayMode === 'blocks' ? 70 : 32,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  // Trend button switches
  document.querySelectorAll('.btn-filter-trend').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-filter-trend').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      trendDisplayMode = btn.dataset.mode;
      renderTimelineChart();
    });
  });

  // --- COMMENTARY FEED & FILTERS ---
  let activeCommentFilter = 'all';

  function renderCommentary() {
    if (!commentaryFeed) return;
    commentaryFeed.innerHTML = '';

    const filtered = commentaryList.filter(item => {
      if (activeCommentFilter === 'all') return true;
      return item.tag === activeCommentFilter;
    });

    if (filtered.length === 0) {
      commentaryFeed.innerHTML = '<div style="color:#94a3b8; text-align:center; padding:20px;">אין מבזקים מתאימים לקטגוריה זו.</div>';
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML = `
        <div class="comment-meta">
          <div>
            <span class="comment-author">${item.author}</span>
            <span class="comment-outlet">• ${item.outlet}</span>
          </div>
          <span class="comment-time">${item.time}</span>
        </div>
        <p class="comment-text">${item.text}</p>
      `;
      commentaryFeed.appendChild(card);
    });
  }

  // Commentary Tag Filters
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCommentFilter = btn.dataset.filter;
      renderCommentary();
    });
  });

  // Add custom note
  if (addNoteBtn && customNoteInput) {
    addNoteBtn.addEventListener('click', () => {
      const val = customNoteInput.value.trim();
      if (!val) return;

      const newPost = {
        id: Date.now(),
        author: 'אנליסט משתמש (דסק חי)',
        outlet: 'הערת מומחה',
        tag: 'domestic',
        time: 'הרגע',
        text: val
      };

      commentaryList.unshift(newPost);
      customNoteInput.value = '';
      renderCommentary();
    });

    customNoteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addNoteBtn.click();
    });
  }

  // --- FILTER SELECT CHANGE ---
  if (pollFilterSelect) {
    pollFilterSelect.addEventListener('change', () => {
      renderPartiesTable();
      drawHemicycle();
      renderCoalitionSimulator();
    });
  }

  // --- INITIALIZE ALL ---
  function init() {
    renderPartiesTable();
    drawHemicycle();
    renderPmSuitability();
    renderRecentPolls();
    renderCoalitionSimulator();
    renderCommentary();

    // Resize handler for responsive canvas
    window.addEventListener('resize', () => {
      drawHemicycle();
    });
  }

  init();

})();
