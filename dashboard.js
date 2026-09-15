const $ = id => document.getElementById(id);

if (localStorage.getItem('adminLoggedIn') !== 'true') window.location.href = 'login.html';

const admin = localStorage.getItem('adminName') || 'Admin';
$('adminName').textContent = admin;
$('settingsUsername').value = admin;

const defaultUsers = [
  {name:'Deepak', email:'deepak@example.com', role:'Admin'},
  {name:'Rahul', email:'rahul@example.com', role:'User'},
  {name:'Ankit', email:'ankit@example.com', role:'User'},
  {name:'Priya', email:'priya@example.com', role:'User'}
];
const defaultStories = [
  {title:'A Secret Beginning', text:'A beautiful hidden love story.'},
  {title:'Forever in Silence', text:'Two hearts, one unforgettable story.'}
];
const defaultMessages = [
  {name:'Aman', text:'I love the portal design.', time:'Today'},
  {name:'Riya', text:'The gallery looks beautiful.', time:'Yesterday'}
];

function get(key, fallback){ try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback} }
function set(key,val){localStorage.setItem(key,JSON.stringify(val))}
if(!localStorage.getItem('lpUsers')) set('lpUsers',defaultUsers);
if(!localStorage.getItem('lpStories')) set('lpStories',defaultStories);
if(!localStorage.getItem('lpMessages')) set('lpMessages',defaultMessages);

function openSection(id){
  if(id==='gallery' && sessionStorage.getItem('galleryUnlocked')!=='true'){
    document.querySelectorAll('.page-section').forEach(s=>s.classList.remove('active-section'));
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.section==='gallery'));
    $('galleryPasswordModal').classList.add('show');
    $('galleryPasswordInput').value='';
    $('galleryPasswordMessage').textContent='';
    setTimeout(()=>$('galleryPasswordInput').focus(),50);
    return;
  }
  document.querySelectorAll('.page-section').forEach(s=>s.classList.remove('active-section'));
  const section=$(id); if(section) section.classList.add('active-section');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  if(id==='gallery') loadGallery();
}

document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>openSection(btn.dataset.section)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>openSection(btn.dataset.go)));

document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.close).classList.remove('show')));
window.addEventListener('click',e=>{if(e.target.classList.contains('modal'))e.target.classList.remove('show')});

function renderUsers(filter=''){
 const users=get('lpUsers',[]).filter(u=>(u.name+' '+u.email+' '+u.role).toLowerCase().includes(filter.toLowerCase()));
 $('usersTable').innerHTML=users.map((u,i)=>`<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td><span class="badge">${esc(u.role)}</span></td><td><button class="small danger" onclick="deleteUser(${i})">Delete</button></td></tr>`).join('') || '<tr><td colspan="4">No users found.</td></tr>';
 $('usersCount').textContent=get('lpUsers',[]).length;
}
window.deleteUser=i=>{const a=get('lpUsers',[]);a.splice(i,1);set('lpUsers',a);renderUsers($('userSearch').value);updateStats();addActivity('User deleted')};
$('userSearch').addEventListener('input',e=>renderUsers(e.target.value));
$('addUserBtn').addEventListener('click',()=>$('userModal').classList.add('show'));
$('userForm').addEventListener('submit',e=>{e.preventDefault();const a=get('lpUsers',[]);a.push({name:$('newUserName').value.trim(),email:$('newUserEmail').value.trim(),role:$('newUserRole').value});set('lpUsers',a);e.target.reset();$('userModal').classList.remove('show');renderUsers();updateStats();addActivity('New user added')});

function renderStories(filter=''){
 const stories=get('lpStories',[]).filter(s=>(s.title+' '+s.text).toLowerCase().includes(filter.toLowerCase()));
 $('storiesList').innerHTML=stories.map((s,i)=>`<article class="story-card"><div><h3>❤️ ${esc(s.title)}</h3><p>${esc(s.text)}</p></div><button class="small danger" onclick="deleteStory(${i})">Delete</button></article>`).join('') || '<p>No stories found.</p>';
 $('storiesCount').textContent=get('lpStories',[]).length;
}
window.deleteStory=i=>{const a=get('lpStories',[]);a.splice(i,1);set('lpStories',a);renderStories($('storySearch').value);updateStats();addActivity('Love story deleted')};
$('storySearch').addEventListener('input',e=>renderStories(e.target.value));
$('addStoryBtn').addEventListener('click',()=>$('storyModal').classList.add('show'));
$('userModal').addEventListener('keydown',()=>{});
$('storyForm').addEventListener('submit',e=>{e.preventDefault();const a=get('lpStories',[]);a.push({title:$('newStoryTitle').value.trim(),text:$('newStoryText').value.trim()});set('lpStories',a);e.target.reset();$('storyModal').classList.remove('show');renderStories();updateStats();addActivity('New love story added')});

