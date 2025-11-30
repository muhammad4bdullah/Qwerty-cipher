const input = document.getElementById('input');
const output = document.getElementById('output');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const copyBtn = document.getElementById('copyBtn');
const copyMsg = document.getElementById('copyMsg');

// Noise symbols
const noiseSymbols = ["§","¶","™","µ","Ω","∆","√","≈","‽","‡","‾","⁂","※","⁎","⟨","⟩","⦅","⦆","⟪","⫫","⊕","⊗","✧","✦","✩"];

// Unified encode/decode map
const encodeMap = {
  '1':'Q','2':'W','3':'E','4':'R','5':'T','6':'Y','7':'U','8':'I','9':'O','0':'P',
  'A':'@','S':'#','D':'$','F':'_','G':'&','H':'-','J':'+','K':'(','L':')',
  'Z':'*','X':'"','C':'\'','V':':','B':';','N':'!','M':'?',

  '!':'N','@':'A','#':'S','$':'D','_':'F','&':'G','-':'H','+':'J','(':'K',')':'L',
  '*':'Z','"':'X','\'':'C',':':'V',';':'B','?':'M'
};

const decodeMap = {};
for(const k in encodeMap) decodeMap[encodeMap[k]] = k;

// Random noise
function randomNoise(){ return noiseSymbols[Math.floor(Math.random()*noiseSymbols.length)]; }

// Block reverse
function blockReverse(str, blockSize){
  let res='';
  for(let i=0;i<str.length;i+=blockSize){
    const chunk = str.slice(i,i+blockSize).split('').reverse().join('');
    res+=chunk;
  }
  return res;
}

// Encode function
function encode(text){
  text = text.replace(/ /g,'\\');
  let mapped = text.split('').map(ch=>{
    if(ch==='\\') return '\\';
    if(encodeMap[ch]) return encodeMap[ch];
    if(encodeMap[ch.toUpperCase()]) return encodeMap[ch.toUpperCase()];
    return ch;
  }).join('');

  let noisy='';
  for(const c of mapped){
    noisy += c;
    if(c!=='\\' && Math.random()<1) noisy += randomNoise();
  }
  return blockReverse(noisy,7);
}

// Decode function
function decode(text){
  let reversed = blockReverse(text,7);
  let cleaned = reversed.split('').filter(c=>!noiseSymbols.includes(c)).join('');
  let decoded = cleaned.split('').map(c=>decodeMap[c]||c).join('');
  return decoded.replace(/\\/g,' ');
}

// Button events
encodeBtn.addEventListener('click',()=>{ output.textContent = encode(input.value); });
decodeBtn.addEventListener('click',()=>{ output.textContent = decode(input.value); });
clearBtn.addEventListener('click',()=>{ input.value=''; output.textContent=''; });
copyBtn.addEventListener('click',async()=>{
  const text=output.textContent;
  if(!text) return;
  await navigator.clipboard.writeText(text);
  copyMsg.classList.add('show');
  setTimeout(()=>copyMsg.classList.remove('show'),1000);
});

// Paste input button
pasteBtn.addEventListener('click', async ()=>{
  try{
    const text = await navigator.clipboard.readText();
    input.value = text;
  }catch(e){
    alert('Failed to read clipboard: ' + e);
  }
});
