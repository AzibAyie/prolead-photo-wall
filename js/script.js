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
var GROUP_COUNT = 12;

/* ---------- demo posts (img/demo) — set to false before the real camp ---------- */
var SEED_DEMO = true;
var DEMO = [
  // [file, moment, day, hour, title, description, credit, group, status]
  ['09', 'arrival',   24, 10, 'On the road to Muadzam Shah 🚗', 'Snacks packed, playlist ready. Let\'s go!', 'Facilitator', '', 'approved'],
  ['08', 'arrival',   24, 15, 'Hello, ASPURI hostel!', 'Our home for the next four days.', 'Media Team', '', 'approved'],
  ['11', 'arrival',   24, 16, 'Facilitators\' rest room is ready', 'Beds made, fans on. Rest well, team!', 'Logistic Team', '', 'approved'],
  ['13', 'arrival',   24, 17, 'Room check done ✅', 'Clean, comfy and cute bedsheets.', 'Logistic Team', '', 'approved'],
  ['02', 'icebreak',  25, 17, 'Group cheer energy!', 'Loudest group wins, and we were LOUD.', 'Media Team', '3', 'approved'],
  ['14', 'debate',    25, 21, 'The debate chamber is set', 'Order, order! Parliamentary Debate starts tonight.', 'Activity Team', '', 'approved'],
  ['03', 'questrace', 26,  8, 'Team photo before QuestRace', 'Peace signs up before checkpoint 1!', 'Facilitator', '5', 'approved'],
  ['10', 'integrity', 26, 10, 'Hall ready for the integrity session', 'Mats down, ready to share and reflect.', 'Activity Team', '', 'approved'],
  ['04', 'groups',    26, 15, 'Facilitator squad 😎', 'Siput Menyanyi crew, reporting for duty.', 'Media Team', '', 'approved'],
  ['01', 'groups',    26, 16, 'LDK: Siapa Saya? Thumbs up!', 'Answering the big question with a big thumbs up.', 'Anonymous', '8', 'approved'],
  ['05', 'cultural',  26, 22, 'Supper after Cultural Night', 'Well earned after that performance!', 'Facilitator', '', 'approved'],
  ['12', 'closing',   27, 12, 'Farewell lunch at Dewan Makan', 'Last meal together before the closing ceremony.', 'Logistic Team', '', 'approved'],
  ['07', 'closing',   27, 13, 'One last group photo', 'Dare to lead, dare to smile! 👑', 'Media Team', '', 'approved'],
  // waiting in the admin queue for the demo
  ['06', 'questrace', 26,  9, 'Checkpoint spotted: goats! 🐐', 'Not part of the race, but we had to stop.', 'Anonymous', '2', 'pending'],
  ['15', 'questrace', 26, 11, 'QuestRace route check', 'Courtyard is clear, checkpoint 3 is through here.', 'Facilitator', '', 'pending']
];
function seedPosts(){
  if(!SEED_DEMO) return [];
  return DEMO.map(function(d, i){
    return {
      id:'demo'+(i+1), title:d[4], category:d[1], description:d[5],
      displayName:d[6], anonymous:d[6]==='Anonymous', group:d[7],
      image:'img/demo/'+d[0]+'.jpg', date:campDate(d[2], d[3]), status:d[8]
    };
  });
}
function campDate(d, h){ return new Date(2026, 10, d, h).toISOString(); }
function fmtDate(iso){ var d = new Date(iso); return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); }
function groupLabel(p){ return p.group ? 'Group '+p.group : ''; }

/* ---------- state + persistence ---------- */
// Cloud mode (Firebase) when js/firebase-config.js is filled in, otherwise a local demo in this browser.
var STORE_KEY = 'prolead_posts_v3';
var posts = [];
var isAdmin = false;
var cloud = null;
var FB = window.PROLEAD_FIREBASE || {};
if(window.firebase && FB.apiKey){
  try{
    firebase.initializeApp(FB);
    cloud = {db: firebase.firestore(), auth: firebase.auth()};
  }catch(e){ console.error('Firebase failed to start', e); }
}
if(!cloud){
  try{
    var raw = localStorage.getItem(STORE_KEY);
    posts = raw ? JSON.parse(raw) : seedPosts();
    if(!raw) localStorage.setItem(STORE_KEY, JSON.stringify(posts));
  }catch(e){ posts = seedPosts(); }
  try{ isAdmin = sessionStorage.getItem('sharespace_admin') === '1'; }catch(e){}
}
function save(){ if(!cloud){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(posts)); }catch(e){} } }

