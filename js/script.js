(function(){
"use strict";

/* ---------- camp moments (categories) ---------- */
var CATS = [
  {id:'arrival',   name:'Arrival & Setup',     color:'#1F6FB8', bg:'#C9EBFF', icon:'M5 16V6a2 2 0 012-2h10a2 2 0 012 2v10M5 11h14M8 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'},
  {id:'icebreak',  name:'Ice-Breaking',        color:'#0E857B', bg:'#C4F5E6', icon:'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 100-5M21 20c0-2.6-1.6-4.8-4-5.6'},
  {id:'debate',    name:'Parliamentary Debate',color:'#6A3FD6', bg:'#E3D8FF', icon:'M4 5h16v10H9l-5 4z'},
  {id:'questrace', name:'QuestRace',           color:'#C2600F', bg:'#FFE0C2', icon:'M5 21V4M5 4h11l-2 4 2 4H5'},
  {id:'integrity', name:'Integrity Session',   color:'#1D8048', bg:'#CFF5D9', icon:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5'},
  {id:'groups',    name:'Group Activities',    color:'#9A6B00', bg:'#FFF0A8', icon:'M12 2l2.4 6.8L21 11l-6.6 2.2L12 20l-2.4-6.8L3 11l6.6-2.2z'},
  {id:'cultural',  name:'Cultural Night',      color:'#C2306E', bg:'#FFD2E6', icon:'M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z'},
  {id:'closing',   name:'Closing Ceremony',    color:'#A85A00', bg:'#FFE3A3', icon:'M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 3M16 6h3a3 3 0 01-3 3M12 13v4M8 21h8M9 17h6'}
];
function cat(id){ return CATS.find(function(c){return c.id===id}) || CATS[0]; }
var GROUP_COUNT = 9;

/* ---------- demo posts (img/demo) — set to false before the real camp ---------- */
var SEED_DEMO = true;
var DEMO = [
  // [file, moment, day, hour, title, description, credit, group, status, challenge, reactions ❤️😂🔥👑]
  ['09', 'arrival',   25, 10, 'On the road to Muadzam Shah 🚗', 'Snacks packed, playlist ready. Let\'s go!', 'Facilitator', '1', 'approved', 'roadtrip', [6,4,2,1]],
  ['08', 'arrival',   25, 15, 'Hello, ASPURI hostel!', 'Our home for the next three days.', 'Media Team', '', 'approved', 'newhome', [5,0,1,0]],
  ['11', 'arrival',   25, 16, 'Facilitators\' rest room is ready', 'Beds made, fans on. Rest well, team!', 'Logistic Team', '', 'approved', '', [3,1,0,0]],
  ['13', 'arrival',   25, 17, 'Room check done ✅', 'Clean, comfy and cute bedsheets.', 'Logistic Team', '6', 'approved', '', [2,2,0,0]],
  ['02', 'icebreak',  25, 17, 'Group cheer energy!', 'Loudest group wins, and we were LOUD.', 'Media Team', '3', 'approved', 'cheer', [12,3,9,4]],
  ['14', 'debate',    25, 21, 'The debate chamber is set', 'Order, order! Parliamentary Debate starts tonight.', 'Activity Team', '', 'approved', '', [4,0,2,1]],
  ['03', 'questrace', 26,  8, 'Team photo before QuestRace', 'Peace signs up before checkpoint 1!', 'Facilitator', '5', 'approved', 'checkpoint', [9,2,6,3]],
  ['10', 'integrity', 26, 10, 'Hall ready for the integrity session', 'Mats down, ready to share and reflect.', 'Activity Team', '', 'approved', '', [3,0,0,1]],
  ['04', 'groups',    26, 15, 'Facilitator squad 😎', 'Siput Menyanyi crew, reporting for duty.', 'Media Team', '7', 'approved', 'newfriend', [8,5,4,2]],
  ['01', 'groups',    26, 16, 'LDK: Siapa Saya? Thumbs up!', 'Answering the big question with a big thumbs up.', 'Anonymous', '8', 'approved', 'firstsmile', [5,6,1,0]],
  ['05', 'cultural',  26, 22, 'Supper after Cultural Night', 'Well earned after that performance! Spot the yellow table.', 'Facilitator', '3', 'approved', 'yellow', [7,4,3,1]],
  ['12', 'closing',   27, 12, 'Farewell lunch at Dewan Makan', 'Last meal together before the closing ceremony.', 'Logistic Team', '', 'approved', '', [4,0,1,0]],
  ['07', 'closing',   27, 13, 'One last group photo', 'Dare to lead, dare to smile! 👑', 'Media Team', '5', 'approved', 'goodbye', [15,3,7,6]],
  // waiting in the admin queue for the demo
  ['06', 'questrace', 26,  9, 'Checkpoint spotted: goats! 🐐', 'Not part of the race, but we had to stop.', 'Anonymous', '2', 'pending', '', [0,0,0,0]],
  ['15', 'questrace', 26, 11, 'QuestRace route check', 'Courtyard is clear, checkpoint 3 is through here.', 'Facilitator', '9', 'pending', 'checkpoint', [0,0,0,0]]
];
function seedPosts(){
  if(!SEED_DEMO) return [];
  return DEMO.map(function(d, i){
    return {
      id:'demo'+(i+1), title:d[4], category:d[1], description:d[5],
      displayName:d[6], anonymous:d[6]==='Anonymous', group:d[7],
      image:'img/demo/'+d[0]+'.jpg', date:campDate(d[2], d[3]), status:d[8], challenge:d[9],
      reactions:{heart:d[10][0], laugh:d[10][1], fire:d[10][2], crown:d[10][3]}
    };
  });
}
function campDate(d, h){ return new Date(2026, 10, d, h).toISOString(); }
function fmtDate(iso){ var d = new Date(iso); return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); }
function groupLabel(p){ return p.group ? 'Group '+p.group : ''; }

/* ---------- safety ---------- */
// Never show this site inside someone else's page (stops "clickjacking" tricks).
if(location.protocol === 'https:' && window.top !== window.self){
  try{ window.top.location = window.location.href; }catch(e){ document.documentElement.innerHTML = ''; }
}
// Everything that comes from the database is treated as untrusted: anyone could try to write
// a fake post straight to Firebase, so each post is checked and cleaned before it is shown.
var SAFE_IMG = /^(data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+|img\/demo\/\d{2}\.jpg)$/;
var BLANK_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/AL+3J8AAAAASUVORK5CYII=';
function safeImg(src){ return typeof src === 'string' && SAFE_IMG.test(src) ? src : BLANK_IMG; }
function text(v, max){ return typeof v === 'string' ? v.slice(0, max) : ''; }
function count(v){ return typeof v === 'number' && isFinite(v) && v > 0 ? Math.floor(v) : 0; }
function cleanPost(p){
  if(!p || typeof p !== 'object') return null;
  var r = p.reactions || {};
  var status = ['pending','approved','rejected'].indexOf(p.status) !== -1 ? p.status : 'pending';
  return {
    id: String(p.id || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40),
    title: text(p.title, 80) || 'Untitled', description: text(p.description, 280),
    displayName: text(p.displayName, 40) || 'Anonymous', anonymous: p.anonymous === true,
    category: CATS.some(function(c){ return c.id === p.category; }) ? p.category : CATS[0].id,
    group: /^[1-9]$/.test(p.group) ? p.group : '',
    challenge: /^[a-z]{1,20}$/.test(p.challenge) ? p.challenge : '',
    image: safeImg(p.image), date: isNaN(new Date(p.date)) ? new Date(0).toISOString() : p.date,
    status: status, rejectReason: text(p.rejectReason, 200),
    reactions: {heart:count(r.heart), laugh:count(r.laugh), fire:count(r.fire), crown:count(r.crown)}
  };
}
function cleanPosts(list){ return (Array.isArray(list) ? list : []).map(cleanPost).filter(function(p){ return p && p.id; }); }

// Kind words only: a small filter for obvious rude words (English + Malay). Admins still review everything.
var BAD_WORDS = ['fuck','fck','shit','bitch','bastard','asshole','dick','pussy','porn','nude','nudes','sex','sexy','babi','bodoh','sial','celaka',
  'pukimak','puki','lancau','kimak','pantat','bangsat','anjing','sundal','jalang','butoh','konek','haram jadah','bahlul','keparat'];
var BAD_RE = new RegExp('(^|[^a-z])(' + BAD_WORDS.join('|') + ')([^a-z]|$)', 'i');
function isUnkind(s){ return BAD_RE.test(String(s || '').replace(/[0@]/g, 'o').replace(/[1!]/g, 'i').replace(/3/g, 'e').replace(/\$/g, 's')); }

/* ---------- state + persistence ---------- */
// Cloud mode (Firebase) when js/firebase-config.js is filled in, otherwise a local demo in this browser.
var STORE_KEY = 'prolead_posts_v4';
var posts = [];
var isAdmin = false;
var cloud = null;
var FB = window.PROLEAD_FIREBASE || {};
var ADMIN_EMAILS = (FB.adminEmails || (FB.adminEmail ? [FB.adminEmail] : [])).map(function(e){ return String(e).toLowerCase(); });
if(window.firebase && FB.apiKey){
  try{
    firebase.initializeApp(FB);
    cloud = {db: firebase.firestore(), auth: firebase.auth()};
  }catch(e){ console.error('Firebase failed to start', e); }
}
if(!cloud){
  try{
    var raw = localStorage.getItem(STORE_KEY);
    posts = cleanPosts(raw ? JSON.parse(raw) : seedPosts());
    if(!raw) localStorage.setItem(STORE_KEY, JSON.stringify(posts));
  }catch(e){ posts = cleanPosts(seedPosts()); }
  try{ isAdmin = sessionStorage.getItem('sharespace_admin') === '1'; }catch(e){}
}
function save(){ if(!cloud){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(posts)); }catch(e){} } }

// Swap in a fresh copy of the posts and work out what changed, so the page can react live:
// newly approved photos pop up on the Big Screen, and new reactions float across it.
var REACTS = [{k:'heart', e:'❤️'}, {k:'laugh', e:'😂'}, {k:'fire', e:'🔥'}, {k:'crown', e:'👑'}];
function reactionsOf(p){ return p.reactions || {heart:0, laugh:0, fire:0, crown:0}; }
function postsSig(list){ return list.map(function(p){ return p.id + ':' + p.status; }).sort().join('|'); }
function applyPosts(next, initial){
  next = cleanPosts(next);
  var prev = {};
  posts.forEach(function(p){ prev[p.id] = p; });
  var structural = postsSig(posts) !== postsSig(next);
  posts = next;
  if(initial){ renderCurrent(); return; }
  var fresh = [], bursts = [];
  posts.forEach(function(p){
    var old = prev[p.id];
    if(p.status === 'approved' && (!old || old.status !== 'approved')) fresh.push(p);
    if(!old && p.status === 'pending' && isAdmin) toast('New photo to review: ' + p.title, '🔔');
    if(old && p.status === 'approved'){
      var a = reactionsOf(old), b = reactionsOf(p);
      REACTS.forEach(function(r){ if((b[r.k]||0) > (a[r.k]||0)) bursts.push({post:p, emoji:r.e, n:b[r.k]-a[r.k]}); });
    }
  });
  if(structural) renderCurrent(); else patchReactions();
  fresh.forEach(function(p){
    if(showActive()) showNewPhoto(p); else if(!isAdmin) toast('New photo: ' + p.title, '📸');
  });
  if(showActive()) bursts.forEach(function(b){ showReactionBurst(b.emoji, b.n); });
}
// demo mode: keep tabs in sync (approve in one tab, watch it pop up on the Big Screen in another)
window.addEventListener('storage', function(e){
  if(cloud || e.key !== STORE_KEY || !e.newValue) return;
  try{ applyPosts(JSON.parse(e.newValue), false); }catch(err){}
});

// live updates: public sees approved posts, the signed-in admin sees everything
var unsubPosts = null;
function subscribePosts(){
  if(!cloud) return;
  if(unsubPosts) unsubPosts();
  var first = true;
  var col = cloud.db.collection('posts');
  unsubPosts = (isAdmin ? col : col.where('status', '==', 'approved')).onSnapshot(function(snap){
    applyPosts(snap.docs.map(function(d){ var p = d.data(); p.id = d.id; return p; }), first);
    first = false;
  }, function(err){
    console.error(err);
    toast('Could not load photos. Check your connection.', '⚠️');
  });
}
if(cloud){
  // Every visitor gets an invisible anonymous account, remembered on their device, so the database can
  // tell visitors apart: one reaction per photo, and a limit on how fast they post.
  // Admin sign-ins only last until the tab is closed (safer on shared computers).
  cloud.auth.onAuthStateChanged(function(user){
    if(!user){
      cloud.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function(){ return cloud.auth.signInAnonymously(); })
        .catch(function(e){ console.error(e); });
    }
    isAdmin = !!user && !user.isAnonymous && ADMIN_EMAILS.indexOf(String(user.email || '').toLowerCase()) !== -1;
    if(user && !user.isAnonymous && !isAdmin){ cloud.auth.signOut(); toast('That account is not an admin', '🚫'); }
    subscribePosts();
    subscribeReports();
    renderCurrent();
  });
}

