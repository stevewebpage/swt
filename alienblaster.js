
(function(){
  // Inject modal CSS
  var style = document.createElement('style');
  style.textContent = `
#ab-modal { display:none; position:fixed; inset:0; z-index:9999; background:rgba(4,10,6,.97); flex-direction:column; }
#ab-modal.open { display:flex; }
#ab-close-btn { position:absolute; top:12px; right:16px; background:rgba(255,255,255,.12); border:1px solid rgba(255,220,80,.4); color:#ffe066; font-family:'Abril Fatface',cursive; font-size:1rem; letter-spacing:2px; border-radius:20px; padding:6px 18px; cursor:pointer; z-index:10001; }
#ab-close-btn:hover { background:rgba(255,220,80,.2); }
#ab-frame-wrap { flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden; }
#ab-canvas { display:block; touch-action:none; }
#ab-hud { position:absolute; top:0; left:0; width:100%; pointer-events:none; z-index:50; }
  `;
  document.head.appendChild(style);

  // Inject modal HTML
  var div = document.createElement('div');
  div.innerHTML = `<!-- Modal overlay — game runs here -->
<div id="ab-modal">
  <a href="index.html" style="position:absolute;top:12px;left:16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,220,80,.4);color:#ffe066;font-family:'Abril Fatface',cursive;font-size:1rem;letter-spacing:2px;border-radius:20px;padding:6px 18px;cursor:pointer;z-index:10001;text-decoration:none;">🏠 HOME</a>
  <button id="ab-close-btn">✕ EXIT</button>
  <div id="ab-frame-wrap">
    <canvas id="ab-canvas"></canvas>
  </div>
  <!-- HUD -->
  <div id="ab-hud" style="position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:50;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px 20px;">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(136,232,112,.5);margin-bottom:2px;">Score</div>
        <div id="ab-scoreVal" style="font-family:'Abril Fatface',cursive;font-size:28px;color:#ffe066;text-shadow:0 0 20px rgba(255,220,80,.8);">0</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(136,232,112,.5);margin-bottom:2px;">Level</div>
        <div id="ab-levelVal" style="font-family:'Abril Fatface',cursive;font-size:28px;color:#ffe066;text-shadow:0 0 20px rgba(255,220,80,.8);">1</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(136,232,112,.5);margin-bottom:2px;">Lives</div>
        <div id="ab-livesRow" style="display:flex;gap:4px;margin-top:2px;"></div>
      </div>
    </div>
  </div>
  <!-- Now Playing -->
  <div id="ab-now-playing" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
    background:rgba(0,0,0,.6);border:1px solid rgba(255,220,80,.3);border-radius:20px;
    padding:6px 18px;font-size:11px;letter-spacing:2px;color:#ffe066;text-align:center;
    pointer-events:none;z-index:50;text-shadow:0 0 10px rgba(255,220,80,.6);">
    🎵 <span id="ab-trackName">—</span>
  </div>

  <!-- START SCREEN -->
  <div id="ab-startScreen" style="position:absolute;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:100;background:rgba(7,26,12,.92);">
    <div style="font-family:'Abril Fatface',cursive;font-size:clamp(3rem,10vw,6rem);color:#ffe066;
      text-shadow:0 0 40px rgba(255,220,80,1),0 0 80px rgba(255,180,50,.5);letter-spacing:4px;text-align:center;">STAR MAN</div>
    <div style="font-family:'Abril Fatface',cursive;font-size:clamp(1rem,3vw,1.8rem);color:#88e870;
      letter-spacing:6px;margin-top:8px;text-shadow:0 0 20px rgba(100,220,80,.6);">Alien Blaster</div>
    <div style="color:rgba(200,255,180,.6);letter-spacing:4px;font-size:11px;margin-top:10px;text-transform:uppercase;">MusicRow.us · The Forest Sessions</div>
    <div style="width:280px;height:2px;margin:20px auto;background:linear-gradient(90deg,transparent,#ffe066 30%,#88e870 70%,transparent);"></div>
    <button id="ab-startBtn" style="font-family:'Abril Fatface',cursive;font-size:1.6rem;color:#071a0c;
      background:linear-gradient(135deg,#ffe066,#ffb030);border:none;padding:14px 48px;
      border-radius:40px;cursor:pointer;letter-spacing:3px;box-shadow:0 0 30px rgba(255,220,80,.6);">BLAST OFF! 🚀</button>
    <div style="color:rgba(160,240,140,.7);font-size:12px;letter-spacing:2px;margin-top:16px;text-align:center;line-height:1.8;">
      <b style="color:#ffe066;">← →</b> Move &nbsp;|&nbsp; <b style="color:#ffe066;">SPACE</b> Shoot &nbsp;|&nbsp; <b style="color:#ffe066;">Z</b> Laser Bomb<br>
      Blast ZORK · BLIP · XENU motherships before they abduct Steve!<br>
      <span style="color:#ff8888;">Red ships</span> drop bombs · <span style="color:#88ffcc;">BLIP</span> plays guitar 🎸<br>
      Collect ⭐ power-ups · Survive all waves!
    </div>
  </div>

  <!-- LEVEL SCREEN -->
  <div id="ab-levelScreen" style="position:absolute;inset:0;display:none;flex-direction:column;
    align-items:center;justify-content:center;z-index:100;background:rgba(7,26,12,.85);">
    <div id="ab-levelTitle" style="font-family:'Abril Fatface',cursive;font-size:clamp(2rem,8vw,4rem);
      color:#ffe066;text-shadow:0 0 40px rgba(255,220,80,1);letter-spacing:4px;">LEVEL 1</div>
    <div id="ab-levelSub" style="color:#88e870;letter-spacing:4px;font-size:14px;margin-top:8px;">GET READY...</div>
  </div>

  <!-- GAME OVER -->
  <div id="ab-gameOverScreen" style="position:absolute;inset:0;display:none;flex-direction:column;
    align-items:center;justify-content:center;z-index:100;background:rgba(7,26,12,.92);">
    <div style="font-family:'Abril Fatface',cursive;font-size:clamp(3rem,10vw,6rem);color:#ffe066;
      text-shadow:0 0 40px rgba(255,220,80,1);letter-spacing:4px;">GAME OVER</div>
    <div style="color:rgba(200,255,180,.6);letter-spacing:4px;font-size:11px;margin-top:10px;text-transform:uppercase;">Steve got abducted 👽</div>
    <div style="width:280px;height:2px;margin:20px auto;background:linear-gradient(90deg,transparent,#ffe066 30%,#88e870 70%,transparent);"></div>
    <div id="ab-finalScore" style="font-family:'Abril Fatface',cursive;font-size:3rem;color:#ffe066;
      text-shadow:0 0 30px rgba(255,220,80,.8);margin:10px 0;">0</div>
    <div style="color:rgba(200,255,180,.6);letter-spacing:4px;font-size:11px;text-transform:uppercase;">Final Score</div>
    <a href="index.html" style="font-family:'Abril Fatface',cursive;font-size:1.2rem;color:#ffe066;background:rgba(0,0,0,.4);border:1px solid rgba(255,220,80,.4);padding:12px 36px;border-radius:40px;cursor:pointer;letter-spacing:3px;text-decoration:none;margin-top:12px;display:inline-block;box-shadow:0 0 20px rgba(255,220,80,.3);">🏠 BACK TO THE FOREST</a>
    <button id="ab-restartBtn" style="font-family:'Abril Fatface',cursive;font-size:1.6rem;color:#071a0c;
      background:linear-gradient(135deg,#ffe066,#ffb030);border:none;padding:14px 48px;
      border-radius:40px;cursor:pointer;letter-spacing:3px;box-shadow:0 0 30px rgba(255,220,80,.6);margin-top:20px;">PLAY AGAIN</button>
  </div>
</div>`;
  document.body.appendChild(div.firstElementChild);


// ── ALIEN BLASTER EMBEDDED ────────────────────────────────────────────────────
(function(){
  const modal    = document.getElementById('ab-modal');
  const launchBtn= document.getElementById('ab-launch-btn');
  const closeBtn = document.getElementById('ab-close-btn');
  const canvas   = document.getElementById('ab-canvas');
  const ctx      = canvas.getContext('2d');

  let W, H, gameLoop, running = false;

  function resize(){
    W = canvas.width  = modal.clientWidth  || window.innerWidth;
    H = canvas.height = modal.clientHeight || window.innerHeight;
  }

  launchBtn.addEventListener('click', ()=>{
    modal.classList.add('open');
    resize();
    if(!running){ running=true; abLoop(); }
  });
  closeBtn.addEventListener('click', ()=>{
    modal.classList.remove('open');
    abAudio.pause();
  });
  window.addEventListener('resize', ()=>{ if(modal.classList.contains('open')) resize(); });

  // ── AUDIO ──────────────────────────────────────────────────────────────────
  const BASE = 'https://musicrow.us/';
  const SONGS = [
    {title:'Star Man',               mp3:'sm.mp3'},
    {title:'Rockin the Night Away',  mp3:'rtna.mp3'},
    {title:'Party Town',             mp3:'pt.mp3'},
    {title:'If Life Ain\'t Crazy',  mp3:'ilac.mp3'},
    {title:'Same Songs on the Radio',mp3:'sstr.mp3'},
    {title:'She\'s Got a Crush on Me',mp3:'sgcm.mp3'},
    {title:'Big Money Dreams',       mp3:'bmd.mp3'},
  ];
  let songIdx=0;
  const abAudio = new Audio(); abAudio.volume=0.6;
  function playSong(i){
    const s=SONGS[i%SONGS.length];
    abAudio.src=BASE+s.mp3; abAudio.load();
    abAudio.play().then(()=>{ document.getElementById('ab-trackName').textContent=s.title+' — Steve Bickham'; })
      .catch(()=>{ document.getElementById('ab-trackName').textContent=s.title+' — visit musicrow.us'; });
  }
  abAudio.addEventListener('ended',()=>{ songIdx=(songIdx+1)%SONGS.length; playSong(songIdx); });

  // ── STATE ──────────────────────────────────────────────────────────────────
  let abState='start', score=0, lives=3, level=1, bombs=1, frame=0;
  let bullets=[], enemyBullets=[], particles=[], powerups=[], enemies=[];
  let enemyDir=1, enemySpeed=1, enemyShootTimer=0;
  let laserBeam={active:false,timer:0};
  let audioStarted=false;

  // ── STARS ──────────────────────────────────────────────────────────────────
  const STARS = Array.from({length:120},()=>({
    x:Math.random(),y:Math.random(),r:0.5+Math.random()*1.8,
    op:0.3+Math.random()*0.7,tw:Math.random()*Math.PI*2,sp:0.01+Math.random()*0.03
  }));

  function drawBg(){
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#040e08'); g.addColorStop(0.5,'#071a0c'); g.addColorStop(1,'#0d2a14');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#020a04';
    for(let i=0;i<16;i++){
      const tx=(W/15)*i, th=60+Math.sin(i*1.7)*30;
      ctx.beginPath(); ctx.moveTo(tx,H); ctx.lineTo(tx+20,H-th); ctx.lineTo(tx+40,H); ctx.fill();
    }
    STARS.forEach(s=>{
      s.tw+=s.sp;
      ctx.globalAlpha=s.op*(0.6+0.4*Math.sin(s.tw));
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x*W,s.y*H*0.75,s.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1;
  }

  // ── PLAYER ─────────────────────────────────────────────────────────────────
  const player={x:0,y:0,speed:6,shootCool:0,invincible:0};
  function initPlayer(){ player.x=W/2; player.y=H-80; player.invincible=0; }

  function drawPlayer(){
    if(player.invincible>0 && Math.floor(frame/4)%2===0) return;
    ctx.save(); ctx.translate(player.x,player.y);
    const rg=ctx.createLinearGradient(-20,0,20,0);
    rg.addColorStop(0,'#405060'); rg.addColorStop(0.5,'#90b0c8'); rg.addColorStop(1,'#405060');
    ctx.fillStyle=rg; ctx.beginPath(); ctx.ellipse(0,0,18,28,0,0,Math.PI*2); ctx.fill();
    const ng=ctx.createLinearGradient(-10,-28,10,-10);
    ng.addColorStop(0,'#ffe066'); ng.addColorStop(1,'#c47a2a');
    ctx.fillStyle=ng; ctx.beginPath(); ctx.moveTo(0,-38); ctx.lineTo(-10,-16); ctx.lineTo(10,-16); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#506070';
    ctx.beginPath(); ctx.moveTo(-18,10); ctx.lineTo(-34,28); ctx.lineTo(-18,22); ctx.fill();
    ctx.beginPath(); ctx.moveTo(18,10);  ctx.lineTo(34,28);  ctx.lineTo(18,22);  ctx.fill();
    ctx.fillStyle='#88e8ff'; ctx.globalAlpha=0.8;
    ctx.beginPath(); ctx.ellipse(0,-8,8,10,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.font='12px serif'; ctx.textAlign='center'; ctx.fillText('🤠',0,-5);
    const eg=ctx.createRadialGradient(0,28,0,0,28,20);
    eg.addColorStop(0,'rgba(255,140,30,0.9)'); eg.addColorStop(0.4,'rgba(255,80,0,0.5)'); eg.addColorStop(1,'rgba(255,50,0,0)');
    ctx.fillStyle=eg;
    const flick=12+Math.sin(frame*0.4)*4;
    ctx.beginPath(); ctx.ellipse(0,28,10,flick,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // ── ENEMY SHIP DRAWING (pure canvas, no emoji) ──────────────────────────────
  // Each enemy type is a proper flying saucer / mothership design
  const ENEMY_TYPES = [
    {name:'SCOUT',      pts:10,  bombs:false, w:44, h:18, hullColor:'#506878', domeColor:'#88ccee', glowColor:'rgba(136,255,200,0.6)', lightColors:['#00ffcc','#00ccff','#88ff00'], big:false},
    {name:'ZORK',       pts:15,  bombs:false, w:52, h:20, hullColor:'#405868', domeColor:'#88ee88', glowColor:'rgba(136,255,136,0.6)', lightColors:['#88ff00','#ffee00','#00ffcc'], big:false},
    {name:'BLIP SHIP',  pts:20,  bombs:false, w:58, h:22, hullColor:'#506080', domeColor:'#88ccff', glowColor:'rgba(136,200,255,0.6)', lightColors:['#00ccff','#88ffcc','#ffffff'], big:false, guitar:true},
    {name:'XENU',       pts:25,  bombs:true,  w:62, h:24, hullColor:'#603040', domeColor:'#ff8888', glowColor:'rgba(255,100,100,0.7)', lightColors:['#ff4444','#ff8800','#ff44aa'], big:false},
    {name:'MOTHERSHIP', pts:50,  bombs:true,  w:90, h:36, hullColor:'#404055', domeColor:'#ccaaff', glowColor:'rgba(200,160,255,0.8)', lightColors:['#ff44aa','#aa44ff','#4488ff','#44ffcc','#ffee00'], big:true},
  ];

  function drawMothershipShape(t, e, bob){
    const rx=t.w/2, ry=t.h/2;
    // Glow
    ctx.shadowColor=t.glowColor; ctx.shadowBlur=16+Math.sin(e.sway)*5;

    // Main hull — flattened ellipse
    const hg=ctx.createLinearGradient(-rx,-ry,rx,ry);
    hg.addColorStop(0,'#7090a8'); hg.addColorStop(0.4,t.hullColor); hg.addColorStop(1,'#1a2030');
    ctx.fillStyle=hg;
    ctx.beginPath(); ctx.ellipse(0,bob,rx,ry*.7,0,0,Math.PI*2); ctx.fill();

    // Rim ring
    ctx.strokeStyle='rgba(180,220,255,0.3)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(0,bob,rx*.95,ry*.65,0,0,Math.PI*2); ctx.stroke();

    // Under-belly shadow
    ctx.fillStyle='rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(0,bob+ry*.5,rx*.65,ry*.28,0,0,Math.PI*2); ctx.fill();

    ctx.shadowBlur=0;

    // Dome on top
    const dg=ctx.createRadialGradient(-rx*.15,bob-ry*.5,2,0,bob-ry*.3,rx*.38);
    dg.addColorStop(0,'#c8e8ff'); dg.addColorStop(0.5,t.domeColor); dg.addColorStop(1,'rgba(60,80,100,0.6)');
    ctx.fillStyle=dg;
    ctx.beginPath(); ctx.ellipse(0,bob-ry*.3,rx*.38,ry*.72,0,0,Math.PI*2); ctx.fill();

    // Dome highlight
    ctx.fillStyle='rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.ellipse(-rx*.1,bob-ry*.5,rx*.15,ry*.22,0,0,Math.PI*2); ctx.fill();

    // Running lights along equator
    const nl=t.lightColors.length;
    for(let i=0;i<nl;i++){
      const ang=-Math.PI+(Math.PI*2/(nl))*i;
      const lx=Math.cos(ang)*rx*.78;
      const ly=bob+Math.sin(ang)*ry*.45;
      ctx.fillStyle=t.lightColors[i];
      ctx.globalAlpha=0.5+0.5*Math.sin(frame*.15+i*1.1);
      ctx.beginPath(); ctx.arc(lx,ly,t.big?3.5:2.5,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;

    // BLIP guitar nub
    if(t.guitar){
      ctx.fillStyle='#c47a2a';
      ctx.beginPath(); ctx.ellipse(rx*.62,bob+2,5,4,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#8B5E3C'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(rx*.55,bob+2); ctx.lineTo(rx*.2,bob); ctx.stroke();
      if(frame%18===0) particles.push({x:e.x+rx*.6,y:e.y-10,type:'note',life:40,dy:-1.5,dx:0.5});
    }

    // Name tag
    ctx.fillStyle='rgba(200,240,180,0.8)';
    ctx.font=`bold ${t.big?9:7}px Lato,sans-serif`;
    ctx.textAlign='center';
    ctx.fillText(t.name, 0, bob+ry*.7+12);

    // HP bar
    if(e.hp>1){
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(-rx*.6,bob+ry*.7+15,rx*1.2,4);
      ctx.fillStyle=e.hp>=3?'#88ff44':e.hp>=2?'#ffcc00':'#ff4444';
      ctx.fillRect(-rx*.6,bob+ry*.7+15,rx*1.2*(e.hp/e.maxHp),4);
    }
  }

  function drawEnemy(e){
    if(!e.alive) return;
    ctx.save(); ctx.translate(e.x,e.y);
    e.sway+=0.04;
    const bob=Math.sin(e.sway)*3;
    if(e.hit>0){ ctx.globalAlpha=0.4+0.6*Math.sin(e.hit*0.8); e.hit--; }
    drawMothershipShape(ENEMY_TYPES[e.type], e, bob);
    ctx.restore();
  }

  // ── SPAWN ENEMIES ───────────────────────────────────────────────────────────
  function spawnEnemies(){
    enemies=[]; enemyDir=1; enemySpeed=0.7+level*0.25;
    const cols=Math.min(6+level,10), rows=Math.min(2+Math.floor(level/2),4);
    const rowTypes=[0,1,2,3];
    for(let r=0;r<rows;r++){
      const ti=rowTypes[Math.min(r,rowTypes.length-1)], t=ENEMY_TYPES[ti];
      for(let c=0;c<cols;c++){
        const baseHp=ti>=3?2:1;
        enemies.push({
          x:80+c*(W-160)/cols, y:70+r*62,
          w:t.w, h:t.h, type:ti, name:t.name,
          pts:t.pts, bombs:t.bombs, guitar:t.guitar||false,
          alive:true, sway:Math.random()*Math.PI*2,
          hp:level>=4?baseHp+1:baseHp, maxHp:level>=4?baseHp+1:baseHp, hit:0
        });
      }
    }
    if(level>=2){
      const t=ENEMY_TYPES[4];
      enemies.push({x:-120,y:35,w:t.w,h:t.h,type:4,name:t.name,
        pts:200,bombs:true,guitar:false,alive:true,sway:0,hp:3,maxHp:3,hit:0,streaker:true});
    }
  }

  // ── BULLETS ─────────────────────────────────────────────────────────────────
  function fireBullet(){ bullets.push({x:player.x,y:player.y-30,dy:-12}); }
  function fireLaserBomb(){
    if(bombs<=0) return; bombs--;
    laserBeam={active:true,timer:30,x:player.x};
  }

  function drawBullets(){
    bullets.forEach(b=>{
      const bg=ctx.createLinearGradient(b.x,b.y,b.x,b.y+14);
      bg.addColorStop(0,'#fff'); bg.addColorStop(0.3,'#ffe066'); bg.addColorStop(1,'rgba(255,180,0,0)');
      ctx.fillStyle=bg; ctx.beginPath(); ctx.roundRect(b.x-1.5,b.y-14,3,14,2); ctx.fill();
    });
  }

  function drawLaser(){
    if(!laserBeam.active) return;
    ctx.save(); ctx.globalAlpha=laserBeam.timer/30;
    const lg=ctx.createLinearGradient(laserBeam.x,0,laserBeam.x,player.y);
    lg.addColorStop(0,'rgba(120,255,120,0)'); lg.addColorStop(0.5,'rgba(120,255,200,0.9)'); lg.addColorStop(1,'rgba(80,255,160,0.4)');
    ctx.fillStyle=lg; ctx.fillRect(laserBeam.x-20,0,40,player.y);
    ctx.strokeStyle='#aaffaa'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(laserBeam.x,0); ctx.lineTo(laserBeam.x,player.y); ctx.stroke();
    ctx.restore();
  }

  // ── PARTICLES ───────────────────────────────────────────────────────────────
  function explode(x,y,col,count=18){
    for(let i=0;i<count;i++){
      const ang=Math.random()*Math.PI*2, spd=2+Math.random()*5;
      particles.push({x,y,col,dx:Math.cos(ang)*spd,dy:Math.sin(ang)*spd,
        life:30+Math.random()*20,maxLife:50,r:2+Math.random()*4,type:'spark'});
    }
    particles.push({x,y,type:'emoji',emoji:'💥',life:20,maxLife:20,dy:-1,dx:0,size:24});
  }

  function drawParticles(){
    particles.forEach(p=>{
      if(p.type==='spark'){
        ctx.globalAlpha=p.life/p.maxLife; ctx.fillStyle=p.col;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(p.life/p.maxLife),0,Math.PI*2); ctx.fill();
      } else if(p.type==='note'){
        ctx.globalAlpha=p.life/40; ctx.font='14px serif'; ctx.textAlign='center'; ctx.fillText('🎵',p.x,p.y);
      } else if(p.type==='emoji'){
        ctx.globalAlpha=p.life/p.maxLife; ctx.font=`${p.size}px serif`; ctx.textAlign='center'; ctx.fillText(p.emoji,p.x,p.y);
      }
      p.x+=p.dx; p.y+=p.dy; p.life--;
    });
    ctx.globalAlpha=1;
    particles=particles.filter(p=>p.life>0);
  }

  // ── POWERUPS ────────────────────────────────────────────────────────────────
  function spawnPowerup(x,y){ powerups.push({x,y,dy:1.5,type:Math.random()<0.4?'bomb':'life',life:300}); }
  function drawPowerups(){
    powerups.forEach(p=>{
      ctx.font='22px serif'; ctx.textAlign='center';
      ctx.globalAlpha=0.7+0.3*Math.sin(frame*.08);
      ctx.fillText(p.type==='bomb'?'💣':'❤️',p.x,p.y);
    });
    ctx.globalAlpha=1;
  }

  // ── HUD ──────────────────────────────────────────────────────────────────────
  function updateHUD(){
    document.getElementById('ab-scoreVal').textContent=score;
    document.getElementById('ab-levelVal').textContent=level;
    const lr=document.getElementById('ab-livesRow');
    lr.innerHTML='';
    for(let i=0;i<lives;i++) lr.innerHTML+='<div style="font-size:16px;filter:drop-shadow(0 0 4px rgba(120,255,120,.8));">🛸</div>';
  }

  // ── INPUT ────────────────────────────────────────────────────────────────────
  const keys={};
  window.addEventListener('keydown',e=>{
    if(!modal.classList.contains('open')) return;
    keys[e.code]=true;
    if(e.code==='Space') e.preventDefault();
    if(e.code==='KeyZ' && abState==='playing') fireLaserBomb();
  });
  window.addEventListener('keyup',e=>{ keys[e.code]=false; });

  let touchX=null;
  canvas.addEventListener('touchstart',e=>{
    e.preventDefault(); touchX=e.touches[0].clientX;
    if(abState==='playing') fireBullet();
  },{passive:false});
  canvas.addEventListener('touchmove',e=>{
    e.preventDefault();
    if(touchX!==null){
      player.x=Math.max(30,Math.min(W-30,player.x+(e.touches[0].clientX-touchX)));
      touchX=e.touches[0].clientX;
    }
  },{passive:false});

  // ── GAME FLOW ────────────────────────────────────────────────────────────────
  function startGame(){
    score=0;lives=3;level=1;bombs=1;
    bullets=[];enemyBullets=[];particles=[];powerups=[];
    initPlayer(); spawnEnemies(); updateHUD(); abState='playing';
    document.getElementById('ab-startScreen').style.display='none';
    document.getElementById('ab-gameOverScreen').style.display='none';
    if(!audioStarted){ audioStarted=true; playSong(0); }
  }

  function nextLevel(){
    level++; bullets=[];enemyBullets=[];particles=[];
    bombs=Math.min(bombs+1,3); initPlayer(); spawnEnemies(); updateHUD();
    const ls=document.getElementById('ab-levelScreen');
    document.getElementById('ab-levelTitle').textContent='LEVEL '+level;
    document.getElementById('ab-levelSub').textContent=level<=3?'HERE THEY COME...':level<=5?'IT\'S GETTING WILD!':'THEY\'RE MAD NOW!';
    ls.style.display='flex'; abState='levelup';
    setTimeout(()=>{ ls.style.display='none'; abState='playing'; },2000);
  }

  function gameOver(){
    abState='gameover';
    document.getElementById('ab-finalScore').textContent=score.toLocaleString();
    document.getElementById('ab-gameOverScreen').style.display='flex';
  }

  // ── UPDATE LOGIC ──────────────────────────────────────────────────────────────
  function updateEnemies(){
    const alive=enemies.filter(e=>e.alive);
    if(alive.length===0){ nextLevel(); return; }
    enemies.forEach(e=>{ if(e.streaker&&e.alive){ e.x+=2*(1+level*.1); if(e.x>W+130){e.x=-130;e.y=25+Math.random()*40;} } });
    const nonu=alive.filter(e=>!e.streaker);
    if(!nonu.length) return;
    const minX=Math.min(...nonu.map(e=>e.x)), maxX=Math.max(...nonu.map(e=>e.x));
    if((maxX>W-50&&enemyDir>0)||(minX<50&&enemyDir<0)){ enemyDir*=-1; nonu.forEach(e=>e.y+=18); }
    nonu.forEach(e=>e.x+=enemySpeed*enemyDir);
    nonu.forEach(e=>{ if(e.y>H-120) gameOver(); });
    enemyShootTimer--;
    if(enemyShootTimer<=0){
      enemyShootTimer=Math.max(20,80-level*8);
      const shooters=nonu.filter(e=>e.bombs);
      if(shooters.length){ const s=shooters[Math.floor(Math.random()*shooters.length)]; enemyBullets.push({x:s.x,y:s.y+20,dy:4+level*.5,color:'#ff6666'}); }
      if(Math.random()<0.3&&nonu.length){ const s2=nonu[Math.floor(Math.random()*nonu.length)]; if(!s2.guitar) enemyBullets.push({x:s2.x,y:s2.y+20,dy:3+level*.3,color:'#88ff88'}); }
    }
  }

  function updateBullets(){
    bullets.forEach(b=>b.y+=b.dy);
    bullets=bullets.filter(b=>b.y>-20);
    if(laserBeam.active){
      laserBeam.timer--;
      if(laserBeam.timer<=0) laserBeam.active=false;
      enemies.forEach(e=>{ if(!e.alive) return; if(Math.abs(e.x-laserBeam.x)<35){e.alive=false;score+=e.pts*2;explode(e.x,e.y,'#aaffaa',25);if(Math.random()<.15)spawnPowerup(e.x,e.y);} });
    }
    bullets.forEach(b=>{
      enemies.forEach(e=>{
        if(!e.alive) return;
        if(Math.abs(b.x-e.x)<e.w/2&&Math.abs(b.y-e.y)<e.h/2){
          b.y=-999; e.hp--; e.hit=8;
          if(e.hp<=0){ e.alive=false; score+=e.pts; explode(e.x,e.y,'#aaffaa'); if(Math.random()<.12)spawnPowerup(e.x,e.y); updateHUD(); }
        }
      });
    });
    enemyBullets.forEach(b=>b.y+=b.dy);
    enemyBullets=enemyBullets.filter(b=>b.y<H+20);
    if(player.invincible<=0){
      enemyBullets.forEach(b=>{
        if(Math.abs(b.x-player.x)<18&&Math.abs(b.y-player.y)<22){
          b.y=H+999; lives--; player.invincible=120;
          explode(player.x,player.y,'#ff8800',10); updateHUD();
          if(lives<=0) gameOver();
        }
      });
    }
    if(player.invincible>0) player.invincible--;
  }

  function updatePowerups(){
    powerups.forEach(p=>{
      p.y+=p.dy; p.life--;
      if(Math.abs(p.x-player.x)<20&&Math.abs(p.y-player.y)<20){
        if(p.type==='bomb') bombs=Math.min(bombs+1,3); else lives=Math.min(lives+1,5);
        p.life=0; updateHUD();
        particles.push({x:p.x,y:p.y,type:'emoji',emoji:p.type==='bomb'?'💣':'❤️',life:30,maxLife:30,dy:-2,dx:0,size:30});
      }
    });
    powerups=powerups.filter(p=>p.life>0&&p.y<H);
  }

  function updatePlayer(){
    if(keys['ArrowLeft']||keys['KeyA']) player.x-=player.speed;
    if(keys['ArrowRight']||keys['KeyD']) player.x+=player.speed;
    player.x=Math.max(30,Math.min(W-30,player.x));
    player.shootCool--;
    if((keys['Space']||keys['KeyX'])&&player.shootCool<=0){ fireBullet(); player.shootCool=Math.max(8,18-level); }
  }

  function drawEnemyBullets(){
    enemyBullets.forEach(b=>{
      const eg=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,6);
      eg.addColorStop(0,b.color); eg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(b.x,b.y,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=b.color; ctx.beginPath(); ctx.arc(b.x,b.y,2.5,0,Math.PI*2); ctx.fill();
    });
  }

  function drawBombsHUD(){
    ctx.font='16px serif'; ctx.textAlign='left'; ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText('Z:',10,H-14);
    for(let i=0;i<3;i++){ ctx.globalAlpha=i<bombs?1:0.2; ctx.fillText('💣',36+i*22,H-14); }
    ctx.globalAlpha=1;
  }

  // ── MAIN LOOP ─────────────────────────────────────────────────────────────────
  function abLoop(){
    frame++;
    ctx.clearRect(0,0,W,H);
    if(!modal.classList.contains('open')){ requestAnimationFrame(abLoop); return; }
    drawBg();
    if(abState==='playing'||abState==='levelup'){
      enemies.forEach(drawEnemy);
      drawLaser(); drawBullets(); drawEnemyBullets();
      drawPowerups(); drawParticles(); drawPlayer(); drawBombsHUD();
      if(abState==='playing'){ updatePlayer(); updateEnemies(); updateBullets(); updatePowerups(); }
    }
    if(abState==='gameover'||abState==='start') drawParticles();
    requestAnimationFrame(abLoop);
  }

  document.getElementById('ab-startBtn').addEventListener('click', startGame);
  document.getElementById('ab-restartBtn').addEventListener('click', ()=>{
    document.getElementById('ab-gameOverScreen').style.display='none';
    startGame();
  });
})();


})();