// live updates: public sees approved posts, the signed-in admin sees everything
var unsubPosts = null, knownIds = null;
function subscribePosts(){
  if(!cloud) return;
  if(unsubPosts) unsubPosts();
  knownIds = null;
  var col = cloud.db.collection('posts');
  unsubPosts = (isAdmin ? col : col.where('status', '==', 'approved')).onSnapshot(function(snap){
    posts = snap.docs.map(function(d){ var p = d.data(); p.id = d.id; return p; });
    if(knownIds){
      posts.forEach(function(p){
        if(!knownIds[p.id] && p.status === 'approved' && !isAdmin) toast('New photo: ' + p.title, '📸');
        if(!knownIds[p.id] && p.status === 'pending' && isAdmin) toast('New photo to review: ' + p.title, '🔔');
      });
    }
    knownIds = {};
    posts.forEach(function(p){ knownIds[p.id] = true; });
    renderCurrent();
  }, function(err){
    console.error(err);
    toast('Could not load photos. Check your connection.', '⚠️');
  });
}
if(cloud){
  cloud.auth.onAuthStateChanged(function(user){
    isAdmin = !!user && (!FB.adminEmail || user.email === FB.adminEmail);
    if(user && !isAdmin){ cloud.auth.signOut(); toast('That account is not an admin', '🚫'); }
    subscribePosts();
    renderCurrent();
  });
}