// one upload every 30 seconds per visitor (the database enforces this too)
var POST_COOLDOWN_MS = 30000;
function cooldownLeft(){ return Math.max(0, (player.lastPostAt || 0) + POST_COOLDOWN_MS - Date.now()); }

function createPost(p, full){
  if(!cloud){
    p.id = 'p' + Date.now(); p.image = full;
    posts.unshift(cleanPost(p)); save();
    return Promise.resolve();
  }
  var user = cloud.auth.currentUser;
  if(!user) return Promise.reject(new Error('not signed in yet'));
  p.uid = user.uid;
  var ref = cloud.db.collection('posts').doc();
  var batch = cloud.db.batch();
  batch.set(ref, p);
  batch.set(cloud.db.collection('images').doc(ref.id), {full: full});
  batch.set(cloud.db.collection('limits').doc(user.uid), {lastPost: firebase.firestore.FieldValue.serverTimestamp()});
  return batch.commit();
}

/* reports: anyone can flag a published photo; admins see the flags */
var REPORT_REASONS = {inappropriate:'Inappropriate or unkind', privacy:'Shows someone who didn\'t agree', spam:'Spam or not from camp', other:'Something else'};
var REPORTS_KEY = 'prolead_reports_v1';
var reports = [];
if(!cloud){ try{ reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'); }catch(e){ reports = []; } }
var unsubReports = null;
function subscribeReports(){
  if(unsubReports){ unsubReports(); unsubReports = null; }
  if(!cloud || !isAdmin){ reports = cloud ? [] : reports; return; }
  unsubReports = cloud.db.collection('reports').onSnapshot(function(snap){
    var before = reports.length;
    reports = snap.docs.map(function(d){ var r = d.data(); return {id:d.id, postId:text(r.postId, 40), reason:REPORT_REASONS[r.reason] ? r.reason : 'other'}; });
    if(reports.length > before && before) toast('A photo was reported', '🚩');
    if(currentView() === 'admin') renderAdmin();
  }, function(err){ console.error(err); });
}
function reportsFor(id){ return reports.filter(function(r){ return r.postId === id; }); }
function sendReport(p, reason){
  player.reportedIds = player.reportedIds || [];
  if(player.reportedIds.indexOf(p.id) !== -1) return Promise.resolve('dup');
  player.reportedIds.push(p.id); savePlayer();
  if(!cloud){
    reports.push({id:'r' + Date.now(), postId:p.id, reason:reason});
    try{ localStorage.setItem(REPORTS_KEY, JSON.stringify(reports)); }catch(e){}
    return Promise.resolve();
  }
  var user = cloud.auth.currentUser;
  return cloud.db.collection('reports').add({postId:p.id, reason:reason, uid:user ? user.uid : '', date:firebase.firestore.FieldValue.serverTimestamp()});
}
function clearReports(p){
  var mine = reportsFor(p.id);
  if(!cloud){
    reports = reports.filter(function(r){ return r.postId !== p.id; });
    try{ localStorage.setItem(REPORTS_KEY, JSON.stringify(reports)); }catch(e){}
    return Promise.resolve();
  }
  var batch = cloud.db.batch();
  mine.forEach(function(r){ batch.delete(cloud.db.collection('reports').doc(r.id)); });
  return batch.commit();
}
function updatePost(p, changes){
  if(!cloud){ Object.assign(p, changes); save(); return Promise.resolve(); }
  return cloud.db.collection('posts').doc(p.id).update(changes);
}
function deletePost(p){
  if(!cloud){ posts.splice(posts.indexOf(p), 1); save(); return Promise.resolve(); }
  var batch = cloud.db.batch();
  batch.delete(cloud.db.collection('posts').doc(p.id));
  batch.delete(cloud.db.collection('images').doc(p.id));
  return batch.commit().then(function(){
    // tidy up the reaction records for this photo (not critical if it fails)
    return cloud.db.collection('votes').where('post', '==', p.id).get().then(function(snap){
      var b = cloud.db.batch();
      snap.docs.forEach(function(d){ b.delete(d.ref); });
      return snap.size ? b.commit() : null;
    }).catch(function(){});
  });
}
// cards use the small thumbnail; the full photo is fetched when opened
var fullCache = {};
function fullImage(p){
  if(!cloud) return Promise.resolve(safeImg(p.image));
  if(fullCache[p.id]) return Promise.resolve(fullCache[p.id]);
  return cloud.db.collection('images').doc(p.id).get().then(function(d){
    var src = safeImg(d.exists ? d.data().full : p.image);
    fullCache[p.id] = src;
    return src;
  }).catch(function(){ return p.image; });
}

/* ---------- toast ---------- */
function toast(msg, icon){
  var stack = document.getElementById('toast-stack');
  var el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = (icon||'🎉') + ' <span></span>';
  el.querySelector('span').textContent = msg;
  stack.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('show'); });
  setTimeout(function(){
    el.classList.remove('show');
    setTimeout(function(){ el.remove(); }, 300);
  }, 2600);
}

/* ---------- confirm overlay ---------- */
function showConfirm(opts){
  var scrim = document.getElementById('confirm-scrim');
  var body = document.getElementById('confirm-body');
  var extra = opts.needsReason ? '<textarea id="confirm-reason" placeholder="Reason (optional, shown to no one but you)" style="width:100%;border:2px solid var(--line);border-radius:12px;padding:10px 13px;margin-top:14px;background:var(--bg);color:var(--ink);font-family:var(--font-body);min-height:70px"></textarea>' : '';
  body.innerHTML =
    '<div style="font-size:2rem;margin-bottom:6px">'+opts.icon+'</div>'+
    '<h3 style="margin-bottom:6px">'+opts.title+'</h3>'+
    '<p class="hint">'+opts.message+'</p>' + extra +
    '<div class="confirm-actions">'+
      '<button class="btn btn-ghost btn-sm" id="confirm-cancel">Cancel</button>'+
      '<button class="btn '+(opts.danger?'btn-accent':'btn-primary')+' btn-sm" id="confirm-ok">'+opts.okLabel+'</button>'+
    '</div>';
  scrim.classList.add('show');
  document.getElementById('confirm-cancel').onclick = function(){ scrim.classList.remove('show'); };
  document.getElementById('confirm-ok').onclick = function(){
    var reason = opts.needsReason ? document.getElementById('confirm-reason').value.trim() : '';
    scrim.classList.remove('show');
    opts.onConfirm(reason);
  };
}

/* ---------- routing ---------- */
var VIEWS = ['home','explore','schedule','duties','challenges','submit','admin','show'];
function currentView(){
  var hash = (location.hash || '#home').slice(1);
  return VIEWS.indexOf(hash) === -1 ? 'home' : hash;
}
function route(){
  var hash = currentView();
  VIEWS.forEach(function(v){
    document.getElementById('view-'+v).hidden = (v !== hash);
  });
  document.querySelectorAll('.navlink, .tablink').forEach(function(a){
    a.classList.toggle('active', a.dataset.route === hash);
  });
  if(hash === 'show') startShow(); else stopShow();
  if(hash === 'submit'){ renderSubmitCats(); applyPendingChallenge(); }
  renderCurrent();
  window.scrollTo(0,0);
}
// re-render the visible list (called on navigation and on live data updates)
function renderCurrent(){
  var hash = currentView();
  if(hash === 'home') renderHome();
  if(hash === 'explore') renderExplore();
  if(hash === 'challenges') renderChallenges();
  if(hash === 'schedule') renderSchedule();
  if(hash === 'admin') renderAdmin();
  if(hash === 'show'){
    show.list = showList();
    document.getElementById('show-empty').hidden = show.list.length > 0;
    if(show.list.length && show.list.indexOf(showCurrent()) === -1) showSlide(0);
  }
}
window.addEventListener('hashchange', route);

/* ---------- chip rendering ---------- */
function chipHTML(c, active){
  return '<button type="button" class="chip'+(active?' active':'')+'" data-cat="'+c.id+'" style="background:'+c.bg+'; color:'+c.color+'" aria-pressed="'+!!active+'">'+
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="'+c.color+'" stroke-width="2.2"><path d="'+c.icon+'" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
    c.name+'</button>';
}

/* ---------- card rendering ---------- */
function cardHTML(p){
  var c = cat(p.category);
  var name = p.anonymous ? 'Anonymous' : p.displayName;
  return '<article class="card" data-id="'+escAttr(p.id)+'" tabindex="0" role="button" aria-label="Open post: '+escAttr(p.title)+'">'+
    '<div class="card-img"><img src="'+escAttr(safeImg(p.image))+'" alt="'+escAttr(p.title)+'" loading="lazy"></div>'+
    '<div class="card-body">'+
      '<div class="pill-row"><span class="cat-pill" style="background:'+c.bg+'; color:'+c.color+'">'+c.name+'</span>'+
      (p.challenge && challenge(p.challenge) ? '<span class="cat-pill ch-pill" title="'+escAttr(challenge(p.challenge).t)+'">🎯 '+challenge(p.challenge).e+'</span>' : '')+'</div>'+
      '<div class="card-title">'+esc(p.title)+'</div>'+
      '<div class="card-meta"><span>'+esc(name)+(p.group?' · G'+esc(p.group):'')+'</span><span>'+fmtDate(p.date)+'</span></div>'+
      reactRowHTML(p)+
      (p.status === 'approved' ? '<div class="react-sum" data-sum-id="'+escAttr(p.id)+'">'+reactSummary(p)+'</div>' : '')+
    '</div></article>';
}
function esc(s){ var d=document.createElement('div'); d.textContent = s==null?'':s; return d.innerHTML; }
function escAttr(s){ return esc(s).replace(/"/g,'&quot;'); }

function emptyState(msg, sub){
  return '<div class="empty" style="grid-column:1/-1">'+
    '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--line)" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>'+
    '<b>'+msg+'</b><div style="margin-top:4px">'+sub+'</div></div>';
}

/* ---------- HOME ---------- */
function renderHome(){

  var recent = posts.filter(function(p){return p.status==='approved';})
    .sort(function(a,b){ return new Date(b.date)-new Date(a.date); }).slice(0,6);
  document.getElementById('home-recent').innerHTML = recent.map(cardHTML).join('') || emptyState('No posts yet','Be the first to share something!');

  renderChallenges();
  bindCards();
}

/* ---------- EXPLORE ---------- */
var exploreCat = 'all', exploreQuery = '', pendingExploreCat = null;
function renderExplore(){
  if(pendingExploreCat){ exploreCat = pendingExploreCat; pendingExploreCat = null; }
  var catsEl = document.getElementById('explore-categories');
  var all = [{id:'all', name:'All', color:'#1D2B24', bg:'#EDEAE2', icon:'M4 7h16M4 12h16M4 17h16'}].concat(CATS);
  catsEl.innerHTML = all.map(function(c){ return chipHTML(c, c.id===exploreCat); }).join('');
  catsEl.querySelectorAll('.chip').forEach(function(ch){
    ch.addEventListener('click', function(){ exploreCat = ch.dataset.cat; renderExplore(); });
  });
  var search = document.getElementById('explore-search');
  search.value = exploreQuery;
  search.oninput = function(){ exploreQuery = search.value; renderExploreGrid(); };
  renderExploreGrid();
}
function renderExploreGrid(){
  var q = exploreQuery.trim().toLowerCase();
  var list = posts.filter(function(p){
    if(p.status!=='approved') return false;
    if(exploreCat!=='all' && p.category!==exploreCat) return false;
    if(q){
      var hay = (p.title+' '+p.description+' '+(p.anonymous?'anonymous':p.displayName)+' '+cat(p.category).name+' '+groupLabel(p)).toLowerCase();
      if(hay.indexOf(q)===-1) return false;
    }
    return true;
  }).sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
  var grid = document.getElementById('explore-grid');
  if(list.length){
    grid.innerHTML = list.map(cardHTML).join('');
  } else {
    grid.innerHTML = q ? emptyState('No matches for "'+esc(exploreQuery)+'"','Try a different search or category.')
                        : emptyState('Nothing here yet', 'Try another category, or be the first to share one!');
  }
  bindCards();
}

/* ---------- reactions ---------- */
// each person gets ONE reaction per photo (tap another emoji to switch, tap yours again to remove)
function myReaction(id){
  var m = player.reacted && player.reacted[id];
  if(Array.isArray(m)) m = m[0];   // older saves kept a list
  return REACTS.some(function(x){ return x.k === m; }) ? m : '';
}
function reactRowHTML(p, big){
  if(p.status !== 'approved') return '';
  var r = reactionsOf(p), mine = myReaction(p.id);
  return '<div class="react-row'+(big?' big':'')+(mine?' chosen':'')+'" data-react-id="'+escAttr(p.id)+'">'+REACTS.map(function(x){
    return '<button type="button" class="react-btn'+(mine===x.k?' on':'')+'" data-r="'+x.k+'" aria-label="React '+x.e+'">'+x.e+' <b>'+(r[x.k]||0)+'</b></button>';
  }).join('')+'</div>';
}
function reactSummary(p){
  var r = reactionsOf(p), total = 0;
  REACTS.forEach(function(x){ total += r[x.k] || 0; });
  return '<span>♥</span> ' + total;
}
function patchReactions(){
  document.querySelectorAll('[data-sum-id]').forEach(function(el){
    var p = posts.find(function(x){ return x.id === el.dataset.sumId; });
    if(p) el.innerHTML = reactSummary(p);
  });
  document.querySelectorAll('[data-react-id]').forEach(function(row){
    var p = posts.find(function(x){ return x.id === row.dataset.reactId; });
    if(!p) return;
    var r = reactionsOf(p), mine = myReaction(p.id);
    row.classList.toggle('chosen', !!mine);
    row.querySelectorAll('.react-btn').forEach(function(b){
      b.querySelector('b').textContent = r[b.dataset.r] || 0;
      b.classList.toggle('on', mine === b.dataset.r);
    });
  });
  if(showActive()) renderShowCaption();
}
function burstAt(x, y, emoji){
  for(var i=0; i<6; i++){
    var el = document.createElement('span');
    el.className = 'emoji-burst';
    el.textContent = emoji;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.setProperty('--dx', (Math.random()*120 - 60) + 'px');
    el.style.setProperty('--dy', (-60 - Math.random()*90) + 'px');
    el.style.setProperty('--rot', (Math.random()*60 - 30) + 'deg');
    document.body.appendChild(el);
    setTimeout(function(e){ e.remove(); }.bind(null, el), 900);
  }
}
var reactBusy = {};
function setMyReaction(id, k){
  player.reacted = player.reacted || {};
  if(k) player.reacted[id] = k; else delete player.reacted[id];
  savePlayer();
}
function react(id, k, x, y){
  var p = posts.find(function(q){ return q.id === id; });
  if(!p || p.status !== 'approved' || reactBusy[id]) return;
  var old = myReaction(id);
  var next = old === k ? '' : k;            // same emoji again = take it back; another emoji = switch
  setMyReaction(id, next);
  p.reactions = Object.assign({heart:0, laugh:0, fire:0, crown:0}, p.reactions);
  if(old) p.reactions[old] = Math.max(0, (p.reactions[old] || 0) - 1);
  if(next) p.reactions[next] = (p.reactions[next] || 0) + 1;
  patchReactions();
  if(next){
    var e = REACTS.find(function(r){ return r.k === next; }).e;
    burstAt(x, y, e); SFX.pop();
    if(showActive()) showReactionBurst(e, 1);
    if(!old){
      player.reactCount = (player.reactCount || 0) + 1; savePlayer();
      if(player.reactCount >= 10){ var b = grantBadge('superfan'); if(b){ toast('Badge unlocked: '+b.name, b.icon); SFX.star(); } }
    }
  }
  if(!cloud){ save(); return; }
  // The database keeps one "vote" per person per photo and only accepts count changes that match it.
  var user = cloud.auth.currentUser;
  if(!user){ toast('Still connecting… try again in a moment.', '⏳'); syncMyReaction(p); return; }
  var inc = firebase.firestore.FieldValue.increment, u = {};
  if(old) u['reactions.' + old] = inc(-1);
  if(next) u['reactions.' + next] = inc(1);
  var voteRef = cloud.db.collection('votes').doc(id + '_' + user.uid), batch = cloud.db.batch();
  if(!old) batch.set(voteRef, {post:id, uid:user.uid, r:next});
  else if(!next) batch.delete(voteRef);
  else batch.update(voteRef, {r:next});
  batch.update(cloud.db.collection('posts').doc(id), u);
  reactBusy[id] = true;
  batch.commit().catch(function(){
    // undo what we showed, then ask the database what this person's reaction really is
    if(next) p.reactions[next] = Math.max(0, (p.reactions[next] || 0) - 1);
    if(old) p.reactions[old] = (p.reactions[old] || 0) + 1;
    setMyReaction(id, old); patchReactions();
    toast('Reaction didn\'t go through. Please try again.', '⚠️');
    syncMyReaction(p);
  }).then(function(){ reactBusy[id] = false; });
}
// make sure this device shows the reaction the database actually has for this person
function syncMyReaction(p){
  if(!cloud || !cloud.auth.currentUser || p.status !== 'approved') return;
  cloud.db.collection('votes').doc(p.id + '_' + cloud.auth.currentUser.uid).get().then(function(d){
    var r = d.exists ? d.data().r : '';
    if(r !== myReaction(p.id)){ setMyReaction(p.id, r); patchReactions(); }
  }).catch(function(){});
}
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('.react-btn');
  if(!b) return;
  e.stopPropagation();
  react(b.closest('[data-react-id]').dataset.reactId, b.dataset.r, e.clientX, e.clientY);
}, true);

