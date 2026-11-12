export async function requestJson(url,init={}, {timeoutMs=60000,fetcher=fetch}={}){
 const controller=new AbortController();let timedOut=false;
 const cancel=()=>controller.abort();
 if(init.signal?.aborted)cancel();else init.signal?.addEventListener('abort',cancel,{once:true});
 const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
 try{const response=await fetcher(url,{...init,signal:controller.signal});const data=await response.json();return {response,data};}
 catch(error){if(timedOut)throw new DOMException('Request timed out','TimeoutError');throw error;}
 finally{clearTimeout(timer);init.signal?.removeEventListener('abort',cancel);}
}
