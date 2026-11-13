/* Bird alerts: foreground toasts, optional browser notifications. */
(() => {
  
  
  
  const kinds = {pheasant:['rooster',10],grouse:['grouse',25],other:['legal game',20],hen:['hen incident',-15],unrecovered:['unrecovered rooster',5]};
  const names = {logan:'Logan',ryan:'Ryan',casey:'Casey',pj:'PJ',astro:'Mickey',mike:'Mike',pops:'Pops'};
  const seenKey = 'pheasant-bird-alerts-v1';
  const seen = new Set(JSON.parse(localStorage.getItem(seenKey)||'[]'));
  let initialized = false, busy = false, lastError = 0, client = null;
  const root = document.createElement('div');
  root.id = 'bird-alert-stack';
  root.setAttribute('aria-live','polite');
  document.body.append(root);
  function show(message) {
    const el=document.createElement('div');el.className='bird-alert';el.textContent=message;
    root.prepend(el);setTimeout(()=>el.remove(),7500);
  }
  function notify(h) {
    const [label,points]=kinds[h.species]||['bird',0];
    const who=names[h.hunter]||'A hunter';
    const message='🪶 '+who+' recorded a '+label+'! '+(points>0?'+':'')+points+' points';
    show(message);
    if(document.visibilityState!=='visible'&&'Notification' in window&&Notification.permission==='granted'){
      try{new Notification('Clear and Pheasant Danger',{body:message,tag:'bird-'+h.id})}catch(e){console.debug('Browser alert unavailable',e)}
    }
  }
  function store() {
    const all=[...seen];if(all.length>500)all.splice(0,all.length-500);
    localStorage.setItem(seenKey,JSON.stringify(all));
  }
  async function check() {
    if(busy||!navigator.onLine)return;
    busy=true;
    try{
      if(!client) {
        if(!window.supabase)return;
        client=window.huntSupabase;if(!client)return;
      }
      const {data,error}=await client.from('pheasant_2026_events').select('id,payload,deleted_at').eq('kind','harvests').is('deleted_at',null).limit(500);
      if(error)throw error;
      const rows=(data||[]).filter(x=>x.payload&&x.payload.id);
      if(!initialized){
        rows.forEach(x=>seen.add(x.id));
        initialized=true;store();return;
      }
      
      rows.reverse().forEach(row=>{
        if(seen.has(row.id))return;
        seen.add(row.id);
        notify(row.payload);
      });
      store();
    }catch(e){
      if(Date.now()-lastError>60000){console.warn('Bird alerts waiting for live sync:',e);lastError=Date.now()}
    }finally{busy=false}
  }
  const control=document.createElement('button');
  control.type='button';control.id='bird-alert-enable';control.textContent='🔔 Enable bird alerts';
  control.addEventListener('click',async()=>{
    if(!('Notification' in window)){show('In-app bird alerts are active. Browser notifications are unavailable here.');return}
    try{
      const permission=await Notification.requestPermission();
      show(permission==='granted'?'Bird alerts enabled while this app is running.':'In-app bird alerts remain active.');
      control.textContent=permission==='granted'?'🔔 Bird alerts on':'🔔 Enable bird alerts';
    }catch(e){show('In-app bird alerts remain active.')}
  });
  document.querySelector('header')?.append(control);
  if('Notification' in window&&Notification.permission==='granted')control.textContent='🔔 Bird alerts on';
  check();setInterval(check,15000);
  window.addEventListener('online',check);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