/* ---------- daily photo challenges ---------- */
var CHALLENGE_XP = 20;
var CHALLENGES = [
  {id:'briefing',   day:'boot', e:'📸', t:'Group photo'},
  {id:'rehearsal',  day:'boot', e:'🎬', t:'Rehearsal behind the scenes'},
  {id:'roadtrip',   day:25, e:'🚌', t:'Road trip selfie with your squad'},
  {id:'newhome',    day:25, e:'🏠', t:'Our home for 3 days'},
  {id:'firstsmile', day:25, e:'😁', t:'First big smile of camp'},
  {id:'cheer',      day:25, e:'📣', t:'Your group\'s cheer pose'},
  {id:'newfriend',  day:26, e:'🤝', t:'Photo with a new friend'},
  {id:'debateface', day:26, e:'🎤', t:'Most dramatic debate face'},
  {id:'checkpoint', day:26, e:'🚩', t:'QuestRace checkpoint victory'},
  {id:'yellow',     day:27, e:'💛', t:'Find something yellow'},
  {id:'certificate',day:27, e:'📜', t:'Certificate proud pose'},
  {id:'goodbye',    day:27, e:'🤗', t:'Group goodbye photo'}
];
var CAMP_DAYS = [25, 26, 27];
var SLOTS = [{key:'boot', label:'Bootcamp'}].concat(CAMP_DAYS.map(function(d, i){ return {key:d, label:'Day ' + (i + 1)}; }));
function challenge(id){ return CHALLENGES.find(function(c){ return c.id === id; }); }
function campToday(){
  var n = new Date();
  return (n.getFullYear() === 2026 && n.getMonth() === 10 && CAMP_DAYS.indexOf(n.getDate()) !== -1) ? n.getDate() : null;
}
var challengeDay = campToday() || 'boot', pendingChallenge = null;
function renderChallenges(){
  document.querySelectorAll('.challenge-box').forEach(renderChallengeBox);
}
function renderChallengeBox(el){
  var today = campToday(), done = player.challenges || [];
  var tabs = SLOTS.map(function(s){
    return '<button type="button" class="day-tab'+(s.key===challengeDay?' active':'')+(s.key==='boot'?' boot':'')+'" data-day="'+s.key+'">'+s.label+(s.key===today?' · Today':'')+'</button>';
  }).join('');
  var cards = CHALLENGES.filter(function(c){ return c.day === challengeDay; }).map(function(c){
    var shots = posts.filter(function(p){ return p.status==='approved' && p.challenge===c.id; });
    var mine = done.indexOf(c.id) !== -1;
    return '<div class="challenge-card'+(mine?' done':'')+'">'+
      '<div class="ch-emoji">'+c.e+'</div>'+
      '<div class="ch-title">'+c.t+'</div>'+
      '<div class="ch-thumbs">'+shots.slice(0,4).map(function(p){ return '<img src="'+escAttr(safeImg(p.image))+'" alt="" data-open="'+escAttr(p.id)+'">'; }).join('')+
        '<span>'+shots.length+' photo'+(shots.length===1?'':'s')+'</span></div>'+
      (mine ? '<div class="ch-done">✓ You did it!</div>'
            : '<button type="button" class="btn btn-accent btn-sm" data-take="'+c.id+'">Take it on · +'+CHALLENGE_XP+' XP</button>')+
    '</div>';
  }).join('');
  el.innerHTML = '<div class="day-tabs">'+tabs+'</div><div class="challenge-grid">'+cards+'</div>';
  el.querySelectorAll('.day-tab').forEach(function(t){
    t.onclick = function(){ challengeDay = t.dataset.day === 'boot' ? 'boot' : +t.dataset.day; SFX.pop(); renderChallenges(); };
  });
  el.querySelectorAll('[data-take]').forEach(function(b){
    b.onclick = function(){ pendingChallenge = b.dataset.take; location.hash = '#submit'; };
  });
  el.querySelectorAll('[data-open]').forEach(function(img){
    img.onclick = function(){ openPostModal(img.dataset.open); };
  });
}

