import test from 'node:test';
import assert from 'node:assert/strict';
import {requestJson} from '../src/request-json.mjs';
const pending=(_,init)=>new Promise((resolve,reject)=>{const abort=()=>reject(new DOMException('Aborted','AbortError'));if(init.signal.aborted)abort();else init.signal.addEventListener('abort',abort,{once:true});});
test('stalled consultation times out so the interface can enable retry',async()=>{
 await assert.rejects(requestJson('/api/chat',{}, {timeoutMs:5,fetcher:pending}),e=>e.name==='TimeoutError');
});
test('closing a pending view cancels without reporting a timeout',async()=>{
 const controller=new AbortController();controller.abort();await assert.rejects(requestJson('/api/laws',{signal:controller.signal},{timeoutMs:100,fetcher:pending}),e=>e.name==='AbortError');
});
test('HTTP error data remains available to the view',async()=>{
 const {response,data}=await requestJson('/api/chat',{}, {fetcher:async()=>Response.json({error:'AI服务繁忙'},{status:429})});assert.equal(response.status,429);assert.equal(data.error,'AI服务繁忙');
});
