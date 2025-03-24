"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[6807],{56807:(e,s,t)=>{t.r(s),t.d(s,{BaseKernel:()=>i,FALLBACK_KERNEL:()=>h,IKernelClient:()=>d,IKernelSpecs:()=>u,KernelSpecs:()=>_,LiteKernelClient:()=>b,LiteKernelManager:()=>o,LiteKernelSpecs:()=>p});var n=t(3934),r=t(2159);class i{constructor(e){this._history=[],this._executionCount=0,this._isDisposed=!1,this._disposed=new r.Signal(this),this._parentHeader=void 0,this._parent=void 0;const{id:s,name:t,location:n,sendMessage:i}=e;this._id=s,this._name=t,this._location=n,this._sendMessage=i}get ready(){return Promise.resolve()}get isDisposed(){return this._isDisposed}get disposed(){return this._disposed}get id(){return this._id}get name(){return this._name}get location(){return this._location}get executionCount(){return this._executionCount}get parentHeader(){return this._parentHeader}get parent(){return this._parent}dispose(){this.isDisposed||(this._isDisposed=!0,this._disposed.emit(void 0))}async handleMessage(e){switch(this._busy(e),this._parent=e,e.header.msg_type){case"kernel_info_request":await this._kernelInfo(e);break;case"execute_request":await this._execute(e);break;case"input_reply":this.inputReply(e.content);break;case"inspect_request":await this._inspect(e);break;case"is_complete_request":await this._isCompleteRequest(e);break;case"complete_request":await this._complete(e);break;case"history_request":await this._historyRequest(e);break;case"comm_open":await this.commOpen(e);break;case"comm_msg":await this.commMsg(e);break;case"comm_close":await this.commClose(e)}this._idle(e)}stream(e,s=void 0){var t;const r=void 0!==s?s:this._parentHeader,i=n.KernelMessage.createMessage({channel:"iopub",msgType:"stream",session:null!==(t=null==r?void 0:r.session)&&void 0!==t?t:"",parentHeader:r,content:e});this._sendMessage(i)}displayData(e,s=void 0){var t,r;const i=void 0!==s?s:this._parentHeader;e.metadata=null!==(t=e.metadata)&&void 0!==t?t:{};const a=n.KernelMessage.createMessage({channel:"iopub",msgType:"display_data",session:null!==(r=null==i?void 0:i.session)&&void 0!==r?r:"",parentHeader:i,content:e});this._sendMessage(a)}inputRequest(e,s=void 0){var t;const r=void 0!==s?s:this._parentHeader,i=n.KernelMessage.createMessage({channel:"stdin",msgType:"input_request",session:null!==(t=null==r?void 0:r.session)&&void 0!==t?t:"",parentHeader:r,content:e});this._sendMessage(i)}publishExecuteResult(e,s=void 0){var t;const r=void 0!==s?s:this._parentHeader,i=n.KernelMessage.createMessage({channel:"iopub",msgType:"execute_result",session:null!==(t=null==r?void 0:r.session)&&void 0!==t?t:"",parentHeader:r,content:e});this._sendMessage(i)}publishExecuteError(e,s=void 0){var t;const r=void 0!==s?s:this._parentHeader,i=n.KernelMessage.createMessage({channel:"iopub",msgType:"error",session:null!==(t=null==r?void 0:r.session)&&void 0!==t?t:"",parentHeader:r,content:e});this._sendMessage(i)}updateDisplayData(e,s=void 0){var t;const r=void 0!==s?s:this._parentHeader,i=n.KernelMessage.createMessage({channel:"iopub",msgType:"update_display_data",session:null!==(t=null==r?void 0:r.session)&&void 0!==t?t:"",parentHeader:r,content:e});this._sendMessage(i)}clearOutput(e,s=void 0){var t;const r=void 0!==s?s:this._parentHeader,i=n.KernelMessage.createMessage({channel:"iopub",msgType:"clear_output",session:null!==(t=null==r?void 0:r.session)&&void 0!==t?t:"",parentHeader:r,content:e});this._sendMessage(i)}handleComm(e,s,t,r,i=void 0){var a;const o=void 0!==i?i:this._parentHeader,c=n.KernelMessage.createMessage({channel:"iopub",msgType:e,session:null!==(a=null==o?void 0:o.session)&&void 0!==a?a:"",parentHeader:o,content:s,metadata:t,buffers:r});this._sendMessage(c)}_idle(e){const s=n.KernelMessage.createMessage({msgType:"status",session:e.header.session,parentHeader:e.header,channel:"iopub",content:{execution_state:"idle"}});this._sendMessage(s)}_busy(e){const s=n.KernelMessage.createMessage({msgType:"status",session:e.header.session,parentHeader:e.header,channel:"iopub",content:{execution_state:"busy"}});this._sendMessage(s)}async _kernelInfo(e){const s=await this.kernelInfoRequest(),t=n.KernelMessage.createMessage({msgType:"kernel_info_reply",channel:"shell",session:e.header.session,parentHeader:e.header,content:s});this._sendMessage(t)}async _historyRequest(e){const s=e,t=n.KernelMessage.createMessage({msgType:"history_reply",channel:"shell",parentHeader:s.header,session:e.header.session,content:{status:"ok",history:this._history}});this._sendMessage(t)}_executeInput(e){const s=e,t=s.content.code,r=n.KernelMessage.createMessage({msgType:"execute_input",parentHeader:s.header,channel:"iopub",session:e.header.session,content:{code:t,execution_count:this._executionCount}});this._sendMessage(r)}async _execute(e){const s=e,t=s.content;t.store_history&&this._executionCount++,this._parentHeader=s.header,this._executeInput(s),t.store_history&&this._history.push([0,0,t.code]);const r=await this.executeRequest(s.content),i=n.KernelMessage.createMessage({msgType:"execute_reply",channel:"shell",parentHeader:s.header,session:e.header.session,content:r});this._sendMessage(i)}async _complete(e){const s=e,t=await this.completeRequest(s.content),r=n.KernelMessage.createMessage({msgType:"complete_reply",parentHeader:s.header,channel:"shell",session:e.header.session,content:t});this._sendMessage(r)}async _inspect(e){const s=e,t=await this.inspectRequest(s.content),r=n.KernelMessage.createMessage({msgType:"inspect_reply",parentHeader:s.header,channel:"shell",session:e.header.session,content:t});this._sendMessage(r)}async _isCompleteRequest(e){const s=e,t=await this.isCompleteRequest(s.content),r=n.KernelMessage.createMessage({msgType:"is_complete_reply",parentHeader:s.header,channel:"shell",session:e.header.session,content:t});this._sendMessage(r)}}class a extends n.KernelConnection{constructor(e){super(e),this._kernelSpecs=e.kernelSpecs}get spec(){var e;const s=null===(e=this._kernelSpecs.specs)||void 0===e?void 0:e.kernelspecs[this.model.name];return Promise.resolve(s)}clone(e={}){return new a({model:this.model,username:this.username,serverSettings:this.serverSettings,handleComms:!1,kernelSpecs:this._kernelSpecs,kernelAPIClient:this._kernelAPIClient,...e})}}class o extends n.KernelManager{constructor(e){super({...e,kernelAPIClient:e.kernelClient});const{kernelSpecs:s,kernelClient:t}=e;this._kernelSpecs=s,this._kernelClient=t}connectTo(e){var s;const{id:t}=e.model;let n=null===(s=e.handleComms)||void 0===s||s;if(void 0===e.handleComms)for(const e of this._kernelConnections)if(e.id===t&&e.handleComms){n=!1;break}const r=new a({handleComms:n,...e,serverSettings:this.serverSettings,kernelSpecs:this._kernelSpecs,kernelAPIClient:this._kernelClient});return this._onStarted(r),this.refreshRunning().catch((()=>{})),r}}var c=t(48247),l=t(21961);const h="javascript",d=new l.Token("@jupyterlite/kernel:IKernelClient"),u=new l.Token("@jupyterlite/kernel:IKernelSpecs");class _{constructor(){this._specs=new Map,this._factories=new Map}get specs(){return 0===this._specs.size?null:{default:this.defaultKernelName,kernelspecs:Object.fromEntries(this._specs)}}get defaultKernelName(){let e=c.PageConfig.getOption("defaultKernelName");if(!e&&this._specs.size){const s=Array.from(this._specs.keys());s.sort(),e=s[0]}return e||h}get factories(){return this._factories}register(e){const{spec:s,create:t}=e;this._specs.set(s.name,s),this._factories.set(s.name,t)}}class p extends n.BaseManager{constructor(e){super(e),this._isReady=!1,this._connectionFailure=new r.Signal(this),this._ready=Promise.resolve(void 0),this._specsChanged=new r.Signal(this),this._kernelSpecs=e.kernelSpecs}get connectionFailure(){return this._connectionFailure}get isReady(){return this._isReady}get ready(){return this._ready}get specs(){return this._kernelSpecs.specs}get specsChanged(){return this._specsChanged}async refreshSpecs(){return Promise.resolve(void 0)}}var g=t(59047),v=t(81259),m=t(70552);new Error("timeout while waiting for mutex to become available"),new Error("mutex already locked");const y=new Error("request for lock canceled");var k=function(e,s,t,n){return new(t||(t=Promise))((function(r,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function o(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var s;e.done?r(e.value):(s=e.value,s instanceof t?s:new t((function(e){e(s)}))).then(a,o)}c((n=n.apply(e,s||[])).next())}))};class f{constructor(e,s=y){if(this._maxConcurrency=e,this._cancelError=s,this._queue=[],this._waiters=[],e<=0)throw new Error("semaphore must be initialized to a positive value");this._value=e}acquire(){const e=this.isLocked(),s=new Promise(((e,s)=>this._queue.push({resolve:e,reject:s})));return e||this._dispatch(),s}runExclusive(e){return k(this,void 0,void 0,(function*(){const[s,t]=yield this.acquire();try{return yield e(s)}finally{t()}}))}waitForUnlock(){return k(this,void 0,void 0,(function*(){return this.isLocked()?new Promise((e=>this._waiters.push({resolve:e}))):Promise.resolve()}))}isLocked(){return this._value<=0}release(){if(this._maxConcurrency>1)throw new Error("this method is unavailable on semaphores with concurrency > 1; use the scoped release returned by acquire instead");if(this._currentReleaser){const e=this._currentReleaser;this._currentReleaser=void 0,e()}}cancel(){this._queue.forEach((e=>e.reject(this._cancelError))),this._queue=[]}_dispatch(){const e=this._queue.shift();if(!e)return;let s=!1;this._currentReleaser=()=>{s||(s=!0,this._value++,this._resolveWaiters(),this._dispatch())},e.resolve([this._value--,this._currentReleaser])}_resolveWaiters(){this._waiters.forEach((e=>e.resolve())),this._waiters=[]}}class w{constructor(e){this._semaphore=new f(1,e)}acquire(){return e=this,s=void 0,n=function*(){const[,e]=yield this._semaphore.acquire();return e},new((t=void 0)||(t=Promise))((function(r,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function o(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var s;e.done?r(e.value):(s=e.value,s instanceof t?s:new t((function(e){e(s)}))).then(a,o)}c((n=n.apply(e,s||[])).next())}));var e,s,t,n}runExclusive(e){return this._semaphore.runExclusive((()=>e()))}isLocked(){return this._semaphore.isLocked()}waitForUnlock(){return this._semaphore.waitForUnlock()}release(){this._semaphore.release()}cancel(){return this._semaphore.cancel()}}var M=t(76555);const C=m.supportedKernelWebSocketProtocols.v1KernelWebsocketJupyterOrg;class b{constructor(e){var s;this._kernels=new g.ObservableMap,this._clients=new g.ObservableMap,this._kernelClients=new g.ObservableMap,this._changed=new r.Signal(this);const{kernelSpecs:t}=e;this._kernelspecs=t,this._serverSettings=null!==(s=e.serverSettings)&&void 0!==s?s:n.ServerConnection.makeSettings(),this._kernels.changed.connect(((e,s)=>{this._changed.emit(s)}))}get serverSettings(){return this._serverSettings}get changed(){return this._changed}async startNew(e){const{id:s,name:t,location:r}=e,i=null!=t?t:h,a=this._kernelspecs.factories.get(i);if(!a)throw Error(`No factory for kernel ${i}`);const o=new w,d=(e,s,t)=>{var n;const r=this._kernels.get(e);if(!r)throw Error(`No kernel ${e}`);this._clients.set(s,t),null===(n=this._kernelClients.get(e))||void 0===n||n.add(s),t.on("message",(async e=>{let s;if(e instanceof ArrayBuffer)e=new Uint8Array(e).buffer,s=(0,v.deserialize)(e,C);else{if("string"!=typeof e)return;{const t=(new TextEncoder).encode(e);s=(0,v.deserialize)(t.buffer,C)}}"input_reply"===s.header.msg_type?r.handleMessage(s):(async e=>{await o.runExclusive((async()=>{await r.ready,await r.handleMessage(e)}))})(s)}));const i=()=>{var t;this._clients.delete(s),null===(t=this._kernelClients.get(e))||void 0===t||t.delete(s)};r.disposed.connect(i),t.onclose=i},u=null!=s?s:l.UUID.uuid4(),_=c.URLExt.join(b.WS_BASE_URL,n.KernelAPI.KERNEL_SERVICE_URL,encodeURIComponent(u),"channels"),p=this._kernels.get(u);if(p)return{id:p.id,name:p.name};const g=await a({id:u,sendMessage:e=>{const s=e.header.session,t=this._clients.get(s);if(!t)return void console.warn(`Trying to send message on removed socket for kernel ${u}`);const n=(0,v.serialize)(e,C);if("iopub"!==e.channel)t.send(n);else{const e=this._kernelClients.get(u);null==e||e.forEach((e=>{var s;null===(s=this._clients.get(e))||void 0===s||s.send(n)}))}},name:i,location:null!=r?r:""});this._kernels.set(u,g),this._kernelClients.set(u,new Set);const m=new M.Server(_,{mock:!1,selectProtocol:()=>C});return m.on("connection",(e=>{var s;const t=null!==(s=new URL(e.url).searchParams.get("session_id"))&&void 0!==s?s:"";d(u,t,e)})),m.on("close",(()=>{this._clients.keys().forEach((e=>{var s;const t=this._clients.get(e);(null==t?void 0:t.readyState)===WebSocket.CLOSED&&(this._clients.delete(e),null===(s=this._kernelClients.get(u))||void 0===s||s.delete(e))}))})),g.disposed.connect((()=>{m.close(),this._kernels.delete(u),this._kernelClients.delete(u)})),{id:g.id,name:g.name}}async restart(e){const s=this._kernels.get(e);if(!s)throw Error(`Kernel ${e} does not exist`);const{id:t,name:n,location:r}=s;s.dispose(),await this.startNew({id:t,name:n,location:r})}async interrupt(e){}async listRunning(){return[...this._kernels.values()].map((e=>({id:e.id,name:e.name})))}async shutdown(e){var s;null===(s=this._kernels.delete(e))||void 0===s||s.dispose()}async shutdownAll(){this._kernels.keys().forEach((e=>{this.shutdown(e)}))}async getModel(e){return this._kernels.get(e)}}!function(e){e.WS_BASE_URL=c.PageConfig.getBaseUrl().replace(/^http/,"ws")}(b||(b={}))}}]);
//# sourceMappingURL=6807.c3f6b90.js.map