/* ---------- camp schedule (programme tentative) ---------- */
// [start 'HH:MM' (24h), time label, activity, details, venue / notes]
var SCHEDULE = [
  {day:25, label:'Day 1', date:'Wed, 25 November 2026', items:[
    ['07:00', '7:00 AM', 'Students gather at futsal court', [], 'Futsal Court'],
    ['07:30', '7:30 AM', 'Morning preparation and move to SK Kedaik', [], ''],
    ['12:00', '12:00 – 12:30 PM', 'Arrival at SK Kedaik and unload belongings', [], 'School Canteen & Surau'],
    ['12:30', '12:30 PM', 'Lunch and Zuhur prayer', [], ''],
    ['14:00', '2:00 PM', 'Registration preparation', [], ''],
    ['14:30', '2:30 PM', 'Participant arrival and registration', [], 'School Assembly Point'],
    ['15:30', '3:30 PM', 'Programme Organising Committee briefing', [], 'Hall'],
    ['15:45', '3:45 PM', 'Slot 1: Ice-Breaking Activity – “Crisis Identity”', ['Group formation (10 min)', 'Ice-breaking activity “Crisis Identity” (40 min)', 'Group cheer (15–20 min)'], 'Hall'],
    ['16:45', '4:45 PM', 'Asar prayer', [], 'Surau / Hall'],
    ['17:30', '5:30 PM', 'Personal preparation', [], ''],
    ['18:30', '6:30 PM', 'Dinner', [], 'School Canteen'],
    ['19:00', '7:00 PM', 'Maghrib prayer / Tazkirah / Isha’ prayer / Human Formation', ['Non-Muslim participants may use this time for reflection or discussion related to the upcoming activities'], 'Surau / Hall'],
    ['20:30', '8:30 PM', 'Integrity sharing session', [], 'By assigned lecturer'],
    ['21:00', '9:00 PM', 'Slot 2: Leadership Activity – “Parliamentary Debate”', [], 'Hall'],
    ['22:00', '10:00 PM', 'Cultural Night briefing and rehearsal', [], 'Hall'],
    ['22:30', '10:30 PM', 'Supper', [], ''],
    ['23:00', '11:00 PM', 'Sleep', [], '']
  ]},
  {day:26, label:'Day 2', date:'Thu, 26 November 2026', items:[
    ['04:30', '4:30 AM', 'Preparation for Qiamullail', [], ''],
    ['05:00', '5:00 AM', 'Qiam and Subuh prayer', [], 'Surau'],
    ['06:00', '6:00 AM', 'Preparation for assembly', [], ''],
    ['07:30', '7:30 AM', 'Assembly: National Anthem, exercise', [], 'Dataran'],
    ['08:00', '8:00 AM', 'Breakfast', [], 'Canteen'],
    ['08:30', '8:30 AM', 'Slot 3: Outdoor Activity (QuestRace) – 4 checkpoints', ['Activities at each checkpoint are decided by the facilitators', 'Safety briefing before the activity; first-aid kit available', 'Water breaks throughout', 'If it rains, the activity is postponed or moved indoors', 'Facilitators supervise participants throughout'], ''],
    ['10:30', '10:30 AM', 'Morning tea break', [], 'Canteen'],
    ['10:45', '10:45 AM', 'Slot 4: Integrity and anti-corruption session', [], 'By assigned facilitator'],
    ['12:00', '12:00 PM', 'Lunch', [], 'Canteen'],
    ['13:30', '1:30 PM', 'Zuhur prayer', [], 'Surau'],
    ['14:30', '2:30 PM', 'Slot 5: Sharing Session (caught in the act)', [], 'Hall · by assigned facilitators'],
    ['15:00', '3:00 PM', 'Slot 6: Siput Menyanyi', [], 'Hall'],
    ['16:00', '4:00 PM', 'Slot 7: LDK (Siapa Saya?)', [], 'Hall'],
    ['16:30', '4:30 PM', 'Tea break and Asar prayer', [], 'Canteen & Surau'],
    ['17:20', '5:20 PM', 'Cultural Night practice and rehearsals', [], 'Hall / Assembly Point'],
    ['18:20', '6:20 PM', 'Personal preparation and dinner', [], ''],
    ['19:30', '7:30 PM', 'Maghrib prayer / Tazkirah / Isha’ prayer', [], 'Surau'],
    ['21:00', '9:00 PM', 'Cultural Night 🎭', [], 'Hall'],
    ['22:30', '10:30 PM', 'Supper', [], 'Canteen'],
    ['23:00', '11:00 PM', 'Sleep', [], '']
  ]},
  {day:27, label:'Day 3', date:'Fri, 27 November 2026', items:[
    ['06:00', '6:00 AM', 'Subuh prayer and Value Formation', [], 'Surau / Hall'],
    ['07:15', '7:15 AM', 'Assembly: National Anthem, exercise', [], 'Dataran'],
    ['08:00', '8:00 AM', 'Breakfast', [], 'Canteen'],
    ['08:30', '8:30 AM', 'Preparation for the closing ceremony', [], ''],
    ['09:30', '9:30 AM', 'Morning tea break', [], 'Canteen'],
    ['10:15', '10:15 AM', 'Participants line up and gather', [], 'Hall'],
    ['10:45', '10:45 AM', 'Arrival of invited guests and teachers', ['National Anthem, prayer led by an assigned facilitator', 'Speeches by the organiser, the Headmaster and accompanying teachers'], 'Hall'],
    ['11:00', '11:00 AM', 'Closing ceremony 🏆', ['Montage screening by the Media Team', 'Certificate presentation by the Headmaster and Camp Organiser / Assistant Camp Organiser', 'Hampers for the Top 3 groups and appreciation gifts for the other groups', 'Awards for Penghulu/Penghuluwati, Best Participant and Best Facilitator', 'Performance by the Best Group'], 'Hall'],
    ['12:30', '12:30 PM', 'Group photography session 📸', [], 'Hall'],
    ['12:45', '12:45 PM', 'Jumaat / Zuhur prayer', [], ''],
    ['14:00', '2:00 PM', 'Return from SK Kedaik to UPTM 🚌', [], '']
  ]}
];
var scheduleDay = campToday() || 25;
// which slot is on right now (only during the camp; uses the phone's own clock)
function currentSlot(){
  var today = campToday();
  if(!today) return null;
  var d = SCHEDULE.find(function(s){ return s.day === today; }), n = new Date();
  var mins = n.getHours() * 60 + n.getMinutes(), cur = null;
  d.items.forEach(function(it, i){ var hm = it[0].split(':'); if(+hm[0] * 60 + +hm[1] <= mins) cur = i; });
  return cur === null ? null : {day:today, index:cur};
}
function renderSchedule(){
  var el = document.getElementById('schedule-box');
  var now = currentSlot(), today = campToday();
  var d = SCHEDULE.find(function(s){ return s.day === scheduleDay; }) || SCHEDULE[0];
  el.innerHTML = '<div class="day-tabs">' + SCHEDULE.map(function(s){
      return '<button type="button" class="day-tab' + (s.day === d.day ? ' active' : '') + '" data-sday="' + s.day + '">' + s.label + (s.day === today ? ' · Today' : '') + '</button>';
    }).join('') + '</div>' +
    '<div class="sched-date">' + esc(d.date) + '</div>' +
    '<ol class="sched-list">' + d.items.map(function(it, i){
      var isNow = now && now.day === d.day && now.index === i, isSlot = /^Slot \d/.test(it[2]);
      return '<li class="sched-item' + (isSlot ? ' slot' : '') + (isNow ? ' now' : '') + '">' +
        '<div class="sched-time">' + esc(it[1]) + (isNow ? '<span class="now-badge">Now</span>' : '') + '</div>' +
        '<div class="sched-body"><div class="sched-title">' + esc(it[2]) + '</div>' +
          (it[3].length ? '<ul class="sched-details">' + it[3].map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
          (it[4] ? '<div class="sched-venue">📍 ' + esc(it[4]) + '</div>' : '') +
        '</div></li>';
    }).join('') + '</ol>';
  el.querySelectorAll('[data-sday]').forEach(function(b){
    b.onclick = function(){ scheduleDay = +b.dataset.sday; SFX.pop(); renderSchedule(); };
  });
  // on camp days, scroll to the current slot once (looked up fresh, since the list can redraw)
  if(el.querySelector('.sched-item.now') && !renderSchedule.scrolled){
    renderSchedule.scrolled = true;
    setTimeout(function(){
      var n = document.querySelector('#view-schedule .sched-item.now');
      if(n) n.scrollIntoView({behavior:'smooth', block:'center'});
    }, 600);
  }
}
setInterval(function(){ if(currentView() === 'schedule') renderSchedule(); }, 60000);   // keep "Now" up to date

/* ---------- Big Screen slideshow ---------- */
var SHOW_MS = 7000;
var show = {list:[], i:0, timer:null, paused:false, layer:0};
function showActive(){ return currentView() === 'show'; }
function showList(){
  return posts.filter(function(p){ return p.status === 'approved'; })
    .sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
}
function startShow(){
  document.body.classList.add('show-mode');
  show.list = showList();
  show.i = 0;
  document.getElementById('show-empty').hidden = show.list.length > 0;
  if(show.list.length) showSlide(0);
  wakeControls();
}
function stopShow(){
  document.body.classList.remove('show-mode');
  clearTimeout(show.timer);
  if(document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function(){});
}
function showCurrent(){ return show.list[show.i]; }
function showSlide(i){
  if(!show.list.length) return;
  show.i = (i + show.list.length) % show.list.length;
  var p = showCurrent();
  show.layer = 1 - show.layer;
  var slide = document.getElementById('show-slide-' + show.layer);
  var other = document.getElementById('show-slide-' + (1 - show.layer));
  fullImage(p).then(function(src){
    if(showCurrent() !== p) return;
    slide.querySelector('.show-bg').style.backgroundImage = 'url("' + src + '")';
    var img = slide.querySelector('img');
    img.onload = function(){
      slide.classList.remove('active'); void slide.offsetWidth;
      slide.classList.add('active'); other.classList.remove('active');
    };
    img.src = src;
  });
  renderShowCaption();
  var bar = document.getElementById('show-progress');
  bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth;
  if(!show.paused){ bar.style.transition = 'width ' + SHOW_MS + 'ms linear'; bar.style.width = '100%'; }
  clearTimeout(show.timer);
  if(!show.paused) show.timer = setTimeout(function(){ showSlide(show.i + 1); }, SHOW_MS);
  var next = show.list[(show.i + 1) % show.list.length];
  if(next) fullImage(next).then(function(src){ new Image().src = src; });
}
function renderShowCaption(){
  var p = showCurrent(), el = document.getElementById('show-caption');
  if(!p){ el.innerHTML = ''; return; }
  var c = cat(p.category), ch = p.challenge && challenge(p.challenge), r = reactionsOf(p);
  el.innerHTML =
    '<div class="show-pills"><span class="cat-pill" style="background:'+c.bg+'; color:'+c.color+'">'+c.name+'</span>'+
    (ch ? '<span class="cat-pill ch-pill">🎯 '+esc(ch.t)+'</span>' : '')+'</div>'+
    '<div class="show-title">'+esc(p.title)+'</div>'+
    '<div class="show-meta">📸 '+esc(p.anonymous?'Anonymous':p.displayName)+(p.group?' · 👥 '+esc(groupLabel(p)):'')+' · '+fmtDate(p.date)+'</div>'+
    '<div class="show-reacts">'+REACTS.map(function(x){ return '<span>'+x.e+' '+(r[x.k]||0)+'</span>'; }).join('')+'</div>';
}
function showNewPhoto(p){
  show.list = showList();
  document.getElementById('show-empty').hidden = true;
  var i = show.list.indexOf(p);
  showSlide(i === -1 ? 0 : i);
  var banner = document.getElementById('show-new');
  banner.classList.remove('pop'); void banner.offsetWidth; banner.classList.add('pop');
  confetti(); SFX.fanfare();
}
function showReactionBurst(emoji, n){
  var layer = document.getElementById('show-react-layer');
  for(var i=0; i<Math.min(n, 6); i++){
    var el = document.createElement('span');
    el.className = 'show-float';
    el.textContent = emoji;
    el.style.left = (8 + Math.random()*84) + '%';
    el.style.animationDelay = (i*120) + 'ms';
    el.style.fontSize = (2.4 + Math.random()*2) + 'rem';
    layer.appendChild(el);
    setTimeout(function(e){ e.remove(); }.bind(null, el), 3400);
  }
}
function togglePause(){
  show.paused = !show.paused;
  document.getElementById('show-play').innerHTML = show.paused ? '<svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>' : '<svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
  showSlide(show.i);
}
function toggleFullscreen(){
  var el = document.documentElement;
  if(document.fullscreenElement) document.exitFullscreen();
  else if(el.requestFullscreen) el.requestFullscreen().catch(function(){});
}
var wakeTimer = null;
function wakeControls(){
  var stage = document.getElementById('show-stage');
  stage.classList.add('awake');
  clearTimeout(wakeTimer);
  wakeTimer = setTimeout(function(){ stage.classList.remove('awake'); }, 2500);
}
document.getElementById('show-stage').addEventListener('mousemove', wakeControls);
document.getElementById('show-prev').onclick = function(){ showSlide(show.i - 1); };
document.getElementById('show-next').onclick = function(){ showSlide(show.i + 1); };
document.getElementById('show-play').onclick = togglePause;
document.getElementById('show-full').onclick = toggleFullscreen;
document.getElementById('show-exit').onclick = function(){ location.hash = '#home'; };
document.addEventListener('keydown', function(e){
  if(!showActive()) return;
  if(e.key === 'ArrowRight') showSlide(show.i + 1);
  else if(e.key === 'ArrowLeft') showSlide(show.i - 1);
  else if(e.key === ' '){ e.preventDefault(); togglePause(); }
  else if(e.key === 'f' || e.key === 'F') toggleFullscreen();
  else if(e.key === 'Escape' && !document.fullscreenElement) location.hash = '#home';
  else return;
  wakeControls();
});

/* ---------- PM buddy (bottom-right corner): cycles through 3 poses ---------- */
(function(){
  var buddy = document.getElementById('pm-buddy'), bubble = document.getElementById('pm-bubble'), hideTimer = null, last = -1;
  var MOVES = ['cross', 'point', 'flex'], move = 0, moveTimer = null;
  var LINES = ['Dare to lead! 👑', 'Tengok sini! 👉', 'Jom share gambar! 📸', 'Semangat semua! 💪', 'Good job, team! 🙌', 'Senyum sikit! 😁', 'Murid Berilmu, Pemimpin Masa Depan!'];
  function setMove(i){
    move = i % MOVES.length;
    MOVES.forEach(function(m){ buddy.classList.remove('pm-mode-' + m); });
    void buddy.offsetWidth;
    buddy.classList.add('pm-mode-' + MOVES[move]);
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function(){ setMove(move + 1); }, 3300);
  }
  function speak(text){
    bubble.textContent = text;
    buddy.classList.add('talking');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function(){ buddy.classList.remove('talking'); }, 2600);
  }
  buddy.addEventListener('click', function(){
    var i; do { i = Math.floor(Math.random() * LINES.length); } while(i === last && LINES.length > 1);
    last = i;
    speak(LINES[i]);
    setMove(2);   // flex when tapped
    SFX.boing();
  });
  setMove(0);
  setTimeout(function(){ speak('Hai semua! 👋'); }, 1200);
})();

/* ---------- typing on phones ---------- */
// While a text box is focused (keyboard open), hide the bottom tab bar so it can't jump up over what you're typing.
function isTypingField(el){
  return el && (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && /^(text|email|password|search)$/.test(el.type)));
}
document.addEventListener('focusin', function(e){ if(isTypingField(e.target)) document.body.classList.add('typing'); });
document.addEventListener('focusout', function(){
  setTimeout(function(){ if(!isTypingField(document.activeElement)) document.body.classList.remove('typing'); }, 100);
});

