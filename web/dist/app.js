(()=>{var qi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Yi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},up=0,_h=1,fp=2;var wh=1,mp=2,ri=3,wi=0,dn=1,Ie=2,$n=0,Mi=1,Zi=2,Mh=3,Sh=4,gp=5,zi=100,xp=101,bp=102,vp=103,yp=104,_p=200,wp=201,Mp=202,Sp=203,Ta=204,Aa=205,Ep=206,Tp=207,Ap=208,Rp=209,Cp=210,Ip=211,Pp=212,kp=213,Lp=214,Ka=0,Qa=1,tl=2,fr=3,el=4,nl=5,il=6,rl=7,sl=0,Dp=1,Up=2,Si=0,ol=1,al=2,ll=3,cl=4,hl=5,dl=6,pl=7;var Eh=300,_r=301,wr=302,ul=303,fl=304,uo=306,Ra=1e3,Oi=1001,Ca=1002,Pn=1003,Fp=1004;var fo=1005;var Vn=1006,ml=1007;var ji=1008;var Xn=1009,Th=1010,Ah=1011,hs=1012,gl=1013,Ji=1014,si=1015,kn=1016,xl=1017,bl=1018,ds=1020,Rh=35902,Ch=35899,Ih=1021,Ph=1022,Ln=1023,Qr=1026,ps=1027,kh=1028,vl=1029,Lh=1030,yl=1031;var _l=1033,mo=33776,go=33777,xo=33778,bo=33779,wl=35840,Ml=35841,Sl=35842,El=35843,Tl=36196,Al=37492,Rl=37496,Cl=37808,Il=37809,Pl=37810,kl=37811,Ll=37812,Dl=37813,Ul=37814,Fl=37815,Nl=37816,Bl=37817,Ol=37818,zl=37819,Hl=37820,Vl=37821,Gl=36492,Wl=36494,$l=36495,Xl=36283,ql=36284,Yl=36285,Zl=36286;var Ns=2300,Ia=2301,Ea=2302,ch=2400,hh=2401,dh=2402;var Np=3200,Bp=3201;var Dh=0,Op=1,Ei="",_n="srgb",mr="srgb-linear",Bs="linear",oe="srgb";var ur=7680;var ph=519,zp=512,Hp=513,Vp=514,Uh=515,Gp=516,Wp=517,$p=518,Xp=519,uh=35044;var Fh="300 es",zn=2e3,Os=2001;var ni=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let r=n[t];if(r!==void 0){let s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}},Ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bd=1234567,Jr=Math.PI/180,ts=180/Math.PI;function us(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ke[i&255]+Ke[i>>8&255]+Ke[i>>16&255]+Ke[i>>24&255]+"-"+Ke[t&255]+Ke[t>>8&255]+"-"+Ke[t>>16&15|64]+Ke[t>>24&255]+"-"+Ke[e&63|128]+Ke[e>>8&255]+"-"+Ke[e>>16&255]+Ke[e>>24&255]+Ke[n&255]+Ke[n>>8&255]+Ke[n>>16&255]+Ke[n>>24&255]).toLowerCase()}function Zt(i,t,e){return Math.max(t,Math.min(e,i))}function Nh(i,t){return(i%t+t)%t}function If(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function Pf(i,t,e){return i!==t?(e-i)/(t-i):0}function Fs(i,t,e){return(1-e)*i+e*t}function kf(i,t,e,n){return Fs(i,t,1-Math.exp(-e*n))}function Lf(i,t=1){return t-Math.abs(Nh(i,t*2)-t)}function Df(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Uf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ff(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Nf(i,t){return i+Math.random()*(t-i)}function Bf(i){return i*(.5-Math.random())}function Of(i){i!==void 0&&(Bd=i);let t=Bd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function zf(i){return i*Jr}function Hf(i){return i*ts}function Vf(i){return(i&i-1)===0&&i!==0}function Gf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $f(i,t,e,n,r){let s=Math.cos,o=Math.sin,a=s(e/2),c=o(e/2),l=s((t+n)/2),d=o((t+n)/2),h=s((t-n)/2),p=o((t-n)/2),u=s((n-t)/2),m=o((n-t)/2);switch(r){case"XYX":i.set(a*d,c*h,c*p,a*l);break;case"YZY":i.set(c*p,a*d,c*h,a*l);break;case"ZXZ":i.set(c*h,c*p,a*d,a*l);break;case"XZX":i.set(a*d,c*m,c*u,a*l);break;case"YXY":i.set(c*u,a*d,c*m,a*l);break;case"ZYZ":i.set(c*m,c*u,a*d,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function jr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function cn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var qn={DEG2RAD:Jr,RAD2DEG:ts,generateUUID:us,clamp:Zt,euclideanModulo:Nh,mapLinear:If,inverseLerp:Pf,lerp:Fs,damp:kf,pingpong:Lf,smoothstep:Df,smootherstep:Uf,randInt:Ff,randFloat:Nf,randFloatSpread:Bf,seededRandom:Of,degToRad:zf,radToDeg:Hf,isPowerOfTwo:Vf,ceilPowerOfTwo:Gf,floorPowerOfTwo:Wf,setQuaternionFromProperEuler:$f,normalize:cn,denormalize:jr},Ct=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fn=class{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let c=n[r+0],l=n[r+1],d=n[r+2],h=n[r+3],p=s[o+0],u=s[o+1],m=s[o+2],x=s[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h;return}if(a===1){t[e+0]=p,t[e+1]=u,t[e+2]=m,t[e+3]=x;return}if(h!==x||c!==p||l!==u||d!==m){let g=1-a,f=c*p+l*u+d*m+h*x,M=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){let E=Math.sqrt(v),T=Math.atan2(E,f*M);g=Math.sin(g*T)/E,a=Math.sin(a*T)/E}let y=a*M;if(c=c*g+p*y,l=l*g+u*y,d=d*g+m*y,h=h*g+x*y,g===1-a){let E=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=E,l*=E,d*=E,h*=E}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,r,s,o){let a=n[r],c=n[r+1],l=n[r+2],d=n[r+3],h=s[o],p=s[o+1],u=s[o+2],m=s[o+3];return t[e]=a*m+d*h+c*u-l*p,t[e+1]=c*m+d*p+l*h-a*u,t[e+2]=l*m+d*u+a*p-c*h,t[e+3]=d*m-a*h-c*p-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),d=a(r/2),h=a(s/2),p=c(n/2),u=c(r/2),m=c(s/2);switch(o){case"XYZ":this._x=p*d*h+l*u*m,this._y=l*u*h-p*d*m,this._z=l*d*m+p*u*h,this._w=l*d*h-p*u*m;break;case"YXZ":this._x=p*d*h+l*u*m,this._y=l*u*h-p*d*m,this._z=l*d*m-p*u*h,this._w=l*d*h+p*u*m;break;case"ZXY":this._x=p*d*h-l*u*m,this._y=l*u*h+p*d*m,this._z=l*d*m+p*u*h,this._w=l*d*h-p*u*m;break;case"ZYX":this._x=p*d*h-l*u*m,this._y=l*u*h+p*d*m,this._z=l*d*m-p*u*h,this._w=l*d*h+p*u*m;break;case"YZX":this._x=p*d*h+l*u*m,this._y=l*u*h+p*d*m,this._z=l*d*m-p*u*h,this._w=l*d*h-p*u*m;break;case"XZY":this._x=p*d*h-l*u*m,this._y=l*u*h-p*d*m,this._z=l*d*m+p*u*h,this._w=l*d*h+p*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],d=e[6],h=e[10],p=n+a+h;if(p>0){let u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(d-c)*u,this._y=(s-l)*u,this._z=(o-r)*u}else if(n>a&&n>h){let u=2*Math.sqrt(1+n-a-h);this._w=(d-c)/u,this._x=.25*u,this._y=(r+o)/u,this._z=(s+l)/u}else if(a>h){let u=2*Math.sqrt(1+a-n-h);this._w=(s-l)/u,this._x=(r+o)/u,this._y=.25*u,this._z=(c+d)/u}else{let u=2*Math.sqrt(1+h-n-a);this._w=(o-r)/u,this._x=(s+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+o*a+r*l-s*c,this._y=r*d+o*c+s*a-n*l,this._z=s*d+o*l+n*c-r*a,this._w=o*d-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,r=this._y,s=this._z,o=this._w,a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;let c=1-a*a;if(c<=Number.EPSILON){let u=1-e;return this._w=u*o+e*this._w,this._x=u*n+e*this._x,this._y=u*r+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}let l=Math.sqrt(c),d=Math.atan2(l,a),h=Math.sin((1-e)*d)/l,p=Math.sin(e*d)/l;return this._w=o*h+this._w*p,this._x=n*h+this._x*p,this._y=r*h+this._y*p,this._z=s*h+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Od.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Od.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*r-a*n),d=2*(a*e-s*r),h=2*(s*n-o*e);return this.x=e+c*l+o*h-a*d,this.y=n+c*d+a*l-s*h,this.z=r+c*h+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Fc.copy(this).projectOnVector(t),this.sub(Fc)}reflect(t){return this.sub(Fc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Fc=new U,Od=new fn,Yt=class i{constructor(t,e,n,r,s,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l)}set(t,e,n,r,s,o,a,c,l){let d=this.elements;return d[0]=t,d[1]=r,d[2]=a,d[3]=e,d[4]=s,d[5]=c,d[6]=n,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],d=n[4],h=n[7],p=n[2],u=n[5],m=n[8],x=r[0],g=r[3],f=r[6],M=r[1],v=r[4],y=r[7],E=r[2],T=r[5],A=r[8];return s[0]=o*x+a*M+c*E,s[3]=o*g+a*v+c*T,s[6]=o*f+a*y+c*A,s[1]=l*x+d*M+h*E,s[4]=l*g+d*v+h*T,s[7]=l*f+d*y+h*A,s[2]=p*x+u*M+m*E,s[5]=p*g+u*v+m*T,s[8]=p*f+u*y+m*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*a*l-n*s*d+n*a*c+r*s*l-r*o*c}invert(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],d=t[8],h=d*o-a*l,p=a*c-d*s,u=l*s-o*c,m=e*h+n*p+r*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=h*x,t[1]=(r*l-d*n)*x,t[2]=(a*n-r*o)*x,t[3]=p*x,t[4]=(d*e-r*c)*x,t[5]=(r*s-a*e)*x,t[6]=u*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*s)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-r*l,r*c,-r*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Nc.makeScale(t,e)),this}rotate(t){return this.premultiply(Nc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Nc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Nc=new Yt;function Bh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function zs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function qp(){let i=zs("canvas");return i.style.display="block",i}var zd={};function es(i){i in zd||(zd[i]=!0,console.warn(i))}function Yp(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}var Hd=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vd=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xf(){let i={enabled:!0,workingColorSpace:mr,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===oe&&(r.r=_i(r.r),r.g=_i(r.g),r.b=_i(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===oe&&(r.r=Kr(r.r),r.g=Kr(r.g),r.b=Kr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ei?Bs:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return es("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return es("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[mr]:{primaries:t,whitePoint:n,transfer:Bs,toXYZ:Hd,fromXYZ:Vd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:_n},outputColorSpaceConfig:{drawingBufferColorSpace:_n}},[_n]:{primaries:t,whitePoint:n,transfer:oe,toXYZ:Hd,fromXYZ:Vd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:_n}}}),i}var te=Xf();function _i(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Kr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Br,Pa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Br===void 0&&(Br=zs("canvas")),Br.width=t.width,Br.height=t.height;let r=Br.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Br}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=zs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=_i(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(_i(e[n]/255)*255):e[n]=_i(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},qf=0,ns=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=us(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Bc(r[o].image)):s.push(Bc(r[o]))}else s=Bc(r);n.url=s}return e||(t.images[this.uuid]=n),n}};function Bc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Pa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Yf=0,Oc=new U,mn=class i extends ni{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Oi,r=Oi,s=Vn,o=ji,a=Ln,c=Xn,l=i.DEFAULT_ANISOTROPY,d=Ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=us(),this.name="",this.source=new ns(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Oc).x}get height(){return this.source.getSize(Oc).y}get depth(){return this.source.getSize(Oc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Eh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ra:t.x=t.x-Math.floor(t.x);break;case Oi:t.x=t.x<0?0:1;break;case Ca:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ra:t.y=t.y-Math.floor(t.y);break;case Oi:t.y=t.y<0?0:1;break;case Ca:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=Eh;mn.DEFAULT_ANISOTROPY=1;var fe=class i{constructor(t=0,e=0,n=0,r=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s,c=t.elements,l=c[0],d=c[4],h=c[8],p=c[1],u=c[5],m=c[9],x=c[2],g=c[6],f=c[10];if(Math.abs(d-p)<.01&&Math.abs(h-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+p)<.1&&Math.abs(h+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+u+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(l+1)/2,y=(u+1)/2,E=(f+1)/2,T=(d+p)/4,A=(h+x)/4,I=(m+g)/4;return v>y&&v>E?v<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(v),r=T/n,s=A/n):y>E?y<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),n=T/r,s=I/r):E<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(E),n=A/s,r=I/s),this.set(n,r,s,e),this}let M=Math.sqrt((g-m)*(g-m)+(h-x)*(h-x)+(p-d)*(p-d));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(h-x)/M,this.z=(p-d)/M,this.w=Math.acos((l+u+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ka=class extends ni{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new fe(0,0,t,e),this.scissorTest=!1,this.viewport=new fe(0,0,t,e);let r={width:t,height:e,depth:n.depth},s=new mn(r);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Vn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let r=Object.assign({},t.textures[e].image);this.textures[e].source=new ns(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},en=class extends ka{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Hs=class extends mn{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var La=class extends mn{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Hi=class{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Nn):Nn.fromBufferAttribute(s,o),Nn.applyMatrix4(t.matrixWorld),this.expandByPoint(Nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Jo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jo.copy(n.boundingBox)),Jo.applyMatrix4(t.matrixWorld),this.union(Jo)}let r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Nn),Nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Is),Ko.subVectors(this.max,Is),Or.subVectors(t.a,Is),zr.subVectors(t.b,Is),Hr.subVectors(t.c,Is),Li.subVectors(zr,Or),Di.subVectors(Hr,zr),cr.subVectors(Or,Hr);let e=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-cr.z,cr.y,Li.z,0,-Li.x,Di.z,0,-Di.x,cr.z,0,-cr.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-cr.y,cr.x,0];return!zc(e,Or,zr,Hr,Ko)||(e=[1,0,0,0,1,0,0,0,1],!zc(e,Or,zr,Hr,Ko))?!1:(Qo.crossVectors(Li,Di),e=[Qo.x,Qo.y,Qo.z],zc(e,Or,zr,Hr,Ko))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},mi=[new U,new U,new U,new U,new U,new U,new U,new U],Nn=new U,Jo=new Hi,Or=new U,zr=new U,Hr=new U,Li=new U,Di=new U,cr=new U,Is=new U,Ko=new U,Qo=new U,hr=new U;function zc(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){hr.fromArray(i,s);let a=r.x*Math.abs(hr.x)+r.y*Math.abs(hr.y)+r.z*Math.abs(hr.z),c=t.dot(hr),l=e.dot(hr),d=n.dot(hr);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>a)return!1}return!0}var Zf=new Hi,Ps=new U,Hc=new U,Vi=class{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Zf.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ps.subVectors(t,this.center);let e=Ps.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Ps,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Hc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ps.copy(t.center).add(Hc)),this.expandByPoint(Ps.copy(t.center).sub(Hc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},gi=new U,Vc=new U,ta=new U,Ui=new U,Gc=new U,ea=new U,Wc=new U,Gi=class{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=gi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gi.copy(this.origin).addScaledVector(this.direction,e),gi.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Vc.copy(t).add(e).multiplyScalar(.5),ta.copy(e).sub(t).normalize(),Ui.copy(this.origin).sub(Vc);let s=t.distanceTo(e)*.5,o=-this.direction.dot(ta),a=Ui.dot(this.direction),c=-Ui.dot(ta),l=Ui.lengthSq(),d=Math.abs(1-o*o),h,p,u,m;if(d>0)if(h=o*c-a,p=o*a-c,m=s*d,h>=0)if(p>=-m)if(p<=m){let x=1/d;h*=x,p*=x,u=h*(h+o*p+2*a)+p*(o*h+p+2*c)+l}else p=s,h=Math.max(0,-(o*p+a)),u=-h*h+p*(p+2*c)+l;else p=-s,h=Math.max(0,-(o*p+a)),u=-h*h+p*(p+2*c)+l;else p<=-m?(h=Math.max(0,-(-o*s+a)),p=h>0?-s:Math.min(Math.max(-s,-c),s),u=-h*h+p*(p+2*c)+l):p<=m?(h=0,p=Math.min(Math.max(-s,-c),s),u=p*(p+2*c)+l):(h=Math.max(0,-(o*s+a)),p=h>0?s:Math.min(Math.max(-s,-c),s),u=-h*h+p*(p+2*c)+l);else p=o>0?-s:s,h=Math.max(0,-(o*p+a)),u=-h*h+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Vc).addScaledVector(ta,p),u}intersectSphere(t,e){gi.subVectors(t.center,this.origin);let n=gi.dot(this.direction),r=gi.dot(gi)-n*n,s=t.radius*t.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,c,l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,r=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,r=(t.min.x-p.x)*l),d>=0?(s=(t.min.y-p.y)*d,o=(t.max.y-p.y)*d):(s=(t.max.y-p.y)*d,o=(t.min.y-p.y)*d),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(t.min.z-p.z)*h,c=(t.max.z-p.z)*h):(a=(t.max.z-p.z)*h,c=(t.min.z-p.z)*h),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,gi)!==null}intersectTriangle(t,e,n,r,s){Gc.subVectors(e,t),ea.subVectors(n,t),Wc.crossVectors(Gc,ea);let o=this.direction.dot(Wc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ui.subVectors(this.origin,t);let c=a*this.direction.dot(ea.crossVectors(Ui,ea));if(c<0)return null;let l=a*this.direction.dot(Gc.cross(Ui));if(l<0||c+l>o)return null;let d=-a*Ui.dot(Wc);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},_e=class i{constructor(t,e,n,r,s,o,a,c,l,d,h,p,u,m,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l,d,h,p,u,m,x,g)}set(t,e,n,r,s,o,a,c,l,d,h,p,u,m,x,g){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=d,f[10]=h,f[14]=p,f[3]=u,f[7]=m,f[11]=x,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,r=1/Vr.setFromMatrixColumn(t,0).length(),s=1/Vr.setFromMatrixColumn(t,1).length(),o=1/Vr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){let p=o*d,u=o*h,m=a*d,x=a*h;e[0]=c*d,e[4]=-c*h,e[8]=l,e[1]=u+m*l,e[5]=p-x*l,e[9]=-a*c,e[2]=x-p*l,e[6]=m+u*l,e[10]=o*c}else if(t.order==="YXZ"){let p=c*d,u=c*h,m=l*d,x=l*h;e[0]=p+x*a,e[4]=m*a-u,e[8]=o*l,e[1]=o*h,e[5]=o*d,e[9]=-a,e[2]=u*a-m,e[6]=x+p*a,e[10]=o*c}else if(t.order==="ZXY"){let p=c*d,u=c*h,m=l*d,x=l*h;e[0]=p-x*a,e[4]=-o*h,e[8]=m+u*a,e[1]=u+m*a,e[5]=o*d,e[9]=x-p*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let p=o*d,u=o*h,m=a*d,x=a*h;e[0]=c*d,e[4]=m*l-u,e[8]=p*l+x,e[1]=c*h,e[5]=x*l+p,e[9]=u*l-m,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let p=o*c,u=o*l,m=a*c,x=a*l;e[0]=c*d,e[4]=x-p*h,e[8]=m*h+u,e[1]=h,e[5]=o*d,e[9]=-a*d,e[2]=-l*d,e[6]=u*h+m,e[10]=p-x*h}else if(t.order==="XZY"){let p=o*c,u=o*l,m=a*c,x=a*l;e[0]=c*d,e[4]=-h,e[8]=l*d,e[1]=p*h+x,e[5]=o*d,e[9]=u*h-m,e[2]=m*h-u,e[6]=a*d,e[10]=x*h+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(jf,t,Jf)}lookAt(t,e,n){let r=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Fi.crossVectors(n,vn),Fi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Fi.crossVectors(n,vn)),Fi.normalize(),na.crossVectors(vn,Fi),r[0]=Fi.x,r[4]=na.x,r[8]=vn.x,r[1]=Fi.y,r[5]=na.y,r[9]=vn.y,r[2]=Fi.z,r[6]=na.z,r[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],d=n[1],h=n[5],p=n[9],u=n[13],m=n[2],x=n[6],g=n[10],f=n[14],M=n[3],v=n[7],y=n[11],E=n[15],T=r[0],A=r[4],I=r[8],b=r[12],w=r[1],P=r[5],k=r[9],G=r[13],N=r[2],L=r[6],O=r[10],W=r[14],z=r[3],Q=r[7],nt=r[11],ht=r[15];return s[0]=o*T+a*w+c*N+l*z,s[4]=o*A+a*P+c*L+l*Q,s[8]=o*I+a*k+c*O+l*nt,s[12]=o*b+a*G+c*W+l*ht,s[1]=d*T+h*w+p*N+u*z,s[5]=d*A+h*P+p*L+u*Q,s[9]=d*I+h*k+p*O+u*nt,s[13]=d*b+h*G+p*W+u*ht,s[2]=m*T+x*w+g*N+f*z,s[6]=m*A+x*P+g*L+f*Q,s[10]=m*I+x*k+g*O+f*nt,s[14]=m*b+x*G+g*W+f*ht,s[3]=M*T+v*w+y*N+E*z,s[7]=M*A+v*P+y*L+E*Q,s[11]=M*I+v*k+y*O+E*nt,s[15]=M*b+v*G+y*W+E*ht,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],d=t[2],h=t[6],p=t[10],u=t[14],m=t[3],x=t[7],g=t[11],f=t[15];return m*(+s*c*h-r*l*h-s*a*p+n*l*p+r*a*u-n*c*u)+x*(+e*c*u-e*l*p+s*o*p-r*o*u+r*l*d-s*c*d)+g*(+e*l*h-e*a*u-s*o*h+n*o*u+s*a*d-n*l*d)+f*(-r*a*d-e*c*h+e*a*p+r*o*h-n*o*p+n*c*d)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],d=t[8],h=t[9],p=t[10],u=t[11],m=t[12],x=t[13],g=t[14],f=t[15],M=h*g*l-x*p*l+x*c*u-a*g*u-h*c*f+a*p*f,v=m*p*l-d*g*l-m*c*u+o*g*u+d*c*f-o*p*f,y=d*x*l-m*h*l+m*a*u-o*x*u-d*a*f+o*h*f,E=m*h*c-d*x*c-m*a*p+o*x*p+d*a*g-o*h*g,T=e*M+n*v+r*y+s*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return t[0]=M*A,t[1]=(x*p*s-h*g*s-x*r*u+n*g*u+h*r*f-n*p*f)*A,t[2]=(a*g*s-x*c*s+x*r*l-n*g*l-a*r*f+n*c*f)*A,t[3]=(h*c*s-a*p*s-h*r*l+n*p*l+a*r*u-n*c*u)*A,t[4]=v*A,t[5]=(d*g*s-m*p*s+m*r*u-e*g*u-d*r*f+e*p*f)*A,t[6]=(m*c*s-o*g*s-m*r*l+e*g*l+o*r*f-e*c*f)*A,t[7]=(o*p*s-d*c*s+d*r*l-e*p*l-o*r*u+e*c*u)*A,t[8]=y*A,t[9]=(m*h*s-d*x*s-m*n*u+e*x*u+d*n*f-e*h*f)*A,t[10]=(o*x*s-m*a*s+m*n*l-e*x*l-o*n*f+e*a*f)*A,t[11]=(d*a*s-o*h*s-d*n*l+e*h*l+o*n*u-e*a*u)*A,t[12]=E*A,t[13]=(d*x*r-m*h*r+m*n*p-e*x*p-d*n*g+e*h*g)*A,t[14]=(m*a*r-o*x*r-m*n*c+e*x*c+o*n*g-e*a*g)*A,t[15]=(o*h*r-d*a*r+d*n*c-e*h*c-o*n*p+e*a*p)*A,this}scale(t){let e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,c=t.z,l=s*o,d=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,d*a+n,d*c-r*o,0,l*c-r*a,d*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){let r=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,d=o+o,h=a+a,p=s*l,u=s*d,m=s*h,x=o*d,g=o*h,f=a*h,M=c*l,v=c*d,y=c*h,E=n.x,T=n.y,A=n.z;return r[0]=(1-(x+f))*E,r[1]=(u+y)*E,r[2]=(m-v)*E,r[3]=0,r[4]=(u-y)*T,r[5]=(1-(p+f))*T,r[6]=(g+M)*T,r[7]=0,r[8]=(m+v)*A,r[9]=(g-M)*A,r[10]=(1-(p+x))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){let r=this.elements,s=Vr.set(r[0],r[1],r[2]).length(),o=Vr.set(r[4],r[5],r[6]).length(),a=Vr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],Bn.copy(this);let l=1/s,d=1/o,h=1/a;return Bn.elements[0]*=l,Bn.elements[1]*=l,Bn.elements[2]*=l,Bn.elements[4]*=d,Bn.elements[5]*=d,Bn.elements[6]*=d,Bn.elements[8]*=h,Bn.elements[9]*=h,Bn.elements[10]*=h,e.setFromRotationMatrix(Bn),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=zn,c=!1){let l=this.elements,d=2*s/(e-t),h=2*s/(n-r),p=(e+t)/(e-t),u=(n+r)/(n-r),m,x;if(c)m=s/(o-s),x=o*s/(o-s);else if(a===zn)m=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===Os)m=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=d,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=zn,c=!1){let l=this.elements,d=2/(e-t),h=2/(n-r),p=-(e+t)/(e-t),u=-(n+r)/(n-r),m,x;if(c)m=1/(o-s),x=o/(o-s);else if(a===zn)m=-2/(o-s),x=-(o+s)/(o-s);else if(a===Os)m=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=d,l[4]=0,l[8]=0,l[12]=p,l[1]=0,l[5]=h,l[9]=0,l[13]=u,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Vr=new U,Bn=new _e,jf=new U(0,0,0),Jf=new U(1,1,1),Fi=new U,na=new U,vn=new U,Gd=new _e,Wd=new fn,Gn=class i{constructor(t=0,e=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let r=t.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],d=r[9],h=r[2],p=r[6],u=r[10];switch(e){case"XYZ":this._y=Math.asin(Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-h,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(p,u),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Zt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,u));break;case"XZY":this._z=Math.asin(-Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Gd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Gd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wd.setFromEuler(this),this.setFromQuaternion(Wd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Gn.DEFAULT_ORDER="XYZ";var Vs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Kf=0,$d=new U,Gr=new fn,xi=new _e,ia=new U,ks=new U,Qf=new U,tm=new fn,Xd=new U(1,0,0),qd=new U(0,1,0),Yd=new U(0,0,1),Zd={type:"added"},em={type:"removed"},Wr={type:"childadded",child:null},$c={type:"childremoved",child:null},Xe=class i extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new U,e=new Gn,n=new fn,r=new U(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new _e},normalMatrix:{value:new Yt}}),this.matrix=new _e,this.matrixWorld=new _e,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gr.setFromAxisAngle(t,e),this.quaternion.multiply(Gr),this}rotateOnWorldAxis(t,e){return Gr.setFromAxisAngle(t,e),this.quaternion.premultiply(Gr),this}rotateX(t){return this.rotateOnAxis(Xd,t)}rotateY(t){return this.rotateOnAxis(qd,t)}rotateZ(t){return this.rotateOnAxis(Yd,t)}translateOnAxis(t,e){return $d.copy(t).applyQuaternion(this.quaternion),this.position.add($d.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xd,t)}translateY(t){return this.translateOnAxis(qd,t)}translateZ(t){return this.translateOnAxis(Yd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ia.copy(t):ia.set(t,e,n);let r=this.parent;this.updateWorldMatrix(!0,!1),ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(ks,ia,this.up):xi.lookAt(ia,ks,this.up),this.quaternion.setFromRotationMatrix(xi),r&&(xi.extractRotation(r.matrixWorld),Gr.setFromRotationMatrix(xi),this.quaternion.premultiply(Gr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zd),Wr.child=t,this.dispatchEvent(Wr),Wr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(em),$c.child=t,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xi.multiply(t.parent.matrixWorld)),t.applyMatrix4(xi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zd),Wr.child=t,this.dispatchEvent(Wr),Wr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,t,Qf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,tm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){let h=c[l];s(t.shapes,h)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];r.animations.push(s(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),h=o(t.shapes),p=o(t.skeletons),u=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),p.length>0&&(n.skeletons=p),u.length>0&&(n.animations=u),m.length>0&&(n.nodes=m)}return n.object=r,n;function o(a){let c=[];for(let l in a){let d=a[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let r=t.children[n];this.add(r.clone())}return this}};Xe.DEFAULT_UP=new U(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var On=new U,bi=new U,Xc=new U,vi=new U,$r=new U,Xr=new U,jd=new U,qc=new U,Yc=new U,Zc=new U,jc=new fe,Jc=new fe,Kc=new fe,yi=class i{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),On.subVectors(t,e),r.cross(On);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){On.subVectors(r,e),bi.subVectors(n,e),Xc.subVectors(t,e);let o=On.dot(On),a=On.dot(bi),c=On.dot(Xc),l=bi.dot(bi),d=bi.dot(Xc),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;let p=1/h,u=(l*c-a*d)*p,m=(o*d-a*c)*p;return s.set(1-u-m,m,u)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(t,e,n,r,s,o,a,c){return this.getBarycoord(t,e,n,r,vi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,vi.x),c.addScaledVector(o,vi.y),c.addScaledVector(a,vi.z),c)}static getInterpolatedAttribute(t,e,n,r,s,o){return jc.setScalar(0),Jc.setScalar(0),Kc.setScalar(0),jc.fromBufferAttribute(t,e),Jc.fromBufferAttribute(t,n),Kc.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(jc,s.x),o.addScaledVector(Jc,s.y),o.addScaledVector(Kc,s.z),o}static isFrontFacing(t,e,n,r){return On.subVectors(n,e),bi.subVectors(t,e),On.cross(bi).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),On.cross(bi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return i.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,r=this.b,s=this.c,o,a;$r.subVectors(r,n),Xr.subVectors(s,n),qc.subVectors(t,n);let c=$r.dot(qc),l=Xr.dot(qc);if(c<=0&&l<=0)return e.copy(n);Yc.subVectors(t,r);let d=$r.dot(Yc),h=Xr.dot(Yc);if(d>=0&&h<=d)return e.copy(r);let p=c*h-d*l;if(p<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(n).addScaledVector($r,o);Zc.subVectors(t,s);let u=$r.dot(Zc),m=Xr.dot(Zc);if(m>=0&&u<=m)return e.copy(s);let x=u*l-c*m;if(x<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(n).addScaledVector(Xr,a);let g=d*m-u*h;if(g<=0&&h-d>=0&&u-m>=0)return jd.subVectors(s,r),a=(h-d)/(h-d+(u-m)),e.copy(r).addScaledVector(jd,a);let f=1/(g+x+p);return o=x*f,a=p*f,e.copy(n).addScaledVector($r,o).addScaledVector(Xr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Zp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ni={h:0,s:0,l:0},ra={h:0,s:0,l:0};function Qc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Dt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=_n){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=te.workingColorSpace){if(t=Nh(t,1),e=Zt(e,0,1),n=Zt(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Qc(o,s,t+1/3),this.g=Qc(o,s,t),this.b=Qc(o,s,t-1/3)}return te.colorSpaceToWorking(this,r),this}setStyle(t,e=_n){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=_n){let n=Zp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=_i(t.r),this.g=_i(t.g),this.b=_i(t.b),this}copyLinearToSRGB(t){return this.r=Kr(t.r),this.g=Kr(t.g),this.b=Kr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=_n){return te.workingToColorSpace(Qe.copy(this),t),Math.round(Zt(Qe.r*255,0,255))*65536+Math.round(Zt(Qe.g*255,0,255))*256+Math.round(Zt(Qe.b*255,0,255))}getHexString(t=_n){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(Qe.copy(this),e);let n=Qe.r,r=Qe.g,s=Qe.b,o=Math.max(n,r,s),a=Math.min(n,r,s),c,l,d=(a+o)/2;if(a===o)c=0,l=0;else{let h=o-a;switch(l=d<=.5?h/(o+a):h/(2-o-a),o){case n:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-n)/h+2;break;case s:c=(n-r)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(Qe.copy(this),e),t.r=Qe.r,t.g=Qe.g,t.b=Qe.b,t}getStyle(t=_n){te.workingToColorSpace(Qe.copy(this),t);let e=Qe.r,n=Qe.g,r=Qe.b;return t!==_n?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Ni),this.setHSL(Ni.h+t,Ni.s+e,Ni.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ni),t.getHSL(ra);let n=Fs(Ni.h,ra.h,e),r=Fs(Ni.s,ra.s,e),s=Fs(Ni.l,ra.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qe=new Dt;Dt.NAMES=Zp;var nm=0,ii=class extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=us(),this.name="",this.type="Material",this.blending=Mi,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ta,this.blendDst=Aa,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=fr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ph,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ur,this.stencilZFail=ur,this.stencilZPass=ur,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Mi&&(n.blending=this.blending),this.side!==wi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ta&&(n.blendSrc=this.blendSrc),this.blendDst!==Aa&&(n.blendDst=this.blendDst),this.blendEquation!==zi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==fr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ph&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ur&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ur&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ur&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(e){let s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},qe=class extends ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=sl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ne=new U,sa=new Ct,im=0,hn=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:im++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=uh,this.updateRanges=[],this.gpuType=si,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)sa.fromBufferAttribute(this,e),sa.applyMatrix3(t),this.setXY(e,sa.x,sa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix3(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix4(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyNormalMatrix(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.transformDirection(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=jr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=cn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=jr(e,this.array)),e}setX(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=jr(e,this.array)),e}setY(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=jr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=jr(e,this.array)),e}setW(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),n=cn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),n=cn(n,this.array),r=cn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),n=cn(n,this.array),r=cn(r,this.array),s=cn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==uh&&(t.usage=this.usage),t}};var Gs=class extends hn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ws=class extends hn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var ue=class extends hn{constructor(t,e,n){super(new Float32Array(t),e,n)}},rm=0,Cn=new _e,th=new Xe,qr=new U,yn=new Hi,Ls=new Hi,$e=new U,Be=class i extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Bh(t)?Ws:Gs)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Yt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Cn.makeRotationFromQuaternion(t),this.applyMatrix4(Cn),this}rotateX(t){return Cn.makeRotationX(t),this.applyMatrix4(Cn),this}rotateY(t){return Cn.makeRotationY(t),this.applyMatrix4(Cn),this}rotateZ(t){return Cn.makeRotationZ(t),this.applyMatrix4(Cn),this}translate(t,e,n){return Cn.makeTranslation(t,e,n),this.applyMatrix4(Cn),this}scale(t,e,n){return Cn.makeScale(t,e,n),this.applyMatrix4(Cn),this}lookAt(t){return th.lookAt(t),th.updateMatrix(),this.applyMatrix4(th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qr).negate(),this.translate(qr.x,qr.y,qr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let r=0,s=t.length;r<s;r++){let o=t[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ue(n,3))}else{let n=Math.min(t.length,e.count);for(let r=0;r<n;r++){let s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){let s=e[n];yn.setFromBufferAttribute(s),this.morphTargetsRelative?($e.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint($e),$e.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint($e)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){let a=e[s];Ls.setFromBufferAttribute(a),this.morphTargetsRelative?($e.addVectors(yn.min,Ls.min),yn.expandByPoint($e),$e.addVectors(yn.max,Ls.max),yn.expandByPoint($e)):(yn.expandByPoint(Ls.min),yn.expandByPoint(Ls.max))}yn.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)$e.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared($e));if(e)for(let s=0,o=e.length;s<o;s++){let a=e[s],c=this.morphTargetsRelative;for(let l=0,d=a.count;l<d;l++)$e.fromBufferAttribute(a,l),c&&(qr.fromBufferAttribute(t,l),$e.add(qr)),r=Math.max(r,n.distanceToSquared($e))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let I=0;I<n.count;I++)a[I]=new U,c[I]=new U;let l=new U,d=new U,h=new U,p=new Ct,u=new Ct,m=new Ct,x=new U,g=new U;function f(I,b,w){l.fromBufferAttribute(n,I),d.fromBufferAttribute(n,b),h.fromBufferAttribute(n,w),p.fromBufferAttribute(s,I),u.fromBufferAttribute(s,b),m.fromBufferAttribute(s,w),d.sub(l),h.sub(l),u.sub(p),m.sub(p);let P=1/(u.x*m.y-m.x*u.y);isFinite(P)&&(x.copy(d).multiplyScalar(m.y).addScaledVector(h,-u.y).multiplyScalar(P),g.copy(h).multiplyScalar(u.x).addScaledVector(d,-m.x).multiplyScalar(P),a[I].add(x),a[b].add(x),a[w].add(x),c[I].add(g),c[b].add(g),c[w].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let I=0,b=M.length;I<b;++I){let w=M[I],P=w.start,k=w.count;for(let G=P,N=P+k;G<N;G+=3)f(t.getX(G+0),t.getX(G+1),t.getX(G+2))}let v=new U,y=new U,E=new U,T=new U;function A(I){E.fromBufferAttribute(r,I),T.copy(E);let b=a[I];v.copy(b),v.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(T,b);let P=y.dot(c[I])<0?-1:1;o.setXYZW(I,v.x,v.y,v.z,P)}for(let I=0,b=M.length;I<b;++I){let w=M[I],P=w.start,k=w.count;for(let G=P,N=P+k;G<N;G+=3)A(t.getX(G+0)),A(t.getX(G+1)),A(t.getX(G+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new hn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,u=n.count;p<u;p++)n.setXYZ(p,0,0,0);let r=new U,s=new U,o=new U,a=new U,c=new U,l=new U,d=new U,h=new U;if(t)for(let p=0,u=t.count;p<u;p+=3){let m=t.getX(p+0),x=t.getX(p+1),g=t.getX(p+2);r.fromBufferAttribute(e,m),s.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),a.add(d),c.add(d),l.add(d),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let p=0,u=e.count;p<u;p+=3)r.fromBufferAttribute(e,p+0),s.fromBufferAttribute(e,p+1),o.fromBufferAttribute(e,p+2),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),n.setXYZ(p+0,d.x,d.y,d.z),n.setXYZ(p+1,d.x,d.y,d.z),n.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)$e.fromBufferAttribute(t,e),$e.normalize(),t.setXYZ(e,$e.x,$e.y,$e.z)}toNonIndexed(){function t(a,c){let l=a.array,d=a.itemSize,h=a.normalized,p=new l.constructor(c.length*d),u=0,m=0;for(let x=0,g=c.length;x<g;x++){a.isInterleavedBufferAttribute?u=c[x]*a.data.stride+a.offset:u=c[x]*d;for(let f=0;f<d;f++)p[m++]=l[u++]}return new hn(p,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,r=this.attributes;for(let a in r){let c=r[a],l=t(c,n);e.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let d=0,h=l.length;d<h;d++){let p=l[d],u=t(p,n);c.push(u)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let r={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],d=[];for(let h=0,p=l.length;h<p;h++){let u=l[h];d.push(u.toJSON(t.data))}d.length>0&&(r[c]=d,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let r=t.attributes;for(let l in r){let d=r[l];this.setAttribute(l,d.clone(e))}let s=t.morphAttributes;for(let l in s){let d=[],h=s[l];for(let p=0,u=h.length;p<u;p++)d.push(h[p].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,d=o.length;l<d;l++){let h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Jd=new _e,dr=new Gi,oa=new Vi,Kd=new U,aa=new U,la=new U,ca=new U,eh=new U,ha=new U,Qd=new U,da=new U,ve=class extends Xe{constructor(t=new Be,e=new qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);let a=this.morphTargetInfluences;if(s&&a){ha.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let d=a[c],h=s[c];d!==0&&(eh.fromBufferAttribute(h,t),o?ha.addScaledVector(eh,d):ha.addScaledVector(eh.sub(e),d))}e.add(ha)}return e}raycast(t,e){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(s),dr.copy(t.ray).recast(t.near),!(oa.containsPoint(dr.origin)===!1&&(dr.intersectSphere(oa,Kd)===null||dr.origin.distanceToSquared(Kd)>(t.far-t.near)**2))&&(Jd.copy(s).invert(),dr.copy(t.ray).applyMatrix4(Jd),!(n.boundingBox!==null&&dr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,dr)))}_computeIntersections(t,e,n){let r,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,p=s.groups,u=s.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=p.length;m<x;m++){let g=p[m],f=o[g.materialIndex],M=Math.max(g.start,u.start),v=Math.min(a.count,Math.min(g.start+g.count,u.start+u.count));for(let y=M,E=v;y<E;y+=3){let T=a.getX(y),A=a.getX(y+1),I=a.getX(y+2);r=pa(this,f,t,n,l,d,h,T,A,I),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{let m=Math.max(0,u.start),x=Math.min(a.count,u.start+u.count);for(let g=m,f=x;g<f;g+=3){let M=a.getX(g),v=a.getX(g+1),y=a.getX(g+2);r=pa(this,o,t,n,l,d,h,M,v,y),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,x=p.length;m<x;m++){let g=p[m],f=o[g.materialIndex],M=Math.max(g.start,u.start),v=Math.min(c.count,Math.min(g.start+g.count,u.start+u.count));for(let y=M,E=v;y<E;y+=3){let T=y,A=y+1,I=y+2;r=pa(this,f,t,n,l,d,h,T,A,I),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{let m=Math.max(0,u.start),x=Math.min(c.count,u.start+u.count);for(let g=m,f=x;g<f;g+=3){let M=g,v=g+1,y=g+2;r=pa(this,o,t,n,l,d,h,M,v,y),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}};function sm(i,t,e,n,r,s,o,a){let c;if(t.side===dn?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,t.side===wi,a),c===null)return null;da.copy(a),da.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(da);return l<e.near||l>e.far?null:{distance:l,point:da.clone(),object:i}}function pa(i,t,e,n,r,s,o,a,c,l){i.getVertexPosition(a,aa),i.getVertexPosition(c,la),i.getVertexPosition(l,ca);let d=sm(i,t,e,n,aa,la,ca,Qd);if(d){let h=new U;yi.getBarycoord(Qd,aa,la,ca,h),r&&(d.uv=yi.getInterpolatedAttribute(r,a,c,l,h,new Ct)),s&&(d.uv1=yi.getInterpolatedAttribute(s,a,c,l,h,new Ct)),o&&(d.normal=yi.getInterpolatedAttribute(o,a,c,l,h,new U),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let p={a,b:c,c:l,normal:new U,materialIndex:0};yi.getNormal(aa,la,ca,p.normal),d.face=p,d.barycoord=h}return d}var is=class i extends Be{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],d=[],h=[],p=0,u=0;m("z","y","x",-1,-1,n,e,t,o,s,0),m("z","y","x",1,-1,n,e,-t,o,s,1),m("x","z","y",1,1,t,n,e,r,o,2),m("x","z","y",1,-1,t,n,-e,r,o,3),m("x","y","z",1,-1,t,e,n,r,s,4),m("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new ue(l,3)),this.setAttribute("normal",new ue(d,3)),this.setAttribute("uv",new ue(h,2));function m(x,g,f,M,v,y,E,T,A,I,b){let w=y/A,P=E/I,k=y/2,G=E/2,N=T/2,L=A+1,O=I+1,W=0,z=0,Q=new U;for(let nt=0;nt<O;nt++){let ht=nt*P-G;for(let dt=0;dt<L;dt++){let zt=dt*w-k;Q[x]=zt*M,Q[g]=ht*v,Q[f]=N,l.push(Q.x,Q.y,Q.z),Q[x]=0,Q[g]=0,Q[f]=T>0?1:-1,d.push(Q.x,Q.y,Q.z),h.push(dt/A),h.push(1-nt/I),W+=1}}for(let nt=0;nt<I;nt++)for(let ht=0;ht<A;ht++){let dt=p+ht+L*nt,zt=p+ht+L*(nt+1),Vt=p+(ht+1)+L*(nt+1),yt=p+(ht+1)+L*nt;c.push(dt,zt,yt),c.push(zt,Vt,yt),z+=6}a.addGroup(u,z,b),u+=z,p+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Mr(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function nn(i){let t={};for(let e=0;e<i.length;e++){let n=Mr(i[e]);for(let r in n)t[r]=n[r]}return t}function om(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Oh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}var Yn={clone:Mr,merge:nn},am=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ce=class extends ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=am,this.fragmentShader=lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Mr(t.uniforms),this.uniformsGroups=om(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},$s=class extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _e,this.projectionMatrix=new _e,this.projectionMatrixInverse=new _e,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Bi=new U,tp=new Ct,ep=new Ct,tn=class extends $s{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ts*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Jr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Jr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bi.x,Bi.y).multiplyScalar(-t/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bi.x,Bi.y).multiplyScalar(-t/Bi.z)}getViewSize(t,e){return this.getViewBounds(t,tp,ep),e.subVectors(ep,tp)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Jr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,e-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Yr=-90,Zr=1,Da=class extends Xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new tn(Yr,Zr,t,e);r.layers=this.layers,this.add(r);let s=new tn(Yr,Zr,t,e);s.layers=this.layers,this.add(s);let o=new tn(Yr,Zr,t,e);o.layers=this.layers,this.add(o);let a=new tn(Yr,Zr,t,e);a.layers=this.layers,this.add(a);let c=new tn(Yr,Zr,t,e);c.layers=this.layers,this.add(c);let l=new tn(Yr,Zr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,c]=e;for(let l of e)this.remove(l);if(t===zn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Os)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,d]=this.children,h=t.getRenderTarget(),p=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,r),t.render(e,d),t.setRenderTarget(h,p,u),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Xs=class extends mn{constructor(t=[],e=_r,n,r,s,o,a,c,l,d){super(t,e,n,r,s,o,a,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ua=class extends en{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Xs(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new is(5,5,5),s=new Ce({name:"CubemapFromEquirect",uniforms:Mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:$n});s.uniforms.tEquirect.value=e;let o=new ve(r,s),a=e.minFilter;return e.minFilter===ji&&(e.minFilter=Vn),new Da(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){let s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}},Hn=class extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}},cm={type:"move"},rs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,n),f=this._getHandJoint(l,x);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],p=d.position.distanceTo(h.position),u=.02,m=.005;l.inputState.pinching&&p>u+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=u-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(cm)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Hn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},qs=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Dt(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Ys=class extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gn,this.environmentIntensity=1,this.environmentRotation=new Gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var nh=new U,hm=new U,dm=new Yt,In=class{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let r=nh.subVectors(n,e).cross(hm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(nh),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||dm.getNormalMatrix(t),r=this.coplanarPoint(nh).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},pr=new Vi,pm=new Ct(.5,.5),ua=new U,ss=class{constructor(t=new In,e=new In,n=new In,r=new In,s=new In,o=new In){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=zn,n=!1){let r=this.planes,s=t.elements,o=s[0],a=s[1],c=s[2],l=s[3],d=s[4],h=s[5],p=s[6],u=s[7],m=s[8],x=s[9],g=s[10],f=s[11],M=s[12],v=s[13],y=s[14],E=s[15];if(r[0].setComponents(l-o,u-d,f-m,E-M).normalize(),r[1].setComponents(l+o,u+d,f+m,E+M).normalize(),r[2].setComponents(l+a,u+h,f+x,E+v).normalize(),r[3].setComponents(l-a,u-h,f-x,E-v).normalize(),n)r[4].setComponents(c,p,g,y).normalize(),r[5].setComponents(l-c,u-p,f-g,E-y).normalize();else if(r[4].setComponents(l-c,u-p,f-g,E-y).normalize(),e===zn)r[5].setComponents(l+c,u+p,f+g,E+y).normalize();else if(e===Os)r[5].setComponents(c,p,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),pr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),pr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(pr)}intersectsSprite(t){pr.center.set(0,0,0);let e=pm.distanceTo(t.center);return pr.radius=.7071067811865476+e,pr.applyMatrix4(t.matrixWorld),this.intersectsSphere(pr)}intersectsSphere(t){let e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let r=e[n];if(ua.x=r.normal.x>0?t.max.x:t.min.x,ua.y=r.normal.y>0?t.max.y:t.min.y,ua.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(ua)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var wn=class extends ii{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Dt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Fa=new U,Na=new U,np=new _e,Ds=new Gi,fa=new Vi,ih=new U,ip=new U,os=class extends Xe{constructor(t=new Be,e=new wn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let r=1,s=e.count;r<s;r++)Fa.fromBufferAttribute(e,r-1),Na.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=Fa.distanceTo(Na);t.setAttribute("lineDistance",new ue(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(r),fa.radius+=s,t.ray.intersectsSphere(fa)===!1)return;np.copy(r).invert(),Ds.copy(t.ray).applyMatrix4(np);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,d=n.index,p=n.attributes.position;if(d!==null){let u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let x=u,g=m-1;x<g;x+=l){let f=d.getX(x),M=d.getX(x+1),v=ma(this,t,Ds,c,f,M,x);v&&e.push(v)}if(this.isLineLoop){let x=d.getX(m-1),g=d.getX(u),f=ma(this,t,Ds,c,x,g,m-1);f&&e.push(f)}}else{let u=Math.max(0,o.start),m=Math.min(p.count,o.start+o.count);for(let x=u,g=m-1;x<g;x+=l){let f=ma(this,t,Ds,c,x,x+1,x);f&&e.push(f)}if(this.isLineLoop){let x=ma(this,t,Ds,c,m-1,u,m-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function ma(i,t,e,n,r,s,o){let a=i.geometry.attributes.position;if(Fa.fromBufferAttribute(a,r),Na.fromBufferAttribute(a,s),e.distanceSqToSegment(Fa,Na,ih,ip)>n)return;ih.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ih);if(!(l<t.near||l>t.far))return{distance:l,point:ip.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var rp=new U,sp=new U,Wn=class extends os{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let r=0,s=e.count;r<s;r+=2)rp.fromBufferAttribute(e,r),sp.fromBufferAttribute(e,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+rp.distanceTo(sp);t.setAttribute("lineDistance",new ue(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Ba=class extends ii{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},op=new _e,fh=new Gi,ga=new Vi,xa=new U,Zs=class extends Xe{constructor(t=new Be,e=new Ba){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ga.copy(n.boundingSphere),ga.applyMatrix4(r),ga.radius+=s,t.ray.intersectsSphere(ga)===!1)return;op.copy(r).invert(),fh.copy(t.ray).applyMatrix4(op);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){let p=Math.max(0,o.start),u=Math.min(l.count,o.start+o.count);for(let m=p,x=u;m<x;m++){let g=l.getX(m);xa.fromBufferAttribute(h,g),ap(xa,g,c,r,t,e,this)}}else{let p=Math.max(0,o.start),u=Math.min(h.count,o.start+o.count);for(let m=p,x=u;m<x;m++)xa.fromBufferAttribute(h,m),ap(xa,m,c,r,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function ap(i,t,e,n,r,s,o){let a=fh.distanceSqToPoint(i);if(a<e){let c=new U;fh.closestPointToPoint(i,c),c.applyMatrix4(n);let l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var js=class extends mn{constructor(t,e,n,r,s,o,a,c,l){super(t,e,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Js=class extends mn{constructor(t,e,n=Ji,r,s,o,a=Pn,c=Pn,l,d=Qr,h=1){if(d!==Qr&&d!==ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let p={width:t,height:e,depth:h};super(p,r,s,o,a,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ns(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Ks=class extends mn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Qs=class i extends Be{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};let l=this;r=Math.floor(r),s=Math.floor(s);let d=[],h=[],p=[],u=[],m=0,x=[],g=n/2,f=0;M(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new ue(h,3)),this.setAttribute("normal",new ue(p,3)),this.setAttribute("uv",new ue(u,2));function M(){let y=new U,E=new U,T=0,A=(e-t)/n;for(let I=0;I<=s;I++){let b=[],w=I/s,P=w*(e-t)+t;for(let k=0;k<=r;k++){let G=k/r,N=G*c+a,L=Math.sin(N),O=Math.cos(N);E.x=P*L,E.y=-w*n+g,E.z=P*O,h.push(E.x,E.y,E.z),y.set(L,A,O).normalize(),p.push(y.x,y.y,y.z),u.push(G,1-w),b.push(m++)}x.push(b)}for(let I=0;I<r;I++)for(let b=0;b<s;b++){let w=x[b][I],P=x[b+1][I],k=x[b+1][I+1],G=x[b][I+1];(t>0||b!==0)&&(d.push(w,P,G),T+=3),(e>0||b!==s-1)&&(d.push(P,k,G),T+=3)}l.addGroup(f,T,0),f+=T}function v(y){let E=m,T=new Ct,A=new U,I=0,b=y===!0?t:e,w=y===!0?1:-1;for(let k=1;k<=r;k++)h.push(0,g*w,0),p.push(0,w,0),u.push(.5,.5),m++;let P=m;for(let k=0;k<=r;k++){let N=k/r*c+a,L=Math.cos(N),O=Math.sin(N);A.x=b*O,A.y=g*w,A.z=b*L,h.push(A.x,A.y,A.z),p.push(0,w,0),T.x=L*.5+.5,T.y=O*.5*w+.5,u.push(T.x,T.y),m++}for(let k=0;k<r;k++){let G=E+k,N=P+k;y===!0?d.push(N,N+1,G):d.push(N+1,N,G),I+=3}l.addGroup(f,I,y===!0?1:2),f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ba=new U,va=new U,rh=new U,ya=new yi,to=class extends Be{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let r=Math.pow(10,4),s=Math.cos(Jr*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],d=["a","b","c"],h=new Array(3),p={},u=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);let{a:x,b:g,c:f}=ya;if(x.fromBufferAttribute(a,l[0]),g.fromBufferAttribute(a,l[1]),f.fromBufferAttribute(a,l[2]),ya.getNormal(rh),h[0]=`${Math.round(x.x*r)},${Math.round(x.y*r)},${Math.round(x.z*r)}`,h[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,h[2]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let M=0;M<3;M++){let v=(M+1)%3,y=h[M],E=h[v],T=ya[d[M]],A=ya[d[v]],I=`${y}_${E}`,b=`${E}_${y}`;b in p&&p[b]?(rh.dot(p[b].normal)<=s&&(u.push(T.x,T.y,T.z),u.push(A.x,A.y,A.z)),p[b]=null):I in p||(p[I]={index0:l[M],index1:l[v],normal:rh.clone()})}}for(let m in p)if(p[m]){let{index0:x,index1:g}=p[m];ba.fromBufferAttribute(a,x),va.fromBufferAttribute(a,g),u.push(ba.x,ba.y,ba.z),u.push(va.x,va.y,va.z)}this.setAttribute("position",new ue(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}},Oa=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),r=0,s=n.length,o;e?o=e:o=t*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=n[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===o)return r/(s-1);let d=n[r],p=n[r+1]-d,u=(o-d)/p;return(r+u)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),c=e||(o.isVector2?new Ct:new U);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new U,r=[],s=[],o=[],a=new U,c=new _e;for(let u=0;u<=t;u++){let m=u/t;r[u]=this.getTangentAt(m,new U)}s[0]=new U,o[0]=new U;let l=Number.MAX_VALUE,d=Math.abs(r[0].x),h=Math.abs(r[0].y),p=Math.abs(r[0].z);d<=l&&(l=d,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),p<=l&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),a.crossVectors(r[u-1],r[u]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(Zt(r[u-1].dot(r[u]),-1,1));s[u].applyMatrix4(c.makeRotationAxis(a,m))}o[u].crossVectors(r[u],s[u])}if(e===!0){let u=Math.acos(Zt(s[0].dot(s[t]),-1,1));u/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(u=-u);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(r[m],u*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}};function zh(){let i=0,t=0,e=0,n=0;function r(s,o,a,c){i=s,t=a,e=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,d,h){let p=(o-s)/l-(a-s)/(l+d)+(a-o)/d,u=(a-o)/d-(c-o)/(d+h)+(c-a)/h;p*=d,u*=d,r(o,a,p,u)},calc:function(s){let o=s*s,a=o*s;return i+t*s+e*o+n*a}}}var _a=new U,sh=new zh,oh=new zh,ah=new zh,eo=class extends Oa{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new U){let n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,d;this.closed||a>0?l=r[(a-1)%s]:(_a.subVectors(r[0],r[1]).add(r[0]),l=_a);let h=r[a%s],p=r[(a+1)%s];if(this.closed||a+2<s?d=r[(a+2)%s]:(_a.subVectors(r[s-1],r[s-2]).add(r[s-1]),d=_a),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(h),u),x=Math.pow(h.distanceToSquared(p),u),g=Math.pow(p.distanceToSquared(d),u);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),sh.initNonuniformCatmullRom(l.x,h.x,p.x,d.x,m,x,g),oh.initNonuniformCatmullRom(l.y,h.y,p.y,d.y,m,x,g),ah.initNonuniformCatmullRom(l.z,h.z,p.z,d.z,m,x,g)}else this.curveType==="catmullrom"&&(sh.initCatmullRom(l.x,h.x,p.x,d.x,this.tension),oh.initCatmullRom(l.y,h.y,p.y,d.y,this.tension),ah.initCatmullRom(l.z,h.z,p.z,d.z,this.tension));return n.set(sh.calc(c),oh.calc(c),ah.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(new U().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function um(i,t,e=2){let n=t&&t.length,r=n?t[0]*e:i.length,s=jp(i,0,r,e,!0),o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(n&&(s=bm(i,t,s,e)),i.length>80*e){a=1/0,c=1/0;let d=-1/0,h=-1/0;for(let p=e;p<r;p+=e){let u=i[p],m=i[p+1];u<a&&(a=u),m<c&&(c=m),u>d&&(d=u),m>h&&(h=m)}l=Math.max(d-a,h-c),l=l!==0?32767/l:0}return no(s,o,e,a,c,l,0),o}function jp(i,t,e,n,r){let s;if(r===Cm(i,t,e,n)>0)for(let o=t;o<e;o+=n)s=lp(o/n|0,i[o],i[o+1],s);else for(let o=e-n;o>=t;o-=n)s=lp(o/n|0,i[o],i[o+1],s);return s&&as(s,s.next)&&(ro(s),s=s.next),s}function gr(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(as(e,e.next)||Re(e.prev,e,e.next)===0)){if(ro(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function no(i,t,e,n,r,s,o){if(!i)return;!o&&s&&Mm(i,n,r,s);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(s?mm(i,n,r,s):fm(i)){t.push(c.i,i.i,l.i),ro(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=gm(gr(i),t),no(i,t,e,n,r,s,2)):o===2&&xm(i,t,e,n,r,s):no(gr(i),t,e,n,r,s,1);break}}}function fm(i){let t=i.prev,e=i,n=i.next;if(Re(t,e,n)>=0)return!1;let r=t.x,s=e.x,o=n.x,a=t.y,c=e.y,l=n.y,d=Math.min(r,s,o),h=Math.min(a,c,l),p=Math.max(r,s,o),u=Math.max(a,c,l),m=n.next;for(;m!==t;){if(m.x>=d&&m.x<=p&&m.y>=h&&m.y<=u&&Us(r,a,s,c,o,l,m.x,m.y)&&Re(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function mm(i,t,e,n){let r=i.prev,s=i,o=i.next;if(Re(r,s,o)>=0)return!1;let a=r.x,c=s.x,l=o.x,d=r.y,h=s.y,p=o.y,u=Math.min(a,c,l),m=Math.min(d,h,p),x=Math.max(a,c,l),g=Math.max(d,h,p),f=mh(u,m,t,e,n),M=mh(x,g,t,e,n),v=i.prevZ,y=i.nextZ;for(;v&&v.z>=f&&y&&y.z<=M;){if(v.x>=u&&v.x<=x&&v.y>=m&&v.y<=g&&v!==r&&v!==o&&Us(a,d,c,h,l,p,v.x,v.y)&&Re(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=u&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==o&&Us(a,d,c,h,l,p,y.x,y.y)&&Re(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=f;){if(v.x>=u&&v.x<=x&&v.y>=m&&v.y<=g&&v!==r&&v!==o&&Us(a,d,c,h,l,p,v.x,v.y)&&Re(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=M;){if(y.x>=u&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==o&&Us(a,d,c,h,l,p,y.x,y.y)&&Re(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function gm(i,t){let e=i;do{let n=e.prev,r=e.next.next;!as(n,r)&&Kp(n,e,e.next,r)&&io(n,r)&&io(r,n)&&(t.push(n.i,e.i,r.i),ro(e),ro(e.next),e=i=r),e=e.next}while(e!==i);return gr(e)}function xm(i,t,e,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Tm(o,a)){let c=Qp(o,a);o=gr(o,o.next),c=gr(c,c.next),no(o,t,e,n,r,s,0),no(c,t,e,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function bm(i,t,e,n){let r=[];for(let s=0,o=t.length;s<o;s++){let a=t[s]*n,c=s<o-1?t[s+1]*n:i.length,l=jp(i,a,c,n,!1);l===l.next&&(l.steiner=!0),r.push(Em(l))}r.sort(vm);for(let s=0;s<r.length;s++)e=ym(r[s],e);return e}function vm(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function ym(i,t){let e=_m(i,t);if(!e)return t;let n=Qp(e,i);return gr(n,n.next),gr(e,e.next)}function _m(i,t){let e=t,n=i.x,r=i.y,s=-1/0,o;if(as(i,e))return e;do{if(as(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){let h=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>s&&(s=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,c=o.x,l=o.y,d=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Jp(r<l?n:s,r,c,l,r<l?s:n,r,e.x,e.y)){let h=Math.abs(r-e.y)/(n-e.x);io(e,i)&&(h<d||h===d&&(e.x>o.x||e.x===o.x&&wm(o,e)))&&(o=e,d=h)}e=e.next}while(e!==a);return o}function wm(i,t){return Re(i.prev,i,t.prev)<0&&Re(t.next,i,i.next)<0}function Mm(i,t,e,n){let r=i;do r.z===0&&(r.z=mh(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,Sm(r)}function Sm(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(r=n,n=n.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=o}s.nextZ=null,e*=2}while(t>1);return i}function mh(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Em(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Jp(i,t,e,n,r,s,o,a){return(r-o)*(t-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(n-a)}function Us(i,t,e,n,r,s,o,a){return!(i===o&&t===a)&&Jp(i,t,e,n,r,s,o,a)}function Tm(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Am(i,t)&&(io(i,t)&&io(t,i)&&Rm(i,t)&&(Re(i.prev,i,t.prev)||Re(i,t.prev,t))||as(i,t)&&Re(i.prev,i,i.next)>0&&Re(t.prev,t,t.next)>0)}function Re(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function as(i,t){return i.x===t.x&&i.y===t.y}function Kp(i,t,e,n){let r=Ma(Re(i,t,e)),s=Ma(Re(i,t,n)),o=Ma(Re(e,n,i)),a=Ma(Re(e,n,t));return!!(r!==s&&o!==a||r===0&&wa(i,e,t)||s===0&&wa(i,n,t)||o===0&&wa(e,i,n)||a===0&&wa(e,t,n))}function wa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ma(i){return i>0?1:i<0?-1:0}function Am(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Kp(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function io(i,t){return Re(i.prev,i,i.next)<0?Re(i,t,i.next)>=0&&Re(i,i.prev,t)>=0:Re(i,t,i.prev)<0||Re(i,i.next,t)<0}function Rm(i,t){let e=i,n=!1,r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Qp(i,t){let e=gh(i.i,i.x,i.y),n=gh(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function lp(i,t,e,n){let r=gh(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function ro(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function gh(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Cm(i,t,e,n){let r=0;for(let s=t,o=e-n;s<e;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}var xh=class{static triangulate(t,e,n=2){return um(t,e,n)}},ls=class i{static area(t){let e=t.length,n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],r=[],s=[];cp(t),hp(n,t);let o=t.length;e.forEach(cp);for(let c=0;c<e.length;c++)r.push(o),o+=e[c].length,hp(n,e[c]);let a=xh.triangulate(n,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}};function cp(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function hp(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Wi=class i extends Be{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};let s=t/2,o=e/2,a=Math.floor(n),c=Math.floor(r),l=a+1,d=c+1,h=t/a,p=e/c,u=[],m=[],x=[],g=[];for(let f=0;f<d;f++){let M=f*p-o;for(let v=0;v<l;v++){let y=v*h-s;m.push(y,-M,0),x.push(0,0,1),g.push(v/a),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let M=0;M<a;M++){let v=M+l*f,y=M+l*(f+1),E=M+1+l*(f+1),T=M+1+l*f;u.push(v,y,T),u.push(y,E,T)}this.setIndex(u),this.setAttribute("position",new ue(m,3)),this.setAttribute("normal",new ue(x,3)),this.setAttribute("uv",new ue(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var so=class extends Ce{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var xr=class extends ii{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dh,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=sl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},za=class extends ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Np,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ha=class extends ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Sa(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Im(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var br=class{constructor(t,e,n,r){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,r=e[n],s=e[n-1];n:{t:{let o;e:{i:if(!(t<r)){for(let a=n+2;;){if(r===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=e[++n],t<r)break t}o=e.length;break e}if(!(t>=s)){let a=e[1];t<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(r=s,s=e[--n-1],t>=s)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(r=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,t,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=t*r;for(let o=0;o!==r;++o)e[o]=n[s+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Va=class extends br{constructor(t,e,n,r){super(t,e,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ch,endingEnd:ch}}intervalChanged_(t,e,n){let r=this.parameterPositions,s=t-2,o=t+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case hh:s=t,a=2*e-n;break;case dh:s=r.length-2,a=e+r[s]-r[s+1];break;default:s=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case hh:o=t,c=2*n-e;break;case dh:o=1,c=n+r[1]-r[0];break;default:o=t-1,c=e}let l=(n-e)*.5,d=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=s*d,this._offsetNext=o*d}interpolate_(t,e,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,d=this._offsetPrev,h=this._offsetNext,p=this._weightPrev,u=this._weightNext,m=(n-e)/(r-e),x=m*m,g=x*m,f=-p*g+2*p*x-p*m,M=(1+p)*g+(-1.5-2*p)*x+(-.5+p)*m+1,v=(-1-u)*g+(1.5+u)*x+.5*m,y=u*g-u*x;for(let E=0;E!==a;++E)s[E]=f*o[d+E]+M*o[l+E]+v*o[c+E]+y*o[h+E];return s}},Ga=class extends br{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t,e,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,d=(n-e)/(r-e),h=1-d;for(let p=0;p!==a;++p)s[p]=o[l+p]*h+o[c+p]*d;return s}},Wa=class extends br{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t){return this.copySampleValue_(t-1)}},Mn=class{constructor(t,e,n,r){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Sa(e,this.TimeBufferType),this.values=Sa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Sa(t.times,Array),values:Sa(t.values,Array)};let r=t.getInterpolation();r!==t.DefaultInterpolation&&(n.interpolation=r)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Wa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ga(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Va(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Ns:e=this.InterpolantFactoryMethodDiscrete;break;case Ia:e=this.InterpolantFactoryMethodLinear;break;case Ea:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ns;case this.InterpolantFactoryMethodLinear:return Ia;case this.InterpolantFactoryMethodSmooth:return Ea}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,r=e.length;n!==r;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,r=e.length;n!==r;++n)e[n]*=t}return this}trim(t,e){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<t;)++s;for(;o!==-1&&n[o]>e;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==s;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(r!==void 0&&Im(r))for(let a=0,c=r.length;a!==c;++a){let l=r[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ea,s=t.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=t[a],d=t[a+1];if(l!==d&&(a!==1||l!==t[0]))if(r)c=!0;else{let h=a*n,p=h-n,u=h+n;for(let m=0;m!==n;++m){let x=e[h+m];if(x!==e[p+m]||x!==e[u+m]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let h=a*n,p=o*n;for(let u=0;u!==n;++u)e[p+u]=e[h+u]}++o}}if(s>0){t[o]=t[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,r=new n(this.name,t,e);return r.createInterpolant=this.createInterpolant,r}};Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=Ia;var $i=class extends Mn{constructor(t,e,n){super(t,e,n)}};$i.prototype.ValueTypeName="bool";$i.prototype.ValueBufferType=Array;$i.prototype.DefaultInterpolation=Ns;$i.prototype.InterpolantFactoryMethodLinear=void 0;$i.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends Mn{constructor(t,e,n,r){super(t,e,n,r)}};$a.prototype.ValueTypeName="color";var Xa=class extends Mn{constructor(t,e,n,r){super(t,e,n,r)}};Xa.prototype.ValueTypeName="number";var qa=class extends br{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t,e,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(r-e),l=t*a;for(let d=l+a;l!==d;l+=4)fn.slerpFlat(s,0,o,l-a,o,l,c);return s}},oo=class extends Mn{constructor(t,e,n,r){super(t,e,n,r)}InterpolantFactoryMethodLinear(t){return new qa(this.times,this.values,this.getValueSize(),t)}};oo.prototype.ValueTypeName="quaternion";oo.prototype.InterpolantFactoryMethodSmooth=void 0;var Xi=class extends Mn{constructor(t,e,n){super(t,e,n)}};Xi.prototype.ValueTypeName="string";Xi.prototype.ValueBufferType=Array;Xi.prototype.DefaultInterpolation=Ns;Xi.prototype.InterpolantFactoryMethodLinear=void 0;Xi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ya=class extends Mn{constructor(t,e,n,r){super(t,e,n,r)}};Ya.prototype.ValueTypeName="vector";var Za=class{constructor(t,e,n){let r=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){a++,s===!1&&r.onStart!==void 0&&r.onStart(d,o,a),s=!0},this.itemEnd=function(d){o++,r.onProgress!==void 0&&r.onProgress(d,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(d){r.onError!==void 0&&r.onError(d)},this.resolveURL=function(d){return c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,h){return l.push(d,h),this},this.removeHandler=function(d){let h=l.indexOf(d);return h!==-1&&l.splice(h,2),this},this.getHandler=function(d){for(let h=0,p=l.length;h<p;h+=2){let u=l[h],m=l[h+1];if(u.global&&(u.lastIndex=0),u.test(d))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},tu=new Za,ja=class{constructor(t){this.manager=t!==void 0?t:tu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(r,s){n.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ja.DEFAULT_MATERIAL_NAME="__DEFAULT";var ao=class extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Dt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},lo=class extends ao{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Dt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},lh=new _e,dp=new U,pp=new U,bh=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.mapType=Xn,this.map=null,this.mapPass=null,this.matrix=new _e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ss,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;dp.setFromMatrixPosition(t.matrixWorld),e.position.copy(dp),pp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(pp),e.updateMatrixWorld(),lh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(lh,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(lh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var vr=class extends $s{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-t,o=n+t,a=r+e,c=r-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=d*this.view.offsetY,c=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},vh=class extends bh{constructor(){super(new vr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},co=class extends ao{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new vh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Ja=class extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},yr=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};var Hh="\\[\\]\\.:\\/",Pm=new RegExp("["+Hh+"]","g"),Vh="[^"+Hh+"]",km="[^"+Hh.replace("\\.","")+"]",Lm=/((?:WC+[\/:])*)/.source.replace("WC",Vh),Dm=/(WCOD+)?/.source.replace("WCOD",km),Um=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Vh),Fm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Vh),Nm=new RegExp("^"+Lm+Dm+Um+Fm+"$"),Bm=["material","materials","bones","map"],yh=class{constructor(t,e,n){let r=n||Me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,r)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Me=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Pm,"")}static parseTrackName(t){let e=Nm.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Bm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},r=n(t.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)t[e++]=n[r]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,r=e.propertyName,s=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===l){l=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[r];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Me.Composite=yh;Me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Me.prototype.GetterByBindingType=[Me.prototype._getValue_direct,Me.prototype._getValue_array,Me.prototype._getValue_arrayElement,Me.prototype._getValue_toArray];Me.prototype.SetterByBindingTypeAndVersioning=[[Me.prototype._setValue_direct,Me.prototype._setValue_direct_setNeedsUpdate,Me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Me.prototype._setValue_array,Me.prototype._setValue_array_setNeedsUpdate,Me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Me.prototype._setValue_arrayElement,Me.prototype._setValue_arrayElement_setNeedsUpdate,Me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Me.prototype._setValue_fromArray,Me.prototype._setValue_fromArray_setNeedsUpdate,Me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ry=new Float32Array(1);var cs=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Zt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Zt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var ho=class extends Wn{constructor(t=10,e=10,n=4473924,r=8947848){n=new Dt(n),r=new Dt(r);let s=e/2,o=t/e,a=t/2,c=[],l=[];for(let p=0,u=0,m=-a;p<=e;p++,m+=o){c.push(-a,0,m,a,0,m),c.push(m,0,-a,m,0,a);let x=p===s?n:r;x.toArray(l,u),u+=3,x.toArray(l,u),u+=3,x.toArray(l,u),u+=3,x.toArray(l,u),u+=3}let d=new Be;d.setAttribute("position",new ue(c,3)),d.setAttribute("color",new ue(l,3));let h=new wn({vertexColors:!0,toneMapped:!1});super(d,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var po=class extends ni{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Gh(i,t,e,n){let r=Om(n);switch(e){case Ih:return i*t;case kh:return i*t/r.components*r.byteLength;case vl:return i*t/r.components*r.byteLength;case Lh:return i*t*2/r.components*r.byteLength;case yl:return i*t*2/r.components*r.byteLength;case Ph:return i*t*3/r.components*r.byteLength;case Ln:return i*t*4/r.components*r.byteLength;case _l:return i*t*4/r.components*r.byteLength;case mo:case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xo:case bo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ml:case El:return Math.max(i,16)*Math.max(t,8)/4;case wl:case Sl:return Math.max(i,8)*Math.max(t,8)/2;case Tl:case Al:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Rl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Il:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case kl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case zl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Hl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Gl:case Wl:case $l:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Xl:case ql:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Yl:case Zl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Om(i){switch(i){case Xn:case Th:return{byteLength:1,components:1};case hs:case Ah:case kn:return{byteLength:2,components:1};case xl:case bl:return{byteLength:2,components:4};case Ji:case gl:case si:return{byteLength:4,components:1};case Rh:case Ch:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Su(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function qm(i){let t=new WeakMap;function e(a,c){let l=a.array,d=a.usage,h=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,d),a.onUploadCallback();let u;if(l instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)u=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=i.SHORT;else if(l instanceof Uint32Array)u=i.UNSIGNED_INT;else if(l instanceof Int32Array)u=i.INT;else if(l instanceof Int8Array)u=i.BYTE;else if(l instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){let d=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,d);else{h.sort((u,m)=>u.start-m.start);let p=0;for(let u=1;u<h.length;u++){let m=h[p],x=h[u];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++p,h[p]=x)}h.length=p+1;for(let u=0,m=h.length;u<m;u++){let x=h[u];i.bufferSubData(l,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let d=t.get(a);(!d||d.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var Ym=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,jm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Km=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,eg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ng=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ig=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,og=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ag=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,dg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ug=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,xg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,bg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,vg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,yg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_g=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Eg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ag=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Rg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ig=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ug=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ng=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Og=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,zg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Vg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$g=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,t0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,e0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,n0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,i0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,r0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,s0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,o0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,a0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,l0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,h0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,d0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,p0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,u0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,m0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,g0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,x0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,b0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,v0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,y0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,w0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,M0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,S0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,E0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,T0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,A0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,R0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,C0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,I0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,P0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,k0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,L0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,D0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,U0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,F0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,N0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,B0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,O0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,z0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,H0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,V0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,G0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,W0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,X0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,q0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Y0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,j0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,K0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ex=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ix=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ox=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ax=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,px=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ux=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,bx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_x=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ex=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jt={alphahash_fragment:Ym,alphahash_pars_fragment:Zm,alphamap_fragment:jm,alphamap_pars_fragment:Jm,alphatest_fragment:Km,alphatest_pars_fragment:Qm,aomap_fragment:tg,aomap_pars_fragment:eg,batching_pars_vertex:ng,batching_vertex:ig,begin_vertex:rg,beginnormal_vertex:sg,bsdfs:og,iridescence_fragment:ag,bumpmap_pars_fragment:lg,clipping_planes_fragment:cg,clipping_planes_pars_fragment:hg,clipping_planes_pars_vertex:dg,clipping_planes_vertex:pg,color_fragment:ug,color_pars_fragment:fg,color_pars_vertex:mg,color_vertex:gg,common:xg,cube_uv_reflection_fragment:bg,defaultnormal_vertex:vg,displacementmap_pars_vertex:yg,displacementmap_vertex:_g,emissivemap_fragment:wg,emissivemap_pars_fragment:Mg,colorspace_fragment:Sg,colorspace_pars_fragment:Eg,envmap_fragment:Tg,envmap_common_pars_fragment:Ag,envmap_pars_fragment:Rg,envmap_pars_vertex:Cg,envmap_physical_pars_fragment:zg,envmap_vertex:Ig,fog_vertex:Pg,fog_pars_vertex:kg,fog_fragment:Lg,fog_pars_fragment:Dg,gradientmap_pars_fragment:Ug,lightmap_pars_fragment:Fg,lights_lambert_fragment:Ng,lights_lambert_pars_fragment:Bg,lights_pars_begin:Og,lights_toon_fragment:Hg,lights_toon_pars_fragment:Vg,lights_phong_fragment:Gg,lights_phong_pars_fragment:Wg,lights_physical_fragment:$g,lights_physical_pars_fragment:Xg,lights_fragment_begin:qg,lights_fragment_maps:Yg,lights_fragment_end:Zg,logdepthbuf_fragment:jg,logdepthbuf_pars_fragment:Jg,logdepthbuf_pars_vertex:Kg,logdepthbuf_vertex:Qg,map_fragment:t0,map_pars_fragment:e0,map_particle_fragment:n0,map_particle_pars_fragment:i0,metalnessmap_fragment:r0,metalnessmap_pars_fragment:s0,morphinstance_vertex:o0,morphcolor_vertex:a0,morphnormal_vertex:l0,morphtarget_pars_vertex:c0,morphtarget_vertex:h0,normal_fragment_begin:d0,normal_fragment_maps:p0,normal_pars_fragment:u0,normal_pars_vertex:f0,normal_vertex:m0,normalmap_pars_fragment:g0,clearcoat_normal_fragment_begin:x0,clearcoat_normal_fragment_maps:b0,clearcoat_pars_fragment:v0,iridescence_pars_fragment:y0,opaque_fragment:_0,packing:w0,premultiplied_alpha_fragment:M0,project_vertex:S0,dithering_fragment:E0,dithering_pars_fragment:T0,roughnessmap_fragment:A0,roughnessmap_pars_fragment:R0,shadowmap_pars_fragment:C0,shadowmap_pars_vertex:I0,shadowmap_vertex:P0,shadowmask_pars_fragment:k0,skinbase_vertex:L0,skinning_pars_vertex:D0,skinning_vertex:U0,skinnormal_vertex:F0,specularmap_fragment:N0,specularmap_pars_fragment:B0,tonemapping_fragment:O0,tonemapping_pars_fragment:z0,transmission_fragment:H0,transmission_pars_fragment:V0,uv_pars_fragment:G0,uv_pars_vertex:W0,uv_vertex:$0,worldpos_vertex:X0,background_vert:q0,background_frag:Y0,backgroundCube_vert:Z0,backgroundCube_frag:j0,cube_vert:J0,cube_frag:K0,depth_vert:Q0,depth_frag:tx,distanceRGBA_vert:ex,distanceRGBA_frag:nx,equirect_vert:ix,equirect_frag:rx,linedashed_vert:sx,linedashed_frag:ox,meshbasic_vert:ax,meshbasic_frag:lx,meshlambert_vert:cx,meshlambert_frag:hx,meshmatcap_vert:dx,meshmatcap_frag:px,meshnormal_vert:ux,meshnormal_frag:fx,meshphong_vert:mx,meshphong_frag:gx,meshphysical_vert:xx,meshphysical_frag:bx,meshtoon_vert:vx,meshtoon_frag:yx,points_vert:_x,points_frag:wx,shadow_vert:Mx,shadow_frag:Sx,sprite_vert:Ex,sprite_frag:Tx},gt={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},oi={basic:{uniforms:nn([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:nn([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:nn([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:nn([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:nn([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:nn([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:nn([gt.points,gt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:nn([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:nn([gt.common,gt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:nn([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:nn([gt.sprite,gt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:nn([gt.common,gt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:nn([gt.lights,gt.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};oi.physical={uniforms:nn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var jl={r:0,b:0,g:0},Sr=new Gn,Ax=new _e;function Rx(i,t,e,n,r,s,o){let a=new Dt(0),c=s===!0?0:1,l,d,h=null,p=0,u=null;function m(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?e:t).get(y)),y}function x(v){let y=!1,E=m(v);E===null?f(a,c):E&&E.isColor&&(f(E,1),y=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,y){let E=m(y);E&&(E.isCubeTexture||E.mapping===uo)?(d===void 0&&(d=new ve(new is(1,1,1),new Ce({name:"BackgroundCubeMaterial",uniforms:Mr(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,A,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),Sr.copy(y.backgroundRotation),Sr.x*=-1,Sr.y*=-1,Sr.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Sr.y*=-1,Sr.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Ax.makeRotationFromEuler(Sr)),d.material.toneMapped=te.getTransfer(E.colorSpace)!==oe,(h!==E||p!==E.version||u!==i.toneMapping)&&(d.material.needsUpdate=!0,h=E,p=E.version,u=i.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new ve(new Wi(2,2),new Ce({name:"BackgroundMaterial",uniforms:Mr(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=te.getTransfer(E.colorSpace)!==oe,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||p!==E.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=E,p=E.version,u=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function f(v,y){v.getRGB(jl,Oh(i)),n.buffers.color.setClear(jl.r,jl.g,jl.b,y,o)}function M(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),c=y,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,f(a,c)},render:x,addToRenderList:g,dispose:M}}function Cx(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=p(null),s=r,o=!1;function a(w,P,k,G,N){let L=!1,O=h(G,k,P);s!==O&&(s=O,l(s.object)),L=u(w,G,k,N),L&&m(w,G,k,N),N!==null&&t.update(N,i.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,y(w,P,k,G),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function c(){return i.createVertexArray()}function l(w){return i.bindVertexArray(w)}function d(w){return i.deleteVertexArray(w)}function h(w,P,k){let G=k.wireframe===!0,N=n[w.id];N===void 0&&(N={},n[w.id]=N);let L=N[P.id];L===void 0&&(L={},N[P.id]=L);let O=L[G];return O===void 0&&(O=p(c()),L[G]=O),O}function p(w){let P=[],k=[],G=[];for(let N=0;N<e;N++)P[N]=0,k[N]=0,G[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:G,object:w,attributes:{},index:null}}function u(w,P,k,G){let N=s.attributes,L=P.attributes,O=0,W=k.getAttributes();for(let z in W)if(W[z].location>=0){let nt=N[z],ht=L[z];if(ht===void 0&&(z==="instanceMatrix"&&w.instanceMatrix&&(ht=w.instanceMatrix),z==="instanceColor"&&w.instanceColor&&(ht=w.instanceColor)),nt===void 0||nt.attribute!==ht||ht&&nt.data!==ht.data)return!0;O++}return s.attributesNum!==O||s.index!==G}function m(w,P,k,G){let N={},L=P.attributes,O=0,W=k.getAttributes();for(let z in W)if(W[z].location>=0){let nt=L[z];nt===void 0&&(z==="instanceMatrix"&&w.instanceMatrix&&(nt=w.instanceMatrix),z==="instanceColor"&&w.instanceColor&&(nt=w.instanceColor));let ht={};ht.attribute=nt,nt&&nt.data&&(ht.data=nt.data),N[z]=ht,O++}s.attributes=N,s.attributesNum=O,s.index=G}function x(){let w=s.newAttributes;for(let P=0,k=w.length;P<k;P++)w[P]=0}function g(w){f(w,0)}function f(w,P){let k=s.newAttributes,G=s.enabledAttributes,N=s.attributeDivisors;k[w]=1,G[w]===0&&(i.enableVertexAttribArray(w),G[w]=1),N[w]!==P&&(i.vertexAttribDivisor(w,P),N[w]=P)}function M(){let w=s.newAttributes,P=s.enabledAttributes;for(let k=0,G=P.length;k<G;k++)P[k]!==w[k]&&(i.disableVertexAttribArray(k),P[k]=0)}function v(w,P,k,G,N,L,O){O===!0?i.vertexAttribIPointer(w,P,k,N,L):i.vertexAttribPointer(w,P,k,G,N,L)}function y(w,P,k,G){x();let N=G.attributes,L=k.getAttributes(),O=P.defaultAttributeValues;for(let W in L){let z=L[W];if(z.location>=0){let Q=N[W];if(Q===void 0&&(W==="instanceMatrix"&&w.instanceMatrix&&(Q=w.instanceMatrix),W==="instanceColor"&&w.instanceColor&&(Q=w.instanceColor)),Q!==void 0){let nt=Q.normalized,ht=Q.itemSize,dt=t.get(Q);if(dt===void 0)continue;let zt=dt.buffer,Vt=dt.type,yt=dt.bytesPerElement,V=Vt===i.INT||Vt===i.UNSIGNED_INT||Q.gpuType===gl;if(Q.isInterleavedBufferAttribute){let q=Q.data,ot=q.stride,ft=Q.offset;if(q.isInstancedInterleavedBuffer){for(let xt=0;xt<z.locationSize;xt++)f(z.location+xt,q.meshPerAttribute);w.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let xt=0;xt<z.locationSize;xt++)g(z.location+xt);i.bindBuffer(i.ARRAY_BUFFER,zt);for(let xt=0;xt<z.locationSize;xt++)v(z.location+xt,ht/z.locationSize,Vt,nt,ot*yt,(ft+ht/z.locationSize*xt)*yt,V)}else{if(Q.isInstancedBufferAttribute){for(let q=0;q<z.locationSize;q++)f(z.location+q,Q.meshPerAttribute);w.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let q=0;q<z.locationSize;q++)g(z.location+q);i.bindBuffer(i.ARRAY_BUFFER,zt);for(let q=0;q<z.locationSize;q++)v(z.location+q,ht/z.locationSize,Vt,nt,ht*yt,ht/z.locationSize*q*yt,V)}}else if(O!==void 0){let nt=O[W];if(nt!==void 0)switch(nt.length){case 2:i.vertexAttrib2fv(z.location,nt);break;case 3:i.vertexAttrib3fv(z.location,nt);break;case 4:i.vertexAttrib4fv(z.location,nt);break;default:i.vertexAttrib1fv(z.location,nt)}}}}M()}function E(){I();for(let w in n){let P=n[w];for(let k in P){let G=P[k];for(let N in G)d(G[N].object),delete G[N];delete P[k]}delete n[w]}}function T(w){if(n[w.id]===void 0)return;let P=n[w.id];for(let k in P){let G=P[k];for(let N in G)d(G[N].object),delete G[N];delete P[k]}delete n[w.id]}function A(w){for(let P in n){let k=n[P];if(k[w.id]===void 0)continue;let G=k[w.id];for(let N in G)d(G[N].object),delete G[N];delete k[w.id]}}function I(){b(),o=!0,s!==r&&(s=r,l(s.object))}function b(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:I,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:M}}function Ix(i,t,e){let n;function r(l){n=l}function s(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function o(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),e.update(d,n,h))}function a(l,d,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let u=0;for(let m=0;m<h;m++)u+=d[m];e.update(u,n,1)}function c(l,d,h,p){if(h===0)return;let u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<l.length;m++)o(l[m],d[m],p[m]);else{u.multiDrawArraysInstancedWEBGL(n,l,0,d,0,p,0,h);let m=0;for(let x=0;x<h;x++)m+=d[x]*p[x];e.update(m,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Px(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Ln&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let I=A===kn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Xn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==si&&!I)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);let h=e.logarithmicDepthBuffer===!0,p=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:p,maxTextures:u,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function kx(i){let t=this,e=null,n=0,r=!1,s=!1,o=new In,a=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,p){let u=h.length!==0||p||n!==0||r;return r=p,n=h.length,u},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,p){e=d(h,p,0)},this.setState=function(h,p,u){let m=h.clippingPlanes,x=h.clipIntersection,g=h.clipShadows,f=i.get(h);if(!r||m===null||m.length===0||s&&!g)s?d(null):l();else{let M=s?0:n,v=M*4,y=f.clippingState||null;c.value=y,y=d(m,p,v,u);for(let E=0;E!==v;++E)y[E]=e[E];f.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(h,p,u,m){let x=h!==null?h.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let f=u+x*4,M=p.matrixWorldInverse;a.getNormalMatrix(M),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,y=u;v!==x;++v,y+=4)o.copy(h[v]).applyMatrix4(M,a),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function Lx(i){let t=new WeakMap;function e(o,a){return a===ul?o.mapping=_r:a===fl&&(o.mapping=wr),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ul||a===fl)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Ua(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",r),e(l.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}var ms=4,eu=[.125,.215,.35,.446,.526,.582],Ar=20,Wh=new vr,nu=new Dt,$h=null,Xh=0,qh=0,Yh=!1,Tr=(1+Math.sqrt(5))/2,fs=1/Tr,iu=[new U(-Tr,fs,0),new U(Tr,fs,0),new U(-fs,0,Tr),new U(fs,0,Tr),new U(0,Tr,-fs),new U(0,Tr,fs),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],Dx=new U,Ql=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){let{size:o=256,position:a=Dx}=s;$h=this._renderer.getRenderTarget(),Xh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ou(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=su(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget($h,Xh,qh),this._renderer.xr.enabled=Yh,t.scissorTest=!1,Jl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_r||t.mapping===wr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$h=this._renderer.getRenderTarget(),Xh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:kn,format:Ln,colorSpace:mr,depthBuffer:!1},r=ru(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ru(t,e,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ux(s)),this._blurMaterial=Fx(s,t,e)}return r}_compileMaterial(t){let e=new ve(this._lodPlanes[0],t);this._renderer.compile(e,Wh)}_sceneToCubeUV(t,e,n,r,s){let c=new tn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,p=h.autoClear,u=h.toneMapping;h.getClearColor(nu),h.toneMapping=Si,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));let x=new qe({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1}),g=new ve(new is,x),f=!1,M=t.background;M?M.isColor&&(x.color.copy(M),t.background=null,f=!0):(x.color.copy(nu),f=!0);for(let v=0;v<6;v++){let y=v%3;y===0?(c.up.set(0,l[v],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+d[v],s.y,s.z)):y===1?(c.up.set(0,0,l[v]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+d[v],s.z)):(c.up.set(0,l[v],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+d[v]));let E=this._cubeSize;Jl(r,y*E,v>2?E:0,E,E),h.setRenderTarget(r),f&&h.render(g,c),h.render(t,c)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=p,t.background=M}_textureToCubeUV(t,e){let n=this._renderer,r=t.mapping===_r||t.mapping===wr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ou()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=su());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new ve(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;let c=this._cubeSize;Jl(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Wh)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=iu[(r-s-1)%iu.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,h=new ve(this._lodPlanes[r],l),p=l.uniforms,u=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*Ar-1),x=s/m,g=isFinite(s)?1+Math.floor(d*x):Ar;g>Ar&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ar}`);let f=[],M=0;for(let A=0;A<Ar;++A){let I=A/x,b=Math.exp(-I*I/2);f.push(b),A===0?M+=b:A<g&&(M+=2*b)}for(let A=0;A<f.length;A++)f[A]=f[A]/M;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=f,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);let{_lodMax:v}=this;p.dTheta.value=m,p.mipInt.value=v-n;let y=this._sizeLods[r],E=3*y*(r>v-ms?r-v+ms:0),T=4*(this._cubeSize-y);Jl(e,E,T,3*y,2*y),c.setRenderTarget(e),c.render(h,Wh)}};function Ux(i){let t=[],e=[],n=[],r=i,s=i-ms+1+eu.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);e.push(a);let c=1/a;o>i-ms?c=eu[o-i+ms-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),d=-l,h=1+l,p=[d,d,h,d,h,h,d,d,h,h,d,h],u=6,m=6,x=3,g=2,f=1,M=new Float32Array(x*m*u),v=new Float32Array(g*m*u),y=new Float32Array(f*m*u);for(let T=0;T<u;T++){let A=T%3*2/3-1,I=T>2?0:-1,b=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];M.set(b,x*m*T),v.set(p,g*m*T);let w=[T,T,T,T,T,T];y.set(w,f*m*T)}let E=new Be;E.setAttribute("position",new hn(M,x)),E.setAttribute("uv",new hn(v,g)),E.setAttribute("faceIndex",new hn(y,f)),t.push(E),r>ms&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ru(i,t,e){let n=new en(i,t,e);return n.texture.mapping=uo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Jl(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Fx(i,t,e){let n=new Float32Array(Ar),r=new U(0,1,0);return new Ce({name:"SphericalGaussianBlur",defines:{n:Ar,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function su(){return new Ce({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function ou(){return new Ce({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function rd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Nx(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===ul||c===fl,d=c===_r||c===wr;if(l||d){let h=t.get(a),p=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return e===null&&(e=new Ql(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{let u=a.image;return l&&u&&u.height>0||d&&u&&r(u)?(e===null&&(e=new Ql(i)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0,l=6;for(let d=0;d<l;d++)a[d]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Bx(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let r=e(n);return r===null&&es("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Ox(i,t,e,n){let r={},s=new WeakMap;function o(h){let p=h.target;p.index!==null&&t.remove(p.index);for(let m in p.attributes)t.remove(p.attributes[m]);p.removeEventListener("dispose",o),delete r[p.id];let u=s.get(p);u&&(t.remove(u),s.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function a(h,p){return r[p.id]===!0||(p.addEventListener("dispose",o),r[p.id]=!0,e.memory.geometries++),p}function c(h){let p=h.attributes;for(let u in p)t.update(p[u],i.ARRAY_BUFFER)}function l(h){let p=[],u=h.index,m=h.attributes.position,x=0;if(u!==null){let M=u.array;x=u.version;for(let v=0,y=M.length;v<y;v+=3){let E=M[v+0],T=M[v+1],A=M[v+2];p.push(E,T,T,A,A,E)}}else if(m!==void 0){let M=m.array;x=m.version;for(let v=0,y=M.length/3-1;v<y;v+=3){let E=v+0,T=v+1,A=v+2;p.push(E,T,T,A,A,E)}}else return;let g=new(Bh(p)?Ws:Gs)(p,1);g.version=x;let f=s.get(h);f&&t.remove(f),s.set(h,g)}function d(h){let p=s.get(h);if(p){let u=h.index;u!==null&&p.version<u.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:d}}function zx(i,t,e){let n;function r(p){n=p}let s,o;function a(p){s=p.type,o=p.bytesPerElement}function c(p,u){i.drawElements(n,u,s,p*o),e.update(u,n,1)}function l(p,u,m){m!==0&&(i.drawElementsInstanced(n,u,s,p*o,m),e.update(u,n,m))}function d(p,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,s,p,0,m);let g=0;for(let f=0;f<m;f++)g+=u[f];e.update(g,n,1)}function h(p,u,m,x){if(m===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<p.length;f++)l(p[f]/o,u[f],x[f]);else{g.multiDrawElementsInstancedWEBGL(n,u,0,s,p,0,x,0,m);let f=0;for(let M=0;M<m;M++)f+=u[M]*x[M];e.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Hx(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Vx(i,t,e){let n=new WeakMap,r=new fe;function s(o,a,c){let l=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=d!==void 0?d.length:0,p=n.get(a);if(p===void 0||p.count!==h){let b=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",b)};p!==void 0&&p.texture.dispose();let u=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],v=0;u===!0&&(v=1),m===!0&&(v=2),x===!0&&(v=3);let y=a.attributes.position.count*v,E=1;y>t.maxTextureSize&&(E=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let T=new Float32Array(y*E*4*h),A=new Hs(T,y,E,h);A.type=si,A.needsUpdate=!0;let I=v*4;for(let w=0;w<h;w++){let P=g[w],k=f[w],G=M[w],N=y*E*4*w;for(let L=0;L<P.count;L++){let O=L*I;u===!0&&(r.fromBufferAttribute(P,L),T[N+O+0]=r.x,T[N+O+1]=r.y,T[N+O+2]=r.z,T[N+O+3]=0),m===!0&&(r.fromBufferAttribute(k,L),T[N+O+4]=r.x,T[N+O+5]=r.y,T[N+O+6]=r.z,T[N+O+7]=0),x===!0&&(r.fromBufferAttribute(G,L),T[N+O+8]=r.x,T[N+O+9]=r.y,T[N+O+10]=r.z,T[N+O+11]=G.itemSize===4?r.w:1)}}p={count:h,texture:A,size:new Ct(y,E)},n.set(a,p),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let u=0;for(let x=0;x<l.length;x++)u+=l[x];let m=a.morphTargetsRelative?1:1-u;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:s}}function Gx(i,t,e,n){let r=new WeakMap;function s(c){let l=n.render.frame,d=c.geometry,h=t.get(c,d);if(r.get(h)!==l&&(t.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==l&&(p.update(),r.set(p,l))}return h}function o(){r=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}var Eu=new mn,au=new Js(1,1),Tu=new Hs,Au=new La,Ru=new Xs,lu=[],cu=[],hu=new Float32Array(16),du=new Float32Array(9),pu=new Float32Array(4);function xs(i,t,e){let n=i[0];if(n<=0||n>0)return i;let r=t*e,s=lu[r];if(s===void 0&&(s=new Float32Array(r),lu[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ec(i,t){let e=cu[t];e===void 0&&(e=new Int32Array(t),cu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Wx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function $x(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function Xx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function qx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function Yx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;pu.set(n),i.uniformMatrix2fv(this.addr,!1,pu),Ve(e,n)}}function Zx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;du.set(n),i.uniformMatrix3fv(this.addr,!1,du),Ve(e,n)}}function jx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;hu.set(n),i.uniformMatrix4fv(this.addr,!1,hu),Ve(e,n)}}function Jx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Kx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function Qx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function tb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function eb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function nb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function ib(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function rb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function sb(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(au.compareFunction=Uh,s=au):s=Eu,e.setTexture2D(t||s,r)}function ob(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Au,r)}function ab(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Ru,r)}function lb(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Tu,r)}function cb(i){switch(i){case 5126:return Wx;case 35664:return $x;case 35665:return Xx;case 35666:return qx;case 35674:return Yx;case 35675:return Zx;case 35676:return jx;case 5124:case 35670:return Jx;case 35667:case 35671:return Kx;case 35668:case 35672:return Qx;case 35669:case 35673:return tb;case 5125:return eb;case 36294:return nb;case 36295:return ib;case 36296:return rb;case 35678:case 36198:case 36298:case 36306:case 35682:return sb;case 35679:case 36299:case 36307:return ob;case 35680:case 36300:case 36308:case 36293:return ab;case 36289:case 36303:case 36311:case 36292:return lb}}function hb(i,t){i.uniform1fv(this.addr,t)}function db(i,t){let e=xs(t,this.size,2);i.uniform2fv(this.addr,e)}function pb(i,t){let e=xs(t,this.size,3);i.uniform3fv(this.addr,e)}function ub(i,t){let e=xs(t,this.size,4);i.uniform4fv(this.addr,e)}function fb(i,t){let e=xs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function mb(i,t){let e=xs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function gb(i,t){let e=xs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function xb(i,t){i.uniform1iv(this.addr,t)}function bb(i,t){i.uniform2iv(this.addr,t)}function vb(i,t){i.uniform3iv(this.addr,t)}function yb(i,t){i.uniform4iv(this.addr,t)}function _b(i,t){i.uniform1uiv(this.addr,t)}function wb(i,t){i.uniform2uiv(this.addr,t)}function Mb(i,t){i.uniform3uiv(this.addr,t)}function Sb(i,t){i.uniform4uiv(this.addr,t)}function Eb(i,t,e){let n=this.cache,r=t.length,s=ec(e,r);He(n,s)||(i.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Eu,s[o])}function Tb(i,t,e){let n=this.cache,r=t.length,s=ec(e,r);He(n,s)||(i.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Au,s[o])}function Ab(i,t,e){let n=this.cache,r=t.length,s=ec(e,r);He(n,s)||(i.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Ru,s[o])}function Rb(i,t,e){let n=this.cache,r=t.length,s=ec(e,r);He(n,s)||(i.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Tu,s[o])}function Cb(i){switch(i){case 5126:return hb;case 35664:return db;case 35665:return pb;case 35666:return ub;case 35674:return fb;case 35675:return mb;case 35676:return gb;case 5124:case 35670:return xb;case 35667:case 35671:return bb;case 35668:case 35672:return vb;case 35669:case 35673:return yb;case 5125:return _b;case 36294:return wb;case 36295:return Mb;case 36296:return Sb;case 35678:case 36198:case 36298:case 36306:case 35682:return Eb;case 35679:case 36299:case 36307:return Tb;case 35680:case 36300:case 36308:case 36293:return Ab;case 36289:case 36303:case 36311:case 36292:return Rb}}var jh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=cb(e.type)}},Jh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Cb(e.type)}},Kh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(t,e[a.id],n)}}},Zh=/(\w+)(\])?(\[|\.)?/g;function uu(i,t){i.seq.push(t),i.map[t.id]=t}function Ib(i,t,e){let n=i.name,r=n.length;for(Zh.lastIndex=0;;){let s=Zh.exec(n),o=Zh.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){uu(e,l===void 0?new jh(a,i,t):new Jh(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new Kh(a),uu(e,h)),e=h}}}var gs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Ib(s,o,this)}}setValue(t,e,n,r){let s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){let r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){let a=e[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,r)}}static seqWithValue(t,e){let n=[];for(let r=0,s=t.length;r!==s;++r){let o=t[r];o.id in e&&n.push(o)}return n}};function fu(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Pb=37297,kb=0;function Lb(i,t){let e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var mu=new Yt;function Db(i){te._getMatrix(mu,te.workingColorSpace,i);let t=`mat3( ${mu.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(i)){case Bs:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function gu(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Lb(i.getShaderSource(t),a)}else return s}function Ub(i,t){let e=Db(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Fb(i,t){let e;switch(t){case ol:e="Linear";break;case al:e="Reinhard";break;case ll:e="Cineon";break;case cl:e="ACESFilmic";break;case dl:e="AgX";break;case pl:e="Neutral";break;case hl:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Kl=new U;function Nb(){te.getLuminanceCoefficients(Kl);let i=Kl.x.toFixed(4),t=Kl.y.toFixed(4),e=Kl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vo).join(`
`)}function Ob(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function zb(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(t,r),o=s.name,a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function vo(i){return i!==""}function xu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Hb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qh(i){return i.replace(Hb,Gb)}var Vb=new Map;function Gb(i,t){let e=jt[t];if(e===void 0){let n=Vb.get(t);if(n!==void 0)e=jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Qh(e)}var Wb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vu(i){return i.replace(Wb,$b)}function $b(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function yu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Xb(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===wh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===mp?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ri&&(t="SHADOWMAP_TYPE_VSM"),t}function qb(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case _r:case wr:t="ENVMAP_TYPE_CUBE";break;case uo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Yb(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case wr:t="ENVMAP_MODE_REFRACTION";break}return t}function Zb(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case sl:t="ENVMAP_BLENDING_MULTIPLY";break;case Dp:t="ENVMAP_BLENDING_MIX";break;case Up:t="ENVMAP_BLENDING_ADD";break}return t}function jb(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Jb(i,t,e,n){let r=i.getContext(),s=e.defines,o=e.vertexShader,a=e.fragmentShader,c=Xb(e),l=qb(e),d=Yb(e),h=Zb(e),p=jb(e),u=Bb(e),m=Ob(s),x=r.createProgram(),g,f,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(vo).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(vo).join(`
`),f.length>0&&(f+=`
`)):(g=[yu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vo).join(`
`),f=[yu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+h:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Si?"#define TONE_MAPPING":"",e.toneMapping!==Si?jt.tonemapping_pars_fragment:"",e.toneMapping!==Si?Fb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,Ub("linearToOutputTexel",e.outputColorSpace),Nb(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vo).join(`
`)),o=Qh(o),o=xu(o,e),o=bu(o,e),a=Qh(a),a=xu(a,e),a=bu(a,e),o=vu(o),a=vu(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",e.glslVersion===Fh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Fh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let v=M+g+o,y=M+f+a,E=fu(r,r.VERTEX_SHADER,v),T=fu(r,r.FRAGMENT_SHADER,y);r.attachShader(x,E),r.attachShader(x,T),e.index0AttributeName!==void 0?r.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function A(P){if(i.debug.checkShaderErrors){let k=r.getProgramInfoLog(x)||"",G=r.getShaderInfoLog(E)||"",N=r.getShaderInfoLog(T)||"",L=k.trim(),O=G.trim(),W=N.trim(),z=!0,Q=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,E,T);else{let nt=gu(r,E,"vertex"),ht=gu(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+L+`
`+nt+`
`+ht)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(O===""||W==="")&&(Q=!1);Q&&(P.diagnostics={runnable:z,programLog:L,vertexShader:{log:O,prefix:g},fragmentShader:{log:W,prefix:f}})}r.deleteShader(E),r.deleteShader(T),I=new gs(r,x),b=zb(r,x)}let I;this.getUniforms=function(){return I===void 0&&A(this),I};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let w=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(x,Pb)),w},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=kb++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=T,this}var Kb=0,td=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new ed(t),e.set(t,n)),n}},ed=class{constructor(t){this.id=Kb++,this.code=t,this.usedTimes=0}};function Qb(i,t,e,n,r,s,o){let a=new Vs,c=new td,l=new Set,d=[],h=r.logarithmicDepthBuffer,p=r.vertexTextures,u=r.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,w,P,k,G){let N=k.fog,L=G.geometry,O=b.isMeshStandardMaterial?k.environment:null,W=(b.isMeshStandardMaterial?e:t).get(b.envMap||O),z=W&&W.mapping===uo?W.image.height:null,Q=m[b.type];b.precision!==null&&(u=r.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));let nt=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,ht=nt!==void 0?nt.length:0,dt=0;L.morphAttributes.position!==void 0&&(dt=1),L.morphAttributes.normal!==void 0&&(dt=2),L.morphAttributes.color!==void 0&&(dt=3);let zt,Vt,yt,V;if(Q){let ae=oi[Q];zt=ae.vertexShader,Vt=ae.fragmentShader}else zt=b.vertexShader,Vt=b.fragmentShader,c.update(b),yt=c.getVertexShaderID(b),V=c.getFragmentShaderID(b);let q=i.getRenderTarget(),ot=i.state.buffers.depth.getReversed(),ft=G.isInstancedMesh===!0,xt=G.isBatchedMesh===!0,rt=!!b.map,ut=!!b.matcap,R=!!W,Ft=!!b.aoMap,St=!!b.lightMap,It=!!b.bumpMap,mt=!!b.normalMap,Jt=!!b.displacementMap,wt=!!b.emissiveMap,Gt=!!b.metalnessMap,Ee=!!b.roughnessMap,Qt=b.anisotropy>0,C=b.clearcoat>0,_=b.dispersion>0,$=b.iridescence>0,J=b.sheen>0,et=b.transmission>0,Z=Qt&&!!b.anisotropyMap,Pt=C&&!!b.clearcoatMap,ct=C&&!!b.clearcoatNormalMap,Tt=C&&!!b.clearcoatRoughnessMap,At=$&&!!b.iridescenceMap,st=$&&!!b.iridescenceThicknessMap,vt=J&&!!b.sheenColorMap,Ot=J&&!!b.sheenRoughnessMap,Lt=!!b.specularMap,bt=!!b.specularColorMap,$t=!!b.specularIntensityMap,F=et&&!!b.transmissionMap,at=et&&!!b.thicknessMap,pt=!!b.gradientMap,Mt=!!b.alphaMap,j=b.alphaTest>0,K=!!b.alphaHash,Rt=!!b.extensions,Nt=Si;b.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Nt=i.toneMapping);let ye={shaderID:Q,shaderType:b.type,shaderName:b.name,vertexShader:zt,fragmentShader:Vt,defines:b.defines,customVertexShaderID:yt,customFragmentShaderID:V,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:xt,batchingColor:xt&&G._colorsTexture!==null,instancing:ft,instancingColor:ft&&G.instanceColor!==null,instancingMorph:ft&&G.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:q===null?i.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:mr,alphaToCoverage:!!b.alphaToCoverage,map:rt,matcap:ut,envMap:R,envMapMode:R&&W.mapping,envMapCubeUVHeight:z,aoMap:Ft,lightMap:St,bumpMap:It,normalMap:mt,displacementMap:p&&Jt,emissiveMap:wt,normalMapObjectSpace:mt&&b.normalMapType===Op,normalMapTangentSpace:mt&&b.normalMapType===Dh,metalnessMap:Gt,roughnessMap:Ee,anisotropy:Qt,anisotropyMap:Z,clearcoat:C,clearcoatMap:Pt,clearcoatNormalMap:ct,clearcoatRoughnessMap:Tt,dispersion:_,iridescence:$,iridescenceMap:At,iridescenceThicknessMap:st,sheen:J,sheenColorMap:vt,sheenRoughnessMap:Ot,specularMap:Lt,specularColorMap:bt,specularIntensityMap:$t,transmission:et,transmissionMap:F,thicknessMap:at,gradientMap:pt,opaque:b.transparent===!1&&b.blending===Mi&&b.alphaToCoverage===!1,alphaMap:Mt,alphaTest:j,alphaHash:K,combine:b.combine,mapUv:rt&&x(b.map.channel),aoMapUv:Ft&&x(b.aoMap.channel),lightMapUv:St&&x(b.lightMap.channel),bumpMapUv:It&&x(b.bumpMap.channel),normalMapUv:mt&&x(b.normalMap.channel),displacementMapUv:Jt&&x(b.displacementMap.channel),emissiveMapUv:wt&&x(b.emissiveMap.channel),metalnessMapUv:Gt&&x(b.metalnessMap.channel),roughnessMapUv:Ee&&x(b.roughnessMap.channel),anisotropyMapUv:Z&&x(b.anisotropyMap.channel),clearcoatMapUv:Pt&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:ct&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Tt&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:At&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:st&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:vt&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&x(b.sheenRoughnessMap.channel),specularMapUv:Lt&&x(b.specularMap.channel),specularColorMapUv:bt&&x(b.specularColorMap.channel),specularIntensityMapUv:$t&&x(b.specularIntensityMap.channel),transmissionMapUv:F&&x(b.transmissionMap.channel),thicknessMapUv:at&&x(b.thicknessMap.channel),alphaMapUv:Mt&&x(b.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(mt||Qt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!L.attributes.uv&&(rt||Mt),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:ot,skinning:G.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:dt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Nt,decodeVideoTexture:rt&&b.map.isVideoTexture===!0&&te.getTransfer(b.map.colorSpace)===oe,decodeVideoTextureEmissive:wt&&b.emissiveMap.isVideoTexture===!0&&te.getTransfer(b.emissiveMap.colorSpace)===oe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ie,flipSided:b.side===dn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Rt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Rt&&b.extensions.multiDraw===!0||xt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ye.vertexUv1s=l.has(1),ye.vertexUv2s=l.has(2),ye.vertexUv3s=l.has(3),l.clear(),ye}function f(b){let w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(let P in b.defines)w.push(P),w.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(M(w,b),v(w,b),w.push(i.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function M(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function v(b,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),w.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),b.push(a.mask)}function y(b){let w=m[b.type],P;if(w){let k=oi[w];P=Yn.clone(k.uniforms)}else P=b.uniforms;return P}function E(b,w){let P;for(let k=0,G=d.length;k<G;k++){let N=d[k];if(N.cacheKey===w){P=N,++P.usedTimes;break}}return P===void 0&&(P=new Jb(i,w,b,s),d.push(P)),P}function T(b){if(--b.usedTimes===0){let w=d.indexOf(b);d[w]=d[d.length-1],d.pop(),b.destroy()}}function A(b){c.remove(b)}function I(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:I}}function tv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function ev(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function _u(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function wu(){let i=[],t=0,e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(h,p,u,m,x,g){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:p,material:u,groupOrder:m,renderOrder:h.renderOrder,z:x,group:g},i[t]=f):(f.id=h.id,f.object=h,f.geometry=p,f.material=u,f.groupOrder=m,f.renderOrder=h.renderOrder,f.z=x,f.group=g),t++,f}function a(h,p,u,m,x,g){let f=o(h,p,u,m,x,g);u.transmission>0?n.push(f):u.transparent===!0?r.push(f):e.push(f)}function c(h,p,u,m,x,g){let f=o(h,p,u,m,x,g);u.transmission>0?n.unshift(f):u.transparent===!0?r.unshift(f):e.unshift(f)}function l(h,p){e.length>1&&e.sort(h||ev),n.length>1&&n.sort(p||_u),r.length>1&&r.sort(p||_u)}function d(){for(let h=t,p=i.length;h<p;h++){let u=i[h];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:d,sort:l}}function nv(){let i=new WeakMap;function t(n,r){let s=i.get(n),o;return s===void 0?(o=new wu,i.set(n,[o])):r>=s.length?(o=new wu,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function iv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new Dt};break;case"SpotLight":e={position:new U,direction:new U,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function rv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var sv=0;function ov(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function av(i){let t=new iv,e=rv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);let r=new U,s=new _e,o=new _e;function a(l){let d=0,h=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let u=0,m=0,x=0,g=0,f=0,M=0,v=0,y=0,E=0,T=0,A=0;l.sort(ov);for(let b=0,w=l.length;b<w;b++){let P=l[b],k=P.color,G=P.intensity,N=P.distance,L=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=k.r*G,h+=k.g*G,p+=k.b*G;else if(P.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(P.sh.coefficients[O],G);A++}else if(P.isDirectionalLight){let O=t.get(P);if(O.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let W=P.shadow,z=e.get(P);z.shadowIntensity=W.intensity,z.shadowBias=W.bias,z.shadowNormalBias=W.normalBias,z.shadowRadius=W.radius,z.shadowMapSize=W.mapSize,n.directionalShadow[u]=z,n.directionalShadowMap[u]=L,n.directionalShadowMatrix[u]=P.shadow.matrix,M++}n.directional[u]=O,u++}else if(P.isSpotLight){let O=t.get(P);O.position.setFromMatrixPosition(P.matrixWorld),O.color.copy(k).multiplyScalar(G),O.distance=N,O.coneCos=Math.cos(P.angle),O.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),O.decay=P.decay,n.spot[x]=O;let W=P.shadow;if(P.map&&(n.spotLightMap[E]=P.map,E++,W.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[x]=W.matrix,P.castShadow){let z=e.get(P);z.shadowIntensity=W.intensity,z.shadowBias=W.bias,z.shadowNormalBias=W.normalBias,z.shadowRadius=W.radius,z.shadowMapSize=W.mapSize,n.spotShadow[x]=z,n.spotShadowMap[x]=L,y++}x++}else if(P.isRectAreaLight){let O=t.get(P);O.color.copy(k).multiplyScalar(G),O.halfWidth.set(P.width*.5,0,0),O.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=O,g++}else if(P.isPointLight){let O=t.get(P);if(O.color.copy(P.color).multiplyScalar(P.intensity),O.distance=P.distance,O.decay=P.decay,P.castShadow){let W=P.shadow,z=e.get(P);z.shadowIntensity=W.intensity,z.shadowBias=W.bias,z.shadowNormalBias=W.normalBias,z.shadowRadius=W.radius,z.shadowMapSize=W.mapSize,z.shadowCameraNear=W.camera.near,z.shadowCameraFar=W.camera.far,n.pointShadow[m]=z,n.pointShadowMap[m]=L,n.pointShadowMatrix[m]=P.shadow.matrix,v++}n.point[m]=O,m++}else if(P.isHemisphereLight){let O=t.get(P);O.skyColor.copy(P.color).multiplyScalar(G),O.groundColor.copy(P.groundColor).multiplyScalar(G),n.hemi[f]=O,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=p;let I=n.hash;(I.directionalLength!==u||I.pointLength!==m||I.spotLength!==x||I.rectAreaLength!==g||I.hemiLength!==f||I.numDirectionalShadows!==M||I.numPointShadows!==v||I.numSpotShadows!==y||I.numSpotMaps!==E||I.numLightProbes!==A)&&(n.directional.length=u,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,I.directionalLength=u,I.pointLength=m,I.spotLength=x,I.rectAreaLength=g,I.hemiLength=f,I.numDirectionalShadows=M,I.numPointShadows=v,I.numSpotShadows=y,I.numSpotMaps=E,I.numLightProbes=A,n.version=sv++)}function c(l,d){let h=0,p=0,u=0,m=0,x=0,g=d.matrixWorldInverse;for(let f=0,M=l.length;f<M;f++){let v=l[f];if(v.isDirectionalLight){let y=n.directional[h];y.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(g),h++}else if(v.isSpotLight){let y=n.spot[u];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(g),u++}else if(v.isRectAreaLight){let y=n.rectArea[m];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(v.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(v.isPointLight){let y=n.point[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(g),p++}else if(v.isHemisphereLight){let y=n.hemi[x];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(g),x++}}}return{setup:a,setupView:c,state:n}}function Mu(i){let t=new av(i),e=[],n=[];function r(d){l.camera=d,e.length=0,n.length=0}function s(d){e.push(d)}function o(d){n.push(d)}function a(){t.setup(e)}function c(d){t.setupView(e,d)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function lv(i){let t=new WeakMap;function e(r,s=0){let o=t.get(r),a;return o===void 0?(a=new Mu(i),t.set(r,[a])):s>=o.length?(a=new Mu(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var cv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function dv(i,t,e){let n=new ss,r=new Ct,s=new Ct,o=new fe,a=new za({depthPacking:Bp}),c=new Ha,l={},d=e.maxTextureSize,h={[wi]:dn,[dn]:wi,[Ie]:Ie},p=new Ce({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:cv,fragmentShader:hv}),u=p.clone();u.defines.HORIZONTAL_PASS=1;let m=new Be;m.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ve(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wh;let f=this.type;this.render=function(T,A,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let b=i.getRenderTarget(),w=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),k=i.state;k.setBlending($n),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let G=f!==ri&&this.type===ri,N=f===ri&&this.type!==ri;for(let L=0,O=T.length;L<O;L++){let W=T[L],z=W.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);let Q=z.getFrameExtents();if(r.multiply(Q),s.copy(z.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/Q.x),r.x=s.x*Q.x,z.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/Q.y),r.y=s.y*Q.y,z.mapSize.y=s.y)),z.map===null||G===!0||N===!0){let ht=this.type!==ri?{minFilter:Pn,magFilter:Pn}:{};z.map!==null&&z.map.dispose(),z.map=new en(r.x,r.y,ht),z.map.texture.name=W.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();let nt=z.getViewportCount();for(let ht=0;ht<nt;ht++){let dt=z.getViewport(ht);o.set(s.x*dt.x,s.y*dt.y,s.x*dt.z,s.y*dt.w),k.viewport(o),z.updateMatrices(W,ht),n=z.getFrustum(),y(A,I,z.camera,W,this.type)}z.isPointLightShadow!==!0&&this.type===ri&&M(z,I),z.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(b,w,P)};function M(T,A){let I=t.update(x);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,u.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,u.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new en(r.x,r.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,I,p,x,null),u.uniforms.shadow_pass.value=T.mapPass.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,I,u,x,null)}function v(T,A,I,b){let w=null,P=I.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)w=P;else if(w=I.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let k=w.uuid,G=A.uuid,N=l[k];N===void 0&&(N={},l[k]=N);let L=N[G];L===void 0&&(L=w.clone(),N[G]=L,A.addEventListener("dispose",E)),w=L}if(w.visible=A.visible,w.wireframe=A.wireframe,b===ri?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:h[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,I.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let k=i.properties.get(w);k.light=I}return w}function y(T,A,I,b,w){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&w===ri)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld);let G=t.update(T),N=T.material;if(Array.isArray(N)){let L=G.groups;for(let O=0,W=L.length;O<W;O++){let z=L[O],Q=N[z.materialIndex];if(Q&&Q.visible){let nt=v(T,Q,b,w);T.onBeforeShadow(i,T,A,I,G,nt,z),i.renderBufferDirect(I,null,G,nt,T,z),T.onAfterShadow(i,T,A,I,G,nt,z)}}}else if(N.visible){let L=v(T,N,b,w);T.onBeforeShadow(i,T,A,I,G,L,null),i.renderBufferDirect(I,null,G,L,T,null),T.onAfterShadow(i,T,A,I,G,L,null)}}let k=T.children;for(let G=0,N=k.length;G<N;G++)y(k[G],A,I,b,w)}function E(T){T.target.removeEventListener("dispose",E);for(let I in l){let b=l[I],w=T.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}var pv={[Ka]:Qa,[tl]:il,[el]:rl,[fr]:nl,[Qa]:Ka,[il]:tl,[rl]:el,[nl]:fr};function uv(i,t){function e(){let F=!1,at=new fe,pt=null,Mt=new fe(0,0,0,0);return{setMask:function(j){pt!==j&&!F&&(i.colorMask(j,j,j,j),pt=j)},setLocked:function(j){F=j},setClear:function(j,K,Rt,Nt,ye){ye===!0&&(j*=Nt,K*=Nt,Rt*=Nt),at.set(j,K,Rt,Nt),Mt.equals(at)===!1&&(i.clearColor(j,K,Rt,Nt),Mt.copy(at))},reset:function(){F=!1,pt=null,Mt.set(-1,0,0,0)}}}function n(){let F=!1,at=!1,pt=null,Mt=null,j=null;return{setReversed:function(K){if(at!==K){let Rt=t.get("EXT_clip_control");K?Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.ZERO_TO_ONE_EXT):Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.NEGATIVE_ONE_TO_ONE_EXT),at=K;let Nt=j;j=null,this.setClear(Nt)}},getReversed:function(){return at},setTest:function(K){K?q(i.DEPTH_TEST):ot(i.DEPTH_TEST)},setMask:function(K){pt!==K&&!F&&(i.depthMask(K),pt=K)},setFunc:function(K){if(at&&(K=pv[K]),Mt!==K){switch(K){case Ka:i.depthFunc(i.NEVER);break;case Qa:i.depthFunc(i.ALWAYS);break;case tl:i.depthFunc(i.LESS);break;case fr:i.depthFunc(i.LEQUAL);break;case el:i.depthFunc(i.EQUAL);break;case nl:i.depthFunc(i.GEQUAL);break;case il:i.depthFunc(i.GREATER);break;case rl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Mt=K}},setLocked:function(K){F=K},setClear:function(K){j!==K&&(at&&(K=1-K),i.clearDepth(K),j=K)},reset:function(){F=!1,pt=null,Mt=null,j=null,at=!1}}}function r(){let F=!1,at=null,pt=null,Mt=null,j=null,K=null,Rt=null,Nt=null,ye=null;return{setTest:function(ae){F||(ae?q(i.STENCIL_TEST):ot(i.STENCIL_TEST))},setMask:function(ae){at!==ae&&!F&&(i.stencilMask(ae),at=ae)},setFunc:function(ae,fi,ei){(pt!==ae||Mt!==fi||j!==ei)&&(i.stencilFunc(ae,fi,ei),pt=ae,Mt=fi,j=ei)},setOp:function(ae,fi,ei){(K!==ae||Rt!==fi||Nt!==ei)&&(i.stencilOp(ae,fi,ei),K=ae,Rt=fi,Nt=ei)},setLocked:function(ae){F=ae},setClear:function(ae){ye!==ae&&(i.clearStencil(ae),ye=ae)},reset:function(){F=!1,at=null,pt=null,Mt=null,j=null,K=null,Rt=null,Nt=null,ye=null}}}let s=new e,o=new n,a=new r,c=new WeakMap,l=new WeakMap,d={},h={},p=new WeakMap,u=[],m=null,x=!1,g=null,f=null,M=null,v=null,y=null,E=null,T=null,A=new Dt(0,0,0),I=0,b=!1,w=null,P=null,k=null,G=null,N=null,L=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,W=0,z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(z)[1]),O=W>=1):z.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),O=W>=2);let Q=null,nt={},ht=i.getParameter(i.SCISSOR_BOX),dt=i.getParameter(i.VIEWPORT),zt=new fe().fromArray(ht),Vt=new fe().fromArray(dt);function yt(F,at,pt,Mt){let j=new Uint8Array(4),K=i.createTexture();i.bindTexture(F,K),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Rt=0;Rt<pt;Rt++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(at,0,i.RGBA,1,1,Mt,0,i.RGBA,i.UNSIGNED_BYTE,j):i.texImage2D(at+Rt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,j);return K}let V={};V[i.TEXTURE_2D]=yt(i.TEXTURE_2D,i.TEXTURE_2D,1),V[i.TEXTURE_CUBE_MAP]=yt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[i.TEXTURE_2D_ARRAY]=yt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),V[i.TEXTURE_3D]=yt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),q(i.DEPTH_TEST),o.setFunc(fr),It(!1),mt(_h),q(i.CULL_FACE),Ft($n);function q(F){d[F]!==!0&&(i.enable(F),d[F]=!0)}function ot(F){d[F]!==!1&&(i.disable(F),d[F]=!1)}function ft(F,at){return h[F]!==at?(i.bindFramebuffer(F,at),h[F]=at,F===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=at),F===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=at),!0):!1}function xt(F,at){let pt=u,Mt=!1;if(F){pt=p.get(at),pt===void 0&&(pt=[],p.set(at,pt));let j=F.textures;if(pt.length!==j.length||pt[0]!==i.COLOR_ATTACHMENT0){for(let K=0,Rt=j.length;K<Rt;K++)pt[K]=i.COLOR_ATTACHMENT0+K;pt.length=j.length,Mt=!0}}else pt[0]!==i.BACK&&(pt[0]=i.BACK,Mt=!0);Mt&&i.drawBuffers(pt)}function rt(F){return m!==F?(i.useProgram(F),m=F,!0):!1}let ut={[zi]:i.FUNC_ADD,[xp]:i.FUNC_SUBTRACT,[bp]:i.FUNC_REVERSE_SUBTRACT};ut[vp]=i.MIN,ut[yp]=i.MAX;let R={[_p]:i.ZERO,[wp]:i.ONE,[Mp]:i.SRC_COLOR,[Ta]:i.SRC_ALPHA,[Cp]:i.SRC_ALPHA_SATURATE,[Ap]:i.DST_COLOR,[Ep]:i.DST_ALPHA,[Sp]:i.ONE_MINUS_SRC_COLOR,[Aa]:i.ONE_MINUS_SRC_ALPHA,[Rp]:i.ONE_MINUS_DST_COLOR,[Tp]:i.ONE_MINUS_DST_ALPHA,[Ip]:i.CONSTANT_COLOR,[Pp]:i.ONE_MINUS_CONSTANT_COLOR,[kp]:i.CONSTANT_ALPHA,[Lp]:i.ONE_MINUS_CONSTANT_ALPHA};function Ft(F,at,pt,Mt,j,K,Rt,Nt,ye,ae){if(F===$n){x===!0&&(ot(i.BLEND),x=!1);return}if(x===!1&&(q(i.BLEND),x=!0),F!==gp){if(F!==g||ae!==b){if((f!==zi||y!==zi)&&(i.blendEquation(i.FUNC_ADD),f=zi,y=zi),ae)switch(F){case Mi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Zi:i.blendFunc(i.ONE,i.ONE);break;case Mh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Sh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Mi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Mh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Sh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}M=null,v=null,E=null,T=null,A.set(0,0,0),I=0,g=F,b=ae}return}j=j||at,K=K||pt,Rt=Rt||Mt,(at!==f||j!==y)&&(i.blendEquationSeparate(ut[at],ut[j]),f=at,y=j),(pt!==M||Mt!==v||K!==E||Rt!==T)&&(i.blendFuncSeparate(R[pt],R[Mt],R[K],R[Rt]),M=pt,v=Mt,E=K,T=Rt),(Nt.equals(A)===!1||ye!==I)&&(i.blendColor(Nt.r,Nt.g,Nt.b,ye),A.copy(Nt),I=ye),g=F,b=!1}function St(F,at){F.side===Ie?ot(i.CULL_FACE):q(i.CULL_FACE);let pt=F.side===dn;at&&(pt=!pt),It(pt),F.blending===Mi&&F.transparent===!1?Ft($n):Ft(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);let Mt=F.stencilWrite;a.setTest(Mt),Mt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),wt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?q(i.SAMPLE_ALPHA_TO_COVERAGE):ot(i.SAMPLE_ALPHA_TO_COVERAGE)}function It(F){w!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),w=F)}function mt(F){F!==up?(q(i.CULL_FACE),F!==P&&(F===_h?i.cullFace(i.BACK):F===fp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ot(i.CULL_FACE),P=F}function Jt(F){F!==k&&(O&&i.lineWidth(F),k=F)}function wt(F,at,pt){F?(q(i.POLYGON_OFFSET_FILL),(G!==at||N!==pt)&&(i.polygonOffset(at,pt),G=at,N=pt)):ot(i.POLYGON_OFFSET_FILL)}function Gt(F){F?q(i.SCISSOR_TEST):ot(i.SCISSOR_TEST)}function Ee(F){F===void 0&&(F=i.TEXTURE0+L-1),Q!==F&&(i.activeTexture(F),Q=F)}function Qt(F,at,pt){pt===void 0&&(Q===null?pt=i.TEXTURE0+L-1:pt=Q);let Mt=nt[pt];Mt===void 0&&(Mt={type:void 0,texture:void 0},nt[pt]=Mt),(Mt.type!==F||Mt.texture!==at)&&(Q!==pt&&(i.activeTexture(pt),Q=pt),i.bindTexture(F,at||V[F]),Mt.type=F,Mt.texture=at)}function C(){let F=nt[Q];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function $(){try{i.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{i.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function et(){try{i.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pt(){try{i.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ct(){try{i.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Tt(){try{i.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function At(){try{i.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(){try{i.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function vt(F){zt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),zt.copy(F))}function Ot(F){Vt.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Vt.copy(F))}function Lt(F,at){let pt=l.get(at);pt===void 0&&(pt=new WeakMap,l.set(at,pt));let Mt=pt.get(F);Mt===void 0&&(Mt=i.getUniformBlockIndex(at,F.name),pt.set(F,Mt))}function bt(F,at){let Mt=l.get(at).get(F);c.get(at)!==Mt&&(i.uniformBlockBinding(at,Mt,F.__bindingPointIndex),c.set(at,Mt))}function $t(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},Q=null,nt={},h={},p=new WeakMap,u=[],m=null,x=!1,g=null,f=null,M=null,v=null,y=null,E=null,T=null,A=new Dt(0,0,0),I=0,b=!1,w=null,P=null,k=null,G=null,N=null,zt.set(0,0,i.canvas.width,i.canvas.height),Vt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:q,disable:ot,bindFramebuffer:ft,drawBuffers:xt,useProgram:rt,setBlending:Ft,setMaterial:St,setFlipSided:It,setCullFace:mt,setLineWidth:Jt,setPolygonOffset:wt,setScissorTest:Gt,activeTexture:Ee,bindTexture:Qt,unbindTexture:C,compressedTexImage2D:_,compressedTexImage3D:$,texImage2D:At,texImage3D:st,updateUBOMapping:Lt,uniformBlockBinding:bt,texStorage2D:ct,texStorage3D:Tt,texSubImage2D:J,texSubImage3D:et,compressedTexSubImage2D:Z,compressedTexSubImage3D:Pt,scissor:vt,viewport:Ot,reset:$t}}function fv(i,t,e,n,r,s,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ct,d=new WeakMap,h,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,_){return u?new OffscreenCanvas(C,_):zs("canvas")}function x(C,_,$){let J=1,et=Qt(C);if((et.width>$||et.height>$)&&(J=$/Math.max(et.width,et.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let Z=Math.floor(J*et.width),Pt=Math.floor(J*et.height);h===void 0&&(h=m(Z,Pt));let ct=_?m(Z,Pt):h;return ct.width=Z,ct.height=Pt,ct.getContext("2d").drawImage(C,0,0,Z,Pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+Z+"x"+Pt+")."),ct}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),C;return C}function g(C){return C.generateMipmaps}function f(C){i.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(C,_,$,J,et=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Z=_;if(_===i.RED&&($===i.FLOAT&&(Z=i.R32F),$===i.HALF_FLOAT&&(Z=i.R16F),$===i.UNSIGNED_BYTE&&(Z=i.R8)),_===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(Z=i.R8UI),$===i.UNSIGNED_SHORT&&(Z=i.R16UI),$===i.UNSIGNED_INT&&(Z=i.R32UI),$===i.BYTE&&(Z=i.R8I),$===i.SHORT&&(Z=i.R16I),$===i.INT&&(Z=i.R32I)),_===i.RG&&($===i.FLOAT&&(Z=i.RG32F),$===i.HALF_FLOAT&&(Z=i.RG16F),$===i.UNSIGNED_BYTE&&(Z=i.RG8)),_===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(Z=i.RG8UI),$===i.UNSIGNED_SHORT&&(Z=i.RG16UI),$===i.UNSIGNED_INT&&(Z=i.RG32UI),$===i.BYTE&&(Z=i.RG8I),$===i.SHORT&&(Z=i.RG16I),$===i.INT&&(Z=i.RG32I)),_===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),$===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),$===i.UNSIGNED_INT&&(Z=i.RGB32UI),$===i.BYTE&&(Z=i.RGB8I),$===i.SHORT&&(Z=i.RGB16I),$===i.INT&&(Z=i.RGB32I)),_===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),$===i.UNSIGNED_INT&&(Z=i.RGBA32UI),$===i.BYTE&&(Z=i.RGBA8I),$===i.SHORT&&(Z=i.RGBA16I),$===i.INT&&(Z=i.RGBA32I)),_===i.RGB&&($===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),$===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),_===i.RGBA){let Pt=et?Bs:te.getTransfer(J);$===i.FLOAT&&(Z=i.RGBA32F),$===i.HALF_FLOAT&&(Z=i.RGBA16F),$===i.UNSIGNED_BYTE&&(Z=Pt===oe?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function y(C,_){let $;return C?_===null||_===Ji||_===ds?$=i.DEPTH24_STENCIL8:_===si?$=i.DEPTH32F_STENCIL8:_===hs&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ji||_===ds?$=i.DEPTH_COMPONENT24:_===si?$=i.DEPTH_COMPONENT32F:_===hs&&($=i.DEPTH_COMPONENT16),$}function E(C,_){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Pn&&C.minFilter!==Vn?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function T(C){let _=C.target;_.removeEventListener("dispose",T),I(_),_.isVideoTexture&&d.delete(_)}function A(C){let _=C.target;_.removeEventListener("dispose",A),w(_)}function I(C){let _=n.get(C);if(_.__webglInit===void 0)return;let $=C.source,J=p.get($);if(J){let et=J[_.__cacheKey];et.usedTimes--,et.usedTimes===0&&b(C),Object.keys(J).length===0&&p.delete($)}n.remove(C)}function b(C){let _=n.get(C);i.deleteTexture(_.__webglTexture);let $=C.source,J=p.get($);delete J[_.__cacheKey],o.memory.textures--}function w(C){let _=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(_.__webglFramebuffer[J]))for(let et=0;et<_.__webglFramebuffer[J].length;et++)i.deleteFramebuffer(_.__webglFramebuffer[J][et]);else i.deleteFramebuffer(_.__webglFramebuffer[J]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[J])}else{if(Array.isArray(_.__webglFramebuffer))for(let J=0;J<_.__webglFramebuffer.length;J++)i.deleteFramebuffer(_.__webglFramebuffer[J]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let J=0;J<_.__webglColorRenderbuffer.length;J++)_.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[J]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let $=C.textures;for(let J=0,et=$.length;J<et;J++){let Z=n.get($[J]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove($[J])}n.remove(C)}let P=0;function k(){P=0}function G(){let C=P;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),P+=1,C}function N(C){let _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function L(C,_){let $=n.get(C);if(C.isVideoTexture&&Gt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&$.__version!==C.version){let J=C.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V($,C,_);return}}else C.isExternalTexture&&($.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+_)}function O(C,_){let $=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&$.__version!==C.version){V($,C,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+_)}function W(C,_){let $=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&$.__version!==C.version){V($,C,_);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+_)}function z(C,_){let $=n.get(C);if(C.version>0&&$.__version!==C.version){q($,C,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+_)}let Q={[Ra]:i.REPEAT,[Oi]:i.CLAMP_TO_EDGE,[Ca]:i.MIRRORED_REPEAT},nt={[Pn]:i.NEAREST,[Fp]:i.NEAREST_MIPMAP_NEAREST,[fo]:i.NEAREST_MIPMAP_LINEAR,[Vn]:i.LINEAR,[ml]:i.LINEAR_MIPMAP_NEAREST,[ji]:i.LINEAR_MIPMAP_LINEAR},ht={[zp]:i.NEVER,[Xp]:i.ALWAYS,[Hp]:i.LESS,[Uh]:i.LEQUAL,[Vp]:i.EQUAL,[$p]:i.GEQUAL,[Gp]:i.GREATER,[Wp]:i.NOTEQUAL};function dt(C,_){if(_.type===si&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Vn||_.magFilter===ml||_.magFilter===fo||_.magFilter===ji||_.minFilter===Vn||_.minFilter===ml||_.minFilter===fo||_.minFilter===ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Q[_.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Q[_.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Q[_.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,nt[_.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,nt[_.minFilter]),_.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ht[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Pn||_.minFilter!==fo&&_.minFilter!==ji||_.type===si&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let $=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function zt(C,_){let $=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",T));let J=_.source,et=p.get(J);et===void 0&&(et={},p.set(J,et));let Z=N(_);if(Z!==C.__cacheKey){et[Z]===void 0&&(et[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,$=!0),et[Z].usedTimes++;let Pt=et[C.__cacheKey];Pt!==void 0&&(et[C.__cacheKey].usedTimes--,Pt.usedTimes===0&&b(_)),C.__cacheKey=Z,C.__webglTexture=et[Z].texture}return $}function Vt(C,_,$){return Math.floor(Math.floor(C/$)/_)}function yt(C,_,$,J){let Z=C.updateRanges;if(Z.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,$,J,_.data);else{Z.sort((st,vt)=>st.start-vt.start);let Pt=0;for(let st=1;st<Z.length;st++){let vt=Z[Pt],Ot=Z[st],Lt=vt.start+vt.count,bt=Vt(Ot.start,_.width,4),$t=Vt(vt.start,_.width,4);Ot.start<=Lt+1&&bt===$t&&Vt(Ot.start+Ot.count-1,_.width,4)===bt?vt.count=Math.max(vt.count,Ot.start+Ot.count-vt.start):(++Pt,Z[Pt]=Ot)}Z.length=Pt+1;let ct=i.getParameter(i.UNPACK_ROW_LENGTH),Tt=i.getParameter(i.UNPACK_SKIP_PIXELS),At=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let st=0,vt=Z.length;st<vt;st++){let Ot=Z[st],Lt=Math.floor(Ot.start/4),bt=Math.ceil(Ot.count/4),$t=Lt%_.width,F=Math.floor(Lt/_.width),at=bt,pt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,$t),i.pixelStorei(i.UNPACK_SKIP_ROWS,F),e.texSubImage2D(i.TEXTURE_2D,0,$t,F,at,pt,$,J,_.data)}C.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Tt),i.pixelStorei(i.UNPACK_SKIP_ROWS,At)}}function V(C,_,$){let J=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(J=i.TEXTURE_3D);let et=zt(C,_),Z=_.source;e.bindTexture(J,C.__webglTexture,i.TEXTURE0+$);let Pt=n.get(Z);if(Z.version!==Pt.__version||et===!0){e.activeTexture(i.TEXTURE0+$);let ct=te.getPrimaries(te.workingColorSpace),Tt=_.colorSpace===Ei?null:te.getPrimaries(_.colorSpace),At=_.colorSpace===Ei||ct===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);let st=x(_.image,!1,r.maxTextureSize);st=Ee(_,st);let vt=s.convert(_.format,_.colorSpace),Ot=s.convert(_.type),Lt=v(_.internalFormat,vt,Ot,_.colorSpace,_.isVideoTexture);dt(J,_);let bt,$t=_.mipmaps,F=_.isVideoTexture!==!0,at=Pt.__version===void 0||et===!0,pt=Z.dataReady,Mt=E(_,st);if(_.isDepthTexture)Lt=y(_.format===ps,_.type),at&&(F?e.texStorage2D(i.TEXTURE_2D,1,Lt,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Lt,st.width,st.height,0,vt,Ot,null));else if(_.isDataTexture)if($t.length>0){F&&at&&e.texStorage2D(i.TEXTURE_2D,Mt,Lt,$t[0].width,$t[0].height);for(let j=0,K=$t.length;j<K;j++)bt=$t[j],F?pt&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,bt.width,bt.height,vt,Ot,bt.data):e.texImage2D(i.TEXTURE_2D,j,Lt,bt.width,bt.height,0,vt,Ot,bt.data);_.generateMipmaps=!1}else F?(at&&e.texStorage2D(i.TEXTURE_2D,Mt,Lt,st.width,st.height),pt&&yt(_,st,vt,Ot)):e.texImage2D(i.TEXTURE_2D,0,Lt,st.width,st.height,0,vt,Ot,st.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){F&&at&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Lt,$t[0].width,$t[0].height,st.depth);for(let j=0,K=$t.length;j<K;j++)if(bt=$t[j],_.format!==Ln)if(vt!==null)if(F){if(pt)if(_.layerUpdates.size>0){let Rt=Gh(bt.width,bt.height,_.format,_.type);for(let Nt of _.layerUpdates){let ye=bt.data.subarray(Nt*Rt/bt.data.BYTES_PER_ELEMENT,(Nt+1)*Rt/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Nt,bt.width,bt.height,1,vt,ye)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,bt.width,bt.height,st.depth,vt,bt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Lt,bt.width,bt.height,st.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?pt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,bt.width,bt.height,st.depth,vt,Ot,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Lt,bt.width,bt.height,st.depth,0,vt,Ot,bt.data)}else{F&&at&&e.texStorage2D(i.TEXTURE_2D,Mt,Lt,$t[0].width,$t[0].height);for(let j=0,K=$t.length;j<K;j++)bt=$t[j],_.format!==Ln?vt!==null?F?pt&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,bt.width,bt.height,vt,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Lt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?pt&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,bt.width,bt.height,vt,Ot,bt.data):e.texImage2D(i.TEXTURE_2D,j,Lt,bt.width,bt.height,0,vt,Ot,bt.data)}else if(_.isDataArrayTexture)if(F){if(at&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Lt,st.width,st.height,st.depth),pt)if(_.layerUpdates.size>0){let j=Gh(st.width,st.height,_.format,_.type);for(let K of _.layerUpdates){let Rt=st.data.subarray(K*j/st.data.BYTES_PER_ELEMENT,(K+1)*j/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,st.width,st.height,1,vt,Ot,Rt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,vt,Ot,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Lt,st.width,st.height,st.depth,0,vt,Ot,st.data);else if(_.isData3DTexture)F?(at&&e.texStorage3D(i.TEXTURE_3D,Mt,Lt,st.width,st.height,st.depth),pt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,vt,Ot,st.data)):e.texImage3D(i.TEXTURE_3D,0,Lt,st.width,st.height,st.depth,0,vt,Ot,st.data);else if(_.isFramebufferTexture){if(at)if(F)e.texStorage2D(i.TEXTURE_2D,Mt,Lt,st.width,st.height);else{let j=st.width,K=st.height;for(let Rt=0;Rt<Mt;Rt++)e.texImage2D(i.TEXTURE_2D,Rt,Lt,j,K,0,vt,Ot,null),j>>=1,K>>=1}}else if($t.length>0){if(F&&at){let j=Qt($t[0]);e.texStorage2D(i.TEXTURE_2D,Mt,Lt,j.width,j.height)}for(let j=0,K=$t.length;j<K;j++)bt=$t[j],F?pt&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,vt,Ot,bt):e.texImage2D(i.TEXTURE_2D,j,Lt,vt,Ot,bt);_.generateMipmaps=!1}else if(F){if(at){let j=Qt(st);e.texStorage2D(i.TEXTURE_2D,Mt,Lt,j.width,j.height)}pt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Ot,st)}else e.texImage2D(i.TEXTURE_2D,0,Lt,vt,Ot,st);g(_)&&f(J),Pt.__version=Z.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function q(C,_,$){if(_.image.length!==6)return;let J=zt(C,_),et=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+$);let Z=n.get(et);if(et.version!==Z.__version||J===!0){e.activeTexture(i.TEXTURE0+$);let Pt=te.getPrimaries(te.workingColorSpace),ct=_.colorSpace===Ei?null:te.getPrimaries(_.colorSpace),Tt=_.colorSpace===Ei||Pt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let At=_.isCompressedTexture||_.image[0].isCompressedTexture,st=_.image[0]&&_.image[0].isDataTexture,vt=[];for(let K=0;K<6;K++)!At&&!st?vt[K]=x(_.image[K],!0,r.maxCubemapSize):vt[K]=st?_.image[K].image:_.image[K],vt[K]=Ee(_,vt[K]);let Ot=vt[0],Lt=s.convert(_.format,_.colorSpace),bt=s.convert(_.type),$t=v(_.internalFormat,Lt,bt,_.colorSpace),F=_.isVideoTexture!==!0,at=Z.__version===void 0||J===!0,pt=et.dataReady,Mt=E(_,Ot);dt(i.TEXTURE_CUBE_MAP,_);let j;if(At){F&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,$t,Ot.width,Ot.height);for(let K=0;K<6;K++){j=vt[K].mipmaps;for(let Rt=0;Rt<j.length;Rt++){let Nt=j[Rt];_.format!==Ln?Lt!==null?F?pt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt,0,0,Nt.width,Nt.height,Lt,Nt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt,$t,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt,0,0,Nt.width,Nt.height,Lt,bt,Nt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt,$t,Nt.width,Nt.height,0,Lt,bt,Nt.data)}}}else{if(j=_.mipmaps,F&&at){j.length>0&&Mt++;let K=Qt(vt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,$t,K.width,K.height)}for(let K=0;K<6;K++)if(st){F?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,vt[K].width,vt[K].height,Lt,bt,vt[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,$t,vt[K].width,vt[K].height,0,Lt,bt,vt[K].data);for(let Rt=0;Rt<j.length;Rt++){let ye=j[Rt].image[K].image;F?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt+1,0,0,ye.width,ye.height,Lt,bt,ye.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt+1,$t,ye.width,ye.height,0,Lt,bt,ye.data)}}else{F?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Lt,bt,vt[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,$t,Lt,bt,vt[K]);for(let Rt=0;Rt<j.length;Rt++){let Nt=j[Rt];F?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt+1,0,0,Lt,bt,Nt.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Rt+1,$t,Lt,bt,Nt.image[K])}}}g(_)&&f(i.TEXTURE_CUBE_MAP),Z.__version=et.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function ot(C,_,$,J,et,Z){let Pt=s.convert($.format,$.colorSpace),ct=s.convert($.type),Tt=v($.internalFormat,Pt,ct,$.colorSpace),At=n.get(_),st=n.get($);if(st.__renderTarget=_,!At.__hasExternalTextures){let vt=Math.max(1,_.width>>Z),Ot=Math.max(1,_.height>>Z);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,Z,Tt,vt,Ot,_.depth,0,Pt,ct,null):e.texImage2D(et,Z,Tt,vt,Ot,0,Pt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),wt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,et,st.__webglTexture,0,Jt(_)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,et,st.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(C,_,$){if(i.bindRenderbuffer(i.RENDERBUFFER,C),_.depthBuffer){let J=_.depthTexture,et=J&&J.isDepthTexture?J.type:null,Z=y(_.stencilBuffer,et),Pt=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=Jt(_);wt(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,Z,_.width,_.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,Z,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Z,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Pt,i.RENDERBUFFER,C)}else{let J=_.textures;for(let et=0;et<J.length;et++){let Z=J[et],Pt=s.convert(Z.format,Z.colorSpace),ct=s.convert(Z.type),Tt=v(Z.internalFormat,Pt,ct,Z.colorSpace),At=Jt(_);$&&wt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,At,Tt,_.width,_.height):wt(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,At,Tt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xt(C,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=n.get(_.depthTexture);J.__renderTarget=_,(!J.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),L(_.depthTexture,0);let et=J.__webglTexture,Z=Jt(_);if(_.depthTexture.format===Qr)wt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(_.depthTexture.format===ps)wt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function rt(C){let _=n.get(C),$=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){let J=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),J){let et=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,J.removeEventListener("dispose",et)};J.addEventListener("dispose",et),_.__depthDisposeCallback=et}_.__boundDepthTexture=J}if(C.depthTexture&&!_.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");let J=C.texture.mipmaps;J&&J.length>0?xt(_.__webglFramebuffer[0],C):xt(_.__webglFramebuffer,C)}else if($){_.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[J]),_.__webglDepthbuffer[J]===void 0)_.__webglDepthbuffer[J]=i.createRenderbuffer(),ft(_.__webglDepthbuffer[J],C,!1);else{let et=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=_.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,Z)}}else{let J=C.texture.mipmaps;if(J&&J.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),ft(_.__webglDepthbuffer,C,!1);else{let et=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,Z)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(C,_,$){let J=n.get(C);_!==void 0&&ot(J.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&rt(C)}function R(C){let _=C.texture,$=n.get(C),J=n.get(_);C.addEventListener("dispose",A);let et=C.textures,Z=C.isWebGLCubeRenderTarget===!0,Pt=et.length>1;if(Pt||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=_.version,o.memory.textures++),Z){$.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(_.mipmaps&&_.mipmaps.length>0){$.__webglFramebuffer[ct]=[];for(let Tt=0;Tt<_.mipmaps.length;Tt++)$.__webglFramebuffer[ct][Tt]=i.createFramebuffer()}else $.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){$.__webglFramebuffer=[];for(let ct=0;ct<_.mipmaps.length;ct++)$.__webglFramebuffer[ct]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(Pt)for(let ct=0,Tt=et.length;ct<Tt;ct++){let At=n.get(et[ct]);At.__webglTexture===void 0&&(At.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&wt(C)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let ct=0;ct<et.length;ct++){let Tt=et[ct];$.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[ct]);let At=s.convert(Tt.format,Tt.colorSpace),st=s.convert(Tt.type),vt=v(Tt.internalFormat,At,st,Tt.colorSpace,C.isXRRenderTarget===!0),Ot=Jt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ot,vt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,$.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),ft($.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),dt(i.TEXTURE_CUBE_MAP,_);for(let ct=0;ct<6;ct++)if(_.mipmaps&&_.mipmaps.length>0)for(let Tt=0;Tt<_.mipmaps.length;Tt++)ot($.__webglFramebuffer[ct][Tt],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Tt);else ot($.__webglFramebuffer[ct],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);g(_)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Pt){for(let ct=0,Tt=et.length;ct<Tt;ct++){let At=et[ct],st=n.get(At),vt=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(vt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(vt,st.__webglTexture),dt(vt,At),ot($.__webglFramebuffer,C,At,i.COLOR_ATTACHMENT0+ct,vt,0),g(At)&&f(vt)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ct=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,J.__webglTexture),dt(ct,_),_.mipmaps&&_.mipmaps.length>0)for(let Tt=0;Tt<_.mipmaps.length;Tt++)ot($.__webglFramebuffer[Tt],C,_,i.COLOR_ATTACHMENT0,ct,Tt);else ot($.__webglFramebuffer,C,_,i.COLOR_ATTACHMENT0,ct,0);g(_)&&f(ct),e.unbindTexture()}C.depthBuffer&&rt(C)}function Ft(C){let _=C.textures;for(let $=0,J=_.length;$<J;$++){let et=_[$];if(g(et)){let Z=M(C),Pt=n.get(et).__webglTexture;e.bindTexture(Z,Pt),f(Z),e.unbindTexture()}}}let St=[],It=[];function mt(C){if(C.samples>0){if(wt(C)===!1){let _=C.textures,$=C.width,J=C.height,et=i.COLOR_BUFFER_BIT,Z=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Pt=n.get(C),ct=_.length>1;if(ct)for(let At=0;At<_.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer);let Tt=C.texture.mipmaps;Tt&&Tt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer);for(let At=0;At<_.length;At++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[At]);let st=n.get(_[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,$,J,0,0,$,J,et,i.NEAREST),c===!0&&(St.length=0,It.length=0,St.push(i.COLOR_ATTACHMENT0+At),C.depthBuffer&&C.resolveDepthBuffer===!1&&(St.push(Z),It.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,It)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,St))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let At=0;At<_.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[At]);let st=n.get(_[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,st,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let _=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Jt(C){return Math.min(r.maxSamples,C.samples)}function wt(C){let _=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Gt(C){let _=o.render.frame;d.get(C)!==_&&(d.set(C,_),C.update())}function Ee(C,_){let $=C.colorSpace,J=C.format,et=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||$!==mr&&$!==Ei&&(te.getTransfer($)===oe?(J!==Ln||et!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),_}function Qt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=k,this.setTexture2D=L,this.setTexture2DArray=O,this.setTexture3D=W,this.setTextureCube=z,this.rebindTextures=ut,this.setupRenderTarget=R,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=wt}function mv(i,t){function e(n,r=Ei){let s,o=te.getTransfer(r);if(n===Xn)return i.UNSIGNED_BYTE;if(n===xl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Rh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ch)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Th)return i.BYTE;if(n===Ah)return i.SHORT;if(n===hs)return i.UNSIGNED_SHORT;if(n===gl)return i.INT;if(n===Ji)return i.UNSIGNED_INT;if(n===si)return i.FLOAT;if(n===kn)return i.HALF_FLOAT;if(n===Ih)return i.ALPHA;if(n===Ph)return i.RGB;if(n===Ln)return i.RGBA;if(n===Qr)return i.DEPTH_COMPONENT;if(n===ps)return i.DEPTH_STENCIL;if(n===kh)return i.RED;if(n===vl)return i.RED_INTEGER;if(n===Lh)return i.RG;if(n===yl)return i.RG_INTEGER;if(n===_l)return i.RGBA_INTEGER;if(n===mo||n===go||n===xo||n===bo)if(o===oe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===mo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===go)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===bo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===mo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===go)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===bo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wl||n===Ml||n===Sl||n===El)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===wl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ml)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Sl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===El)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tl||n===Al||n===Rl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Tl||n===Al)return o===oe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Rl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Cl||n===Il||n===Pl||n===kl||n===Ll||n===Dl||n===Ul||n===Fl||n===Nl||n===Bl||n===Ol||n===zl||n===Hl||n===Vl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Cl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Il)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===kl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ll)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Dl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ul)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Nl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ol)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Hl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vl)return o===oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Gl||n===Wl||n===$l)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Gl)return o===oe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Wl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===$l)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xl||n===ql||n===Yl||n===Zl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Xl)return s.COMPRESSED_RED_RGTC1_EXT;if(n===ql)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Yl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Zl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ds?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var gv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,nd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Ks(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ce({vertexShader:gv,fragmentShader:xv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ve(new Wi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},id=class extends ni{constructor(t,e){super();let n=this,r=null,s=1,o=null,a="local-floor",c=1,l=null,d=null,h=null,p=null,u=null,m=null,x=typeof XRWebGLBinding<"u",g=new nd,f={},M=e.getContextAttributes(),v=null,y=null,E=[],T=[],A=new Ct,I=null,b=new tn;b.viewport=new fe;let w=new tn;w.viewport=new fe;let P=[b,w],k=new Ja,G=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let q=E[V];return q===void 0&&(q=new rs,E[V]=q),q.getTargetRaySpace()},this.getControllerGrip=function(V){let q=E[V];return q===void 0&&(q=new rs,E[V]=q),q.getGripSpace()},this.getHand=function(V){let q=E[V];return q===void 0&&(q=new rs,E[V]=q),q.getHandSpace()};function L(V){let q=T.indexOf(V.inputSource);if(q===-1)return;let ot=E[q];ot!==void 0&&(ot.update(V.inputSource,V.frame,l||o),ot.dispatchEvent({type:V.type,data:V.inputSource}))}function O(){r.removeEventListener("select",L),r.removeEventListener("selectstart",L),r.removeEventListener("selectend",L),r.removeEventListener("squeeze",L),r.removeEventListener("squeezestart",L),r.removeEventListener("squeezeend",L),r.removeEventListener("end",O),r.removeEventListener("inputsourceschange",W);for(let V=0;V<E.length;V++){let q=T[V];q!==null&&(T[V]=null,E[V].disconnect(q))}G=null,N=null,g.reset();for(let V in f)delete f[V];t.setRenderTarget(v),u=null,p=null,h=null,r=null,y=null,yt.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){s=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(r,e)),h},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(v=t.getRenderTarget(),r.addEventListener("select",L),r.addEventListener("selectstart",L),r.addEventListener("selectend",L),r.addEventListener("squeeze",L),r.addEventListener("squeezestart",L),r.addEventListener("squeezeend",L),r.addEventListener("end",O),r.addEventListener("inputsourceschange",W),M.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ot=null,ft=null,xt=null;M.depth&&(xt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=M.stencil?ps:Qr,ft=M.stencil?ds:Ji);let rt={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:s};h=this.getBinding(),p=h.createProjectionLayer(rt),r.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),y=new en(p.textureWidth,p.textureHeight,{format:Ln,type:Xn,depthTexture:new Js(p.textureWidth,p.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let ot={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(r,e,ot),r.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new en(u.framebufferWidth,u.framebufferHeight,{format:Ln,type:Xn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),yt.setContext(r),yt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function W(V){for(let q=0;q<V.removed.length;q++){let ot=V.removed[q],ft=T.indexOf(ot);ft>=0&&(T[ft]=null,E[ft].disconnect(ot))}for(let q=0;q<V.added.length;q++){let ot=V.added[q],ft=T.indexOf(ot);if(ft===-1){for(let rt=0;rt<E.length;rt++)if(rt>=T.length){T.push(ot),ft=rt;break}else if(T[rt]===null){T[rt]=ot,ft=rt;break}if(ft===-1)break}let xt=E[ft];xt&&xt.connect(ot)}}let z=new U,Q=new U;function nt(V,q,ot){z.setFromMatrixPosition(q.matrixWorld),Q.setFromMatrixPosition(ot.matrixWorld);let ft=z.distanceTo(Q),xt=q.projectionMatrix.elements,rt=ot.projectionMatrix.elements,ut=xt[14]/(xt[10]-1),R=xt[14]/(xt[10]+1),Ft=(xt[9]+1)/xt[5],St=(xt[9]-1)/xt[5],It=(xt[8]-1)/xt[0],mt=(rt[8]+1)/rt[0],Jt=ut*It,wt=ut*mt,Gt=ft/(-It+mt),Ee=Gt*-It;if(q.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Ee),V.translateZ(Gt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),xt[10]===-1)V.projectionMatrix.copy(q.projectionMatrix),V.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{let Qt=ut+Gt,C=R+Gt,_=Jt-Ee,$=wt+(ft-Ee),J=Ft*R/C*Qt,et=St*R/C*Qt;V.projectionMatrix.makePerspective(_,$,J,et,Qt,C),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function ht(V,q){q===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(q.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;let q=V.near,ot=V.far;g.texture!==null&&(g.depthNear>0&&(q=g.depthNear),g.depthFar>0&&(ot=g.depthFar)),k.near=w.near=b.near=q,k.far=w.far=b.far=ot,(G!==k.near||N!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),G=k.near,N=k.far),k.layers.mask=V.layers.mask|6,b.layers.mask=k.layers.mask&3,w.layers.mask=k.layers.mask&5;let ft=V.parent,xt=k.cameras;ht(k,ft);for(let rt=0;rt<xt.length;rt++)ht(xt[rt],ft);xt.length===2?nt(k,b,w):k.projectionMatrix.copy(b.projectionMatrix),dt(V,k,ft)};function dt(V,q,ot){ot===null?V.matrix.copy(q.matrixWorld):(V.matrix.copy(ot.matrixWorld),V.matrix.invert(),V.matrix.multiply(q.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(q.projectionMatrix),V.projectionMatrixInverse.copy(q.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=ts*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(p===null&&u===null))return c},this.setFoveation=function(V){c=V,p!==null&&(p.fixedFoveation=V),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=V)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(V){return f[V]};let zt=null;function Vt(V,q){if(d=q.getViewerPose(l||o),m=q,d!==null){let ot=d.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let ft=!1;ot.length!==k.cameras.length&&(k.cameras.length=0,ft=!0);for(let R=0;R<ot.length;R++){let Ft=ot[R],St=null;if(u!==null)St=u.getViewport(Ft);else{let mt=h.getViewSubImage(p,Ft);St=mt.viewport,R===0&&(t.setRenderTargetTextures(y,mt.colorTexture,mt.depthStencilTexture),t.setRenderTarget(y))}let It=P[R];It===void 0&&(It=new tn,It.layers.enable(R),It.viewport=new fe,P[R]=It),It.matrix.fromArray(Ft.transform.matrix),It.matrix.decompose(It.position,It.quaternion,It.scale),It.projectionMatrix.fromArray(Ft.projectionMatrix),It.projectionMatrixInverse.copy(It.projectionMatrix).invert(),It.viewport.set(St.x,St.y,St.width,St.height),R===0&&(k.matrix.copy(It.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),ft===!0&&k.cameras.push(It)}let xt=r.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){h=n.getBinding();let R=h.getDepthInformation(ot[0]);R&&R.isValid&&R.texture&&g.init(R,r.renderState)}if(xt&&xt.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let R=0;R<ot.length;R++){let Ft=ot[R].camera;if(Ft){let St=f[Ft];St||(St=new Ks,f[Ft]=St);let It=h.getCameraImage(Ft);St.sourceTexture=It}}}}for(let ot=0;ot<E.length;ot++){let ft=T[ot],xt=E[ot];ft!==null&&xt!==void 0&&xt.update(ft,q,l||o)}zt&&zt(V,q),q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:q}),m=null}let yt=new Su;yt.setAnimationLoop(Vt),this.setAnimationLoop=function(V){zt=V},this.dispose=function(){}}},Er=new Gn,bv=new _e;function vv(i,t){function e(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,Oh(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function r(g,f,M,v,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(g,f):f.isMeshToonMaterial?(s(g,f),h(g,f)):f.isMeshPhongMaterial?(s(g,f),d(g,f)):f.isMeshStandardMaterial?(s(g,f),p(g,f),f.isMeshPhysicalMaterial&&u(g,f,y)):f.isMeshMatcapMaterial?(s(g,f),m(g,f)):f.isMeshDepthMaterial?s(g,f):f.isMeshDistanceMaterial?(s(g,f),x(g,f)):f.isMeshNormalMaterial?s(g,f):f.isLineBasicMaterial?(o(g,f),f.isLineDashedMaterial&&a(g,f)):f.isPointsMaterial?c(g,f,M,v):f.isSpriteMaterial?l(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,e(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===dn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,e(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===dn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,e(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,e(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);let M=t.get(f),v=M.envMap,y=M.envMapRotation;v&&(g.envMap.value=v,Er.copy(y),Er.x*=-1,Er.y*=-1,Er.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Er.y*=-1,Er.z*=-1),g.envMapRotation.value.setFromMatrix4(bv.makeRotationFromEuler(Er)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,g.aoMapTransform))}function o(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform))}function a(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,M,v){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*M,g.scale.value=v*.5,f.map&&(g.map.value=f.map,e(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function l(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function h(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function p(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function u(g,f,M){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===dn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function x(g,f){let M=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function yv(i,t,e,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,v){let y=v.program;n.uniformBlockBinding(M,y)}function l(M,v){let y=r[M.id];y===void 0&&(m(M),y=d(M),r[M.id]=y,M.addEventListener("dispose",g));let E=v.program;n.updateUBOMapping(M,E);let T=t.render.frame;s[M.id]!==T&&(p(M),s[M.id]=T)}function d(M){let v=h();M.__bindingPointIndex=v;let y=i.createBuffer(),E=M.__size,T=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(M){let v=r[M.id],y=M.uniforms,E=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let T=0,A=y.length;T<A;T++){let I=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,w=I.length;b<w;b++){let P=I[b];if(u(P,T,b,E)===!0){let k=P.__offset,G=Array.isArray(P.value)?P.value:[P.value],N=0;for(let L=0;L<G.length;L++){let O=G[L],W=x(O);typeof O=="number"||typeof O=="boolean"?(P.__data[0]=O,i.bufferSubData(i.UNIFORM_BUFFER,k+N,P.__data)):O.isMatrix3?(P.__data[0]=O.elements[0],P.__data[1]=O.elements[1],P.__data[2]=O.elements[2],P.__data[3]=0,P.__data[4]=O.elements[3],P.__data[5]=O.elements[4],P.__data[6]=O.elements[5],P.__data[7]=0,P.__data[8]=O.elements[6],P.__data[9]=O.elements[7],P.__data[10]=O.elements[8],P.__data[11]=0):(O.toArray(P.__data,N),N+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(M,v,y,E){let T=M.value,A=v+"_"+y;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{let I=E[A];if(typeof T=="number"||typeof T=="boolean"){if(I!==T)return E[A]=T,!0}else if(I.equals(T)===!1)return I.copy(T),!0}return!1}function m(M){let v=M.uniforms,y=0,E=16;for(let A=0,I=v.length;A<I;A++){let b=Array.isArray(v[A])?v[A]:[v[A]];for(let w=0,P=b.length;w<P;w++){let k=b[w],G=Array.isArray(k.value)?k.value:[k.value];for(let N=0,L=G.length;N<L;N++){let O=G[N],W=x(O),z=y%E,Q=z%W.boundary,nt=z+Q;y+=Q,nt!==0&&E-nt<W.storage&&(y+=E-nt),k.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=W.storage}}}let T=y%E;return T>0&&(y+=E-T),M.__size=y,M.__cache={},this}function x(M){let v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function g(M){let v=M.target;v.removeEventListener("dispose",g);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function f(){for(let M in r)i.deleteBuffer(r[M]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}var tc=class{constructor(t={}){let{canvas:e=qp(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;let m=new Uint32Array(4),x=new Int32Array(4),g=null,f=null,M=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,E=!1;this._outputColorSpace=_n;let T=0,A=0,I=null,b=-1,w=null,P=new fe,k=new fe,G=null,N=new Dt(0),L=0,O=e.width,W=e.height,z=1,Q=null,nt=null,ht=new fe(0,0,O,W),dt=new fe(0,0,O,W),zt=!1,Vt=new ss,yt=!1,V=!1,q=new _e,ot=new U,ft=new fe,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},rt=!1;function ut(){return I===null?z:1}let R=n;function Ft(S,B){return e.getContext(S,B)}try{let S={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",pt,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",j,!1),R===null){let B="webgl2";if(R=Ft(B,S),R===null)throw Ft(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let St,It,mt,Jt,wt,Gt,Ee,Qt,C,_,$,J,et,Z,Pt,ct,Tt,At,st,vt,Ot,Lt,bt,$t;function F(){St=new Bx(R),St.init(),Lt=new mv(R,St),It=new Px(R,St,t,Lt),mt=new uv(R,St),It.reversedDepthBuffer&&p&&mt.buffers.depth.setReversed(!0),Jt=new Hx(R),wt=new tv,Gt=new fv(R,St,mt,wt,It,Lt,Jt),Ee=new Lx(y),Qt=new Nx(y),C=new qm(R),bt=new Cx(R,C),_=new Ox(R,C,Jt,bt),$=new Gx(R,_,C,Jt),st=new Vx(R,It,Gt),ct=new kx(wt),J=new Qb(y,Ee,Qt,St,It,bt,ct),et=new vv(y,wt),Z=new nv,Pt=new lv(St),At=new Rx(y,Ee,Qt,mt,$,u,c),Tt=new dv(y,$,It),$t=new yv(R,Jt,It,mt),vt=new Ix(R,St,Jt),Ot=new zx(R,St,Jt),Jt.programs=J.programs,y.capabilities=It,y.extensions=St,y.properties=wt,y.renderLists=Z,y.shadowMap=Tt,y.state=mt,y.info=Jt}F();let at=new id(y,R);this.xr=at,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let S=St.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=St.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(S){S!==void 0&&(z=S,this.setSize(O,W,!1))},this.getSize=function(S){return S.set(O,W)},this.setSize=function(S,B,X=!0){if(at.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=S,W=B,e.width=Math.floor(S*z),e.height=Math.floor(B*z),X===!0&&(e.style.width=S+"px",e.style.height=B+"px"),this.setViewport(0,0,S,B)},this.getDrawingBufferSize=function(S){return S.set(O*z,W*z).floor()},this.setDrawingBufferSize=function(S,B,X){O=S,W=B,z=X,e.width=Math.floor(S*X),e.height=Math.floor(B*X),this.setViewport(0,0,S,B)},this.getCurrentViewport=function(S){return S.copy(P)},this.getViewport=function(S){return S.copy(ht)},this.setViewport=function(S,B,X,Y){S.isVector4?ht.set(S.x,S.y,S.z,S.w):ht.set(S,B,X,Y),mt.viewport(P.copy(ht).multiplyScalar(z).round())},this.getScissor=function(S){return S.copy(dt)},this.setScissor=function(S,B,X,Y){S.isVector4?dt.set(S.x,S.y,S.z,S.w):dt.set(S,B,X,Y),mt.scissor(k.copy(dt).multiplyScalar(z).round())},this.getScissorTest=function(){return zt},this.setScissorTest=function(S){mt.setScissorTest(zt=S)},this.setOpaqueSort=function(S){Q=S},this.setTransparentSort=function(S){nt=S},this.getClearColor=function(S){return S.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor(...arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha(...arguments)},this.clear=function(S=!0,B=!0,X=!0){let Y=0;if(S){let H=!1;if(I!==null){let lt=I.texture.format;H=lt===_l||lt===yl||lt===vl}if(H){let lt=I.texture.type,_t=lt===Xn||lt===Ji||lt===hs||lt===ds||lt===xl||lt===bl,kt=At.getClearColor(),Et=At.getClearAlpha(),Ht=kt.r,Wt=kt.g,Ut=kt.b;_t?(m[0]=Ht,m[1]=Wt,m[2]=Ut,m[3]=Et,R.clearBufferuiv(R.COLOR,0,m)):(x[0]=Ht,x[1]=Wt,x[2]=Ut,x[3]=Et,R.clearBufferiv(R.COLOR,0,x))}else Y|=R.COLOR_BUFFER_BIT}B&&(Y|=R.DEPTH_BUFFER_BIT),X&&(Y|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",pt,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",j,!1),At.dispose(),Z.dispose(),Pt.dispose(),wt.dispose(),Ee.dispose(),Qt.dispose(),$.dispose(),bt.dispose(),$t.dispose(),J.dispose(),at.dispose(),at.removeEventListener("sessionstart",ei),at.removeEventListener("sessionend",kd),ar.stop()};function pt(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let S=Jt.autoReset,B=Tt.enabled,X=Tt.autoUpdate,Y=Tt.needsUpdate,H=Tt.type;F(),Jt.autoReset=S,Tt.enabled=B,Tt.autoUpdate=X,Tt.needsUpdate=Y,Tt.type=H}function j(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function K(S){let B=S.target;B.removeEventListener("dispose",K),Rt(B)}function Rt(S){Nt(S),wt.remove(S)}function Nt(S){let B=wt.get(S).programs;B!==void 0&&(B.forEach(function(X){J.releaseProgram(X)}),S.isShaderMaterial&&J.releaseShaderCache(S))}this.renderBufferDirect=function(S,B,X,Y,H,lt){B===null&&(B=xt);let _t=H.isMesh&&H.matrixWorld.determinant()<0,kt=Sf(S,B,X,Y,H);mt.setMaterial(Y,_t);let Et=X.index,Ht=1;if(Y.wireframe===!0){if(Et=_.getWireframeAttribute(X),Et===void 0)return;Ht=2}let Wt=X.drawRange,Ut=X.attributes.position,Kt=Wt.start*Ht,pe=(Wt.start+Wt.count)*Ht;lt!==null&&(Kt=Math.max(Kt,lt.start*Ht),pe=Math.min(pe,(lt.start+lt.count)*Ht)),Et!==null?(Kt=Math.max(Kt,0),pe=Math.min(pe,Et.count)):Ut!=null&&(Kt=Math.max(Kt,0),pe=Math.min(pe,Ut.count));let Le=pe-Kt;if(Le<0||Le===1/0)return;bt.setup(H,Y,kt,X,Et);let we,be=vt;if(Et!==null&&(we=C.get(Et),be=Ot,be.setIndex(we)),H.isMesh)Y.wireframe===!0?(mt.setLineWidth(Y.wireframeLinewidth*ut()),be.setMode(R.LINES)):be.setMode(R.TRIANGLES);else if(H.isLine){let Bt=Y.linewidth;Bt===void 0&&(Bt=1),mt.setLineWidth(Bt*ut()),H.isLineSegments?be.setMode(R.LINES):H.isLineLoop?be.setMode(R.LINE_LOOP):be.setMode(R.LINE_STRIP)}else H.isPoints?be.setMode(R.POINTS):H.isSprite&&be.setMode(R.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)es("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),be.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(St.get("WEBGL_multi_draw"))be.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Bt=H._multiDrawStarts,Te=H._multiDrawCounts,re=H._multiDrawCount,xn=Et?C.get(Et).bytesPerElement:1,Nr=wt.get(Y).currentProgram.getUniforms();for(let bn=0;bn<re;bn++)Nr.setValue(R,"_gl_DrawID",bn),be.render(Bt[bn]/xn,Te[bn])}else if(H.isInstancedMesh)be.renderInstances(Kt,Le,H.count);else if(X.isInstancedBufferGeometry){let Bt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Te=Math.min(X.instanceCount,Bt);be.renderInstances(Kt,Le,Te)}else be.render(Kt,Le)};function ye(S,B,X){S.transparent===!0&&S.side===Ie&&S.forceSinglePass===!1?(S.side=dn,S.needsUpdate=!0,jo(S,B,X),S.side=wi,S.needsUpdate=!0,jo(S,B,X),S.side=Ie):jo(S,B,X)}this.compile=function(S,B,X=null){X===null&&(X=S),f=Pt.get(X),f.init(B),v.push(f),X.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),S!==X&&S.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),f.setupLights();let Y=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let lt=H.material;if(lt)if(Array.isArray(lt))for(let _t=0;_t<lt.length;_t++){let kt=lt[_t];ye(kt,X,H),Y.add(kt)}else ye(lt,X,H),Y.add(lt)}),f=v.pop(),Y},this.compileAsync=function(S,B,X=null){let Y=this.compile(S,B,X);return new Promise(H=>{function lt(){if(Y.forEach(function(_t){wt.get(_t).currentProgram.isReady()&&Y.delete(_t)}),Y.size===0){H(S);return}setTimeout(lt,10)}St.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let ae=null;function fi(S){ae&&ae(S)}function ei(){ar.stop()}function kd(){ar.start()}let ar=new Su;ar.setAnimationLoop(fi),typeof self<"u"&&ar.setContext(self),this.setAnimationLoop=function(S){ae=S,at.setAnimationLoop(S),S===null?ar.stop():ar.start()},at.addEventListener("sessionstart",ei),at.addEventListener("sessionend",kd),this.render=function(S,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(at.cameraAutoUpdate===!0&&at.updateCamera(B),B=at.getCamera()),S.isScene===!0&&S.onBeforeRender(y,S,B,I),f=Pt.get(S,v.length),f.init(B),v.push(f),q.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Vt.setFromProjectionMatrix(q,zn,B.reversedDepth),V=this.localClippingEnabled,yt=ct.init(this.clippingPlanes,V),g=Z.get(S,M.length),g.init(),M.push(g),at.enabled===!0&&at.isPresenting===!0){let lt=y.xr.getDepthSensingMesh();lt!==null&&Dc(lt,B,-1/0,y.sortObjects)}Dc(S,B,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(Q,nt),rt=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,rt&&At.addToRenderList(g,S),this.info.render.frame++,yt===!0&&ct.beginShadows();let X=f.state.shadowsArray;Tt.render(X,S,B),yt===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,H=g.transmissive;if(f.setupLights(),B.isArrayCamera){let lt=B.cameras;if(H.length>0)for(let _t=0,kt=lt.length;_t<kt;_t++){let Et=lt[_t];Dd(Y,H,S,Et)}rt&&At.render(S);for(let _t=0,kt=lt.length;_t<kt;_t++){let Et=lt[_t];Ld(g,S,Et,Et.viewport)}}else H.length>0&&Dd(Y,H,S,B),rt&&At.render(S),Ld(g,S,B);I!==null&&A===0&&(Gt.updateMultisampleRenderTarget(I),Gt.updateRenderTargetMipmap(I)),S.isScene===!0&&S.onAfterRender(y,S,B),bt.resetDefaultState(),b=-1,w=null,v.pop(),v.length>0?(f=v[v.length-1],yt===!0&&ct.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function Dc(S,B,X,Y){if(S.visible===!1)return;if(S.layers.test(B.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(B);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Vt.intersectsSprite(S)){Y&&ft.setFromMatrixPosition(S.matrixWorld).applyMatrix4(q);let _t=$.update(S),kt=S.material;kt.visible&&g.push(S,_t,kt,X,ft.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Vt.intersectsObject(S))){let _t=$.update(S),kt=S.material;if(Y&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ft.copy(S.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),ft.copy(_t.boundingSphere.center)),ft.applyMatrix4(S.matrixWorld).applyMatrix4(q)),Array.isArray(kt)){let Et=_t.groups;for(let Ht=0,Wt=Et.length;Ht<Wt;Ht++){let Ut=Et[Ht],Kt=kt[Ut.materialIndex];Kt&&Kt.visible&&g.push(S,_t,Kt,X,ft.z,Ut)}}else kt.visible&&g.push(S,_t,kt,X,ft.z,null)}}let lt=S.children;for(let _t=0,kt=lt.length;_t<kt;_t++)Dc(lt[_t],B,X,Y)}function Ld(S,B,X,Y){let H=S.opaque,lt=S.transmissive,_t=S.transparent;f.setupLightsView(X),yt===!0&&ct.setGlobalState(y.clippingPlanes,X),Y&&mt.viewport(P.copy(Y)),H.length>0&&Zo(H,B,X),lt.length>0&&Zo(lt,B,X),_t.length>0&&Zo(_t,B,X),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function Dd(S,B,X,Y){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[Y.id]===void 0&&(f.state.transmissionRenderTarget[Y.id]=new en(1,1,{generateMipmaps:!0,type:St.has("EXT_color_buffer_half_float")||St.has("EXT_color_buffer_float")?kn:Xn,minFilter:ji,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace}));let lt=f.state.transmissionRenderTarget[Y.id],_t=Y.viewport||P;lt.setSize(_t.z*y.transmissionResolutionScale,_t.w*y.transmissionResolutionScale);let kt=y.getRenderTarget(),Et=y.getActiveCubeFace(),Ht=y.getActiveMipmapLevel();y.setRenderTarget(lt),y.getClearColor(N),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear(),rt&&At.render(X);let Wt=y.toneMapping;y.toneMapping=Si;let Ut=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),f.setupLightsView(Y),yt===!0&&ct.setGlobalState(y.clippingPlanes,Y),Zo(S,X,Y),Gt.updateMultisampleRenderTarget(lt),Gt.updateRenderTargetMipmap(lt),St.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let pe=0,Le=B.length;pe<Le;pe++){let we=B[pe],be=we.object,Bt=we.geometry,Te=we.material,re=we.group;if(Te.side===Ie&&be.layers.test(Y.layers)){let xn=Te.side;Te.side=dn,Te.needsUpdate=!0,Ud(be,X,Y,Bt,Te,re),Te.side=xn,Te.needsUpdate=!0,Kt=!0}}Kt===!0&&(Gt.updateMultisampleRenderTarget(lt),Gt.updateRenderTargetMipmap(lt))}y.setRenderTarget(kt,Et,Ht),y.setClearColor(N,L),Ut!==void 0&&(Y.viewport=Ut),y.toneMapping=Wt}function Zo(S,B,X){let Y=B.isScene===!0?B.overrideMaterial:null;for(let H=0,lt=S.length;H<lt;H++){let _t=S[H],kt=_t.object,Et=_t.geometry,Ht=_t.group,Wt=_t.material;Wt.allowOverride===!0&&Y!==null&&(Wt=Y),kt.layers.test(X.layers)&&Ud(kt,B,X,Et,Wt,Ht)}}function Ud(S,B,X,Y,H,lt){S.onBeforeRender(y,B,X,Y,H,lt),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(y,B,X,Y,S,lt),H.transparent===!0&&H.side===Ie&&H.forceSinglePass===!1?(H.side=dn,H.needsUpdate=!0,y.renderBufferDirect(X,B,Y,H,S,lt),H.side=wi,H.needsUpdate=!0,y.renderBufferDirect(X,B,Y,H,S,lt),H.side=Ie):y.renderBufferDirect(X,B,Y,H,S,lt),S.onAfterRender(y,B,X,Y,H,lt)}function jo(S,B,X){B.isScene!==!0&&(B=xt);let Y=wt.get(S),H=f.state.lights,lt=f.state.shadowsArray,_t=H.state.version,kt=J.getParameters(S,H.state,lt,B,X),Et=J.getProgramCacheKey(kt),Ht=Y.programs;Y.environment=S.isMeshStandardMaterial?B.environment:null,Y.fog=B.fog,Y.envMap=(S.isMeshStandardMaterial?Qt:Ee).get(S.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&S.envMap===null?B.environmentRotation:S.envMapRotation,Ht===void 0&&(S.addEventListener("dispose",K),Ht=new Map,Y.programs=Ht);let Wt=Ht.get(Et);if(Wt!==void 0){if(Y.currentProgram===Wt&&Y.lightsStateVersion===_t)return Nd(S,kt),Wt}else kt.uniforms=J.getUniforms(S),S.onBeforeCompile(kt,y),Wt=J.acquireProgram(kt,Et),Ht.set(Et,Wt),Y.uniforms=kt.uniforms;let Ut=Y.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ut.clippingPlanes=ct.uniform),Nd(S,kt),Y.needsLights=Tf(S),Y.lightsStateVersion=_t,Y.needsLights&&(Ut.ambientLightColor.value=H.state.ambient,Ut.lightProbe.value=H.state.probe,Ut.directionalLights.value=H.state.directional,Ut.directionalLightShadows.value=H.state.directionalShadow,Ut.spotLights.value=H.state.spot,Ut.spotLightShadows.value=H.state.spotShadow,Ut.rectAreaLights.value=H.state.rectArea,Ut.ltc_1.value=H.state.rectAreaLTC1,Ut.ltc_2.value=H.state.rectAreaLTC2,Ut.pointLights.value=H.state.point,Ut.pointLightShadows.value=H.state.pointShadow,Ut.hemisphereLights.value=H.state.hemi,Ut.directionalShadowMap.value=H.state.directionalShadowMap,Ut.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ut.spotShadowMap.value=H.state.spotShadowMap,Ut.spotLightMatrix.value=H.state.spotLightMatrix,Ut.spotLightMap.value=H.state.spotLightMap,Ut.pointShadowMap.value=H.state.pointShadowMap,Ut.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=Wt,Y.uniformsList=null,Wt}function Fd(S){if(S.uniformsList===null){let B=S.currentProgram.getUniforms();S.uniformsList=gs.seqWithValue(B.seq,S.uniforms)}return S.uniformsList}function Nd(S,B){let X=wt.get(S);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function Sf(S,B,X,Y,H){B.isScene!==!0&&(B=xt),Gt.resetTextureUnits();let lt=B.fog,_t=Y.isMeshStandardMaterial?B.environment:null,kt=I===null?y.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:mr,Et=(Y.isMeshStandardMaterial?Qt:Ee).get(Y.envMap||_t),Ht=Y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Wt=!!X.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ut=!!X.morphAttributes.position,Kt=!!X.morphAttributes.normal,pe=!!X.morphAttributes.color,Le=Si;Y.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Le=y.toneMapping);let we=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,be=we!==void 0?we.length:0,Bt=wt.get(Y),Te=f.state.lights;if(yt===!0&&(V===!0||S!==w)){let ln=S===w&&Y.id===b;ct.setState(Y,S,ln)}let re=!1;Y.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Te.state.version||Bt.outputColorSpace!==kt||H.isBatchedMesh&&Bt.batching===!1||!H.isBatchedMesh&&Bt.batching===!0||H.isBatchedMesh&&Bt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Bt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Bt.instancing===!1||!H.isInstancedMesh&&Bt.instancing===!0||H.isSkinnedMesh&&Bt.skinning===!1||!H.isSkinnedMesh&&Bt.skinning===!0||H.isInstancedMesh&&Bt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Bt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Bt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Bt.instancingMorph===!1&&H.morphTexture!==null||Bt.envMap!==Et||Y.fog===!0&&Bt.fog!==lt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==ct.numPlanes||Bt.numIntersection!==ct.numIntersection)||Bt.vertexAlphas!==Ht||Bt.vertexTangents!==Wt||Bt.morphTargets!==Ut||Bt.morphNormals!==Kt||Bt.morphColors!==pe||Bt.toneMapping!==Le||Bt.morphTargetsCount!==be)&&(re=!0):(re=!0,Bt.__version=Y.version);let xn=Bt.currentProgram;re===!0&&(xn=jo(Y,B,H));let Nr=!1,bn=!1,Cs=!1,Ae=xn.getUniforms(),An=Bt.uniforms;if(mt.useProgram(xn.program)&&(Nr=!0,bn=!0,Cs=!0),Y.id!==b&&(b=Y.id,bn=!0),Nr||w!==S){mt.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Ae.setValue(R,"projectionMatrix",S.projectionMatrix),Ae.setValue(R,"viewMatrix",S.matrixWorldInverse);let un=Ae.map.cameraPosition;un!==void 0&&un.setValue(R,ot.setFromMatrixPosition(S.matrixWorld)),It.logarithmicDepthBuffer&&Ae.setValue(R,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Ae.setValue(R,"isOrthographic",S.isOrthographicCamera===!0),w!==S&&(w=S,bn=!0,Cs=!0)}if(H.isSkinnedMesh){Ae.setOptional(R,H,"bindMatrix"),Ae.setOptional(R,H,"bindMatrixInverse");let ln=H.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),Ae.setValue(R,"boneTexture",ln.boneTexture,Gt))}H.isBatchedMesh&&(Ae.setOptional(R,H,"batchingTexture"),Ae.setValue(R,"batchingTexture",H._matricesTexture,Gt),Ae.setOptional(R,H,"batchingIdTexture"),Ae.setValue(R,"batchingIdTexture",H._indirectTexture,Gt),Ae.setOptional(R,H,"batchingColorTexture"),H._colorsTexture!==null&&Ae.setValue(R,"batchingColorTexture",H._colorsTexture,Gt));let Rn=X.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&st.update(H,X,xn),(bn||Bt.receiveShadow!==H.receiveShadow)&&(Bt.receiveShadow=H.receiveShadow,Ae.setValue(R,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(An.envMap.value=Et,An.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&B.environment!==null&&(An.envMapIntensity.value=B.environmentIntensity),bn&&(Ae.setValue(R,"toneMappingExposure",y.toneMappingExposure),Bt.needsLights&&Ef(An,Cs),lt&&Y.fog===!0&&et.refreshFogUniforms(An,lt),et.refreshMaterialUniforms(An,Y,z,W,f.state.transmissionRenderTarget[S.id]),gs.upload(R,Fd(Bt),An,Gt)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(gs.upload(R,Fd(Bt),An,Gt),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Ae.setValue(R,"center",H.center),Ae.setValue(R,"modelViewMatrix",H.modelViewMatrix),Ae.setValue(R,"normalMatrix",H.normalMatrix),Ae.setValue(R,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let ln=Y.uniformsGroups;for(let un=0,Uc=ln.length;un<Uc;un++){let lr=ln[un];$t.update(lr,xn),$t.bind(lr,xn)}}return xn}function Ef(S,B){S.ambientLightColor.needsUpdate=B,S.lightProbe.needsUpdate=B,S.directionalLights.needsUpdate=B,S.directionalLightShadows.needsUpdate=B,S.pointLights.needsUpdate=B,S.pointLightShadows.needsUpdate=B,S.spotLights.needsUpdate=B,S.spotLightShadows.needsUpdate=B,S.rectAreaLights.needsUpdate=B,S.hemisphereLights.needsUpdate=B}function Tf(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(S,B,X){let Y=wt.get(S);Y.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),wt.get(S.texture).__webglTexture=B,wt.get(S.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:X,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,B){let X=wt.get(S);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0};let Af=R.createFramebuffer();this.setRenderTarget=function(S,B=0,X=0){I=S,T=B,A=X;let Y=!0,H=null,lt=!1,_t=!1;if(S){let Et=wt.get(S);if(Et.__useDefaultFramebuffer!==void 0)mt.bindFramebuffer(R.FRAMEBUFFER,null),Y=!1;else if(Et.__webglFramebuffer===void 0)Gt.setupRenderTarget(S);else if(Et.__hasExternalTextures)Gt.rebindTextures(S,wt.get(S.texture).__webglTexture,wt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Ut=S.depthTexture;if(Et.__boundDepthTexture!==Ut){if(Ut!==null&&wt.has(Ut)&&(S.width!==Ut.image.width||S.height!==Ut.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Gt.setupDepthRenderbuffer(S)}}let Ht=S.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(_t=!0);let Wt=wt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Wt[B])?H=Wt[B][X]:H=Wt[B],lt=!0):S.samples>0&&Gt.useMultisampledRTT(S)===!1?H=wt.get(S).__webglMultisampledFramebuffer:Array.isArray(Wt)?H=Wt[X]:H=Wt,P.copy(S.viewport),k.copy(S.scissor),G=S.scissorTest}else P.copy(ht).multiplyScalar(z).floor(),k.copy(dt).multiplyScalar(z).floor(),G=zt;if(X!==0&&(H=Af),mt.bindFramebuffer(R.FRAMEBUFFER,H)&&Y&&mt.drawBuffers(S,H),mt.viewport(P),mt.scissor(k),mt.setScissorTest(G),lt){let Et=wt.get(S.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+B,Et.__webglTexture,X)}else if(_t){let Et=B;for(let Ht=0;Ht<S.textures.length;Ht++){let Wt=wt.get(S.textures[Ht]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ht,Wt.__webglTexture,X,Et)}}else if(S!==null&&X!==0){let Et=wt.get(S.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Et.__webglTexture,X)}b=-1},this.readRenderTargetPixels=function(S,B,X,Y,H,lt,_t,kt=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=wt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(Et=Et[_t]),Et){mt.bindFramebuffer(R.FRAMEBUFFER,Et);try{let Ht=S.textures[kt],Wt=Ht.format,Ut=Ht.type;if(!It.textureFormatReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=S.width-Y&&X>=0&&X<=S.height-H&&(S.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+kt),R.readPixels(B,X,Y,H,Lt.convert(Wt),Lt.convert(Ut),lt))}finally{let Ht=I!==null?wt.get(I).__webglFramebuffer:null;mt.bindFramebuffer(R.FRAMEBUFFER,Ht)}}},this.readRenderTargetPixelsAsync=async function(S,B,X,Y,H,lt,_t,kt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=wt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(Et=Et[_t]),Et)if(B>=0&&B<=S.width-Y&&X>=0&&X<=S.height-H){mt.bindFramebuffer(R.FRAMEBUFFER,Et);let Ht=S.textures[kt],Wt=Ht.format,Ut=Ht.type;if(!It.textureFormatReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Kt=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Kt),R.bufferData(R.PIXEL_PACK_BUFFER,lt.byteLength,R.STREAM_READ),S.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+kt),R.readPixels(B,X,Y,H,Lt.convert(Wt),Lt.convert(Ut),0);let pe=I!==null?wt.get(I).__webglFramebuffer:null;mt.bindFramebuffer(R.FRAMEBUFFER,pe);let Le=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Yp(R,Le,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Kt),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,lt),R.deleteBuffer(Kt),R.deleteSync(Le),lt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,B=null,X=0){let Y=Math.pow(2,-X),H=Math.floor(S.image.width*Y),lt=Math.floor(S.image.height*Y),_t=B!==null?B.x:0,kt=B!==null?B.y:0;Gt.setTexture2D(S,0),R.copyTexSubImage2D(R.TEXTURE_2D,X,0,0,_t,kt,H,lt),mt.unbindTexture()};let Rf=R.createFramebuffer(),Cf=R.createFramebuffer();this.copyTextureToTexture=function(S,B,X=null,Y=null,H=0,lt=null){lt===null&&(H!==0?(es("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),lt=H,H=0):lt=0);let _t,kt,Et,Ht,Wt,Ut,Kt,pe,Le,we=S.isCompressedTexture?S.mipmaps[lt]:S.image;if(X!==null)_t=X.max.x-X.min.x,kt=X.max.y-X.min.y,Et=X.isBox3?X.max.z-X.min.z:1,Ht=X.min.x,Wt=X.min.y,Ut=X.isBox3?X.min.z:0;else{let Rn=Math.pow(2,-H);_t=Math.floor(we.width*Rn),kt=Math.floor(we.height*Rn),S.isDataArrayTexture?Et=we.depth:S.isData3DTexture?Et=Math.floor(we.depth*Rn):Et=1,Ht=0,Wt=0,Ut=0}Y!==null?(Kt=Y.x,pe=Y.y,Le=Y.z):(Kt=0,pe=0,Le=0);let be=Lt.convert(B.format),Bt=Lt.convert(B.type),Te;B.isData3DTexture?(Gt.setTexture3D(B,0),Te=R.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Gt.setTexture2DArray(B,0),Te=R.TEXTURE_2D_ARRAY):(Gt.setTexture2D(B,0),Te=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,B.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,B.unpackAlignment);let re=R.getParameter(R.UNPACK_ROW_LENGTH),xn=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Nr=R.getParameter(R.UNPACK_SKIP_PIXELS),bn=R.getParameter(R.UNPACK_SKIP_ROWS),Cs=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,we.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,we.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ht),R.pixelStorei(R.UNPACK_SKIP_ROWS,Wt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ut);let Ae=S.isDataArrayTexture||S.isData3DTexture,An=B.isDataArrayTexture||B.isData3DTexture;if(S.isDepthTexture){let Rn=wt.get(S),ln=wt.get(B),un=wt.get(Rn.__renderTarget),Uc=wt.get(ln.__renderTarget);mt.bindFramebuffer(R.READ_FRAMEBUFFER,un.__webglFramebuffer),mt.bindFramebuffer(R.DRAW_FRAMEBUFFER,Uc.__webglFramebuffer);for(let lr=0;lr<Et;lr++)Ae&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,wt.get(S).__webglTexture,H,Ut+lr),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,wt.get(B).__webglTexture,lt,Le+lr)),R.blitFramebuffer(Ht,Wt,_t,kt,Kt,pe,_t,kt,R.DEPTH_BUFFER_BIT,R.NEAREST);mt.bindFramebuffer(R.READ_FRAMEBUFFER,null),mt.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(H!==0||S.isRenderTargetTexture||wt.has(S)){let Rn=wt.get(S),ln=wt.get(B);mt.bindFramebuffer(R.READ_FRAMEBUFFER,Rf),mt.bindFramebuffer(R.DRAW_FRAMEBUFFER,Cf);for(let un=0;un<Et;un++)Ae?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Rn.__webglTexture,H,Ut+un):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Rn.__webglTexture,H),An?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ln.__webglTexture,lt,Le+un):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,ln.__webglTexture,lt),H!==0?R.blitFramebuffer(Ht,Wt,_t,kt,Kt,pe,_t,kt,R.COLOR_BUFFER_BIT,R.NEAREST):An?R.copyTexSubImage3D(Te,lt,Kt,pe,Le+un,Ht,Wt,_t,kt):R.copyTexSubImage2D(Te,lt,Kt,pe,Ht,Wt,_t,kt);mt.bindFramebuffer(R.READ_FRAMEBUFFER,null),mt.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else An?S.isDataTexture||S.isData3DTexture?R.texSubImage3D(Te,lt,Kt,pe,Le,_t,kt,Et,be,Bt,we.data):B.isCompressedArrayTexture?R.compressedTexSubImage3D(Te,lt,Kt,pe,Le,_t,kt,Et,be,we.data):R.texSubImage3D(Te,lt,Kt,pe,Le,_t,kt,Et,be,Bt,we):S.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,lt,Kt,pe,_t,kt,be,Bt,we.data):S.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,lt,Kt,pe,we.width,we.height,be,we.data):R.texSubImage2D(R.TEXTURE_2D,lt,Kt,pe,_t,kt,be,Bt,we);R.pixelStorei(R.UNPACK_ROW_LENGTH,re),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,xn),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Nr),R.pixelStorei(R.UNPACK_SKIP_ROWS,bn),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Cs),lt===0&&B.generateMipmaps&&R.generateMipmap(Te),mt.unbindTexture()},this.initRenderTarget=function(S){wt.get(S).__webglFramebuffer===void 0&&Gt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Gt.setTextureCube(S,0):S.isData3DTexture?Gt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Gt.setTexture2DArray(S,0):Gt.setTexture2D(S,0),mt.unbindTexture()},this.resetState=function(){T=0,A=0,I=null,mt.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}};var Cu={type:"change"},od={type:"start"},Pu={type:"end"},nc=new Gi,Iu=new In,wv=Math.cos(70*qn.DEG2RAD),Ge=new U,gn=2*Math.PI,me={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},sd=1e-6,ic=class extends po{constructor(t,e=null){super(t,e),this.state=me.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:qi.ROTATE,MIDDLE:qi.DOLLY,RIGHT:qi.PAN},this.touches={ONE:Yi.ROTATE,TWO:Yi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new fn,this._lastTargetPosition=new U,this._quat=new fn().setFromUnitVectors(t.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new cs,this._sphericalDelta=new cs,this._scale=1,this._panOffset=new U,this._rotateStart=new Ct,this._rotateEnd=new Ct,this._rotateDelta=new Ct,this._panStart=new Ct,this._panEnd=new Ct,this._panDelta=new Ct,this._dollyStart=new Ct,this._dollyEnd=new Ct,this._dollyDelta=new Ct,this._dollyDirection=new U,this._mouse=new Ct,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Sv.bind(this),this._onPointerDown=Mv.bind(this),this._onPointerUp=Ev.bind(this),this._onContextMenu=kv.bind(this),this._onMouseWheel=Rv.bind(this),this._onKeyDown=Cv.bind(this),this._onTouchStart=Iv.bind(this),this._onTouchMove=Pv.bind(this),this._onMouseDown=Tv.bind(this),this._onMouseMove=Av.bind(this),this._interceptControlDown=Lv.bind(this),this._interceptControlUp=Dv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Cu),this.update(),this.state=me.NONE}update(t=null){let e=this.object.position;Ge.copy(e).sub(this.target),Ge.applyQuaternion(this._quat),this._spherical.setFromVector3(Ge),this.autoRotate&&this.state===me.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=gn:n>Math.PI&&(n-=gn),r<-Math.PI?r+=gn:r>Math.PI&&(r-=gn),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(Ge.setFromSpherical(this._spherical),Ge.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ge),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ge.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){let a=new U(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;let l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Ge.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(nc.origin.copy(this.object.position),nc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(nc.direction))<wv?this.object.lookAt(this.target):(Iu.setFromNormalAndCoplanarPoint(this.object.up,this.target),nc.intersectPlane(Iu,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>sd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>sd||this._lastTargetPosition.distanceToSquared(this.target)>sd?(this.dispatchEvent(Cu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?gn/60*this.autoRotateSpeed*t:gn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ge.setFromMatrixColumn(e,0),Ge.multiplyScalar(-t),this._panOffset.add(Ge)}_panUp(t,e){this.screenSpacePanning===!0?Ge.setFromMatrixColumn(e,1):(Ge.setFromMatrixColumn(e,0),Ge.crossVectors(this.object.up,Ge)),Ge.multiplyScalar(t),this._panOffset.add(Ge)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;Ge.copy(r).sub(this.target);let s=Ge.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*s/n.clientHeight,this.object.matrix),this._panUp(2*e*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=t-n.left,s=e-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/e.clientHeight),this._rotateUp(gn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._panStart.set(n,r)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,r=t.pageY-e.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),r=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/e.clientHeight),this._rotateUp(gn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,r=t.pageY-e.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Ct,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Mv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Sv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Ev(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Pu),this.state=me.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Tv(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case qi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=me.DOLLY;break;case qi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=me.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=me.ROTATE}break;case qi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=me.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=me.PAN}break;default:this.state=me.NONE}this.state!==me.NONE&&this.dispatchEvent(od)}function Av(i){switch(this.state){case me.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case me.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case me.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Rv(i){this.enabled===!1||this.enableZoom===!1||this.state!==me.NONE||(i.preventDefault(),this.dispatchEvent(od),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Pu))}function Cv(i){this.enabled!==!1&&this._handleKeyDown(i)}function Iv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Yi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=me.TOUCH_ROTATE;break;case Yi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=me.TOUCH_PAN;break;default:this.state=me.NONE}break;case 2:switch(this.touches.TWO){case Yi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=me.TOUCH_DOLLY_PAN;break;case Yi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=me.TOUCH_DOLLY_ROTATE;break;default:this.state=me.NONE}break;default:this.state=me.NONE}this.state!==me.NONE&&this.dispatchEvent(od)}function Pv(i){switch(this._trackPointer(i),this.state){case me.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case me.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case me.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case me.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=me.NONE}}function kv(i){this.enabled!==!1&&i.preventDefault()}function Lv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Dv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var bs={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Sn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Uv=new vr(-1,1,1,-1,0,1),ad=class extends Be{constructor(){super(),this.setAttribute("position",new ue([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ue([0,2,0,0,2,0],2))}},Fv=new ad,Ki=class{constructor(t){this._mesh=new ve(Fv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Uv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var rc=class extends Sn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ce?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Yn.clone(t.uniforms),this.material=new Ce({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Ki(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var yo=class extends Sn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let r=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}},sc=class extends Sn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var oc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new Ct);this._width=n.width,this._height=n.height,e=new en(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:kn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new rc(bs),this.copyPass.material.blending=$n,this.clock=new yr}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let r=0,s=this.passes.length;r<s;r++){let o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}yo!==void 0&&(o instanceof yo?n=!0:o instanceof sc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new Ct);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,r)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ac=class extends Sn{constructor(t,e,n=null,r=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Dt}render(t,e,n){let r=t.autoClear;t.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=r}};var ku={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Dt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var vs=class i extends Sn{constructor(t,e=1,n,r){super(),this.strength=e,this.radius=n,this.threshold=r,this.resolution=t!==void 0?new Ct(t.x,t.y):new Ct(256,256),this.clearColor=new Dt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new en(s,o,{type:kn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let h=new en(s,o,{type:kn});h.texture.name="UnrealBloomPass.h"+d,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);let p=new en(s,o,{type:kn});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),s=Math.round(s/2),o=Math.round(o/2)}let a=ku;this.highPassUniforms=Yn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ce({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ct(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Yn.clone(bs.uniforms),this.blendMaterial=new Ce({uniforms:this.copyUniforms,vertexShader:bs.vertexShader,fragmentShader:bs.fragmentShader,blending:Zi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Dt,this._oldClearAlpha=1,this._basic=new qe,this._fsQuad=new Ki(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),r=Math.round(e/2);this.renderTargetBright.setSize(n,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,r),this.renderTargetsVertical[s].setSize(n,r),this.separableBlurMaterials[s].uniforms.invSize.value=new Ct(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,e,n,r,s){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Ce({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new Ct(.5,.5)},direction:{value:new Ct(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(t){return new Ce({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};vs.BlurDirectionX=new Ct(1,0);vs.BlurDirectionY=new Ct(0,1);var _o={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var lc=class extends Sn{constructor(){super(),this.uniforms=Yn.clone(_o.uniforms),this.material=new so({name:_o.name,uniforms:this.uniforms,vertexShader:_o.vertexShader,fragmentShader:_o.fragmentShader}),this._fsQuad=new Ki(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},te.getTransfer(this._outputColorSpace)===oe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ol?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===al?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ll?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===cl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===dl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===pl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===hl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function cc(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},o={},a=i[0].morphTargetsRelative,c=new Be,l=0;for(let d=0;d<i.length;++d){let h=i[d],p=0;if(e!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let u in h.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;s[u]===void 0&&(s[u]=[]),s[u].push(h.attributes[u]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let u in h.morphAttributes){if(!r.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;o[u]===void 0&&(o[u]=[]),o[u].push(h.morphAttributes[u])}if(t){let u;if(e)u=h.index.count;else if(h.attributes.position!==void 0)u=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,u,d),l+=u}}if(e){let d=0,h=[];for(let p=0;p<i.length;++p){let u=i[p].index;for(let m=0;m<u.count;++m)h.push(u.getX(m)+d);d+=i[p].attributes.position.count}c.setIndex(h)}for(let d in s){let h=Lu(s[d]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,h)}for(let d in o){let h=o[d][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let p=0;p<h;++p){let u=[];for(let x=0;x<o[d].length;++x)u.push(o[d][x][p]);let m=Lu(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(m)}}return c}function Lu(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){let d=i[l];if(t===void 0&&(t=d.array.constructor),t!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=d.itemSize),e!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=d.normalized),n!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=d.gpuType),r!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=d.count*e}let o=new t(s),a=new hn(o,e,n),c=0;for(let l=0;l<i.length;++l){let d=i[l];if(d.isInterleavedBufferAttribute){let h=c/e;for(let p=0,u=d.count;p<u;p++)for(let m=0;m<e;m++){let x=d.getComponent(p,m);a.setComponent(p+h,m,x)}}else o.set(d.array,c);c+=d.count*e}return r!==void 0&&(a.gpuType=r),a}var Du=()=>`
/* one rule per selector and breakpoint where the cascade allows (consolidated) */
#app{--label:#f0efec;--label2:#c3c2b7;--label3:#8f8e88;--sep:rgba(240,239,236,.1);--fill:rgba(240,239,236,.07);--fill2:rgba(240,239,236,.13);--tint:#f0efec;--mat:#1c1c1e;--mat-blur:none;--edge:rgba(240,239,236,.08);--bg:#0e0e0d;--ok:#3f7a52;--night:#3a3a38;--seg-thumb:#3a3a37;--chip:rgba(20,20,19,.82);--place:rgba(240,239,236,.75);--halo:0 1px 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.6);--inner:rgba(255,255,255,.16);--shadow:rgba(0,0,0,.45);--scrim:14,14,13;--scrim-a:.78;position:fixed;inset:0;overflow:hidden;background:var(--bg);color:var(--label);transition:background-color .3s;font:400 15px/1.4 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;user-select:none}
#app canvas{display:block;touch-action:none}
:where(#app) button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
#app :focus-visible{outline:2px solid var(--tint);outline-offset:2px}
.scrim{position:absolute;left:0;right:0;pointer-events:none;z-index:-1}
.scrim.top{top:0;height:11rem;background:linear-gradient(rgba(var(--scrim),var(--scrim-a)),rgba(var(--scrim),0))}
.scrim.bottom{bottom:0;height:9rem;background:linear-gradient(rgba(var(--scrim),0),rgba(var(--scrim),calc(var(--scrim-a) - .06)))}
.labels{position:absolute;inset:0;pointer-events:none;z-index:2}
.lbl{position:absolute;left:0;top:0;white-space:nowrap;text-shadow:var(--halo)}
.lbl.place{font-size:13px;font-weight:600;color:var(--label);letter-spacing:0}
.lbl.rwy{font-size:13px}
.lbl.rwy b{font-weight:600;letter-spacing:-.01em}
.lbl.rwy b.dim{color:var(--label3);font-weight:600}
.lbl.rwy small{font-size:11px;color:var(--label2);letter-spacing:.01em}
.chip{font-style:normal;font-size:11px;font-weight:600;letter-spacing:.01em;padding:.125rem .5rem .125rem .4375rem;border-radius:999px;background:var(--chip);text-shadow:none;display:inline-flex;align-items:center;gap:.3125rem}
.chip::before{content:"";width:.375rem;height:.375rem;border-radius:50%;background:currentColor}
.chip.arr{color:var(--arr)}
.chip.dep{color:var(--dep)}
.chip.closed{color:var(--closed)}
.hud{position:absolute;inset:0;pointer-events:none;z-index:3}
.hud .panel,.hud button,.hud .seg,.hud .track,.hud select{pointer-events:auto}
.panel{background:var(--mat);-webkit-backdrop-filter:var(--mat-blur);backdrop-filter:var(--mat-blur);border:.5px solid var(--edge);box-shadow:inset 0 .5px 0 var(--inner),0 18px 50px var(--shadow)}
.hero{left:1.5rem;top:1.25rem}
.eyebrow{font-size:13px;font-weight:600;color:var(--label2);letter-spacing:.005em}
.dir{height:2.9rem;font-size:36px;line-height:1.05;font-weight:600;letter-spacing:-.01em}
.dir span{white-space:nowrap}
.dir span i{display:inline-block;width:.38em;height:.38em;border-radius:.1em;margin-right:.24em;vertical-align:.14em}
.dir-sub{font-size:15px;color:var(--label2);margin-top:.25rem;letter-spacing:-.01em}
.dir-sub b{color:var(--label);font-weight:600}
.dir-sub .dot-live,.dir-sub .dot-stale{display:inline-block;width:.5rem;height:.5rem;border-radius:50%;margin-right:.375rem;vertical-align:.08em;background:#2e9d54}
.dir-sub .dot-stale{background:var(--label3)}
.dir-sub .late{display:inline-flex;align-items:center;gap:.375rem;padding:.1875rem .5rem;border-radius:6px;background:#fdecea;color:#a3271d;font-weight:500}
.dir-sub .late svg{width:.875rem;height:.875rem}
#app:not(.light) .dir-sub .late{background:#3a1d1a;color:#ffb4ab}
.dir-next{font-size:15px;color:var(--label);margin-top:.25rem;font-weight:500}
.dir-next+.dir-sub{margin-top:.375rem;font-size:13px}
.dir-next b{font-weight:600}
.seg{position:relative;display:inline-flex;padding:2px;border-radius:9px;background:var(--fill);isolation:isolate}
.seg button{position:relative;z-index:1;font-size:13px;font-weight:500;padding:.3125rem .875rem;border-radius:7px;color:var(--label);transition:opacity .1s ease-out}
.seg button[aria-checked=true]{font-weight:600}
.seg button:active{opacity:.55}
.seg .thumb{position:absolute;z-index:0;top:2px;bottom:2px;left:0;border-radius:7px;background:var(--seg-thumb);box-shadow:0 3px 8px rgba(0,0,0,.18),0 3px 1px rgba(0,0,0,.06);will-change:transform,width}
.seg.small button{font-size:13px;padding:.25rem .625rem}
.conditions{width:18.5rem}
.row{padding:.75rem 1rem;position:relative}
.row+.row::before{content:"";position:absolute;top:0;left:1rem;right:0;border-top:.5px solid var(--sep)}
.row-main{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}
.row-title{font-size:13px;font-weight:600;color:var(--label2);letter-spacing:.005em}
.row-value{font-size:18px;font-weight:600;letter-spacing:-.01em}
.row-value small{font-size:13px;font-weight:600;color:var(--label2);margin-left:.375rem;letter-spacing:0}
.row-sub{font-size:13px;color:var(--label2);margin-top:.125rem}
.row .seg{margin-top:.625rem;display:flex}
.row .seg button{flex:1}
.wind{display:flex;gap:.75rem;align-items:center}
.wind>div{flex:1;min-width:0}
.compass{width:2.75rem;height:2.75rem;flex:none}
.compass circle{fill:var(--fill);stroke:none}
.compass .axis{stroke:rgba(235,235,245,.22);stroke-width:7;stroke-linecap:round}
.compass text{fill:var(--label3);font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central}
.compass .arrow{fill:var(--label);will-change:transform}
.menu{position:relative;display:inline-flex;align-items:center}
.menu select{font:inherit;font-size:13px;font-weight:600;color:var(--tint);cursor:pointer}
.menu select option{color:#000}
.menu svg{position:absolute;right:.5625rem;width:.625rem;height:.625rem;color:var(--tint);pointer-events:none}
.stack{display:flex}
.stack .ib:first-child{border-radius:14px 14px 0 0}
.stack .ib:last-child{border-radius:0 0 14px 14px}
.ib[data-tip]:hover::after,.ib[data-tip]:focus-visible::after{content:attr(data-tip);position:absolute;right:calc(100% + .5rem);top:50%;transform:translateY(-50%);white-space:nowrap;padding:.3125rem .625rem;border-radius:8px;background:var(--chip);color:var(--label);font-size:13px;font-weight:500;box-shadow:0 2px 8px var(--shadow);pointer-events:none}
.ib{position:relative;width:2.75rem;height:2.75rem;display:grid;place-items:center;color:var(--label);transition:transform .1s ease-out,background-color .15s}
.ib+.ib{border-top:.5px solid var(--sep)}
.ib svg{width:1.25rem;height:1.25rem;fill:currentColor}
.ib:active{transform:scale(.92);background:var(--fill)}
.ib[aria-pressed=true]{color:var(--tint)}
.ib .needle{will-change:transform}
.popover{position:absolute;right:4.5rem;bottom:7.5rem;width:17rem;border-radius:18px;padding:.875rem 1rem;transform-origin:100% 85%;will-change:transform,opacity,filter}
.popover h3{margin:0 0 .5rem;font-size:15px;font-weight:600;letter-spacing:-.01em}
.lg{display:flex;align-items:center;gap:.625rem;font-size:13px;padding:.25rem 0}
.lg i{flex:none;width:1.375rem;height:.5rem;border-radius:3px}
.lg .src{font-size:11px;color:var(--label3);margin-top:.5rem;line-height:1.4}
.dock{left:1rem;right:1rem;bottom:1rem;border-radius:24px;display:flex;padding:.75rem 1.125rem .5rem .75rem}
.play{background:var(--fill)}
.play:active{transform:scale(.92);background:var(--fill2)}
.scrub{flex:1;min-width:0}
.track{height:2.5rem;cursor:grab}
.track.dragging{cursor:grabbing}
.segs{height:.875rem}
.segs i{border-radius:2px}
.segs i:first-child{border-radius:7px 2px 2px 7px}
.segs i:last-child{border-radius:2px 7px 7px 2px}
.marks{left:0;right:0;top:1.9375rem;display:flex}
.nights{height:2.5rem}
.nights span{position:absolute;left:.25rem;top:.0625rem;font-size:11px;font-weight:500;color:var(--label3);white-space:nowrap}
.nowline{position:absolute;top:0;bottom:-1.25rem}
.ticks span.nowtick{transform:translateX(5px);color:var(--label);font-weight:600;top:.0625rem}
.dkey{display:grid;grid-template-columns:repeat(3,auto);gap:.25rem .625rem;margin-bottom:1rem;font-size:11px;color:var(--label2);white-space:nowrap;flex:none;align-self:center}
.dkey span{display:flex;align-items:center;gap:.3125rem}
.dkey i{width:.625rem;height:.625rem;border-radius:2px}
body.card .dkey{display:none}
.seg button:disabled{opacity:.38;cursor:not-allowed;text-decoration:line-through}
.when{font-size:13px;color:var(--label2)}
.when b{color:var(--label);font-weight:600}
.rowlbl{font-size:11px;color:var(--label2);white-space:nowrap}
body.card .rowlbl{display:none}
.segs,.marks{z-index:1}
.marks i{flex:1;border-radius:2px}
.thumb-knob{position:absolute;top:.5rem;left:0;width:1.625rem;height:1.625rem;margin-left:-.8125rem;border-radius:50%;background:#fff;box-shadow:0 .5px 4px rgba(0,0,0,.12),0 6px 13px rgba(0,0,0,.35)}
.bubble{white-space:nowrap;font-size:13px;font-weight:600;letter-spacing:-.005em}
.bubble span{color:var(--label2);font-weight:500;margin-left:.375rem}
.ticks{font-size:11px;color:var(--label3);letter-spacing:.01em}
.ticks span{position:absolute;top:.0625rem;transform:translateX(-50%);white-space:nowrap}
.ticks span.day{color:var(--label2);font-weight:600}
.ticks span.start{left:0;transform:none;color:var(--label2);font-weight:600}
.attrib{right:1rem;bottom:6.25rem;font-size:11px;color:var(--label2);pointer-events:none;white-space:nowrap}
body.card .attrib{display:none}
body.embed .dir{font-size:36px;height:2.4rem}
body.embed .eyebrow{font-size:13px}
@media (max-width:820px){
  .conditions{width:15rem}
  .row{padding:.625rem .875rem}
  .row-value{font-size:18px}
  .dir{font-size:36px;height:2.2rem}
  .dir-sub{font-size:13px}
  .hero{left:1rem;top:1rem}
  .seg button{padding:.25rem .625rem}
  .ticks span:not(.day){display:none}
  .popover{right:4.25rem;width:15rem}
}
.caption{display:none}
body.card .hero,body.card .conditions,body.card .dock,body.card .scrim{display:none}
body.card .caption{display:flex;position:absolute;left:.75rem;top:.75rem;gap:0;border-radius:14px;padding:.5rem .25rem;pointer-events:none}
.caption span{display:flex;align-items:center;gap:.4375rem;padding:0 .875rem;font-size:15px;white-space:nowrap}
.caption span+span{border-left:.5px solid var(--sep)}
.caption b{font-weight:600;letter-spacing:-.01em}
.caption small{color:var(--label2);font-size:13px}
.caption i{width:.625rem;height:.625rem;border-radius:3px}
body.card .stack{display:none}
body.card .ib{width:2.375rem;height:2.375rem}
body.card .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
body.card .lbl.rwy small,body.card .lbl.rwy b.dim{display:none}
body.card .lbl.place{font-size:11px;opacity:.75}
body.card .lbl.cmp,body.card .lbl.place,body.card .lbl.ac,body.card .lbl.flow,body.card .lbl.axis,body.card .lbl.landmark,body.card .lbl.rwy .chip:not(.closed),body.card .caption{display:none}
body.card .popover{bottom:1rem}
#app.light{--label:#0b0b0b;--label2:#52514e;--label3:#6b6a66;--sep:rgba(11,11,11,.09);--fill:rgba(11,11,11,.05);--fill2:rgba(11,11,11,.1);--tint:#0b0b0b;--mat:#fff;--edge:rgba(11,11,11,.06);--bg:#eceeef;--ok:#7cc392;--night:#c9c8c3;--seg-thumb:#fff;--chip:rgba(252,252,251,.94);--place:#52514e;--halo:0 0 2px #fff,0 0 6px rgba(255,255,255,.95),0 0 12px rgba(255,255,255,.8);--inner:rgba(255,255,255,.9);--shadow:rgba(15,23,42,.14);--scrim:244,244,242;--scrim-a:.82}
#app.light .chip{box-shadow:0 1px 3px rgba(15,23,42,.12)}
#app.light .seg .thumb{box-shadow:0 3px 8px rgba(0,0,0,.12),0 3px 1px rgba(0,0,0,.04),0 0 0 .5px rgba(0,0,0,.04)}
#app.light .thumb-knob{box-shadow:0 .5px 4px rgba(0,0,0,.12),0 6px 13px rgba(0,0,0,.12),0 0 0 .5px rgba(0,0,0,.04)}
#app.light .compass .axis{stroke:rgba(60,60,67,.2)}
#app:fullscreen{width:100vw;height:100vh}
body.bare .hero,body.bare .conditions,body.bare .dock,body.bare .scrim,body.bare .caption,body.bare #b-theme,body.bare #b-fs{display:none}
body.bare .stack{flex-direction:row;right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + .75rem);border-radius:12px}
body.bare .ib{width:2.375rem;height:2.375rem}
body.bare .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
body.bare .popover{right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + 3.75rem);transform-origin:0 100%}
.lbl.ac{display:flex;align-items:center;gap:.3125rem;font-size:11px;font-weight:600;letter-spacing:.01em;padding:.0625rem .4375rem;border-radius:6px;background:var(--chip);text-shadow:none;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.lbl.ac i,.aclegend i,.lbl.flow i{width:.5rem;height:.5rem;border-radius:50%;flex:none}
.lbl.cmp{font-size:24px;font-weight:600;color:var(--label3);letter-spacing:.04em}
.lbl.landmark{font-size:13px;font-weight:600;color:var(--label2);letter-spacing:.01em}
.lbl.axis{display:flex;align-items:center;gap:.25rem;font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--label2)}
.lbl.axis svg,.lbl.flow svg{width:1rem;height:1rem;transform:rotate(var(--a,0deg))}
.lbl.flow{display:flex;align-items:center;gap:.4375rem;font-size:13px;font-weight:600;padding:.25rem .5rem .25rem .625rem;border-radius:999px;background:var(--chip);text-shadow:none;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.actip{position:absolute;left:0;top:0;z-index:5;max-width:20rem;padding:.5rem .75rem;border-radius:12px;pointer-events:none;font-size:13px;line-height:1.35}
.actip b{display:block;font-size:15px}
.actip span{display:block;color:var(--label2)}
.actip small{display:block;color:var(--label3);font-size:11px;margin-top:.125rem}
.aclegend{display:flex;font-size:13px;color:var(--label2);white-space:nowrap}
.aclegend span{display:flex;align-items:center;gap:.3125rem}
.aclegend b{font-size:13px;color:var(--label)}
.aclegend b.on::before,.livebadge i{content:"";display:inline-block;width:.4375rem;height:.4375rem;border-radius:50%;background:#0ca30c;margin-right:.3125rem;vertical-align:.05em}
.aclegend b.stale::before{content:"";display:inline-block;width:.4375rem;height:.4375rem;border-radius:50%;background:#fab219;margin-right:.3125rem}
.aclegend b.sim{color:var(--label2)}
.livebadge{position:absolute;left:1.5rem;top:12.5rem;display:flex;align-items:center;font-size:13px;font-weight:600;padding:.375rem .75rem;border-radius:999px;color:var(--label2);transition:transform .1s ease-out}
.livebadge.on{color:var(--label)}
.livebadge.stale i{background:#fab219}
.livebadge:active{transform:scale(.96)}
.livebadge[hidden],.actip[hidden]{display:none}
.rose{position:absolute;left:1rem;bottom:10.25rem;transition:opacity .3s;width:4.25rem;height:4.25rem;border-radius:50%;display:grid;place-items:center;pointer-events:none}
.rose b{position:absolute;font-size:11px;font-weight:600;color:var(--label2);will-change:transform}
.rose b[data-d=N]{color:#d03b3b}
#app:not(.light) .rose b[data-d=N]{color:#ef5b4f} /* dark: the lighter red, >= 4.5:1 on the scene */
.rose i{position:absolute;width:2px;height:1.5rem;border-radius:1px;background:linear-gradient(#d03b3b 50%,var(--label3) 50%);will-change:transform}
body.bare .rose{right:auto;left:calc(var(--pad-l,0px) + 1rem);bottom:calc(var(--pad-b,0px) + 3.75rem)}
body.card .rose{right:.5rem;left:auto;top:.5rem;bottom:auto;transform:scale(.75);transform-origin:100% 0}
body.card .aclegend,body.card .livebadge{display:none}
body.bare .aclegend{left:calc(var(--pad-l,0px) + 1rem + 13rem);bottom:calc(var(--pad-b,0px) + .875rem)}
@media (prefers-reduced-transparency:reduce){
  #app{--mat:#1c1c1e;--mat-blur:none}
  #app.light{--mat:#fff}
}
@media (prefers-contrast:more){
  #app{--edge:rgba(255,255,255,.45);--label2:rgba(235,235,245,.85);--label3:rgba(235,235,245,.6);--sep:rgba(160,160,170,.8)}
}
.lbl.ac::after{content:"";position:absolute;left:50%;top:100%;width:1px;height:14px;background:var(--label3);opacity:.7}
.ground{font-size:15px;line-height:1.45;color:var(--label2)}
.seg[hidden],.ib[hidden]{display:none}
.aclegend b{letter-spacing:0;font-weight:600;color:var(--label)}
.aclegend .off{color:var(--label3)}
.acring{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;box-shadow:0 0 0 2px var(--label);pointer-events:none}
.acring[hidden]{display:none}
.chip{color:var(--label2)}
.chip::before{display:none}
.nowline::after{left:5px;top:-.0625rem;font-size:11px;font-weight:600;color:var(--label)}
.dkey{grid-template-columns:repeat(4,auto)}
.dkey .lessk{background:repeating-linear-gradient(135deg,var(--east) 0 2px,rgba(255,255,255,.7) 2px 4px)}
.dkey .closedk{background:var(--closed)}
.dkey .riskk{background:repeating-linear-gradient(135deg,var(--closed) 0 2px,transparent 2px 4px);box-shadow:inset 0 0 0 1px var(--closed)}
.ticks span.day{transform:translateX(3px)}
.play svg{fill:var(--label);width:.875rem;height:.875rem}
.stack .ib{height:2rem;display:flex;align-items:center;gap:.375rem;padding:0 .75rem;font-size:13px;font-weight:500;white-space:nowrap}
.stack .ib svg{width:.875rem;height:.875rem}
.stack .ib+.ib{border-top:0;border-left:.5px solid var(--sep)}
.stack .ib:first-child{border-radius:12px 0 0 12px}
.stack .ib:last-child{border-radius:0 12px 12px 0}
.attrib{bottom:.125rem;right:1rem;font-size:11px}
.row.run{padding-top:.5rem;padding-bottom:.5rem}
.row.run .row-title{font-weight:500;color:var(--label3)}
.row.run .menu select{font-size:13px;background:transparent;color:var(--label2)}
.stack .ib[hidden]{display:none}
.row-sub .pilot{display:block;margin-top:.25rem;font-size:13px;color:var(--label3)}
.lbl.place,.lbl.landmark{display:none}
.lbl.town{font-size:15px;font-weight:600;color:var(--label);text-shadow:var(--halo)}
.lbl.ptag{font-size:13px;font-weight:600;color:var(--label2);text-shadow:var(--halo);white-space:nowrap}
.lbl.parrow svg{width:1.375rem;height:1.375rem;transform:rotate(var(--a,0deg));filter:drop-shadow(0 0 2px var(--bg))}
body.card .lbl.town{font-size:11px}
body.card .lbl.ptag,body.card .lbl.river,body.card .lbl.rwy{display:none}
.marks i.o{background:var(--fill2)} /* open: a plain cell, as on the dashboard (an outlined pill read as a "0" at phone widths) */
.marks i.n{opacity:.7} /* night ban: the hour's state, dimmed (dashboard: .l18 .n) */
#app:not(.light) .marks i.o{background:#4a4b50} /* dark: open hours >= 1.5:1 on the card, as on the dashboard */
.marks i.x{background:var(--closed)}
.marks i.r{background:repeating-linear-gradient(135deg,var(--closed) 0 2px,transparent 2px 4px);box-shadow:inset 0 0 0 1px var(--closed)}
.dkey .openk{background:var(--mat);box-shadow:inset 0 0 0 1px var(--label3)}
.dkey{grid-template-columns:repeat(2,auto)}
.nights span{font-size:11px;font-weight:600;color:var(--label2)}
.ticks span.end{left:auto;right:0;transform:none;color:var(--label2);font-weight:600}
.conditions{position:absolute;right:1rem;top:1rem;border-radius:22px;padding:.25rem 0;width:16.5rem}
.row-value{font-size:15px;font-weight:600}
.row-value small{font-weight:400}
details{font-size:13px;color:var(--label3);margin-top:.25rem}
details summary{cursor:pointer;color:var(--label2);font-weight:500;list-style:none}
.row.how{font-size:13px;line-height:1.45}
.compass{display:none}
.aclegend:empty{display:none}
.dir{position:relative;margin-top:.125rem;font-size:36px;height:2.5rem}
.dir-next{font-weight:400;line-height:1.45}
.ground{font-size:13px;color:var(--label3)}
.lbl.town{font-size:13px;font-weight:500;color:var(--label);text-shadow:var(--halo)}
.lbl.town i{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:var(--label);box-shadow:0 0 0 2px var(--bg)}
.lbl.town span{white-space:nowrap;line-height:18px}
.lbl.town[data-side=r] span{left:10px;top:-9px}
.lbl.town[data-side=l] span{right:10px;top:-9px}
.lbl.town[data-side=t] span{left:0;top:-27px;transform:translateX(-50%)}
.lbl.town[data-side=rd] span{left:10px;top:4px}
.lbl.town[data-side=ru] span{left:10px;top:-22px}
.lbl.town[data-side=ld] span{right:10px;top:4px}
.lbl.town[data-side=lu] span{right:10px;top:-22px}
.lbl.town[data-side=b] span{left:0;top:9px;transform:translateX(-50%)}
.lbl.river{font-size:13px;font-style:italic;font-weight:500;color:#5a7fa6}
body.card .lbl.river{display:none}
.row-value{font-weight:500}
.segs{height:.75rem}
.segs i:first-child,.segs i:last-child{border-radius:2px}
.risk{left:0;right:0;top:1.75rem;height:.75rem}
.risk .base{stroke:var(--sep);stroke-width:1}
.marks{top:2.625rem}
.marks[hidden],.rowlbl span[hidden]{display:none}
.track{height:3.125rem}
.nights{height:3.125rem}
.dock{padding-top:2.5rem}
.dkey .riskk2{height:.375rem;background:color-mix(in srgb,var(--c) 35%,transparent);box-shadow:inset 0 1px 0 var(--c)}
.play{font-size:13px;font-weight:500;color:var(--label)}
.attrib{left:1rem;right:auto;bottom:9.25rem}
details summary::before{content:"";display:inline-block;width:.375rem;height:.375rem;margin-right:.375rem;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);vertical-align:.1em;transition:transform .15s}
details[open] summary::before{content:"";transform:rotate(45deg)}
.menu select{appearance:none;-webkit-appearance:none;border:0;padding:.3125rem 1.625rem .3125rem .75rem;background:var(--fill)!important;color:var(--label)!important;border-radius:8px}
.row.wind .row-sub{margin-top:.25rem}
.risk{height:1rem}
.marks{top:2.875rem}
.dir-next{font-size:15px}
.dir-next b{font-weight:600}
.ground{font-size:13px;color:var(--label2)}
.lbl.ptag{color:var(--label)!important;font-weight:500}
.risk{height:1rem}
.risk .lim{stroke:var(--closed);stroke-width:1;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}
.pgmark{position:absolute;top:.75rem;height:1rem;pointer-events:auto}
.pgmark span{position:absolute;right:0;top:-1.05rem;font-size:11px;font-weight:600;color:var(--label);white-space:nowrap}
.pgmark[hidden]{display:none}
.dkey .limk{height:.375rem;background:transparent;border-top:1.5px dashed var(--closed)}
.play{flex:none;place-items:center;transition:transform .1s ease-out,background-color .15s;width:auto;height:2rem;padding:0 .75rem;border-radius:10px;gap:.375rem;display:none}
.row.how{font-size:11px;color:var(--label3);line-height:1.4}
.risk{height:2rem;top:1.75rem}
.risk .grid{stroke:var(--sep);stroke-width:1}
.risk .zone{fill:rgba(208,59,59,.35)}
.marks{top:4rem}
.rowlbl small{display:block;font-size:11px;color:var(--label3)}
.aclegend .pl{width:1.5rem;height:0;border-radius:0;background:transparent;border-top:3px dashed var(--c)}
.aclegend .pl.solid{border-top:2px solid var(--label)}
.aclegend:empty{display:none}
.attrib{bottom:12.75rem}
.dir-next .flag{display:block;margin-top:.5rem;border-radius:8px;background:var(--fill);font-size:15px}
.risk[hidden],.rowlbl span[hidden]{display:none}
.marks{top:2rem}
.lbl.river{display:none}
.attrib{left:1rem;right:auto;bottom:.25rem;font-size:11px}
.ticks span.end{font-weight:500;font-size:11px}
.hero{position:absolute;background:var(--mat);border-radius:16px;padding:.875rem 1.125rem 1rem;box-shadow:0 1px 3px rgba(0,0,0,.08),0 0 0 1px var(--edge);max-width:34rem;pointer-events:auto}
.ground{max-width:30rem;font-size:15px;color:var(--label);margin-top:.125rem;font-weight:500}
.dir-next{max-width:38rem;line-height:1.5;font-size:15px;color:var(--label2);margin-top:.375rem}
.dir-next .flag{display:block;margin-top:.5rem;border-radius:0;background:transparent;border-left:3px solid #e08a00;color:var(--label)}
.dir-next .flag.ok{border-left-color:var(--sep)}
.badge{display:inline-flex;align-items:center;gap:.375rem;padding:.0625rem .625rem .0625rem .5rem;border-radius:999px;background:var(--fill);font-size:15px;font-weight:500}
.badge::before{background:var(--label3)}
.badge.closed::before{background:var(--closed)}
.lbl.river{text-shadow:var(--halo);display:block;font-size:13px;font-style:italic;color:#5a7fa6}
.lbl.windtag{display:flex;font-size:13px;font-weight:600;color:var(--label);text-shadow:var(--halo)}
.lbl.windtag svg{width:2.25rem;height:2.25rem;transform:rotate(var(--a,0deg));stroke-width:2}
body.card .lbl.windtag span{display:none}
.aclegend .cred{color:var(--label3);font-size:11px}
.rail{left:1rem;top:1rem;bottom:10.5rem;width:22rem;gap:.75rem;overflow:auto}
.rail>*{pointer-events:auto}
.rail .conditions{position:static;width:auto;flex:none}
body.card .rail{display:none}
.lbl.town.under{font-weight:700}
.row.wind>*:not(.wcomp):not(.wcomp-t){grid-column:2}
.wcomp i{position:absolute;left:50%;top:50%;margin:-.875rem 0 0 -1px;transform:rotate(var(--wd,0deg));border-radius:1px}
.wcomp i::after{position:absolute;left:-4px;bottom:-1px;border:5px solid transparent;border-top:7px solid var(--label);border-bottom:0}
.wcomp b{position:absolute;top:-.15rem;left:50%;transform:translateX(-50%);font-size:11px;color:var(--closed)}
.wcomp-t{font-size:11px;color:var(--label2);margin-top:.25rem}
.lbl.windtag{align-items:center;gap:.5rem;display:none}
.segs i{flex:1;border-radius:0}
.segs i:first-child{border-radius:4px 0 0 4px}
.segs i:last-child{border-radius:0 4px 4px 0}
.dir-next .flag{padding:.125rem 0 .125rem .625rem;border-left-color:var(--sep);color:var(--label2)}
.dir-next b{color:var(--label);font-weight:600}
.badge::before{background:#2e9d54}
.rail{bottom:auto;overflow:visible}
.attrib{left:auto;right:1rem;top:.5rem;bottom:auto;font-size:11px;color:var(--label3)}
.row.wind{grid-template-columns:2.5rem 1fr;column-gap:.75rem;display:block}
.wcomp i{position:absolute;left:50%;top:50%;width:1.5px;height:.875rem;margin:-.4375rem 0 0 -.75px;background:var(--label);transform:rotate(var(--wd,0deg))}
.wcomp i::after{content:"";position:absolute;left:-3px;bottom:-1px;border:3.75px solid transparent;border-top:5px solid var(--label);border-bottom:0}
.wcomp-t{grid-column:1;text-align:center;display:none}
.risk{top:2rem;height:.75rem}
.risk .base{stroke:var(--sep)}
.track,.nights{height:3rem}
.nights{height:2.25rem}
.rail{overflow:auto}
.aclegend .ring{width:.625rem;height:.625rem;border-radius:50%;background:var(--bg);box-shadow:0 0 0 2px var(--east)}
.lbl.town{display:block;width:0;height:0;color:var(--label)}
.rail{overflow:visible;gap:.5rem;width:21rem}
.rail .hero{padding:.75rem 1rem .875rem}
.rail .dir{font-size:24px;height:2.1rem}
.rail .ground{font-size:15px}
.rail .dir-next{font-size:13px;margin-top:.25rem}
.rail .dir-next .flag{font-size:13px}
.rail .row{padding:.5rem 1rem}
.rail .row-sub{margin-top:0}
.rail .row.how{padding:.375rem 1rem}
.rail .row.run{padding:.375rem 1rem}
.rail .row-sub:empty{display:none}
.lbl.rwy{align-items:center;gap:.375rem;display:flex;font-size:13px}
.lbl.rwy b{padding:.0625rem .3125rem;border-radius:4px;font-weight:600;letter-spacing:.01em;text-shadow:none;background:#55575d!important;color:#fff!important}
body.card .lbl.rwy{display:none}
.lbl.town:not(.under){font-size:13px;font-weight:400}
.segs i.pgc{box-shadow:none;outline-offset:-2px;outline:none}
.segs i.lo{opacity:.5}

@media (min-width:640px){.dock{grid-template-columns:0 124px minmax(0,1fr)!important;column-gap:12px!important}} /* the dashboard's gutter: the plot starts 160 px in */
#app:not(.light) .dkey .lessk{box-shadow:0 0 0 1px rgba(255,255,255,.35)}
.dkey .lessk{background:var(--east);opacity:.5}
.dkey .nightk{background:repeating-linear-gradient(135deg,#d6d5d0 0 2px,#ecebe7 2px 4px)}
.pgmark{top:.375rem;height:.375rem;background:none}
.ticks span.day::before{position:absolute;left:-3px;top:-.25rem}
.hero .dash{display:inline-block;font-size:13px;font-weight:500;color:var(--label2);text-decoration:underline;text-decoration-color:var(--sep);text-underline-offset:3px}
.hero .dash:hover{color:var(--label);text-decoration-color:currentColor}
body.embed .hero .dash{display:none}
.bubble,.ticks,.caption,.row-value,.dkey{font-variant-numeric:tabular-nums}
.dkey{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem}
#app:not(.light) .dkey .nightk{background:repeating-linear-gradient(135deg,rgba(127,127,127,.5) 0 2px,transparent 2px 4px)}
.risknext{margin-top:.5rem}
.rchip{display:inline-flex;align-items:center;background:var(--fill2);color:var(--label);font-size:13px;font-weight:600}
.rchip.hi{background:var(--east);color:#fff}
.acc{margin-top:.5rem;font-size:13px;color:var(--label2);cursor:help}
.acc b{color:var(--label);font-weight:600}
.acc:empty{display:none}
.howpg:empty{display:none}
.more{display:none}
.rail .dir-next .flag{margin-top:.375rem;display:none}
.risk{top:2rem;height:2.25rem}
.risk .grid{stroke:var(--sep);stroke-width:1;stroke-dasharray:2 2}
.risk .base{stroke:var(--label3);stroke-opacity:.35;stroke-width:1;vector-effect:non-scaling-stroke}
.rgl{right:0;top:calc(2rem + 1.125rem - .5625rem);font-size:11px;line-height:1;color:var(--label3)}
.marks{top:4.625rem}
.track{height:5.125rem}
.nights{height:4.625rem}
.track:not(:has(.marks:not([hidden]))){height:4.5rem}
.nights span{top:-.875rem;display:none}
.rowlbl>span{line-height:1.1}
.rowlbl #r18-l:not([hidden]){height:1rem;margin-top:.375rem;display:flex;align-items:center}
.lbl.windind{text-shadow:none;font-size:13px;line-height:1.3;color:var(--label2)}
.lbl.windind:empty{display:none}
.lbl.windind b{color:var(--label);font-weight:600}
.lbl.windind svg{width:1.75rem;height:1.75rem;flex:none;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
body.card .lbl.windind span{display:none}
@media (max-width:639px){
  .rail{left:.5rem;right:.5rem;top:.5rem}
  .rail .hero{padding:.625rem .875rem .75rem}
  .rail .eyebrow{font-size:11px}
  .rail .dir{font-size:24px;height:1.85rem}
  .rail .ground{font-size:13px}
  .hero .seg{display:none}
  .more{display:block;margin-top:.5rem;font-size:13px;font-weight:500;color:var(--label2);text-decoration:underline;text-decoration-color:var(--sep);text-underline-offset:3px}
  .rail .conditions{display:none}
  #app.sheet .rail .conditions{display:block;position:fixed;left:.5rem;right:.5rem;bottom:calc(var(--dock-h,11rem) + 1rem);top:auto;height:auto;min-height:0;max-height:45vh;overflow:auto;z-index:6}
  .aclegend,.rose{display:none}
  .stack{display:none}
  .attrib{top:auto;bottom:.125rem;left:.5rem;right:.5rem;white-space:normal;text-align:center;font-size:11px}
  .dock{left:.5rem;right:.5rem;bottom:1rem;display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:.5rem;padding:2.25rem .75rem .5rem .625rem}
  .dock .rowlbl{grid-column:1;grid-row:1;font-size:11px}
  .rowlbl small{display:none}
  .dock .scrub{grid-column:2;grid-row:1}
  .dock .dkey{grid-column:1/-1;grid-row:2;flex-direction:row;flex-wrap:wrap;gap:.25rem .75rem;margin:.25rem 0 0;white-space:normal}
  .ticks span.end,.ticks span.start{display:none}
  .ticks span.day{font-size:11px}
  .bubble{white-space:normal;font-size:13px}
  .lbl.town:not(.under),.lbl.ptag{display:none}
}
.dir .dbadge{min-width:2.6rem;height:2rem;color:#f6f6f1;font-size:18px;font-weight:600;vertical-align:.25rem}
.rchip{gap:.375rem;padding:.25rem .625rem;border-radius:8px;background:rgba(224,138,0,.15);color:#6b3d00}
#app:not(.light) .rchip{background:rgba(224,138,0,.24);color:#ffd28a}
.dock{grid-template-columns:auto auto minmax(0,1fr);padding:.75rem 1.125rem .625rem .75rem}
.dock .rowlbl{grid-column:2;grid-row:1}
.dock .scrub{grid-column:3;grid-row:1}
.dock .dkey{grid-column:3;grid-row:2;flex-direction:row;flex-wrap:wrap;gap:.25rem 1rem;margin:0;font-size:13px}
.segs{height:2rem}
.risk{top:3.25rem;height:3.75rem}
.rgl{top:calc(3.25rem + 1.875rem - .4375rem);font-size:13px;line-height:1}
.marks{top:7.25rem}
.track{height:7.75rem}
.track:not(:has(.marks:not([hidden]))){height:7.25rem}
.nights{height:6.75rem}
.pgmark{top:calc(.75rem - 7px);height:6px}
.pgmark::after{left:-2px;right:-2px;top:0;height:6.25rem}
.rowlbl{font-size:13px}
.rowlbl>span:first-child{display:flex;align-items:center;height:2rem}
.rowlbl small{font-size:13px}
.ticks{font-size:13px;color:var(--label2)}
.selcol{position:absolute;margin-left:-1px;border:2px solid var(--label);border-radius:4px;pointer-events:none;z-index:3;box-sizing:content-box;padding:0 0;top:.75rem;height:1rem;display:none}
.thumb-knob{top:0;height:100%;width:2px;margin-left:-1px;border-radius:1px;background:var(--knob,#2c3e66);box-shadow:none}
.thumb-knob::before{left:50%;top:-6px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--knob,#2c3e66);box-shadow:0 0 0 2px var(--mat)}
#app:not(.light) .thumb-knob{--knob:#c9d3f0}
.lbl.windind{align-items:center;gap:.5rem;padding:.3125rem .625rem .3125rem .375rem;border-radius:10px;background:var(--chip);box-shadow:0 1px 4px rgba(0,0,0,.14);transform-origin:0 0;display:none}
.stack .windchip{font-size:13px;color:var(--label2);cursor:default}
.stack .windchip svg{width:1rem;height:1rem;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
.stack .windchip b{color:var(--label);font-weight:600}
.stack .windchip:empty{display:none}
.stack .windchip+.ib{border-left:.5px solid var(--sep)}
.ticks span{top:auto}
.ticks span.day,.ticks span.start,.ticks span.end{top:0;transform:none;font-weight:600;color:var(--label)}
.ticks span.day::before{top:0;left:-4px}
.ticks span.hr{color:var(--label2)}
.ticks span.end{font-weight:400;color:var(--label2);font-size:13px}
.rowlbl{display:flex;flex-direction:column;flex:none;margin-bottom:.75rem;gap:0;justify-content:flex-start;align-self:flex-start;margin:0;padding-top:.75rem;padding-right:2.25rem}
.rgl{left:-.5rem;right:auto;color:var(--label2)}
.rail .ground{font-size:15px;font-weight:400;color:var(--label2);line-height:1.45}
.rstat{display:flex;flex-direction:column;gap:.125rem;margin-top:.25rem}
.rstat span{font-size:13px;color:var(--label2)}
.rstat b{font-size:18px;font-weight:600;color:var(--label)}
.rstat b small{font-size:15px;font-weight:400;color:var(--label2)}
.rstat.hi b{color:var(--label)}
.sumbar{display:none}
.aclegend{position:absolute;align-items:center;gap:.75rem;padding:.375rem .75rem;border-radius:12px;pointer-events:none;top:1rem;bottom:auto;left:24rem;display:none!important}
.lbl.ptag{display:none!important}
.wcomp{grid-row:1/span 3;align-self:start;position:relative;border-radius:50%;box-shadow:none!important;width:1.125rem;height:1.125rem;display:inline-flex;align-items:center;justify-content:center;vertical-align:-.2rem;margin-right:.375rem}
.wcomp i,.wcomp i::after{display:none}
.wcomp svg{width:1rem;height:1rem;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
.dkey .plk{width:1rem;height:0;border-radius:0;background:none;border-top:2.5px dashed var(--east)}
.dkey .tok{width:1rem;height:0;border-radius:0;background:none;border-top:2px solid var(--label)}
.dkey .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--east),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--east)}
.ticks span.day{transform:translateX(6px)}
@media (max-width:499px){
  .rail .hero{padding:.5rem .75rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
  .rail .hero>*:not(.sumbar):not(.more){display:none!important}
  .sumbar{font-size:13px;font-weight:600}
  .rail .hero .more{margin:0;font-size:0}
  .rail .hero .more::after{content:"Details";font-size:13px}
  .pbar{height:5.25rem;align-content:center;gap:.375rem .5rem;padding:0 .75rem}
  .pbrand{flex-basis:100%;font-size:15px;gap:.375rem}
  .pbrand span{display:none}
  .pbrand svg{width:1.375rem;height:1.375rem}
  .ptabs a{padding:.25rem .5rem;font-size:13px}
  .ptz{margin-left:auto}
  .pthm{margin-left:0;order:9;width:1.75rem;height:1.75rem}
  .ptz button{height:1.5rem;padding:0 .5rem;font-size:13px}
  .ptz #tzl3{font-size:0}
  .ptz #tzl3::after{content:"Local";font-size:13px}
  .rail{top:5.75rem}
  .sumbar{display:block;flex:1;min-width:0;color:var(--label);text-overflow:ellipsis;white-space:normal!important;overflow:visible!important}
  .keyb{display:grid;place-items:center;position:absolute;right:.625rem;top:.5rem;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--fill);font:600 13px/1 var(--sans);color:var(--label2)}
  .dock .dkey{display:none}
  #app.keyon .dock .dkey{display:flex}
}
.pbar{height:3.25rem;display:flex;align-items:center;gap:1.25rem;padding:0 .75rem 0 1rem}
body.embed .pbar{display:none}
.pbrand{font-size:18px;font-weight:600;color:var(--label);white-space:nowrap}
.pbrand span{font-size:15px;font-weight:400;color:var(--label2)}
.ptabs a{font-size:13px;font-weight:500;color:var(--label2)}
.ptabs a[aria-current]{background:var(--fill);color:var(--label)}
.ptz button{height:1.75rem;padding:0 .75rem;border-radius:6px;font-size:13px;font-weight:500;color:var(--label2)}
.ptz button[aria-pressed=true]{background:var(--mat);color:var(--label);box-shadow:0 1px 2px rgba(0,0,0,.12)}
.hero .dash{margin-bottom:.375rem;pointer-events:auto;display:none}
.rail{top:4.75rem}
.attrib{top:auto;bottom:.25rem;right:1.25rem;font-size:11px}
.dock{bottom:1.25rem;padding-top:2.25rem}
.lbl.town span{text-shadow:0 0 3px var(--bg),0 0 3px var(--bg),0 0 6px var(--bg)}
.keyb{display:none}
.pbar a{text-decoration:none}
.ptabs{display:flex;gap:.25rem;align-items:center}
.ptabs a{padding:.25rem .75rem;border-radius:8px;display:inline-block;line-height:1.5}
.pbar{height:3.5rem;padding:0 1.5rem;background:#f1f1ef!important;box-shadow:0 1px 0 rgba(0,0,0,.06)!important}
#app:not(.light) .pbar{box-shadow:0 1px 0 rgba(255,255,255,.06)!important}
#app:not(.light) .pbar .pbrand svg rect:first-child{fill:#3a3b40}
.pbrand{font-size:18px}
.pthm{color:var(--label2)}
.pthm:hover{background:var(--fill)}
.pthm svg{width:1rem;height:1rem}
.ptz{display:flex;padding:2px;border-radius:8px;background:var(--fill);margin-left:.25rem}
.rail{top:4.5rem}
.acc .rstat b{font-size:15px}
.risk{top:3.25rem;height:2.5rem}
.rgl{top:calc(3.25rem + 1.25rem - .4375rem)}
.marks{top:6rem}
.track{position:relative;touch-action:none;outline-offset:4px;border-radius:8px;height:6.5rem}
.track:not(:has(.marks:not([hidden]))){height:6rem}
.nights{height:5.5rem}
.pgmark::after{height:5rem}
.rowlbl #risk-l:not([hidden]){display:flex;flex-direction:column;margin-top:.5rem;justify-content:flex-start;height:2.5rem}
@media (max-width:639px){
  .dock{grid-template-columns:auto minmax(0,1fr);padding:2.25rem .75rem .5rem .625rem}
  .dock .scrub{grid-column:2}
  .dock .rowlbl{font-size:13px}
  .ticks span.day{font-size:13px}
  .attrib{font-size:11px}
  .segs{height:1.5rem}
  .risk{top:2.75rem;height:2.75rem}
  .rgl{top:calc(2.75rem + 1.375rem - .4375rem)}
  .marks{top:5.75rem}
  .track{height:6.25rem}
  .track:not(:has(.marks:not([hidden]))){height:5.75rem}
  .nights{height:5.25rem}
  .rowlbl>span:first-child{height:1.5rem}
  .rowlbl #risk-l:not([hidden]){height:2.75rem}
  .pgmark::after{height:4.75rem}
  .lbl.windind span{display:inline}
  .ticks span.hr{display:block}
  .lbl.rwy.hide{visibility:hidden}
  .dir .dbadge{height:1.6rem;min-width:2.2rem;font-size:15px;vertical-align:.2rem}
  .dock{bottom:2.5rem}
  .attrib{bottom:.25rem;font-size:11px;line-height:1.25}
}
.prun{margin-left:auto;display:flex;font-size:13px;color:var(--label2);white-space:nowrap}
.prun .menu select{font-size:13px;font-weight:500;padding:.3125rem 1.625rem .3125rem .625rem}
.pthm{width:2rem;height:2rem;border-radius:8px;display:grid;place-items:center;margin-left:0}
.rail .hero{padding:.875rem 1rem .5rem}
.hsec{padding-top:.375rem;border-top:.5px solid var(--sep)}
.hsec .risknext,.hsec .acc{margin:0}
.kv{font-size:13px;color:var(--label2)}
.kv b{font-size:15px;font-weight:600;color:var(--label);white-space:nowrap}
.kv b small{font-size:13px;font-weight:400;color:var(--label2)}
.acc .kv{border-top:0}
.hero .conditions{position:static;width:auto;background:none;border:0;box-shadow:none;border-radius:0;padding:0}
.hero .conditions .row{padding:.4375rem 0}
.hero .conditions .row+.row::before{left:0}
.hero .conditions .row-title{font-size:13px;font-weight:400;color:var(--label2)}
.hero .conditions .row-value{font-size:15px;font-weight:600}
.hero .seg{margin-top:.5rem}
.dir .dbadge{color:#fff}
#app:not(.light) .dir .dbadge{color:#10131c}
.dock{padding:.75rem 1.125rem .625rem .75rem}
.dock .rowlbl{width:6.25rem}
.dock .rowlbl>span{left:0;right:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:auto;margin:0;font-size:13px;font-weight:500;color:var(--label);line-height:1.25}
.dock .rowlbl small{display:block;font-size:13px;font-weight:400;color:var(--label2)}
.dock .rowlbl #risk-l:not([hidden]){justify-content:flex-start}
.dock .rowlbl #r18-l:not([hidden]){top:calc(34px + var(--mt) - 3px);height:auto;margin:0;align-items:flex-start} /* left-aligned like the other row names */
.dock .rowlbl #wind-l:not([hidden]){top:calc(34px + var(--wt));justify-content:flex-start}
.dock .rowlbl [hidden]{display:none!important}
.ticks{position:relative;height:34px;border-bottom:1px solid var(--sep);font-size:13px}
.ticks span{position:absolute;white-space:nowrap;line-height:1}
.ticks span.start,.ticks span.day,.ticks span.end{top:2px;font-weight:600;color:var(--label);font-size:13px;transform:none}
.ticks span.day{transform:translateX(4px)}
.ticks span.day::before{content:"";width:1px;background:var(--label3);height:2rem;display:none}
.ticks span.start{left:0}
.ticks span.end{right:0;left:auto;font-weight:400;color:var(--label2)}
.ticks span.hr{top:auto;bottom:5px;transform:translateX(-50%);color:var(--label2);display:block}
.ticks i.tk{position:absolute;bottom:0;width:1px;height:4px;background:var(--label3);opacity:.5}
.ticks span.nowtick{font-weight:600;color:var(--label)}
.ticks span.pgl{top:auto;bottom:3px;padding:0 5px;border-radius:3px;background:rgba(224,138,0,.14);color:#9a5a00;font-weight:500;line-height:16px}
#app:not(.light) .ticks .pgl{color:#f0a24a}
.ticks .pgl[hidden]{display:none}
#track{height:var(--th)}
.segs{position:absolute;left:0;right:0;display:flex;gap:0;top:var(--dt);height:var(--dh)}
.risk{position:absolute;width:100%;overflow:visible;top:var(--rt);height:var(--rh)}
.rgl{font-size:13px;line-height:13px;color:var(--label2)}
.marks{position:absolute;gap:2px;top:var(--mt);height:10px}
.windrow{position:absolute;left:0;top:var(--wt);overflow:visible;pointer-events:none}
.windrow .zone{fill:rgba(208,59,59,.13)}
#app:not(.light) .windrow .zone{fill:rgba(239,91,79,.2)}
.windrow .grid{stroke:var(--sep);stroke-width:1}
.windrow .zero{stroke:var(--label3);stroke-width:1}
.windrow .lim{stroke:var(--closed);stroke-width:1;stroke-dasharray:3 3}
.windrow .ln{fill:none;stroke:var(--label2);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
.windrow .chip{fill:var(--mat)}
.windrow text{font:400 13px "IBM Plex Sans",system-ui,sans-serif;fill:var(--label2)}
.windrow .limt{font-size:11px;font-weight:600;fill:var(--closed);paint-order:stroke;stroke:var(--mat);stroke-width:3px}
.nights{position:absolute;left:0;right:0;pointer-events:none;top:var(--dt);bottom:0;height:auto}
.nights i{position:absolute;top:0;bottom:0;overflow:hidden;border-radius:0;background:rgba(127,127,127,.07)!important}
.pgmark{top:calc(var(--dt) - 7px)}
.pgmark::after{top:6px;height:calc(var(--th) - var(--dt) + 1px)}
.nowline{width:2px;margin-left:-1px;background:var(--label);border-radius:1px;z-index:2;pointer-events:none;top:20px;bottom:0}
.nowline::after{content:attr(data-t);position:absolute;display:none}
.bubble{color:var(--mat);font-size:13px;font-weight:600;line-height:20px}
.bubble span{color:var(--mat);opacity:.75;font-weight:500}
.dkey .limk{width:1rem;height:0;border-radius:0;background:none;border-top:2px dashed var(--closed)}
@media (max-width:499px){
  .pbar{height:5.25rem;flex-wrap:wrap;align-content:center;gap:.375rem .5rem;padding:0 .75rem}
  .rail{top:5.75rem}
}
@media (max-width:639px){
  .pbar{gap:.625rem .75rem;padding:.75rem 1rem}
  .pthm{margin:0}
  .ptz{margin:0}
  .prun{display:none}
  .rail{width:auto;gap:.375rem;top:6.25rem}
  .ticks span.start,.ticks span.nowtick,.ticks span.pgl{display:block}
  .ticks span.pgl[hidden]{display:none}
  .bubble{width:max-content;max-width:100%;overflow:hidden;text-overflow:ellipsis}
  .dock .rowlbl{width:4.75rem}
  .dock .rowlbl small{display:none}
}
.pbrand{display:flex;align-items:center;gap:.625rem;letter-spacing:-.01em;font-size:15px}
.pbrand span{font-size:15px}
.ptabs a,.ptz button{font-size:15px}
.prun{font-size:15px}
.prun .menu select{font-size:15px;font-weight:500;color:var(--label)!important;background:var(--fill)!important}
.rail .eyebrow{font-size:13px;font-weight:500;color:var(--label2)}
.rail .dir{font-size:24px}
.dir .dbadge{display:inline-flex;align-items:center;justify-content:center;background:var(--dc);box-shadow:none;font-size:.625em;height:1.733em;min-width:2.2em;padding:0 .3em;border-radius:4px;margin-right:.35em;vertical-align:.12em}
.rail .ground{font-size:15px}
.kv{font-size:15px}
.kv b{font-size:15px}
.hero .conditions .row-title,.hero .conditions .row-value{font-size:15px}
.row-sub,.row.how,details{font-size:13px}
.pstat .p1{display:flex;align-items:baseline;gap:.375rem}
.pstat .p1 b{font-size:24px;font-weight:600;letter-spacing:-.02em;color:var(--label)}
.pstat .p1 span{font-size:15px;font-weight:600;color:var(--label)}
.pstat .p2{font-size:15px;font-weight:500;color:var(--label)}
.pstat .p3{font-size:13px;color:var(--label2)}
.acc{cursor:default}
.rpk{font-size:13px;font-weight:600;line-height:1;color:var(--label);white-space:nowrap;text-shadow:0 0 3px var(--mat),0 0 3px var(--mat),0 0 6px var(--mat)}
.dkey{font-size:13px}
@media (max-width:639px){
  .pstat .p1 b{font-size:18px}
}
.segs .dlab{font-size:13px;font-weight:600;line-height:1;color:#fff;white-space:nowrap}
#app:not(.light) .segs .dlab{color:#10131c}
.track .pgl{background:rgba(224,138,0,.14);color:#9a5a00;font-size:13px;font-weight:500;line-height:16px;white-space:nowrap}
#app:not(.light) .track .pgl{color:#f0a24a}
.track .pgl[hidden]{display:none}
.ticks span.h00{display:block}
.dock .dkey{margin-top:10px}
.hsec{border-top:1px solid var(--sep);padding-top:.5rem;margin-top:.625rem}
.pstat{padding:.5rem 0 .25rem;border-top:0!important}
.sbw{display:none}
.prun .menu select{line-height:20px}
@media (max-width:639px){
  .ticks span.h00{display:block}
  .lbl.windind{display:none!important}
  .sbw{display:inline-flex;margin-left:auto;font-weight:500;color:var(--label2);white-space:nowrap}
  .sbw svg{width:.875rem;height:.875rem;fill:none;stroke:var(--label);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
  .sbw b{font-weight:600;color:var(--label)}
}
.hero .hsec.conditions{border-top:1px solid var(--sep);padding-top:.375rem;margin-top:.5rem}
.dock .rowlbl>span{justify-content:center!important}
.dock .rowlbl #risk-l:not([hidden]){margin:0;top:calc(34px + var(--rt));height:var(--rh)!important;justify-content:center!important;white-space:nowrap}
.dock .rowlbl #dir-l{top:calc(34px + var(--dt));height:var(--dh)}
.rgl{color:var(--label2)}
.rgl[hidden]{display:none}
.risk .base.calm{stroke:var(--label2);stroke-opacity:.6}
.dock .rowlbl{width:7rem}
.track .pgl{background:var(--tagbg,#9a5a00);color:var(--tagink,#fff);font-weight:600;font-size:11px} /* siteui.STYLE.tag_bg: the dashboard's tag */
#app:not(.light) .track .pgl{background:var(--tagbg,#f0a030);color:var(--tagink,#1b1c1f)}
.segs .dlab.e,.segs .dlab.w{color:#fff}
#app:not(.light) .segs .dlab.w,#app:not(.light) .dir .dbadge[data-d="25"]{color:#10131c}
#app:not(.light) .dir .dbadge{color:#fff}
.dir span{position:absolute;left:0;top:0;will-change:transform,opacity;color:var(--label)!important}
.pbar{position:absolute;z-index:5;left:0;right:0;top:0;border-radius:0;backdrop-filter:none!important;gap:24px!important;padding:0 24px!important;box-shadow:0 1px 0 rgba(27,28,30,.09)!important}
#app:not(.light) .pbar{background:#111214!important;box-shadow:0 1px 0 rgba(255,255,255,.1)!important}
.pbrand svg{width:24px;height:24px;color:var(--label)}
.prun .menu select:hover{background:var(--fill2)!important}
.stack .windchip{align-items:center;gap:.375rem;height:2rem;padding:0 .75rem;border-left:0;border-radius:12px 0 0 12px;display:none!important}
@media (max-width:639px){
  .ptz #tzl3{font-size:13px}
  .ptz #tzl3::after{content:none!important}
  .sumbar{white-space:nowrap!important;text-overflow:ellipsis}
  .dock .rowlbl{grid-column:1;width:4.25rem}
}
.pstat .p1 span{font-size:15px;font-weight:500;opacity:1;color:var(--label2)}
.pgmark::after{content:"";position:absolute;background:rgba(224,138,0,.06);pointer-events:none;display:none!important}
.track .pgl{line-height:14px;font-size:11px}
.ticks span.nowtick{color:var(--mat);font-size:11px;font-weight:600;line-height:14px}
.lbl.town span{position:absolute;text-shadow:0 0 2px var(--bg),0 0 3px var(--bg),0 0 5px var(--bg),0 0 8px var(--bg),0 0 12px var(--bg)!important}
.lbl.place{text-shadow:0 0 2px var(--bg),0 0 4px var(--bg),0 0 8px var(--bg)}
.prun .menu select{border-radius:8px;cursor:pointer;transition:background-color .15s;background:transparent!important;padding:5px 22px 5px 6px!important;font-weight:500;color:var(--label)!important}
.prun .menu select:hover{background:var(--fill)!important}
.prun .menu svg{display:block;right:6px;width:.625rem;height:.625rem;color:var(--label2)}
#app:not(.light) .segs .dlab.e{color:#fff}
.prun b{font-weight:500;color:var(--label)}
.row.run{padding:.375rem 0!important}
.row.run .menu select{font-size:13px;padding:4px 22px 4px 8px;background:var(--fill)!important;border-radius:6px;color:var(--label)!important}
.row-title small{font-size:13px;color:var(--label2);font-weight:400}
.attrib{font-size:11px;color:var(--label2)!important}
@media (max-width:639px){
  .rose{left:auto;right:.75rem;top:9.25rem;bottom:auto;transform:scale(.8);transform-origin:100% 0;display:none!important}
  .dock{left:0!important;right:0!important;bottom:0!important}
  .attrib{bottom:.375rem!important}
}
.tarr{display:inline-block;width:1.15em;height:.8em;margin:0 .3em;vertical-align:-.05em;fill:none;stroke:currentColor;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.row.accrow{padding:.5rem 0 .25rem!important}
.row.accrow .pstat{border-top:0;padding:0}
#app:not(.light) .lbl.rwy b{background:#55575d!important;color:#fff!important}
.lbl.town:not(.under){font-size:13px;font-weight:600}
.lbl.town:not(.under) i{left:-3px;top:-3px;width:6px;height:6px;background:var(--label2);box-shadow:none;display:none}
.attrib{font-size:11px}
@media (max-width:639px){
  .dock .dkey{flex-wrap:wrap;gap:.25rem .75rem;grid-column:1/-1;margin-top:.375rem;font-size:11px;display:none!important}
  .dock .dkey .mapk:not(:first-of-type){display:none}
  .attrib{bottom:.5rem!important;left:.75rem!important;right:.75rem!important;text-align:left}
}
.pstat .p3{font-size:13px;color:var(--label);margin-top:.25rem}
.pstat .p3 b{font-weight:600;color:#9a5a00}
#app:not(.light) .pstat .p3 b{color:#f0a24a}
.pstat .p3 span{color:var(--label2);font-size:13px}
@media (max-width:639px){
  .sbw{align-items:center;gap:.25rem;display:none!important}
  .sumbar{white-space:normal!important}
}
.dock{bottom:1.75rem}
@media (max-width:639px){
  .dock{bottom:0}
}
.lbl.town:not(.under){opacity:1;font-weight:400!important;font-size:13px;color:var(--label2)!important;font-style:normal;display:none!important}
.ticks span.day.dend{transform:none!important;text-align:right}
.rail .outl{margin-top:.5rem;font-size:15px;font-weight:600;color:var(--label);line-height:1.35}
.rail .disl{margin-top:.25rem;font-size:13px;color:var(--label);line-height:1.4}
.rail .disl b{font-weight:600;color:#9a5a00}
#app:not(.light) .rail .disl b{color:#f0a24a}
.rail .disl[hidden]{display:none}
.dkey .ksep{width:1px;height:.875rem;background:var(--sep);margin:0 .5rem}
.rgl0{position:absolute;right:calc(100% + 4px);top:calc(var(--rt) + var(--rh) - 9px);font-size:13px;line-height:1;color:var(--label2);pointer-events:none}
.rgl2{position:absolute;right:calc(100% + 4px);top:calc(var(--rt) - 4px);font-size:13px;line-height:1;color:var(--label2);pointer-events:none}
.rgl2[hidden]{display:none}
#app .dock .rgl{display:none!important} /* only 0 and the top carry values (phones too); the mid gridline stays */
@media (max-width:639px){.rgl2{right:calc(100% + 4px);font-size:11px;z-index:6}}
@media (max-width:639px){
  .dkey .ksep{display:none}
}
.pstat .pm{font-size:15px;color:var(--label)}
.pstat .p3 span{display:none}
.rpk{font-weight:400!important;color:var(--label2)!important}
@media (min-width:640px){
  .pthm{margin-left:-12px!important}
  .ptz{margin-left:-12px!important}
  .pbar{border:0!important}
}
.rail .dir{font-size:18px;line-height:1.75rem}
.rail .dir .dbadge{font-size:13px}
.rail .ground{font-size:13px;color:var(--label2)!important;margin-top:.375rem}
.rail .eyebrow{font-size:13px}
.kv{display:flex;justify-content:space-between;align-items:baseline;gap:.75rem;padding:.3125rem 0;font-size:13px;color:var(--label2)}
.kv b{font-size:15px;font-weight:500!important;color:var(--label)}
.hero .conditions .row-title{font-size:13px;font-weight:400!important;color:var(--label2)!important}
.hero .conditions .row-value{font-size:15px;font-weight:500!important}
.hero .conditions .row-value small{font-size:13px!important}
.row-sub,.row-sub *{font-size:13px;color:var(--label2)}
.pstat .p1 b{font-size:24px}
.pstat .pm,.pstat .p2{font-size:13px;color:var(--label2);font-weight:400}
.pstat .p2{color:var(--label);margin-top:.125rem}
.pstat .p3{display:flex;margin-top:.25rem;padding:.3125rem 0 0;border-top:.5px solid var(--sep)}
.pstat .p3 b{color:#9a5a00!important}
#app:not(.light) .pstat .p3 b{color:#f0a24a!important}
.mapkey{position:absolute;z-index:3;display:flex;align-items:center;gap:.875rem;padding:.4375rem .75rem;border-radius:12px;font-size:13px;color:var(--label2);pointer-events:none;white-space:nowrap}
.mapkey span{display:inline-flex;align-items:center;gap:.375rem}
.mapkey .plk{width:1rem;height:0;border-top:2.5px dashed var(--east)}
.mapkey .tok{width:1rem;height:0;border-top:2px solid var(--label)}
.mapkey .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--east),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--east)}
.mapkey:empty{display:none}
body.card .mapkey{display:none}
@media (max-width:639px){
  .mapkey{display:none}
}
.pstat .p3 span{display:inline!important;font-size:13px!important;color:var(--label2)!important}
@media (min-width:640px){ /* compact at every desktop size: the panels are zoomed to a 810 px high canvas */
  .hero .conditions .row,.row.run,.row.accrow{padding-top:.3125rem!important;padding-bottom:.3125rem!important}
  .kv{padding:.25rem 0!important}
  .rail .row.how{display:none!important}
  .rail .hero{padding-top:.625rem;padding-bottom:.375rem}
  .hsec{margin-top:.375rem;padding-top:.25rem}
  .rail .outl{margin-top:.25rem}
}
@media (min-width:640px){
  .rail{overflow-y:auto;overflow-x:hidden;scrollbar-width:thin}
}
.lbl.town.under i{background:var(--eastLine)!important;box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--eastLine)!important}
.rail .dir{font-size:24px;line-height:2.25rem;font-weight:600}
.rail .dir .dbadge{font-size:15px}
.pstat .p1{display:flex;align-items:baseline;flex-wrap:wrap;gap:.25rem}
.pstat .p1 b{font-size:18px!important;font-weight:600}
.pstat .pofl{font-size:13px;color:var(--label2)}
.pstat .pofl em{font-style:normal;font-size:18px;font-weight:600;color:#9a5a00}
#app:not(.light) .pstat .pofl em{color:#f0a24a}
.pstat .pm{font-size:13px!important}
.row.mapkey{display:flex!important;font-size:13px;color:var(--label2);white-space:normal}
.row.mapkey:empty{display:none!important}
.row.mapkey .twk{box-shadow:inset 0 0 0 2px var(--eastLine),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--eastLine)!important}
.attrib{position:absolute;display:block;bottom:.375rem!important;left:24px!important;right:auto!important;text-align:left!important;font-size:13px;color:var(--label2)!important;white-space:nowrap}
@media (max-width:639px){
  .row.mapkey{display:none!important}
  .attrib{white-space:normal}
}
.pgmark{border-top:3px solid var(--label);border-bottom:0;z-index:2;top:var(--dt)!important;height:3px!important;border:0!important;background:#e08a00!important;border-radius:0!important}
#app:not(.light) .pgmark{background:#f0a030!important}
.track .pgl{line-height:14px}
@media (max-width:639px){
  .attrib{font-size:11px;line-height:1.3}
}
.rail .ground:empty{display:none}
.rail .outl{font-weight:500!important}
.pstat .kv b{font-size:15px!important;font-weight:600!important}
.pofl2{font-size:15px;font-weight:400;color:#9a5a00}
#app:not(.light) .pofl2{color:#f0a24a}
.kv span,.hero .conditions .row-title{color:var(--label2)!important;font-size:13px;text-transform:none;letter-spacing:0;font-weight:400!important}
.kv b,.hero .conditions .row-value{font-size:15px;font-weight:600!important}
.mapchip{position:absolute;z-index:3;display:flex;align-items:center;gap:.875rem;padding:.375rem .75rem;border-radius:12px;font-size:13px;color:var(--label2);pointer-events:none;white-space:nowrap}
.mapchip span{display:inline-flex;align-items:center;gap:.375rem}
.mapchip .plk{width:1rem;height:0;border-top:2.5px dashed var(--eastLine)}
.mapchip .tok{width:1rem;height:0;border-top:2px solid var(--label)}
.mapchip .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--eastLine),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--eastLine)}
.mapchip:empty{display:none}
body.card .mapchip{display:none}
.prun{display:flex}
#livedot{width:8px;height:8px;border-radius:50%;flex:none;margin-right:.375rem}
#livedot.ok{background:#5c9a0f} /* yellow-green, as on the dashboard (--live): never read as the West teal */
#app:not(.light) #livedot.ok,body:has(#app:not(.light)) #livedot.ok{background:#8cc63f}
#livedot.old{background:var(--label3)}
.prun .age{font-weight:400;color:var(--label2)}
@media (max-width:639px){
  .mapchip{display:none}
}
.track .pgl{font-size:11px;font-weight:600!important}
@media (max-width:639px){
  .pbar{align-items:center;display:grid!important;height:auto!important;gap:.375rem .75rem!important;padding:.5rem .75rem!important;align-content:start;grid-template-columns:minmax(0,1fr) auto auto!important;grid-template-areas:"brand thm tz" "tabs run run"!important;column-gap:8px!important}
  .pbrand{flex-basis:auto;grid-area:brand;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}
  .pthm{grid-area:thm;display:grid!important;margin:0!important}
  .ptz{grid-area:tz;justify-self:end;display:flex!important;margin:0!important}
  .prun{font-size:13px;white-space:nowrap}
  .prun .age .uh{display:none}
  .rail .hero{display:block!important;padding:.625rem .875rem!important}
  .rail .hero>*:not(.sumbar){display:none!important}
  .sumbar{align-items:center;gap:.5rem;overflow:hidden!important;display:block!important;white-space:normal!important;font-weight:400!important;pointer-events:auto;position:relative}
  .sb1{display:flex;align-items:center;gap:.5rem;font-size:18px;font-weight:600;color:var(--label);flex-wrap:nowrap}
  .sb1 .dbadge{display:inline-flex;align-items:center;justify-content:center;height:1.5rem;min-width:2.1rem;padding:0 .3rem;border-radius:4px;background:var(--dc);color:#fff;font-size:15px;font-weight:600}
  #app:not(.light) .sb1 .dbadge[data-d="25"]{color:#10131c}
  .sb2{margin-top:.25rem;font-size:15px;font-weight:500;color:var(--label)}
  .sb3{font-size:13px;color:var(--label);margin-top:2px}
  .sb3 b{color:var(--label);font-weight:600}
  .sb3 em{font-style:normal;color:#9a5a00}
  #app:not(.light) .sb3 em{color:#f0a24a}
}
.pofl2{margin-top:.125rem;font-size:13px!important;color:var(--label2)!important;font-weight:400}
.pofl2 em{font-style:normal;color:#9a5a00;font-weight:600}
#app:not(.light) .pofl2 em{color:#f0a24a}
.pgwash3{background:rgba(224,138,0,.09)}
.rgl{font-size:11px;color:var(--label3)!important}
.risk .grid{vector-effect:non-scaling-stroke;stroke-opacity:.6}
.ticks span.start{top:0!important}
.stack .ib{width:auto;height:2rem!important;border-radius:0!important}
.stack{position:absolute;right:1rem;flex-direction:row;gap:0;bottom:auto;top:4.5rem;border-radius:8px!important;overflow:hidden}
.stack .ib:first-child{border-radius:8px 0 0 8px!important}
.stack .ib:last-child{border-radius:0 8px 8px 0!important}
.rgl{font-size:13px;color:var(--label2)!important}
.ticks span.day.off{opacity:0}
.track .pgl{position:absolute;z-index:7!important;left:auto;line-height:14px!important;height:14px!important;padding:0 6px!important;letter-spacing:.02em;font-weight:500!important;top:calc(var(--dt) - 15px)!important;border-radius:3px 3px 0 0!important}
.dock{bottom:2rem!important}
.ticks span.day{transform:translateX(4px)!important}
@media (max-width:639px){
  .dock{bottom:0!important}
}
.rail .dir{font-size:24px;line-height:2rem}
.rail .dir .dbadge{font-size:15px}
.rail .outl,.kv b,.hero .conditions .row-value,.pstat .kv b{font-size:15px}
.rail .eyebrow,.rail .disl,.kv span,.hero .conditions .row-title,.row-sub,.row-sub *,.pofl2,.kvs,.row.how,details,.row.mapkey{font-size:13px}
.kvs{color:var(--label2);text-align:right;margin-top:-.125rem;padding-bottom:.25rem}
.row.mapkey{background:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;position:static!important;display:flex!important;flex-wrap:wrap;gap:.375rem .875rem;padding:.5rem 0!important;color:var(--label2)}
.row.mapkey span{display:inline-flex;align-items:center;gap:.375rem}
.row.mapkey .plk{border-top-color:var(--eastLine)!important;width:1rem;height:0;border-top:2.5px dashed var(--eastLine)}
.row.mapkey .tok{width:1rem;height:0;border-top:2px solid var(--label)}
.row.mapkey .twk{width:.625rem;height:.625rem;border-radius:50%;background:var(--mat);box-shadow:inset 0 0 0 2px var(--eastLine),inset 0 0 0 3.5px var(--mat),inset 0 0 0 10px var(--eastLine)}
.badge::before{background:none!important;color:var(--label2);font-size:13px}
.dock{bottom:2.5rem!important}
.dkey .pgk{outline-offset:-1.5px;margin-top:.25rem;box-shadow:none;border-bottom:0;border-top:3px solid #e08a00!important;outline:none!important;margin:0!important;width:1rem!important;height:.5625rem!important;border:0!important;border-radius:2px!important;background:#e08a00!important}
@media (max-width:639px){
  .row.mapkey{display:none!important}
  .ptabs{grid-area:tabs;padding:2px;border-radius:8px;background:var(--fill);justify-self:start!important;width:auto!important}
  .ptabs a{padding:3px 10px!important;border-radius:6px;flex:0 0 auto}
  .ptabs a[aria-current]{background:var(--mat)!important;box-shadow:0 1px 2px rgba(0,0,0,.12)}
}
.dock{grid-template-rows:auto auto auto}
.dock .dhd{grid-column:2/-1;grid-row:1}
.dhl{flex-direction:column;gap:2px}
.dmenu{flex:none;gap:8px;font-size:13px;color:var(--label2);pointer-events:auto}
.dmenu select{font-size:13px;font-weight:500!important;line-height:20px;padding:4px 24px 4px 8px!important;border-radius:6px!important;background:var(--fill)!important;color:var(--label)!important;cursor:pointer}
.dmenu svg{right:8px!important}
.rail .row.how{display:none!important}
.dock .play{grid-column:1;align-self:center;grid-row:2!important}
.dock .rowlbl{position:relative;height:calc(34px + var(--th,120px));padding:0;margin:0;gap:0;align-self:start;grid-row:2!important}
.dock .scrub{grid-row:2!important}
.dock .dkey{align-self:start;grid-row:3!important;margin-top:14px}
.dtitle{font-size:15px;font-weight:600;color:var(--label);line-height:20px}
.dhd .readout{font-size:13px;color:var(--label2)}
.dhd .ro{min-width:0;overflow:visible;white-space:normal;text-overflow:clip}
.dhd .ro b{font-weight:500;color:var(--label)} /* the readout regular, only its time in medium */
.dhd .rback{flex:none;pointer-events:auto;height:28px!important;padding:0 12px!important;border-radius:8px!important;background:var(--fill)!important;box-shadow:none!important;font-size:13px;font-weight:500!important;color:var(--label)!important;line-height:28px!important}
.dhd .rback:hover{background:var(--fill);color:var(--label)}
.dhd .rback[hidden]{display:none}
.bubble{font-size:11px;font-weight:600!important;line-height:18px!important}
.bubble span{display:none}
.thumb-knob{will-change:transform;top:0!important;bottom:0!important;height:auto!important;width:1.5px!important;margin-left:-.75px!important;border-radius:0!important;background:var(--label)!important;box-shadow:none!important;z-index:5!important}
.thumb-knob::before{content:"";position:absolute;display:none!important}
.ticks span.hr,.ticks span.nowtick{transition:opacity .15s}
.ticks span.hr.off,.ticks span.nowtick.off,.rpk.off{opacity:0!important}
.rpk{font-size:11px;line-height:14px!important}
.pgwash3{position:absolute;pointer-events:none;z-index:0;top:var(--rt)!important;height:var(--rh)!important}
.rgl{position:absolute;pointer-events:none;z-index:1;border-radius:2px;transform:none;background:none;padding:0;left:auto!important;right:calc(100% + 8px)!important;top:calc(var(--rt) + var(--rh) * (1 - var(--gf,.5)) - 7px)!important}
.mids i{position:absolute;top:0;bottom:0;width:1px;background:rgba(240,239,236,.14)}
#app.light .mids i{background:rgba(27,28,30,.14)}
.ticks i.dl{position:absolute;top:0;bottom:-1px;width:1px;opacity:1;background:rgba(240,239,236,.14)!important}
#app.light .ticks i.dl{background:rgba(27,28,30,.14)!important}
.ticks span.day.dend{left:auto!important;right:0!important;transform:none!important}
.kv b .swb{display:inline-block;position:relative;width:28px;height:6px;margin-right:8px;border-radius:3px;background:var(--fill2);vertical-align:1px;overflow:hidden}
.kv b .swb i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#4b4d53}
#app:not(.light) .kv b .swb i{background:#9aa0a8}
@media (max-width:599px){
  .dock .dhd,.dock .scrub,.dock .dkey{grid-column:1/-1!important}
  .dock .play{display:none!important}
  .dock .rowlbl>span{left:6px!important;right:auto!important;height:16px!important;font-size:11px;font-weight:600!important}
  .dock .rowlbl #dir-l{top:calc(34px + var(--dt) - 22px)!important}
  .dock .rowlbl #risk-l:not([hidden]){top:calc(34px + var(--rt) - 21px)!important;height:13px!important}
  .dock .rowlbl #r18-l:not([hidden]){top:calc(34px + var(--mt) - 21px)!important} /* 6 px above its cells, clear of the chance baseline */
  .dock .rowlbl small{display:none!important}
  .dhd .readout{font-size:11px}
  .dtitle{font-size:13px}
  .dmenu{display:none!important}
}
#wind-s summary{margin-left:-2px}
.mids{position:absolute;inset:0;pointer-events:none;z-index:1!important}
.ticks span.day,.ticks span.start{background:var(--mat);padding:0 3px;margin-left:-3px;z-index:1}
.ticks,.ticks span,.ticks span.day,.ticks span.start,.ticks span.hr{font-size:13px!important}
.ticks span.nowtick{z-index:1;transform:translateX(-100%)!important;height:14px;padding:0 5px;border-radius:3px;background:var(--label);top:auto!important;bottom:2px!important;pointer-events:auto;cursor:help}
.dhd .readout{white-space:nowrap;min-width:0;height:20px;overflow:hidden;display:flex;align-items:center;gap:16px}
@media (min-width:600px){
  .dock .rowlbl #risk-l:not([hidden]){justify-content:center!important;padding-bottom:0} /* centred on the plot, as on the dashboard */
}
.row-value .wcomp{width:14px;height:14px}
.row-value .wcomp svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transform:rotate(var(--a,0deg))}
#r18-v .badge{background:none!important;padding:0!important;box-shadow:none!important;font-weight:600;font-size:15px}
.dock .rowlbl>span{position:absolute;font-size:13px}
.dock .rowlbl small{font-size:13px!important}
.dtitle{font-size:15px;white-space:nowrap}
@media (max-width:639px){
  .rgl{display:block!important;left:auto!important;right:calc(100% + 4px)!important;top:calc(var(--rt) + var(--rh) * (1 - var(--gf,.5)) - 15px)!important;font-size:11px;color:var(--label2)!important;z-index:6}
  .rgl0{display:block!important;left:auto!important;right:calc(100% + 4px)!important;top:calc(var(--rt) + var(--rh) - 14px)!important;font-size:11px;z-index:6}
  .dhd .readout{line-height:16px;align-items:flex-start;height:16px!important;white-space:nowrap!important}
  .dhd .ro{overflow:visible}
  .prun{display:flex!important;overflow:hidden;min-width:0;margin-left:0!important;justify-content:flex-start!important;justify-self:end!important;grid-area:run}
  .dock .rowlbl>span{font-size:11px}
}
.row-value .wcomp,.row-value .wcomp svg{width:13px!important;height:13px!important}
.hero .conditions .row-value{display:flex;gap:6px;align-items:baseline!important}
.row-value .wcomp{display:inline-flex;margin:0;align-self:center;transform:translateY(1px)}
.rail details>summary{display:inline-flex}
.rail details>summary::-webkit-details-marker{display:none}
.rail details>summary::before{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s;margin:0 2px}
.rail details[open]>summary::before{transform:rotate(45deg)}
.segs .dlab{position:absolute;top:50%;transform:translateY(-50%);z-index:2;pointer-events:none;padding-left:0}
@media (max-width:639px){
  .attrib{z-index:6;pointer-events:none;left:.75rem!important;right:.75rem!important;bottom:.375rem!important;display:none!important}
  .dock{padding:.625rem .75rem .5rem .625rem;border-radius:16px 16px 0 0!important;box-shadow:0 -8px 24px rgba(0,0,0,.12)!important;bottom:0!important;padding-left:16px!important;padding-right:16px!important;padding-top:8px!important;padding-bottom:16px!important}
}
.dock{position:absolute;gap:.875rem;display:grid;column-gap:.875rem;align-items:start;padding-top:10px!important;row-gap:4px!important;padding-bottom:16px!important}
@media (max-width:599px){
  .dock .rowlbl{grid-column:1/-1!important;grid-row:2!important;width:auto!important;height:auto!important;align-self:stretch;pointer-events:none;z-index:6;margin-left:28px}
  .dock .rowlbl>span{flex-direction:row!important;align-items:center!important;left:8px!important}
  .dock .dkey{margin-left:0}
}
@media (min-width:600px){
  .dhl{gap:16px!important;flex-direction:row!important;column-gap:16px;row-gap:2px;flex-wrap:nowrap!important;align-items:baseline}
  .dhl .readout{height:auto!important;overflow:visible!important;flex-basis:auto;order:0;min-width:0;white-space:nowrap!important}
}
.badge::before{border-radius:50%;width:auto!important;height:auto!important;content:none!important;display:none!important}
.badge .ck{width:14px;height:14px;margin-right:4px;vertical-align:-2px;color:var(--label2)}
#app.light .nowline{background:#4b4d53!important}
.bubble{color:var(--label)!important}
.bubble .pinG{display:none;width:10px;height:10px}
.bubble.pin{background:var(--label)!important;color:var(--mat)!important;box-shadow:none!important}
.bubble.pin .pinG{display:inline}
.thumb-knob.pin{width:2px!important;margin-left:-1px!important}
.track:focus{outline:none}
.track:focus-visible{outline:2px solid var(--label2)}
.hero .conditions .row-title,.kv span{font-size:13px;font-weight:400!important;color:var(--label2)!important}
.hero .conditions .row-value,.kv b{font-size:15px;font-weight:600!important;color:var(--label)!important}
.hero .conditions .row-sub,.hero .conditions .row-sub *{font-size:13px;color:var(--label2)!important;text-align:right}
.rail details>summary{list-style:none;align-items:center;gap:6px;cursor:pointer;justify-content:flex-end;width:100%}
.pstat .kv b{font-size:24px!important}
.pstat .pofl2{text-align:right}
.rail .dir{margin-top:.25rem;font-size:24px;height:36px!important;line-height:36px!important;font-weight:600}
.rail .dir .dbadge{height:29px!important;min-width:40px!important;font-size:15px!important;border-radius:5px!important;vertical-align:4px!important} /* the title's cap height (24 px type: 17) plus 6 px above and below, on its baseline */
.rail .dir{line-height:30px!important}
.rail .hero .outl{margin-top:6px!important}
.rail .hero .conditions .row{padding-top:2px!important;padding-bottom:2px!important}
.rail .hero .disl{margin-top:2px!important;line-height:18px!important}
.pstat .kv b{letter-spacing:-.02em;font-size:15px!important} /* the panel's other values' size */
.pstat .pofl2,.pstat .pofl2 *{text-align:left!important}
#wind-why{text-align:right;color:var(--label3)!important}
#wind-s{text-align:left!important;margin:4px 0 0}
.rail #wind-s details>summary{width:100%;padding:4px 0;border-top:1px solid var(--sep);margin-top:2px;justify-content:flex-start!important}
.rail #wind-s details>summary::before{margin-left:0!important}
.prun{align-items:center;gap:8px!important}
.prun b{font-weight:400!important;color:var(--label)}
.prun b:empty{display:none}
.lbl.town.num span{display:none!important}
.lbl.town.num i{color:var(--bg);font:600 11px/1 "IBM Plex Sans",system-ui,sans-serif;font-style:normal}
.row.mapkey .tkey{display:inline-flex;align-items:center;gap:4px}
.row.mapkey .plk.gh{opacity:1} /* the map draws these lines at full strength (GHOST_OP): the dashes say hypothetical */
.row.mapkey .tkey b{display:inline-grid;place-items:center;width:15px;height:15px;border-radius:50%;background:var(--eastLine);color:var(--mat);font:600 11px/1 "IBM Plex Sans",system-ui,sans-serif}
.prun .frs{color:var(--label2);font-variant-numeric:tabular-nums}
.prun .frs b{font-weight:600;color:var(--label2)}
.prun .age{margin-left:8px;display:none}
.row.mapkey .kbr{flex-basis:100%;height:0}
.sb4{margin-top:4px;font-size:13px;line-height:1.4;color:var(--label2)}
.prun .frs b{font-weight:600!important}
.probl{margin-top:4px;font-size:13px;line-height:1.4;color:var(--label2)}
.pofl2 em,.sb3 em{font-weight:600}
.rpk .rpkc{display:none}
@media (max-width:599px){
  .dock .scrub{margin-left:28px;width:calc(100% - 28px)!important;min-width:0;box-sizing:border-box}
  .dock{grid-template-columns:minmax(0,1fr)!important;padding:12px 16px 12px!important;padding-right:16px!important}
  .dock .rowlbl #dir-l{height:14px!important;top:calc(34px + var(--dt) - 22px)!important}
}
#rpk.off~#rpkc,.rpk.off+.rpkc3{opacity:0}
.row.mapkey.mapov{left:calc(min(22rem, 40%) + 32px);bottom:calc(var(--dock-top-h, 260px) + 12px);gap:6px 16px;max-width:calc(100% - min(22rem,40%) - 64px);font-size:13px;color:var(--label2)}
.row.mapkey.mapov span{display:inline-flex;align-items:center;gap:6px}
.row.mapkey.mapov .kbr{display:none}
.lbl.town.num i{display:grid!important;place-items:center;border-radius:50%;background:var(--eastLine)!important;pointer-events:auto;cursor:default;width:22px!important;height:22px!important;margin:-11px 0 0 -11px!important;font-size:13px;box-shadow:0 0 0 2.5px var(--bg)!important}
.labels .lbl.town.num{pointer-events:none}
.lbl.town.num i{box-shadow:0 0 0 3px var(--bg)!important} /* a 3 px halo in the scene's colour: the landing line breaks around the disc */
#app:not(.light) .lbl.town.num i{background:#2f4a7a!important;color:#fff!important;box-shadow:0 0 0 1.5px #16233b,0 0 0 4px var(--bg)!important} /* dark: the 07 badge's navy, white numerals, a darker ring */
#app:not(.light) .row.mapkey .tkey b{background:#2f4a7a!important;color:#fff!important}
@media (min-width:640px){
  .hero .conditions .row,.row.accrow,.kv{padding-top:3px!important;padding-bottom:3px!important}
  .probl{-webkit-box-orient:vertical;display:block;-webkit-line-clamp:unset;overflow:visible}
  .rail .hsec{margin-top:4px!important;padding-top:4px!important}
}
.rail:not(:hover){scrollbar-width:none}
.rpk{position:absolute;pointer-events:none;transition:opacity .15s;z-index:6!important;overflow:visible;white-space:nowrap;background:none;padding:0;border-radius:0;font-size:11px;color:var(--label2);text-shadow:0 0 3px var(--mat),0 0 3px var(--mat)} /* no box: a halo, as on the dashboard */
.rpkc3{position:absolute;z-index:6;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid var(--label2);pointer-events:none;display:none!important}
#app:not(.light) .pgwash3{background:rgba(255,165,50,.08)!important}
@media (max-width:639px){
  .row.mapkey.mapov{left:12px;right:12px;bottom:calc(var(--dock-h,300px) + 8px);font-size:11px}
}
.kv b .kvn{display:block;font-size:13px!important;font-weight:400!important;color:var(--label2);text-align:right}
.row.mapkey.mapov{position:absolute!important;z-index:4;display:flex!important;padding:6px 10px!important;pointer-events:none;background:var(--mat)!important;box-shadow:0 0 0 1px var(--edge),0 2px 8px var(--shadow)!important;border-radius:8px!important;left:var(--rail-l,16px)!important;top:calc(var(--rail-b,400px) + 12px)!important;bottom:auto!important;width:var(--rail-w,352px)!important;box-sizing:border-box;flex-wrap:wrap!important;white-space:normal!important;max-width:none!important;transform:none!important}
.rail{position:absolute;display:flex;flex-direction:column;pointer-events:none;max-height:none;-webkit-mask-image:none;mask-image:none}
.rail.over{-webkit-mask-image:linear-gradient(#000 calc(100% - 24px),transparent);mask-image:linear-gradient(#000 calc(100% - 24px),transparent)}
.rail .hero{position:static;max-width:none;will-change:transform;padding-bottom:16px!important}
.dpk{margin-left:auto;font-size:11px;color:var(--label2);white-space:nowrap;align-self:center;display:none}
.dhl{display:flex;min-width:0;flex:1}
.dock .scrub,.dock .rowlbl{margin-top:0}
.dock .dhd{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0;margin:0 0 6px;margin-bottom:0!important}
.bubble{position:absolute;left:0;pointer-events:none;will-change:transform;border:0;bottom:auto!important;height:18px!important;padding:0 6px!important;border-radius:4px!important;z-index:6;background:var(--mat)!important;box-shadow:inset 0 0 0 1.5px var(--label)!important;display:inline-flex!important;align-items:center;gap:3px;top:calc(-34px + 1px)!important}
.ticks span.hr.off,.ticks span.nowtick.off,.ticks span.day.off{opacity:1!important}
@media (max-width:639px){
  .row.mapkey.mapov{transform:none!important;max-width:none!important;gap:4px 12px;pointer-events:auto;scrollbar-width:none;display:flex!important;flex-wrap:wrap!important;white-space:normal!important;overflow-x:visible;justify-content:center!important;top:auto!important;bottom:calc(var(--dock-h,300px) + 8px)!important;width:auto!important;left:12px!important;right:12px!important}
  .prun .fw{display:none}
  .dpk{display:none}
}
.ticks span.day.near{opacity:0!important}
.prun .fi{display:none}
@media (max-width:639px){
  .prun .fi{display:inline}
}
.sb5{margin-top:4px;font-size:13px;line-height:1.4;color:var(--label)}
.sb5 b{font-weight:600;color:#9a5a00}
#app:not(.light) .sb5 b{color:#f0a24a}
.rpkl{position:absolute;z-index:6;width:1px;background:var(--label3);pointer-events:none}
.dir.fut .dbadge{opacity:1!important}
.ticks span.day.near,.ticks span.hr.near,.ticks span.nowtick.near{opacity:0!important;transition:opacity .12s}
@media (max-height:760px) and (min-width:640px){
  .probl{display:none}
}
@media (max-width:639px){
  .sb0{font-size:13px;color:var(--label2);margin-bottom:2px}
  .sb0 .nw{white-space:nowrap}
  .sb1 .tarr{width:1.1em;height:.8em;margin-left:0}
}
.rail .probl,.rail .disl{font-size:15px;line-height:1.4;color:var(--label2)}
.hero .conditions .row-title small{display:none}
@media (max-width:639px){
  .sbx{margin-top:0}
  .sbx>summary{list-style:none;cursor:pointer;font-size:13px;font-weight:500;color:var(--label2);display:inline-flex;align-items:center;gap:4px;pointer-events:auto;position:absolute;right:14px;top:10px}
  .sb1{padding-right:84px}
  .sbx>summary{flex-direction:row-reverse;min-height:24px;padding:0 4px;border-radius:6px;left:auto!important;width:auto!important}
  #app .rail details.sbx>summary::before{content:"";display:inline-block;width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);margin:0 2px 3px;transition:transform .15s}
  #app .rail details.sbx[open]>summary::before{transform:rotate(-135deg);margin-bottom:-2px}
  .sbx>summary::-webkit-details-marker{display:none}
  .sbx>summary::after{font-size:11px;content:none}
  .sbx[open]>summary::after{content:"\u25B4"}
  .rail details.sbx>summary::before{display:none}
}
.pofl3{font-size:13px;color:var(--label);margin-top:2px}
@media (max-width:639px){
  .ptz button{height:26px!important;font-size:13px;padding:0 8px!important}
  .ticks span.hr.h00{display:none!important}
}
#app:not(.light) .nights i{background:rgba(0,0,0,.22)!important} /* dark: darker than the plot, as on the dashboard */
.rail .probl,.rail .disl,.rail .outl{text-wrap:pretty}
.rail .hero.fut .probl,.rail .hero.fut .disl{display:none!important}
@media (min-width:640px){
  .dock .rowlbl{width:186px!important;padding-right:36px!important;box-sizing:border-box}
  .dock .rowlbl>span{right:36px!important;white-space:nowrap}
  .dhl .dkey{margin:0 0 0 auto!important;display:flex!important;flex-wrap:nowrap;gap:12px;font-size:13px;align-self:center}
}
@media (max-width:639px){
  .dhl .dkey{display:none!important}
}
.pdet>summary{list-style:none;cursor:pointer;font-size:13px;color:var(--label2);padding:4px 0;display:inline-flex;align-items:center;gap:6px;pointer-events:auto;width:100%;justify-content:flex-start}
.pdet>summary::-webkit-details-marker{display:none}
.pdet>summary::after{font-size:11px;content:none}
.pdet[open]>summary::after{content:"\u25B4"}
.pdet .probl{margin-top:4px}
.badge.nb{color:var(--label2);font-weight:500}
.pstat .kv b small{font-size:13px;font-weight:400;color:var(--label2)}
.pstat .kv b small em{font-style:normal;font-weight:600;color:#9a5a00}
#app:not(.light) .pstat .kv b small em{color:#f0a24a}
.rail .probl,.rail .disl,.rail .outl,.sb4,.sb5{text-wrap:pretty}
@media (max-width:639px){
  .row.mapkey.mapov .kbr{display:block!important;flex-basis:100%;height:0}
}
.pdet>summary::before{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s;margin:0 2px}
.pdet[open]>summary::before{transform:rotate(45deg)}
.rail .pdet>summary{justify-content:flex-start!important;width:100%;font-weight:500;color:var(--label)}
.rail .pdetrow{padding:6px 0!important}
@media (max-width:639px){
  .sbx>summary::before{content:"";width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s;margin:0 2px}
  .sbx[open]>summary::before{transform:rotate(45deg)}
}
.dhl .dkey{display:none!important}
@media (min-width:640px){
  #app.keyfree .row.mapkey.mapov{left:calc(var(--rail-r,368px) + 16px)!important;top:auto!important;bottom:calc(var(--dock-top-h,260px) + 16px)!important;width:var(--rail-w,336px)!important;flex-wrap:wrap!important;white-space:normal!important}
}
.rpkl::after{content:"";position:absolute;left:-1.5px;bottom:-2px;width:4px;height:4px;border-radius:50%;background:var(--label)}
.risk .grid.half{stroke-opacity:.3}
.rail .disl .ofn{font-weight:400;color:#9a5a00}
.rail .dir.nbh{font-size:18px!important;white-space:nowrap} /* the night headline is longer */
.sb1.nbh{font-size:18px!important}
.sb1.nbh .dbadge,.dir.nbh .dbadge{background:transparent!important;color:var(--label2)!important;box-shadow:inset 0 0 0 1.5px var(--label3)!important}
.segs{position:relative}
#knob{-webkit-mask:var(--mk,none);mask:var(--mk,none)} /* a gap where the line crosses an in-bar label */
@media (max-width:639px){.dhd .readout{height:auto!important;flex-wrap:wrap;overflow:visible!important;row-gap:4px} .dhd .readout .ro{flex:1 1 100%} .dhd .rback{margin-left:0!important}} /* phones: "Back to now" on its own row under the readout */

.segs i.lo{opacity:1!important}
.segs i.e.lo{background:color-mix(in srgb,var(--east) 38%,var(--mat))!important}
.segs i.w.lo{background:color-mix(in srgb,var(--west) 38%,var(--mat))!important}
#app:not(.light) .segs i.e.lo{background:color-mix(in srgb,var(--east) 40%,var(--label))!important}
#app:not(.light) .segs i.w.lo{background:color-mix(in srgb,var(--west) 40%,var(--label))!important}
.dkey .lessk{background:linear-gradient(90deg,color-mix(in srgb,var(--east) 38%,var(--mat)) 50%,color-mix(in srgb,var(--west) 38%,var(--mat)) 50%)!important;opacity:1!important}
#app:not(.light) .dkey .lessk{background:linear-gradient(90deg,color-mix(in srgb,var(--east) 40%,var(--label)) 50%,color-mix(in srgb,var(--west) 40%,var(--label)) 50%)!important}
.track .swchip{position:absolute;top:calc(var(--dt) - 15px);height:14px;padding:0 6px;border-radius:3px 3px 0 0;font:500 11px/14px "IBM Plex Sans",system-ui,sans-serif;color:#fff;background:var(--dc);z-index:8;white-space:nowrap;pointer-events:none}
#app .track .swchip.w{color:#0f1a17} /* dark ink on teal, white on navy: >= 4.5:1 in both themes */
#app .track .swchip.e{color:#fff}
@media (max-width:599px){#track > #dkey.inbar{display:flex!important;position:absolute;left:0;right:0;top:calc(var(--dt) + var(--dh) + 6px);margin:0!important;z-index:7;background:var(--mat);flex-wrap:wrap;row-gap:2px;padding:2px 0;grid-column:auto!important}}
.segs .swtab{position:absolute!important;top:0;bottom:0;flex:none!important;border-radius:0 6px 6px 0!important;z-index:2}
.risk rect.hov{fill:var(--label)!important;opacity:1!important;filter:none!important}
@media (max-width:639px){.eof{display:block}.eofs{display:none}}
.eof{white-space:nowrap;font-weight:400;color:var(--label2)} /* "(end of forecast)": secondary, never split */
.rail .outl,.sb2{text-wrap:balance}
.ticks span.pgl.ra::after,.track .pgl.ra::after{content:'';position:absolute;left:var(--tk);bottom:-4px;width:1px;height:4px;background:inherit}
#app:not(.light) .rail .disl .ofn{color:#f0a24a}
@media (min-width:640px){
  .row.mapkey.mapov .kbr{display:block!important;flex-basis:100%;height:0}
  .row.mapkey.mapov{border-radius:16px!important;padding:8px 14px!important}
  .rail .row.mapkey.inrail{font-size:13px;gap:2px 12px;padding:10px 0 0!important;margin-top:0;border-top:1px solid var(--sep)!important;line-height:18px} /* a hairline and 12 px above the key */
  .rail .row.mapkey.inrail::before{display:none!important}
  .rail .hero .conditions .row.pdetrow{padding-top:0!important;padding-bottom:0!important}
  .rail .row.mapkey.inrail .tkey b{width:13px;height:13px}
  .rail .row.mapkey.inrail .kbr{display:block;flex-basis:100%;height:0}
}
@media (max-width:639px){
  .row.mapkey.mapov{border-radius:16px!important} /* one corner radius for the cards and the bottom sheet */
}
@media (max-width:599px){ /* phones: every control in the header is a 44 px touch target, as on the dashboard */
  .ptabs a{min-height:44px;display:inline-flex;align-items:center}
  .ptz button{height:44px!important}
  .pthm{height:44px!important}
}
/* the in-bar direction label on a solid chip of its bar colour, so the night hatch never runs behind it (as on the dashboard) */
.segs .dlab{padding:3px 6px;margin-left:-6px;border-radius:3px;line-height:14px}
.segs .dlab.e{background:var(--east)}
.segs .dlab.w{background:var(--west);color:#10131c!important} /* dark ink on teal in both themes (>= 4.5:1), as the switch chip */
/* the run picker in the dashboard's control style: a 2 px track round a raised 28 px pill, 8 px outer radius */
.dmenu select{height:28px;margin:2px;padding:0 26px 0 10px!important;line-height:28px;border-radius:6px!important;background:var(--mat)!important;box-shadow:0 0 0 2px var(--fill2),0 1px 2px rgba(0,0,0,.12)!important}
.dmenu select:hover{background:var(--mat)!important}
.dmenu svg{right:10px!important}
/* Runway 18 in use now, closed later: the closure in the secondary ink */
#r18-v .r18c{font-size:13px;font-weight:400;color:var(--label2);white-space:nowrap;margin-left:4px}
#r18-v:has(.r18c){display:flex;flex-wrap:nowrap;align-items:baseline;justify-content:flex-end;white-space:nowrap}
#r18-v:has(.r18c) .badge{white-space:nowrap}
.row-main:has(.r18c) .row-title{white-space:nowrap}
@media (max-width:599px){
  /* the 48 h legend under the last row, full width */
  .dock > .dkey{display:flex!important;grid-column:1/-1;grid-row:2;flex-direction:row;flex-wrap:wrap;gap:4px 12px;margin:10px 0 0;font-size:13px;white-space:normal;align-self:start}
  /* "Back to now" on the readout line, over its right end: no reserved row under the readout */
  .dhd .readout{position:relative;flex-wrap:nowrap!important}
  .dhd .rback{position:absolute;right:0;top:50%;transform:translateY(-50%)}
  .dhd .readout{height:32px!important;align-items:center}
  .dhd .readout .ro{white-space:normal!important;line-height:16px;max-height:32px;overflow:hidden}
  .dhd .readout:has(.rback[style*="visible"]) .ro{padding-right:112px} /* pinned: up to two 16 px lines beside the button, in the same 32 px row */
  /* segmented controls: the track shows 4 px round the selected pill */
  .ptz,.ptabs{padding:4px!important}
  /* Details: a pill-shaped button, a 44 px target */
  #app .sbx>summary{min-height:44px;padding:0 14px 0 16px;border-radius:22px;background:var(--fill);box-shadow:inset 0 0 0 1px var(--sep);color:var(--label);gap:6px}
}
/* the switch chip names its hour (as on the dashboard); the tick marks the hour when the chip sits left of it */
.track .swchip{top:calc(var(--dt) - 16px);height:16px;font-size:13px;line-height:16px}
.track .swtick{position:absolute;top:var(--dt);height:var(--dh);width:2px;margin-left:-1px;background:var(--label);z-index:3;pointer-events:none}
/* dark: the night band a step lighter than the card, with hairline edges (as on the dashboard) */
#app:not(.light) .nights i{background:rgba(255,255,255,.06)!important;box-shadow:inset 1px 0 rgba(255,255,255,.09),inset -1px 0 rgba(255,255,255,.09)}
/* axis values at the 13 px step on every width (as on the dashboard) */
.dock .rgl0,.dock .rgl2{font-size:13px!important}
@media (max-width:599px){
  /* row names on a chip of the sheet's colour: day lines and night bands stop at the name */
  .dock .rowlbl{z-index:5;pointer-events:none}
  .dock .rowlbl>span{background:var(--mat);border-radius:4px;width:max-content;padding-right:6px}
}
/* Runway 18 in use now, closing later: one baseline for the check, "In use now" and the closure; a red dot keys the closure to the red cells */
#r18-v:has(.r18c) .badge{display:inline-block;padding:0;background:none;line-height:20px}
#r18-v .badge .ck{vertical-align:-3px;margin-right:4px}
#r18-v:has(.r18c) .badge .ck{display:none}
#r18-v .r18c .r18d{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--closed);margin:0 5px 0 0;vertical-align:1px}
#r18-v:has(.r18c) .r18c{margin-left:0}
.row-main:has(.r18c){gap:6px}
/* the official amber one step darker in light mode (>= 6:1 on the card) */
#app.light .pstat .pofl em,#app.light .sb3 em,#app.light .pofl2 em,#app.light .pstat .kv b small em{color:#8a5000}
/* the peak note and the compass at the 12 px floor */
.rpk{font-size:12px!important}
.rose b{font-size:12px}
@media (min-width:640px){
  /* the left card's text inset equals the chart card's (24 px) */
  .rail{width:22rem!important}
  .rail .hero{padding-left:24px!important;padding-right:24px!important}
  /* Details: an outlined pill, as on phones */
  .rail .pdet>summary{width:auto!important;display:inline-flex;flex-direction:row-reverse;min-height:30px;padding:0 12px 0 14px;border-radius:15px;background:var(--fill);box-shadow:inset 0 0 0 1px var(--sep);gap:8px;color:var(--label)}
  .rail .pdet>summary:hover{background:var(--fill2)}
  .rail .pdet>summary::before{transform:rotate(45deg);margin:0 2px 3px}
  .rail .pdet[open]>summary::before{transform:rotate(-135deg);margin:3px 2px 0}
  /* how to move the map: one quiet line in the free area's bottom-right corner */
  .hint3{position:absolute;right:1rem;bottom:calc(var(--dock-top-h,260px) + 10px);zoom:var(--hz,1);font-size:12px;line-height:16px;color:var(--label2);background:color-mix(in srgb,var(--mat) 82%,transparent);padding:2px 8px;border-radius:8px;pointer-events:none;white-space:nowrap;z-index:3}
}
@media (max-width:639px){.hint3{display:none}}
body.card .hint3,body.bare .hint3{display:none}
@media (max-width:599px){
  /* the bottom sheet inset like the cards above it, every corner rounded */
  .dock{left:8px!important;right:8px!important;bottom:8px!important;border-radius:16px!important;padding-left:12px!important;padding-right:12px!important}
  /* the plot starts 38 px into the content: the Now pill keeps 12 px from the sheet's edge */
  .dock .scrub,.dock .rowlbl{margin-left:38px!important}
  .dock .scrub{width:calc(100% - 38px)!important}
  /* value labels inside the plot, 4 px clear of the Now line (as on the dashboard) */
  .dock .rgl0,.dock .rgl2{left:9px!important;right:auto!important;z-index:6}
  /* row names at the 13 px step, each on a chip of its text width + 4 px */
  .dock .rowlbl>span{font-size:13px!important;padding:0 2px!important;margin-left:-2px}
  .dhd .readout .ro,#dro{font-size:13px!important}
  /* the map key at the 12 px floor on one line of paths: inset 8 px like the cards above and below it */
  .row.mapkey.mapov{font-size:12px!important;gap:4px 8px!important;padding:6px!important;left:8px!important;right:8px!important}
  .row.mapkey.mapov span{gap:4px!important}
  /* runway tags about a fifth smaller on the small map */
  .lbl.rwy b{font-size:12px!important;line-height:14px;padding:1px 4px!important}
}
/* the Runway 18 row: "In use now" right-aligned like every other value, the later closure as a muted second line under it */
#r18-v:has(.r18c){flex-direction:column;align-items:flex-end!important;justify-content:flex-start;row-gap:1px}
#r18-v:has(.r18c) .r18c{line-height:16px}
.row-main:has(.r18c){align-items:baseline}
@media (min-width:640px){
  /* one divider weight for every row of the left card */
  .rail .row+.row::before,.rail .hsec,.rail .row.mapkey.inrail{border-top-width:1px!important;border-top-color:var(--sep)!important}
  /* one page gutter: the cards and the buttons on the header's 24 px, the footer under them 12 px further down */
  .rail{left:24px!important}
  .dock{left:24px!important;right:24px!important;bottom:48px!important}
  .attrib{line-height:16px!important;bottom:4px!important}
  /* the space the closure line and the footer gap take, given back by the left card's spacing (it never scrolls) */
  .rail .hero{padding-bottom:12px!important}
  .rail .hero .dir{margin-top:2px!important}
  .rail .hero .outl{margin-top:4px!important}
  .rail .row.wind .row-sub{margin-top:2px!important}
  .rail .pdet>summary{min-height:28px!important}
  .rail .row.mapkey.inrail{padding-top:8px!important;line-height:16px!important}
  .rail .row.mapkey.inrail>span{line-height:16px!important}
  .stack{right:24px!important}
  .rose{left:24px}
  .hint3{right:24px}
}
@media (min-width:640px) and (min-height:801px){
  /* the legend row 8 px further from the Runway 18 strip (short windows keep the space for the left card) */
  .dock .dkey{margin-top:22px!important}
}
@media (min-width:640px) and (max-height:800px){
  /* short windows (1366 x 768): the left card's spacing tightened so it never scrolls */
  .rail .hero .outl{margin-top:2px!important}
  .rail .hsec{margin-top:2px!important;padding-top:2px!important}
  .rail .conditions>.row{padding-top:0!important;padding-bottom:0!important}
  .rail .row-sub{line-height:16px!important}
  .rail .row-sub+.row-sub{margin-top:0!important}
  .rail .row.mapkey.inrail{padding-top:6px!important}
  .rail .pdet{margin-top:2px!important}
  .rail .hero{padding-bottom:8px!important}
  .rail .kv{padding-top:1px!important;padding-bottom:1px!important}
  .rail .hero{padding-top:6px!important}
  .rail .hero .dir{margin-top:0!important}
  .rail .row.mapkey.inrail{padding-top:4px!important}
}
@media (max-width:599px){
  /* the map key: the bottom sheet's 12 px inset, two left-aligned rows (paths, then towns) */
  .row.mapkey.mapov{padding:8px 12px!important;justify-content:flex-start!important;gap:4px 7px!important}
  .row.mapkey.mapov .kbr{flex-basis:100%;height:0}
  .row.mapkey.mapov .plk,.row.mapkey.mapov .tok{width:14px!important}
  .row.mapkey.mapov span{gap:3px!important}
  /* a thin Now line: still the darkest rule, no longer an axis */
  .dock .nowline{width:1px!important;margin-left:-.5px!important}
}
/* the map hint on a quiet chip with a hairline edge, so it reads on the pale map */
.hint3{background:color-mix(in srgb,var(--mat) 92%,transparent)!important;box-shadow:0 0 0 1px var(--sep)}
/* one outlined control style on the 3D map and card: Reset view, Full screen and Details (28 px, a 14 px radius, a 1 px edge) */
#app{--ctl-edge:color-mix(in srgb,var(--label) 24%,var(--mat))}
@media (min-width:640px){
  #app .stack.panel{background:none!important;box-shadow:none!important;border:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;gap:8px;overflow:visible!important;border-radius:0!important}
  #app .stack .ib{height:28px!important;min-height:28px;box-sizing:border-box;padding:0 12px!important;border:1px solid var(--ctl-edge)!important;border-radius:14px!important;background:var(--mat)!important;color:var(--label)!important;font-size:13px;font-weight:500;box-shadow:0 1px 2px rgba(0,0,0,.06)}
  #app .stack .ib:hover{background:var(--fill)!important}
  #app .rail .pdet>summary{height:28px;min-height:28px!important;box-sizing:border-box;border:1px solid var(--ctl-edge)!important;border-radius:14px!important;background:var(--mat)!important;box-shadow:0 1px 2px rgba(0,0,0,.06)!important;color:var(--label)!important}
  #app .rail .pdet>summary:hover{background:var(--fill)!important}
  /* the run picker keeps the zoom pills' track (as on the dashboard), at the same 28 px height and text colour */
  #app .dmenu select{color:var(--label)}
  /* the map hint a step darker */
  #app .hint3{color:color-mix(in srgb,var(--label2) 50%,var(--label))!important;background:color-mix(in srgb,var(--mat) 96%,transparent)!important}
}
/* runway tags on the light map: a white tag with a dark hairline and dark text, secondary to the path lines */
#app.light .lbl.rwy b{background:#fff!important;color:#1b1c1e!important;box-shadow:inset 0 0 0 1px #55575d}
@media (max-width:599px){
  /* the map key is the map's footer: no card of its own, two left-aligned rows on a light wash just above the bottom sheet */
  #app .row.mapkey.mapov{background:color-mix(in srgb,var(--mat) 82%,transparent)!important;box-shadow:none!important;border:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;padding:3px 12px!important;bottom:calc(var(--dock-h,300px) + 4px)!important;border-radius:10px!important;row-gap:2px!important;line-height:16px}
  /* the 48 h legend as an aligned grid: three columns with equal starts, the closure key across the last two */
  #app .dock > .dkey{display:grid!important;grid-template-columns:repeat(3,minmax(8em,max-content));justify-content:space-between;column-gap:10px;row-gap:4px}
  #app .dock > .dkey > .kr18{grid-column:span 2}
}
/* round 7, desktop: one chevron, theme glyph, footer air, the Now tag on its line, the map key as a strip on the map */
@media (min-width:640px){
  /* the theme toggle: an 18 px glyph at the other icons' 1.5 px stroke (24-unit box at 2 units), in the 32 px hit area */
  .pthm svg{width:18px!important;height:18px!important}
  /* the run picker: the Details chevron (a 5 px corner, 1.5 px strokes, pointing down) in the label colour; the zoom-pill
     track kept, with the map buttons' 1 px edge colour round it */
  #app .dmenu .chev,#app .rail .pdet>summary::before{box-sizing:content-box;width:5px;height:5px;border:0;border-right:1.5px solid var(--label);border-bottom:1.5px solid var(--label)}
  #app .dmenu .chev{position:absolute;right:12px;top:50%;margin-top:-5px;transform:rotate(45deg);pointer-events:none}
  #app .dmenu select{box-shadow:0 0 0 2px var(--fill2),0 0 0 3px var(--ctl-edge)!important}
  /* the footer: 24 px under the chart card, 16 px over the window's bottom */
  .dock{bottom:57px!important}
  .attrib{bottom:16px!important}
  /* the Now tag hangs off the top of its line, 3 px left of it (the dashboard's tag), the line up to the tag */
  #app .dock .nowline{width:1.5px!important;margin-left:-.75px!important;top:-12px!important}
  #app .ticks span.nowtick{transform:translateX(calc(-100% - 4px))!important}
  /* the map key: a compact strip at the map's bottom-left, on the page gutter, 12 px over the chart card; one grid of
     three columns (paths, then towns), on a light chip with a hairline edge like the map hint */
  #app .row.mapkey.mapov{top:auto!important;bottom:calc(var(--dock-top-h,260px) + 12px)!important;width:auto!important;display:grid!important;grid-template-columns:repeat(3,minmax(8em,max-content));column-gap:16px!important;row-gap:2px!important;padding:3px 12px!important;border-radius:10px!important;background:color-mix(in srgb,var(--mat) 94%,transparent)!important;box-shadow:0 0 0 1px var(--sep)!important;font-size:13px!important;line-height:16px!important;white-space:nowrap!important}
  #app .row.mapkey.mapov .kbr{display:none!important}
  #app .row.mapkey.mapov .kbr+span{grid-column-start:1}
  #app .row.mapkey.mapov:has(.gh){grid-template-columns:minmax(8em,max-content) minmax(8em,max-content) minmax(18.75em,max-content)}
  /* (columns as wide as the longest town name, "Neu-Isenburg", and "East (if switched)": the key keeps its
     width when hovering an hour shows other towns) */
}
/* round 8 (desktop): the Now tag points at its line; the chart card's bottom padding as its top; the run picker's
   edge reads as one 1 px line (an opaque near-white track inside the buttons' edge colour); the theme toggle outlined
   like a control; the footer as two short lines: the sources on the gutter, the backtest note ending on the chart
   card's right edge */
@media (min-width:640px){
  #app .ticks span.nowtick{overflow:visible}
  #app .ticks span.nowtick::after{content:'';position:absolute;left:100%;top:50%;margin-top:-4px;border-style:solid;border-width:4px 0 4px 4px;border-color:transparent;border-left-color:var(--label)}
  #app .dock{padding-bottom:10px!important}
  #app.light .dmenu select{box-shadow:0 0 0 2px color-mix(in srgb,var(--label) 3%,var(--mat)),0 0 0 calc(round(calc(2px * var(--hz,1) + 1px),1px) / var(--hz,1)) var(--ctl-edge)!important} /* an opaque, near-white track (a shadow spread paints under the ones listed before it: a translucent track lets the edge show through it); the edge's outer side on a device pixel */
  #app .pthm{box-shadow:inset 0 0 0 1px var(--ctl-edge);border-radius:8px}
  #app .pthm:hover{background:var(--fill)}
  #app .pthm:focus-visible{outline:2px solid var(--label);outline-offset:2px;border-radius:8px}
  .attrib .al{white-space:nowrap}
}
@media (min-width:1200px){
  .attrib{right:24px!important;display:flex!important;justify-content:space-between;column-gap:24px}
}
/* round 9 (desktop). One radius for the secondary controls: Reset view, Full screen and Details take the segmented
   controls' 8 px corners (the run picker's 6 px plus its 2 px track); the headline's drawn arrow; no unexplained wind glyph;
   the switch chip and the official tag 3 px over the bar; the "18 closed" annotation as on the dashboard; neutral town
   markers on a 2 px halo; the Main named; the 48 h legend on the row names' edge; the map key sized to its content */
@media (min-width:640px){
  #app .stack .ib,#app .rail .pdet>summary{border-radius:8px!important}
  #app .dir .harr{width:1em;height:.7em;margin:0 0 0 .25em;stroke-width:3.4;vertical-align:.02em}
  #app .wcomp{display:none!important}
  #app .track .swchip{top:calc(var(--dt) - 19px)!important;border-radius:3px!important}
  #app .track .pgl{top:calc(var(--dt) - 18px)!important;border-radius:3px!important}
  #app .track .pgl.ra::after{bottom:-7px;height:7px}
  #app .track .r18tag{position:absolute;z-index:8;height:16px;padding:0 6px;border-radius:3px;font:500 13px/16px "IBM Plex Sans",system-ui,sans-serif;white-space:nowrap;background:#2b2c2f;color:#f6f6f1;box-shadow:inset 0 -2px 0 var(--closed);pointer-events:none}
  #app .track .r18lead{position:absolute;width:1px;background:var(--closed);opacity:.6;pointer-events:none;z-index:2}
  #app .track .swstem{position:absolute;top:calc(var(--dt) - 3px);height:3px;width:1px;z-index:8;pointer-events:none}
  #app .track .r18brk{position:absolute;height:3px;border:1px solid var(--closed);border-bottom:0;border-radius:2px 2px 0 0;opacity:.6;pointer-events:none;box-sizing:border-box;z-index:2}
  #app .dock > .dkey{grid-column:2/-1!important} /* from the row names' column, the dashboard legend's edge */
  #app .row.mapkey.mapov:has(.gh){grid-template-columns:minmax(8em,max-content) minmax(8em,max-content) var(--kc3,18.75em)!important}
}
#app .lbl.town.num i,#app:not(.light) .lbl.town.num i{background:var(--mat)!important;color:var(--label)!important;box-shadow:inset 0 0 0 1.5px var(--label2),0 0 0 2px var(--mat)!important}
#app .row.mapkey .tkey b,#app:not(.light) .row.mapkey .tkey b{background:var(--mat)!important;color:var(--label)!important;box-shadow:inset 0 0 0 1.5px var(--label2)!important}
#app .lbl.rvl{font:italic 600 13px "IBM Plex Sans",system-ui,sans-serif;color:#244f72;white-space:nowrap;pointer-events:none;text-shadow:0 0 1px var(--bg),0 0 2px var(--bg),0 0 3px var(--bg),0 0 5px var(--bg)} /* a darker blue on a light halo: >= 4.5:1 against the map behind it */
#app:not(.light) .lbl.rvl{color:#8fb3d1}
/* round 10 (desktop): the map key as wide as the info card above it (one left and one right edge): two rows (paths, then
   towns) in three columns spread to both paddings */
@media (min-width:640px){
  #app .row.mapkey.mapov,#app .row.mapkey.mapov:has(.gh){width:var(--rail-w,352px)!important;max-width:none!important;box-sizing:border-box!important;grid-template-columns:repeat(3,max-content)!important;justify-content:space-between!important;column-gap:8px!important} /* the gap is a minimum: the columns spread to the paddings */
}
/* round 10: the peak note on a knockout of the card colour (no day line or gridline runs through its text) and a 1 px
   leader from its end to the peak dot, as on the dashboard */
#app .rpk{background:var(--mat);box-shadow:0 0 0 2px var(--mat)}
#app .rpk:empty{display:none}
.rpkh{position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:6;transition:opacity .15s}
.rpkh path{fill:none;stroke:var(--label2);stroke-width:1}
.track .swstem{display:none}
@media (min-width:640px){#app .track .swstem{display:block}}
/* round 11: the Runway 18 row names what a closure moves, right-aligned under the closure; the map hint is plain grey
   text on the map's halo (it is not a control); the accuracy row sits under Details */
#r18-s.r18is{display:block;text-align:right;margin-top:1px}
#r18-s .r18i{font-size:13px;line-height:16px;font-weight:400;color:var(--label2);white-space:nowrap}
.pdet .acc{margin-top:6px}
.pdet .acc .pstat{border-top:0;padding:0}
@media (min-width:640px){
  #app .rail>.hero{flex:1 0 auto} /* the card fills the rail, whose height sets one 12 px gap to the map key */
  #app .hint3{font-size:13px!important;line-height:18px!important;padding:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;border:0!important;color:var(--label2)!important;text-shadow:var(--halo)}
}
/* round 11 (phones): the outlook names the switch as "Sat 7 Nov, 14:00": it keeps clear of the Details button on the
   headline row: the compact card writes it "Switch to West \xB7 Sat 7 Nov, 14:00", one line beside the button */
@media (max-width:639px){
  .sumbar .sb2{padding-right:104px}
  .sumbar .sb2 .nw,.rail .outl .nw{white-space:nowrap}
}
/* round 12 (desktop). The left stack on the 16 px page gutter: the card, the map key and the timeline 16 px apart; the card
   wide enough for the kicker on one line, one padding on all four sides. The Runway 18 row as on the dashboard: the next
   closure is the value (a hollow ring while scheduled, a filled dot while in effect), its date and what it moves the lines
   under it. */
@media (min-width:640px){
  #app{--rail-w:400px}
  #app .rail{width:25rem!important}
  #app .rail .hero{padding:24px!important} /* the chart card's text inset, on all four sides */
  #app .row.wind .row-main #wind-why{margin:0 auto 0 0;font-size:13px;text-align:left;white-space:nowrap}
  #app .row.wind .row-main #wind-why::before{content:"\xB7 "}
  #r18-v:has(.r18b){display:flex;flex-direction:column;align-items:flex-end}
  .row-main:has(.r18b){align-items:baseline}
  #app .row.mapkey.mapov{bottom:calc(var(--dock-top-h,260px) + 16px)!important}
  /* the card is as tall as the stack allows: any spare height goes above the Details row, never under it */
  #app .rail>.hero{display:flex!important;flex-direction:column}
  #app .rail .hero>.conditions{flex:1 0 auto;display:flex;flex-direction:column}
  #app .rail .conditions>.pdetrow{margin-top:auto}
}
#r18-v .r18d{display:inline-block;box-sizing:border-box;width:10px;height:10px;margin:0 8px 0 0;border-radius:50%;border:2px solid var(--closed);background:var(--closed);vertical-align:0}
#r18-v .r18d.ring{background:transparent}
#r18-v .badge.r18b{display:inline-block;white-space:nowrap} /* inline-block: the row keeps the text baseline, not the ring's */
#r18-s.r18is{display:block;text-align:right} /* under the status, right-aligned with it, as the wind's compass line under its value */
#r18-s .r18w,#r18-s .r18i{display:block;font-size:13px;line-height:16px;font-weight:400;color:var(--label2);white-space:nowrap}
/* round 13 (desktop). The wind row: the label is "Wind now" alone, the compass wind a quiet line under the value. Every row of
   the card one hairline and one pitch. The map key below the card on the card's surface, radius and shadow. */
@media (min-width:640px){
  #app .row.wind #wind-why{display:block;margin:0;line-height:15px;text-align:right;white-space:nowrap}
  #app #r18-s .r18w,#app #r18-s .r18i{line-height:15px}
  #app .rail .hero>.dir{margin-top:0!important} /* the headline's badge carries its own air under the kicker */
  #app .row.wind #wind-why::before{content:none}
  #app #r18-s.r18is,#app #r18-s .r18w,#app #r18-s .r18i{text-align:right}
  #app .row.mapkey.mapov{background:var(--mat)!important;border:0!important;border-radius:16px!important;box-shadow:0 1px 3px rgba(0,0,0,.08),0 0 0 1px var(--edge)!important}
  #app .rail .hsec{margin-top:0!important;padding-top:0!important}
  #app .rail .hsec.conditions{padding-top:0!important}
  #app .rail .conditions>.row:not(.pdetrow):not(.mapkey){padding-top:4px!important;padding-bottom:4px!important}
  /* the timeline card's header as on the dashboard: the title at the dashboard card title's inset from the card top (the
     4 px come from the space under the header, so the card keeps its height) */
  #app .dock .dhd{margin-top:4px!important;margin-bottom:-4px!important}
}
@media (min-width:640px) and (max-height:800px){
  /* short windows (1366 x 768): one tighter pitch for every row; the compass wind is left to the map's wind chip, so the key
     still fits under the card */
  #app .rail .hsec{margin-top:0!important;padding-top:1px!important}
  #app .rail .hero>.hsec:not(.conditions){margin-top:-2px!important}
  #app .rail .hsec:not(.conditions) .kv{padding-bottom:2px!important}
  #app .rail .hsec.conditions{padding-top:0!important}
  #app .rail .conditions>.row:not(.pdetrow):not(.mapkey){padding-top:2px!important;padding-bottom:2px!important}
  #app .row.wind #wind-why{display:none}
}
/* round 12: the switch chip and the official tag 4 px over the direction bar (4 px under the hour axis); its stem 4 px */
@media (min-width:640px){
  #app .track .swchip{top:calc(var(--dt) - 20px)!important}
  #app .track .pgl{top:calc(var(--dt) - 19px)!important}
  #app .track .swstem{top:calc(var(--dt) - 4px)!important;height:4px!important}
}
/* round 14 (desktop). The map key on the info card's content edges (its 24 px side padding), 6 px above and below its rows
   (about 10 px to the glyphs, as the card's rows sit under their hairlines). The card: the kicker >= 6 px clear of the headline,
   whose box is no taller than its badge; Details as far under its hairline as the other rows' text. The page keeps its
   height (the key stays under the card): the kicker's line box and the rows' second lines give up their spare pixels. */
@media (min-width:640px){
  #app .row.mapkey.mapov,#app .row.mapkey.mapov:has(.gh){padding:12px 24px!important;row-gap:0!important}
  #app .rail .hero>.eyebrow{line-height:15px}
  #app .rail .hero>.dir{margin-top:7px!important;height:29px!important}
  #app .rail .hero>.outl{margin-top:3px!important}
  #app .row.wind #wind-why,#app #r18-s.r18is{margin-top:0!important}
  #app .rail .hero .conditions>.row.pdetrow details.pdet{margin-top:7px!important}
}
/* round 15 (desktop). The map key 12 px over and under its rows; the 12 px come from the space under Details (24 -> 12), so
   the gutters stay 16 px and the timeline card keeps its place */
@media (min-width:640px){
  #app:not(.keyfree) .rail .hero{padding-bottom:12px!important}
}
`;var Zn=class{constructor(t=0,{damping:e=1,response:n=.4}={}){this.x=t,this.v=0,this.target=t,this.params(e,n)}params(t,e){return this.damping=t,this.response=e,this.k=(2*Math.PI/e)**2,this.c=4*Math.PI*t/e,this}to(t,{velocity:e,damping:n,response:r}={}){return(n!==void 0||r!==void 0)&&this.params(n??this.damping,r??this.response),e!==void 0&&(this.v=e),this.target=t,this}jump(t){return this.x=this.target=t,this.v=0,this}step(t){let e=Math.max(1,Math.ceil(t*240)),n=t/e;for(;e--;)this.v+=(-this.k*(this.x-this.target)-this.c*this.v)*n,this.x+=this.v*n;let r=Math.max(1,Math.abs(this.target));return Math.abs(this.x-this.target)<1e-4*r&&Math.abs(this.v)<.001*r&&this.jump(this.target),this.x}get resting(){return this.x===this.target&&this.v===0}},wo=class{constructor(t){this.s=[new Zn(0,t),new Zn(0,t),new Zn(0,t)]}jump(t){return this.s[0].jump(t.x),this.s[1].jump(t.y),this.s[2].jump(t.z),this}to(t,e){return this.s[0].to(t.x,e),this.s[1].to(t.y,e),this.s[2].to(t.z,e),this}step(t,e){return e.set(this.s[0].step(t),this.s[1].step(t),this.s[2].step(t)),e}get resting(){return this.s.every(t=>t.resting)}},Uu=(i,t=.998)=>i/1e3*t/(1-t),ld=(i,t,e=.55)=>i*t*e/(t+e*Math.abs(i));var Fe=window.FRA_SCENE,ys=window.FRA_FORECAST,ke="Europe/Berlin",sr=new URLSearchParams(location.search),Ho=sr.has("embed"),Rc=sr.get("embed")==="card",di=sr.get("embed")==="bare",Zu=Rc||di,md={top:0,right:0,bottom:0,left:0},Pe={card:Rc},Nv=sr.get("palette")==="lh"||sr.get("theme")==="lh",Bv={dark:{eastLine:"#a3adc2",westLine:"#5fcab5",ghostE:"#a3adc2",ghostW:"#5fcab5",east:"#2f4a7a",west:"#4dbfa7",r18:"#c3c2b7",closed:"#d03b3b",arr:"#199e70",dep:"#f0efec",ground:"#8a8984",air:"#c3c2b7"},light:{eastLine:"#2c3e66",westLine:"#1f9e89",ghostE:"#2c3e66",ghostW:"#0c6355",east:"#2c3e66",west:"#1f9e89",r18:"#52514e",closed:"#d03b3b",arr:"#1baf7a",dep:"#0b0b0b",ground:"#8a8984",air:"#9a9893"}},ju=Bv,kr={dark:{bg:"#0e0e0d",ground:"#0b0b0a"},light:{bg:"#eceeef",ground:"#e9ebec"}},Ov=["dark","light"].includes(sr.get("theme"))?sr.get("theme"):null,Ju=null;try{Ju=Ho?null:localStorage.getItem("fra-theme")||null}catch{}var ie=Ov||Ju||"light";document.documentElement.dataset.theme=ie;var de=ju[ie],gd={},ui=Mi,vc=Zi,Qi={25:249,7:69,18:180},zv=5,qt=(i,t,e=0)=>new U(i,e,-t),Ku=document.createElement("style");Ku.textContent=Du()+(()=>{let i=(window.FRA_STYLE||{}).header_css;return i?`@media (min-width:640px){${i.replace(/([^;{}]+?)(;|})/g,(t,e,n)=>e.includes(":")&&!e.includes("!important")?`${e}!important${n}`:t)}.pbar,.rail,.mapov,.dock,.stack,.rose,.attrib{zoom:var(--hz,1)}}`:""})();{let i=()=>document.documentElement.style.setProperty("--hz",Math.max(1,Math.min(1.5,innerWidth/1280,innerHeight/810)).toFixed(4));i(),addEventListener("resize",i)}document.head.appendChild(Ku);var it=document.getElementById("app");Ho&&document.body.classList.add("embed");Rc&&document.body.classList.add("card");di&&document.body.classList.add("bare");var Un=new tc({antialias:!0,powerPreference:"high-performance"});Un.setPixelRatio(Math.min(devicePixelRatio,2));it.appendChild(Un.domElement);var Fn=new Ys;Fn.background=new Dt(kr.dark.bg);Fn.fog=new qs(kr.dark.bg,4e-5);Fn.add(new lo("#ffffff","#b9b7b2",2.1));var Qu=new co("#ffffff",1.7);Qu.position.copy(qt(-5e3,-7e3,9e3));Fn.add(Qu);var ne=new tn(36,1,250,4e5),pn=new ic(ne,Un.domElement);pn.enableDamping=!0;pn.maxPolarAngle=Math.PI*.47;pn.minDistance=800;pn.maxDistance=2e5;pn.autoRotateSpeed=1;var Ro={card:{pos:qt(-800,-4800,12e3),target:qt(-800,-800,0)},full:{pos:qt(-1e3,-3e3,7400),target:qt(-1e3,250,0)},bare:{pos:qt(-450,-8300,5e3),target:qt(-2050,-300,0)}},Lo=()=>Pe.card?Ro.card:di?Ro.bare:Ro.full,li=7,Cc=!1;ne.position.copy(Lo().pos);pn.target.copy(Lo().target);var Vo=new oc(Un);Vo.addPass(new ac(Fn,ne));var Co=new vs(new Ct(512,512),.55,.3,.3);function tf(){Co.enabled=ie==="dark",Co.strength=Pe.card?.08:.14,Co.threshold=Pe.card?.42:.3}Vo.addPass(Co);Vo.addPass(new lc);function Fr(){let i=it.clientWidth,t=it.clientHeight;Un.setSize(i,t),Vo.setSize(i,t),Co.resolution.set(i/2,t/2),ne.aspect=i/t,ne.fov=Pe.card?Math.min(36,Math.max(16,qn.radToDeg(2*Math.atan(Math.tan(qn.degToRad(29))/ne.aspect)))):36;let e=document.querySelector(".hero")?.getBoundingClientRect().bottom-it.getBoundingClientRect().top||0,n=i<640?1:parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1,r=i<640,s=r?(document.querySelector(".rail")?.getBoundingClientRect().bottom??0)-it.getBoundingClientRect().top:0,o=r?it.getBoundingClientRect().bottom-(document.querySelector(".dock")?.getBoundingClientRect().top??it.getBoundingClientRect().bottom):0;r&&it.style.setProperty("--dock-h",`${Math.round(o)}px`);{let p=document.querySelector(".dock"),u=document.querySelector(".rail");p&&it.style.setProperty("--dock-top-h",`${Math.round((it.getBoundingClientRect().bottom-p.getBoundingClientRect().top)/n)}px`),u&&it.style.setProperty("--rail-r",`${Math.round((u.getBoundingClientRect().right-it.getBoundingClientRect().left)/n)}px`);{let m=u.getBoundingClientRect(),x=it.getBoundingClientRect();typeof tt<"u"&&tt.run&&!rn()||it.style.setProperty("--rail-b",`${Math.round((m.bottom-x.top)/n)}px`),it.style.setProperty("--rail-l",`${Math.round((m.left-x.left)/n)}px`),it.style.setProperty("--rail-w",`${Math.round(m.width/n)}px`)}u&&u.classList.toggle("over",u.scrollHeight>u.clientHeight+1)}let a=it.getBoundingClientRect().bottom-(document.querySelector(".dock")?.getBoundingClientRect().top??it.getBoundingClientRect().bottom-200),c=(document.querySelector(".rail")?.getBoundingClientRect().right??380)-it.getBoundingClientRect().left,l=di?md:Pe.card?{top:0,right:0,bottom:0,left:0}:r?{top:s+12,right:16,bottom:o+4+(document.querySelector(".mapov")?.offsetHeight||0),left:16}:{top:(document.querySelector(".pbar")?.getBoundingClientRect().bottom??56)-it.getBoundingClientRect().top+16,right:32,bottom:a+8,left:Math.min(c,i*.4)+32};{let p=document.querySelector(".pbar"),u=document.querySelector(".rail"),m=document.querySelector(".stack");if(p&&u&&!di&&!Pe.card){let x=Math.round(p.getBoundingClientRect().bottom-it.getBoundingClientRect().top+(r?8:16));u.style.top=`${x/n}px`,m&&!r&&m.style.setProperty("top",`${x/n}px`,"important")}}if(tr=null,!r&&!di&&!Pe.card){let p=document.querySelector(".stack");if(p&&p.offsetWidth){let u=p.getBoundingClientRect(),m=it.getBoundingClientRect();tr=[u.left-m.left-40,u.bottom-m.top+40]}}Ue=l,it.style.setProperty("--free-cx",`${Math.round(l.left+(i-l.left-l.right)/2)}px`),it.style.setProperty("--free-l",`${Math.round(l.left)}px`);{let p=document.querySelector(".rail"),u=document.querySelector(".dock");if(p&&u&&!r&&!(typeof tt<"u"&&tt.run&&!rn())){it.classList.remove("keyfree");let m=document.getElementById("mapkey");m&&m.classList.contains("inrail")&&(m.classList.remove("inrail"),m.classList.add("mapov","panel"),$o.appendChild(m)),p.style.minHeight="";let x=(u.getBoundingClientRect().top-p.getBoundingClientRect().top)/n-12;p.style.maxHeight="";let g=p.scrollHeight,f=(document.querySelector(".mapov")?.offsetHeight||0)+16;p.style.maxHeight=`${Math.max(200,x)}px`;let M=p.getBoundingClientRect(),v=it.getBoundingClientRect();it.style.setProperty("--rail-b",`${Math.round((M.bottom-v.top)/n)}px`),it.classList.toggle("keyfree",M.bottom+f*n>u.getBoundingClientRect().top-16*n),m&&it.classList.contains("keyfree")&&(m.classList.remove("mapov","panel"),m.classList.add("inrail"),(p.querySelector(".pdetrow")||p.lastElementChild).after(m));{let y=p.getBoundingClientRect();p.style.minHeight=`${Math.round(y.height/n)}px`,it.style.setProperty("--rail-b",`${Math.round((y.bottom-it.getBoundingClientRect().top)/n)}px`);let E=m&&m.classList.contains("mapov")?m.getBoundingClientRect():null;if(E&&E.height){let T=Math.floor((E.top-y.top)/n-16);T>y.height/n&&(p.style.minHeight=`${T}px`,it.style.setProperty("--rail-b",`${Math.round((p.getBoundingClientRect().bottom-it.getBoundingClientRect().top)/n)}px`))}}}}let d=l.left+(i-l.left-l.right)/2,h=l.top+(t-l.top-l.bottom)/2;(di||!Pe.card)&&i&&t?ne.setViewOffset(i,t,i/2-d,t/2-h,i,t):ne.clearViewOffset(),ne.updateProjectionMatrix(),of()}function ef(){if(!tt.run)return;let i=Math.max(0,Math.round((Date.now()-Date.parse(tt.run.issue))/6e4)),t=i<60?`${i}\u202Fmin ago`:i<2880?`${Math.round(i/60)}\u202Fh ago`:`${Math.round(i/1440)} days ago`,e=new Date(tt.run.issue),n=Ci.format(e)===Ci.format(new Date),r=new Date(Math.ceil((Date.now()-18e5+1)/36e5)*36e5+18e5);D("issued-t").parentElement.querySelector(".frs").innerHTML=`<span class="fw">Forecast issued </span><span class="fi">Issued </span><b>${n?"":`<span class="fw">${Ci.format(e)}, </span><span class="fi">${Ci.format(e).split(" ")[0]} </span>`}${Se(e)}</b><span class="fw"> \xB7 next <b>${Se(r)}</b></span>${i<90?" \xB7 live":""}`,D("issued-t").parentElement.title=`${Xt.issued} ${As.format(e)}, ${t}`,D("livedot").className=i<90?"ok":"old"}setInterval(()=>ef(),6e4);var dc={},pc={},xd=[],cd=0,bd=null;var nf=[],rf=null,sf={};window.fitStat=()=>({...rf,...Wv});var Hv=[[50.0136,8.428],[50.0098,8.4535],[49.9899,8.4225]].map(([i,t])=>[(t-8.5706)*71503,(i-50.0333)*111320]),Vv=[[50.0531,8.6947]].map(([i,t])=>[(t-8.5706)*71503,(i-50.0333)*111320]);function Gv(i,t){let e=Jn(i,t),n=e.dir,r=e.start,s=(t===25?Vv:Hv).map(o=>{let a=r[0]-o[0],c=r[1]-o[1],l=a*n[0]+c*n[1],d=Math.abs(a*n[1]-c*n[0]);return l>0&&d<1500?l:0});return sf[`${i.key}/${t}`]||16e3}var Fu=!1,Ue={top:0,right:0,bottom:0,left:0},tr=null,Wv=null,hd=()=>it.clientWidth<640;function of(){if(di||!se.r18||!it.clientWidth){Fn.fog.density=4e-5,vd=!1,lf();for(let b of Qn)b.visible===void 0&&(b.visible=!0);return}let i=[...Object.values(se).flatMap(b=>[b.A,b.B]),...(Fe.aerodrome||[]).flat()],t=Math.min(...i.map(b=>b[0])),e=Math.max(...i.map(b=>b[0])),n=Math.min(...i.map(b=>b[1])),r=Math.max(...i.map(b=>b[1])),s=6e3*Math.sin(69*Math.PI/180),o=6e3*Math.cos(69*Math.PI/180),c=(li===25?[[50.0531,8.6947]]:[[50.0136,8.428],[50.0098,8.4535],[49.9899,8.4225]]).map(([b,w])=>[(w-8.5706)*71503,(b-50.0333)*111320]),l=Object.values(se).filter(b=>b.key==="centre"||b.key==="r18").map(b=>{let w=Jn(b,li),P=b.key==="r18"?1100:1500;return[w.start[0]+w.dir[0]*(b.len+P),w.start[1]+w.dir[1]*(b.len+P)]}),d=[t,e,...c.map(b=>b[0]),...hd()?l.map(b=>b[0]):[]],h=[n,r,...c.map(b=>b[1]),...hd()?l.map(b=>b[1]):[]],p=hd()?(b=>[b[0]-b[4]*.1,b[1]+b[4]*.1,b[2]-b[5]*.1,b[3]+b[5]*.1])((b=>[...b,b[1]-b[0],b[3]-b[2]])([Math.min(...d)-1800,Math.max(...d),Math.min(...h),Math.max(...h)])):[Math.min(...d)-1800,Math.max(...d)+1200,Math.min(...h)-1200,Math.max(...h)+1200],u=it.clientWidth<640,m=Pe.card?-6e3:(p[0]+p[1])/2,x=Pe.card?0:(p[2]+p[3])/2,g=Pe.card?27e3:p[1]-p[0],f=Pe.card?2e4:p[3]-p[2],M=it.clientWidth,v=it.clientHeight,y=M-Ue.left-Ue.right,E=v-Ue.top-Ue.bottom,T=Math.tan(qn.degToRad(ne.fov/2)),A=Math.max(f/(2*T*(E/v)),g/(2*T*ne.aspect*(y/M))),I=qn.degToRad(u?.5:10);if(Ro[Pe.card?"card":"full"]={pos:qt(m,x-A*Math.sin(I),A*Math.cos(I)),target:qt(m,x,0)},cd=0,!Pe.card){let b=(Fe.aerodrome||[[]])[0],w=[];for(let yt of Object.values(se))if(yt.key==="nw"||yt.key==="south"){let V=Jn(yt,li),q=c.map(ft=>{let xt=V.start[0]-ft[0],rt=V.start[1]-ft[1],ut=xt*V.dir[0]+rt*V.dir[1],R=Math.abs(xt*V.dir[1]-rt*V.dir[0]);return ut>0&&R<2500?ut:0}),ot=Math.max(4e3,Math.max(...q)+1e3);w.push([V.start[0]-V.dir[0]*ot,V.start[1]-V.dir[1]*ot])}let P=Object.values(se).length*2+b.filter((yt,V)=>V%10===0).length,k=nf=[...Object.values(se).flatMap(yt=>[yt.A,yt.B]),...b.filter((yt,V)=>V%10===0),...c,...u?[]:l],G=k.map(yt=>qt(yt[0],yt[1],0)),N=ne.clone(),L=new U,O=(Math.min(...k.map(yt=>yt[0]))+Math.max(...k.map(yt=>yt[0])))/2,W=(Math.min(...k.map(yt=>yt[1]))+Math.max(...k.map(yt=>yt[1])))/2,z=(yt,V,q,ot,ft)=>{let xt=[Math.sin(ot),Math.cos(ot)];return[qt(yt-xt[0]*q*Math.sin(ft),V-xt[1]*q*Math.sin(ft),q*Math.cos(ft)),qt(yt,V,0)]},Q=Ue.left+y/2,nt=Ue.top+E/2,ht=u?Math.min(.97,1-48/Math.max(200,y)):.97,dt=null;for(let yt of u?[0]:[0,-6,6,-12,12])for(let V of u?[.5]:[16,20]){let q=yt*Math.PI/180,ot=V*Math.PI/180,ft=[Math.sin(q),Math.cos(q)],xt=[Math.cos(q),-Math.sin(q)],rt=O,ut=W,R=2e4,Ft=0,St=0,It=0,mt=0;for(let wt=0;wt<14;wt++){let[Gt,Ee]=z(rt,ut,R,q,ot);N.position.copy(Gt),N.up.set(0,1,0),N.lookAt(Ee),N.updateMatrixWorld(),N.updateProjectionMatrix();let Qt=G.map(j=>(L.copy(j).project(N),[(L.x+1)/2*M,(1-L.y)/2*v])),C=Math.min(...Qt.map(j=>j[0])),_=Math.max(...Qt.map(j=>j[0])),$=Math.min(...Qt.map(j=>j[1])),J=Math.max(...Qt.map(j=>j[1])),et=tr?Math.max(0,...Qt.filter(j=>j[0]>tr[0]).map(j=>tr[1]-j[1])):0,Z=Object.values(se).flatMap(j=>[j.A,j.B]).map(j=>(L.copy(qt(j[0],j[1],0)).project(N),[(L.x+1)/2*M,(1-L.y)/2*v])),Pt=u?Qt:Qt.slice(0,P),ct=(Math.min(...Pt.map(j=>j[0]))+Math.max(...Pt.map(j=>j[0])))/2,Tt=(Math.min(...Pt.map(j=>j[1]))+Math.max(...Pt.map(j=>j[1])))/2,At=.5,st=.5,vt=Ue.left+At*y,Ot=Ue.top+st*E;Ft=Math.max((ct-C)/(At*y),(_-ct)/((1-At)*y)),St=Math.max((Tt-$)/(st*E),(J-Tt)/((1-st)*E)),It=(ct-vt)/y,mt=(Tt-Ot-et/2)/E;let Lt=u?ht:Math.min(ht,1-96/y),bt=u?ht:Math.min(ht,1-104/E),$t=(j,K,Rt)=>j.length?Math.max((ct-Math.min(...j.map(Nt=>Nt[0])))/(At*y-K),(Math.max(...j.map(Nt=>Nt[0]))-ct)/((1-At)*y-K),(Tt-Math.min(...j.map(Nt=>Nt[1]))+et)/(st*E-Rt),(Math.max(...j.map(Nt=>Nt[1]))-Tt)/((1-st)*E-Rt)):0,F=u?Math.max(Ft/Lt,(St+et/E)/bt):Math.max($t(Qt.slice(0,P),48,40),$t(Qt.slice(P,P+c.length),0,14),$t(Qt.slice(P+c.length),24,32)),at=2*R*T/v,pt=It*y*at,Mt=mt*E*at/Math.max(.3,Math.cos(ot));rt+=pt*xt[0]-Mt*ft[0],ut+=pt*xt[1]-Mt*ft[1],R*=Math.pow(F,.8)}let Jt=Math.min(Ft,1)*Math.min(St,1);(!dt||Jt>dt.cover*1.03)&&(dt={tx:rt,ty:ut,D:R,az:q,deg:yt,tt:ot,cover:Jt,fx:Ft,fy:St,cx:It,cy:mt})}let[zt,Vt]=z(dt.tx,dt.ty,dt.D,dt.az,dt.tt);Ro.full={pos:zt,target:Vt},cd=dt.deg,rf={w:M,h:v,fillX:+dt.fx.toFixed(3),fillY:+dt.fy.toFixed(3),offX:+dt.cx.toFixed(3),offY:+dt.cy.toFixed(3),tilt:Math.round(dt.tt*180/Math.PI),free:[Math.round(Ue.left),Math.round(Ue.top),Math.round(y),Math.round(E)]};{N.position.copy(zt),N.up.set(0,1,0),N.lookAt(Vt),N.updateMatrixWorld(),N.updateProjectionMatrix();let yt=[Math.max(0,Ue.left-32+8),Ue.top,M,v-Ue.bottom];for(let V of Object.values(se))if(V.key==="nw"||V.key==="south"){let q=Jn(V,li),ot=2e3;for(;ot<16e3;ot+=50){L.copy(qt(q.start[0]-q.dir[0]*ot,q.start[1]-q.dir[1]*ot,0)).project(N);let ft=(L.x+1)/2*M,xt=(1-L.y)/2*v;if(ft<yt[0]||xt<yt[1]||ft>yt[2]||xt>yt[3])break}sf[`${V.key}/${li}`]=ot}for(let V of Object.keys(pc))delete pc[V];if(!u){for(let V of Object.values(se))if(V.key==="nw"||V.key==="south"){let q=li===25?7:25,ot=Jn(V,q),ft=1e3;for(;ft<16e3;ft+=100){L.copy(qt(ot.start[0]-ot.dir[0]*ft,ot.start[1]-ot.dir[1]*ft,0)).project(N);let xt=(L.x+1)/2*M,rt=(1-L.y)/2*v;if(xt<Ue.left||xt>M-16||rt<Ue.top-24||rt>v-Ue.bottom||tr&&xt>tr[0]&&rt<tr[1])break}pc[`${V.key}/${q}`]=ft}}for(let V of Object.keys(dc))delete dc[V];if(!u){for(let V of Object.values(se))if(V.key==="centre"||V.key==="r18"){let q=Jn(V,li),ot=[q.start[0]+q.dir[0]*V.len,q.start[1]+q.dir[1]*V.len],ft=0;for(;ft<1500;ft+=25){L.copy(qt(ot[0]+q.dir[0]*(ft+25),ot[1]+q.dir[1]*(ft+25),0)).project(N);let xt=(L.x+1)/2*M,rt=(1-L.y)/2*v;if(rt>v-Ue.bottom||xt>M-24||rt<Ue.top-32)break}dc[`${V.key}/${li}`]=ft}}try{Ed="",tt.cur&&hf(tt.cur.od,tt.cur.r18)}catch{}}}{let b=document.querySelector(".sbw svg");b&&bd!==null&&b.style.setProperty("--a",`${bd+180-cd}deg`)}Fn.fog.density=(ie==="light"?.22:.35)/A,vd=!0;for(let b of Qn)b.visible=!1;(Fu!==Pe.card+1||!Cc&&Dr!=="follow"&&!Pe.card)&&(Fu=Pe.card+1,ne.position.copy(Lo().pos),pn.target.copy(Lo().target))}var af=new ResizeObserver(()=>Fr());setTimeout(()=>{Cc||Fr()},700);af.observe(it);requestAnimationFrame(()=>{for(let i of[".rail",".dock"]){let t=document.querySelector(i);t&&af.observe(t)}});var Ms={transparent:!0,blending:Zi,depthWrite:!1},$v=0,Qn=[],vd=!1;function xe(i,t){return i.renderOrder=t??$v++,i.frustumCulled=!1,Fn.add(i),i}function Tn(i,t,e=3){let n=new Be;return n.setAttribute("position",new ue(i,3)),t&&n.setAttribute("color",new ue(t,e)),n}var yc=[],uc=[],Do=[];function Je(i,t){let e=i.material,n={};for(let r in t)n[r]=r==="color"?e.color.clone():e[r];return yc.push({m:e,dark:n,light:{...t,...t.color?{color:new Dt(t.color)}:{}}}),i}function lf(){for(let i of yc){for(let[t,e]of Object.entries(i[ie]))t==="color"?i.m.color.copy(e):i.m[t]=e;i.m.needsUpdate=!0}for(let i of uc)i.visible=ie==="dark";for(let i of Do)i.visible=ie==="light";if(vd)for(let i of Qn)i.visible=!1}function Ic(i,t,e,n){let r=[];for(let s of i){let o=s.map(a=>new Ct(a[0],a[1]));for(let a of ls.triangulateShape(o,[]))for(let c of a)r.push(o[c].x,t,-o[c].y)}return new ve(Tn(r),new qe({color:e,transparent:!0,opacity:n,depthWrite:!1,side:Ie}))}function Go(i,t,e,n,r=!1){let s=[];for(let o of i){let a=o.length,c=r?a:a-1;for(let l=0;l<c;l++){let d=o[l],h=o[(l+1)%a];s.push(d[0],t,-d[1],h[0],t,-h[1])}}return new Wn(Tn(s),new wn({color:e,opacity:n,...Ms}))}var yd=1;function er(i,t,e,n){let r=[];for(let{p:s,w:o}of i){let a=o/2;for(let c=0;c<s.length-1;c++){let[l,d]=s[c],[h,p]=s[c+1],u=Math.hypot(h-l,p-d)||1,m=-(p-d)/u*a,x=(h-l)/u*a,g=[[l+m,d+x],[h+m,p+x],[h-m,p-x],[l-m,d-x]];for(let f of[0,1,2,0,2,3])r.push(g[f][0],t,-g[f][1])}}return new ve(Tn(r),new qe({color:e,transparent:!0,opacity:n,depthWrite:!1,side:Ie}))}var Pc=new ve(new Wi(9e4,9e4),new qe({color:kr.dark.ground}));Je(Pc,{color:kr.light.ground});Pc.rotation.x=-Math.PI/2;Pc.position.y=-1;xe(Pc,-10);var Ts=new ho(24e3,96,"#1f1f1d","#191918");Ts.position.set(-1500,0,0);Ts.material.transparent=!0;Ts.material.opacity=.22;Ts.material.depthWrite=!1;xe(Je(Ts,{vertexColors:!1,color:"#e3e2de",opacity:.9}));var _d=()=>{Ts.visible=it.clientWidth>=640&&ie!=="light"};new ResizeObserver(_d).observe(it);Qn.push(xe(Je(Ic(Fe.forest,0,"#121211",.9),{color:"#d6dacd",opacity:1})));Qn.push(xe(Je(Ic(Fe.water,0,"#101318",.9),{color:"#bccddd",opacity:1})));xe(Je(Ic(Fe.aerodrome,0,"#3a3a35",.95),{color:"#d5cdbd",opacity:1}));xe(Je(Go(Fe.aerodrome,0,"#a5a49d",.9,!0),{color:"#8f8b82",opacity:1,blending:ui}));xe(Je(Ic(Fe.aprons,0,"#56564f",.95),{color:"#aea492",opacity:1}));xe(Je(Go(Fe.aprons,0,"#83827b",.6,!0),{color:"#8a857b",opacity:.7,blending:ui}));xe(Je(er(Fe.taxiways,0,"#45453f",.95),{color:"#a49e92",opacity:1}));Qn.push(xe(Je(Go(Fe.taxiways.map(i=>i.p),0,"#5c5b55",.35),{color:"#d8d6d0",opacity:.35,blending:ui})));for(let i of[0,1,2]){let t=["#6d6c66","#4a4945","#33322f"][i];Qn.push(xe(Je(Go(Fe.roads.filter(e=>e.c===i).map(e=>e.p),0,t,[.65,.5,.45][i]),{color:["#aeaca6","#bcbab4","#cac8c2"][i],opacity:.55,blending:ui})))}var wd=[];{let i=[[50.108,8.78],[50.104,8.74],[50.106,8.69],[50.103,8.65],[50.1,8.58],[50.092,8.545],[50.063,8.53],[50.04,8.5],[50.012,8.47],[50.003,8.44],[50.008,8.4],[50.007,8.33],[50.003,8.275]].map(([e,n])=>[(n-8.5706)*71503,(e-50.0333)*111320]),t=new eo(i.map(e=>new U(e[0],e[1],0)),!1,"centripetal").getSpacedPoints(180).map(e=>[e.x,e.y]);for(let e=0;e<t.length-1;e++){let n=t[e],r=t[e+1],s=(e+.5)/(t.length-1),o=Math.hypot((n[0]+r[0])/2+1500,(n[1]+r[1])/2),a=Math.max(0,Math.min(1,(11e3-o)/4e3,1-(s-.6)/.4));a>.02&&xe(Je(er([{p:[n,r],w:60}],.3,"#3a4f5e",.5*a),{color:"#9fb8cf",opacity:.95*a})),e%3===0&&wd.push([(n[0]+r[0])/2,(n[1]+r[1])/2,a])}}Qn.push(xe(Je(Go(Fe.rail,.5,"#8a8984",.5),{color:"#c8c6c0",opacity:.7,blending:ui})));{let i=document.createElement("canvas");i.width=i.height=256;let t=i.getContext("2d"),e=t.createRadialGradient(128,128,0,128,128,128);e.addColorStop(0,"rgba(0,0,0,0.045)"),e.addColorStop(.6,"rgba(0,0,0,0.03)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let n=new ve(new Wi(26e3,18e3),new qe({map:new js(i),transparent:!0,depthWrite:!1}));n.rotation.x=-Math.PI/2,n.position.copy(qt(-2600,-800,-.5)),xe(n,-9),Do.push(n)}var Mo=(()=>{let i=(Fe.aerodrome||[[]])[0];if(!i.length)return null;let t=i.map(n=>n[0]),e=i.map(n=>n[1]);return[Math.min(...t),Math.max(...t),Math.min(...e),Math.max(...e)]})(),hc=(Fe.aerodrome||[[]])[0],Nu=i=>{let t=!1;for(let e=0,n=hc.length-1;e<hc.length;n=e++){let[r,s]=hc[e],[o,a]=hc[n];s>i[1]!=a>i[1]&&i[0]<(o-r)*(i[1]-s)/(a-s)+r&&(t=!t)}return t},Bu=i=>!!Mo&&i[0]>Mo[0]&&i[0]<Mo[1]&&i[1]>Mo[2]&&i[1]<Mo[3];function Xv(){let i=[],t=[],e=[],n=[],r=[],s=[],o=[.6,.6,.58],a={t:1.2,w:1.6,h:.9,a:.8,o:.24},c=h=>Math.abs(h.reduce((p,u,m)=>{let x=h[(m+1)%h.length];return p+u[0]*x[1]-x[0]*u[1]},0)/2);for(let h of Fe.buildings){if(c(h.r)<(Bu(h.r[0])?400:2500))continue;let p=h.r,u=p.length,m=h.m||0,x=Math.max(h.h,m+1),g=a[h.k]??.5,f=o.map(A=>A*g*.03),M=o.map(A=>A*g*.15),v=o.map(A=>A*g*.07);for(let A=0;A<u;A++){let I=p[A],b=p[(A+1)%u],w=[[I,m,f],[b,m,f],[b,x,M],[I,x,M]];for(let P of[0,1,2,0,2,3])i.push(w[P][0][0],w[P][1],-w[P][0][1]),t.push(...w[P][2])}let y=p.map(A=>new Ct(A[0],A[1]));for(let A of ls.triangulateShape(y,[]))for(let I of A)i.push(y[I].x,x,-y[I].y),t.push(...v),(Nu(p[0])?r:s).push(y[I].x,.5,-y[I].y);let E=o.map(A=>A*g*.6),T=o.map(A=>A*g*.15);for(let A=0;A<u;A++){let I=p[(A+u-1)%u],b=p[A],w=p[(A+1)%u];e.push(b[0],x,-b[1],w[0],x,-w[1]),n.push(...E,...E),h.k!=="o"&&(e.push(b[0],m,-b[1],w[0],m,-w[1]),n.push(...T,...T));let P=Math.atan2(b[1]-I[1],b[0]-I[0]),k=Math.atan2(w[1]-b[1],w[0]-b[0]),G=Math.abs(k-P);G>Math.PI&&(G=2*Math.PI-G),G>.45&&(e.push(b[0],m,-b[1],b[0],x,-b[1]),n.push(...T,...E))}}let l=Tn(i,t);l.computeVertexNormals();let d=xe(new ve(Tn(r),new qe({color:"#1b1c1e",transparent:!0,opacity:.1,depthWrite:!1,depthTest:!1,side:Ie})),13);Je(d,{color:"#a59f93",opacity:1});{let h=[];for(let u of Fe.buildings){if(c(u.r)<(Bu(u.r[0])?400:2500)||!Nu(u.r[0]))continue;let m=u.r;for(let x=0;x<m.length;x++){let g=m[x],f=m[(x+1)%m.length];h.push(g[0],.6,-g[1],f[0],.6,-f[1])}}let p=xe(new Wn(Tn(h),new wn({color:"#635e55",transparent:!0,opacity:.95,depthTest:!1})),14);Do.push(p)}d.material.color.set("#ffffff"),d.material.opacity=.06,yc[yc.length-1].dark={color:new Dt("#ffffff"),opacity:.2};{let h=xe(new ve(Tn(s),new qe({color:"#ffffff",transparent:!0,opacity:.018,depthWrite:!1,depthTest:!1,side:Ie})),13);Je(h,{color:"#b9b5ad",opacity:.3})}}Xv();var qv=`
attribute vec2 rw; varying vec2 vR;
#include <common>
#include <fog_pars_vertex>
void main(){ vR = rw; vec4 mvPosition = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mvPosition;
#include <fog_vertex>
}`,Yv=`
uniform float uLen, uW, uDir, uActive, uClosed, uTime, uLight; uniform vec3 uCol; varying vec2 vR;
#include <common>
#include <fog_pars_fragment>
void main(){
  float ay = abs(vR.y), x = vR.x, endD = min(x, uLen - x);
  float edge = smoothstep(0.86, 0.92, ay);
  float dash = step(ay, 0.04) * step(mod(x, 60.), 30.) * step(70., endD);
  float keys = step(8., endD) * step(endD, 50.) * step(0.5, fract(ay * uW / 7.)) * step(ay, 0.8);
  float s = x * uDir - uTime * 70.;
  float ch = fract((s + ay * uW * 0.9) / 150.);
  float chev = smoothstep(0.0, 0.03, ch) * (1. - smoothstep(0.12, 0.17, ch)) * step(ay, 0.72) * step(90., endD);
  float marks = edge * 0.55 + dash * 0.6 + keys * 0.45;
  float hatch = step(0.55, fract((x + vR.y * uW * 0.5) / 45.)) * step(ay, 0.86);
  float cross = step(abs(abs(vR.y) - (1. - abs(fract(x / uLen * 6.) * 2. - 1.)) ), 0.07);
  vec3 col;
  if (uLight > 0.5) { // grey asphalt, white markings, flow painted in the direction colour
    col = mix(vec3(0.604, 0.592, 0.561), vec3(0.97), clamp(marks * 1.4, 0., 1.)); // light: mid-grey tarmac (#9a978f), the lines sit on something solid
    col = mix(col, uCol, clamp(uActive * (edge + chev + step(ay, 0.12)), 0., 1.)); // the direction: edges, centreline and chevrons in its colour // solid: the runway in use is the loudest thing on the map // highlight: whole strip in the flow colour
    vec3 closed = mix(vec3(0.82, 0.62, 0.62), vec3(0.75, 0.04, 0.05), clamp(0.6 * hatch + edge + cross, 0., 1.));
    col = mix(col, closed, uClosed);
  } else {             // x-ray: dark strip, glowing edges and chevrons
    col = vec3(0.17, 0.17, 0.16) + vec3(0.7, 0.7, 0.68) * marks; // dark: the strip a clear step above the map, its edges near white
    col += uCol * uActive * (0.12 + edge * 0.9 + chev * 1.0 + step(ay, 0.12) * 0.8); // tarmac stays dark; the direction glows along edges, centreline and chevrons
    col = mix(col, vec3(0.05, 0.03, 0.03) + vec3(0.9, 0.16, 0.16) * (0.18 * hatch + 0.9 * edge + 0.7 * cross), uClosed);
  }
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,se={};for(let[i,t]of Fe.runways.entries()){let e=t.p[0],n=t.p[t.p.length-1],r=Math.hypot(n[0]-e[0],n[1]-e[1]),s=1.35,o=(n[0]-e[0])/r,a=(n[1]-e[1])/r,c=-a*t.w*s/2,l=o*t.w*s/2,d=new Be,h=[[e[0]+c,e[1]+l,0,1],[n[0]+c,n[1]+l,r,1],[n[0]-c,n[1]-l,r,-1],[e[0]-c,e[1]-l,0,-1]],p=[],u=[];for(let v of[0,1,2,0,2,3])p.push(h[v][0],0,-h[v][1]),u.push(h[v][2],h[v][3]);d.setAttribute("position",new ue(p,3)),d.setAttribute("rw",new ue(u,2));let m=Yn.merge([gt.fog,{uLen:{value:r},uW:{value:t.w*s},uDir:{value:1},uActive:{value:0},uClosed:{value:0},uTime:{value:0},uCol:{value:new Dt},uLight:{value:0}}]),x=new Ce({vertexShader:qv,fragmentShader:Yv,uniforms:m,fog:!0,transparent:!0,depthWrite:!1,side:Ie});xe(new ve(d,x),40);let g=t.ref.startsWith("07L")?"nw":t.ref.startsWith("07C")?"centre":t.ref.startsWith("07R")?"south":"r18",[f,M]=t.ref.includes("/")?t.ref.split("/"):["18","36"];se[g]={i,key:g,A:e,B:n,len:r,ux:o,uy:a,mat:x,ref:t.ref,w:t.w,d07:f,d25:M}}function Jn(i,t){if(i.key==="r18"){let o=i.A[1]>i.B[1]?i.A:i.B,a=o===i.A?i.B:i.A;return{start:o,dir:[(a[0]-o[0])/i.len,(a[1]-o[1])/i.len],startIsA:o===i.A}}let e=i.A[0]<i.B[0]?i.A:i.B,n=e===i.A?i.B:i.A,[r,s]=t===7?[e,n]:[n,e];return{start:r,dir:[(s[0]-r[0])/i.len,(s[1]-r[1])/i.len],startIsA:r===i.A}}var Zv=[[1,.9,.72],[.95,.94,.9],[.55,.62,.55],[.5,.5,.48],[1,.2,.18]];var nr=new Ce({uniforms:{uAct:{value:new fe(1,1,1,1)},uArr:{value:new fe(-1,-1,-1,-1)},uTime:{value:0},uScale:{value:600},uLight:{value:0}},vertexShader:`
    attribute vec3 color; attribute vec4 meta; // cls, runway, end (0=A,1=B), distance beyond end
    uniform vec4 uAct, uArr; uniform float uTime, uScale, uLight; varying vec3 vC; varying float vI;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.);
      float cls = meta.x, rw = meta.y;
      vec4 oh = vec4(equal(vec4(rw), vec4(0., 1., 2., 3.)));
      float act = rw < -0.5 ? 1. : dot(uAct, oh), arr = rw < -0.5 ? -9. : dot(uArr, oh);
      float I = cls > 1.5 ? 0.45 : cls > 0.5 ? mix(0.12, 1.0, act) : 0.;
      if (cls < 0.5) {
        float on = abs(meta.z - arr) < 0.5 ? 1. : 0.;
        float rabbit = step(fract(uTime * 0.9 - meta.w / 950.), 0.07);
        I = on * (0.8 + 2.5 * rabbit) + (1. - on) * 0.08;
      }
      if (cls > 3.5) I = 0.9;
      vC = uLight > 0.5 ? color * color * 0.55 : color;
      vI = I;
      gl_PointSize = clamp(uScale * (cls < 0.5 ? 1.4 : 1.0) / -mv.z * 10., 1.2, 9.);
      gl_Position = projectionMatrix * mv;
    }`,fragmentShader:`
    uniform float uLight; varying vec3 vC; varying float vI;
    void main(){
      vec2 d = gl_PointCoord - 0.5; float a = exp(-dot(d, d) * 14.);
      gl_FragColor = uLight > 0.5 ? vec4(vC, a * min(1., vI * 1.1)) : vec4(vC * vI * a, 1.);
    }`,...Ms});{let i=[],t=[],e=[],n=Fe.runways;for(let[s,o,a,c]of Fe.lights){i.push(s,.5,-o),t.push(...Zv[a]);let l=0,d=0;if(c>=0){let h=n[c].p[0],p=n[c].p[n[c].p.length-1],u=p[0]-h[0],m=p[1]-h[1],x=u*u+m*m,g=((s-h[0])*u+(o-h[1])*m)/x;l=g<.5?0:1,d=Math.max(0,g<0?-g:g-1)*Math.sqrt(x)}e.push(a,c,l,d)}let r=Tn(i,t);r.setAttribute("meta",new ue(e,4)),xe(new Zs(r,nr),60)}function jv(){let i=[],t=(r,s,o,a,c,l,d=10)=>{let h=new Qs(s,r,o,d,1,!0);h.rotateZ(-Math.PI/2),h.translate(a,c,l),i.push(h.toNonIndexed())},e=(r,s,o=!0)=>{let a=[];for(let c of o?[1,-1]:[1]){let l=r.map(([d,h])=>[d,s,h*c]);for(let d=1;d<l.length-1;d++)a.push(...l[0],...l[d],...l[d+1])}i.push(Tn(a))};t(1.95,1.95,30,1,2.4,0),t(1.95,.25,5.5,18.75,2.3,0),t(1.95,.5,8,-18,2.9,0),e([[4.5,1.5],[-6,17.5],[-8.6,17.5],[-4.5,1.5]],1.7),e([[-15.2,1],[-19.8,6.8],[-21.4,6.8],[-19.4,1]],3.3);{let r=[[-14,4],[-19.6,11.8],[-21.6,11.8],[-20.8,4]].map(([s,o])=>[s,o,0]);i.push(Tn([...r[0],...r[1],...r[2],...r[0],...r[2],...r[3]]))}t(1.15,1.15,4.2,1.8,.55,6.2,8),t(1.15,1.15,4.2,1.8,.55,-6.2,8);for(let r of i)r.deleteAttribute("normal"),r.deleteAttribute("uv");let n=cc(i);return n.computeVertexNormals(),n}var kc=jv(),Ad=new to(kc,25);{let i=new _e,t=new fn,e=new U(0,1,0),n=[],r=[];for(let[s,o,a,c]of Fe.stands)i.compose(qt(s,o,.3),t.setFromAxisAngle(e,a),new U(c,c,c)),n.push(kc.clone().applyMatrix4(i)),r.push(Ad.clone().applyMatrix4(i));if(n.length){let s=cc(n);Qn.push(uc.push(xe(new ve(s,new qe({color:"#8a8984",opacity:.1,side:Ie,...Ms})),55))&&uc[uc.length-1]),Qn.push(Do[Do.push(xe(new ve(s,new xr({color:"#ffffff",side:Ie})),55))-1]),Qn.push(xe(Je(new Wn(cc(r),new wn({color:"#c3c2b7",opacity:.3,...Ms})),{color:"#cfcdc7",opacity:.3,blending:ui}),56))}}var Jv=Math.tan(3*Math.PI/180),Kv=Math.tan(7.5*Math.PI/180),ce={far:16e3,vApp:72,td:380,dec:1.9,vExit:14,exitT:9},ze={hold:6,acc:2.1,vRot:82,climbDist:13e3};ce.tTd=(ce.far+ce.td)/ce.vApp;ce.tRoll=(ce.vApp-ce.vExit)/ce.dec;ce.D=ce.tTd+ce.tRoll+ce.exitT;ze.tRoll=ze.vRot/ze.acc;ze.dRoll=ze.vRot**2/(2*ze.acc);ze.D=ze.hold+ze.tRoll+ze.climbDist/(ze.vRot+6);function Qv(i){if(i<ce.tTd){let r=-ce.far+ce.vApp*i;return[r,Math.max(0,(ce.td-r)*Jv),.05,0]}let t=Math.min(i-ce.tTd,ce.tRoll),e=ce.td+ce.vApp*t-ce.dec*t*t/2,n=Math.max(0,i-ce.tTd-ce.tRoll);return[e+ce.vExit*n,0,0,Math.min(1,n/ce.exitT)]}function ty(i){if(i<ze.hold)return[0,0,0,0];let t=i-ze.hold;if(t<ze.tRoll)return[ze.acc*t*t/2,0,0,0];let e=ze.dRoll+(ze.vRot+6)*(t-ze.tRoll);return[e,(e-ze.dRoll)*Kv,.14,0]}var dd=40,Md=class{constructor(t,e,n,r,s){this.kind=t,this.rw=e,this.f=Jn(e,n),this.phase=r,this.born=s,this.dead=null;let o=this.f.startIsA,a=o?e.A:e.B,c=o?e.B:e.A;this.des=e.key==="r18"?"18":a[0]<c[0]?e.d07:e.d25,this.label=`Simulated ${t==="arr"?"arrival":"departure"} \xB7 ${this.des}`,this.D=t==="arr"?ce.D:ze.D,this.side=Math.random()<.5?1:-1;let l=t==="arr"?gd.arr:gd.dep,d=this.light=ie==="light",h={transparent:!0,depthWrite:!1,blending:d?ui:vc};this.mat=d?new xr({color:"#ffffff",side:Ie,transparent:!0}):new qe({color:new Dt("#e8e7e3"),side:Ie,...Ms}),this.emat=new wn({color:d?l:l.clone().lerp(new Dt("#ffffff"),.5),...h}),this.obj=new Hn,this.obj.add(new ve(kc,this.mat),new Wn(Ad,this.emat)),xe(this.obj,70);let p=dd;this.tg=Tn(new Float32Array(p*2*3),new Float32Array(p*2*4),4);let u=[];for(let m=0;m<p-1;m++){let x=2*m;u.push(x,x+1,x+2,x+1,x+3,x+2)}this.tg.setIndex(u),this.trail=xe(new ve(this.tg,new qe({vertexColors:!0,side:Ie,...h})),65),this.lg=Tn(new Float32Array(p*3),new Float32Array(p*4),4),this.line=xe(new os(this.lg,new wn({vertexColors:!0,...h})),66),this.col=l}pose(t){let[e,n,r,s]=(this.kind==="arr"?Qv:ty)(t),{start:o,dir:a}=this.f,c=o[0]+a[0]*e,l=o[1]+a[1]*e,d=Math.atan2(a[1],a[0]);if(s>0){let h=this.side*90*s*s;c+=-a[1]*h,l+=a[0]*h,d+=this.side*s*.9}return{x:c,y:l,h:n,hd:d,pitch:r}}alpha(t,e){let n=Math.min(1,(e-this.born)/1.5);this.dead!==null&&(n*=Math.max(0,1-(e-this.dead)/1.5));let r=t/this.D;return n*Math.min(1,r/.04)*Math.min(1,(1-r)/.05)}update(t,e){let n=(t/this.D+this.phase)%1*this.D,r=this.pose(n),s=this.alpha(n,e);this.obj.position.copy(qt(r.x,r.y,r.h+2)),this.obj.rotation.set(0,r.hd,r.pitch,"YXZ"),this.obj.scale.setScalar(Pe.card?4.5:2.4),this.mat.opacity=.08*s,this.emat.opacity=.7*s,this.cur={...r,al:s,t:n};let o=this.tg.attributes.position.array,a=this.tg.attributes.color.array,c=this.lg.attributes.position.array,l=this.lg.attributes.color.array;for(let d=0;d<dd;d++){let h=Math.max(0,n-d*1.6),p=this.pose(h),u=(1-d/dd)**1.5*s;o.set([p.x,p.h+2,-p.y,p.x,0,-p.y],d*6);let m=this.col,x=u*(this.kind==="arr"?.14:.06)*(this.light?3:1)*Math.min(1,300/(p.h+60));a.set([m.r,m.g,m.b,x,m.r,m.g,m.b,0],d*8),c.set([p.x,p.h+2,-p.y],d*3),l.set([m.r,m.g,m.b,u],d*4)}for(let d of[this.tg,this.lg])d.attributes.position.needsUpdate=!0,d.attributes.color.needsUpdate=!0}dispose(){for(let t of[this.obj,this.trail,this.line])Fn.remove(t);this.tg.dispose(),this.lg.dispose(),this.mat.dispose(),this.emat.dispose()}},Ti=[];function ey(i){if(i.live)return[];let t=(Ze?.future||[]).find(o=>Date.parse(o.t)===Date.parse(i.t)),e=o=>o?Math.max(1,Math.min(6,Math.round(o/6))):0;if(!t)return[["arr",se.nw,3],["arr",se.south,3],["dep",se.centre,i.r18?3:4],...i.r18?[["dep",se.r18,3]]:[]];let n=t.arrivals||0,r=i.r18&&t.dep_18||0,s=(t.dep_centre||0)+(i.r18?0:t.dep_18||0);return[["arr",se.nw,e(Math.ceil(n/2))],["arr",se.south,e(Math.floor(n/2))],["dep",se.centre,e(s)],["dep",se.r18,e(r)]]}var Ou="";function ny(i,t,e){let n=ey(i),r=JSON.stringify([i.od,i.r18,i.live,n.map(s=>s[2])]);if(!(!e&&r===Ou)){Ou=r;for(let s of Ti)s.dead===null&&(s.dead=t);for(let[s,o,a]of n){if(!o)continue;let c=Math.random();for(let l=0;l<a;l++)Ti.push(new Md(s,o,i.od,(c+l/a)%1,t))}}}var Uo=1400,Ye={x0:-10500,x1:5500,y0:-9e3,y1:6e3,h0:40,h1:700},En={pos:new Float32Array(Uo*3),vec:new Ct(0,0),kt:0};for(let i=0;i<Uo;i++)En.pos[i*3]=qn.lerp(Ye.x0,Ye.x1,Math.random()),En.pos[i*3+1]=qn.lerp(Ye.y0,Ye.y1,Math.random()),En.pos[i*3+2]=qn.lerp(Ye.h0,Ye.h1,Math.random()**1.6);var So=Tn(new Float32Array(Uo*6),new Float32Array(Uo*8),4),iy=xe(Je(new Wn(So,new wn({vertexColors:!0,...Ms})),{blending:ui}),80);function Sd(i,t){let e=(i+180)*Math.PI/180;En.vec.set(Math.sin(e),Math.cos(e)),En.kt=t}function ry(i){let t=En.kt*.514*45,e=60+En.kt*14,n=En.pos,r=So.attributes.position.array,s=So.attributes.color.array,o=Ye.x1-Ye.x0,a=Ye.y1-Ye.y0;for(let c=0;c<Uo;c++){let l=n[c*3]+En.vec.x*t*i,d=n[c*3+1]+En.vec.y*t*i;l=Ye.x0+((l-Ye.x0)%o+o)%o,d=Ye.y0+((d-Ye.y0)%a+a)%a,n[c*3]=l,n[c*3+1]=d;let h=n[c*3+2],p=Math.min(1,(l-Ye.x0)/1500,(Ye.x1-l)/1500,(d-Ye.y0)/1500,(Ye.y1-d)/1500);r.set([l,h,-d,l-En.vec.x*e,h,-(d-En.vec.y*e)],c*6);let u=.22*Math.max(0,p)*Math.min(1,En.kt/4+.2);ie==="light"?s.set([.32,.32,.3,u*2.2,.32,.32,.3,0],c*8):s.set([.8,.8,.77,u,.8,.8,.77,0],c*8)}So.attributes.position.needsUpdate=!0,So.attributes.color.needsUpdate=!0}var Wo=document.createElement("div");Wo.className="labels";it.appendChild(Wo);var Lr=[];function ki(i,t,e,n,r){let s=document.createElement("div");s.className="lbl "+(r||""),s.innerHTML=i,Wo.appendChild(s);let o={el:s,p:qt(t,e,n),cls:r};return Lr.push(o),o}for(let[i,t,e]of Fe.places||[])ki(i,t,e,60,"place");var sy='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';var wM=[Math.sin(69*Math.PI/180),Math.cos(69*Math.PI/180)];for(let[i,t,e]of[["Frankfurt city \u2197",7980,8640],["Taunus hills",-8130,16e3],["Mainz \xB7 Wiesbaden",-14500,-1500],["Darmstadt",5700,-15e3]])ki(i,t,e,0,"landmark");for(let[i,t,e]of[["Fl\xF6rsheim",50.0136,8.428],["Raunheim",50.0098,8.4535],["Offenbach",50.0956,8.7761],["Mainz",49.9929,8.2473],["R\xFCsselsheim",49.9899,8.4225],["Kelsterbach",50.0613,8.53],["Frankfurt",50.1109,8.6821],["Neu-Isenburg",50.0531,8.6947],["Gro\xDF-Gerau",49.9214,8.485]]){let n=ki(`<i></i><span>${i}</span>`,(e-8.5706)*71503,(t-50.0333)*111320,0,"town");n.name=i}var pd=ki("",900,4300,0,"windind"),cf={};for(let i of Object.values(se))cf[i.key]=[i.A,i.B].map((t,e)=>{let n=e===0?-1:1,r=i.key==="south"?-1:1,s=i.key==="r18"?[1,0]:[-i.uy*Math.sign(i.ux||1)*r,i.ux*Math.sign(i.ux||1)*r];if(i.key==="r18"){let c=i.A[1]>i.B[1]?i.A:i.B,l=ki("",c[0]+260,c[1]+200,10,"rwy");return l.rw=i,l.end=qt(c[0],c[1],10),l.other=qt((i.A[1]>i.B[1]?i.B:i.A)[0],(i.A[1]>i.B[1]?i.B:i.A)[1],10),l}let o=ki("",t[0]-i.ux*n*260+s[0]*190,t[1]-i.uy*n*260+s[1]*190,10,"rwy"),a=e===0?i.B:i.A;return o.rw=i,o.end=qt(t[0],t[1],10),o.other=qt(a[0],a[1],10),o});var Rr=xe(new Hn,46),Io=[],fc=[];for(let i=0;i<10;i++)Io.push(ki(sy,0,0,0,"parrow"));for(let i=0;i<2;i++)fc.push(ki("",0,0,0,"ptag"));var Ed="",Fo=[],_c=[],Rd=[];function oy(i,t){let e=[];for(let n of Object.values(se)){if(n.key==="r18"&&!t)continue;let r=Jn(n,i),s=r.start,o=r.dir,a=[s[0]+o[0]*n.len,s[1]+o[1]*n.len];if(n.key==="nw"||n.key==="south"){let c=Gv(n,i);e.push({a:[s[0]-o[0]*c,s[1]-o[1]*c],b:s,kind:"arr",key:n.key,des:r.startIsA===n.A[0]<n.B[0]?n.d07:n.d25});let l=Jn(n,i===25?7:25),d=l.start;if(Xo){let h=pc[`${n.key}/${i===25?7:25}`]??16e3;e.push({a:[d[0]-l.dir[0]*h,d[1]-l.dir[1]*h],b:d,kind:"ghost"})}}else{let c=Math.min(n.key==="r18"?1100:1500,dc[`${n.key}/${i}`]??1e9);e.push({a,b:[a[0]+o[0]*c,a[1]+o[1]*c],kind:"dep",r18:n.key==="r18"})}}return e}function hf(i,t){let e=Ao?.25:1,n=`${i}/${t}/${ie}/${Xo}/${Ao}`;if(n===Ed)return;Ed=n,Fo=[];for(let l of Rr.children)l.geometry.dispose(),l.material.dispose();Rr.clear();let r=i===25?de.westLine:de.eastLine,s=oy(i,t);xd=s,Fo=s.filter(l=>l.kind!=="ghost").map(l=>[l.a,l.b]),Rd=s.filter(l=>l.kind==="ghost").map(l=>[l.a,l.b]);{let l=(d,h,p)=>{let u=p[0]-h[0],m=p[1]-h[1],x=Math.max(0,Math.min(1,((d[0]-h[0])*u+(d[1]-h[1])*m)/(u*u+m*m)));return Math.hypot(d[0]-h[0]-x*u,d[1]-h[1]-x*m)};for(let d of Lr)if(d.cls==="town"){let h=[d.p.x,-d.p.z];d.el.classList.toggle("under",s.some(p=>{if(p.kind!=="arr")return!1;let u=i===25?14e3:9e3,m=Math.hypot(p.a[0]-p.b[0],p.a[1]-p.b[1])||1,x=(p.a[0]-p.b[0])/m,g=(p.a[1]-p.b[1])/m,f=h[0]-p.b[0],M=h[1]-p.b[1],v=f*x+M*g,y=Math.abs(f*g-M*x);return v>0&&v<u&&y<1500}))}gc=Lr.filter(d=>d.cls==="town"&&d.el.classList.contains("under")).sort((d,h)=>d.p.x-h.p.x),gc.forEach((d,h)=>{d.el.querySelector("i").textContent=h+1,d.el.classList.add("num"),d.el.title=d.name});for(let d of Lr)d.cls==="town"&&!gc.includes(d)&&(d.el.querySelector("i").textContent="",d.el.classList.remove("num"));try{Ec()}catch{}}for(let l of Object.values(se)){let d=l.key==="r18"&&!t,h=l.key==="nw"||l.key==="south";if(!d){let p=er([{p:[l.A,l.B],w:ie==="light"?300:180}],2.5,r,(ie==="light"?.2:.1)*e);p.renderOrder=46,Rr.add(p);let u=er([{p:[l.A,l.B],w:Pe.card?30:ie==="light"?64:46}],3.5,r,Ao?.35:1);u.renderOrder=48,Rr.add(u)}}for(let l of s){let d=Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]),h=[(l.b[0]-l.a[0])/d,(l.b[1]-l.a[1])/d],p=[];if(l.kind!=="dep")for(let x=0;x<d;x+=560)p.push({p:[[l.a[0]+h[0]*x,l.a[1]+h[1]*x],[l.a[0]+h[0]*Math.min(d,x+320),l.a[1]+h[1]*Math.min(d,x+520)]],w:65});else p.push({p:[l.a,l.b],w:90});let u=ie==="light"?"#3a3a38":"#d8d7d2";if(l.kind==="arr"){for(let g=0;g<8;g++){let f=p.filter((v,y)=>Math.min(7,Math.floor(y/p.length*8/.2))===g);if(!f.length)continue;let M=er(f.map(v=>({...v,w:ie==="light"?48:90})),2,r,Math.min(1,(ie==="light"?.9:1)*e*Math.min(1,(g+.3)/7)*(ie==="light"?1:1.2)));M.renderOrder=46,Rr.add(M)}continue}let m=l.kind==="arr"?er(p.map(x=>({...x,w:48})),2,r,.9):l.kind==="ghost"?Object.assign(er(p.map(x=>({...x,w:it.clientWidth<640?150:80})),2,i===25?de.ghostE:de.ghostW,yd*e),{ghost:!0}):er(p.map(x=>({...x,w:40})),2,u,.9*e);m.renderOrder=46,Rr.add(m)}let o=0;for(let l of s.filter(d=>d.kind!=="ghost"))for(let d of[l.kind==="arr"?.95:1]){let h=Io[o++];if(!h)break;let p=[l.a[0]+(l.b[0]-l.a[0])*d,l.a[1]+(l.b[1]-l.a[1])*d];h.p.copy(qt(p[0],p[1],0)),h.dir=qt(p[0]+(l.b[0]-l.a[0])*.05,p[1]+(l.b[1]-l.a[1])*.05,0),h.off=!1,h.el.style.color=l.kind==="arr"?r:"var(--label)",h.el.style.opacity=Ao?"0.3":""}for(;o<Io.length;o++)Io[o].off=!0;let a=s.filter(l=>l.kind==="arr").map(l=>[{a:[l.a[0]+(l.b[0]-l.a[0])*.12,l.a[1]+(l.b[1]-l.a[1])*.12],key:l.key},"a",`${l.des} landings`,l.key==="nw"?1100:-1100]).concat(s.filter(l=>l.kind==="dep").map(l=>[l.r18?{b:[l.b[0]+2400,l.b[1]+600]}:l,"b",l.r18?"18 take-offs":`${i===25?"25C":"07C"} take-offs`,l.r18?1:1200])),c=s.find(l=>l.kind==="ghost");for(;fc.length<a.length;)fc.push(ki("",0,0,0,"ptag"));fc.forEach((l,d)=>{let h=a[d];if(!h){l.off=!0;return}let[p,u,m,x]=h;l.off=!1,l.el.textContent=m,l.p.copy(qt(p[u][0],p[u][1]+(x||700),0))})}var he=new U,We=new U,Ai=[];function ay(){let i=it.getBoundingClientRect();Ai=[...document.querySelectorAll(".hud .panel:not([hidden]),.hud .hero,.hud .attrib")].map(t=>{let e=t.getBoundingClientRect();return e.width?[e.left-i.left,e.top-i.top,e.right-i.left,e.bottom-i.top]:null}).filter(Boolean)}var Eo=[];function Cr(){Eo=[];let i=[];Cr.sp=null;{let n=it.clientWidth,r=it.clientHeight,s=[];for(let o of Lr)if(o.cls==="town"){he.copy(o.p).project(ne);let a=(he.x+1)/2*n,c=(1-he.y)/2*r;o.nd=null,o.tp=[a,c],o.el.classList.contains("num")&&!o.off&&(o.nd=[a,c],s.push(o.nd))}for(let o=0;o<4;o++)for(let a=0;a<s.length;a++)for(let c=a+1;c<s.length;c++){let l=s[a],d=s[c],h=d[0]-l[0],p=d[1]-l[1],u=Math.hypot(h,p)||1,m=(26-u)/2;m<=0||(l[0]-=h/u*m,l[1]-=p/u*m,d[0]+=h/u*m,d[1]+=p/u*m)}for(let o of Lr)if(o.cls==="town"){let[a,c]=o.nd||o.tp;Eo.push([a-10,c-10,a+10,c+10])}Cr.nd=s.map(([o,a])=>[o-11,a-11,o+11,a+11])}let t=it.clientWidth,e=it.clientHeight;for(let n of Lr){if(n.off){n.el.style.display="none";continue}if(he.copy(n.p).project(ne),he.z>1||Math.abs(he.x)>1.1||Math.abs(he.y)>1.1){n.el.style.display="none";continue}let r=(he.x+1)/2*t,s=(1-he.y)/2*e;if(n.cls!=="rwy"&&n.cls!=="windind"){let o=n.lw||(n.lw=n.el.offsetWidth||80),a=n.cls==="town"?0:o/2,c=n.cls==="town"&&n.el.classList.contains("num"),l=c?r-12:n.cls==="town"?r-8:r-a,d=c?r+12:n.cls==="town"?r+8+o:r+a;if(l<4||d>t-4||s<8||s>e-8||Ai.some(h=>d>h[0]-8&&l<h[2]+8&&s>h[1]-12&&s<h[3]+12)){n.el.style.display="none";continue}}if(n.cls==="town"&&n.el.classList.contains("num")){n.nd&&([r,s]=n.nd),n.el.style.display="",n.el.style.transform=`translate(${r}px, ${s}px)`;continue}if(n.cls==="town"){let o=n.tw||(n.tw=n.el.querySelector("span").offsetWidth||60),a=(v,y)=>v[0]<y[2]&&y[0]<v[2]&&v[1]<y[3]&&y[1]<v[3],c=[r-10,s-10,r+10,s+10],l=Eo.filter(v=>!(v[0]===c[0]&&v[1]===c[1])),d=Cr.sp||(Cr.sp=Fo.map(([v,y])=>{let E=T=>(We.copy(qt(T[0],T[1],0)).project(ne),[(We.x+1)/2*t,(1-We.y)/2*e]);return[E(v),E(y)]})),h=(v,y,E)=>{let T=Math.max(E[0],Math.min(E[2],(v[0]+y[0])/2)),A=1e9;for(let I=0;I<=1.0001;I+=.02){let b=v[0]+(y[0]-v[0])*I,w=v[1]+(y[1]-v[1])*I;A=Math.min(A,Math.hypot(Math.max(E[0]-b,0,b-E[2]),Math.max(E[1]-w,0,w-E[3])))}return A},p=v=>[v[0]-4,v[1]-4,v[2]+4,v[3]+4],u=v=>d.every(([y,E])=>h(y,E,v)>=3)&&!l.some(y=>a(v,p(y))),m=[],x=18;for(let v of[14,18,24])m.push([v,-x/2,[r+v-2,s-x/2,r+v+o+2,s+x/2]]);for(let v of[14,18]){let y=v*.75;for(let[E,T]of[[v,-x/2],[-v-o,-x/2],[-o/2,-v-x],[-o/2,v],[y,-y-x],[-y-o,-y-x],[y,y],[-y-o,y]])m.push([E,T,[r+E-2,s+T,r+E+o+2,s+T+x]])}let g=v=>v[0]>=4&&v[2]<=t-4&&!Ai.some(y=>v[2]>y[0]-4&&v[0]<y[2]+4&&v[3]>y[1]-4&&v[1]<y[3]+4)&&!i.some(y=>a(v,y)),f=m.find(([,,v])=>u(v)&&g(v))||m.find(([,,v])=>g(v)&&!l.some(y=>a(v,y)));if(!f){n.el.style.display="none";continue}let M=n.el.querySelector("span");M.style.left=`${f[0]}px`,M.style.top=`${f[1]}px`,Eo.push(f[2]),n.el.style.display="",n.el.style.transform=`translate(${r}px, ${s}px)`;continue}if(n.cls==="rwy"){let o=(n.w||(n.w=n.el.offsetWidth||72))/2+8;if(r=Math.max(o+8,Math.min(t-o-8,r)),Ai.some(d=>r>d[0]-30&&r<d[2]+30&&s>d[1]-12&&s<d[3]+12)){n.el.style.display="none";continue}if(!n.el.innerHTML){n.el.style.display="none";continue}let a=0,c=0;if(n.end){let d=L=>(We.copy(L).project(ne),[(We.x+1)/2*t,(1-We.y)/2*e]),h=Object.values(se).map(L=>{let O=d(qt(L.A[0],L.A[1],0)),W=d(qt(L.B[0],L.B[1],0));return[O,W,170*Math.hypot(W[0]-O[0],W[1]-O[1])/L.len]}),p=(n.w||40)/2-4,u=(L,O)=>L>p+20&&L<t-p-20&&O>12&&O<e-12&&!Ai.some(W=>L+p+8>W[0]&&L-p-8<W[2]&&O+15>W[1]&&O-(t<640?20:15)<W[3])&&!i.some(W=>L-p-10<W[2]&&W[0]<L+p+10&&O-15<W[3]&&W[1]<O+15)&&!_c.some(([W,z])=>Math.abs(W-L)<p+5&&Math.abs(z-O)<15)&&h.every(([W,z,Q])=>{let nt=z[0]-W[0],ht=z[1]-W[1],dt=Math.max(0,Math.min(1,((L-W[0])*nt+(O-W[1])*ht)/(nt*nt+ht*ht||1))),zt=W[0]+nt*dt,Vt=W[1]+ht*dt;return Math.max(Math.abs(zt-L)-p,Math.abs(Vt-O)-11,0)>=5+Q}),m=[],x=[d(n.end),d(n.other)],g=(L,O,W,z)=>{let Q=(nt,ht,dt)=>(ht[0]-nt[0])*(dt[1]-nt[1])-(ht[1]-nt[1])*(dt[0]-nt[0]);return Q(W,z,L)*Q(W,z,O)<0&&Q(L,O,W)*Q(L,O,z)<0},f=h.filter(([L])=>!(Math.abs(L[0]-x[0][0])<.5&&Math.abs(L[1]-x[0][1])<.5)&&!(Math.abs(L[0]-x[1][0])<.5&&Math.abs(L[1]-x[1][1])<.5));if(n.rw&&n.rw.key==="r18"){let L=d(n.end),O=d(n.other),W=Math.hypot(L[0]-O[0],L[1]-O[1])||1,z=(L[0]-O[0])/W,Q=(L[1]-O[1])/W;for(let nt of[.08,.18,.3])for(let ht of[1,-1])for(let dt of[18,24,30])m.push([L[0]-z*W*nt-Q*ht*dt,L[1]-Q*W*nt+z*ht*dt])}for(let[L,O]of[[d(n.end),d(n.other)],[d(n.other),d(n.end)]]){let W=Math.hypot(L[0]-O[0],L[1]-O[1])||1,z=(L[0]-O[0])/W,Q=(L[1]-O[1])/W;for(let nt=0;nt<=5;nt++){let ht=[L[0]+z*(p+14+nt*6),L[1]+Q*(p+14+nt*6)];f.some(([dt,zt])=>g(L,ht,dt,zt))||m.push(ht)}for(let nt of[.12,.25,.4])for(let ht of[1,-1])for(let dt of[24,30,38])m.push([L[0]-z*W*nt-Q*ht*dt,L[1]-Q*W*nt+z*ht*dt])}let M=d(n.end),v=d(n.other),y=Math.hypot(M[0]-v[0],M[1]-v[1])||1,E=(v[0]-M[0])/y,T=(v[1]-M[1])/y,A=Object.values(se).map(L=>d(qt((L.A[0]+L.B[0])/2,(L.A[1]+L.B[1])/2,0))).reduce((L,O,W,z)=>[L[0]+O[0]/z.length,L[1]+O[1]/z.length],[0,0]),I=[(M[0]+v[0])/2,(M[1]+v[1])/2],b=n.rw&&n.rw.key==="centre",w=-T*(I[0]-A[0])+E*(I[1]-A[1])>=0?1:-1,P=b?E>0?-1:1:w,k=-T*P,G=E*P,N=n.rw&&n.rw.key==="r18"?[M[0]+E*6-Math.abs(T)*30,M[1]+T*6]:[M[0]+E*24+k*18,M[1]+T*24+G*18];a=-E,c=-T;{let L=Object.values(se).indexOf(n.rw),O=rt=>{let ut=-1,R=1e9;return h.forEach(([Ft,St],It)=>{let mt=St[0]-Ft[0],Jt=St[1]-Ft[1],wt=Math.max(0,Math.min(1,((rt[0]-Ft[0])*mt+(rt[1]-Ft[1])*Jt)/(mt*mt+Jt*Jt||1))),Gt=Math.hypot(rt[0]-Ft[0]-mt*wt,rt[1]-Ft[1]-Jt*wt);Gt<R&&(R=Gt,ut=It)}),ut===L},W=(n.h||(n.h=n.el.offsetHeight||20))/2,z=(n.w||40)/2,Q=rt=>[rt[0]-z,rt[1]-W,rt[0]+z,rt[1]+W],nt=(rt,ut)=>Math.max(rt[0]-ut[2],ut[0]-rt[2],rt[1]-ut[3],ut[1]-rt[3]),ht=Io.filter(rt=>!rt.off).map(rt=>{We.copy(rt.p).project(ne);let ut=(We.x+1)/2*t,R=(1-We.y)/2*e;return[ut-11,R-14,ut+11,R+14]}),dt=(rt,ut,R)=>{let Ft=1e9;for(let St=0;St<=1.0001;St+=.025){let It=rt[0]+(ut[0]-rt[0])*St,mt=rt[1]+(ut[1]-rt[1])*St;Ft=Math.min(Ft,Math.hypot(Math.max(R[0]-It,0,It-R[2]),Math.max(R[1]-mt,0,mt-R[3])))}return Ft},zt=Rd.map(([rt,ut])=>[d(qt(rt[0],rt[1],0)),d(qt(ut[0],ut[1],0))]),Vt=t<640?4:8,yt=rt=>{let ut=Q(rt);return zt.every(([R,Ft])=>dt(R,Ft,ut)>=4)&&ut[0]>16&&ut[2]<t-16&&ut[1]>8&&ut[3]<e-8&&!Ai.some(R=>ut[2]+Vt>R[0]&&ut[0]-Vt<R[2]&&ut[3]+Vt>R[1]&&ut[1]-(t<640?12:Vt)<R[3])&&h.every(([R,Ft,St])=>dt(R,Ft,ut)>=St+6)&&ht.every(R=>nt(ut,R)>=6)&&(Cr.nd||[]).every(R=>nt(ut,R)>=4)&&i.every(R=>nt(ut,R)>=4)&&!_c.some(([R,Ft])=>R>ut[0]-4&&R<ut[2]+4&&Ft>ut[1]-4&&Ft<ut[3]+4)&&O(rt)},V=(rt,ut,R,Ft)=>{let St=Math.hypot(ut[0]-rt[0],ut[1]-rt[1])||1,It=(ut[0]-rt[0])/St,mt=(ut[1]-rt[1])/St,Jt=-mt*R,wt=It*R,Gt=Math.abs(Jt)*z+Math.abs(wt)*W,Ee=[];for(let Qt of Ft)for(let C of[0,4,8]){let _=(h[L]?h[L][2]:4)+Gt+6+C;Ee.push([rt[0]+It*St*Qt+Jt*_,rt[1]+mt*St*Qt+wt*_])}return Ee},q=(rt,ut)=>{let R=Math.hypot(ut[0]-rt[0],ut[1]-rt[1])||1,Ft=(rt[0]-ut[0])/R,St=(rt[1]-ut[1])/R,It=Math.abs(Ft)*z+Math.abs(St)*W,mt=[];for(let Jt of[8,14,20])mt.push([rt[0]+Ft*(It+Jt),rt[1]+St*(It+Jt)]);return mt},ot=Math.sign(k*-T+G*E)||1,ft=[.06,.15,.25,.35],xt=[...V(M,v,ot,ft),...q(M,v),...V(M,v,-ot,ft),...V(v,M,-ot,ft),...V(v,M,ot,ft),...q(v,M)].find(yt);if(xt)N=xt,a=0,c=0;else if(!u(N[0],N[1])||!O(N)){let rt=m.find(ut=>u(ut[0],ut[1])&&O(ut)&&ht.every(R=>nt(Q(ut),R)>=6))||m.find(ut=>u(ut[0],ut[1])&&O(ut))||m.find(ut=>O(ut));rt&&(N=rt,a=0,c=0)}}if(!N){n.el.style.display="none";continue}[r,s]=N}let l=[r-o+6,s-11,r+o-6,s+11];for(let d=0;d<4&&i.some(h=>l[0]<h[2]&&h[0]<l[2]&&l[1]<h[3]&&h[1]<l[3]);d++)r+=(a||0)*34,s+=(c||1)*34*(a?1:.65),l=[r-o+6,s-11,r+o-6,s+11];i.push(l)}n.el.style.display="",n.el.style.transform=`translate(${r}px, ${s}px) translate(-50%, -50%)`,n.dir&&(We.copy(n.dir).project(ne),n.el.style.setProperty("--a",`${Math.atan2(-(We.y-he.y)*e,(We.x-he.x)*t)*180/Math.PI}deg`))}ly(t,e)}var ci=document.createElement("div");ci.className="lbl rvl";ci.textContent="Main";Wo.appendChild(ci);function ly(i,t){if(di||Pe.card||i<640||!wd.length){ci.style.display="none";return}let e=ci.lw||(ci.lw=ci.offsetWidth||34),n=16,r=p=>(We.copy(qt(p[0],p[1],0)).project(ne),[(We.x+1)/2*i,(1-We.y)/2*t,We.z]),s=Cr.sp||Fo.map(([p,u])=>[r(p),r(u)]),o=Rd.map(([p,u])=>[r(p),r(u)]),a=(p,u,m)=>{let x=1e9;for(let g=0;g<=1.0001;g+=.02){let f=p[0]+(u[0]-p[0])*g,M=p[1]+(u[1]-p[1])*g;x=Math.min(x,Math.hypot(Math.max(m[0]-f,0,f-m[2]),Math.max(m[1]-M,0,M-m[3])))}return x},c=(p,u)=>p[0]<u[2]&&u[0]<p[2]&&p[1]<u[3]&&u[1]<p[3],l=[...document.querySelectorAll(".lbl.rwy b, .lbl.parrow svg")].filter(p=>p.offsetParent).map(p=>{let u=p.getBoundingClientRect(),m=it.getBoundingClientRect();return[u.left-m.left-4,u.top-m.top-4,u.right-m.left+4,u.bottom-m.top+4]}),d=null,h=[...document.querySelectorAll(".scrim")].filter(p=>p.offsetHeight).map(p=>{let u=p.getBoundingClientRect(),m=it.getBoundingClientRect();return[u.left-m.left,u.top-m.top,u.right-m.left,u.bottom-m.top]});for(let p of wd){if(p[2]<.7)continue;let[u,m,x]=r(p);if(!(x>1))for(let g of[-(n/2+5),n/2+5]){let f=[u-e/2,m+g-n/2,u+e/2,m+g+n/2];if(f[0]<8||f[2]>i-8||f[1]<8||h.some(v=>c(f,v))||f[3]>t-8||Ai.some(v=>c(f,[v[0]-8,v[1]-8,v[2]+8,v[3]+8]))||Eo.some(v=>c(f,[v[0]-6,v[1]-6,v[2]+6,v[3]+6]))||l.some(v=>c(f,v)))continue;let M=Math.min(...s.map(([v,y])=>a(v,y,f)),...o.map(([v,y])=>a(v,y,f)));(!d||M>d.c)&&(d={c:M,x:u,y:m+g})}}if(!d||d.c<6){ci.style.display="none";return}ci.style.display="",ci.style.transform=`translate(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px) translate(-50%, -50%)`}var Ze=null,zu=!1,cy=0,ge=!1,Ur=!Zu,Hu="",pi=new Map,hy={arr:"arriving",dep:"departing",ground:"on ground",low:"low level",enroute:"en route"},df=i=>i==="ground"?`<i style="background:transparent;box-shadow:inset 0 0 0 2px ${de.ground}"></i>`:i==="air"?`<i style="background:${de.air};border-radius:1px;transform:rotate(45deg) scale(.85)"></i>`:`<i style="background:${de[i]}"></i>`,ud=i=>i.phase==="arr"?"arr":i.phase==="dep"?"dep":i.phase==="ground"||i.on_ground?"ground":"air",Ss=class{constructor(t){this.id=t.id,this.dead=null,this.born=zo.elapsedTime,this.off=new U,this.obj=new Hn,this.mat=null,this.emat=null,this.key="",xe(this.obj,72),this.tag=document.createElement("div"),this.tag.className="lbl ac",Wo.appendChild(this.tag),this.fix(t,!0)}style(){let t=ud(this.f)+ie;if(t===this.key)return;this.key=t,this.obj.clear(),this.mat?.dispose(),this.emat?.dispose();let e=new Dt(de[ud(this.f)]),n=ie==="light";this.mat=n?new xr({color:e,side:Ie,transparent:!0}):new qe({color:e,side:Ie,transparent:!0,opacity:.55,blending:vc,depthWrite:!1}),this.emat=new wn({color:n?"#0b0b0b":e.clone().lerp(new Dt("#ffffff"),.35),transparent:!0,depthWrite:!1,opacity:n?.35:1,blending:n?ui:vc}),this.obj.add(new ve(kc,this.mat),new Wn(Ad,this.emat))}fix(t,e){let n=Math.min(60,Math.max(0,Date.now()/1e3-(Ze?.opensky_time||Date.now()/1e3))),r=(t.track||0)*Math.PI/180,s=t.on_ground?Math.min(t.spd||0,15):t.spd||0;this.vel=[s*Math.sin(r),s*Math.cos(r),t.on_ground?0:t.vrate||0];let o=[t.x+this.vel[0]*n,t.y+this.vel[1]*n,Math.max(0,(t.on_ground?0:t.z)+this.vel[2]*n)];!e&&this.pos&&this.off.set(this.pos[0]-o[0],this.pos[1]-o[1],this.pos[2]-o[2]),this.pos=o,this.f=t,this.dead=null,this.hd=Math.PI/2-r,this.pitch=t.on_ground?0:Math.atan2(t.vrate||0,Math.max(30,s)),this.style();let a=(t.alt_ft??99999)<3e3||(t.dist_km??99)<20;this.tagOn=a,this.tag.innerHTML=`${df(ud(t))}${t.cs||t.id}`,this.tagW=0}step(t,e){for(let c=0;c<3;c++)this.pos[c]+=this.vel[c]*t;this.pos[2]=Math.max(0,this.pos[2]),this.off.multiplyScalar(Math.exp(-t*2.5));let n=this.pos[0]+this.off.x,r=this.pos[1]+this.off.y,s=Math.max(0,this.pos[2]+this.off.z);this.cur={x:n,y:r,h:s,hd:this.hd,pitch:this.pitch,t:0},this.obj.position.copy(qt(n,r,s+2)),this.obj.rotation.set(0,this.hd,this.pitch,"YXZ"),this.obj.scale.setScalar((Pe.card?5:3)*(this.f.on_ground?.8:1));let o=Math.min(1,(e-this.born)/1.2);this.dead!==null&&(o*=Math.max(0,1-(e-this.dead)/1.5)),this.alpha=o;let a=ge;this.obj.visible=a&&o>.01,this.mat.opacity=(ie==="light"?1:.55)*o*(wc()?.3:1),this.emat.opacity=(ie==="light"?.35:1)*o}drawTag(t,e){if(!(ge&&this.alpha>.05&&(this.tagOn||this===jn||this===ir))){this.tag.style.display="none";return}if(he.copy(this.obj.position).project(ne),he.z>1||Math.abs(he.x)>1.05||Math.abs(he.y)>1.05){this.tag.style.display="none";return}let r=(he.x+1)/2*t,s=(1-he.y)/2*e-14;return this.tag.style.display="",this.tag.style.opacity=this.alpha*(wc()?.5:1),this.tag.style.transform=`translate(${r}px, ${s}px) translate(-50%, -100%)`,this.tagW||(this.tagW=this.tag.offsetWidth||60),{p:this,r:[r-this.tagW/2-2,s-20,r+this.tagW/2+2,s+1],pri:this===jn||this===ir?0:1}}dispose(){Fn.remove(this.obj),this.mat?.dispose(),this.emat?.dispose(),this.tag.remove()}};function dy(i){if(Ze=i,i.generated===Hu)return;Hu=i.generated;let t=zo.elapsedTime,e=new Set;for(let n of i.flights||[]){if(!Number.isFinite(n.x)||!Number.isFinite(n.y))continue;e.add(n.id);let r=pi.get(n.id);r?r.fix(n):pi.set(n.id,new Ss(n))}for(let[n,r]of pi)!e.has(n)&&r.dead===null&&(r.dead=t);Ur&&!ge&&Mc(!0),qo()}async function Vu(){try{let i=await fetch("live.json",{cache:"no-store"});if(!i.ok)throw new Error(i.status);let t=await i.json();zu=!0,cy=Date.now(),dy(t)}catch{zu=!1,qo()}}location.protocol.startsWith("http")&&(Vu(),setInterval(Vu,5e3));function No(){return Ze?(Date.now()-Date.parse(Ze.generated))/1e3:1/0}var py=900,uy=6*3600,wc=()=>No()>py,Ir=()=>!!Ze&&No()>uy,pf=i=>i>=172800?`${Math.round(i/86400)} days old`:i>=5400?`${Math.round(i/3600)} h old`:`${Math.round(i/60)} min old`;function Mc(i){Ur=i,ge=i&&!!Ze&&!Ir(),ge&&!Zu?(tt.ovOd="",tt.ovR18="",ti(),Kn(!1),an(on(),!0),Dn(on(),"jump")):tt.run&&an(tt.hour,!0),qo()}function Po(){!Ur&&!ge||(Ur=!1,ge=!1,tt.ovOd="",tt.ovR18="",ti())}var ir=null,jn=null,mc=null;function uf(i,t){let e=Un.domElement.getBoundingClientRect(),n=e.width,r=e.height,s=null,o=26,a=ge?[...pi.values()].filter(c=>c.dead===null&&c.obj.visible):Ti.filter(c=>c.dead===null&&c.cur&&c.obj.visible!==!1);for(let c of a){if(he.copy(c.obj.position).project(ne),he.z>1)continue;let l=Math.hypot((he.x+1)/2*n-(i-e.left),(1-he.y)/2*r-(t-e.top));l<o&&(o=l,s=c)}return s}function fy(i){return i?i instanceof Ss?`<b>${i.f.cs||i.f.id}</b>${i.f.label?`<span>${i.f.label.replace(/^[^·]*·\s*/,"")}</span>`:`<span>${hy[i.f.phase]||""}</span>`}<small>Live ADS-B position \xB7 OpenSky</small>`:`<b>${i.label}</b><span>Expected traffic for ${As.format(new Date(tt.run.hours[tt.hour].t))} under the forecast direction</span><small>Not a real aircraft</small>`:""}Un.domElement.addEventListener("pointermove",i=>{if(i.buttons)return;let t=uf(i.clientX,i.clientY);t!==ir&&(ir=t,Un.domElement.style.cursor=t?"pointer":"")});Un.domElement.addEventListener("pointerleave",()=>{ir=null});Un.domElement.addEventListener("pointerdown",i=>{mc=[i.clientX,i.clientY]});Un.domElement.addEventListener("pointerup",i=>{if(!mc||Math.hypot(i.clientX-mc[0],i.clientY-mc[1])>5)return;let t=uf(i.clientX,i.clientY);t?(jn=t,ai=t,or("follow")):jn&&(jn=null)});var Bo=matchMedia("(prefers-reduced-motion: reduce)"),Pr=new Set;function Oo(i,t,e){return i.onUpdate=t,i.onRest=e,Bo.matches&&i.jump(i.target),Pr.add(i),i}function my(i){for(let t of Pr)t.step(i),t.onUpdate?.(t.x),t.resting&&(Pr.delete(t),t.onRest?.())}var Ri={play:'<svg viewBox="0 0 24 24"><path d="M7 4.6v14.8a1 1 0 0 0 1.52.85l12.1-7.4a1 1 0 0 0 0-1.7L8.52 3.75A1 1 0 0 0 7 4.6z"/></svg>',pause:'<svg viewBox="0 0 24 24"><rect x="5.5" y="4" width="4.6" height="16" rx="1.4"/><rect x="13.9" y="4" width="4.6" height="16" rx="1.4"/></svg>',plane:'<svg viewBox="0 0 24 24"><path d="M21.5 15.6v-1.9l-8.3-5.2V3.6a1.45 1.45 0 0 0-2.9 0v4.9L2 13.7v1.9l8.3-2.6v5.1l-2.1 1.6v1.5l3.6-1 3.6 1v-1.5l-2.1-1.6V13z"/></svg>',orbit:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M19.6 13.4A7.8 7.8 0 1 1 17.5 6.5"/><path d="M18.4 2.8v4.4H14"/></svg>',info:'<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 1.8a7.7 7.7 0 1 0 0 15.4 7.7 7.7 0 0 0 0-15.4zM12 10.3c.55 0 .95.4.95.95v5.4a.95.95 0 0 1-1.9 0v-5.4c0-.55.4-.95.95-.95zm0-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',warn:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',home:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="7.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M12 8.5l2 3.5h-4z" style="fill:currentColor;stroke:none"/></svg>',needle:'<svg viewBox="0 0 24 24"><g class="needle"><path d="M12 2.6l3.3 9.4H8.7z" fill="#FF453A"/><path d="M12 21.4L8.7 12h6.6z" opacity=".5"/></g></svg>',sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M17.1 6.9l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',moon:'<svg viewBox="0 0 24 24"><path d="M20.4 14.7A8.7 8.7 0 0 1 9.3 3.6a8.7 8.7 0 1 0 11.1 11.1z"/></svg>',expand:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></svg>',collapse:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M20 10h-6V4M4 14h6v6M14 10l6.5-6.5M10 14l-6.5 6.5"/></svg>',chevrons:'<svg viewBox="0 0 12 12"><path d="M3 4.6 6 1.9l3 2.7M3 7.4l3 2.7 3-2.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'},Xt=window.FRA_COPY||{},fd=(window.FRA_STYLE||{}).hatch||{css:"repeating-linear-gradient(135deg,{c} 0 1.5px,transparent 1.5px 4.5px)",light:"rgba(255,255,255,.4)",dark:"rgba(255,255,255,.5)"},Sc=i=>`<svg class="tarr" viewBox="0 0 34 24" aria-hidden="true"><path d="${((window.FRA_STYLE||{}).arrow||{e:"M3 12h27M22 4l8 8-8 8",w:"M31 12H4M12 4l-8 8 8 8"})[i]}"/></svg>`,Gu=i=>fd.css.replace("{c}",i==="light"?fd.light:fd.dark),$o=document.createElement("div");$o.className="hud";$o.innerHTML=`
  <div class="scrim top"></div><div class="scrim bottom"></div>
  <header class="panel pbar"><a class="pbrand" href="index.html">${(window.FRA_STYLE||{}).logo||""}Runway Direction Forecast<span>Frankfurt Airport</span></a>
    <nav class="ptabs" aria-label="Pages"><a href="index.html">Dashboard</a><a aria-current="page">3D view</a></nav>
    <div class="prun"><i id="livedot"></i><span class="frs"></span><b id="issued-t" hidden></b></div>
    <button class="pthm" id="b-thm" title="Light / dark theme" aria-label="Light / dark theme"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button>
    <div class="ptz" role="group" aria-label="Time zone"><button data-v="Europe/Berlin" aria-pressed="true" id="tzl3">Local</button><button data-v="UTC" aria-pressed="false">UTC</button></div></header>
  <div class="rail">
  <header class="hero">
    <a class="dash" href="index.html">\u2190 Dashboard</a>
    <div class="eyebrow" id="eyebrow">${Xt.now}</div>
    <div class="dir" id="dir" aria-live="polite"></div>
    <div class="outl" id="outl"></div><div class="disl" id="disl" hidden></div><div class="ground" id="ground"></div>
    <div class="dir-sub" id="dir-sub"></div>
    <div class="sumbar" id="sumbar"></div>
    <button class="more" id="b-more" aria-expanded="false">Wind, Runway 18 and details</button>
    <div class="hsec"><div class="risknext" id="dir-next"></div></div>
    <div class="hsec conditions" aria-label="Conditions">
    <div class="row wind">
      <div class="row-main"><div class="row-title" id="wind-t">${Xt.wind}</div><div class="row-value"><span class="wcomp" id="wcomp" title="The arrow points the way the wind blows (north up)"><i></i></span><span id="wind-v"></span></div></div>
      <div class="row-sub" id="wind-why"></div>
      <div class="row-sub" id="wind-s"></div>
    </div>
    <div class="row">
      <div class="row-main"><div class="row-title">Runway 18</div><div class="row-value" id="r18-v"></div></div>
      <div class="row-sub" id="r18-s"></div>
    </div>
    <div class="row pdetrow"><details class="pdet"><summary>Details</summary><div class="acc" id="acc"></div><div class="probl">The direction switches at short notice when the wind turns, so airlines and ground crews can't plan for it.</div><div class="probl" id="pdetx"></div><div class="probl" id="pdetw"></div></details></div>
    <div class="row mapkey" id="mapkey" aria-label="Map key"></div>
    <div class="row how"><details><summary>How this works</summary>Our forecast blends two models trained on the directions actually flown at Frankfurt over the last 120 days; one of them runs 200 wind scenarios around the ECMWF and ICON forecasts. Calibrated out of sample and tested hour by hour on Jun to Oct 2026. The official forecast (INAA) is the operating-direction forecast published by the Umwelthaus. 07 and 25 are the runway headings (070\xB0 east, 250\xB0 west); Runway 18 West is used for take-offs to the south only. The live record since 1 Nov is only a few days long, too short to judge yet.<span class="howpg" id="how-pg"></span></details></div>
    </div>
    <div class="seg" id="seg-mode" role="radiogroup" aria-label="Show"><i class="thumb"></i>
      <button role="radio" data-v="live" title="Real aircraft right now (ADS-B)">Live</button><button role="radio" data-v="fc" title="Simulated traffic for the hour picked on the timeline">Forecast</button></div>
  </header>
  </div>
  <div class="attrib">${((window.FRA_STYLE||{}).footer_lines||[(window.FRA_STYLE||{}).footer||"Official forecast = INAA (Umwelthaus). Map data \xA9 OpenStreetMap contributors. Wind: ECMWF IFS, DWD ICON."]).map(i=>`<span class="al">${i}</span>`).join(" ")}</div>
  <nav class="panel stack" aria-label="View">
    <div class="ib windchip" id="windchip" title="Forecast wind at the shown hour; the arrow points the way it blows"></div>
    <button class="ib" id="b-home">${Ri.orbit}<span>Reset view</span></button>
    <button class="ib" id="b-follow" aria-pressed="false" hidden>${Ri.plane}<span>Follow a landing aircraft</span></button>
    <button class="ib" id="b-fs">${Ri.expand}<span>Full screen</span></button>
  </nav>
  <div class="hint3" id="hint3" aria-hidden="true">Drag to rotate \xB7 scroll to zoom</div>
  <div class="panel caption" id="caption" aria-live="polite"></div>
  <div class="panel actip" id="actip" hidden></div>
  <div class="acring" id="acring" hidden></div>
  <div class="panel aclegend" id="aclegend"></div>
  <div class="panel rose" id="rose" aria-hidden="true"><b data-d="N">N</b><b data-d="E">E</b><b data-d="S">S</b><b data-d="W">W</b><i id="rose-n"></i></div>
  <footer class="panel dock">
    <div class="dhd"><div class="dhl"><b class="dtitle">Next 48 hours</b><div class="readout" aria-live="polite"><span class="ro" id="dro"></span><button class="rback" id="dback" style="visibility:hidden">Back to now</button></div><span class="dpk" id="dpk" title="Highest hourly chance outside the night ban (23:00 to 05:00, no flights)"></span></div>
      <label class="menu dmenu" title="Pick an older forecast to compare"><span>Replay an earlier run</span><select id="run" aria-label="Forecast run"></select><i class="chev" aria-hidden="true"></i></label></div>
    <button class="play" id="play" aria-label="Pause">${Ri.pause}</button>
    <div class="rowlbl" aria-hidden="true"><span id="dir-l">Direction</span><span id="risk-l" hidden></span><span id="r18-l">Runway 18</span><span id="wind-l" hidden>${Xt.headwind}</span></div>
    <div class="scrub">
      <div class="ticks" id="ticks"></div>
      <div class="track" id="track" role="slider" tabindex="0" aria-label="Forecast hour" aria-valuemin="1" aria-valuemax="48">
        <div class="nights" id="nights"></div><div class="mids" id="mids"></div><div class="segs" id="segs"></div><svg class="risk" id="risk" preserveAspectRatio="none" aria-hidden="true" hidden></svg><svg class="windrow" id="windrow" aria-hidden="true"></svg><span class="rgl0" aria-hidden="true">0</span><i class="pgwash3" id="pgwash"></i><span class="rgl" id="rgl">10\u202F%</span><span class="rgl2" id="rgl2" aria-hidden="true" hidden></span><span class="rpk" id="rpk"></span><span class="pgl" id="pgl" hidden title="Official forecast (INAA): possible switch">Official</span><div class="pgmark" id="pgmark" hidden title="Official INAA forecast: possible switch"></div><div class="marks" id="marks"></div>
        <div class="nowline" id="nowline"></div><div class="selcol" id="selcol"></div>
        <div class="thumb-knob" id="knob"></div>
        <div class="bubble" id="bubble"><b id="bub-t"></b></div>
      </div>
    </div>
    <button class="keyb" id="b-key" aria-expanded="false" aria-label="Show the legend">i</button>
    <div class="dkey" id="dkey" aria-hidden="true"></div>
  </footer>
`;it.appendChild($o);var D=i=>document.getElementById(i);{let i=((window.FRA_QUALITY||{}).od25||[]).filter(h=>h.acc!==null&&h.acc!==void 0),t=i.find(h=>h.lead===24),e=i.length&&i.every(h=>h.prog!==null&&h.prog!==void 0&&h.acc>h.prog),n=(window.FRA_QUALITY||{}).test_info,r=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],s=n&&new Date(n.start),o=n&&new Date(s.getTime()+n.days*864e5),a=n?`backtest ${r[s.getUTCMonth()]}\u2013\u2060${r[o.getUTCMonth()]}\xA0${o.getUTCFullYear()}`:"",c=h=>Math.round(h*100),l=h=>{let p=Math.min(...h),u=Math.max(...h);return p===u?`${p}`:`${p}\u2013${u}`},d=i.length&&i.every(h=>h.prog!==null&&h.prog!==void 0);D("acc").innerHTML=i.length?`<div class="pstat"><div class="kv"><span>Hours correct</span><b>${l(i.map(h=>c(h.acc)))}\u202F%${d?` <small>\xB7 official <em>${l(i.map(h=>c(h.prog)))}\u202F%</em></small>`:""}</b></div></div>`:"",D("pdetx")&&i.length&&d&&(D("pdetx").innerHTML=`${l(i.map(h=>Math.round((1-(1-h.acc)/(1-h.prog))*100)))}\u202F% fewer wrong hours than the official forecast, ${Math.min(...i.map(h=>h.lead))}\u2013${Math.max(...i.map(h=>h.lead))}\u202Fh ahead.`),D("acc").title=i.map(h=>`${h.lead} h ahead: ${Math.round(h.acc*100)}% right (official ${Math.round(h.prog*100)}%)`).join(`
`)}D("b-key").onclick=()=>{let i=!it.classList.contains("keyon");it.classList.toggle("keyon",i),D("b-key").setAttribute("aria-expanded",i),requestAnimationFrame(Fr)};D("b-more").onclick=()=>{let i=!it.classList.contains("sheet");it.classList.toggle("sheet",i),D("b-more").setAttribute("aria-expanded",i)};var As,Pi,Es,Ci;function ff(){As=new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),Pi=new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),Es=new Intl.DateTimeFormat("en-GB",{timeZone:ke,hour:"2-digit",hourCycle:"h23"}),Ci=new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",day:"numeric",month:"short"})}ff();var sn=i=>i>=.995?">99\u202F%":i<.005?"<1\u202F%":`${Math.round(i*100)}\u202F%`,tt={run:null,hour:0,playing:!1,orbit:!1,follow:!1,cur:null,ovOd:"",ovR18:""};for(let i of ys.runs)D("run").insertAdjacentHTML("beforeend",`<option value="${i.source}">${As.format(new Date(i.issue))}</option>`);function gy(i,t){let e=i.querySelector(".thumb"),n=[...i.querySelectorAll("button")],r=new Zn(0,{damping:1,response:.3}),s=new Zn(0,{damping:1,response:.3}),o=()=>{e.style.transform=`translateX(${r.x}px)`,e.style.width=`${s.x}px`},a=!0,c=l=>{let d=n.find(h=>h.dataset.v===l)||n[0];if(n.forEach(h=>h.setAttribute("aria-checked",h===d)),a||!i.offsetWidth){r.jump(d.offsetLeft),s.jump(d.offsetWidth),o(),a=!i.offsetWidth;return}Oo(r.to(d.offsetLeft),o),Oo(s.to(d.offsetWidth),o)};return n.forEach(l=>l.addEventListener("click",()=>{c(l.dataset.v),t(l.dataset.v)})),c}var xy=gy(D("seg-mode"),i=>{i==="live"?Mc(!0):(Po(),an(tt.hour,!0)),ti()});function ti(){let i=D("seg-mode").querySelector("[data-v=live]");i.disabled=!Ze||Ir(),D("seg-mode").hidden=!Ze||Ir(),D("b-follow").hidden=!ge;let t=Ze?Ir()?"Live (offline)":wc()?`Live (${pf(No())})`:"Live":"Live (no feed)";ge&&Ir()&&(ge=!1,an(tt.hour,!0)),i.textContent!==t&&(i.textContent=t),xy(ge?"live":"fc")}var Wu=null,To="";function by(i,t,e){if(i===To)return;let n=D("dir"),r=document.createElement("span"),s=Wu,o=26*e,a=/^(\d\d) (.*)$/.exec(i);if(a?(r.innerHTML='<b class="dbadge"></b>',r.firstChild.textContent=a[1],r.firstChild.style.setProperty("--dc",a[1]==="25"?de.west:de.east),r.firstChild.dataset.d=a[1],r.append(` ${a[2]}`),/^Frankfurt flies (East|West)$/.test(a[2])&&r.insertAdjacentHTML("beforeend",Sc(a[2].endsWith("West")?"w":"e").replace('class="tarr"','class="tarr harr"'))):r.textContent=i,n.appendChild(r),Wu=r,!To){To=i;return}To=i,Oo(new Zn(0,{damping:1,response:.42}).to(1),c=>{r.style.opacity=c,r.style.transform=`translateX(${(c-1)*o}px)`}),s&&Oo(new Zn(0,{damping:1,response:.32}).to(1),c=>{s.style.opacity=1-c,s.style.transform=`translateX(${c*o}px)`},()=>s.remove())}var Oe=new Zn(0,{damping:1,response:.4}),Ii=!1,je=()=>tt.run.hours.length;function mf(i){return(i+.5)*(D("track").clientWidth/je())}function rr(){let i=mf(Oe.x);D("knob").style.transform=`translateX(${i}px)`,D("knob").style.visibility=ge||!Ii&&Math.round(Oe.x)===on()?"hidden":"";{let a=Math.max(0,Math.min(je()-1,Math.round(Oe.x)));Object.assign(D("selcol").style,{left:`${a/je()*100}%`,width:`${100/je()}%`})}let t=Math.max(0,Math.min(je()-1,Math.round(Oe.x)));xf(t);let e=D("bubble"),n=e.offsetWidth,r=D("track").clientWidth;e.style.visibility=ge||!(Ii||tt.hour!==on())?"hidden":"";{let a=!ko&&!Ii&&tt.hour!==on()&&!ge;e.classList.toggle("pin",a),D("knob").classList.toggle("pin",a)}{let a=e.style.visibility==="hidden"?-1:tt.hour;(D("risk")?D("risk").querySelectorAll("rect"):[]).forEach((l,d)=>l.classList.toggle("hov",d===a))}let s=0,o=Math.max(0,r-n);e.style.transform=`translateX(${Math.max(s,Math.min(o,i-n/2))}px)`;{let a=e.getBoundingClientRect(),c=e.style.visibility!=="hidden";D("ticks").querySelectorAll("span.day,span.hr,span.nowtick").forEach(M=>{M.style.translate="";let v=M.getBoundingClientRect(),y=D("knob")?D("knob").getBoundingClientRect().left+D("knob").getBoundingClientRect().width/2:-1e9,E=c&&(v.right>a.left-6&&v.left<a.right+6&&v.bottom>a.top-2&&v.top<a.bottom+2||M.classList.contains("hr")&&v.left-2<y&&v.right+2>y);if(E&&M.classList.contains("day")){let T=a.right+8-v.left,A=D("ticks").getBoundingClientRect();if(T>0&&T<=60*(parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1)&&v.right+T<=A.right){M.style.translate=`${T}px 0`,M.classList.remove("near");return}}M.classList.toggle("near",E)});let l=D("rpk"),d=l.getBoundingClientRect(),h=D("track").getBoundingClientRect().left+i;l.classList.toggle("off",c),D("rpkl")&&(D("rpkl").style.opacity=c?"0":""),D("rpkh")&&(D("rpkh").style.opacity=c?"0":"");let p=D("pgl"),u=p.getBoundingClientRect(),m=D("track").querySelector(".swchip")?.getBoundingClientRect(),x=(M=>M.left+M.width/2)(D("knob").getBoundingClientRect()),g=D("track").querySelector(".r18tag")?.getBoundingClientRect(),f=!p.hidden&&x>u.left-3&&x<u.right+3||m&&x>m.left-3&&x<m.right+3||g&&g.width&&x>g.left-3&&x<g.right+3;D("knob").style.setProperty("top",f?"var(--dt)":"0px","important")}{let a=D("knob"),c=a.getBoundingClientRect(),l=c.left+c.width/2,d=it.clientWidth<640?1:parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1,p=[...document.querySelectorAll(".segs .dlab"),...it.clientWidth<640?document.querySelectorAll(".dock .rowlbl > span"):[]].filter(u=>!u.hidden).map(u=>u.getBoundingClientRect()).filter(u=>u.width&&l>u.left-3&&l<u.right+3).map(u=>[(u.top-c.top)/d-2,(u.bottom-c.top)/d+2]).sort((u,m)=>u[0]-m[0]);a.style.setProperty("--mk",p.length?`linear-gradient(${p.map(([u,m])=>`#000 ${u.toFixed(1)}px,transparent ${u.toFixed(1)}px,transparent ${m.toFixed(1)}px,#000 ${m.toFixed(1)}px`).join(",")})`:"none")}Ii&&t!==tt.hour&&an(t)}var gf=(i,t)=>`Highest: ${sn(i)} at ${new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(t))}`,De=[],Xo=!1,hi="West",ko=!1,gc=[],Ao=!1;function Ec(){let i=document.getElementById("mapkey");if(!i)return;!i.classList.contains("mapov")&&!i.classList.contains("inrail")&&(i.classList.add("mapov","panel"),$o.appendChild(i));let t=typeof tt<"u"&&tt.cur?tt.cur.od:7,e=t===25?"east":"west";i.innerHTML=`<span><i class="plk" style="border-top-color:var(--${t===25?"westLine":"eastLine"})!important"></i>${Xt.landings}</span><span><i class="tok"></i>${Xt.takeoffs}</span>${Xo?`<span><i class="plk gh" data-tok="ghost${e==="west"?"W":"E"}" data-op="${yd}" style="border-top-color:var(--ghost${e==="west"?"W":"E"})!important;opacity:${yd}"></i>${e==="west"?"West":"East"} (if switched)</span>`:""}<span class="kbr"></span>`+gc.map((n,r)=>`<span class="tkey"><b>${r+1}</b>${n.name}</span>`).join("");{let n=Ec.cx||(Ec.cx=document.createElement("canvas").getContext("2d")),r=getComputedStyle(i);n.font=`${r.fontWeight} ${r.fontSize} ${r.fontFamily}`;let s=Math.max(...["West","East"].map(a=>n.measureText(`${a} (if switched)`).width)),o=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;i.style.setProperty("--kc3",`${Math.ceil(s+1.375*o+1)}px`)}}var on=()=>tt.run?Math.max(0,Math.min(je()-1,Math.floor((Date.now()-Date.parse(tt.run.hours[0].t))/36e5))):0,rn=()=>ge||tt.hour===on(),$u=()=>{let i=window.FRA_SINCE?Math.max(0,Math.round((Date.now()-Date.parse(window.FRA_SINCE))/36e5)):null;return i===null?"":` \xB7 ${i>=48?`${Math.round(i/24)} days`:`${i}\u202Fh`}`},vy=i=>i===25?"25 West":"07 East";function yy(){let i=D("pgmark");if(!tt.run)return;let t=D("pgkey");if(t&&(t.style.display=De.length?"":"none"),!De.length){i.hidden=!0;return}let e=je();i.hidden=!1,Object.assign(i.style,{left:`${De[0]/e*100}%`,width:`${(De[De.length-1]-De[0]+1)/e*100}%`})}function xf(i){let t=tt.run.hours[i],e=t.p25>=.5,n=ge||i===on(),r=new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short"}).format(new Date(t.t));D("bub-t").innerHTML=`<svg class="pinG" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z" fill="currentColor"/></svg>${r} ${Se(new Date(t.t))}`;let s=t.ws===void 0?null:Math.round(t.ws*Math.cos((t.wd-(t.od===25?249:69))*Math.PI/180)),o=tt.run.hours,a=!ge&&le(t),c=a?o.findIndex((l,d)=>d>i&&!le(l)):-1;if(a){let l=innerWidth<480,d=c>=0?Xt.night_next.replace("{od}",o[c].od===25?"25":"07").replace("{t}",Se(new Date(o[c].t))).replace(/^N/,"n"):"night ban";D("dro").innerHTML=`<b>${l?`${new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short"}).format(new Date(t.t))} ${Se(new Date(t.t))}`:Pi.format(new Date(t.t))}</b> \xB7 ${d}`}else D("dro").innerHTML=`<b>${n?_y(t.t):Pi.format(new Date(t.t))}</b> \xB7 ${n?`${sn(e?t.p25:1-t.p25)} ${e?"West":"East"}`:`${sn(Ac(t))} chance of ${hi}`}${s===null?"":` \xB7 ${s>=0?"headwind":"tailwind"} ${Math.abs(s)}\u202Fkt`}`;D("dback").style.visibility=n||ko?"hidden":"visible"}function Dn(i,t){if(t==="jump"){Oe.jump(i),rr();return}Oo(Oe.to(i,t),rr)}function Tc(){if(!tt.run)return;let i=tt.run.hours,t=Date.parse(i[0].t),e=(Date.now()-t)/(i.length*36e5),n=e>-.03&&e<1,r=Math.max(0,e)*100;D("nowline").style.display=n?"":"none",D("nowline").style.left=`${r}%`;let s=D("ticks").clientWidth||1,o=D("nowtick"),a=[];o&&(o.style.display=n?"":"none",o.style.left=`${r}%`);{let h=D("tick-start");h&&o&&n&&(h.style.left=`${r*s/100}px`)}let c=D("pgl");if(c)if(c.hidden=!De.length,De.length){let h=(1-De[0]/i.length)*(D("track").clientWidth||999)<120;c.style.right=h?"0":"auto",c.style.left=h?"auto":`${(De[0]/i.length*100).toFixed(2)}%`;let p=x=>+Es.format(new Date(x)),u=x=>new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short"}).format(new Date(x));{let x=i[De[0]].t,g=new Date(Date.parse(i[De[De.length-1]].t)+36e5),f=P=>String(p(P)).padStart(2,"0"),M=`Official: switch ${u(x)} ${f(x)}:00\u2013${u(g)} ${f(g)}:00`,v=Tc.cx||(Tc.cx=document.createElement("canvas").getContext("2d"));v.font='500 11px "IBM Plex Sans", system-ui, sans-serif';let y=D("track").clientWidth||999,E=(1-De[0]/i.length)*y,T=(((window.FRA_STYLE||{}).pgtag||{}).long||"Official: {da} {ha}h \u2192 {db} {hb}h").replace("{da}",u(x)).replace("{ha}",f(x)).replace("{db}",u(g)).replace("{hb}",f(g)),A=innerWidth<480,I=P=>v.measureText(P).width+12,b=[T].find(P=>I(P)<=E),w=b||(A?T:"Official");c.dataset.l=T,c.dataset.m=(((window.FRA_STYLE||{}).pgtag||{}).mid||"Official").replace("{db}",u(g)).replace("{hb}",f(g)),requestAnimationFrame(Td),c.textContent=w,c.classList.toggle("ra",!b),c.style.right=b?"auto":"0",c.style.left=b?`${(De[0]/i.length*100).toFixed(2)}%`:"auto",c.style.setProperty("--tk",`${Math.max(0,Math.round(I(w)-E))}px`),c.title=`Official forecast (INAA): possible switch ${u(x)} ${f(x)}:00 to ${u(g)} ${f(g)}:00`}Td();let m=D("pgwash");m&&Object.assign(m.style,{display:"",left:`${(De[0]/i.length*100).toFixed(2)}%`,width:`${((De[De.length-1]-De[0]+1)/i.length*100).toFixed(2)}%`})}else{let h=D("pgwash");h&&(h.style.display="none")}for(let h of D("ticks").querySelectorAll("span.hr")){let p=+h.dataset.x*s/100,u=h.offsetWidth/2,m=h.previousElementSibling&&h.previousElementSibling.classList.contains("tk")?h.previousElementSibling:null;m&&(m.style.visibility=""),h.style.visibility=h.offsetWidth&&(a.some(([x,g])=>p+u>x&&p-u<g)||n&&p+u+6>r*s/100-(o?o.offsetWidth:30)&&p-u-6<r*s/100)?"hidden":"",m&&(m.style.visibility=h.style.visibility)}{let h=D("ticks").getBoundingClientRect();D("ticks").querySelectorAll("span.day").forEach(u=>{u.classList.remove("dend"),u.getBoundingClientRect().right>h.right+1&&u.classList.add("dend")});let p=D("pgl")&&!D("pgl").hidden?D("pgl").getBoundingClientRect():null;p&&D("ticks").querySelectorAll("span.hr").forEach(u=>{let m=u.getBoundingClientRect();m.right>p.left-4&&m.left<p.right+4&&m.bottom>p.top-2&&(u.style.visibility="hidden")})}let l=D("ticks").querySelector("span.day"),d=D("tick-start");d&&(d.style.visibility=l&&parseFloat(l.style.left)/100*s<90?"hidden":"")}var Se=i=>new Intl.DateTimeFormat("en-GB",{timeZone:ke,hour:"2-digit",minute:"2-digit"}).format(i),_y=i=>{let t=Date.parse(i);return`${Se(new Date(t))}\u2013${Se(new Date(t+36e5))}`};function qo(){let i=document.getElementById("aclegend");if(!i)return;ti(),Tc();let t=e=>df(e);if(ge){let e=[...pi.values()].filter(s=>s.dead===null).length,n=No()>60,r=Se(new Date(Ze.generated));D("dir-sub").innerHTML=wc()?`<span class="late">${Ri.warn}Aircraft positions are from ${r}, ${pf(No())}, shown faded</span>`:`<span class="${n?"dot-stale":"dot-live"}"></span>Live \xB7 ${e} aircraft \xB7 updated ${r}`,i.innerHTML=`<span>${t("arr")}Arriving</span><span>${t("dep")}Departing</span><span>${t("ground")}On the ground</span><span>${t("air")}En route</span>`}else{let e=tt.cur?.od??7,n=e===25?"var(--west)":"var(--east)",r=e===25?"var(--east)":"var(--west)";i.innerHTML=`<span><i class="pl" style="--c:${n}"></i>${e===25?"25":"07"} landings</span><span><i class="pl solid"></i>Take-offs</span><span><i class="ring"></i>Under a landing path now</span>`+(Xo?`<span><i class="pl" style="--c:${r};opacity:.6"></i>Landings after a switch to ${e===25?"07":"25"}</span>`:"")}}function Kn(i){tt.playing=i,D("play").innerHTML=i?`${Ri.pause}<span>Pause</span>`:`${Ri.play}<span>Play 48\u202Fh</span>`,D("play").title="Step through the forecast hour by hour",bc=0}D("play").onclick=()=>{Po(),Kn(!tt.playing)};{let i=D("track"),t=null,e=(o,a)=>{let c=i.getBoundingClientRect(),l=c.width/je(),d=(o.clientX-c.left-a.offset)/l-.5,h=0,p=je()-1;return d<h&&(d=h-ld((h-d)*l,c.width)/l),d>p&&(d=p+ld((d-p)*l,c.width)/l),d};i.addEventListener("pointerdown",o=>{Po(),i.setPointerCapture(o.pointerId),ko=!1,r=null,i.classList.add("dragging"),Kn(!1);let a=i.getBoundingClientRect(),c=o.clientX-a.left,l=mf(Oe.x),d=Math.abs(c-l)<16;t={offset:d?c-l:0,hist:[{x:o.clientX,t:o.timeStamp}]},t.v=d?Oe.x:e(o,t),Ii=!0,Pr.delete(Oe),Oe.v=0,d||Dn(e(o,t),{damping:1,response:.18})}),i.addEventListener("pointermove",o=>{if(t){for(t.hist.push({x:o.clientX,t:o.timeStamp});t.hist.length>2&&o.timeStamp-t.hist[0].t>100;)t.hist.shift();Pr.delete(Oe),t.v=e(o,t),Oe.jump(t.v),rr()}});let n=o=>{if(!t)return;i.classList.remove("dragging");let a=t.hist,c=a[0],l=a[a.length-1],d=(l.t-c.t)/1e3,h=d>.008&&o.timeStamp-l.t<80?(l.x-c.x)/d:0,p=i.clientWidth/je(),u=Math.max(0,Math.min(je()-1,Math.round(t.v+Uu(h,.99)/p)));Dn(u,{velocity:h/p,damping:Math.abs(h)>300?.8:1,response:.4}),t=null,Pr.add(Oe),Oe.onRest=()=>{Ii=!1,an(u),rr()}};i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("keydown",o=>{let a={ArrowLeft:-1,ArrowRight:1,ArrowDown:-1,ArrowUp:1,PageDown:-6,PageUp:6}[o.key],c=a!==void 0?tt.hour+a:o.key==="Home"?0:o.key==="End"?je()-1:null;c!==null&&(o.preventDefault(),Po(),Kn(!1),c=Math.max(0,Math.min(je()-1,c)),an(c),Dn(c,{damping:1,response:.3}))});let r=null,s=()=>{if(!r)return;let o=r.from,a=Oe.x;r=null,ko=!1,Ii=!1,Ze?(Mc(!0),Oe.jump(a),Dn(0,{damping:1,response:.4})):(an(o),Dn(o,{damping:1,response:.4}))};addEventListener("pointermove",o=>{if(o.pointerType!=="mouse"||t||!tt.run)return;let a=i.getBoundingClientRect(),c=24;if(!(o.clientX>=a.left&&o.clientX<=a.right&&o.clientY>=a.top-c&&o.clientY<=a.bottom+c))return s();r||(r={from:tt.hour},Po(),Kn(!1)),ko=!0,Ii=!0,Pr.delete(Oe),Oe.v=0,Oe.onRest=null,Oe.jump(Math.max(0,Math.min(je()-1,(o.clientX-a.left)/(a.width/je())-.5))),rr()}),document.documentElement.addEventListener("mouseleave",s),D("dback").onclick=()=>{Kn(!1),Ze&&!Ir()?Mc(!0):an(on()),Dn(on(),{damping:1,response:.4})}}addEventListener("keydown",i=>{i.code==="Space"&&!/SELECT|BUTTON/.test(document.activeElement?.tagName)&&(i.preventDefault(),Kn(!tt.playing))});var le=i=>{let t=+Es.format(new Date(i.t));return t>=23||t<5},ee={rh:24,r18:!1,wind:!1};function wy(i){let t=(window.FRA_STYLE||{}).switch||{real:.2,real_h:80,calm_top:.2,calm_h:40,grid:.1},e=Math.min(1,Math.max(t.nice_min||.2,Math.ceil(i/(t.nice_step||.1)-1e-9)*(t.nice_step||.1)));return{top:e,h:Math.min(80,i>=t.real?t.real_h:t.calm_h_3d||50),grid:e/2}}function xc(i){let t=m=>i[on()].od===25?1-m.p25:m.p25,e=Math.max(...i.map(t))>=.2,n=it.clientWidth<640;ee.sc=wy(Math.max(...i.map(t))),ee.rh=ee.sc.h,ee.r18=i.some(m=>!le(m)&&m.p18<.9),ee.wind=!1;let r=ee.r18&&!n?12:0;ee.rh-=r+(n?0:10),!n&&innerHeight/(parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1)<790&&(ee.rh-=16);let s=it.clientWidth<600,o=s?30:24,a=n?32:34,c=(()=>{let m=D("dkey"),x=D("track");return!m||!x||(m.classList.contains("inbar")||m.parentElement===x)&&(m.classList.remove("inbar"),document.querySelector(".dock").appendChild(m)),0})(),l=o+a+c+(s?30:n?12:22),d=l+ee.rh+(s?34:16+r),h=d+(ee.r18?18:4),p=44,u=ee.wind?h+p:ee.r18?d+10:l+ee.rh;ee.rt=l;for(let[m,x]of Object.entries({dt:o,dh:a,rt:l,rh:ee.rh,mt:d,wt:h,wh:p,th:u}))it.style.setProperty(`--${m}`,`${x}px`);D("wind-l").hidden=!ee.wind,D("windrow").style.display=ee.wind?"":"none"}function bf(){let i=D("windrow");if(!tt.run||!ee.wind){i.innerHTML="";return}let t=tt.run.hours,e=D("track").clientWidth,n=44,r=e/t.length;if(!e)return;let s=f=>f.ws*Math.cos((f.wd-(f.od===25?249:69))*Math.PI/180),o=t.filter(f=>f.ws!==void 0),a=o.map(s),c=Math.max(6,Math.ceil(Math.max(...a)+1)),l=Math.min(-4,Math.floor(Math.min(...a)-1)),d=4,h=n-2,p=f=>d+(c-Math.max(l,Math.min(c,f)))/(c-l)*(h-d),u=c-l>24?10:5,m=[];for(let f=Math.ceil(l/u)*u;f<=c;f+=u)(f>=0||f<=-u)&&m.push(f);let x="",g=!1;t.forEach((f,M)=>{if(f.ws===void 0){g=!1;return}x+=`${g?"L":"M"}${((M+.5)*r).toFixed(1)} ${p(s(f)).toFixed(1)}`,g=!0}),i.setAttribute("viewBox",`0 0 ${e} ${n}`),i.setAttribute("width",e),i.setAttribute("height",n),i.innerHTML=`<rect x="0" y="${p(-1)}" width="${e}" height="${Math.max(0,h-p(-1))}" class="zone"/>`+m.map(f=>`<line x1="0" x2="${e}" y1="${p(f)}" y2="${p(f)}" class="${f?"grid":"zero"}"/>`).join("")+`<line x1="0" x2="${e}" y1="${p(-1)}" y2="${p(-1)}" class="lim"/><path class="ln" d="${x}"/>`+m.map(f=>`<rect x="1" y="${p(f)-14}" width="${f?34:12}" height="13" rx="2" class="chip"/><text x="4" y="${p(f)-3}">${f?`${Math.abs(f)}\u202Fkt`:"0"}</text>`).join("")+`<text x="${e-4}" y="${Math.min(h-1,p(-1)+11)}" text-anchor="end" class="limt">limit</text>`}new ResizeObserver(()=>{tt.run&&(xc(tt.run.hours),bf(),Tc(),requestAnimationFrame(vf))}).observe(it);function vf(){let i=D("track");if(!i)return;i.querySelectorAll(".r18tag, .r18lead, .r18brk").forEach(x=>x.remove());let t=[...D("marks").querySelectorAll(":scope > i.x")].filter(x=>x.getBoundingClientRect().width);if(it.clientWidth<640||D("marks").hidden||!t.length)return;let e=parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1,n=i.getBoundingClientRect(),r=x=>({l:(x.left-n.left)/e,r:(x.right-n.left)/e,t:(x.top-n.top)/e,b:(x.bottom-n.top)/e}),s=0;for(;s+1<t.length&&t[s+1].getBoundingClientRect().left-t[s].getBoundingClientRect().right<4*e;)s++;let o=r(t[0].getBoundingClientRect()),a=r(t[s].getBoundingClientRect()),c=i.clientWidth,l=(o.l+a.r)/2;i.insertAdjacentHTML("beforeend",`<span class="r18tag" title="Runway 18 closed from ${Pi.format(new Date(tt.run.hours[[...D("marks").children].indexOf(t[0])].t))}">18 closed</span><i class="r18brk" style="left:${o.l}px;width:${a.r-o.l}px;top:${o.t-4}px"></i>`);let d=i.querySelector(".r18tag"),h=d.offsetWidth,p=d.offsetHeight,u=o.t-7.5-p,m=Math.max(0,Math.min(c-h,l-h/2));Object.assign(d.style,{left:`${m}px`,top:`${u}px`})}function yf(){let i=D("ticks"),t=i.querySelector(".end");if(!t)return;let e=t.getBoundingClientRect();if(!(!e.width||!i.getBoundingClientRect().width)){t.style.visibility="";for(let n of i.querySelectorAll("span.day,span.start")){let r=n.getBoundingClientRect();r.width&&n.style.visibility!=="hidden"&&r.right>e.left-8&&r.left<e.right&&(t.style.visibility="hidden")}}}new ResizeObserver(()=>yf()).observe(document.body);function Rs(i,t){tt.run=ys.runs.find(a=>a.source===i)||ys.runs[ys.runs.length-1],D("run").value=tt.run.source,ef();let e=tt.run.hours;D("track").setAttribute("aria-valuemax",e.length);let n=(a,c,l=3)=>`repeating-linear-gradient(135deg,${a} 0 ${l}px,${c} ${l}px ${2*l}px)`;requestAnimationFrame(()=>{let a=D("segs"),c=a.clientWidth,l=e,d=on(),h=(window.FRA_STYLE||{}).switch_tab_min||24;a.querySelector(".swtab")?.remove(),D("track").querySelectorAll(".swchip, .swtick, .swstem").forEach(T=>T.remove());let p=l.findIndex((T,A)=>A>d&&T.od!==l[d].od);if(p<0)return;let u=p;for(;u+1<l.length&&l[u+1].od===l[p].od;)u++;let m=c/l.length,x=p*m,g=(u+1-p)*m,f=l[p].od,M=l.slice(p,u+1).some(T=>Math.min(T.p25,1-T.p25)>=.1);g<h&&a.insertAdjacentHTML("beforeend",`<i class="swtab ${f===25?"w":"e"}${M?" lo":""}" style="left:${Math.min(x,c-h)}px;width:${h}px;background:${f===25?de.west:de.east}" title="The switch starts here; the forecast ends after this hour"></i>`),D("track").insertAdjacentHTML("beforeend",`<span class="swchip ${f===25?"w":"e"}" style="--dc:${f===25?de.west:de.east}" title="Switch to ${f===25?"25":"07"} expected ${Pi.format(new Date(l[p].t))}">to ${f===25?"25":"07"}<span class="swt"> \xB7 ${new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(l[p].t))}</span></span>`);let v=D("track").querySelector(".swchip"),y=v.offsetWidth,E=Math.max(0,Math.min(x,c-y));v.style.left=`${E}px`,E<x-1&&D("track").insertAdjacentHTML("beforeend",`<i class="swtick" style="left:${x}px"></i>`),D("track").insertAdjacentHTML("beforeend",`<i class="swstem" style="left:${(a.querySelectorAll(":scope > i.w, :scope > i.e")[p]?.offsetLeft??x)-.5}px;background:${f===25?de.west:de.east}"></i>`),Td()}),D("segs").innerHTML=e.map(a=>{let c=a.p25>=.5,l=Math.min(a.p25,1-a.p25),d=c?de.west:de.east,h=le(a)?`${Gu(ie)} fixed,${d}`:d;return`<i class="${c?"w":"e"}${!le(a)&&l>=.1?" lo":""}" style="background:${h}" title="${le(a)?"Night ban, no scheduled flights":`${vy(c?25:7)}, ${sn(1-l)}`}"></i>`}).join("")+(()=>{let a="",c=0;for(;c<e.length;){let l=c,d=e[c].p25>=.5;for(;l+1<e.length&&e[l+1].p25>=.5===d;)l++;let h=Math.max(0,(Date.now()-Date.parse(e[0].t))/(e.length*36e5)),p=D("segs").clientWidth||D("track").clientWidth||1e3,u=xc.cx||(xc.cx=document.createElement("canvas").getContext("2d"));u.font='600 13px "IBM Plex Sans", system-ui, sans-serif';let m=u.measureText(d?"25 West":"07 East").width+35,x=-1,g=0;for(let f=c;f<=l;){for(;f<=l&&le(e[f]);)f++;if(f>l)break;let M=f;for(;M+1<=l&&!le(e[M+1]);)M++;let v=Math.max(f/e.length,f<=h*e.length?h:0);if(((M+1)/e.length-v)*p>=m+8){x=f,g=v;break}f=M+1}x>=0&&(a+=`<span class="dlab ${d?"w":"e"}" style="left:calc(${(g*100).toFixed(2)}% + 8px)">${d?`${Sc("w")}25 West`:`07 East${Sc("e")}`}</span>`),c=l+1}return a})(),D("marks").innerHTML=e.map(a=>`<i class="${a.p18<.5?"x":a.p18<.9?"r":"o"}${le(a)?" n":""}" title="Runway 18 ${le(a)?"night ban":a.p18<.5?"closed":a.p18<.9?`${sn(1-a.p18)} chance of a closure`:"open"}"></i>`).join(""),xc(e),requestAnimationFrame(()=>requestAnimationFrame(vf));{hi=e[on()].od===25?"East":"West";let a=e.reduce((x,g,f)=>!le(g)&&(x<0||(hi==="East"?1-g.p25:g.p25)>(hi==="East"?1-e[x].p25:e[x].p25))?f:x,-1),c=Ac,l=ee.sc.top,d=e.length*10,h=ee.rh,p=0,u=h-p,m=Math.max(p+.5,h-ee.sc.grid/l*u);D("risk").setAttribute("viewBox",`0 0 ${d} ${h}`),it.style.setProperty("--gf",(ee.sc.grid/l).toFixed(3)),D("rgl").style.top=`${ee.rt+m+1}px`,D("risk").innerHTML=`<line x1="0" y1="${m}" x2="${d}" y2="${m}" class="grid"/>`+(l>ee.sc.grid+1e-9?`<line x1="0" y1="0.5" x2="${d}" y2="0.5" class="grid half"/>`:"")+`<line x1="0" y1="${h-.5}" x2="${d}" y2="${h-.5}" class="base calm"/>`+e.map((x,g)=>{let f=c(x),M=f<(((window.FRA_STYLE||{}).switch||{}).min_bar??.01)?0:Math.max(2,Math.min(1,f/l)*u),v=10*e.length/(D("track").clientWidth||1e3),y=Math.min(10-2*v,14*v);return M?`<rect x="${(g*10+(10-y)/2).toFixed(2)}" y="${h-M}" width="${y.toFixed(2)}" height="${M}" fill="${ie==="light"?"#4b4d53":"#9aa0a6"}" opacity="${f>=.2||g===a?1:.85}"${g===a?` style="filter:brightness(${ie==="light"?".75":"1.1"})"`:""}><title>${Pi.format(new Date(x.t))}: ${sn(f)} chance of ${hi} that hour</title></rect>`:`<rect x="${(g*10+(10-y)/2).toFixed(2)}" y="${h-1}" width="${y.toFixed(2)}" height="1" fill="${ie==="light"?"#4b4d53":"#9aa0a6"}" opacity=".3"/>`}).join(""),D("rgl").textContent=`${Math.round(ee.sc.grid*100)}\u202F%`;{let x=D("rgl2");x&&(x.textContent=`${Math.round(l*100)}\u202F%`,x.hidden=!(l>ee.sc.grid+1e-9)||!!ee.sc.calm)}{let x=e.reduce((M,v,y)=>!le(v)&&(le(e[M])||c(v)>c(e[M]))?y:M,0),g=c(e[x]),f=D("rpk");if(g<.01||ee.sc.calm)f.textContent="",D("rpkl")&&(D("rpkl").style.display="none"),D("rpkh")&&(D("rpkh").style.display="none");else{let M=(x+.5)/e.length;f.textContent=gf(g,e[x].t),D("dpk")&&(D("dpk").textContent="");let v=Math.max(2,Math.min(1,g/l)*u),y=()=>{let E=D("track").getBoundingClientRect(),T=parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1,A=it.clientWidth<640?1:T,I=D("risk").getBoundingClientRect(),b=[...document.querySelectorAll("#risk rect")].map(dt=>{let zt=dt.getBoundingClientRect();return{l:(zt.left-E.left)/A,r:(zt.right-E.left)/A,t:(zt.top-E.top)/A,h:zt.height/A}}),w=18,P=(I.top-E.top)/A+4,k=f.offsetWidth||120,G=b[x];if(!G)return;let N=(G.l+G.r)/2,L=N-8;{let dt=D("segs").getBoundingClientRect(),zt=(I.top-dt.bottom)/A,Vt=f.offsetHeight||14;if(it.clientWidth>=640&&zt>=17&&L-k>=0){let yt=(I.top-E.top)/A-1-Vt;Object.assign(f.style,{visibility:"",left:`${L.toFixed(1)}px`,right:"auto",top:`${yt.toFixed(1)}px`,transform:"translateX(-100%)"}),f.dataset.band="1",f.classList.add("up");let V=D("rpkl");V||(V=document.createElement("i"),V.id="rpkl",V.className="rpkl",D("track").appendChild(V)),Object.assign(V.style,{left:`${N.toFixed(1)}px`,top:`${(G.t-3).toFixed(1)}px`,height:"0px",display:""});let q=D("rpkh");q||(q=document.createElementNS("http://www.w3.org/2000/svg","svg"),q.id="rpkh",q.setAttribute("class","rpkh"),q.setAttribute("aria-hidden","true"),q.innerHTML="<path/>",D("track").appendChild(q));let ot=yt+Vt/2,ft=L+3;q.firstChild.setAttribute("d",`M${ft.toFixed(1)} ${ot.toFixed(1)}L${N.toFixed(1)} ${ot.toFixed(1)}L${N.toFixed(1)} ${(G.t-6).toFixed(1)}`),q.style.display="";return}f.classList.remove("up")}for(let dt=0;dt<b.length;dt++){let zt=!1;for(let Vt=0;Vt<x;Vt++){let yt=b[Vt];yt.h>1.5&&yt.t<P+w+1&&yt.r>L-k-2&&yt.l-6<L&&(L=yt.l-6,zt=!0)}if(!zt)break}f.style.visibility=L-k<0?"hidden":"",Object.assign(f.style,{left:`${L.toFixed(1)}px`,right:"auto",top:`${P.toFixed(1)}px`,transform:"translateX(-100%)"}),f.dataset.band="1";let O=D("rpkl");O||(O=document.createElement("i"),O.id="rpkl",O.className="rpkl",D("track").appendChild(O)),Object.assign(O.style,{left:`${N.toFixed(1)}px`,top:`${(G.t-3).toFixed(1)}px`,height:"0px",display:""});let W=D("rpkh");W||(W=document.createElementNS("http://www.w3.org/2000/svg","svg"),W.id="rpkh",W.setAttribute("class","rpkh"),W.setAttribute("aria-hidden","true"),W.innerHTML="<path/>",D("track").appendChild(W));let z=P+(f.offsetHeight||14)/2,Q=G.t-3,nt=L+3,ht=Math.max(P-4,Math.min(z,Q,...b.filter((dt,zt)=>zt<x&&dt.h>1.5&&dt.r>nt&&dt.l<N-3).map(dt=>dt.t-3)));W.firstChild.setAttribute("d",`M${nt.toFixed(1)} ${z.toFixed(1)}`+(ht<z?`L${nt.toFixed(1)} ${ht.toFixed(1)}`:"")+(Q-ht>4?`L${N.toFixed(1)} ${ht.toFixed(1)}L${N.toFixed(1)} ${(Q-3).toFixed(1)}`:`L${(N-3).toFixed(1)} ${ht.toFixed(1)}`)),W.style.display=L-k<0?"none":""};y(),requestAnimationFrame(()=>{y();let E=f.getBoundingClientRect();if((!f.textContent||[...document.querySelectorAll("#risk rect")].some(P=>{let k=P.getBoundingClientRect();return k.height>1.5&&k.right>E.left&&k.left<E.right&&k.bottom>E.top&&k.top<E.bottom})||[document.getElementById("dkey")].some(P=>{if(!P||!P.offsetHeight)return!1;let k=P.getBoundingClientRect();return k.bottom>E.top&&k.top<E.bottom}))&&f.textContent){f.textContent="",D("rpkh")&&(D("rpkh").style.display="none");return}let A=D("rpkl"),I=document.querySelectorAll("#risk rect")[x]?.getBoundingClientRect(),b=D("track").getBoundingClientRect(),w=parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1;if(A&&I&&f.textContent&&!f.textContent.startsWith("peak ")&&!f.dataset.band){let P=(E.top+E.height/2-b.top)/(it.clientWidth<640?1:w);Object.assign(A.style,{top:`${P}px`,height:`${Math.max(0,(I.top-E.top-E.height/2)/(it.clientWidth<640?1:w)-3)}px`})}});{let E=on();if(!e.some((A,I)=>I>E&&A.od!==e[E].od)){D("rpkh")&&(D("rpkh").style.display="none");let A=ee.rt+h-v-2;v+20<=h?(f.textContent=`peak ${sn(g)}`,Object.assign(f.style,{left:`${((x+.5)/e.length*(D("track").clientWidth||1)+4).toFixed(1)}px`,top:`${A-18}px`,transform:"translateX(-100%)"}),Object.assign(D("rpkl").style,{top:`${A}px`,height:"0px"})):(f.textContent="",D("rpkl").style.display="none")}}}}{let x=e.reduce((g,f,M)=>!le(f)&&(le(e[g])||c(f)>c(e[g]))?M:g,0);D("rgl").hidden=!!ee.sc.calm,D("risk-l").innerHTML=`${Xt.switch} ${hi}`}D("risk").removeAttribute("hidden"),D("risk-l").hidden=!1,D("marks").hidden=!ee.r18,D("r18-l").hidden=!ee.r18}bf();{let a=l=>e.some(l),c=[];for(let l of[7,25])c.push([l===25?"west":"east",`<span><i style="background:var(--${l===25?"west":"east"})"></i>${l===25?"25 West":"07 East"}</span>`]);c.push(["official",`<span id="pgkey" style="display:none"><i class="pgk"></i>${Xt.inaa_flag}</span>`]),a(le)&&c.push(["night",`<span><i class="nightk" style="background:${Gu(ie)},${de.east}"></i>${Xt.night}</span>`]),ee.wind&&c.push(["limit",`<span><i class="limk"></i>${Xt.limit}</span>`]),a(l=>!le(l)&&Math.min(l.p25,1-l.p25)>=.1)&&c.push(["faded",`<span><i class="lessk"></i>${Xt.faded}</span>`]);{let l=a(h=>!le(h)&&h.p18<.5),d=a(h=>!le(h)&&h.p18>=.5&&h.p18<.9);(l||d)&&c.push(["r18",`<span class="kr18" title="${Xt.r18_tip||""}">${l?'<i class="closedk"></i>':""}${d?'<i class="riskk"></i>':""}${l&&d?Xt.r18_both:l?Xt.r18_closed:Xt.r18_risk}</span>`])}{let l=(window.FRA_STYLE||{}).legend_order||[];c.sort((d,h)=>l.indexOf(d[0])-l.indexOf(h[0]))}Ec(),D("dkey").innerHTML=c.map(l=>l[1]).join("")}{let a=le,c="",l=-1;e.forEach((d,h)=>{if(a(d)&&l<0&&(l=h),l>=0&&(!a(d)||h===e.length-1)){let p=a(d)?h+1:h;c+=`<i style="left:${(l/e.length*100).toFixed(2)}%;width:${((p-l)/e.length*100).toFixed(2)}%"></i>`,l=-1}}),D("nights").innerHTML=c}let r=innerWidth>=(((window.FRA_STYLE||{}).axis||{}).short_below||520)&&(D("track").clientWidth||800)/e.length*6>=(((window.FRA_STYLE||{}).axis||{}).long_px||48),s=new Date(new Date(e[e.length-1].t).getTime()+36e5);D("ticks").innerHTML=e.map((a,c)=>{let l=new Date(a.t),d=Es.format(l),h=(c/e.length*100).toFixed(2);return d==="00"?`<i class="dl" style="left:${h}%"></i><span class="day" style="left:${h}%">${Ci.format(l)}</span>`:["06","12","18"].includes(d)&&c<=e.length-4?`<i class="tk" style="left:${h}%"></i><span class="hr" data-x="${h}" style="left:${h}%">${r?`${d}:00`:d}</span>`:""}).join("")+`<span class="nowtick" id="nowtick" title="Current hour; forecast issued ${Se(new Date(tt.run.issue))}">Now</span>`,D("mids").innerHTML=e.map((a,c)=>c&&Es.format(new Date(a.t))==="00"?`<i style="left:${(c/e.length*100).toFixed(2)}%"></i>`:"").join(""),requestAnimationFrame(yf);let o=t?Math.min(tt.hour,e.length-1):on();an(o,!0),Dn(o,"jump")}D("run").onchange=i=>{Rs(i.target.value)};function My(i){let t=tt.run.hours[i],e=tt.ovOd?+tt.ovOd:ge&&Ze&&(Ze.od_live||Ze.od_now)||t.od,n=tt.ovR18?tt.ovR18==="1":t.p18>=.5;return{h:t,od:e,r18:n}}var Ac=i=>hi==="East"?1-i.p25:i.p25;function Td(){let i=D("pgl"),t=D("track")?.querySelector(".swchip");if(!i||i.hidden||!t||!De.length)return;let e=D("track").clientWidth,n=t.offsetLeft-4,r=De[0]/tt.run.hours.length*e;if(!(i.offsetLeft+i.offsetWidth<=n)){for(let s of[i.dataset.l,i.dataset.m,"Official"])if(s&&(i.textContent=s,r+i.offsetWidth<=n)){Object.assign(i.style,{left:`${r}px`,right:"auto"}),i.classList.remove("ra");return}i.textContent="Official",Object.assign(i.style,{left:`${Math.max(0,n-i.offsetWidth)}px`,right:"auto"}),i.classList.remove("ra")}}function an(i,t){tt.hour=Math.max(0,Math.min(je()-1,i));let{h:e,od:n,r18:r}=My(tt.hour),s=t||!tt.cur||tt.cur.od!==n||tt.cur.r18!==r;tt.cur={od:n,r18:r,t:e.t,live:ge},D("track").setAttribute("aria-valuenow",tt.hour+1),D("track").setAttribute("aria-valuetext",`${Pi.format(new Date(e.t))}, ${n===25?"westbound":"eastbound"}`);let o=n===25,a=o?de.west:de.east,c=o?e.p25:1-e.p25;by(rn()?`${o?"25":"07"} Frankfurt flies ${o?"West":"East"}`:le(e)?(h=>{let p=tt.run.hours,u=h<0?o?"25":"07":p[h].p25>=.5?"25":"07";return`${u} ${h<0?"Night ban":Xt.night_next.replace("{od}",u).replace("{t}",Se(new Date(p[h].t)))}`})(tt.run.hours.findIndex((h,p)=>p>tt.hour&&!le(h))):`${o?"25":"07"} Expected: ${o?"West":"East"}`,a,o?-1:1),D("dir").classList.toggle("fut",!rn()),D("dir").classList.toggle("nbh",!rn()&&le(e)),document.querySelector(".rail .hero")?.classList.toggle("fut",!rn()),D("eyebrow").textContent=rn()?window.FRA_SINCE?`${Xt.now} \xB7 since ${Ci.format(new Date(window.FRA_SINCE))}, ${Se(new Date(window.FRA_SINCE))}${$u()}`:Xt.now:`Frankfurt \xB7 forecast for ${new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(e.t))}`,D("ground").textContent="",ge||(D("dir-sub").innerHTML=""),xf(tt.hour);{let h=tt.run.hours,p=ge?0:tt.hour,u=h.findIndex((I,b)=>b>p&&I.od!==e.od),m=I=>e.od===25?1-h[I].p25:h[I].p25,x=Math.max(...h.slice(p).map((I,b)=>m(p+b))),g=Pi.format(new Date(new Date(h[h.length-1].t).getTime()+36e5)),f=I=>I.pg===void 0?null:I.pg>=.75?25:I.pg<=.25?7:0,M=[];{let I=window.FRA_PGWIN,b=I&&tt.run&&tt.run.source===I.run;h.forEach((w,P)=>{if(P<(ge?0:Math.min(p,on())))return;let k=Date.parse(w.t),G=f(w);(b?I.win.some(N=>k>=Date.parse(N.start)&&k<Date.parse(N.end)):G&&G!==w.od||G===0&&Math.max(w.p25,1-w.p25)>=.9)&&M.push(P)})}De=M;let v=M.length?M.some(I=>f(h[I])===0)?"Possible switch":`Switch to ${f(h[M[0]])===25?"25":"07"}`:"",y=new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}),E=h.findIndex((I,b)=>b>=p&&m(b)===x),T=h.reduce((I,b,w)=>w>=p&&!le(b)&&(I<0||m(w)>m(I))?w:I,-1),A=T<0?x:m(T);{let I=W=>new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short"}).format(new Date(W)),b=W=>+Es.format(new Date(W)),w=W=>{let z=b(W);return z>=23||z<5?"night":z<12?"morning":z<17?"afternoon":"evening"},P=x>=.2,k=W=>`${I(W)}\xA0${Se(new Date(W))}`,G=W=>W===25?"West":"East",N=rn(),L=Ac(e);D("outl").innerHTML=!N&&le(e)?"No scheduled flights 23:00 to 05:00":N?u>=0?Xt.out_expected.replace("{to}",G(e.od===25?7:25)).replace("{t}",`<span class="nw">${new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(h[u].t))}</span>`)+(h.length-1-u<=1&&Xt.out_edge||""):P?Xt.out_possible.replace("{p}",sn(x)).replace("{to}",G(e.od===25?7:25)).replace("{when}",(h.length-1-E<=2?Xt.out_when_end:Xt.out_when_mid).replace("{t}",k(h[E].t))):Xt.out_none:`${sn(e.p25>=.5?e.p25:1-e.p25)} ${e.p25>=.5?"West":"East"} this hour`;let O=M.length&&u<0&&!P&&(N||M.includes(tt.hour));if(D("disl").hidden=!O,D("outl").title=tt.run.p_change===null||tt.run.p_change===void 0?"":`Calibrated chance of any switch in 48 h: ${sn(tt.run.p_change)}
The hourly bars are uncalibrated model probabilities.`,!M.length)D("disl").innerHTML="";else{let W=zt=>{let Vt=b(zt);return Vt>=23||Vt<5?"night":Vt<11?"morning":Vt<14?"midday":Vt<17?"afternoon":"evening"},z=h[M[0]].t,Q=new Date(Date.parse(h[M[M.length-1]].t)+36e5).toISOString(),nt=new Date(Date.parse(Q)-36e5),dt=I(nt)===I(z)||Date.parse(Q)-Date.parse(z)<=18*36e5&&b(nt)<5?`${I(z)}\xA0${W(z)}`:`from ${I(z)}\xA0${W(z)} to ${I(Q)}\xA0${W(Q)}`;D("disl").innerHTML=O?(Xt.disagree||"{of} warns of a switch {when}; we don't expect one.").replace("{of}",`<span class="ofn">${Xt.of_name||"The official forecast"}</span>`).replace("{when}",dt):""}}{let I=Ac(e),b=rn()?x:I,w=ee.sc?ee.sc.top:.2,P=`<i class="swb"><i style="width:${(Math.min(1,b/w)*100).toFixed(0)}%"></i></i>`;D("dir-next").innerHTML=rn()?`<div class="kv" title="The operating hour (outside the 23:00 to 05:00 night ban) with the highest chance of ${hi}, to ${g}. The 48 h figure above is calibrated on past switches from the highest hourly chance, so it can be lower."><span>${Xt.switch} ${hi}</span><b>${A<.01?"Under 1\u202F% every hour":Xt.peak_by.replace("{p}",sn(A)).replace("{t}",gf(A,h[T<0?E:T].t).replace(/^.* at /,""))}</b></div>`:`<div class="kv"><span>${Xt.switch} ${hi}</span><b>${sn(I)} at ${Se(new Date(e.t))}</b></div>`}{let I=((window.FRA_QUALITY||{}).od25||[]).filter(k=>k.acc!==null&&k.acc!==void 0),b=k=>Math.round(k*100),w=k=>Math.min(...k)===Math.max(...k)?`${Math.min(...k)}`:`${Math.min(...k)}\u2013${Math.max(...k)}`,P=window.FRA_SINCE?`since ${Ci.format(new Date(window.FRA_SINCE))}, ${Se(new Date(window.FRA_SINCE))}${$u()}`:"";D("sumbar").innerHTML=`<div class="sb0">${rn()?`${Xt.now}${P?` \xB7 <span class="nw">${P}</span>`:""}`:`Frankfurt \xB7 <span class="nw">forecast for ${new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short"}).format(new Date(e.t))} ${Se(new Date(e.t))}</span>`}</div><div class="sb1${!rn()&&le(e)?" nbh":""}"><b class="dbadge" style="--dc:${e.od===25?de.west:de.east}" data-d="${e.od===25?"25":"07"}">${e.od===25?"25":"07"}</b><span class="nw">${rn()?`flies ${e.od===25?"West":"East"}\xA0${Sc(e.od===25?"w":"e")}`:(/^\d\d (.*)$/.exec(To||"")||[0,""])[1]}</span></div><div class="sb2">${D("outl").innerHTML.replace(/ expected (<span class="nw">)/," \xB7 $1")}</div><details class="sbx"${it.classList.contains("sbopen")?" open":""}><summary>Details</summary>`+(I.length?`<div class="sb3">Right <b>${w(I.map(k=>b(k.acc)))}\u202F%</b> of hours \xB7 official <em>${w(I.map(k=>b(k.prog)))}\u202F%</em></div>`:"")+`<div class="sb4">The direction switches at short notice when the wind turns, so airlines and ground crews can't plan for it.</div>${D("disl").hidden?"":`<div class="sb5">${D("disl").innerHTML}</div>`}</details>`;{let k=D("sumbar").querySelector(".sbx>summary"),G=D("sumbar").querySelector(".sb1");if(k&&G){let N=D("sumbar").querySelector(".sb0");k.style.top=`${Math.max(G.offsetTop+(G.offsetHeight-(k.offsetHeight||24))/2,N?N.offsetTop+N.offsetHeight+2:0)}px`}}{let k=D("sumbar").querySelector(".sbx");k&&(k.ontoggle=()=>{it.classList.toggle("sbopen",k.open),requestAnimationFrame(Fr)})}}D("how-pg").textContent=M.length?` The official forecast flags ${Pi.format(new Date(h[M[0]].t))} to ${Se(new Date(new Date(h[M[M.length-1]].t).getTime()+36e5))} as a possible switch (orange bracket on the timeline).`:h.some(I=>I.pg!==void 0)?" The official forecast agrees with ours for this run.":"",Xo=u>=0||x>=.2,yy()}{let h=tt.run.hours.slice(ge?0:tt.hour),p=Math.max(...h.map(I=>1-I.p18)),u=new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}),m=h.findIndex(I=>I.p18<.5),x=m;for(;m>=0&&x+1<h.length&&h[x+1].p18<.5;)x++;let g=window.FRA_TRAFFIC,f=I=>+new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",hour:"2-digit",hourCycle:"h23"}).format(new Date(I)),M=g&&m>=0?Math.max(...h.slice(m,x+1).map(I=>Math.round(g.perHour[f(I.t)]/2*(g.share18||0)))):0,v=I=>new Intl.DateTimeFormat("en-GB",{timeZone:ke,weekday:"short"}).format(new Date(I)),y=I=>new Intl.DateTimeFormat("en-GB",{timeZone:ke,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(I)),E="",T=[],A="hour";if(rn()){let I=(M>0?Xt.r18_moves:Xt.r18_moves0).replace("{n}",M);if(m<0){A="none",E=Xt.r18_open.replace("{n}",h.length);let b=h.filter(k=>!le(k)),w=b.length?Math.max(...b.map(k=>1-k.p18)):0,P=g&&b.length?Math.max(...b.map(k=>Math.round(g.perHour[f(k.t)]/2*(g.share18||0)))):0;T=[Xt.r18_open_max.replace("{p}",sn(w)),...P>0?[Xt.r18_carries.replace("{n}",P)]:[]]}else{let b=h[m].t,w=Date.parse(h[x].t)+36e5;if(m===0)A="now",E=Xt.r18_until.replace("{b}",y(w)===y(Date.now())?Se(new Date(w)):`${v(w)} ${Se(new Date(w))}`),T=[I];else{A="sched";let P=Q=>y(Q).split("/").reverse().join("-"),k=Math.round((Date.parse(P(b))-Date.parse(P(Date.now())))/864e5),G=Q=>Q.p18>=.5&&Q.p18<.9&&!le(Q),N=m,L=x;for(;N-1>0&&G(h[N-1]);)N--;for(;L+1<h.length&&G(h[L+1]);)L++;let O=h[N].t,W=Date.parse(h[L].t)+36e5,z=N<m||L>x?Xt.r18_may.replace("{a}",Se(new Date(O))).replace("{b}",y(W)===y(O)?Se(new Date(W)):`${v(W)} ${Se(new Date(W))}`):"";E=Xt.r18_closes.replace("{date}",Ci.format(new Date(b))).replace("{a}",Se(new Date(b))).replace("{b}",y(w)===y(b)?Se(new Date(w)):`${v(w)} ${Se(new Date(w))}`),T=[[Xt.r18_rel[Math.min(k,2)].replace("{n}",k),z,Xt.r18_date].filter(Boolean).join(" \xB7 "),I]}}}D("r18-v").dataset.state=A,D("r18-v").innerHTML=A!=="hour"?`<span class="badge r18b">${A==="none"?"":`<i class="r18d${A==="sched"?" ring":""}" aria-hidden="true"></i>`}${E}</span>`:le(e)?'<span class="badge nb">Night ban</span>':`<span class="badge${r?"":" closed"}">${r?`${(window.FRA_STYLE||{}).check||""}In use`:"Closed"}</span>`,D("r18-s").innerHTML=T.map((I,b)=>`<span class="${b===T.length-1&&(A!=="none"||b)?"r18i":"r18w"}">${I}</span>`).join(""),D("r18-s").classList.toggle("r18is",T.length>0),D("r18-v").title=r?`Closure chance to the end of the forecast: at most ${sn(p)} in any hour`:"Its take-offs use the Centre runway"}if(e.ws!==void 0){Sd(e.wd,e.ws);let h=Math.round(e.ws),p=T=>-e.ws*Math.cos((e.wd-T)*Math.PI/180),u=Math.round(e.wg),m=T=>-u*Math.cos((e.wd-T)*Math.PI/180),x=T=>`${T>=0?"tailwind":"headwind"} ${Math.round(Math.abs(T))}\u202Fkt`,g=(T,A=null)=>{let I=A===null?null:m(A);return x(T)+(I!==null&&u>h+2&&Math.round(Math.abs(I))!==Math.round(Math.abs(T))?`, gusts ${Math.round(Math.abs(I))}`:"")},f=["north","northeast","east","southeast","south","southwest","west","northwest"][Math.round(e.wd/45)%8],M=["N","NE","E","SE","S","SW","W","NW"][Math.round(e.wd/45)%8];D("wind-t").textContent=rn()?`${Xt.wind} now`:`${Xt.wind} at ${Se(new Date(e.t))}`;{let T=Math.round(p(Qi[n]));D("wind-v").innerHTML=`${T>0?"tailwind":"headwind"} ${Math.abs(T)}\u202Fkt on ${o?25:"07"}`}pd.el.innerHTML=`<svg viewBox="0 0 24 24" style="--a:${e.wd+180}deg"><path d="M12 21V4M6 10l6-6 6 6"/></svg><span><b>${h}\u202Fkt ${["N","NE","E","SE","S","SW","W","NW"][Math.round(e.wd/45)%8]}</b></span>`,D("windchip").innerHTML=pd.el.innerHTML,bd=e.wd,D("wcomp").innerHTML=`<svg viewBox="0 0 24 24" style="--a:${e.wd+180}deg"><path d="M12 21V4M6 10l6-6 6 6"/></svg>`;let v=Math.round(-h*Math.cos((e.wd-Qi[25])*Math.PI/180)),y=Math.round(p(Qi[n]));D("wind-why").textContent=`from ${M} \xB7 ${String(Math.round(e.wd)).padStart(3,"0")}\xB0`,D("wind-why").title="The official rule switches direction when the tailwind stays above 1 kt for 30 minutes, or at once from 10 kt";let E=Math.round(Math.abs(e.ws*Math.sin((e.wd-Qi[n])*Math.PI/180)));D("wind-s").innerHTML="";{let T=D("pdetw");T&&(T.innerHTML=`<b>Wind per runway</b><br>${String(e.wd).padStart(3,"0")}\xB0, gusts ${Math.round(e.wg)}\u202Fkt<br>${o?25:"07"}: ${g(p(Qi[n]),Qi[n])}, crosswind ${E}\u202Fkt<br>18: ${g(p(Qi[18]),Qi[18])}`)}}else Sd(0,0),pd.el.innerHTML="",D("windchip").innerHTML="",D("wind-v").textContent="n/a",D("wind-s").textContent="No wind forecast for this run";for(let h of Object.values(se)){let p=Jn(h,n),u=h.mat.uniforms,m=h.key==="r18"&&!r;h.target={active:m?0:1,closed:m?1:0},u.uDir.value=p.startIsA?1:-1,u.uCol.value.set(a);let x=h.key==="nw"||h.key==="south",[g,f]=cf[h.key],M=p.startIsA?g:f,v=p.startIsA?f:g,y=I=>h.key==="r18"?"18":I[0]<(I===h.A?h.B:h.A)[0]?h.d07:h.d25,E=p.startIsA?h.A:h.B,T=p.startIsA?h.B:h.A,A=m?'<em class="chip closed">Closed</em>':"";M.el.innerHTML=`<b>${y(E)}</b>${A}`,M.w=0,v.el.innerHTML=""}let l=new fe,d=new fe(-1,-1,-1,-1);for(let h of Object.values(se))l.setComponent(h.i,h.key==="r18"&&!r?0:1),(h.key==="nw"||h.key==="south")&&d.setComponent(h.i,Jn(h,n).startIsA?0:1);nr.uniforms.uAct.value.copy(l),nr.uniforms.uArr.value.copy(d),!Pe.card&&!di&&n!==li&&(li=n,of(),Cc||Lc()),ny(tt.cur,zo.elapsedTime,s&&t),Ao=!rn()&&le(e),hf(n,r),qo();{let h=p=>`<i style="background:${p}"></i>`;D("caption").innerHTML=`<span><b>${As.format(new Date(e.t))}</b><small>+${tt.hour+1}\u202Fh</small></span><span>${h(a)}<b>${o?"25":"07"} ${o?"Westbound":"Eastbound"}</b><small>${sn(c)}</small></span><span>${h(r?"var(--label3)":de.closed)}<b>Runway 18 ${r?"usable":"closed"}</b><small>${sn(r?e.p18:1-e.p18)}</small></span>`}}var _s=new wo({damping:1,response:1.2}),ws=new wo({damping:1,response:1.2}),Dr="free";function or(i){i!=="free"&&Dr==="free"&&(_s.jump(ne.position),ws.jump(pn.target)),Dr=i,tt.follow=i==="follow",D("b-follow").setAttribute("aria-pressed",tt.follow),pn.autoRotate=tt.orbit&&i==="free"}function Lc(){or("fly");let i=Lo();_s.to(i.pos,{damping:1,response:1.2}),ws.to(i.target,{damping:1,response:1.2}),Bo.matches&&(_s.jump(i.pos),ws.jump(i.target))}D("b-home").onclick=Lc;D("b-follow").onclick=()=>tt.follow?Lc():or("follow");var Sy=0;pn.addEventListener("start",()=>{Cc=!0,clearTimeout(Sy),tt.orbit=!1,or("free")});Bo.addEventListener("change",()=>{Bo.matches&&(tt.orbit=!1,or(Dr))});function Yo(i,t){ie=i,de=ju[i],gd=Object.fromEntries(Object.entries(de).map(([e,n])=>[e,new Dt(n)])),it.classList.toggle("light",i==="light");for(let[e,n]of Object.entries(de))it.style.setProperty("--"+e,n);{let e=(window.FRA_STYLE||{}).tag_bg;e&&(it.style.setProperty("--tagbg",i==="light"?e.light:e.dark),it.style.setProperty("--tagink",i==="light"?e.ink_light:e.ink_dark))}it.style.setProperty("--bg",kr[i].bg),Fn.background.set(kr[i].bg),Fn.fog.color.set(kr[i].bg),lf();for(let e of Object.values(se))e.mat.uniforms.uLight.value=i==="light"?1:0;if(document.querySelectorAll(".dir .dbadge").forEach(e=>e.style.setProperty("--dc",e.textContent==="25"?de.west:de.east)),nr.uniforms.uLight.value=i==="light"?1:0,nr.blending=i==="light"?ui:vc,nr.needsUpdate=!0,tf(),typeof _d=="function"&&_d(),document.documentElement.dataset.theme!==i&&(document.documentElement.dataset.theme=i),t)try{localStorage.setItem("fra-theme",i)}catch{}t&&window.parent!==window&&window.parent.postMessage({fra:"theme-changed",value:i},"*"),tt.run&&Rs(tt.run.source,!0)}new MutationObserver(()=>{let i=document.documentElement.dataset.theme;(i==="dark"||i==="light")&&i!==ie&&Yo(i)}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]});function _f(i){Pe.card=i,document.body.classList.toggle("card",i),document.body.classList.toggle("embed",Ho&&i),tf(),Fr(),requestAnimationFrame(()=>{ti(),rr()}),Lc()}function wf(){return document.fullscreenElement||document.webkitFullscreenElement}var Cd=!1;D("b-fs").onclick=async()=>{if(Cd){window.parent.postMessage({fra:"exit-fs"},"*");return}if(wf()){(document.exitFullscreen||document.webkitExitFullscreen).call(document);return}let i=it.requestFullscreen||it.webkitRequestFullscreen;try{if(!i)throw new Error("no fullscreen");await i.call(it)}catch{(location.protocol==="file:"||location.protocol.startsWith("http"))&&window.open(`${location.pathname}?run=${encodeURIComponent(tt.run.source)}&theme=${ie}${Nv?"&palette=lh":""}`,"_blank")}};function Id(){let i=!!wf()||Cd;D("b-fs").innerHTML=`${i?Ri.collapse:Ri.expand}<span>${i?"Exit full screen":"Full screen"}</span>`,Rc?_f(!i):document.body.classList.toggle("embed",Ho&&!i)}document.addEventListener("fullscreenchange",Id);document.addEventListener("webkitfullscreenchange",Id);var zo=new yr,Xu=0,bc=0,ai=null;Yo(ie);Rs(sr.get("run")||ys.default);ti();Kn(tt.playing);or("free");Fr();requestAnimationFrame(()=>{ti(),rr()});var Ey=3.2,Ty=[...document.querySelectorAll("#rose b")],Ay=D("rose-n"),qu=new U,Yu=new U;Un.setAnimationLoop(()=>{let i=Math.min(zo.getDelta(),.1),t=zo.elapsedTime;if(Xu+=i*zv,tt.playing&&!Ii&&(bc+=i,bc>Ey)){bc=0;let e=(tt.hour+1)%je();an(e),Dn(e,e===0?"jump":{damping:1,response:.45})}my(i);for(let e of Object.values(se)){let n=e.mat.uniforms,r=1-Math.exp(-i*3);n.uActive.value+=((e.target?.active??0)-n.uActive.value)*r,n.uClosed.value+=((e.target?.closed??0)-n.uClosed.value)*r,n.uTime.value=t}nr.uniforms.uTime.value=t,nr.uniforms.uScale.value=it.clientHeight/1.6,Ti=Ti.filter(e=>e.dead!==null&&t-e.dead>1.6?(e.dispose(),!1):(e.update(Xu,t),!0));for(let[e,n]of pi){if(n.dead!==null&&t-n.dead>1.6){jn===n&&(jn=null),ir===n&&(ir=null),n.dispose(),pi.delete(e);continue}n.step(i,t)}for(let e of Ti)e.obj.visible=!1;for(let e of Ti)e.trail.visible=!1,e.line.visible=!1;if(iy.visible=!1,Bo.matches||ry(i),Dr==="follow"){if(jn&&jn.dead===null)ai=jn;else if(!ai||ai.dead!==null||ai instanceof Ss||ai.cur.t>ce.tTd+ce.tRoll*.6){let e=Ti.filter(n=>n.dead===null&&n.kind==="arr"&&n.cur&&n.cur.t<ce.tTd*.8);ai=e.filter(n=>n.cur.t>ce.tTd*.35).sort((n,r)=>n.cur.t-r.cur.t)[0]||e.sort((n,r)=>r.cur.t-n.cur.t)[0]||ai}if(ai?.cur){let e=ai.cur,n=Math.cos(e.hd),r=Math.sin(e.hd);qu.copy(qt(e.x-n*900+r*260,e.y-r*900-n*260,e.h+260)),Yu.copy(qt(e.x+n*1500,e.y+r*1500,Math.max(0,e.h-150))),_s.to(qu,{damping:1,response:.9}),ws.to(Yu,{damping:1,response:.9})}}Dr!=="free"&&(_s.step(i,ne.position),ws.step(i,pn.target),Dr==="fly"&&_s.resting&&ws.resting&&or("free")),pn.update(i),D("rose").style.opacity=Math.abs(pn.getAzimuthalAngle())>.09?1:0;{let e=pn.target,n=it.clientWidth,r=it.clientHeight;he.copy(e).project(ne);let s=he.x*n,o=he.y*r;for(let a of Ty){let[c,l]={N:[0,1],E:[1,0],S:[0,-1],W:[-1,0]}[a.dataset.d];We.set(e.x+c*2e3,0,e.z-l*2e3).project(ne);let d=Math.atan2(We.y*r-o,We.x*n-s);a.style.transform=`translate(${Math.cos(d)*22}px, ${-Math.sin(d)*22}px)`,a.dataset.d==="N"&&(Ay.style.transform=`rotate(${90-d*180/Math.PI}deg)`)}}Vo.render(),ay();{let e=it.clientWidth,n=it.clientHeight;_c=[];for(let[r,s]of Fo)for(let o=0;o<=160;o++)he.copy(qt(r[0]+(s[0]-r[0])*o/160,r[1]+(s[1]-r[1])*o/160,0)).project(ne),_c.push([(he.x+1)/2*e,(1-he.y)/2*n])}Cr();{let e=it.clientWidth,n=it.clientHeight;{let o=Ai.slice(),a=[];for(let l of pi.values()){let d=l.drawTag(e,n);d&&a.push(d)}a.sort((l,d)=>l.pri-d.pri||l.p.pos[2]-d.p.pos[2]);let c=(l,d)=>l[0]<d[2]&&d[0]<l[2]&&l[1]<d[3]&&d[1]<l[3];for(let l of a){if(l.pri&&o.some(d=>c(l.r,d))){l.p.tag.style.display="none";continue}o.push(l.r)}}let r=ir||jn,s=D("actip");if(r&&r.dead===null&&ge===r instanceof Ss){he.copy(r.obj.position).project(ne),s.hidden=!1;let o=fy(r);s.dataset.k!==o&&(s.innerHTML=o,s.dataset.k=o);let a=(he.x+1)/2*e,c=(1-he.y)/2*n,l=s.offsetWidth,d=s.offsetHeight,h=x=>Ai.some(g=>x[0]<g[2]&&g[0]<x[2]&&x[1]<g[3]&&g[1]<x[3]),p=[[a+18,c-d-18],[a-l-18,c-d-18],[a+18,c+18],[a-l-18,c+18]].map(([x,g])=>[Math.min(e-l-8,Math.max(8,x)),Math.min(n-d-8,Math.max(8,g))]),[u,m]=p.find(([x,g])=>!h([x,g,x+l,g+d]))||p[0];s.style.transform=`translate(${u}px, ${m}px)`,D("acring").hidden=!1,D("acring").style.transform=`translate(${a}px, ${c}px)`}else s.hidden=!0,D("acring").hidden=!0;Math.floor(t)!==Math.floor(t-i)&&qo()}});new ResizeObserver(()=>{ti(),rr()}).observe(it);addEventListener("message",i=>{let t=i.data;if(!(!t||typeof t!="object"||!t.fra)){if(t.fra==="hour"&&(Kn(!1),an(t.i),Dn(tt.hour,{damping:1,response:.3})),t.fra==="run"&&Rs(t.name),t.fra==="view"){Kn(!1),Ur=!!t.live,ge=Ur&&!!Ze&&!Ir(),tt.ovOd=t.od?String(t.od):"",tt.ovR18=t.r18===void 0||t.r18===null?"":t.r18?"1":"0";let e=on();if(t.t&&tt.run){let n=Date.parse(t.t),r=tt.run.hours;e=r.reduce((s,o,a)=>Math.abs(Date.parse(o.t)-n)<Math.abs(Date.parse(r[s].t)-n)?a:s,0)}an(e,!0),Dn(e,"jump"),ti()}if(t.fra==="override"&&(tt.ovOd=t.od?String(t.od):"",tt.ovR18=t.r18===void 0||t.r18===null?"":t.r18?"1":"0",ti(),an(tt.hour)),t.fra==="pad"){for(let e of["top","right","bottom","left"])md[e]=+t[e]||0,it.style.setProperty(`--pad-${e[0]}`,`${md[e]}px`);Fr()}t.fra==="fs"&&(Cd=!!t.on,Id()),t.fra==="theme"&&(t.value==="light"||t.value==="dark")&&t.value!==ie&&Yo(t.value),t.fra==="tz"&&typeof t.value=="string"&&t.value!==ke&&Pd(t.value)}});function Pd(i){ke=i,ff();for(let t of ys.runs)D("run").querySelector(`option[value="${t.source}"]`).textContent=As.format(new Date(t.issue));Rs(tt.run.source,!0),document.querySelectorAll(".ptz button").forEach(t=>t.setAttribute("aria-pressed",t.dataset.v===ke));try{localStorage.setItem("fra-tz",ke==="UTC"?"utc":"local")}catch{}}D("b-thm").onclick=()=>Yo(ie==="light"?"dark":"light",!0);var Mf=()=>{let i="Light / dark theme";D("b-thm").title=i,D("b-thm").setAttribute("aria-label",i)};Mf();new MutationObserver(Mf).observe(it,{attributes:!0,attributeFilter:["class"]});try{innerWidth>=480&&(D("tzl3").textContent=`Local (${new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",timeZoneName:"short"}).formatToParts(new Date).find(i=>i.type==="timeZoneName").value})`)}catch{}document.querySelectorAll(".ptz button").forEach(i=>i.addEventListener("click",()=>{i.dataset.v!==ke&&Pd(i.dataset.v)}));try{!Ho&&localStorage.getItem("fra-tz")==="utc"&&Pd("UTC")}catch{}window.parent!==window&&window.parent.postMessage({fra:"ready"},"*");window.__fra={wind:Sd,setHour(i){an(i),Dn(i,"jump")},setRun:Rs,state:tt,camera:ne,controls:pn,RW:se,flights:()=>Ti,setPlaying:Kn,setOverride(i,t){tt.ovOd=i??"",tt.ovR18=t??"",ti(),an(tt.hour)},follow(){or("follow")},setTheme:Yo,setCardMode:_f,planes:()=>pi,rwScreen(){let i=it.clientWidth,t=it.clientHeight,e=new U,n=it.getBoundingClientRect(),r=s=>(e.copy(qt(s[0],s[1],0)).project(ne),[n.left+(e.x+1)/2*i,n.top+(1-e.y)/2*t]);return Object.values(se).map(s=>{let o=r(s.A),a=r(s.B);return[[s.d07,s.d25],o,a,170*Math.hypot(a[0]-o[0],a[1]-o[1])/s.len]})},depTips(){let i=it.clientWidth,t=it.clientHeight,e=new U,n=Ue;return{tips:(xd||[]).filter(r=>r.kind==="dep").map(r=>(e.copy(qt(r.b[0],r.b[1],0)).project(ne),[(e.x+1)/2*i,(1-e.y)/2*t])),free:[n.left,n.top,i-n.right,t-n.bottom]}},fitStats(){let i=it.clientWidth,t=it.clientHeight,e=new U,n=nf.map(p=>(e.copy(qt(p[0],p[1],0)).project(ne),[(e.x+1)/2*i,(1-e.y)/2*t])),r=Math.min(...n.map(p=>p[0])),s=Math.max(...n.map(p=>p[0])),o=Math.min(...n.map(p=>p[1])),a=Math.max(...n.map(p=>p[1])),c=Ue,l=i-c.left-c.right,d=t-c.top-c.bottom,h=Object.values(se).flatMap(p=>[p.A,p.B]).map(p=>(e.copy(qt(p[0],p[1],0)).project(ne),[(e.x+1)/2*i,(1-e.y)/2*t]));return{rwW:+((Math.max(...h.map(p=>p[0]))-Math.min(...h.map(p=>p[0])))/l).toFixed(2),rwH:+((Math.max(...h.map(p=>p[1]))-Math.min(...h.map(p=>p[1])))/d).toFixed(2),fillW:+((s-r)/l).toFixed(2),fillH:+((a-o)/d).toFixed(2),offX:+(((r+s)/2-(c.left+l/2))/l).toFixed(3),offY:+(((o+a)/2-(c.top+d/2))/d).toFixed(3)}},live:()=>({liveMode:ge,wantLive:Ur,n:pi.size,gen:Ze?.generated}),ghost(i){let t=it.clientWidth,e=it.clientHeight,n=new U,r=[];Rr.children.forEach(s=>{s.ghost&&(s.visible=i)});for(let s of(xd||[]).filter(o=>o.kind==="ghost"))for(let o of[.15,.25,.35]){let a=s.a||s.p?.[0],c=s.b||s.p?.[s.p.length-1];!a||!c||(n.copy(qt(a[0]+(c[0]-a[0])*o,a[1]+(c[1]-a[1])*o,0)).project(ne),r.push([(n.x+1)/2*t,(1-n.y)/2*e]))}return r}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
