"use strict";(self.webpackChunksystem_docs=self.webpackChunksystem_docs||[]).push([[65],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>u});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=l(n),g=o,u=m["".concat(c,".").concat(g)]||m[g]||d[g]||a;return n?r.createElement(u,i(i({ref:t},p),{},{components:n})):r.createElement(u,i({ref:t},p))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=g;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[m]="string"==typeof e?e:o,i[1]=s;for(var l=2;l<a;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},6735:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_position:7},i="Changelogs",s={unversionedId:"implementation/changelogs",id:"implementation/changelogs",title:"Changelogs",description:"Just like administrators, organizers can track changes of system entities relevant to their agency in the Changelogs",source:"@site/docs/implementation/7-changelogs.md",sourceDirName:"implementation",slug:"/implementation/changelogs",permalink:"/esme/docs/implementation/changelogs",draft:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"docSidebar",previous:{title:"Issues and comments",permalink:"/esme/docs/implementation/issues-and-comments"},next:{title:"Development",permalink:"/esme/docs/development"}},c={},l=[],p={toc:l},m="wrapper";function d(e){let{components:t,...a}=e;return(0,o.kt)(m,(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"changelogs"},"Changelogs"),(0,o.kt)("p",null,"Just like administrators, organizers can track changes of system entities relevant to their agency in the Changelogs\nsection. Every changelog stores a performed action type (one of ",(0,o.kt)("inlineCode",{parentName:"p"},"insert"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"update")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"delete"),"), information about the\nmodified entity, the author, time of the modification and the JSON-encoded entity properties after the modification. The\nonly exception is the user entity changelog, which does not store the password hash."),(0,o.kt)("p",null,"Changelogs are meant to help agencies supervise the work of their employees and to prevent users from concealing\nmalicious data manipulations (repudiation). To ensure that all modifications are logged, every change in Organizer API\ndatabase is wrapped in a transaction with an additional insert into the ",(0,o.kt)("inlineCode",{parentName:"p"},"changelogs")," table."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"organizer changelog details",src:n(2464).Z,width:"1278",height:"584"})))}d.isMDXComponent=!0},2464:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/organizer_changelog_details-0d002f8df63025d21a13e1a72801980e.png"}}]);