/* ---------- card click -> modal ---------- */
function bindCards(){
  document.querySelectorAll('.card[data-id]').forEach(function(card){
    card.addEventListener('click', function(){ openPostModal(card.dataset.id); });
    card.addEventListener('keydown', function(e){ if(e.key==='Enter') openPostModal(card.dataset.id); });
  });
}
/* ---------- download / save a photo ---------- */
var DOWNLOAD_ICON = '<svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12m0 0l-5-5m5 5l5-5"/><path d="M4 20h16"/></svg>';
function photoFileName(p){
  var slug = String(p.title || 'photo').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'photo';
  return 'ProLead-' + slug + '.jpg';
}
// turn the full-size photo into a file (data: photos are decoded here, since the page isn't allowed to fetch data: URLs)
function photoBlob(src){
  if(src.indexOf('data:') === 0){
    var bin = atob(src.slice(src.indexOf(',') + 1)), bytes = new Uint8Array(bin.length);
    for(var i=0; i<bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return Promise.resolve(new Blob([bytes], {type: src.slice(5, src.indexOf(';')) || 'image/jpeg'}));
  }
  return fetch(src).then(function(r){ return r.blob(); });
}
function downloadPhoto(p, btn){
  btn.disabled = true;
  fullImage(p).then(function(src){ return photoBlob(src); }).then(function(blob){
    var name = photoFileName(p), file = null;
    try{ file = new File([blob], name, {type: 'image/jpeg'}); }catch(e){}
    // phones (especially iPhone): the share sheet has "Save Image" / "Save to Photos"
    if(file && navigator.canShare && navigator.canShare({files:[file]}) && (navigator.maxTouchPoints || 0) > 0){
      return navigator.share({files:[file], title: p.title}).catch(function(e){ if(e && e.name !== 'AbortError') throw e; });
    }
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
    toast('Photo saved to your downloads', '📥');
  }).catch(function(){
    toast('Couldn\'t download the photo. Please try again.', '⚠️');
  }).then(function(){ btn.disabled = false; });
}

function openPostModal(id){
  var p = posts.find(function(x){return x.id===id;});
  if(!p) return;
  var c = cat(p.category);
  var modalImg = document.getElementById('post-modal-img');
  modalImg.src = p.image;
  modalImg.alt = p.title;
  modalImg.dataset.id = p.id;
  fullImage(p).then(function(src){ if(modalImg.dataset.id === p.id) modalImg.src = src; });
  syncMyReaction(p);
  var ch = p.challenge && challenge(p.challenge);
  document.getElementById('post-modal-body').innerHTML =
    '<div class="pill-row"><span class="cat-pill" style="background:'+c.bg+'; color:'+c.color+'">'+c.name+'</span>'+
    (ch ? '<span class="cat-pill ch-pill">🎯 '+ch.e+' '+esc(ch.t)+'</span>' : '')+'</div>'+
    '<h3 style="margin:10px 0 6px">'+esc(p.title)+'</h3>'+
    '<p style="color:var(--muted)">'+esc(p.description||'No description added.')+'</p>'+
    '<div class="card-meta" style="margin-top:14px"><span>👤 '+esc(p.anonymous?'Anonymous':p.displayName)+(p.group?' · 👥 '+esc(groupLabel(p)):'')+'</span><span>'+fmtDate(p.date)+'</span></div>'+
    reactRowHTML(p, true)+
    '<button type="button" class="btn btn-primary btn-sm download-btn" id="download-btn">'+DOWNLOAD_ICON+'Download photo</button>'+
    (p.status === 'approved' ? '<div class="report-area" id="report-area"><button type="button" class="report-link" id="report-btn">Report this photo</button></div>' : '');
  document.getElementById('download-btn').onclick = function(){ downloadPhoto(p, this); };
  var reportBtn = document.getElementById('report-btn');
  if(reportBtn) reportBtn.onclick = function(){
    var area = document.getElementById('report-area');
    if(player.reportedIds && player.reportedIds.indexOf(p.id) !== -1){ area.innerHTML = '<span class="hint">You already reported this photo. Thanks!</span>'; return; }
    area.innerHTML = '<div class="hint" style="margin:0 0 8px">What\'s wrong with this photo?</div><div class="report-choices">'+
      Object.keys(REPORT_REASONS).map(function(k){ return '<button type="button" class="chip" data-reason="'+k+'">'+REPORT_REASONS[k]+'</button>'; }).join('')+'</div>';
    area.querySelectorAll('[data-reason]').forEach(function(b){
      b.onclick = function(){
        area.innerHTML = '<span class="hint">Sending…</span>';
        sendReport(p, b.dataset.reason).then(function(){
          area.innerHTML = '<span class="hint">Thanks for telling us. The admins will take a look. 💛</span>';
        }, function(){
          area.innerHTML = '<span class="hint">Couldn\'t send the report. Please try again later.</span>';
        });
      };
    });
  };
  document.getElementById('post-scrim').classList.add('show');
}
document.getElementById('post-close').addEventListener('click', function(){ document.getElementById('post-scrim').classList.remove('show'); });
document.getElementById('post-scrim').addEventListener('click', function(e){ if(e.target===this) this.classList.remove('show'); });
document.getElementById('post-modal-img').addEventListener('click', function(){
  document.getElementById('zoom-img').src = this.src;
  document.getElementById('zoom-scrim').classList.add('show');
});
document.getElementById('zoom-scrim').addEventListener('click', function(){ this.classList.remove('show'); });

/* ---------- SUBMIT: Photo Quest ---------- */
var submitCat = null;
var uploadedImage = null;
var isAnon = false;
var hasConsent = false;
var stickers = [];
var awarded = {};
var runXP = 0;
var STEP_XP = 10, LAUNCH_XP = 50, DESC_XP = 15, GROUP_XP = 10, STICKER_XP = 5, MAX_STICKER_XP = 25, MAX_STICKERS = 10;
var STICKERS = ['⭐','💖','🌸','✨','🐾','🌈','🍓','😎','🎀','🔥','🍀','🫶'];

/* player progress (per browser) */
var PLAYER_KEY = 'sharespace_player_v1';
var player = {xp:0, shares:0, pokes:0, badges:[], sound:true, reacted:{}, reactCount:0, challenges:[]};
try{ var rawPlayer = localStorage.getItem(PLAYER_KEY); if(rawPlayer) player = Object.assign(player, JSON.parse(rawPlayer)); }catch(e){}
function savePlayer(){ try{ localStorage.setItem(PLAYER_KEY, JSON.stringify(player)); }catch(e){} }

var LEVEL_XP = 200;
var TITLES = ['Sprout Sharer','Pixel Pal','Snapshot Star','Gallery Guru','Legendary Lens'];
function levelOf(xp){ return Math.floor(xp/LEVEL_XP) + 1; }
function titleOf(lvl){ return TITLES[Math.min(lvl, TITLES.length) - 1]; }

var BADGES = [
  {id:'first',  icon:'🍡', name:'First Bite',         desc:'Share your first post'},
  {id:'streak', icon:'🍱', name:'Snack Streak',       desc:'Share 3 posts'},
  {id:'artist', icon:'🎨', name:'Sticker Artist',     desc:'Use 3+ stickers on one photo'},
  {id:'squad',  icon:'📣', name:'Team Spirit',        desc:'Tag your group in a photo'},
  {id:'agent',  icon:'🕶️', name:'Secret Agent',       desc:'Post anonymously'},
  {id:'buds',   icon:'💚', name:'Best Buds',          desc:'Poke Mochi 10 times'},
  {id:'quester',icon:'🎯', name:'Challenge Accepted', desc:'Complete a daily photo challenge'},
  {id:'superfan',icon:'💖', name:'Super Fan',         desc:'React to photos 10 times'}
];
function badge(id){ return BADGES.find(function(b){ return b.id===id; }); }
function grantBadge(id){
  if(player.badges.indexOf(id) !== -1) return null;
  player.badges.push(id); savePlayer(); renderBadges();
  return badge(id);
}

function renderHud(){
  var lvl = levelOf(player.xp), into = player.xp % LEVEL_XP;
  document.getElementById('hud-level').textContent = lvl;
  document.getElementById('hud-title').textContent = titleOf(lvl);
  document.getElementById('hud-xp-num').textContent = into + ' / ' + LEVEL_XP + ' XP';
  document.getElementById('hud-xp-bar').style.width = (into / LEVEL_XP * 100) + '%';
  var snd = document.getElementById('sound-toggle');
  snd.textContent = player.sound ? '🔊' : '🔇';
  snd.setAttribute('aria-pressed', String(player.sound));
}
function renderBadges(){
  document.getElementById('badge-shelf').innerHTML = BADGES.map(function(b){
    var got = player.badges.indexOf(b.id) !== -1;
    return '<span class="badge'+(got?' got':'')+'" title="'+escAttr(got ? b.name+': '+b.desc : 'Locked: '+b.desc)+'">'+(got ? b.icon : '?')+'</span>';
  }).join('');
}
document.getElementById('sound-toggle').addEventListener('click', function(){
  player.sound = !player.sound; savePlayer(); renderHud();
  if(player.sound) SFX.pop();
});

/* tiny synth sound effects */
var audioCtx = null;
function tone(freqs, opts){
  if(!player.sound) return;
  opts = opts || {};
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    var t = audioCtx.currentTime, step = opts.step || .07, dur = opts.dur || .12;
    freqs.forEach(function(f, i){
      var o = audioCtx.createOscillator(), g = audioCtx.createGain(), s = t + i*step;
      o.type = opts.type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, s);
      g.gain.exponentialRampToValueAtTime(opts.vol || .08, s + .012);
      g.gain.exponentialRampToValueAtTime(.0001, s + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(s); o.stop(s + dur + .02);
    });
  }catch(e){}
}
var SFX = {
  pop:    function(){ tone([660,990], {step:.05, dur:.1}); },
  star:   function(){ tone([523,659,784], {step:.07, dur:.16, type:'triangle'}); },
  nope:   function(){ tone([220,165], {step:.1, dur:.15, type:'square', vol:.035}); },
  chomp:  function(){ tone([150,110,150,110,150], {step:.12, dur:.07, type:'triangle', vol:.12}); },
  boing:  function(){ tone([280,420,620], {step:.04, dur:.09, type:'sine'}); },
  fanfare:function(){ tone([523,659,784,1047,784,1047], {step:.11, dur:.24, type:'triangle'}); }
};

/* background music: a soothing kalimba lofi tune composed in code (no audio file, no copyright) */
var music = {on: player.music !== false, playing:false, timer:null, bus:null, session:null, nextBar:0, bar:0};
var BEAT = 60 / 84, EIGHTH = BEAT / 2, SWING = EIGHTH * .18;
// feel-good loop C → G → Am → F: [bass, soft-piano voicing] as MIDI notes
var PROG = [
  [48, [55,60,64,67]],
  [43, [55,59,62,67]],
  [45, [57,60,64,69]],
  [41, [57,60,65,69]]
];
var MELODY = [ // the kalimba hook, eight eighth-notes per bar (0 = rest); 8 bars = two times round the chords
  [72,0,76,0,79,0,76,74], [74,0,71,0,67,0,0,0], [69,0,72,0,76,0,74,72], [72,0,69,0,0,0,0,0],
  [72,0,76,0,79,0,81,79], [76,0,74,0,71,0,74,0], [72,0,69,0,76,0,74,0], [72,0,0,0,0,0,0,0]
];
function midiHz(m){ return 440 * Math.pow(2, (m - 69) / 12); }
// one sine "partial" with a quick attack and a natural fade (every note ends on its own)
function partial(f, t, vol, attack, decay, hold){
  var o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  if(hold){   // settle to a warm hold level, then fade out just before the length ends
    g.gain.exponentialRampToValueAtTime(vol * hold, t + attack + .45);
    g.gain.setValueAtTime(vol * hold, t + attack + decay - .15);
    g.gain.linearRampToValueAtTime(0, t + attack + decay);
  } else g.gain.exponentialRampToValueAtTime(.0001, t + attack + decay);
  o.connect(g); g.connect(music.session);
  o.start(t); o.stop(t + attack + decay + .05);
}
function kalimba(m, t, vol){
  var f = midiHz(m);
  partial(f, t, vol, .004, 1.1);
  partial(f * 2, t, vol * .22, .003, .35);
  partial(f * 5.4, t, vol * .05, .002, .12);     // the bright "tine" click
}
function pianoChord(notes, t, beats, vol){
  notes.forEach(function(m, k){
    var f = midiHz(m), at = t + k * .014;           // gently rolled
    partial(f * .998, at, vol, .012, BEAT * beats, .4);
    partial(f * 1.002, at, vol, .012, BEAT * beats, .4);
    partial(f * 2, at, vol * .2, .01, BEAT * beats * .5);
  });
}
function bassNote(m, t, beats, vol){
  var o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'triangle'; o.frequency.value = midiHz(m);
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + .02);
  g.gain.exponentialRampToValueAtTime(.0001, t + BEAT * beats);
  o.connect(g); g.connect(music.session);
  o.start(t); o.stop(t + BEAT * beats + .05);
}
function drumHit(kind, t, vol){
  var g = audioCtx.createGain();
  g.connect(music.session);
  if(kind === 'kick'){
    var o = audioCtx.createOscillator();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + .1);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + .25);
    o.connect(g); o.start(t); o.stop(t + .28);
    return;
  }
  var src = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), len = kind === 'snap' ? .09 : .035;
  src.buffer = music.bus.noise;
  if(kind === 'snap'){ f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 1.2; }
  else { f.type = 'highpass'; f.frequency.value = 6500; }
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .003); g.gain.exponentialRampToValueAtTime(.001, t + len);
  src.connect(f); f.connect(g);
  src.start(t, Math.random() * .5); src.stop(t + len + .02);
}
function scheduleBar(t, i){
  // a two-bar intro on Am → F, then the loop starts on C with the melody
  var chord = PROG[(i + 2) % 4];
  function at(k){ return t + k*EIGHTH + (k % 2 ? SWING : 0); }
  pianoChord(chord[1], t, 2, .06);
  pianoChord(chord[1], t + BEAT*2, 2, .048);
  bassNote(chord[0] + 12, t, 2.4, .2);
  bassNote(chord[0] + 12, at(5), 1.3, .13);
  if(i >= 1){
    drumHit('kick', at(0), .4); drumHit('kick', at(4), .32);
    drumHit('snap', at(2), .22); drumHit('snap', at(6), .22);
    for(var k=0; k<8; k++) drumHit('shaker', at(k), k % 2 ? .035 : .055);
  }
  if(i >= 2) MELODY[(i - 2) % MELODY.length].forEach(function(m, k){
    if(!m) return;
    kalimba(m, at(k), .25);
    kalimba(m, at(k) + BEAT * .75, .045);          // one soft echo, no feedback loop
  });
}
function musicTick(){
  while(music.nextBar < audioCtx.currentTime + 1){
    scheduleBar(music.nextBar, music.bar++);
    music.nextBar += BEAT * 4;
  }
}
function buildMusicBus(){
  var c = audioCtx;
  var input = c.createGain(), tone = c.createBiquadFilter(), comp = c.createDynamicsCompressor(), master = c.createGain();
  tone.type = 'lowpass'; tone.frequency.value = 7000;
  input.connect(tone); tone.connect(comp); comp.connect(master); master.connect(c.destination);
  master.gain.value = 1;
  var noise = c.createBuffer(1, c.sampleRate, c.sampleRate), nd = noise.getChannelData(0);
  for(var i=0; i<nd.length; i++) nd[i] = Math.random() * 2 - 1;
  return {input:input, master:master, noise:noise};
}
// Browsers keep audio muted until the visitor taps. Only count the music as playing once the
// browser has really unmuted; otherwise stay "waiting" and try again on the next tap.
function startMusic(){
  try{ if(navigator.audioSession) navigator.audioSession.type = 'playback'; }catch(e){}
  if(music.playing || !music.on) return;
  // Only try while the browser counts this as a real tap; an early attempt (e.g. the moment a finger
  // lands on a phone) gets put on hold by the browser and would swallow the tap that does count.
  var ua = navigator.userActivation;
  if(ua && !ua.isActive && !(audioCtx && audioCtx.state === 'running')) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  }catch(e){ return; }
  // a silent blip inside the tap helps some phones unlock audio
  try{ var s = audioCtx.createBufferSource(); s.buffer = audioCtx.createBuffer(1, 1, 22050); s.connect(audioCtx.destination); s.start(0); }catch(e){}
  var resumed = audioCtx.state === 'running' ? Promise.resolve() : audioCtx.resume();
  Promise.resolve(resumed).then(function(){
    if(audioCtx.state === 'running' && music.on && !document.hidden) beginMusic();
    renderMusicBtn();
  }, function(){ renderMusicBtn(); });
}
// Every start gets its own volume channel ("session"). Stopping fades that channel out and unplugs it,
// so notes that were already queued can never play on top of the next start.
function beginMusic(){
  if(music.playing) return;
  try{
    if(!music.bus) music.bus = buildMusicBus();
    var s = audioCtx.createGain(), now = audioCtx.currentTime;
    s.gain.setValueAtTime(0, now);
    s.gain.linearRampToValueAtTime(1, now + 1.2);                            // gentle fade in
    s.connect(music.bus.input);
    music.session = s;
    music.nextBar = now + .1;
    music.bar = 0;
    clearInterval(music.timer);
    music.timer = setInterval(musicTick, 250);
    musicTick();
    music.playing = true;
  }catch(e){}
  renderMusicBtn();
}
function stopMusic(){
  if(!music.playing) return;
  clearInterval(music.timer);
  var s = music.session, now = audioCtx.currentTime;
  s.gain.cancelScheduledValues(now);
  s.gain.setValueAtTime(Math.max(s.gain.value, .0001), now);
  s.gain.exponentialRampToValueAtTime(.0001, now + .3);                     // gentle fade out
  setTimeout(function(){ s.disconnect(); }, 400);                           // queued notes now go nowhere
  music.session = null;
  music.playing = false;
  renderMusicBtn();
}
function renderMusicBtn(){
  ['music-btn', 'show-music'].forEach(function(id){
    var btn = document.getElementById(id);
    btn.classList.toggle('playing', music.playing);
    btn.classList.toggle('waiting', music.on && !music.playing);
    btn.setAttribute('aria-pressed', String(music.on));
    btn.title = music.on ? 'Cozy music: on (tap to turn off)' : 'Cozy music: off (tap to turn on)';
  });
}
function onMusicBtn(e){
  e.stopPropagation();
  music.unlocked = true;
  if(music.on && !music.playing){ startMusic(); return; }   // first click just starts it
  music.on = !music.on;
  player.music = music.on; savePlayer();
  if(music.on) startMusic(); else stopMusic();
  renderMusicBtn();
}
document.getElementById('music-btn').addEventListener('click', onMusicBtn);
document.getElementById('show-music').addEventListener('click', onMusicBtn);
// Start on the visitor's first interaction. Phones only treat a finished tap (touchend / click) as
// permission, not the moment the finger lands, so listen to all of these and keep retrying.
['mousedown','pointerup','touchend','click','keydown'].forEach(function(ev){
  document.addEventListener(ev, function(e){
    if(e.target.closest && e.target.closest('#music-btn, #show-music')) return;
    music.unlocked = true;
    if(music.playing && audioCtx.state !== 'running') audioCtx.resume();   // e.g. after the phone screen was locked
    startMusic();
  }, {passive:true});
});
document.addEventListener('visibilitychange', function(){
  if(!audioCtx || !music.playing) return;
  if(document.hidden) audioCtx.suspend().catch(function(){});
  else audioCtx.resume().catch(function(){});
});
renderMusicBtn();