function renderMessages(){
 const msgs=get('lpMessages',[]);$('messagesList').innerHTML=msgs.map((m,i)=>`<div class="message-card"><div><b>💬 ${esc(m.name)}</b><p>${esc(m.text)}</p><small>${esc(m.time)}</small></div><button class="small danger" onclick="deleteMessage(${i})">Delete</button></div>`).join('');$('messagesCount').textContent=msgs.length;
}
window.deleteMessage=i=>{const a=get('lpMessages',[]);a.splice(i,1);set('lpMessages',a);renderMessages();updateStats();addActivity('Message deleted')};

// Simple gallery password. Change only this value if you want a different password.
const GALLERY_PASSWORD = '9210';

$('galleryPasswordForm').addEventListener('submit',e=>{
 e.preventDefault();
 const entered=$('galleryPasswordInput').value;
 if(entered===GALLERY_PASSWORD){
   sessionStorage.setItem('galleryUnlocked','true');
   $('galleryPasswordModal').classList.remove('show');
   $('galleryPasswordMessage').textContent='';
   openSection('gallery');
 }else{
   $('galleryPasswordMessage').textContent='Incorrect gallery password.';
   $('galleryPasswordMessage').className='message error';
   $('galleryPasswordInput').value='';
   $('galleryPasswordInput').focus();
 }
});
$('galleryEyeBtn').addEventListener('click',()=>{
 const input=$('galleryPasswordInput');
 input.type=input.type==='password'?'text':'password';
});

function loadGallery(){
 const grid=$('galleryGrid');grid.innerHTML='';let loaded=0;
 for(let i=1;i<=500;i++){
   const card=document.createElement('div');card.className='photo-card';
   const img=document.createElement('img');img.src=`photos/photo${i}.png`;img.alt=`Photo ${i}`;
   const caption=document.createElement('div');caption.textContent=`Photo ${i}`;card.append(img,caption);grid.appendChild(card);
   img.onload=()=>{loaded++;$('galleryCount').textContent=loaded;$('photosCount').textContent=loaded};
   img.onerror=()=>card.remove();
 }
 setTimeout(()=>{$('galleryCount').textContent=loaded;$('photosCount').textContent=loaded},800);
}

function addActivity(text){let a=get('lpActivity',[]);a.unshift({text,time:new Date().toLocaleString()});set('lpActivity',a.slice(0,20));renderActivity()}
function renderActivity(){const a=get('lpActivity',[]);$('activityList').innerHTML=a.length?a.map(x=>`<div class="activity-item">🔹 <b>${esc(x.text)}</b><small>${esc(x.time)}</small></div>`).join(''):'<p>No activity yet.</p>'}
function updateStats(){$('usersCount').textContent=get('lpUsers',[]).length;$('storiesCount').textContent=get('lpStories',[]).length;$('messagesCount').textContent=get('lpMessages',[]).length;}
function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');$('themeBtn').textContent=document.body.classList.contains('dark')?'☀️ Light Mode':'🌙 Dark Mode';localStorage.setItem('lpDark',document.body.classList.contains('dark'))});
if(localStorage.getItem('lpDark')==='true'){document.body.classList.add('dark');$('themeBtn').textContent='☀️ Light Mode'}
$('logoutBtn').addEventListener('click',()=>{localStorage.removeItem('adminLoggedIn');sessionStorage.removeItem('galleryUnlocked');window.location.href='login.html'});
$('saveSettingsBtn').addEventListener('click',()=>{const name=$('settingsUsername').value.trim()||'Admin';localStorage.setItem('adminName',name);$('adminName').textContent=name;alert('Settings saved.')});
$('resetBtn').addEventListener('click',()=>{if(confirm('Reset demo users, stories and messages?')){set('lpUsers',defaultUsers);set('lpStories',defaultStories);set('lpMessages',defaultMessages);localStorage.removeItem('lpActivity');renderAll();}});

function renderAll(){renderUsers();renderStories();renderMessages();renderActivity();updateStats();}
renderAll();
