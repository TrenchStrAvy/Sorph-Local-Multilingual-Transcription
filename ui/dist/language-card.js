"use strict";(()=>{var ke=Object.create;var ae=Object.defineProperty;var Le=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames;var Fe=Object.getPrototypeOf,De=Object.prototype.hasOwnProperty;var q=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var $e=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Ie(t))!De.call(e,o)&&o!==r&&ae(e,o,{get:()=>t[o],enumerable:!(a=Le(t,o))||a.enumerable});return e};var z=(e,t,r)=>(r=e!=null?ke(Fe(e)):{},$e(t||!e||!e.__esModule?ae(r,"default",{value:e,enumerable:!0}):r,e));var ge=q(c=>{"use strict";var $=Symbol.for("react.element"),We=Symbol.for("react.portal"),He=Symbol.for("react.fragment"),qe=Symbol.for("react.strict_mode"),Be=Symbol.for("react.profiler"),Ne=Symbol.for("react.provider"),Ue=Symbol.for("react.context"),je=Symbol.for("react.forward_ref"),Oe=Symbol.for("react.suspense"),Xe=Symbol.for("react.memo"),Ge=Symbol.for("react.lazy"),se=Symbol.iterator;function ze(e){return e===null||typeof e!="object"?null:(e=se&&e[se]||e["@@iterator"],typeof e=="function"?e:null)}var ue={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},le=Object.assign,fe={};function F(e,t,r){this.props=e,this.context=t,this.refs=fe,this.updater=r||ue}F.prototype.isReactComponent={};F.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};F.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function de(){}de.prototype=F.prototype;function V(e,t,r){this.props=e,this.context=t,this.refs=fe,this.updater=r||ue}var K=V.prototype=new de;K.constructor=V;le(K,F.prototype);K.isPureReactComponent=!0;var ie=Array.isArray,me=Object.prototype.hasOwnProperty,Z={current:null},pe={key:!0,ref:!0,__self:!0,__source:!0};function he(e,t,r){var a,o={},n=null,s=null;if(t!=null)for(a in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(n=""+t.key),t)me.call(t,a)&&!pe.hasOwnProperty(a)&&(o[a]=t[a]);var i=arguments.length-2;if(i===1)o.children=r;else if(1<i){for(var u=Array(i),b=0;b<i;b++)u[b]=arguments[b+2];o.children=u}if(e&&e.defaultProps)for(a in i=e.defaultProps,i)o[a]===void 0&&(o[a]=i[a]);return{$$typeof:$,type:e,key:n,ref:s,props:o,_owner:Z.current}}function Ye(e,t){return{$$typeof:$,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function J(e){return typeof e=="object"&&e!==null&&e.$$typeof===$}function Ve(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var ce=/\/+/g;function Y(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Ve(""+e.key):t.toString(36)}function N(e,t,r,a,o){var n=typeof e;(n==="undefined"||n==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(n){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case $:case We:s=!0}}if(s)return s=e,o=o(s),e=a===""?"."+Y(s,0):a,ie(o)?(r="",e!=null&&(r=e.replace(ce,"$&/")+"/"),N(o,t,r,"",function(b){return b})):o!=null&&(J(o)&&(o=Ye(o,r+(!o.key||s&&s.key===o.key?"":(""+o.key).replace(ce,"$&/")+"/")+e)),t.push(o)),1;if(s=0,a=a===""?".":a+":",ie(e))for(var i=0;i<e.length;i++){n=e[i];var u=a+Y(n,i);s+=N(n,t,r,u,o)}else if(u=ze(e),typeof u=="function")for(e=u.call(e),i=0;!(n=e.next()).done;)n=n.value,u=a+Y(n,i++),s+=N(n,t,r,u,o);else if(n==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function B(e,t,r){if(e==null)return e;var a=[],o=0;return N(e,a,"","",function(n){return t.call(r,n,o++)}),a}function Ke(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var g={current:null},U={transition:null},Ze={ReactCurrentDispatcher:g,ReactCurrentBatchConfig:U,ReactCurrentOwner:Z};function be(){throw Error("act(...) is not supported in production builds of React.")}c.Children={map:B,forEach:function(e,t,r){B(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return B(e,function(){t++}),t},toArray:function(e){return B(e,function(t){return t})||[]},only:function(e){if(!J(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};c.Component=F;c.Fragment=He;c.Profiler=Be;c.PureComponent=V;c.StrictMode=qe;c.Suspense=Oe;c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ze;c.act=be;c.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=le({},e.props),o=e.key,n=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(n=t.ref,s=Z.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(u in t)me.call(t,u)&&!pe.hasOwnProperty(u)&&(a[u]=t[u]===void 0&&i!==void 0?i[u]:t[u])}var u=arguments.length-2;if(u===1)a.children=r;else if(1<u){i=Array(u);for(var b=0;b<u;b++)i[b]=arguments[b+2];a.children=i}return{$$typeof:$,type:e.type,key:o,ref:n,props:a,_owner:s}};c.createContext=function(e){return e={$$typeof:Ue,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Ne,_context:e},e.Consumer=e};c.createElement=he;c.createFactory=function(e){var t=he.bind(null,e);return t.type=e,t};c.createRef=function(){return{current:null}};c.forwardRef=function(e){return{$$typeof:je,render:e}};c.isValidElement=J;c.lazy=function(e){return{$$typeof:Ge,_payload:{_status:-1,_result:e},_init:Ke}};c.memo=function(e,t){return{$$typeof:Xe,type:e,compare:t===void 0?null:t}};c.startTransition=function(e){var t=U.transition;U.transition={};try{e()}finally{U.transition=t}};c.unstable_act=be;c.useCallback=function(e,t){return g.current.useCallback(e,t)};c.useContext=function(e){return g.current.useContext(e)};c.useDebugValue=function(){};c.useDeferredValue=function(e){return g.current.useDeferredValue(e)};c.useEffect=function(e,t){return g.current.useEffect(e,t)};c.useId=function(){return g.current.useId()};c.useImperativeHandle=function(e,t,r){return g.current.useImperativeHandle(e,t,r)};c.useInsertionEffect=function(e,t){return g.current.useInsertionEffect(e,t)};c.useLayoutEffect=function(e,t){return g.current.useLayoutEffect(e,t)};c.useMemo=function(e,t){return g.current.useMemo(e,t)};c.useReducer=function(e,t,r){return g.current.useReducer(e,t,r)};c.useRef=function(e){return g.current.useRef(e)};c.useState=function(e){return g.current.useState(e)};c.useSyncExternalStore=function(e,t,r){return g.current.useSyncExternalStore(e,t,r)};c.useTransition=function(){return g.current.useTransition()};c.version="18.3.1"});var Q=q((Rt,ve)=>{"use strict";ve.exports=ge()});var we=q(j=>{"use strict";var Je=Q(),Qe=Symbol.for("react.element"),et=Symbol.for("react.fragment"),tt=Object.prototype.hasOwnProperty,nt=Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,rt={key:!0,ref:!0,__self:!0,__source:!0};function ye(e,t,r){var a,o={},n=null,s=null;r!==void 0&&(n=""+r),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(s=t.ref);for(a in t)tt.call(t,a)&&!rt.hasOwnProperty(a)&&(o[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)o[a]===void 0&&(o[a]=t[a]);return{$$typeof:Qe,type:e,key:n,ref:s,props:o,_owner:nt.current}}j.Fragment=et;j.jsx=ye;j.jsxs=ye});var ee=q((At,xe)=>{"use strict";xe.exports=we()});var W=z(Q()),Te=z(ee()),Ae='"Inter", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Arial, sans-serif',re=[{title:`Motion budget
per page`,value:"25",unit:"%",footer:"Tuned per screen",detail:"slider",labels:["Calm","Lively"],numeral:["#3ad2ff","#8cf6ff"],accent:"#7fe8ff",glow:"#12b0e8",mesh:["#022852","#031e3f","#031934","#021831","#021b36","#022246","#022345","#020e1e","#01040f","#000416","#020b31","#021c57","#01172f","#01010c","#03001d","#0a0f4c","#112383","#0b36af","#021142","#050b47","#0c2e8f","#165bd4","#1675fd","#167bff","#03288e","#0438af","#0d66e7","#107eec","#30afff","#71dcff","#0356e8","#0259ec","#0945b0","#001a49","#3f7c9d","#d4ffff","#0365ff","#0256ea","#052a87","#00001f","#1f4c7b","#9ee7ff"]},{title:`Loop length
seconds`,value:"20",unit:"s",footer:"Seamless on every loop",detail:"cross",labels:["Preview","in","out"],numeral:["#e2a6ff","#fff6ff"],accent:"#d9a8ff",glow:"#62bce8",mesh:["#4c2d5f","#3b2245","#3e285b","#33204f","#381844","#572571","#644096","#4f3688","#8358f6","#8d54f3","#5e20ac","#6e24b7","#482e6d","#261b48","#825bf6","#d48cff","#d07bff","#b359ff","#2d1837","#140a1b","#2c1d66","#3a2383","#693bca","#8b42ef","#411c5b","#300753","#3b006e","#500f79","#7e31c1","#9541f3","#44245a","#3f0c69","#6f15b9","#d17cff","#e2a3ff","#a668ff","#4b2f60","#4d2172","#6819aa","#9b48dc","#965dc9","#7745c4"]},{title:`Frame rate
steady`,value:"95",unit:"fps",footer:"Smooth on every screen",detail:"ring",numeral:["#f4eeb6","#c4c688"],accent:"#f6efc0",glow:"#dacbe9",mesh:["#ff623e","#f57337","#e49435","#fba03f","#ef6b36","#f14c36","#f29a3e","#a0a92e","#a2ba36","#fffe65","#ffd852","#f2863b","#a5b12e","#46821d","#6a6127","#b88b44","#b6bd41","#c4b838","#7e9f27","#3b5a19","#412c10","#0d1700","#255b0c","#98ad28","#a5b232","#3e7c1e","#002800","#00300f","#5b9745","#c1b833","#f3983b","#b3b431","#6fa31f","#9bc976","#edd896","#fd8c3d","#ff5f3b","#ff7d47","#ffa880","#ffc1d8","#ff8d99","#ff5438"]},{title:`Components
in the kit`,value:"72",footer:"Made by hand",detail:"wave",numeral:["#fffdf8","#e8603f"],accent:"#ff6a3d",glow:"#6cc0ea",mesh:["#48001c","#400119","#41011d","#4b021e","#47021a","#480019","#7e0036","#8c0033","#4b0120","#10000c","#1f010b","#390116","#e84396","#ff568c","#dc433c","#0e0705","#090004","#2f0213","#ff9fd9","#ff6f90","#a53625","#190d05","#050002","#2f0110","#ff67b5","#b11348","#000000","#11000c","#3e021b","#8a0c31","#e31771","#5d0027","#3a0021","#620030","#640627","#dc184a","#c10b5f","#920245","#ab054f","#910041","#650226","#c01240"]}],oe=256,Ee=320,ot=10,at=734.103;var te=[0,3,6,8,10,11,12,13,14,16,18,21,25,30,36,45,55,70,88,110],Re=[0,.02175,.12069,.22549,.35493,.43254,.51436,.5952,.6751,.83199,.9709,1.12669,1.27958,1.40975,1.53561,1.68385,1.79183,1.89191,1.95233,2];var st=81.828,it=110,Et=(()=>{let e=te.length,t=te.slice(1).map((n,s)=>n-te[s]),r=t.map((n,s)=>(Re[s+1]-Re[s])/n),a=new Array(e).fill(0);for(let n=1;n<e-1;n++)if(r[n-1]*r[n]<=0)a[n]=0;else{let s=2*t[n]+t[n-1],i=t[n]+2*t[n-1];a[n]=(s+i)/(s/r[n-1]+i/r[n])}let o=(r[0]+r[e-2])/2;return a[0]=o,a[e-1]=o,a})();var Pt=(it-st)/30;function O(e,t=[0,0,0]){let r=(e||"").trim(),a=/^#([0-9a-f]{3,8})$/i.exec(r);if(a){let o=a[1];o.length<=4&&(o=o.split("").map(s=>s+s).join(""));let n=parseInt(o.slice(0,6),16);return[n>>16&255,n>>8&255,n&255]}if(a=/^rgba?\(([^)]+)\)$/i.exec(r),a){let o=a[1].split(/[ ,/]+/).filter(Boolean).map(n=>parseFloat(n));return[o[0]||0,o[1]||0,o[2]||0]}if(typeof document<"u"&&r){let o=document.createElement("canvas");o.width=o.height=1;let n=o.getContext("2d");if(n){n.fillStyle=r,n.fillRect(0,0,1,1);let s=n.getImageData(0,0,1,1).data;return[s[0],s[1],s[2]]}}return t}function d(e,t){return`rgba(${e[0]}, ${e[1]}, ${e[2]}, ${t})`}function Me(e,t){let r=1-e;t[0]=r*r*r/6,t[1]=(3*e*e*e-6*e*e+4)/6,t[2]=(-3*e*e*e+3*e*e+3*e+1)/6,t[3]=e*e*e/6}function ct(e){let t=["#1d1d3a","#3b2f8f","#2a6fd6","#0d0d24"],a=(e&&e.length?e:t).map(n=>O(n)),o=[];for(let n=0;n<7;n++)for(let s=0;s<6;s++)if(a.length===42)o.push(a[n*6+s]);else{let i=Math.min(a.length-1,Math.round((n*6+s)/41*(a.length-1)));o.push(a[i])}return o}function ut(e,t,r,a){let o=ct(a),n=e.createImageData(t,r),s=n.data,i=new Float32Array(t*4),u=new Int32Array(t*4),b=[0,0,0,0];for(let v=0;v<t;v++){let R=(v+.5)/t*5,A=Math.floor(R);Me(R-A,b);for(let m=0;m<4;m++)i[v*4+m]=b[m],u[v*4+m]=Math.min(5,Math.max(0,A-1+m))}let T=new Float32Array(18),C=1234567;for(let v=0;v<r;v++){let R=(v+.5)/r*6,A=Math.floor(R);Me(R-A,b),T.fill(0);for(let m=0;m<4;m++){let x=Math.min(6,Math.max(0,A-1+m)),k=b[m];for(let y=0;y<6;y++){let E=o[x*6+y];T[y*3]+=E[0]*k,T[y*3+1]+=E[1]*k,T[y*3+2]+=E[2]*k}}for(let m=0;m<t;m++){let x=0,k=0,y=0;for(let _=0;_<4;_++){let h=i[m*4+_],l=u[m*4+_]*3;x+=T[l]*h,k+=T[l+1]*h,y+=T[l+2]*h}C=C*1103515245+12345&2147483647;let E=(C/2147483647-.5)*1.6,S=(v*t+m)*4;s[S]=x+E,s[S+1]=k+E,s[S+2]=y+E,s[S+3]=255}}e.putImageData(n,0,0)}function M(e,t,r){return`${e} ${t}px ${r}`}function ne(e,t,r,a,o="0"){e.font=M(t,100,r);let s=e.measureText(o).actualBoundingBoxAscent||71;return a/s*100}var D=new Map;function Pe(e,t,r){let a=`${t}|${r}|${JSON.stringify(e)}`,o=D.get(a);if(o)D.delete(a);else for(o=document.createElement("canvas"),o.width=t,o.height=Math.round(t*Ee/oe),lt(o,e,r);D.size>=12;)D.delete(D.keys().next().value);return D.set(a,o),o}function lt(e,t,r){let a=e.width,o=e.height,n=e.getContext("2d");if(!n)return;let s=a/oe;n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,a,o),ut(n,a,o,t.mesh),n.setTransform(s,0,0,s,0,0),n.textBaseline="alphabetic";let i=[255,255,255],u=O(t.accent||"#ffffff"),b=ne(n,300,r,7.9,"H");n.font=M(300,b,r),n.fillStyle=d(i,.9),(t.title||"").split(`
`).slice(0,2).forEach((h,l)=>n.fillText(h,17,37+l*14)),t.footer&&(n.fillStyle=d(i,.88),n.fillText(t.footer,17,295));let C=ne(n,300,r,50),v=C*.31;n.font=M(300,C,r);let R=t.value||"",A=n.measureText(R).width;n.font=M(300,v,r);let m=t.unit?n.measureText(t.unit).width+4:0,x=t.detail||"none",y=(x==="wave"?112:x==="cross"?106:127)-(A+m)/2+(x==="cross"?m/2:0),E=O(t.numeral&&t.numeral[0]||"#ffffff"),S=O(t.numeral&&t.numeral[1]||"#ffffff"),_=n.createLinearGradient(y,0,y+A,0);if(_.addColorStop(0,d(E,1)),_.addColorStop(1,d(S,1)),x==="ring")for(let f=0;f<132;f++){let p=f/132*Math.PI*2-Math.PI/2,P=.5+.5*Math.sin(f*12.9898)*Math.sin(f*4.1414+1.3),w=.5+.5*Math.cos(p+Math.PI/2),L=4+4.5*Math.abs(P)+2*w,G=.22+.5*w*w;n.strokeStyle=d(u,G),n.lineWidth=1+.7*w;let H=68;n.beginPath(),n.moveTo(126+Math.cos(p)*H,156+Math.sin(p)*H),n.lineTo(126+Math.cos(p)*(H+L),156+Math.sin(p)*(H+L)),n.stroke()}else if(x==="slider"){let h=Math.max(0,Math.min(100,parseFloat(R)||0))/100,l=24,f=232,p=197.5,P=l+4+(f-l-8)*h*.86,w=n.createLinearGradient(l,0,f,0);w.addColorStop(0,d(u,.15)),w.addColorStop(Math.max(.01,(P-l)/(f-l)),d(u,.85)),w.addColorStop(1,d(u,.35)),n.fillStyle=w,n.fillRect(l,p-.6,f-l,1.2),n.save(),n.shadowColor=d(u,.95),n.shadowBlur=9*s,n.fillStyle=d(i,1),n.beginPath(),n.arc(P,p,4.6,0,Math.PI*2),n.fill(),n.restore();let L=t.labels||[],G=ne(n,400,r,5.2,"H");n.font=M(400,G,r),n.fillStyle=d(i,.6),L[0]&&n.fillText(L[0],14,208),L[1]&&(n.textAlign="right",n.fillText(L[1],230,208),n.textAlign="left")}else if(x==="wave"){n.fillStyle="rgba(20, 0, 8, 0.32)",n.beginPath(),n.arc(27,157,18,0,Math.PI*2),n.fill(),n.strokeStyle=d(i,.75),n.lineWidth=.9;let h=(l,f,p)=>{n.beginPath(),n.moveTo(l-p,f),n.lineTo(l+p,f),n.moveTo(l,f-p),n.lineTo(l,f+p),n.stroke()};h(27,157,3),h(199,157,3);for(let l=0;l<56;l++){let f=43+l*3,P=1.5+6.5*Math.abs(Math.sin(l*1.7+.4)*Math.cos(l*.53)),w=l===23;n.fillStyle=w?d(u,.95):d(i,.3),n.fillRect(f,204-(w?8:P),w?1.4:.9,w?16:P*2)}}else if(x==="cross"){n.fillStyle=d(i,.28),n.fillRect(105.5,66,.8,182),n.fillRect(12,156.5,186,.8);let h=t.labels||[];n.font=M(300,C*.72,r),n.fillStyle=d(i,.07),n.textAlign="center",n.fillText(String(Math.max(0,(parseFloat(R)||0)-8)),106,122),n.textAlign="left";let l=(f,p,P)=>{n.fillStyle="rgba(10, 0, 30, 0.35)",n.beginPath(),n.arc(f,p,6.5,0,Math.PI*2),n.fill(),n.fillStyle=d(i,.7),n.font=M(500,4.2,r),n.textAlign="center",n.fillText(P,f,p+1.5),n.textAlign="left"};if(h[1]&&l(28,137,h[1]),h[2]&&l(181,170,h[2]),h[0]){n.font=M(400,5.2,r);let f=n.measureText(h[0]).width,p=208-f-10;n.fillStyle=d(i,.1),n.beginPath(),n.roundRect(p,25,f+10,11,3),n.fill(),n.fillStyle=d(i,.55),n.fillText(h[0],p+5,32.5)}}n.save(),n.shadowColor=d(S,.35),n.shadowBlur=10*s,n.font=M(300,C,r),n.fillStyle=_,n.fillText(R,y,186),t.unit&&(n.font=M(300,v,r),n.fillStyle=d(S,1),n.fillText(t.unit,y+A+4,136+v*.72)),n.restore()}var Tt=`#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray uTex;
uniform vec2 uRes;
uniform float uUnit;
uniform vec4 uPose[8];
uniform float uDim[8]; // Sorph: per card, how much darker (the peek's deck)
uniform vec3 uGlowCol[8];
uniform vec3 uGlowShape[8];
uniform vec3 uBg;
uniform float uWarp;
uniform float uWide; // Sorph: canvas width over the 720 unit stage; the lens is laid over the real width
uniform float uMix;
uniform float uClear; // Sorph: 1 = no backdrop and no glow, only the cards (the startup peek)
out vec4 outColor;

const float F = ${at.toFixed(2)};
const float CW = ${oe.toFixed(1)};
const float CH = ${Ee.toFixed(1)};
const float CR = ${ot.toFixed(1)};

// horizontal lens: output |u| -> source |u|. Past the start of the flare the slope collapses and then
// turns back, so the outer flare is a hugely stretched (and folded) strip of the card just past |u| = 232
float lensH(float a){
  if (a <= 232.0) return a;
  float k[9] = float[9](232.0, 238.0, 245.0, 253.0, 262.0, 275.0, 295.0, 325.0, 360.0);
  float d[9] = float[9](1.1759, 1.0671, 1.0156, 1.0965, 0.6487, 0.2700, -0.1991, -0.4782, -0.0318);
  float s = 232.0;
  for (int i = 0; i < 8; i++){
    if (a <= k[i]) break;
    float x = min(a, k[i+1]);
    float t = (x - k[i]) / (k[i+1] - k[i]);
    s += (x - k[i]) * mix(1.0, mix(d[i], d[i+1], t * 0.5), uWarp);
  }
  if (a > 360.0) s += (a - 360.0) * mix(1.0, d[8], uWarp);
  return s;
}
float lensS(float a){
  float t = clamp((a - 262.0) / 93.0, 0.0, 2.0);
  return 1.0 + uWarp * (0.42 * pow(t, 1.5) + 0.045 * smoothstep(320.0, 360.0, a));
}

float sdRound(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// premultiplied colour of one card along a source ray
vec4 shadeCard(vec4 pose, float dim, vec2 ps, float fx, float fy, out float depth){
  depth = 1e9;
  if (pose.w < 0.0) return vec4(0.0);
  float k = ps.x / F;
  float c = cos(pose.z), sn = sin(pose.z);
  float den = sn * k - c;
  if (abs(den) < 1e-5) return vec4(0.0);
  float A = pose.x, B = F + pose.y;
  float s = (A - B * k) / den;
  float t = B + s * sn;
  if (t < 4.0) return vec4(0.0);
  float y = t * ps.y / F;
  float dsdk = (B * c - A * sn) / (den * den);
  float fs = min(abs(dsdk / F) * fx, 48.0);
  float fyc = min(t / F * fy, 48.0);
  vec2 p = vec2(s, y);
  float d = sdRound(p, vec2(CW, CH) * 0.5, CR);
  vec2 q = abs(p) - vec2(CW, CH) * 0.5 + CR;
  vec2 n = q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  if (q.x > 0.0 && q.y > 0.0) n = normalize(q);
  float fp = length(vec2(fs * n.x, fyc * n.y)) + 1e-4;
  if (d > fp) return vec4(0.0);
  float cov = clamp(0.5 - d / fp, 0.0, 1.0);
  if (cov <= 0.0) return vec4(0.0);
  vec2 uv = vec2(s / CW + 0.5, 0.5 - y / CH);
  vec4 tex = textureGrad(uTex, vec3(uv, pose.w), vec2(fs / CW, 0.0), vec2(0.0, fyc / CH));
  depth = t;
  return vec4(tex.rgb * (1.0 - dim), 1.0) * cov;
}

vec4 scene(vec2 ps, float fx, float fy, int base){
  vec4 col[4];
  float dep[4];
  for (int i = 0; i < 4; i++) col[i] = shadeCard(uPose[base + i], uDim[base + i], ps, fx, fy, dep[i]);
  // sort by depth (4 entries)
  for (int i = 0; i < 3; i++)
    for (int j = 0; j < 3; j++)
      if (j < 3 - i && dep[j] > dep[j+1]) {
        float td = dep[j]; dep[j] = dep[j+1]; dep[j+1] = td;
        vec4 tc = col[j]; col[j] = col[j+1]; col[j+1] = tc;
      }
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 4; i++) acc += (1.0 - acc.a) * col[i];
  return acc;
}

// the top and bottom glows: every card that faces the viewer lays one whole soft ellipse of its glow
// colour (centre, half width and strength come from glowShape on the CPU), so during a turn the bands
// slide, narrow and cross-fade colour but are never cut off
vec4 glowAt(vec2 pu, float halfH, int base){
  vec4 sum = vec4(0.0);
  // the bands sit just inside the top and bottom of a 5:4 stage; taller stages keep them near the cards
  float gH = min(halfH, 288.0);
  float dy = min(abs((gH - 11.0) - pu.y), abs(pu.y + (gH - 12.0)));
  if (dy > 40.0) return sum;
  for (int i = 0; i < 4; i++){
    vec3 sh = uGlowShape[base + i];
    if (sh.z <= 0.0) continue;
    float E = exp(-pow(abs(pu.x - sh.x) / (sh.y * (1.0 + 0.35 * (uWide - 1.0))), 4.0));
    if (E < 0.002) continue;
    float v = exp(-pow(dy / (18.5 * (0.45 + 0.55 * sqrt(E))), 3.0));
    float w = sh.z * E * v;
    sum += vec4(uGlowCol[base + i] * w, w);
  }
  return sum;
}

// premultiplied: the glow over the backdrop, whose share is 1 - uClear (all of it, normally);
// the glow belongs to the backdrop, so it goes with it
vec4 stage(vec2 pu, float halfH, int base){
  float k = 1.0 - uClear;
  vec4 g = glowAt(pu, halfH, base) * k;
  if (g.a <= 0.0) return vec4(uBg * k, k);
  float I = clamp(g.a, 0.0, 1.0);
  vec3 Ip = pow(vec3(I), vec3(0.8, 1.6, 1.0)); // ls:keep (per-channel falloff exponents, not a colour)
  return vec4(g.rgb / g.a * Ip + (1.0 - Ip) * uBg * k, I + (1.0 - I) * k);
}

vec4 render(vec2 pu, float halfH, int base){
  // stages wider than 5:4 simply run the outermost flare column on to the edge
  // Sorph: au is measured on the 720 unit stage whatever the canvas width, so the flare always ends at the edge
  float au = min(abs(pu.x) / uWide, 360.0);
  float px = 1.0 / uUnit;
  vec4 bg = stage(pu, halfH, base);
  if (au < 236.0 || uWarp <= 0.0) {
    vec4 c = scene(pu, px, px, base);
    return c + (1.0 - c.a) * bg;
  }
  // flare zone: one lens sample per channel. The smear is a widened texture footprint, so it stays smooth
  // with no tap banding; vertically red is spread furthest and blue least, which gives the cyan then blue rim
  float e = 0.064 * uWarp * smoothstep(275.0, 360.0, au);
  float S0 = lensS(au);
  float sg = pu.x < 0.0 ? -1.0 : 1.0;
  float blur = 1.0 + 30.0 * pow(smoothstep(240.0, 340.0, au), 1.5) * uWarp;
  float fyb = 1.0 + 15.0 * smoothstep(280.0, 352.0, au) * uWarp;
  // the stretched outer flare reads a touch brighter, as if lit through the lens
  float gain = 1.0 + 0.17 * smoothstep(285.0, 350.0, au) * uWarp;
  vec3 acc;
  float cover = 0.0;
  for (int ch = 0; ch < 3; ch++){
    // each channel reads a slightly different strip at the outer edge: red nearest the centre, blue furthest,
    // so cards entering or leaving the flare split into cyan, blue and amber ghosts
    float off = uWarp * (ch == 0 ? -20.92 : (ch == 1 ? 0.0 : 11.91));
    float h = lensH(au) + off * smoothstep(289.8, 344.9, au);
    float h0 = lensH(au - 0.5) + off * smoothstep(289.8, 344.9, au - 0.5);
    float h1 = lensH(au + 0.5) + off * smoothstep(289.8, 344.9, au + 0.5);
    float fx = px * max(abs(h1 - h0), 0.02) * blur;
    float S = S0 * (ch == 0 ? 1.0 + e : (ch == 1 ? 1.0 : 1.0 - e));
    vec4 c = scene(vec2(sg * h * uWide, pu.y / S), fx, px / S * fyb, base);
    c.rgb = min(c.rgb * gain, vec3(c.a));
    acc[ch] = (c.rgb + (1.0 - c.a) * bg.rgb)[ch];
    cover += c.a / 3.0;
  }
  return vec4(acc, cover + (1.0 - cover) * bg.a);
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 pu = (fc - 0.5 * uRes) / uUnit;
  float halfH = 0.5 * uRes.y / uUnit;
  vec4 col = render(pu, halfH, 0);
  if (uMix > 0.0) col = mix(col, render(pu, halfH, 4), uMix);
  outColor = col; // premultiplied; alpha is 1 unless uClear lets the backdrop go
}`;var Ce=new Map;function ft(e){if(!e||!e.length)return"#7fd0f0";let t=Ce.get(e);if(!t){let r=e.map(o=>{let n=parseInt(o.slice(1),16),s=[n>>16&255,n>>8&255,n&255],i=Math.max(...s);return{rgb:s,score:i?(i-Math.min(...s))/i*i:0}}).sort((o,n)=>n.score-o.score).slice(0,8);t="#"+[0,1,2].map(o=>Math.round(r.reduce((n,s)=>n+s.rgb[o],0)/r.length)).map(o=>o.toString(16).padStart(2,"0")).join(""),Ce.set(e,t)}return t}function Se(e,t){let r=re[t%re.length],a=e.write!=="";return{mesh:r.mesh,numeral:r.numeral,accent:r.accent,glow:ft(r.mesh),title:a?`${e.speakName}
to ${e.writeName}`:`${e.speakName}
dictation`,value:e.speak.toUpperCase(),unit:a?`\u2192 ${e.write.toUpperCase()}`:void 0,footer:(a?`${e.speakNative} \u2192 ${e.writeNative}`:e.speakNative)+(e.unsaved?"  \xB7  not saved":""),detail:a?"ring":"wave"}}var dt=220,mt=2,pt="cubic-bezier(0.22, 1, 0.36, 1)",ht="cubic-bezier(0.4, 0, 1, 1)",X=(e,t)=>`rotateY(${e}deg) scale(${t})`,bt=document.getElementById("stage"),I=null;function gt(e,t){let r=document.createElement("div");r.className="card";let a=Pe(Se(e,t),dt*mt,Ae),o=document.createElement("canvas");return o.width=a.width,o.height=a.height,o.getContext("2d").drawImage(a,0,0),r.appendChild(o),bt.appendChild(r),r}function _e(e,t,r){let a=e.animate([{transform:X(0,1),opacity:1},{transform:X(t,.97),opacity:0}],{duration:r,easing:ht,fill:"forwards"});a.onfinish=()=>e.remove()}function vt(e,t=0){let r=I!==null;I&&_e(I,70,350);let a=gt(e,t);a.animate([{transform:X(-70,.96),opacity:0},{transform:X(0,1),opacity:1}],{duration:r?350:450,easing:pt,fill:"forwards"}),I=a}function yt(){I&&(_e(I,60,250),I=null)}window.card={show:vt,hide:yt};})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