/* Mochi the mascot */
var mochi = document.getElementById('mochi');
var bubble = document.getElementById('mochi-bubble');
var stage = document.getElementById('stage');
var moodTimer = null;
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function setMood(m, ms){
  mochi.dataset.mood = m;
  clearTimeout(moodTimer);
  if(ms) moodTimer = setTimeout(function(){ mochi.dataset.mood = 'idle'; }, ms);
}
function say(text){
  bubble.textContent = text;
  bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
}
function bounce(cls){
  mochi.classList.remove('boing','jump','shake'); void mochi.offsetWidth; mochi.classList.add(cls);
}
mochi.addEventListener('animationend', function(e){
  if(e.target === mochi) mochi.classList.remove('boing','jump','shake');
});
function floater(text, cls){
  var el = document.createElement('span');
  el.className = 'floater ' + (cls || '');
  el.textContent = text;
  el.style.left = (35 + Math.random()*30) + '%';
  stage.appendChild(el);
  setTimeout(function(){ el.remove(); }, 1300);
}

var POKE_LINES = ['Dare to lead, dare to share! 👑','Murid Berilmu, Pemimpin Masa Depan!','Hehe, that tickles!','Boing!','I\'m squishy, not a button! …okay, also a button.','Feed me pixels pls 🥺','*happy wobble*','Again! Again!','You have nice clicking fingers.','Mochi power: 100%'];
mochi.addEventListener('click', function(){
  player.pokes = (player.pokes || 0) + 1; savePlayer();
  bounce('boing'); SFX.boing();
  setMood('happy', 900);
  say(pick(POKE_LINES));
  floater(pick(['💚','💜','✨','💕']), 'heart');
  if(player.pokes >= 10){
    var b = grantBadge('buds');
    if(b){ toast('Badge unlocked: '+b.name, b.icon); SFX.star(); }
  }
});

// eyes follow the pointer
var eyes = document.getElementById('m-eyes');
var submitView = document.getElementById('view-submit');
document.addEventListener('pointermove', function(e){
  if(submitView.hidden) return;
  var r = mochi.getBoundingClientRect();
  var dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height*.6);
  var d = Math.sqrt(dx*dx + dy*dy) || 1, k = Math.min(1, d/250);
  eyes.setAttribute('transform', 'translate('+(dx/d*7*k).toFixed(1)+' '+(dy/d*5*k).toFixed(1)+')');
});
// blink now and then
(function blink(){
  setTimeout(function(){
    mochi.classList.add('blink');
    setTimeout(function(){ mochi.classList.remove('blink'); blink(); }, 140);
  }, 2400 + Math.random()*3000);
})();

/* missions */
var titleInput = document.getElementById('f-title');
var nameInput = document.getElementById('f-name');
var descInput = document.getElementById('f-desc');
var submitBtn = document.getElementById('submit-btn');
var STEP_LINES = {
  photo:['Mmm! Delicious pixels! 😋','Nom! That\'s a tasty one.','Best snack I\'ve had all day!'],
  title:['Ooh, what a name!','Fancy title. Very fancy.','I\'d click on that!'],
  cat:['What a camp moment!','Ooh, I remember that one!','Perfect fit!'],
  name:['Nice to meet you!','A true artist signs their work.','Shhh… secret agent mode. 🕶️']
};
var MISSING_LINES = {
  photo:'Wait! My bowl is empty. Feed me a photo first! 🥺',
  title:'It needs a name! Everything deserves a name.',
  cat:'Which camp moment is this? Pick one!',
  name:'Sign it (or go secret agent) and tick the permission box!'
};
function missionState(){
  return {
    photo: !!uploadedImage,
    title: titleInput.value.trim().length >= 2,
    cat: !!submitCat,
    name: (isAnon || nameInput.value.trim().length > 0) && hasConsent
  };
}
function addXP(n){
  runXP += n;
  floater('+'+n+' XP');
  var el = document.getElementById('run-xp');
  el.textContent = '+' + runXP + ' XP';
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}
function updateMissions(){
  var st = missionState(), left = 0;
  Object.keys(st).forEach(function(k){
    document.querySelectorAll('[data-step="'+k+'"]').forEach(function(el){ el.classList.toggle('done', st[k]); });
    if(!st[k]){ left++; return; }
    if(!awarded[k]){
      awarded[k] = true;
      addXP(STEP_XP); SFX.star();
      if(k === 'name' && isAnon) say(STEP_LINES.name[2]); else say(pick(STEP_LINES[k]));
      setMood('happy', 1400); bounce('jump');
    }
  });
  if(!awarded.desc && descInput.value.trim().length >= 10){
    awarded.desc = true; addXP(DESC_XP); SFX.star(); say('A story! I love stories. 📖');
  }
  submitBtn.classList.toggle('locked', left > 0);
  submitBtn.classList.toggle('ready', left === 0);
  submitBtn.textContent = left ? '🔒 ' + left + ' mission' + (left > 1 ? 's' : '') + ' left' : '🚀 Launch it!';
}
var typeTimer = null;
function onType(){
  setMood('think');
  document.getElementById('polaroid-caption').textContent = titleInput.value.trim() || 'Untitled masterpiece';
  clearTimeout(typeTimer);
  typeTimer = setTimeout(function(){ if(mochi.dataset.mood === 'think') setMood('idle'); updateMissions(); }, 550);
}
[titleInput, nameInput, descInput].forEach(function(el){ el.addEventListener('input', onType); });

function renderSubmitCats(){
  renderHud(); renderBadges();
  var el = document.getElementById('submit-categories');
  el.innerHTML = CATS.map(function(c){ return chipHTML(c, c.id===submitCat); }).join('');
  el.querySelectorAll('.chip').forEach(function(ch){
    ch.addEventListener('click', function(){
      var was = submitCat;
      submitCat = ch.dataset.cat; renderSubmitCats();
      if(was && was !== submitCat){ SFX.pop(); say('Moving to '+cat(submitCat).name+'? Sure!'); }
      updateMissions();
    });
  });
}

/* feeding Mochi (upload) */
var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('file-input');
var munch = document.getElementById('munch');
dropzone.addEventListener('click', function(){ fileInput.click(); });
dropzone.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); fileInput.click(); } });
dropzone.addEventListener('mouseenter', function(){ if(!uploadedImage && mochi.dataset.mood==='idle'){ setMood('hungry', 1500); } });
fileInput.addEventListener('change', function(){ if(fileInput.files[0]) handleFile(fileInput.files[0]); });
// phones: one button; the phone itself offers "Take photo" or "Photo library"
document.getElementById('btn-upload').addEventListener('click', function(e){ e.stopPropagation(); fileInput.click(); });

