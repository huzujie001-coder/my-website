export function consultationError(error){
 if(error?.name==='TimeoutError')return 'AI回复等待超时，请稍后重试。';
 if(error instanceof TypeError||/^(Load failed|Failed to fetch|NetworkError|Network request failed)$/i.test(error?.message||''))return '未能连接AI咨询服务或接收回复。请切换网络，或在手机系统浏览器中打开后重试。您的问题仍保留在本页。';
 if(error instanceof SyntaxError)return '咨询服务未返回有效回复，请稍后重试。';
 return error?.message||'暂时无法完成咨询，请稍后重试。';
}
