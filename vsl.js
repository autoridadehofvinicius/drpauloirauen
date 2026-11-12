/* Páginas de VSL do Dr. Paulo. Cada página define window.VSL antes deste arquivo. */
(function(){
  var CFG = window.VSL || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  function $(id){ return document.getElementById(id); }

  /* ===== WhatsApp: todo botão passa pelo Tintim (link único). Para trocar, mexer só aqui. ===== */
  var link = "https://tintim.link/whatsapp/d0af48fd-9857-4bee-ac45-9de7305c6c98/d04a41b3-66c7-48fb-8e23-320336a2de39";
  function ligarWa(raiz){
    (raiz || document).querySelectorAll(".wa-link,.btn.wa").forEach(function(a){ a.href = link; a.target = "_blank"; a.rel = "noopener"; });
  }
  ligarWa();

  /* ===== Medição: eventos para Google (gtag/GA4), Meta Pixel e GTM (dataLayer), só com cookies aceitos ===== */
  var PAGINA = /retina/.test(location.pathname) ? "retina" : "catarata";
  function evento(nome, dados){
    dados = dados || {}; dados.pagina = PAGINA;
    try{ (window.dataLayer = window.dataLayer || []).push(Object.assign({event: nome}, dados)); }catch(e){}
    if (typeof gtag === "function") gtag("event", nome, dados);
    if (typeof fbq === "function") fbq("trackCustom", nome, dados);
  }
  window.vslEvento = evento;
  document.addEventListener("click", function(e){
    var a = e.target && e.target.closest && e.target.closest(".wa-link,.btn.wa,a[href^='tel:']");
    if (!a) return;
    var sec = a.closest("section,header,.mbar,.urg,.player");
    var onde = sec ? (sec.id || sec.getAttribute("aria-labelledby") || sec.className.split(" ")[0]) : "pagina";
    var tel = /^tel:/.test(a.getAttribute("href") || "");
    evento(tel ? "clique_telefone" : "clique_whatsapp", {posicao: onde});
    if (typeof fbq === "function") fbq("track", "Contact");
  }, true);

  /* ===== Vídeo: clique para assistir, com som. O arquivo só é baixado depois do clique. ===== */
  (function(){
    var p = $("vplayer"), v = $("vsl"), b = $("vbtn"), V = CFG.video;
    if (!p || !v || !V) return;
    var poster = p.querySelector("img");
    if (poster) poster.src = V.capa;
    v.poster = V.capa;
    function tocar(){
      if (!v.src) v.src = V.arquivo;
      p.classList.remove("fim"); p.classList.add("on");
      var r = v.play(); if (r && r.catch) r.catch(function(){});
      v.focus();
    }
    b.addEventListener("click", tocar);
    v.addEventListener("ended", function(){ p.classList.add("fim"); });
    /* retenção do vídeo: play, 25%, 50%, 75% e fim (uma vez cada) */
    var marcas = {}, tocou = false;
    v.addEventListener("play", function(){ if (!tocou){ tocou = true; evento("vsl_play"); } });
    v.addEventListener("timeupdate", function(){
      if (!v.duration) return;
      var pc = v.currentTime / v.duration * 100;
      [25, 50, 75, 95].forEach(function(m){ if (pc >= m && !marcas[m]){ marcas[m] = 1; evento("vsl_progresso", {percentual: m === 95 ? 100 : m}); } });
    });
    var de = $("vdenovo");
    if (de) de.addEventListener("click", function(){ v.currentTime = 0; tocar(); });
  })();

  /* ===== Barra fixa do celular: aparece depois da capa, some perto do fecho ===== */
  (function(){
    var bar = $("mbar"), fim = $("contato");
    if (!bar) return;
    function f(){
      var y = window.scrollY, h = window.innerHeight;
      var noFim = fim && fim.getBoundingClientRect().top < h * .7;
      bar.classList.toggle("on", y > 520 && !noFim);
    }
    window.addEventListener("scroll", f, {passive:true}); f();
  })();

  /* ===== Dúvidas: abre uma por vez ===== */
  document.querySelectorAll(".faq details").forEach(function(d){
    d.addEventListener("toggle", function(){
      if (d.open) document.querySelectorAll(".faq details[open]").forEach(function(o){ if (o !== d) o.open = false; });
    });
  });

  /* ===== Depoimentos reais do Google (texto dos pacientes, só ortografia corrigida) ===== */
  (function(){
    var el = $("deps"); if (!el || !CFG.deps) return;
    var st = '<span class="stars" role="img" aria-label="5 estrelas">' + new Array(6).join('<svg aria-hidden="true"><use href="#i-st"/></svg>') + '</span>';
    el.innerHTML = CFG.deps.map(function(r, i){
      return '<article class="dep' + (i === 0 ? ' dest' : '') + '">' + st + '<p>“' + r.t + '”</p><footer><img src="' + r.f +
             '" width="44" height="44" alt="" loading="lazy"><span><b>' + r.n + '</b>Avaliação publicada no Google</span></footer></article>';
    }).join("");
  })();

  /* ===== Simulador de catarata: dirigir à noite ===== */
  (function(){
    var r = $("simRange"), cena = $("cena"); if (!r || !cena) return;
    var tit = $("simTit"), txt = $("simTxt");
    var E = [
      {ate:8,   t:"Cristalino transparente", p:"A placa é fácil de ler e os faróis não incomodam. É assim que a luz passa por uma lente natural limpa."},
      {ate:38,  t:"Catarata no começo", p:"As luzes começam a se espalhar e a placa perde nitidez. Muita gente acha que é só o grau dos óculos."},
      {ate:72,  t:"Catarata que já atrapalha", p:"Os faróis ofuscam, as cores ficam amareladas e ler a placa exige esforço. Dirigir à noite fica cansativo e inseguro."},
      {ate:101, t:"Catarata avançada", p:"A cena fica coberta por uma névoa. Reconhecer rostos, ler e andar com segurança ficam difíceis."}
    ];
    function upd(){
      var v = +r.value;
      cena.style.setProperty("--c", (v/100).toFixed(3));
      for (var i = 0; i < E.length; i++){ if (v < E[i].ate){ tit.textContent = E[i].t; txt.textContent = E[i].p; break; } }
      r.setAttribute("aria-valuetext", tit.textContent);
    }
    r.addEventListener("input", upd); upd();
  })();

  /* ===== Simulador de sinais da retina, sobre a tela de Amsler ===== */
  (function(){
    var cv = $("amsCv"), box = $("amsBts"); if (!cv || !box) return;
    var ctx = cv.getContext("2d"), tit = $("amsTit"), txt = $("amsTxt"), selo = $("amsSelo"), wa = $("amsWa");
    var M = {
      normal:{t:"Como deve ser", p:"Linhas retas, quadrados iguais, nenhum ponto faltando. Esta grade se chama tela de Amsler e é usada para acompanhar o centro da visão.", s:"Visão central preservada", c:"ok"},
      moscas:{t:"Moscas volantes", p:"Pontos, fios ou teias que flutuam e acompanham o olhar. Quando são antigos e poucos, costumam ser benignos. Se aparecerem muitos de repente, é sinal de alerta.", s:"Surgiram de repente? Procure avaliação hoje", c:"u"},
      flashes:{t:"Flashes de luz", p:"Clarões ou relâmpagos rápidos, quase sempre no canto da visão e mais visíveis no escuro. Podem indicar que a retina está sendo tracionada.", s:"Procure avaliação hoje", c:"u"},
      tortas:{t:"Linhas tortas", p:"Linhas retas, como as de um azulejo ou de um texto, parecem onduladas. É um sinal típico de alteração na mácula, o centro da retina.", s:"Agende uma avaliação nos próximos dias", c:""},
      mancha:{t:"Mancha no centro", p:"Um ponto borrado ou escuro fixo bem onde você olha. Atrapalha ler e reconhecer rostos.", s:"Agende uma avaliação nos próximos dias", c:""},
      cortina:{t:"Sombra ou cortina", p:"Uma área escura que avança sobre parte da visão, como uma cortina fechando. É o sinal clássico de descolamento de retina.", s:"É urgência. Procure atendimento hoje", c:"u"}
    };
    var modo = "normal", alvo = {tortas:0, mancha:0, cortina:0, moscas:0, flashes:0}, cur = {tortas:0, mancha:0, cortina:0, moscas:0, flashes:0};
    var W = 0, raf = null, t0 = performance.now();
    var FL = [];
    for (var i = 0; i < 9; i++) FL.push({x:.2+Math.random()*.6, y:.2+Math.random()*.6, r:.02+Math.random()*.05, a:Math.random()*6.28, v:.15+Math.random()*.25, k:Math.random()});
    function size(){
      var d = Math.min(window.devicePixelRatio || 1, 2), w = cv.clientWidth;
      if (!w) return; W = w; cv.width = cv.height = Math.round(w*d); ctx.setTransform(d,0,0,d,0,0);
    }
    function desloc(x, y, k){            // ondulação das linhas perto do centro
      if (k < .003) return [x, y];
      var dx = x-.5, dy = y-.5, g = Math.exp(-(dx*dx+dy*dy)/.03) * k;
      return [x + g*(.016*Math.sin(dy*21+.6) + dx*.22), y + g*(.018*Math.sin(dx*19) + dy*.22)];
    }
    function draw(now){
      var T = (now - t0)/1000, n = 20, i, j, p, moving = false;
      for (var key in cur){ var d = alvo[key]-cur[key]; if (Math.abs(d) > .004){ cur[key] += d*(reduce?1:.12); moving = true; } else cur[key] = alvo[key]; }
      ctx.clearRect(0,0,W,W);
      ctx.fillStyle = "#02060B"; ctx.fillRect(0,0,W,W);
      ctx.strokeStyle = "rgba(238,242,247,.62)"; ctx.lineWidth = 1.1;
      for (i = 0; i <= n; i++){
        ctx.beginPath();
        for (j = 0; j <= 80; j++){ p = desloc(i/n, j/80, cur.tortas); if (j) ctx.lineTo(p[0]*W, p[1]*W); else ctx.moveTo(p[0]*W, p[1]*W); }
        ctx.stroke(); ctx.beginPath();
        for (j = 0; j <= 80; j++){ p = desloc(j/80, i/n, cur.tortas); if (j) ctx.lineTo(p[0]*W, p[1]*W); else ctx.moveTo(p[0]*W, p[1]*W); }
        ctx.stroke();
      }
      ctx.fillStyle = "#E4CB93"; ctx.beginPath(); ctx.arc(W/2, W/2, Math.max(4, W*.011), 0, 6.283); ctx.fill();
      var g;
      if (cur.mancha > .01){
        g = ctx.createRadialGradient(W/2,W/2,0,W/2,W/2,W*.2);
        g.addColorStop(0,"rgba(2,6,11," + (.97*cur.mancha) + ")"); g.addColorStop(.6,"rgba(2,6,11," + (.9*cur.mancha) + ")"); g.addColorStop(1,"rgba(2,6,11,0)");
        ctx.fillStyle = g; ctx.fillRect(0,0,W,W);
      }
      if (cur.cortina > .01){
        var av = cur.cortina*.56*W;
        g = ctx.createLinearGradient(W, 0, W-av-W*.16, W*.25);
        g.addColorStop(0,"rgba(0,0,0,.98)"); g.addColorStop(.72,"rgba(0,0,0,.95)"); g.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W,0); ctx.lineTo(W-av*1.3-W*.16,0);
        ctx.quadraticCurveTo(W-av-W*.3, W*.5, W-av*.5-W*.1, W); ctx.lineTo(W,W); ctx.closePath(); ctx.fill();
      }
      if (cur.moscas > .01){
        ctx.lineCap = "round";
        FL.forEach(function(f){
          var x = (f.x + Math.sin(T*f.v + f.a)*.05)*W, y = (f.y + Math.cos(T*f.v*.8 + f.a)*.04 + Math.sin(T*.2)*.01)*W, r = f.r*W;
          ctx.strokeStyle = "rgba(150,160,172," + (.5*cur.moscas) + ")"; ctx.lineWidth = Math.max(1.5, W*.006);
          ctx.beginPath(); ctx.moveTo(x-r, y);
          ctx.bezierCurveTo(x-r*.4, y-r*(1+f.k), x+r*.3, y+r*(1.2-f.k), x+r, y-r*.3); ctx.stroke();
          ctx.fillStyle = "rgba(150,160,172," + (.45*cur.moscas) + ")";
          ctx.beginPath(); ctx.arc(x+r*.6, y+r*.7, Math.max(2, r*.22), 0, 6.283); ctx.fill();
        });
        moving = moving || !reduce;
      }
      if (cur.flashes > .01){
        var pulso = reduce ? .8 : Math.pow(Math.max(0, Math.sin(T*2.6)), 6) + .5*Math.pow(Math.max(0, Math.sin(T*4.1+1)), 10);
        ctx.strokeStyle = "rgba(255,246,214," + Math.min(1, pulso*cur.flashes) + ")"; ctx.lineWidth = W*.012; ctx.lineCap = "round";
        ctx.shadowColor = "rgba(255,240,190,.9)"; ctx.shadowBlur = W*.05;
        ctx.beginPath(); ctx.arc(W*.5, W*.5, W*.46, 2.5, 3.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(W*.5, W*.5, W*.43, 2.75, 3.25); ctx.stroke();
        ctx.shadowBlur = 0;
        moving = moving || !reduce;
      }
      raf = moving ? requestAnimationFrame(draw) : null;
    }
    function kick(){ if (!raf) raf = requestAnimationFrame(draw); }
    function set(m){
      modo = m; for (var k in alvo) alvo[k] = (k === m) ? 1 : 0;
      var d = M[m]; tit.textContent = d.t; txt.textContent = d.p; selo.textContent = d.s; selo.className = "selo " + d.c;
      wa.hidden = d.c !== "u";
      box.querySelectorAll("button").forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.m === m)); });
      kick();
    }
    box.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b) set(b.dataset.m); });
    window.addEventListener("resize", function(){ size(); kick(); });
    size(); set(CFG.amsInicial || "tortas");
  })();

  /* ===== Autoavaliação: índice de 0 a 100 ===== */
  (function(){
    var lista = $("ckList"), G = CFG.indice; if (!lista || !G) return;
    var inputs = Array.prototype.slice.call(lista.querySelectorAll("input[type=checkbox]"));
    var fill = $("gFill"), marker = $("gMarker"), levelEl = $("ckLevel"), numEl = $("ckScore"), msgEl = $("ckMsg"),
        cntEl = $("ckCount"), ctaEl = $("ckCta"), btnTxt = $("ckBtnTxt"), card = $("ckResult"), ticksG = $("gTicks");
    function pol(cx, cy, r, deg){ var t = deg*Math.PI/180; return [cx + r*Math.cos(t), cy - r*Math.sin(t)]; }
    [0,20,40,60,80,100].forEach(function(t){
      var ang = 180 - t*1.8, a = pol(120,120,99,ang), b = pol(120,120,105,ang);
      var l = document.createElementNS("http://www.w3.org/2000/svg","line");
      l.setAttribute("x1",a[0].toFixed(1)); l.setAttribute("y1",a[1].toFixed(1)); l.setAttribute("x2",b[0].toFixed(1)); l.setAttribute("y2",b[1].toFixed(1));
      l.setAttribute("stroke","rgba(220,192,138,.35)"); l.setAttribute("stroke-width","1.4"); l.setAttribute("stroke-linecap","round");
      ticksG.appendChild(l);
    });
    var LEN = 289.03;                       /* comprimento do arco: pi x 92 */
    try { var L2 = fill.getTotalLength(); if (L2 > 0) LEN = L2; } catch(e){}
    fill.style.strokeDasharray = LEN; fill.style.strokeDashoffset = LEN;
    function calcular(){
      var n = 0, base = 0, crit = false;
      inputs.forEach(function(i, idx){ if (i.checked){ n++; base += G.pesos[idx]; if (idx === G.critico) crit = true; } });
      if (G.dupla && inputs[G.dupla[0]].checked && inputs[G.dupla[1]].checked) base += G.dupla[2];
      var score = Math.min(base, 100);
      if (crit) score = Math.max(score, 92);
      return {n:n, score:score};
    }
    function nivelDe(s){ for (var i = 0; i < G.niveis.length; i++){ if (s >= G.niveis[i].min) return G.niveis[i]; } return G.niveis[G.niveis.length-1]; }
    var mostrado = 0, rafId = null;
    function tween(to){
      if (reduce){ numEl.textContent = to; mostrado = to; return; }
      var from = mostrado, ini = null;
      if (rafId) cancelAnimationFrame(rafId);
      function step(ts){
        if (ini === null) ini = ts;
        var p = Math.min((ts - ini)/650, 1), v = Math.round(from + (to - from)*(1 - Math.pow(1-p, 3)));
        numEl.textContent = v; mostrado = v;
        if (p < 1) rafId = requestAnimationFrame(step);
      }
      rafId = requestAnimationFrame(step);
    }
    function atualizar(){
      var r = calcular(), lv = nivelDe(r.score);
      fill.style.strokeDashoffset = LEN*(1 - r.score/100);
      marker.style.transform = "rotate(" + (r.score*1.8 - 90).toFixed(1) + "deg)";
      tween(r.score);
      numEl.style.color = lv.cor; levelEl.textContent = lv.nome; levelEl.style.color = lv.cor;
      msgEl.innerHTML = lv.msg;
      cntEl.innerHTML = r.n ? "<b>" + r.n + "</b> de " + inputs.length + " sinais marcados" : "";
      ctaEl.hidden = !lv.cta;
      if (lv.cta) btnTxt.textContent = lv.cta;
      card.classList.toggle("lvl-urgente", lv.nome === "Urgente");
    }
    inputs.forEach(function(i){ i.addEventListener("change", atualizar); });
    atualizar();
  })();

  /* ===== Cookies (LGPD) e conversão do Google Ads: mesmo padrão do site ===== */
  (function(){
    var cx = $("dprCookies");
    function guardar(v){ try{ localStorage.setItem("dpr_cookies", v); }catch(e){} }
    function ler(){ try{ return localStorage.getItem("dpr_cookies"); }catch(e){ return null; } }
    if (!ler() && cx && !/[?&]shot/.test(location.search)) cx.classList.add("on");
    var ok = $("dprOk"), no = $("dprNo");
    if (ok) ok.addEventListener("click", function(){
      guardar("aceito");
      if (typeof gtag === "function") gtag("consent","update",{"ad_storage":"granted","ad_user_data":"granted","ad_personalization":"granted","analytics_storage":"granted"});
      if (window.vslCarregarTags) window.vslCarregarTags();
      cx.classList.remove("on");
    });
    if (no) no.addEventListener("click", function(){ guardar("essenciais"); cx.classList.remove("on"); });
    function conv(destino){ if (typeof gtag === "function") gtag("event","conversion",{"send_to": destino}); }
    document.addEventListener("click", function(e){
      var t = e.target; if (!t || !t.closest) return;
      if (t.closest('.wa-link, .btn.wa, a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="tintim.link"]')) conv("AW-17891030224/-TVfCMLU-uQcENDpjdNC");
      else if (t.closest('a[href^="tel:"]')) conv("AW-17891030224/SV-YCMXU-uQcENDpjdNC");
    }, true);
  })();
})();
