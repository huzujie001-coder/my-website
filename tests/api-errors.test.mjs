import test from 'node:test';
import assert from 'node:assert/strict';
import {consultationError} from '../src/api-errors.mjs';
test('iOS and Chromium network failures give the same actionable Chinese message',()=>{
 const a=consultationError(new TypeError('Load failed'));
 assert.equal(a,consultationError(new TypeError('Failed to fetch')));assert(a.includes('系统浏览器'));assert(!a.includes('Load failed'));
});
test('provider errors are preserved while malformed responses and timeouts are explained',()=>{
 assert.equal(consultationError(new Error('AI账户余额不足，请联系网站管理员。')),'AI账户余额不足，请联系网站管理员。');
 assert(consultationError(new SyntaxError('Unexpected token <')).includes('有效回复'));
 assert(consultationError({name:'TimeoutError'}).includes('超时'));
});
