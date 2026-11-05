(()=>{var Gi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Wi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},su=0,gh=1,ou=2;var xh=1,au=2,ri=3,_i=0,an=1,Ce=2,Xn=0,wi=1,Xi=2,vh=3,bh=4,lu=5,Ni=100,cu=101,hu=102,du=103,uu=104,pu=200,fu=201,mu=202,gu=203,ya=204,_a=205,xu=206,vu=207,bu=208,yu=209,_u=210,wu=211,Mu=212,Su=213,Eu=214,$a=0,qa=1,Ya=2,hr=3,Za=4,ja=5,Ja=6,Ka=7,Qa=0,Tu=1,Au=2,Mi=0,tl=1,el=2,nl=3,il=4,rl=5,sl=6,ol=7;var yh=300,xr=301,vr=302,al=303,ll=304,ho=306,wa=1e3,Ui=1001,Ma=1002,In=1003,Ru=1004;var uo=1005;var Vn=1006,cl=1007;var $i=1008;var $n=1009,_h=1010,wh=1011,ss=1012,hl=1013,qi=1014,si=1015,Pn=1016,dl=1017,ul=1018,os=1020,Mh=35902,Sh=35899,Eh=1021,Th=1022,Ln=1023,Yr=1026,as=1027,Ah=1028,pl=1029,Rh=1030,fl=1031;var ml=1033,po=33776,fo=33777,mo=33778,go=33779,gl=35840,xl=35841,vl=35842,bl=35843,yl=36196,_l=37492,wl=37496,Ml=37808,Sl=37809,El=37810,Tl=37811,Al=37812,Rl=37813,Cl=37814,Il=37815,Pl=37816,Ll=37817,Dl=37818,kl=37819,Ul=37820,Nl=37821,Fl=36492,Ol=36494,Bl=36495,zl=36283,Hl=36284,Vl=36285,Gl=36286;var Us=2300,Sa=2301,ba=2302,rh=2400,sh=2401,oh=2402;var Cu=3200,Iu=3201;var Ch=0,Pu=1,Si="",yn="srgb",dr="srgb-linear",Ns="linear",Qt="srgb";var cr=7680;var ah=519,Lu=512,Du=513,ku=514,Ih=515,Uu=516,Nu=517,Fu=518,Ou=519,lh=35044;var Ph="300 es",zn=2e3,Fs=2001;var ni=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let r=n[t];if(r!==void 0){let s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}},je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Id=1234567,$r=Math.PI/180,Zr=180/Math.PI;function ls(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(je[i&255]+je[i>>8&255]+je[i>>16&255]+je[i>>24&255]+"-"+je[t&255]+je[t>>8&255]+"-"+je[t>>16&15|64]+je[t>>24&255]+"-"+je[e&63|128]+je[e>>8&255]+"-"+je[e>>16&255]+je[e>>24&255]+je[n&255]+je[n>>8&255]+je[n>>16&255]+je[n>>24&255]).toLowerCase()}function Xt(i,t,e){return Math.max(t,Math.min(e,i))}function Lh(i,t){return(i%t+t)%t}function Mf(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function Sf(i,t,e){return i!==t?(e-i)/(t-i):0}function ks(i,t,e){return(1-e)*i+e*t}function Ef(i,t,e,n){return ks(i,t,1-Math.exp(-e*n))}function Tf(i,t=1){return t-Math.abs(Lh(i,t*2)-t)}function Af(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Rf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Cf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function If(i,t){return i+Math.random()*(t-i)}function Pf(i){return i*(.5-Math.random())}function Lf(i){i!==void 0&&(Id=i);let t=Id+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Df(i){return i*$r}function kf(i){return i*Zr}function Uf(i){return(i&i-1)===0&&i!==0}function Nf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ff(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Of(i,t,e,n,r){let s=Math.cos,o=Math.sin,a=s(e/2),c=o(e/2),l=s((t+n)/2),d=o((t+n)/2),h=s((t-n)/2),u=o((t-n)/2),p=s((n-t)/2),m=o((n-t)/2);switch(r){case"XYX":i.set(a*d,c*h,c*u,a*l);break;case"YZY":i.set(c*u,a*d,c*h,a*l);break;case"ZXZ":i.set(c*h,c*u,a*d,a*l);break;case"XZX":i.set(a*d,c*m,c*p,a*l);break;case"YXY":i.set(c*p,a*d,c*m,a*l);break;case"ZYZ":i.set(c*m,c*p,a*d,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Xr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function sn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var qn={DEG2RAD:$r,RAD2DEG:Zr,generateUUID:ls,clamp:Xt,euclideanModulo:Lh,mapLinear:Mf,inverseLerp:Sf,lerp:ks,damp:Ef,pingpong:Tf,smoothstep:Af,smootherstep:Rf,randInt:Cf,randFloat:If,randFloatSpread:Pf,seededRandom:Lf,degToRad:Df,radToDeg:kf,isPowerOfTwo:Uf,ceilPowerOfTwo:Nf,floorPowerOfTwo:Ff,setQuaternionFromProperEuler:Of,normalize:sn,denormalize:Xr},_t=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},un=class{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let c=n[r+0],l=n[r+1],d=n[r+2],h=n[r+3],u=s[o+0],p=s[o+1],m=s[o+2],x=s[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h;return}if(a===1){t[e+0]=u,t[e+1]=p,t[e+2]=m,t[e+3]=x;return}if(h!==x||c!==u||l!==p||d!==m){let g=1-a,f=c*u+l*p+d*m+h*x,S=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){let T=Math.sqrt(y),E=Math.atan2(T,f*S);g=Math.sin(g*E)/T,a=Math.sin(a*E)/T}let b=a*S;if(c=c*g+u*b,l=l*g+p*b,d=d*g+m*b,h=h*g+x*b,g===1-a){let T=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=T,l*=T,d*=T,h*=T}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,r,s,o){let a=n[r],c=n[r+1],l=n[r+2],d=n[r+3],h=s[o],u=s[o+1],p=s[o+2],m=s[o+3];return t[e]=a*m+d*h+c*p-l*u,t[e+1]=c*m+d*u+l*h-a*p,t[e+2]=l*m+d*p+a*u-c*h,t[e+3]=d*m-a*h-c*u-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),d=a(r/2),h=a(s/2),u=c(n/2),p=c(r/2),m=c(s/2);switch(o){case"XYZ":this._x=u*d*h+l*p*m,this._y=l*p*h-u*d*m,this._z=l*d*m+u*p*h,this._w=l*d*h-u*p*m;break;case"YXZ":this._x=u*d*h+l*p*m,this._y=l*p*h-u*d*m,this._z=l*d*m-u*p*h,this._w=l*d*h+u*p*m;break;case"ZXY":this._x=u*d*h-l*p*m,this._y=l*p*h+u*d*m,this._z=l*d*m+u*p*h,this._w=l*d*h-u*p*m;break;case"ZYX":this._x=u*d*h-l*p*m,this._y=l*p*h+u*d*m,this._z=l*d*m-u*p*h,this._w=l*d*h+u*p*m;break;case"YZX":this._x=u*d*h+l*p*m,this._y=l*p*h+u*d*m,this._z=l*d*m-u*p*h,this._w=l*d*h-u*p*m;break;case"XZY":this._x=u*d*h-l*p*m,this._y=l*p*h-u*d*m,this._z=l*d*m+u*p*h,this._w=l*d*h+u*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],d=e[6],h=e[10],u=n+a+h;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(d-c)*p,this._y=(s-l)*p,this._z=(o-r)*p}else if(n>a&&n>h){let p=2*Math.sqrt(1+n-a-h);this._w=(d-c)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+l)/p}else if(a>h){let p=2*Math.sqrt(1+a-n-h);this._w=(s-l)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(c+d)/p}else{let p=2*Math.sqrt(1+h-n-a);this._w=(o-r)/p,this._x=(s+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+o*a+r*l-s*c,this._y=r*d+o*c+s*a-n*l,this._z=s*d+o*l+n*c-r*a,this._w=o*d-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,r=this._y,s=this._z,o=this._w,a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*r+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}let l=Math.sqrt(c),d=Math.atan2(l,a),h=Math.sin((1-e)*d)/l,u=Math.sin(e*d)/l;return this._w=o*h+this._w*u,this._x=n*h+this._x*u,this._y=r*h+this._y*u,this._z=s*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Pd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Pd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*r-a*n),d=2*(a*e-s*r),h=2*(s*n-o*e);return this.x=e+c*l+o*h-a*d,this.y=n+c*d+a*l-s*h,this.z=r+c*h+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Pc.copy(this).projectOnVector(t),this.sub(Pc)}reflect(t){return this.sub(Pc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Pc=new L,Pd=new un,Vt=class i{constructor(t,e,n,r,s,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l)}set(t,e,n,r,s,o,a,c,l){let d=this.elements;return d[0]=t,d[1]=r,d[2]=a,d[3]=e,d[4]=s,d[5]=c,d[6]=n,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],d=n[4],h=n[7],u=n[2],p=n[5],m=n[8],x=r[0],g=r[3],f=r[6],S=r[1],y=r[4],b=r[7],T=r[2],E=r[5],R=r[8];return s[0]=o*x+a*S+c*T,s[3]=o*g+a*y+c*E,s[6]=o*f+a*b+c*R,s[1]=l*x+d*S+h*T,s[4]=l*g+d*y+h*E,s[7]=l*f+d*b+h*R,s[2]=u*x+p*S+m*T,s[5]=u*g+p*y+m*E,s[8]=u*f+p*b+m*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*a*l-n*s*d+n*a*c+r*s*l-r*o*c}invert(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],d=t[8],h=d*o-a*l,u=a*c-d*s,p=l*s-o*c,m=e*h+n*u+r*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=h*x,t[1]=(r*l-d*n)*x,t[2]=(a*n-r*o)*x,t[3]=u*x,t[4]=(d*e-r*c)*x,t[5]=(r*s-a*e)*x,t[6]=p*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*s)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-r*l,r*c,-r*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Lc.makeScale(t,e)),this}rotate(t){return this.premultiply(Lc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Lc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Lc=new Vt;function Dh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Os(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Bu(){let i=Os("canvas");return i.style.display="block",i}var Ld={};function jr(i){i in Ld||(Ld[i]=!0,console.warn(i))}function zu(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}var Dd=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kd=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bf(){let i={enabled:!0,workingColorSpace:dr,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Qt&&(r.r=yi(r.r),r.g=yi(r.g),r.b=yi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Qt&&(r.r=qr(r.r),r.g=qr(r.g),r.b=qr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Si?Ns:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return jr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return jr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dr]:{primaries:t,whitePoint:n,transfer:Ns,toXYZ:Dd,fromXYZ:kd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:yn},outputColorSpaceConfig:{drawingBufferColorSpace:yn}},[yn]:{primaries:t,whitePoint:n,transfer:Qt,toXYZ:Dd,fromXYZ:kd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:yn}}}),i}var Zt=Bf();function yi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function qr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Dr,Ea=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Dr===void 0&&(Dr=Os("canvas")),Dr.width=t.width,Dr.height=t.height;let r=Dr.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Dr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Os("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=yi(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(yi(e[n]/255)*255):e[n]=yi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},zf=0,Jr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=ls(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Dc(r[o].image)):s.push(Dc(r[o]))}else s=Dc(r);n.url=s}return e||(t.images[this.uuid]=n),n}};function Dc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ea.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Hf=0,kc=new L,pn=class i extends ni{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Ui,r=Ui,s=Vn,o=$i,a=Ln,c=$n,l=i.DEFAULT_ANISOTROPY,d=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=ls(),this.name="",this.source=new Jr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(kc).x}get height(){return this.source.getSize(kc).y}get depth(){return this.source.getSize(kc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==yh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case wa:t.x=t.x-Math.floor(t.x);break;case Ui:t.x=t.x<0?0:1;break;case Ma:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case wa:t.y=t.y-Math.floor(t.y);break;case Ui:t.y=t.y<0?0:1;break;case Ma:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};pn.DEFAULT_IMAGE=null;pn.DEFAULT_MAPPING=yh;pn.DEFAULT_ANISOTROPY=1;var ce=class i{constructor(t=0,e=0,n=0,r=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s,c=t.elements,l=c[0],d=c[4],h=c[8],u=c[1],p=c[5],m=c[9],x=c[2],g=c[6],f=c[10];if(Math.abs(d-u)<.01&&Math.abs(h-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let y=(l+1)/2,b=(p+1)/2,T=(f+1)/2,E=(d+u)/4,R=(h+x)/4,C=(m+g)/4;return y>b&&y>T?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=E/n,s=R/n):b>T?b<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),n=E/r,s=C/r):T<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),n=R/s,r=C/s),this.set(n,r,s,e),this}let S=Math.sqrt((g-m)*(g-m)+(h-x)*(h-x)+(u-d)*(u-d));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(h-x)/S,this.z=(u-d)/S,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ta=class extends ni{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ce(0,0,t,e),this.scissorTest=!1,this.viewport=new ce(0,0,t,e);let r={width:t,height:e,depth:n.depth},s=new pn(r);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Vn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let r=Object.assign({},t.textures[e].image);this.textures[e].source=new Jr(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qe=class extends Ta{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Bs=class extends pn{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=In,this.minFilter=In,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Aa=class extends pn{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=In,this.minFilter=In,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fi=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Fn):Fn.fromBufferAttribute(s,o),Fn.applyMatrix4(t.matrixWorld),this.expandByPoint(Fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xo.copy(n.boundingBox)),Xo.applyMatrix4(t.matrixWorld),this.union(Xo)}let r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Fn),Fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Rs),$o.subVectors(this.max,Rs),kr.subVectors(t.a,Rs),Ur.subVectors(t.b,Rs),Nr.subVectors(t.c,Rs),Ci.subVectors(Ur,kr),Ii.subVectors(Nr,Ur),sr.subVectors(kr,Nr);let e=[0,-Ci.z,Ci.y,0,-Ii.z,Ii.y,0,-sr.z,sr.y,Ci.z,0,-Ci.x,Ii.z,0,-Ii.x,sr.z,0,-sr.x,-Ci.y,Ci.x,0,-Ii.y,Ii.x,0,-sr.y,sr.x,0];return!Uc(e,kr,Ur,Nr,$o)||(e=[1,0,0,0,1,0,0,0,1],!Uc(e,kr,Ur,Nr,$o))?!1:(qo.crossVectors(Ci,Ii),e=[qo.x,qo.y,qo.z],Uc(e,kr,Ur,Nr,$o))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},fi=[new L,new L,new L,new L,new L,new L,new L,new L],Fn=new L,Xo=new Fi,kr=new L,Ur=new L,Nr=new L,Ci=new L,Ii=new L,sr=new L,Rs=new L,$o=new L,qo=new L,or=new L;function Uc(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){or.fromArray(i,s);let a=r.x*Math.abs(or.x)+r.y*Math.abs(or.y)+r.z*Math.abs(or.z),c=t.dot(or),l=e.dot(or),d=n.dot(or);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>a)return!1}return!0}var Vf=new Fi,Cs=new L,Nc=new L,Oi=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Vf.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cs.subVectors(t,this.center);let e=Cs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Cs,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Nc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cs.copy(t.center).add(Nc)),this.expandByPoint(Cs.copy(t.center).sub(Nc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},mi=new L,Fc=new L,Yo=new L,Pi=new L,Oc=new L,Zo=new L,Bc=new L,Bi=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,mi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=mi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(mi.copy(this.origin).addScaledVector(this.direction,e),mi.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Fc.copy(t).add(e).multiplyScalar(.5),Yo.copy(e).sub(t).normalize(),Pi.copy(this.origin).sub(Fc);let s=t.distanceTo(e)*.5,o=-this.direction.dot(Yo),a=Pi.dot(this.direction),c=-Pi.dot(Yo),l=Pi.lengthSq(),d=Math.abs(1-o*o),h,u,p,m;if(d>0)if(h=o*c-a,u=o*a-c,m=s*d,h>=0)if(u>=-m)if(u<=m){let x=1/d;h*=x,u*=x,p=h*(h+o*u+2*a)+u*(o*h+u+2*c)+l}else u=s,h=Math.max(0,-(o*u+a)),p=-h*h+u*(u+2*c)+l;else u=-s,h=Math.max(0,-(o*u+a)),p=-h*h+u*(u+2*c)+l;else u<=-m?(h=Math.max(0,-(-o*s+a)),u=h>0?-s:Math.min(Math.max(-s,-c),s),p=-h*h+u*(u+2*c)+l):u<=m?(h=0,u=Math.min(Math.max(-s,-c),s),p=u*(u+2*c)+l):(h=Math.max(0,-(o*s+a)),u=h>0?s:Math.min(Math.max(-s,-c),s),p=-h*h+u*(u+2*c)+l);else u=o>0?-s:s,h=Math.max(0,-(o*u+a)),p=-h*h+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Fc).addScaledVector(Yo,u),p}intersectSphere(t,e){mi.subVectors(t.center,this.origin);let n=mi.dot(this.direction),r=mi.dot(mi)-n*n,s=t.radius*t.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,c,l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,r=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,r=(t.min.x-u.x)*l),d>=0?(s=(t.min.y-u.y)*d,o=(t.max.y-u.y)*d):(s=(t.max.y-u.y)*d,o=(t.min.y-u.y)*d),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(t.min.z-u.z)*h,c=(t.max.z-u.z)*h):(a=(t.max.z-u.z)*h,c=(t.min.z-u.z)*h),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,mi)!==null}intersectTriangle(t,e,n,r,s){Oc.subVectors(e,t),Zo.subVectors(n,t),Bc.crossVectors(Oc,Zo);let o=this.direction.dot(Bc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Pi.subVectors(this.origin,t);let c=a*this.direction.dot(Zo.crossVectors(Pi,Zo));if(c<0)return null;let l=a*this.direction.dot(Oc.cross(Pi));if(l<0||c+l>o)return null;let d=-a*Pi.dot(Bc);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ve=class i{constructor(t,e,n,r,s,o,a,c,l,d,h,u,p,m,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l,d,h,u,p,m,x,g)}set(t,e,n,r,s,o,a,c,l,d,h,u,p,m,x,g){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=d,f[10]=h,f[14]=u,f[3]=p,f[7]=m,f[11]=x,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,r=1/Fr.setFromMatrixColumn(t,0).length(),s=1/Fr.setFromMatrixColumn(t,1).length(),o=1/Fr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){let u=o*d,p=o*h,m=a*d,x=a*h;e[0]=c*d,e[4]=-c*h,e[8]=l,e[1]=p+m*l,e[5]=u-x*l,e[9]=-a*c,e[2]=x-u*l,e[6]=m+p*l,e[10]=o*c}else if(t.order==="YXZ"){let u=c*d,p=c*h,m=l*d,x=l*h;e[0]=u+x*a,e[4]=m*a-p,e[8]=o*l,e[1]=o*h,e[5]=o*d,e[9]=-a,e[2]=p*a-m,e[6]=x+u*a,e[10]=o*c}else if(t.order==="ZXY"){let u=c*d,p=c*h,m=l*d,x=l*h;e[0]=u-x*a,e[4]=-o*h,e[8]=m+p*a,e[1]=p+m*a,e[5]=o*d,e[9]=x-u*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let u=o*d,p=o*h,m=a*d,x=a*h;e[0]=c*d,e[4]=m*l-p,e[8]=u*l+x,e[1]=c*h,e[5]=x*l+u,e[9]=p*l-m,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let u=o*c,p=o*l,m=a*c,x=a*l;e[0]=c*d,e[4]=x-u*h,e[8]=m*h+p,e[1]=h,e[5]=o*d,e[9]=-a*d,e[2]=-l*d,e[6]=p*h+m,e[10]=u-x*h}else if(t.order==="XZY"){let u=o*c,p=o*l,m=a*c,x=a*l;e[0]=c*d,e[4]=-h,e[8]=l*d,e[1]=u*h+x,e[5]=o*d,e[9]=p*h-m,e[2]=m*h-p,e[6]=a*d,e[10]=x*h+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Gf,t,Wf)}lookAt(t,e,n){let r=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Li.crossVectors(n,vn),Li.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Li.crossVectors(n,vn)),Li.normalize(),jo.crossVectors(vn,Li),r[0]=Li.x,r[4]=jo.x,r[8]=vn.x,r[1]=Li.y,r[5]=jo.y,r[9]=vn.y,r[2]=Li.z,r[6]=jo.z,r[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],d=n[1],h=n[5],u=n[9],p=n[13],m=n[2],x=n[6],g=n[10],f=n[14],S=n[3],y=n[7],b=n[11],T=n[15],E=r[0],R=r[4],C=r[8],v=r[12],w=r[1],I=r[5],k=r[9],z=r[13],G=r[2],B=r[6],H=r[10],W=r[14],O=r[3],nt=r[7],tt=r[11],rt=r[15];return s[0]=o*E+a*w+c*G+l*O,s[4]=o*R+a*I+c*B+l*nt,s[8]=o*C+a*k+c*H+l*tt,s[12]=o*v+a*z+c*W+l*rt,s[1]=d*E+h*w+u*G+p*O,s[5]=d*R+h*I+u*B+p*nt,s[9]=d*C+h*k+u*H+p*tt,s[13]=d*v+h*z+u*W+p*rt,s[2]=m*E+x*w+g*G+f*O,s[6]=m*R+x*I+g*B+f*nt,s[10]=m*C+x*k+g*H+f*tt,s[14]=m*v+x*z+g*W+f*rt,s[3]=S*E+y*w+b*G+T*O,s[7]=S*R+y*I+b*B+T*nt,s[11]=S*C+y*k+b*H+T*tt,s[15]=S*v+y*z+b*W+T*rt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],d=t[2],h=t[6],u=t[10],p=t[14],m=t[3],x=t[7],g=t[11],f=t[15];return m*(+s*c*h-r*l*h-s*a*u+n*l*u+r*a*p-n*c*p)+x*(+e*c*p-e*l*u+s*o*u-r*o*p+r*l*d-s*c*d)+g*(+e*l*h-e*a*p-s*o*h+n*o*p+s*a*d-n*l*d)+f*(-r*a*d-e*c*h+e*a*u+r*o*h-n*o*u+n*c*d)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],d=t[8],h=t[9],u=t[10],p=t[11],m=t[12],x=t[13],g=t[14],f=t[15],S=h*g*l-x*u*l+x*c*p-a*g*p-h*c*f+a*u*f,y=m*u*l-d*g*l-m*c*p+o*g*p+d*c*f-o*u*f,b=d*x*l-m*h*l+m*a*p-o*x*p-d*a*f+o*h*f,T=m*h*c-d*x*c-m*a*u+o*x*u+d*a*g-o*h*g,E=e*S+n*y+r*b+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/E;return t[0]=S*R,t[1]=(x*u*s-h*g*s-x*r*p+n*g*p+h*r*f-n*u*f)*R,t[2]=(a*g*s-x*c*s+x*r*l-n*g*l-a*r*f+n*c*f)*R,t[3]=(h*c*s-a*u*s-h*r*l+n*u*l+a*r*p-n*c*p)*R,t[4]=y*R,t[5]=(d*g*s-m*u*s+m*r*p-e*g*p-d*r*f+e*u*f)*R,t[6]=(m*c*s-o*g*s-m*r*l+e*g*l+o*r*f-e*c*f)*R,t[7]=(o*u*s-d*c*s+d*r*l-e*u*l-o*r*p+e*c*p)*R,t[8]=b*R,t[9]=(m*h*s-d*x*s-m*n*p+e*x*p+d*n*f-e*h*f)*R,t[10]=(o*x*s-m*a*s+m*n*l-e*x*l-o*n*f+e*a*f)*R,t[11]=(d*a*s-o*h*s-d*n*l+e*h*l+o*n*p-e*a*p)*R,t[12]=T*R,t[13]=(d*x*r-m*h*r+m*n*u-e*x*u-d*n*g+e*h*g)*R,t[14]=(m*a*r-o*x*r-m*n*c+e*x*c+o*n*g-e*a*g)*R,t[15]=(o*h*r-d*a*r+d*n*c-e*h*c-o*n*u+e*a*u)*R,this}scale(t){let e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,c=t.z,l=s*o,d=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,d*a+n,d*c-r*o,0,l*c-r*a,d*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){let r=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,d=o+o,h=a+a,u=s*l,p=s*d,m=s*h,x=o*d,g=o*h,f=a*h,S=c*l,y=c*d,b=c*h,T=n.x,E=n.y,R=n.z;return r[0]=(1-(x+f))*T,r[1]=(p+b)*T,r[2]=(m-y)*T,r[3]=0,r[4]=(p-b)*E,r[5]=(1-(u+f))*E,r[6]=(g+S)*E,r[7]=0,r[8]=(m+y)*R,r[9]=(g-S)*R,r[10]=(1-(u+x))*R,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){let r=this.elements,s=Fr.set(r[0],r[1],r[2]).length(),o=Fr.set(r[4],r[5],r[6]).length(),a=Fr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],On.copy(this);let l=1/s,d=1/o,h=1/a;return On.elements[0]*=l,On.elements[1]*=l,On.elements[2]*=l,On.elements[4]*=d,On.elements[5]*=d,On.elements[6]*=d,On.elements[8]*=h,On.elements[9]*=h,On.elements[10]*=h,e.setFromRotationMatrix(On),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=zn,c=!1){let l=this.elements,d=2*s/(e-t),h=2*s/(n-r),u=(e+t)/(e-t),p=(n+r)/(n-r),m,x;if(c)m=s/(o-s),x=o*s/(o-s);else if(a===zn)m=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===Fs)m=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=d,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=zn,c=!1){let l=this.elements,d=2/(e-t),h=2/(n-r),u=-(e+t)/(e-t),p=-(n+r)/(n-r),m,x;if(c)m=1/(o-s),x=o/(o-s);else if(a===zn)m=-2/(o-s),x=-(o+s)/(o-s);else if(a===Fs)m=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=d,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Fr=new L,On=new ve,Gf=new L(0,0,0),Wf=new L(1,1,1),Li=new L,jo=new L,vn=new L,Ud=new ve,Nd=new un,Gn=class i{constructor(t=0,e=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let r=t.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],d=r[9],h=r[2],u=r[6],p=r[10];switch(e){case"XYZ":this._y=Math.asin(Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Xt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ud.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ud,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Nd.setFromEuler(this),this.setFromQuaternion(Nd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Gn.DEFAULT_ORDER="XYZ";var zs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Xf=0,Fd=new L,Or=new un,gi=new ve,Jo=new L,Is=new L,$f=new L,qf=new un,Od=new L(1,0,0),Bd=new L(0,1,0),zd=new L(0,0,1),Hd={type:"added"},Yf={type:"removed"},Br={type:"childadded",child:null},zc={type:"childremoved",child:null},Ge=class i extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=ls(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new L,e=new Gn,n=new un,r=new L(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ve},normalMatrix:{value:new Vt}}),this.matrix=new ve,this.matrixWorld=new ve,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Or.setFromAxisAngle(t,e),this.quaternion.multiply(Or),this}rotateOnWorldAxis(t,e){return Or.setFromAxisAngle(t,e),this.quaternion.premultiply(Or),this}rotateX(t){return this.rotateOnAxis(Od,t)}rotateY(t){return this.rotateOnAxis(Bd,t)}rotateZ(t){return this.rotateOnAxis(zd,t)}translateOnAxis(t,e){return Fd.copy(t).applyQuaternion(this.quaternion),this.position.add(Fd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Od,t)}translateY(t){return this.translateOnAxis(Bd,t)}translateZ(t){return this.translateOnAxis(zd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Jo.copy(t):Jo.set(t,e,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(Is,Jo,this.up):gi.lookAt(Jo,Is,this.up),this.quaternion.setFromRotationMatrix(gi),r&&(gi.extractRotation(r.matrixWorld),Or.setFromRotationMatrix(gi),this.quaternion.premultiply(Or.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Hd),Br.child=t,this.dispatchEvent(Br),Br.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yf),zc.child=t,this.dispatchEvent(zc),zc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gi.multiply(t.parent.matrixWorld)),t.applyMatrix4(gi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Hd),Br.child=t,this.dispatchEvent(Br),Br.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,t,$f),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,qf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){let h=c[l];s(t.shapes,h)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];r.animations.push(s(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),h=o(t.shapes),u=o(t.skeletons),p=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),m.length>0&&(n.nodes=m)}return n.object=r,n;function o(a){let c=[];for(let l in a){let d=a[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let r=t.children[n];this.add(r.clone())}return this}};Ge.DEFAULT_UP=new L(0,1,0);Ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bn=new L,xi=new L,Hc=new L,vi=new L,zr=new L,Hr=new L,Vd=new L,Vc=new L,Gc=new L,Wc=new L,Xc=new ce,$c=new ce,qc=new ce,bi=class i{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),Bn.subVectors(t,e),r.cross(Bn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){Bn.subVectors(r,e),xi.subVectors(n,e),Hc.subVectors(t,e);let o=Bn.dot(Bn),a=Bn.dot(xi),c=Bn.dot(Hc),l=xi.dot(xi),d=xi.dot(Hc),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;let u=1/h,p=(l*c-a*d)*u,m=(o*d-a*c)*u;return s.set(1-p-m,m,p)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(t,e,n,r,s,o,a,c){return this.getBarycoord(t,e,n,r,vi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,vi.x),c.addScaledVector(o,vi.y),c.addScaledVector(a,vi.z),c)}static getInterpolatedAttribute(t,e,n,r,s,o){return Xc.setScalar(0),$c.setScalar(0),qc.setScalar(0),Xc.fromBufferAttribute(t,e),$c.fromBufferAttribute(t,n),qc.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(Xc,s.x),o.addScaledVector($c,s.y),o.addScaledVector(qc,s.z),o}static isFrontFacing(t,e,n,r){return Bn.subVectors(n,e),xi.subVectors(t,e),Bn.cross(xi).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bn.subVectors(this.c,this.b),xi.subVectors(this.a,this.b),Bn.cross(xi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return i.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,r=this.b,s=this.c,o,a;zr.subVectors(r,n),Hr.subVectors(s,n),Vc.subVectors(t,n);let c=zr.dot(Vc),l=Hr.dot(Vc);if(c<=0&&l<=0)return e.copy(n);Gc.subVectors(t,r);let d=zr.dot(Gc),h=Hr.dot(Gc);if(d>=0&&h<=d)return e.copy(r);let u=c*h-d*l;if(u<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(n).addScaledVector(zr,o);Wc.subVectors(t,s);let p=zr.dot(Wc),m=Hr.dot(Wc);if(m>=0&&p<=m)return e.copy(s);let x=p*l-c*m;if(x<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(n).addScaledVector(Hr,a);let g=d*m-p*h;if(g<=0&&h-d>=0&&p-m>=0)return Vd.subVectors(s,r),a=(h-d)/(h-d+(p-m)),e.copy(r).addScaledVector(Vd,a);let f=1/(g+x+u);return o=x*f,a=u*f,e.copy(n).addScaledVector(zr,o).addScaledVector(Hr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Hu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},Ko={h:0,s:0,l:0};function Yc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Pt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=yn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=Zt.workingColorSpace){if(t=Lh(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Yc(o,s,t+1/3),this.g=Yc(o,s,t),this.b=Yc(o,s,t-1/3)}return Zt.colorSpaceToWorking(this,r),this}setStyle(t,e=yn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=yn){let n=Hu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=yi(t.r),this.g=yi(t.g),this.b=yi(t.b),this}copyLinearToSRGB(t){return this.r=qr(t.r),this.g=qr(t.g),this.b=qr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=yn){return Zt.workingToColorSpace(Je.copy(this),t),Math.round(Xt(Je.r*255,0,255))*65536+Math.round(Xt(Je.g*255,0,255))*256+Math.round(Xt(Je.b*255,0,255))}getHexString(t=yn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.workingToColorSpace(Je.copy(this),e);let n=Je.r,r=Je.g,s=Je.b,o=Math.max(n,r,s),a=Math.min(n,r,s),c,l,d=(a+o)/2;if(a===o)c=0,l=0;else{let h=o-a;switch(l=d<=.5?h/(o+a):h/(2-o-a),o){case n:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-n)/h+2;break;case s:c=(n-r)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Zt.workingColorSpace){return Zt.workingToColorSpace(Je.copy(this),e),t.r=Je.r,t.g=Je.g,t.b=Je.b,t}getStyle(t=yn){Zt.workingToColorSpace(Je.copy(this),t);let e=Je.r,n=Je.g,r=Je.b;return t!==yn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Di),this.setHSL(Di.h+t,Di.s+e,Di.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Di),t.getHSL(Ko);let n=ks(Di.h,Ko.h,e),r=ks(Di.s,Ko.s,e),s=ks(Di.l,Ko.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Je=new Pt;Pt.NAMES=Hu;var Zf=0,ii=class extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=ls(),this.name="",this.type="Material",this.blending=wi,this.side=_i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ya,this.blendDst=_a,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ah,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=cr,this.stencilZFail=cr,this.stencilZPass=cr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==wi&&(n.blending=this.blending),this.side!==_i&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ya&&(n.blendSrc=this.blendSrc),this.blendDst!==_a&&(n.blendDst=this.blendDst),this.blendEquation!==Ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ah&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==cr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==cr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==cr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(e){let s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},We=class extends ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=Qa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ue=new L,Qo=new _t,jf=0,on=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=lh,this.updateRanges=[],this.gpuType=si,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Qo.fromBufferAttribute(this,e),Qo.applyMatrix3(t),this.setXY(e,Qo.x,Qo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=sn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xr(e,this.array)),e}setX(t,e){return this.normalized&&(e=sn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xr(e,this.array)),e}setY(t,e){return this.normalized&&(e=sn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=sn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xr(e,this.array)),e}setW(t,e){return this.normalized&&(e=sn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=sn(e,this.array),n=sn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=sn(e,this.array),n=sn(n,this.array),r=sn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=sn(e,this.array),n=sn(n,this.array),r=sn(r,this.array),s=sn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==lh&&(t.usage=this.usage),t}};var Hs=class extends on{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Vs=class extends on{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var le=class extends on{constructor(t,e,n){super(new Float32Array(t),e,n)}},Jf=0,Rn=new ve,Zc=new Ge,Vr=new L,bn=new Fi,Ps=new Fi,Ve=new L,Ne=class i extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=ls(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Dh(t)?Vs:Hs)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Vt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Rn.makeRotationFromQuaternion(t),this.applyMatrix4(Rn),this}rotateX(t){return Rn.makeRotationX(t),this.applyMatrix4(Rn),this}rotateY(t){return Rn.makeRotationY(t),this.applyMatrix4(Rn),this}rotateZ(t){return Rn.makeRotationZ(t),this.applyMatrix4(Rn),this}translate(t,e,n){return Rn.makeTranslation(t,e,n),this.applyMatrix4(Rn),this}scale(t,e,n){return Rn.makeScale(t,e,n),this.applyMatrix4(Rn),this}lookAt(t){return Zc.lookAt(t),Zc.updateMatrix(),this.applyMatrix4(Zc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vr).negate(),this.translate(Vr.x,Vr.y,Vr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let r=0,s=t.length;r<s;r++){let o=t[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new le(n,3))}else{let n=Math.min(t.length,e.count);for(let r=0;r<n;r++){let s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){let s=e[n];bn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ve.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Ve),Ve.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Ve)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(bn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){let a=e[s];Ps.setFromBufferAttribute(a),this.morphTargetsRelative?(Ve.addVectors(bn.min,Ps.min),bn.expandByPoint(Ve),Ve.addVectors(bn.max,Ps.max),bn.expandByPoint(Ve)):(bn.expandByPoint(Ps.min),bn.expandByPoint(Ps.max))}bn.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)Ve.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Ve));if(e)for(let s=0,o=e.length;s<o;s++){let a=e[s],c=this.morphTargetsRelative;for(let l=0,d=a.count;l<d;l++)Ve.fromBufferAttribute(a,l),c&&(Vr.fromBufferAttribute(t,l),Ve.add(Vr)),r=Math.max(r,n.distanceToSquared(Ve))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<n.count;C++)a[C]=new L,c[C]=new L;let l=new L,d=new L,h=new L,u=new _t,p=new _t,m=new _t,x=new L,g=new L;function f(C,v,w){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,v),h.fromBufferAttribute(n,w),u.fromBufferAttribute(s,C),p.fromBufferAttribute(s,v),m.fromBufferAttribute(s,w),d.sub(l),h.sub(l),p.sub(u),m.sub(u);let I=1/(p.x*m.y-m.x*p.y);isFinite(I)&&(x.copy(d).multiplyScalar(m.y).addScaledVector(h,-p.y).multiplyScalar(I),g.copy(h).multiplyScalar(p.x).addScaledVector(d,-m.x).multiplyScalar(I),a[C].add(x),a[v].add(x),a[w].add(x),c[C].add(g),c[v].add(g),c[w].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let C=0,v=S.length;C<v;++C){let w=S[C],I=w.start,k=w.count;for(let z=I,G=I+k;z<G;z+=3)f(t.getX(z+0),t.getX(z+1),t.getX(z+2))}let y=new L,b=new L,T=new L,E=new L;function R(C){T.fromBufferAttribute(r,C),E.copy(T);let v=a[C];y.copy(v),y.sub(T.multiplyScalar(T.dot(v))).normalize(),b.crossVectors(E,v);let I=b.dot(c[C])<0?-1:1;o.setXYZW(C,y.x,y.y,y.z,I)}for(let C=0,v=S.length;C<v;++C){let w=S[C],I=w.start,k=w.count;for(let z=I,G=I+k;z<G;z+=3)R(t.getX(z+0)),R(t.getX(z+1)),R(t.getX(z+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new on(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);let r=new L,s=new L,o=new L,a=new L,c=new L,l=new L,d=new L,h=new L;if(t)for(let u=0,p=t.count;u<p;u+=3){let m=t.getX(u+0),x=t.getX(u+1),g=t.getX(u+2);r.fromBufferAttribute(e,m),s.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),a.add(d),c.add(d),l.add(d),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let u=0,p=e.count;u<p;u+=3)r.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ve.fromBufferAttribute(t,e),Ve.normalize(),t.setXYZ(e,Ve.x,Ve.y,Ve.z)}toNonIndexed(){function t(a,c){let l=a.array,d=a.itemSize,h=a.normalized,u=new l.constructor(c.length*d),p=0,m=0;for(let x=0,g=c.length;x<g;x++){a.isInterleavedBufferAttribute?p=c[x]*a.data.stride+a.offset:p=c[x]*d;for(let f=0;f<d;f++)u[m++]=l[p++]}return new on(u,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,r=this.attributes;for(let a in r){let c=r[a],l=t(c,n);e.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let d=0,h=l.length;d<h;d++){let u=l[d],p=t(u,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let r={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],d=[];for(let h=0,u=l.length;h<u;h++){let p=l[h];d.push(p.toJSON(t.data))}d.length>0&&(r[c]=d,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let r=t.attributes;for(let l in r){let d=r[l];this.setAttribute(l,d.clone(e))}let s=t.morphAttributes;for(let l in s){let d=[],h=s[l];for(let u=0,p=h.length;u<p;u++)d.push(h[u].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,d=o.length;l<d;l++){let h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gd=new ve,ar=new Bi,ta=new Oi,Wd=new L,ea=new L,na=new L,ia=new L,jc=new L,ra=new L,Xd=new L,sa=new L,fe=class extends Ge{constructor(t=new Ne,e=new We){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);let a=this.morphTargetInfluences;if(s&&a){ra.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let d=a[c],h=s[c];d!==0&&(jc.fromBufferAttribute(h,t),o?ra.addScaledVector(jc,d):ra.addScaledVector(jc.sub(e),d))}e.add(ra)}return e}raycast(t,e){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ta.copy(n.boundingSphere),ta.applyMatrix4(s),ar.copy(t.ray).recast(t.near),!(ta.containsPoint(ar.origin)===!1&&(ar.intersectSphere(ta,Wd)===null||ar.origin.distanceToSquared(Wd)>(t.far-t.near)**2))&&(Gd.copy(s).invert(),ar.copy(t.ray).applyMatrix4(Gd),!(n.boundingBox!==null&&ar.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ar)))}_computeIntersections(t,e,n){let r,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,u=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=u.length;m<x;m++){let g=u[m],f=o[g.materialIndex],S=Math.max(g.start,p.start),y=Math.min(a.count,Math.min(g.start+g.count,p.start+p.count));for(let b=S,T=y;b<T;b+=3){let E=a.getX(b),R=a.getX(b+1),C=a.getX(b+2);r=oa(this,f,t,n,l,d,h,E,R,C),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{let m=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let g=m,f=x;g<f;g+=3){let S=a.getX(g),y=a.getX(g+1),b=a.getX(g+2);r=oa(this,o,t,n,l,d,h,S,y,b),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,x=u.length;m<x;m++){let g=u[m],f=o[g.materialIndex],S=Math.max(g.start,p.start),y=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let b=S,T=y;b<T;b+=3){let E=b,R=b+1,C=b+2;r=oa(this,f,t,n,l,d,h,E,R,C),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=g.materialIndex,e.push(r))}}else{let m=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let g=m,f=x;g<f;g+=3){let S=g,y=g+1,b=g+2;r=oa(this,o,t,n,l,d,h,S,y,b),r&&(r.faceIndex=Math.floor(g/3),e.push(r))}}}};function Kf(i,t,e,n,r,s,o,a){let c;if(t.side===an?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,t.side===_i,a),c===null)return null;sa.copy(a),sa.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(sa);return l<e.near||l>e.far?null:{distance:l,point:sa.clone(),object:i}}function oa(i,t,e,n,r,s,o,a,c,l){i.getVertexPosition(a,ea),i.getVertexPosition(c,na),i.getVertexPosition(l,ia);let d=Kf(i,t,e,n,ea,na,ia,Xd);if(d){let h=new L;bi.getBarycoord(Xd,ea,na,ia,h),r&&(d.uv=bi.getInterpolatedAttribute(r,a,c,l,h,new _t)),s&&(d.uv1=bi.getInterpolatedAttribute(s,a,c,l,h,new _t)),o&&(d.normal=bi.getInterpolatedAttribute(o,a,c,l,h,new L),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let u={a,b:c,c:l,normal:new L,materialIndex:0};bi.getNormal(ea,na,ia,u.normal),d.face=u,d.barycoord=h}return d}var Kr=class i extends Ne{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],d=[],h=[],u=0,p=0;m("z","y","x",-1,-1,n,e,t,o,s,0),m("z","y","x",1,-1,n,e,-t,o,s,1),m("x","z","y",1,1,t,n,e,r,o,2),m("x","z","y",1,-1,t,n,-e,r,o,3),m("x","y","z",1,-1,t,e,n,r,s,4),m("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(d,3)),this.setAttribute("uv",new le(h,2));function m(x,g,f,S,y,b,T,E,R,C,v){let w=b/R,I=T/C,k=b/2,z=T/2,G=E/2,B=R+1,H=C+1,W=0,O=0,nt=new L;for(let tt=0;tt<H;tt++){let rt=tt*I-z;for(let It=0;It<B;It++){let Wt=It*w-k;nt[x]=Wt*S,nt[g]=rt*y,nt[f]=G,l.push(nt.x,nt.y,nt.z),nt[x]=0,nt[g]=0,nt[f]=E>0?1:-1,d.push(nt.x,nt.y,nt.z),h.push(It/R),h.push(1-tt/C),W+=1}}for(let tt=0;tt<C;tt++)for(let rt=0;rt<R;rt++){let It=u+rt+B*tt,Wt=u+rt+B*(tt+1),gt=u+(rt+1)+B*(tt+1),ft=u+(rt+1)+B*tt;c.push(It,Wt,ft),c.push(Wt,gt,ft),O+=6}a.addGroup(p,O,v),p+=O,u+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function br(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function tn(i){let t={};for(let e=0;e<i.length;e++){let n=br(i[e]);for(let r in n)t[r]=n[r]}return t}function Qf(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function kh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}var Yn={clone:br,merge:tn},tm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,em=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Re=class extends ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tm,this.fragmentShader=em,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=br(t.uniforms),this.uniformsGroups=Qf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Gs=class extends Ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ve,this.projectionMatrix=new ve,this.projectionMatrixInverse=new ve,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ki=new L,$d=new _t,qd=new _t,Ke=class extends Gs{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Zr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan($r*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Zr*2*Math.atan(Math.tan($r*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ki.x,ki.y).multiplyScalar(-t/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-t/ki.z)}getViewSize(t,e){return this.getViewBounds(t,$d,qd),e.subVectors(qd,$d)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan($r*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,e-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Gr=-90,Wr=1,Ra=class extends Ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ke(Gr,Wr,t,e);r.layers=this.layers,this.add(r);let s=new Ke(Gr,Wr,t,e);s.layers=this.layers,this.add(s);let o=new Ke(Gr,Wr,t,e);o.layers=this.layers,this.add(o);let a=new Ke(Gr,Wr,t,e);a.layers=this.layers,this.add(a);let c=new Ke(Gr,Wr,t,e);c.layers=this.layers,this.add(c);let l=new Ke(Gr,Wr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,c]=e;for(let l of e)this.remove(l);if(t===zn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Fs)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,d]=this.children,h=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,r),t.render(e,d),t.setRenderTarget(h,u,p),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Ws=class extends pn{constructor(t=[],e=xr,n,r,s,o,a,c,l,d){super(t,e,n,r,s,o,a,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ca=class extends Qe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Ws(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Kr(5,5,5),s=new Re({name:"CubemapFromEquirect",uniforms:br(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:an,blending:Xn});s.uniforms.tEquirect.value=e;let o=new fe(r,s),a=e.minFilter;return e.minFilter===$i&&(e.minFilter=Vn),new Ra(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){let s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}},Hn=class extends Ge{constructor(){super(),this.isGroup=!0,this.type="Group"}},nm={type:"move"},Qr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,n),f=this._getHandJoint(l,x);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],u=d.position.distanceTo(h.position),p=.02,m=.005;l.inputState.pinching&&u>p+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=p-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(nm)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Hn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Xs=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Pt(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var $s=class extends Ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gn,this.environmentIntensity=1,this.environmentRotation=new Gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var Jc=new L,im=new L,rm=new Vt,Cn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let r=Jc.subVectors(n,e).cross(im.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Jc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||rm.getNormalMatrix(t),r=this.coplanarPoint(Jc).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},lr=new Oi,sm=new _t(.5,.5),aa=new L,ts=class{constructor(t=new Cn,e=new Cn,n=new Cn,r=new Cn,s=new Cn,o=new Cn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=zn,n=!1){let r=this.planes,s=t.elements,o=s[0],a=s[1],c=s[2],l=s[3],d=s[4],h=s[5],u=s[6],p=s[7],m=s[8],x=s[9],g=s[10],f=s[11],S=s[12],y=s[13],b=s[14],T=s[15];if(r[0].setComponents(l-o,p-d,f-m,T-S).normalize(),r[1].setComponents(l+o,p+d,f+m,T+S).normalize(),r[2].setComponents(l+a,p+h,f+x,T+y).normalize(),r[3].setComponents(l-a,p-h,f-x,T-y).normalize(),n)r[4].setComponents(c,u,g,b).normalize(),r[5].setComponents(l-c,p-u,f-g,T-b).normalize();else if(r[4].setComponents(l-c,p-u,f-g,T-b).normalize(),e===zn)r[5].setComponents(l+c,p+u,f+g,T+b).normalize();else if(e===Fs)r[5].setComponents(c,u,g,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),lr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),lr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(lr)}intersectsSprite(t){lr.center.set(0,0,0);let e=sm.distanceTo(t.center);return lr.radius=.7071067811865476+e,lr.applyMatrix4(t.matrixWorld),this.intersectsSphere(lr)}intersectsSphere(t){let e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let r=e[n];if(aa.x=r.normal.x>0?t.max.x:t.min.x,aa.y=r.normal.y>0?t.max.y:t.min.y,aa.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(aa)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var _n=class extends ii{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Ia=new L,Pa=new L,Yd=new ve,Ls=new Bi,la=new Oi,Kc=new L,Zd=new L,es=class extends Ge{constructor(t=new Ne,e=new _n){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let r=1,s=e.count;r<s;r++)Ia.fromBufferAttribute(e,r-1),Pa.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=Ia.distanceTo(Pa);t.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),la.copy(n.boundingSphere),la.applyMatrix4(r),la.radius+=s,t.ray.intersectsSphere(la)===!1)return;Yd.copy(r).invert(),Ls.copy(t.ray).applyMatrix4(Yd);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,d=n.index,u=n.attributes.position;if(d!==null){let p=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let x=p,g=m-1;x<g;x+=l){let f=d.getX(x),S=d.getX(x+1),y=ca(this,t,Ls,c,f,S,x);y&&e.push(y)}if(this.isLineLoop){let x=d.getX(m-1),g=d.getX(p),f=ca(this,t,Ls,c,x,g,m-1);f&&e.push(f)}}else{let p=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let x=p,g=m-1;x<g;x+=l){let f=ca(this,t,Ls,c,x,x+1,x);f&&e.push(f)}if(this.isLineLoop){let x=ca(this,t,Ls,c,m-1,p,m-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function ca(i,t,e,n,r,s,o){let a=i.geometry.attributes.position;if(Ia.fromBufferAttribute(a,r),Pa.fromBufferAttribute(a,s),e.distanceSqToSegment(Ia,Pa,Kc,Zd)>n)return;Kc.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Kc);if(!(l<t.near||l>t.far))return{distance:l,point:Zd.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var jd=new L,Jd=new L,Wn=class extends es{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let r=0,s=e.count;r<s;r+=2)jd.fromBufferAttribute(e,r),Jd.fromBufferAttribute(e,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+jd.distanceTo(Jd);t.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var La=class extends ii{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Kd=new ve,ch=new Bi,ha=new Oi,da=new L,qs=class extends Ge{constructor(t=new Ne,e=new La){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ha.copy(n.boundingSphere),ha.applyMatrix4(r),ha.radius+=s,t.ray.intersectsSphere(ha)===!1)return;Kd.copy(r).invert(),ch.copy(t.ray).applyMatrix4(Kd);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){let u=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let m=u,x=p;m<x;m++){let g=l.getX(m);da.fromBufferAttribute(h,g),Qd(da,g,c,r,t,e,this)}}else{let u=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let m=u,x=p;m<x;m++)da.fromBufferAttribute(h,m),Qd(da,m,c,r,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Qd(i,t,e,n,r,s,o){let a=ch.distanceSqToPoint(i);if(a<e){let c=new L;ch.closestPointToPoint(i,c),c.applyMatrix4(n);let l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Ys=class extends pn{constructor(t,e,n,r,s,o,a,c,l){super(t,e,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Zs=class extends pn{constructor(t,e,n=qi,r,s,o,a=In,c=In,l,d=Yr,h=1){if(d!==Yr&&d!==as)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:h};super(u,r,s,o,a,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Jr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},js=class extends pn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Js=class i extends Ne{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};let l=this;r=Math.floor(r),s=Math.floor(s);let d=[],h=[],u=[],p=[],m=0,x=[],g=n/2,f=0;S(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(d),this.setAttribute("position",new le(h,3)),this.setAttribute("normal",new le(u,3)),this.setAttribute("uv",new le(p,2));function S(){let b=new L,T=new L,E=0,R=(e-t)/n;for(let C=0;C<=s;C++){let v=[],w=C/s,I=w*(e-t)+t;for(let k=0;k<=r;k++){let z=k/r,G=z*c+a,B=Math.sin(G),H=Math.cos(G);T.x=I*B,T.y=-w*n+g,T.z=I*H,h.push(T.x,T.y,T.z),b.set(B,R,H).normalize(),u.push(b.x,b.y,b.z),p.push(z,1-w),v.push(m++)}x.push(v)}for(let C=0;C<r;C++)for(let v=0;v<s;v++){let w=x[v][C],I=x[v+1][C],k=x[v+1][C+1],z=x[v][C+1];(t>0||v!==0)&&(d.push(w,I,z),E+=3),(e>0||v!==s-1)&&(d.push(I,k,z),E+=3)}l.addGroup(f,E,0),f+=E}function y(b){let T=m,E=new _t,R=new L,C=0,v=b===!0?t:e,w=b===!0?1:-1;for(let k=1;k<=r;k++)h.push(0,g*w,0),u.push(0,w,0),p.push(.5,.5),m++;let I=m;for(let k=0;k<=r;k++){let G=k/r*c+a,B=Math.cos(G),H=Math.sin(G);R.x=v*H,R.y=g*w,R.z=v*B,h.push(R.x,R.y,R.z),u.push(0,w,0),E.x=B*.5+.5,E.y=H*.5*w+.5,p.push(E.x,E.y),m++}for(let k=0;k<r;k++){let z=T+k,G=I+k;b===!0?d.push(G,G+1,z):d.push(G+1,G,z),C+=3}l.addGroup(f,C,b===!0?1:2),f+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ua=new L,pa=new L,Qc=new L,fa=new bi,Ks=class extends Ne{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let r=Math.pow(10,4),s=Math.cos($r*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],d=["a","b","c"],h=new Array(3),u={},p=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);let{a:x,b:g,c:f}=fa;if(x.fromBufferAttribute(a,l[0]),g.fromBufferAttribute(a,l[1]),f.fromBufferAttribute(a,l[2]),fa.getNormal(Qc),h[0]=`${Math.round(x.x*r)},${Math.round(x.y*r)},${Math.round(x.z*r)}`,h[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,h[2]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let S=0;S<3;S++){let y=(S+1)%3,b=h[S],T=h[y],E=fa[d[S]],R=fa[d[y]],C=`${b}_${T}`,v=`${T}_${b}`;v in u&&u[v]?(Qc.dot(u[v].normal)<=s&&(p.push(E.x,E.y,E.z),p.push(R.x,R.y,R.z)),u[v]=null):C in u||(u[C]={index0:l[S],index1:l[y],normal:Qc.clone()})}}for(let m in u)if(u[m]){let{index0:x,index1:g}=u[m];ua.fromBufferAttribute(a,x),pa.fromBufferAttribute(a,g),p.push(ua.x,ua.y,ua.z),p.push(pa.x,pa.y,pa.z)}this.setAttribute("position",new le(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}},Da=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),r=0,s=n.length,o;e?o=e:o=t*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=n[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===o)return r/(s-1);let d=n[r],u=n[r+1]-d,p=(o-d)/u;return(r+p)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),c=e||(o.isVector2?new _t:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,r=[],s=[],o=[],a=new L,c=new ve;for(let p=0;p<=t;p++){let m=p/t;r[p]=this.getTangentAt(m,new L)}s[0]=new L,o[0]=new L;let l=Number.MAX_VALUE,d=Math.abs(r[0].x),h=Math.abs(r[0].y),u=Math.abs(r[0].z);d<=l&&(l=d,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let p=1;p<=t;p++){if(s[p]=s[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(r[p-1],r[p]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(Xt(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(c.makeRotationAxis(a,m))}o[p].crossVectors(r[p],s[p])}if(e===!0){let p=Math.acos(Xt(s[0].dot(s[t]),-1,1));p/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(p=-p);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(r[m],p*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}};function Uh(){let i=0,t=0,e=0,n=0;function r(s,o,a,c){i=s,t=a,e=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,d,h){let u=(o-s)/l-(a-s)/(l+d)+(a-o)/d,p=(a-o)/d-(c-o)/(d+h)+(c-a)/h;u*=d,p*=d,r(o,a,u,p)},calc:function(s){let o=s*s,a=o*s;return i+t*s+e*o+n*a}}}var ma=new L,th=new Uh,eh=new Uh,nh=new Uh,Qs=class extends Da{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new L){let n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,d;this.closed||a>0?l=r[(a-1)%s]:(ma.subVectors(r[0],r[1]).add(r[0]),l=ma);let h=r[a%s],u=r[(a+1)%s];if(this.closed||a+2<s?d=r[(a+2)%s]:(ma.subVectors(r[s-1],r[s-2]).add(r[s-1]),d=ma),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(h),p),x=Math.pow(h.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(d),p);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),th.initNonuniformCatmullRom(l.x,h.x,u.x,d.x,m,x,g),eh.initNonuniformCatmullRom(l.y,h.y,u.y,d.y,m,x,g),nh.initNonuniformCatmullRom(l.z,h.z,u.z,d.z,m,x,g)}else this.curveType==="catmullrom"&&(th.initCatmullRom(l.x,h.x,u.x,d.x,this.tension),eh.initCatmullRom(l.y,h.y,u.y,d.y,this.tension),nh.initCatmullRom(l.z,h.z,u.z,d.z,this.tension));return n.set(th.calc(c),eh.calc(c),nh.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let r=t.points[e];this.points.push(new L().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function om(i,t,e=2){let n=t&&t.length,r=n?t[0]*e:i.length,s=Vu(i,0,r,e,!0),o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(n&&(s=dm(i,t,s,e)),i.length>80*e){a=1/0,c=1/0;let d=-1/0,h=-1/0;for(let u=e;u<r;u+=e){let p=i[u],m=i[u+1];p<a&&(a=p),m<c&&(c=m),p>d&&(d=p),m>h&&(h=m)}l=Math.max(d-a,h-c),l=l!==0?32767/l:0}return to(s,o,e,a,c,l,0),o}function Vu(i,t,e,n,r){let s;if(r===wm(i,t,e,n)>0)for(let o=t;o<e;o+=n)s=tu(o/n|0,i[o],i[o+1],s);else for(let o=e-n;o>=t;o-=n)s=tu(o/n|0,i[o],i[o+1],s);return s&&ns(s,s.next)&&(no(s),s=s.next),s}function ur(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ns(e,e.next)||Ae(e.prev,e,e.next)===0)){if(no(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function to(i,t,e,n,r,s,o){if(!i)return;!o&&s&&gm(i,n,r,s);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(s?lm(i,n,r,s):am(i)){t.push(c.i,i.i,l.i),no(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=cm(ur(i),t),to(i,t,e,n,r,s,2)):o===2&&hm(i,t,e,n,r,s):to(ur(i),t,e,n,r,s,1);break}}}function am(i){let t=i.prev,e=i,n=i.next;if(Ae(t,e,n)>=0)return!1;let r=t.x,s=e.x,o=n.x,a=t.y,c=e.y,l=n.y,d=Math.min(r,s,o),h=Math.min(a,c,l),u=Math.max(r,s,o),p=Math.max(a,c,l),m=n.next;for(;m!==t;){if(m.x>=d&&m.x<=u&&m.y>=h&&m.y<=p&&Ds(r,a,s,c,o,l,m.x,m.y)&&Ae(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function lm(i,t,e,n){let r=i.prev,s=i,o=i.next;if(Ae(r,s,o)>=0)return!1;let a=r.x,c=s.x,l=o.x,d=r.y,h=s.y,u=o.y,p=Math.min(a,c,l),m=Math.min(d,h,u),x=Math.max(a,c,l),g=Math.max(d,h,u),f=hh(p,m,t,e,n),S=hh(x,g,t,e,n),y=i.prevZ,b=i.nextZ;for(;y&&y.z>=f&&b&&b.z<=S;){if(y.x>=p&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==o&&Ds(a,d,c,h,l,u,y.x,y.y)&&Ae(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=x&&b.y>=m&&b.y<=g&&b!==r&&b!==o&&Ds(a,d,c,h,l,u,b.x,b.y)&&Ae(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=f;){if(y.x>=p&&y.x<=x&&y.y>=m&&y.y<=g&&y!==r&&y!==o&&Ds(a,d,c,h,l,u,y.x,y.y)&&Ae(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=S;){if(b.x>=p&&b.x<=x&&b.y>=m&&b.y<=g&&b!==r&&b!==o&&Ds(a,d,c,h,l,u,b.x,b.y)&&Ae(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function cm(i,t){let e=i;do{let n=e.prev,r=e.next.next;!ns(n,r)&&Wu(n,e,e.next,r)&&eo(n,r)&&eo(r,n)&&(t.push(n.i,e.i,r.i),no(e),no(e.next),e=i=r),e=e.next}while(e!==i);return ur(e)}function hm(i,t,e,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&bm(o,a)){let c=Xu(o,a);o=ur(o,o.next),c=ur(c,c.next),to(o,t,e,n,r,s,0),to(c,t,e,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function dm(i,t,e,n){let r=[];for(let s=0,o=t.length;s<o;s++){let a=t[s]*n,c=s<o-1?t[s+1]*n:i.length,l=Vu(i,a,c,n,!1);l===l.next&&(l.steiner=!0),r.push(vm(l))}r.sort(um);for(let s=0;s<r.length;s++)e=pm(r[s],e);return e}function um(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function pm(i,t){let e=fm(i,t);if(!e)return t;let n=Xu(e,i);return ur(n,n.next),ur(e,e.next)}function fm(i,t){let e=t,n=i.x,r=i.y,s=-1/0,o;if(ns(i,e))return e;do{if(ns(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){let h=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>s&&(s=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,c=o.x,l=o.y,d=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Gu(r<l?n:s,r,c,l,r<l?s:n,r,e.x,e.y)){let h=Math.abs(r-e.y)/(n-e.x);eo(e,i)&&(h<d||h===d&&(e.x>o.x||e.x===o.x&&mm(o,e)))&&(o=e,d=h)}e=e.next}while(e!==a);return o}function mm(i,t){return Ae(i.prev,i,t.prev)<0&&Ae(t.next,i,i.next)<0}function gm(i,t,e,n){let r=i;do r.z===0&&(r.z=hh(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,xm(r)}function xm(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(r=n,n=n.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=o}s.nextZ=null,e*=2}while(t>1);return i}function hh(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function vm(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Gu(i,t,e,n,r,s,o,a){return(r-o)*(t-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(n-a)}function Ds(i,t,e,n,r,s,o,a){return!(i===o&&t===a)&&Gu(i,t,e,n,r,s,o,a)}function bm(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!ym(i,t)&&(eo(i,t)&&eo(t,i)&&_m(i,t)&&(Ae(i.prev,i,t.prev)||Ae(i,t.prev,t))||ns(i,t)&&Ae(i.prev,i,i.next)>0&&Ae(t.prev,t,t.next)>0)}function Ae(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ns(i,t){return i.x===t.x&&i.y===t.y}function Wu(i,t,e,n){let r=xa(Ae(i,t,e)),s=xa(Ae(i,t,n)),o=xa(Ae(e,n,i)),a=xa(Ae(e,n,t));return!!(r!==s&&o!==a||r===0&&ga(i,e,t)||s===0&&ga(i,n,t)||o===0&&ga(e,i,n)||a===0&&ga(e,t,n))}function ga(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function xa(i){return i>0?1:i<0?-1:0}function ym(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Wu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function eo(i,t){return Ae(i.prev,i,i.next)<0?Ae(i,t,i.next)>=0&&Ae(i,i.prev,t)>=0:Ae(i,t,i.prev)<0||Ae(i,i.next,t)<0}function _m(i,t){let e=i,n=!1,r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Xu(i,t){let e=dh(i.i,i.x,i.y),n=dh(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function tu(i,t,e,n){let r=dh(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function no(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function dh(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function wm(i,t,e,n){let r=0;for(let s=t,o=e-n;s<e;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}var uh=class{static triangulate(t,e,n=2){return om(t,e,n)}},is=class i{static area(t){let e=t.length,n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],r=[],s=[];eu(t),nu(n,t);let o=t.length;e.forEach(eu);for(let c=0;c<e.length;c++)r.push(o),o+=e[c].length,nu(n,e[c]);let a=uh.triangulate(n,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}};function eu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function nu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var zi=class i extends Ne{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};let s=t/2,o=e/2,a=Math.floor(n),c=Math.floor(r),l=a+1,d=c+1,h=t/a,u=e/c,p=[],m=[],x=[],g=[];for(let f=0;f<d;f++){let S=f*u-o;for(let y=0;y<l;y++){let b=y*h-s;m.push(b,-S,0),x.push(0,0,1),g.push(y/a),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<a;S++){let y=S+l*f,b=S+l*(f+1),T=S+1+l*(f+1),E=S+1+l*f;p.push(y,b,E),p.push(b,T,E)}this.setIndex(p),this.setAttribute("position",new le(m,3)),this.setAttribute("normal",new le(x,3)),this.setAttribute("uv",new le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var io=class extends Re{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var pr=class extends ii{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ch,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=Qa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ka=class extends ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ua=class extends ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function va(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Mm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var fr=class{constructor(t,e,n,r){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,r=e[n],s=e[n-1];n:{t:{let o;e:{i:if(!(t<r)){for(let a=n+2;;){if(r===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=e[++n],t<r)break t}o=e.length;break e}if(!(t>=s)){let a=e[1];t<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(r=s,s=e[--n-1],t>=s)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(r=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,t,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=t*r;for(let o=0;o!==r;++o)e[o]=n[s+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Na=class extends fr{constructor(t,e,n,r){super(t,e,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:rh,endingEnd:rh}}intervalChanged_(t,e,n){let r=this.parameterPositions,s=t-2,o=t+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case sh:s=t,a=2*e-n;break;case oh:s=r.length-2,a=e+r[s]-r[s+1];break;default:s=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case sh:o=t,c=2*n-e;break;case oh:o=1,c=n+r[1]-r[0];break;default:o=t-1,c=e}let l=(n-e)*.5,d=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=s*d,this._offsetNext=o*d}interpolate_(t,e,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,d=this._offsetPrev,h=this._offsetNext,u=this._weightPrev,p=this._weightNext,m=(n-e)/(r-e),x=m*m,g=x*m,f=-u*g+2*u*x-u*m,S=(1+u)*g+(-1.5-2*u)*x+(-.5+u)*m+1,y=(-1-p)*g+(1.5+p)*x+.5*m,b=p*g-p*x;for(let T=0;T!==a;++T)s[T]=f*o[d+T]+S*o[l+T]+y*o[c+T]+b*o[h+T];return s}},Fa=class extends fr{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t,e,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,d=(n-e)/(r-e),h=1-d;for(let u=0;u!==a;++u)s[u]=o[l+u]*h+o[c+u]*d;return s}},Oa=class extends fr{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t){return this.copySampleValue_(t-1)}},wn=class{constructor(t,e,n,r){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=va(e,this.TimeBufferType),this.values=va(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:va(t.times,Array),values:va(t.values,Array)};let r=t.getInterpolation();r!==t.DefaultInterpolation&&(n.interpolation=r)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Oa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Fa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Na(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Us:e=this.InterpolantFactoryMethodDiscrete;break;case Sa:e=this.InterpolantFactoryMethodLinear;break;case ba:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Us;case this.InterpolantFactoryMethodLinear:return Sa;case this.InterpolantFactoryMethodSmooth:return ba}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,r=e.length;n!==r;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,r=e.length;n!==r;++n)e[n]*=t}return this}trim(t,e){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<t;)++s;for(;o!==-1&&n[o]>e;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==s;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(r!==void 0&&Mm(r))for(let a=0,c=r.length;a!==c;++a){let l=r[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===ba,s=t.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=t[a],d=t[a+1];if(l!==d&&(a!==1||l!==t[0]))if(r)c=!0;else{let h=a*n,u=h-n,p=h+n;for(let m=0;m!==n;++m){let x=e[h+m];if(x!==e[u+m]||x!==e[p+m]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let h=a*n,u=o*n;for(let p=0;p!==n;++p)e[u+p]=e[h+p]}++o}}if(s>0){t[o]=t[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,r=new n(this.name,t,e);return r.createInterpolant=this.createInterpolant,r}};wn.prototype.ValueTypeName="";wn.prototype.TimeBufferType=Float32Array;wn.prototype.ValueBufferType=Float32Array;wn.prototype.DefaultInterpolation=Sa;var Hi=class extends wn{constructor(t,e,n){super(t,e,n)}};Hi.prototype.ValueTypeName="bool";Hi.prototype.ValueBufferType=Array;Hi.prototype.DefaultInterpolation=Us;Hi.prototype.InterpolantFactoryMethodLinear=void 0;Hi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends wn{constructor(t,e,n,r){super(t,e,n,r)}};Ba.prototype.ValueTypeName="color";var za=class extends wn{constructor(t,e,n,r){super(t,e,n,r)}};za.prototype.ValueTypeName="number";var Ha=class extends fr{constructor(t,e,n,r){super(t,e,n,r)}interpolate_(t,e,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(r-e),l=t*a;for(let d=l+a;l!==d;l+=4)un.slerpFlat(s,0,o,l-a,o,l,c);return s}},ro=class extends wn{constructor(t,e,n,r){super(t,e,n,r)}InterpolantFactoryMethodLinear(t){return new Ha(this.times,this.values,this.getValueSize(),t)}};ro.prototype.ValueTypeName="quaternion";ro.prototype.InterpolantFactoryMethodSmooth=void 0;var Vi=class extends wn{constructor(t,e,n){super(t,e,n)}};Vi.prototype.ValueTypeName="string";Vi.prototype.ValueBufferType=Array;Vi.prototype.DefaultInterpolation=Us;Vi.prototype.InterpolantFactoryMethodLinear=void 0;Vi.prototype.InterpolantFactoryMethodSmooth=void 0;var Va=class extends wn{constructor(t,e,n,r){super(t,e,n,r)}};Va.prototype.ValueTypeName="vector";var Ga=class{constructor(t,e,n){let r=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){a++,s===!1&&r.onStart!==void 0&&r.onStart(d,o,a),s=!0},this.itemEnd=function(d){o++,r.onProgress!==void 0&&r.onProgress(d,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(d){r.onError!==void 0&&r.onError(d)},this.resolveURL=function(d){return c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,h){return l.push(d,h),this},this.removeHandler=function(d){let h=l.indexOf(d);return h!==-1&&l.splice(h,2),this},this.getHandler=function(d){for(let h=0,u=l.length;h<u;h+=2){let p=l[h],m=l[h+1];if(p.global&&(p.lastIndex=0),p.test(d))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},$u=new Ga,Wa=class{constructor(t){this.manager=t!==void 0?t:$u,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(r,s){n.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Wa.DEFAULT_MATERIAL_NAME="__DEFAULT";var so=class extends Ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Pt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},oo=class extends so{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ih=new ve,iu=new L,ru=new L,ph=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.mapType=$n,this.map=null,this.mapPass=null,this.matrix=new ve,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ts,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;iu.setFromMatrixPosition(t.matrixWorld),e.position.copy(iu),ru.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ru),e.updateMatrixWorld(),ih.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ih,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ih)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var mr=class extends Gs{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-t,o=n+t,a=r+e,c=r-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=d*this.view.offsetY,c=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},fh=class extends ph{constructor(){super(new mr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ao=class extends so{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ge.DEFAULT_UP),this.updateMatrix(),this.target=new Ge,this.shadow=new fh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Xa=class extends Ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},gr=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};var Nh="\\[\\]\\.:\\/",Sm=new RegExp("["+Nh+"]","g"),Fh="[^"+Nh+"]",Em="[^"+Nh.replace("\\.","")+"]",Tm=/((?:WC+[\/:])*)/.source.replace("WC",Fh),Am=/(WCOD+)?/.source.replace("WCOD",Em),Rm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Fh),Cm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Fh),Im=new RegExp("^"+Tm+Am+Rm+Cm+"$"),Pm=["material","materials","bones","map"],mh=class{constructor(t,e,n){let r=n||ye.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,r)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ye=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Sm,"")}static parseTrackName(t){let e=Im.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Pm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},r=n(t.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)t[e++]=n[r]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,r=e.propertyName,s=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===l){l=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[r];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ye.Composite=mh;ye.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ye.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ye.prototype.GetterByBindingType=[ye.prototype._getValue_direct,ye.prototype._getValue_array,ye.prototype._getValue_arrayElement,ye.prototype._getValue_toArray];ye.prototype.SetterByBindingTypeAndVersioning=[[ye.prototype._setValue_direct,ye.prototype._setValue_direct_setNeedsUpdate,ye.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_array,ye.prototype._setValue_array_setNeedsUpdate,ye.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_arrayElement,ye.prototype._setValue_arrayElement_setNeedsUpdate,ye.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_fromArray,ye.prototype._setValue_fromArray_setNeedsUpdate,ye.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var yy=new Float32Array(1);var rs=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Xt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Xt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var lo=class extends Wn{constructor(t=10,e=10,n=4473924,r=8947848){n=new Pt(n),r=new Pt(r);let s=e/2,o=t/e,a=t/2,c=[],l=[];for(let u=0,p=0,m=-a;u<=e;u++,m+=o){c.push(-a,0,m,a,0,m),c.push(m,0,-a,m,0,a);let x=u===s?n:r;x.toArray(l,p),p+=3,x.toArray(l,p),p+=3,x.toArray(l,p),p+=3,x.toArray(l,p),p+=3}let d=new Ne;d.setAttribute("position",new le(c,3)),d.setAttribute("color",new le(l,3));let h=new _n({vertexColors:!0,toneMapped:!1});super(d,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};var co=class extends ni{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Oh(i,t,e,n){let r=Lm(n);switch(e){case Eh:return i*t;case Ah:return i*t/r.components*r.byteLength;case pl:return i*t/r.components*r.byteLength;case Rh:return i*t*2/r.components*r.byteLength;case fl:return i*t*2/r.components*r.byteLength;case Th:return i*t*3/r.components*r.byteLength;case Ln:return i*t*4/r.components*r.byteLength;case ml:return i*t*4/r.components*r.byteLength;case po:case fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case mo:case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xl:case bl:return Math.max(i,16)*Math.max(t,8)/4;case gl:case vl:return Math.max(i,8)*Math.max(t,8)/2;case yl:case _l:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case wl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Sl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case El:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Tl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Al:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Rl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Il:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Pl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case kl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ul:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Nl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Fl:case Ol:case Bl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case zl:case Hl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Vl:case Gl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Lm(i){switch(i){case $n:case _h:return{byteLength:1,components:1};case ss:case wh:case Pn:return{byteLength:2,components:1};case dl:case ul:return{byteLength:2,components:4};case qi:case hl:case si:return{byteLength:4,components:1};case Mh:case Sh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function gp(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function zm(i){let t=new WeakMap;function e(a,c){let l=a.array,d=a.usage,h=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,d),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){let d=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,d);else{h.sort((p,m)=>p.start-m.start);let u=0;for(let p=1;p<h.length;p++){let m=h[u],x=h[p];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++u,h[u]=x)}h.length=u+1;for(let p=0,m=h.length;p<m;p++){let x=h[p];i.bufferSubData(l,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let d=t.get(a);(!d||d.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var Hm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vm=`#ifdef USE_ALPHAHASH
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
#endif`,Gm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$m=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qm=`#ifdef USE_AOMAP
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
#endif`,Ym=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zm=`#ifdef USE_BATCHING
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
#endif`,jm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Jm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Qm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,tg=`#ifdef USE_IRIDESCENCE
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
#endif`,eg=`#ifdef USE_BUMPMAP
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
#endif`,ng=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,og=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ag=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,cg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,hg=`#define PI 3.141592653589793
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
} // validated`,dg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ug=`vec3 transformedNormal = objectNormal;
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
#endif`,pg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xg="gl_FragColor = linearToOutputTexel( gl_FragColor );",vg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bg=`#ifdef USE_ENVMAP
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
#endif`,yg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,_g=`#ifdef USE_ENVMAP
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
#endif`,wg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mg=`#ifdef USE_ENVMAP
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
#endif`,Sg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Eg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ag=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rg=`#ifdef USE_GRADIENTMAP
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
}`,Cg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ig=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Pg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lg=`uniform bool receiveShadow;
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
#endif`,Dg=`#ifdef USE_ENVMAP
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
#endif`,kg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ug=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Og=`PhysicalMaterial material;
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
#endif`,Bg=`struct PhysicalMaterial {
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
}`,zg=`
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
#endif`,Hg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Vg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Gg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$g=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,jg=`#if defined( USE_POINTS_UV )
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
#endif`,Jg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Qg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,t0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,e0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,n0=`#ifdef USE_MORPHTARGETS
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
#endif`,i0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,r0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,s0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,o0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,l0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,c0=`#ifdef USE_NORMALMAP
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
#endif`,h0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,d0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,u0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,p0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,f0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,m0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,g0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,x0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,v0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,b0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,y0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,w0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,M0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,S0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,E0=`float getShadowMask() {
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
}`,T0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,A0=`#ifdef USE_SKINNING
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
#endif`,R0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,C0=`#ifdef USE_SKINNING
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
#endif`,I0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,P0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,L0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,D0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,k0=`#ifdef USE_TRANSMISSION
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
#endif`,U0=`#ifdef USE_TRANSMISSION
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
#endif`,N0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,F0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,O0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,B0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,z0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,H0=`uniform sampler2D t2D;
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
}`,V0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,G0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,W0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,X0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`#include <common>
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
}`,q0=`#if DEPTH_PACKING == 3200
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
}`,Y0=`#define DISTANCE
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
}`,Z0=`#define DISTANCE
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
}`,j0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,J0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`uniform float scale;
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
}`,Q0=`uniform vec3 diffuse;
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
}`,tx=`#include <common>
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
}`,ex=`uniform vec3 diffuse;
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
}`,nx=`#define LAMBERT
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
}`,ix=`#define LAMBERT
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
}`,rx=`#define MATCAP
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
}`,sx=`#define MATCAP
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
}`,ox=`#define NORMAL
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
}`,ax=`#define NORMAL
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
}`,lx=`#define PHONG
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
}`,cx=`#define PHONG
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
}`,hx=`#define STANDARD
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
}`,dx=`#define STANDARD
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
}`,ux=`#define TOON
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
}`,px=`#define TOON
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
}`,fx=`uniform float size;
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
}`,mx=`uniform vec3 diffuse;
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
}`,gx=`#include <common>
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
}`,xx=`uniform vec3 color;
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
}`,vx=`uniform float rotation;
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
}`,bx=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:Hm,alphahash_pars_fragment:Vm,alphamap_fragment:Gm,alphamap_pars_fragment:Wm,alphatest_fragment:Xm,alphatest_pars_fragment:$m,aomap_fragment:qm,aomap_pars_fragment:Ym,batching_pars_vertex:Zm,batching_vertex:jm,begin_vertex:Jm,beginnormal_vertex:Km,bsdfs:Qm,iridescence_fragment:tg,bumpmap_pars_fragment:eg,clipping_planes_fragment:ng,clipping_planes_pars_fragment:ig,clipping_planes_pars_vertex:rg,clipping_planes_vertex:sg,color_fragment:og,color_pars_fragment:ag,color_pars_vertex:lg,color_vertex:cg,common:hg,cube_uv_reflection_fragment:dg,defaultnormal_vertex:ug,displacementmap_pars_vertex:pg,displacementmap_vertex:fg,emissivemap_fragment:mg,emissivemap_pars_fragment:gg,colorspace_fragment:xg,colorspace_pars_fragment:vg,envmap_fragment:bg,envmap_common_pars_fragment:yg,envmap_pars_fragment:_g,envmap_pars_vertex:wg,envmap_physical_pars_fragment:Dg,envmap_vertex:Mg,fog_vertex:Sg,fog_pars_vertex:Eg,fog_fragment:Tg,fog_pars_fragment:Ag,gradientmap_pars_fragment:Rg,lightmap_pars_fragment:Cg,lights_lambert_fragment:Ig,lights_lambert_pars_fragment:Pg,lights_pars_begin:Lg,lights_toon_fragment:kg,lights_toon_pars_fragment:Ug,lights_phong_fragment:Ng,lights_phong_pars_fragment:Fg,lights_physical_fragment:Og,lights_physical_pars_fragment:Bg,lights_fragment_begin:zg,lights_fragment_maps:Hg,lights_fragment_end:Vg,logdepthbuf_fragment:Gg,logdepthbuf_pars_fragment:Wg,logdepthbuf_pars_vertex:Xg,logdepthbuf_vertex:$g,map_fragment:qg,map_pars_fragment:Yg,map_particle_fragment:Zg,map_particle_pars_fragment:jg,metalnessmap_fragment:Jg,metalnessmap_pars_fragment:Kg,morphinstance_vertex:Qg,morphcolor_vertex:t0,morphnormal_vertex:e0,morphtarget_pars_vertex:n0,morphtarget_vertex:i0,normal_fragment_begin:r0,normal_fragment_maps:s0,normal_pars_fragment:o0,normal_pars_vertex:a0,normal_vertex:l0,normalmap_pars_fragment:c0,clearcoat_normal_fragment_begin:h0,clearcoat_normal_fragment_maps:d0,clearcoat_pars_fragment:u0,iridescence_pars_fragment:p0,opaque_fragment:f0,packing:m0,premultiplied_alpha_fragment:g0,project_vertex:x0,dithering_fragment:v0,dithering_pars_fragment:b0,roughnessmap_fragment:y0,roughnessmap_pars_fragment:_0,shadowmap_pars_fragment:w0,shadowmap_pars_vertex:M0,shadowmap_vertex:S0,shadowmask_pars_fragment:E0,skinbase_vertex:T0,skinning_pars_vertex:A0,skinning_vertex:R0,skinnormal_vertex:C0,specularmap_fragment:I0,specularmap_pars_fragment:P0,tonemapping_fragment:L0,tonemapping_pars_fragment:D0,transmission_fragment:k0,transmission_pars_fragment:U0,uv_pars_fragment:N0,uv_pars_vertex:F0,uv_vertex:O0,worldpos_vertex:B0,background_vert:z0,background_frag:H0,backgroundCube_vert:V0,backgroundCube_frag:G0,cube_vert:W0,cube_frag:X0,depth_vert:$0,depth_frag:q0,distanceRGBA_vert:Y0,distanceRGBA_frag:Z0,equirect_vert:j0,equirect_frag:J0,linedashed_vert:K0,linedashed_frag:Q0,meshbasic_vert:tx,meshbasic_frag:ex,meshlambert_vert:nx,meshlambert_frag:ix,meshmatcap_vert:rx,meshmatcap_frag:sx,meshnormal_vert:ox,meshnormal_frag:ax,meshphong_vert:lx,meshphong_frag:cx,meshphysical_vert:hx,meshphysical_frag:dx,meshtoon_vert:ux,meshtoon_frag:px,points_vert:fx,points_frag:mx,shadow_vert:gx,shadow_frag:xx,sprite_vert:vx,sprite_frag:bx},dt={common:{diffuse:{value:new Pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Pt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},oi={basic:{uniforms:tn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:tn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:tn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)},specular:{value:new Pt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:tn([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:tn([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:tn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:tn([dt.points,dt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:tn([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:tn([dt.common,dt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:tn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:tn([dt.sprite,dt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:tn([dt.common,dt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:tn([dt.lights,dt.fog,{color:{value:new Pt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};oi.physical={uniforms:tn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Pt(0)},specularColor:{value:new Pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};var Wl={r:0,b:0,g:0},yr=new Gn,yx=new ve;function _x(i,t,e,n,r,s,o){let a=new Pt(0),c=s===!0?0:1,l,d,h=null,u=0,p=null;function m(y){let b=y.isScene===!0?y.background:null;return b&&b.isTexture&&(b=(y.backgroundBlurriness>0?e:t).get(b)),b}function x(y){let b=!1,T=m(y);T===null?f(a,c):T&&T.isColor&&(f(T,1),b=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,b){let T=m(b);T&&(T.isCubeTexture||T.mapping===ho)?(d===void 0&&(d=new fe(new Kr(1,1,1),new Re({name:"BackgroundCubeMaterial",uniforms:br(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(E,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),yr.copy(b.backgroundRotation),yr.x*=-1,yr.y*=-1,yr.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(yr.y*=-1,yr.z*=-1),d.material.uniforms.envMap.value=T,d.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(yx.makeRotationFromEuler(yr)),d.material.toneMapped=Zt.getTransfer(T.colorSpace)!==Qt,(h!==T||u!==T.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,h=T,u=T.version,p=i.toneMapping),d.layers.enableAll(),y.unshift(d,d.geometry,d.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new fe(new zi(2,2),new Re({name:"BackgroundMaterial",uniforms:br(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Zt.getTransfer(T.colorSpace)!==Qt,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(h!==T||u!==T.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,h=T,u=T.version,p=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,b){y.getRGB(Wl,kh(i)),n.buffers.color.setClear(Wl.r,Wl.g,Wl.b,b,o)}function S(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,b=1){a.set(y),c=b,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(a,c)},render:x,addToRenderList:g,dispose:S}}function wx(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=u(null),s=r,o=!1;function a(w,I,k,z,G){let B=!1,H=h(z,k,I);s!==H&&(s=H,l(s.object)),B=p(w,z,k,G),B&&m(w,z,k,G),G!==null&&t.update(G,i.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,b(w,I,k,z),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return i.createVertexArray()}function l(w){return i.bindVertexArray(w)}function d(w){return i.deleteVertexArray(w)}function h(w,I,k){let z=k.wireframe===!0,G=n[w.id];G===void 0&&(G={},n[w.id]=G);let B=G[I.id];B===void 0&&(B={},G[I.id]=B);let H=B[z];return H===void 0&&(H=u(c()),B[z]=H),H}function u(w){let I=[],k=[],z=[];for(let G=0;G<e;G++)I[G]=0,k[G]=0,z[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:k,attributeDivisors:z,object:w,attributes:{},index:null}}function p(w,I,k,z){let G=s.attributes,B=I.attributes,H=0,W=k.getAttributes();for(let O in W)if(W[O].location>=0){let tt=G[O],rt=B[O];if(rt===void 0&&(O==="instanceMatrix"&&w.instanceMatrix&&(rt=w.instanceMatrix),O==="instanceColor"&&w.instanceColor&&(rt=w.instanceColor)),tt===void 0||tt.attribute!==rt||rt&&tt.data!==rt.data)return!0;H++}return s.attributesNum!==H||s.index!==z}function m(w,I,k,z){let G={},B=I.attributes,H=0,W=k.getAttributes();for(let O in W)if(W[O].location>=0){let tt=B[O];tt===void 0&&(O==="instanceMatrix"&&w.instanceMatrix&&(tt=w.instanceMatrix),O==="instanceColor"&&w.instanceColor&&(tt=w.instanceColor));let rt={};rt.attribute=tt,tt&&tt.data&&(rt.data=tt.data),G[O]=rt,H++}s.attributes=G,s.attributesNum=H,s.index=z}function x(){let w=s.newAttributes;for(let I=0,k=w.length;I<k;I++)w[I]=0}function g(w){f(w,0)}function f(w,I){let k=s.newAttributes,z=s.enabledAttributes,G=s.attributeDivisors;k[w]=1,z[w]===0&&(i.enableVertexAttribArray(w),z[w]=1),G[w]!==I&&(i.vertexAttribDivisor(w,I),G[w]=I)}function S(){let w=s.newAttributes,I=s.enabledAttributes;for(let k=0,z=I.length;k<z;k++)I[k]!==w[k]&&(i.disableVertexAttribArray(k),I[k]=0)}function y(w,I,k,z,G,B,H){H===!0?i.vertexAttribIPointer(w,I,k,G,B):i.vertexAttribPointer(w,I,k,z,G,B)}function b(w,I,k,z){x();let G=z.attributes,B=k.getAttributes(),H=I.defaultAttributeValues;for(let W in B){let O=B[W];if(O.location>=0){let nt=G[W];if(nt===void 0&&(W==="instanceMatrix"&&w.instanceMatrix&&(nt=w.instanceMatrix),W==="instanceColor"&&w.instanceColor&&(nt=w.instanceColor)),nt!==void 0){let tt=nt.normalized,rt=nt.itemSize,It=t.get(nt);if(It===void 0)continue;let Wt=It.buffer,gt=It.type,ft=It.bytesPerElement,X=gt===i.INT||gt===i.UNSIGNED_INT||nt.gpuType===hl;if(nt.isInterleavedBufferAttribute){let Z=nt.data,lt=Z.stride,bt=nt.offset;if(Z.isInstancedInterleavedBuffer){for(let xt=0;xt<O.locationSize;xt++)f(O.location+xt,Z.meshPerAttribute);w.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let xt=0;xt<O.locationSize;xt++)g(O.location+xt);i.bindBuffer(i.ARRAY_BUFFER,Wt);for(let xt=0;xt<O.locationSize;xt++)y(O.location+xt,rt/O.locationSize,gt,tt,lt*ft,(bt+rt/O.locationSize*xt)*ft,X)}else{if(nt.isInstancedBufferAttribute){for(let Z=0;Z<O.locationSize;Z++)f(O.location+Z,nt.meshPerAttribute);w.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let Z=0;Z<O.locationSize;Z++)g(O.location+Z);i.bindBuffer(i.ARRAY_BUFFER,Wt);for(let Z=0;Z<O.locationSize;Z++)y(O.location+Z,rt/O.locationSize,gt,tt,rt*ft,rt/O.locationSize*Z*ft,X)}}else if(H!==void 0){let tt=H[W];if(tt!==void 0)switch(tt.length){case 2:i.vertexAttrib2fv(O.location,tt);break;case 3:i.vertexAttrib3fv(O.location,tt);break;case 4:i.vertexAttrib4fv(O.location,tt);break;default:i.vertexAttrib1fv(O.location,tt)}}}}S()}function T(){C();for(let w in n){let I=n[w];for(let k in I){let z=I[k];for(let G in z)d(z[G].object),delete z[G];delete I[k]}delete n[w]}}function E(w){if(n[w.id]===void 0)return;let I=n[w.id];for(let k in I){let z=I[k];for(let G in z)d(z[G].object),delete z[G];delete I[k]}delete n[w.id]}function R(w){for(let I in n){let k=n[I];if(k[w.id]===void 0)continue;let z=k[w.id];for(let G in z)d(z[G].object),delete z[G];delete k[w.id]}}function C(){v(),o=!0,s!==r&&(s=r,l(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:v,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function Mx(i,t,e){let n;function r(l){n=l}function s(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function o(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),e.update(d,n,h))}function a(l,d,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let p=0;for(let m=0;m<h;m++)p+=d[m];e.update(p,n,1)}function c(l,d,h,u){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<l.length;m++)o(l[m],d[m],u[m]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,u,0,h);let m=0;for(let x=0;x<h;x++)m+=d[x]*u[x];e.update(m,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Sx(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==Ln&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let C=R===Pn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==$n&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==si&&!C)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);let h=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:S,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:T,maxSamples:E}}function Ex(i){let t=this,e=null,n=0,r=!1,s=!1,o=new Cn,a=new Vt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let p=h.length!==0||u||n!==0||r;return r=u,n=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){e=d(h,u,0)},this.setState=function(h,u,p){let m=h.clippingPlanes,x=h.clipIntersection,g=h.clipShadows,f=i.get(h);if(!r||m===null||m.length===0||s&&!g)s?d(null):l();else{let S=s?0:n,y=S*4,b=f.clippingState||null;c.value=b,b=d(m,u,y,p);for(let T=0;T!==y;++T)b[T]=e[T];f.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(h,u,p,m){let x=h!==null?h.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let f=p+x*4,S=u.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<f)&&(g=new Float32Array(f));for(let y=0,b=p;y!==x;++y,b+=4)o.copy(h[y]).applyMatrix4(S,a),o.normal.toArray(g,b),g[b+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function Tx(i){let t=new WeakMap;function e(o,a){return a===al?o.mapping=xr:a===ll&&(o.mapping=vr),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===al||a===ll)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Ca(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",r),e(l.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}var hs=4,qu=[.125,.215,.35,.446,.526,.582],Mr=20,Bh=new mr,Yu=new Pt,zh=null,Hh=0,Vh=0,Gh=!1,wr=(1+Math.sqrt(5))/2,cs=1/wr,Zu=[new L(-wr,cs,0),new L(wr,cs,0),new L(-cs,0,wr),new L(cs,0,wr),new L(0,wr,-cs),new L(0,wr,cs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Ax=new L,ql=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){let{size:o=256,position:a=Ax}=s;zh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Vh=this._renderer.getActiveMipmapLevel(),Gh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ku(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ju(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(zh,Hh,Vh),this._renderer.xr.enabled=Gh,t.scissorTest=!1,Xl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===xr||t.mapping===vr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),zh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Vh=this._renderer.getActiveMipmapLevel(),Gh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:Pn,format:Ln,colorSpace:dr,depthBuffer:!1},r=ju(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ju(t,e,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Rx(s)),this._blurMaterial=Cx(s,t,e)}return r}_compileMaterial(t){let e=new fe(this._lodPlanes[0],t);this._renderer.compile(e,Bh)}_sceneToCubeUV(t,e,n,r,s){let c=new Ke(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,p=h.toneMapping;h.getClearColor(Yu),h.toneMapping=Mi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));let x=new We({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1}),g=new fe(new Kr,x),f=!1,S=t.background;S?S.isColor&&(x.color.copy(S),t.background=null,f=!0):(x.color.copy(Yu),f=!0);for(let y=0;y<6;y++){let b=y%3;b===0?(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+d[y],s.y,s.z)):b===1?(c.up.set(0,0,l[y]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+d[y],s.z)):(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+d[y]));let T=this._cubeSize;Xl(r,b*T,y>2?T:0,T,T),h.setRenderTarget(r),f&&h.render(g,c),h.render(t,c)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=u,t.background=S}_textureToCubeUV(t,e){let n=this._renderer,r=t.mapping===xr||t.mapping===vr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ku()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ju());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new fe(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;let c=this._cubeSize;Xl(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Bh)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Zu[(r-s-1)%Zu.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,h=new fe(this._lodPlanes[r],l),u=l.uniforms,p=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Mr-1),x=s/m,g=isFinite(s)?1+Math.floor(d*x):Mr;g>Mr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Mr}`);let f=[],S=0;for(let R=0;R<Mr;++R){let C=R/x,v=Math.exp(-C*C/2);f.push(v),R===0?S+=v:R<g&&(S+=2*v)}for(let R=0;R<f.length;R++)f[R]=f[R]/S;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:y}=this;u.dTheta.value=m,u.mipInt.value=y-n;let b=this._sizeLods[r],T=3*b*(r>y-hs?r-y+hs:0),E=4*(this._cubeSize-b);Xl(e,T,E,3*b,2*b),c.setRenderTarget(e),c.render(h,Bh)}};function Rx(i){let t=[],e=[],n=[],r=i,s=i-hs+1+qu.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);e.push(a);let c=1/a;o>i-hs?c=qu[o-i+hs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),d=-l,h=1+l,u=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,m=6,x=3,g=2,f=1,S=new Float32Array(x*m*p),y=new Float32Array(g*m*p),b=new Float32Array(f*m*p);for(let E=0;E<p;E++){let R=E%3*2/3-1,C=E>2?0:-1,v=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];S.set(v,x*m*E),y.set(u,g*m*E);let w=[E,E,E,E,E,E];b.set(w,f*m*E)}let T=new Ne;T.setAttribute("position",new on(S,x)),T.setAttribute("uv",new on(y,g)),T.setAttribute("faceIndex",new on(b,f)),t.push(T),r>hs&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ju(i,t,e){let n=new Qe(i,t,e);return n.texture.mapping=ho,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xl(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Cx(i,t,e){let n=new Float32Array(Mr),r=new L(0,1,0);return new Re({name:"SphericalGaussianBlur",defines:{n:Mr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Qh(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Ju(){return new Re({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qh(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Ku(){return new Re({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Qh(){return`

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
	`}function Ix(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===al||c===ll,d=c===xr||c===vr;if(l||d){let h=t.get(a),u=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new ql(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{let p=a.image;return l&&p&&p.height>0||d&&p&&r(p)?(e===null&&(e=new ql(i)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0,l=6;for(let d=0;d<l;d++)a[d]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Px(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let r=e(n);return r===null&&jr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Lx(i,t,e,n){let r={},s=new WeakMap;function o(h){let u=h.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete r[u.id];let p=s.get(u);p&&(t.remove(p),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(h,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,e.memory.geometries++),u}function c(h){let u=h.attributes;for(let p in u)t.update(u[p],i.ARRAY_BUFFER)}function l(h){let u=[],p=h.index,m=h.attributes.position,x=0;if(p!==null){let S=p.array;x=p.version;for(let y=0,b=S.length;y<b;y+=3){let T=S[y+0],E=S[y+1],R=S[y+2];u.push(T,E,E,R,R,T)}}else if(m!==void 0){let S=m.array;x=m.version;for(let y=0,b=S.length/3-1;y<b;y+=3){let T=y+0,E=y+1,R=y+2;u.push(T,E,E,R,R,T)}}else return;let g=new(Dh(u)?Vs:Hs)(u,1);g.version=x;let f=s.get(h);f&&t.remove(f),s.set(h,g)}function d(h){let u=s.get(h);if(u){let p=h.index;p!==null&&u.version<p.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:d}}function Dx(i,t,e){let n;function r(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function c(u,p){i.drawElements(n,p,s,u*o),e.update(p,n,1)}function l(u,p,m){m!==0&&(i.drawElementsInstanced(n,p,s,u*o,m),e.update(p,n,m))}function d(u,p,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,u,0,m);let g=0;for(let f=0;f<m;f++)g+=p[f];e.update(g,n,1)}function h(u,p,m,x){if(m===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<u.length;f++)l(u[f]/o,p[f],x[f]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,s,u,0,x,0,m);let f=0;for(let S=0;S<m;S++)f+=p[S]*x[S];e.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function kx(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Ux(i,t,e){let n=new WeakMap,r=new ce;function s(o,a,c){let l=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=d!==void 0?d.length:0,u=n.get(a);if(u===void 0||u.count!==h){let v=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",v)};u!==void 0&&u.texture.dispose();let p=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],y=0;p===!0&&(y=1),m===!0&&(y=2),x===!0&&(y=3);let b=a.attributes.position.count*y,T=1;b>t.maxTextureSize&&(T=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);let E=new Float32Array(b*T*4*h),R=new Bs(E,b,T,h);R.type=si,R.needsUpdate=!0;let C=y*4;for(let w=0;w<h;w++){let I=g[w],k=f[w],z=S[w],G=b*T*4*w;for(let B=0;B<I.count;B++){let H=B*C;p===!0&&(r.fromBufferAttribute(I,B),E[G+H+0]=r.x,E[G+H+1]=r.y,E[G+H+2]=r.z,E[G+H+3]=0),m===!0&&(r.fromBufferAttribute(k,B),E[G+H+4]=r.x,E[G+H+5]=r.y,E[G+H+6]=r.z,E[G+H+7]=0),x===!0&&(r.fromBufferAttribute(z,B),E[G+H+8]=r.x,E[G+H+9]=r.y,E[G+H+10]=r.z,E[G+H+11]=z.itemSize===4?r.w:1)}}u={count:h,texture:R,size:new _t(b,T)},n.set(a,u),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let x=0;x<l.length;x++)p+=l[x];let m=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:s}}function Nx(i,t,e,n){let r=new WeakMap;function s(c){let l=n.render.frame,d=c.geometry,h=t.get(c,d);if(r.get(h)!==l&&(t.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){let u=c.skeleton;r.get(u)!==l&&(u.update(),r.set(u,l))}return h}function o(){r=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}var xp=new pn,Qu=new Zs(1,1),vp=new Bs,bp=new Aa,yp=new Ws,tp=[],ep=[],np=new Float32Array(16),ip=new Float32Array(9),rp=new Float32Array(4);function us(i,t,e){let n=i[0];if(n<=0||n>0)return i;let r=t*e,s=tp[r];if(s===void 0&&(s=new Float32Array(r),tp[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function Be(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ze(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Zl(i,t){let e=ep[t];e===void 0&&(e=new Int32Array(t),ep[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Fx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ox(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;i.uniform2fv(this.addr,t),ze(e,t)}}function Bx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Be(e,t))return;i.uniform3fv(this.addr,t),ze(e,t)}}function zx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;i.uniform4fv(this.addr,t),ze(e,t)}}function Hx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ze(e,t)}else{if(Be(e,n))return;rp.set(n),i.uniformMatrix2fv(this.addr,!1,rp),ze(e,n)}}function Vx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ze(e,t)}else{if(Be(e,n))return;ip.set(n),i.uniformMatrix3fv(this.addr,!1,ip),ze(e,n)}}function Gx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ze(e,t)}else{if(Be(e,n))return;np.set(n),i.uniformMatrix4fv(this.addr,!1,np),ze(e,n)}}function Wx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Xx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;i.uniform2iv(this.addr,t),ze(e,t)}}function $x(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;i.uniform3iv(this.addr,t),ze(e,t)}}function qx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;i.uniform4iv(this.addr,t),ze(e,t)}}function Yx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Zx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;i.uniform2uiv(this.addr,t),ze(e,t)}}function jx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;i.uniform3uiv(this.addr,t),ze(e,t)}}function Jx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;i.uniform4uiv(this.addr,t),ze(e,t)}}function Kx(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Qu.compareFunction=Ih,s=Qu):s=xp,e.setTexture2D(t||s,r)}function Qx(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||bp,r)}function tv(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||yp,r)}function ev(i,t,e){let n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||vp,r)}function nv(i){switch(i){case 5126:return Fx;case 35664:return Ox;case 35665:return Bx;case 35666:return zx;case 35674:return Hx;case 35675:return Vx;case 35676:return Gx;case 5124:case 35670:return Wx;case 35667:case 35671:return Xx;case 35668:case 35672:return $x;case 35669:case 35673:return qx;case 5125:return Yx;case 36294:return Zx;case 36295:return jx;case 36296:return Jx;case 35678:case 36198:case 36298:case 36306:case 35682:return Kx;case 35679:case 36299:case 36307:return Qx;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return ev}}function iv(i,t){i.uniform1fv(this.addr,t)}function rv(i,t){let e=us(t,this.size,2);i.uniform2fv(this.addr,e)}function sv(i,t){let e=us(t,this.size,3);i.uniform3fv(this.addr,e)}function ov(i,t){let e=us(t,this.size,4);i.uniform4fv(this.addr,e)}function av(i,t){let e=us(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function lv(i,t){let e=us(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function cv(i,t){let e=us(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function hv(i,t){i.uniform1iv(this.addr,t)}function dv(i,t){i.uniform2iv(this.addr,t)}function uv(i,t){i.uniform3iv(this.addr,t)}function pv(i,t){i.uniform4iv(this.addr,t)}function fv(i,t){i.uniform1uiv(this.addr,t)}function mv(i,t){i.uniform2uiv(this.addr,t)}function gv(i,t){i.uniform3uiv(this.addr,t)}function xv(i,t){i.uniform4uiv(this.addr,t)}function vv(i,t,e){let n=this.cache,r=t.length,s=Zl(e,r);Be(n,s)||(i.uniform1iv(this.addr,s),ze(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||xp,s[o])}function bv(i,t,e){let n=this.cache,r=t.length,s=Zl(e,r);Be(n,s)||(i.uniform1iv(this.addr,s),ze(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||bp,s[o])}function yv(i,t,e){let n=this.cache,r=t.length,s=Zl(e,r);Be(n,s)||(i.uniform1iv(this.addr,s),ze(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||yp,s[o])}function _v(i,t,e){let n=this.cache,r=t.length,s=Zl(e,r);Be(n,s)||(i.uniform1iv(this.addr,s),ze(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||vp,s[o])}function wv(i){switch(i){case 5126:return iv;case 35664:return rv;case 35665:return sv;case 35666:return ov;case 35674:return av;case 35675:return lv;case 35676:return cv;case 5124:case 35670:return hv;case 35667:case 35671:return dv;case 35668:case 35672:return uv;case 35669:case 35673:return pv;case 5125:return fv;case 36294:return mv;case 36295:return gv;case 36296:return xv;case 35678:case 36198:case 36298:case 36306:case 35682:return vv;case 35679:case 36299:case 36307:return bv;case 35680:case 36300:case 36308:case 36293:return yv;case 36289:case 36303:case 36311:case 36292:return _v}}var Xh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=nv(e.type)}},$h=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=wv(e.type)}},qh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(t,e[a.id],n)}}},Wh=/(\w+)(\])?(\[|\.)?/g;function sp(i,t){i.seq.push(t),i.map[t.id]=t}function Mv(i,t,e){let n=i.name,r=n.length;for(Wh.lastIndex=0;;){let s=Wh.exec(n),o=Wh.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){sp(e,l===void 0?new Xh(a,i,t):new $h(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new qh(a),sp(e,h)),e=h}}}var ds=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Mv(s,o,this)}}setValue(t,e,n,r){let s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){let r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){let a=e[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,r)}}static seqWithValue(t,e){let n=[];for(let r=0,s=t.length;r!==s;++r){let o=t[r];o.id in e&&n.push(o)}return n}};function op(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Sv=37297,Ev=0;function Tv(i,t){let e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var ap=new Vt;function Av(i){Zt._getMatrix(ap,Zt.workingColorSpace,i);let t=`mat3( ${ap.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case Ns:return[t,"LinearTransferOETF"];case Qt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function lp(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Tv(i.getShaderSource(t),a)}else return s}function Rv(i,t){let e=Av(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Cv(i,t){let e;switch(t){case tl:e="Linear";break;case el:e="Reinhard";break;case nl:e="Cineon";break;case il:e="ACESFilmic";break;case sl:e="AgX";break;case ol:e="Neutral";break;case rl:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var $l=new L;function Iv(){Zt.getLuminanceCoefficients($l);let i=$l.x.toFixed(4),t=$l.y.toFixed(4),e=$l.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xo).join(`
`)}function Lv(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Dv(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(t,r),o=s.name,a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function xo(i){return i!==""}function cp(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hp(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var kv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yh(i){return i.replace(kv,Nv)}var Uv=new Map;function Nv(i,t){let e=$t[t];if(e===void 0){let n=Uv.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Yh(e)}var Fv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function dp(i){return i.replace(Fv,Ov)}function Ov(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function up(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Bv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===xh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===au?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ri&&(t="SHADOWMAP_TYPE_VSM"),t}function zv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case xr:case vr:t="ENVMAP_TYPE_CUBE";break;case ho:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Hv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case vr:t="ENVMAP_MODE_REFRACTION";break}return t}function Vv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Qa:t="ENVMAP_BLENDING_MULTIPLY";break;case Tu:t="ENVMAP_BLENDING_MIX";break;case Au:t="ENVMAP_BLENDING_ADD";break}return t}function Gv(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Wv(i,t,e,n){let r=i.getContext(),s=e.defines,o=e.vertexShader,a=e.fragmentShader,c=Bv(e),l=zv(e),d=Hv(e),h=Vv(e),u=Gv(e),p=Pv(e),m=Lv(s),x=r.createProgram(),g,f,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(xo).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(xo).join(`
`),f.length>0&&(f+=`
`)):(g=[up(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xo).join(`
`),f=[up(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?$t.tonemapping_pars_fragment:"",e.toneMapping!==Mi?Cv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,Rv("linearToOutputTexel",e.outputColorSpace),Iv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xo).join(`
`)),o=Yh(o),o=cp(o,e),o=hp(o,e),a=Yh(a),a=cp(a,e),a=hp(a,e),o=dp(o),a=dp(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",e.glslVersion===Ph?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ph?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let y=S+g+o,b=S+f+a,T=op(r,r.VERTEX_SHADER,y),E=op(r,r.FRAGMENT_SHADER,b);r.attachShader(x,T),r.attachShader(x,E),e.index0AttributeName!==void 0?r.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function R(I){if(i.debug.checkShaderErrors){let k=r.getProgramInfoLog(x)||"",z=r.getShaderInfoLog(T)||"",G=r.getShaderInfoLog(E)||"",B=k.trim(),H=z.trim(),W=G.trim(),O=!0,nt=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,x,T,E);else{let tt=lp(r,T,"vertex"),rt=lp(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+B+`
`+tt+`
`+rt)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(H===""||W==="")&&(nt=!1);nt&&(I.diagnostics={runnable:O,programLog:B,vertexShader:{log:H,prefix:g},fragmentShader:{log:W,prefix:f}})}r.deleteShader(T),r.deleteShader(E),C=new ds(r,x),v=Dv(r,x)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let v;this.getAttributes=function(){return v===void 0&&R(this),v};let w=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(x,Sv)),w},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ev++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=E,this}var Xv=0,Zh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new jh(t),e.set(t,n)),n}},jh=class{constructor(t){this.id=Xv++,this.code=t,this.usedTimes=0}};function $v(i,t,e,n,r,s,o){let a=new zs,c=new Zh,l=new Set,d=[],h=r.logarithmicDepthBuffer,u=r.vertexTextures,p=r.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,w,I,k,z){let G=k.fog,B=z.geometry,H=v.isMeshStandardMaterial?k.environment:null,W=(v.isMeshStandardMaterial?e:t).get(v.envMap||H),O=W&&W.mapping===ho?W.image.height:null,nt=m[v.type];v.precision!==null&&(p=r.getMaxPrecision(v.precision),p!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));let tt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,rt=tt!==void 0?tt.length:0,It=0;B.morphAttributes.position!==void 0&&(It=1),B.morphAttributes.normal!==void 0&&(It=2),B.morphAttributes.color!==void 0&&(It=3);let Wt,gt,ft,X;if(nt){let ie=oi[nt];Wt=ie.vertexShader,gt=ie.fragmentShader}else Wt=v.vertexShader,gt=v.fragmentShader,c.update(v),ft=c.getVertexShaderID(v),X=c.getFragmentShaderID(v);let Z=i.getRenderTarget(),lt=i.state.buffers.depth.getReversed(),bt=z.isInstancedMesh===!0,xt=z.isBatchedMesh===!0,Gt=!!v.map,Se=!!v.matcap,P=!!W,oe=!!v.aoMap,Ot=!!v.lightMap,Dt=!!v.bumpMap,wt=!!v.normalMap,ue=!!v.displacementMap,St=!!v.emissiveMap,Ht=!!v.metalnessMap,we=!!v.roughnessMap,Me=v.anisotropy>0,A=v.clearcoat>0,_=v.dispersion>0,V=v.iridescence>0,j=v.sheen>0,et=v.transmission>0,Y=Me&&!!v.anisotropyMap,Tt=A&&!!v.clearcoatMap,ct=A&&!!v.clearcoatNormalMap,Mt=A&&!!v.clearcoatRoughnessMap,Rt=V&&!!v.iridescenceMap,st=V&&!!v.iridescenceThicknessMap,pt=j&&!!v.sheenColorMap,Ut=j&&!!v.sheenRoughnessMap,Ct=!!v.specularMap,ut=!!v.specularColorMap,Bt=!!v.specularIntensityMap,D=et&&!!v.transmissionMap,J=et&&!!v.thicknessMap,ht=!!v.gradientMap,yt=!!v.alphaMap,it=v.alphaTest>0,K=!!v.alphaHash,At=!!v.extensions,zt=Mi;v.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(zt=i.toneMapping);let xe={shaderID:nt,shaderType:v.type,shaderName:v.name,vertexShader:Wt,fragmentShader:gt,defines:v.defines,customVertexShaderID:ft,customFragmentShaderID:X,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:xt,batchingColor:xt&&z._colorsTexture!==null,instancing:bt,instancingColor:bt&&z.instanceColor!==null,instancingMorph:bt&&z.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:dr,alphaToCoverage:!!v.alphaToCoverage,map:Gt,matcap:Se,envMap:P,envMapMode:P&&W.mapping,envMapCubeUVHeight:O,aoMap:oe,lightMap:Ot,bumpMap:Dt,normalMap:wt,displacementMap:u&&ue,emissiveMap:St,normalMapObjectSpace:wt&&v.normalMapType===Pu,normalMapTangentSpace:wt&&v.normalMapType===Ch,metalnessMap:Ht,roughnessMap:we,anisotropy:Me,anisotropyMap:Y,clearcoat:A,clearcoatMap:Tt,clearcoatNormalMap:ct,clearcoatRoughnessMap:Mt,dispersion:_,iridescence:V,iridescenceMap:Rt,iridescenceThicknessMap:st,sheen:j,sheenColorMap:pt,sheenRoughnessMap:Ut,specularMap:Ct,specularColorMap:ut,specularIntensityMap:Bt,transmission:et,transmissionMap:D,thicknessMap:J,gradientMap:ht,opaque:v.transparent===!1&&v.blending===wi&&v.alphaToCoverage===!1,alphaMap:yt,alphaTest:it,alphaHash:K,combine:v.combine,mapUv:Gt&&x(v.map.channel),aoMapUv:oe&&x(v.aoMap.channel),lightMapUv:Ot&&x(v.lightMap.channel),bumpMapUv:Dt&&x(v.bumpMap.channel),normalMapUv:wt&&x(v.normalMap.channel),displacementMapUv:ue&&x(v.displacementMap.channel),emissiveMapUv:St&&x(v.emissiveMap.channel),metalnessMapUv:Ht&&x(v.metalnessMap.channel),roughnessMapUv:we&&x(v.roughnessMap.channel),anisotropyMapUv:Y&&x(v.anisotropyMap.channel),clearcoatMapUv:Tt&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:ct&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Mt&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Rt&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:st&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:pt&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&x(v.sheenRoughnessMap.channel),specularMapUv:Ct&&x(v.specularMap.channel),specularColorMapUv:ut&&x(v.specularColorMap.channel),specularIntensityMapUv:Bt&&x(v.specularIntensityMap.channel),transmissionMapUv:D&&x(v.transmissionMap.channel),thicknessMapUv:J&&x(v.thicknessMap.channel),alphaMapUv:yt&&x(v.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(wt||Me),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!B.attributes.uv&&(Gt||yt),fog:!!G,useFog:v.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:lt,skinning:z.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:It,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:zt,decodeVideoTexture:Gt&&v.map.isVideoTexture===!0&&Zt.getTransfer(v.map.colorSpace)===Qt,decodeVideoTextureEmissive:St&&v.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(v.emissiveMap.colorSpace)===Qt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ce,flipSided:v.side===an,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:At&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&v.extensions.multiDraw===!0||xt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return xe.vertexUv1s=l.has(1),xe.vertexUv2s=l.has(2),xe.vertexUv3s=l.has(3),l.clear(),xe}function f(v){let w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(let I in v.defines)w.push(I),w.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(S(w,v),y(w,v),w.push(i.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function S(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function y(v,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),w.gradientMap&&a.enable(22),v.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),v.push(a.mask)}function b(v){let w=m[v.type],I;if(w){let k=oi[w];I=Yn.clone(k.uniforms)}else I=v.uniforms;return I}function T(v,w){let I;for(let k=0,z=d.length;k<z;k++){let G=d[k];if(G.cacheKey===w){I=G,++I.usedTimes;break}}return I===void 0&&(I=new Wv(i,w,v,s),d.push(I)),I}function E(v){if(--v.usedTimes===0){let w=d.indexOf(v);d[w]=d[d.length-1],d.pop(),v.destroy()}}function R(v){c.remove(v)}function C(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:b,acquireProgram:T,releaseProgram:E,releaseShaderCache:R,programs:d,dispose:C}}function qv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Yv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function pp(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function fp(){let i=[],t=0,e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(h,u,p,m,x,g){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:u,material:p,groupOrder:m,renderOrder:h.renderOrder,z:x,group:g},i[t]=f):(f.id=h.id,f.object=h,f.geometry=u,f.material=p,f.groupOrder=m,f.renderOrder=h.renderOrder,f.z=x,f.group=g),t++,f}function a(h,u,p,m,x,g){let f=o(h,u,p,m,x,g);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):e.push(f)}function c(h,u,p,m,x,g){let f=o(h,u,p,m,x,g);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):e.unshift(f)}function l(h,u){e.length>1&&e.sort(h||Yv),n.length>1&&n.sort(u||pp),r.length>1&&r.sort(u||pp)}function d(){for(let h=t,u=i.length;h<u;h++){let p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:d,sort:l}}function Zv(){let i=new WeakMap;function t(n,r){let s=i.get(n),o;return s===void 0?(o=new fp,i.set(n,[o])):r>=s.length?(o=new fp,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function jv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Pt};break;case"SpotLight":e={position:new L,direction:new L,color:new Pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Pt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Pt,groundColor:new Pt};break;case"RectAreaLight":e={color:new Pt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Jv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Kv=0;function Qv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function tb(i){let t=new jv,e=Jv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);let r=new L,s=new ve,o=new ve;function a(l){let d=0,h=0,u=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let p=0,m=0,x=0,g=0,f=0,S=0,y=0,b=0,T=0,E=0,R=0;l.sort(Qv);for(let v=0,w=l.length;v<w;v++){let I=l[v],k=I.color,z=I.intensity,G=I.distance,B=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=k.r*z,h+=k.g*z,u+=k.b*z;else if(I.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(I.sh.coefficients[H],z);R++}else if(I.isDirectionalLight){let H=t.get(I);if(H.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let W=I.shadow,O=e.get(I);O.shadowIntensity=W.intensity,O.shadowBias=W.bias,O.shadowNormalBias=W.normalBias,O.shadowRadius=W.radius,O.shadowMapSize=W.mapSize,n.directionalShadow[p]=O,n.directionalShadowMap[p]=B,n.directionalShadowMatrix[p]=I.shadow.matrix,S++}n.directional[p]=H,p++}else if(I.isSpotLight){let H=t.get(I);H.position.setFromMatrixPosition(I.matrixWorld),H.color.copy(k).multiplyScalar(z),H.distance=G,H.coneCos=Math.cos(I.angle),H.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),H.decay=I.decay,n.spot[x]=H;let W=I.shadow;if(I.map&&(n.spotLightMap[T]=I.map,T++,W.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[x]=W.matrix,I.castShadow){let O=e.get(I);O.shadowIntensity=W.intensity,O.shadowBias=W.bias,O.shadowNormalBias=W.normalBias,O.shadowRadius=W.radius,O.shadowMapSize=W.mapSize,n.spotShadow[x]=O,n.spotShadowMap[x]=B,b++}x++}else if(I.isRectAreaLight){let H=t.get(I);H.color.copy(k).multiplyScalar(z),H.halfWidth.set(I.width*.5,0,0),H.halfHeight.set(0,I.height*.5,0),n.rectArea[g]=H,g++}else if(I.isPointLight){let H=t.get(I);if(H.color.copy(I.color).multiplyScalar(I.intensity),H.distance=I.distance,H.decay=I.decay,I.castShadow){let W=I.shadow,O=e.get(I);O.shadowIntensity=W.intensity,O.shadowBias=W.bias,O.shadowNormalBias=W.normalBias,O.shadowRadius=W.radius,O.shadowMapSize=W.mapSize,O.shadowCameraNear=W.camera.near,O.shadowCameraFar=W.camera.far,n.pointShadow[m]=O,n.pointShadowMap[m]=B,n.pointShadowMatrix[m]=I.shadow.matrix,y++}n.point[m]=H,m++}else if(I.isHemisphereLight){let H=t.get(I);H.skyColor.copy(I.color).multiplyScalar(z),H.groundColor.copy(I.groundColor).multiplyScalar(z),n.hemi[f]=H,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=u;let C=n.hash;(C.directionalLength!==p||C.pointLength!==m||C.spotLength!==x||C.rectAreaLength!==g||C.hemiLength!==f||C.numDirectionalShadows!==S||C.numPointShadows!==y||C.numSpotShadows!==b||C.numSpotMaps!==T||C.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=b+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=R,C.directionalLength=p,C.pointLength=m,C.spotLength=x,C.rectAreaLength=g,C.hemiLength=f,C.numDirectionalShadows=S,C.numPointShadows=y,C.numSpotShadows=b,C.numSpotMaps=T,C.numLightProbes=R,n.version=Kv++)}function c(l,d){let h=0,u=0,p=0,m=0,x=0,g=d.matrixWorldInverse;for(let f=0,S=l.length;f<S;f++){let y=l[f];if(y.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(g),h++}else if(y.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(g),p++}else if(y.isRectAreaLight){let b=n.rectArea[m];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),o.identity(),s.copy(y.matrixWorld),s.premultiply(g),o.extractRotation(s),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),m++}else if(y.isPointLight){let b=n.point[u];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),u++}else if(y.isHemisphereLight){let b=n.hemi[x];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),x++}}}return{setup:a,setupView:c,state:n}}function mp(i){let t=new tb(i),e=[],n=[];function r(d){l.camera=d,e.length=0,n.length=0}function s(d){e.push(d)}function o(d){n.push(d)}function a(){t.setup(e)}function c(d){t.setupView(e,d)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function eb(i){let t=new WeakMap;function e(r,s=0){let o=t.get(r),a;return o===void 0?(a=new mp(i),t.set(r,[a])):s>=o.length?(a=new mp(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var nb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ib=`uniform sampler2D shadow_pass;
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
}`;function rb(i,t,e){let n=new ts,r=new _t,s=new _t,o=new ce,a=new ka({depthPacking:Iu}),c=new Ua,l={},d=e.maxTextureSize,h={[_i]:an,[an]:_i,[Ce]:Ce},u=new Re({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:nb,fragmentShader:ib}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let m=new Ne;m.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new fe(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xh;let f=this.type;this.render=function(E,R,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;let v=i.getRenderTarget(),w=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),k=i.state;k.setBlending(Xn),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let z=f!==ri&&this.type===ri,G=f===ri&&this.type!==ri;for(let B=0,H=E.length;B<H;B++){let W=E[B],O=W.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;r.copy(O.mapSize);let nt=O.getFrameExtents();if(r.multiply(nt),s.copy(O.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/nt.x),r.x=s.x*nt.x,O.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/nt.y),r.y=s.y*nt.y,O.mapSize.y=s.y)),O.map===null||z===!0||G===!0){let rt=this.type!==ri?{minFilter:In,magFilter:In}:{};O.map!==null&&O.map.dispose(),O.map=new Qe(r.x,r.y,rt),O.map.texture.name=W.name+".shadowMap",O.camera.updateProjectionMatrix()}i.setRenderTarget(O.map),i.clear();let tt=O.getViewportCount();for(let rt=0;rt<tt;rt++){let It=O.getViewport(rt);o.set(s.x*It.x,s.y*It.y,s.x*It.z,s.y*It.w),k.viewport(o),O.updateMatrices(W,rt),n=O.getFrustum(),b(R,C,O.camera,W,this.type)}O.isPointLightShadow!==!0&&this.type===ri&&S(O,C),O.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(v,w,I)};function S(E,R){let C=t.update(x);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Qe(r.x,r.y)),u.uniforms.shadow_pass.value=E.map.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(R,null,C,u,x,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(R,null,C,p,x,null)}function y(E,R,C,v){let w=null,I=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)w=I;else if(w=C.isPointLight===!0?c:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let k=w.uuid,z=R.uuid,G=l[k];G===void 0&&(G={},l[k]=G);let B=G[z];B===void 0&&(B=w.clone(),G[z]=B,R.addEventListener("dispose",T)),w=B}if(w.visible=R.visible,w.wireframe=R.wireframe,v===ri?w.side=R.shadowSide!==null?R.shadowSide:R.side:w.side=R.shadowSide!==null?R.shadowSide:h[R.side],w.alphaMap=R.alphaMap,w.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,w.map=R.map,w.clipShadows=R.clipShadows,w.clippingPlanes=R.clippingPlanes,w.clipIntersection=R.clipIntersection,w.displacementMap=R.displacementMap,w.displacementScale=R.displacementScale,w.displacementBias=R.displacementBias,w.wireframeLinewidth=R.wireframeLinewidth,w.linewidth=R.linewidth,C.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let k=i.properties.get(w);k.light=C}return w}function b(E,R,C,v,w){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&w===ri)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);let z=t.update(E),G=E.material;if(Array.isArray(G)){let B=z.groups;for(let H=0,W=B.length;H<W;H++){let O=B[H],nt=G[O.materialIndex];if(nt&&nt.visible){let tt=y(E,nt,v,w);E.onBeforeShadow(i,E,R,C,z,tt,O),i.renderBufferDirect(C,null,z,tt,E,O),E.onAfterShadow(i,E,R,C,z,tt,O)}}}else if(G.visible){let B=y(E,G,v,w);E.onBeforeShadow(i,E,R,C,z,B,null),i.renderBufferDirect(C,null,z,B,E,null),E.onAfterShadow(i,E,R,C,z,B,null)}}let k=E.children;for(let z=0,G=k.length;z<G;z++)b(k[z],R,C,v,w)}function T(E){E.target.removeEventListener("dispose",T);for(let C in l){let v=l[C],w=E.target.uuid;w in v&&(v[w].dispose(),delete v[w])}}}var sb={[$a]:qa,[Ya]:Ja,[Za]:Ka,[hr]:ja,[qa]:$a,[Ja]:Ya,[Ka]:Za,[ja]:hr};function ob(i,t){function e(){let D=!1,J=new ce,ht=null,yt=new ce(0,0,0,0);return{setMask:function(it){ht!==it&&!D&&(i.colorMask(it,it,it,it),ht=it)},setLocked:function(it){D=it},setClear:function(it,K,At,zt,xe){xe===!0&&(it*=zt,K*=zt,At*=zt),J.set(it,K,At,zt),yt.equals(J)===!1&&(i.clearColor(it,K,At,zt),yt.copy(J))},reset:function(){D=!1,ht=null,yt.set(-1,0,0,0)}}}function n(){let D=!1,J=!1,ht=null,yt=null,it=null;return{setReversed:function(K){if(J!==K){let At=t.get("EXT_clip_control");K?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),J=K;let zt=it;it=null,this.setClear(zt)}},getReversed:function(){return J},setTest:function(K){K?Z(i.DEPTH_TEST):lt(i.DEPTH_TEST)},setMask:function(K){ht!==K&&!D&&(i.depthMask(K),ht=K)},setFunc:function(K){if(J&&(K=sb[K]),yt!==K){switch(K){case $a:i.depthFunc(i.NEVER);break;case qa:i.depthFunc(i.ALWAYS);break;case Ya:i.depthFunc(i.LESS);break;case hr:i.depthFunc(i.LEQUAL);break;case Za:i.depthFunc(i.EQUAL);break;case ja:i.depthFunc(i.GEQUAL);break;case Ja:i.depthFunc(i.GREATER);break;case Ka:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}yt=K}},setLocked:function(K){D=K},setClear:function(K){it!==K&&(J&&(K=1-K),i.clearDepth(K),it=K)},reset:function(){D=!1,ht=null,yt=null,it=null,J=!1}}}function r(){let D=!1,J=null,ht=null,yt=null,it=null,K=null,At=null,zt=null,xe=null;return{setTest:function(ie){D||(ie?Z(i.STENCIL_TEST):lt(i.STENCIL_TEST))},setMask:function(ie){J!==ie&&!D&&(i.stencilMask(ie),J=ie)},setFunc:function(ie,pi,ei){(ht!==ie||yt!==pi||it!==ei)&&(i.stencilFunc(ie,pi,ei),ht=ie,yt=pi,it=ei)},setOp:function(ie,pi,ei){(K!==ie||At!==pi||zt!==ei)&&(i.stencilOp(ie,pi,ei),K=ie,At=pi,zt=ei)},setLocked:function(ie){D=ie},setClear:function(ie){xe!==ie&&(i.clearStencil(ie),xe=ie)},reset:function(){D=!1,J=null,ht=null,yt=null,it=null,K=null,At=null,zt=null,xe=null}}}let s=new e,o=new n,a=new r,c=new WeakMap,l=new WeakMap,d={},h={},u=new WeakMap,p=[],m=null,x=!1,g=null,f=null,S=null,y=null,b=null,T=null,E=null,R=new Pt(0,0,0),C=0,v=!1,w=null,I=null,k=null,z=null,G=null,B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,W=0,O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(O)[1]),H=W>=1):O.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),H=W>=2);let nt=null,tt={},rt=i.getParameter(i.SCISSOR_BOX),It=i.getParameter(i.VIEWPORT),Wt=new ce().fromArray(rt),gt=new ce().fromArray(It);function ft(D,J,ht,yt){let it=new Uint8Array(4),K=i.createTexture();i.bindTexture(D,K),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let At=0;At<ht;At++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(J,0,i.RGBA,1,1,yt,0,i.RGBA,i.UNSIGNED_BYTE,it):i.texImage2D(J+At,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,it);return K}let X={};X[i.TEXTURE_2D]=ft(i.TEXTURE_2D,i.TEXTURE_2D,1),X[i.TEXTURE_CUBE_MAP]=ft(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[i.TEXTURE_2D_ARRAY]=ft(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),X[i.TEXTURE_3D]=ft(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Z(i.DEPTH_TEST),o.setFunc(hr),Dt(!1),wt(gh),Z(i.CULL_FACE),oe(Xn);function Z(D){d[D]!==!0&&(i.enable(D),d[D]=!0)}function lt(D){d[D]!==!1&&(i.disable(D),d[D]=!1)}function bt(D,J){return h[D]!==J?(i.bindFramebuffer(D,J),h[D]=J,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=J),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=J),!0):!1}function xt(D,J){let ht=p,yt=!1;if(D){ht=u.get(J),ht===void 0&&(ht=[],u.set(J,ht));let it=D.textures;if(ht.length!==it.length||ht[0]!==i.COLOR_ATTACHMENT0){for(let K=0,At=it.length;K<At;K++)ht[K]=i.COLOR_ATTACHMENT0+K;ht.length=it.length,yt=!0}}else ht[0]!==i.BACK&&(ht[0]=i.BACK,yt=!0);yt&&i.drawBuffers(ht)}function Gt(D){return m!==D?(i.useProgram(D),m=D,!0):!1}let Se={[Ni]:i.FUNC_ADD,[cu]:i.FUNC_SUBTRACT,[hu]:i.FUNC_REVERSE_SUBTRACT};Se[du]=i.MIN,Se[uu]=i.MAX;let P={[pu]:i.ZERO,[fu]:i.ONE,[mu]:i.SRC_COLOR,[ya]:i.SRC_ALPHA,[_u]:i.SRC_ALPHA_SATURATE,[bu]:i.DST_COLOR,[xu]:i.DST_ALPHA,[gu]:i.ONE_MINUS_SRC_COLOR,[_a]:i.ONE_MINUS_SRC_ALPHA,[yu]:i.ONE_MINUS_DST_COLOR,[vu]:i.ONE_MINUS_DST_ALPHA,[wu]:i.CONSTANT_COLOR,[Mu]:i.ONE_MINUS_CONSTANT_COLOR,[Su]:i.CONSTANT_ALPHA,[Eu]:i.ONE_MINUS_CONSTANT_ALPHA};function oe(D,J,ht,yt,it,K,At,zt,xe,ie){if(D===Xn){x===!0&&(lt(i.BLEND),x=!1);return}if(x===!1&&(Z(i.BLEND),x=!0),D!==lu){if(D!==g||ie!==v){if((f!==Ni||b!==Ni)&&(i.blendEquation(i.FUNC_ADD),f=Ni,b=Ni),ie)switch(D){case wi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xi:i.blendFunc(i.ONE,i.ONE);break;case vh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case wi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case vh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case bh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,y=null,T=null,E=null,R.set(0,0,0),C=0,g=D,v=ie}return}it=it||J,K=K||ht,At=At||yt,(J!==f||it!==b)&&(i.blendEquationSeparate(Se[J],Se[it]),f=J,b=it),(ht!==S||yt!==y||K!==T||At!==E)&&(i.blendFuncSeparate(P[ht],P[yt],P[K],P[At]),S=ht,y=yt,T=K,E=At),(zt.equals(R)===!1||xe!==C)&&(i.blendColor(zt.r,zt.g,zt.b,xe),R.copy(zt),C=xe),g=D,v=!1}function Ot(D,J){D.side===Ce?lt(i.CULL_FACE):Z(i.CULL_FACE);let ht=D.side===an;J&&(ht=!ht),Dt(ht),D.blending===wi&&D.transparent===!1?oe(Xn):oe(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),s.setMask(D.colorWrite);let yt=D.stencilWrite;a.setTest(yt),yt&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),St(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(D){w!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),w=D)}function wt(D){D!==su?(Z(i.CULL_FACE),D!==I&&(D===gh?i.cullFace(i.BACK):D===ou?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):lt(i.CULL_FACE),I=D}function ue(D){D!==k&&(H&&i.lineWidth(D),k=D)}function St(D,J,ht){D?(Z(i.POLYGON_OFFSET_FILL),(z!==J||G!==ht)&&(i.polygonOffset(J,ht),z=J,G=ht)):lt(i.POLYGON_OFFSET_FILL)}function Ht(D){D?Z(i.SCISSOR_TEST):lt(i.SCISSOR_TEST)}function we(D){D===void 0&&(D=i.TEXTURE0+B-1),nt!==D&&(i.activeTexture(D),nt=D)}function Me(D,J,ht){ht===void 0&&(nt===null?ht=i.TEXTURE0+B-1:ht=nt);let yt=tt[ht];yt===void 0&&(yt={type:void 0,texture:void 0},tt[ht]=yt),(yt.type!==D||yt.texture!==J)&&(nt!==ht&&(i.activeTexture(ht),nt=ht),i.bindTexture(D,J||X[D]),yt.type=D,yt.texture=J)}function A(){let D=tt[nt];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function et(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Tt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ct(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Mt(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Rt(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function st(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function pt(D){Wt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Wt.copy(D))}function Ut(D){gt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),gt.copy(D))}function Ct(D,J){let ht=l.get(J);ht===void 0&&(ht=new WeakMap,l.set(J,ht));let yt=ht.get(D);yt===void 0&&(yt=i.getUniformBlockIndex(J,D.name),ht.set(D,yt))}function ut(D,J){let yt=l.get(J).get(D);c.get(J)!==yt&&(i.uniformBlockBinding(J,yt,D.__bindingPointIndex),c.set(J,yt))}function Bt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},nt=null,tt={},h={},u=new WeakMap,p=[],m=null,x=!1,g=null,f=null,S=null,y=null,b=null,T=null,E=null,R=new Pt(0,0,0),C=0,v=!1,w=null,I=null,k=null,z=null,G=null,Wt.set(0,0,i.canvas.width,i.canvas.height),gt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:Z,disable:lt,bindFramebuffer:bt,drawBuffers:xt,useProgram:Gt,setBlending:oe,setMaterial:Ot,setFlipSided:Dt,setCullFace:wt,setLineWidth:ue,setPolygonOffset:St,setScissorTest:Ht,activeTexture:we,bindTexture:Me,unbindTexture:A,compressedTexImage2D:_,compressedTexImage3D:V,texImage2D:Rt,texImage3D:st,updateUBOMapping:Ct,uniformBlockBinding:ut,texStorage2D:ct,texStorage3D:Mt,texSubImage2D:j,texSubImage3D:et,compressedTexSubImage2D:Y,compressedTexSubImage3D:Tt,scissor:pt,viewport:Ut,reset:Bt}}function ab(i,t,e,n,r,s,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new _t,d=new WeakMap,h,u=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,_){return p?new OffscreenCanvas(A,_):Os("canvas")}function x(A,_,V){let j=1,et=Me(A);if((et.width>V||et.height>V)&&(j=V/Math.max(et.width,et.height)),j<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let Y=Math.floor(j*et.width),Tt=Math.floor(j*et.height);h===void 0&&(h=m(Y,Tt));let ct=_?m(Y,Tt):h;return ct.width=Y,ct.height=Tt,ct.getContext("2d").drawImage(A,0,0,Y,Tt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+Y+"x"+Tt+")."),ct}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),A;return A}function g(A){return A.generateMipmaps}function f(A){i.generateMipmap(A)}function S(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,_,V,j,et=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Y=_;if(_===i.RED&&(V===i.FLOAT&&(Y=i.R32F),V===i.HALF_FLOAT&&(Y=i.R16F),V===i.UNSIGNED_BYTE&&(Y=i.R8)),_===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(Y=i.R8UI),V===i.UNSIGNED_SHORT&&(Y=i.R16UI),V===i.UNSIGNED_INT&&(Y=i.R32UI),V===i.BYTE&&(Y=i.R8I),V===i.SHORT&&(Y=i.R16I),V===i.INT&&(Y=i.R32I)),_===i.RG&&(V===i.FLOAT&&(Y=i.RG32F),V===i.HALF_FLOAT&&(Y=i.RG16F),V===i.UNSIGNED_BYTE&&(Y=i.RG8)),_===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(Y=i.RG8UI),V===i.UNSIGNED_SHORT&&(Y=i.RG16UI),V===i.UNSIGNED_INT&&(Y=i.RG32UI),V===i.BYTE&&(Y=i.RG8I),V===i.SHORT&&(Y=i.RG16I),V===i.INT&&(Y=i.RG32I)),_===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),V===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),V===i.UNSIGNED_INT&&(Y=i.RGB32UI),V===i.BYTE&&(Y=i.RGB8I),V===i.SHORT&&(Y=i.RGB16I),V===i.INT&&(Y=i.RGB32I)),_===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),V===i.UNSIGNED_INT&&(Y=i.RGBA32UI),V===i.BYTE&&(Y=i.RGBA8I),V===i.SHORT&&(Y=i.RGBA16I),V===i.INT&&(Y=i.RGBA32I)),_===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),_===i.RGBA){let Tt=et?Ns:Zt.getTransfer(j);V===i.FLOAT&&(Y=i.RGBA32F),V===i.HALF_FLOAT&&(Y=i.RGBA16F),V===i.UNSIGNED_BYTE&&(Y=Tt===Qt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function b(A,_){let V;return A?_===null||_===qi||_===os?V=i.DEPTH24_STENCIL8:_===si?V=i.DEPTH32F_STENCIL8:_===ss&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===qi||_===os?V=i.DEPTH_COMPONENT24:_===si?V=i.DEPTH_COMPONENT32F:_===ss&&(V=i.DEPTH_COMPONENT16),V}function T(A,_){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==In&&A.minFilter!==Vn?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function E(A){let _=A.target;_.removeEventListener("dispose",E),C(_),_.isVideoTexture&&d.delete(_)}function R(A){let _=A.target;_.removeEventListener("dispose",R),w(_)}function C(A){let _=n.get(A);if(_.__webglInit===void 0)return;let V=A.source,j=u.get(V);if(j){let et=j[_.__cacheKey];et.usedTimes--,et.usedTimes===0&&v(A),Object.keys(j).length===0&&u.delete(V)}n.remove(A)}function v(A){let _=n.get(A);i.deleteTexture(_.__webglTexture);let V=A.source,j=u.get(V);delete j[_.__cacheKey],o.memory.textures--}function w(A){let _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(_.__webglFramebuffer[j]))for(let et=0;et<_.__webglFramebuffer[j].length;et++)i.deleteFramebuffer(_.__webglFramebuffer[j][et]);else i.deleteFramebuffer(_.__webglFramebuffer[j]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[j])}else{if(Array.isArray(_.__webglFramebuffer))for(let j=0;j<_.__webglFramebuffer.length;j++)i.deleteFramebuffer(_.__webglFramebuffer[j]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let j=0;j<_.__webglColorRenderbuffer.length;j++)_.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[j]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let V=A.textures;for(let j=0,et=V.length;j<et;j++){let Y=n.get(V[j]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(V[j])}n.remove(A)}let I=0;function k(){I=0}function z(){let A=I;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),I+=1,A}function G(A){let _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function B(A,_){let V=n.get(A);if(A.isVideoTexture&&Ht(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&V.__version!==A.version){let j=A.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(V,A,_);return}}else A.isExternalTexture&&(V.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+_)}function H(A,_){let V=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){X(V,A,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+_)}function W(A,_){let V=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){X(V,A,_);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+_)}function O(A,_){let V=n.get(A);if(A.version>0&&V.__version!==A.version){Z(V,A,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+_)}let nt={[wa]:i.REPEAT,[Ui]:i.CLAMP_TO_EDGE,[Ma]:i.MIRRORED_REPEAT},tt={[In]:i.NEAREST,[Ru]:i.NEAREST_MIPMAP_NEAREST,[uo]:i.NEAREST_MIPMAP_LINEAR,[Vn]:i.LINEAR,[cl]:i.LINEAR_MIPMAP_NEAREST,[$i]:i.LINEAR_MIPMAP_LINEAR},rt={[Lu]:i.NEVER,[Ou]:i.ALWAYS,[Du]:i.LESS,[Ih]:i.LEQUAL,[ku]:i.EQUAL,[Fu]:i.GEQUAL,[Uu]:i.GREATER,[Nu]:i.NOTEQUAL};function It(A,_){if(_.type===si&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Vn||_.magFilter===cl||_.magFilter===uo||_.magFilter===$i||_.minFilter===Vn||_.minFilter===cl||_.minFilter===uo||_.minFilter===$i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,nt[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,nt[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,nt[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,tt[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,tt[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,rt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===In||_.minFilter!==uo&&_.minFilter!==$i||_.type===si&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Wt(A,_){let V=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",E));let j=_.source,et=u.get(j);et===void 0&&(et={},u.set(j,et));let Y=G(_);if(Y!==A.__cacheKey){et[Y]===void 0&&(et[Y]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),et[Y].usedTimes++;let Tt=et[A.__cacheKey];Tt!==void 0&&(et[A.__cacheKey].usedTimes--,Tt.usedTimes===0&&v(_)),A.__cacheKey=Y,A.__webglTexture=et[Y].texture}return V}function gt(A,_,V){return Math.floor(Math.floor(A/V)/_)}function ft(A,_,V,j){let Y=A.updateRanges;if(Y.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,V,j,_.data);else{Y.sort((st,pt)=>st.start-pt.start);let Tt=0;for(let st=1;st<Y.length;st++){let pt=Y[Tt],Ut=Y[st],Ct=pt.start+pt.count,ut=gt(Ut.start,_.width,4),Bt=gt(pt.start,_.width,4);Ut.start<=Ct+1&&ut===Bt&&gt(Ut.start+Ut.count-1,_.width,4)===ut?pt.count=Math.max(pt.count,Ut.start+Ut.count-pt.start):(++Tt,Y[Tt]=Ut)}Y.length=Tt+1;let ct=i.getParameter(i.UNPACK_ROW_LENGTH),Mt=i.getParameter(i.UNPACK_SKIP_PIXELS),Rt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let st=0,pt=Y.length;st<pt;st++){let Ut=Y[st],Ct=Math.floor(Ut.start/4),ut=Math.ceil(Ut.count/4),Bt=Ct%_.width,D=Math.floor(Ct/_.width),J=ut,ht=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Bt),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,Bt,D,J,ht,V,j,_.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Mt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Rt)}}function X(A,_,V){let j=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(j=i.TEXTURE_3D);let et=Wt(A,_),Y=_.source;e.bindTexture(j,A.__webglTexture,i.TEXTURE0+V);let Tt=n.get(Y);if(Y.version!==Tt.__version||et===!0){e.activeTexture(i.TEXTURE0+V);let ct=Zt.getPrimaries(Zt.workingColorSpace),Mt=_.colorSpace===Si?null:Zt.getPrimaries(_.colorSpace),Rt=_.colorSpace===Si||ct===Mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let st=x(_.image,!1,r.maxTextureSize);st=we(_,st);let pt=s.convert(_.format,_.colorSpace),Ut=s.convert(_.type),Ct=y(_.internalFormat,pt,Ut,_.colorSpace,_.isVideoTexture);It(j,_);let ut,Bt=_.mipmaps,D=_.isVideoTexture!==!0,J=Tt.__version===void 0||et===!0,ht=Y.dataReady,yt=T(_,st);if(_.isDepthTexture)Ct=b(_.format===as,_.type),J&&(D?e.texStorage2D(i.TEXTURE_2D,1,Ct,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Ct,st.width,st.height,0,pt,Ut,null));else if(_.isDataTexture)if(Bt.length>0){D&&J&&e.texStorage2D(i.TEXTURE_2D,yt,Ct,Bt[0].width,Bt[0].height);for(let it=0,K=Bt.length;it<K;it++)ut=Bt[it],D?ht&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,ut.width,ut.height,pt,Ut,ut.data):e.texImage2D(i.TEXTURE_2D,it,Ct,ut.width,ut.height,0,pt,Ut,ut.data);_.generateMipmaps=!1}else D?(J&&e.texStorage2D(i.TEXTURE_2D,yt,Ct,st.width,st.height),ht&&ft(_,st,pt,Ut)):e.texImage2D(i.TEXTURE_2D,0,Ct,st.width,st.height,0,pt,Ut,st.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&J&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,Ct,Bt[0].width,Bt[0].height,st.depth);for(let it=0,K=Bt.length;it<K;it++)if(ut=Bt[it],_.format!==Ln)if(pt!==null)if(D){if(ht)if(_.layerUpdates.size>0){let At=Oh(ut.width,ut.height,_.format,_.type);for(let zt of _.layerUpdates){let xe=ut.data.subarray(zt*At/ut.data.BYTES_PER_ELEMENT,(zt+1)*At/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,zt,ut.width,ut.height,1,pt,xe)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ut.width,ut.height,st.depth,pt,ut.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Ct,ut.width,ut.height,st.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?ht&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ut.width,ut.height,st.depth,pt,Ut,ut.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Ct,ut.width,ut.height,st.depth,0,pt,Ut,ut.data)}else{D&&J&&e.texStorage2D(i.TEXTURE_2D,yt,Ct,Bt[0].width,Bt[0].height);for(let it=0,K=Bt.length;it<K;it++)ut=Bt[it],_.format!==Ln?pt!==null?D?ht&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,ut.width,ut.height,pt,ut.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Ct,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?ht&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,ut.width,ut.height,pt,Ut,ut.data):e.texImage2D(i.TEXTURE_2D,it,Ct,ut.width,ut.height,0,pt,Ut,ut.data)}else if(_.isDataArrayTexture)if(D){if(J&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,Ct,st.width,st.height,st.depth),ht)if(_.layerUpdates.size>0){let it=Oh(st.width,st.height,_.format,_.type);for(let K of _.layerUpdates){let At=st.data.subarray(K*it/st.data.BYTES_PER_ELEMENT,(K+1)*it/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,st.width,st.height,1,pt,Ut,At)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,pt,Ut,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ct,st.width,st.height,st.depth,0,pt,Ut,st.data);else if(_.isData3DTexture)D?(J&&e.texStorage3D(i.TEXTURE_3D,yt,Ct,st.width,st.height,st.depth),ht&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,pt,Ut,st.data)):e.texImage3D(i.TEXTURE_3D,0,Ct,st.width,st.height,st.depth,0,pt,Ut,st.data);else if(_.isFramebufferTexture){if(J)if(D)e.texStorage2D(i.TEXTURE_2D,yt,Ct,st.width,st.height);else{let it=st.width,K=st.height;for(let At=0;At<yt;At++)e.texImage2D(i.TEXTURE_2D,At,Ct,it,K,0,pt,Ut,null),it>>=1,K>>=1}}else if(Bt.length>0){if(D&&J){let it=Me(Bt[0]);e.texStorage2D(i.TEXTURE_2D,yt,Ct,it.width,it.height)}for(let it=0,K=Bt.length;it<K;it++)ut=Bt[it],D?ht&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,pt,Ut,ut):e.texImage2D(i.TEXTURE_2D,it,Ct,pt,Ut,ut);_.generateMipmaps=!1}else if(D){if(J){let it=Me(st);e.texStorage2D(i.TEXTURE_2D,yt,Ct,it.width,it.height)}ht&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt,Ut,st)}else e.texImage2D(i.TEXTURE_2D,0,Ct,pt,Ut,st);g(_)&&f(j),Tt.__version=Y.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function Z(A,_,V){if(_.image.length!==6)return;let j=Wt(A,_),et=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+V);let Y=n.get(et);if(et.version!==Y.__version||j===!0){e.activeTexture(i.TEXTURE0+V);let Tt=Zt.getPrimaries(Zt.workingColorSpace),ct=_.colorSpace===Si?null:Zt.getPrimaries(_.colorSpace),Mt=_.colorSpace===Si||Tt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);let Rt=_.isCompressedTexture||_.image[0].isCompressedTexture,st=_.image[0]&&_.image[0].isDataTexture,pt=[];for(let K=0;K<6;K++)!Rt&&!st?pt[K]=x(_.image[K],!0,r.maxCubemapSize):pt[K]=st?_.image[K].image:_.image[K],pt[K]=we(_,pt[K]);let Ut=pt[0],Ct=s.convert(_.format,_.colorSpace),ut=s.convert(_.type),Bt=y(_.internalFormat,Ct,ut,_.colorSpace),D=_.isVideoTexture!==!0,J=Y.__version===void 0||j===!0,ht=et.dataReady,yt=T(_,Ut);It(i.TEXTURE_CUBE_MAP,_);let it;if(Rt){D&&J&&e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Bt,Ut.width,Ut.height);for(let K=0;K<6;K++){it=pt[K].mipmaps;for(let At=0;At<it.length;At++){let zt=it[At];_.format!==Ln?Ct!==null?D?ht&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,0,0,zt.width,zt.height,Ct,zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,Bt,zt.width,zt.height,0,zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,0,0,zt.width,zt.height,Ct,ut,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,Bt,zt.width,zt.height,0,Ct,ut,zt.data)}}}else{if(it=_.mipmaps,D&&J){it.length>0&&yt++;let K=Me(pt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Bt,K.width,K.height)}for(let K=0;K<6;K++)if(st){D?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,pt[K].width,pt[K].height,Ct,ut,pt[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Bt,pt[K].width,pt[K].height,0,Ct,ut,pt[K].data);for(let At=0;At<it.length;At++){let xe=it[At].image[K].image;D?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,0,0,xe.width,xe.height,Ct,ut,xe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,Bt,xe.width,xe.height,0,Ct,ut,xe.data)}}else{D?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ct,ut,pt[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Bt,Ct,ut,pt[K]);for(let At=0;At<it.length;At++){let zt=it[At];D?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,0,0,Ct,ut,zt.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,Bt,Ct,ut,zt.image[K])}}}g(_)&&f(i.TEXTURE_CUBE_MAP),Y.__version=et.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function lt(A,_,V,j,et,Y){let Tt=s.convert(V.format,V.colorSpace),ct=s.convert(V.type),Mt=y(V.internalFormat,Tt,ct,V.colorSpace),Rt=n.get(_),st=n.get(V);if(st.__renderTarget=_,!Rt.__hasExternalTextures){let pt=Math.max(1,_.width>>Y),Ut=Math.max(1,_.height>>Y);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,Y,Mt,pt,Ut,_.depth,0,Tt,ct,null):e.texImage2D(et,Y,Mt,pt,Ut,0,Tt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),St(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,et,st.__webglTexture,0,ue(_)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,et,st.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function bt(A,_,V){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){let j=_.depthTexture,et=j&&j.isDepthTexture?j.type:null,Y=b(_.stencilBuffer,et),Tt=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=ue(_);St(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,Y,_.width,_.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,Y,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Y,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Tt,i.RENDERBUFFER,A)}else{let j=_.textures;for(let et=0;et<j.length;et++){let Y=j[et],Tt=s.convert(Y.format,Y.colorSpace),ct=s.convert(Y.type),Mt=y(Y.internalFormat,Tt,ct,Y.colorSpace),Rt=ue(_);V&&St(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,Mt,_.width,_.height):St(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Rt,Mt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Mt,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xt(A,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let j=n.get(_.depthTexture);j.__renderTarget=_,(!j.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),B(_.depthTexture,0);let et=j.__webglTexture,Y=ue(_);if(_.depthTexture.format===Yr)St(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(_.depthTexture.format===as)St(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Gt(A){let _=n.get(A),V=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){let j=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),j){let et=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,j.removeEventListener("dispose",et)};j.addEventListener("dispose",et),_.__depthDisposeCallback=et}_.__boundDepthTexture=j}if(A.depthTexture&&!_.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");let j=A.texture.mipmaps;j&&j.length>0?xt(_.__webglFramebuffer[0],A):xt(_.__webglFramebuffer,A)}else if(V){_.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[j]),_.__webglDepthbuffer[j]===void 0)_.__webglDepthbuffer[j]=i.createRenderbuffer(),bt(_.__webglDepthbuffer[j],A,!1);else{let et=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,Y)}}else{let j=A.texture.mipmaps;if(j&&j.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),bt(_.__webglDepthbuffer,A,!1);else{let et=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,Y)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Se(A,_,V){let j=n.get(A);_!==void 0&&lt(j.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Gt(A)}function P(A){let _=A.texture,V=n.get(A),j=n.get(_);A.addEventListener("dispose",R);let et=A.textures,Y=A.isWebGLCubeRenderTarget===!0,Tt=et.length>1;if(Tt||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=_.version,o.memory.textures++),Y){V.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer[ct]=[];for(let Mt=0;Mt<_.mipmaps.length;Mt++)V.__webglFramebuffer[ct][Mt]=i.createFramebuffer()}else V.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer=[];for(let ct=0;ct<_.mipmaps.length;ct++)V.__webglFramebuffer[ct]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Tt)for(let ct=0,Mt=et.length;ct<Mt;ct++){let Rt=n.get(et[ct]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&St(A)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ct=0;ct<et.length;ct++){let Mt=et[ct];V.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ct]);let Rt=s.convert(Mt.format,Mt.colorSpace),st=s.convert(Mt.type),pt=y(Mt.internalFormat,Rt,st,Mt.colorSpace,A.isXRRenderTarget===!0),Ut=ue(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,pt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,V.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),bt(V.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),It(i.TEXTURE_CUBE_MAP,_);for(let ct=0;ct<6;ct++)if(_.mipmaps&&_.mipmaps.length>0)for(let Mt=0;Mt<_.mipmaps.length;Mt++)lt(V.__webglFramebuffer[ct][Mt],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Mt);else lt(V.__webglFramebuffer[ct],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);g(_)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Tt){for(let ct=0,Mt=et.length;ct<Mt;ct++){let Rt=et[ct],st=n.get(Rt),pt=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(pt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,st.__webglTexture),It(pt,Rt),lt(V.__webglFramebuffer,A,Rt,i.COLOR_ATTACHMENT0+ct,pt,0),g(Rt)&&f(pt)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ct=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,j.__webglTexture),It(ct,_),_.mipmaps&&_.mipmaps.length>0)for(let Mt=0;Mt<_.mipmaps.length;Mt++)lt(V.__webglFramebuffer[Mt],A,_,i.COLOR_ATTACHMENT0,ct,Mt);else lt(V.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,ct,0);g(_)&&f(ct),e.unbindTexture()}A.depthBuffer&&Gt(A)}function oe(A){let _=A.textures;for(let V=0,j=_.length;V<j;V++){let et=_[V];if(g(et)){let Y=S(A),Tt=n.get(et).__webglTexture;e.bindTexture(Y,Tt),f(Y),e.unbindTexture()}}}let Ot=[],Dt=[];function wt(A){if(A.samples>0){if(St(A)===!1){let _=A.textures,V=A.width,j=A.height,et=i.COLOR_BUFFER_BIT,Y=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Tt=n.get(A),ct=_.length>1;if(ct)for(let Rt=0;Rt<_.length;Rt++)e.bindFramebuffer(i.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Rt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Tt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Rt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer);let Mt=A.texture.mipmaps;Mt&&Mt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let Rt=0;Rt<_.length;Rt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Tt.__webglColorRenderbuffer[Rt]);let st=n.get(_[Rt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,V,j,0,0,V,j,et,i.NEAREST),c===!0&&(Ot.length=0,Dt.length=0,Ot.push(i.COLOR_ATTACHMENT0+Rt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Ot.push(Y),Dt.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Dt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ot))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let Rt=0;Rt<_.length;Rt++){e.bindFramebuffer(i.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Rt,i.RENDERBUFFER,Tt.__webglColorRenderbuffer[Rt]);let st=n.get(_[Rt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Tt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Rt,i.TEXTURE_2D,st,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){let _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ue(A){return Math.min(r.maxSamples,A.samples)}function St(A){let _=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ht(A){let _=o.render.frame;d.get(A)!==_&&(d.set(A,_),A.update())}function we(A,_){let V=A.colorSpace,j=A.format,et=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||V!==dr&&V!==Si&&(Zt.getTransfer(V)===Qt?(j!==Ln||et!==$n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),_}function Me(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=k,this.setTexture2D=B,this.setTexture2DArray=H,this.setTexture3D=W,this.setTextureCube=O,this.rebindTextures=Se,this.setupRenderTarget=P,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=Gt,this.setupFrameBufferTexture=lt,this.useMultisampledRTT=St}function lb(i,t){function e(n,r=Si){let s,o=Zt.getTransfer(r);if(n===$n)return i.UNSIGNED_BYTE;if(n===dl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ul)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Mh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Sh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===_h)return i.BYTE;if(n===wh)return i.SHORT;if(n===ss)return i.UNSIGNED_SHORT;if(n===hl)return i.INT;if(n===qi)return i.UNSIGNED_INT;if(n===si)return i.FLOAT;if(n===Pn)return i.HALF_FLOAT;if(n===Eh)return i.ALPHA;if(n===Th)return i.RGB;if(n===Ln)return i.RGBA;if(n===Yr)return i.DEPTH_COMPONENT;if(n===as)return i.DEPTH_STENCIL;if(n===Ah)return i.RED;if(n===pl)return i.RED_INTEGER;if(n===Rh)return i.RG;if(n===fl)return i.RG_INTEGER;if(n===ml)return i.RGBA_INTEGER;if(n===po||n===fo||n===mo||n===go)if(o===Qt)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===po)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===fo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===mo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===go)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===po)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===fo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===mo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===go)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===gl||n===xl||n===vl||n===bl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===gl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===vl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===bl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yl||n===_l||n===wl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===yl||n===_l)return o===Qt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===wl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ml||n===Sl||n===El||n===Tl||n===Al||n===Rl||n===Cl||n===Il||n===Pl||n===Ll||n===Dl||n===kl||n===Ul||n===Nl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ml)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Sl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===El)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Tl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Al)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Rl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Cl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Il)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Pl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ll)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Dl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===kl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ul)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Nl)return o===Qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Fl||n===Ol||n===Bl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Fl)return o===Qt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ol)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Bl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===zl||n===Hl||n===Vl||n===Gl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===zl)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Hl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Gl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===os?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var cb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hb=`
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

}`,Jh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new js(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Re({vertexShader:cb,fragmentShader:hb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fe(new zi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Kh=class extends ni{constructor(t,e){super();let n=this,r=null,s=1,o=null,a="local-floor",c=1,l=null,d=null,h=null,u=null,p=null,m=null,x=typeof XRWebGLBinding<"u",g=new Jh,f={},S=e.getContextAttributes(),y=null,b=null,T=[],E=[],R=new _t,C=null,v=new Ke;v.viewport=new ce;let w=new Ke;w.viewport=new ce;let I=[v,w],k=new Xa,z=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=T[X];return Z===void 0&&(Z=new Qr,T[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=T[X];return Z===void 0&&(Z=new Qr,T[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=T[X];return Z===void 0&&(Z=new Qr,T[X]=Z),Z.getHandSpace()};function B(X){let Z=E.indexOf(X.inputSource);if(Z===-1)return;let lt=T[Z];lt!==void 0&&(lt.update(X.inputSource,X.frame,l||o),lt.dispatchEvent({type:X.type,data:X.inputSource}))}function H(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",W);for(let X=0;X<T.length;X++){let Z=E[X];Z!==null&&(E[X]=null,T[X].disconnect(Z))}z=null,G=null,g.reset();for(let X in f)delete f[X];t.setRenderTarget(y),p=null,u=null,h=null,r=null,b=null,ft.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(r,e)),h},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(y=t.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",H),r.addEventListener("inputsourceschange",W),S.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let lt=null,bt=null,xt=null;S.depth&&(xt=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,lt=S.stencil?as:Yr,bt=S.stencil?os:qi);let Gt={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:s};h=this.getBinding(),u=h.createProjectionLayer(Gt),r.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),b=new Qe(u.textureWidth,u.textureHeight,{format:Ln,type:$n,depthTexture:new Zs(u.textureWidth,u.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,lt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let lt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,e,lt),r.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Qe(p.framebufferWidth,p.framebufferHeight,{format:Ln,type:$n,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),ft.setContext(r),ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function W(X){for(let Z=0;Z<X.removed.length;Z++){let lt=X.removed[Z],bt=E.indexOf(lt);bt>=0&&(E[bt]=null,T[bt].disconnect(lt))}for(let Z=0;Z<X.added.length;Z++){let lt=X.added[Z],bt=E.indexOf(lt);if(bt===-1){for(let Gt=0;Gt<T.length;Gt++)if(Gt>=E.length){E.push(lt),bt=Gt;break}else if(E[Gt]===null){E[Gt]=lt,bt=Gt;break}if(bt===-1)break}let xt=T[bt];xt&&xt.connect(lt)}}let O=new L,nt=new L;function tt(X,Z,lt){O.setFromMatrixPosition(Z.matrixWorld),nt.setFromMatrixPosition(lt.matrixWorld);let bt=O.distanceTo(nt),xt=Z.projectionMatrix.elements,Gt=lt.projectionMatrix.elements,Se=xt[14]/(xt[10]-1),P=xt[14]/(xt[10]+1),oe=(xt[9]+1)/xt[5],Ot=(xt[9]-1)/xt[5],Dt=(xt[8]-1)/xt[0],wt=(Gt[8]+1)/Gt[0],ue=Se*Dt,St=Se*wt,Ht=bt/(-Dt+wt),we=Ht*-Dt;if(Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(we),X.translateZ(Ht),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),xt[10]===-1)X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{let Me=Se+Ht,A=P+Ht,_=ue-we,V=St+(bt-we),j=oe*P/A*Me,et=Ot*P/A*Me;X.projectionMatrix.makePerspective(_,V,j,et,Me,A),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function rt(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let Z=X.near,lt=X.far;g.texture!==null&&(g.depthNear>0&&(Z=g.depthNear),g.depthFar>0&&(lt=g.depthFar)),k.near=w.near=v.near=Z,k.far=w.far=v.far=lt,(z!==k.near||G!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),z=k.near,G=k.far),k.layers.mask=X.layers.mask|6,v.layers.mask=k.layers.mask&3,w.layers.mask=k.layers.mask&5;let bt=X.parent,xt=k.cameras;rt(k,bt);for(let Gt=0;Gt<xt.length;Gt++)rt(xt[Gt],bt);xt.length===2?tt(k,v,w):k.projectionMatrix.copy(v.projectionMatrix),It(X,k,bt)};function It(X,Z,lt){lt===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(lt.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Zr*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&p===null))return c},this.setFoveation=function(X){c=X,u!==null&&(u.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(X){return f[X]};let Wt=null;function gt(X,Z){if(d=Z.getViewerPose(l||o),m=Z,d!==null){let lt=d.views;p!==null&&(t.setRenderTargetFramebuffer(b,p.framebuffer),t.setRenderTarget(b));let bt=!1;lt.length!==k.cameras.length&&(k.cameras.length=0,bt=!0);for(let P=0;P<lt.length;P++){let oe=lt[P],Ot=null;if(p!==null)Ot=p.getViewport(oe);else{let wt=h.getViewSubImage(u,oe);Ot=wt.viewport,P===0&&(t.setRenderTargetTextures(b,wt.colorTexture,wt.depthStencilTexture),t.setRenderTarget(b))}let Dt=I[P];Dt===void 0&&(Dt=new Ke,Dt.layers.enable(P),Dt.viewport=new ce,I[P]=Dt),Dt.matrix.fromArray(oe.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(oe.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),P===0&&(k.matrix.copy(Dt.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),bt===!0&&k.cameras.push(Dt)}let xt=r.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){h=n.getBinding();let P=h.getDepthInformation(lt[0]);P&&P.isValid&&P.texture&&g.init(P,r.renderState)}if(xt&&xt.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let P=0;P<lt.length;P++){let oe=lt[P].camera;if(oe){let Ot=f[oe];Ot||(Ot=new js,f[oe]=Ot);let Dt=h.getCameraImage(oe);Ot.sourceTexture=Dt}}}}for(let lt=0;lt<T.length;lt++){let bt=E[lt],xt=T[lt];bt!==null&&xt!==void 0&&xt.update(bt,Z,l||o)}Wt&&Wt(X,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),m=null}let ft=new gp;ft.setAnimationLoop(gt),this.setAnimationLoop=function(X){Wt=X},this.dispose=function(){}}},_r=new Gn,db=new ve;function ub(i,t){function e(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,kh(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function r(g,f,S,y,b){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(g,f):f.isMeshToonMaterial?(s(g,f),h(g,f)):f.isMeshPhongMaterial?(s(g,f),d(g,f)):f.isMeshStandardMaterial?(s(g,f),u(g,f),f.isMeshPhysicalMaterial&&p(g,f,b)):f.isMeshMatcapMaterial?(s(g,f),m(g,f)):f.isMeshDepthMaterial?s(g,f):f.isMeshDistanceMaterial?(s(g,f),x(g,f)):f.isMeshNormalMaterial?s(g,f):f.isLineBasicMaterial?(o(g,f),f.isLineDashedMaterial&&a(g,f)):f.isPointsMaterial?c(g,f,S,y):f.isSpriteMaterial?l(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,e(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===an&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,e(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===an&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,e(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,e(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);let S=t.get(f),y=S.envMap,b=S.envMapRotation;y&&(g.envMap.value=y,_r.copy(b),_r.x*=-1,_r.y*=-1,_r.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),g.envMapRotation.value.setFromMatrix4(db.makeRotationFromEuler(_r)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,g.aoMapTransform))}function o(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform))}function a(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,S,y){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*S,g.scale.value=y*.5,f.map&&(g.map.value=f.map,e(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function l(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function h(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function u(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,S){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===an&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function x(g,f){let S=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function pb(i,t,e,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,y){let b=y.program;n.uniformBlockBinding(S,b)}function l(S,y){let b=r[S.id];b===void 0&&(m(S),b=d(S),r[S.id]=b,S.addEventListener("dispose",g));let T=y.program;n.updateUBOMapping(S,T);let E=t.render.frame;s[S.id]!==E&&(u(S),s[S.id]=E)}function d(S){let y=h();S.__bindingPointIndex=y;let b=i.createBuffer(),T=S.__size,E=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,T,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,b),b}function h(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){let y=r[S.id],b=S.uniforms,T=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,R=b.length;E<R;E++){let C=Array.isArray(b[E])?b[E]:[b[E]];for(let v=0,w=C.length;v<w;v++){let I=C[v];if(p(I,E,v,T)===!0){let k=I.__offset,z=Array.isArray(I.value)?I.value:[I.value],G=0;for(let B=0;B<z.length;B++){let H=z[B],W=x(H);typeof H=="number"||typeof H=="boolean"?(I.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,k+G,I.__data)):H.isMatrix3?(I.__data[0]=H.elements[0],I.__data[1]=H.elements[1],I.__data[2]=H.elements[2],I.__data[3]=0,I.__data[4]=H.elements[3],I.__data[5]=H.elements[4],I.__data[6]=H.elements[5],I.__data[7]=0,I.__data[8]=H.elements[6],I.__data[9]=H.elements[7],I.__data[10]=H.elements[8],I.__data[11]=0):(H.toArray(I.__data,G),G+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,y,b,T){let E=S.value,R=y+"_"+b;if(T[R]===void 0)return typeof E=="number"||typeof E=="boolean"?T[R]=E:T[R]=E.clone(),!0;{let C=T[R];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return T[R]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function m(S){let y=S.uniforms,b=0,T=16;for(let R=0,C=y.length;R<C;R++){let v=Array.isArray(y[R])?y[R]:[y[R]];for(let w=0,I=v.length;w<I;w++){let k=v[w],z=Array.isArray(k.value)?k.value:[k.value];for(let G=0,B=z.length;G<B;G++){let H=z[G],W=x(H),O=b%T,nt=O%W.boundary,tt=O+nt;b+=nt,tt!==0&&T-tt<W.storage&&(b+=T-tt),k.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=b,b+=W.storage}}}let E=b%T;return E>0&&(b+=T-E),S.__size=b,S.__cache={},this}function x(S){let y={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(y.boundary=4,y.storage=4):S.isVector2?(y.boundary=8,y.storage=8):S.isVector3||S.isColor?(y.boundary=16,y.storage=12):S.isVector4?(y.boundary=16,y.storage=16):S.isMatrix3?(y.boundary=48,y.storage=48):S.isMatrix4?(y.boundary=64,y.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),y}function g(S){let y=S.target;y.removeEventListener("dispose",g);let b=o.indexOf(y.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function f(){for(let S in r)i.deleteBuffer(r[S]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}var Yl=class{constructor(t={}){let{canvas:e=Bu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let m=new Uint32Array(4),x=new Int32Array(4),g=null,f=null,S=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let b=this,T=!1;this._outputColorSpace=yn;let E=0,R=0,C=null,v=-1,w=null,I=new ce,k=new ce,z=null,G=new Pt(0),B=0,H=e.width,W=e.height,O=1,nt=null,tt=null,rt=new ce(0,0,H,W),It=new ce(0,0,H,W),Wt=!1,gt=new ts,ft=!1,X=!1,Z=new ve,lt=new L,bt=new ce,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Gt=!1;function Se(){return C===null?O:1}let P=n;function oe(M,U){return e.getContext(M,U)}try{let M={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",yt,!1),e.addEventListener("webglcontextcreationerror",it,!1),P===null){let U="webgl2";if(P=oe(U,M),P===null)throw oe(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Ot,Dt,wt,ue,St,Ht,we,Me,A,_,V,j,et,Y,Tt,ct,Mt,Rt,st,pt,Ut,Ct,ut,Bt;function D(){Ot=new Px(P),Ot.init(),Ct=new lb(P,Ot),Dt=new Sx(P,Ot,t,Ct),wt=new ob(P,Ot),Dt.reversedDepthBuffer&&u&&wt.buffers.depth.setReversed(!0),ue=new kx(P),St=new qv,Ht=new ab(P,Ot,wt,St,Dt,Ct,ue),we=new Tx(b),Me=new Ix(b),A=new zm(P),ut=new wx(P,A),_=new Lx(P,A,ue,ut),V=new Nx(P,_,A,ue),st=new Ux(P,Dt,Ht),ct=new Ex(St),j=new $v(b,we,Me,Ot,Dt,ut,ct),et=new ub(b,St),Y=new Zv,Tt=new eb(Ot),Rt=new _x(b,we,Me,wt,V,p,c),Mt=new rb(b,V,Dt),Bt=new pb(P,ue,Dt,wt),pt=new Mx(P,Ot,ue),Ut=new Dx(P,Ot,ue),ue.programs=j.programs,b.capabilities=Dt,b.extensions=Ot,b.properties=St,b.renderLists=Y,b.shadowMap=Mt,b.state=wt,b.info=ue}D();let J=new Kh(b,P);this.xr=J,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let M=Ot.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Ot.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(M){M!==void 0&&(O=M,this.setSize(H,W,!1))},this.getSize=function(M){return M.set(H,W)},this.setSize=function(M,U,$=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=M,W=U,e.width=Math.floor(M*O),e.height=Math.floor(U*O),$===!0&&(e.style.width=M+"px",e.style.height=U+"px"),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(H*O,W*O).floor()},this.setDrawingBufferSize=function(M,U,$){H=M,W=U,O=$,e.width=Math.floor(M*$),e.height=Math.floor(U*$),this.setViewport(0,0,M,U)},this.getCurrentViewport=function(M){return M.copy(I)},this.getViewport=function(M){return M.copy(rt)},this.setViewport=function(M,U,$,q){M.isVector4?rt.set(M.x,M.y,M.z,M.w):rt.set(M,U,$,q),wt.viewport(I.copy(rt).multiplyScalar(O).round())},this.getScissor=function(M){return M.copy(It)},this.setScissor=function(M,U,$,q){M.isVector4?It.set(M.x,M.y,M.z,M.w):It.set(M,U,$,q),wt.scissor(k.copy(It).multiplyScalar(O).round())},this.getScissorTest=function(){return Wt},this.setScissorTest=function(M){wt.setScissorTest(Wt=M)},this.setOpaqueSort=function(M){nt=M},this.setTransparentSort=function(M){tt=M},this.getClearColor=function(M){return M.copy(Rt.getClearColor())},this.setClearColor=function(){Rt.setClearColor(...arguments)},this.getClearAlpha=function(){return Rt.getClearAlpha()},this.setClearAlpha=function(){Rt.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,$=!0){let q=0;if(M){let F=!1;if(C!==null){let ot=C.texture.format;F=ot===ml||ot===fl||ot===pl}if(F){let ot=C.texture.type,mt=ot===$n||ot===qi||ot===ss||ot===os||ot===dl||ot===ul,Et=Rt.getClearColor(),vt=Rt.getClearAlpha(),Nt=Et.r,Ft=Et.g,Lt=Et.b;mt?(m[0]=Nt,m[1]=Ft,m[2]=Lt,m[3]=vt,P.clearBufferuiv(P.COLOR,0,m)):(x[0]=Nt,x[1]=Ft,x[2]=Lt,x[3]=vt,P.clearBufferiv(P.COLOR,0,x))}else q|=P.COLOR_BUFFER_BIT}U&&(q|=P.DEPTH_BUFFER_BIT),$&&(q|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",yt,!1),e.removeEventListener("webglcontextcreationerror",it,!1),Rt.dispose(),Y.dispose(),Tt.dispose(),St.dispose(),we.dispose(),Me.dispose(),V.dispose(),ut.dispose(),Bt.dispose(),j.dispose(),J.dispose(),J.removeEventListener("sessionstart",ei),J.removeEventListener("sessionend",Sd),ir.stop()};function ht(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function yt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let M=ue.autoReset,U=Mt.enabled,$=Mt.autoUpdate,q=Mt.needsUpdate,F=Mt.type;D(),ue.autoReset=M,Mt.enabled=U,Mt.autoUpdate=$,Mt.needsUpdate=q,Mt.type=F}function it(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function K(M){let U=M.target;U.removeEventListener("dispose",K),At(U)}function At(M){zt(M),St.remove(M)}function zt(M){let U=St.get(M).programs;U!==void 0&&(U.forEach(function($){j.releaseProgram($)}),M.isShaderMaterial&&j.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,$,q,F,ot){U===null&&(U=xt);let mt=F.isMesh&&F.matrixWorld.determinant()<0,Et=xf(M,U,$,q,F);wt.setMaterial(q,mt);let vt=$.index,Nt=1;if(q.wireframe===!0){if(vt=_.getWireframeAttribute($),vt===void 0)return;Nt=2}let Ft=$.drawRange,Lt=$.attributes.position,Yt=Ft.start*Nt,ae=(Ft.start+Ft.count)*Nt;ot!==null&&(Yt=Math.max(Yt,ot.start*Nt),ae=Math.min(ae,(ot.start+ot.count)*Nt)),vt!==null?(Yt=Math.max(Yt,0),ae=Math.min(ae,vt.count)):Lt!=null&&(Yt=Math.max(Yt,0),ae=Math.min(ae,Lt.count));let Ie=ae-Yt;if(Ie<0||Ie===1/0)return;ut.setup(F,q,Et,$,vt);let be,pe=pt;if(vt!==null&&(be=A.get(vt),pe=Ut,pe.setIndex(be)),F.isMesh)q.wireframe===!0?(wt.setLineWidth(q.wireframeLinewidth*Se()),pe.setMode(P.LINES)):pe.setMode(P.TRIANGLES);else if(F.isLine){let kt=q.linewidth;kt===void 0&&(kt=1),wt.setLineWidth(kt*Se()),F.isLineSegments?pe.setMode(P.LINES):F.isLineLoop?pe.setMode(P.LINE_LOOP):pe.setMode(P.LINE_STRIP)}else F.isPoints?pe.setMode(P.POINTS):F.isSprite&&pe.setMode(P.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)jr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pe.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Ot.get("WEBGL_multi_draw"))pe.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{let kt=F._multiDrawStarts,Ee=F._multiDrawCounts,Jt=F._multiDrawCount,gn=vt?A.get(vt).bytesPerElement:1,Lr=St.get(q).currentProgram.getUniforms();for(let xn=0;xn<Jt;xn++)Lr.setValue(P,"_gl_DrawID",xn),pe.render(kt[xn]/gn,Ee[xn])}else if(F.isInstancedMesh)pe.renderInstances(Yt,Ie,F.count);else if($.isInstancedBufferGeometry){let kt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ee=Math.min($.instanceCount,kt);pe.renderInstances(Yt,Ie,Ee)}else pe.render(Yt,Ie)};function xe(M,U,$){M.transparent===!0&&M.side===Ce&&M.forceSinglePass===!1?(M.side=an,M.needsUpdate=!0,Wo(M,U,$),M.side=_i,M.needsUpdate=!0,Wo(M,U,$),M.side=Ce):Wo(M,U,$)}this.compile=function(M,U,$=null){$===null&&($=M),f=Tt.get($),f.init(U),y.push(f),$.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),M!==$&&M.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),f.setupLights();let q=new Set;return M.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;let ot=F.material;if(ot)if(Array.isArray(ot))for(let mt=0;mt<ot.length;mt++){let Et=ot[mt];xe(Et,$,F),q.add(Et)}else xe(ot,$,F),q.add(ot)}),f=y.pop(),q},this.compileAsync=function(M,U,$=null){let q=this.compile(M,U,$);return new Promise(F=>{function ot(){if(q.forEach(function(mt){St.get(mt).currentProgram.isReady()&&q.delete(mt)}),q.size===0){F(M);return}setTimeout(ot,10)}Ot.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let ie=null;function pi(M){ie&&ie(M)}function ei(){ir.stop()}function Sd(){ir.start()}let ir=new gp;ir.setAnimationLoop(pi),typeof self<"u"&&ir.setContext(self),this.setAnimationLoop=function(M){ie=M,J.setAnimationLoop(M),M===null?ir.stop():ir.start()},J.addEventListener("sessionstart",ei),J.addEventListener("sessionend",Sd),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(U),U=J.getCamera()),M.isScene===!0&&M.onBeforeRender(b,M,U,C),f=Tt.get(M,y.length),f.init(U),y.push(f),Z.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),gt.setFromProjectionMatrix(Z,zn,U.reversedDepth),X=this.localClippingEnabled,ft=ct.init(this.clippingPlanes,X),g=Y.get(M,S.length),g.init(),S.push(g),J.enabled===!0&&J.isPresenting===!0){let ot=b.xr.getDepthSensingMesh();ot!==null&&Cc(ot,U,-1/0,b.sortObjects)}Cc(M,U,0,b.sortObjects),g.finish(),b.sortObjects===!0&&g.sort(nt,tt),Gt=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,Gt&&Rt.addToRenderList(g,M),this.info.render.frame++,ft===!0&&ct.beginShadows();let $=f.state.shadowsArray;Mt.render($,M,U),ft===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,F=g.transmissive;if(f.setupLights(),U.isArrayCamera){let ot=U.cameras;if(F.length>0)for(let mt=0,Et=ot.length;mt<Et;mt++){let vt=ot[mt];Td(q,F,M,vt)}Gt&&Rt.render(M);for(let mt=0,Et=ot.length;mt<Et;mt++){let vt=ot[mt];Ed(g,M,vt,vt.viewport)}}else F.length>0&&Td(q,F,M,U),Gt&&Rt.render(M),Ed(g,M,U);C!==null&&R===0&&(Ht.updateMultisampleRenderTarget(C),Ht.updateRenderTargetMipmap(C)),M.isScene===!0&&M.onAfterRender(b,M,U),ut.resetDefaultState(),v=-1,w=null,y.pop(),y.length>0?(f=y[y.length-1],ft===!0&&ct.setGlobalState(b.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?g=S[S.length-1]:g=null};function Cc(M,U,$,q){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)$=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||gt.intersectsSprite(M)){q&&bt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Z);let mt=V.update(M),Et=M.material;Et.visible&&g.push(M,mt,Et,$,bt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||gt.intersectsObject(M))){let mt=V.update(M),Et=M.material;if(q&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),bt.copy(M.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),bt.copy(mt.boundingSphere.center)),bt.applyMatrix4(M.matrixWorld).applyMatrix4(Z)),Array.isArray(Et)){let vt=mt.groups;for(let Nt=0,Ft=vt.length;Nt<Ft;Nt++){let Lt=vt[Nt],Yt=Et[Lt.materialIndex];Yt&&Yt.visible&&g.push(M,mt,Yt,$,bt.z,Lt)}}else Et.visible&&g.push(M,mt,Et,$,bt.z,null)}}let ot=M.children;for(let mt=0,Et=ot.length;mt<Et;mt++)Cc(ot[mt],U,$,q)}function Ed(M,U,$,q){let F=M.opaque,ot=M.transmissive,mt=M.transparent;f.setupLightsView($),ft===!0&&ct.setGlobalState(b.clippingPlanes,$),q&&wt.viewport(I.copy(q)),F.length>0&&Go(F,U,$),ot.length>0&&Go(ot,U,$),mt.length>0&&Go(mt,U,$),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function Td(M,U,$,q){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[q.id]===void 0&&(f.state.transmissionRenderTarget[q.id]=new Qe(1,1,{generateMipmaps:!0,type:Ot.has("EXT_color_buffer_half_float")||Ot.has("EXT_color_buffer_float")?Pn:$n,minFilter:$i,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));let ot=f.state.transmissionRenderTarget[q.id],mt=q.viewport||I;ot.setSize(mt.z*b.transmissionResolutionScale,mt.w*b.transmissionResolutionScale);let Et=b.getRenderTarget(),vt=b.getActiveCubeFace(),Nt=b.getActiveMipmapLevel();b.setRenderTarget(ot),b.getClearColor(G),B=b.getClearAlpha(),B<1&&b.setClearColor(16777215,.5),b.clear(),Gt&&Rt.render($);let Ft=b.toneMapping;b.toneMapping=Mi;let Lt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),f.setupLightsView(q),ft===!0&&ct.setGlobalState(b.clippingPlanes,q),Go(M,$,q),Ht.updateMultisampleRenderTarget(ot),Ht.updateRenderTargetMipmap(ot),Ot.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let ae=0,Ie=U.length;ae<Ie;ae++){let be=U[ae],pe=be.object,kt=be.geometry,Ee=be.material,Jt=be.group;if(Ee.side===Ce&&pe.layers.test(q.layers)){let gn=Ee.side;Ee.side=an,Ee.needsUpdate=!0,Ad(pe,$,q,kt,Ee,Jt),Ee.side=gn,Ee.needsUpdate=!0,Yt=!0}}Yt===!0&&(Ht.updateMultisampleRenderTarget(ot),Ht.updateRenderTargetMipmap(ot))}b.setRenderTarget(Et,vt,Nt),b.setClearColor(G,B),Lt!==void 0&&(q.viewport=Lt),b.toneMapping=Ft}function Go(M,U,$){let q=U.isScene===!0?U.overrideMaterial:null;for(let F=0,ot=M.length;F<ot;F++){let mt=M[F],Et=mt.object,vt=mt.geometry,Nt=mt.group,Ft=mt.material;Ft.allowOverride===!0&&q!==null&&(Ft=q),Et.layers.test($.layers)&&Ad(Et,U,$,vt,Ft,Nt)}}function Ad(M,U,$,q,F,ot){M.onBeforeRender(b,U,$,q,F,ot),M.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),F.onBeforeRender(b,U,$,q,M,ot),F.transparent===!0&&F.side===Ce&&F.forceSinglePass===!1?(F.side=an,F.needsUpdate=!0,b.renderBufferDirect($,U,q,F,M,ot),F.side=_i,F.needsUpdate=!0,b.renderBufferDirect($,U,q,F,M,ot),F.side=Ce):b.renderBufferDirect($,U,q,F,M,ot),M.onAfterRender(b,U,$,q,F,ot)}function Wo(M,U,$){U.isScene!==!0&&(U=xt);let q=St.get(M),F=f.state.lights,ot=f.state.shadowsArray,mt=F.state.version,Et=j.getParameters(M,F.state,ot,U,$),vt=j.getProgramCacheKey(Et),Nt=q.programs;q.environment=M.isMeshStandardMaterial?U.environment:null,q.fog=U.fog,q.envMap=(M.isMeshStandardMaterial?Me:we).get(M.envMap||q.environment),q.envMapRotation=q.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Nt===void 0&&(M.addEventListener("dispose",K),Nt=new Map,q.programs=Nt);let Ft=Nt.get(vt);if(Ft!==void 0){if(q.currentProgram===Ft&&q.lightsStateVersion===mt)return Cd(M,Et),Ft}else Et.uniforms=j.getUniforms(M),M.onBeforeCompile(Et,b),Ft=j.acquireProgram(Et,vt),Nt.set(vt,Ft),q.uniforms=Et.uniforms;let Lt=q.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Lt.clippingPlanes=ct.uniform),Cd(M,Et),q.needsLights=bf(M),q.lightsStateVersion=mt,q.needsLights&&(Lt.ambientLightColor.value=F.state.ambient,Lt.lightProbe.value=F.state.probe,Lt.directionalLights.value=F.state.directional,Lt.directionalLightShadows.value=F.state.directionalShadow,Lt.spotLights.value=F.state.spot,Lt.spotLightShadows.value=F.state.spotShadow,Lt.rectAreaLights.value=F.state.rectArea,Lt.ltc_1.value=F.state.rectAreaLTC1,Lt.ltc_2.value=F.state.rectAreaLTC2,Lt.pointLights.value=F.state.point,Lt.pointLightShadows.value=F.state.pointShadow,Lt.hemisphereLights.value=F.state.hemi,Lt.directionalShadowMap.value=F.state.directionalShadowMap,Lt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Lt.spotShadowMap.value=F.state.spotShadowMap,Lt.spotLightMatrix.value=F.state.spotLightMatrix,Lt.spotLightMap.value=F.state.spotLightMap,Lt.pointShadowMap.value=F.state.pointShadowMap,Lt.pointShadowMatrix.value=F.state.pointShadowMatrix),q.currentProgram=Ft,q.uniformsList=null,Ft}function Rd(M){if(M.uniformsList===null){let U=M.currentProgram.getUniforms();M.uniformsList=ds.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function Cd(M,U){let $=St.get(M);$.outputColorSpace=U.outputColorSpace,$.batching=U.batching,$.batchingColor=U.batchingColor,$.instancing=U.instancing,$.instancingColor=U.instancingColor,$.instancingMorph=U.instancingMorph,$.skinning=U.skinning,$.morphTargets=U.morphTargets,$.morphNormals=U.morphNormals,$.morphColors=U.morphColors,$.morphTargetsCount=U.morphTargetsCount,$.numClippingPlanes=U.numClippingPlanes,$.numIntersection=U.numClipIntersection,$.vertexAlphas=U.vertexAlphas,$.vertexTangents=U.vertexTangents,$.toneMapping=U.toneMapping}function xf(M,U,$,q,F){U.isScene!==!0&&(U=xt),Ht.resetTextureUnits();let ot=U.fog,mt=q.isMeshStandardMaterial?U.environment:null,Et=C===null?b.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:dr,vt=(q.isMeshStandardMaterial?Me:we).get(q.envMap||mt),Nt=q.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Ft=!!$.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Lt=!!$.morphAttributes.position,Yt=!!$.morphAttributes.normal,ae=!!$.morphAttributes.color,Ie=Mi;q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ie=b.toneMapping);let be=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,pe=be!==void 0?be.length:0,kt=St.get(q),Ee=f.state.lights;if(ft===!0&&(X===!0||M!==w)){let rn=M===w&&q.id===v;ct.setState(q,M,rn)}let Jt=!1;q.version===kt.__version?(kt.needsLights&&kt.lightsStateVersion!==Ee.state.version||kt.outputColorSpace!==Et||F.isBatchedMesh&&kt.batching===!1||!F.isBatchedMesh&&kt.batching===!0||F.isBatchedMesh&&kt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&kt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&kt.instancing===!1||!F.isInstancedMesh&&kt.instancing===!0||F.isSkinnedMesh&&kt.skinning===!1||!F.isSkinnedMesh&&kt.skinning===!0||F.isInstancedMesh&&kt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&kt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&kt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&kt.instancingMorph===!1&&F.morphTexture!==null||kt.envMap!==vt||q.fog===!0&&kt.fog!==ot||kt.numClippingPlanes!==void 0&&(kt.numClippingPlanes!==ct.numPlanes||kt.numIntersection!==ct.numIntersection)||kt.vertexAlphas!==Nt||kt.vertexTangents!==Ft||kt.morphTargets!==Lt||kt.morphNormals!==Yt||kt.morphColors!==ae||kt.toneMapping!==Ie||kt.morphTargetsCount!==pe)&&(Jt=!0):(Jt=!0,kt.__version=q.version);let gn=kt.currentProgram;Jt===!0&&(gn=Wo(q,U,F));let Lr=!1,xn=!1,As=!1,Te=gn.getUniforms(),Tn=kt.uniforms;if(wt.useProgram(gn.program)&&(Lr=!0,xn=!0,As=!0),q.id!==v&&(v=q.id,xn=!0),Lr||w!==M){wt.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Te.setValue(P,"projectionMatrix",M.projectionMatrix),Te.setValue(P,"viewMatrix",M.matrixWorldInverse);let dn=Te.map.cameraPosition;dn!==void 0&&dn.setValue(P,lt.setFromMatrixPosition(M.matrixWorld)),Dt.logarithmicDepthBuffer&&Te.setValue(P,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Te.setValue(P,"isOrthographic",M.isOrthographicCamera===!0),w!==M&&(w=M,xn=!0,As=!0)}if(F.isSkinnedMesh){Te.setOptional(P,F,"bindMatrix"),Te.setOptional(P,F,"bindMatrixInverse");let rn=F.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Te.setValue(P,"boneTexture",rn.boneTexture,Ht))}F.isBatchedMesh&&(Te.setOptional(P,F,"batchingTexture"),Te.setValue(P,"batchingTexture",F._matricesTexture,Ht),Te.setOptional(P,F,"batchingIdTexture"),Te.setValue(P,"batchingIdTexture",F._indirectTexture,Ht),Te.setOptional(P,F,"batchingColorTexture"),F._colorsTexture!==null&&Te.setValue(P,"batchingColorTexture",F._colorsTexture,Ht));let An=$.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&st.update(F,$,gn),(xn||kt.receiveShadow!==F.receiveShadow)&&(kt.receiveShadow=F.receiveShadow,Te.setValue(P,"receiveShadow",F.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Tn.envMap.value=vt,Tn.flipEnvMap.value=vt.isCubeTexture&&vt.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&U.environment!==null&&(Tn.envMapIntensity.value=U.environmentIntensity),xn&&(Te.setValue(P,"toneMappingExposure",b.toneMappingExposure),kt.needsLights&&vf(Tn,As),ot&&q.fog===!0&&et.refreshFogUniforms(Tn,ot),et.refreshMaterialUniforms(Tn,q,O,W,f.state.transmissionRenderTarget[M.id]),ds.upload(P,Rd(kt),Tn,Ht)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(ds.upload(P,Rd(kt),Tn,Ht),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Te.setValue(P,"center",F.center),Te.setValue(P,"modelViewMatrix",F.modelViewMatrix),Te.setValue(P,"normalMatrix",F.normalMatrix),Te.setValue(P,"modelMatrix",F.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let rn=q.uniformsGroups;for(let dn=0,Ic=rn.length;dn<Ic;dn++){let rr=rn[dn];Bt.update(rr,gn),Bt.bind(rr,gn)}}return gn}function vf(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function bf(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(M,U,$){let q=St.get(M);q.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),St.get(M.texture).__webglTexture=U,St.get(M.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:$,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){let $=St.get(M);$.__webglFramebuffer=U,$.__useDefaultFramebuffer=U===void 0};let yf=P.createFramebuffer();this.setRenderTarget=function(M,U=0,$=0){C=M,E=U,R=$;let q=!0,F=null,ot=!1,mt=!1;if(M){let vt=St.get(M);if(vt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(P.FRAMEBUFFER,null),q=!1;else if(vt.__webglFramebuffer===void 0)Ht.setupRenderTarget(M);else if(vt.__hasExternalTextures)Ht.rebindTextures(M,St.get(M.texture).__webglTexture,St.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Lt=M.depthTexture;if(vt.__boundDepthTexture!==Lt){if(Lt!==null&&St.has(Lt)&&(M.width!==Lt.image.width||M.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ht.setupDepthRenderbuffer(M)}}let Nt=M.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(mt=!0);let Ft=St.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ft[U])?F=Ft[U][$]:F=Ft[U],ot=!0):M.samples>0&&Ht.useMultisampledRTT(M)===!1?F=St.get(M).__webglMultisampledFramebuffer:Array.isArray(Ft)?F=Ft[$]:F=Ft,I.copy(M.viewport),k.copy(M.scissor),z=M.scissorTest}else I.copy(rt).multiplyScalar(O).floor(),k.copy(It).multiplyScalar(O).floor(),z=Wt;if($!==0&&(F=yf),wt.bindFramebuffer(P.FRAMEBUFFER,F)&&q&&wt.drawBuffers(M,F),wt.viewport(I),wt.scissor(k),wt.setScissorTest(z),ot){let vt=St.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,vt.__webglTexture,$)}else if(mt){let vt=U;for(let Nt=0;Nt<M.textures.length;Nt++){let Ft=St.get(M.textures[Nt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Nt,Ft.__webglTexture,$,vt)}}else if(M!==null&&$!==0){let vt=St.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,vt.__webglTexture,$)}v=-1},this.readRenderTargetPixels=function(M,U,$,q,F,ot,mt,Et=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=St.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&mt!==void 0&&(vt=vt[mt]),vt){wt.bindFramebuffer(P.FRAMEBUFFER,vt);try{let Nt=M.textures[Et],Ft=Nt.format,Lt=Nt.type;if(!Dt.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-q&&$>=0&&$<=M.height-F&&(M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Et),P.readPixels(U,$,q,F,Ct.convert(Ft),Ct.convert(Lt),ot))}finally{let Nt=C!==null?St.get(C).__webglFramebuffer:null;wt.bindFramebuffer(P.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(M,U,$,q,F,ot,mt,Et=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=St.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&mt!==void 0&&(vt=vt[mt]),vt)if(U>=0&&U<=M.width-q&&$>=0&&$<=M.height-F){wt.bindFramebuffer(P.FRAMEBUFFER,vt);let Nt=M.textures[Et],Ft=Nt.format,Lt=Nt.type;if(!Dt.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Yt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Yt),P.bufferData(P.PIXEL_PACK_BUFFER,ot.byteLength,P.STREAM_READ),M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Et),P.readPixels(U,$,q,F,Ct.convert(Ft),Ct.convert(Lt),0);let ae=C!==null?St.get(C).__webglFramebuffer:null;wt.bindFramebuffer(P.FRAMEBUFFER,ae);let Ie=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await zu(P,Ie,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Yt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ot),P.deleteBuffer(Yt),P.deleteSync(Ie),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,$=0){let q=Math.pow(2,-$),F=Math.floor(M.image.width*q),ot=Math.floor(M.image.height*q),mt=U!==null?U.x:0,Et=U!==null?U.y:0;Ht.setTexture2D(M,0),P.copyTexSubImage2D(P.TEXTURE_2D,$,0,0,mt,Et,F,ot),wt.unbindTexture()};let _f=P.createFramebuffer(),wf=P.createFramebuffer();this.copyTextureToTexture=function(M,U,$=null,q=null,F=0,ot=null){ot===null&&(F!==0?(jr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ot=F,F=0):ot=0);let mt,Et,vt,Nt,Ft,Lt,Yt,ae,Ie,be=M.isCompressedTexture?M.mipmaps[ot]:M.image;if($!==null)mt=$.max.x-$.min.x,Et=$.max.y-$.min.y,vt=$.isBox3?$.max.z-$.min.z:1,Nt=$.min.x,Ft=$.min.y,Lt=$.isBox3?$.min.z:0;else{let An=Math.pow(2,-F);mt=Math.floor(be.width*An),Et=Math.floor(be.height*An),M.isDataArrayTexture?vt=be.depth:M.isData3DTexture?vt=Math.floor(be.depth*An):vt=1,Nt=0,Ft=0,Lt=0}q!==null?(Yt=q.x,ae=q.y,Ie=q.z):(Yt=0,ae=0,Ie=0);let pe=Ct.convert(U.format),kt=Ct.convert(U.type),Ee;U.isData3DTexture?(Ht.setTexture3D(U,0),Ee=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Ht.setTexture2DArray(U,0),Ee=P.TEXTURE_2D_ARRAY):(Ht.setTexture2D(U,0),Ee=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);let Jt=P.getParameter(P.UNPACK_ROW_LENGTH),gn=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Lr=P.getParameter(P.UNPACK_SKIP_PIXELS),xn=P.getParameter(P.UNPACK_SKIP_ROWS),As=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,be.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,be.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Nt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ft),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Lt);let Te=M.isDataArrayTexture||M.isData3DTexture,Tn=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){let An=St.get(M),rn=St.get(U),dn=St.get(An.__renderTarget),Ic=St.get(rn.__renderTarget);wt.bindFramebuffer(P.READ_FRAMEBUFFER,dn.__webglFramebuffer),wt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Ic.__webglFramebuffer);for(let rr=0;rr<vt;rr++)Te&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,St.get(M).__webglTexture,F,Lt+rr),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,St.get(U).__webglTexture,ot,Ie+rr)),P.blitFramebuffer(Nt,Ft,mt,Et,Yt,ae,mt,Et,P.DEPTH_BUFFER_BIT,P.NEAREST);wt.bindFramebuffer(P.READ_FRAMEBUFFER,null),wt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(F!==0||M.isRenderTargetTexture||St.has(M)){let An=St.get(M),rn=St.get(U);wt.bindFramebuffer(P.READ_FRAMEBUFFER,_f),wt.bindFramebuffer(P.DRAW_FRAMEBUFFER,wf);for(let dn=0;dn<vt;dn++)Te?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,An.__webglTexture,F,Lt+dn):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,An.__webglTexture,F),Tn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,rn.__webglTexture,ot,Ie+dn):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,rn.__webglTexture,ot),F!==0?P.blitFramebuffer(Nt,Ft,mt,Et,Yt,ae,mt,Et,P.COLOR_BUFFER_BIT,P.NEAREST):Tn?P.copyTexSubImage3D(Ee,ot,Yt,ae,Ie+dn,Nt,Ft,mt,Et):P.copyTexSubImage2D(Ee,ot,Yt,ae,Nt,Ft,mt,Et);wt.bindFramebuffer(P.READ_FRAMEBUFFER,null),wt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Tn?M.isDataTexture||M.isData3DTexture?P.texSubImage3D(Ee,ot,Yt,ae,Ie,mt,Et,vt,pe,kt,be.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(Ee,ot,Yt,ae,Ie,mt,Et,vt,pe,be.data):P.texSubImage3D(Ee,ot,Yt,ae,Ie,mt,Et,vt,pe,kt,be):M.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ot,Yt,ae,mt,Et,pe,kt,be.data):M.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ot,Yt,ae,be.width,be.height,pe,be.data):P.texSubImage2D(P.TEXTURE_2D,ot,Yt,ae,mt,Et,pe,kt,be);P.pixelStorei(P.UNPACK_ROW_LENGTH,Jt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,gn),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Lr),P.pixelStorei(P.UNPACK_SKIP_ROWS,xn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,As),ot===0&&U.generateMipmaps&&P.generateMipmap(Ee),wt.unbindTexture()},this.initRenderTarget=function(M){St.get(M).__webglFramebuffer===void 0&&Ht.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Ht.setTextureCube(M,0):M.isData3DTexture?Ht.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Ht.setTexture2DArray(M,0):Ht.setTexture2D(M,0),wt.unbindTexture()},this.resetState=function(){E=0,R=0,C=null,wt.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}};var _p={type:"change"},ed={type:"start"},Mp={type:"end"},jl=new Bi,wp=new Cn,mb=Math.cos(70*qn.DEG2RAD),He=new L,fn=2*Math.PI,he={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},td=1e-6,Jl=class extends co{constructor(t,e=null){super(t,e),this.state=he.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gi.ROTATE,MIDDLE:Gi.DOLLY,RIGHT:Gi.PAN},this.touches={ONE:Wi.ROTATE,TWO:Wi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new un,this._lastTargetPosition=new L,this._quat=new un().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new rs,this._sphericalDelta=new rs,this._scale=1,this._panOffset=new L,this._rotateStart=new _t,this._rotateEnd=new _t,this._rotateDelta=new _t,this._panStart=new _t,this._panEnd=new _t,this._panDelta=new _t,this._dollyStart=new _t,this._dollyEnd=new _t,this._dollyDelta=new _t,this._dollyDirection=new L,this._mouse=new _t,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=xb.bind(this),this._onPointerDown=gb.bind(this),this._onPointerUp=vb.bind(this),this._onContextMenu=Eb.bind(this),this._onMouseWheel=_b.bind(this),this._onKeyDown=wb.bind(this),this._onTouchStart=Mb.bind(this),this._onTouchMove=Sb.bind(this),this._onMouseDown=bb.bind(this),this._onMouseMove=yb.bind(this),this._interceptControlDown=Tb.bind(this),this._interceptControlUp=Ab.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_p),this.update(),this.state=he.NONE}update(t=null){let e=this.object.position;He.copy(e).sub(this.target),He.applyQuaternion(this._quat),this._spherical.setFromVector3(He),this.autoRotate&&this.state===he.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=fn:n>Math.PI&&(n-=fn),r<-Math.PI?r+=fn:r>Math.PI&&(r-=fn),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(He.setFromSpherical(this._spherical),He.applyQuaternion(this._quatInverse),e.copy(this.target).add(He),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=He.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;let l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=He.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(jl.origin.copy(this.object.position),jl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(jl.direction))<mb?this.object.lookAt(this.target):(wp.setFromNormalAndCoplanarPoint(this.object.up,this.target),jl.intersectPlane(wp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>td||8*(1-this._lastQuaternion.dot(this.object.quaternion))>td||this._lastTargetPosition.distanceToSquared(this.target)>td?(this.dispatchEvent(_p),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?fn/60*this.autoRotateSpeed*t:fn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){He.setFromMatrixColumn(e,0),He.multiplyScalar(-t),this._panOffset.add(He)}_panUp(t,e){this.screenSpacePanning===!0?He.setFromMatrixColumn(e,1):(He.setFromMatrixColumn(e,0),He.crossVectors(this.object.up,He)),He.multiplyScalar(t),this._panOffset.add(He)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;He.copy(r).sub(this.target);let s=He.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*s/n.clientHeight,this.object.matrix),this._panUp(2*e*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=t-n.left,s=e-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._panStart.set(n,r)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,r=t.pageY-e.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),r=.5*(t.pageX+n.x),s=.5*(t.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),r=.5*(t.pageY+e.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,r=t.pageY-e.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new _t,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function gb(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function xb(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function vb(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Mp),this.state=he.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function bb(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Gi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=he.DOLLY;break;case Gi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=he.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=he.ROTATE}break;case Gi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=he.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=he.PAN}break;default:this.state=he.NONE}this.state!==he.NONE&&this.dispatchEvent(ed)}function yb(i){switch(this.state){case he.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case he.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case he.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function _b(i){this.enabled===!1||this.enableZoom===!1||this.state!==he.NONE||(i.preventDefault(),this.dispatchEvent(ed),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Mp))}function wb(i){this.enabled!==!1&&this._handleKeyDown(i)}function Mb(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Wi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=he.TOUCH_ROTATE;break;case Wi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=he.TOUCH_PAN;break;default:this.state=he.NONE}break;case 2:switch(this.touches.TWO){case Wi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=he.TOUCH_DOLLY_PAN;break;case Wi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=he.TOUCH_DOLLY_ROTATE;break;default:this.state=he.NONE}break;default:this.state=he.NONE}this.state!==he.NONE&&this.dispatchEvent(ed)}function Sb(i){switch(this._trackPointer(i),this.state){case he.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case he.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case he.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case he.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=he.NONE}}function Eb(i){this.enabled!==!1&&i.preventDefault()}function Tb(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ab(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var ps={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Mn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Rb=new mr(-1,1,1,-1,0,1),nd=class extends Ne{constructor(){super(),this.setAttribute("position",new le([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new le([0,2,0,0,2,0],2))}},Cb=new nd,Yi=class{constructor(t){this._mesh=new fe(Cb,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Rb)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var Kl=class extends Mn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Re?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Yn.clone(t.uniforms),this.material=new Re({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Yi(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var vo=class extends Mn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let r=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}},Ql=class extends Mn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var tc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new _t);this._width=n.width,this._height=n.height,e=new Qe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Pn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Kl(ps),this.copyPass.material.blending=Xn,this.clock=new gr}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let r=0,s=this.passes.length;r<s;r++){let o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}vo!==void 0&&(o instanceof vo?n=!0:o instanceof Ql&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new _t);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,r)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ec=class extends Mn{constructor(t,e,n=null,r=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pt}render(t,e,n){let r=t.autoClear;t.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=r}};var Sp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var fs=class i extends Mn{constructor(t,e=1,n,r){super(),this.strength=e,this.radius=n,this.threshold=r,this.resolution=t!==void 0?new _t(t.x,t.y):new _t(256,256),this.clearColor=new Pt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Qe(s,o,{type:Pn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let h=new Qe(s,o,{type:Pn});h.texture.name="UnrealBloomPass.h"+d,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);let u=new Qe(s,o,{type:Pn});u.texture.name="UnrealBloomPass.v"+d,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),s=Math.round(s/2),o=Math.round(o/2)}let a=Sp;this.highPassUniforms=Yn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Re({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new _t(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Yn.clone(ps.uniforms),this.blendMaterial=new Re({uniforms:this.copyUniforms,vertexShader:ps.vertexShader,fragmentShader:ps.fragmentShader,blending:Xi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Pt,this._oldClearAlpha=1,this._basic=new We,this._fsQuad=new Yi(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),r=Math.round(e/2);this.renderTargetBright.setSize(n,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,r),this.renderTargetsVertical[s].setSize(n,r),this.separableBlurMaterials[s].uniforms.invSize.value=new _t(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,e,n,r,s){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Re({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new _t(.5,.5)},direction:{value:new _t(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(t){return new Re({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}};fs.BlurDirectionX=new _t(1,0);fs.BlurDirectionY=new _t(0,1);var bo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var nc=class extends Mn{constructor(){super(),this.uniforms=Yn.clone(bo.uniforms),this.material=new io({name:bo.name,uniforms:this.uniforms,vertexShader:bo.vertexShader,fragmentShader:bo.fragmentShader}),this._fsQuad=new Yi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Zt.getTransfer(this._outputColorSpace)===Qt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===tl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===el?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===nl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===il?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===sl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ol?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===rl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function ic(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},o={},a=i[0].morphTargetsRelative,c=new Ne,l=0;for(let d=0;d<i.length;++d){let h=i[d],u=0;if(e!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in h.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;s[p]===void 0&&(s[p]=[]),s[p].push(h.attributes[p]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in h.morphAttributes){if(!r.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(h.morphAttributes[p])}if(t){let p;if(e)p=h.index.count;else if(h.attributes.position!==void 0)p=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,d),l+=p}}if(e){let d=0,h=[];for(let u=0;u<i.length;++u){let p=i[u].index;for(let m=0;m<p.count;++m)h.push(p.getX(m)+d);d+=i[u].attributes.position.count}c.setIndex(h)}for(let d in s){let h=Ep(s[d]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,h)}for(let d in o){let h=o[d][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let u=0;u<h;++u){let p=[];for(let x=0;x<o[d].length;++x)p.push(o[d][x][u]);let m=Ep(p);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(m)}}return c}function Ep(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){let d=i[l];if(t===void 0&&(t=d.array.constructor),t!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=d.itemSize),e!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=d.normalized),n!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=d.gpuType),r!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=d.count*e}let o=new t(s),a=new on(o,e,n),c=0;for(let l=0;l<i.length;++l){let d=i[l];if(d.isInterleavedBufferAttribute){let h=c/e;for(let u=0,p=d.count;u<p;u++)for(let m=0;m<e;m++){let x=d.getComponent(u,m);a.setComponent(u+h,m,x)}}else o.set(d.array,c);c+=d.count*e}return r!==void 0&&(a.gpuType=r),a}var Tp=()=>`
/* one rule per selector and breakpoint where the cascade allows (consolidated) */
#app{--label:#f0efec;--label2:#c3c2b7;--label3:#7d7c76;--sep:rgba(240,239,236,.1);--fill:rgba(240,239,236,.07);--fill2:rgba(240,239,236,.13);--tint:#f0efec;--mat:#1c1c1e;--mat-blur:none;--edge:rgba(240,239,236,.08);--bg:#0e0e0d;--ok:#3f7a52;--night:#3a3a38;--seg-thumb:#3a3a37;--chip:rgba(20,20,19,.82);--place:rgba(240,239,236,.75);--halo:0 1px 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.6);--inner:rgba(255,255,255,.16);--shadow:rgba(0,0,0,.45);--scrim:14,14,13;--scrim-a:.78;position:fixed;inset:0;overflow:hidden;background:var(--bg);color:var(--label);transition:background-color .3s;font:400 15px/1.4 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;user-select:none}
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
.marks i.o{background:var(--mat);box-shadow:inset 0 0 0 1px var(--label3)}
.marks i.n{background:var(--night)}
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
.dock .rowlbl #r18-l:not([hidden]){top:calc(34px + var(--mt) - 3px);height:auto;margin:0}
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
#livedot.ok{background:#2e9d54}
#livedot.old{background:var(--label3)}
.prun .age{font-weight:400;color:var(--label2)}
@media (max-width:639px){
  .mapchip{display:none}
}
.track .pgl{font-size:11px;font-weight:600!important}
@media (max-width:639px){
  .pbar{align-items:center;display:grid!important;height:auto!important;gap:.375rem .75rem!important;padding:.5rem .75rem!important;align-content:start;grid-template-columns:minmax(0,1fr) auto auto!important;grid-template-areas:"brand thm tz" "tabs tabs run"!important;column-gap:8px!important}
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
.dhd .ro b{font-weight:600;color:var(--label)}
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
  .dock .rowlbl #r18-l:not([hidden]){top:calc(34px + var(--mt) - 16px)!important}
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
  .dock{padding:.625rem .75rem .5rem .625rem;border-radius:18px 18px 0 0!important;box-shadow:0 -8px 24px rgba(0,0,0,.12)!important;bottom:0!important;padding-left:16px!important;padding-right:16px!important;padding-top:8px!important;padding-bottom:16px!important}
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
.row.mapkey .plk.gh{opacity:.6} /* the map draws these lines at 60 % */
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
#app:not(.light) .track .swchip{color:#0f1a17}
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
  .rail .row.mapkey.inrail{font-size:11px;gap:2px 12px;padding:10px 0 0!important;margin-top:0;border-top:1px solid var(--sep)!important;line-height:14px} /* a hairline and 12 px above the key */
  .rail .row.mapkey.inrail::before{display:none!important}
  .rail .hero .conditions .row.pdetrow{padding-top:0!important;padding-bottom:0!important}
  .rail .row.mapkey.inrail .tkey b{width:13px;height:13px}
  .rail .row.mapkey.inrail .kbr{display:block;flex-basis:100%;height:0}
}
`;var Zn=class{constructor(t=0,{damping:e=1,response:n=.4}={}){this.x=t,this.v=0,this.target=t,this.params(e,n)}params(t,e){return this.damping=t,this.response=e,this.k=(2*Math.PI/e)**2,this.c=4*Math.PI*t/e,this}to(t,{velocity:e,damping:n,response:r}={}){return(n!==void 0||r!==void 0)&&this.params(n??this.damping,r??this.response),e!==void 0&&(this.v=e),this.target=t,this}jump(t){return this.x=this.target=t,this.v=0,this}step(t){let e=Math.max(1,Math.ceil(t*240)),n=t/e;for(;e--;)this.v+=(-this.k*(this.x-this.target)-this.c*this.v)*n,this.x+=this.v*n;let r=Math.max(1,Math.abs(this.target));return Math.abs(this.x-this.target)<1e-4*r&&Math.abs(this.v)<.001*r&&this.jump(this.target),this.x}get resting(){return this.x===this.target&&this.v===0}},yo=class{constructor(t){this.s=[new Zn(0,t),new Zn(0,t),new Zn(0,t)]}jump(t){return this.s[0].jump(t.x),this.s[1].jump(t.y),this.s[2].jump(t.z),this}to(t,e){return this.s[0].to(t.x,e),this.s[1].to(t.y,e),this.s[2].to(t.z,e),this}step(t,e){return e.set(this.s[0].step(t),this.s[1].step(t),this.s[2].step(t)),e}get resting(){return this.s.every(t=>t.resting)}},Ap=(i,t=.998)=>i/1e3*t/(1-t),id=(i,t,e=.55)=>i*t*e/(t+e*Math.abs(i));var ke=window.FRA_SCENE,gs=window.FRA_FORECAST,$e="Europe/Berlin",er=new URLSearchParams(location.search),No=er.has("embed"),wc=er.get("embed")==="card",Ti=er.get("embed")==="bare",Hp=wc||Ti,cd={top:0,right:0,bottom:0,left:0},Le={card:wc},Ib=er.get("palette")==="lh"||er.get("theme")==="lh",Pb={dark:{eastLine:"#a3adc2",westLine:"#5fcab5",east:"#2f4a7a",west:"#4dbfa7",r18:"#c3c2b7",closed:"#d03b3b",arr:"#199e70",dep:"#f0efec",ground:"#8a8984",air:"#c3c2b7"},light:{eastLine:"#2c3e66",westLine:"#1f9e89",east:"#2c3e66",west:"#1f9e89",r18:"#52514e",closed:"#d03b3b",arr:"#1baf7a",dep:"#0b0b0b",ground:"#8a8984",air:"#9a9893"}},Vp=Pb,Tr={dark:{bg:"#0e0e0d",ground:"#0b0b0a"},light:{bg:"#eceeef",ground:"#e9ebec"}},Lb=["dark","light"].includes(er.get("theme"))?er.get("theme"):null,Gp=null;try{Gp=No?null:localStorage.getItem("fra-theme")||null}catch{}var Kt=Lb||Gp||"light";document.documentElement.dataset.theme=Kt;var me=Vp[Kt],hd={},ui=wi,mc=Xi,Zi={25:249,7:69,18:180},Db=5,qt=(i,t,e=0)=>new L(i,e,-t),Wp=document.createElement("style");Wp.textContent=Tp()+(()=>{let i=(window.FRA_STYLE||{}).header_css;return i?`@media (min-width:640px){${i.replace(/([^;{}]+?)(;|})/g,(t,e,n)=>e.includes(":")&&!e.includes("!important")?`${e}!important${n}`:t)}.pbar,.rail,.mapov,.dock,.stack,.rose,.attrib{zoom:var(--hz,1)}}`:""})();{let i=()=>document.documentElement.style.setProperty("--hz",Math.max(1,Math.min(1.5,innerWidth/1280,innerHeight/810)).toFixed(4));i(),addEventListener("resize",i)}document.head.appendChild(Wp);var at=document.getElementById("app");No&&document.body.classList.add("embed");wc&&document.body.classList.add("card");Ti&&document.body.classList.add("bare");var Un=new Yl({antialias:!0,powerPreference:"high-performance"});Un.setPixelRatio(Math.min(devicePixelRatio,2));at.appendChild(Un.domElement);var Nn=new $s;Nn.background=new Pt(Tr.dark.bg);Nn.fog=new Xs(Tr.dark.bg,4e-5);Nn.add(new oo("#ffffff","#b9b7b2",2.1));var Xp=new ao("#ffffff",1.7);Xp.position.copy(qt(-5e3,-7e3,9e3));Nn.add(Xp);var ne=new Ke(36,1,250,4e5),hn=new Jl(ne,Un.domElement);hn.enableDamping=!0;hn.maxPolarAngle=Math.PI*.47;hn.minDistance=800;hn.maxDistance=2e5;hn.autoRotateSpeed=1;var Eo={card:{pos:qt(-800,-4800,12e3),target:qt(-800,-800,0)},full:{pos:qt(-1e3,-3e3,7400),target:qt(-1e3,250,0)},bare:{pos:qt(-450,-8300,5e3),target:qt(-2050,-300,0)}},Co=()=>Le.card?Eo.card:Ti?Eo.bare:Eo.full,li=7,Mc=!1;ne.position.copy(Co().pos);hn.target.copy(Co().target);var Fo=new tc(Un);Fo.addPass(new ec(Nn,ne));var To=new fs(new _t(512,512),.55,.3,.3);function $p(){To.enabled=Kt==="dark",To.strength=Le.card?.08:.14,To.threshold=Le.card?.42:.3}Fo.addPass(To);Fo.addPass(new nc);function Pr(){let i=at.clientWidth,t=at.clientHeight;Un.setSize(i,t),Fo.setSize(i,t),To.resolution.set(i/2,t/2),ne.aspect=i/t,ne.fov=Le.card?Math.min(36,Math.max(16,qn.radToDeg(2*Math.atan(Math.tan(qn.degToRad(29))/ne.aspect)))):36;let e=document.querySelector(".hero")?.getBoundingClientRect().bottom-at.getBoundingClientRect().top||0,n=i<640?1:parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1,r=i<640,s=r?(document.querySelector(".rail")?.getBoundingClientRect().bottom??0)-at.getBoundingClientRect().top:0,o=r?at.getBoundingClientRect().bottom-(document.querySelector(".dock")?.getBoundingClientRect().top??at.getBoundingClientRect().bottom):0;r&&at.style.setProperty("--dock-h",`${Math.round(o)}px`);{let u=document.querySelector(".dock"),p=document.querySelector(".rail");u&&at.style.setProperty("--dock-top-h",`${Math.round((at.getBoundingClientRect().bottom-u.getBoundingClientRect().top)/n)}px`),p&&at.style.setProperty("--rail-r",`${Math.round((p.getBoundingClientRect().right-at.getBoundingClientRect().left)/n)}px`);{let m=p.getBoundingClientRect(),x=at.getBoundingClientRect();typeof Q<"u"&&Q.run&&!ln()||at.style.setProperty("--rail-b",`${Math.round((m.bottom-x.top)/n)}px`),at.style.setProperty("--rail-l",`${Math.round((m.left-x.left)/n)}px`),at.style.setProperty("--rail-w",`${Math.round(m.width/n)}px`)}p&&p.classList.toggle("over",p.scrollHeight>p.clientHeight+1)}let a=at.getBoundingClientRect().bottom-(document.querySelector(".dock")?.getBoundingClientRect().top??at.getBoundingClientRect().bottom-200),c=(document.querySelector(".rail")?.getBoundingClientRect().right??380)-at.getBoundingClientRect().left,l=Ti?cd:Le.card?{top:0,right:0,bottom:0,left:0}:r?{top:s+16,right:16,bottom:o+16+((document.querySelector(".mapov")?.offsetHeight||0)+8),left:16}:{top:(document.querySelector(".pbar")?.getBoundingClientRect().bottom??56)-at.getBoundingClientRect().top+32,right:32,bottom:a+16,left:Math.min(c,i*.4)+32};{let u=document.querySelector(".pbar"),p=document.querySelector(".rail"),m=document.querySelector(".stack");if(u&&p&&!Ti&&!Le.card){let x=Math.round(u.getBoundingClientRect().bottom-at.getBoundingClientRect().top+(r?8:16));p.style.top=`${x/n}px`,m&&!r&&m.style.setProperty("top",`${x/n}px`,"important")}}if(ji=null,!r&&!Ti&&!Le.card){let u=document.querySelector(".stack");if(u&&u.offsetWidth){let p=u.getBoundingClientRect(),m=at.getBoundingClientRect();ji=[p.left-m.left-40,p.bottom-m.top+40]}}De=l,at.style.setProperty("--free-cx",`${Math.round(l.left+(i-l.left-l.right)/2)}px`),at.style.setProperty("--free-l",`${Math.round(l.left)}px`);{let u=document.querySelector(".rail"),p=document.querySelector(".dock");if(u&&p&&!r&&!(typeof Q<"u"&&Q.run&&!ln())){at.classList.remove("keyfree");let m=document.getElementById("mapkey");m&&m.classList.contains("inrail")&&(m.classList.remove("inrail"),m.classList.add("mapov","panel"),Bo.appendChild(m)),u.style.minHeight="";let x=(p.getBoundingClientRect().top-u.getBoundingClientRect().top)/n-12;u.style.maxHeight="";let g=u.scrollHeight,f=(document.querySelector(".mapov")?.offsetHeight||0)+12;u.style.maxHeight=`${Math.max(200,x)}px`;let S=u.getBoundingClientRect(),y=at.getBoundingClientRect();at.style.setProperty("--rail-b",`${Math.round((S.bottom-y.top)/n)}px`),at.classList.toggle("keyfree",S.bottom+f*n>p.getBoundingClientRect().top-12*n),m&&at.classList.contains("keyfree")&&(m.classList.remove("mapov","panel"),m.classList.add("inrail"),(u.querySelector(".pdetrow")||u.lastElementChild).after(m));{let b=u.getBoundingClientRect();u.style.minHeight=`${Math.round(b.height/n)}px`,at.style.setProperty("--rail-b",`${Math.round((b.bottom-at.getBoundingClientRect().top)/n)}px`)}}}let d=l.left+(i-l.left-l.right)/2,h=l.top+(t-l.top-l.bottom)/2;(Ti||!Le.card)&&i&&t?ne.setViewOffset(i,t,i/2-d,t/2-h,i,t):ne.clearViewOffset(),ne.updateProjectionMatrix(),Kp()}function qp(){if(!Q.run)return;let i=Math.max(0,Math.round((Date.now()-Date.parse(Q.run.issue))/6e4)),t=i<60?`${i}\u202Fmin ago`:i<2880?`${Math.round(i/60)}\u202Fh ago`:`${Math.round(i/1440)} days ago`,e=new Date(Q.run.issue),n=Rr.format(e)===Rr.format(new Date),r=new Date(Math.ceil((Date.now()-18e5+1)/36e5)*36e5+18e5);N("issued-t").parentElement.querySelector(".frs").innerHTML=`<span class="fw">Forecast issued </span><span class="fi">Issued </span><b>${n?"":`${Rr.format(e)}, `}${mn(e)}</b><span class="fw"> \xB7 next <b>${mn(r)}</b>${i<90?" \xB7 live":""}</span>`,N("issued-t").parentElement.title=`${_e.issued} ${Es.format(e)}, ${t}`,N("livedot").className=i<90?"ok":"old"}setInterval(()=>qp(),6e4);var oc={},ac={},Yp=[],rd=0,dd=null;var Zp=[],jp=null,Jp={};window.fitStat=()=>({...jp,...Fb});var kb=[[50.0136,8.428],[50.0098,8.4535],[49.9899,8.4225]].map(([i,t])=>[(t-8.5706)*71503,(i-50.0333)*111320]),Ub=[[50.0531,8.6947]].map(([i,t])=>[(t-8.5706)*71503,(i-50.0333)*111320]);function Nb(i,t){let e=Jn(i,t),n=e.dir,r=e.start,s=(t===25?Ub:kb).map(o=>{let a=r[0]-o[0],c=r[1]-o[1],l=a*n[0]+c*n[1],d=Math.abs(a*n[1]-c*n[0]);return l>0&&d<1500?l:0});return Jp[`${i.key}/${t}`]||16e3}var Rp=!1,De={top:0,right:0,bottom:0,left:0},ji=null,Fb=null,sd=()=>at.clientWidth<640;function Kp(){if(Ti||!ee.r18||!at.clientWidth){Nn.fog.density=4e-5,ud=!1,tf();for(let v of Qn)v.visible===void 0&&(v.visible=!0);return}let i=[...Object.values(ee).flatMap(v=>[v.A,v.B]),...(ke.aerodrome||[]).flat()],t=Math.min(...i.map(v=>v[0])),e=Math.max(...i.map(v=>v[0])),n=Math.min(...i.map(v=>v[1])),r=Math.max(...i.map(v=>v[1])),s=6e3*Math.sin(69*Math.PI/180),o=6e3*Math.cos(69*Math.PI/180),c=(li===25?[[50.0531,8.6947]]:[[50.0136,8.428],[50.0098,8.4535],[49.9899,8.4225]]).map(([v,w])=>[(w-8.5706)*71503,(v-50.0333)*111320]),l=Object.values(ee).filter(v=>v.key==="centre"||v.key==="r18").map(v=>{let w=Jn(v,li),I=v.key==="r18"?1100:1500;return[w.start[0]+w.dir[0]*(v.len+I),w.start[1]+w.dir[1]*(v.len+I)]}),d=[t,e,...c.map(v=>v[0]),...sd()?l.map(v=>v[0]):[]],h=[n,r,...c.map(v=>v[1]),...sd()?l.map(v=>v[1]):[]],u=sd()?(v=>[v[0]-v[4]*.1,v[1]+v[4]*.1,v[2]-v[5]*.1,v[3]+v[5]*.1])((v=>[...v,v[1]-v[0],v[3]-v[2]])([Math.min(...d)-1800,Math.max(...d),Math.min(...h),Math.max(...h)])):[Math.min(...d)-1800,Math.max(...d)+1200,Math.min(...h)-1200,Math.max(...h)+1200],p=at.clientWidth<640,m=Le.card?-6e3:(u[0]+u[1])/2,x=Le.card?0:(u[2]+u[3])/2,g=Le.card?27e3:u[1]-u[0],f=Le.card?2e4:u[3]-u[2],S=at.clientWidth,y=at.clientHeight,b=S-De.left-De.right,T=y-De.top-De.bottom,E=Math.tan(qn.degToRad(ne.fov/2)),R=Math.max(f/(2*E*(T/y)),g/(2*E*ne.aspect*(b/S))),C=qn.degToRad(p?.5:10);if(Eo[Le.card?"card":"full"]={pos:qt(m,x-R*Math.sin(C),R*Math.cos(C)),target:qt(m,x,0)},rd=0,!Le.card){let v=(ke.aerodrome||[[]])[0],w=[];for(let gt of Object.values(ee))if(gt.key==="nw"||gt.key==="south"){let ft=Jn(gt,li),X=c.map(lt=>{let bt=ft.start[0]-lt[0],xt=ft.start[1]-lt[1],Gt=bt*ft.dir[0]+xt*ft.dir[1],Se=Math.abs(bt*ft.dir[1]-xt*ft.dir[0]);return Gt>0&&Se<2500?Gt:0}),Z=Math.max(4e3,Math.max(...X)+1e3);w.push([ft.start[0]-ft.dir[0]*Z,ft.start[1]-ft.dir[1]*Z])}let I=Zp=[...Object.values(ee).flatMap(gt=>[gt.A,gt.B]),...v.filter((gt,ft)=>ft%10===0),...c,...p?[]:[...c.map(gt=>[gt[0]-500,gt[1]]),...l]],k=I.map(gt=>qt(gt[0],gt[1],0)),z=ne.clone(),G=new L,B=(Math.min(...I.map(gt=>gt[0]))+Math.max(...I.map(gt=>gt[0])))/2,H=(Math.min(...I.map(gt=>gt[1]))+Math.max(...I.map(gt=>gt[1])))/2,W=(gt,ft,X,Z,lt)=>{let bt=[Math.sin(Z),Math.cos(Z)];return[qt(gt-bt[0]*X*Math.sin(lt),ft-bt[1]*X*Math.sin(lt),X*Math.cos(lt)),qt(gt,ft,0)]},O=De.left+b/2,nt=De.top+T/2,tt=p?Math.min(.97,1-48/Math.max(200,b)):.97,rt=null;for(let gt of p?[0]:[0,-6,6,-12,12])for(let ft of p?[.5]:[16,20]){let X=gt*Math.PI/180,Z=ft*Math.PI/180,lt=[Math.sin(X),Math.cos(X)],bt=[Math.cos(X),-Math.sin(X)],xt=B,Gt=H,Se=2e4,P=0,oe=0,Ot=0,Dt=0;for(let ue=0;ue<14;ue++){let[St,Ht]=W(xt,Gt,Se,X,Z);z.position.copy(St),z.up.set(0,1,0),z.lookAt(Ht),z.updateMatrixWorld(),z.updateProjectionMatrix();let we=k.map(J=>(G.copy(J).project(z),[(G.x+1)/2*S,(1-G.y)/2*y])),Me=Math.min(...we.map(J=>J[0])),A=Math.max(...we.map(J=>J[0])),_=Math.min(...we.map(J=>J[1])),V=Math.max(...we.map(J=>J[1])),j=ji?Math.max(0,...we.filter(J=>J[0]>ji[0]).map(J=>ji[1]-J[1])):0,et=Object.values(ee).flatMap(J=>[J.A,J.B]).map(J=>(G.copy(qt(J[0],J[1],0)).project(z),[(G.x+1)/2*S,(1-G.y)/2*y])),Y=(Me+A)/2,Tt=(_+V)/2,ct=p?.5:.42,Mt=p?.5:.48,Rt=De.left+ct*b,st=De.top+Mt*T;P=Math.max((Y-Me)/(ct*b),(A-Y)/((1-ct)*b)),oe=Math.max((Tt-_)/(Mt*T),(V-Tt)/((1-Mt)*T)),Ot=(Y-Rt)/b,Dt=(Tt-st-j/2)/T;let pt=p?tt:Math.min(tt,1-96/b),Ut=p?tt:Math.min(tt,1-104/T),Ct=Math.max(P/pt,(oe+j/T)/Ut),ut=2*Se*E/y,Bt=Ot*b*ut,D=Dt*T*ut/Math.max(.3,Math.cos(Z));xt+=Bt*bt[0]-D*lt[0],Gt+=Bt*bt[1]-D*lt[1],Se*=Math.pow(Ct,.8)}let wt=Math.min(P,1)*Math.min(oe,1);(!rt||wt>rt.cover*1.03)&&(rt={tx:xt,ty:Gt,D:Se,az:X,deg:gt,tt:Z,cover:wt,fx:P,fy:oe,cx:Ot,cy:Dt})}let[It,Wt]=W(rt.tx,rt.ty,rt.D,rt.az,rt.tt);Eo.full={pos:It,target:Wt},rd=rt.deg,jp={w:S,h:y,fillX:+rt.fx.toFixed(3),fillY:+rt.fy.toFixed(3),offX:+rt.cx.toFixed(3),offY:+rt.cy.toFixed(3),tilt:Math.round(rt.tt*180/Math.PI),free:[Math.round(De.left),Math.round(De.top),Math.round(b),Math.round(T)]};{z.position.copy(It),z.up.set(0,1,0),z.lookAt(Wt),z.updateMatrixWorld(),z.updateProjectionMatrix();let gt=[Math.max(0,De.left-32+8),De.top,S,y-De.bottom];for(let ft of Object.values(ee))if(ft.key==="nw"||ft.key==="south"){let X=Jn(ft,li),Z=2e3;for(;Z<16e3;Z+=50){G.copy(qt(X.start[0]-X.dir[0]*Z,X.start[1]-X.dir[1]*Z,0)).project(z);let lt=(G.x+1)/2*S,bt=(1-G.y)/2*y;if(lt<gt[0]||bt<gt[1]||lt>gt[2]||bt>gt[3])break}Jp[`${ft.key}/${li}`]=Z}for(let ft of Object.keys(ac))delete ac[ft];if(!p){for(let ft of Object.values(ee))if(ft.key==="nw"||ft.key==="south"){let X=li===25?7:25,Z=Jn(ft,X),lt=1e3;for(;lt<16e3;lt+=100){G.copy(qt(Z.start[0]-Z.dir[0]*lt,Z.start[1]-Z.dir[1]*lt,0)).project(z);let bt=(G.x+1)/2*S,xt=(1-G.y)/2*y;if(bt<De.left||bt>S-16||xt<De.top-24||xt>y-De.bottom||ji&&bt>ji[0]&&xt<ji[1])break}ac[`${ft.key}/${X}`]=lt}}for(let ft of Object.keys(oc))delete oc[ft];if(!p){for(let ft of Object.values(ee))if(ft.key==="centre"||ft.key==="r18"){let X=Jn(ft,li),Z=[X.start[0]+X.dir[0]*ft.len,X.start[1]+X.dir[1]*ft.len],lt=0;for(;lt<1500;lt+=25){G.copy(qt(Z[0]+X.dir[0]*(lt+25),Z[1]+X.dir[1]*(lt+25),0)).project(z);let bt=(G.x+1)/2*S,xt=(1-G.y)/2*y;if(xt>y-De.bottom||bt>S-24||xt<De.top-32)break}oc[`${ft.key}/${li}`]=lt}}try{gd="",Q.cur&&nf(Q.cur.od,Q.cur.r18)}catch{}}}{let v=document.querySelector(".sbw svg");v&&dd!==null&&v.style.setProperty("--a",`${dd+180-rd}deg`)}Nn.fog.density=(Kt==="light"?.22:.35)/R,ud=!0;for(let v of Qn)v.visible=!1;(Rp!==Le.card+1||!Mc&&Cr!=="follow"&&!Le.card)&&(Rp=Le.card+1,ne.position.copy(Co().pos),hn.target.copy(Co().target))}var Qp=new ResizeObserver(()=>Pr());setTimeout(()=>{Mc||Pr()},700);Qp.observe(at);requestAnimationFrame(()=>{for(let i of[".rail",".dock"]){let t=document.querySelector(i);t&&Qp.observe(t)}});var _s={transparent:!0,blending:Xi,depthWrite:!1},Ob=0,Qn=[],ud=!1;function de(i,t){return i.renderOrder=t??Ob++,i.frustumCulled=!1,Nn.add(i),i}function En(i,t,e=3){let n=new Ne;return n.setAttribute("position",new le(i,3)),t&&n.setAttribute("color",new le(t,e)),n}var gc=[],lc=[],Io=[];function Ze(i,t){let e=i.material,n={};for(let r in t)n[r]=r==="color"?e.color.clone():e[r];return gc.push({m:e,dark:n,light:{...t,...t.color?{color:new Pt(t.color)}:{}}}),i}function tf(){for(let i of gc){for(let[t,e]of Object.entries(i[Kt]))t==="color"?i.m.color.copy(e):i.m[t]=e;i.m.needsUpdate=!0}for(let i of lc)i.visible=Kt==="dark";for(let i of Io)i.visible=Kt==="light";if(ud)for(let i of Qn)i.visible=!1}function Sc(i,t,e,n){let r=[];for(let s of i){let o=s.map(a=>new _t(a[0],a[1]));for(let a of is.triangulateShape(o,[]))for(let c of a)r.push(o[c].x,t,-o[c].y)}return new fe(En(r),new We({color:e,transparent:!0,opacity:n,depthWrite:!1,side:Ce}))}function Oo(i,t,e,n,r=!1){let s=[];for(let o of i){let a=o.length,c=r?a:a-1;for(let l=0;l<c;l++){let d=o[l],h=o[(l+1)%a];s.push(d[0],t,-d[1],h[0],t,-h[1])}}return new Wn(En(s),new _n({color:e,opacity:n,..._s}))}function Ji(i,t,e,n){let r=[];for(let{p:s,w:o}of i){let a=o/2;for(let c=0;c<s.length-1;c++){let[l,d]=s[c],[h,u]=s[c+1],p=Math.hypot(h-l,u-d)||1,m=-(u-d)/p*a,x=(h-l)/p*a,g=[[l+m,d+x],[h+m,u+x],[h-m,u-x],[l-m,d-x]];for(let f of[0,1,2,0,2,3])r.push(g[f][0],t,-g[f][1])}}return new fe(En(r),new We({color:e,transparent:!0,opacity:n,depthWrite:!1,side:Ce}))}var Ec=new fe(new zi(9e4,9e4),new We({color:Tr.dark.ground}));Ze(Ec,{color:Tr.light.ground});Ec.rotation.x=-Math.PI/2;Ec.position.y=-1;de(Ec,-10);var Ss=new lo(24e3,96,"#1f1f1d","#191918");Ss.position.set(-1500,0,0);Ss.material.transparent=!0;Ss.material.opacity=.22;Ss.material.depthWrite=!1;de(Ze(Ss,{vertexColors:!1,color:"#e3e2de",opacity:.9}));var pd=()=>{Ss.visible=at.clientWidth>=640&&Kt!=="light"};new ResizeObserver(pd).observe(at);Qn.push(de(Ze(Sc(ke.forest,0,"#121211",.9),{color:"#d6dacd",opacity:1})));Qn.push(de(Ze(Sc(ke.water,0,"#101318",.9),{color:"#bccddd",opacity:1})));de(Ze(Sc(ke.aerodrome,0,"#1d1d1b",.9),{color:"#e3dfd6",opacity:1}));de(Ze(Oo(ke.aerodrome,0,"#5a5954",.5,!0),{color:"#b9b8b2",opacity:1,blending:ui}));de(Ze(Sc(ke.aprons,0,"#262624",.95),{color:"#c6bfb2",opacity:1}));de(Ze(Oo(ke.aprons,0,"#45443f",.3,!0),{color:"#c9c8c2",opacity:.35,blending:ui}));de(Ze(Ji(ke.taxiways,0,"#2c2c2a",.95),{color:"#b6b2a8",opacity:1}));Qn.push(de(Ze(Oo(ke.taxiways.map(i=>i.p),0,"#5c5b55",.35),{color:"#d8d6d0",opacity:.35,blending:ui})));for(let i of[0,1,2]){let t=["#6d6c66","#4a4945","#33322f"][i];Qn.push(de(Ze(Oo(ke.roads.filter(e=>e.c===i).map(e=>e.p),0,t,[.65,.5,.45][i]),{color:["#aeaca6","#bcbab4","#cac8c2"][i],opacity:1,blending:ui})))}{let i=[[50.108,8.78],[50.104,8.74],[50.106,8.69],[50.103,8.65],[50.1,8.58],[50.092,8.545],[50.063,8.53],[50.04,8.5],[50.012,8.47],[50.003,8.44],[50.008,8.4],[50.007,8.33],[50.003,8.275]].map(([e,n])=>[(n-8.5706)*71503,(e-50.0333)*111320]),t=new Qs(i.map(e=>new L(e[0],e[1],0)),!1,"centripetal").getSpacedPoints(180).map(e=>[e.x,e.y]);for(let e=0;e<t.length-1;e++){let n=t[e],r=t[e+1],s=(e+.5)/(t.length-1),o=Math.hypot((n[0]+r[0])/2+1500,(n[1]+r[1])/2),a=Math.max(0,Math.min(1,(11e3-o)/4e3,1-(s-.6)/.4));a>.02&&de(Ze(Ji([{p:[n,r],w:60}],.3,"#3a4f5e",.5*a),{color:"#9fb8cf",opacity:.95*a}))}}Qn.push(de(Ze(Oo(ke.rail,.5,"#8a8984",.5),{color:"#c8c6c0",opacity:.7,blending:ui})));{let i=document.createElement("canvas");i.width=i.height=256;let t=i.getContext("2d"),e=t.createRadialGradient(128,128,0,128,128,128);e.addColorStop(0,"rgba(0,0,0,0.045)"),e.addColorStop(.6,"rgba(0,0,0,0.03)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,256,256);let n=new fe(new zi(26e3,18e3),new We({map:new Ys(i),transparent:!0,depthWrite:!1}));n.rotation.x=-Math.PI/2,n.position.copy(qt(-2600,-800,-.5)),de(n,-9),Io.push(n)}var _o=(()=>{let i=(ke.aerodrome||[[]])[0];if(!i.length)return null;let t=i.map(n=>n[0]),e=i.map(n=>n[1]);return[Math.min(...t),Math.max(...t),Math.min(...e),Math.max(...e)]})(),rc=(ke.aerodrome||[[]])[0],Cp=i=>{let t=!1;for(let e=0,n=rc.length-1;e<rc.length;n=e++){let[r,s]=rc[e],[o,a]=rc[n];s>i[1]!=a>i[1]&&i[0]<(o-r)*(i[1]-s)/(a-s)+r&&(t=!t)}return t},Ip=i=>!!_o&&i[0]>_o[0]&&i[0]<_o[1]&&i[1]>_o[2]&&i[1]<_o[3];function Bb(){let i=[],t=[],e=[],n=[],r=[],s=[],o=[.6,.6,.58],a={t:1.2,w:1.6,h:.9,a:.8,o:.24},c=h=>Math.abs(h.reduce((u,p,m)=>{let x=h[(m+1)%h.length];return u+p[0]*x[1]-x[0]*p[1]},0)/2);for(let h of ke.buildings){if(c(h.r)<(Ip(h.r[0])?400:2500))continue;let u=h.r,p=u.length,m=h.m||0,x=Math.max(h.h,m+1),g=a[h.k]??.5,f=o.map(R=>R*g*.03),S=o.map(R=>R*g*.15),y=o.map(R=>R*g*.07);for(let R=0;R<p;R++){let C=u[R],v=u[(R+1)%p],w=[[C,m,f],[v,m,f],[v,x,S],[C,x,S]];for(let I of[0,1,2,0,2,3])i.push(w[I][0][0],w[I][1],-w[I][0][1]),t.push(...w[I][2])}let b=u.map(R=>new _t(R[0],R[1]));for(let R of is.triangulateShape(b,[]))for(let C of R)i.push(b[C].x,x,-b[C].y),t.push(...y),(Cp(u[0])?r:s).push(b[C].x,.5,-b[C].y);let T=o.map(R=>R*g*.6),E=o.map(R=>R*g*.15);for(let R=0;R<p;R++){let C=u[(R+p-1)%p],v=u[R],w=u[(R+1)%p];e.push(v[0],x,-v[1],w[0],x,-w[1]),n.push(...T,...T),h.k!=="o"&&(e.push(v[0],m,-v[1],w[0],m,-w[1]),n.push(...E,...E));let I=Math.atan2(v[1]-C[1],v[0]-C[0]),k=Math.atan2(w[1]-v[1],w[0]-v[0]),z=Math.abs(k-I);z>Math.PI&&(z=2*Math.PI-z),z>.45&&(e.push(v[0],m,-v[1],v[0],x,-v[1]),n.push(...E,...T))}}let l=En(i,t);l.computeVertexNormals();let d=de(new fe(En(r),new We({color:"#1b1c1e",transparent:!0,opacity:.1,depthWrite:!1,depthTest:!1,side:Ce})),13);Ze(d,{color:"#b9b5ad",opacity:1});{let h=[];for(let p of ke.buildings){if(c(p.r)<(Ip(p.r[0])?400:2500)||!Cp(p.r[0]))continue;let m=p.r;for(let x=0;x<m.length;x++){let g=m[x],f=m[(x+1)%m.length];h.push(g[0],.6,-g[1],f[0],.6,-f[1])}}let u=de(new Wn(En(h),new _n({color:"#635e55",transparent:!0,opacity:.95,depthTest:!1})),14);Io.push(u)}d.material.color.set("#ffffff"),d.material.opacity=.06,gc[gc.length-1].dark={color:new Pt("#ffffff"),opacity:.14};{let h=de(new fe(En(s),new We({color:"#ffffff",transparent:!0,opacity:.018,depthWrite:!1,depthTest:!1,side:Ce})),13);Ze(h,{color:"#b9b5ad",opacity:.3})}}Bb();var zb=`
attribute vec2 rw; varying vec2 vR;
#include <common>
#include <fog_pars_vertex>
void main(){ vR = rw; vec4 mvPosition = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mvPosition;
#include <fog_vertex>
}`,Hb=`
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
    col = vec3(0.045, 0.045, 0.043) + vec3(0.55, 0.55, 0.53) * marks;
    col += uCol * uActive * (0.05 + edge * 0.8 + chev * 0.9 + step(ay, 0.12) * 0.7); // tarmac stays dark; the direction glows along edges, centreline and chevrons
    col = mix(col, vec3(0.05, 0.03, 0.03) + vec3(0.9, 0.16, 0.16) * (0.18 * hatch + 0.9 * edge + 0.7 * cross), uClosed);
  }
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,ee={};for(let[i,t]of ke.runways.entries()){let e=t.p[0],n=t.p[t.p.length-1],r=Math.hypot(n[0]-e[0],n[1]-e[1]),s=1.35,o=(n[0]-e[0])/r,a=(n[1]-e[1])/r,c=-a*t.w*s/2,l=o*t.w*s/2,d=new Ne,h=[[e[0]+c,e[1]+l,0,1],[n[0]+c,n[1]+l,r,1],[n[0]-c,n[1]-l,r,-1],[e[0]-c,e[1]-l,0,-1]],u=[],p=[];for(let y of[0,1,2,0,2,3])u.push(h[y][0],0,-h[y][1]),p.push(h[y][2],h[y][3]);d.setAttribute("position",new le(u,3)),d.setAttribute("rw",new le(p,2));let m=Yn.merge([dt.fog,{uLen:{value:r},uW:{value:t.w*s},uDir:{value:1},uActive:{value:0},uClosed:{value:0},uTime:{value:0},uCol:{value:new Pt},uLight:{value:0}}]),x=new Re({vertexShader:zb,fragmentShader:Hb,uniforms:m,fog:!0,transparent:!0,depthWrite:!1,side:Ce});de(new fe(d,x),40);let g=t.ref.startsWith("07L")?"nw":t.ref.startsWith("07C")?"centre":t.ref.startsWith("07R")?"south":"r18",[f,S]=t.ref.includes("/")?t.ref.split("/"):["18","36"];ee[g]={i,key:g,A:e,B:n,len:r,ux:o,uy:a,mat:x,ref:t.ref,w:t.w,d07:f,d25:S}}function Jn(i,t){if(i.key==="r18"){let o=i.A[1]>i.B[1]?i.A:i.B,a=o===i.A?i.B:i.A;return{start:o,dir:[(a[0]-o[0])/i.len,(a[1]-o[1])/i.len],startIsA:o===i.A}}let e=i.A[0]<i.B[0]?i.A:i.B,n=e===i.A?i.B:i.A,[r,s]=t===7?[e,n]:[n,e];return{start:r,dir:[(s[0]-r[0])/i.len,(s[1]-r[1])/i.len],startIsA:r===i.A}}var Vb=[[1,.9,.72],[.95,.94,.9],[.55,.62,.55],[.5,.5,.48],[1,.2,.18]];var Ki=new Re({uniforms:{uAct:{value:new ce(1,1,1,1)},uArr:{value:new ce(-1,-1,-1,-1)},uTime:{value:0},uScale:{value:600},uLight:{value:0}},vertexShader:`
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
    }`,..._s});{let i=[],t=[],e=[],n=ke.runways;for(let[s,o,a,c]of ke.lights){i.push(s,.5,-o),t.push(...Vb[a]);let l=0,d=0;if(c>=0){let h=n[c].p[0],u=n[c].p[n[c].p.length-1],p=u[0]-h[0],m=u[1]-h[1],x=p*p+m*m,g=((s-h[0])*p+(o-h[1])*m)/x;l=g<.5?0:1,d=Math.max(0,g<0?-g:g-1)*Math.sqrt(x)}e.push(a,c,l,d)}let r=En(i,t);r.setAttribute("meta",new le(e,4)),de(new qs(r,Ki),60)}function Gb(){let i=[],t=(r,s,o,a,c,l,d=10)=>{let h=new Js(s,r,o,d,1,!0);h.rotateZ(-Math.PI/2),h.translate(a,c,l),i.push(h.toNonIndexed())},e=(r,s,o=!0)=>{let a=[];for(let c of o?[1,-1]:[1]){let l=r.map(([d,h])=>[d,s,h*c]);for(let d=1;d<l.length-1;d++)a.push(...l[0],...l[d],...l[d+1])}i.push(En(a))};t(1.95,1.95,30,1,2.4,0),t(1.95,.25,5.5,18.75,2.3,0),t(1.95,.5,8,-18,2.9,0),e([[4.5,1.5],[-6,17.5],[-8.6,17.5],[-4.5,1.5]],1.7),e([[-15.2,1],[-19.8,6.8],[-21.4,6.8],[-19.4,1]],3.3);{let r=[[-14,4],[-19.6,11.8],[-21.6,11.8],[-20.8,4]].map(([s,o])=>[s,o,0]);i.push(En([...r[0],...r[1],...r[2],...r[0],...r[2],...r[3]]))}t(1.15,1.15,4.2,1.8,.55,6.2,8),t(1.15,1.15,4.2,1.8,.55,-6.2,8);for(let r of i)r.deleteAttribute("normal"),r.deleteAttribute("uv");let n=ic(i);return n.computeVertexNormals(),n}var Tc=Gb(),yd=new Ks(Tc,25);{let i=new ve,t=new un,e=new L(0,1,0),n=[],r=[];for(let[s,o,a,c]of ke.stands)i.compose(qt(s,o,.3),t.setFromAxisAngle(e,a),new L(c,c,c)),n.push(Tc.clone().applyMatrix4(i)),r.push(yd.clone().applyMatrix4(i));if(n.length){let s=ic(n);Qn.push(lc.push(de(new fe(s,new We({color:"#8a8984",opacity:.1,side:Ce,..._s})),55))&&lc[lc.length-1]),Qn.push(Io[Io.push(de(new fe(s,new pr({color:"#ffffff",side:Ce})),55))-1]),Qn.push(de(Ze(new Wn(ic(r),new _n({color:"#c3c2b7",opacity:.3,..._s})),{color:"#cfcdc7",opacity:.3,blending:ui}),56))}}var Wb=Math.tan(3*Math.PI/180),Xb=Math.tan(7.5*Math.PI/180),re={far:16e3,vApp:72,td:380,dec:1.9,vExit:14,exitT:9},Oe={hold:6,acc:2.1,vRot:82,climbDist:13e3};re.tTd=(re.far+re.td)/re.vApp;re.tRoll=(re.vApp-re.vExit)/re.dec;re.D=re.tTd+re.tRoll+re.exitT;Oe.tRoll=Oe.vRot/Oe.acc;Oe.dRoll=Oe.vRot**2/(2*Oe.acc);Oe.D=Oe.hold+Oe.tRoll+Oe.climbDist/(Oe.vRot+6);function $b(i){if(i<re.tTd){let r=-re.far+re.vApp*i;return[r,Math.max(0,(re.td-r)*Wb),.05,0]}let t=Math.min(i-re.tTd,re.tRoll),e=re.td+re.vApp*t-re.dec*t*t/2,n=Math.max(0,i-re.tTd-re.tRoll);return[e+re.vExit*n,0,0,Math.min(1,n/re.exitT)]}function qb(i){if(i<Oe.hold)return[0,0,0,0];let t=i-Oe.hold;if(t<Oe.tRoll)return[Oe.acc*t*t/2,0,0,0];let e=Oe.dRoll+(Oe.vRot+6)*(t-Oe.tRoll);return[e,(e-Oe.dRoll)*Xb,.14,0]}var od=40,fd=class{constructor(t,e,n,r,s){this.kind=t,this.rw=e,this.f=Jn(e,n),this.phase=r,this.born=s,this.dead=null;let o=this.f.startIsA,a=o?e.A:e.B,c=o?e.B:e.A;this.des=e.key==="r18"?"18":a[0]<c[0]?e.d07:e.d25,this.label=`Simulated ${t==="arr"?"arrival":"departure"} \xB7 ${this.des}`,this.D=t==="arr"?re.D:Oe.D,this.side=Math.random()<.5?1:-1;let l=t==="arr"?hd.arr:hd.dep,d=this.light=Kt==="light",h={transparent:!0,depthWrite:!1,blending:d?ui:mc};this.mat=d?new pr({color:"#ffffff",side:Ce,transparent:!0}):new We({color:new Pt("#e8e7e3"),side:Ce,..._s}),this.emat=new _n({color:d?l:l.clone().lerp(new Pt("#ffffff"),.5),...h}),this.obj=new Hn,this.obj.add(new fe(Tc,this.mat),new Wn(yd,this.emat)),de(this.obj,70);let u=od;this.tg=En(new Float32Array(u*2*3),new Float32Array(u*2*4),4);let p=[];for(let m=0;m<u-1;m++){let x=2*m;p.push(x,x+1,x+2,x+1,x+3,x+2)}this.tg.setIndex(p),this.trail=de(new fe(this.tg,new We({vertexColors:!0,side:Ce,...h})),65),this.lg=En(new Float32Array(u*3),new Float32Array(u*4),4),this.line=de(new es(this.lg,new _n({vertexColors:!0,...h})),66),this.col=l}pose(t){let[e,n,r,s]=(this.kind==="arr"?$b:qb)(t),{start:o,dir:a}=this.f,c=o[0]+a[0]*e,l=o[1]+a[1]*e,d=Math.atan2(a[1],a[0]);if(s>0){let h=this.side*90*s*s;c+=-a[1]*h,l+=a[0]*h,d+=this.side*s*.9}return{x:c,y:l,h:n,hd:d,pitch:r}}alpha(t,e){let n=Math.min(1,(e-this.born)/1.5);this.dead!==null&&(n*=Math.max(0,1-(e-this.dead)/1.5));let r=t/this.D;return n*Math.min(1,r/.04)*Math.min(1,(1-r)/.05)}update(t,e){let n=(t/this.D+this.phase)%1*this.D,r=this.pose(n),s=this.alpha(n,e);this.obj.position.copy(qt(r.x,r.y,r.h+2)),this.obj.rotation.set(0,r.hd,r.pitch,"YXZ"),this.obj.scale.setScalar(Le.card?4.5:2.4),this.mat.opacity=.08*s,this.emat.opacity=.7*s,this.cur={...r,al:s,t:n};let o=this.tg.attributes.position.array,a=this.tg.attributes.color.array,c=this.lg.attributes.position.array,l=this.lg.attributes.color.array;for(let d=0;d<od;d++){let h=Math.max(0,n-d*1.6),u=this.pose(h),p=(1-d/od)**1.5*s;o.set([u.x,u.h+2,-u.y,u.x,0,-u.y],d*6);let m=this.col,x=p*(this.kind==="arr"?.14:.06)*(this.light?3:1)*Math.min(1,300/(u.h+60));a.set([m.r,m.g,m.b,x,m.r,m.g,m.b,0],d*8),c.set([u.x,u.h+2,-u.y],d*3),l.set([m.r,m.g,m.b,p],d*4)}for(let d of[this.tg,this.lg])d.attributes.position.needsUpdate=!0,d.attributes.color.needsUpdate=!0}dispose(){for(let t of[this.obj,this.trail,this.line])Nn.remove(t);this.tg.dispose(),this.lg.dispose(),this.mat.dispose(),this.emat.dispose()}},Ei=[];function Yb(i){if(i.live)return[];let t=(qe?.future||[]).find(o=>Date.parse(o.t)===Date.parse(i.t)),e=o=>o?Math.max(1,Math.min(6,Math.round(o/6))):0;if(!t)return[["arr",ee.nw,3],["arr",ee.south,3],["dep",ee.centre,i.r18?3:4],...i.r18?[["dep",ee.r18,3]]:[]];let n=t.arrivals||0,r=i.r18&&t.dep_18||0,s=(t.dep_centre||0)+(i.r18?0:t.dep_18||0);return[["arr",ee.nw,e(Math.ceil(n/2))],["arr",ee.south,e(Math.floor(n/2))],["dep",ee.centre,e(s)],["dep",ee.r18,e(r)]]}var Pp="";function Zb(i,t,e){let n=Yb(i),r=JSON.stringify([i.od,i.r18,i.live,n.map(s=>s[2])]);if(!(!e&&r===Pp)){Pp=r;for(let s of Ei)s.dead===null&&(s.dead=t);for(let[s,o,a]of n){if(!o)continue;let c=Math.random();for(let l=0;l<a;l++)Ei.push(new fd(s,o,i.od,(c+l/a)%1,t))}}}var Po=1400,Xe={x0:-10500,x1:5500,y0:-9e3,y1:6e3,h0:40,h1:700},Sn={pos:new Float32Array(Po*3),vec:new _t(0,0),kt:0};for(let i=0;i<Po;i++)Sn.pos[i*3]=qn.lerp(Xe.x0,Xe.x1,Math.random()),Sn.pos[i*3+1]=qn.lerp(Xe.y0,Xe.y1,Math.random()),Sn.pos[i*3+2]=qn.lerp(Xe.h0,Xe.h1,Math.random()**1.6);var wo=En(new Float32Array(Po*6),new Float32Array(Po*8),4),jb=de(Ze(new Wn(wo,new _n({vertexColors:!0,..._s})),{blending:ui}),80);function md(i,t){let e=(i+180)*Math.PI/180;Sn.vec.set(Math.sin(e),Math.cos(e)),Sn.kt=t}function Jb(i){let t=Sn.kt*.514*45,e=60+Sn.kt*14,n=Sn.pos,r=wo.attributes.position.array,s=wo.attributes.color.array,o=Xe.x1-Xe.x0,a=Xe.y1-Xe.y0;for(let c=0;c<Po;c++){let l=n[c*3]+Sn.vec.x*t*i,d=n[c*3+1]+Sn.vec.y*t*i;l=Xe.x0+((l-Xe.x0)%o+o)%o,d=Xe.y0+((d-Xe.y0)%a+a)%a,n[c*3]=l,n[c*3+1]=d;let h=n[c*3+2],u=Math.min(1,(l-Xe.x0)/1500,(Xe.x1-l)/1500,(d-Xe.y0)/1500,(Xe.y1-d)/1500);r.set([l,h,-d,l-Sn.vec.x*e,h,-(d-Sn.vec.y*e)],c*6);let p=.22*Math.max(0,u)*Math.min(1,Sn.kt/4+.2);Kt==="light"?s.set([.32,.32,.3,p*2.2,.32,.32,.3,0],c*8):s.set([.8,.8,.77,p,.8,.8,.77,0],c*8)}wo.attributes.position.needsUpdate=!0,wo.attributes.color.needsUpdate=!0}var Ac=document.createElement("div");Ac.className="labels";at.appendChild(Ac);var xs=[];function Ri(i,t,e,n,r){let s=document.createElement("div");s.className="lbl "+(r||""),s.innerHTML=i,Ac.appendChild(s);let o={el:s,p:qt(t,e,n),cls:r};return xs.push(o),o}for(let[i,t,e]of ke.places||[])Ri(i,t,e,60,"place");var Kb='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';var fM=[Math.sin(69*Math.PI/180),Math.cos(69*Math.PI/180)];for(let[i,t,e]of[["Frankfurt city \u2197",7980,8640],["Taunus hills",-8130,16e3],["Mainz \xB7 Wiesbaden",-14500,-1500],["Darmstadt",5700,-15e3]])Ri(i,t,e,0,"landmark");for(let[i,t,e]of[["Fl\xF6rsheim",50.0136,8.428],["Raunheim",50.0098,8.4535],["Offenbach",50.0956,8.7761],["Mainz",49.9929,8.2473],["R\xFCsselsheim",49.9899,8.4225],["Kelsterbach",50.0613,8.53],["Frankfurt",50.1109,8.6821],["Neu-Isenburg",50.0531,8.6947],["Gro\xDF-Gerau",49.9214,8.485]]){let n=Ri(`<i></i><span>${i}</span>`,(e-8.5706)*71503,(t-50.0333)*111320,0,"town");n.name=i}var ad=Ri("",900,4300,0,"windind"),ef={};for(let i of Object.values(ee))ef[i.key]=[i.A,i.B].map((t,e)=>{let n=e===0?-1:1,r=i.key==="south"?-1:1,s=i.key==="r18"?[1,0]:[-i.uy*Math.sign(i.ux||1)*r,i.ux*Math.sign(i.ux||1)*r];if(i.key==="r18"){let c=i.A[1]>i.B[1]?i.A:i.B,l=Ri("",c[0]+260,c[1]+200,10,"rwy");return l.rw=i,l.end=qt(c[0],c[1],10),l.other=qt((i.A[1]>i.B[1]?i.B:i.A)[0],(i.A[1]>i.B[1]?i.B:i.A)[1],10),l}let o=Ri("",t[0]-i.ux*n*260+s[0]*190,t[1]-i.uy*n*260+s[1]*190,10,"rwy"),a=e===0?i.B:i.A;return o.rw=i,o.end=qt(t[0],t[1],10),o.other=qt(a[0],a[1],10),o});var ms=de(new Hn,46),cc=[],hc=[];for(let i=0;i<10;i++)cc.push(Ri(Kb,0,0,0,"parrow"));for(let i=0;i<2;i++)hc.push(Ri("",0,0,0,"ptag"));var gd="",xc=[],xd=[];function Qb(i,t){let e=[];for(let n of Object.values(ee)){if(n.key==="r18"&&!t)continue;let r=Jn(n,i),s=r.start,o=r.dir,a=[s[0]+o[0]*n.len,s[1]+o[1]*n.len];if(n.key==="nw"||n.key==="south"){let c=Nb(n,i);e.push({a:[s[0]-o[0]*c,s[1]-o[1]*c],b:s,kind:"arr",key:n.key,des:r.startIsA===n.A[0]<n.B[0]?n.d07:n.d25});let l=Jn(n,i===25?7:25),d=l.start;if(zo){let h=ac[`${n.key}/${i===25?7:25}`]??16e3;e.push({a:[d[0]-l.dir[0]*h,d[1]-l.dir[1]*h],b:d,kind:"ghost"})}}else{let c=Math.min(n.key==="r18"?1100:1500,oc[`${n.key}/${i}`]??1e9);e.push({a,b:[a[0]+o[0]*c,a[1]+o[1]*c],kind:"dep",r18:n.key==="r18"})}}return e}function nf(i,t){let e=So?.25:1,n=`${i}/${t}/${Kt}/${zo}/${So}`;if(n===gd)return;gd=n,xc=[];for(let l of ms.children)l.geometry.dispose(),l.material.dispose();ms.clear();let r=i===25?me.westLine:me.eastLine,s=Qb(i,t);Yp=s,xc=s.filter(l=>l.kind!=="ghost").map(l=>[l.a,l.b]);{let l=(d,h,u)=>{let p=u[0]-h[0],m=u[1]-h[1],x=Math.max(0,Math.min(1,((d[0]-h[0])*p+(d[1]-h[1])*m)/(p*p+m*m)));return Math.hypot(d[0]-h[0]-x*p,d[1]-h[1]-x*m)};for(let d of xs)if(d.cls==="town"){let h=[d.p.x,-d.p.z];d.el.classList.toggle("under",s.some(u=>{if(u.kind!=="arr")return!1;let p=i===25?14e3:9e3,m=Math.hypot(u.a[0]-u.b[0],u.a[1]-u.b[1])||1,x=(u.a[0]-u.b[0])/m,g=(u.a[1]-u.b[1])/m,f=h[0]-u.b[0],S=h[1]-u.b[1],y=f*x+S*g,b=Math.abs(f*g-S*x);return y>0&&y<p&&b<1500}))}pc=xs.filter(d=>d.cls==="town"&&d.el.classList.contains("under")).sort((d,h)=>d.p.x-h.p.x),pc.forEach((d,h)=>{d.el.querySelector("i").textContent=h+1,d.el.classList.add("num"),d.el.title=d.name});for(let d of xs)d.cls==="town"&&!pc.includes(d)&&(d.el.querySelector("i").textContent="",d.el.classList.remove("num"));try{cf()}catch{}}for(let l of Object.values(ee)){let d=l.key==="r18"&&!t,h=l.key==="nw"||l.key==="south";if(!d){let u=Ji([{p:[l.A,l.B],w:Kt==="light"?300:180}],2.5,r,(Kt==="light"?.2:.1)*e);u.renderOrder=46,ms.add(u);let p=Ji([{p:[l.A,l.B],w:Le.card?30:Kt==="light"?64:46}],3.5,r,So?.35:1);p.renderOrder=48,ms.add(p)}}for(let l of s){let d=Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]),h=[(l.b[0]-l.a[0])/d,(l.b[1]-l.a[1])/d],u=[];if(l.kind!=="dep")for(let x=0;x<d;x+=560)u.push({p:[[l.a[0]+h[0]*x,l.a[1]+h[1]*x],[l.a[0]+h[0]*Math.min(d,x+320),l.a[1]+h[1]*Math.min(d,x+520)]],w:65});else u.push({p:[l.a,l.b],w:90});let p=Kt==="light"?"#3a3a38":"#d8d7d2";if(l.kind==="arr"){for(let g=0;g<8;g++){let f=u.filter((y,b)=>Math.min(7,Math.floor(b/u.length*8/.2))===g);if(!f.length)continue;let S=Ji(f.map(y=>({...y,w:48})),2,r,.9*e*Math.min(1,(g+.3)/7));S.renderOrder=46,ms.add(S)}continue}let m=l.kind==="arr"?Ji(u.map(x=>({...x,w:48})),2,r,.9):l.kind==="ghost"?Ji(u.map(x=>({...x,w:80})),2,i===25?me.eastLine:me.westLine,.6*e):Ji(u.map(x=>({...x,w:40})),2,p,.9*e);m.renderOrder=46,ms.add(m)}let o=0;for(let l of s.filter(d=>d.kind!=="ghost"))for(let d of[l.kind==="arr"?.95:1]){let h=cc[o++];if(!h)break;let u=[l.a[0]+(l.b[0]-l.a[0])*d,l.a[1]+(l.b[1]-l.a[1])*d];h.p.copy(qt(u[0],u[1],0)),h.dir=qt(u[0]+(l.b[0]-l.a[0])*.05,u[1]+(l.b[1]-l.a[1])*.05,0),h.off=!1,h.el.style.color=l.kind==="arr"?r:"var(--label)",h.el.style.opacity=So?"0.3":""}for(;o<cc.length;o++)cc[o].off=!0;let a=s.filter(l=>l.kind==="arr").map(l=>[{a:[l.a[0]+(l.b[0]-l.a[0])*.12,l.a[1]+(l.b[1]-l.a[1])*.12],key:l.key},"a",`${l.des} landings`,l.key==="nw"?1100:-1100]).concat(s.filter(l=>l.kind==="dep").map(l=>[l.r18?{b:[l.b[0]+2400,l.b[1]+600]}:l,"b",l.r18?"18 take-offs":`${i===25?"25C":"07C"} take-offs`,l.r18?1:1200])),c=s.find(l=>l.kind==="ghost");for(;hc.length<a.length;)hc.push(Ri("",0,0,0,"ptag"));hc.forEach((l,d)=>{let h=a[d];if(!h){l.off=!0;return}let[u,p,m,x]=h;l.off=!1,l.el.textContent=m,l.p.copy(qt(u[p][0],u[p][1]+(x||700),0))})}var se=new L,Dn=new L,vs=[];function ty(){let i=at.getBoundingClientRect();vs=[...document.querySelectorAll(".hud .panel:not([hidden]),.hud .hero,.hud .attrib")].map(t=>{let e=t.getBoundingClientRect();return e.width?[e.left-i.left,e.top-i.top,e.right-i.left,e.bottom-i.top]:null}).filter(Boolean)}var sc=[];function dc(){sc=[];let i=[];dc.sp=null;{let n=at.clientWidth,r=at.clientHeight;for(let s of xs)if(s.cls==="town"){se.copy(s.p).project(ne);let o=(se.x+1)/2*n,a=(1-se.y)/2*r;sc.push([o-10,a-10,o+10,a+10])}}let t=at.clientWidth,e=at.clientHeight;for(let n of xs){if(n.off){n.el.style.display="none";continue}if(se.copy(n.p).project(ne),se.z>1||Math.abs(se.x)>1.1||Math.abs(se.y)>1.1){n.el.style.display="none";continue}let r=(se.x+1)/2*t,s=(1-se.y)/2*e;if(n.cls!=="rwy"&&n.cls!=="windind"){let o=n.lw||(n.lw=n.el.offsetWidth||80),a=n.cls==="town"?0:o/2,c=n.cls==="town"&&n.el.classList.contains("num"),l=c?r-12:n.cls==="town"?r-8:r-a,d=c?r+12:n.cls==="town"?r+8+o:r+a;if(l<4||d>t-4||s<8||s>e-8||vs.some(h=>d>h[0]-8&&l<h[2]+8&&s>h[1]-12&&s<h[3]+12)){n.el.style.display="none";continue}}if(n.cls==="town"&&n.el.classList.contains("num")){n.el.style.display="",n.el.style.transform=`translate(${r}px, ${s}px)`;continue}if(n.cls==="town"){let o=n.tw||(n.tw=n.el.querySelector("span").offsetWidth||60),a=(y,b)=>y[0]<b[2]&&b[0]<y[2]&&y[1]<b[3]&&b[1]<y[3],c=[r-10,s-10,r+10,s+10],l=sc.filter(y=>!(y[0]===c[0]&&y[1]===c[1])),d=dc.sp||(dc.sp=xc.map(([y,b])=>{let T=E=>(Dn.copy(qt(E[0],E[1],0)).project(ne),[(Dn.x+1)/2*t,(1-Dn.y)/2*e]);return[T(y),T(b)]})),h=(y,b,T)=>{let E=Math.max(T[0],Math.min(T[2],(y[0]+b[0])/2)),R=1e9;for(let C=0;C<=1.0001;C+=.02){let v=y[0]+(b[0]-y[0])*C,w=y[1]+(b[1]-y[1])*C;R=Math.min(R,Math.hypot(Math.max(T[0]-v,0,v-T[2]),Math.max(T[1]-w,0,w-T[3])))}return R},u=y=>[y[0]-4,y[1]-4,y[2]+4,y[3]+4],p=y=>d.every(([b,T])=>h(b,T,y)>=3)&&!l.some(b=>a(y,u(b))),m=[],x=18;for(let y of[14,18,24])m.push([y,-x/2,[r+y-2,s-x/2,r+y+o+2,s+x/2]]);for(let y of[14,18]){let b=y*.75;for(let[T,E]of[[y,-x/2],[-y-o,-x/2],[-o/2,-y-x],[-o/2,y],[b,-b-x],[-b-o,-b-x],[b,b],[-b-o,b]])m.push([T,E,[r+T-2,s+E,r+T+o+2,s+E+x]])}let g=y=>y[0]>=4&&y[2]<=t-4&&!vs.some(b=>y[2]>b[0]-4&&y[0]<b[2]+4&&y[3]>b[1]-4&&y[1]<b[3]+4)&&!i.some(b=>a(y,b)),f=m.find(([,,y])=>p(y)&&g(y))||m.find(([,,y])=>g(y)&&!l.some(b=>a(y,b)));if(!f){n.el.style.display="none";continue}let S=n.el.querySelector("span");S.style.left=`${f[0]}px`,S.style.top=`${f[1]}px`,sc.push(f[2]),n.el.style.display="",n.el.style.transform=`translate(${r}px, ${s}px)`;continue}if(n.cls==="rwy"){let o=(n.w||(n.w=n.el.offsetWidth||72))/2+8;if(r=Math.max(o,Math.min(t-o,r)),vs.some(d=>r>d[0]-30&&r<d[2]+30&&s>d[1]-12&&s<d[3]+12)){n.el.style.display="none";continue}if(!n.el.innerHTML){n.el.style.display="none";continue}let a=0,c=0;if(n.end){let d=B=>(Dn.copy(B).project(ne),[(Dn.x+1)/2*t,(1-Dn.y)/2*e]),h=Object.values(ee).map(B=>{let H=d(qt(B.A[0],B.A[1],0)),W=d(qt(B.B[0],B.B[1],0));return[H,W,170*Math.hypot(W[0]-H[0],W[1]-H[1])/B.len]}),u=(n.w||40)/2-4,p=(B,H)=>B>u+4&&B<t-u-4&&H>12&&H<e-12&&!i.some(W=>B-u-10<W[2]&&W[0]<B+u+10&&H-15<W[3]&&W[1]<H+15)&&!xd.some(([W,O])=>Math.abs(W-B)<u+5&&Math.abs(O-H)<15)&&h.every(([W,O,nt])=>{let tt=O[0]-W[0],rt=O[1]-W[1],It=Math.max(0,Math.min(1,((B-W[0])*tt+(H-W[1])*rt)/(tt*tt+rt*rt||1))),Wt=W[0]+tt*It,gt=W[1]+rt*It;return Math.max(Math.abs(Wt-B)-u,Math.abs(gt-H)-11,0)>=5+nt}),m=[],x=[d(n.end),d(n.other)],g=(B,H,W,O)=>{let nt=(tt,rt,It)=>(rt[0]-tt[0])*(It[1]-tt[1])-(rt[1]-tt[1])*(It[0]-tt[0]);return nt(W,O,B)*nt(W,O,H)<0&&nt(B,H,W)*nt(B,H,O)<0},f=h.filter(([B])=>!(Math.abs(B[0]-x[0][0])<.5&&Math.abs(B[1]-x[0][1])<.5)&&!(Math.abs(B[0]-x[1][0])<.5&&Math.abs(B[1]-x[1][1])<.5));if(n.rw&&n.rw.key==="r18"){let B=d(n.end),H=d(n.other),W=Math.hypot(B[0]-H[0],B[1]-H[1])||1,O=(B[0]-H[0])/W,nt=(B[1]-H[1])/W;for(let tt of[.08,.18,.3])for(let rt of[1,-1])for(let It of[18,24,30])m.push([B[0]-O*W*tt-nt*rt*It,B[1]-nt*W*tt+O*rt*It])}for(let[B,H]of[[d(n.end),d(n.other)],[d(n.other),d(n.end)]]){let W=Math.hypot(B[0]-H[0],B[1]-H[1])||1,O=(B[0]-H[0])/W,nt=(B[1]-H[1])/W;for(let tt=0;tt<=5;tt++){let rt=[B[0]+O*(u+14+tt*6),B[1]+nt*(u+14+tt*6)];f.some(([It,Wt])=>g(B,rt,It,Wt))||m.push(rt)}for(let tt of[.12,.25,.4])for(let rt of[1,-1])for(let It of[24,30,38])m.push([B[0]-O*W*tt-nt*rt*It,B[1]-nt*W*tt+O*rt*It])}let S=d(n.end),y=d(n.other),b=Math.hypot(S[0]-y[0],S[1]-y[1])||1,T=(y[0]-S[0])/b,E=(y[1]-S[1])/b,R=Object.values(ee).map(B=>d(qt((B.A[0]+B.B[0])/2,(B.A[1]+B.B[1])/2,0))).reduce((B,H,W,O)=>[B[0]+H[0]/O.length,B[1]+H[1]/O.length],[0,0]),C=[(S[0]+y[0])/2,(S[1]+y[1])/2],v=n.rw&&n.rw.key==="centre",w=-E*(C[0]-R[0])+T*(C[1]-R[1])>=0?1:-1,I=v?T>0?-1:1:w,k=-E*I,z=T*I,G=n.rw&&n.rw.key==="r18"?[S[0]+T*6-Math.abs(E)*30,S[1]+E*6]:[S[0]+T*24+k*18,S[1]+E*24+z*18];a=-T,c=-E;{let B=Object.values(ee).indexOf(n.rw),H=W=>{let O=-1,nt=1e9;return h.forEach(([tt,rt],It)=>{let Wt=rt[0]-tt[0],gt=rt[1]-tt[1],ft=Math.max(0,Math.min(1,((W[0]-tt[0])*Wt+(W[1]-tt[1])*gt)/(Wt*Wt+gt*gt||1))),X=Math.hypot(W[0]-tt[0]-Wt*ft,W[1]-tt[1]-gt*ft);X<nt&&(nt=X,O=It)}),O===B};if(t<640&&!p(G[0],G[1])||!H(G)){let W=m.find(O=>p(O[0],O[1])&&H(O))||m.find(O=>H(O));W&&(G=W,a=0,c=0)}}if(!G){n.el.style.display="none";continue}[r,s]=G}let l=[r-o+6,s-11,r+o-6,s+11];for(let d=0;d<4&&i.some(h=>l[0]<h[2]&&h[0]<l[2]&&l[1]<h[3]&&h[1]<l[3]);d++)r+=(a||0)*34,s+=(c||1)*34*(a?1:.65),l=[r-o+6,s-11,r+o-6,s+11];i.push(l)}n.el.style.display="",n.el.style.transform=`translate(${r}px, ${s}px) translate(-50%, -50%)`,n.dir&&(Dn.copy(n.dir).project(ne),n.el.style.setProperty("--a",`${Math.atan2(-(Dn.y-se.y)*e,(Dn.x-se.x)*t)*180/Math.PI}deg`))}}var qe=null,Lp=!1,ey=0,ge=!1,Ir=!Hp,Dp="",di=new Map,ny={arr:"arriving",dep:"departing",ground:"on ground",low:"low level",enroute:"en route"},rf=i=>i==="ground"?`<i style="background:transparent;box-shadow:inset 0 0 0 2px ${me.ground}"></i>`:i==="air"?`<i style="background:${me.air};border-radius:1px;transform:rotate(45deg) scale(.85)"></i>`:`<i style="background:${me[i]}"></i>`,ld=i=>i.phase==="arr"?"arr":i.phase==="dep"?"dep":i.phase==="ground"||i.on_ground?"ground":"air",ws=class{constructor(t){this.id=t.id,this.dead=null,this.born=Uo.elapsedTime,this.off=new L,this.obj=new Hn,this.mat=null,this.emat=null,this.key="",de(this.obj,72),this.tag=document.createElement("div"),this.tag.className="lbl ac",Ac.appendChild(this.tag),this.fix(t,!0)}style(){let t=ld(this.f)+Kt;if(t===this.key)return;this.key=t,this.obj.clear(),this.mat?.dispose(),this.emat?.dispose();let e=new Pt(me[ld(this.f)]),n=Kt==="light";this.mat=n?new pr({color:e,side:Ce,transparent:!0}):new We({color:e,side:Ce,transparent:!0,opacity:.55,blending:mc,depthWrite:!1}),this.emat=new _n({color:n?"#0b0b0b":e.clone().lerp(new Pt("#ffffff"),.35),transparent:!0,depthWrite:!1,opacity:n?.35:1,blending:n?ui:mc}),this.obj.add(new fe(Tc,this.mat),new Wn(yd,this.emat))}fix(t,e){let n=Math.min(60,Math.max(0,Date.now()/1e3-(qe?.opensky_time||Date.now()/1e3))),r=(t.track||0)*Math.PI/180,s=t.on_ground?Math.min(t.spd||0,15):t.spd||0;this.vel=[s*Math.sin(r),s*Math.cos(r),t.on_ground?0:t.vrate||0];let o=[t.x+this.vel[0]*n,t.y+this.vel[1]*n,Math.max(0,(t.on_ground?0:t.z)+this.vel[2]*n)];!e&&this.pos&&this.off.set(this.pos[0]-o[0],this.pos[1]-o[1],this.pos[2]-o[2]),this.pos=o,this.f=t,this.dead=null,this.hd=Math.PI/2-r,this.pitch=t.on_ground?0:Math.atan2(t.vrate||0,Math.max(30,s)),this.style();let a=(t.alt_ft??99999)<3e3||(t.dist_km??99)<20;this.tagOn=a,this.tag.innerHTML=`${rf(ld(t))}${t.cs||t.id}`,this.tagW=0}step(t,e){for(let c=0;c<3;c++)this.pos[c]+=this.vel[c]*t;this.pos[2]=Math.max(0,this.pos[2]),this.off.multiplyScalar(Math.exp(-t*2.5));let n=this.pos[0]+this.off.x,r=this.pos[1]+this.off.y,s=Math.max(0,this.pos[2]+this.off.z);this.cur={x:n,y:r,h:s,hd:this.hd,pitch:this.pitch,t:0},this.obj.position.copy(qt(n,r,s+2)),this.obj.rotation.set(0,this.hd,this.pitch,"YXZ"),this.obj.scale.setScalar((Le.card?5:3)*(this.f.on_ground?.8:1));let o=Math.min(1,(e-this.born)/1.2);this.dead!==null&&(o*=Math.max(0,1-(e-this.dead)/1.5)),this.alpha=o;let a=ge;this.obj.visible=a&&o>.01,this.mat.opacity=(Kt==="light"?1:.55)*o*(vc()?.3:1),this.emat.opacity=(Kt==="light"?.35:1)*o}drawTag(t,e){if(!(ge&&this.alpha>.05&&(this.tagOn||this===jn||this===Qi))){this.tag.style.display="none";return}if(se.copy(this.obj.position).project(ne),se.z>1||Math.abs(se.x)>1.05||Math.abs(se.y)>1.05){this.tag.style.display="none";return}let r=(se.x+1)/2*t,s=(1-se.y)/2*e-14;return this.tag.style.display="",this.tag.style.opacity=this.alpha*(vc()?.5:1),this.tag.style.transform=`translate(${r}px, ${s}px) translate(-50%, -100%)`,this.tagW||(this.tagW=this.tag.offsetWidth||60),{p:this,r:[r-this.tagW/2-2,s-20,r+this.tagW/2+2,s+1],pri:this===jn||this===Qi?0:1}}dispose(){Nn.remove(this.obj),this.mat?.dispose(),this.emat?.dispose(),this.tag.remove()}};function iy(i){if(qe=i,i.generated===Dp)return;Dp=i.generated;let t=Uo.elapsedTime,e=new Set;for(let n of i.flights||[]){if(!Number.isFinite(n.x)||!Number.isFinite(n.y))continue;e.add(n.id);let r=di.get(n.id);r?r.fix(n):di.set(n.id,new ws(n))}for(let[n,r]of di)!e.has(n)&&r.dead===null&&(r.dead=t);Ir&&!ge&&bc(!0),Ho()}async function kp(){try{let i=await fetch("live.json",{cache:"no-store"});if(!i.ok)throw new Error(i.status);let t=await i.json();Lp=!0,ey=Date.now(),iy(t)}catch{Lp=!1,Ho()}}location.protocol.startsWith("http")&&(kp(),setInterval(kp,5e3));function Lo(){return qe?(Date.now()-Date.parse(qe.generated))/1e3:1/0}var ry=900,sy=6*3600,vc=()=>Lo()>ry,Sr=()=>!!qe&&Lo()>sy,sf=i=>i>=172800?`${Math.round(i/86400)} days old`:i>=5400?`${Math.round(i/3600)} h old`:`${Math.round(i/60)} min old`;function bc(i){Ir=i,ge=i&&!!qe&&!Sr(),ge&&!Hp?(Q.ovOd="",Q.ovR18="",ti(),Kn(!1),nn(en(),!0),kn(en(),"jump")):Q.run&&nn(Q.hour,!0),Ho()}function Ao(){!Ir&&!ge||(Ir=!1,ge=!1,Q.ovOd="",Q.ovR18="",ti())}var Qi=null,jn=null,uc=null;function of(i,t){let e=Un.domElement.getBoundingClientRect(),n=e.width,r=e.height,s=null,o=26,a=ge?[...di.values()].filter(c=>c.dead===null&&c.obj.visible):Ei.filter(c=>c.dead===null&&c.cur&&c.obj.visible!==!1);for(let c of a){if(se.copy(c.obj.position).project(ne),se.z>1)continue;let l=Math.hypot((se.x+1)/2*n-(i-e.left),(1-se.y)/2*r-(t-e.top));l<o&&(o=l,s=c)}return s}function oy(i){return i?i instanceof ws?`<b>${i.f.cs||i.f.id}</b>${i.f.label?`<span>${i.f.label.replace(/^[^·]*·\s*/,"")}</span>`:`<span>${ny[i.f.phase]||""}</span>`}<small>Live ADS-B position \xB7 OpenSky</small>`:`<b>${i.label}</b><span>Expected traffic for ${Es.format(new Date(Q.run.hours[Q.hour].t))} under the forecast direction</span><small>Not a real aircraft</small>`:""}Un.domElement.addEventListener("pointermove",i=>{if(i.buttons)return;let t=of(i.clientX,i.clientY);t!==Qi&&(Qi=t,Un.domElement.style.cursor=t?"pointer":"")});Un.domElement.addEventListener("pointerleave",()=>{Qi=null});Un.domElement.addEventListener("pointerdown",i=>{uc=[i.clientX,i.clientY]});Un.domElement.addEventListener("pointerup",i=>{if(!uc||Math.hypot(i.clientX-uc[0],i.clientY-uc[1])>5)return;let t=of(i.clientX,i.clientY);t?(jn=t,ai=t,nr("follow")):jn&&(jn=null)});var Do=matchMedia("(prefers-reduced-motion: reduce)"),Er=new Set;function ko(i,t,e){return i.onUpdate=t,i.onRest=e,Do.matches&&i.jump(i.target),Er.add(i),i}function ay(i){for(let t of Er)t.step(i),t.onUpdate?.(t.x),t.resting&&(Er.delete(t),t.onRest?.())}var ci={play:'<svg viewBox="0 0 24 24"><path d="M7 4.6v14.8a1 1 0 0 0 1.52.85l12.1-7.4a1 1 0 0 0 0-1.7L8.52 3.75A1 1 0 0 0 7 4.6z"/></svg>',pause:'<svg viewBox="0 0 24 24"><rect x="5.5" y="4" width="4.6" height="16" rx="1.4"/><rect x="13.9" y="4" width="4.6" height="16" rx="1.4"/></svg>',plane:'<svg viewBox="0 0 24 24"><path d="M21.5 15.6v-1.9l-8.3-5.2V3.6a1.45 1.45 0 0 0-2.9 0v4.9L2 13.7v1.9l8.3-2.6v5.1l-2.1 1.6v1.5l3.6-1 3.6 1v-1.5l-2.1-1.6V13z"/></svg>',orbit:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M19.6 13.4A7.8 7.8 0 1 1 17.5 6.5"/><path d="M18.4 2.8v4.4H14"/></svg>',info:'<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 1.8a7.7 7.7 0 1 0 0 15.4 7.7 7.7 0 0 0 0-15.4zM12 10.3c.55 0 .95.4.95.95v5.4a.95.95 0 0 1-1.9 0v-5.4c0-.55.4-.95.95-.95zm0-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',warn:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',home:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="7.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M12 8.5l2 3.5h-4z" style="fill:currentColor;stroke:none"/></svg>',needle:'<svg viewBox="0 0 24 24"><g class="needle"><path d="M12 2.6l3.3 9.4H8.7z" fill="#FF453A"/><path d="M12 21.4L8.7 12h6.6z" opacity=".5"/></g></svg>',sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M17.1 6.9l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',moon:'<svg viewBox="0 0 24 24"><path d="M20.4 14.7A8.7 8.7 0 0 1 9.3 3.6a8.7 8.7 0 1 0 11.1 11.1z"/></svg>',expand:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></svg>',collapse:'<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M20 10h-6V4M4 14h6v6M14 10l6.5-6.5M10 14l-6.5 6.5"/></svg>',chevrons:'<svg viewBox="0 0 12 12"><path d="M3 4.6 6 1.9l3 2.7M3 7.4l3 2.7 3-2.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'},_e=window.FRA_COPY||{},Up=(window.FRA_STYLE||{}).hatch||{css:"repeating-linear-gradient(135deg,{c} 0 1.5px,transparent 1.5px 4.5px)",light:"rgba(255,255,255,.4)",dark:"rgba(0,0,0,.38)"},vd=i=>`<svg class="tarr" viewBox="0 0 34 24" aria-hidden="true"><path d="${((window.FRA_STYLE||{}).arrow||{e:"M3 12h27M22 4l8 8-8 8",w:"M31 12H4M12 4l-8 8 8 8"})[i]}"/></svg>`,Np=i=>Up.css.replace("{c}",i==="light"?Up[i]:"rgba(255,255,255,.35)"),Bo=document.createElement("div");Bo.className="hud";Bo.innerHTML=`
  <div class="scrim top"></div><div class="scrim bottom"></div>
  <header class="panel pbar"><a class="pbrand" href="index.html">${(window.FRA_STYLE||{}).logo||""}Runway Direction Forecast<span>Frankfurt Airport</span></a>
    <nav class="ptabs" aria-label="Pages"><a href="index.html">Dashboard</a><a aria-current="page">3D view</a></nav>
    <div class="prun"><i id="livedot"></i><span class="frs"></span><b id="issued-t" hidden></b></div>
    <button class="pthm" id="b-thm" title="Light or dark" aria-label="Switch between light and dark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button>
    <div class="ptz" role="group" aria-label="Time zone"><button data-v="Europe/Berlin" aria-pressed="true" id="tzl3">Local</button><button data-v="UTC" aria-pressed="false">UTC</button></div></header>
  <div class="rail">
  <header class="hero">
    <a class="dash" href="index.html">\u2190 Dashboard</a>
    <div class="eyebrow" id="eyebrow">${_e.now}</div>
    <div class="dir" id="dir" aria-live="polite"></div>
    <div class="outl" id="outl"></div><div class="disl" id="disl" hidden></div><div class="ground" id="ground"></div>
    <div class="dir-sub" id="dir-sub"></div>
    <div class="sumbar" id="sumbar"></div>
    <button class="more" id="b-more" aria-expanded="false">Wind, Runway 18 and details</button>
    <div class="hsec"><div class="risknext" id="dir-next"></div></div>
    <div class="hsec conditions" aria-label="Conditions">
    <div class="row wind">
      <div class="row-main"><div class="row-title" id="wind-t">${_e.wind}</div><div class="row-value"><span class="wcomp" id="wcomp" title="The arrow points the way the wind blows (north up)"><i></i></span><span id="wind-v"></span></div></div>
      <div class="row-sub" id="wind-why"></div>
      <div class="row-sub" id="wind-s"></div>
    </div>
    <div class="row">
      <div class="row-main"><div class="row-title">Runway 18 (take-offs south)</div><div class="row-value" id="r18-v"></div></div>
      <div class="row-sub" id="r18-s"></div>
    </div>
    <div class="row accrow"><div class="acc" id="acc"></div></div>
    <div class="row pdetrow"><details class="pdet"><summary>Details</summary><div class="probl">The direction switches at short notice when the wind turns, so airlines and ground crews can't plan for it.</div><div class="probl" id="pdetx"></div><div class="probl" id="pdetw"></div></details></div>
    <div class="row mapkey" id="mapkey" aria-label="Map key"></div>
    <div class="row how"><details><summary>How this works</summary>Our forecast blends two models trained on the directions actually flown at Frankfurt over the last 120 days; one of them runs 200 wind scenarios around the ECMWF and ICON forecasts. Calibrated out of sample and tested hour by hour on Jun to Oct 2026. The official forecast (INAA) is the operating-direction forecast published by the Umwelthaus. 07 and 25 are the runway headings (070\xB0 east, 250\xB0 west); Runway 18 West is used for take-offs to the south only. The live record since 1 Nov is only a few days long, too short to judge yet.<span class="howpg" id="how-pg"></span></details></div>
    </div>
    <div class="seg" id="seg-mode" role="radiogroup" aria-label="Show"><i class="thumb"></i>
      <button role="radio" data-v="live" title="Real aircraft right now (ADS-B)">Live</button><button role="radio" data-v="fc" title="Simulated traffic for the hour picked on the timeline">Forecast</button></div>
  </header>
  </div>
  <div class="attrib">${(window.FRA_STYLE||{}).footer||"Official forecast = INAA (Umwelthaus). Map data \xA9 OpenStreetMap contributors. Wind: ECMWF IFS, DWD ICON."}</div>
  <nav class="panel stack" aria-label="View">
    <div class="ib windchip" id="windchip" title="Forecast wind at the shown hour; the arrow points the way it blows"></div>
    <button class="ib" id="b-home">${ci.orbit}<span>Reset view</span></button>
    <button class="ib" id="b-follow" aria-pressed="false" hidden>${ci.plane}<span>Follow a landing aircraft</span></button>
    <button class="ib" id="b-fs">${ci.expand}<span>Full screen</span></button>
  </nav>
  <div class="panel caption" id="caption" aria-live="polite"></div>
  <div class="panel actip" id="actip" hidden></div>
  <div class="acring" id="acring" hidden></div>
  <div class="panel aclegend" id="aclegend"></div>
  <div class="panel rose" id="rose" aria-hidden="true"><b data-d="N">N</b><b data-d="E">E</b><b data-d="S">S</b><b data-d="W">W</b><i id="rose-n"></i></div>
  <footer class="panel dock">
    <div class="dhd"><div class="dhl"><b class="dtitle">Next 48 hours</b><div class="readout" aria-live="polite"><span class="ro" id="dro"></span><button class="rback" id="dback" style="visibility:hidden">Back to now</button></div><span class="dpk" id="dpk" title="Highest hourly chance outside the night ban (23:00 to 05:00, no flights)"></span></div>
      <label class="menu dmenu" title="Pick an older forecast to compare"><span>Replay an earlier run</span><select id="run" aria-label="Forecast run"></select>${ci.chevrons}</label></div>
    <button class="play" id="play" aria-label="Pause">${ci.pause}</button>
    <div class="rowlbl" aria-hidden="true"><span id="dir-l">Direction</span><span id="risk-l" hidden></span><span id="r18-l">Runway 18</span><span id="wind-l" hidden>${_e.headwind}</span></div>
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
`;at.appendChild(Bo);var N=i=>document.getElementById(i);{let i=((window.FRA_QUALITY||{}).od25||[]).filter(h=>h.acc!==null&&h.acc!==void 0),t=i.find(h=>h.lead===24),e=i.length&&i.every(h=>h.prog!==null&&h.prog!==void 0&&h.acc>h.prog),n=(window.FRA_QUALITY||{}).test_info,r=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],s=n&&new Date(n.start),o=n&&new Date(s.getTime()+n.days*864e5),a=n?`backtest ${r[s.getUTCMonth()]}\u2013\u2060${r[o.getUTCMonth()]}\xA0${o.getUTCFullYear()}`:"",c=h=>Math.round(h*100),l=h=>{let u=Math.min(...h),p=Math.max(...h);return u===p?`${u}`:`${u}\u2013${p}`},d=i.length&&i.every(h=>h.prog!==null&&h.prog!==void 0);N("acc").innerHTML=i.length?`<div class="pstat"><div class="kv"><span>Accuracy</span><b>${l(i.map(h=>c(h.acc)))}\u202F%${d?` <small>\xB7 official <em>${l(i.map(h=>c(h.prog)))}\u202F%</em></small>`:""}</b></div></div>`:"",N("pdetx")&&i.length&&d&&(N("pdetx").innerHTML=`${l(i.map(h=>Math.round((1-(1-h.acc)/(1-h.prog))*100)))}\u202F% fewer wrong hours than the official forecast, ${Math.min(...i.map(h=>h.lead))}\u2013${Math.max(...i.map(h=>h.lead))}\u202Fh ahead.`),N("acc").title=i.map(h=>`${h.lead} h ahead: ${Math.round(h.acc*100)}% right (official ${Math.round(h.prog*100)}%)`).join(`
`)}N("b-key").onclick=()=>{let i=!at.classList.contains("keyon");at.classList.toggle("keyon",i),N("b-key").setAttribute("aria-expanded",i),requestAnimationFrame(Pr)};N("b-more").onclick=()=>{let i=!at.classList.contains("sheet");at.classList.toggle("sheet",i),N("b-more").setAttribute("aria-expanded",i)};var Es,Ar,Ms,Rr;function af(){Es=new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),Ar=new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),Ms=new Intl.DateTimeFormat("en-GB",{timeZone:$e,hour:"2-digit",hourCycle:"h23"}),Rr=new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short",day:"numeric",month:"short"})}af();var cn=i=>i>=.995?">99\u202F%":i<.005?"<1\u202F%":`${Math.round(i*100)}\u202F%`,Q={run:null,hour:0,playing:!1,orbit:!1,follow:!1,cur:null,ovOd:"",ovR18:""};for(let i of gs.runs)N("run").insertAdjacentHTML("beforeend",`<option value="${i.source}">${Es.format(new Date(i.issue))}</option>`);function ly(i,t){let e=i.querySelector(".thumb"),n=[...i.querySelectorAll("button")],r=new Zn(0,{damping:1,response:.3}),s=new Zn(0,{damping:1,response:.3}),o=()=>{e.style.transform=`translateX(${r.x}px)`,e.style.width=`${s.x}px`},a=!0,c=l=>{let d=n.find(h=>h.dataset.v===l)||n[0];if(n.forEach(h=>h.setAttribute("aria-checked",h===d)),a||!i.offsetWidth){r.jump(d.offsetLeft),s.jump(d.offsetWidth),o(),a=!i.offsetWidth;return}ko(r.to(d.offsetLeft),o),ko(s.to(d.offsetWidth),o)};return n.forEach(l=>l.addEventListener("click",()=>{c(l.dataset.v),t(l.dataset.v)})),c}var cy=ly(N("seg-mode"),i=>{i==="live"?bc(!0):(Ao(),nn(Q.hour,!0)),ti()});function ti(){let i=N("seg-mode").querySelector("[data-v=live]");i.disabled=!qe||Sr(),N("seg-mode").hidden=!qe||Sr(),N("b-follow").hidden=!ge;let t=qe?Sr()?"Live (offline)":vc()?`Live (${sf(Lo())})`:"Live":"Live (no feed)";ge&&Sr()&&(ge=!1,nn(Q.hour,!0)),i.textContent!==t&&(i.textContent=t),cy(ge?"live":"fc")}var Fp=null,Mo="";function hy(i,t,e){if(i===Mo)return;let n=N("dir"),r=document.createElement("span"),s=Fp,o=26*e,a=/^(\d\d) (.*)$/.exec(i);if(a?(r.innerHTML='<b class="dbadge"></b>',r.firstChild.textContent=a[1],r.firstChild.style.setProperty("--dc",a[1]==="25"?me.west:me.east),r.firstChild.dataset.d=a[1],r.append(` ${a[2]}`)):r.textContent=i,n.appendChild(r),Fp=r,!Mo){Mo=i;return}Mo=i,ko(new Zn(0,{damping:1,response:.42}).to(1),c=>{r.style.opacity=c,r.style.transform=`translateX(${(c-1)*o}px)`}),s&&ko(new Zn(0,{damping:1,response:.32}).to(1),c=>{s.style.opacity=1-c,s.style.transform=`translateX(${c*o}px)`},()=>s.remove())}var Fe=new Zn(0,{damping:1,response:.4}),Ai=!1,Ye=()=>Q.run.hours.length;function lf(i){return(i+.5)*(N("track").clientWidth/Ye())}function tr(){let i=lf(Fe.x);N("knob").style.transform=`translateX(${i}px)`,N("knob").style.visibility=ge||!Ai&&Math.round(Fe.x)===en()?"hidden":"";{let a=Math.max(0,Math.min(Ye()-1,Math.round(Fe.x)));Object.assign(N("selcol").style,{left:`${a/Ye()*100}%`,width:`${100/Ye()}%`})}let t=Math.max(0,Math.min(Ye()-1,Math.round(Fe.x)));hf(t);let e=N("bubble"),n=e.offsetWidth,r=N("track").clientWidth;e.style.visibility=ge||!(Ai||Q.hour!==en())?"hidden":"";{let a=!Ro&&!Ai&&Q.hour!==en()&&!ge;e.classList.toggle("pin",a),N("knob").classList.toggle("pin",a)}{let a=e.style.visibility==="hidden"?-1:Q.hour;(N("risk")?N("risk").querySelectorAll("rect"):[]).forEach((l,d)=>l.classList.toggle("hov",d===a))}let s=0,o=Math.max(0,r-n);e.style.transform=`translateX(${Math.max(s,Math.min(o,i-n/2))}px)`;{let a=e.getBoundingClientRect(),c=e.style.visibility!=="hidden";N("ticks").querySelectorAll("span.day,span.hr,span.nowtick").forEach(f=>{f.style.translate="";let S=f.getBoundingClientRect(),y=N("knob")?N("knob").getBoundingClientRect().left+N("knob").getBoundingClientRect().width/2:-1e9,b=c&&(S.right>a.left-6&&S.left<a.right+6&&S.bottom>a.top-2&&S.top<a.bottom+2||f.classList.contains("hr")&&S.left-2<y&&S.right+2>y);if(b&&f.classList.contains("day")){let T=a.right+8-S.left,E=N("ticks").getBoundingClientRect();if(T>0&&T<=60*(parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1)&&S.right+T<=E.right){f.style.translate=`${T}px 0`,f.classList.remove("near");return}}f.classList.toggle("near",b)});let l=N("rpk"),d=l.getBoundingClientRect(),h=N("track").getBoundingClientRect().left+i;l.classList.toggle("off",c),N("rpkl")&&(N("rpkl").style.opacity=c?"0":"");let u=N("pgl"),p=u.getBoundingClientRect(),m=N("track").querySelector(".swchip")?.getBoundingClientRect(),x=(f=>f.left+f.width/2)(N("knob").getBoundingClientRect()),g=!u.hidden&&x>p.left-3&&x<p.right+3||m&&x>m.left-3&&x<m.right+3;N("knob").style.setProperty("top",g?"var(--dt)":"0px","important")}{let a=N("knob"),c=a.getBoundingClientRect(),l=c.left+c.width/2,d=at.clientWidth<640?1:parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1,u=[...document.querySelectorAll(".segs .dlab"),...at.clientWidth<640?document.querySelectorAll(".dock .rowlbl > span"):[]].filter(p=>!p.hidden).map(p=>p.getBoundingClientRect()).filter(p=>p.width&&l>p.left-3&&l<p.right+3).map(p=>[(p.top-c.top)/d-2,(p.bottom-c.top)/d+2]).sort((p,m)=>p[0]-m[0]);a.style.setProperty("--mk",u.length?`linear-gradient(${u.map(([p,m])=>`#000 ${p.toFixed(1)}px,transparent ${p.toFixed(1)}px,transparent ${m.toFixed(1)}px,#000 ${m.toFixed(1)}px`).join(",")})`:"none")}Ai&&t!==Q.hour&&nn(t)}var dy=(i,t)=>`Highest: ${cn(i)} at ${new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(t))}`,Pe=[],zo=!1,hi="West",Ro=!1,pc=[],So=!1;function cf(){let i=document.getElementById("mapkey");if(!i)return;!i.classList.contains("mapov")&&!i.classList.contains("inrail")&&(i.classList.add("mapov","panel"),Bo.appendChild(i));let t=typeof Q<"u"&&Q.cur?Q.cur.od:7,e=t===25?"east":"west";i.innerHTML=`<span><i class="plk" style="border-top-color:var(--${t===25?"westLine":"eastLine"})!important"></i>${_e.landings}</span><span><i class="tok"></i>${_e.takeoffs}</span>${zo?`<span><i class="plk gh" data-tok="${e}Line" style="border-top-color:var(--${e}Line)!important;opacity:.6"></i>${e==="west"?"West":"East"} approaches (if switched)</span>`:""}<span class="kbr"></span>`+pc.map((n,r)=>`<span class="tkey"><b>${r+1}</b>${n.name}</span>`).join("")}var en=()=>Q.run?Math.max(0,Math.min(Ye()-1,Math.floor((Date.now()-Date.parse(Q.run.hours[0].t))/36e5))):0,ln=()=>ge||Q.hour===en(),uy=i=>i===25?"25 West":"07 East";function py(){let i=N("pgmark");if(!Q.run)return;let t=N("pgkey");if(t&&(t.style.display=Pe.length?"":"none"),!Pe.length){i.hidden=!0;return}let e=Ye();i.hidden=!1,Object.assign(i.style,{left:`${Pe[0]/e*100}%`,width:`${(Pe[Pe.length-1]-Pe[0]+1)/e*100}%`})}function hf(i){let t=Q.run.hours[i],e=t.p25>=.5,n=ge||i===en(),r=new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short"}).format(new Date(t.t));N("bub-t").innerHTML=`<svg class="pinG" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z" fill="currentColor"/></svg>${r} ${mn(new Date(t.t))}`;let s=t.ws===void 0?null:Math.round(t.ws*Math.cos((t.wd-(t.od===25?249:69))*Math.PI/180)),o=Q.run.hours,a=!n&&te(t)?o.findIndex((c,l)=>l>i&&!te(c)):-1;if(!n&&te(t)){let c=innerWidth<480,l=a>=0?_e.night_next.replace("{od}",o[a].od===25?"25":"07").replace("{t}",mn(new Date(o[a].t))).replace(/^N/,"n"):"night ban";N("dro").innerHTML=`<b>${c?`${new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short"}).format(new Date(t.t))} ${mn(new Date(t.t))}`:Ar.format(new Date(t.t))}</b> \xB7 ${l}`}else N("dro").innerHTML=`<b>${n?`Now, ${mn(new Date(t.t))}`:Ar.format(new Date(t.t))}</b> \xB7 ${n?`${cn(e?t.p25:1-t.p25)} ${e?"West":"East"}`:`${cn(_c(t))} chance of ${hi}`}${s===null?"":` \xB7 ${s>=0?"headwind":"tailwind"} ${Math.abs(s)}\u202Fkt`}`;N("dback").style.visibility=n||Ro?"hidden":"visible"}function kn(i,t){if(t==="jump"){Fe.jump(i),tr();return}ko(Fe.to(i,t),tr)}function yc(){if(!Q.run)return;let i=Q.run.hours,t=Date.parse(i[0].t),e=(Date.now()-t)/(i.length*36e5),n=e>-.03&&e<1,r=Math.max(0,e)*100;N("nowline").style.display=n?"":"none",N("nowline").style.left=`${r}%`;let s=N("ticks").clientWidth||1,o=N("nowtick"),a=[];o&&(o.style.display=n?"":"none",o.style.left=`${r}%`);{let h=N("tick-start");h&&o&&n&&(h.style.left=`${r*s/100}px`)}let c=N("pgl");if(c)if(c.hidden=!Pe.length,Pe.length){let h=(1-Pe[0]/i.length)*(N("track").clientWidth||999)<120;c.style.right=h?"0":"auto",c.style.left=h?"auto":`${(Pe[0]/i.length*100).toFixed(2)}%`;let u=x=>+Ms.format(new Date(x)),p=x=>new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short"}).format(new Date(x));{let x=i[Pe[0]].t,g=new Date(Date.parse(i[Pe[Pe.length-1]].t)+36e5),f=I=>String(u(I)).padStart(2,"0"),S=`Official: switch ${p(x)} ${f(x)}:00\u2013${p(g)} ${f(g)}:00`,y=yc.cx||(yc.cx=document.createElement("canvas").getContext("2d"));y.font='500 11px "IBM Plex Sans", system-ui, sans-serif';let b=N("track").clientWidth||999,T=(1-Pe[0]/i.length)*b,E=(((window.FRA_STYLE||{}).pgtag||{}).long||"Official: {da} {ha}h \u2192 {db} {hb}h").replace("{da}",p(x)).replace("{ha}",f(x)).replace("{db}",p(g)).replace("{hb}",f(g)),R=innerWidth<480,C=I=>y.measureText(I).width+12,v=[E].find(I=>C(I)<=T),w=v||(R?E:"Official");c.dataset.l=E,c.dataset.m=(((window.FRA_STYLE||{}).pgtag||{}).mid||"Official").replace("{db}",p(g)).replace("{hb}",f(g)),requestAnimationFrame(bd),c.textContent=w,c.classList.toggle("ra",!v),c.style.right=v?"auto":"0",c.style.left=v?`${(Pe[0]/i.length*100).toFixed(2)}%`:"auto",c.style.setProperty("--tk",`${Math.max(0,Math.round(C(w)-T))}px`),c.title=`Official forecast (INAA): possible switch ${p(x)} ${f(x)}:00 to ${p(g)} ${f(g)}:00`}bd();let m=N("pgwash");m&&Object.assign(m.style,{display:"",left:`${(Pe[0]/i.length*100).toFixed(2)}%`,width:`${((Pe[Pe.length-1]-Pe[0]+1)/i.length*100).toFixed(2)}%`})}else{let h=N("pgwash");h&&(h.style.display="none")}for(let h of N("ticks").querySelectorAll("span.hr")){let u=+h.dataset.x*s/100,p=h.offsetWidth/2,m=h.previousElementSibling&&h.previousElementSibling.classList.contains("tk")?h.previousElementSibling:null;m&&(m.style.visibility=""),h.style.visibility=h.offsetWidth&&(a.some(([x,g])=>u+p>x&&u-p<g)||n&&u+p+6>r*s/100-(o?o.offsetWidth:30)&&u-p-6<r*s/100)?"hidden":"",m&&(m.style.visibility=h.style.visibility)}{let h=N("ticks").getBoundingClientRect();N("ticks").querySelectorAll("span.day").forEach(p=>{p.classList.remove("dend"),p.getBoundingClientRect().right>h.right+1&&p.classList.add("dend")});let u=N("pgl")&&!N("pgl").hidden?N("pgl").getBoundingClientRect():null;u&&N("ticks").querySelectorAll("span.hr").forEach(p=>{let m=p.getBoundingClientRect();m.right>u.left-4&&m.left<u.right+4&&m.bottom>u.top-2&&(p.style.visibility="hidden")})}let l=N("ticks").querySelector("span.day"),d=N("tick-start");d&&(d.style.visibility=l&&parseFloat(l.style.left)/100*s<90?"hidden":"")}var mn=i=>new Intl.DateTimeFormat("en-GB",{timeZone:$e,hour:"2-digit",minute:"2-digit"}).format(i);function Ho(){let i=document.getElementById("aclegend");if(!i)return;ti(),yc();let t=e=>rf(e);if(ge){let e=[...di.values()].filter(s=>s.dead===null).length,n=Lo()>60,r=mn(new Date(qe.generated));N("dir-sub").innerHTML=vc()?`<span class="late">${ci.warn}Aircraft positions are from ${r}, ${sf(Lo())}, shown faded</span>`:`<span class="${n?"dot-stale":"dot-live"}"></span>Live \xB7 ${e} aircraft \xB7 updated ${r}`,i.innerHTML=`<span>${t("arr")}Arriving</span><span>${t("dep")}Departing</span><span>${t("ground")}On the ground</span><span>${t("air")}En route</span>`}else{let e=Q.cur?.od??7,n=e===25?"var(--west)":"var(--east)",r=e===25?"var(--east)":"var(--west)";i.innerHTML=`<span><i class="pl" style="--c:${n}"></i>${e===25?"25":"07"} landings</span><span><i class="pl solid"></i>Take-offs</span><span><i class="ring"></i>Under a landing path now</span>`+(zo?`<span><i class="pl" style="--c:${r};opacity:.6"></i>Landings after a switch to ${e===25?"07":"25"}</span>`:"")}}function Kn(i){Q.playing=i,N("play").innerHTML=i?`${ci.pause}<span>Pause</span>`:`${ci.play}<span>Play 48\u202Fh</span>`,N("play").title="Step through the forecast hour by hour",fc=0}N("play").onclick=()=>{Ao(),Kn(!Q.playing)};{let i=N("track"),t=null,e=(o,a)=>{let c=i.getBoundingClientRect(),l=c.width/Ye(),d=(o.clientX-c.left-a.offset)/l-.5,h=0,u=Ye()-1;return d<h&&(d=h-id((h-d)*l,c.width)/l),d>u&&(d=u+id((d-u)*l,c.width)/l),d};i.addEventListener("pointerdown",o=>{Ao(),i.setPointerCapture(o.pointerId),Ro=!1,r=null,i.classList.add("dragging"),Kn(!1);let a=i.getBoundingClientRect(),c=o.clientX-a.left,l=lf(Fe.x),d=Math.abs(c-l)<16;t={offset:d?c-l:0,hist:[{x:o.clientX,t:o.timeStamp}]},t.v=d?Fe.x:e(o,t),Ai=!0,Er.delete(Fe),Fe.v=0,d||kn(e(o,t),{damping:1,response:.18})}),i.addEventListener("pointermove",o=>{if(t){for(t.hist.push({x:o.clientX,t:o.timeStamp});t.hist.length>2&&o.timeStamp-t.hist[0].t>100;)t.hist.shift();Er.delete(Fe),t.v=e(o,t),Fe.jump(t.v),tr()}});let n=o=>{if(!t)return;i.classList.remove("dragging");let a=t.hist,c=a[0],l=a[a.length-1],d=(l.t-c.t)/1e3,h=d>.008&&o.timeStamp-l.t<80?(l.x-c.x)/d:0,u=i.clientWidth/Ye(),p=Math.max(0,Math.min(Ye()-1,Math.round(t.v+Ap(h,.99)/u)));kn(p,{velocity:h/u,damping:Math.abs(h)>300?.8:1,response:.4}),t=null,Er.add(Fe),Fe.onRest=()=>{Ai=!1,nn(p),tr()}};i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("keydown",o=>{let a={ArrowLeft:-1,ArrowRight:1,ArrowDown:-1,ArrowUp:1,PageDown:-6,PageUp:6}[o.key],c=a!==void 0?Q.hour+a:o.key==="Home"?0:o.key==="End"?Ye()-1:null;c!==null&&(o.preventDefault(),Ao(),Kn(!1),c=Math.max(0,Math.min(Ye()-1,c)),nn(c),kn(c,{damping:1,response:.3}))});let r=null,s=()=>{if(!r)return;let o=r.from,a=Fe.x;r=null,Ro=!1,Ai=!1,qe?(bc(!0),Fe.jump(a),kn(0,{damping:1,response:.4})):(nn(o),kn(o,{damping:1,response:.4}))};addEventListener("pointermove",o=>{if(o.pointerType!=="mouse"||t||!Q.run)return;let a=i.getBoundingClientRect(),c=24;if(!(o.clientX>=a.left&&o.clientX<=a.right&&o.clientY>=a.top-c&&o.clientY<=a.bottom+c))return s();r||(r={from:Q.hour},Ao(),Kn(!1)),Ro=!0,Ai=!0,Er.delete(Fe),Fe.v=0,Fe.onRest=null,Fe.jump(Math.max(0,Math.min(Ye()-1,(o.clientX-a.left)/(a.width/Ye())-.5))),tr()}),document.documentElement.addEventListener("mouseleave",s),N("dback").onclick=()=>{Kn(!1),qe&&!Sr()?bc(!0):nn(en()),kn(en(),{damping:1,response:.4})}}addEventListener("keydown",i=>{i.code==="Space"&&!/SELECT|BUTTON/.test(document.activeElement?.tagName)&&(i.preventDefault(),Kn(!Q.playing))});var te=i=>{let t=+Ms.format(new Date(i.t));return t>=23||t<5},jt={rh:24,r18:!1,wind:!1};function fy(i){let t=(window.FRA_STYLE||{}).switch||{real:.2,real_h:80,calm_top:.2,calm_h:40,grid:.1},e=Math.min(1,Math.max(t.nice_min||.2,Math.ceil(i/(t.nice_step||.1)-1e-9)*(t.nice_step||.1)));return{top:e,h:Math.min(80,i>=t.real?t.real_h:t.calm_h_3d||50),grid:e/2}}function df(i){let t=p=>i[en()].od===25?1-p.p25:p.p25,e=Math.max(...i.map(t))>=.2,n=at.clientWidth<640;jt.sc=fy(Math.max(...i.map(t))),jt.rh=jt.sc.h,jt.r18=i.some(p=>!te(p)&&p.p18<.9),jt.wind=!1;let r=at.clientWidth<600,s=r?30:19,o=n?32:34,a=(()=>{let p=N("dkey"),m=N("track");return!p||!m?0:r?(p.parentElement!==m&&m.appendChild(p),p.classList.add("inbar"),(p.offsetHeight||36)+8):(p.classList.contains("inbar")&&(p.classList.remove("inbar"),document.querySelector(".dock").appendChild(p)),0)})(),c=s+o+a+(r?30:12),l=c+jt.rh+16,d=l+(jt.r18?18:4),h=44,u=jt.wind?d+h:jt.r18?l+10:c+jt.rh;jt.rt=c;for(let[p,m]of Object.entries({dt:s,dh:o,rt:c,rh:jt.rh,mt:l,wt:d,wh:h,th:u}))at.style.setProperty(`--${p}`,`${m}px`);N("wind-l").hidden=!jt.wind,N("windrow").style.display=jt.wind?"":"none"}function uf(){let i=N("windrow");if(!Q.run||!jt.wind){i.innerHTML="";return}let t=Q.run.hours,e=N("track").clientWidth,n=44,r=e/t.length;if(!e)return;let s=f=>f.ws*Math.cos((f.wd-(f.od===25?249:69))*Math.PI/180),o=t.filter(f=>f.ws!==void 0),a=o.map(s),c=Math.max(6,Math.ceil(Math.max(...a)+1)),l=Math.min(-4,Math.floor(Math.min(...a)-1)),d=4,h=n-2,u=f=>d+(c-Math.max(l,Math.min(c,f)))/(c-l)*(h-d),p=c-l>24?10:5,m=[];for(let f=Math.ceil(l/p)*p;f<=c;f+=p)(f>=0||f<=-p)&&m.push(f);let x="",g=!1;t.forEach((f,S)=>{if(f.ws===void 0){g=!1;return}x+=`${g?"L":"M"}${((S+.5)*r).toFixed(1)} ${u(s(f)).toFixed(1)}`,g=!0}),i.setAttribute("viewBox",`0 0 ${e} ${n}`),i.setAttribute("width",e),i.setAttribute("height",n),i.innerHTML=`<rect x="0" y="${u(-1)}" width="${e}" height="${Math.max(0,h-u(-1))}" class="zone"/>`+m.map(f=>`<line x1="0" x2="${e}" y1="${u(f)}" y2="${u(f)}" class="${f?"grid":"zero"}"/>`).join("")+`<line x1="0" x2="${e}" y1="${u(-1)}" y2="${u(-1)}" class="lim"/><path class="ln" d="${x}"/>`+m.map(f=>`<rect x="1" y="${u(f)-14}" width="${f?34:12}" height="13" rx="2" class="chip"/><text x="4" y="${u(f)-3}">${f?`${Math.abs(f)}\u202Fkt`:"0"}</text>`).join("")+`<text x="${e-4}" y="${Math.min(h-1,u(-1)+11)}" text-anchor="end" class="limt">limit</text>`}new ResizeObserver(()=>{Q.run&&(df(Q.run.hours),uf(),yc())}).observe(at);function pf(){let i=N("ticks"),t=i.querySelector(".end");if(!t)return;let e=t.getBoundingClientRect();if(!(!e.width||!i.getBoundingClientRect().width)){t.style.visibility="";for(let n of i.querySelectorAll("span.day,span.start")){let r=n.getBoundingClientRect();r.width&&n.style.visibility!=="hidden"&&r.right>e.left-8&&r.left<e.right&&(t.style.visibility="hidden")}}}new ResizeObserver(()=>pf()).observe(document.body);function Ts(i,t){Q.run=gs.runs.find(a=>a.source===i)||gs.runs[gs.runs.length-1],N("run").value=Q.run.source,qp();let e=Q.run.hours;N("track").setAttribute("aria-valuemax",e.length);let n=(a,c,l=3)=>`repeating-linear-gradient(135deg,${a} 0 ${l}px,${c} ${l}px ${2*l}px)`;requestAnimationFrame(()=>{let a=N("segs"),c=a.clientWidth,l=e,d=en(),h=(window.FRA_STYLE||{}).switch_tab_min||24;a.querySelector(".swtab")?.remove(),N("track").querySelector(".swchip")?.remove();let u=l.findIndex((E,R)=>R>d&&E.od!==l[d].od);if(u<0)return;let p=u;for(;p+1<l.length&&l[p+1].od===l[u].od;)p++;let m=c/l.length,x=u*m,g=(p+1-u)*m,f=l[u].od,S=l.slice(u,p+1).some(E=>Math.min(E.p25,1-E.p25)>=.1);g<h&&a.insertAdjacentHTML("beforeend",`<i class="swtab ${f===25?"w":"e"}${S?" lo":""}" style="left:${Math.min(x,c-h)}px;width:${h}px;background:${f===25?me.west:me.east}" title="The switch starts here; the forecast ends after this hour"></i>`),N("track").insertAdjacentHTML("beforeend",`<span class="swchip" style="--dc:${f===25?me.west:me.east}">to ${f===25?"25":"07"}</span>`);let y=N("track").querySelector(".swchip"),b=y.offsetWidth,T=Math.max(0,Math.min(x,c-b));y.style.left=`${T}px`,bd()}),N("segs").innerHTML=e.map(a=>{let c=a.p25>=.5,l=Math.min(a.p25,1-a.p25),d=c?me.west:me.east,h=te(a)?`${Np(Kt)} fixed,${d}`:d;return`<i class="${c?"w":"e"}${!te(a)&&l>=.1?" lo":""}" style="background:${h}" title="${te(a)?"Night ban, no scheduled flights":`${uy(c?25:7)}, ${cn(1-l)}`}"></i>`}).join("")+(()=>{let a="",c=0;for(;c<e.length;){let l=c,d=e[c].p25>=.5;for(;l+1<e.length&&e[l+1].p25>=.5===d;)l++;let h=c;for(;h<=l&&te(e[h]);)h++;let u=Math.max(0,(Date.now()-Date.parse(e[0].t))/(e.length*36e5)),p=Math.max(h/e.length,h<=u*e.length?u:0);l-h>=4&&(a+=`<span class="dlab ${d?"w":"e"}" style="left:calc(${(p*100).toFixed(2)}% + 8px)">${d?`${vd("w")}25 West`:`07 East${vd("e")}`}</span>`),c=l+1}return a})(),N("marks").innerHTML=e.map(a=>`<i class="${te(a)?"n":a.p18<.5?"x":a.p18<.9?"r":"o"}" title="Runway 18 ${te(a)?"night ban":a.p18<.5?"closed":a.p18<.9?`${cn(1-a.p18)} chance of a closure`:"open"}"></i>`).join(""),df(e);{hi=e[en()].od===25?"East":"West";let a=e.reduce((x,g,f)=>!te(g)&&(x<0||(hi==="East"?1-g.p25:g.p25)>(hi==="East"?1-e[x].p25:e[x].p25))?f:x,-1),c=_c,l=jt.sc.top,d=e.length*10,h=jt.rh,u=0,p=h-u,m=Math.max(u+.5,h-jt.sc.grid/l*p);N("risk").setAttribute("viewBox",`0 0 ${d} ${h}`),at.style.setProperty("--gf",(jt.sc.grid/l).toFixed(3)),N("rgl").style.top=`${jt.rt+m+1}px`,N("risk").innerHTML=`<line x1="0" y1="${m}" x2="${d}" y2="${m}" class="grid"/>`+(l>jt.sc.grid+1e-9?`<line x1="0" y1="0.5" x2="${d}" y2="0.5" class="grid half"/>`:"")+`<line x1="0" y1="${h-.5}" x2="${d}" y2="${h-.5}" class="base calm"/>`+e.map((x,g)=>{let f=c(x),S=f<(((window.FRA_STYLE||{}).switch||{}).min_bar??.01)?0:Math.max(2,Math.min(1,f/l)*p),y=10*e.length/(N("track").clientWidth||1e3),b=Math.min(10-2*y,14*y);return S?`<rect x="${(g*10+(10-b)/2).toFixed(2)}" y="${h-S}" width="${b.toFixed(2)}" height="${S}" fill="${te(x)?Kt==="light"?"#b9babc":"#4b4b4c":Kt==="light"?"#4b4d53":"#9aa0a6"}"${te(x)?' class="nt"':""} opacity="${te(x)||f>=.2||g===a?1:.85}"${g===a?` style="filter:brightness(${Kt==="light"?".75":"1.1"})"`:""}><title>${Ar.format(new Date(x.t))}: ${cn(f)} chance of ${hi} that hour</title></rect>`:`<rect x="${(g*10+(10-b)/2).toFixed(2)}" y="${h-1}" width="${b.toFixed(2)}" height="1" fill="${Kt==="light"?"#4b4d53":"#9aa0a6"}" opacity=".3"/>`}).join(""),N("rgl").textContent=`${Math.round(jt.sc.grid*100)}\u202F%`;{let x=N("rgl2");x&&(x.textContent=`${Math.round(l*100)}\u202F%`,x.hidden=!(l>jt.sc.grid+1e-9)||!!jt.sc.calm)}{let x=e.reduce((S,y,b)=>!te(y)&&(te(e[S])||c(y)>c(e[S]))?b:S,0),g=c(e[x]),f=N("rpk");if(g<.01||jt.sc.calm)f.textContent="",N("rpkl")&&(N("rpkl").style.display="none");else{let S=(x+.5)/e.length;f.textContent=dy(g,e[x].t),N("dpk")&&(N("dpk").textContent="");let y=Math.max(2,Math.min(1,g/l)*p);{let b=e.length,T=N("track").clientWidth||1,E=(x+.5)/b*T,R=f.offsetWidth||120,C=E-8-R<0,v=at.clientWidth<600?jt.rt+2:jt.rt-15;Object.assign(f.style,{left:`${(C?E:Math.min(E,T-6+8)).toFixed(1)}px`,right:"auto",top:`${v}px`,transform:C?"translateX(8px)":"translateX(calc(-100% - 8px))"});let w=N("rpkl");w||(w=document.createElement("i"),w.id="rpkl",w.className="rpkl",N("track").appendChild(w)),Object.assign(w.style,{left:`${E.toFixed(1)}px`,top:`${v+6}px`,height:`${Math.max(0,jt.rt+h-y-v-6-2)}px`,display:""})}requestAnimationFrame(()=>{let b=f.getBoundingClientRect();if((!f.textContent||[...document.querySelectorAll("#risk rect")].some(w=>{let I=w.getBoundingClientRect();return I.height>1.5&&I.right>b.left&&I.left<b.right&&I.bottom>b.top&&I.top<b.bottom})||[document.getElementById("dkey")].some(w=>{if(!w||!w.offsetHeight)return!1;let I=w.getBoundingClientRect();return I.bottom>b.top&&I.top<b.bottom}))&&f.textContent){f.textContent="",N("rpkl")&&(N("rpkl").style.display="none");return}let E=N("rpkl"),R=document.querySelectorAll("#risk rect")[x]?.getBoundingClientRect(),C=N("track").getBoundingClientRect(),v=parseFloat(document.documentElement.style.getPropertyValue("--hz"))||1;if(E&&R&&f.textContent&&!f.textContent.startsWith("peak ")){let w=(b.top+b.height/2-C.top)/(at.clientWidth<640?1:v);Object.assign(E.style,{top:`${w}px`,height:`${Math.max(0,(R.top-b.top-b.height/2)/(at.clientWidth<640?1:v)-3)}px`})}});{let b=en();if(!e.some((E,R)=>R>b&&E.od!==e[b].od)){let E=jt.rt+h-y-2;y+20<=h?(f.textContent=`peak ${cn(g)}`,Object.assign(f.style,{left:`${((x+.5)/e.length*(N("track").clientWidth||1)+4).toFixed(1)}px`,top:`${E-18}px`,transform:"translateX(-100%)"}),Object.assign(N("rpkl").style,{top:`${E}px`,height:"0px"})):(f.textContent="",N("rpkl").style.display="none")}}}}{let x=e.reduce((g,f,S)=>!te(f)&&(te(e[g])||c(f)>c(e[g]))?S:g,0);N("rgl").hidden=!!jt.sc.calm,N("risk-l").innerHTML=`${_e.switch} ${hi}`}N("risk").removeAttribute("hidden"),N("risk-l").hidden=!1,N("marks").hidden=!jt.r18,N("r18-l").hidden=!jt.r18}uf();{let a=l=>e.some(l),c=[];for(let l of[7,25])c.push([l===25?"west":"east",`<span><i style="background:var(--${l===25?"west":"east"})"></i>${l===25?"25 West":"07 East"}</span>`]);c.push(["official",`<span id="pgkey" style="display:none"><i class="pgk"></i>${_e.inaa_flag}</span>`]),a(te)&&c.push(["night",`<span><i class="nightk" style="background:${Np(Kt)},${me.east}"></i>${_e.night}</span>`]),jt.wind&&c.push(["limit",`<span><i class="limk"></i>${_e.limit}</span>`]),a(l=>!te(l)&&Math.min(l.p25,1-l.p25)>=.1)&&c.push(["faded",`<span><i class="lessk"></i>${_e.faded}</span>`]),a(l=>!te(l)&&l.p18<.5)&&c.push(["r18closed",'<span><i class="closedk"></i>Runway 18 closed</span>']),a(l=>!te(l)&&l.p18>=.5&&l.p18<.9)&&c.push(["r18risk",'<span><i class="riskk"></i>Runway 18, 10 to 50\u202F% closure chance</span>']);{let l=(window.FRA_STYLE||{}).legend_order||[];c.sort((d,h)=>l.indexOf(d[0])-l.indexOf(h[0]))}cf(),N("dkey").innerHTML=c.map(l=>l[1]).join("")}{let a=te,c="",l=-1;e.forEach((d,h)=>{if(a(d)&&l<0&&(l=h),l>=0&&(!a(d)||h===e.length-1)){let u=a(d)?h+1:h;c+=`<i style="left:${(l/e.length*100).toFixed(2)}%;width:${((u-l)/e.length*100).toFixed(2)}%"></i>`,l=-1}}),N("nights").innerHTML=c}let r=innerWidth>=(((window.FRA_STYLE||{}).axis||{}).short_below||520)&&(N("track").clientWidth||800)/e.length*6>=(((window.FRA_STYLE||{}).axis||{}).long_px||48),s=new Date(new Date(e[e.length-1].t).getTime()+36e5);N("ticks").innerHTML=e.map((a,c)=>{let l=new Date(a.t),d=Ms.format(l),h=(c/e.length*100).toFixed(2);return d==="00"?`<i class="dl" style="left:${h}%"></i><span class="day" style="left:${h}%">${Rr.format(l)}</span>`:["06","12","18"].includes(d)&&c<=e.length-4?`<i class="tk" style="left:${h}%"></i><span class="hr" data-x="${h}" style="left:${h}%">${r?`${d}:00`:d}</span>`:""}).join("")+`<span class="nowtick" id="nowtick" title="Current hour; forecast issued ${mn(new Date(Q.run.issue))}">Now</span>`,N("mids").innerHTML=e.map((a,c)=>c&&Ms.format(new Date(a.t))==="00"?`<i style="left:${(c/e.length*100).toFixed(2)}%"></i>`:"").join(""),requestAnimationFrame(pf);let o=t?Math.min(Q.hour,e.length-1):en();nn(o,!0),kn(o,"jump")}N("run").onchange=i=>{Ts(i.target.value)};function my(i){let t=Q.run.hours[i],e=Q.ovOd?+Q.ovOd:ge&&qe&&(qe.od_live||qe.od_now)||t.od,n=Q.ovR18?Q.ovR18==="1":t.p18>=.5;return{h:t,od:e,r18:n}}var _c=i=>hi==="East"?1-i.p25:i.p25;function bd(){let i=N("pgl"),t=N("track")?.querySelector(".swchip");if(!i||i.hidden||!t||!Pe.length)return;let e=N("track").clientWidth,n=t.offsetLeft-4,r=Pe[0]/Q.run.hours.length*e;if(!(i.offsetLeft+i.offsetWidth<=n)){for(let s of[i.dataset.l,i.dataset.m,"Official"])if(s&&(i.textContent=s,r+i.offsetWidth<=n)){Object.assign(i.style,{left:`${r}px`,right:"auto"}),i.classList.remove("ra");return}i.textContent="Official",Object.assign(i.style,{left:`${Math.max(0,n-i.offsetWidth)}px`,right:"auto"}),i.classList.remove("ra")}}function nn(i,t){Q.hour=Math.max(0,Math.min(Ye()-1,i));let{h:e,od:n,r18:r}=my(Q.hour),s=t||!Q.cur||Q.cur.od!==n||Q.cur.r18!==r;Q.cur={od:n,r18:r,t:e.t,live:ge},N("track").setAttribute("aria-valuenow",Q.hour+1),N("track").setAttribute("aria-valuetext",`${Ar.format(new Date(e.t))}, ${n===25?"westbound":"eastbound"}`);let o=n===25,a=o?me.west:me.east,c=o?e.p25:1-e.p25;hy(ln()?`${o?"25":"07"} Frankfurt flies ${o?"West":"East"}`:te(e)?(h=>{let u=Q.run.hours,p=h<0?o?"25":"07":u[h].p25>=.5?"25":"07";return`${p} ${h<0?"Night ban":_e.night_next.replace("{od}",p).replace("{t}",mn(new Date(u[h].t)))}`})(Q.run.hours.findIndex((h,u)=>u>Q.hour&&!te(h))):`${o?"25":"07"} Expected: ${o?"West":"East"}`,a,o?-1:1),N("dir").classList.toggle("fut",!ln()),N("dir").classList.toggle("nbh",!ln()&&te(e)),document.querySelector(".rail .hero")?.classList.toggle("fut",!ln()),N("eyebrow").textContent=ln()?window.FRA_SINCE?`${_e.now} \xB7 since ${Rr.format(new Date(window.FRA_SINCE))}, ${mn(new Date(window.FRA_SINCE))}`:_e.now:`Frankfurt \xB7 forecast for ${new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(e.t))}`,N("ground").textContent="",ge||(N("dir-sub").innerHTML=""),hf(Q.hour);{let h=Q.run.hours,u=ge?0:Q.hour,p=h.findIndex((C,v)=>v>u&&C.od!==e.od),m=C=>e.od===25?1-h[C].p25:h[C].p25,x=Math.max(...h.slice(u).map((C,v)=>m(u+v))),g=Ar.format(new Date(new Date(h[h.length-1].t).getTime()+36e5)),f=C=>C.pg===void 0?null:C.pg>=.75?25:C.pg<=.25?7:0,S=[];{let C=window.FRA_PGWIN,v=C&&Q.run&&Q.run.source===C.run;h.forEach((w,I)=>{if(I<(ge?0:Math.min(u,en())))return;let k=Date.parse(w.t),z=f(w);(v?C.win.some(G=>k>=Date.parse(G.start)&&k<Date.parse(G.end)):z&&z!==w.od||z===0&&Math.max(w.p25,1-w.p25)>=.9)&&S.push(I)})}Pe=S;let y=S.length?S.some(C=>f(h[C])===0)?"Possible switch":`Switch to ${f(h[S[0]])===25?"25":"07"}`:"",b=new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}),T=h.findIndex((C,v)=>v>=u&&m(v)===x),E=h.reduce((C,v,w)=>w>=u&&!te(v)&&(C<0||m(w)>m(C))?w:C,-1),R=E<0?x:m(E);{let C=W=>new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short"}).format(new Date(W)),v=W=>+Ms.format(new Date(W)),w=W=>{let O=v(W);return O>=23||O<5?"night":O<12?"morning":O<17?"afternoon":"evening"},I=x>=.2,k=W=>`${C(W)}\xA0${mn(new Date(W))}`,z=W=>W===25?"West":"East",G=ln(),B=_c(e);N("outl").innerHTML=!G&&te(e)?"No scheduled flights 23:00 to 05:00":G?p>=0?_e.out_expected.replace("{to}",z(e.od===25?7:25)).replace("{t}",k(h[p].t))+(h.length-1-p<=1&&_e.out_edge||""):I?_e.out_possible.replace("{p}",cn(x)).replace("{to}",z(e.od===25?7:25)).replace("{when}",(h.length-1-T<=2?_e.out_when_end:_e.out_when_mid).replace("{t}",k(h[T].t))):_e.out_none:`${cn(e.p25>=.5?e.p25:1-e.p25)} ${e.p25>=.5?"West":"East"} this hour`;let H=S.length&&p<0&&!I&&(G||S.includes(Q.hour));if(N("disl").hidden=!H,N("outl").title=Q.run.p_change===null||Q.run.p_change===void 0?"":`Calibrated chance of any switch in 48 h: ${cn(Q.run.p_change)}
The hourly bars are uncalibrated model probabilities.`,!S.length)N("disl").innerHTML="";else{let W=Wt=>{let gt=v(Wt);return gt>=23||gt<5?"night":gt<11?"morning":gt<14?"midday":gt<17?"afternoon":"evening"},O=h[S[0]].t,nt=new Date(Date.parse(h[S[S.length-1]].t)+36e5).toISOString(),tt=new Date(Date.parse(nt)-36e5),It=C(tt)===C(O)||Date.parse(nt)-Date.parse(O)<=18*36e5&&v(tt)<5?`${C(O)}\xA0${W(O)}`:`from ${C(O)}\xA0${W(O)} to ${C(nt)}\xA0${W(nt)}`;N("disl").innerHTML=H?(_e.disagree||"{of} warns of a switch {when}; we don't expect one.").replace("{of}",`<span class="ofn">${_e.of_name||"The official forecast"}</span>`).replace("{when}",It):""}}{let C=_c(e),v=ln()?x:C,w=jt.sc?jt.sc.top:.2,I=`<i class="swb"><i style="width:${(Math.min(1,v/w)*100).toFixed(0)}%"></i></i>`;N("dir-next").innerHTML=ln()?`<div class="kv" title="The operating hour (outside the 23:00 to 05:00 night ban) with the highest chance of ${hi}, to ${g}. The 48 h figure above is calibrated on past switches from the highest hourly chance, so it can be lower."><span>${_e.switch} ${hi}</span><b>${R<.01?"Under 1\u202F% every hour":`peak ${cn(R)} \xB7 ${b.format(new Date(h[E<0?T:E].t))}`}</b></div>`:`<div class="kv"><span>${_e.switch} ${hi}</span><b>${cn(C)} at ${mn(new Date(e.t))}</b></div>`}{let C=((window.FRA_QUALITY||{}).od25||[]).filter(k=>k.acc!==null&&k.acc!==void 0),v=k=>Math.round(k*100),w=k=>Math.min(...k)===Math.max(...k)?`${Math.min(...k)}`:`${Math.min(...k)}\u2013${Math.max(...k)}`,I=window.FRA_SINCE?`since ${Rr.format(new Date(window.FRA_SINCE))}`:"";N("sumbar").innerHTML=`<div class="sb0">Frankfurt${ln()?I?` \xB7 <span class="nw">${I}</span>`:"":` \xB7 <span class="nw">forecast for ${new Intl.DateTimeFormat("en-GB",{timeZone:$e,weekday:"short"}).format(new Date(e.t))} ${mn(new Date(e.t))}</span>`}</div><div class="sb1${!ln()&&te(e)?" nbh":""}"><b class="dbadge" style="--dc:${e.od===25?me.west:me.east}" data-d="${e.od===25?"25":"07"}">${e.od===25?"25":"07"}</b><span class="nw">${ln()?`flies ${e.od===25?"West":"East"}\xA0${vd(e.od===25?"w":"e")}`:(/^\d\d (.*)$/.exec(Mo||"")||[0,""])[1]}</span></div><div class="sb2">${N("outl").innerHTML}</div><details class="sbx"${at.classList.contains("sbopen")?" open":""}><summary>Details</summary>`+(C.length?`<div class="sb3">Right <b>${w(C.map(k=>v(k.acc)))}\u202F%</b> of hours \xB7 official <em>${w(C.map(k=>v(k.prog)))}\u202F%</em></div>`:"")+`<div class="sb4">The direction switches at short notice when the wind turns, so airlines and ground crews can't plan for it.</div>${N("disl").hidden?"":`<div class="sb5">${N("disl").innerHTML}</div>`}</details>`;{let k=N("sumbar").querySelector(".sbx>summary"),z=N("sumbar").querySelector(".sb1");k&&z&&(k.style.top=`${z.offsetTop+(z.offsetHeight-(k.offsetHeight||24))/2}px`)}{let k=N("sumbar").querySelector(".sbx");k&&(k.ontoggle=()=>{at.classList.toggle("sbopen",k.open),requestAnimationFrame(Pr)})}}N("how-pg").textContent=S.length?` The official forecast flags ${Ar.format(new Date(h[S[0]].t))} to ${mn(new Date(new Date(h[S[S.length-1]].t).getTime()+36e5))} as a possible switch (orange bracket on the timeline).`:h.some(C=>C.pg!==void 0)?" The official forecast agrees with ours for this run.":"",zo=p>=0||x>=.2,py()}{let h=Q.run.hours.slice(ge?0:Q.hour),u=Math.max(...h.map(p=>1-p.p18));N("r18-v").innerHTML=!ln()&&te(e)?'<span class="badge nb">Night ban</span>':`<span class="badge${r?"":" closed"}">${r?`${(window.FRA_STYLE||{}).check||""}In use`:"Closed"}</span>`,N("r18-s").textContent="",N("r18-v").title=r?`Closure chance to the end of the forecast: at most ${cn(u)} in any hour`:"Its take-offs use the Centre runway"}if(e.ws!==void 0){md(e.wd,e.ws);let h=Math.round(e.ws),u=E=>-e.ws*Math.cos((e.wd-E)*Math.PI/180),p=Math.round(e.wg),m=E=>-p*Math.cos((e.wd-E)*Math.PI/180),x=E=>`${E>=0?"tailwind":"headwind"} ${Math.round(Math.abs(E))}\u202Fkt`,g=(E,R=null)=>{let C=R===null?null:m(R);return x(E)+(C!==null&&p>h+2&&Math.round(Math.abs(C))!==Math.round(Math.abs(E))?`, gusts ${Math.round(Math.abs(C))}`:"")},f=["north","northeast","east","southeast","south","southwest","west","northwest"][Math.round(e.wd/45)%8],S=["N","NE","E","SE","S","SW","W","NW"][Math.round(e.wd/45)%8];{let E=Math.round(u(Zi[n]));N("wind-v").innerHTML=`${Math.abs(E)}\u202Fkt ${E>0?"tailwind":"headwind"} on ${o?25:"07"}`}ad.el.innerHTML=`<svg viewBox="0 0 24 24" style="--a:${e.wd+180}deg"><path d="M12 21V4M6 10l6-6 6 6"/></svg><span><b>${h}\u202Fkt ${["N","NE","E","SE","S","SW","W","NW"][Math.round(e.wd/45)%8]}</b></span>`,N("windchip").innerHTML=ad.el.innerHTML,dd=e.wd,N("wcomp").innerHTML=`<svg viewBox="0 0 24 24" style="--a:${e.wd+180}deg"><path d="M12 21V4M6 10l6-6 6 6"/></svg>`;let y=Math.round(-h*Math.cos((e.wd-Zi[25])*Math.PI/180)),b=Math.round(u(Zi[n]));N("wind-why").textContent=`${S} ${h}\u202Fkt \xB7 ${String(Math.round(e.wd)).padStart(3,"0")}\xB0`,N("wind-why").title="The official rule switches direction when the tailwind stays above 1 kt for 30 minutes, or at once from 10 kt";let T=Math.round(Math.abs(e.ws*Math.sin((e.wd-Zi[n])*Math.PI/180)));N("wind-s").innerHTML="";{let E=N("pdetw");E&&(E.innerHTML=`<b>Wind per runway</b><br>${String(e.wd).padStart(3,"0")}\xB0, gusts ${Math.round(e.wg)}\u202Fkt<br>${o?25:"07"}: ${g(u(Zi[n]),Zi[n])}, crosswind ${T}\u202Fkt<br>18: ${g(u(Zi[18]),Zi[18])}`)}}else md(0,0),ad.el.innerHTML="",N("windchip").innerHTML="",N("wind-v").textContent="n/a",N("wind-s").textContent="No wind forecast for this run";for(let h of Object.values(ee)){let u=Jn(h,n),p=h.mat.uniforms,m=h.key==="r18"&&!r;h.target={active:m?0:1,closed:m?1:0},p.uDir.value=u.startIsA?1:-1,p.uCol.value.set(a);let x=h.key==="nw"||h.key==="south",[g,f]=ef[h.key],S=u.startIsA?g:f,y=u.startIsA?f:g,b=C=>h.key==="r18"?"18":C[0]<(C===h.A?h.B:h.A)[0]?h.d07:h.d25,T=u.startIsA?h.A:h.B,E=u.startIsA?h.B:h.A,R=m?'<em class="chip closed">Closed</em>':"";S.el.innerHTML=`<b>${b(T)}</b>${R}`,S.w=0,y.el.innerHTML=""}let l=new ce,d=new ce(-1,-1,-1,-1);for(let h of Object.values(ee))l.setComponent(h.i,h.key==="r18"&&!r?0:1),(h.key==="nw"||h.key==="south")&&d.setComponent(h.i,Jn(h,n).startIsA?0:1);Ki.uniforms.uAct.value.copy(l),Ki.uniforms.uArr.value.copy(d),!Le.card&&!Ti&&n!==li&&(li=n,Kp(),Mc||Rc()),Zb(Q.cur,Uo.elapsedTime,s&&t),So=!ln()&&te(e),nf(n,r),Ho();{let h=u=>`<i style="background:${u}"></i>`;N("caption").innerHTML=`<span><b>${Es.format(new Date(e.t))}</b><small>+${Q.hour+1}\u202Fh</small></span><span>${h(a)}<b>${o?"25":"07"} ${o?"Westbound":"Eastbound"}</b><small>${cn(c)}</small></span><span>${h(r?"var(--label3)":me.closed)}<b>Runway 18 ${r?"usable":"closed"}</b><small>${cn(r?e.p18:1-e.p18)}</small></span>`}}var bs=new yo({damping:1,response:1.2}),ys=new yo({damping:1,response:1.2}),Cr="free";function nr(i){i!=="free"&&Cr==="free"&&(bs.jump(ne.position),ys.jump(hn.target)),Cr=i,Q.follow=i==="follow",N("b-follow").setAttribute("aria-pressed",Q.follow),hn.autoRotate=Q.orbit&&i==="free"}function Rc(){nr("fly");let i=Co();bs.to(i.pos,{damping:1,response:1.2}),ys.to(i.target,{damping:1,response:1.2}),Do.matches&&(bs.jump(i.pos),ys.jump(i.target))}N("b-home").onclick=Rc;N("b-follow").onclick=()=>Q.follow?Rc():nr("follow");var gy=0;hn.addEventListener("start",()=>{Mc=!0,clearTimeout(gy),Q.orbit=!1,nr("free")});Do.addEventListener("change",()=>{Do.matches&&(Q.orbit=!1,nr(Cr))});function Vo(i,t){Kt=i,me=Vp[i],hd=Object.fromEntries(Object.entries(me).map(([e,n])=>[e,new Pt(n)])),at.classList.toggle("light",i==="light");for(let[e,n]of Object.entries(me))at.style.setProperty("--"+e,n);{let e=(window.FRA_STYLE||{}).tag_bg;e&&(at.style.setProperty("--tagbg",i==="light"?e.light:e.dark),at.style.setProperty("--tagink",i==="light"?e.ink_light:e.ink_dark))}at.style.setProperty("--bg",Tr[i].bg),Nn.background.set(Tr[i].bg),Nn.fog.color.set(Tr[i].bg),tf();for(let e of Object.values(ee))e.mat.uniforms.uLight.value=i==="light"?1:0;if(document.querySelectorAll(".dir .dbadge").forEach(e=>e.style.setProperty("--dc",e.textContent==="25"?me.west:me.east)),Ki.uniforms.uLight.value=i==="light"?1:0,Ki.blending=i==="light"?ui:mc,Ki.needsUpdate=!0,$p(),typeof pd=="function"&&pd(),document.documentElement.dataset.theme!==i&&(document.documentElement.dataset.theme=i),t)try{localStorage.setItem("fra-theme",i)}catch{}t&&window.parent!==window&&window.parent.postMessage({fra:"theme-changed",value:i},"*"),Q.run&&Ts(Q.run.source,!0)}new MutationObserver(()=>{let i=document.documentElement.dataset.theme;(i==="dark"||i==="light")&&i!==Kt&&Vo(i)}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]});function ff(i){Le.card=i,document.body.classList.toggle("card",i),document.body.classList.toggle("embed",No&&i),$p(),Pr(),requestAnimationFrame(()=>{ti(),tr()}),Rc()}function mf(){return document.fullscreenElement||document.webkitFullscreenElement}var _d=!1;N("b-fs").onclick=async()=>{if(_d){window.parent.postMessage({fra:"exit-fs"},"*");return}if(mf()){(document.exitFullscreen||document.webkitExitFullscreen).call(document);return}let i=at.requestFullscreen||at.webkitRequestFullscreen;try{if(!i)throw new Error("no fullscreen");await i.call(at)}catch{(location.protocol==="file:"||location.protocol.startsWith("http"))&&window.open(`${location.pathname}?run=${encodeURIComponent(Q.run.source)}&theme=${Kt}${Ib?"&palette=lh":""}`,"_blank")}};function wd(){let i=!!mf()||_d;N("b-fs").innerHTML=`${i?ci.collapse:ci.expand}<span>${i?"Exit full screen":"Full screen"}</span>`,wc?ff(!i):document.body.classList.toggle("embed",No&&!i)}document.addEventListener("fullscreenchange",wd);document.addEventListener("webkitfullscreenchange",wd);var Uo=new gr,Op=0,fc=0,ai=null;Vo(Kt);Ts(er.get("run")||gs.default);ti();Kn(Q.playing);nr("free");Pr();requestAnimationFrame(()=>{ti(),tr()});var xy=3.2,vy=[...document.querySelectorAll("#rose b")],by=N("rose-n"),Bp=new L,zp=new L;Un.setAnimationLoop(()=>{let i=Math.min(Uo.getDelta(),.1),t=Uo.elapsedTime;if(Op+=i*Db,Q.playing&&!Ai&&(fc+=i,fc>xy)){fc=0;let e=(Q.hour+1)%Ye();nn(e),kn(e,e===0?"jump":{damping:1,response:.45})}ay(i);for(let e of Object.values(ee)){let n=e.mat.uniforms,r=1-Math.exp(-i*3);n.uActive.value+=((e.target?.active??0)-n.uActive.value)*r,n.uClosed.value+=((e.target?.closed??0)-n.uClosed.value)*r,n.uTime.value=t}Ki.uniforms.uTime.value=t,Ki.uniforms.uScale.value=at.clientHeight/1.6,Ei=Ei.filter(e=>e.dead!==null&&t-e.dead>1.6?(e.dispose(),!1):(e.update(Op,t),!0));for(let[e,n]of di){if(n.dead!==null&&t-n.dead>1.6){jn===n&&(jn=null),Qi===n&&(Qi=null),n.dispose(),di.delete(e);continue}n.step(i,t)}for(let e of Ei)e.obj.visible=!1;for(let e of Ei)e.trail.visible=!1,e.line.visible=!1;if(jb.visible=!1,Do.matches||Jb(i),Cr==="follow"){if(jn&&jn.dead===null)ai=jn;else if(!ai||ai.dead!==null||ai instanceof ws||ai.cur.t>re.tTd+re.tRoll*.6){let e=Ei.filter(n=>n.dead===null&&n.kind==="arr"&&n.cur&&n.cur.t<re.tTd*.8);ai=e.filter(n=>n.cur.t>re.tTd*.35).sort((n,r)=>n.cur.t-r.cur.t)[0]||e.sort((n,r)=>r.cur.t-n.cur.t)[0]||ai}if(ai?.cur){let e=ai.cur,n=Math.cos(e.hd),r=Math.sin(e.hd);Bp.copy(qt(e.x-n*900+r*260,e.y-r*900-n*260,e.h+260)),zp.copy(qt(e.x+n*1500,e.y+r*1500,Math.max(0,e.h-150))),bs.to(Bp,{damping:1,response:.9}),ys.to(zp,{damping:1,response:.9})}}Cr!=="free"&&(bs.step(i,ne.position),ys.step(i,hn.target),Cr==="fly"&&bs.resting&&ys.resting&&nr("free")),hn.update(i),N("rose").style.opacity=Math.abs(hn.getAzimuthalAngle())>.09?1:0;{let e=hn.target,n=at.clientWidth,r=at.clientHeight;se.copy(e).project(ne);let s=se.x*n,o=se.y*r;for(let a of vy){let[c,l]={N:[0,1],E:[1,0],S:[0,-1],W:[-1,0]}[a.dataset.d];Dn.set(e.x+c*2e3,0,e.z-l*2e3).project(ne);let d=Math.atan2(Dn.y*r-o,Dn.x*n-s);a.style.transform=`translate(${Math.cos(d)*22}px, ${-Math.sin(d)*22}px)`,a.dataset.d==="N"&&(by.style.transform=`rotate(${90-d*180/Math.PI}deg)`)}}Fo.render(),ty();{let e=at.clientWidth,n=at.clientHeight;xd=[];for(let[r,s]of xc)for(let o=0;o<=160;o++)se.copy(qt(r[0]+(s[0]-r[0])*o/160,r[1]+(s[1]-r[1])*o/160,0)).project(ne),xd.push([(se.x+1)/2*e,(1-se.y)/2*n])}dc();{let e=at.clientWidth,n=at.clientHeight;{let o=vs.slice(),a=[];for(let l of di.values()){let d=l.drawTag(e,n);d&&a.push(d)}a.sort((l,d)=>l.pri-d.pri||l.p.pos[2]-d.p.pos[2]);let c=(l,d)=>l[0]<d[2]&&d[0]<l[2]&&l[1]<d[3]&&d[1]<l[3];for(let l of a){if(l.pri&&o.some(d=>c(l.r,d))){l.p.tag.style.display="none";continue}o.push(l.r)}}let r=Qi||jn,s=N("actip");if(r&&r.dead===null&&ge===r instanceof ws){se.copy(r.obj.position).project(ne),s.hidden=!1;let o=oy(r);s.dataset.k!==o&&(s.innerHTML=o,s.dataset.k=o);let a=(se.x+1)/2*e,c=(1-se.y)/2*n,l=s.offsetWidth,d=s.offsetHeight,h=x=>vs.some(g=>x[0]<g[2]&&g[0]<x[2]&&x[1]<g[3]&&g[1]<x[3]),u=[[a+18,c-d-18],[a-l-18,c-d-18],[a+18,c+18],[a-l-18,c+18]].map(([x,g])=>[Math.min(e-l-8,Math.max(8,x)),Math.min(n-d-8,Math.max(8,g))]),[p,m]=u.find(([x,g])=>!h([x,g,x+l,g+d]))||u[0];s.style.transform=`translate(${p}px, ${m}px)`,N("acring").hidden=!1,N("acring").style.transform=`translate(${a}px, ${c}px)`}else s.hidden=!0,N("acring").hidden=!0;Math.floor(t)!==Math.floor(t-i)&&Ho()}});new ResizeObserver(()=>{ti(),tr()}).observe(at);addEventListener("message",i=>{let t=i.data;if(!(!t||typeof t!="object"||!t.fra)){if(t.fra==="hour"&&(Kn(!1),nn(t.i),kn(Q.hour,{damping:1,response:.3})),t.fra==="run"&&Ts(t.name),t.fra==="view"){Kn(!1),Ir=!!t.live,ge=Ir&&!!qe&&!Sr(),Q.ovOd=t.od?String(t.od):"",Q.ovR18=t.r18===void 0||t.r18===null?"":t.r18?"1":"0";let e=en();if(t.t&&Q.run){let n=Date.parse(t.t),r=Q.run.hours;e=r.reduce((s,o,a)=>Math.abs(Date.parse(o.t)-n)<Math.abs(Date.parse(r[s].t)-n)?a:s,0)}nn(e,!0),kn(e,"jump"),ti()}if(t.fra==="override"&&(Q.ovOd=t.od?String(t.od):"",Q.ovR18=t.r18===void 0||t.r18===null?"":t.r18?"1":"0",ti(),nn(Q.hour)),t.fra==="pad"){for(let e of["top","right","bottom","left"])cd[e]=+t[e]||0,at.style.setProperty(`--pad-${e[0]}`,`${cd[e]}px`);Pr()}t.fra==="fs"&&(_d=!!t.on,wd()),t.fra==="theme"&&(t.value==="light"||t.value==="dark")&&t.value!==Kt&&Vo(t.value),t.fra==="tz"&&typeof t.value=="string"&&t.value!==$e&&Md(t.value)}});function Md(i){$e=i,af();for(let t of gs.runs)N("run").querySelector(`option[value="${t.source}"]`).textContent=Es.format(new Date(t.issue));Ts(Q.run.source,!0),document.querySelectorAll(".ptz button").forEach(t=>t.setAttribute("aria-pressed",t.dataset.v===$e));try{localStorage.setItem("fra-tz",$e==="UTC"?"utc":"local")}catch{}}N("b-thm").onclick=()=>Vo(Kt==="light"?"dark":"light",!0);var gf=()=>{let i=`Switch to ${Kt==="light"?"dark":"light"} mode`;N("b-thm").title=i,N("b-thm").setAttribute("aria-label",i)};gf();new MutationObserver(gf).observe(at,{attributes:!0,attributeFilter:["class"]});try{innerWidth>=480&&(N("tzl3").textContent=`Local (${new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",timeZoneName:"short"}).formatToParts(new Date).find(i=>i.type==="timeZoneName").value})`)}catch{}document.querySelectorAll(".ptz button").forEach(i=>i.addEventListener("click",()=>{i.dataset.v!==$e&&Md(i.dataset.v)}));try{!No&&localStorage.getItem("fra-tz")==="utc"&&Md("UTC")}catch{}window.parent!==window&&window.parent.postMessage({fra:"ready"},"*");window.__fra={wind:md,setHour(i){nn(i),kn(i,"jump")},setRun:Ts,state:Q,camera:ne,controls:hn,RW:ee,flights:()=>Ei,setPlaying:Kn,setOverride(i,t){Q.ovOd=i??"",Q.ovR18=t??"",ti(),nn(Q.hour)},follow(){nr("follow")},setTheme:Vo,setCardMode:ff,planes:()=>di,rwScreen(){let i=at.clientWidth,t=at.clientHeight,e=new L,n=at.getBoundingClientRect(),r=s=>(e.copy(qt(s[0],s[1],0)).project(ne),[n.left+(e.x+1)/2*i,n.top+(1-e.y)/2*t]);return Object.values(ee).map(s=>[[s.d07,s.d25],r(s.A),r(s.B)])},depTips(){let i=at.clientWidth,t=at.clientHeight,e=new L,n=De;return{tips:(Yp||[]).filter(r=>r.kind==="dep").map(r=>(e.copy(qt(r.b[0],r.b[1],0)).project(ne),[(e.x+1)/2*i,(1-e.y)/2*t])),free:[n.left,n.top,i-n.right,t-n.bottom]}},fitStats(){let i=at.clientWidth,t=at.clientHeight,e=new L,n=Zp.map(u=>(e.copy(qt(u[0],u[1],0)).project(ne),[(e.x+1)/2*i,(1-e.y)/2*t])),r=Math.min(...n.map(u=>u[0])),s=Math.max(...n.map(u=>u[0])),o=Math.min(...n.map(u=>u[1])),a=Math.max(...n.map(u=>u[1])),c=De,l=i-c.left-c.right,d=t-c.top-c.bottom,h=Object.values(ee).flatMap(u=>[u.A,u.B]).map(u=>(e.copy(qt(u[0],u[1],0)).project(ne),[(e.x+1)/2*i,(1-e.y)/2*t]));return{rwW:+((Math.max(...h.map(u=>u[0]))-Math.min(...h.map(u=>u[0])))/l).toFixed(2),rwH:+((Math.max(...h.map(u=>u[1]))-Math.min(...h.map(u=>u[1])))/d).toFixed(2),fillW:+((s-r)/l).toFixed(2),fillH:+((a-o)/d).toFixed(2),offX:+(((r+s)/2-(c.left+l/2))/l).toFixed(3),offY:+(((o+a)/2-(c.top+d/2))/d).toFixed(3)}},live:()=>({liveMode:ge,wantLive:Ir,n:di.size,gen:qe?.generated})};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
