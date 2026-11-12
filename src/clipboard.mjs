export async function writeClipboard(text,{writer,timeoutMs=1500}={}){
 let timer;
 try{await Promise.race([
  Promise.resolve().then(()=>writer?writer(text):navigator.clipboard.writeText(text)),
  new Promise((_,reject)=>{timer=setTimeout(()=>reject(new DOMException('Clipboard permission timed out','TimeoutError')),timeoutMs);}),
 ]);}finally{clearTimeout(timer);}
}
