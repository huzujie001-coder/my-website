import {requestJson} from './request-json.mjs';
import {apiUrl} from './api-url.mjs';
import React,{useEffect,useState,useId} from 'react';
import {ArrowSquareOut,BookOpen,ShieldCheck,MagnifyingGlass} from '@phosphor-icons/react';

export function Citations({rows=[],prefix='',label='本次引用的法律依据'}){return rows.length>0&&<div className="citations"><h3><BookOpen size={17}/>{label}</h3>{rows.map((a,i)=><details id={prefix?`${prefix}-${i+1}`:undefined} key={a.id}><summary><span className="citation-index">[{i+1}]</span><span>{a.lawTitle}<strong>{a.label}（第{a.number}条）</strong></span></summary><p className="law-text">{a.text}</p><p className="citation-meta">{a.version} · 施行日期 {a.effective}<br/>采集日期 {a.retrievedAt.slice(0,10)}</p><a href={a.sourceUrl} target="_blank" rel="noopener noreferrer">查看官方公布文本 <ArrowSquareOut size={14}/></a></details>)}</div>;}

export function LegalMessage({message}){const prefix=useId();return <><div className="answer-text">{message.text.split(/(\[\d+\])/).map((part,i)=>/^\[\d+\]$/.test(part)&&message.citations?.[Number(part.slice(1,-1))-1]?<button key={i} className="inline-citation" aria-label={`查看法条${part}`} onClick={()=>{const el=document.getElementById(`${prefix}-${part.slice(1,-1)}`);if(el){el.open=true;el.scrollIntoView({behavior:'smooth',block:'center'});}}}>{part}</button>:part)}</div>{message.questions?.length>0&&<div className="answer-extra"><h3>还需要了解</h3><ul>{message.questions.map((q,i)=><li key={i}>{q}</li>)}</ul></div>}{message.materials?.length>0&&<div className="answer-extra"><h3>建议准备</h3><ul>{message.materials.map((q,i)=><li key={i}>{q}</li>)}</ul></div>}<Citations rows={message.citations} prefix={prefix} label={message.citationLabel}/>{message.scopeNote&&<p className="scope-note">{message.scopeNote}</p>}</>;}

export function LawLibrary(){
 const [data,S]=useState(null),[query,Q]=useState(''),[law,L]=useState(''),[error,E]=useState(''),[loading,B]=useState(true),[retry,Retry]=useState(0),[resolved,Resolved]=useState(null);
 const key=JSON.stringify([query,law]);
 useEffect(()=>{
  const controller=new AbortController();B(true);E('');
  const timer=setTimeout(async()=>{try{
   const {response:r,data:j}=await requestJson(apiUrl('/api/laws?')+new URLSearchParams({q:query,law}),{signal:controller.signal},{timeoutMs:15000});
   if(!r.ok||!Array.isArray(j.results)||!Array.isArray(j.laws))throw Error('Invalid library response');
   S(j);Resolved(key);
  }catch(e){if(e.name!=='AbortError')E(e.name==='TimeoutError'?'检索等待超时，请重试。':'法律库暂时无法加载，请检查网络后重试。');}
  finally{if(!controller.signal.aborted)B(false);}},200);
  return()=>{clearTimeout(timer);controller.abort();};
 },[query,law,retry]);
 const ready=data&&resolved===key&&!loading&&!error;
 return <><span className="library-eyebrow"><ShieldCheck size={16}/>官方公布文本 · 按条检索</span><h2 id="modal-title">法律知识库</h2><p className="scope-note">{data?.scopeNote||'当前提供部分法律法规及司法解释条文，适用时点需核对。'}</p>{data&&<p className="library-count">{data.laws.length} 份文本 · {data.articleCount.toLocaleString()} 条</p>}<label>选择法律<select value={law} onChange={e=>L(e.target.value)}><option value="">全部已收录法律</option>{data?.laws.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}</select></label><label className="library-search"><span><MagnifyingGlass size={16}/>关键词或条号</span><input value={query} onChange={e=>Q(e.target.value)} placeholder="例如：借款、抚养，选定法律后可输入675" maxLength={200}/></label>{error&&<div role="alert"><p className="error">{error}</p><button className="outline" onClick={()=>Retry(n=>n+1)}>重试加载法律库</button></div>}{!error&&!ready&&<p role="status">正在检索…</p>}{ready&&<div className="library-results"><p className="citation-meta">{query?'相关条文':'条文浏览'} · 展示前{data.results.length}条结果</p>{data.results.length?<Citations rows={data.results}/>:<p>未找到匹配条文，请调整关键词或法律范围。</p>}</div>}<p className="scope-note">这是官方公布版本的条文库，不是对当前案件适用性的保证。新法修订及司法解释需持续补充，正式法律意见由律师核实。</p></>;
}

export function LegalConsent({onAccept,onCancel}){return <><ShieldCheck size={35} className="modal-symbol"/><h2 id="modal-title">开始前，请了解AI咨询方式</h2><p>您的问题和本次对话将发送至 <strong>DeepSeek</strong> 生成初步法律信息。系统会先检索已收录条文，再核验引用；仍可能出现理解或适用偏差。</p><p>请使用匿名描述，不要输入身份证号、银行卡号、真实姓名、联系方式或未公开案件材料。常见号码会尝试隐藏，但无法保证识别所有敏感信息。</p><p className="demo">对话不在本站数据库中保存，刷新后清空。DeepSeek对数据的处理以其服务条款和隐私政策为准。</p><a className="policy-link" href="https://cdn.deepseek.com/policies/zh-CN/deepseek-privacy-policy.html" target="_blank" rel="noopener noreferrer">查看DeepSeek隐私政策 <ArrowSquareOut size={14}/></a><button className="primary full" onClick={onAccept}>同意并开始AI咨询</button><button className="outline full" onClick={onCancel}>暂不使用，联系律师</button></>;}
