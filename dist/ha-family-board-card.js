function e(e,t,o,a){var i,r=arguments.length,n=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,o):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,a);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(r<3?i(n):r>3?i(t,o,n):i(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),i=new WeakMap;let r=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&i.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[a+1],e[0]);return new r(o,e,a)},s=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,f=g?g.emptyScript:"",m=_.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},x=(e,t)=>!l(e,t),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),a=this.getPropertyDescriptor(e,o,t);void 0!==a&&d(this.prototype,e,a)}}static getPropertyDescriptor(e,t,o){const{get:a,set:i}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);i?.call(this,t),this.requestUpdate(e,r,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(o)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of a){const a=document.createElement("style"),i=t.litNonce;void 0!==i&&a.setAttribute("nonce",i),a.textContent=o.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,o);if(void 0!==a&&!0===o.reflect){const i=(void 0!==o.converter?.toAttribute?o.converter:v).toAttribute(t,o.type);this._$Em=e,null==i?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(e,t){const o=this.constructor,a=o._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=o.getPropertyOptions(a),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=a;const r=i.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,o,a=!1,i){if(void 0!==e){const r=this.constructor;if(!1===a&&(i=this[e]),o??=r.getPropertyOptions(e),!((o.hasChanged??x)(i,t)||o.useDefault&&o.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:a,wrapped:i},r){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==i||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,o,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,m?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,D=$.trustedTypes,T=D?D.createPolicy("lit-html",{createHTML:e=>e}):void 0,M="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+z,S=`<${A}>`,C=document,E=()=>C.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,I="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,N=/>/g,L=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,U=/"/g,j=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...o)=>({_$litType$:e,strings:t,values:o}))(1),K=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),G=new WeakMap,V=C.createTreeWalker(C,129);function q(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t}const Y=(e,t)=>{const o=e.length-1,a=[];let i,r=2===t?"<svg>":3===t?"<math>":"",n=F;for(let t=0;t<o;t++){const o=e[t];let s,l,d=-1,c=0;for(;c<o.length&&(n.lastIndex=c,l=n.exec(o),null!==l);)c=n.lastIndex,n===F?"!--"===l[1]?n=B:void 0!==l[1]?n=N:void 0!==l[2]?(j.test(l[2])&&(i=RegExp("</"+l[2],"g")),n=L):void 0!==l[3]&&(n=L):n===L?">"===l[0]?(n=i??F,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,s=l[1],n=void 0===l[3]?L:'"'===l[3]?U:R):n===U||n===R?n=L:n===B||n===N?n=F:(n=L,i=void 0);const p=n===L&&e[t+1].startsWith("/>")?" ":"";r+=n===F?o+S:d>=0?(a.push(s),o.slice(0,d)+M+o.slice(d)+z+p):o+z+(-2===d?t:p)}return[q(e,r+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class Z{constructor({strings:e,_$litType$:t},o){let a;this.parts=[];let i=0,r=0;const n=e.length-1,s=this.parts,[l,d]=Y(e,t);if(this.el=Z.createElement(l,o),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=V.nextNode())&&s.length<n;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(M)){const t=d[r++],o=a.getAttribute(e).split(z),n=/([.?@])?(.*)/.exec(t);s.push({type:1,index:i,name:n[2],strings:o,ctor:"."===n[1]?te:"?"===n[1]?oe:"@"===n[1]?ae:ee}),a.removeAttribute(e)}else e.startsWith(z)&&(s.push({type:6,index:i}),a.removeAttribute(e));if(j.test(a.tagName)){const e=a.textContent.split(z),t=e.length-1;if(t>0){a.textContent=D?D.emptyScript:"";for(let o=0;o<t;o++)a.append(e[o],E()),V.nextNode(),s.push({type:2,index:++i});a.append(e[t],E())}}}else if(8===a.nodeType)if(a.data===A)s.push({type:2,index:i});else{let e=-1;for(;-1!==(e=a.data.indexOf(z,e+1));)s.push({type:7,index:i}),e+=z.length-1}i++}}static createElement(e,t){const o=C.createElement("template");return o.innerHTML=e,o}}function J(e,t,o=e,a){if(t===K)return t;let i=void 0!==a?o._$Co?.[a]:o._$Cl;const r=P(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),void 0===r?i=void 0:(i=new r(e),i._$AT(e,o,a)),void 0!==a?(o._$Co??=[])[a]=i:o._$Cl=i),void 0!==i&&(t=J(e,i._$AS(e,t.values),i,a)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,a=(e?.creationScope??C).importNode(t,!0);V.currentNode=a;let i=V.nextNode(),r=0,n=0,s=o[0];for(;void 0!==s;){if(r===s.index){let t;2===s.type?t=new Q(i,i.nextSibling,this,e):1===s.type?t=new s.ctor(i,s.name,s.strings,this,e):6===s.type&&(t=new ie(i,this,e)),this._$AV.push(t),s=o[++n]}r!==s?.index&&(i=V.nextNode(),r++)}return V.currentNode=C,a}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,a){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),P(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==K&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,a="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=Z.createElement(q(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new X(a,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Z(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,a=0;for(const i of e)a===t.length?t.push(o=new Q(this.O(E()),this.O(E()),this,this.options)):o=t[a],o._$AI(i),a++;a<t.length&&(this._$AR(o&&o._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,a,i){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=i,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=W}_$AI(e,t=this,o,a){const i=this.strings;let r=!1;if(void 0===i)e=J(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==K,r&&(this._$AH=e);else{const a=e;let n,s;for(e=i[0],n=0;n<i.length-1;n++)s=J(this,a[o+n],t,n),s===K&&(s=this._$AH[n]),r||=!P(s)||s!==this._$AH[n],s===W?e=W:e!==W&&(e+=(s??"")+i[n+1]),this._$AH[n]=s}r&&!a&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class oe extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ae extends ee{constructor(e,t,o,a,i){super(e,t,o,a,i),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??W)===K)return;const o=this._$AH,a=e===W&&o!==W||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==W&&(o===W||a);a&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(Z,Q),($.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;let se=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const a=o?.renderBefore??t;let i=a._$litPart$;if(void 0===i){const e=o?.renderBefore??null;a._$litPart$=i=new Q(t.insertBefore(E(),e),e,void 0,o??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};se._$litElement$=!0,se.finalized=!0,ne.litElementHydrateSupport?.({LitElement:se});const le=ne.litElementPolyfillSupport;le?.({LitElement:se}),(ne.litElementVersions??=[]).push("4.2.2");const de={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:x},ce=(e=de,t,o)=>{const{kind:a,metadata:i}=o;let r=globalThis.litPropertyMetadata.get(i);if(void 0===r&&globalThis.litPropertyMetadata.set(i,r=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),r.set(o.name,e),"accessor"===a){const{name:a}=o;return{set(o){const i=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,i,e,!0,o)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=o;return function(o){const i=this[a];t.call(this,o),this.requestUpdate(a,i,e,!0,o)}}throw Error("Unsupported decorator location: "+a)};function pe(e){return(t,o)=>"object"==typeof o?ce(e,t,o):((e,t,o)=>{const a=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),a?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function he(e){return pe({...e,state:!0,attribute:!1})}function ue(e,t,o){return e>0&&t>0?Math.min(4,t*Math.max(1,o||1)/e):1}const _e=[100,150,200,300];function ge(e,t){const o=_e.indexOf(e),a=Math.min(_e.length-1,Math.max(0,(o<0?0:o)+t));return _e[a]}let fe;async function me(e,t,o,a=()=>!1){const i=await function(){if(!fe){const{lib:e,worker:t}=function(e="4.10.38"){const t=`https://cdn.jsdelivr.net/npm/pdfjs-dist@${e}/build`;return{lib:`${t}/pdf.min.mjs`,worker:`${t}/pdf.worker.min.mjs`}}();fe=import(e).then(e=>{const o=URL.createObjectURL(new Blob([`import ${JSON.stringify(t)};`],{type:"text/javascript"}));return e.GlobalWorkerOptions.workerPort=new Worker(o,{type:"module"}),e}),fe.catch(()=>fe=void 0)}return fe}(),r=await i.getDocument({data:e,isEvalSupported:!1}).promise;try{for(let e=1;e<=r.numPages&&!a();e++){const i=await r.getPage(e),n=i.getViewport({scale:1}),s=i.getViewport({scale:ue(n.width,t,window.devicePixelRatio)}),l=document.createElement("canvas");l.width=Math.floor(s.width),l.height=Math.floor(s.height),await i.render({canvasContext:l.getContext("2d"),viewport:s}).promise,i.cleanup(),a()||o(l,e,r.numPages)}return r.numPages}finally{r.destroy()}}class be extends se{constructor(){super(...arguments),this.heading="",this._pages=[],this._total=0,this._state="loading",this._zoom=100,this._closed=!1,this._guardPull=e=>{const t=this.renderRoot.querySelector(".pages");(!(!!t&&e.composedPath().includes(t))||t.scrollHeight<=t.clientHeight)&&e.preventDefault()}}firstUpdated(){this._dialog.showModal(),this._dialog.addEventListener("touchmove",this._guardPull,{passive:!1}),this._render()}async _render(){try{if(!this.load)throw new Error("no loader");await me(await this.load(),Math.min(window.innerWidth,1400),(e,t,o)=>{this._total=o,this._pages=[...this._pages,e]},()=>this._closed),this._closed||(this._state="done")}catch{this._closed||(this._state="error")}}_close(){this._closed=!0,this._dialog?.removeEventListener("touchmove",this._guardPull),this._dialog?.close(),this.remove()}_count(){if(this._total){return`${this._pages.length<this._total?`${this._pages.length} von `:""}${this._total} ${1===this._total?"Seite":"Seiten"}`}return"error"===this._state?"nur Seite 1 (PDF nicht ladbar)":"lädt …"}render(){return H`
      <dialog @cancel=${e=>(e.preventDefault(),this._close())}>
        <div class="bar">
          <div class="title">${this.heading}<span>${this._count()}</span></div>
          <button
            ?disabled=${100===this._zoom}
            @click=${()=>this._zoom=ge(this._zoom,-1)}
            aria-label="Verkleinern"
          >
            <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
          </button>
          <button @click=${()=>this._zoom=ge(this._zoom,1)} aria-label="Vergrößern">
            <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
          </button>
          <button @click=${()=>this._close()} aria-label="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="pages" style="--z:${this._zoom/100}">
          ${this._pages.length?this._pages:this.thumb?H`<img src=${this.thumb} alt="" />`:W}
        </div>
      </dialog>
    `}}be.styles=n`
    dialog {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: none;
      background: rgba(0, 0, 0, 0.94);
      color: #fff;
      overscroll-behavior: none;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }
    dialog[open] {
      display: flex;
      flex-direction: column;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px 10px 18px;
    }
    .title {
      flex: 1;
      min-width: 0;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title span {
      margin-left: 12px;
      font-weight: 400;
      opacity: 0.7;
    }
    button {
      width: 52px;
      height: 52px;
      border: none;
      border-radius: 26px;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      cursor: pointer;
      --mdc-icon-size: 28px;
    }
    button:disabled {
      opacity: 0.35;
    }
    .pages {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      /* scrolling past the first/last page must not reload the dashboard */
      overscroll-behavior: contain;
      padding: 0 12px 24px;
      display: flex;
      flex-direction: column;
      /* "safe": when zoomed wider than the screen, the left edge stays reachable */
      align-items: safe center;
      gap: 12px;
    }
    .pages canvas,
    .pages img {
      /* 100 % = page fits the width (at most 900 px), zoom multiplies that */
      width: calc(min(100%, 900px) * var(--z, 1));
      max-width: none;
      height: auto;
      flex: none;
      background: #fff;
      border-radius: 4px;
    }
  `,e([pe()],be.prototype,"heading",void 0),e([pe()],be.prototype,"thumb",void 0),e([pe({attribute:!1})],be.prototype,"load",void 0),e([he()],be.prototype,"_pages",void 0),e([he()],be.prototype,"_total",void 0),e([he()],be.prototype,"_state",void 0),e([he()],be.prototype,"_zoom",void 0),e([function(e){return(t,o,a)=>((e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,o),o))(t,o,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}("dialog")],be.prototype,"_dialog",void 0),customElements.get("paperless-pdf-viewer")||customElements.define("paperless-pdf-viewer",be);class ve extends se{constructor(){super(...arguments),this._docs=[],this._tags=new Map,this._correspondents=new Map,this._thumbs=new Map,this._busy=new Set,this._error="",this._loading=!0}setConfig(e){this._config=function(e){if(!e||!e.url)throw new Error("paperless-pay-card: 'url' fehlt");if(!e.token)throw new Error("paperless-pay-card: 'token' fehlt");const t=Number(e.tag);if(!Number.isInteger(t)||t<=0)throw new Error("paperless-pay-card: 'tag' fehlt");const o=(e.tags&&e.tags.length?e.tags:[t]).map(Number);return{...e,type:e.type||"custom:paperless-pay-card",url:e.url.replace(/\/+$/,""),token:e.token,tag:t,tags:o,paid_tag:Number(e.paid_tag??t),service:e.service||"rest_command.paperless_tags_setzen",refresh:Math.max(30,Number(e.refresh??300))}}(e)}getCardSize(){return 3+2*this._docs.length}connectedCallback(){super.connectedCallback(),this._load(),this._timer=window.setInterval(()=>this._load(),1e3*this._config.refresh)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer),this._thumbs.forEach(e=>URL.revokeObjectURL(e)),this._thumbs=new Map}updated(e){if(!e.has("hass")||!this._config.entity)return;const t=this.hass?.states[this._config.entity]?.state;void 0!==this._entityState&&t!==this._entityState&&this._load(),this._entityState=t}async _get(e,t=!1){const o=await fetch(e,{headers:{Authorization:`Token ${this._config.token}`}});if(!o.ok)throw new Error(`Paperless antwortet ${o.status}`);return t?o.blob():o.json()}async _load(){const e=this._config;try{const a=await this._get((t=e.url,o=e.tag,`${t}/api/documents/?tags__id__all=${o}&ordering=created&page_size=50&fields=id,title,correspondent,created,tags`));this._docs=a.results,this._error="";const i=[...e.tags,...a.results.flatMap(e=>e.tags)],r=a.results.map(e=>e.correspondent).filter(e=>!!e);await Promise.all([this._names("tags",i),this._names("correspondents",r),...a.results.map(e=>this._thumb(e.id))])}catch(e){this._error=`Paperless nicht erreichbar (${e.message})`}finally{this._loading=!1}var t,o}async _names(e,t){if(t.length)try{const o=await this._get(function(e,t,o){return`${e}/api/${t}/?id__in=${[...new Set(o)].join(",")}&page_size=100`}(this._config.url,e,t));if("tags"===e){const e=new Map(this._tags);o.results.forEach(t=>e.set(t.id,t)),this._tags=e}else{const e=new Map(this._correspondents);o.results.forEach(t=>e.set(t.id,t.name)),this._correspondents=e}}catch{}}async _thumb(e){if(!this._thumbs.has(e))try{const t=await this._get(`${this._config.url}/api/documents/${e}/thumb/`,!0);this._thumbs=new Map(this._thumbs).set(e,URL.createObjectURL(t))}catch{}}async _setTags(e,t){if(this._busy.has(e.id))return;this._busy=new Set(this._busy).add(e.id);const o=this._config;try{const[a,i]=function(e){const t=e.indexOf(".");if(t<=0||t===e.length-1)throw new Error(`Ungültiger Dienst: ${e}`);return[e.slice(0,t),e.slice(t+1)]}(o.service);await this.hass.callService(a,i,{id:e.id,tags:t});const r=await this._get(`${o.url}/api/documents/${e.id}/?fields=id,title,correspondent,created,tags`).catch(()=>null);if(r&&!function(e,t){if(e.length!==t.length)return!1;const o=new Set(e);return t.every(e=>o.has(e))}(r.tags,t))throw new Error("Tags wurden nicht übernommen");o.entity&&this.hass.callService("homeassistant","update_entity",{entity_id:o.entity}).catch(()=>{}),await this._load()}catch(e){this._error=`Ändern fehlgeschlagen: ${e.message}`}finally{const t=new Set(this._busy);t.delete(e.id),this._busy=t}}_openViewer(e){const t=document.createElement("paperless-pdf-viewer");t.heading=e.title,t.thumb=this._thumbs.get(e.id),t.load=()=>this._get(`${this._config.url}/api/documents/${e.id}/preview/`,!0).then(e=>e.arrayBuffer()),document.body.appendChild(t)}_tagName(e){return this._tags.get(e)?.name??`#${e}`}render(){const e=this._config;return H`
      <ha-card>
        <div class="head">
          <ha-icon icon="mdi:cash-clock"></ha-icon>
          <span class="title">${e.title??"Noch zu zahlen"}</span>
          <span class="count">${this._loading?"…":this._docs.length}</span>
          <ha-icon-button class="reload" @click=${()=>this._load()} label="Neu laden">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </ha-icon-button>
        </div>
        ${this._error?H`<div class="error">${this._error}</div>`:W}
        ${this._loading||this._docs.length||this._error?W:H`<div class="empty">
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>Alles bezahlt
            </div>`}
        <div class="list">${this._docs.map(e=>this._renderDoc(e))}</div>
      </ha-card>
    `}_renderDoc(e){const t=this._config,o=this._busy.has(e.id),a=this._thumbs.get(e.id),i=function(e,t=new Date){const o=/^(\d{4})-(\d{2})-(\d{2})/.exec(e||"");if(!o)return 0;const a=Date.UTC(+o[1],+o[2]-1,+o[3]),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate());return Math.max(0,Math.round((i-a)/864e5))}(e.created);return H`
      <div class="doc ${o?"busy":""}">
        <button class="thumb" @click=${()=>this._openViewer(e)} aria-label="Dokument ansehen">
          ${a?H`<img src=${a} alt="" />`:H`<ha-icon icon="mdi:file-document-outline"></ha-icon>`}
        </button>
        <div class="info">
          <div class="doc-title">${e.title}</div>
          <div class="meta">
            ${e.correspondent?this._correspondents.get(e.correspondent)??"":""}
            <span>${function(e){const t=/^(\d{4})-(\d{2})-(\d{2})/.exec(e||"");return t?`${t[3]}.${t[2]}.${t[1]}`:e||""}(e.created)}</span>
            ${i>=14?H`<span class="old">seit ${i} Tagen</span>`:W}
          </div>
          <div class="chips">
            ${t.tags.map(t=>{const a=e.tags.includes(t),i=this._tags.get(t);return H`<button
                class="chip ${a?"on":""}"
                style=${a&&i?.color?`--chip:${i.color};--chip-text:${i.text_color??"#fff"}`:""}
                ?disabled=${o}
                @click=${()=>this._setTags(e,function(e,t){return e.includes(t)?e.filter(e=>e!==t):[...e,t]}(e.tags,t))}
              >
                ${this._tagName(t)}
              </button>`})}
          </div>
        </div>
        <button
          class="paid"
          ?disabled=${o||!e.tags.includes(t.paid_tag)}
          @click=${()=>this._setTags(e,e.tags.filter(e=>e!==t.paid_tag))}
        >
          <ha-icon icon=${o?"mdi:timer-sand":"mdi:check-bold"}></ha-icon>
          Bezahlt
        </button>
      </div>
    `}}ve.styles=n`
    ha-card {
      padding: 12px 16px 16px;
      position: relative;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
      font-weight: 600;
    }
    .head .title {
      flex: 1;
    }
    .count {
      min-width: 32px;
      text-align: center;
      border-radius: 16px;
      padding: 2px 10px;
      background: var(--warning-color, #f4a100);
      color: #fff;
    }
    .error {
      margin: 8px 0;
      color: var(--error-color, #db4437);
    }
    .empty {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 24px 0 8px;
      color: var(--success-color, #43a047);
      font-size: 1.1rem;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .doc {
      display: grid;
      grid-template-columns: 96px 1fr auto;
      gap: 14px;
      align-items: center;
      padding: 10px;
      border-radius: 12px;
      background: var(--secondary-background-color);
    }
    .doc.busy {
      opacity: 0.55;
    }
    .thumb {
      width: 96px;
      height: 128px;
      padding: 0;
      border: none;
      border-radius: 8px;
      overflow: hidden;
      background: var(--card-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-in;
      --mdc-icon-size: 40px;
      color: var(--secondary-text-color);
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .doc-title {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.3;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 4px;
      color: var(--secondary-text-color);
    }
    .meta .old {
      color: var(--error-color, #db4437);
      font-weight: 600;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .chip {
      --chip: var(--primary-color);
      min-height: 40px;
      padding: 0 14px;
      border-radius: 20px;
      border: 2px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .chip.on {
      background: var(--chip);
      border-color: var(--chip);
      color: var(--chip-text, #fff);
    }
    .paid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 96px;
      min-height: 96px;
      border: none;
      border-radius: 14px;
      background: #2e7d32;
      color: #fff;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      --mdc-icon-size: 36px;
    }
    .paid:disabled,
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    @media (max-width: 600px) {
      .doc {
        grid-template-columns: 72px 1fr;
      }
      .thumb {
        width: 72px;
        height: 96px;
      }
      .paid {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: center;
        min-height: 48px;
      }
    }
  `,e([pe({attribute:!1})],ve.prototype,"hass",void 0),e([he()],ve.prototype,"_config",void 0),e([he()],ve.prototype,"_docs",void 0),e([he()],ve.prototype,"_tags",void 0),e([he()],ve.prototype,"_correspondents",void 0),e([he()],ve.prototype,"_thumbs",void 0),e([he()],ve.prototype,"_busy",void 0),e([he()],ve.prototype,"_error",void 0),e([he()],ve.prototype,"_loading",void 0),customElements.get("paperless-pay-card")||customElements.define("paperless-pay-card",ve),window.customCards=window.customCards||[],window.customCards.push({type:"paperless-pay-card",name:"Paperless: noch zu zahlen",description:"Dokumente aus Paperless-ngx mit Zahl-Tag, Vorschau, Bezahlt-Knopf und Tag-Chips."});const xe=864e5;function ye(e,t,o,a,i=!1){const r=!e?.start?.dateTime;let n,s;if(r){if(!e?.start?.date)return null;n=new Date(`${e.start.date}T00:00:00`),s=e.end?.date?new Date(`${e.end.date}T00:00:00`):new Date(n.getTime()+xe)}else n=new Date(e.start.dateTime),s=new Date(e.end?.dateTime??e.start.dateTime);return isNaN(n.getTime())||isNaN(s.getTime())?null:(s.getTime()<=n.getTime()&&(s=new Date(n.getTime()+(r?xe:6e4))),{personIdx:t,shared:i,calendar:o,uid:e.uid,recurrence_id:e.recurrence_id,rrule:e.rrule,summary:e.summary||"Termin",description:e.description,location:e.location,allDay:r,start:n,end:s,color:a,tentative:!1})}function we(e,t,o){const a=[],i=new Date(e.start);i.setHours(0,0,0,0);const r=new Date(e.end);r.setHours(0,0,0,0);const n=Math.max(1,$e(i,r)+(e.end.getTime()>r.getTime()?1:0)),s=function(e,t){const o=[];for(let a=0;a<t;a++)o.push(new Date(e.getFullYear(),e.getMonth(),e.getDate()+a));return o}(t,o+1);for(let t=0;t<o;t++){const o=s[t],r=s[t+1],l=Math.max(e.start.getTime(),o.getTime()),d=Math.min(e.end.getTime(),r.getTime());if(d<=l)continue;const c=e.allDay?0:Math.round((l-o.getTime())/6e4),p=e.allDay?1440:Math.round((d-o.getTime())/6e4),h=n>1?$e(i,o)+1:void 0;a.push({part:h,parts:n>1?n:void 0,ref:e,personIdx:e.personIdx,shared:!0===e.shared,day:t,startMin:c,endMin:Math.min(p,1440),title:e.summary,location:e.location,allDay:e.allDay,color:e.color,continuesBefore:e.start.getTime()<o.getTime(),continuesAfter:e.end.getTime()>r.getTime()})}return a}function $e(e,t){const o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()),a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate());return Math.round((a-o)/xe)}function ke(e){const t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),o=[];let a=[],i=-1,r=0;const n=[],s=()=>{if(a.length){const e=Math.max(...a.map(e=>e.col))+1;a.forEach(t=>{t.cols=e,t.cluster=r;let o=e;for(const e of a)e!==t&&e.col>t.col&&e.startMin<t.endMin&&e.endMin>t.startMin&&(o=Math.min(o,e.col));t.span=Math.max(1,o-t.col)}),r++}a=[]};for(const e of t){a.length&&e.startMin>=i&&(s(),n.length=0);let t=n.findIndex(t=>t<=e.startMin);-1===t?(t=n.length,n.push(e.endMin)):n[t]=e.endMin;const l={...e,col:t,cols:1,span:1,cluster:r};a.push(l),o.push(l),i=1===a.length?e.endMin:Math.max(i,e.endMin)}return s(),o}const De={board_title:"Family board",day:"Day",week:"Week",month:"Month",agenda:"Agenda",timeline:"Timeline",all_day:"all-day",this_week:"This week",prev_week:"Previous week",next_week:"Next week",prev_month:"Previous month",next_month:"Next month",today:"Today",tomorrow:"Tomorrow",yesterday:"Yesterday",open_map:"Map",status_home:"home",status_away:"away",add_event:"Add event",new_event:"New event",event:"Event",todo:"To-do",edit_event:"Edit event",edit_todo:"Edit to-do",close:"Close",field_title:"Title",field_all_day:"All-day",field_start:"Start",field_end:"End",field_due:"Due",field_location:"Location",field_note:"Note",field_calendar:"Calendar",recurring:"Recurring event",recur_this:"This event only",recur_future:"This and following",read_only:"This calendar is read-only.",delete:"Delete",cancel:"Cancel",save:"Save",err_invalid:"Please enter valid times.",err_end_before:"End is before start.",err_end_equal:"End must be after start.",save_failed:"Saving failed.",delete_failed:"Deleting failed.",default_title:"Event",load_error:"Calendar could not be loaded.",no_events:"No events.",more_events:"more events",focus_next:"next",focus_free:"free",shared_events:"Shared",shared_todos:"Shared to-dos",todo_item:"to-do",todo_items:"to-dos",todo_due:"Due:",todo_complete:"Mark as done",planner:"Planner",prev_days:"Earlier days",next_days:"Later days",back:"Back",nothing_planned:"Nothing planned",now:"now",for_whom:"For whom?",filter_persons:"Show or hide people",until:"until",cd_today:"today!",cd_tomorrow:"tomorrow!",cd_days:"{n} sleeps to go",leave_now:"Leave now!",leave_in:"Leave in {n} min",leave_at:"leave at {t}",minutes_short:"min",tile_leave_now:"leave now!",tile_leave_in:"leave in {n}′",tile_leave_at:"leave {t}"},Te={en:De,de:{board_title:"Familienplan",day:"Tag",week:"Woche",month:"Monat",agenda:"Agenda",timeline:"Zeitstrahl",all_day:"ganztägig",this_week:"Diese Woche",prev_week:"Vorherige Woche",next_week:"Nächste Woche",prev_month:"Vorheriger Monat",next_month:"Nächster Monat",today:"Heute",tomorrow:"Morgen",yesterday:"Gestern",open_map:"Karte",status_home:"zuhause",status_away:"unterwegs",add_event:"Termin hinzufügen",new_event:"Neuer Termin",event:"Termin",todo:"To-do",edit_event:"Termin bearbeiten",edit_todo:"To-do bearbeiten",close:"Schließen",field_title:"Titel",field_all_day:"Ganztägig",field_start:"Start",field_end:"Ende",field_due:"Fällig",field_location:"Ort",field_note:"Notiz",field_calendar:"Kalender",recurring:"Wiederkehrender Termin",recur_this:"Nur dieser Termin",recur_future:"Dieser und folgende",read_only:"Dieser Kalender ist schreibgeschützt.",delete:"Löschen",cancel:"Abbrechen",save:"Speichern",err_invalid:"Bitte gültige Zeiten angeben.",err_end_before:"Ende liegt vor dem Start.",err_end_equal:"Ende muss nach dem Start liegen.",save_failed:"Speichern fehlgeschlagen.",delete_failed:"Löschen fehlgeschlagen.",default_title:"Termin",load_error:"Kalender konnte nicht geladen werden.",no_events:"Keine Termine.",more_events:"weitere Termine",focus_next:"als Nächstes",focus_free:"frei",shared_events:"Gemeinsam",shared_todos:"Gemeinsame To-dos",todo_item:"To-do",todo_items:"To-dos",todo_due:"Fällig:",todo_complete:"Als erledigt markieren",planner:"Planer",prev_days:"Frühere Tage",next_days:"Spätere Tage",back:"Zurück",nothing_planned:"Nichts geplant",now:"jetzt",for_whom:"Für wen?",filter_persons:"Personen ein- oder ausblenden",until:"bis",cd_today:"heute!",cd_tomorrow:"morgen!",cd_days:"noch {n}× schlafen",leave_now:"Jetzt losfahren!",leave_in:"Losfahren in {n} Min",leave_at:"los um {t}",minutes_short:"Min",tile_leave_now:"jetzt los!",tile_leave_in:"los in {n}′",tile_leave_at:"los {t}"}};function Me(e){return(e?.locale?.language||navigator?.language||"en").toLowerCase().split("-")[0]}function ze(e,t){const o=Me(e);return Te[o]?.[t]??De[t]??t}function Ae(e){return e?.locale?.language||navigator?.language||"en"}function Se(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const o=new Intl.DateTimeFormat(Ae(e),{hour:"numeric"}).format(new Date(2020,0,1,13));return/\s?[AaPp]\.?[Mm]\.?/.test(o)||/1\s?PM/i.test(o)}function Ce(e,t){return new Intl.DateTimeFormat(Ae(e),{hour:Se(e)?"numeric":"2-digit",minute:"2-digit",hour12:Se(e)}).format(t)}function Ee(e,t){const o=new Date(2020,0,1,0,0,0,0);return o.setMinutes(t),Ce(e,o)}function Pe(e,t,o=1){const a=new Intl.DateTimeFormat(Ae(e),{weekday:t}),i=Array.from({length:7},(e,t)=>{const o=a.format(new Date(2024,0,7+t));return o.charAt(0).toUpperCase()+o.slice(1)});return Array.from({length:7},(e,t)=>i[(o+t)%7])}function Oe(e,t){const o=t.getTime()-Date.now();if(o<=0)return"";const a=new Intl.RelativeTimeFormat(Ae(e),{numeric:"always",style:"short"}),i=Math.round(o/6e4);if(i<60)return a.format(Math.max(1,i),"minute");const r=Math.round(i/60);return r<24?a.format(r,"hour"):a.format(Math.round(r/24),"day")}function Ie(e,t="⏳"){return t&&e.split(t).join(" ").replace(/\s{2,}/g," ").trim()||e.trim()}function Fe(e){return/https?:\/\/|\b(zoom|teams|meet|webex|online|skype|facetime|telefon|phone)\b/i.test(e)}function Be(e){const t=/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/.exec(e);if(!t)return;const o=Number(t[1]),a=Number(t[2]);return Math.abs(o)<=90&&Math.abs(a)<=180?{lat:o,lon:a}:void 0}function Ne(e,t){const o=e=>e*Math.PI/180,a=o(t.lat-e.lat),i=o(t.lon-e.lon),r=Math.sin(a/2)**2+Math.cos(o(e.lat))*Math.cos(o(t.lat))*Math.sin(i/2)**2;return 12742*Math.asin(Math.min(1,Math.sqrt(r)))}const Le=["off","unknown","unavailable","","none","false","0","keine"];const Re=["day","planner","timeline","week","month","agenda"],Ue=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],je={"clear-night":"weather-night",cloudy:"weather-cloudy",fog:"weather-fog",hail:"weather-hail",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",partlycloudy:"weather-partly-cloudy",pouring:"weather-pouring",rainy:"weather-rainy",snowy:"weather-snowy","snowy-rainy":"weather-snowy-rainy",sunny:"weather-sunny",windy:"weather-windy","windy-variant":"weather-windy-variant",exceptional:"weather-cloudy-alert"},He=-1,Ke=[[/zahnarzt|dentist|kieferortho/i,"🦷"],[/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i,"🩺"],[/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i,"🎂"],[/schwimm|swim|hallenbad|baden/i,"🏊"],[/fußball|fussball|soccer|football|training/i,"⚽"],[/sport|gym|fitness|turnen|joggen|laufen|workout/i,"🏃"],[/reit|pferd|pony|horse/i,"🐴"],[/tanz|ballett|dance/i,"🩰"],[/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i,"🎵"],[/schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,"🎒"],[/kita|kindergarten|krippe|hort/i,"🧸"],[/frühstück|fruehstueck|breakfast/i,"🥐"],[/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i,"🍽️"],[/kaffee|coffee|café|cafe/i,"☕"],[/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i,"🏖️"],[/flug|flight|airport|flughafen/i,"✈️"],[/zug|bahn|train|abfahrt|ankunft/i,"🚆"],[/kino|film|movie|cinema/i,"🎬"],[/party|feier|fest|celebration/i,"🎉"],[/einkauf|shopping|supermarkt|einkaufen|besorgung/i,"🛒"],[/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i,"🧹"],[/schlaf|nap|ruhezeit|mittagsschlaf/i,"😴"],[/spiel|freispiel|play|angebotszeit/i,"🧸"],[/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i,"💼"],[/friseur|haircut|hairdresser|frisör|frisoer/i,"💇"],[/kirche|church|gottesdienst|messe|religion/i,"⛪"],[/pause|hofpause|break/i,"⏸️"]],We=/\p{Extended_Pictographic}/u,Ge=e=>String(e).padStart(2,"0"),Ve=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,16),qe=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,10),Ye=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t};let Ze=Date.now(),Je=!1;const Xe=()=>{Ze=Date.now()};const Qe=(e,t)=>e.color||Ue[t%Ue.length],et=e=>{let t=0;for(let o=0;o<e.length;o++)t=31*t+e.charCodeAt(o)>>>0;return Ue[t%Ue.length]};function tt(e){const t=e?.states??{},o=Object.keys(t).filter(e=>e.startsWith("calendar.")),a=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,""),i=[];for(const e of Object.keys(t)){if(!e.startsWith("person."))continue;const r=e.slice(7),n=t[e].attributes?.friendly_name??r,s=a(r),l=a(n),d=o.filter(e=>{const o=a(e.slice(9)),i=a(t[e].attributes?.friendly_name??"");return o===s||o.includes(s)||l.length>2&&(o.includes(l)||i.includes(l))});if(i.push({name:n,person:e,calendar:1===d.length?d[0]:d.length?d:""}),i.length>=10)break}return i}function ot(e){const t=new Date,o=e.hass.locale?.language||"en",a=new Intl.DateTimeFormat(o,{weekday:"long"}).format(t),i=new Intl.DateTimeFormat(o,{day:"numeric",month:"long"}).format(t);return H`
    <div class="clockhead">
      ${st(e)}
      <div class="clock">
        <span class="ctime">${Ce(e.hass,t)}</span>
        <span class="cdate"><b>${a}</b><span>${i}</span></span>
      </div>
      ${function(e){const t=e._config.weather_entity,o=t&&!1!==e._config.show_weather?e.hass.states[t]:void 0;if(!o)return W;const a=Number(o.attributes?.temperature),i=o.attributes?.temperature_unit??"°",r=e.hass.formatEntityState,n="function"==typeof r?r(o):o.state,s=e._forecast[qe(new Date)];return H`<button class="cwx" @click=${()=>e._moreInfo(t)}>
    <ha-icon icon="mdi:${je[o.state]||"weather-cloudy"}"></ha-icon>
    <span class="cwxmain">
      <span class="cwxtemp">${Number.isFinite(a)?Math.round(a):"–"}${i}</span>
      <span class="cwxsub"
        >${n}${s?H` · ↑${s.temp}°${void 0!==s.low?H` ↓${s.low}°`:W}`:W}</span
      >
    </span>
  </button>`}(e)} ${at(e)}
      <span class="cspacer"></span>
      ${nt(e)}
    </div>
  `}function at(e){if(!e._countdowns.length)return W;const t=new Date;return H`<div class="cdowns">
    ${e._countdowns.map(o=>{const a=function(e,t){return $e(e,t)}(t,o.start);return H`<button
        class="cdown ${a<=1?"hot":""}"
        style="--c:${o.color}"
        title=${o.start.toLocaleDateString(e.hass.locale?.language)}
        @click=${()=>e._goToDate(o.start)}
      >
        <span class="cdnum">${a<=1?"🎉":a}</span>
        <span class="cdtxt"><b>${o.title}</b><small>${e._countdownText(a)}</small></span>
      </button>`})}
  </div>`}function it(e){e._travelRev;const t=(e._config.notices??[]).filter(t=>{const o=e.hass.states[t.entity]?.state,a=e._noticeDone[t.entity];return!(a&&a.state===o&&Date.now()-a.at<12e4)&&function(e,t=Le){if(void 0===e)return!1;const o=e.trim().toLowerCase();return!t.map(e=>String(e).toLowerCase()).includes(o)}(o,t.idle_states)}),o=Date.now(),a=e._raw.filter(t=>!e._isOff(t.personIdx)&&t.start.getTime()>o).map(t=>({r:t,l:e._leaveFor(t)})).filter(e=>!!e.l&&"info"!==e.l.level).filter((e,t,o)=>o.findIndex(t=>t.r.summary===e.r.summary&&t.r.start.getTime()===e.r.start.getTime())===t).slice(0,2),i=e._config.clock_header?W:at(e);return t.length||a.length||i!==W?H`<div class="extras">
    ${i}
    ${a.map(({r:t,l:o})=>H`<div class="notice leave ${o.level}">
          <ha-icon icon="mdi:car"></ha-icon>
          <span class="ntxt"
            ><b>${e._leaveText(o)}</b
            ><small>${Ie(t.summary,"")} · ${Ce(e.hass,t.start)}</small></span
          >
        </div>`)}
    ${t.map(t=>{const o=e.hass.states[t.entity],a=String(o?.attributes?.friendly_name??t.entity),i=t.title?(r=t.title,n={state:o.state,name:a},r.replace(/\{(\w+)\}/g,(e,t)=>t in n?n[t]:e)):o.state;var r,n;return H`<div class="notice" style=${t.color?`--c:${t.color}`:""}>
        <button class="nbody" @click=${()=>e._moreInfo(t.entity)}>
          <ha-icon icon=${t.icon||"mdi:information-outline"}></ha-icon>
          <span class="ntxt"><b>${i}</b></span>
        </button>
        ${t.button&&t.action?H`<button class="nbtn" @click=${()=>e._runNotice(t)}>
              <ha-icon icon="mdi:check"></ha-icon>${t.button}
            </button>`:W}
      </div>`})}
  </div>`:W}function rt(e){const{monday:t}=e._weekBounds();return H`
    <div class="weeknav">
      <button class="nav" aria-label=${e._t("prev_week")} @click=${e._prevWeek}>‹</button>
      <button class="nav-now" @click=${e._thisWeek}>
        ${function(e,t){const o=new Date(t.getTime()+5184e5),a=new Intl.DateTimeFormat(Ae(e),{day:"numeric",month:"short"});return`${a.format(t)} – ${a.format(o)}`}(e.hass,t)}
      </button>
      <button class="nav" aria-label=${e._t("next_week")} @click=${e._nextWeek}>›</button>
    </div>
  `}function nt(e){return e._enabledViews.length<2?W:H`<div class="switch" role="tablist">
    ${e._enabledViews.map(t=>H`<button
          role="tab"
          aria-selected=${e._view===t}
          class=${e._view===t?"on":""}
          @click=${()=>e._view=t}
        >
          ${e._t(t)}
        </button>`)}
  </div>`}function st(e){return e._config.back_path?H`<button class="back" aria-label=${e._t("back")} @click=${e._navigateBack}>
    <ha-icon icon="mdi:chevron-left"></ha-icon>
  </button>`:W}function lt(e){const t=Pe(e.hass,"short",e._firstDayJs);return H`
    <div class="tabs" role="tablist">
      ${e._visibleDays.map(o=>H`
          <button
            role="tab"
            aria-selected=${o===e._day}
            class="${o===e._day?"on":""} ${e._isRealToday(o)?"today":""}"
            @click=${()=>e._day=o}
          >
            ${t[o]}
          </button>
        `)}
    </div>
  `}function dt(e){const t=Pe(e.hass,"long",e._firstDayJs),o=new Intl.DateTimeFormat(e.hass.locale?.language||"en",{day:"numeric",month:"short"}),a=t=>{if(!e._config.filter_duplicates)return t;const o=new Set;return t.filter(t=>{const a=`${e._evTitle(t)}|${t.ref.start.getTime()}|${t.ref.end.getTime()}`;return!o.has(a)&&(o.add(a),!0)})},i=e._visibleDays.map(t=>({d:t,items:a(e._events.filter(o=>o.day===t&&!e._isOff(o.personIdx)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin))})).filter(e=>e.items.length>0);return H`
    <div class="weekhead">${rt(e)}</div>
    ${e._loadError?H`<div class="banner">${e._t("load_error")}</div>`:W}
    <div class="agenda">
      ${0===i.length?H`<div class="agenda-empty">
            ${e._loading?H`<span class="spinner"></span>`:e._t("no_events")}
          </div>`:i.map(a=>H`
              <div class="agenda-day">
                <div class="agenda-date ${e._isRealToday(a.d)?"today":""}">
                  ${e._relativeDay(e._dateForDay(a.d))??t[a.d]} ·
                  ${o.format(e._dateForDay(a.d))}
                  ${e._weatherChip(e._dateForDay(a.d))}
                </div>
                ${a.items.map(t=>function(e,t){const o=e._eventColor(t),a=e._eventOwnerLabel(t),i=t.allDay?e._t("all_day"):`${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}`,r=e._isCurrent(t),n=e._isTentative(t),s=t.allDay||r||t.continuesBefore?"":Oe(e.hass,t.ref.start);return H`
    <div
      class="agenda-row ${e._isPast(t)?"past":""} ${r?"current":""} ${n?"tentative":""} ${e._isShared(t)?"shared":""} ${e._isTodo(t)?"todo":""}"
      tabindex="0"
      role="button"
      @click=${()=>e._openEvent(t)}
      @keydown=${o=>e._onItemKey(o,t)}
    >
      <span class="agenda-time">${i}</span>
      <span class="agenda-bar" style="background:${o}"></span>
      <span class="agenda-main">
        <span class="agenda-title ${e._isTodo(t)?"todo-line":""}"
          >${e._isTodo(t)?e._renderTodoCheckbox(t):W}${e._isTodo(t)?H`<span class="todo-label"
                >${e._calIconEl(t)}${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}</span
              >`:H`${e._calIconEl(t)}${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}`}</span
        >
        <span class="agenda-meta">${a}${t.location?` · ${t.location}`:""}</span>
        ${r&&e._progressOn?H`<span class="agenda-prog"
              ><span style="width:${e._progressPct(t)}%;background:${o}"></span
            ></span>`:W}
      </span>
      ${s?H`<span class="agenda-cd">${s}</span>`:W}
    </div>
  `}(e,t))}
              </div>
            `)}
    </div>
  `}function ct(e){const t=e._plannerDays,{start:o,end:a}=e._plannerWindow(),i=e.hass.locale?.language||"en",r=new Intl.DateTimeFormat(i,{weekday:"short"}),n=new Intl.DateTimeFormat(i,{month:"short"}),s=Ye(new Date).getTime(),l=e._raw.filter(t=>!(e._isOff(t.personIdx)||"todo"===t.kind&&!t.todo_due&&Ye(t.start).getTime()!==s)),d=function(e,t,o){const a=Array.from({length:o},()=>[]);for(const i of e)for(const e of we(i,t,o))a[e.day].push(e);for(const e of a)e.sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin||t.endMin-e.endMin||e.title.localeCompare(t.title));return a}(l,o,t),c=d.map((t,a)=>({date:new Date(o.getFullYear(),o.getMonth(),o.getDate()+a),items:pt(e,t)})).filter(({date:t})=>!1!==e._config.show_weekends||0!==t.getDay()&&6!==t.getDay()),p=e._creators().length>0,h=function(e,t,o){const a=new Date(o.getFullYear(),o.getMonth(),o.getDate()-1),i=new Intl.DateTimeFormat(Ae(e),{day:"numeric",month:"short"});return`${i.format(t)} – ${i.format(a)}`}(e.hass,o,a);return H`
    <div class="weekhead plnav">
      <div class="weeknav">
        <button class="nav" aria-label=${e._t("prev_days")} @click=${()=>e._planOffset--}>
          ‹
        </button>
        <button class="nav-now" @click=${()=>e._planOffset=0}>
          ${0===e._planOffset?H`${e._t("today")} · ${h}`:h}
        </button>
        <button class="nav" aria-label=${e._t("next_days")} @click=${()=>e._planOffset++}>
          ›
        </button>
      </div>
      ${e._loading?H`<span class="spinner"></span>`:W} ${function(e){return H`<div class="pfilter" role="group" aria-label=${e._t("filter_persons")}>
    ${e._persons.map((t,o)=>{const a=e._isOff(o),i=e._presence(t);return H`<button
        class="pchip ${a?"off":""} ${i?`at-${i.kind}`:""}"
        aria-pressed=${!a}
        style="--c:${Qe(t,o)}"
        @click=${()=>e._togglePerson(o)}
      >
        ${e._avatar(t,o)}${e._presenceLabel(t,o)}
      </button>`})}
  </div>`}(e)}
    </div>
    ${e._loadError?H`<div class="banner">${e._t("load_error")}</div>`:W}
    <div
      class="board planner"
      lang=${i}
      style="--pl-cols:${c.length}"
      @pointerdown=${e._onPlannerDown}
      @pointerup=${e._onPlannerUp}
      @touchstart=${e._onPlannerTouchStart}
      @touchend=${e._onPlannerTouchEnd}
    >
      ${c.map(({date:t,items:o})=>{const a=t.getTime()===Ye(new Date).getTime(),s=e._relativeDay(t);return H`
          <section
            class="plcol ${a?"today":""}"
            aria-label=${t.toLocaleDateString(i)}
          >
            <div
              class="plhead"
              role="button"
              tabindex="0"
              aria-label=${e._t("day")}
              @click=${()=>e._goToDate(t)}
              @keydown=${o=>{"Enter"!==o.key&&" "!==o.key||(o.preventDefault(),e._goToDate(t))}}
            >
              <span class="plwd">${s??r.format(t)}</span>
              <span class="pldate">${t.getDate()}</span>
              <span class="plsub"
                >${s?r.format(t):n.format(t)}${function(e,t){const o=e._forecast[qe(t)];return o?H`<span class="plwx" title=${o.condition}
    ><ha-icon icon="mdi:${je[o.condition]||"weather-cloudy"}"></ha-icon>${o.temp}°</span
  >`:W}(e,t)}</span
              >
            </div>
            <div
              class="plbody ${p?"creatable":""}"
              @click=${o=>{const a=o.target;p&&!e._suppressClick&&(a===o.currentTarget||a.classList.contains("plfree"))&&e._openCreateFor(t)}}
            >
              ${0===o.length?H`<div class="plfree">${e._t("nothing_planned")}</div>`:o.map(({e:t,owners:o})=>function(e,t,o){const a=e._eventColor(t),i=e._isTodo(t),r=function(e,t){const o=t.parts&&t.parts>1?`${t.title} (${t.part}/${t.parts})`:t.title,a="todo"!==t.ref.kind?e._calIcon(t.ref.calendar):void 0,i=a?"":e._autoIcon(t.title);return H`${t.continuesBefore?"« ":""}${i?`${i} `:""}${o}${t.continuesAfter?" »":""}`}(e,t),n=`${e._isPast(t)?"past":""} ${e._isTentative(t)?"tentative":""} ${i?"todo":""}`,s=o=>{e._suppressClick||(o.stopPropagation(),e._openEvent(t))};if(t.allDay&&!i){const i=function(e){const t=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(e).trim());if(!t)return null;const o=3===t[1].length?t[1].split("").map(e=>e+e).join(""):t[1],[a,i,r]=[0,2,4].map(e=>parseInt(o.slice(e,e+2),16)/255),n=e=>e<=.03928?e/12.92:((e+.055)/1.055)**2.4;return.2126*n(a)+.7152*n(i)+.0722*n(r)>.179?"#1b1726":"#ffffff"}(a);return H`<div
      class="plall ${n}"
      style="--c:${a};${i?`color:${i}`:""}"
      role="button"
      tabindex="0"
      @click=${s}
      @keydown=${o=>e._onItemKey(o,t)}
    >
      ${e._calIconEl(t)}<span class="pltitle">${r}</span>${e._isShared(t)&&(0===o.length||o.length>=e._persons.length)?W:ht(e,t,o)}
    </div>`}const l=!t.allDay&&e._isCurrent(t),d=o=>H`<span class="tend">${o}${Ee(e.hass,t.endMin)}</span>`,c=t.allDay?e._t("all_day"):l?H`${e._t("now")}${d("–")}`:t.continuesBefore&&!t.continuesAfter?`${e._t("until")} ${Ee(e.hass,t.endMin)}`:t.endMin>t.startMin&&!t.continuesAfter?H`${Ee(e.hass,t.startMin)}${d("–")}`:Ee(e.hass,t.startMin);return H`<div
    class="plev ${n} ${l?"current":""}"
    style="--c:${a}"
    role="button"
    tabindex="0"
    @click=${s}
    @keydown=${o=>e._onItemKey(o,t)}
  >
    <div class="plmeta"><span class="pltime">${c}</span></div>
    <div class="pltitle ${i?"todo-line":""}">
      ${i?e._renderTodoCheckbox(t):W}${e._calIconEl(t)}<span>${r}</span>
    </div>
    ${e._renderLeave(t)}
    ${t.location&&!i?H`<div class="plloc">
          <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${t.location}</span>
        </div>`:W}
    ${e._isShared(t)||o.length>1?H`<div class="plwho">${ht(e,t,o)}</div>`:W}
    ${l&&e._progressOn?H`<div class="plprog"><span style="width:${e._progressPct(t)}%"></span></div>`:W}
  </div>`}(e,t,o))}
            </div>
          </section>
        `})}
    </div>
  `}function pt(e,t){const o=[],a=new Map;for(const i of t){const t=e._isShared(i)?i.ref.shared_person_idxs??[]:i.personIdx>=0?[i.personIdx]:[];if(e._isTodo(i)){o.push({e:i,owners:t});continue}const r=`${i.title.trim().toLowerCase()}|${i.ref.start.getTime()}|${i.ref.end.getTime()}`,n=a.get(r);if(n){for(const e of t)n.owners.includes(e)||n.owners.push(e);continue}const s={e:i,owners:[...t]};a.set(r,s),o.push(s)}return o}function ht(e,t,o){const a=e._persons.length;return e._isShared(t)&&(0===o.length||o.length>=a)?H`<span class="plowners" title=${e._eventOwnerLabel(t)}
      ><ha-icon class="plgroup" icon="mdi:account-group"></ha-icon
    ></span>`:0===o.length?W:H`<span class="plowners">${o.map(t=>function(e,t){const o=e._persons[t];if(!o)return W;const a=Qe(o,t),i=o.person?e.hass.states[o.person]?.attributes?.entity_picture:void 0,r=e._personName(o,t);return i?H`<span
        class="mini"
        title=${r}
        style="background-image:url('${i}');--c:${a}"
      ></span>`:H`<span class="mini initials" title=${r} style="--c:${a};background:${a}"
        >${r.slice(0,1).toUpperCase()}</span
      >`}(e,t))}</span>`}let ut=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const _t={},gt=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends ut{constructor(){super(...arguments),this.key=W}render(e,t){return this.key=e,t}update(e,[t,o]){return t!==this.key&&(((e,t=_t)=>{e._$AH=t})(e),this.key=t),o}});const ft=n`
  :host {
    font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
    /* grid tokens — theme-aware, calm by default */
    --fb-hourline: var(--divider-color, #8884);
    --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
    --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
    /* customization tokens — override via theme or card-mod */
    --fb-accent: var(--primary-color);
    --fb-now-color: var(--error-color, #ff5252);
    --fb-radius: 7px;
    --fb-radius-sm: 5px;
    --fb-avatar-size: 34px;
    --fb-past-opacity: 0.5;
    --fb-title-size: 16px;
    --fb-name-size: 13px;
    --fb-event-size: 11.5px;
    --fb-time-size: 9.5px;
    --fb-chip-size: 10.5px;
  }
  ha-card {
    overflow: hidden;
    color: var(--primary-text-color);
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color);
  }
  .titlewrap {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  button.back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    color: var(--primary-text-color);
    background: var(--fb-soft, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
  }
  button.back ha-icon {
    --mdc-icon-size: 26px;
  }
  /* wall display header: clock · date · weather · view toggle */
  .clockhead {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px 22px;
    padding: 14px 18px 12px;
    border-bottom: 1px solid var(--divider-color);
  }
  .clock {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ctime {
    font-size: var(--fb-clock-size, 54px);
    font-weight: 300;
    letter-spacing: -2px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cdate {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  .cdate b {
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -0.3px;
  }
  .cdate span {
    font-size: 14px;
    color: var(--secondary-text-color);
  }
  button.cwx {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding: 7px 14px 7px 10px;
    border-radius: 18px;
    background: var(--fb-soft, color-mix(in srgb, var(--primary-text-color) 7%, transparent));
  }
  button.cwx ha-icon {
    --mdc-icon-size: 34px;
    color: var(--fb-weather-icon, #ffd77a);
  }
  .cwxmain {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .cwxtemp {
    font-size: 22px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .cwxsub {
    font-size: 12px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .cspacer {
    flex: 1;
  }
  /* presence: ring around the avatar + where they are */
  button.pchip.at-home .avatar {
    box-shadow: 0 0 0 2px var(--fb-home-color, #5bd68a) !important;
  }
  button.pchip.at-zone .avatar {
    box-shadow: 0 0 0 2px var(--fb-zone-color, #8fd3ff) !important;
  }
  button.pchip.at-away .avatar {
    box-shadow: 0 0 0 2px var(--divider-color) !important;
    opacity: 0.75;
  }
  .pcname {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
  }
  .pcname small {
    font-size: 10.5px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  /* countdown chips */
  .cdowns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  button.cdown {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding: 5px 14px 5px 5px;
    border-radius: 18px;
    background: var(--fb-soft, color-mix(in srgb, var(--primary-text-color) 7%, transparent));
  }
  .cdnum {
    flex: none;
    min-width: 34px;
    height: 34px;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, var(--c) 30%, transparent);
    box-shadow: inset 0 0 0 1.5px var(--c);
  }
  button.cdown.hot .cdnum {
    background: var(--c);
  }
  .cdtxt {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    max-width: 170px;
  }
  .cdtxt b,
  .ntxt b {
    font-size: 13.5px;
    font-weight: 650;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cdtxt small,
  .ntxt small {
    font-size: 11.5px;
    color: var(--secondary-text-color);
  }
  /* notices strip under the header */
  .extras {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px 0;
  }
  .notice {
    --c: var(--fb-notice-color, #7ee2b8);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    border-radius: 16px;
    background: color-mix(in srgb, var(--c) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 55%, transparent);
    animation: fb-fade 0.3s ease-out;
  }
  .notice > ha-icon,
  .notice .nbody ha-icon {
    --mdc-icon-size: 20px;
    color: var(--c);
    margin-left: 6px;
  }
  .notice .nbody {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    padding: 4px 6px 4px 0;
  }
  .ntxt {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.15;
    padding-right: 8px;
  }
  .notice .nbtn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: none;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 7px 14px 7px 10px;
    border-radius: 12px;
    background: var(--c);
    color: #1b1726;
  }
  .notice .nbtn ha-icon {
    --mdc-icon-size: 18px;
  }
  .notice.leave {
    --c: var(--fb-leave-soon, #ffc46b);
  }
  .notice.leave.now {
    --c: var(--fb-leave-now, #ff7a85);
    animation: fb-attn 1.6s ease-in-out infinite;
  }
  @keyframes fb-attn {
    50% {
      background: color-mix(in srgb, var(--c) 34%, transparent);
    }
  }
  .plleave {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--secondary-text-color);
  }
  .plleave ha-icon {
    --mdc-icon-size: 14px;
    flex: none;
  }
  .plleave span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plleave.soon {
    color: var(--fb-leave-soon, #ffc46b);
  }
  .plleave.now {
    color: var(--fb-leave-now, #ff7a85);
  }
  /* person filter chips */
  .pfilter {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-left: auto;
  }
  button.pchip {
    --fb-avatar-size: 24px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 3px 12px 3px 3px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--c) 55%, transparent);
    background: color-mix(in srgb, var(--c) 16%, transparent);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition:
      opacity 0.2s ease,
      background 0.2s ease;
  }
  button.pchip.off {
    opacity: 0.4;
    background: transparent;
    border-color: var(--divider-color);
  }
  button.pchip.off .avatar {
    filter: grayscale(1);
  }
  button.pchip.sel {
    background: color-mix(in srgb, var(--c) 34%, transparent);
    border-color: var(--c);
  }
  .whom {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  /* planner: one column per day, Skylight-style */
  .plnav {
    gap: 10px 14px;
  }
  .board.planner {
    display: grid;
    grid-template-columns: repeat(var(--pl-cols), minmax(var(--fb-planner-min, 136px), 1fr));
    gap: var(--fb-planner-gap, 10px);
    padding: 12px 14px 14px;
    margin-top: 0;
    height: var(--fb-planner-height, 62vh);
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
    scroll-snap-type: x proximity;
    touch-action: pan-x pan-y;
  }
  .plcol {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    border-radius: var(--fb-planner-radius, 20px);
    background: var(--fb-col-bg, color-mix(in srgb, var(--primary-text-color) 4%, transparent));
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    scroll-snap-align: start;
    overflow: hidden;
  }
  .plcol.today {
    background: var(--fb-today-bg, color-mix(in srgb, var(--fb-accent) 10%, transparent));
    border-color: color-mix(in srgb, var(--fb-accent) 45%, transparent);
  }
  .plhead {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 9px 6px 8px;
  }
  .plwd {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plcol.today .plwd {
    color: var(--primary-text-color);
  }
  .pldate {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: -1px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .plcol.today .pldate {
    font-weight: 650;
    font-size: 22px;
    letter-spacing: -0.5px;
    border-radius: 50%;
    background: var(--fb-accent);
    color: var(--fb-accent-text, var(--text-primary-color, #fff));
  }
  .plsub {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .plwx {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--primary-text-color);
  }
  .plwx ha-icon {
    --mdc-icon-size: 15px;
    color: var(--fb-weather-icon, var(--secondary-text-color));
  }
  .plhead {
    cursor: pointer;
    border-radius: 16px;
    -webkit-tap-highlight-color: transparent;
  }
  .plhead:active {
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  ha-card {
    position: relative;
  }
  button.plfab {
    position: absolute;
    right: 22px;
    bottom: 22px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: var(--fb-accent);
    color: var(--fb-accent-text, var(--text-primary-color, #fff));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transition: transform 0.12s ease;
  }
  button.plfab:active {
    transform: scale(0.94);
  }
  button.plfab ha-icon {
    --mdc-icon-size: 28px;
  }
  .plbody {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 2px 8px 12px;
    scrollbar-width: none;
    -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 18px), transparent);
    mask-image: linear-gradient(to bottom, #000 calc(100% - 18px), transparent);
  }
  .plbody::-webkit-scrollbar {
    display: none;
  }
  .plbody.creatable {
    cursor: copy;
  }
  .pchip .avatar.initials ha-icon {
    --mdc-icon-size: 16px;
    color: #1b1726;
  }
  .plfree {
    margin: 10px 0 0;
    padding: 14px 0;
    border-radius: 12px;
    border: 1px dashed color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    text-align: center;
    font-size: 12.5px;
    color: var(--secondary-text-color);
    opacity: 0.7;
  }
  .plall,
  .plev {
    flex: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform 0.12s ease,
      opacity 0.2s ease;
  }
  .plall:active,
  .plev:active {
    transform: scale(0.98);
  }
  .plall {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px 6px 10px;
    border-radius: 12px;
    background: var(--c);
    color: #fff;
    font-size: var(--fb-planner-size, 13.5px);
    font-weight: 650;
    min-height: 30px;
    box-sizing: border-box;
  }
  .plall .pltitle {
    flex: 1;
    min-width: 0;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    hyphens: auto;
    overflow-wrap: break-word;
  }
  .plall ha-icon.cicon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .plev {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 10px 9px 13px;
    border-radius: 14px;
    background: color-mix(in srgb, var(--c) 17%, transparent);
    box-shadow: inset 4px 0 0 var(--c);
    overflow: hidden;
  }
  .plev.current .pltime {
    color: var(--primary-text-color);
  }
  .plev.current {
    background: color-mix(in srgb, var(--c) 30%, transparent);
    box-shadow:
      inset 4px 0 0 var(--c),
      0 0 0 1.5px var(--c),
      0 6px 18px color-mix(in srgb, var(--c) 35%, transparent);
  }
  .plev.tentative {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 70%, transparent);
    border: none;
    outline: 1.5px dashed var(--c);
    outline-offset: -1.5px;
  }
  .plmeta {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 18px;
  }
  .plev {
    container-type: inline-size;
  }
  @container (max-width: 80px) {
    .pltime .tend {
      display: none;
    }
  }
  .pltime {
    overflow: hidden;
    font-size: 12px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    color: color-mix(in srgb, var(--c) 55%, var(--primary-text-color));
    white-space: nowrap;
  }
  .plev .pltitle {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    font-size: var(--fb-planner-size, 14px);
    font-weight: 600;
    line-height: 1.25;
    hyphens: auto;
    overflow-wrap: break-word;
  }
  .plev .pltitle > span {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .plloc {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11.5px;
    color: var(--secondary-text-color);
    min-width: 0;
  }
  .plloc span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plloc ha-icon {
    --mdc-icon-size: 13px;
    flex: none;
  }
  .plprog {
    height: 3px;
    border-radius: 2px;
    margin-top: 3px;
    background: color-mix(in srgb, var(--c) 25%, transparent);
    overflow: hidden;
  }
  .plprog span {
    display: block;
    height: 100%;
    background: var(--c);
  }
  .plwho {
    display: flex;
    justify-content: flex-end;
    margin-top: 1px;
  }
  .plwho .plowners {
    margin-left: 0;
  }
  .board.planner .plcol:last-child .plbody {
    padding-bottom: 76px;
  }
  .plowners {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    padding-left: 6px;
    flex: none;
  }
  .plowners .mini + .mini {
    margin-left: -6px;
  }
  .mini {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    box-shadow:
      0 0 0 1.5px var(--c),
      0 0 0 3px var(--fb-mini-ring, var(--card-background-color, #222));
  }
  .mini.initials {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #1b1726;
  }
  .plgroup {
    --mdc-icon-size: 18px;
    opacity: 0.8;
  }
  .plall .mini {
    box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.8);
  }
  /* one-switch compact density */
  :host([compact]) {
    --fb-title-size: 14px;
    --fb-name-size: 11.5px;
    --fb-event-size: 10.5px;
    --fb-time-size: 9px;
    --fb-chip-size: 9.5px;
    --fb-avatar-size: 26px;
    --fb-event-pad: 2px 5px;
    --fb-head-pad: 5px 4px;
    --fb-axis-width: 44px;
  }
  :host([compact]) .top,
  :host([compact]) .dayhead,
  :host([compact]) .weekhead {
    padding: 6px 10px;
  }
  :host([compact]) .tabs {
    margin: 4px 10px 0;
  }
  :host([compact]) .focus {
    padding: 5px 10px;
  }
  :host([compact]) .fchip {
    padding: 4px 8px;
  }
  /* "now / next" glance bar */
  .focus {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 8px 16px;
    border-bottom: 1px solid var(--divider-color);
    scrollbar-width: thin;
  }
  .fchip {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 1 0;
    min-width: 160px;
    background: var(--secondary-background-color);
    border-radius: 12px;
    padding: 6px 10px;
  }
  .fchip .avatar {
    flex: 0 0 auto;
  }
  .fbody {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.25;
  }
  .fname {
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 600;
  }
  .fnow,
  .fnext,
  .ffree {
    font-size: 12.5px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ffree {
    color: var(--secondary-text-color);
    font-weight: 500;
  }
  .fnow small,
  .fnext small {
    color: var(--secondary-text-color);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .fdot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: 0 0 8px;
    animation: fb-pulse 2s ease-out infinite;
  }
  .title {
    font-weight: 600;
    font-size: var(--fb-title-size);
  }
  .switch,
  .tabs {
    display: inline-flex;
    gap: 2px;
    background: var(--secondary-background-color);
    border-radius: 9px;
    padding: 2px;
  }
  .switch button,
  .tabs button {
    border: none;
    cursor: pointer;
    background: transparent;
    color: var(--secondary-text-color);
    padding: 5px 12px;
    border-radius: 999px;
    font: inherit;
    font-size: 13px;
    transition:
      background 0.12s ease,
      color 0.12s ease;
  }
  .switch button:hover:not(.on),
  .tabs button:hover:not(.on) {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }
  .switch button.on,
  .tabs button.on {
    background: var(--fb-switch-on, var(--primary-color));
    color: var(--fb-switch-on-text, var(--text-primary-color, #fff));
    font-weight: 600;
    box-shadow: 0 1px 4px
      color-mix(in srgb, var(--fb-switch-on, var(--primary-color)) 45%, transparent);
  }
  .tabs button.today:not(.on) {
    box-shadow: inset 0 -2px 0 var(--fb-accent);
  }
  .tabs {
    margin: 8px 16px 0;
    flex-wrap: wrap;
  }
  .dayhead,
  .weekhead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--divider-color);
    flex-wrap: wrap;
  }
  .dayname {
    font-weight: 700;
    font-size: 15.5px;
    display: inline-flex;
    align-items: center;
  }
  .weeknav {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .nav,
  .nav-now {
    border: none;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    border-radius: 7px;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    padding: 5px 10px;
  }
  .nav {
    font-size: 16px;
    line-height: 1;
    padding: 4px 9px;
  }
  .nav-now {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .banner {
    margin: 8px 16px 0;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12.5px;
    color: var(--text-primary-color, #fff);
    background: var(--error-color, #ff5252);
  }
  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 8px;
    vertical-align: middle;
    border: 2px solid var(--divider-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: fb-spin 0.7s linear infinite;
  }
  @keyframes fb-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 2s;
    }
  }
  .empty {
    position: absolute;
    top: 0;
    left: var(--fb-axis-width, 56px);
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    pointer-events: none;
  }
  .board {
    max-height: var(--fb-board-max-height, 58vh);
    overflow: auto;
    margin-top: 8px;
  }
  /* keep header, all-day and body columns pixel-aligned: borders must not
       change box width, or the vertical dividers break between the rows. */
  .axis-spacer,
  .phead,
  .axis,
  .col,
  .todo-cell,
  .todo-axis,
  .allday-cell,
  .allday-label {
    box-sizing: border-box;
  }
  .header-row {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 7;
    background: var(--card-background-color, var(--ha-card-background));
    border-bottom: 1px solid var(--divider-color);
  }
  .axis-spacer {
    width: var(--fb-axis-width, 56px);
    flex: 0 0 var(--fb-axis-width, 56px);
    position: sticky;
    left: 0;
    background: inherit;
  }
  .phead {
    flex: 1 1 0;
    min-width: var(--fb-col-min, 120px);
    padding: var(--fb-head-pad, 10px 6px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border-left: 1px solid var(--divider-color);
    position: relative;
  }
  .allday-row {
    display: flex;
    border-bottom: 1px solid var(--divider-color);
    background: var(--card-background-color, var(--ha-card-background));
    position: sticky;
    top: calc(var(--fb-sticky-header-h, 0px) + var(--fb-sticky-todo-h, 0px));
    z-index: 5;
  }
  .todo-row {
    display: flex;
    border-bottom: 1px solid var(--divider-color);
    background: var(--card-background-color, var(--ha-card-background));
    position: sticky;
    top: var(--fb-sticky-header-h, 0px);
    z-index: 6;
  }
  .todo-axis {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    font-size: 10px;
    font-weight: 700;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .todo-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .todo-shared {
    padding: 4px;
    border-left: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .todo-grid {
    display: flex;
  }
  .todo-cell {
    flex: 1 1 0;
    min-width: var(--fb-col-min, 120px);
    border-left: 1px solid var(--divider-color);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .shared-chip,
  .shared-band {
    border-radius: var(--fb-radius-sm);
    cursor: pointer;
  }
  .shared-chip {
    padding: 3px 8px;
    font-size: var(--fb-chip-size);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .allday-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
  }
  .allday-cell {
    flex: 1 1 0;
    min-width: var(--fb-col-min, 120px);
    border-left: 1px solid var(--divider-color);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .allday-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .allday-shared {
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-left: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .allday-grid {
    display: flex;
  }
  .allday-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .allday-group.separated {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px dashed color-mix(in srgb, var(--divider-color) 80%, transparent);
  }
  .allday-group-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    padding-left: 2px;
  }
  .adchip {
    border-radius: var(--fb-radius-sm);
    padding: 2px 6px;
    font-size: var(--fb-chip-size);
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .adchip.shared {
    font-weight: 700;
  }
  .adchip.todo {
    background: color-mix(in srgb, var(--secondary-background-color) 86%, transparent) !important;
  }
  .adchip.todo.hint {
    opacity: 0.92;
  }
  .adchip.todo.hint .todo-label {
    color: var(--secondary-text-color);
  }
  .todo-line {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .todo-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .todo-check {
    flex: 0 0 auto;
    width: 14px;
    height: 14px;
    margin: 0;
    accent-color: var(--primary-color);
    cursor: pointer;
  }
  .todo-check:disabled {
    cursor: default;
    opacity: 0.6;
  }
  .avatar {
    width: var(--fb-avatar-size);
    height: var(--fb-avatar-size);
    border-radius: 50%;
    background-size: cover;
    background-position: center;
  }
  .avatar.initials {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #11181f;
    font-weight: 700;
    font-size: 13px;
  }
  .pname {
    font-weight: 600;
    font-size: var(--fb-name-size);
  }
  .pstatus {
    font-size: 10.5px;
    color: var(--secondary-text-color);
  }
  .pmeta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .body {
    display: flex;
    position: relative;
  }
  .axis {
    width: var(--fb-axis-width, 56px);
    flex: 0 0 var(--fb-axis-width, 56px);
    position: sticky;
    left: 0;
    background: var(--card-background-color, var(--ha-card-background));
    z-index: 4;
    border-right: 1px solid var(--divider-color);
  }
  .hour {
    position: absolute;
    right: 8px;
    transform: translateY(-50%);
    font-size: 11px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  /* first hour label would be clipped by the header above */
  .hour:first-child {
    transform: none;
    margin-top: 1px;
  }
  .col {
    flex: 1 1 0;
    min-width: var(--fb-col-min, 120px);
    position: relative;
    border-left: 1px solid var(--divider-color);
  }
  .col.creatable {
    cursor: copy;
  }
  .event {
    position: absolute;
    border-radius: var(--fb-radius);
    padding: var(--fb-event-pad, 4px 7px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
    box-sizing: border-box;
    cursor: pointer;
    z-index: 3;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    transition:
      box-shadow 0.12s ease,
      transform 0.12s ease;
  }
  .event:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
    transform: translateY(-1px);
    z-index: 5;
  }
  .event.todo,
  .tlbar.todo,
  .wchip.todo,
  .mchip.todo,
  .agenda-row.todo {
    box-shadow: none;
  }
  /* long "background" events (OGS, Freispiel …): faint full-width band behind
       the normal event blocks so short lessons keep the full column width. */
  .band {
    position: absolute;
    left: 2px;
    right: 2px;
    border-radius: var(--fb-radius);
    padding: 3px 7px;
    overflow: hidden;
    box-sizing: border-box;
    cursor: pointer;
    z-index: 2;
    display: flex;
    justify-content: flex-end; /* keep label clear of left-aligned event blocks */
    align-items: flex-start;
  }
  .band .etitle {
    max-width: 90%;
    font-weight: 600;
    font-size: 10px;
    color: var(--primary-text-color);
    border-radius: 999px;
    padding: 1px 8px;
  }
  .cicon {
    --mdc-icon-size: 13px;
    width: 13px;
    height: 13px;
    vertical-align: -2px;
    margin-right: 3px;
    opacity: 0.85;
  }
  .event.draggable {
    touch-action: none;
    cursor: grab;
  }
  .event.dragging {
    cursor: grabbing;
    z-index: 20;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
    opacity: 0.94;
    transition: none;
  }
  /* resize grabber at the bottom edge */
  .rz {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 9px;
    cursor: ns-resize;
    touch-action: none;
  }
  .rz::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 2px;
    width: 20px;
    height: 3px;
    transform: translateX(-50%);
    border-radius: 2px;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.12s ease;
  }
  .event.draggable:hover .rz::after {
    opacity: 0.4;
  }
  .event.tentative {
    opacity: 0.72;
    border-style: dashed;
    background-image: repeating-linear-gradient(
      135deg,
      transparent 0 6px,
      rgba(255, 255, 255, 0.06) 6px 12px
    );
  }
  .event.overflow {
    background: var(--secondary-background-color);
    border: 1px dashed var(--divider-color);
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    z-index: 7;
  }
  .event.overflow .etitle {
    font-weight: 700;
  }
  .shared-band {
    position: absolute;
    left: calc(var(--fb-axis-width, 56px) + 2px);
    right: 2px;
    z-index: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 8px;
    overflow: hidden;
    box-sizing: border-box;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 35%, transparent);
  }
  .shared-tag {
    flex: 0 0 auto;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--secondary-text-color);
    background: color-mix(in srgb, var(--card-background-color, #fff) 88%, transparent);
    border-radius: 999px;
    padding: 1px 7px;
  }
  /* very short events (breaks etc.): thin single-line strip drawn on top so
       neighbours' min-height can't cover them */
  .event.slim {
    z-index: 4;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 0 5px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .event.slim .etitle {
    font-size: calc(var(--fb-event-size) - 1.5px);
    font-weight: 600;
  }
  .event.slim .etime,
  .event.slim .eprog {
    display: none;
  }
  .phead {
    cursor: pointer;
  }
  .phead.off,
  .col.off,
  .todo-cell.off,
  .allday-cell.off {
    flex: 0 0 48px;
    min-width: 48px;
  }
  .phead.off .avatar,
  .wphead.off .avatar,
  .tlrow.off .avatar {
    opacity: 0.35;
    filter: grayscale(0.8);
  }
  .wphead {
    cursor: pointer;
  }
  .wphead.off span {
    opacity: 0.4;
  }
  .tlperson {
    cursor: pointer;
  }
  .tlrow.off .pname,
  .tlrow.off .pstatus,
  .tlrow.off .ptodos {
    opacity: 0.4;
  }
  .pbadges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
    margin-top: 2px;
  }
  .wphead .pbadges,
  .tlperson .pbadges {
    justify-content: flex-start;
  }
  .ptodos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
    margin-top: 1px;
  }
  .ptodos.compact {
    justify-content: flex-start;
  }
  .ptodo {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    font-size: 10px;
    font-weight: 600;
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--secondary-background-color) 82%, transparent);
    border-radius: 999px;
    padding: 1px 7px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ptodo-check,
  .ptodo-label {
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  .ptodo-check {
    flex: 0 0 auto;
    width: 14px;
    text-align: center;
    color: var(--secondary-text-color);
    margin-right: 5px;
  }
  .ptodo-check:disabled {
    cursor: default;
    opacity: 0.6;
  }
  .ptodo-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  .ptodo.more {
    color: var(--secondary-text-color);
    cursor: default;
  }
  .pbadge {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 10px;
    font-weight: 600;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color);
    border-radius: 999px;
    padding: 1px 7px;
    cursor: pointer;
    white-space: nowrap;
  }
  .pbadge ha-icon {
    --mdc-icon-size: 12px;
    width: 12px;
    height: 12px;
    display: inline-flex;
    align-items: center;
  }
  .todo-badge {
    color: var(--primary-color);
  }
  @media (pointer: coarse) {
    .switch button,
    .tabs button {
      padding: 8px 14px;
    }
  }
  /* phones: tighter columns, smaller chrome, everything still scrollable */
  @media (max-width: 600px) {
    :host {
      --fb-col-min: 96px;
      --fb-avatar-size: 28px;
      --fb-axis-width: 42px;
      --fb-title-size: 14px;
      --fb-name-size: 11.5px;
      --fb-event-size: 10.5px;
      --fb-chip-size: 10px;
    }
    .top {
      flex-wrap: wrap;
      gap: 6px;
    }
    .phead {
      padding: 6px 4px;
      gap: 2px;
    }
    .hour {
      font-size: 9.5px;
      right: 4px;
    }
    .weeknav {
      gap: 4px;
    }
    .band .etitle {
      font-size: 9px;
      padding: 1px 6px;
    }
    .pbadge {
      font-size: 9px;
      padding: 1px 5px;
    }
  }
  .wchip,
  .adchip,
  .mchip {
    transition: box-shadow 0.12s ease;
  }
  .wchip:hover,
  .adchip:hover,
  .mchip:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }
  .agenda-row {
    transition: background 0.12s ease;
  }
  .agenda-row:hover {
    background: var(--secondary-background-color);
  }
  .wchip.tentative,
  .mchip.tentative,
  .adchip.tentative {
    opacity: 0.72;
    border-style: dashed;
  }
  .agenda-row.tentative .agenda-bar {
    opacity: 0.55;
  }
  .agenda-row.tentative .agenda-title {
    font-style: italic;
  }
  .etitle {
    font-size: var(--fb-event-size);
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .etime {
    font-size: var(--fb-time-size);
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .nowline {
    position: absolute;
    left: var(--fb-axis-width, 56px);
    right: 0;
    border-top: 2px solid var(--fb-now-color);
    z-index: 7;
    pointer-events: none;
  }
  .nowline::after {
    content: "";
    position: absolute;
    left: -3px;
    top: -5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--fb-now-color);
    animation: fb-pulse 2s ease-out infinite;
  }
  @keyframes fb-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--fb-now-color) 40%, transparent);
    }
    50% {
      box-shadow: 0 0 0 7px transparent;
    }
  }
  @keyframes fb-fade {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .board,
  .weekwrap,
  .agenda,
  .monthgrid {
    animation: fb-fade 0.18s ease;
  }
  .board::-webkit-scrollbar,
  .weekwrap::-webkit-scrollbar,
  .agenda::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .board::-webkit-scrollbar-thumb,
  .weekwrap::-webkit-scrollbar-thumb,
  .agenda::-webkit-scrollbar-thumb {
    background: var(--divider-color);
    border-radius: 8px;
  }
  @media (prefers-reduced-motion: reduce) {
    .board,
    .weekwrap,
    .agenda,
    .monthgrid,
    .nowline::after,
    .event {
      animation: none !important;
      transition: none !important;
    }
  }
  .nowline span {
    position: absolute;
    left: -50px;
    top: -8px;
    font-size: 10px;
    font-weight: 600;
    color: var(--text-primary-color, #fff);
    background: var(--fb-now-color);
    padding: 1px 5px;
    border-radius: 5px;
    font-variant-numeric: tabular-nums;
  }
  /* timeline (horizontal) */
  .tlwrap {
    overflow: auto;
    max-height: var(--fb-board-max-height, 58vh);
    margin-top: 8px;
    animation: fb-fade 0.18s ease;
  }
  .tlgrid {
    position: relative;
  }
  .tlhead {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 5;
    background: var(--card-background-color, var(--ha-card-background));
    border-bottom: 1px solid var(--divider-color);
    height: 26px;
  }
  .tlcorner {
    width: var(--fb-tl-label, 150px);
    flex: 0 0 var(--fb-tl-label, 150px);
    position: sticky;
    left: 0;
    background: inherit;
    z-index: 2;
  }
  .tlhours {
    position: relative;
  }
  .tlhour {
    position: absolute;
    top: 5px;
    transform: translateX(-50%);
    font-size: 10.5px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .tlrow {
    display: flex;
    border-bottom: 1px solid var(--divider-color);
  }
  .tlperson {
    width: var(--fb-tl-label, 150px);
    flex: 0 0 var(--fb-tl-label, 150px);
    position: sticky;
    left: 0;
    z-index: 4;
    background: var(--card-background-color, var(--ha-card-background));
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    box-sizing: border-box;
    border-right: 1px solid var(--divider-color);
  }
  .tlperson .pname {
    font-size: 12.5px;
  }
  .tlcanvas {
    position: relative;
    flex: 0 0 auto;
  }
  .tlcanvas.creatable {
    cursor: copy;
  }
  .tlbar {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 7px;
    border-radius: var(--fb-radius);
    overflow: hidden;
    box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    transition:
      box-shadow 0.12s ease,
      transform 0.12s ease;
  }
  .tlbar:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
    transform: translateY(-1px);
    z-index: 3;
  }
  .tlbar.tentative {
    opacity: 0.72;
    border-style: dashed;
  }
  .tlbar.shared {
    z-index: 2;
  }
  .tlbar .etime {
    flex: 0 0 auto;
  }
  .tlnow {
    position: absolute;
    top: 0;
    bottom: 0;
    border-left: 2px solid var(--fb-now-color);
    z-index: 6;
    pointer-events: none;
  }
  .tlnow span {
    position: absolute;
    top: 2px;
    left: -1px;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 600;
    color: var(--text-primary-color, #fff);
    background: var(--fb-now-color);
    padding: 1px 5px;
    border-radius: 5px;
    font-variant-numeric: tabular-nums;
  }
  /* agenda */
  .agenda {
    max-height: 60vh;
    overflow: auto;
    padding: 4px 0 8px;
  }
  .agenda-empty {
    padding: 28px 16px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
  }
  .agenda-day {
    padding: 0 12px;
  }
  .agenda-date {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--card-background-color, var(--ha-card-background));
    font-weight: 600;
    font-size: 13px;
    padding: 8px 4px 4px;
    border-bottom: 1px solid var(--divider-color);
  }
  .agenda-date.today {
    color: var(--primary-color);
  }
  .agenda-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 4px;
    cursor: pointer;
    border-bottom: 1px solid var(--divider-color);
  }
  .agenda-row:hover {
    background: var(--secondary-background-color);
  }
  .agenda-row.shared {
    background: color-mix(in srgb, var(--fb-accent) 4%, transparent);
  }
  .agenda-time {
    flex: 0 0 92px;
    font-size: 12px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .agenda-bar {
    flex: 0 0 4px;
    align-self: stretch;
    border-radius: 2px;
  }
  .agenda-main {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .agenda-title {
    font-size: 13.5px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .agenda-meta {
    font-size: 11px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* month */
  .monthwrap {
    overflow: auto;
    max-height: 62vh;
    padding: 0 8px 8px;
  }
  .monthhead {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--card-background-color, var(--ha-card-background));
  }
  .mhcell {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--secondary-text-color);
    padding: 6px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .monthgrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(64px, 1fr);
  }
  .mcell {
    border-right: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    padding: 3px;
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
  }
  .mcell:nth-child(7n) {
    border-right: none;
  }
  .mcell.out {
    background: color-mix(in srgb, var(--secondary-text-color, #888) 4%, transparent);
  }
  .mcell.out .mdate {
    opacity: 0.45;
  }
  .mcell:hover {
    background: var(--secondary-background-color);
  }
  .mcell.today {
    background: color-mix(in srgb, var(--fb-accent) 7%, transparent);
    box-shadow: inset 0 0 0 1.5px var(--fb-accent);
  }
  .mcell.wkend:not(.today) {
    background: color-mix(in srgb, var(--secondary-text-color, #888) 3.5%, transparent);
  }
  .mdate {
    font-size: 12px;
    font-weight: 600;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-variant-numeric: tabular-nums;
  }
  .mdate.today {
    background: var(--fb-accent);
    color: var(--fb-accent-text, var(--text-primary-color, #fff));
    border-radius: 50%;
  }
  .mchips {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
  }
  .mchip {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 4px;
    border-radius: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mchip.shared {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fb-accent) 25%, transparent);
  }
  .mmore {
    font-size: 9.5px;
    color: var(--secondary-text-color);
    padding-left: 4px;
  }
  /* weather chip */
  .wx {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    font-weight: 600;
    color: var(--secondary-text-color);
    vertical-align: middle;
    font-variant-numeric: tabular-nums;
    background: var(--secondary-background-color);
    border-radius: 999px;
    padding: 2px 9px 2px 5px;
    margin-left: 6px;
  }
  .wx ha-icon {
    --mdc-icon-size: 18px;
    color: var(--primary-text-color);
  }
  .agenda-date .wx {
    margin-left: 4px;
  }
  /* faded past events + map link */
  .past {
    opacity: var(--fb-past-opacity);
  }
  /* progress bar inside a running day event */
  .eprog {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: var(--divider-color);
  }
  .eprog > div {
    height: 100%;
    background: var(--fb-now-color);
  }
  /* agenda: countdown + running progress */
  .agenda-cd {
    flex: 0 0 auto;
    font-size: 11px;
    font-weight: 600;
    color: var(--primary-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .agenda-row.current {
    background: color-mix(in srgb, var(--fb-accent) 6%, transparent);
  }
  .agenda-prog {
    display: block;
    height: 3px;
    margin-top: 4px;
    border-radius: 2px;
    background: var(--divider-color);
    overflow: hidden;
  }
  .agenda-prog > span {
    display: block;
    height: 100%;
  }
  .maplink {
    margin-left: 8px;
    font-size: 11px;
    color: var(--primary-color);
    text-decoration: none;
  }
  .maplink:hover {
    text-decoration: underline;
  }
  /* week */
  .weekwrap {
    overflow: auto;
    max-height: 60vh;
  }
  .weekgrid {
    display: grid;
  }
  .corner {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 6;
    background: var(--card-background-color, var(--ha-card-background));
    border-bottom: 1px solid var(--divider-color);
  }
  .wphead {
    position: sticky;
    top: 0;
    z-index: 5;
    background: var(--card-background-color, var(--ha-card-background));
    border-bottom: 1px solid var(--divider-color);
    border-left: 1px solid var(--divider-color);
    padding: 8px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
  }
  .wphead .pmeta {
    align-items: center;
  }
  .wphead .avatar {
    width: 28px;
    height: 28px;
  }
  .wday {
    position: sticky;
    left: 0;
    z-index: 4;
    background: var(--card-background-color, var(--ha-card-background));
    border-right: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 12.5px;
  }
  .wcell {
    min-height: 70px;
    border-left: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .wcell.creatable {
    cursor: copy;
  }
  .wshared,
  .wspacer {
    border-left: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    background: color-mix(in srgb, var(--fb-accent) 4%, transparent);
  }
  .wshared {
    grid-column: 2 / -1;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .wspacer {
    position: sticky;
    left: 0;
    z-index: 3;
    background: var(--card-background-color, var(--ha-card-background));
    border-right: 1px solid var(--divider-color);
  }
  .wshared.today,
  .wspacer.today {
    background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
  }
  .wday.today,
  .wcell.today {
    background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
  }
  .wchip {
    border-radius: var(--fb-radius-sm);
    padding: 3px 5px;
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    cursor: pointer;
  }
  .wchip span {
    font-size: var(--fb-chip-size);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wchip small {
    margin-left: auto;
    font-size: 8.5px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .wshared-chip {
    border-radius: var(--fb-radius-sm);
    padding: 3px 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;
    cursor: pointer;
  }
  .wshared-chip span {
    font-size: var(--fb-chip-size);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wshared-chip small {
    margin-left: auto;
    font-size: 8.5px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  /* focus visibility for a11y */
  button:focus-visible,
  .event:focus-visible,
  .wchip:focus-visible,
  .adchip:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
  /* dialog */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    padding: 16px;
  }
  .dialog {
    background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color);
    border-radius: 14px;
    padding: 16px;
    width: 100%;
    max-width: 420px;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
  }
  .todo-badge-dialog {
    max-width: 360px;
    padding: 14px;
  }
  .dlg-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 16px;
  }
  .todo-badge-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  .todo-badge-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    padding: 10px 12px;
    background: var(--secondary-background-color);
    cursor: pointer;
    text-align: left;
  }
  .todo-badge-item:hover {
    border-color: color-mix(in srgb, var(--primary-color) 45%, var(--divider-color));
  }
  .todo-badge-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .todo-badge-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .todo-badge-meta {
    font-size: 11px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dlg-cal {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin: 2px 0 10px;
  }
  .icon {
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    font-size: 16px;
  }
  .fld {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 10px;
  }
  .fld > span {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .row {
    display: flex;
    gap: 10px;
  }
  .row .fld {
    flex: 1;
    min-width: 0; /* datetime inputs have a wide intrinsic size; let them shrink */
  }
  input,
  textarea,
  select {
    font: inherit;
    font-size: 14px;
    color: var(--primary-text-color);
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 8px 10px;
    box-sizing: border-box;
    width: 100%;
  }
  input:disabled,
  textarea:disabled {
    opacity: 0.7;
  }
  .recur {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    margin-bottom: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--secondary-background-color);
  }
  .recur-label {
    font-size: 12px;
    color: var(--secondary-text-color);
    width: 100%;
  }
  .recur-opt {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  .recur-opt input {
    width: auto;
  }
  .chk {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 13px;
  }
  .chk input {
    width: auto;
  }
  .ro-note {
    font-size: 12px;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 10px;
  }
  .dlg-error {
    font-size: 12.5px;
    color: var(--error-color, #ff5252);
    margin-bottom: 10px;
  }
  .dlg-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .dlg-actions .spacer {
    flex: 1;
  }
  .dlg-actions button {
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
  }
  .primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .ghost {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }
  .danger {
    background: var(--error-color, #ff5252);
    color: #fff;
  }
  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;class mt extends se{constructor(){super(...arguments),this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._weekOffset=0,this._monthOffset=0,this._planOffset=0,this._loadError=!1,this._loading=!1,this._todoBusy=[],this._todoItemsByOwner={},this._fitPx=0,this._hiddenP=[],this._dragStartY=0,this._dragPx=1,this._dragGrid=30,this._suppressClick=!1,this._raw=[],this._fetchedKey="",this._forecast={},this._weatherKey="",this._countdowns=[],this._countdownKey="",this._travel=new Map,this._travelRev=0,this._travelBusy=!1,this._noticeDone={},this._scrolledKey="",this._onVisible=()=>{"hidden"!==document.visibilityState&&this.hass&&this._config&&this._refetch()},this._onKeyDown=e=>{"Escape"===e.key&&(this._dialog||this._todoDialog||this._todoBadgeDialog)&&(e.stopPropagation(),this._dialog?this._closeDialog():this._todoDialog?this._closeTodoDialog():this._closeTodoBadgeDialog())},this._prevWeek=()=>{this._weekOffset-=1},this._nextWeek=()=>{this._weekOffset+=1},this._thisWeek=()=>{this._weekOffset=0,this._day=this._todayIndex()},this._prevMonth=()=>{this._monthOffset-=1},this._nextMonth=()=>{this._monthOffset+=1},this._thisMonth=()=>{this._monthOffset=0},this._navigateBack=()=>{const e=this._config.back_path;e&&(history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1},composed:!0})))},this._swipeX=0,this._swipeY=0,this._onPlannerTouchStart={handleEvent:e=>{this._swipeX=e.touches[0]?.clientX??0,this._swipeY=e.touches[0]?.clientY??0},passive:!0},this._onPlannerTouchEnd=e=>{const t=e.changedTouches[0];t&&this._plannerSwipe(t.clientX,t.clientY,e.currentTarget)},this._onPlannerDown=e=>{"touch"!==e.pointerType&&(this._swipeX=e.clientX,this._swipeY=e.clientY)},this._onPlannerUp=e=>{"touch"!==e.pointerType&&this._plannerSwipe(e.clientX,e.clientY,e.currentTarget)},this._onDragMove=e=>{if(!this._drag)return;e.preventDefault();const t=e.clientY-this._dragStartY,o=this._drag.moved||Math.abs(t)>4;this._drag={...this._drag,deltaMin:t/this._dragPx,moved:o}},this._onDragUp=()=>{window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp);const e=this._drag;e&&(e.moved?(this._suppressClick=!0,this._commitDrag(e)):this._drag=void 0)}}static async getConfigElement(){return await Promise.resolve().then(function(){return Tt}),document.createElement("ha-family-board-card-editor")}static getStubConfig(e){const t=e?tt(e):[];return{type:"custom:family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:t.length?t:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(e){if(!e.persons||!Array.isArray(e.persons))throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");this._config=e;const t=this._enabledViews,o=e.view??"day";this._view=t.includes(o)?o:t[0],this._day=this._todayIndex(),this._hiddenP=e.persons.map((e,t)=>e.hidden?t:-1).filter(e=>e>=0);const a=Number(e.col_min_width);Number.isFinite(a)&&a>=60?this.style.setProperty("--fb-col-min",`${Math.min(a,400)}px`):this.style.removeProperty("--fb-col-min"),this.toggleAttribute("compact",!0===e.compact);const i=Number(e.event_size);Number.isFinite(i)&&i>=8&&i<=20?(this.style.setProperty("--fb-event-size",`${i}px`),this.style.setProperty("--fb-chip-size",`${Math.max(i-1,8)}px`)):(this.style.removeProperty("--fb-event-size"),this.style.removeProperty("--fb-chip-size"));const r=Number(e.radius);Number.isFinite(r)&&r>=0&&r<=20?(this.style.setProperty("--fb-radius",`${r}px`),this.style.setProperty("--fb-radius-sm",`${Math.max(r-2,2)}px`)):(this.style.removeProperty("--fb-radius"),this.style.removeProperty("--fb-radius-sm"));const n=Number(e.past_opacity);Number.isFinite(n)&&n>=10&&n<=100?this.style.setProperty("--fb-past-opacity",""+n/100):this.style.removeProperty("--fb-past-opacity"),this.isConnected&&this._startTimer()}get _enabledViews(){const e=this._config?.views,t=Array.isArray(e)?e.filter((t,o)=>Re.includes(t)&&e.indexOf(t)===o):[];return t.length?t:[...Re]}get _firstDayJs(){return"sunday"===this._config?.first_day?0:1}_todayIndex(){return((new Date).getDay()-this._firstDayJs+7)%7}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("focus",this._onVisible),this._startTimer(),function(){if(Je)return;Je=!0;const e={capture:!0,passive:!0};window.addEventListener("pointerdown",Xe,e),window.addEventListener("keydown",Xe,e),window.addEventListener("location-changed",Xe,e),window.addEventListener("popstate",Xe,e)}(),this._scheduleTick(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measureFit())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("focus",this._onVisible),this._stopTimer(),this._tick&&(clearTimeout(this._tick),this._tick=void 0),this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)}_scheduleTick(){this._tick&&clearTimeout(this._tick);const e=new Date,t=6e4-(1e3*e.getSeconds()+e.getMilliseconds())+50;this._tick=window.setTimeout(()=>{this._kioskReturn(),this.requestUpdate(),this._updateTravel(),this._scheduleTick()},t)}get _progressOn(){return!1!==this._config?.show_progress}_isCurrent(e){const t=Date.now();return e.ref.start.getTime()<=t&&t<e.ref.end.getTime()}_progressPct(e){const t=e.ref.start.getTime(),o=e.ref.end.getTime();return o<=t?0:Math.min(100,Math.max(0,(Date.now()-t)/(o-t)*100))}_kioskReturn(){this._kioskBack();const e=Number(this._config?.auto_return??0);if(!Number.isFinite(e)||e<=0)return;if(Date.now()-Ze<6e4*e)return;if(this._dialog||this._todoDialog||this._todoBadgeDialog)return;const t=this._config.view??"day",o=this._enabledViews.includes(t)?t:this._enabledViews[0];this._view!==o&&(this._view=o),0!==this._weekOffset&&(this._weekOffset=0),0!==this._monthOffset&&(this._monthOffset=0),0!==this._planOffset&&(this._planOffset=0),this._hiddenP.length&&(this._hiddenP=[]),this._day=this._todayIndex()}_kioskBack(){const e=Number(this._config?.auto_back??0),t=this._config?.back_path;if(!t||!Number.isFinite(e)||e<=0)return;if(Date.now()-Ze<6e4*e)return;if(this._dialog||this._todoDialog||this._todoBadgeDialog)return;if("hidden"===document.visibilityState||!this.isConnected)return;this.preview||this.editMode||location.search.includes("edit=1")||location.pathname!==t.split("?")[0]&&(Xe(),this._navigateBack())}_startTimer(){this._stopTimer();const e=this._config?.refresh_interval??300;e>0&&(this._timer=window.setInterval(()=>this._refetch(),1e3*e))}_stopTimer(){this._timer&&(clearInterval(this._timer),this._timer=void 0)}updated(e){const t=["_view","_weekOffset","_monthOffset","_planOffset"].some(t=>e.has(t));if((e.has("hass")||e.has("_config")||t)&&this.hass&&this._config&&(this._maybeFetch(),this._maybeFetchWeather(),this._maybeFetchCountdowns()),e.has("_todoItemsByOwner")&&this._todoBadgeDialog){0===this._todoItemsForPerson(this._todoBadgeDialog.personIdx).length&&(this._todoBadgeDialog=void 0)}if(e.has("_dialog")||e.has("_todoDialog")||e.has("_todoBadgeDialog")){const t=Boolean(e.get("_dialog"))||Boolean(e.get("_todoDialog"))||Boolean(e.get("_todoBadgeDialog"));this._manageOverlayFocus(t)}this._measureFit(),this._maybeScrollToNow()}_syncStickyRows(){const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),o=e.querySelector(".todo-row"),a=t?.offsetHeight??0,i=o?.offsetHeight??0;e.style.setProperty("--fb-sticky-header-h",`${a}px`),e.style.setProperty("--fb-sticky-todo-h",`${i}px`)}_measureFit(){if(this._applyFullHeight(),this._syncStickyRows(),!this._config?.fit_height||"day"!==this._view)return void(0!==this._fitPx&&(this._fitPx=0));const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),o=e.querySelector(".todo-row"),a=e.querySelector(".allday-row"),i=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],r=this._dayWindow(i),n=r.endMin-r.startMin;if(n<=0)return;const s=(t?.offsetHeight??0)+(o?.offsetHeight??0)+(a?.offsetHeight??0),l=e.clientHeight-s-2;if(l<=0)return;const d=Math.min(96,Math.max(40,this._config.hour_height??64))/60,c=Math.max(40/60,Math.min(d,l/n));Math.abs(c-this._fitPx)>.02&&(this._fitPx=c)}_applyFullHeight(){const e=this.renderRoot?.querySelector(".board");if(!e)return;if(!this._config?.full_height)return void(e.style.height&&(e.style.height="",e.style.maxHeight=""));const t=e.getBoundingClientRect().top+window.scrollY,o=`${Math.max(200,Math.round(window.innerHeight-t-16))}px`;e.style.height!==o&&(e.style.height=o,e.style.maxHeight=o)}_maybeScrollToNow(){if("day"!==this._view||!1===this._config?.scroll_to_now)return;const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if(!this._isRealToday(e))return;const t=`${this._weekOffset}|${this._day}|${this._config?.hour_height}`;if(t===this._scrolledKey)return;const o=this.renderRoot?.querySelector(".board"),a=this.renderRoot?.querySelector(".nowline");o&&a&&(this._scrolledKey=t,requestAnimationFrame(()=>{const e=a.offsetTop-o.clientHeight/3;o.scrollTo({top:Math.max(0,e),behavior:"smooth"})}))}_manageOverlayFocus(e){const t=!!this._dialog||!!this._todoDialog||!!this._todoBadgeDialog;t&&!e?(this._restoreFocus=this.renderRoot?.activeElement,requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector(".dialog input");e?.focus()})):!t&&e&&(this._restoreFocus?.focus?.(),this._restoreFocus=void 0)}_weekBounds(){const e=new Date,t=new Date(e);t.setHours(0,0,0,0),t.setDate(e.getDate()-(e.getDay()-this._firstDayJs+7)%7+7*this._weekOffset);const o=new Date(t);return o.setDate(t.getDate()+7),{monday:t,nextMonday:o}}_monthGrid(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth()+this._monthOffset,1),o=(t.getDay()-this._firstDayJs+7)%7,a=Ye(new Date(t.getFullYear(),t.getMonth(),1-o)),i=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return{gridStart:a,weeks:Math.ceil((o+i)/7),month:t.getMonth(),year:t.getFullYear()}}_fetchRange(){if("planner"===this._view)return this._plannerWindow();if("month"===this._view){const{gridStart:e,weeks:t}=this._monthGrid();return{start:e,end:new Date(e.getTime()+7*t*xe)}}const{monday:e,nextMonday:t}=this._weekBounds();return{start:e,end:t}}async _maybeFetch(){const e=this._config.persons.map(e=>this._calsOf(e).join("+")).join(","),t=this._sharedCalendarGroups().map(e=>`${e.ids.join("+")}@${e.personIdxs.join(".")}:${e.label??""}`).join(","),o=this._sharedTodoGroups().map(e=>`${e.ids.join("+")}@${e.personIdxs.join(".")}:${e.label??""}`).join(","),a=[...this._config.persons.map(e=>this._todosOf(e).join("+")),...this._sharedTodoGroups().map(e=>e.ids.join("+"))].join(","),i=Array.from(new Set([...this._config.persons.flatMap(e=>this._todosOf(e)),...this._sharedTodoIds()])).map(e=>{const t=this.hass.states[e];return`${e}:${t?.state??""}:${t?.last_updated??""}`}).join(","),r=`${"month"===this._view?`m${this._monthOffset}`:"planner"===this._view?`p${this._planOffset}:${this._plannerDays}:${qe(new Date)}`:`w${this._weekOffset}`}|${e}|${t}|${o}|${a}|${i}`;r!==this._fetchedKey&&(this._fetchedKey=r,await this._fetchEvents())}async _refetch(){this._fetchedKey="",await this._maybeFetch()}async _maybeFetchWeather(){const e=this._config.weather_entity;if(!e||!1===this._config.show_weather||!this.hass.states[e])return Object.keys(this._forecast).length&&(this._forecast={}),void(this._weatherKey="");const t=`${e}|${(new Date).toISOString().slice(0,10)}`;if(t!==this._weatherKey){this._weatherKey=t;try{const t=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"daily"},target:{entity_id:e},return_response:!0}),o=t?.response?.[e]?.forecast??[],a={};for(const e of o)e?.datetime&&(a[qe(new Date(e.datetime))]={temp:Math.round(e.temperature),low:Number.isFinite(Number(e.templow))?Math.round(Number(e.templow)):void 0,condition:e.condition});this._forecast=a}catch(e){this._forecast={}}}}_weatherChip(e){const t=this._forecast[qe(e)];if(!t)return W;const o=je[t.condition]||"weather-cloudy",a=this.hass.config?.unit_system?.temperature??"°";return H`<span class="wx" title=${t.condition}>
      <ha-icon icon="mdi:${o}"></ha-icon>${t.temp}${a}
    </span>`}_hidden(e){const t=this._config.hide_patterns;if(!Array.isArray(t)||0===t.length)return!1;const o=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&o.includes(t)})}_allowed(e){const t=this._config.show_patterns;if(!Array.isArray(t)||0===t.length)return!0;const o=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&o.includes(t)})}_cleanTitle(e){const t=this._config.replace_patterns;if(!Array.isArray(t)||0===t.length)return e;let o=e;for(const e of t){const t=String(e),a=t.indexOf("=>"),i=(a>=0?t.slice(0,a):t).trim(),r=a>=0?t.slice(a+2).trim():"";0!==i.length&&(o=o.split(i).join(r))}return o.replace(/\s{2,}/g," ").trim()||e}_matchesTentative(e){const t=this._config.tentative_patterns;if(!Array.isArray(t)||0===t.length)return!1;const o=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&o.includes(t)})}async _fetchEvents(){const{start:e,end:t}=this._fetchRange(),o=e.toISOString(),a=t.toISOString(),i=[],r={};let n=!1;this._loading=!0;const s=async(e,t,r,s=!1,l)=>{try{const n=await this.hass.callApi("GET",`calendars/${e}?start=${encodeURIComponent(o)}&end=${encodeURIComponent(a)}`);for(const o of n){const a=ye(o,t,e,r,s);if(a){const t=this._calMeta(e).title_field;if(t){const e=o[t];"string"==typeof e&&e.trim()&&(a.summary=e.trim())}s&&l&&(a.shared_person_idxs=l.personIdxs,a.shared_label=l.label||(1===l.ids.length?this._calLabel(l.ids[0]):void 0))}a&&!this._hidden(a.summary)&&this._allowed(a.summary)&&(this._matchesTentative(a.summary)&&(a.tentative=!0),a.summary=this._cleanTitle(a.summary),i.push(a))}}catch(e){n=!0}},l=this._sharedCalendarGroups(),d=Array.from(new Set(l.flatMap(e=>e.ids)));await Promise.all([...this._config.persons.flatMap((e,t)=>{const o=Qe(e,t);return this._calsOf(e).filter(e=>this.hass.states[e]&&!d.includes(e)).map(e=>s(e,t,o))}),...l.flatMap(e=>e.ids.filter(e=>this.hass.states[e]).map(t=>s(t,He,this._calMeta(t).color??et(t),!0,e)))]);const c=this._sharedTodoGroups(),p=Array.from(new Set(c.flatMap(e=>e.ids))),h=Array.from(new Set([...this._config.persons.flatMap(e=>this._todosOf(e)),...p]));if(h.length>0)try{const o=await this.hass.callWS({type:"execute_script",sequence:[{action:"todo.get_items",target:{entity_id:h},data:{status:["needs_action"]},response_variable:"fb_todos"},{stop:"",response_variable:"fb_todos"}]}),a=o.response??o,n=this._todoAnchorDates(e,t),s=(e,t,o)=>{const a=r[e]??[];t.forEach(e=>a.push({...e,entityId:o,listLabel:this._todoLabel(o)})),r[e]=a},l=(o,a,r,s,l=!1,d)=>{o.forEach(o=>{(("string"==typeof o.due?o.due.trim():"")?[n[0]]:n).forEach(n=>{const c=this._todoToRawEvent(o,a,r,s,n,e,t,l);c&&(l&&d&&(c.shared_person_idxs=d.personIdxs,c.shared_label=d.label||(1===d.ids.length?this._todoLabel(d.ids[0]):void 0)),i.push(c))})})};this._config.persons.forEach((e,t)=>{const o=Qe(e,t);this._todosOf(e).filter(e=>!p.includes(e)).forEach(e=>{const i=a?.[e]?.items;Array.isArray(i)&&(s(this._todoOwnerKey(t),i,e),l(i,t,o,e))})}),c.forEach(e=>{e.ids.forEach(t=>{const o=a?.[t]?.items;Array.isArray(o)&&(e.personIdxs.forEach(e=>s(this._todoOwnerKey(e),o,t)),l(o,He,et(t),t,!0,e))})})}catch(e){}let u=i;if(this._config.filter_duplicates){const e=new Set;u=i.filter(t=>{const o=`${t.kind??"calendar"}|${t.personIdx}|${t.calendar}|${t.uid??t.todo_item??t.summary}|${t.start.getTime()}|${t.end.getTime()}`;return!e.has(o)&&(e.add(o),!0)})}this._raw=u,this._updateTravel();const{monday:_}=this._weekBounds();this._events="month"===this._view||"planner"===this._view?[]:u.flatMap(e=>function(e,t){return we(e,t,7)}(e,_)),this._todoItemsByOwner=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,[...t].sort((e,t)=>this._todoSortKey(e).localeCompare(this._todoSortKey(t)))])),this._loadError=n&&0===i.length,this._loading=!1}_calsOf(e){return Array.isArray(e.calendar)?e.calendar.filter(Boolean):e.calendar?[e.calendar]:[]}_todosOf(e){return Array.isArray(e.todo)?e.todo.filter(Boolean):e.todo?[e.todo]:[]}_writableCals(e){return this._calsOf(e).filter(e=>this._canCreate(e))}_personCanCreate(e){return this._writableCals(e).length>0}_calFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canCreate(e){return!!(1&this._calFeatures(e))}_canUpdate(e){return!!(4&this._calFeatures(e))}_canDelete(e){return!!(2&this._calFeatures(e))}_todoFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canUpdateTodo(e){return!!(4&this._todoFeatures(e))}_canDeleteTodo(e){return!!(2&this._todoFeatures(e))}_allPersonIdxs(){return this._persons.map((e,t)=>t)}_personRef(e,t){return e.person?e.person:e.name?`name:${e.name}`:`slot:${t}`}_resolvePersonRefs(e){if(!Array.isArray(e)||0===e.length)return this._allPersonIdxs();const t=[];return this._persons.forEach((o,a)=>{const i=[this._personRef(o,a),o.person,o.name?`name:${o.name}`:"",String(a)].filter(e=>!!e);e.some(e=>i.includes(e))&&!t.includes(a)&&t.push(a)}),t}_normalizeSharedGroups(e,t,o){const a=[],i=(e,t,o)=>{const i=Array.from(new Set(e.filter(Boolean))),r=Array.from(new Set(t)).sort((e,t)=>e-t);0!==i.length&&0!==r.length&&a.push({ids:i,personIdxs:r,label:o?.trim()||void 0})};return e.length&&i(e,this._allPersonIdxs()),t.forEach(e=>i(e.ids,this._resolvePersonRefs(e.persons),e.label)),o.forEach(({id:e,owners:t})=>{if(t.length<2)return;const o=a.some(o=>o.ids.includes(e)&&t.every(e=>o.personIdxs.includes(e)));o||i([e],t)}),a}_sharedCals(){const e=this._config.shared_calendar;return Array.isArray(e)?e.filter(Boolean):e?[e]:[]}_sharedCalendarGroups(){const e=Array.isArray(this._config.shared_calendar_groups)?this._config.shared_calendar_groups:[],t=new Map;return this._config.persons.forEach((e,o)=>{new Set(this._calsOf(e)).forEach(e=>{const a=t.get(e)??[];a.includes(o)||a.push(o),t.set(e,a)})}),this._normalizeSharedGroups(this._sharedCals(),e.map(e=>({ids:Array.isArray(e.calendars)?e.calendars.filter(Boolean):e.calendars?[e.calendars]:[],persons:e.persons,label:e.label})),Array.from(t,([e,t])=>({id:e,owners:t})))}_sharedTodos(){const e=this._config.shared_todo;return Array.isArray(e)?e.filter(Boolean):e?[e]:[]}_sharedTodoGroups(){const e=Array.isArray(this._config.shared_todo_groups)?this._config.shared_todo_groups:[],t=new Map;return this._config.persons.forEach((e,o)=>{new Set(this._todosOf(e)).forEach(e=>{const a=t.get(e)??[];a.includes(o)||a.push(o),t.set(e,a)})}),this._normalizeSharedGroups(this._sharedTodos(),e.map(e=>({ids:Array.isArray(e.todos)?e.todos.filter(Boolean):e.todos?[e.todos]:[],persons:e.persons,label:e.label})),Array.from(t,([e,t])=>({id:e,owners:t})))}_sharedCalendarIds(){return Array.from(new Set(this._sharedCalendarGroups().flatMap(e=>e.ids)))}_sharedTodoIds(){return Array.from(new Set(this._sharedTodoGroups().flatMap(e=>e.ids)))}_sharedGroupFor(e,t){return e.find(e=>e.ids.includes(t))}_isShared(e){return!0===e.shared||e.personIdx===He}_sharedPersons(e){return e.ref.shared_person_idxs?.length?e.ref.shared_person_idxs:this._allPersonIdxs()}_sharedLabel(e){const t=e?.ref.shared_label?.trim();if(t)return t;const o=this._sharedCalendarIds();return 1===o.length?this._calLabel(o[0]):this._t("shared_events")}_sharedRange(e,t=this._allPersonIdxs()){const o=this._sharedPersons(e).filter(e=>t.includes(e));if(0===o.length)return null;const a=o.map(e=>t.indexOf(e)).filter(e=>e>=0).sort((e,t)=>e-t);if(!a.length)return null;const i=a[0];return{start:i,span:a[a.length-1]-i+1}}_sharedGridStyle(e,t=this._allPersonIdxs()){const o=this._sharedRange(e,t);return o?`grid-column:${o.start+1} / span ${o.span}`:"display:none"}_sharedBandStyle(e,t,o){const a=this._sharedRange(e);if(!a)return null;const{top:i,height:r}=this._sharedBandBox(e,t,o);return`top:${i+1.5}px;height:${r}px;left:calc(var(--fb-axis-width, 56px) + ${a.start/this._persons.length*100}% + 2px);width:calc(${a.span/this._persons.length*100}% - 4px)`}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _pxPerMin(){if(this._config.fit_height&&this._fitPx>0)return this._fitPx;return Math.min(96,Math.max(40,this._config.hour_height??64))/60}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}_dayWindow(e){const t=this._startMin,o=this._endMin;if(!1===this._config.trim_hours)return{startMin:t,endMin:o};const a=this._events.filter(t=>t.day===e&&!t.allDay);if(0===a.length)return{startMin:t,endMin:o};let i=Math.min(...a.map(e=>e.startMin)),r=Math.max(...a.map(e=>e.endMin));if(this._isRealToday(e)){const e=new Date,a=60*e.getHours()+e.getMinutes();a>=t&&a<=o&&(i=Math.min(i,a),r=Math.max(r,a))}let n=Math.max(t,60*Math.floor(i/60)),s=Math.min(o,60*Math.ceil(r/60));return s-n<360&&(s=Math.min(o,n+360),n=Math.max(t,s-360)),{startMin:n,endMin:s}}_jsDay(e){return(this._firstDayJs+e)%7}get _visibleDays(){const e=[0,1,2,3,4,5,6];return!1===this._config.show_weekends?e.filter(e=>{const t=this._jsDay(e);return 0!==t&&6!==t}):e}_t(e){return ze(this.hass,e)}_calMeta(e){return e&&this._config.calendars?.[e]||{}}_mapUrl(e){const t=this._config.map_url,o=encodeURIComponent(e);return"string"==typeof t&&t.includes("{location}")?t.replace("{location}",o):`https://www.google.com/maps/search/?api=1&query=${o}`}_calIcon(e){return this._calMeta(e).icon}_calIconEl(e){if("todo"===e.ref.kind)return W;const t=this._calIcon(e.ref.calendar);return t?H`<ha-icon class="cicon" .icon=${t}></ha-icon>`:W}_calLabel(e){return this._calMeta(e).label??(this.hass.states[e]?.attributes?.friendly_name||e)}_eventColor(e){if("todo"===e.ref.kind)return e.color;const t=this._config.color_by;return"location"===t&&e.location?et(e.location):"calendar"===t&&e.ref.calendar?this._calMeta(e.ref.calendar).color??et(e.ref.calendar):e.color}_isPast(e){return!1!==this._config.dim_past&&e.ref.end.getTime()<=Date.now()}_sharedFor(e){return this._events.filter(t=>t.day===e&&this._isShared(t)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_todoAnchorDates(e,t){const o=[],a=Ye(e);for(;a.getTime()<t.getTime();)o.push(new Date(a)),a.setDate(a.getDate()+1);return o.length>0?o:[Ye(e)]}_todoToRawEvent(e,t,o,a,i,r,n,s=!1){if(!e||"string"!=typeof e.summary||"completed"===e.status)return null;const l="string"==typeof e.due?e.due.trim():"",d=l.includes(" ")&&!l.includes("T")?l.replace(" ","T"):l,c=d.includes("T");let p=Ye(i),h=new Date(p.getTime()+xe),u=!0;if(d)if(c){const e=new Date(d);if(isNaN(e.getTime()))return null;p=e,h=new Date(e.getTime()+6e4*Math.max(this._grid,30)),u=!1}else{const e=new Date(`${d}T00:00:00`);if(isNaN(e.getTime()))return null;p=e,h=new Date(e.getTime()+xe)}return h.getTime()<=r.getTime()||p.getTime()>=n.getTime()?null:{kind:"todo",personIdx:t,shared:s,calendar:a,uid:e.uid,summary:e.summary.trim()||this._t("todo"),description:e.description,allDay:u,start:p,end:h,color:o,tentative:!1,todo_item:e.uid||e.summary,todo_due:l||void 0,todo_due_has_time:d?c:void 0}}_isTodo(e){return"todo"===e.ref.kind}_sharedAllDay(e){return this._sharedFor(e).filter(e=>e.allDay)}_sharedTimed(e){return ke(this._sharedFor(e).filter(e=>!e.allDay))}_sharedBandBox(e,t,o){const a=(e.startMin-o)*t,i=Math.max((e.endMin-e.startMin)*t-3,12);if(e.cols<=1)return{top:a,height:i};const r=Math.min(8,Math.max(3,Math.floor(i/Math.max(3*e.cols,3))));return{top:a+e.col*r,height:Math.max(12,i-(e.cols-1)*r)}}_relativeDay(e){const t=Math.round((Ye(e).getTime()-Ye(new Date).getTime())/xe);return 0===t?this._t("today"):1===t?this._t("tomorrow"):-1===t?this._t("yesterday"):null}_isOff(e){return this._hiddenP.includes(e)}_togglePerson(e){this._hiddenP=this._isOff(e)?this._hiddenP.filter(t=>t!==e):[...this._hiddenP,e]}_timedFor(e,t){if(this._isOff(t))return[];const o=this._events.filter(o=>o.day===e&&o.personIdx===t&&!o.allDay&&!this._isBackground(o));return ke(o)}_bgMinMin(){const e=Number(this._config.background_hours??3);return!Number.isFinite(e)||e<=0?0:60*e}_isBackground(e){const t=this._bgMinMin();return t>0&&!this._isTodo(e)&&!e.allDay&&e.endMin-e.startMin>=t}_bgFor(e,t){return this._isOff(t)?[]:this._events.filter(o=>o.day===e&&o.personIdx===t&&!o.allDay&&this._isBackground(o)).sort((e,t)=>t.endMin-t.startMin-(e.endMin-e.startMin))}_maxCols(){const e=Number(this._config.max_columns);return!Number.isFinite(e)||e<1?3:Math.min(Math.round(e),8)}_dayLayout(e,t){const o=this._timedFor(e,t),a=this._maxCols(),i=new Map;for(const e of o){const t=i.get(e.cluster);t?t.push(e):i.set(e.cluster,[e])}const r=[],n=[];for(const e of i.values()){if(e[0].cols<=a){r.push(...e);continue}let t=0,o=1/0,i=-1/0;for(const n of e)n.col<=a-2?r.push({...n,cols:a,span:Math.max(1,Math.min(n.span,a-n.col))}):(t++,o=Math.min(o,n.startMin),i=Math.max(i,n.endMin));t>0&&n.push({col:a-1,cols:a,startMin:o,endMin:i,count:t})}return{events:r,overflows:n}}_evTitle(e){const t=e.parts&&e.parts>1?`${e.title} (${e.part}/${e.parts})`:e.title,o=this._autoIcon(e.title);return o?`${o} ${t}`:t}_autoIcon(e){if(!0!==this._config.auto_icons)return"";if(!e||We.test(e))return"";const t=this._config.icon_patterns;if(Array.isArray(t)){const o=e.toLowerCase();for(const e of t){const t=String(e),a=t.indexOf("=>");if(a<0)continue;const i=t.slice(0,a).trim().toLowerCase(),r=t.slice(a+2).trim();if(i&&r&&o.includes(i))return r}}for(const[t,o]of Ke)if(t.test(e))return o;return""}_isTentative(e){return!0===e.ref.tentative}_showDayAgenda(e){this._day=e,this._enabledViews.includes("agenda")&&(this._view="agenda")}_openDayView(e){this._day=e,this._enabledViews.includes("day")&&(this._view="day")}_allDayFor(e,t){return this._isOff(t)?[]:this._events.filter(o=>o.day===e&&o.personIdx===t&&o.allDay)}_eventsFor(e,t){return this._isOff(t)?[]:this._events.filter(o=>o.day===e&&o.personIdx===t).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_dateForDay(e){const{monday:t}=this._weekBounds();return new Date(t.getTime()+e*xe)}_isRealToday(e){return 0===this._weekOffset&&e===this._todayIndex()}_onItemKey(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this._openEvent(t))}_dayHasEvents(e){return this._sharedFor(e).length>0||this._persons.some((t,o)=>this._eventsFor(e,o).length>0)}_eventOwnerLabel(e){return this._isShared(e)?this._sharedLabel(e):this._personName(this._persons[e.personIdx],e.personIdx)}_personName(e,t){return e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${t+1}`}_todoLabel(e){return this.hass.states[e]?.attributes?.friendly_name??e}_todoOwnerKey(e){return e===He?"shared":`person:${e}`}_todoSortKey(e){return`${("string"==typeof e.due?e.due.trim():"")||"9999-12-31T23:59:59"}::${e.summary.toLowerCase()}`}_todoItemsForPerson(e){return[...this._todoItemsByOwner[this._todoOwnerKey(e)]??[]].sort((e,t)=>this._todoSortKey(e).localeCompare(this._todoSortKey(t)))}_todoCountForPerson(e){return this._todoItemsForPerson(e).length}_formatTodoDue(e){if(!e)return"";const t=e.trim();if(!t)return"";const o=t.includes("T")||t.includes(" "),a=new Date(t.replace(" ","T"));if(Number.isNaN(a.getTime()))return t;const i=a.toLocaleDateString(this.hass.locale.language,{day:"2-digit",month:"2-digit"});return o?`${i} · ${Ee(this.hass,60*a.getHours()+a.getMinutes())}`:i}_todoKey(e){return`${e.entityId}::${this._todoRef(e)}`}_todoFromEvent(e){if(!this._isTodo(e))return null;const t=e.ref;return{entityId:t.calendar,uid:t.uid,summary:t.summary,status:"needs_action",due:t.todo_due,description:t.description,listLabel:this._todoLabel(t.calendar)}}_isTodoBusy(e){const t=this._todoFromEvent(e);return!!t&&this._todoBusy.includes(this._todoKey(t))}_todoRef(e){return e.uid||e.summary}_openTodo(e){const t=this._todoFeatures(e.entityId);this._todoDialog={entityId:e.entityId,uid:e.uid,itemRef:this._todoRef(e),summary:e.summary,description:e.description??"",due:e.due?e.due.includes("T")||e.due.includes(" ")?Ve(new Date(e.due.replace(" ","T"))):e.due:"",dueHasTime:!!e.due&&(e.due.includes("T")||e.due.includes(" ")),canUpdate:!!(4&t),canDelete:!!(2&t),supportsDescription:!!(64&t)||!!e.description,supportsDueDate:!!(16&t)||!!(32&t)||!!e.due,supportsDueDatetime:!!(32&t)||!!e.due?.includes("T")||!!e.due?.includes(" ")}}_openTodoBadgeDialog(e){this._todoBadgeDialog={personIdx:e}}_closeTodoBadgeDialog(){this._todoBadgeDialog=void 0}_todoDlgField(e,t){this._todoDialog&&(this._todoDialog={...this._todoDialog,[e]:t,error:void 0})}async _toggleTodo(e){if(!this._canUpdateTodo(e.entityId))return;const t=this._todoKey(e);this._todoBusy=[...this._todoBusy,t];try{await this.hass.callWS({type:"call_service",domain:"todo",service:"update_item",target:{entity_id:e.entityId},service_data:{item:this._todoRef(e),status:"completed"}}),await this._refetch()}finally{this._todoBusy=this._todoBusy.filter(e=>e!==t)}}_renderTodoItemCheckbox(e){const t=this._todoBusy.includes(this._todoKey(e)),o=this._canUpdateTodo(e.entityId),a=e=>e.stopPropagation();return H`<input
      class="todo-check"
      type="checkbox"
      aria-label="${this._t("todo_complete")}: ${e.summary}"
      .checked=${t}
      ?disabled=${!o||t}
      @pointerdown=${a}
      @click=${a}
      @keydown=${a}
      @change=${t=>{t.stopPropagation();const o=t.target;o.checked?this._toggleTodo(e):o.checked=!1}}
    />`}_renderTodoCheckbox(e){const t=this._todoFromEvent(e);return t?this._renderTodoItemCheckbox(t):W}async _completeTodoDialog(){if(!this._todoDialog||!this._canUpdateTodo(this._todoDialog.entityId))return;const e=this._todoDialog;this._todoDialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"call_service",domain:"todo",service:"update_item",target:{entity_id:e.entityId},service_data:{item:e.itemRef,status:"completed"}}),this._todoDialog=void 0,await this._refetch()}catch(t){this._todoDialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}async _saveTodoDialog(){if(!this._todoDialog)return;const e=this._todoDialog;this._todoDialog={...e,busy:!0,error:void 0};try{const t={item:e.itemRef,rename:e.summary.trim()||e.summary};e.supportsDescription&&(t.description=e.description.trim()),e.supportsDueDatetime?t.due_datetime=e.due.trim()?new Date(e.due).toISOString().slice(0,19).replace("T"," "):"":e.supportsDueDate&&(t.due_date=e.due.trim()),await this.hass.callWS({type:"call_service",domain:"todo",service:"update_item",target:{entity_id:e.entityId},service_data:t}),this._todoDialog=void 0,await this._refetch()}catch(t){this._todoDialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}async _deleteTodoDialog(){if(!this._todoDialog)return;const e=this._todoDialog;this._todoDialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"call_service",domain:"todo",service:"remove_item",target:{entity_id:e.entityId},service_data:{item:e.itemRef}}),this._todoDialog=void 0,await this._refetch()}catch(t){this._todoDialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}_closeTodoDialog(){this._todoDialog=void 0}_openTodoFromBadge(e){this._closeTodoBadgeDialog(),this._openTodo(e)}_avatar(e,t){const o=Qe(e,t),a=e.person?this.hass.states[e.person]:void 0,i=a?.attributes?.entity_picture,r=this._personName(e,t).slice(0,2).toUpperCase();return i?H`<div
          class="avatar"
          style="background-image:url('${i}');box-shadow:0 0 0 2px ${o}55"
        ></div>`:H`<div class="avatar initials" style="background:${o}">${r}</div>`}_todoBadge(e){const t=this._todoCountForPerson(e);if(!t)return W;const o=this._personName(this._persons[e],e);return H`<span
      class="pbadge todo-badge"
      title="${o} · ${t} ${this._t("todo_items")}"
      role="button"
      tabindex="0"
      @click=${t=>{t.stopPropagation(),this._openTodoBadgeDialog(e)}}
      @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this._openTodoBadgeDialog(e))}}
    >
      <ha-icon icon="mdi:checkbox-marked-circle-outline"></ha-icon>
      <span>${t}</span>
    </span>`}_badges(e,t){const o=Array.isArray(e.badges)?e.badges.filter(Boolean):[],a=this._todoCountForPerson(t);if(0===o.length&&0===a)return W;const i=a>0?this._todoBadge(t):W;return H`<div class="pbadges">
      ${i}
      ${o.map(e=>{const t=this.hass.states[e];if(!t)return W;const o=t.attributes?.icon,a=t.attributes?.unit_of_measurement??"";return H`<span
          class="pbadge"
          title=${t.attributes?.friendly_name??e}
          role="button"
          tabindex="0"
          @click=${t=>{t.stopPropagation(),this._moreInfo(e)}}
          @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._moreInfo(e))}}
        >
          ${o?H`<ha-icon .icon=${o}></ha-icon>`:W}
          <span>${t.state}${a}</span>
        </span>`})}
    </div>`}_moreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_goToDate(e){const t=Ye(new Date),o=e=>{const t=Ye(e);return t.setDate(t.getDate()-(t.getDay()-this._firstDayJs+7)%7),t},a=Math.round((o(e).getTime()-o(t).getTime())/(7*xe));this._weekOffset=a,this._day=(e.getDay()-this._firstDayJs+7)%7,this._view=this._enabledViews.includes("day")?"day":this._view}render(){if(!this._config||!this.hass)return W;const e=this._config.title??this._t("board_title");return H`
      <ha-card>
        ${this._config.clock_header?ot(this):H`<div class="top">
              <div class="titlewrap">${st(this)}<span class="title">${e}</span></div>
              ${nt(this)}
            </div>`}
        ${it(this)} ${this._config.show_focus?(t=this,H`
    <div class="focus">
      ${t._persons.map((e,o)=>{if(t._isOff(o))return W;const{current:a,next:i}=t._focusFor(o),r=Qe(e,o),n=e=>t._config.auto_icons?t._autoIcon(e.summary):"";return H`
          <div class="fchip" title=${t._personName(e,o)}>
            ${t._avatar(e,o)}
            <div class="fbody">
              <span class="fname">${t._personName(e,o)}</span>
              ${a?H`<span class="fnow">
                    <span class="fdot" style="background:${r}"></span>${n(a)}
                    ${a.summary}
                    <small>bis ${Ce(t.hass,a.end)}</small>
                  </span>`:i?H`<span class="fnext">
                      ${t._t("focus_next")}: ${n(i)} ${i.summary}
                      <small>${Oe(t.hass,i.start)}</small>
                    </span>`:H`<span class="ffree">${t._t("focus_free")}</span>`}
            </div>
          </div>
        `})}
    </div>
  `):W}
        ${"day"===this._view?function(e){const t=e._visibleDays.includes(e._day)?e._day:e._visibleDays[0],o=e._pxPerMin,a=60*o,{startMin:i,endMin:r}=e._dayWindow(t),n=(r-i)*o,s=Pe(e.hass,"long",e._firstDayJs),l=e._sharedAllDay(t).filter(t=>!e._isTodo(t)),d=e._sharedTimed(t),c=[];for(let e=i/60;e<=r/60;e++)c.push(e);const p=new Date,h=Math.max(i,Math.min(r,60*p.getHours()+p.getMinutes())),u=!1!==e._config.show_now_line&&e._isRealToday(t),_=l.length>0||e._persons.some((o,a)=>e._allDayFor(t,a).length>0);return H`
    <div class="dayhead">
      <span class="dayname">
        ${e._relativeDay(e._dateForDay(t))??s[t]}
        ${e._weatherChip(e._dateForDay(t))}${e._loading&&0===e._raw.length?H`<span class="spinner"></span>`:W}
      </span>
      ${rt(e)}
    </div>
    ${lt(e)}
    ${e._loadError?H`<div class="banner">${e._t("load_error")}</div>`:W}
    <div class="board">
      <div class="header-row">
        <div class="axis-spacer"></div>
        ${e._persons.map((t,o)=>{const a=t.person?e.hass.states[t.person]:void 0,i=e._isOff(o);return H`
            <div
              class="phead ${i?"off":""}"
              role="button"
              tabindex="0"
              title=${e._personName(t,o)}
              @click=${()=>e._togglePerson(o)}
              @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e._togglePerson(o))}}
            >
              ${e._avatar(t,o)}
              ${i?W:H`<div class="pname">${e._personName(t,o)}</div>
                    <div class="pstatus">${a?e._statusLabel(a.state):""}</div>
                    ${e._badges(t,o)}`}
            </div>
          `})}
      </div>
      ${_?H`
            <div class="allday-row">
              <div class="axis-spacer allday-label">${e._t("all_day")}</div>
              <div class="allday-main">
                ${l.length?H`<div class="allday-shared">
                      ${l.map(t=>{const o=e._eventColor(t),a=e._isTentative(t);return H`
                          <div
                            class="adchip shared ${a?"tentative":""}"
                            style="${e._sharedGridStyle(t)};border-left:3px ${a?"dashed":"solid"} ${o};background:${o}30;background:color-mix(in srgb, ${o} 22%, var(--card-background-color, #fff))"
                            title="${e._evTitle(t)}"
                            tabindex="0"
                            role="button"
                            @click=${()=>e._openEvent(t)}
                            @keydown=${o=>e._onItemKey(o,t)}
                          >
                            ${e._isTodo(t)?H`<span class="todo-line">
                                  ${e._renderTodoCheckbox(t)}
                                  <span class="todo-label"
                                    >${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}</span
                                  >
                                </span>`:H`${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}`}
                          </div>
                        `})}
                    </div>`:W}
                <div class="allday-grid">
                  ${e._persons.map((o,a)=>{const i=e._allDayFor(t,a).filter(t=>!e._isTodo(t));return H`
                      <div class="allday-cell ${e._isOff(a)?"off":""}">
                        ${i.map(t=>{const o=e._eventColor(t),a=e._isTentative(t);return H`
                            <div
                              class="adchip ${a?"tentative":""}"
                              style="border-left:3px ${a?"dashed":"solid"} ${o};background:${o}30;background:color-mix(in srgb, ${o} 22%, var(--card-background-color, #fff))"
                              title="${e._evTitle(t)}"
                              tabindex="0"
                              role="button"
                              @click=${()=>e._openEvent(t)}
                              @keydown=${o=>e._onItemKey(o,t)}
                            >
                              ${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}
                            </div>
                          `})}
                      </div>
                    `})}
                </div>
              </div>
            </div>
          `:W}
      <div class="body" style="height:${n}px">
        <div class="axis">
          ${c.map(e=>H`<div class="hour" style="top:${(60*e-i)*o}px">${Ge(e)}:00</div>`)}
        </div>
        ${e._persons.map((n,s)=>{const l=e._personCanCreate(n),d=e._dayLayout(t,s);return H`
            <div
              class="col ${l?"creatable":""} ${e._isOff(s)?"off":""}"
              @click=${a=>e._onColClick(a,s,t,o,i)}
              style="background-image:
                repeating-linear-gradient(var(--fb-row-shade) 0 ${a}px, transparent ${a}px ${2*a}px),
                repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${a/2}px),
                repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${a}px)"
            >
              ${e._bgFor(t,s).filter(e=>e.endMin>i&&e.startMin<r).map((t,a)=>{const r=(t.startMin-i)*o,n=Math.max((t.endMin-t.startMin)*o-3,16),s=e._eventColor(t),l=e._isTentative(t);return H`
                    <div
                      class="band ${e._isPast(t)?"past":""} ${l?"tentative":""}"
                      tabindex="0"
                      role="button"
                      @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                      @keydown=${o=>e._onItemKey(o,t)}
                      style="top:${r+1.5}px;height:${n}px;
                             border:1.5px dashed ${s}55;
                             background:${s}0d;
                             background:repeating-linear-gradient(45deg,
                               color-mix(in srgb, ${s} 8%, transparent) 0 8px,
                               transparent 8px 16px)"
                      title="${e._evTitle(t)} · ${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}"
                    >
                      <span
                        class="etitle"
                        style="margin-top:${19*a}px;
                               background:${s}26;
                               background:color-mix(in srgb, ${s} 16%, var(--card-background-color, #fff))"
                        >${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}</span
                      >
                    </div>
                  `})}
              ${(()=>{let t=-1/0;return d.events.filter(e=>e.endMin>i&&e.startMin<r).map(a=>{const r=e._drag?.raw===a.ref;let n=a.startMin,s=a.endMin;if(r&&e._drag){const t=e._dragGrid;if("move"===e._drag.mode){const o=Math.round((a.startMin+e._drag.deltaMin)/t)*t;s=a.endMin+(o-a.startMin),n=o}else{let o=Math.round((a.endMin-a.startMin+e._drag.deltaMin)/t)*t;o<t&&(o=t),s=a.startMin+o}}let l=(n-i)*o;const d=Math.max((s-n)*o-3,16),c=e._eventColor(a),p=a.col/a.cols*100,h=(a.span??1)/a.cols*100,u=e._isTentative(a),_=d<24,g=e._draggable(a);return _&&1===a.cols&&!r&&(l=Math.max(l,t+1),t=l+d),H`
                      <div
                        class="event ${e._isPast(a)?"past":""} ${u?"tentative":""} ${e._isTodo(a)?"todo":""} ${_?"slim":""} ${g?"draggable":""} ${r?"dragging":""}"
                        tabindex="0"
                        role="button"
                        @pointerdown=${t=>e._onEventPointerDown(t,a,"move")}
                        @click=${t=>{t.stopPropagation(),e._suppressClick?e._suppressClick=!1:e._openEvent(a)}}
                        @keydown=${t=>e._onItemKey(t,a)}
                        style="top:${l+1.5}px;height:${d}px;
                             left:calc(${p}% + 2px);width:calc(${h}% - 4px);
                             border-left:3px ${u?"dashed":"solid"} ${c};background:${c}40;background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff));"
                        title="${e._evTitle(a)} · ${Ee(e.hass,a.startMin)}–${Ee(e.hass,a.endMin)}"
                      >
                        <span class="etitle ${e._isTodo(a)?"todo-line":""}"
                          >${e._isTodo(a)?e._renderTodoCheckbox(a):W}${e._isTodo(a)?H`<span class="todo-label"
                                >${e._calIconEl(a)}${a.continuesBefore?"« ":""}${e._evTitle(a)}</span
                              >`:H`${e._calIconEl(a)}${a.continuesBefore?"« ":""}${e._evTitle(a)}`}</span
                        >
                        ${d>32||r?H`<span class="etime"
                              >${Ee(e.hass,n)}–${Ee(e.hass,s)}</span
                            >`:W}
                        ${e._progressOn&&e._isCurrent(a)&&!r?H`<div class="eprog">
                              <div style="width:${e._progressPct(a)}%"></div>
                            </div>`:W}
                        ${g&&!_?H`<div
                              class="rz"
                              @pointerdown=${t=>e._onEventPointerDown(t,a,"resize")}
                            ></div>`:W}
                      </div>
                    `})})()}
              ${d.overflows.filter(e=>e.endMin>i&&e.startMin<r).map(a=>{const r=(a.startMin-i)*o,n=Math.max((a.endMin-a.startMin)*o-3,16),s=a.col/a.cols*100,l=100/a.cols;return H`
                    <div
                      class="event overflow"
                      tabindex="0"
                      role="button"
                      title="${a.count} ${e._t("more_events")}"
                      @click=${o=>{o.stopPropagation(),e._showDayAgenda(t)}}
                      @keydown=${o=>{"Enter"!==o.key&&" "!==o.key||(o.preventDefault(),e._showDayAgenda(t))}}
                      style="top:${r+1.5}px;height:${n}px;
                             left:calc(${s}% + 2px);width:calc(${l}% - 4px)"
                    >
                      <span class="etitle">+${a.count}</span>
                    </div>
                  `})}
            </div>
          `})}
        ${d.filter(e=>e.endMin>i&&e.startMin<r).map(t=>{const a=e._sharedBandStyle(t,o,i);if(!a)return W;const{height:r}=e._sharedBandBox(t,o,i),n=e._eventColor(t),s=e._isTentative(t);return H`
              <div
                class="shared-band ${e._isPast(t)?"past":""} ${s?"tentative":""}"
                tabindex="0"
                role="button"
                @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                @keydown=${o=>e._onItemKey(o,t)}
                style="${a};
                       border-left:3px ${s?"dashed":"solid"} ${n};
                       background:${n}1f;
                       background:color-mix(in srgb, ${n} 14%, var(--card-background-color, #fff))"
                title="${e._evTitle(t)} · ${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}"
              >
                <span class="shared-tag">${e._sharedLabel(t)}</span>
                <span class="etitle"
                  >${t.continuesBefore?"« ":""}${e._calIconEl(t)}${e._evTitle(t)}${t.continuesAfter?" »":""}</span
                >
                ${r>24?H`<span class="etime"
                      >${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}</span
                    >`:W}
              </div>
            `})}
        ${u?H`<div class="nowline" style="top:${(h-i)*o}px">
              <span>${Ee(e.hass,h)}</span>
            </div>`:W}
        ${e._loading||e._loadError||e._dayHasEvents(t)?W:H`<div class="empty">${e._t("no_events")}</div>`}
      </div>
    </div>
  `}(this):"planner"===this._view?ct(this):"timeline"===this._view?function(e){const t=e._visibleDays.includes(e._day)?e._day:e._visibleDays[0],{startMin:o,endMin:a}=e._dayWindow(t),i=Math.min(240,Math.max(48,Number(e._config.hour_width)||96)),r=i/60,n=(a-o)*r,s=Pe(e.hass,"long",e._firstDayJs),l=e._sharedTimed(t),d=e._persons.map((e,t)=>t).filter(t=>!e._isOff(t)),c=[];for(let e=o/60;e<=a/60;e++)c.push(e);const p=new Date,h=60*p.getHours()+p.getMinutes(),u=!1!==e._config.show_now_line&&e._isRealToday(t)&&h>=o&&h<=a,_=30;return H`
    <div class="dayhead">
      <span class="dayname">
        ${e._relativeDay(e._dateForDay(t))??s[t]}
        ${e._weatherChip(e._dateForDay(t))}${e._loading&&0===e._raw.length?H`<span class="spinner"></span>`:W}
      </span>
      ${rt(e)}
    </div>
    ${lt(e)}
    ${e._loadError?H`<div class="banner">${e._t("load_error")}</div>`:W}
    <div class="tlwrap">
      <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${n}px)">
        <div class="tlhead">
          <div class="tlcorner"></div>
          <div class="tlhours" style="width:${n}px">
            ${c.map(e=>H`<span class="tlhour" style="left:${(60*e-o)*r}px"
                  >${Ge(e)}:00</span
                >`)}
          </div>
        </div>
        ${l.length?H`
              <div class="tlrow shared">
                <div class="tlperson shared">
                  <div>
                    <div class="pname">${e._t("shared_events")}</div>
                  </div>
                </div>
                <div
                  class="tlcanvas shared"
                  style="width:${n}px;height:${Math.max(...l.map(e=>e.cols))*_+8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${i}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px)"
                >
                  ${l.filter(e=>e.endMin>o&&e.startMin<a).map(t=>{const i=Math.max(t.startMin,o),n=Math.min(t.endMin,a),s=Math.max((n-i)*r-3,20),l=e._eventColor(t),c=e._isTentative(t),p=t.continuesBefore||t.startMin<o,h=t.continuesAfter||t.endMin>a;return e._sharedRange(t,d)?H`
                        <div
                          class="tlbar shared ${e._isPast(t)?"past":""} ${c?"tentative":""}"
                          tabindex="0"
                          role="button"
                          @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                          @keydown=${o=>e._onItemKey(o,t)}
                          style="left:${(i-o)*r+1.5}px;width:${s}px;
                                 top:${t.col*_+4}px;height:${24}px;
                                 border-left:3px ${c?"dashed":"solid"} ${l};
                                 background:${l}28;
                                 background:color-mix(in srgb, ${l} 18%, var(--card-background-color, #fff))"
                          title="${e._evTitle(t)}${t.allDay?` · ${e._t("all_day")}`:` · ${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}`}"
                        >
                          <span class="shared-tag">${e._sharedLabel(t)}</span>
                          <span class="etitle"
                            >${p?"« ":""}${e._calIconEl(t)}${e._evTitle(t)}${h?" »":""}</span
                          >
                        </div>
                      `:W})}
                </div>
              </div>
            `:W}
        ${e._persons.map((s,l)=>{const d=e._isOff(l),c=d?[]:e._events.filter(e=>e.day===t&&e.personIdx===l),p=ke(c),h=p.length?Math.max(...p.map(e=>e.cols)):1,u=e._personCanCreate(s),g=s.person?e.hass.states[s.person]:void 0;return H`
            <div class="tlrow ${d?"off":""}">
              <div
                class="tlperson"
                role="button"
                tabindex="0"
                @click=${()=>e._togglePerson(l)}
                @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e._togglePerson(l))}}
              >
                ${e._avatar(s,l)}
                <div class="pmeta">
                  <div class="pname">${e._personName(s,l)}</div>
                  <div class="pstatus">${g?e._statusLabel(g.state):""}</div>
                  ${e._badges(s,l)}
                </div>
              </div>
              <div
                class="tlcanvas ${u?"creatable":""}"
                style="width:${n}px;height:${h*_+8}px;
                       background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${i}px),
                       repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px)"
                @click=${a=>e._onTimelineClick(a,l,t,r,o)}
              >
                ${p.filter(e=>e.endMin>o&&e.startMin<a).map(t=>{const i=Math.max(t.startMin,o),n=Math.min(t.endMin,a),s=Math.max((n-i)*r-3,20),l=e._eventColor(t),d=e._isTentative(t),c=t.continuesBefore||t.startMin<o,p=t.continuesAfter||t.endMin>a;return H`
                      <div
                        class="tlbar ${e._isPast(t)?"past":""} ${d?"tentative":""} ${e._isTodo(t)?"todo":""}"
                        tabindex="0"
                        role="button"
                        @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                        @keydown=${o=>e._onItemKey(o,t)}
                        style="left:${(i-o)*r+1.5}px;width:${s}px;
                               top:${t.col*_+4}px;height:${24}px;
                               border-left:3px ${d?"dashed":"solid"} ${l};background:${l}40;background:color-mix(in srgb, ${l} 32%, var(--card-background-color, #fff));"
                        title="${e._evTitle(t)}${t.allDay?` · ${e._t("all_day")}`:` · ${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}`}"
                      >
                        <span class="etitle ${e._isTodo(t)?"todo-line":""}"
                          >${e._isTodo(t)?e._renderTodoCheckbox(t):W}${e._isTodo(t)?H`<span class="todo-label"
                                >${c?"« ":""}${e._evTitle(t)}${p?" »":""}</span
                              >`:H`${c?"« ":""}${e._evTitle(t)}${p?" »":""}`}</span
                        >
                        ${!t.allDay&&s>120?H`<span class="etime"
                              >${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}</span
                            >`:W}
                      </div>
                    `})}
              </div>
            </div>
          `})}
        ${u?H`<div
              class="tlnow"
              style="left:calc(var(--fb-tl-label, 150px) + ${(h-o)*r}px)"
            >
              <span>${Ee(e.hass,h)}</span>
            </div>`:W}
      </div>
      ${e._loading||e._loadError||e._dayHasEvents(t)?W:H`<div class="empty">${e._t("no_events")}</div>`}
    </div>
  `}(this):"week"===this._view?function(e){const t=Pe(e.hass,"short",e._firstDayJs),o=e._persons.map((e,t)=>({p:e,i:t})).filter(({i:t})=>!0!==e._config.hide_empty_persons||e._events.some(o=>o.personIdx===t||e._isShared(o)&&e._sharedPersons(o).includes(t))),a=o.length>0?o:e._persons.map((e,t)=>({p:e,i:t})),i=`70px repeat(${a.length}, minmax(110px, 1fr))`;return H`
    <div class="weekhead">${rt(e)}</div>
    <div class="weekwrap">
      <div class="weekgrid" style="grid-template-columns:${i}">
        <div class="corner"></div>
        ${a.map(({p:t,i:o})=>H`<div
              class="wphead ${e._isOff(o)?"off":""}"
              role="button"
              tabindex="0"
              @click=${()=>e._togglePerson(o)}
              @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e._togglePerson(o))}}
            >
              ${e._avatar(t,o)}
              <div class="pmeta">
                <div class="pname">${e._personName(t,o)}</div>
                ${e._badges(t,o)}
              </div>
            </div>`)}
        ${e._visibleDays.map(o=>{const i=e._sharedFor(o),r=a.map(({i:e})=>e);return H`
            <div
              class="wday ${e._isRealToday(o)?"today":""}"
              role="button"
              tabindex="0"
              title=${e._t("day")}
              @click=${()=>e._openDayView(o)}
              @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e._openDayView(o))}}
            >
              <b>${t[o]}</b>
            </div>
            ${i.length?H`
                  <div class="wshared ${e._isRealToday(o)?"today":""}">
                    ${i.map(t=>{const o=e._eventColor(t),a=e._isTentative(t),i=e._sharedGridStyle(t,r);return"display:none"===i?W:H`
                        <div
                          class="wshared-chip ${e._isPast(t)?"past":""} ${a?"tentative":""}"
                          style="${i};border-left:2.5px ${a?"dashed":"solid"} ${o};background:${o}28;background:color-mix(in srgb, ${o} 18%, var(--card-background-color, #fff))"
                          title="${e._evTitle(t)}"
                          tabindex="0"
                          role="button"
                          @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                          @keydown=${o=>e._onItemKey(o,t)}
                        >
                          <span class="shared-tag">${e._sharedLabel(t)}</span>
                          <span
                            >${e._calIconEl(t)}${t.continuesBefore?"« ":""}${e._evTitle(t)}${t.continuesAfter?" »":""}</span
                          >
                          ${t.allDay?H`<small>${e._t("all_day")}</small>`:H`<small
                                >${Ee(e.hass,t.startMin)}–${Ee(e.hass,t.endMin)}</small
                              >`}
                        </div>
                      `})}
                  </div>
                  <div class="wspacer ${e._isRealToday(o)?"today":""}"></div>
                `:W}
            ${a.map(({p:t,i:a})=>{const i=e._personCanCreate(t);return H`
                <div
                  class="wcell ${e._isRealToday(o)?"today":""} ${i?"creatable":""}"
                  @click=${()=>i&&e._openCreate(a,o)}
                >
                  ${e._eventsFor(o,a).map(t=>{const o=e._eventColor(t),a=e._isTentative(t);return H`
                      <div
                        class="wchip ${e._isPast(t)?"past":""} ${a?"tentative":""} ${e._isTodo(t)?"todo":""}"
                        style="border-left:2.5px ${a?"dashed":"solid"} ${o};background:${o}30;background:color-mix(in srgb, ${o} 22%, var(--card-background-color, #fff))"
                        title="${e._evTitle(t)}"
                        tabindex="0"
                        role="button"
                        @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                        @keydown=${o=>e._onItemKey(o,t)}
                      >
                        <span class=${e._isTodo(t)?"todo-line":""}
                          >${e._isTodo(t)?e._renderTodoCheckbox(t):W}${e._isTodo(t)?H`<span class="todo-label"
                                >${e._calIconEl(t)}${t.continuesBefore?"« ":""}${e._evTitle(t)}</span
                              >`:H`${e._calIconEl(t)}${t.continuesBefore?"« ":""}${e._evTitle(t)}`}</span
                        >
                        ${t.allDay?W:H`<small>${Ee(e.hass,t.startMin)}</small>`}
                      </div>
                    `})}
                </div>
              `})}
          `})}
      </div>
    </div>
  `}(this):"month"===this._view?function(e){const{gridStart:t,weeks:o,month:a,year:i}=e._monthGrid(),r=7*o,n=Pe(e.hass,"short",e._firstDayJs),s=e.hass.locale?.language||"en",l=new Intl.DateTimeFormat(s,{month:"long",year:"numeric"}).format(new Date(i,a,1)),d=new Map;for(const o of e._raw)if(!e._isOff(o.personIdx))for(const e of we(o,t,r)){const t=d.get(e.day);t?t.push(e):d.set(e.day,[e])}const c=Ye(new Date).getTime();return H`
    <div class="weekhead">
      <div class="weeknav">
        <button class="nav" aria-label=${e._t("prev_month")} @click=${e._prevMonth}>‹</button>
        <button class="nav-now" @click=${e._thisMonth}>${l}</button>
        <button class="nav" aria-label=${e._t("next_month")} @click=${e._nextMonth}>›</button>
      </div>
    </div>
    ${e._loadError?H`<div class="banner">${e._t("load_error")}</div>`:W}
    <div class="monthwrap">
      <div class="monthhead">${n.map(e=>H`<div class="mhcell">${e}</div>`)}</div>
      <div class="monthgrid">
        ${Array.from({length:r},(o,i)=>{const r=new Date(t.getTime()+i*xe),n=r.getMonth()===a,s=r.getTime()===c,l=(d.get(i)||[]).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin);return H`
            <div
              class="mcell ${n?"":"out"} ${s?"today":""} ${0===r.getDay()||6===r.getDay()?"wkend":""}"
              role="button"
              tabindex="0"
              @click=${()=>e._goToDate(r)}
              @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e._goToDate(r))}}
            >
              <div class="mdate ${s?"today":""}">${r.getDate()}</div>
              <div class="mchips">
                ${l.slice(0,3).map(t=>{const o=e._eventColor(t),a=e._isTentative(t);return H`<div
                    class="mchip ${e._isPast(t)?"past":""} ${a?"tentative":""} ${e._isShared(t)?"shared":""} ${e._isTodo(t)?"todo":""}"
                    style="background:${o}30;background:color-mix(in srgb, ${o} 22%, var(--card-background-color, #fff));border-left:2px ${a?"dashed":"solid"} ${o}"
                    title="${e._eventOwnerLabel(t)} · ${e._evTitle(t)}"
                    @click=${o=>{o.stopPropagation(),e._openEvent(t)}}
                  >
                    ${e._isTodo(t)?H`<span class="todo-line">
                          ${e._renderTodoCheckbox(t)}
                          <span class="todo-label"
                            >${t.continuesBefore?"« ":""}${e._evTitle(t)}</span
                          >
                        </span>`:H`${t.continuesBefore?"« ":""}${e._evTitle(t)}`}
                  </div>`})}
                ${l.length>3?H`<div class="mmore">+${l.length-3}</div>`:W}
              </div>
            </div>
          `})}
      </div>
    </div>
  `}(this):dt(this)}
        ${function(e){return 0===e._creators().length?W:H`<button
    class="plfab"
    aria-label=${e._t("add_event")}
    @click=${()=>e._openCreateFor(e._createDate())}
  >
    <ha-icon icon="mdi:plus"></ha-icon>
  </button>`}(this)}
      </ha-card>
      ${this._dialog?function(e){const t=e._dialog,o="edit"===t.mode&&!t.canUpdate,a=e._calLabel(t.calendar),i="create"===t.mode?e._t("new_event"):o?e._t("event"):e._t("edit_event");return H`
    <div
      class="overlay"
      @click=${t=>{t.target===t.currentTarget&&e._closeDialog()}}
    >
      <div class="dialog" role="dialog" aria-modal="true" aria-label=${i}>
        <div class="dlg-head">
          <span>${i}</span>
          <button class="icon" aria-label=${e._t("close")} @click=${e._closeDialog}>✕</button>
        </div>
        ${"create"===t.mode&&t.pickPersons&&t.pickPersons.length>1?H`<div class="fld">
              <span>${e._t("for_whom")}</span>
              <div class="whom">
                ${t.pickPersons.map(o=>{if(o===He){const a=e._writableFor(o),i=e._calMeta(a[0]).color??et(a[0]??"shared");return H`<button
                      class="pchip ${o===t.personIdx?"sel":""}"
                      aria-pressed=${o===t.personIdx}
                      style="--c:${i}"
                      @click=${()=>e._pickDialogPerson(o)}
                    >
                      <span class="avatar initials" style="background:${i}"
                        ><ha-icon icon="mdi:account-group"></ha-icon></span
                      ><span>${e._t("shared_events")}</span>
                    </button>`}const a=e._persons[o];return H`<button
                    class="pchip ${o===t.personIdx?"sel":""}"
                    aria-pressed=${o===t.personIdx}
                    style="--c:${Qe(a,o)}"
                    @click=${()=>e._pickDialogPerson(o)}
                  >
                    ${e._avatar(a,o)}<span>${e._personName(a,o)}</span>
                  </button>`})}
              </div>
            </div>`:W}
        ${t.calendarOptions&&t.calendarOptions.length>1?H`<label class="fld">
              <span>${e._t("field_calendar")}</span>
              ${gt(t.calendarOptions.join(","),H`<select
                    .value=${t.calendar}
                    @change=${t=>e._dlgField("calendar",t.target.value)}
                  >
                    ${t.calendarOptions.map(o=>H`<option value=${o} ?selected=${o===t.calendar}>
                          ${e._calLabel(o)}
                        </option>`)}
                  </select>`)}
            </label>`:H`<div class="dlg-cal">${a}</div>`}

        <label class="fld">
          <span>${e._t("field_title")}</span>
          <input
            type="text"
            .value=${t.summary}
            ?disabled=${o}
            autofocus
            @input=${t=>e._dlgField("summary",t.target.value)}
          />
        </label>

        <label class="chk">
          <input
            type="checkbox"
            .checked=${t.allDay}
            ?disabled=${o}
            @change=${t=>e._toggleAllDay(t.target.checked)}
          />
          <span>${e._t("field_all_day")}</span>
        </label>

        <div class="row">
          <label class="fld">
            <span>${e._t("field_start")}</span>
            <input
              type=${t.allDay?"date":"datetime-local"}
              .value=${t.start}
              ?disabled=${o}
              @input=${t=>e._dlgField("start",t.target.value)}
            />
          </label>
          <label class="fld">
            <span>${e._t("field_end")}</span>
            <input
              type=${t.allDay?"date":"datetime-local"}
              .value=${t.end}
              ?disabled=${o}
              @input=${t=>e._dlgField("end",t.target.value)}
            />
          </label>
        </div>

        <label class="fld">
          <span>
            ${e._t("field_location")}
            ${t.location.trim()?H`<a
                  class="maplink"
                  href=${e._mapUrl(t.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  @click=${e=>e.stopPropagation()}
                  >${e._t("open_map")}</a
                >`:W}
          </span>
          <input
            type="text"
            .value=${t.location}
            ?disabled=${o}
            @input=${t=>e._dlgField("location",t.target.value)}
          />
        </label>

        <label class="fld">
          <span>${e._t("field_note")}</span>
          <textarea
            rows="2"
            .value=${t.description}
            ?disabled=${o}
            @input=${t=>e._dlgField("description",t.target.value)}
          ></textarea>
        </label>

        ${"edit"===t.mode&&t.recurring&&!o?H`<div class="recur">
              <span class="recur-label">${e._t("recurring")}</span>
              <label class="recur-opt">
                <input
                  type="radio"
                  name="recur"
                  ?checked=${""===t.recurrenceRange}
                  @change=${()=>e._dlgField("recurrenceRange","")}
                />
                <span>${e._t("recur_this")}</span>
              </label>
              <label class="recur-opt">
                <input
                  type="radio"
                  name="recur"
                  ?checked=${"THISANDFUTURE"===t.recurrenceRange}
                  @change=${()=>e._dlgField("recurrenceRange","THISANDFUTURE")}
                />
                <span>${e._t("recur_future")}</span>
              </label>
            </div>`:W}
        ${o?H`<div class="ro-note">${e._t("read_only")}</div>`:W}
        ${t.error?H`<div class="dlg-error">${t.error}</div>`:W}

        <div class="dlg-actions">
          ${"edit"===t.mode&&t.canDelete?H`<button class="danger" ?disabled=${t.busy} @click=${e._deleteDialog}>
                ${e._t("delete")}
              </button>`:W}
          <span class="spacer"></span>
          <button class="ghost" ?disabled=${t.busy} @click=${e._closeDialog}>
            ${e._t("cancel")}
          </button>
          ${o?W:H`<button class="primary" ?disabled=${t.busy} @click=${e._saveDialog}>
                ${t.busy?"…":e._t("save")}
              </button>`}
        </div>
      </div>
    </div>
  `}(this):this._todoDialog?function(e){const t=e._todoDialog,o=!t.canUpdate,a=o?e._t("todo"):e._t("edit_todo");return H`
    <div
      class="overlay"
      @click=${t=>{t.target===t.currentTarget&&e._closeTodoDialog()}}
    >
      <div class="dialog" role="dialog" aria-modal="true" aria-label=${a}>
        <div class="dlg-head">
          <span>${a}</span>
          <button class="icon" aria-label=${e._t("close")} @click=${e._closeTodoDialog}>
            ✕
          </button>
        </div>
        <div class="dlg-cal">${e._todoLabel(t.entityId)}</div>
        <label class="fld">
          <span>${e._t("field_title")}</span>
          <input
            type="text"
            .value=${t.summary}
            ?disabled=${o}
            autofocus
            @input=${t=>e._todoDlgField("summary",t.target.value)}
          />
        </label>
        ${t.supportsDueDate?H`<label class="fld">
              <span>${e._t("field_due")}</span>
              <input
                type=${t.supportsDueDatetime?"datetime-local":"date"}
                .value=${t.due}
                ?disabled=${o}
                @input=${t=>e._todoDlgField("due",t.target.value)}
              />
            </label>`:W}
        ${t.supportsDescription?H`<label class="fld">
              <span>${e._t("field_note")}</span>
              <textarea
                rows="2"
                .value=${t.description}
                ?disabled=${o}
                @input=${t=>e._todoDlgField("description",t.target.value)}
              ></textarea>
            </label>`:W}
        ${t.error?H`<div class="dlg-error">${t.error}</div>`:W}
        <div class="dlg-actions">
          ${t.canUpdate?H`<button class="ghost" ?disabled=${t.busy} @click=${e._completeTodoDialog}>
                ${e._t("todo_complete")}
              </button>`:W}
          ${t.canDelete?H`<button class="danger" ?disabled=${t.busy} @click=${e._deleteTodoDialog}>
                ${e._t("delete")}
              </button>`:W}
          <span class="spacer"></span>
          <button class="ghost" ?disabled=${t.busy} @click=${e._closeTodoDialog}>
            ${e._t("cancel")}
          </button>
          ${o?W:H`<button class="primary" ?disabled=${t.busy} @click=${e._saveTodoDialog}>
                ${t.busy?"…":e._t("save")}
              </button>`}
        </div>
      </div>
    </div>
  `}(this):this._todoBadgeDialog?function(e){const t=e._todoBadgeDialog,o=e._personName(e._persons[t.personIdx],t.personIdx),a=e._todoItemsForPerson(t.personIdx);return H`
    <div
      class="overlay"
      @click=${t=>{t.target===t.currentTarget&&e._closeTodoBadgeDialog()}}
    >
      <div class="dialog todo-badge-dialog" role="dialog" aria-modal="true" aria-label=${o}>
        <div class="dlg-head">
          <span>${o} · ${a.length} ${e._t("todo_items")}</span>
          <button class="icon" aria-label=${e._t("close")} @click=${e._closeTodoBadgeDialog}>
            ✕
          </button>
        </div>
        <div class="todo-badge-list">
          ${a.map(t=>{const o=e._formatTodoDue(t.due);return H`
              <div
                class="todo-badge-item"
                role="button"
                tabindex="0"
                @click=${()=>e._openTodoFromBadge(t)}
                @keydown=${o=>{"Enter"!==o.key&&" "!==o.key||(o.preventDefault(),e._openTodoFromBadge(t))}}
                title=${t.summary}
              >
                ${e._renderTodoItemCheckbox(t)}
                <span class="todo-badge-copy">
                  <span class="todo-badge-title">${t.summary}</span>
                  <span class="todo-badge-meta"
                    >${t.listLabel}${o?` · ${o}`:""}</span
                  >
                </span>
              </div>
            `})}
        </div>
      </div>
    </div>
  `}(this):W}
    `;var t}get _homeZone(){return this._config.home_zone||"zone.home"}_presence(e){if(!1===this._config.show_presence||!e.person)return;const t=this.hass.states[e.person]?.state;if(!t||"unknown"===t||"unavailable"===t)return;const o=this.hass.states[this._homeZone]?.attributes?.friendly_name;return"home"===t||o&&t===o?{kind:"home",label:this._t("status_home")}:"not_home"===t?{kind:"away",label:this._t("status_away")}:{kind:"zone",label:t}}_presenceLabel(e,t){const o=this._presence(e),a=this._personName(e,t);return o?H`<span class="pcname"><span>${a}</span><small>${o.label}</small></span>`:H`<span>${a}</span>`}get _countdownCfg(){const e=this._config.countdowns;if(!e)return;const t="object"==typeof e?e:{};return{marker:t.marker||"⏳",days:Math.min(730,Math.max(1,Number(t.days??365)||365)),max:Math.min(6,Math.max(1,Number(t.max??3)||3))}}_allCalendars(){const e=new Map;this._config.persons.forEach((t,o)=>{for(const a of this._calsOf(t))e.has(a)||e.set(a,Qe(t,o))});for(const t of this._sharedCalendarIds())e.set(t,this._calMeta(t).color??e.get(t)??et(t));return Array.from(e,([e,t])=>({cal:e,color:t})).filter(({cal:e})=>this.hass.states[e])}async _maybeFetchCountdowns(){const e=this._countdownCfg;if(!e)return this._countdowns.length&&(this._countdowns=[]),void(this._countdownKey="");const t=this._allCalendars(),o=`${e.marker}|${e.days}|${t.map(e=>e.cal).join(",")}|${Math.floor(Date.now()/18e5)}`;if(o===this._countdownKey)return;this._countdownKey=o;const a=Ye(new Date),i=new Date(a.getFullYear(),a.getMonth(),a.getDate()+e.days),r=new Map;await Promise.all(t.map(async({cal:t,color:o})=>{try{const n=await this.hass.callApi("GET",`calendars/${t}?start=${encodeURIComponent(a.toISOString())}&end=${encodeURIComponent(i.toISOString())}`);for(const i of n){const n=String(i?.summary??"");if(!n.includes(e.marker))continue;const s=ye(i,0,t,o,!1);if(!s||s.start.getTime()<a.getTime())continue;const l=Ie(this._cleanTitle(n),e.marker),d=`${l.toLowerCase()}|${qe(s.start)}`;r.has(d)||r.set(d,{title:l,start:s.start,color:this._calMeta(t).color??o})}}catch(e){}})),this._countdowns=Array.from(r.values()).sort((e,t)=>e.start.getTime()-t.start.getTime()).slice(0,e.max)}_countdownText(e){return e<=0?this._t("cd_today"):1===e?this._t("cd_tomorrow"):this._t("cd_days").replace("{n}",String(e))}_coordsOf(e){const t=Be(e);if(t)return t;const o=this.hass.states[e]?.attributes,a=Number(o?.latitude),i=Number(o?.longitude);return Number.isFinite(a)&&Number.isFinite(i)?{lat:a,lon:i}:void 0}async _locate(e,t){const o=this._config.travel?.places??{},a=e.toLowerCase();for(const[e,t]of Object.entries(o))if(e&&a.includes(e.toLowerCase()))return this._coordsOf(t);const i=Be(e);if(i)return i;if(!1!==this._config.travel?.geocode)for(const o of function(e){const t=e.split(/\n+/).map(e=>e.replace(/,?\s*(Deutschland|Germany|DE)\s*$/i,"").trim()).filter(Boolean);if(0===t.length)return[];const o=[];return t.length>1&&!/\d/.test(t[0])&&o.push(t.slice(1).join(", ")),o.push(t.join(", ")),Array.from(new Set(o))}(e)){const e=`fbc-geo:${o.toLowerCase()}`;let a;try{const t=localStorage.getItem(e);t&&(a=JSON.parse(t))}catch(e){}if(void 0===a){const i=[t.lon-.6,t.lat+.6,t.lon+.6,t.lat-.6].join(",");try{const e=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&viewbox=${i}&q=${encodeURIComponent(o)}`,{headers:{"Accept-Language":this.hass.locale?.language||"en"}});if(!e.ok)return;const t=await e.json();a=t[0]?{lat:Number(t[0].lat),lon:Number(t[0].lon)}:null}catch(e){return}try{localStorage.setItem(e,JSON.stringify(a))}catch(e){}await new Promise(e=>setTimeout(e,1100))}if(a&&Ne(t,a)<300)return a}}async _updateTravel(){const e=this._config?.travel;if(!e||this._travelBusy||!this.hass)return;const t=this._coordsOf(e.origin||this._homeZone);if(!t)return;const o=Date.now(),a=6e4*Math.max(15,Number(e.lead??120)||120),i=new Set;for(const e of this._raw){const t=e.location?.trim();if(!t||e.allDay||"todo"===e.kind||Fe(t))continue;const r=e.start.getTime();r>o&&r-o<=a&&i.add(t)}this._travelBusy=!0;try{for(const a of i){const i=this._travel.get(a),r=i&&void 0===i.min?108e5:6e5;if(i&&o-i.at<r)continue;const n=await this._locate(a,t);let s;if(n&&Ne(t,n)>=.4)try{const o=await this.hass.callWS({type:"call_service",domain:"waze_travel_time",service:"get_travel_times",service_data:{origin:`${t.lat},${t.lon}`,destination:`${n.lat},${n.lon}`,region:e.region||"eu",vehicle_type:e.vehicle_type||"car"},return_response:!0}),a=o?.response?.routes??[],i=Math.min(...a.map(e=>Number(e.duration)).filter(Number.isFinite));Number.isFinite(i)&&(s=Math.round(i))}catch(e){}this._travel.set(a,{at:Date.now(),min:s}),this._travelRev++}}finally{this._travelBusy=!1}}_leaveFor(e){const t=this._config.travel,o=e.location?.trim();if(!t||!o||e.allDay||"todo"===e.kind)return;const a=new Date,i=6e4*Math.max(15,Number(t.lead??120)||120);if(e.start.getTime()<=a.getTime()||e.start.getTime()-a.getTime()>i)return;const r=this._travel.get(o)?.min;return void 0!==r?function(e,t,o,a=5,i=15){const r=new Date(t.getTime()-6e4*Math.round(o+a)),n=Math.ceil((r.getTime()-e.getTime())/6e4);return{leaveAt:r,minutes:n,level:n<=0?"now":n<=i?"soon":"info"}}(a,e.start,r,Number(t.buffer??5)):void 0}_leaveText(e){return"now"===e.level?this._t("leave_now"):"soon"===e.level?this._t("leave_in").replace("{n}",String(e.minutes)):this._t("leave_at").replace("{t}",Ce(this.hass,e.leaveAt))}_renderLeave(e){if(e.continuesBefore)return W;const t=this._leaveFor(e.ref);if(!t)return W;const o=this._travel.get(e.ref.location.trim())?.min,a="now"===t.level?this._t("tile_leave_now"):"soon"===t.level?this._t("tile_leave_in").replace("{n}",String(t.minutes)):this._t("tile_leave_at").replace("{t}",Ce(this.hass,t.leaveAt));return H`<div class="plleave ${t.level}" title="${o} ${this._t("minutes_short")}">
      <ha-icon icon="mdi:car"></ha-icon><span>${a}</span>
    </div>`}_runNotice(e){const t=e.action;if(!t?.action||!t.action.includes("."))return;const[o,a]=t.action.split(".",2),i=this.hass.states[e.entity]?.state??"";this._noticeDone={...this._noticeDone,[e.entity]:{state:i,at:Date.now()}},this.hass.callService(o,a,t.data??{},t.target)}get _plannerDays(){const e=Number(this._config?.planner_days??7);return Number.isFinite(e)?Math.min(14,Math.max(1,Math.round(e))):7}_plannerWindow(){return function(e,t,o){const a=Math.max(1,Math.round(t)),i=new Date(e.getFullYear(),e.getMonth(),e.getDate()+o*a),r=new Date(i.getFullYear(),i.getMonth(),i.getDate()+a);return{start:i,end:r}}(new Date,this._plannerDays,this._planOffset)}_plannerSwipe(e,t,o){const a=e-this._swipeX,i=t-this._swipeY;Math.abs(a)<70||Math.abs(i)>.6*Math.abs(a)||o.scrollWidth>o.clientWidth+2||(this._suppressClick=!0,setTimeout(()=>this._suppressClick=!1,0),this._planOffset+=a<0?1:-1)}_writableFor(e){if(e===He)return this._sharedCalendarIds().filter(e=>this.hass.states[e]&&this._canCreate(e));const t=this._persons[e];return t?this._writableCals(t):[]}_creators(){const e=this._persons.map((e,t)=>t).filter(e=>!this._isOff(e)&&this._writableFor(e).length>0);return this._writableFor(He).length>0&&e.push(He),e}_createDate(){const e=new Date;switch(this._view){case"planner":return 0===this._planOffset?e:this._plannerWindow().start;case"day":case"timeline":{const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];return this._dateForDay(e)}case"month":{if(0===this._monthOffset)return e;const{month:t,year:o}=this._monthGrid();return new Date(o,t,1)}default:return 0===this._weekOffset?e:this._weekBounds().monday}}_openCreateFor(e){const t=this._creators();if(0===t.length)return;let o;if(Ye(e).getTime()===Ye(new Date).getTime()){const e=new Date;o=Math.min(1380,60*(e.getHours()+1))}this._openCreateAt(t[0],e,o,t.length>1?t:void 0)}_pickDialogPerson(e){const t=this._dialog;if(!t)return;const o=this._writableFor(e);0!==o.length&&(this._dialog={...t,personIdx:e,calendar:o[0],calendarOptions:o.length>1?o:void 0})}_focusFor(e){const t=Date.now(),o=this._raw.filter(t=>t.personIdx===e&&!t.allDay&&"todo"!==t.kind).sort((e,t)=>e.start.getTime()-t.start.getTime()),a=o.find(e=>e.start.getTime()<=t&&t<e.end.getTime()),i=o.find(e=>e.start.getTime()>t);return{current:a,next:i}}_onTimelineClick(e,t,o,a,i){const r=this._persons[t];if(!this._personCanCreate(r))return;const n=e.currentTarget.getBoundingClientRect();let s=i+(e.clientX-n.left)/a;const l=this._grid;s=Math.round(s/l)*l,s=Math.max(0,Math.min(s,1440-l)),this._openCreate(t,o,s)}_statusLabel(e){return"home"===e?this._t("status_home"):"not_home"===e?this._t("status_away"):"unknown"===e||"unavailable"===e?"–":e}_onColClick(e,t,o,a,i){const r=this._persons[t];if(!this._personCanCreate(r))return;const n=e.currentTarget.getBoundingClientRect();let s=i+(e.clientY-n.top)/a;const l=this._grid;s=Math.round(s/l)*l,s=Math.max(0,Math.min(s,1440-l)),this._openCreate(t,o,s)}_openCreate(e,t,o){this._openCreateAt(e,this._dateForDay(t),o)}_openCreateAt(e,t,o,a){const i=this._writableFor(e);if(0===i.length)return;const r=o??Math.max(this._startMin,540),n=new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,r),s=new Date(n.getTime()+36e5);this._dialog={mode:"create",personIdx:e,calendar:i[0],calendarOptions:i.length>1?i:void 0,pickPersons:a,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:Ve(n),end:Ve(s),recurrenceRange:""}}_openEvent(e){const t=e.ref;if("todo"===t.kind)return void this._openTodo({entityId:t.calendar,uid:t.uid,summary:t.summary,status:"needs_action",due:t.todo_due,description:t.description,listLabel:this._todoLabel(t.calendar)});const o=t.calendar,a=this._canUpdate(o)&&!!t.uid,i=this._canDelete(o)&&!!t.uid;this._dialog={mode:"edit",personIdx:t.personIdx,calendar:o,uid:t.uid,recurrence_id:t.recurrence_id,recurring:!(!t.recurrence_id&&!t.rrule),recurrenceRange:"",canUpdate:a,canDelete:i,summary:t.summary,location:t.location??"",description:t.description??"",allDay:t.allDay,start:t.allDay?qe(t.start):Ve(t.start),end:t.allDay?qe(new Date(t.end.getTime()-xe)):Ve(t.end)}}_dlgField(e,t){this._dialog&&(this._dialog={...this._dialog,[e]:t,error:void 0})}_toggleAllDay(e){if(!this._dialog)return;const t=this._dialog;e&&!t.allDay?this._dialog={...t,allDay:e,start:t.start.slice(0,10),end:t.end.slice(0,10),error:void 0}:!e&&t.allDay&&(this._dialog={...t,allDay:e,start:`${t.start}T09:00`,end:`${t.end}T10:00`,error:void 0})}_buildPayload(e){const t={summary:e.summary.trim()||this._t("default_title")};if(e.location.trim()&&(t.location=e.location.trim()),e.description.trim()&&(t.description=e.description.trim()),e.allDay){const o=new Date(`${e.end}T00:00:00`);o.setDate(o.getDate()+1),t.dtstart=e.start,t.dtend=qe(o)}else t.dtstart=new Date(e.start).toISOString(),t.dtend=new Date(e.end).toISOString();return t}_validate(e){const t=e.allDay?new Date(`${e.start}T00:00:00`):new Date(e.start),o=e.allDay?new Date(`${e.end}T00:00:00`):new Date(e.end);return isNaN(t.getTime())||isNaN(o.getTime())?this._t("err_invalid"):o.getTime()<t.getTime()?this._t("err_end_before"):e.allDay||o.getTime()!==t.getTime()?null:this._t("err_end_equal")}_draggable(e){return!1!==this._config.drag_drop&&!this._isTodo(e)&&!e.allDay&&!e.ref.rrule&&!!e.ref.uid&&this._canUpdate(e.ref.calendar)&&!e.continuesBefore&&!e.continuesAfter}_onEventPointerDown(e,t,o){0===e.button&&this._draggable(t)&&(e.stopPropagation(),this._dragStartY=e.clientY,this._dragPx=this._pxPerMin,this._dragGrid=this._grid,this._drag={raw:t.ref,mode:o,deltaMin:0,moved:!1,busy:!1},e.target.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp))}async _commitDrag(e){const t=e.raw,{start:o,end:a}=function(e,t,o,a,i){const r=Math.max(1,i),n=new Date(e);n.setHours(0,0,0,0);const s=n.getTime(),l=(e.getTime()-s)/6e4,d=(t.getTime()-e.getTime())/6e4;if("move"===a){const e=Math.round((l+o)/r)*r,t=new Date(s+6e4*e);return{start:t,end:new Date(t.getTime()+6e4*d)}}let c=Math.round((d+o)/r)*r;return c<r&&(c=r),{start:e,end:new Date(e.getTime()+6e4*c)}}(t.start,t.end,e.deltaMin,e.mode,this._dragGrid);if(o.getTime()!==t.start.getTime()||a.getTime()!==t.end.getTime()){this._drag={...e,busy:!0};try{const e={summary:t.summary,dtstart:o.toISOString(),dtend:a.toISOString()};t.location&&(e.location=t.location),t.description&&(e.description=t.description),await this.hass.callWS({type:"calendar/event/update",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:"",event:e}),this._drag=void 0,await this._refetch()}catch(e){this._drag=void 0,this._loadError=!1,await this._refetch()}}else this._drag=void 0}async _saveDialog(){if(!this._dialog)return;const e=this._dialog,t=this._validate(e);if(t)this._dialog={...e,error:t};else{this._dialog={...e,busy:!0,error:void 0};try{const t=this._buildPayload(e);"create"===e.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:e.calendar,event:t}):await this.hass.callWS({type:"calendar/event/update",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:"",event:t}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const e=this._dialog;this._dialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:""}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}_closeDialog(){this._dialog=void 0}}mt.styles=ft,e([pe({attribute:!1})],mt.prototype,"hass",void 0),e([he()],mt.prototype,"_config",void 0),e([he()],mt.prototype,"_events",void 0),e([he()],mt.prototype,"_view",void 0),e([he()],mt.prototype,"_day",void 0),e([he()],mt.prototype,"_weekOffset",void 0),e([he()],mt.prototype,"_monthOffset",void 0),e([he()],mt.prototype,"_planOffset",void 0),e([he()],mt.prototype,"_dialog",void 0),e([he()],mt.prototype,"_todoDialog",void 0),e([he()],mt.prototype,"_todoBadgeDialog",void 0),e([he()],mt.prototype,"_loadError",void 0),e([he()],mt.prototype,"_loading",void 0),e([he()],mt.prototype,"_todoBusy",void 0),e([he()],mt.prototype,"_todoItemsByOwner",void 0),e([he()],mt.prototype,"_fitPx",void 0),e([he()],mt.prototype,"_hiddenP",void 0),e([he()],mt.prototype,"_drag",void 0),e([he()],mt.prototype,"_forecast",void 0),e([he()],mt.prototype,"_countdowns",void 0),e([he()],mt.prototype,"_travelRev",void 0),e([he()],mt.prototype,"_noticeDone",void 0),customElements.get("family-board-card")||customElements.define("family-board-card",mt),window.customCards=window.customCards||[],window.customCards.push({type:"family-board-card",name:"Family Board Card",description:"Family calendar / who-is-where board for multiple people – day, timeline, week, month and agenda views.",preview:!0,documentationURL:"https://github.com/renespeaker/ha-family-board-card"}),console.info("%c FAMILY-BOARD-CARD %c v0.31.1 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const bt={l_title:"Card title",l_refresh_interval:"Auto refresh (sec., 0 = off)",l_view:"Default view",l_views:"Available views (switcher)",l_time_grid:"Time grid",l_start_hour:"Start hour",l_end_hour:"End hour",l_hour_height:"Height per hour",l_hour_width:"Timeline: width per hour",l_fit_height:"Auto-fit: squeeze the day so it fits without scrolling",l_full_height:"Full height: stretch to the bottom of the screen",l_trim_hours:"Hide empty hours at the edges",l_col_min_width:"Min. column width per person",l_background_hours:"Show long events as a background band from (hrs.)",l_max_columns:"Max. columns per day",l_first_day:"Week starts on",l_scroll_to_now:"Auto-scroll to now",l_color_by:"Color by",l_show_weekends:"Show weekend",l_show_now_line:"Now line",l_dim_past:"Dim past events",l_show_progress:"Show progress bar",l_hide_patterns:"Hide events",l_show_patterns:"Only show events matching",l_replace_patterns:"Replace titles",l_filter_duplicates:"Merge duplicate events",l_tentative_patterns:"Mark as tentative",l_auto_icons:"Auto icons by keyword",l_icon_patterns:"Custom icon rules",l_show_focus:"“Now / next” bar",l_drag_drop:"Move events by dragging (day view)",l_weather_entity:"Weather entity",l_show_weather:"Show weather",l_hide_empty_persons:"Week: hide persons without events",l_auto_return:"Return to the start view after idle (min., 0 = off)",l_event_size:"Event font size",l_radius:"Corner radius of the blocks",l_past_opacity:"Opacity of past events",l_name:"Display name",l_person:"Person (avatar & status)",l_calendar:"Calendars (multiple possible)",l_todo:"To-do lists (multiple possible)",l_shared_todo:"Shared to-do lists",l_color:"Custom color (hex, optional)",l_badges:"Badges (e.g. battery, sensors)",l_hidden:"Hidden on start",l_compact:"Compact layout",l_map_url:"Map link (template)",l_planner_days:"Planner: number of days",l_clock_header:"Clock header for wall displays",l_countdowns:"Countdowns (events with ⏳)",l_show_presence:"Show who is where",l_home_zone:"Home zone",l_back_path:"Back button to (dashboard path)",l_auto_back:"Go back after idle (min., 0 = off)",l_shared_calendar:"Shared calendars",h_hide_patterns:"Text patterns, e.g. “Recess” – matches are hidden",h_show_patterns:"Allow list: only events whose title contains one of the patterns",h_replace_patterns:"e.g. “Homeroom => Lesson” (without => the text is removed)",h_tentative_patterns:"Matches are drawn dashed / translucent",h_filter_duplicates:"The same event in several calendars is shown only once",h_auto_return:"Kiosk: jumps back to “today” after X minutes without a touch",h_background_hours:"0 = off. Long all-day-ish events (after-school care …) as a subtle band",h_fit_height:"Compresses the day until everything is visible without scrolling",h_full_height:"For panel view / wall tablet",h_trim_hours:"Shows only the hours that actually contain events",h_col_min_width:"Below this the board scrolls horizontally",h_weather_entity:"Daily forecast in the header (HA location)",h_auto_icons:"e.g. doctor → 🩺, sport → 🏃, birthday → 🎂 (titles with emoji stay untouched)",h_icon_patterns:"Own rules, e.g. “Grandma => 👵”",h_show_focus:"Compact bar above the views: what is running now / coming next",h_drag_drop:"Writable calendars only; drag to move, bottom edge changes the duration",h_views:"Which switchers appear at the top",h_badges:"Small chips below the person header; click opens details",h_todo:"Open items from these to-do lists are shown directly in the calendar",h_shared_todo:"Items from these to-do lists are shown once as shared entries instead of inside a single person column",h_color:"Leave empty for the palette color",h_hidden:"Column starts collapsed; a click on the header brings it back",h_compact:"Smaller fonts and tighter spacing in a single switch",h_map_url:"{location} is substituted, e.g. https://maps.apple.com/?q={location}",h_planner_days:"Day columns starting today; swipe or ‹ › pages to the next days",h_clock_header:"Big clock, date and current weather instead of the title",h_countdowns:'Put ⏳ in an event title (e.g. "⏳ Holiday") and it is counted down in the header',h_show_presence:"Person chips show home / away / zone with a colored ring",h_home_zone:"Zone that counts as home (default zone.home); also the start for travel times",h_back_path:"e.g. /dashboard-tablet/home – shows a round back button",h_auto_back:"Kiosk: returns to that path after X minutes without a touch",h_shared_calendar:"Events from these calendars are shown once as cross-person bars instead of inside a single person column",o_person:"Person",o_location:"Location",o_calendar:"Calendar",o_monday:"Monday",o_sunday:"Sunday",g_views:"🗓️ Views",g_layout:"📐 Layout & size",g_filters:"🧹 Filters & clean-up",g_looks:"🎨 Appearance (fine-tuning)",g_kiosk:"🖥️ Kiosk & extras",w_title:"👨‍👩‍👧‍👦 Welcome to the family board!",w_text:"Ready in two clicks – the card detects your family automatically from the person and calendar entities of your Home Assistant.",w_detect:"✨ Step 1: detect persons automatically",w_hint:"Optionally afterwards: pick a profile (below) or fine-tune the settings in the groups. Of course you can also add persons by hand:",w_empty:"＋ Start empty",p_tablet:"🖥️ Wall tablet",p_tablet_title:"Full-screen planner with clock, returns to today",p_phone:"📱 Phone",p_phone_title:"Agenda as start view, compact columns",p_reset:"🧩 Default",p_reset_title:"Reset the layout settings",s_persons:"People",s_calendars:"Calendars (color & label)",s_settings:"Settings",b_add_person:"＋ Add person",b_detect:"✨ Detect automatically",b_up:"Move up",b_down:"Move down",b_remove:"Remove",b_auto:"Automatic",ph_label:"Custom label",ph_icon:"Icon, e.g. mdi:school",ph_title_field:"Title from field (e.g. description)",person_n:"Person",cal_hint_1:"Colors apply with “Color by: calendar”, labels in the event dialog. Icon = mdi icon in front of the title. “Title from field” uses e.g.",cal_hint_2:"instead of",cal_hint_3:"as the event title."},vt={en:bt,de:{l_title:"Kartentitel",l_refresh_interval:"Auto-Aktualisierung (Sek., 0 = aus)",l_view:"Standardansicht",l_views:"Verfügbare Ansichten (Umschalter)",l_time_grid:"Zeitraster",l_start_hour:"Startstunde",l_end_hour:"Endstunde",l_hour_height:"Höhe pro Stunde",l_hour_width:"Zeitstrahl: Breite pro Stunde",l_fit_height:"Auto-Fit: Tag ohne Scrollen einpassen",l_full_height:"Volle Höhe: bis zum unteren Bildschirmrand",l_trim_hours:"Leere Randstunden automatisch ausblenden",l_col_min_width:"Min. Spaltenbreite pro Person",l_background_hours:"Lange Termine als Hintergrund-Band ab (Std.)",l_max_columns:"Max. Spalten pro Tag",l_first_day:"Wochenstart",l_scroll_to_now:"Auto-Scroll zu jetzt",l_color_by:"Einfärben nach",l_show_weekends:"Wochenende anzeigen",l_show_now_line:"Jetzt-Linie",l_dim_past:"Vergangene Termine ausgrauen",l_show_progress:"Fortschrittsbalken anzeigen",l_hide_patterns:"Termine ausblenden",l_show_patterns:"Nur Termine zeigen mit",l_replace_patterns:"Titel ersetzen",l_filter_duplicates:"Doppelte Termine zusammenfassen",l_tentative_patterns:"Als vorläufig markieren",l_auto_icons:"Auto-Symbole nach Stichwort",l_icon_patterns:"Eigene Symbol-Regeln",l_show_focus:"„Jetzt / als Nächstes“-Leiste",l_drag_drop:"Termine per Ziehen verschieben (Tagesansicht)",l_weather_entity:"Wetter-Entität",l_show_weather:"Wetter anzeigen",l_hide_empty_persons:"Woche: Personen ohne Termine ausblenden",l_auto_return:"Nach Inaktivität zur Startansicht (Min., 0 = aus)",l_event_size:"Schriftgröße Termine",l_radius:"Ecken-Radius der Blöcke",l_past_opacity:"Deckkraft vergangener Termine",l_name:"Anzeigename",l_person:"Person (Avatar & Status)",l_calendar:"Kalender (mehrere möglich)",l_todo:"To-do-Listen (mehrere möglich)",l_shared_todo:"Gemeinsame To-do-Listen",l_color:"Eigene Farbe (Hex, optional)",l_badges:"Badges (z. B. Akku, Sensoren)",l_hidden:"Beim Start ausgeblendet",l_compact:"Kompakte Darstellung",l_map_url:"Karten-Link (Vorlage)",l_planner_days:"Planer: Anzahl Tage",l_clock_header:"Uhr-Kopf für Wandanzeigen",l_countdowns:"Countdowns (Termine mit ⏳)",l_show_presence:"Zeigen, wer wo ist",l_home_zone:"Zuhause-Zone",l_back_path:"Zurück-Knopf zu (Dashboard-Pfad)",l_auto_back:"Nach Inaktivität zurück (Min., 0 = aus)",l_shared_calendar:"Gemeinsame Kalender",h_hide_patterns:"Textmuster, z. B. „Hofpause“ – Treffer werden ausgeblendet",h_show_patterns:"Allow-Liste: nur Termine, deren Titel eines der Muster enthält",h_replace_patterns:"z. B. „Klassenverbund => Unterricht“ (ohne => wird der Text entfernt)",h_tentative_patterns:"Treffer werden gestrichelt/transparent dargestellt",h_filter_duplicates:"Gleicher Termin in mehreren Kalendern nur einmal",h_auto_return:"Kiosk: springt nach X Minuten ohne Berührung zurück zu „heute“",h_background_hours:"0 = aus. Lange Dauertermine (OGS, Betreuung …) als dezentes Band",h_fit_height:"Staucht den Tag, bis alles ohne Scrollen sichtbar ist",h_full_height:"Für Panel-Ansicht / Wandtablet",h_trim_hours:"Zeigt nur die Stunden, in denen wirklich Termine liegen",h_col_min_width:"Darunter wird horizontal gescrollt",h_weather_entity:"Tages-Vorhersage im Kopf (HA-Standort)",h_auto_icons:"z. B. Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂 (Titel mit Emoji bleiben unberührt)",h_icon_patterns:"eigene Regeln, z. B. „Oma => 👵“",h_show_focus:"Kompakte Leiste über den Ansichten: was läuft jetzt / kommt als Nächstes",h_drag_drop:"Nur bei schreibbaren Kalendern; Ziehen verschiebt, unterer Rand ändert die Dauer",h_views:"Welche Umschalter oben erscheinen",h_badges:"Kleine Chips unter dem Personenkopf; Klick öffnet Details",h_todo:"Offene Einträge aus diesen To-do-Listen werden direkt im Kalender angezeigt",h_shared_todo:"Einträge aus diesen To-do-Listen werden einmal als gemeinsame Einträge dargestellt statt nur in einer Personenspalte",h_color:"Leer lassen für Palettenfarbe",h_hidden:"Spalte startet eingeklappt; ein Klick auf den Kopf holt sie zurück",h_compact:"Kleinere Schriften und engere Abstände in einem Schalter",h_map_url:"{location} wird ersetzt, z. B. https://maps.apple.com/?q={location}",h_planner_days:"Tages-Spalten ab heute; Wischen oder ‹ › blättert weiter",h_clock_header:"Große Uhr, Datum und aktuelles Wetter statt des Titels",h_countdowns:"⏳ in den Termintitel schreiben (z. B. „⏳ Urlaub“) – wird oben heruntergezählt",h_show_presence:"Personen-Chips zeigen zuhause / unterwegs / Zone mit farbigem Ring",h_home_zone:"Zone, die als zuhause gilt (Standard zone.home); auch Start für Fahrzeiten",h_back_path:"z. B. /dashboard-tablet/home – zeigt einen runden Zurück-Knopf",h_auto_back:"Kiosk: kehrt nach X Minuten ohne Berührung zu diesem Pfad zurück",h_shared_calendar:"Termine aus diesen Kalendern werden einmal als Querbalken über alle Personen dargestellt statt in nur einer Spalte",o_person:"Person",o_location:"Ort",o_calendar:"Kalender",o_monday:"Montag",o_sunday:"Sonntag",g_views:"🗓️ Ansichten",g_layout:"📐 Layout & Größe",g_filters:"🧹 Filter & Aufräumen",g_looks:"🎨 Aussehen (Feintuning)",g_kiosk:"🖥️ Kiosk & Extras",w_title:"👨‍👩‍👧‍👦 Willkommen beim Familienplan!",w_text:"In zwei Klicks startklar – die Karte erkennt deine Familie automatisch aus den Personen- und Kalender-Entitäten deines Home Assistant.",w_detect:"✨ Schritt 1: Personen automatisch erkennen",w_hint:"Danach optional: Profil wählen (unten) oder Feinheiten in den Gruppen einstellen. Natürlich kannst du Personen auch von Hand anlegen:",w_empty:"＋ Leer starten",p_tablet:"🖥️ Wandtablet",p_tablet_title:"Vollbild-Planer mit Uhr, Rückkehr zu heute",p_phone:"📱 Handy",p_phone_title:"Agenda als Startansicht, kompakte Spalten",p_reset:"🧩 Standard",p_reset_title:"Layout-Einstellungen zurücksetzen",s_persons:"Personen",s_calendars:"Kalender (Farbe & Label)",s_settings:"Einstellungen",b_add_person:"＋ Person hinzufügen",b_detect:"✨ Automatisch erkennen",b_up:"Nach oben",b_down:"Nach unten",b_remove:"Entfernen",b_auto:"Automatisch",ph_label:"Eigenes Label",ph_icon:"Symbol, z. B. mdi:school",ph_title_field:"Titel aus Feld (z. B. description)",person_n:"Person",cal_hint_1:"Farben wirken bei „Einfärben nach: Kalender“, Labels im Termin-Dialog. Symbol = mdi-Icon vor dem Titel. „Titel aus Feld“ nutzt z. B.",cal_hint_2:"statt",cal_hint_3:"als Termin-Titel."}};function xt(e,t){return vt[e]?.[t]??bt[t]??t}const yt=["#7986cb","#4fc3f7","#4db6ac","#aed581","#ffd54f","#ffb74d","#e57373","#f06292","#f48fb1","#ce93d8","#9575cd","#90a4ae"],wt=["day","planner","timeline","week","month","agenda"],$t=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"todo",selector:{entity:{filter:{domain:"todo"},multiple:!0}}},{name:"badges",selector:{entity:{multiple:!0}}},{name:"color",selector:{text:{}}},{name:"hidden",selector:{boolean:{}}}],kt=(e,t,o)=>({name:"",type:"expandable",title:e,icon:t,schema:o});class Dt extends se{constructor(){super(...arguments),this._t=e=>xt(this._lang,e),this._label=e=>{const t=`l_${e.name}`,o=xt(this._lang,t);return o===t?e.name:o},this._helper=e=>{const t=`h_${e.name}`,o=xt(this._lang,t);return o===t?void 0:o}}setConfig(e){this._config=e}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _lang(){return Me(this.hass)}_viewOptions(){return wt.map(e=>({value:e,label:ze(this.hass,e)}))}get _isFresh(){return!this._persons.some(e=>e.name||e.person||e.calendar||e.todo)}get _settingsData(){const e=Array.isArray(this._config.shared_calendar)?this._config.shared_calendar:this._config.shared_calendar?[this._config.shared_calendar]:[],t=Array.isArray(this._config.shared_todo)?this._config.shared_todo:this._config.shared_todo?[this._config.shared_todo]:[];return{...this._config,time_grid:String(this._config.time_grid??30),shared_calendar:e,shared_todo:t}}_schema(){const e=this._config,t=Array.isArray(e.views)&&e.views.length?e.views:wt,o=t.includes("day"),a=t.includes("timeline"),i=t.includes("week"),r=t.includes("planner"),n=[];(o||a)&&n.push({name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"trim_hours",selector:{boolean:{}}}),o&&n.push({name:"hour_height",selector:{number:{min:40,max:96,step:4,mode:"slider",unit_of_measurement:"px"}}},{name:"fit_height",selector:{boolean:{}}},{name:"col_min_width",selector:{number:{min:60,max:400,step:10,mode:"slider",unit_of_measurement:"px"}}},{name:"max_columns",selector:{number:{min:1,max:8,step:1,mode:"slider"}}},{name:"background_hours",selector:{number:{min:0,max:12,step:1,mode:"slider",unit_of_measurement:"h"}}}),a&&n.push({name:"hour_width",selector:{number:{min:48,max:240,step:8,mode:"slider",unit_of_measurement:"px"}}}),r&&n.push({name:"planner_days",selector:{number:{min:1,max:14,step:1,mode:"slider"}}}),n.push({name:"full_height",selector:{boolean:{}}});const s=[{name:"clock_header",selector:{boolean:{}}},{name:"countdowns",selector:{boolean:{}}},{name:"show_presence",selector:{boolean:{}}},{name:"home_zone",selector:{entity:{filter:{domain:"zone"}}}},{name:"back_path",selector:{text:{}}},...e.back_path?[{name:"auto_back",selector:{number:{min:0,max:60,step:1,mode:"box",unit_of_measurement:"min"}}}]:[],{name:"auto_return",selector:{number:{min:0,max:60,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"scroll_to_now",selector:{boolean:{}}},{name:"show_now_line",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}},{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"map_url",selector:{text:{}}}];return e.weather_entity&&s.push({name:"show_weather",selector:{boolean:{}}}),s.push({name:"refresh_interval",selector:{number:{min:0,max:3600,mode:"box",unit_of_measurement:"s"}}}),[{name:"title",selector:{text:{}}},{name:"shared_calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"shared_todo",selector:{entity:{filter:{domain:"todo"},multiple:!0}}},kt(this._t("g_views"),"mdi:calendar-multiselect",[{name:"view",selector:{select:{mode:"dropdown",options:this._viewOptions()}}},{name:"views",selector:{select:{multiple:!0,options:this._viewOptions()}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"first_day",selector:{select:{mode:"dropdown",options:[{value:"monday",label:this._t("o_monday")},{value:"sunday",label:this._t("o_sunday")}]}}},{name:"show_weekends",selector:{boolean:{}}}]),kt(this._t("g_layout"),"mdi:resize",n),kt(this._t("g_filters"),"mdi:broom",[{name:"hide_patterns",selector:{text:{multiple:!0}}},{name:"show_patterns",selector:{text:{multiple:!0}}},{name:"replace_patterns",selector:{text:{multiple:!0}}},{name:"filter_duplicates",selector:{boolean:{}}},{name:"tentative_patterns",selector:{text:{multiple:!0}}},...i?[{name:"hide_empty_persons",selector:{boolean:{}}}]:[]]),kt(this._t("g_looks"),"mdi:palette",[{name:"show_focus",selector:{boolean:{}}},{name:"drag_drop",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}},{name:"auto_icons",selector:{boolean:{}}},...e.auto_icons?[{name:"icon_patterns",selector:{text:{multiple:!0}}}]:[],{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:this._t("o_person")},{value:"location",label:this._t("o_location")},{value:"calendar",label:this._t("o_calendar")}]}}},{name:"dim_past",selector:{boolean:{}}},{name:"event_size",selector:{number:{min:9,max:16,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"radius",selector:{number:{min:0,max:18,step:1,mode:"slider",unit_of_measurement:"px"}}},{name:"past_opacity",selector:{number:{min:10,max:100,step:5,mode:"slider",unit_of_measurement:"%"}}}]),kt(this._t("g_kiosk"),"mdi:tablet-dashboard",s)]}_emit(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_settingsChanged(e){e.stopPropagation();const t={...e.detail.value};"string"==typeof t.time_grid&&(t.time_grid=Number(t.time_grid)),Array.isArray(t.shared_calendar)&&(0===t.shared_calendar.length?delete t.shared_calendar:1===t.shared_calendar.length&&(t.shared_calendar=t.shared_calendar[0])),Array.isArray(t.shared_todo)&&(0===t.shared_todo.length?delete t.shared_todo:1===t.shared_todo.length&&(t.shared_todo=t.shared_todo[0])),this._emit({...this._config,...t,persons:this._persons,...this._config.calendars?{calendars:this._config.calendars}:{}})}_applyPreset(e){const t={...this._config,persons:this._persons},o=e=>e.forEach(e=>delete t[e]);"tablet"===e?Object.assign(t,{view:(t.views??wt).includes("planner")?"planner":"day",clock_header:!0,full_height:!0,fit_height:!0,trim_hours:!0,scroll_to_now:!0,auto_return:5}):"phone"===e?(Object.assign(t,{view:"agenda",col_min_width:96}),o(["full_height","fit_height","auto_return"])):(o(["clock_header","full_height","fit_height","trim_hours","auto_return","col_min_width","hour_height","hour_width","max_columns","background_hours","event_size","radius","past_opacity"]),t.view="day"),this._emit(t)}_personChanged(e,t){t.stopPropagation();const o={...t.detail.value};o.color||delete o.color,Array.isArray(o.badges)&&0===o.badges.length&&delete o.badges,o.hidden||delete o.hidden,Array.isArray(o.calendar)&&(0===o.calendar.length?delete o.calendar:1===o.calendar.length&&(o.calendar=o.calendar[0])),Array.isArray(o.todo)&&(0===o.todo.length?delete o.todo:1===o.todo.length&&(o.todo=o.todo[0]));const a=this._persons.map((t,a)=>a===e?o:t);this._emit({...this._config,persons:a})}_personData(e){const t=Array.isArray(e.calendar)?e.calendar:e.calendar?[e.calendar]:[],o=Array.isArray(e.todo)?e.todo:e.todo?[e.todo]:[];return{...e,calendar:t,todo:o}}_setPersonColor(e,t){const o=this._persons.map((o,a)=>{if(a!==e)return o;const i={...o};return t?i.color=t:delete i.color,i});this._emit({...this._config,persons:o})}_addPerson(){const e=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:e})}_autoDetect(){const e=tt(this.hass);if(0===e.length)return;const t=new Set(this._persons.map(e=>e.person).filter(Boolean)),o=[...this._persons.filter(e=>e.name||e.person||e.calendar)];for(const a of e)t.has(a.person)||o.push(a);this._emit({...this._config,persons:o})}_removePerson(e){const t=this._persons.filter((t,o)=>o!==e);this._emit({...this._config,persons:t})}_movePerson(e,t){const o=[...this._persons],a=e+t;a<0||a>=o.length||([o[e],o[a]]=[o[a],o[e]],this._emit({...this._config,persons:o}))}_calsUsed(){const e=[];for(const t of this._persons){const o=Array.isArray(t.calendar)?t.calendar:t.calendar?[t.calendar]:[];for(const t of o)t&&!e.includes(t)&&e.push(t)}const t=Array.isArray(this._config.shared_calendar)?this._config.shared_calendar:this._config.shared_calendar?[this._config.shared_calendar]:[];for(const o of t)o&&!e.includes(o)&&e.push(o);return e}_setCalMeta(e,t){const o={...this._config.calendars??{}},a={...o[e]??{}};for(const e of["color","label","icon","title_field"]){const o=t[e];void 0!==o&&(o?a[e]=o:delete a[e])}0===Object.keys(a).length?delete o[e]:o[e]=a;const i={...this._config,persons:this._persons};0===Object.keys(o).length?delete i.calendars:i.calendars=o,this._emit(i)}_calName(e){return this.hass.states[e]?.attributes?.friendly_name||e}_swatches(e,t){return H`
      <div class="swatches">
        ${yt.map(o=>H`
            <button
              class="swatch ${e?.toLowerCase()===o?"on":""}"
              style="background:${o}"
              title=${o}
              @click=${()=>t(o)}
            ></button>
          `)}
        <button
          class="swatch none ${e?"":"on"}"
          title=${this._t("b_auto")}
          @click=${()=>t()}
        >
          A
        </button>
      </div>
    `}render(){if(!this._config)return W;if(this._isFresh)return H`
        <div class="wizard">
          <div class="wtitle">${this._t("w_title")}</div>
          <div class="wtext">${this._t("w_text")}</div>
          <button class="wbtn primary" @click=${this._autoDetect}>${this._t("w_detect")}</button>
          <div class="wtext small">${this._t("w_hint")}</div>
          <button class="wbtn" @click=${this._addPerson}>${this._t("w_empty")}</button>
        </div>
      `;const e=this._persons,t=this._calsUsed();return H`
      <div class="presets">
        <button title=${this._t("p_tablet_title")} @click=${()=>this._applyPreset("tablet")}>
          ${this._t("p_tablet")}
        </button>
        <button title=${this._t("p_phone_title")} @click=${()=>this._applyPreset("phone")}>
          ${this._t("p_phone")}
        </button>
        <button title=${this._t("p_reset_title")} @click=${()=>this._applyPreset("reset")}>
          ${this._t("p_reset")}
        </button>
      </div>

      <div class="section-title">${this._t("s_persons")}</div>
      <div class="persons">
        ${e.map((t,o)=>H`
            <div class="person">
              <div class="person-head">
                <span
                  class="pdot"
                  style="background:${t.color||yt[o%yt.length]}"
                ></span>
                <span class="pidx">${t.name||`${this._t("person_n")} ${o+1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title=${this._t("b_up")}
                    ?disabled=${0===o}
                    @click=${()=>this._movePerson(o,-1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title=${this._t("b_down")}
                    ?disabled=${o===e.length-1}
                    @click=${()=>this._movePerson(o,1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title=${this._t("b_remove")}
                    @click=${()=>this._removePerson(o)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ${this._swatches(t.color,e=>this._setPersonColor(o,e))}
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(t)}
                .schema=${$t}
                .computeLabel=${this._label}
                .computeHelper=${this._helper}
                @value-changed=${e=>this._personChanged(o,e)}
              ></ha-form>
            </div>
          `)}
        <div class="addrow">
          <button class="add" @click=${this._addPerson}>${this._t("b_add_person")}</button>
          <button class="add detect" @click=${this._autoDetect}>${this._t("b_detect")}</button>
        </div>
      </div>

      ${t.length>1||this._config.calendars?H`
            <div class="section-title">${this._t("s_calendars")}</div>
            <div class="cals">
              ${t.map(e=>{const t=this._config.calendars?.[e]??{};return H`
                  <div class="cal">
                    <div class="cal-head">
                      <span
                        class="pdot"
                        style="background:${t.color||"var(--divider-color)"}"
                      ></span>
                      <span class="cal-name" title=${e}>${this._calName(e)}</span>
                      <input
                        class="cal-label"
                        type="text"
                        placeholder=${this._t("ph_label")}
                        .value=${t.label??""}
                        @change=${t=>this._setCalMeta(e,{label:t.target.value||null})}
                      />
                    </div>
                    ${this._swatches(t.color,t=>this._setCalMeta(e,{color:t??null}))}
                    <div class="cal-extra">
                      <input
                        type="text"
                        placeholder=${this._t("ph_icon")}
                        .value=${t.icon??""}
                        @change=${t=>this._setCalMeta(e,{icon:t.target.value||null})}
                      />
                      <input
                        type="text"
                        placeholder=${this._t("ph_title_field")}
                        .value=${t.title_field??""}
                        @change=${t=>this._setCalMeta(e,{title_field:t.target.value||null})}
                      />
                    </div>
                  </div>
                `})}
              <div class="hint">
                ${this._t("cal_hint_1")} <code>description</code> ${this._t("cal_hint_2")}
                <code>summary</code> ${this._t("cal_hint_3")}
              </div>
            </div>
          `:W}

      <div class="section-title">${this._t("s_settings")}</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `}}Dt.styles=n`
    .wizard {
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
    .wtitle {
      font-size: 17px;
      font-weight: 700;
    }
    .wtext {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }
    .wtext.small {
      font-size: 12px;
    }
    .wbtn {
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
    }
    .wbtn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
    }
    .presets {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }
    .presets button {
      flex: 1;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 8px 10px;
      cursor: pointer;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
    }
    .presets button:hover {
      border-color: var(--primary-color);
    }
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin: 14px 2px 8px;
    }
    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
      padding: 2px 2px 0;
    }
    .persons,
    .cals {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .person,
    .cal {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 8px 10px 6px;
    }
    .person-head,
    .cal-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .pdot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex: 0 0 12px;
    }
    .pidx {
      font-weight: 600;
      font-size: 13px;
      flex: 1;
    }
    .cal-name {
      font-weight: 600;
      font-size: 12.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cal-extra {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .cal-extra input {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
    }
    .cal-label {
      margin-left: auto;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
      width: 130px;
    }
    .ptools {
      display: inline-flex;
      gap: 2px;
    }
    .icon {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 6px;
      width: 26px;
      height: 26px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
    .icon:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .icon.danger:hover {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 2px 0 6px;
    }
    .swatch {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .swatch.on {
      border-color: var(--primary-text-color);
      box-shadow: 0 0 0 2px var(--card-background-color, #fff) inset;
    }
    .swatch.none {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
    }
    .addrow {
      display: flex;
      gap: 8px;
    }
    .addrow .add {
      flex: 1;
    }
    .add.detect {
      border-style: solid;
    }
    .add {
      border: 1px dashed var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
  `,e([pe({attribute:!1})],Dt.prototype,"hass",void 0),e([he()],Dt.prototype,"_config",void 0),customElements.define("ha-family-board-card-editor",Dt);var Tt=Object.freeze({__proto__:null,FamilyBoardCardEditor:Dt});export{mt as FamilyBoardCard,tt as autoDetectPersons};
