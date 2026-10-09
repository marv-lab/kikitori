const RANGES=[{max:10,label:"0–10"},{max:100,label:"0–100"},{max:1000,label:"0–1.000"},{max:10000,label:"0–10.000"},{max:100000,label:"0–100.000"}];
const D=["","いち","に","さん","よん","ご","ろく","なな","はち","きゅう"];
const DR=["","ichi","ni","san","yon","go","roku","nana","hachi","kyuu"];
const K=["","一","二","三","四","五","六","七","八","九"];
const HYAKU=["","ひゃく","にひゃく","さんびゃく","よんひゃく","ごひゃく","ろっぴゃく","ななひゃく","はっぴゃく","きゅうひゃく"];
const HYAKUR=["","hyaku","nihyaku","sanbyaku","yonhyaku","gohyaku","roppyaku","nanahyaku","happyaku","kyuuhyaku"];
const SEN=["","せん","にせん","さんぜん","よんせん","ごせん","ろくせん","ななせん","はっせん","きゅうせん"];
const SENR=["","sen","nisen","sanzen","yonsen","gosen","rokusen","nanasen","hassen","kyuusen"];

// Returns parts: [{k:kanji, r:kana, ro:romaji}]
function parts(n){
  if(n===0) return [{k:"零",r:"ぜろ",ro:"zero"}];
  const p=[];
  const man=Math.floor(n/10000)%10, s=Math.floor(n/1000)%10, h=Math.floor(n/100)%10, t=Math.floor(n/10)%10, o=n%10;
  if(n>=100000) p.push({k:"十万",r:"じゅうまん",ro:"juuman"});
  else if(man) p.push({k:K[man]+"万",r:D[man]+"まん",ro:DR[man]+"man"});
  if(s) p.push({k:(s>1?K[s]:"")+"千",r:SEN[s],ro:SENR[s]});
  if(h) p.push({k:(h>1?K[h]:"")+"百",r:HYAKU[h],ro:HYAKUR[h]});
  if(t) p.push({k:(t>1?K[t]:"")+"十",r:(t>1?D[t]:"")+"じゅう",ro:(t>1?DR[t]:"")+"juu"});
  if(o) p.push({k:K[o],r:D[o],ro:DR[o]});
  return p;
}

let rangeIdx=1, target=0, solved=false, ok=0, bad=0, streak=0, voice=null;
try{ const v=+localStorage.getItem("kikitoriRange"); if(v>=0&&v<RANGES.length) rangeIdx=v; }catch(e){}

const $=id=>document.getElementById(id);
const ans=$("ans"), fb=$("fb");

function renderRanges(){
  $("ranges").innerHTML="";
  RANGES.forEach((r,i)=>{
    const b=document.createElement("button");
    b.className="chip"; b.textContent=r.label; b.setAttribute("aria-pressed",i===rangeIdx);
    b.onclick=()=>{rangeIdx=i; try{localStorage.setItem("kikitoriRange",i)}catch(e){} renderRanges(); next(true);};
    $("ranges").appendChild(b);
  });
}

function pickVoice(){
  const vs=speechSynthesis.getVoices();
  voice=vs.find(v=>/^ja(-|_|$)/i.test(v.lang)&&/google/i.test(v.name))||vs.find(v=>/^ja(-|_|$)/i.test(v.lang))||null;
  $("noVoice").hidden=!!voice || vs.length===0;
}
if("speechSynthesis" in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; setTimeout(()=>{pickVoice(); if(!voice) $("noVoice").hidden=false;},1500); }
else $("noVoice").hidden=false;

for(let i=0;i<40;i++){
  const b=document.createElement("i");
  b.style.setProperty("--h",(25+Math.abs(Math.sin(i*1.7)*Math.cos(i*.45))*75).toFixed(0)+"%");
  b.style.setProperty("--d",((i*.11)%.9).toFixed(2)+"s");
  $("pWave").appendChild(b);
}

let playId=0;
function setPlaying(on){ $("player").classList.toggle("on",on); $("pIco").textContent=on?"▶":"♪"; }

function speak(rate=0.9){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(parts(target).map(p=>p.r).join(""));
  u.lang="ja-JP"; if(voice) u.voice=voice; u.rate=rate;
  const id=++playId;
  setPlaying(false);
  u.onstart=()=>{ if(id===playId) setPlaying(true); };
  u.onend=u.onerror=()=>{ if(id===playId) setPlaying(false); };
  speechSynthesis.speak(u);
}

function showReveal(withKanji){
  const p=parts(target);
  $("kanji").innerHTML = withKanji
    ? p.map(x=>`<ruby>${x.k}<rt>${x.r}</rt></ruby>`).join("")
    : p.map(x=>x.r).join("");
  $("romaji").textContent=p.map(x=>x.ro).join(" ");
  $("reveal").hidden=false; updateHintBtn();
}

function hideReveal(){ $("reveal").hidden=true; updateHintBtn(); }
function updateHintBtn(){ $("hintBtn").textContent=$("reveal").hidden?"Mostrar leitura":"Ocultar leitura"; }

function next(speakNow){
  let n; do{ n=Math.floor(Math.random()*(RANGES[rangeIdx].max+1)); }while(n===target);
  target=n; solved=false;
  ans.value=""; ans.className=""; fb.textContent=""; fb.className="feedback";
  hideReveal(); ans.focus();
  if(speakNow) speak();
}

function updateStats(){ $("sOk").textContent=ok; $("sBad").textContent=bad; $("sStreak").textContent=streak; }

$("form").addEventListener("submit",e=>{
  e.preventDefault();
  if(solved){ next(true); return; }
  const v=ans.value.replace(/\D/g,"");
  if(v===""){ speak(); return; }
  if(+v===target){
    solved=true; ok++; streak++;
    ans.className="good"; fb.className="feedback good"; fb.textContent="正解！ Enter para o próximo.";
    showReveal(true);
  }else{
    bad++; streak=0;
    ans.className="bad"; fb.className="feedback bad"; fb.textContent=`Não é ${Number(v).toLocaleString("pt-BR")}. Ouça de novo.`;
    ans.classList.remove("shake"); void ans.offsetWidth; ans.classList.add("shake");
    ans.select(); setTimeout(()=>speak(),350);
  }
  updateStats();
});
$("playBtn").onclick=()=>{speak(); ans.focus();};
$("slowBtn").onclick=()=>{speak(0.55); ans.focus();};
$("hintBtn").onclick=()=>{ if($("reveal").hidden) showReveal(solved); else hideReveal(); ans.focus(); };

renderRanges(); next(false);
fb.textContent="Clique em ▶ Ouvir para começar.";