// drop a file anywhere on the quest page
var dragDepth = 0;
function hasFiles(e){ return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') !== -1; }
window.addEventListener('dragenter', function(e){
  if(submitView.hidden || !hasFiles(e)) return;
  e.preventDefault();
  if(dragDepth++ === 0){
    dropzone.classList.add('drag'); setMood('hungry'); bounce('boing');
    say('OOH! Is that a photo?! Drop it, drop it!');
  }
});
window.addEventListener('dragover', function(e){ if(!submitView.hidden && hasFiles(e)) e.preventDefault(); });
window.addEventListener('dragleave', function(e){
  if(submitView.hidden || !hasFiles(e)) return;
  if(--dragDepth <= 0){ dragDepth = 0; dropzone.classList.remove('drag'); setMood('idle'); say('Aww… come back! 🥺'); }
});
window.addEventListener('drop', function(e){
  if(submitView.hidden || !hasFiles(e)) return;
  e.preventDefault();
  dragDepth = 0; dropzone.classList.remove('drag');
  var f = e.dataTransfer.files && e.dataTransfer.files[0];
  if(f) handleFile(f);
});
// paste an image
document.addEventListener('paste', function(e){
  if(submitView.hidden || !e.clipboardData) return;
  var items = e.clipboardData.items || [];
  for(var i=0; i<items.length; i++){
    if(items[i].kind === 'file' && items[i].type.indexOf('image/') === 0){
      e.preventDefault(); handleFile(items[i].getAsFile()); return;
    }
  }
});

function handleFile(file){
  // real photo formats only (no SVG "images", which can carry code); every photo is redrawn as a
  // fresh JPEG before upload, which also strips hidden data like GPS location
  if(!file || ['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif'].indexOf(file.type) === -1){
    SFX.nope(); setMood('sad', 1800); bounce('shake');
    say('Blegh! That\'s not a photo. Images only, please!');
    return;
  }
  if(file.size > 20*1024*1024){
    SFX.nope(); setMood('sad', 1800); bounce('shake');
    say('Oof, that one\'s too big for my tummy. Under 20 MB, please!');
    return;
  }
  dropzone.hidden = true;
  document.getElementById('preview-wrap').hidden = true;
  munch.hidden = false;
  setMood('chomp'); SFX.chomp(); bounce('boing');
  say('Nom nom nom…');

  var bar = document.getElementById('progress-bar');
  var pctEl = document.getElementById('munch-pct');
  var pct = 0, loaded = null;
  bar.style.width = '0%';
  var timer = setInterval(function(){
    pct = Math.min(100, pct + 12 + Math.random()*16);
    bar.style.width = pct + '%'; pctEl.textContent = Math.round(pct) + '%';
    if(pct >= 100 && loaded){ clearInterval(timer); showPreview(loaded); }
  }, 110);
  var reader = new FileReader();
  reader.onload = function(e){
    var img = new Image();
    img.onload = function(){
      loaded = {src:e.target.result, w:img.naturalWidth, h:img.naturalHeight};
      if(pct >= 100){ clearInterval(timer); showPreview(loaded); }
    };
    img.onerror = function(){
      clearInterval(timer); munch.hidden = true; dropzone.hidden = !!uploadedImage;
      document.getElementById('preview-wrap').hidden = !uploadedImage;
      SFX.nope(); setMood('sad', 1800); say('Hmm, I couldn\'t chew that one. Try another image?');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function showPreview(data){
  munch.hidden = true;
  uploadedImage = data.src;
  clearStickers();
  var frame = document.getElementById('photo-frame');
  frame.style.aspectRatio = data.w + ' / ' + data.h;
  // the polaroid gets a fixed width (photo + 12px border each side); the photo fills it
  frame.style.width = '100%';
  document.getElementById('polaroid').style.width = 'min(100%, ' + (Math.round(340 * data.w / data.h) + 24) + 'px)';
  document.getElementById('preview-img').src = data.src;
  var wrap = document.getElementById('preview-wrap');
  wrap.hidden = false;
  var pol = document.getElementById('polaroid');
  pol.classList.remove('drop-in'); void pol.offsetWidth; pol.classList.add('drop-in');
  updateMissions();
}
document.getElementById('btn-replace').addEventListener('click', function(){ fileInput.click(); });
document.getElementById('btn-remove').addEventListener('click', function(){
  uploadedImage = null; fileInput.value = '';
  clearStickers();
  document.getElementById('preview-wrap').hidden = true;
  dropzone.hidden = false;
  setMood('sad', 1500); say('Hey! I was still eating that… 😢');
  updateMissions();
});

/* stickers */
var stickerLayer = document.getElementById('sticker-layer');
var photoFrame = document.getElementById('photo-frame');
document.getElementById('sticker-tray').innerHTML = STICKERS.map(function(s){
  return '<button type="button" class="tray-btn" data-sticker="'+s+'" aria-label="Add sticker '+s+'">'+s+'</button>';
}).join('');
document.querySelectorAll('.tray-btn').forEach(function(b){
  b.addEventListener('click', function(){ addSticker(b.dataset.sticker); });
});
function placeSticker(s){
  s.el.style.left = s.x + '%'; s.el.style.top = s.y + '%';
  s.el.style.setProperty('--rot', s.rot + 'deg');
}
function addSticker(emoji){
  if(stickers.length >= MAX_STICKERS){ SFX.nope(); say('Whoa, that\'s a lot of stickers! Max '+MAX_STICKERS+'.'); return; }
  var el = document.createElement('span');
  el.className = 'sticker'; el.textContent = emoji;
  var s = {el:el, emoji:emoji, x:12 + Math.random()*76, y:12 + Math.random()*76, rot:Math.round(Math.random()*40 - 20)};
  placeSticker(s); stickerLayer.appendChild(el); stickers.push(s);
  makeDraggable(s); SFX.pop();
  awarded.stickers = awarded.stickers || 0;
  if(awarded.stickers < MAX_STICKER_XP){ awarded.stickers += STICKER_XP; addXP(STICKER_XP); }
  if(stickers.length === 1) say('Ooh, sparkly! Drag it wherever you like.');
  else if(stickers.length === 3) say('You\'re a real sticker artist! 🎨');
}
function removeSticker(s){
  stickers.splice(stickers.indexOf(s), 1);
  s.el.classList.add('poof');
  setTimeout(function(){ s.el.remove(); }, 250);
}
function clearStickers(){ stickers.forEach(function(s){ s.el.remove(); }); stickers = []; }
function makeDraggable(s){
  var out = false;
  s.el.addEventListener('pointerdown', function(e){
    e.preventDefault();
    s.el.setPointerCapture(e.pointerId);
    s.el.classList.add('dragging');
  });
  s.el.addEventListener('pointermove', function(e){
    if(!s.el.classList.contains('dragging')) return;
    var r = photoFrame.getBoundingClientRect();
    s.x = (e.clientX - r.left) / r.width * 100;
    s.y = (e.clientY - r.top) / r.height * 100;
    out = s.x < -4 || s.x > 104 || s.y < -4 || s.y > 104;
    s.el.classList.toggle('leaving', out);
    placeSticker(s);
  });
  function drop(){
    if(!s.el.classList.contains('dragging')) return;
    s.el.classList.remove('dragging');
    if(out){ removeSticker(s); SFX.pop(); say('Bye bye, sticker!'); }
    else{ s.x = Math.max(0, Math.min(100, s.x)); s.y = Math.max(0, Math.min(100, s.y)); placeSticker(s); }
  }
  s.el.addEventListener('pointerup', drop);
  s.el.addEventListener('pointercancel', drop);
}

// flatten stickers into the image and shrink it: a full copy (kept under Firestore's 1 MB
// document limit) plus a small thumbnail for the grids
var FULL_LIMIT = 900000, THUMB_LIMIT = 150000;
function renderPhoto(img, max, quality){
  var w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
  var cv = document.createElement('canvas');
  cv.width = Math.round(w*k); cv.height = Math.round(h*k);
  var ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(img, 0, 0, cv.width, cv.height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = Math.round(cv.width * .13) + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  stickers.forEach(function(s){
    ctx.save();
    ctx.translate(s.x/100*cv.width, s.y/100*cv.height);
    ctx.rotate(s.rot * Math.PI/180);
    ctx.fillText(s.emoji, 0, 0);
    ctx.restore();
  });
  return cv.toDataURL('image/jpeg', quality);
}
function fitPhoto(img, sizes, limit){
  for(var i=0; i<sizes.length; i++){
    var out = renderPhoto(img, sizes[i][0], sizes[i][1]);
    if(out.length < limit) return out;
  }
  return null;
}
function bakeImage(){
  return new Promise(function(resolve, reject){
    var img = new Image();
    img.onload = function(){
      try{
        var full = fitPhoto(img, [[1400,.86],[1200,.8],[1000,.75],[800,.7],[640,.65]], FULL_LIMIT);
        var thumb = fitPhoto(img, [[520,.78],[420,.7],[320,.65]], THUMB_LIMIT);
        if(!full || !thumb) throw new Error('too big');
        resolve({full:full, thumb:thumb});
      }catch(e){ reject(e); }
    };
    img.onerror = reject;
    img.src = uploadedImage;
  });
}

/* toggles */
function toggleAnon(){
  isAnon = !isAnon;
  var t = document.getElementById('anon-toggle');
  t.classList.toggle('on', isAnon); t.setAttribute('aria-checked', String(isAnon));
  nameInput.disabled = isAnon;
  nameInput.placeholder = isAnon ? 'Hidden, you\'re undercover 🕶️' : 'How should we credit you?';
  if(isAnon) nameInput.value = '';
  SFX.pop(); updateMissions();
}
var anonToggle = document.getElementById('anon-toggle');
anonToggle.addEventListener('click', toggleAnon);
anonToggle.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggleAnon(); } });

function toggleConsent(){
  hasConsent = !hasConsent;
  document.getElementById('consent-box').classList.toggle('on', hasConsent);
  consentRow.setAttribute('aria-checked', String(hasConsent));
  SFX.pop(); updateMissions();
}
var consentRow = document.getElementById('consent-check');
consentRow.addEventListener('click', toggleConsent);
consentRow.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggleConsent(); } });

var groupSelect = document.getElementById('f-group');
for(var g=1; g<=GROUP_COUNT; g++) groupSelect.insertAdjacentHTML('beforeend', '<option value="'+g+'">Group '+g+'</option>');
groupSelect.addEventListener('change', function(){
  SFX.pop();
  if(groupSelect.value && !awarded.group){ awarded.group = true; addXP(GROUP_XP); say('Go Group '+groupSelect.value+'! 📣'); }
});

var challengeSelect = document.getElementById('f-challenge');
SLOTS.forEach(function(s){
  challengeSelect.insertAdjacentHTML('beforeend', '<optgroup label="'+s.label+'">'+
    CHALLENGES.filter(function(c){ return c.day === s.key; }).map(function(c){
      return '<option value="'+c.id+'">'+c.e+' '+c.t+'</option>';
    }).join('')+'</optgroup>');
});
function onChallengePicked(){
  SFX.pop();
  if(challengeSelect.value && !awarded.challenge){
    awarded.challenge = true; addXP(CHALLENGE_XP);
    say('Challenge accepted! 🎯 ' + challenge(challengeSelect.value).e);
  }
}
challengeSelect.addEventListener('change', onChallengePicked);
// arriving from a "Take it on" button on the home page
function applyPendingChallenge(){
  if(!pendingChallenge) return;
  challengeSelect.value = pendingChallenge;
  pendingChallenge = null;
  onChallengePicked();
}

/* launch! */
var launching = false;
document.getElementById('submit-form').addEventListener('submit', function(e){
  e.preventDefault();
  if(launching) return;
  clearTimeout(typeTimer);
  updateMissions();
  var st = missionState();
  var missing = Object.keys(st).filter(function(k){ return !st[k]; });
  if(missing.length){
    SFX.nope(); setMood('sad', 1800); bounce('shake');
    say(MISSING_LINES[missing[0]]);
    missing.forEach(function(k){
      document.querySelectorAll('[data-step="'+k+'"]').forEach(function(el){
        el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge');
        setTimeout(function(){ el.classList.remove('nudge'); }, 1400);
      });
    });
    var first = document.querySelector('.mission-label[data-step="'+missing[0]+'"]');
    if(first) first.scrollIntoView({behavior:'smooth', block:'center'});
    return;
  }
  if(isUnkind(titleInput.value) || isUnkind(descInput.value) || isUnkind(nameInput.value)){
    SFX.nope(); setMood('sad', 2200); bounce('shake');
    say('Let\'s keep it kind 💛 Please change some words, then try again.');
    return;
  }
  if(cooldownLeft() > 0){
    SFX.nope(); setMood('think', 1800);
    say('Whoa, speedy! Wait ' + Math.ceil(cooldownLeft() / 1000) + ' seconds before the next photo.');
    return;
  }

  launching = true;
  submitBtn.textContent = '✨ Mochi is delivering…';
  setMood('chomp');
  var stickerCount = stickers.length;
  bakeImage().then(function(img){
    return createPost({
      title: titleInput.value.trim(),
      category: submitCat,
      description: descInput.value.trim(),
      displayName: isAnon ? 'Anonymous' : nameInput.value.trim(),
      anonymous: isAnon,
      group: groupSelect.value,
      challenge: challengeSelect.value,
      reactions: {heart:0, laugh:0, fire:0, crown:0},
      image: img.thumb,
      date: new Date().toISOString(),
      status: 'pending'
    }, img.full);
  }).then(function(){
    finishQuest(stickerCount);
  }).catch(function(err){
    console.error(err);
    launching = false;
    updateMissions();
    SFX.nope(); setMood('sad', 2200); bounce('shake');
    say('Oh no, the delivery failed! Check your internet and try again. 🥺');
    toast('Upload failed, please try again', '⚠️');
  });
});

function finishQuest(stickerCount){
  var earned = runXP + LAUNCH_XP;
  var oldLevel = levelOf(player.xp);
  player.xp += earned;
  player.shares = (player.shares || 0) + 1;
  player.lastPostAt = Date.now();
  if(challengeSelect.value){
    player.challenges = player.challenges || [];
    if(player.challenges.indexOf(challengeSelect.value) === -1) player.challenges.push(challengeSelect.value);
  }
  savePlayer();

  var unlocked = [];
  function check(cond, id){ if(cond){ var b = grantBadge(id); if(b) unlocked.push(b); } }
  check(true, 'first');
  check(player.shares >= 3, 'streak');
  check(stickerCount >= 3, 'artist');
  check(!!groupSelect.value, 'squad');
  check(isAnon, 'agent');
  check(!!challengeSelect.value, 'quester');

  var bonuses = [!!awarded.desc, stickerCount > 0, !!groupSelect.value, !!challengeSelect.value].filter(Boolean).length;
  var starCount = 1 + Math.min(2, bonuses);

  document.getElementById('submit-form').hidden = true;
  var box = document.getElementById('success-box');
  box.hidden = false;
  box.scrollIntoView({behavior:'smooth', block:'center'});

  var bigStars = document.querySelectorAll('#clear-stars .big-star');
  bigStars.forEach(function(s){ s.classList.remove('on'); });
  bigStars.forEach(function(s, i){
    if(i < starCount) setTimeout(function(){ s.classList.add('on'); SFX.star(); }, 350 + i*380);
  });
  document.getElementById('clear-hint').textContent = starCount < 3
    ? 'Mochi delivered your post to the moderators. Psst: do more bonus quests next time to earn all 3 stars!'
    : 'Perfect run! Mochi delivered your post to the moderators. It\'ll show up once it\'s approved.';

  var xpEl = document.getElementById('xp-earned'), n = 0;
  var counter = setInterval(function(){
    n = Math.min(earned, n + Math.ceil(earned/30));
    xpEl.textContent = n;
    if(n >= earned) clearInterval(counter);
  }, 30);

  var newLevel = levelOf(player.xp);
  var lu = document.getElementById('levelup');
  lu.hidden = newLevel <= oldLevel;
  if(newLevel > oldLevel) lu.textContent = '⬆️ LEVEL UP! You\'re now level ' + newLevel + ': ' + titleOf(newLevel);

  document.getElementById('new-badges').innerHTML = unlocked.map(function(b){
    return '<div class="new-badge"><span>'+b.icon+'</span><div><b>'+esc(b.name)+'</b><small>'+esc(b.desc)+'</small></div></div>';
  }).join('');

  setTimeout(renderHud, 400);
  setMood('happy'); bounce('jump');
  say(pick(['Yay! Best. Snack. Ever. 💚','Delivered! You\'re a star! ⭐','Mmm, that was delicious. More please!']));
  SFX.fanfare();
  confetti();
  launching = false;
}

