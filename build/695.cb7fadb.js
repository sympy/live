"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[695,620],{40695:(e,n,s)=>{s.r(n),s.d(n,{LiteSessionClient:()=>o});var i=s(3934),t=s(48247),r=s(14931),d=s(21961);class o{constructor(e){var n;this._sessions=[],this._pendingRestarts=new Set,this._kernelClient=e.kernelClient,this._serverSettings=null!==(n=e.serverSettings)&&void 0!==n?n:i.ServerConnection.makeSettings(),this._kernelClient.changed.connect(((e,n)=>{var s,i;switch(n.type){case"remove":{const e=null===(s=n.oldValue)||void 0===s?void 0:s.id;if(!e)return;const i=this._sessions.find((n=>{var s;return(null===(s=n.kernel)||void 0===s?void 0:s.id)===e}));if(!i)return;this._pendingRestarts.add(e),setTimeout((async()=>{this._pendingRestarts.has(e)&&(this._pendingRestarts.delete(e),await this.shutdown(i.id))}),100);break}case"add":{const e=null===(i=n.newValue)||void 0===i?void 0:i.id;if(!e)return;this._pendingRestarts.delete(e);break}}}))}get serverSettings(){return this._serverSettings}async getModel(e){const n=this._sessions.find((n=>n.id===e));if(!n)throw Error(`Session ${e} not found`);return n}async listRunning(){return this._sessions}async update(e){const{id:n,path:s,name:i,kernel:r}=e,o=this._sessions.findIndex((e=>e.id===n)),a=this._sessions[o];if(!a)throw Error(`Session ${n} not found`);const l={...a,path:null!=s?s:a.path,name:null!=i?i:a.name};if(r)if(r.id){const e=this._sessions.find((e=>{var n;return(null===(n=e.kernel)||void 0===n?void 0:n.id)===(null==r?void 0:r.id)}));e&&(l.kernel=e.kernel)}else if(r.name){const e=await this._kernelClient.startNew({id:d.UUID.uuid4(),name:r.name,location:t.PathExt.dirname(l.path)});e&&(l.kernel=e),this._handleKernelShutdown({kernelId:e.id,sessionId:a.id})}return this._sessions[o]=l,l}async startNew(e){var n,s,i;const{path:r,name:o}=e,a=this._sessions.find((e=>e.name===o));if(a)return a;const l=null!==(s=null===(n=e.kernel)||void 0===n?void 0:n.name)&&void 0!==s?s:"",h=d.UUID.uuid4(),u=null!==(i=e.name)&&void 0!==i?i:e.path,c=t.PathExt.dirname(e.name)||t.PathExt.dirname(e.path),_=u.includes(":")?u.split(":")[0]:"",v=c.includes(_)?c:`${_}:${c}`,k=await this._kernelClient.startNew({id:h,name:l,location:v}),m={id:h,path:r,name:null!=o?o:r,type:"notebook",kernel:{id:k.id,name:k.name}};return this._sessions.push(m),this._handleKernelShutdown({kernelId:h,sessionId:m.id}),m}async shutdown(e){var n;const s=this._sessions.find((n=>n.id===e));if(!s)throw Error(`Session ${e} not found`);const i=null===(n=s.kernel)||void 0===n?void 0:n.id;i&&await this._kernelClient.shutdown(i),r.ArrayExt.removeFirstOf(this._sessions,s)}async shutdownAll(){await Promise.all(this._sessions.map((e=>this.shutdown(e.id))))}async _handleKernelShutdown({kernelId:e,sessionId:n}){}}}}]);
//# sourceMappingURL=695.cb7fadb.js.map