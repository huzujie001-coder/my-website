import test from 'node:test';
import assert from 'node:assert/strict';
import {writeClipboard} from '../src/clipboard.mjs';
test('a clipboard permission request that never resolves can fall back to manual copy',async()=>{
 await assert.rejects(writeClipboard('synthetic summary',{writer:()=>new Promise(()=>{}),timeoutMs:5}),e=>e.name==='TimeoutError');
});
test('successful copy returns and clipboard denial reaches manual-copy fallback',async()=>{
 let value;await writeClipboard('synthetic summary',{writer:async s=>{value=s;}});assert.equal(value,'synthetic summary');
 await assert.rejects(writeClipboard('synthetic summary',{writer:async()=>{throw new DOMException('Denied','NotAllowedError');}}),e=>e.name==='NotAllowedError');
});