function createPost(p, full){
  if(!cloud){
    p.id = 'p' + Date.now(); p.image = full;
    posts.unshift(p); save();
    return Promise.resolve();
  }
  var ref = cloud.db.collection('posts').doc();
  var batch = cloud.db.batch();
  batch.set(ref, p);
  batch.set(cloud.db.collection('images').doc(ref.id), {full: full});
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
  return batch.commit();
}
// cards use the small thumbnail; the full photo is fetched when opened
var fullCache = {};
function fullImage(p){
  if(!cloud) return Promise.resolve(p.image);
  if(fullCache[p.id]) return Promise.resolve(fullCache[p.id]);
  return cloud.db.collection('images').doc(p.id).get().then(function(d){
    var src = d.exists ? d.data().full : p.image;
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
var VIEWS = ['home','explore','submit','admin'];
function currentView(){
  var hash = (location.hash || '#home').slice(1);
  return VIEWS.indexOf(hash) === -1 ? 'home' : hash;
}
function route(){
  var hash = currentView();
  VIEWS.forEach(function(v){
    document.getElementById('view-'+v).hidden = (v !== hash);
  });
  document.querySelectorAll('.navlink').forEach(function(a){
    a.classList.toggle('active', a.dataset.route === hash);
  });
  if(hash === 'submit') renderSubmitCats();
  renderCurrent();
  window.scrollTo(0,0);
}
// re-render the visible list (called on navigation and on live data updates)
function renderCurrent(){
  var hash = currentView();
  if(hash === 'home') renderHome();
  if(hash === 'explore') renderExplore();
  if(hash === 'admin') renderAdmin();
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
  return '<article class="card" data-id="'+p.id+'" tabindex="0" role="button" aria-label="Open post: '+escAttr(p.title)+'">'+
    '<div class="card-img"><img src="'+p.image+'" alt="'+escAttr(p.title)+'" loading="lazy"></div>'+
    '<div class="card-body">'+
      '<span class="cat-pill" style="background:'+c.bg+'; color:'+c.color+'">'+c.name+'</span>'+
      '<div class="card-title">'+esc(p.title)+'</div>'+
      '<div class="card-meta"><span>'+esc(name)+'</span><span>'+fmtDate(p.date)+'</span></div>'+
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
  var catsEl = document.getElementById('home-categories');
  catsEl.innerHTML = CATS.map(function(c){
    var count = posts.filter(function(p){return p.category===c.id && p.status==='approved';}).length;
    return '<a href="#explore" class="chip" data-gocat="'+c.id+'" style="background:'+c.bg+'; color:'+c.color+'; text-decoration:none">'+
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="'+c.color+'" stroke-width="2"><path d="'+c.icon+'" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
      c.name+' <span style="opacity:.65">· '+count+'</span></a>';
  }).join('');
  catsEl.querySelectorAll('[data-gocat]').forEach(function(el){
    el.addEventListener('click', function(){ pendingExploreCat = el.dataset.gocat; });
  });

  var recent = posts.filter(function(p){return p.status==='approved';})
    .sort(function(a,b){ return new Date(b.date)-new Date(a.date); }).slice(0,6);
  document.getElementById('home-recent').innerHTML = recent.map(cardHTML).join('') || emptyState('No posts yet','Be the first to share something!');

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

/* ---------- card click -> modal ---------- */
function bindCards(){
  document.querySelectorAll('.card[data-id]').forEach(function(card){
    card.addEventListener('click', function(){ openPostModal(card.dataset.id); });
    card.addEventListener('keydown', function(e){ if(e.key==='Enter') openPostModal(card.dataset.id); });
  });
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
  document.getElementById('post-modal-body').innerHTML =
    '<span class="cat-pill" style="background:'+c.bg+'; color:'+c.color+'">'+c.name+'</span>'+
    '<h3 style="margin:10px 0 6px">'+esc(p.title)+'</h3>'+
    '<p style="color:var(--muted)">'+esc(p.description||'No description added.')+'</p>'+
    '<div class="card-meta" style="margin-top:14px"><span>👤 '+esc(p.anonymous?'Anonymous':p.displayName)+(p.group?' · 👥 '+esc(groupLabel(p)):'')+'</span><span>'+fmtDate(p.date)+'</span></div>';
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
var player = {xp:0, shares:0, pokes:0, badges:[], sound:true};
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
  {id:'buds',   icon:'💚', name:'Best Buds',          desc:'Poke Mochi 10 times'}
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
  if(!file || !file.type || file.type.indexOf('image/') !== 0){
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
  frame.style.width = 'min(100%, ' + Math.round(340 * data.w / data.h) + 'px)';
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
  savePlayer();

  var unlocked = [];
  function check(cond, id){ if(cond){ var b = grantBadge(id); if(b) unlocked.push(b); } }
  check(true, 'first');
  check(player.shares >= 3, 'streak');
  check(stickerCount >= 3, 'artist');
  check(!!groupSelect.value, 'squad');
  check(isAnon, 'agent');

  var bonuses = [!!awarded.desc, stickerCount > 0, !!groupSelect.value].filter(Boolean).length;
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
    cloud.auth.signInWithEmailAndPassword(document.getElementById('admin-email').value.trim(), val).then(function(){
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

  var list = posts.filter(function(p){ return p.status===adminTab; })
    .sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
  var listEl = document.getElementById('admin-list');
  if(!list.length){
    listEl.innerHTML = '<div class="empty"><b>Nothing here</b><div style="margin-top:4px">No '+adminTab+' submissions right now.</div></div>';
    return;
  }
  var pillStyle = {pending:'background:#FBEEDB;color:var(--warn)', approved:'background:var(--green-tint);color:var(--good)', rejected:'background:#FAE4E4;color:var(--bad)'};
  listEl.innerHTML = list.map(function(p){
    var c = cat(p.category);
    return '<div class="admin-row" data-id="'+p.id+'">'+
      '<img class="admin-thumb" src="'+p.image+'" alt="">'+
      '<div class="admin-info"><b>'+esc(p.title)+'</b>'+
      '<div class="admin-meta"><span style="color:'+c.color+'">'+c.name+'</span><span>'+esc(p.anonymous?'Anonymous':p.displayName)+'</span><span>'+fmtDate(p.date)+'</span></div></div>'+
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
  actionsHTML += '<button class="btn btn-ghost btn-sm" style="margin-top:14px" id="rev-delete">🗑️ Delete forever</button>';
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
  document.getElementById('rev-delete').onclick = function(){
    showConfirm({
      icon:'🗑️', title:'Delete this photo forever?', message:'"'+safeTitle+'" and its image will be permanently removed. This can\'t be undone.',
      okLabel:'Delete', danger:true, onConfirm:function(){
        deletePost(p).then(done('Photo deleted', '🗑️'), failed);
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
