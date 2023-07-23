"use strict";(self.webpackChunksystem_docs=self.webpackChunksystem_docs||[]).push([[823],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=d(n),h=i,m=u["".concat(c,".").concat(h)]||u[h]||l[h]||a;return n?r.createElement(m,o(o({ref:t},p),{},{components:n})):r.createElement(m,o({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=h;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[u]="string"==typeof e?e:i,o[1]=s;for(var d=2;d<a;d++)o[d]=n[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},310:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var r=n(7462),i=(n(7294),n(3905));const a={sidebar_position:1},o="Authentication and authorization",s={unversionedId:"implementation/authentication-and-authorization",id:"implementation/authentication-and-authorization",title:"Authentication and authorization",description:"All users (administrators, organizers and participants) use their email and password to sign in. Both frontends have a",source:"@site/docs/implementation/1-authentication-and-authorization.md",sourceDirName:"implementation",slug:"/implementation/authentication-and-authorization",permalink:"/esme/docs/implementation/authentication-and-authorization",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"docSidebar",previous:{title:"Implementation",permalink:"/esme/docs/category/implementation"},next:{title:"Administrators and agencies",permalink:"/esme/docs/implementation/administrators-and-agencies"}},c={},d=[],p={toc:d},u="wrapper";function l(e){let{components:t,...a}=e;return(0,i.kt)(u,(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"authentication-and-authorization"},"Authentication and authorization"),(0,i.kt)("p",null,"All users (administrators, organizers and participants) use their email and password to sign in. Both frontends have a\nprofile section which allows users to edit their personal data and change their password."),(0,i.kt)("p",null,"During the registration passwords are hashed using the ",(0,i.kt)("inlineCode",{parentName:"p"},"bcrypt")," algorithm and during the login servers compare\nprovided password with the hash stored in the database. Login with correct credentials results in server issuing an\nencrypted authentication token for the user. On the client side, tokens are stored either in a browser cookie or in the\nExpo SecureStore. There are no refresh tokens and session expires after 24 hours."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"authentication screens",src:n(456).Z,width:"1015",height:"744"})),(0,i.kt)("p",null,"Organizer and Participant APIs use JWT based authentication and middlewares for recognizing users sending the requests.\nTokens are encoded using server-side secrets and prefixed with either ",(0,i.kt)("inlineCode",{parentName:"p"},"organizer")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"participant"),".\nMessenger API is exposed to system frontends and uses the token prefix to route authentication requests to the right\nserver and verify users before establishing WebSocket connections or returning archived chats and messages data. Signing\nout and changing the password updates the user's ",(0,i.kt)("inlineCode",{parentName:"p"},"timeSignOut")," field to invalidate all the tokens issued before\nlast logout."),(0,i.kt)("p",null,"Authorization is present in the Organizer API and uses NestJS guards to protect access to certain endpoints on the basis\nof user role in the system. Organizer UI also protects administrator routes and displays different menus for\nadministrators and agency users."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"organizer profile",src:n(4368).Z,width:"1279",height:"1045"}),"\n",(0,i.kt)("img",{alt:"participant profile",src:n(9114).Z,width:"1461",height:"966"})))}l.isMDXComponent=!0},456:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/authentication-c3ce9dd0d73a7f5d587cd6dcf10cc0c6.png"},4368:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/organizer_profile-55c3f5609458580f1e4fb339402b9f68.png"},9114:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/participant_profile-686ae9c737ab419ce310227a82daace8.png"}}]);