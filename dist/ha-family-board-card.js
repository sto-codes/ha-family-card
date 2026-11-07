function e(e,t,i,s){var o,r=arguments.length,a=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,s);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(r<3?o(a):r>3?o(t,i,a):o(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(i,e,s)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:_}=Object,u=globalThis,g=u.trustedTypes,f=g?g.emptyScript:"",m=u.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const r=s?.call(this);o?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=_(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const r=o.fromAttribute(t,e.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(void 0!==e){const r=this.constructor;if(!1===s&&(o=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??y)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==o||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,m?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,D=$.trustedTypes,T=D?D.createPolicy("lit-html",{createHTML:e=>e}):void 0,M="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+A,S=`<${z}>`,E=document,C=()=>E.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,O="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,N=/>/g,R=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,H=/"/g,U=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),j=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),G=new WeakMap,V=E.createTreeWalker(E,129);function q(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,s=[];let o,r=2===t?"<svg>":3===t?"<math>":"",a=F;for(let t=0;t<i;t++){const i=e[t];let n,l,d=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===F?"!--"===l[1]?a=B:void 0!==l[1]?a=N:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=o??F,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?R:'"'===l[3]?H:L):a===H||a===L?a=R:a===B||a===N?a=F:(a=R,o=void 0);const h=a===R&&e[t+1].startsWith("/>")?" ":"";r+=a===F?i+S:d>=0?(s.push(n),i.slice(0,d)+M+i.slice(d)+A+h):i+A+(-2===d?t:h)}return[q(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,r=0;const a=e.length-1,n=this.parts,[l,d]=J(e,t);if(this.el=Y.createElement(l,i),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=V.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(M)){const t=d[r++],i=s.getAttribute(e).split(A),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(A)&&(n.push({type:6,index:o}),s.removeAttribute(e));if(U.test(s.tagName)){const e=s.textContent.split(A),t=e.length-1;if(t>0){s.textContent=D?D.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],C()),V.nextNode(),n.push({type:2,index:++o});s.append(e[t],C())}}}else if(8===s.nodeType)if(s.data===z)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(A,e+1));)n.push({type:7,index:o}),e+=A.length-1}o++}}static createElement(e,t){const i=E.createElement("template");return i.innerHTML=e,i}}function Z(e,t,i=e,s){if(t===j)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=P(t)?void 0:t._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=Z(e,o._$AS(e,t.values),o,s)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??E).importNode(t,!0);V.currentNode=s;let o=V.nextNode(),r=0,a=0,n=i[0];for(;void 0!==n;){if(r===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=i[++a]}r!==n?.index&&(o=V.nextNode(),r++)}return V.currentNode=E,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),P(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new X(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Y(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new Q(this.O(C()),this.O(C()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,s){const o=this.strings;let r=!1;if(void 0===o)e=Z(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==j,r&&(this._$AH=e);else{const s=e;let a,n;for(e=o[0],a=0;a<o.length-1;a++)n=Z(this,s[i+a],t,a),n===j&&(n=this._$AH[a]),r||=!P(n)||n!==this._$AH[a],n===W?e=W:e!==W&&(e+=(n??"")+o[a+1]),this._$AH[a]=n}r&&!s&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class se extends ee{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??W)===j)return;const i=this._$AH,s=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(Y,Q),($.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;class ne extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new Q(t.insertBefore(C(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const le=ae.litElementPolyfillSupport;le?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");const de={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},ce=(e=de,t,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function he(e){return(t,i)=>"object"==typeof i?ce(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return he({...e,state:!0,attribute:!1})}const _e=864e5;function ue(e,t,i,s,o=!1){const r=!e?.start?.dateTime;let a,n;if(r){if(!e?.start?.date)return null;a=new Date(`${e.start.date}T00:00:00`),n=e.end?.date?new Date(`${e.end.date}T00:00:00`):new Date(a.getTime()+_e)}else a=new Date(e.start.dateTime),n=new Date(e.end?.dateTime??e.start.dateTime);return isNaN(a.getTime())||isNaN(n.getTime())?null:(n.getTime()<=a.getTime()&&(n=new Date(a.getTime()+(r?_e:6e4))),{personIdx:t,shared:o,calendar:i,uid:e.uid,recurrence_id:e.recurrence_id,rrule:e.rrule,summary:e.summary||"Termin",description:e.description,location:e.location,allDay:r,start:a,end:n,color:s,tentative:!1})}function ge(e,t,i){const s=[],o=new Date(e.start);o.setHours(0,0,0,0);const r=Math.max(1,Math.ceil((e.end.getTime()-o.getTime())/_e));for(let a=0;a<i;a++){const i=new Date(t.getTime()+a*_e),n=new Date(i.getTime()+_e),l=Math.max(e.start.getTime(),i.getTime()),d=Math.min(e.end.getTime(),n.getTime());if(d<=l)continue;const c=e.allDay?0:Math.round((l-i.getTime())/6e4),h=e.allDay?1440:Math.round((d-i.getTime())/6e4),p=r>1?Math.round((i.getTime()-o.getTime())/_e)+1:void 0;s.push({part:p,parts:r>1?r:void 0,ref:e,personIdx:e.personIdx,shared:!0===e.shared,day:a,startMin:c,endMin:Math.min(h,1440),title:e.summary,location:e.location,allDay:e.allDay,color:e.color,continuesBefore:e.start.getTime()<i.getTime(),continuesAfter:e.end.getTime()>n.getTime()})}return s}function fe(e){const t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),i=[];let s=[],o=-1,r=0;const a=[],n=()=>{if(s.length){const e=Math.max(...s.map(e=>e.col))+1;s.forEach(t=>{t.cols=e,t.cluster=r;let i=e;for(const e of s)e!==t&&e.col>t.col&&e.startMin<t.endMin&&e.endMin>t.startMin&&(i=Math.min(i,e.col));t.span=Math.max(1,i-t.col)}),r++}s=[]};for(const e of t){s.length&&e.startMin>=o&&(n(),a.length=0);let t=a.findIndex(t=>t<=e.startMin);-1===t?(t=a.length,a.push(e.endMin)):a[t]=e.endMin;const l={...e,col:t,cols:1,span:1,cluster:r};s.push(l),i.push(l),o=1===s.length?e.endMin:Math.max(o,e.endMin)}return n(),i}const me={board_title:"Family board",day:"Day",week:"Week",month:"Month",agenda:"Agenda",timeline:"Timeline",all_day:"all-day",this_week:"This week",prev_week:"Previous week",next_week:"Next week",prev_month:"Previous month",next_month:"Next month",today:"Today",tomorrow:"Tomorrow",yesterday:"Yesterday",open_map:"Map",status_home:"home",status_away:"away",add_event:"Add event",new_event:"New event",event:"Event",todo:"To-do",edit_event:"Edit event",edit_todo:"Edit to-do",close:"Close",field_title:"Title",field_all_day:"All-day",field_start:"Start",field_end:"End",field_due:"Due",field_location:"Location",field_note:"Note",field_calendar:"Calendar",recurring:"Recurring event",recur_this:"This event only",recur_future:"This and following",read_only:"This calendar is read-only.",delete:"Delete",cancel:"Cancel",save:"Save",err_invalid:"Please enter valid times.",err_end_before:"End is before start.",err_end_equal:"End must be after start.",save_failed:"Saving failed.",delete_failed:"Deleting failed.",default_title:"Event",load_error:"Calendar could not be loaded.",no_events:"No events.",more_events:"more events",focus_next:"next",focus_free:"free",shared_events:"Shared",shared_todos:"Shared to-dos",todo_item:"to-do",todo_items:"to-dos",todo_due:"Due:",todo_complete:"Mark as done"},be={en:me,de:{board_title:"Familienplan",day:"Tag",week:"Woche",month:"Monat",agenda:"Agenda",timeline:"Zeitstrahl",all_day:"ganztägig",this_week:"Diese Woche",prev_week:"Vorherige Woche",next_week:"Nächste Woche",prev_month:"Vorheriger Monat",next_month:"Nächster Monat",today:"Heute",tomorrow:"Morgen",yesterday:"Gestern",open_map:"Karte",status_home:"zuhause",status_away:"unterwegs",add_event:"Termin hinzufügen",new_event:"Neuer Termin",event:"Termin",todo:"To-do",edit_event:"Termin bearbeiten",edit_todo:"To-do bearbeiten",close:"Schließen",field_title:"Titel",field_all_day:"Ganztägig",field_start:"Start",field_end:"Ende",field_due:"Fällig",field_location:"Ort",field_note:"Notiz",field_calendar:"Kalender",recurring:"Wiederkehrender Termin",recur_this:"Nur dieser Termin",recur_future:"Dieser und folgende",read_only:"Dieser Kalender ist schreibgeschützt.",delete:"Löschen",cancel:"Abbrechen",save:"Speichern",err_invalid:"Bitte gültige Zeiten angeben.",err_end_before:"Ende liegt vor dem Start.",err_end_equal:"Ende muss nach dem Start liegen.",save_failed:"Speichern fehlgeschlagen.",delete_failed:"Löschen fehlgeschlagen.",default_title:"Termin",load_error:"Kalender konnte nicht geladen werden.",no_events:"Keine Termine.",more_events:"weitere Termine",focus_next:"als Nächstes",focus_free:"frei",shared_events:"Gemeinsam",shared_todos:"Gemeinsame To-dos",todo_item:"To-do",todo_items:"To-dos",todo_due:"Fällig:",todo_complete:"Als erledigt markieren"}};function ve(e){return(e?.locale?.language||navigator?.language||"en").toLowerCase().split("-")[0]}function ye(e,t){const i=ve(e);return be[i]?.[t]??me[t]??t}function xe(e){return e?.locale?.language||navigator?.language||"en"}function we(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const i=new Intl.DateTimeFormat(xe(e),{hour:"numeric"}).format(new Date(2020,0,1,13));return/\s?[AaPp]\.?[Mm]\.?/.test(i)||/1\s?PM/i.test(i)}function $e(e,t){return new Intl.DateTimeFormat(xe(e),{hour:we(e)?"numeric":"2-digit",minute:"2-digit",hour12:we(e)}).format(t)}function ke(e,t){const i=new Date(2020,0,1,0,0,0,0);return i.setMinutes(t),$e(e,i)}function De(e,t,i=1){const s=new Intl.DateTimeFormat(xe(e),{weekday:t}),o=Array.from({length:7},(e,t)=>{const i=s.format(new Date(2024,0,7+t));return i.charAt(0).toUpperCase()+i.slice(1)});return Array.from({length:7},(e,t)=>o[(i+t)%7])}function Te(e,t){const i=t.getTime()-Date.now();if(i<=0)return"";const s=new Intl.RelativeTimeFormat(xe(e),{numeric:"always",style:"short"}),o=Math.round(i/6e4);if(o<60)return s.format(Math.max(1,o),"minute");const r=Math.round(o/60);return r<24?s.format(r,"hour"):s.format(Math.round(r/24),"day")}const Me=["day","timeline","week","month","agenda"],Ae=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],ze={"clear-night":"weather-night",cloudy:"weather-cloudy",fog:"weather-fog",hail:"weather-hail",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",partlycloudy:"weather-partly-cloudy",pouring:"weather-pouring",rainy:"weather-rainy",snowy:"weather-snowy","snowy-rainy":"weather-snowy-rainy",sunny:"weather-sunny",windy:"weather-windy","windy-variant":"weather-windy-variant",exceptional:"weather-cloudy-alert"},Se=[[/zahnarzt|dentist|kieferortho/i,"🦷"],[/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i,"🩺"],[/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i,"🎂"],[/schwimm|swim|hallenbad|baden/i,"🏊"],[/fußball|fussball|soccer|football|training/i,"⚽"],[/sport|gym|fitness|turnen|joggen|laufen|workout/i,"🏃"],[/reit|pferd|pony|horse/i,"🐴"],[/tanz|ballett|dance/i,"🩰"],[/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i,"🎵"],[/schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,"🎒"],[/kita|kindergarten|krippe|hort/i,"🧸"],[/frühstück|fruehstueck|breakfast/i,"🥐"],[/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i,"🍽️"],[/kaffee|coffee|café|cafe/i,"☕"],[/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i,"🏖️"],[/flug|flight|airport|flughafen/i,"✈️"],[/zug|bahn|train|abfahrt|ankunft/i,"🚆"],[/kino|film|movie|cinema/i,"🎬"],[/party|feier|fest|celebration/i,"🎉"],[/einkauf|shopping|supermarkt|einkaufen|besorgung/i,"🛒"],[/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i,"🧹"],[/schlaf|nap|ruhezeit|mittagsschlaf/i,"😴"],[/spiel|freispiel|play|angebotszeit/i,"🧸"],[/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i,"💼"],[/friseur|haircut|hairdresser|frisör|frisoer/i,"💇"],[/kirche|church|gottesdienst|messe|religion/i,"⛪"],[/pause|hofpause|break/i,"⏸️"]],Ee=/\p{Extended_Pictographic}/u,Ce=e=>String(e).padStart(2,"0"),Pe=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,16),Ie=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,10),Oe=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t},Fe=(e,t)=>e.color||Ae[t%Ae.length],Be=e=>{let t=0;for(let i=0;i<e.length;i++)t=31*t+e.charCodeAt(i)>>>0;return Ae[t%Ae.length]};function Ne(e){const t=e?.states??{},i=Object.keys(t).filter(e=>e.startsWith("calendar.")),s=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,""),o=[];for(const e of Object.keys(t)){if(!e.startsWith("person."))continue;const r=e.slice(7),a=t[e].attributes?.friendly_name??r,n=s(r),l=s(a),d=i.filter(e=>{const i=s(e.slice(9)),o=s(t[e].attributes?.friendly_name??"");return i===n||i.includes(n)||l.length>2&&(i.includes(l)||o.includes(l))});if(o.push({name:a,person:e,calendar:1===d.length?d[0]:d.length?d:""}),o.length>=10)break}return o}class Re extends ne{constructor(){super(...arguments),this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._weekOffset=0,this._monthOffset=0,this._loadError=!1,this._loading=!1,this._todoBusy=[],this._todoItemsByOwner={},this._fitPx=0,this._hiddenP=[],this._dragStartY=0,this._dragPx=1,this._dragGrid=30,this._suppressClick=!1,this._raw=[],this._fetchedKey="",this._forecast={},this._weatherKey="",this._scrolledKey="",this._lastInteract=Date.now(),this._onInteract=()=>{this._lastInteract=Date.now()},this._onVisible=()=>{"hidden"!==document.visibilityState&&this.hass&&this._config&&this._refetch()},this._onKeyDown=e=>{"Escape"===e.key&&(this._dialog||this._todoDialog||this._todoBadgeDialog)&&(e.stopPropagation(),this._dialog?this._closeDialog():this._todoDialog?this._closeTodoDialog():this._closeTodoBadgeDialog())},this._prevWeek=()=>{this._weekOffset-=1},this._nextWeek=()=>{this._weekOffset+=1},this._thisWeek=()=>{this._weekOffset=0,this._day=this._todayIndex()},this._prevMonth=()=>{this._monthOffset-=1},this._nextMonth=()=>{this._monthOffset+=1},this._thisMonth=()=>{this._monthOffset=0},this._onDragMove=e=>{if(!this._drag)return;e.preventDefault();const t=e.clientY-this._dragStartY,i=this._drag.moved||Math.abs(t)>4;this._drag={...this._drag,deltaMin:t/this._dragPx,moved:i}},this._onDragUp=()=>{window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp);const e=this._drag;e&&(e.moved?(this._suppressClick=!0,this._commitDrag(e)):this._drag=void 0)}}static async getConfigElement(){return await Promise.resolve().then(function(){return qe}),document.createElement("ha-family-board-card-editor")}static getStubConfig(e){const t=e?Ne(e):[];return{type:"custom:family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:t.length?t:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(e){if(!e.persons||!Array.isArray(e.persons))throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");this._config=e;const t=this._enabledViews,i=e.view??"day";this._view=t.includes(i)?i:t[0],this._day=this._todayIndex(),this._hiddenP=e.persons.map((e,t)=>e.hidden?t:-1).filter(e=>e>=0);const s=Number(e.col_min_width);Number.isFinite(s)&&s>=60?this.style.setProperty("--fb-col-min",`${Math.min(s,400)}px`):this.style.removeProperty("--fb-col-min"),this.toggleAttribute("compact",!0===e.compact);const o=Number(e.event_size);Number.isFinite(o)&&o>=8&&o<=20?(this.style.setProperty("--fb-event-size",`${o}px`),this.style.setProperty("--fb-chip-size",`${Math.max(o-1,8)}px`)):(this.style.removeProperty("--fb-event-size"),this.style.removeProperty("--fb-chip-size"));const r=Number(e.radius);Number.isFinite(r)&&r>=0&&r<=20?(this.style.setProperty("--fb-radius",`${r}px`),this.style.setProperty("--fb-radius-sm",`${Math.max(r-2,2)}px`)):(this.style.removeProperty("--fb-radius"),this.style.removeProperty("--fb-radius-sm"));const a=Number(e.past_opacity);Number.isFinite(a)&&a>=10&&a<=100?this.style.setProperty("--fb-past-opacity",""+a/100):this.style.removeProperty("--fb-past-opacity"),this.isConnected&&this._startTimer()}get _enabledViews(){const e=this._config?.views,t=Array.isArray(e)?Me.filter(t=>e.includes(t)):[];return t.length?t:[...Me]}get _firstDayJs(){return"sunday"===this._config?.first_day?0:1}_todayIndex(){return((new Date).getDay()-this._firstDayJs+7)%7}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("focus",this._onVisible),this._startTimer(),this.addEventListener("pointerdown",this._onInteract),this._tick=window.setInterval(()=>{this._kioskReturn(),this.requestUpdate()},6e4),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measureFit())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("focus",this._onVisible),this.removeEventListener("pointerdown",this._onInteract),this._stopTimer(),this._tick&&(clearInterval(this._tick),this._tick=void 0),this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)}get _progressOn(){return!1!==this._config?.show_progress}_isCurrent(e){const t=Date.now();return e.ref.start.getTime()<=t&&t<e.ref.end.getTime()}_progressPct(e){const t=e.ref.start.getTime(),i=e.ref.end.getTime();return i<=t?0:Math.min(100,Math.max(0,(Date.now()-t)/(i-t)*100))}_kioskReturn(){const e=Number(this._config?.auto_return??0);if(!Number.isFinite(e)||e<=0)return;if(Date.now()-this._lastInteract<6e4*e)return;if(this._dialog||this._todoDialog||this._todoBadgeDialog)return;const t=this._config.view??"day",i=this._enabledViews.includes(t)?t:this._enabledViews[0];this._view!==i&&(this._view=i),0!==this._weekOffset&&(this._weekOffset=0),0!==this._monthOffset&&(this._monthOffset=0),this._hiddenP.length&&(this._hiddenP=[]),this._day=this._todayIndex()}_startTimer(){this._stopTimer();const e=this._config?.refresh_interval??300;e>0&&(this._timer=window.setInterval(()=>this._refetch(),1e3*e))}_stopTimer(){this._timer&&(clearInterval(this._timer),this._timer=void 0)}updated(e){if((e.has("hass")||e.has("_config"))&&this.hass&&this._config&&(this._maybeFetch(),this._maybeFetchWeather()),e.has("_todoItemsByOwner")&&this._todoBadgeDialog){0===this._todoItemsForPerson(this._todoBadgeDialog.personIdx).length&&(this._todoBadgeDialog=void 0)}if(e.has("_dialog")||e.has("_todoDialog")||e.has("_todoBadgeDialog")){const t=Boolean(e.get("_dialog"))||Boolean(e.get("_todoDialog"))||Boolean(e.get("_todoBadgeDialog"));this._manageOverlayFocus(t)}this._measureFit(),this._maybeScrollToNow()}_syncStickyRows(){const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),i=e.querySelector(".todo-row"),s=t?.offsetHeight??0,o=i?.offsetHeight??0;e.style.setProperty("--fb-sticky-header-h",`${s}px`),e.style.setProperty("--fb-sticky-todo-h",`${o}px`)}_measureFit(){if(this._applyFullHeight(),this._syncStickyRows(),!this._config?.fit_height||"day"!==this._view)return void(0!==this._fitPx&&(this._fitPx=0));const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),i=e.querySelector(".todo-row"),s=e.querySelector(".allday-row"),o=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],r=this._dayWindow(o),a=r.endMin-r.startMin;if(a<=0)return;const n=(t?.offsetHeight??0)+(i?.offsetHeight??0)+(s?.offsetHeight??0),l=e.clientHeight-n-2;if(l<=0)return;const d=Math.min(96,Math.max(40,this._config.hour_height??64))/60,c=Math.max(40/60,Math.min(d,l/a));Math.abs(c-this._fitPx)>.02&&(this._fitPx=c)}_applyFullHeight(){const e=this.renderRoot?.querySelector(".board");if(!e)return;if(!this._config?.full_height)return void(e.style.height&&(e.style.height="",e.style.maxHeight=""));const t=e.getBoundingClientRect().top+window.scrollY,i=`${Math.max(200,Math.round(window.innerHeight-t-16))}px`;e.style.height!==i&&(e.style.height=i,e.style.maxHeight=i)}_maybeScrollToNow(){if("day"!==this._view||!1===this._config?.scroll_to_now)return;const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if(!this._isRealToday(e))return;const t=`${this._weekOffset}|${this._day}|${this._config?.hour_height}`;if(t===this._scrolledKey)return;const i=this.renderRoot?.querySelector(".board"),s=this.renderRoot?.querySelector(".nowline");i&&s&&(this._scrolledKey=t,requestAnimationFrame(()=>{const e=s.offsetTop-i.clientHeight/3;i.scrollTo({top:Math.max(0,e),behavior:"smooth"})}))}_manageOverlayFocus(e){const t=!!this._dialog||!!this._todoDialog||!!this._todoBadgeDialog;t&&!e?(this._restoreFocus=this.renderRoot?.activeElement,requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector(".dialog input");e?.focus()})):!t&&e&&(this._restoreFocus?.focus?.(),this._restoreFocus=void 0)}_weekBounds(){const e=new Date,t=new Date(e);t.setHours(0,0,0,0),t.setDate(e.getDate()-(e.getDay()-this._firstDayJs+7)%7+7*this._weekOffset);const i=new Date(t);return i.setDate(t.getDate()+7),{monday:t,nextMonday:i}}_monthGrid(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth()+this._monthOffset,1),i=(t.getDay()-this._firstDayJs+7)%7,s=Oe(new Date(t.getFullYear(),t.getMonth(),1-i)),o=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return{gridStart:s,weeks:Math.ceil((i+o)/7),month:t.getMonth(),year:t.getFullYear()}}_fetchRange(){if("month"===this._view){const{gridStart:e,weeks:t}=this._monthGrid();return{start:e,end:new Date(e.getTime()+7*t*_e)}}const{monday:e,nextMonday:t}=this._weekBounds();return{start:e,end:t}}async _maybeFetch(){const e=this._config.persons.map(e=>this._calsOf(e).join("+")).join(","),t=this._sharedCalendarGroups().map(e=>`${e.ids.join("+")}@${e.personIdxs.join(".")}:${e.label??""}`).join(","),i=this._sharedTodoGroups().map(e=>`${e.ids.join("+")}@${e.personIdxs.join(".")}:${e.label??""}`).join(","),s=[...this._config.persons.map(e=>this._todosOf(e).join("+")),...this._sharedTodoGroups().map(e=>e.ids.join("+"))].join(","),o=Array.from(new Set([...this._config.persons.flatMap(e=>this._todosOf(e)),...this._sharedTodoIds()])).map(e=>{const t=this.hass.states[e];return`${e}:${t?.state??""}:${t?.last_updated??""}`}).join(","),r=`${"month"===this._view?`m${this._monthOffset}`:`w${this._weekOffset}`}|${e}|${t}|${i}|${s}|${o}`;r!==this._fetchedKey&&(this._fetchedKey=r,await this._fetchEvents())}async _refetch(){this._fetchedKey="",await this._maybeFetch()}async _maybeFetchWeather(){const e=this._config.weather_entity;if(!e||!1===this._config.show_weather||!this.hass.states[e])return Object.keys(this._forecast).length&&(this._forecast={}),void(this._weatherKey="");const t=`${e}|${(new Date).toISOString().slice(0,10)}`;if(t!==this._weatherKey){this._weatherKey=t;try{const t=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"daily"},target:{entity_id:e},return_response:!0}),i=t?.response?.[e]?.forecast??[],s={};for(const e of i)e?.datetime&&(s[Ie(new Date(e.datetime))]={temp:Math.round(e.temperature),condition:e.condition});this._forecast=s}catch(e){this._forecast={}}}}_weatherChip(e){const t=this._forecast[Ie(e)];if(!t)return W;const i=ze[t.condition]||"weather-cloudy",s=this.hass.config?.unit_system?.temperature??"°";return K`<span class="wx" title=${t.condition}>
      <ha-icon icon="mdi:${i}"></ha-icon>${t.temp}${s}
    </span>`}_hidden(e){const t=this._config.hide_patterns;if(!Array.isArray(t)||0===t.length)return!1;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}_allowed(e){const t=this._config.show_patterns;if(!Array.isArray(t)||0===t.length)return!0;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}_cleanTitle(e){const t=this._config.replace_patterns;if(!Array.isArray(t)||0===t.length)return e;let i=e;for(const e of t){const t=String(e),s=t.indexOf("=>"),o=(s>=0?t.slice(0,s):t).trim(),r=s>=0?t.slice(s+2).trim():"";0!==o.length&&(i=i.split(o).join(r))}return i.replace(/\s{2,}/g," ").trim()||e}_matchesTentative(e){const t=this._config.tentative_patterns;if(!Array.isArray(t)||0===t.length)return!1;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}async _fetchEvents(){const{start:e,end:t}=this._fetchRange(),i=e.toISOString(),s=t.toISOString(),o=[],r={};let a=!1;this._loading=!0;const n=async(e,t,r,n=!1,l)=>{try{const a=await this.hass.callApi("GET",`calendars/${e}?start=${encodeURIComponent(i)}&end=${encodeURIComponent(s)}`);for(const i of a){const s=ue(i,t,e,r,n);if(s){const t=this._calMeta(e).title_field;if(t){const e=i[t];"string"==typeof e&&e.trim()&&(s.summary=e.trim())}n&&l&&(s.shared_person_idxs=l.personIdxs,s.shared_label=l.label||(1===l.ids.length?this._calLabel(l.ids[0]):void 0))}s&&!this._hidden(s.summary)&&this._allowed(s.summary)&&(this._matchesTentative(s.summary)&&(s.tentative=!0),s.summary=this._cleanTitle(s.summary),o.push(s))}}catch(e){a=!0}},l=this._sharedCalendarGroups(),d=Array.from(new Set(l.flatMap(e=>e.ids)));await Promise.all([...this._config.persons.flatMap((e,t)=>{const i=Fe(e,t);return this._calsOf(e).filter(e=>this.hass.states[e]&&!d.includes(e)).map(e=>n(e,t,i))}),...l.flatMap(e=>e.ids.filter(e=>this.hass.states[e]).map(t=>n(t,-1,this._calMeta(t).color??Be(t),!0,e)))]);const c=this._sharedTodoGroups(),h=Array.from(new Set(c.flatMap(e=>e.ids))),p=Array.from(new Set([...this._config.persons.flatMap(e=>this._todosOf(e)),...h]));if(p.length>0)try{const i=await this.hass.callWS({type:"execute_script",sequence:[{action:"todo.get_items",target:{entity_id:p},data:{status:["needs_action"]},response_variable:"fb_todos"},{stop:"",response_variable:"fb_todos"}]}),s=i.response??i,a=this._todoAnchorDates(e,t),n=(e,t,i)=>{const s=r[e]??[];t.forEach(e=>s.push({...e,entityId:i,listLabel:this._todoLabel(i)})),r[e]=s},l=(i,s,r,n,l=!1,d)=>{i.forEach(i=>{(("string"==typeof i.due?i.due.trim():"")?[a[0]]:a).forEach(a=>{const c=this._todoToRawEvent(i,s,r,n,a,e,t,l);c&&(l&&d&&(c.shared_person_idxs=d.personIdxs,c.shared_label=d.label||(1===d.ids.length?this._todoLabel(d.ids[0]):void 0)),o.push(c))})})};this._config.persons.forEach((e,t)=>{const i=Fe(e,t);this._todosOf(e).filter(e=>!h.includes(e)).forEach(e=>{const o=s?.[e]?.items;Array.isArray(o)&&(n(this._todoOwnerKey(t),o,e),l(o,t,i,e))})}),c.forEach(e=>{e.ids.forEach(t=>{const i=s?.[t]?.items;Array.isArray(i)&&(e.personIdxs.forEach(e=>n(this._todoOwnerKey(e),i,t)),l(i,-1,Be(t),t,!0,e))})})}catch(e){}let _=o;if(this._config.filter_duplicates){const e=new Set;_=o.filter(t=>{const i=`${t.kind??"calendar"}|${t.personIdx}|${t.calendar}|${t.uid??t.todo_item??t.summary}|${t.start.getTime()}|${t.end.getTime()}`;return!e.has(i)&&(e.add(i),!0)})}this._raw=_;const{monday:u}=this._weekBounds();this._events="month"===this._view?[]:_.flatMap(e=>function(e,t){return ge(e,t,7)}(e,u)),this._todoItemsByOwner=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,[...t].sort((e,t)=>this._todoSortKey(e).localeCompare(this._todoSortKey(t)))])),this._loadError=a&&0===o.length,this._loading=!1}_calsOf(e){return Array.isArray(e.calendar)?e.calendar.filter(Boolean):e.calendar?[e.calendar]:[]}_todosOf(e){return Array.isArray(e.todo)?e.todo.filter(Boolean):e.todo?[e.todo]:[]}_writableCals(e){return this._calsOf(e).filter(e=>this._canCreate(e))}_personCanCreate(e){return this._writableCals(e).length>0}_calFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canCreate(e){return!!(1&this._calFeatures(e))}_canUpdate(e){return!!(4&this._calFeatures(e))}_canDelete(e){return!!(2&this._calFeatures(e))}_todoFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canUpdateTodo(e){return!!(4&this._todoFeatures(e))}_canDeleteTodo(e){return!!(2&this._todoFeatures(e))}_allPersonIdxs(){return this._persons.map((e,t)=>t)}_personRef(e,t){return e.person?e.person:e.name?`name:${e.name}`:`slot:${t}`}_resolvePersonRefs(e){if(!Array.isArray(e)||0===e.length)return this._allPersonIdxs();const t=[];return this._persons.forEach((i,s)=>{const o=[this._personRef(i,s),i.person,i.name?`name:${i.name}`:"",String(s)].filter(e=>!!e);e.some(e=>o.includes(e))&&!t.includes(s)&&t.push(s)}),t}_normalizeSharedGroups(e,t,i){const s=[],o=(e,t,i)=>{const o=Array.from(new Set(e.filter(Boolean))),r=Array.from(new Set(t)).sort((e,t)=>e-t);0!==o.length&&0!==r.length&&s.push({ids:o,personIdxs:r,label:i?.trim()||void 0})};return e.length&&o(e,this._allPersonIdxs()),t.forEach(e=>o(e.ids,this._resolvePersonRefs(e.persons),e.label)),i.forEach(({id:e,owners:t})=>{if(t.length<2)return;const i=s.some(i=>i.ids.includes(e)&&t.every(e=>i.personIdxs.includes(e)));i||o([e],t)}),s}_sharedCals(){const e=this._config.shared_calendar;return Array.isArray(e)?e.filter(Boolean):e?[e]:[]}_sharedCalendarGroups(){const e=Array.isArray(this._config.shared_calendar_groups)?this._config.shared_calendar_groups:[],t=new Map;return this._config.persons.forEach((e,i)=>{new Set(this._calsOf(e)).forEach(e=>{const s=t.get(e)??[];s.includes(i)||s.push(i),t.set(e,s)})}),this._normalizeSharedGroups(this._sharedCals(),e.map(e=>({ids:Array.isArray(e.calendars)?e.calendars.filter(Boolean):e.calendars?[e.calendars]:[],persons:e.persons,label:e.label})),Array.from(t,([e,t])=>({id:e,owners:t})))}_sharedTodos(){const e=this._config.shared_todo;return Array.isArray(e)?e.filter(Boolean):e?[e]:[]}_sharedTodoGroups(){const e=Array.isArray(this._config.shared_todo_groups)?this._config.shared_todo_groups:[],t=new Map;return this._config.persons.forEach((e,i)=>{new Set(this._todosOf(e)).forEach(e=>{const s=t.get(e)??[];s.includes(i)||s.push(i),t.set(e,s)})}),this._normalizeSharedGroups(this._sharedTodos(),e.map(e=>({ids:Array.isArray(e.todos)?e.todos.filter(Boolean):e.todos?[e.todos]:[],persons:e.persons,label:e.label})),Array.from(t,([e,t])=>({id:e,owners:t})))}_sharedCalendarIds(){return Array.from(new Set(this._sharedCalendarGroups().flatMap(e=>e.ids)))}_sharedTodoIds(){return Array.from(new Set(this._sharedTodoGroups().flatMap(e=>e.ids)))}_sharedGroupFor(e,t){return e.find(e=>e.ids.includes(t))}_isShared(e){return!0===e.shared||-1===e.personIdx}_sharedPersons(e){return e.ref.shared_person_idxs?.length?e.ref.shared_person_idxs:this._allPersonIdxs()}_sharedLabel(e){const t=e?.ref.shared_label?.trim();if(t)return t;const i=this._sharedCalendarIds();return 1===i.length?this._calLabel(i[0]):this._t("shared_events")}_sharedRange(e,t=this._allPersonIdxs()){const i=this._sharedPersons(e).filter(e=>t.includes(e));if(0===i.length)return null;const s=i.map(e=>t.indexOf(e)).filter(e=>e>=0).sort((e,t)=>e-t);if(!s.length)return null;const o=s[0];return{start:o,span:s[s.length-1]-o+1}}_sharedGridStyle(e,t=this._allPersonIdxs()){const i=this._sharedRange(e,t);return i?`grid-column:${i.start+1} / span ${i.span}`:"display:none"}_sharedBandStyle(e,t,i){const s=this._sharedRange(e);if(!s)return null;const{top:o,height:r}=this._sharedBandBox(e,t,i);return`top:${o+1.5}px;height:${r}px;left:calc(var(--fb-axis-width, 56px) + ${s.start/this._persons.length*100}% + 2px);width:calc(${s.span/this._persons.length*100}% - 4px)`}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _pxPerMin(){if(this._config.fit_height&&this._fitPx>0)return this._fitPx;return Math.min(96,Math.max(40,this._config.hour_height??64))/60}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}_dayWindow(e){const t=this._startMin,i=this._endMin;if(!1===this._config.trim_hours)return{startMin:t,endMin:i};const s=this._events.filter(t=>t.day===e&&!t.allDay);if(0===s.length)return{startMin:t,endMin:i};let o=Math.min(...s.map(e=>e.startMin)),r=Math.max(...s.map(e=>e.endMin));if(this._isRealToday(e)){const e=new Date,s=60*e.getHours()+e.getMinutes();s>=t&&s<=i&&(o=Math.min(o,s),r=Math.max(r,s))}let a=Math.max(t,60*Math.floor(o/60)),n=Math.min(i,60*Math.ceil(r/60));return n-a<360&&(n=Math.min(i,a+360),a=Math.max(t,n-360)),{startMin:a,endMin:n}}_jsDay(e){return(this._firstDayJs+e)%7}get _visibleDays(){const e=[0,1,2,3,4,5,6];return!1===this._config.show_weekends?e.filter(e=>{const t=this._jsDay(e);return 0!==t&&6!==t}):e}_t(e){return ye(this.hass,e)}_calMeta(e){return e&&this._config.calendars?.[e]||{}}_mapUrl(e){const t=this._config.map_url,i=encodeURIComponent(e);return"string"==typeof t&&t.includes("{location}")?t.replace("{location}",i):`https://www.google.com/maps/search/?api=1&query=${i}`}_calIcon(e){return this._calMeta(e).icon}_calIconEl(e){if("todo"===e.ref.kind)return W;const t=this._calIcon(e.ref.calendar);return t?K`<ha-icon class="cicon" .icon=${t}></ha-icon>`:W}_calLabel(e){return this._calMeta(e).label??(this.hass.states[e]?.attributes?.friendly_name||e)}_eventColor(e){if("todo"===e.ref.kind)return e.color;const t=this._config.color_by;return"location"===t&&e.location?Be(e.location):"calendar"===t&&e.ref.calendar?this._calMeta(e.ref.calendar).color??Be(e.ref.calendar):e.color}_isPast(e){return!1!==this._config.dim_past&&e.ref.end.getTime()<=Date.now()}_sharedFor(e){return this._events.filter(t=>t.day===e&&this._isShared(t)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_todoAnchorDates(e,t){const i=[],s=Oe(e);for(;s.getTime()<t.getTime();)i.push(new Date(s)),s.setDate(s.getDate()+1);return i.length>0?i:[Oe(e)]}_todoToRawEvent(e,t,i,s,o,r,a,n=!1){if(!e||"string"!=typeof e.summary||"completed"===e.status)return null;const l="string"==typeof e.due?e.due.trim():"",d=l.includes(" ")&&!l.includes("T")?l.replace(" ","T"):l,c=d.includes("T");let h=Oe(o),p=new Date(h.getTime()+_e),_=!0;if(d)if(c){const e=new Date(d);if(isNaN(e.getTime()))return null;h=e,p=new Date(e.getTime()+6e4*Math.max(this._grid,30)),_=!1}else{const e=new Date(`${d}T00:00:00`);if(isNaN(e.getTime()))return null;h=e,p=new Date(e.getTime()+_e)}return p.getTime()<=r.getTime()||h.getTime()>=a.getTime()?null:{kind:"todo",personIdx:t,shared:n,calendar:s,uid:e.uid,summary:e.summary.trim()||this._t("todo"),description:e.description,allDay:_,start:h,end:p,color:i,tentative:!1,todo_item:e.uid||e.summary,todo_due:l||void 0,todo_due_has_time:d?c:void 0}}_isTodo(e){return"todo"===e.ref.kind}_sharedAllDay(e){return this._sharedFor(e).filter(e=>e.allDay)}_sharedTimed(e){return fe(this._sharedFor(e).filter(e=>!e.allDay))}_sharedBandBox(e,t,i){const s=(e.startMin-i)*t,o=Math.max((e.endMin-e.startMin)*t-3,12);if(e.cols<=1)return{top:s,height:o};const r=Math.min(8,Math.max(3,Math.floor(o/Math.max(3*e.cols,3))));return{top:s+e.col*r,height:Math.max(12,o-(e.cols-1)*r)}}_relativeDay(e){const t=Math.round((Oe(e).getTime()-Oe(new Date).getTime())/_e);return 0===t?this._t("today"):1===t?this._t("tomorrow"):-1===t?this._t("yesterday"):null}_isOff(e){return this._hiddenP.includes(e)}_togglePerson(e){this._hiddenP=this._isOff(e)?this._hiddenP.filter(t=>t!==e):[...this._hiddenP,e]}_timedFor(e,t){if(this._isOff(t))return[];const i=this._events.filter(i=>i.day===e&&i.personIdx===t&&!i.allDay&&!this._isBackground(i));return fe(i)}_bgMinMin(){const e=Number(this._config.background_hours??3);return!Number.isFinite(e)||e<=0?0:60*e}_isBackground(e){const t=this._bgMinMin();return t>0&&!this._isTodo(e)&&!e.allDay&&e.endMin-e.startMin>=t}_bgFor(e,t){return this._isOff(t)?[]:this._events.filter(i=>i.day===e&&i.personIdx===t&&!i.allDay&&this._isBackground(i)).sort((e,t)=>t.endMin-t.startMin-(e.endMin-e.startMin))}_maxCols(){const e=Number(this._config.max_columns);return!Number.isFinite(e)||e<1?3:Math.min(Math.round(e),8)}_dayLayout(e,t){const i=this._timedFor(e,t),s=this._maxCols(),o=new Map;for(const e of i){const t=o.get(e.cluster);t?t.push(e):o.set(e.cluster,[e])}const r=[],a=[];for(const e of o.values()){if(e[0].cols<=s){r.push(...e);continue}let t=0,i=1/0,o=-1/0;for(const a of e)a.col<=s-2?r.push({...a,cols:s,span:Math.max(1,Math.min(a.span,s-a.col))}):(t++,i=Math.min(i,a.startMin),o=Math.max(o,a.endMin));t>0&&a.push({col:s-1,cols:s,startMin:i,endMin:o,count:t})}return{events:r,overflows:a}}_evTitle(e){const t=e.parts&&e.parts>1?`${e.title} (${e.part}/${e.parts})`:e.title,i=this._autoIcon(e.title);return i?`${i} ${t}`:t}_autoIcon(e){if(!0!==this._config.auto_icons)return"";if(!e||Ee.test(e))return"";const t=this._config.icon_patterns;if(Array.isArray(t)){const i=e.toLowerCase();for(const e of t){const t=String(e),s=t.indexOf("=>");if(s<0)continue;const o=t.slice(0,s).trim().toLowerCase(),r=t.slice(s+2).trim();if(o&&r&&i.includes(o))return r}}for(const[t,i]of Se)if(t.test(e))return i;return""}_isTentative(e){return!0===e.ref.tentative}_showDayAgenda(e){this._day=e,this._enabledViews.includes("agenda")&&(this._view="agenda")}_openDayView(e){this._day=e,this._enabledViews.includes("day")&&(this._view="day")}_allDayFor(e,t){return this._isOff(t)?[]:this._events.filter(i=>i.day===e&&i.personIdx===t&&i.allDay)}_eventsFor(e,t){return this._isOff(t)?[]:this._events.filter(i=>i.day===e&&i.personIdx===t).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_dateForDay(e){const{monday:t}=this._weekBounds();return new Date(t.getTime()+e*_e)}_isRealToday(e){return 0===this._weekOffset&&e===this._todayIndex()}_onItemKey(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this._openEvent(t))}_dayHasEvents(e){return this._sharedFor(e).length>0||this._persons.some((t,i)=>this._eventsFor(e,i).length>0)}_eventOwnerLabel(e){return this._isShared(e)?this._sharedLabel(e):this._personName(this._persons[e.personIdx],e.personIdx)}_personName(e,t){return e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${t+1}`}_todoLabel(e){return this.hass.states[e]?.attributes?.friendly_name??e}_todoOwnerKey(e){return-1===e?"shared":`person:${e}`}_todoSortKey(e){return`${("string"==typeof e.due?e.due.trim():"")||"9999-12-31T23:59:59"}::${e.summary.toLowerCase()}`}_todoItemsForPerson(e){return[...this._todoItemsByOwner[this._todoOwnerKey(e)]??[]].sort((e,t)=>this._todoSortKey(e).localeCompare(this._todoSortKey(t)))}_todoCountForPerson(e){return this._todoItemsForPerson(e).length}_formatTodoDue(e){if(!e)return"";const t=e.trim();if(!t)return"";const i=t.includes("T")||t.includes(" "),s=new Date(t.replace(" ","T"));if(Number.isNaN(s.getTime()))return t;const o=s.toLocaleDateString(this.hass.locale.language,{day:"2-digit",month:"2-digit"});return i?`${o} · ${ke(this.hass,60*s.getHours()+s.getMinutes())}`:o}_todoKey(e){return`${e.entityId}::${this._todoRef(e)}`}_todoFromEvent(e){if(!this._isTodo(e))return null;const t=e.ref;return{entityId:t.calendar,uid:t.uid,summary:t.summary,status:"needs_action",due:t.todo_due,description:t.description,listLabel:this._todoLabel(t.calendar)}}_isTodoBusy(e){const t=this._todoFromEvent(e);return!!t&&this._todoBusy.includes(this._todoKey(t))}_todoRef(e){return e.uid||e.summary}_openTodo(e){const t=this._todoFeatures(e.entityId);this._todoDialog={entityId:e.entityId,uid:e.uid,itemRef:this._todoRef(e),summary:e.summary,description:e.description??"",due:e.due?e.due.includes("T")||e.due.includes(" ")?Pe(new Date(e.due.replace(" ","T"))):e.due:"",dueHasTime:!!e.due&&(e.due.includes("T")||e.due.includes(" ")),canUpdate:!!(4&t),canDelete:!!(2&t),supportsDescription:!!(64&t)||!!e.description,supportsDueDate:!!(16&t)||!!(32&t)||!!e.due,supportsDueDatetime:!!(32&t)||!!e.due?.includes("T")||!!e.due?.includes(" ")}}_openTodoBadgeDialog(e){this._todoBadgeDialog={personIdx:e}}_closeTodoBadgeDialog(){this._todoBadgeDialog=void 0}_todoDlgField(e,t){this._todoDialog&&(this._todoDialog={...this._todoDialog,[e]:t,error:void 0})}async _toggleTodo(e){if(!this._canUpdateTodo(e.entityId))return;const t=this._todoKey(e);this._todoBusy=[...this._todoBusy,t];try{await this.hass.callWS({type:"call_service",domain:"todo",service:"update_item",target:{entity_id:e.entityId},service_data:{item:this._todoRef(e),status:"completed"}}),await this._refetch()}finally{this._todoBusy=this._todoBusy.filter(e=>e!==t)}}_renderTodoItemCheckbox(e){const t=this._todoBusy.includes(this._todoKey(e)),i=this._canUpdateTodo(e.entityId),s=e=>e.stopPropagation();return K`<input
      class="todo-check"
      type="checkbox"
      aria-label="${this._t("todo_complete")}: ${e.summary}"
      .checked=${t}
      ?disabled=${!i||t}
      @pointerdown=${s}
      @click=${s}
      @keydown=${s}
      @change=${t=>{t.stopPropagation();const i=t.target;i.checked?this._toggleTodo(e):i.checked=!1}}
    />`}_renderTodoCheckbox(e){const t=this._todoFromEvent(e);return t?this._renderTodoItemCheckbox(t):W}async _completeTodoDialog(){if(!this._todoDialog||!this._canUpdateTodo(this._todoDialog.entityId))return;const e=this._todoDialog;this._todoDialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"call_service",domain:"todo",service:"update_item",target:{entity_id:e.entityId},service_data:{item:e.itemRef,status:"completed"}}),this._todoDialog=void 0,await this._refetch()}catch(t){this._todoDialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}async _saveTodoDialog(){if(!this._todoDialog)return;const e=this._todoDialog;this._todoDialog={...e,busy:!0,error:void 0};try{const t={item:e.itemRef,rename:e.summary.trim()||e.summary};e.supportsDescription&&(t.description=e.description.trim()),e.supportsDueDatetime?t.due_datetime=e.due.trim()?new Date(e.due).toISOString().slice(0,19).replace("T"," "):"":e.supportsDueDate&&(t.due_date=e.due.trim()),await this.hass.callWS({type:"call_service",domain:"todo",service:"update_item",target:{entity_id:e.entityId},service_data:t}),this._todoDialog=void 0,await this._refetch()}catch(t){this._todoDialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}async _deleteTodoDialog(){if(!this._todoDialog)return;const e=this._todoDialog;this._todoDialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"call_service",domain:"todo",service:"remove_item",target:{entity_id:e.entityId},service_data:{item:e.itemRef}}),this._todoDialog=void 0,await this._refetch()}catch(t){this._todoDialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}_closeTodoDialog(){this._todoDialog=void 0}_openTodoFromBadge(e){this._closeTodoBadgeDialog(),this._openTodo(e)}_avatar(e,t){const i=Fe(e,t),s=e.person?this.hass.states[e.person]:void 0,o=s?.attributes?.entity_picture,r=this._personName(e,t).slice(0,2).toUpperCase();return o?K`<div
          class="avatar"
          style="background-image:url('${o}');box-shadow:0 0 0 2px ${i}55"
        ></div>`:K`<div class="avatar initials" style="background:${i}">${r}</div>`}_todoBadge(e){const t=this._todoCountForPerson(e);if(!t)return W;const i=this._personName(this._persons[e],e);return K`<span
      class="pbadge todo-badge"
      title="${i} · ${t} ${this._t("todo_items")}"
      role="button"
      tabindex="0"
      @click=${t=>{t.stopPropagation(),this._openTodoBadgeDialog(e)}}
      @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this._openTodoBadgeDialog(e))}}
    >
      <ha-icon icon="mdi:checkbox-marked-circle-outline"></ha-icon>
      <span>${t}</span>
    </span>`}_badges(e,t){const i=Array.isArray(e.badges)?e.badges.filter(Boolean):[],s=this._todoCountForPerson(t);if(0===i.length&&0===s)return W;const o=s>0?this._todoBadge(t):W;return K`<div class="pbadges">
      ${o}
      ${i.map(e=>{const t=this.hass.states[e];if(!t)return W;const i=t.attributes?.icon,s=t.attributes?.unit_of_measurement??"";return K`<span
          class="pbadge"
          title=${t.attributes?.friendly_name??e}
          role="button"
          tabindex="0"
          @click=${t=>{t.stopPropagation(),this._moreInfo(e)}}
          @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._moreInfo(e))}}
        >
          ${i?K`<ha-icon .icon=${i}></ha-icon>`:W}
          <span>${t.state}${s}</span>
        </span>`})}
    </div>`}_moreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_goToDate(e){const t=Oe(new Date),i=e=>{const t=Oe(e);return t.setDate(t.getDate()-(t.getDay()-this._firstDayJs+7)%7),t},s=Math.round((i(e).getTime()-i(t).getTime())/(7*_e));this._weekOffset=s,this._day=(e.getDay()-this._firstDayJs+7)%7,this._view=this._enabledViews.includes("day")?"day":this._view}render(){if(!this._config||!this.hass)return W;const e=this._config.title??this._t("board_title");return K`
      <ha-card>
        <div class="top">
          <div class="title">${e}</div>
          ${this._enabledViews.length>1?K`<div class="switch" role="tablist">
                ${this._enabledViews.map(e=>K`<button
                      role="tab"
                      aria-selected=${this._view===e}
                      class=${this._view===e?"on":""}
                      @click=${()=>this._view=e}
                    >
                      ${this._t(e)}
                    </button>`)}
              </div>`:W}
        </div>
        ${this._config.show_focus?this._renderFocus():W}
        ${"day"===this._view?this._renderDay():"timeline"===this._view?this._renderTimeline():"week"===this._view?this._renderWeek():"month"===this._view?this._renderMonth():this._renderAgenda()}
      </ha-card>
      ${this._dialog?this._renderDialog():this._todoDialog?this._renderTodoDialog():this._todoBadgeDialog?this._renderTodoBadgeDialog():W}
    `}_focusFor(e){const t=Date.now(),i=this._raw.filter(t=>t.personIdx===e&&!t.allDay&&"todo"!==t.kind).sort((e,t)=>e.start.getTime()-t.start.getTime()),s=i.find(e=>e.start.getTime()<=t&&t<e.end.getTime()),o=i.find(e=>e.start.getTime()>t);return{current:s,next:o}}_renderFocus(){return K`
      <div class="focus">
        ${this._persons.map((e,t)=>{if(this._isOff(t))return W;const{current:i,next:s}=this._focusFor(t),o=Fe(e,t),r=e=>this._config.auto_icons?this._autoIcon(e.summary):"";return K`
            <div class="fchip" title=${this._personName(e,t)}>
              ${this._avatar(e,t)}
              <div class="fbody">
                <span class="fname">${this._personName(e,t)}</span>
                ${i?K`<span class="fnow">
                      <span class="fdot" style="background:${o}"></span>${r(i)}
                      ${i.summary}
                      <small>bis ${$e(this.hass,i.end)}</small>
                    </span>`:s?K`<span class="fnext">
                        ${this._t("focus_next")}: ${r(s)} ${s.summary}
                        <small>${Te(this.hass,s.start)}</small>
                      </span>`:K`<span class="ffree">${this._t("focus_free")}</span>`}
              </div>
            </div>
          `})}
      </div>
    `}_weekNav(){const{monday:e}=this._weekBounds();return K`
      <div class="weeknav">
        <button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
        <button class="nav-now" @click=${this._thisWeek}>
          ${function(e,t){const i=new Date(t.getTime()+5184e5),s=new Intl.DateTimeFormat(xe(e),{day:"numeric",month:"short"});return`${s.format(t)} – ${s.format(i)}`}(this.hass,e)}
        </button>
        <button class="nav" aria-label=${this._t("next_week")} @click=${this._nextWeek}>›</button>
      </div>
    `}_renderDayTabs(){const e=De(this.hass,"short",this._firstDayJs);return K`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map(t=>K`
            <button
              role="tab"
              aria-selected=${t===this._day}
              class="${t===this._day?"on":""} ${this._isRealToday(t)?"today":""}"
              @click=${()=>this._day=t}
            >
              ${e[t]}
            </button>
          `)}
      </div>
    `}_renderDay(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],t=this._pxPerMin,i=60*t,{startMin:s,endMin:o}=this._dayWindow(e),r=(o-s)*t,a=De(this.hass,"long",this._firstDayJs),n=this._sharedAllDay(e).filter(e=>!this._isTodo(e)),l=this._sharedTimed(e),d=[];for(let e=s/60;e<=o/60;e++)d.push(e);const c=new Date,h=Math.max(s,Math.min(o,60*c.getHours()+c.getMinutes())),p=!1!==this._config.show_now_line&&this._isRealToday(e),_=n.length>0||this._persons.some((t,i)=>this._allDayFor(e,i).length>0);return K`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??a[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading&&0===this._raw.length?K`<span class="spinner"></span>`:W}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError?K`<div class="banner">${this._t("load_error")}</div>`:W}
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((e,t)=>{const i=e.person?this.hass.states[e.person]:void 0,s=this._isOff(t);return K`
              <div
                class="phead ${s?"off":""}"
                role="button"
                tabindex="0"
                title=${this._personName(e,t)}
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}
                ${s?W:K`<div class="pname">${this._personName(e,t)}</div>
                      <div class="pstatus">
                        ${i?this._statusLabel(i.state):""}
                      </div>
                      ${this._badges(e,t)}`}
              </div>
            `})}
        </div>
        ${_?K`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                <div class="allday-main">
                  ${n.length?K`<div class="allday-shared">
                        ${n.map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`
                            <div
                              class="adchip shared ${i?"tentative":""}"
                              style="${this._sharedGridStyle(e)};border-left:3px ${i?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                              title="${this._evTitle(e)}"
                              tabindex="0"
                              role="button"
                              @click=${()=>this._openEvent(e)}
                              @keydown=${t=>this._onItemKey(t,e)}
                            >
                              ${this._isTodo(e)?K`<span class="todo-line">
                                    ${this._renderTodoCheckbox(e)}
                                    <span class="todo-label"
                                      >${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                                    >
                                  </span>`:K`${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}`}
                            </div>
                          `})}
                      </div>`:W}
                  <div class="allday-grid">
                    ${this._persons.map((t,i)=>{const s=this._allDayFor(e,i).filter(e=>!this._isTodo(e));return K`
                        <div class="allday-cell ${this._isOff(i)?"off":""}">
                          ${s.map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`
                              <div
                                class="adchip ${i?"tentative":""}"
                                style="border-left:3px ${i?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                                title="${this._evTitle(e)}"
                                tabindex="0"
                                role="button"
                                @click=${()=>this._openEvent(e)}
                                @keydown=${t=>this._onItemKey(t,e)}
                              >
                                ${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}
                              </div>
                            `})}
                        </div>
                      `})}
                  </div>
                </div>
              </div>
            `:W}
        <div class="body" style="height:${r}px">
          <div class="axis">
            ${d.map(e=>K`<div class="hour" style="top:${(60*e-s)*t}px">
                  ${Ce(e)}:00
                </div>`)}
          </div>
          ${this._persons.map((r,a)=>{const n=this._personCanCreate(r),l=this._dayLayout(e,a);return K`
              <div
                class="col ${n?"creatable":""} ${this._isOff(a)?"off":""}"
                @click=${i=>this._onColClick(i,a,e,t,s)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${i}px, transparent ${i}px ${2*i}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${i}px)"
              >
                ${this._bgFor(e,a).filter(e=>e.endMin>s&&e.startMin<o).map((e,i)=>{const o=(e.startMin-s)*t,r=Math.max((e.endMin-e.startMin)*t-3,16),a=this._eventColor(e),n=this._isTentative(e);return K`
                      <div
                        class="band ${this._isPast(e)?"past":""} ${n?"tentative":""}"
                        tabindex="0"
                        role="button"
                        @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                        @keydown=${t=>this._onItemKey(t,e)}
                        style="top:${o+1.5}px;height:${r}px;
                               border:1.5px dashed ${a}55;
                               background:${a}0d;
                               background:repeating-linear-gradient(45deg,
                                 color-mix(in srgb, ${a} 8%, transparent) 0 8px,
                                 transparent 8px 16px)"
                        title="${this._evTitle(e)} · ${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}"
                      >
                        <span
                          class="etitle"
                          style="margin-top:${19*i}px;
                                 background:${a}26;
                                 background:color-mix(in srgb, ${a} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                        >
                      </div>
                    `})}
                ${(()=>{let e=-1/0;return l.events.filter(e=>e.endMin>s&&e.startMin<o).map(i=>{const o=this._drag?.raw===i.ref;let r=i.startMin,a=i.endMin;if(o&&this._drag){const e=this._dragGrid;if("move"===this._drag.mode){const t=Math.round((i.startMin+this._drag.deltaMin)/e)*e;a=i.endMin+(t-i.startMin),r=t}else{let t=Math.round((i.endMin-i.startMin+this._drag.deltaMin)/e)*e;t<e&&(t=e),a=i.startMin+t}}let n=(r-s)*t;const l=Math.max((a-r)*t-3,16),d=this._eventColor(i),c=i.col/i.cols*100,h=(i.span??1)/i.cols*100,p=this._isTentative(i),_=l<24,u=this._draggable(i);return _&&1===i.cols&&!o&&(n=Math.max(n,e+1),e=n+l),K`
                        <div
                          class="event ${this._isPast(i)?"past":""} ${p?"tentative":""} ${this._isTodo(i)?"todo":""} ${_?"slim":""} ${u?"draggable":""} ${o?"dragging":""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${e=>this._onEventPointerDown(e,i,"move")}
                          @click=${e=>{e.stopPropagation(),this._suppressClick?this._suppressClick=!1:this._openEvent(i)}}
                          @keydown=${e=>this._onItemKey(e,i)}
                          style="top:${n+1.5}px;height:${l}px;
                               left:calc(${c}% + 2px);width:calc(${h}% - 4px);
                               border-left:3px ${p?"dashed":"solid"} ${d};background:${d}40;background:color-mix(in srgb, ${d} 32%, var(--card-background-color, #fff));"
                          title="${this._evTitle(i)} · ${ke(this.hass,i.startMin)}–${ke(this.hass,i.endMin)}"
                        >
                          <span class="etitle ${this._isTodo(i)?"todo-line":""}"
                            >${this._isTodo(i)?this._renderTodoCheckbox(i):W}${this._isTodo(i)?K`<span class="todo-label"
                                  >${this._calIconEl(i)}${i.continuesBefore?"« ":""}${this._evTitle(i)}</span
                                >`:K`${this._calIconEl(i)}${i.continuesBefore?"« ":""}${this._evTitle(i)}`}</span
                          >
                          ${l>32||o?K`<span class="etime"
                                >${ke(this.hass,r)}–${ke(this.hass,a)}</span
                              >`:W}
                          ${this._progressOn&&this._isCurrent(i)&&!o?K`<div class="eprog">
                                <div style="width:${this._progressPct(i)}%"></div>
                              </div>`:W}
                          ${u&&!_?K`<div
                                class="rz"
                                @pointerdown=${e=>this._onEventPointerDown(e,i,"resize")}
                              ></div>`:W}
                        </div>
                      `})})()}
                ${l.overflows.filter(e=>e.endMin>s&&e.startMin<o).map(i=>{const o=(i.startMin-s)*t,r=Math.max((i.endMin-i.startMin)*t-3,16),a=i.col/i.cols*100,n=100/i.cols;return K`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${i.count} ${this._t("more_events")}"
                        @click=${t=>{t.stopPropagation(),this._showDayAgenda(e)}}
                        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showDayAgenda(e))}}
                        style="top:${o+1.5}px;height:${r}px;
                               left:calc(${a}% + 2px);width:calc(${n}% - 4px)"
                      >
                        <span class="etitle">+${i.count}</span>
                      </div>
                    `})}
              </div>
            `})}
          ${l.filter(e=>e.endMin>s&&e.startMin<o).map(e=>{const i=this._sharedBandStyle(e,t,s);if(!i)return W;const{height:o}=this._sharedBandBox(e,t,s),r=this._eventColor(e),a=this._isTentative(e);return K`
                <div
                  class="shared-band ${this._isPast(e)?"past":""} ${a?"tentative":""}"
                  tabindex="0"
                  role="button"
                  @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                  @keydown=${t=>this._onItemKey(t,e)}
                  style="${i};
                         border-left:3px ${a?"dashed":"solid"} ${r};
                         background:${r}1f;
                         background:color-mix(in srgb, ${r} 14%, var(--card-background-color, #fff))"
                  title="${this._evTitle(e)} · ${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}"
                >
                  <span class="shared-tag">${this._sharedLabel(e)}</span>
                  <span class="etitle"
                    >${e.continuesBefore?"« ":""}${this._calIconEl(e)}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                  >
                  ${o>24?K`<span class="etime"
                        >${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}</span
                      >`:W}
                </div>
              `})}
          ${p?K`<div class="nowline" style="top:${(h-s)*t}px">
                <span>${ke(this.hass,h)}</span>
              </div>`:W}
          ${this._loading||this._loadError||this._dayHasEvents(e)?W:K`<div class="empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `}_renderTimeline(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],{startMin:t,endMin:i}=this._dayWindow(e),s=Math.min(240,Math.max(48,Number(this._config.hour_width)||96)),o=s/60,r=(i-t)*o,a=De(this.hass,"long",this._firstDayJs),n=this._sharedTimed(e),l=this._persons.map((e,t)=>t).filter(e=>!this._isOff(e)),d=[];for(let e=t/60;e<=i/60;e++)d.push(e);const c=new Date,h=60*c.getHours()+c.getMinutes(),p=!1!==this._config.show_now_line&&this._isRealToday(e)&&h>=t&&h<=i,_=30;return K`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??a[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading&&0===this._raw.length?K`<span class="spinner"></span>`:W}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError?K`<div class="banner">${this._t("load_error")}</div>`:W}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${r}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${r}px">
              ${d.map(e=>K`<span class="tlhour" style="left:${(60*e-t)*o}px"
                    >${Ce(e)}:00</span
                  >`)}
            </div>
          </div>
          ${n.length?K`
                <div class="tlrow shared">
                  <div class="tlperson shared">
                    <div>
                      <div class="pname">${this._t("shared_events")}</div>
                    </div>
                  </div>
                  <div
                    class="tlcanvas shared"
                    style="width:${r}px;height:${Math.max(...n.map(e=>e.cols))*_+8}px;
                           background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${s}px),
                           repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${s/2}px)"
                  >
                    ${n.filter(e=>e.endMin>t&&e.startMin<i).map(e=>{const s=Math.max(e.startMin,t),r=Math.min(e.endMin,i),a=Math.max((r-s)*o-3,20),n=this._eventColor(e),d=this._isTentative(e),c=e.continuesBefore||e.startMin<t,h=e.continuesAfter||e.endMin>i;return this._sharedRange(e,l)?K`
                          <div
                            class="tlbar shared ${this._isPast(e)?"past":""} ${d?"tentative":""}"
                            tabindex="0"
                            role="button"
                            @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                            @keydown=${t=>this._onItemKey(t,e)}
                            style="left:${(s-t)*o+1.5}px;width:${a}px;
                                   top:${e.col*_+4}px;height:${24}px;
                                   border-left:3px ${d?"dashed":"solid"} ${n};
                                   background:${n}28;
                                   background:color-mix(in srgb, ${n} 18%, var(--card-background-color, #fff))"
                            title="${this._evTitle(e)}${e.allDay?` · ${this._t("all_day")}`:` · ${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}`}"
                          >
                            <span class="shared-tag">${this._sharedLabel(e)}</span>
                            <span class="etitle"
                              >${c?"« ":""}${this._calIconEl(e)}${this._evTitle(e)}${h?" »":""}</span
                            >
                          </div>
                        `:W})}
                  </div>
                </div>
              `:W}
          ${this._persons.map((a,n)=>{const l=this._isOff(n),d=l?[]:this._events.filter(t=>t.day===e&&t.personIdx===n),c=fe(d),h=c.length?Math.max(...c.map(e=>e.cols)):1,p=this._personCanCreate(a),u=a.person?this.hass.states[a.person]:void 0;return K`
              <div class="tlrow ${l?"off":""}">
                <div
                  class="tlperson"
                  role="button"
                  tabindex="0"
                  @click=${()=>this._togglePerson(n)}
                  @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(n))}}
                >
                  ${this._avatar(a,n)}
                  <div class="pmeta">
                    <div class="pname">${this._personName(a,n)}</div>
                    <div class="pstatus">${u?this._statusLabel(u.state):""}</div>
                    ${this._badges(a,n)}
                  </div>
                </div>
                <div
                  class="tlcanvas ${p?"creatable":""}"
                  style="width:${r}px;height:${h*_+8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${s}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${s/2}px)"
                  @click=${i=>this._onTimelineClick(i,n,e,o,t)}
                >
                  ${c.filter(e=>e.endMin>t&&e.startMin<i).map(e=>{const s=Math.max(e.startMin,t),r=Math.min(e.endMin,i),a=Math.max((r-s)*o-3,20),n=this._eventColor(e),l=this._isTentative(e),d=e.continuesBefore||e.startMin<t,c=e.continuesAfter||e.endMin>i;return K`
                        <div
                          class="tlbar ${this._isPast(e)?"past":""} ${l?"tentative":""} ${this._isTodo(e)?"todo":""}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                          style="left:${(s-t)*o+1.5}px;width:${a}px;
                                 top:${e.col*_+4}px;height:${24}px;
                                 border-left:3px ${l?"dashed":"solid"} ${n};background:${n}40;background:color-mix(in srgb, ${n} 32%, var(--card-background-color, #fff));"
                          title="${this._evTitle(e)}${e.allDay?` · ${this._t("all_day")}`:` · ${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}`}"
                        >
                          <span class="etitle ${this._isTodo(e)?"todo-line":""}"
                            >${this._isTodo(e)?this._renderTodoCheckbox(e):W}${this._isTodo(e)?K`<span class="todo-label"
                                  >${d?"« ":""}${this._evTitle(e)}${c?" »":""}</span
                                >`:K`${d?"« ":""}${this._evTitle(e)}${c?" »":""}`}</span
                          >
                          ${!e.allDay&&a>120?K`<span class="etime"
                                >${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}</span
                              >`:W}
                        </div>
                      `})}
                </div>
              </div>
            `})}
          ${p?K`<div
                class="tlnow"
                style="left:calc(var(--fb-tl-label, 150px) + ${(h-t)*o}px)"
              >
                <span>${ke(this.hass,h)}</span>
              </div>`:W}
        </div>
        ${this._loading||this._loadError||this._dayHasEvents(e)?W:K`<div class="empty">${this._t("no_events")}</div>`}
      </div>
    `}_onTimelineClick(e,t,i,s,o){const r=this._persons[t];if(!this._personCanCreate(r))return;const a=e.currentTarget.getBoundingClientRect();let n=o+(e.clientX-a.left)/s;const l=this._grid;n=Math.round(n/l)*l,n=Math.max(0,Math.min(n,1440-l)),this._openCreate(t,i,n)}_renderWeek(){const e=De(this.hass,"short",this._firstDayJs),t=this._persons.map((e,t)=>({p:e,i:t})).filter(({i:e})=>!0!==this._config.hide_empty_persons||this._events.some(t=>t.personIdx===e||this._isShared(t)&&this._sharedPersons(t).includes(e))),i=t.length>0?t:this._persons.map((e,t)=>({p:e,i:t})),s=`70px repeat(${i.length}, minmax(110px, 1fr))`;return K`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${s}">
          <div class="corner"></div>
          ${i.map(({p:e,i:t})=>K`<div
                class="wphead ${this._isOff(t)?"off":""}"
                role="button"
                tabindex="0"
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}
                <div class="pmeta">
                  <div class="pname">${this._personName(e,t)}</div>
                  ${this._badges(e,t)}
                </div>
              </div>`)}
          ${this._visibleDays.map(t=>{const s=this._sharedFor(t),o=i.map(({i:e})=>e);return K`
              <div
                class="wday ${this._isRealToday(t)?"today":""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                @click=${()=>this._openDayView(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDayView(t))}}
              >
                <b>${e[t]}</b>
              </div>
              ${s.length?K`
                    <div class="wshared ${this._isRealToday(t)?"today":""}">
                      ${s.map(e=>{const t=this._eventColor(e),i=this._isTentative(e),s=this._sharedGridStyle(e,o);return"display:none"===s?W:K`
                          <div
                            class="wshared-chip ${this._isPast(e)?"past":""} ${i?"tentative":""}"
                            style="${s};border-left:2.5px ${i?"dashed":"solid"} ${t};background:${t}28;background:color-mix(in srgb, ${t} 18%, var(--card-background-color, #fff))"
                            title="${this._evTitle(e)}"
                            tabindex="0"
                            role="button"
                            @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                            @keydown=${t=>this._onItemKey(t,e)}
                          >
                            <span class="shared-tag">${this._sharedLabel(e)}</span>
                            <span
                              >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                            >
                            ${e.allDay?K`<small>${this._t("all_day")}</small>`:K`<small
                                  >${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}</small
                                >`}
                          </div>
                        `})}
                    </div>
                    <div class="wspacer ${this._isRealToday(t)?"today":""}"></div>
                  `:W}
              ${i.map(({p:e,i:i})=>{const s=this._personCanCreate(e);return K`
                  <div
                    class="wcell ${this._isRealToday(t)?"today":""} ${s?"creatable":""}"
                    @click=${()=>s&&this._openCreate(i,t)}
                  >
                    ${this._eventsFor(t,i).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`
                        <div
                          class="wchip ${this._isPast(e)?"past":""} ${i?"tentative":""} ${this._isTodo(e)?"todo":""}"
                          style="border-left:2.5px ${i?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                        >
                          <span class=${this._isTodo(e)?"todo-line":""}
                            >${this._isTodo(e)?this._renderTodoCheckbox(e):W}${this._isTodo(e)?K`<span class="todo-label"
                                  >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}</span
                                >`:K`${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}`}</span
                          >
                          ${e.allDay?W:K`<small>${ke(this.hass,e.startMin)}</small>`}
                        </div>
                      `})}
                  </div>
                `})}
            `})}
        </div>
      </div>
    `}_renderAgenda(){const e=De(this.hass,"long",this._firstDayJs),t=new Intl.DateTimeFormat(this.hass.locale?.language||"en",{day:"numeric",month:"short"}),i=e=>{if(!this._config.filter_duplicates)return e;const t=new Set;return e.filter(e=>{const i=`${this._evTitle(e)}|${e.ref.start.getTime()}|${e.ref.end.getTime()}`;return!t.has(i)&&(t.add(i),!0)})},s=this._visibleDays.map(e=>({d:e,items:i(this._events.filter(t=>t.day===e&&!this._isOff(t.personIdx)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin))})).filter(e=>e.items.length>0);return K`
      <div class="weekhead">${this._weekNav()}</div>
      ${this._loadError?K`<div class="banner">${this._t("load_error")}</div>`:W}
      <div class="agenda">
        ${0===s.length?K`<div class="agenda-empty">
              ${this._loading?K`<span class="spinner"></span>`:this._t("no_events")}
            </div>`:s.map(i=>K`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(i.d)?"today":""}">
                    ${this._relativeDay(this._dateForDay(i.d))??e[i.d]} ·
                    ${t.format(this._dateForDay(i.d))}
                    ${this._weatherChip(this._dateForDay(i.d))}
                  </div>
                  ${i.items.map(e=>this._agendaRow(e))}
                </div>
              `)}
      </div>
    `}_agendaRow(e){const t=this._eventColor(e),i=this._eventOwnerLabel(e),s=e.allDay?this._t("all_day"):`${ke(this.hass,e.startMin)}–${ke(this.hass,e.endMin)}`,o=this._isCurrent(e),r=this._isTentative(e),a=e.allDay||o||e.continuesBefore?"":Te(this.hass,e.ref.start);return K`
      <div
        class="agenda-row ${this._isPast(e)?"past":""} ${o?"current":""} ${r?"tentative":""} ${this._isShared(e)?"shared":""} ${this._isTodo(e)?"todo":""}"
        tabindex="0"
        role="button"
        @click=${()=>this._openEvent(e)}
        @keydown=${t=>this._onItemKey(t,e)}
      >
        <span class="agenda-time">${s}</span>
        <span class="agenda-bar" style="background:${t}"></span>
        <span class="agenda-main">
          <span class="agenda-title ${this._isTodo(e)?"todo-line":""}"
            >${this._isTodo(e)?this._renderTodoCheckbox(e):W}${this._isTodo(e)?K`<span class="todo-label"
                  >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                >`:K`${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}`}</span
          >
          <span class="agenda-meta">${i}${e.location?` · ${e.location}`:""}</span>
          ${o&&this._progressOn?K`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${t}"></span
              ></span>`:W}
        </span>
        ${a?K`<span class="agenda-cd">${a}</span>`:W}
      </div>
    `}_renderMonth(){const{gridStart:e,weeks:t,month:i,year:s}=this._monthGrid(),o=7*t,r=De(this.hass,"short",this._firstDayJs),a=this.hass.locale?.language||"en",n=new Intl.DateTimeFormat(a,{month:"long",year:"numeric"}).format(new Date(s,i,1)),l=new Map;for(const t of this._raw)if(!this._isOff(t.personIdx))for(const i of ge(t,e,o)){const e=l.get(i.day);e?e.push(i):l.set(i.day,[i])}const d=Oe(new Date).getTime();return K`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${n}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      ${this._loadError?K`<div class="banner">${this._t("load_error")}</div>`:W}
      <div class="monthwrap">
        <div class="monthhead">${r.map(e=>K`<div class="mhcell">${e}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({length:o},(t,s)=>{const o=new Date(e.getTime()+s*_e),r=o.getMonth()===i,a=o.getTime()===d,n=(l.get(s)||[]).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin);return K`
              <div
                class="mcell ${r?"":"out"} ${a?"today":""} ${0===o.getDay()||6===o.getDay()?"wkend":""}"
                role="button"
                tabindex="0"
                @click=${()=>this._goToDate(o)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._goToDate(o))}}
              >
                <div class="mdate ${a?"today":""}">${o.getDate()}</div>
                <div class="mchips">
                  ${n.slice(0,3).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return K`<div
                      class="mchip ${this._isPast(e)?"past":""} ${i?"tentative":""} ${this._isShared(e)?"shared":""} ${this._isTodo(e)?"todo":""}"
                      style="background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff));border-left:2px ${i?"dashed":"solid"} ${t}"
                      title="${this._eventOwnerLabel(e)} · ${this._evTitle(e)}"
                      @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                    >
                      ${this._isTodo(e)?K`<span class="todo-line">
                            ${this._renderTodoCheckbox(e)}
                            <span class="todo-label"
                              >${e.continuesBefore?"« ":""}${this._evTitle(e)}</span
                            >
                          </span>`:K`${e.continuesBefore?"« ":""}${this._evTitle(e)}`}
                    </div>`})}
                  ${n.length>3?K`<div class="mmore">+${n.length-3}</div>`:W}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_statusLabel(e){return"home"===e?this._t("status_home"):"not_home"===e?this._t("status_away"):"unknown"===e||"unavailable"===e?"–":e}_onColClick(e,t,i,s,o){const r=this._persons[t];if(!this._personCanCreate(r))return;const a=e.currentTarget.getBoundingClientRect();let n=o+(e.clientY-a.top)/s;const l=this._grid;n=Math.round(n/l)*l,n=Math.max(0,Math.min(n,1440-l)),this._openCreate(t,i,n)}_openCreate(e,t,i){const s=this._persons[e],o=this._writableCals(s);if(0===o.length)return;const r=Oe(this._dateForDay(t)),a=i??Math.max(this._startMin,540),n=new Date(r.getTime()+6e4*a),l=new Date(n.getTime()+36e5);this._dialog={mode:"create",personIdx:e,calendar:o[0],calendarOptions:o.length>1?o:void 0,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:Pe(n),end:Pe(l),recurrenceRange:""}}_openEvent(e){const t=e.ref;if("todo"===t.kind)return void this._openTodo({entityId:t.calendar,uid:t.uid,summary:t.summary,status:"needs_action",due:t.todo_due,description:t.description,listLabel:this._todoLabel(t.calendar)});const i=t.calendar,s=this._canUpdate(i)&&!!t.uid,o=this._canDelete(i)&&!!t.uid;this._dialog={mode:"edit",personIdx:t.personIdx,calendar:i,uid:t.uid,recurrence_id:t.recurrence_id,recurring:!(!t.recurrence_id&&!t.rrule),recurrenceRange:"",canUpdate:s,canDelete:o,summary:t.summary,location:t.location??"",description:t.description??"",allDay:t.allDay,start:t.allDay?Ie(t.start):Pe(t.start),end:t.allDay?Ie(new Date(t.end.getTime()-_e)):Pe(t.end)}}_dlgField(e,t){this._dialog&&(this._dialog={...this._dialog,[e]:t,error:void 0})}_toggleAllDay(e){if(!this._dialog)return;const t=this._dialog;e&&!t.allDay?this._dialog={...t,allDay:e,start:t.start.slice(0,10),end:t.end.slice(0,10),error:void 0}:!e&&t.allDay&&(this._dialog={...t,allDay:e,start:`${t.start}T09:00`,end:`${t.end}T10:00`,error:void 0})}_buildPayload(e){const t={summary:e.summary.trim()||this._t("default_title")};if(e.location.trim()&&(t.location=e.location.trim()),e.description.trim()&&(t.description=e.description.trim()),e.allDay){const i=new Date(`${e.end}T00:00:00`);i.setDate(i.getDate()+1),t.dtstart=e.start,t.dtend=Ie(i)}else t.dtstart=new Date(e.start).toISOString(),t.dtend=new Date(e.end).toISOString();return t}_validate(e){const t=e.allDay?new Date(`${e.start}T00:00:00`):new Date(e.start),i=e.allDay?new Date(`${e.end}T00:00:00`):new Date(e.end);return isNaN(t.getTime())||isNaN(i.getTime())?this._t("err_invalid"):i.getTime()<t.getTime()?this._t("err_end_before"):e.allDay||i.getTime()!==t.getTime()?null:this._t("err_end_equal")}_draggable(e){return!1!==this._config.drag_drop&&!this._isTodo(e)&&!e.allDay&&!e.ref.rrule&&!!e.ref.uid&&this._canUpdate(e.ref.calendar)&&!e.continuesBefore&&!e.continuesAfter}_onEventPointerDown(e,t,i){0===e.button&&this._draggable(t)&&(e.stopPropagation(),this._dragStartY=e.clientY,this._dragPx=this._pxPerMin,this._dragGrid=this._grid,this._drag={raw:t.ref,mode:i,deltaMin:0,moved:!1,busy:!1},e.target.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp))}async _commitDrag(e){const t=e.raw,{start:i,end:s}=function(e,t,i,s,o){const r=Math.max(1,o),a=new Date(e);a.setHours(0,0,0,0);const n=a.getTime(),l=(e.getTime()-n)/6e4,d=(t.getTime()-e.getTime())/6e4;if("move"===s){const e=Math.round((l+i)/r)*r,t=new Date(n+6e4*e);return{start:t,end:new Date(t.getTime()+6e4*d)}}let c=Math.round((d+i)/r)*r;return c<r&&(c=r),{start:e,end:new Date(e.getTime()+6e4*c)}}(t.start,t.end,e.deltaMin,e.mode,this._dragGrid);if(i.getTime()!==t.start.getTime()||s.getTime()!==t.end.getTime()){this._drag={...e,busy:!0};try{const e={summary:t.summary,dtstart:i.toISOString(),dtend:s.toISOString()};t.location&&(e.location=t.location),t.description&&(e.description=t.description),await this.hass.callWS({type:"calendar/event/update",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:"",event:e}),this._drag=void 0,await this._refetch()}catch(e){this._drag=void 0,this._loadError=!1,await this._refetch()}}else this._drag=void 0}async _saveDialog(){if(!this._dialog)return;const e=this._dialog,t=this._validate(e);if(t)this._dialog={...e,error:t};else{this._dialog={...e,busy:!0,error:void 0};try{const t=this._buildPayload(e);"create"===e.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:e.calendar,event:t}):await this.hass.callWS({type:"calendar/event/update",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:"",event:t}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const e=this._dialog;this._dialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:""}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}_closeDialog(){this._dialog=void 0}_renderDialog(){const e=this._dialog,t="edit"===e.mode&&!e.canUpdate,i=this._calLabel(e.calendar),s="create"===e.mode?this._t("new_event"):t?this._t("event"):this._t("edit_event");return K`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeDialog()}}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${s}>
          <div class="dlg-head">
            <span>${s}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${e.calendarOptions&&e.calendarOptions.length>1?K`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${e.calendar}
                  @change=${e=>this._dlgField("calendar",e.target.value)}
                >
                  ${e.calendarOptions.map(t=>K`<option value=${t} ?selected=${t===e.calendar}>
                        ${this._calLabel(t)}
                      </option>`)}
                </select>
              </label>`:K`<div class="dlg-cal">${i}</div>`}

          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${e.summary}
              ?disabled=${t}
              autofocus
              @input=${e=>this._dlgField("summary",e.target.value)}
            />
          </label>

          <label class="chk">
            <input
              type="checkbox"
              .checked=${e.allDay}
              ?disabled=${t}
              @change=${e=>this._toggleAllDay(e.target.checked)}
            />
            <span>${this._t("field_all_day")}</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>${this._t("field_start")}</span>
              <input
                type=${e.allDay?"date":"datetime-local"}
                .value=${e.start}
                ?disabled=${t}
                @input=${e=>this._dlgField("start",e.target.value)}
              />
            </label>
            <label class="fld">
              <span>${this._t("field_end")}</span>
              <input
                type=${e.allDay?"date":"datetime-local"}
                .value=${e.end}
                ?disabled=${t}
                @input=${e=>this._dlgField("end",e.target.value)}
              />
            </label>
          </div>

          <label class="fld">
            <span>
              ${this._t("field_location")}
              ${e.location.trim()?K`<a
                    class="maplink"
                    href=${this._mapUrl(e.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${e=>e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`:W}
            </span>
            <input
              type="text"
              .value=${e.location}
              ?disabled=${t}
              @input=${e=>this._dlgField("location",e.target.value)}
            />
          </label>

          <label class="fld">
            <span>${this._t("field_note")}</span>
            <textarea
              rows="2"
              .value=${e.description}
              ?disabled=${t}
              @input=${e=>this._dlgField("description",e.target.value)}
            ></textarea>
          </label>

          ${"edit"===e.mode&&e.recurring&&!t?K`<div class="recur">
                <span class="recur-label">${this._t("recurring")}</span>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${""===e.recurrenceRange}
                    @change=${()=>this._dlgField("recurrenceRange","")}
                  />
                  <span>${this._t("recur_this")}</span>
                </label>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${"THISANDFUTURE"===e.recurrenceRange}
                    @change=${()=>this._dlgField("recurrenceRange","THISANDFUTURE")}
                  />
                  <span>${this._t("recur_future")}</span>
                </label>
              </div>`:W}
          ${t?K`<div class="ro-note">${this._t("read_only")}</div>`:W}
          ${e.error?K`<div class="dlg-error">${e.error}</div>`:W}

          <div class="dlg-actions">
            ${"edit"===e.mode&&e.canDelete?K`<button class="danger" ?disabled=${e.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`:W}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${e.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${t?W:K`<button class="primary" ?disabled=${e.busy} @click=${this._saveDialog}>
                  ${e.busy?"…":this._t("save")}
                </button>`}
          </div>
        </div>
      </div>
    `}_renderTodoDialog(){const e=this._todoDialog,t=!e.canUpdate,i=t?this._t("todo"):this._t("edit_todo");return K`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeTodoDialog()}}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${i}>
          <div class="dlg-head">
            <span>${i}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeTodoDialog}>
              ✕
            </button>
          </div>
          <div class="dlg-cal">${this._todoLabel(e.entityId)}</div>
          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${e.summary}
              ?disabled=${t}
              autofocus
              @input=${e=>this._todoDlgField("summary",e.target.value)}
            />
          </label>
          ${e.supportsDueDate?K`<label class="fld">
                <span>${this._t("field_due")}</span>
                <input
                  type=${e.supportsDueDatetime?"datetime-local":"date"}
                  .value=${e.due}
                  ?disabled=${t}
                  @input=${e=>this._todoDlgField("due",e.target.value)}
                />
              </label>`:W}
          ${e.supportsDescription?K`<label class="fld">
                <span>${this._t("field_note")}</span>
                <textarea
                  rows="2"
                  .value=${e.description}
                  ?disabled=${t}
                  @input=${e=>this._todoDlgField("description",e.target.value)}
                ></textarea>
              </label>`:W}
          ${e.error?K`<div class="dlg-error">${e.error}</div>`:W}
          <div class="dlg-actions">
            ${e.canUpdate?K`<button class="ghost" ?disabled=${e.busy} @click=${this._completeTodoDialog}>
                  ${this._t("todo_complete")}
                </button>`:W}
            ${e.canDelete?K`<button class="danger" ?disabled=${e.busy} @click=${this._deleteTodoDialog}>
                  ${this._t("delete")}
                </button>`:W}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${e.busy} @click=${this._closeTodoDialog}>
              ${this._t("cancel")}
            </button>
            ${t?W:K`<button class="primary" ?disabled=${e.busy} @click=${this._saveTodoDialog}>
                  ${e.busy?"…":this._t("save")}
                </button>`}
          </div>
        </div>
      </div>
    `}_renderTodoBadgeDialog(){const e=this._todoBadgeDialog,t=this._personName(this._persons[e.personIdx],e.personIdx),i=this._todoItemsForPerson(e.personIdx);return K`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeTodoBadgeDialog()}}
      >
        <div class="dialog todo-badge-dialog" role="dialog" aria-modal="true" aria-label=${t}>
          <div class="dlg-head">
            <span>${t} · ${i.length} ${this._t("todo_items")}</span>
            <button
              class="icon"
              aria-label=${this._t("close")}
              @click=${this._closeTodoBadgeDialog}
            >
              ✕
            </button>
          </div>
          <div class="todo-badge-list">
            ${i.map(e=>{const t=this._formatTodoDue(e.due);return K`
                <div
                  class="todo-badge-item"
                  role="button"
                  tabindex="0"
                  @click=${()=>this._openTodoFromBadge(e)}
                  @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._openTodoFromBadge(e))}}
                  title=${e.summary}
                >
                  ${this._renderTodoItemCheckbox(e)}
                  <span class="todo-badge-copy">
                    <span class="todo-badge-title">${e.summary}</span>
                    <span class="todo-badge-meta"
                      >${e.listLabel}${t?` · ${t}`:""}</span
                    >
                  </span>
                </div>
              `})}
          </div>
        </div>
      </div>
    `}}Re.styles=a`
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
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
      box-shadow: 0 1px 4px color-mix(in srgb, var(--primary-color) 45%, transparent);
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
      color: var(--text-primary-color, #fff);
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
  `,e([he({attribute:!1})],Re.prototype,"hass",void 0),e([pe()],Re.prototype,"_config",void 0),e([pe()],Re.prototype,"_events",void 0),e([pe()],Re.prototype,"_view",void 0),e([pe()],Re.prototype,"_day",void 0),e([pe()],Re.prototype,"_weekOffset",void 0),e([pe()],Re.prototype,"_monthOffset",void 0),e([pe()],Re.prototype,"_dialog",void 0),e([pe()],Re.prototype,"_todoDialog",void 0),e([pe()],Re.prototype,"_todoBadgeDialog",void 0),e([pe()],Re.prototype,"_loadError",void 0),e([pe()],Re.prototype,"_loading",void 0),e([pe()],Re.prototype,"_todoBusy",void 0),e([pe()],Re.prototype,"_todoItemsByOwner",void 0),e([pe()],Re.prototype,"_fitPx",void 0),e([pe()],Re.prototype,"_hiddenP",void 0),e([pe()],Re.prototype,"_drag",void 0),e([pe()],Re.prototype,"_forecast",void 0),customElements.get("family-board-card")||customElements.define("family-board-card",Re),window.customCards=window.customCards||[],window.customCards.push({type:"family-board-card",name:"Family Board Card",description:"Family calendar / who-is-where board for multiple people – day, timeline, week, month and agenda views.",preview:!0,documentationURL:"https://github.com/renespeaker/ha-family-board-card"}),console.info("%c FAMILY-BOARD-CARD %c v0.26.0 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const Le={l_title:"Card title",l_refresh_interval:"Auto refresh (sec., 0 = off)",l_view:"Default view",l_views:"Available views (switcher)",l_time_grid:"Time grid",l_start_hour:"Start hour",l_end_hour:"End hour",l_hour_height:"Height per hour",l_hour_width:"Timeline: width per hour",l_fit_height:"Auto-fit: squeeze the day so it fits without scrolling",l_full_height:"Full height: stretch to the bottom of the screen",l_trim_hours:"Hide empty hours at the edges",l_col_min_width:"Min. column width per person",l_background_hours:"Show long events as a background band from (hrs.)",l_max_columns:"Max. columns per day",l_first_day:"Week starts on",l_scroll_to_now:"Auto-scroll to now",l_color_by:"Color by",l_show_weekends:"Show weekend",l_show_now_line:"Now line",l_dim_past:"Dim past events",l_show_progress:"Show progress bar",l_hide_patterns:"Hide events",l_show_patterns:"Only show events matching",l_replace_patterns:"Replace titles",l_filter_duplicates:"Merge duplicate events",l_tentative_patterns:"Mark as tentative",l_auto_icons:"Auto icons by keyword",l_icon_patterns:"Custom icon rules",l_show_focus:"“Now / next” bar",l_drag_drop:"Move events by dragging (day view)",l_weather_entity:"Weather entity",l_show_weather:"Show weather",l_hide_empty_persons:"Week: hide persons without events",l_auto_return:"Return to the start view after idle (min., 0 = off)",l_event_size:"Event font size",l_radius:"Corner radius of the blocks",l_past_opacity:"Opacity of past events",l_name:"Display name",l_person:"Person (avatar & status)",l_calendar:"Calendars (multiple possible)",l_todo:"To-do lists (multiple possible)",l_shared_todo:"Shared to-do lists",l_color:"Custom color (hex, optional)",l_badges:"Badges (e.g. battery, sensors)",l_hidden:"Hidden on start",l_compact:"Compact layout",l_map_url:"Map link (template)",l_shared_calendar:"Shared calendars",h_hide_patterns:"Text patterns, e.g. “Recess” – matches are hidden",h_show_patterns:"Allow list: only events whose title contains one of the patterns",h_replace_patterns:"e.g. “Homeroom => Lesson” (without => the text is removed)",h_tentative_patterns:"Matches are drawn dashed / translucent",h_filter_duplicates:"The same event in several calendars is shown only once",h_auto_return:"Kiosk: jumps back to “today” after X minutes without a touch",h_background_hours:"0 = off. Long all-day-ish events (after-school care …) as a subtle band",h_fit_height:"Compresses the day until everything is visible without scrolling",h_full_height:"For panel view / wall tablet",h_trim_hours:"Shows only the hours that actually contain events",h_col_min_width:"Below this the board scrolls horizontally",h_weather_entity:"Daily forecast in the header (HA location)",h_auto_icons:"e.g. doctor → 🩺, sport → 🏃, birthday → 🎂 (titles with emoji stay untouched)",h_icon_patterns:"Own rules, e.g. “Grandma => 👵”",h_show_focus:"Compact bar above the views: what is running now / coming next",h_drag_drop:"Writable calendars only; drag to move, bottom edge changes the duration",h_views:"Which switchers appear at the top",h_badges:"Small chips below the person header; click opens details",h_todo:"Open items from these to-do lists are shown directly in the calendar",h_shared_todo:"Items from these to-do lists are shown once as shared entries instead of inside a single person column",h_color:"Leave empty for the palette color",h_hidden:"Column starts collapsed; a click on the header brings it back",h_compact:"Smaller fonts and tighter spacing in a single switch",h_map_url:"{location} is substituted, e.g. https://maps.apple.com/?q={location}",h_shared_calendar:"Events from these calendars are shown once as cross-person bars instead of inside a single person column",o_person:"Person",o_location:"Location",o_calendar:"Calendar",o_monday:"Monday",o_sunday:"Sunday",g_views:"🗓️ Views",g_layout:"📐 Layout & size",g_filters:"🧹 Filters & clean-up",g_looks:"🎨 Appearance (fine-tuning)",g_kiosk:"🖥️ Kiosk & extras",w_title:"👨‍👩‍👧‍👦 Welcome to the family board!",w_text:"Ready in two clicks – the card detects your family automatically from the person and calendar entities of your Home Assistant.",w_detect:"✨ Step 1: detect persons automatically",w_hint:"Optionally afterwards: pick a profile (below) or fine-tune the settings in the groups. Of course you can also add persons by hand:",w_empty:"＋ Start empty",p_tablet:"🖥️ Wall tablet",p_tablet_title:"Full screen, auto-fit, return to today",p_phone:"📱 Phone",p_phone_title:"Agenda as start view, compact columns",p_reset:"🧩 Default",p_reset_title:"Reset the layout settings",s_persons:"People",s_calendars:"Calendars (color & label)",s_settings:"Settings",b_add_person:"＋ Add person",b_detect:"✨ Detect automatically",b_up:"Move up",b_down:"Move down",b_remove:"Remove",b_auto:"Automatic",ph_label:"Custom label",ph_icon:"Icon, e.g. mdi:school",ph_title_field:"Title from field (e.g. description)",person_n:"Person",cal_hint_1:"Colors apply with “Color by: calendar”, labels in the event dialog. Icon = mdi icon in front of the title. “Title from field” uses e.g.",cal_hint_2:"instead of",cal_hint_3:"as the event title."},He={en:Le,de:{l_title:"Kartentitel",l_refresh_interval:"Auto-Aktualisierung (Sek., 0 = aus)",l_view:"Standardansicht",l_views:"Verfügbare Ansichten (Umschalter)",l_time_grid:"Zeitraster",l_start_hour:"Startstunde",l_end_hour:"Endstunde",l_hour_height:"Höhe pro Stunde",l_hour_width:"Zeitstrahl: Breite pro Stunde",l_fit_height:"Auto-Fit: Tag ohne Scrollen einpassen",l_full_height:"Volle Höhe: bis zum unteren Bildschirmrand",l_trim_hours:"Leere Randstunden automatisch ausblenden",l_col_min_width:"Min. Spaltenbreite pro Person",l_background_hours:"Lange Termine als Hintergrund-Band ab (Std.)",l_max_columns:"Max. Spalten pro Tag",l_first_day:"Wochenstart",l_scroll_to_now:"Auto-Scroll zu jetzt",l_color_by:"Einfärben nach",l_show_weekends:"Wochenende anzeigen",l_show_now_line:"Jetzt-Linie",l_dim_past:"Vergangene Termine ausgrauen",l_show_progress:"Fortschrittsbalken anzeigen",l_hide_patterns:"Termine ausblenden",l_show_patterns:"Nur Termine zeigen mit",l_replace_patterns:"Titel ersetzen",l_filter_duplicates:"Doppelte Termine zusammenfassen",l_tentative_patterns:"Als vorläufig markieren",l_auto_icons:"Auto-Symbole nach Stichwort",l_icon_patterns:"Eigene Symbol-Regeln",l_show_focus:"„Jetzt / als Nächstes“-Leiste",l_drag_drop:"Termine per Ziehen verschieben (Tagesansicht)",l_weather_entity:"Wetter-Entität",l_show_weather:"Wetter anzeigen",l_hide_empty_persons:"Woche: Personen ohne Termine ausblenden",l_auto_return:"Nach Inaktivität zur Startansicht (Min., 0 = aus)",l_event_size:"Schriftgröße Termine",l_radius:"Ecken-Radius der Blöcke",l_past_opacity:"Deckkraft vergangener Termine",l_name:"Anzeigename",l_person:"Person (Avatar & Status)",l_calendar:"Kalender (mehrere möglich)",l_todo:"To-do-Listen (mehrere möglich)",l_shared_todo:"Gemeinsame To-do-Listen",l_color:"Eigene Farbe (Hex, optional)",l_badges:"Badges (z. B. Akku, Sensoren)",l_hidden:"Beim Start ausgeblendet",l_compact:"Kompakte Darstellung",l_map_url:"Karten-Link (Vorlage)",l_shared_calendar:"Gemeinsame Kalender",h_hide_patterns:"Textmuster, z. B. „Hofpause“ – Treffer werden ausgeblendet",h_show_patterns:"Allow-Liste: nur Termine, deren Titel eines der Muster enthält",h_replace_patterns:"z. B. „Klassenverbund => Unterricht“ (ohne => wird der Text entfernt)",h_tentative_patterns:"Treffer werden gestrichelt/transparent dargestellt",h_filter_duplicates:"Gleicher Termin in mehreren Kalendern nur einmal",h_auto_return:"Kiosk: springt nach X Minuten ohne Berührung zurück zu „heute“",h_background_hours:"0 = aus. Lange Dauertermine (OGS, Betreuung …) als dezentes Band",h_fit_height:"Staucht den Tag, bis alles ohne Scrollen sichtbar ist",h_full_height:"Für Panel-Ansicht / Wandtablet",h_trim_hours:"Zeigt nur die Stunden, in denen wirklich Termine liegen",h_col_min_width:"Darunter wird horizontal gescrollt",h_weather_entity:"Tages-Vorhersage im Kopf (HA-Standort)",h_auto_icons:"z. B. Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂 (Titel mit Emoji bleiben unberührt)",h_icon_patterns:"eigene Regeln, z. B. „Oma => 👵“",h_show_focus:"Kompakte Leiste über den Ansichten: was läuft jetzt / kommt als Nächstes",h_drag_drop:"Nur bei schreibbaren Kalendern; Ziehen verschiebt, unterer Rand ändert die Dauer",h_views:"Welche Umschalter oben erscheinen",h_badges:"Kleine Chips unter dem Personenkopf; Klick öffnet Details",h_todo:"Offene Einträge aus diesen To-do-Listen werden direkt im Kalender angezeigt",h_shared_todo:"Einträge aus diesen To-do-Listen werden einmal als gemeinsame Einträge dargestellt statt nur in einer Personenspalte",h_color:"Leer lassen für Palettenfarbe",h_hidden:"Spalte startet eingeklappt; ein Klick auf den Kopf holt sie zurück",h_compact:"Kleinere Schriften und engere Abstände in einem Schalter",h_map_url:"{location} wird ersetzt, z. B. https://maps.apple.com/?q={location}",h_shared_calendar:"Termine aus diesen Kalendern werden einmal als Querbalken über alle Personen dargestellt statt in nur einer Spalte",o_person:"Person",o_location:"Ort",o_calendar:"Kalender",o_monday:"Montag",o_sunday:"Sonntag",g_views:"🗓️ Ansichten",g_layout:"📐 Layout & Größe",g_filters:"🧹 Filter & Aufräumen",g_looks:"🎨 Aussehen (Feintuning)",g_kiosk:"🖥️ Kiosk & Extras",w_title:"👨‍👩‍👧‍👦 Willkommen beim Familienplan!",w_text:"In zwei Klicks startklar – die Karte erkennt deine Familie automatisch aus den Personen- und Kalender-Entitäten deines Home Assistant.",w_detect:"✨ Schritt 1: Personen automatisch erkennen",w_hint:"Danach optional: Profil wählen (unten) oder Feinheiten in den Gruppen einstellen. Natürlich kannst du Personen auch von Hand anlegen:",w_empty:"＋ Leer starten",p_tablet:"🖥️ Wandtablet",p_tablet_title:"Vollbild, Auto-Fit, Rückkehr zu heute",p_phone:"📱 Handy",p_phone_title:"Agenda als Startansicht, kompakte Spalten",p_reset:"🧩 Standard",p_reset_title:"Layout-Einstellungen zurücksetzen",s_persons:"Personen",s_calendars:"Kalender (Farbe & Label)",s_settings:"Einstellungen",b_add_person:"＋ Person hinzufügen",b_detect:"✨ Automatisch erkennen",b_up:"Nach oben",b_down:"Nach unten",b_remove:"Entfernen",b_auto:"Automatisch",ph_label:"Eigenes Label",ph_icon:"Symbol, z. B. mdi:school",ph_title_field:"Titel aus Feld (z. B. description)",person_n:"Person",cal_hint_1:"Farben wirken bei „Einfärben nach: Kalender“, Labels im Termin-Dialog. Symbol = mdi-Icon vor dem Titel. „Titel aus Feld“ nutzt z. B.",cal_hint_2:"statt",cal_hint_3:"als Termin-Titel."}};function Ue(e,t){return He[e]?.[t]??Le[t]??t}const Ke=["#7986cb","#4fc3f7","#4db6ac","#aed581","#ffd54f","#ffb74d","#e57373","#f06292","#f48fb1","#ce93d8","#9575cd","#90a4ae"],je=["day","timeline","week","month","agenda"],We=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"todo",selector:{entity:{filter:{domain:"todo"},multiple:!0}}},{name:"badges",selector:{entity:{multiple:!0}}},{name:"color",selector:{text:{}}},{name:"hidden",selector:{boolean:{}}}],Ge=(e,t,i)=>({name:"",type:"expandable",title:e,icon:t,schema:i});class Ve extends ne{constructor(){super(...arguments),this._t=e=>Ue(this._lang,e),this._label=e=>{const t=`l_${e.name}`,i=Ue(this._lang,t);return i===t?e.name:i},this._helper=e=>{const t=`h_${e.name}`,i=Ue(this._lang,t);return i===t?void 0:i}}setConfig(e){this._config=e}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _lang(){return ve(this.hass)}_viewOptions(){return je.map(e=>({value:e,label:ye(this.hass,e)}))}get _isFresh(){return!this._persons.some(e=>e.name||e.person||e.calendar||e.todo)}get _settingsData(){const e=Array.isArray(this._config.shared_calendar)?this._config.shared_calendar:this._config.shared_calendar?[this._config.shared_calendar]:[],t=Array.isArray(this._config.shared_todo)?this._config.shared_todo:this._config.shared_todo?[this._config.shared_todo]:[];return{...this._config,time_grid:String(this._config.time_grid??30),shared_calendar:e,shared_todo:t}}_schema(){const e=this._config,t=Array.isArray(e.views)&&e.views.length?e.views:je,i=t.includes("day"),s=t.includes("timeline"),o=t.includes("week"),r=[];(i||s)&&r.push({name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"trim_hours",selector:{boolean:{}}}),i&&r.push({name:"hour_height",selector:{number:{min:40,max:96,step:4,mode:"slider",unit_of_measurement:"px"}}},{name:"fit_height",selector:{boolean:{}}},{name:"col_min_width",selector:{number:{min:60,max:400,step:10,mode:"slider",unit_of_measurement:"px"}}},{name:"max_columns",selector:{number:{min:1,max:8,step:1,mode:"slider"}}},{name:"background_hours",selector:{number:{min:0,max:12,step:1,mode:"slider",unit_of_measurement:"h"}}}),s&&r.push({name:"hour_width",selector:{number:{min:48,max:240,step:8,mode:"slider",unit_of_measurement:"px"}}}),r.push({name:"full_height",selector:{boolean:{}}});const a=[{name:"auto_return",selector:{number:{min:0,max:60,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"scroll_to_now",selector:{boolean:{}}},{name:"show_now_line",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}},{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"map_url",selector:{text:{}}}];return e.weather_entity&&a.push({name:"show_weather",selector:{boolean:{}}}),a.push({name:"refresh_interval",selector:{number:{min:0,max:3600,mode:"box",unit_of_measurement:"s"}}}),[{name:"title",selector:{text:{}}},{name:"shared_calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"shared_todo",selector:{entity:{filter:{domain:"todo"},multiple:!0}}},Ge(this._t("g_views"),"mdi:calendar-multiselect",[{name:"view",selector:{select:{mode:"dropdown",options:this._viewOptions()}}},{name:"views",selector:{select:{multiple:!0,options:this._viewOptions()}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"first_day",selector:{select:{mode:"dropdown",options:[{value:"monday",label:this._t("o_monday")},{value:"sunday",label:this._t("o_sunday")}]}}},{name:"show_weekends",selector:{boolean:{}}}]),Ge(this._t("g_layout"),"mdi:resize",r),Ge(this._t("g_filters"),"mdi:broom",[{name:"hide_patterns",selector:{text:{multiple:!0}}},{name:"show_patterns",selector:{text:{multiple:!0}}},{name:"replace_patterns",selector:{text:{multiple:!0}}},{name:"filter_duplicates",selector:{boolean:{}}},{name:"tentative_patterns",selector:{text:{multiple:!0}}},...o?[{name:"hide_empty_persons",selector:{boolean:{}}}]:[]]),Ge(this._t("g_looks"),"mdi:palette",[{name:"show_focus",selector:{boolean:{}}},{name:"drag_drop",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}},{name:"auto_icons",selector:{boolean:{}}},...e.auto_icons?[{name:"icon_patterns",selector:{text:{multiple:!0}}}]:[],{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:this._t("o_person")},{value:"location",label:this._t("o_location")},{value:"calendar",label:this._t("o_calendar")}]}}},{name:"dim_past",selector:{boolean:{}}},{name:"event_size",selector:{number:{min:9,max:16,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"radius",selector:{number:{min:0,max:18,step:1,mode:"slider",unit_of_measurement:"px"}}},{name:"past_opacity",selector:{number:{min:10,max:100,step:5,mode:"slider",unit_of_measurement:"%"}}}]),Ge(this._t("g_kiosk"),"mdi:tablet-dashboard",a)]}_emit(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_settingsChanged(e){e.stopPropagation();const t={...e.detail.value};"string"==typeof t.time_grid&&(t.time_grid=Number(t.time_grid)),Array.isArray(t.shared_calendar)&&(0===t.shared_calendar.length?delete t.shared_calendar:1===t.shared_calendar.length&&(t.shared_calendar=t.shared_calendar[0])),Array.isArray(t.shared_todo)&&(0===t.shared_todo.length?delete t.shared_todo:1===t.shared_todo.length&&(t.shared_todo=t.shared_todo[0])),this._emit({...this._config,...t,persons:this._persons,...this._config.calendars?{calendars:this._config.calendars}:{}})}_applyPreset(e){const t={...this._config,persons:this._persons},i=e=>e.forEach(e=>delete t[e]);"tablet"===e?Object.assign(t,{view:"day",full_height:!0,fit_height:!0,trim_hours:!0,scroll_to_now:!0,auto_return:5}):"phone"===e?(Object.assign(t,{view:"agenda",col_min_width:96}),i(["full_height","fit_height","auto_return"])):(i(["full_height","fit_height","trim_hours","auto_return","col_min_width","hour_height","hour_width","max_columns","background_hours","event_size","radius","past_opacity"]),t.view="day"),this._emit(t)}_personChanged(e,t){t.stopPropagation();const i={...t.detail.value};i.color||delete i.color,Array.isArray(i.badges)&&0===i.badges.length&&delete i.badges,i.hidden||delete i.hidden,Array.isArray(i.calendar)&&(0===i.calendar.length?delete i.calendar:1===i.calendar.length&&(i.calendar=i.calendar[0])),Array.isArray(i.todo)&&(0===i.todo.length?delete i.todo:1===i.todo.length&&(i.todo=i.todo[0]));const s=this._persons.map((t,s)=>s===e?i:t);this._emit({...this._config,persons:s})}_personData(e){const t=Array.isArray(e.calendar)?e.calendar:e.calendar?[e.calendar]:[],i=Array.isArray(e.todo)?e.todo:e.todo?[e.todo]:[];return{...e,calendar:t,todo:i}}_setPersonColor(e,t){const i=this._persons.map((i,s)=>{if(s!==e)return i;const o={...i};return t?o.color=t:delete o.color,o});this._emit({...this._config,persons:i})}_addPerson(){const e=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:e})}_autoDetect(){const e=Ne(this.hass);if(0===e.length)return;const t=new Set(this._persons.map(e=>e.person).filter(Boolean)),i=[...this._persons.filter(e=>e.name||e.person||e.calendar)];for(const s of e)t.has(s.person)||i.push(s);this._emit({...this._config,persons:i})}_removePerson(e){const t=this._persons.filter((t,i)=>i!==e);this._emit({...this._config,persons:t})}_movePerson(e,t){const i=[...this._persons],s=e+t;s<0||s>=i.length||([i[e],i[s]]=[i[s],i[e]],this._emit({...this._config,persons:i}))}_calsUsed(){const e=[];for(const t of this._persons){const i=Array.isArray(t.calendar)?t.calendar:t.calendar?[t.calendar]:[];for(const t of i)t&&!e.includes(t)&&e.push(t)}const t=Array.isArray(this._config.shared_calendar)?this._config.shared_calendar:this._config.shared_calendar?[this._config.shared_calendar]:[];for(const i of t)i&&!e.includes(i)&&e.push(i);return e}_setCalMeta(e,t){const i={...this._config.calendars??{}},s={...i[e]??{}};for(const e of["color","label","icon","title_field"]){const i=t[e];void 0!==i&&(i?s[e]=i:delete s[e])}0===Object.keys(s).length?delete i[e]:i[e]=s;const o={...this._config,persons:this._persons};0===Object.keys(i).length?delete o.calendars:o.calendars=i,this._emit(o)}_calName(e){return this.hass.states[e]?.attributes?.friendly_name||e}_swatches(e,t){return K`
      <div class="swatches">
        ${Ke.map(i=>K`
            <button
              class="swatch ${e?.toLowerCase()===i?"on":""}"
              style="background:${i}"
              title=${i}
              @click=${()=>t(i)}
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
    `}render(){if(!this._config)return W;if(this._isFresh)return K`
        <div class="wizard">
          <div class="wtitle">${this._t("w_title")}</div>
          <div class="wtext">${this._t("w_text")}</div>
          <button class="wbtn primary" @click=${this._autoDetect}>${this._t("w_detect")}</button>
          <div class="wtext small">${this._t("w_hint")}</div>
          <button class="wbtn" @click=${this._addPerson}>${this._t("w_empty")}</button>
        </div>
      `;const e=this._persons,t=this._calsUsed();return K`
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
        ${e.map((t,i)=>K`
            <div class="person">
              <div class="person-head">
                <span
                  class="pdot"
                  style="background:${t.color||Ke[i%Ke.length]}"
                ></span>
                <span class="pidx">${t.name||`${this._t("person_n")} ${i+1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title=${this._t("b_up")}
                    ?disabled=${0===i}
                    @click=${()=>this._movePerson(i,-1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title=${this._t("b_down")}
                    ?disabled=${i===e.length-1}
                    @click=${()=>this._movePerson(i,1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title=${this._t("b_remove")}
                    @click=${()=>this._removePerson(i)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ${this._swatches(t.color,e=>this._setPersonColor(i,e))}
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(t)}
                .schema=${We}
                .computeLabel=${this._label}
                .computeHelper=${this._helper}
                @value-changed=${e=>this._personChanged(i,e)}
              ></ha-form>
            </div>
          `)}
        <div class="addrow">
          <button class="add" @click=${this._addPerson}>${this._t("b_add_person")}</button>
          <button class="add detect" @click=${this._autoDetect}>${this._t("b_detect")}</button>
        </div>
      </div>

      ${t.length>1||this._config.calendars?K`
            <div class="section-title">${this._t("s_calendars")}</div>
            <div class="cals">
              ${t.map(e=>{const t=this._config.calendars?.[e]??{};return K`
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
    `}}Ve.styles=a`
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
  `,e([he({attribute:!1})],Ve.prototype,"hass",void 0),e([pe()],Ve.prototype,"_config",void 0),customElements.define("ha-family-board-card-editor",Ve);var qe=Object.freeze({__proto__:null,FamilyBoardCardEditor:Ve});export{Re as FamilyBoardCard,Ne as autoDetectPersons};
