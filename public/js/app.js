const $=s=>document.querySelector(s),pg=document.body.dataset.page;
const tk=()=>localStorage.getItem('t'),me=()=>JSON.parse(localStorage.getItem('u')||'null');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(u,m='GET',b){const r=await fetch('/api'+u,{method:m,headers:{'Content-Type':'application/json',...(tk()?{Authorization:'Bearer '+tk()}:{})},body:b?JSON.stringify(b):undefined});
 const d=await r.json();if(!r.ok)throw new Error(d.error||'Something went wrong');return d}
function toast(m,ok=true){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.append(t)}
 t.textContent=m;t.style.background=ok?'#10b981':'#ef4444';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
const badge=s=>`<span class="badge ${s.replace(' ','-')}">${s}</span>`;
const u=me(),links=[['index','Home'],['about','About'],['track','Track'],['contact','Contact']];
if(u){links.push(['submit','New Complaint'],['my','My Complaints']);if(u.role==='admin')links.push(['admin','Admin'])}else links.push(['login','Login'],['register','Register']);
$('#h').innerHTML=`<a class="logo" href="index.html">📢 Madhu Complaint Management System</a><nav>${links.map(l=>`<a href="${l[0]}.html" class="${l[0]===pg?'on':''}">${l[1]}</a>`).join('')}${u?`<a href="#" id="out">Logout (${esc(u.name)})</a>`:''}</nav>`;
$('#f').innerHTML='© '+new Date().getFullYear()+' Madhu Complaint Management System';
$('#out')?.addEventListener('click',e=>{e.preventDefault();localStorage.clear();location='index.html'});
if(['submit','my','admin'].includes(pg)&&!u)location='login.html';
if(pg==='admin'&&u?.role!=='admin')location='index.html';
const form=(id,fn)=>$(id)?.addEventListener('submit',async e=>{e.preventDefault();try{await fn(Object.fromEntries(new FormData(e.target)),e.target)}catch(x){toast(x.message,false)}});
const sess=d=>{localStorage.setItem('t',d.token);localStorage.setItem('u',JSON.stringify(d.user));location=d.user.role==='admin'?'admin.html':'my.html'};
form('#login',async d=>sess(await api('/login','POST',d)));
form('#register',async d=>sess(await api('/register','POST',d)));
form('#contact',async(d,f)=>{await api('/contact','POST',d);toast('Message sent!');f.reset()});
form('#submit',async(d,f)=>{const r=await api('/complaints','POST',d);f.reset();$('#done').innerHTML=`<div class="card">✅ Complaint submitted. Your ticket number is <b>${r.ticket}</b>. Save it to track progress.</div>`});
form('#track',async d=>{try{const c=await api('/track/'+encodeURIComponent(d.ticket));
 $('#result').innerHTML=`<div class="card item"><h3>${esc(c.title)}</h3><p>${badge(c.status)} · ${esc(c.category)} · ${esc(c.priority)} priority</p><p>Filed: ${new Date(c.created_at).toLocaleString()}</p><p>Admin note: ${esc(c.admin_note)||'No note yet'}</p></div>`}catch(x){$('#result').innerHTML='';throw x}});
if(pg==='index')api('/stats').then(s=>{for(const k in s){const el=$('#'+k);if(!el)continue;let n=0;const t=setInterval(()=>{el.textContent=n;if(n>=s[k])clearInterval(t);n++},40)}}).catch(()=>{});
if(pg==='my')api('/complaints/mine').then(l=>{$('#list').innerHTML=l.length?l.map(c=>`<div class="card item"><h3>${esc(c.title)} ${badge(c.status)}</h3><p>Ticket <b>${c.ticket}</b> · ${esc(c.category)} · ${esc(c.priority)}</p><p>${esc(c.description)}</p><p><i>Admin note: ${esc(c.admin_note)||'—'}</i></p></div>`).join(''):'<div class="card">No complaints yet. <a href="submit.html">File your first complaint</a>.</div>'}).catch(x=>toast(x.message,false));
if(pg==='admin')api('/admin/complaints').then(l=>{$('#rows').innerHTML=l.map(c=>`<tr data-id="${c.id}"><td>${c.ticket}</td><td>${esc(c.user_name)}</td><td>${esc(c.title)}<br><small>${esc(c.description)}</small></td><td>${esc(c.priority)}</td><td><select>${['Pending','In Progress','Resolved','Rejected'].map(s=>`<option ${s===c.status?'selected':''}>${s}</option>`).join('')}</select></td><td><input value="${esc(c.admin_note)}" placeholder="Note"></td><td><button class="btn">Save</button></td></tr>`).join('');
 $('#rows').onclick=async e=>{if(e.target.tagName!=='BUTTON')return;const tr=e.target.closest('tr');try{await api('/admin/complaints/'+tr.dataset.id,'PUT',{status:tr.querySelector('select').value,admin_note:tr.querySelector('input').value});toast('Updated!')}catch(x){toast(x.message,false)}}}).catch(x=>toast(x.message,false));