function confetti(){
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv = document.createElement('canvas');
  cv.className = 'confetti';
  document.body.appendChild(cv);
  var dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
  cv.width = W*dpr; cv.height = H*dpr;
  var ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  var colors = ['#7FD3FF','#FF8DC3','#FFD84D','#6FE3B5','#B79CFF','#FFB86B','#FFFFFF'];
  var parts = [];
  for(var i=0; i<150; i++){
    parts.push({x:W/2 + (Math.random()-.5)*W*.25, y:H*.4, vx:(Math.random()-.5)*16, vy:-Math.random()*15 - 4,
      s:Math.random()*7 + 5, c:pick(colors), r:Math.random()*6, vr:(Math.random()-.5)*.3, round:Math.random() < .35});
  }
  var start = performance.now();
  (function frame(now){
    ctx.clearRect(0, 0, W, H);
    parts.forEach(function(p){
      p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if(p.round){ ctx.beginPath(); ctx.arc(0, 0, p.s/2, 0, Math.PI*2); ctx.fill(); }
      else ctx.fillRect(-p.s/2, -p.s/4, p.s, p.s/2);
      ctx.restore();
    });
    if(now - start < 3000) requestAnimationFrame(frame); else cv.remove();
  })(start);
}

document.getElementById('share-another').addEventListener('click', function(){
  document.getElementById('submit-form').reset();
  document.getElementById('submit-form').hidden = false;
  document.getElementById('success-box').hidden = true;
  uploadedImage = null; submitCat = null; isAnon = false; hasConsent = false;
  awarded = {}; runXP = 0;
  clearStickers();
  fileInput.value = '';
  nameInput.disabled = false; nameInput.placeholder = 'How should we credit you?';
  document.getElementById('run-xp').textContent = '+0 XP';
  document.getElementById('polaroid-caption').textContent = 'Untitled masterpiece';
  document.getElementById('preview-wrap').hidden = true;
  dropzone.hidden = false;
  anonToggle.classList.remove('on'); anonToggle.setAttribute('aria-checked', 'false');
  document.getElementById('consent-box').classList.remove('on'); consentRow.setAttribute('aria-checked', 'false');
  renderSubmitCats(); updateMissions();
  setMood('hungry', 1500); say('Round two? I\'m still hungry! 😋');
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ---------- ADMIN ---------- */
if(cloud){
  document.getElementById('admin-email').hidden = false;
  document.getElementById('admin-pw').type = 'password';
  document.getElementById('admin-pw').placeholder = 'Password';
  document.getElementById('admin-gate-hint').textContent = 'Sign in with the admin account created in Firebase.';
}
document.getElementById('admin-login').addEventListener('click', function(){
  var val = document.getElementById('admin-pw').value;
  if(cloud){
    var btn = this;
    btn.disabled = true;
    var email = document.getElementById('admin-email').value.trim();
    cloud.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function(){
      return cloud.auth.signInWithEmailAndPassword(email, val);
    }).then(function(){
      toast('Welcome back, moderator', '👋');
      document.getElementById('admin-pw').value = '';
    }).catch(function(){
      toast('Wrong email or password', '🚫');
    }).then(function(){ btn.disabled = false; });
    return;
  }
  if(val === 'admin123'){
    isAdmin = true;
    try{ sessionStorage.setItem('sharespace_admin','1'); }catch(e){}
    toast('Welcome back, moderator', '👋');
    renderAdmin();
  } else {
    toast('Incorrect passcode', '🚫');
  }
});
document.getElementById('admin-pw').addEventListener('keydown', function(e){
  if(e.key==='Enter') document.getElementById('admin-login').click();
});
document.getElementById('admin-logout').addEventListener('click', function(){
  if(cloud){ cloud.auth.signOut(); return; }
  isAdmin = false;
  try{ sessionStorage.removeItem('sharespace_admin'); }catch(e){}
  renderAdmin();
});

var adminTab = 'pending';
function renderAdmin(){
  document.getElementById('admin-gate').hidden = isAdmin;
  document.getElementById('admin-panel').hidden = !isAdmin;
  if(!isAdmin) return;

  var counts = {pending:0, approved:0, rejected:0};
  posts.forEach(function(p){ counts[p.status] = (counts[p.status]||0)+1; });
  document.getElementById('admin-stats').innerHTML =
    '<div class="stat" style="border-color:#E0C38F"><b style="color:var(--warn)">'+counts.pending+'</b><span>Pending review</span></div>'+
    '<div class="stat" style="border-color:#9ED6BA"><b style="color:var(--good)">'+counts.approved+'</b><span>Approved</span></div>'+
    '<div class="stat" style="border-color:#E6B2B2"><b style="color:var(--bad)">'+counts.rejected+'</b><span>Rejected</span></div>'+
    '<div class="stat"><b>'+posts.length+'</b><span>Total posts</span></div>';

  document.querySelectorAll('#admin-tabs .tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.status===adminTab);
    t.onclick = function(){ adminTab = t.dataset.status; renderAdmin(); };
  });

  var reportedCount = posts.filter(function(p){ return reportsFor(p.id).length; }).length;
  var rtab = document.querySelector('#admin-tabs .tab[data-status="reported"]');
  rtab.textContent = 'Reported' + (reportedCount ? ' (' + reportedCount + ')' : '');
  rtab.classList.toggle('alert', reportedCount > 0);

  var list = posts.filter(function(p){ return adminTab === 'reported' ? reportsFor(p.id).length > 0 : p.status === adminTab; })
    .sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
  var listEl = document.getElementById('admin-list');
  if(!list.length){
    listEl.innerHTML = '<div class="empty"><b>Nothing here</b><div style="margin-top:4px">No '+adminTab+' photos right now.</div></div>';
    return;
  }
  var pillStyle = {pending:'background:#FBEEDB;color:var(--warn)', approved:'background:var(--green-tint);color:var(--good)', rejected:'background:#FAE4E4;color:var(--bad)'};
  listEl.innerHTML = list.map(function(p){
    var c = cat(p.category);
    return '<div class="admin-row" data-id="'+escAttr(p.id)+'">'+
      '<img class="admin-thumb" src="'+escAttr(safeImg(p.image))+'" alt="">'+
      '<div class="admin-info"><b>'+esc(p.title)+'</b>'+
      '<div class="admin-meta"><span style="color:'+c.color+'">'+c.name+'</span><span>'+esc(p.anonymous?'Anonymous':p.displayName)+'</span><span>'+fmtDate(p.date)+'</span></div></div>'+
      (reportsFor(p.id).length ? '<span class="status-pill report-pill">🚩 '+reportsFor(p.id).length+'</span>' : '')+
      '<span class="status-pill" style="'+pillStyle[p.status]+'">'+p.status.charAt(0).toUpperCase()+p.status.slice(1)+'</span>'+
    '</div>';
  }).join('');
  listEl.querySelectorAll('.admin-row').forEach(function(row){
    row.addEventListener('click', function(){ openReviewModal(row.dataset.id); });
  });
}

function openReviewModal(id){
  var p = posts.find(function(x){return x.id===id;});
  if(!p) return;
  var c = cat(p.category);
  var revImg = document.getElementById('review-modal-img');
  revImg.src = p.image;
  revImg.dataset.id = p.id;
  fullImage(p).then(function(src){ if(revImg.dataset.id === p.id) revImg.src = src; });
  revImg.onclick = function(){
    document.getElementById('zoom-img').src = revImg.src;
    document.getElementById('zoom-scrim').classList.add('show');
  };
  var actionsHTML = '';
  if(p.status === 'pending'){
    actionsHTML = '<div style="display:flex; gap:10px; margin-top:18px">'+
      '<button class="btn btn-primary" style="flex:1" id="rev-approve">Approve</button>'+
      '<button class="btn btn-accent" style="flex:1" id="rev-reject">Reject</button></div>';
  } else if(p.rejectReason){
    actionsHTML = '<div class="hint" style="margin-top:14px; background:var(--bg); padding:10px 14px; border-radius:12px"><b style="color:var(--bad)">Rejection note:</b> '+esc(p.rejectReason)+'</div>';
  }
  var flags = reportsFor(p.id);
  if(flags.length){
    actionsHTML = '<div class="report-box"><b>🚩 Reported '+flags.length+' time'+(flags.length>1?'s':'')+'</b><ul>'+
      flags.map(function(r){ return '<li>'+esc(REPORT_REASONS[r.reason] || 'Something else')+'</li>'; }).join('')+'</ul></div>' + actionsHTML;
  }
  actionsHTML += '<div class="rev-more">'+
    (p.status === 'approved' ? '<button class="btn btn-accent btn-sm" id="rev-hide">Hide photo</button>' : '')+
    (flags.length ? '<button class="btn btn-ghost btn-sm" id="rev-dismiss">Dismiss reports</button>' : '')+
    '<button class="btn btn-ghost btn-sm" id="rev-delete">Delete forever</button></div>';
  document.getElementById('review-modal-body').innerHTML =
    '<span class="cat-pill" style="background:'+c.bg+'; color:'+c.color+'">'+c.name+'</span>'+
    '<span class="status-pill" style="margin-left:8px; '+({pending:'background:#FBEEDB;color:var(--warn)',approved:'background:var(--green-tint);color:var(--good)',rejected:'background:#FAE4E4;color:var(--bad)'}[p.status])+'">'+p.status+'</span>'+
    '<h3 style="margin:10px 0 6px">'+esc(p.title)+'</h3>'+
    '<p style="color:var(--muted)">'+esc(p.description||'No description added.')+'</p>'+
    '<div class="card-meta" style="margin-top:12px"><span>👤 '+esc(p.anonymous?'Anonymous':p.displayName)+'</span><span>Submitted '+fmtDate(p.date)+'</span></div>'+
    actionsHTML;

  document.getElementById('review-scrim').classList.add('show');

  function done(msg, icon){
    return function(){
      document.getElementById('review-scrim').classList.remove('show');
      toast(msg, icon);
      renderAdmin();
    };
  }
  function failed(){ toast('That didn\'t work. Are you still signed in?', '⚠️'); }
  var safeTitle = esc(p.title);
  if(p.status==='pending'){
    document.getElementById('rev-approve').onclick = function(){
      showConfirm({
        icon:'✅', title:'Approve this post?', message:'"'+safeTitle+'" will become visible to everyone on the site.',
        okLabel:'Approve', onConfirm:function(){
          updatePost(p, {status:'approved'}).then(done('Post approved and published', '✅'), failed);
        }
      });
    };
    document.getElementById('rev-reject').onclick = function(){
      showConfirm({
        icon:'🚫', title:'Reject this post?', message:'"'+safeTitle+'" will stay private and won\'t appear on the site.',
        okLabel:'Reject', danger:true, needsReason:true, onConfirm:function(reason){
          updatePost(p, {status:'rejected', rejectReason: reason || 'No reason given.'}).then(done('Post rejected', '🚫'), failed);
        }
      });
    };
  }
  if(document.getElementById('rev-hide')) document.getElementById('rev-hide').onclick = function(){
    showConfirm({
      icon:'🙈', title:'Hide this photo?', message:'"'+safeTitle+'" will be taken off the site right away. You can still delete it later.',
      okLabel:'Hide', danger:true, needsReason:true, onConfirm:function(reason){
        updatePost(p, {status:'rejected', rejectReason: reason || 'Hidden by admin.'}).then(done('Photo hidden', '🙈'), failed);
      }
    });
  };
  if(document.getElementById('rev-dismiss')) document.getElementById('rev-dismiss').onclick = function(){
    clearReports(p).then(done('Reports dismissed', '👍'), failed);
  };
  document.getElementById('rev-delete').onclick = function(){
    showConfirm({
      icon:'🗑️', title:'Delete this photo forever?', message:'"'+safeTitle+'" and its image will be permanently removed. This can\'t be undone.',
      okLabel:'Delete', danger:true, onConfirm:function(){
        deletePost(p).then(function(){ return clearReports(p); }).then(done('Photo deleted', '🗑️'), failed);
      }
    });
  };
}
document.getElementById('review-close').addEventListener('click', function(){ document.getElementById('review-scrim').classList.remove('show'); });
document.getElementById('review-scrim').addEventListener('click', function(e){ if(e.target===this) this.classList.remove('show'); });

/* ---------- init ---------- */
updateMissions();
route();

var hot = window.claude && window.claude.hot;
if(hot){
  hot.snapshot = function(){ return {}; };
}

})();
