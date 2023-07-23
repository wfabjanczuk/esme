"use strict";(self.webpackChunksystem_docs=self.webpackChunksystem_docs||[]).push([[62],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>g});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=l(n),h=i,g=u["".concat(c,".").concat(h)]||u[h]||d[h]||a;return n?r.createElement(g,s(s({ref:t},p),{},{components:n})):r.createElement(g,s({ref:t},p))}));function g(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,s=new Array(a);s[0]=h;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[u]="string"==typeof e?e:i,s[1]=o;for(var l=2;l<a;l++)s[l]=n[l];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},2675:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var r=n(7462),i=(n(7294),n(3905));const a={sidebar_position:4},s="Backend services",o={unversionedId:"design/backend-services",id:"design/backend-services",title:"Backend services",description:"Backend architecture has been organized into three services with separated responsibilities:",source:"@site/docs/design/4-backend-services.md",sourceDirName:"design",slug:"/design/backend-services",permalink:"/esme/docs/design/backend-services",draft:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"docSidebar",previous:{title:"Chat requests queue",permalink:"/esme/docs/design/chat-requests-queue"},next:{title:"Frontend applications",permalink:"/esme/docs/design/frontend-applications"}},c={},l=[{value:"Organizer API",id:"organizer-api",level:2},{value:"Participant API",id:"participant-api",level:2},{value:"Messenger API",id:"messenger-api",level:2}],p={toc:l},u="wrapper";function d(e){let{components:t,...n}=e;return(0,i.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"backend-services"},"Backend services"),(0,i.kt)("p",null,"Backend architecture has been organized into three services with separated responsibilities:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Organizer API"),(0,i.kt)("li",{parentName:"ul"},"Participant API"),(0,i.kt)("li",{parentName:"ul"},"Messenger API")),(0,i.kt)("p",null,"In case of one component failure, other services are able to continue their work, sometimes with limited\nfunctionalities - depending on the broken component. For example, Organizer API is not dependent on other backend\nservices."),(0,i.kt)("p",null,"If Messenger API crashes, other services will be unaffected and platform users will still have access to all features\nexcept real time messaging and refreshing the chat history."),(0,i.kt)("p",null,"Participant API depends on Organizer API to fetch events and verify them before putting them into the chat requests\nqueue - it shows that the separation of user-oriented services is not flawless."),(0,i.kt)("p",null,"Messenger API depends on Organizer API and Participant API to authenticate new connections from organizers and\nparticipants respectively, but the ongoing chats will still be working even if the user specific service crashes.\nHowever, Participant API is used by the Messenger API to fetch profile data and release chat request locks, which means\nthat without Participant API the Messenger API will not refresh the contact details of the participant and will report\nan error to the organizer trying to end a chat."),(0,i.kt)("h2",{id:"organizer-api"},"Organizer API"),(0,i.kt)("p",null,"The goal of the Organizer API is to manage event agencies and its resources, and provide a REST API interface for other\nsystem components. It handles authentication of organizers and CRUD operations on organizers' database."),(0,i.kt)("p",null,"TypeScript, TypeORM and NestJS are well-suited for these purposes and choosing them aligns with the usage of TypeScript\non the frontend."),(0,i.kt)("h2",{id:"participant-api"},"Participant API"),(0,i.kt)("p",null,"Service implementing participants' use cases has to handle much higher requests rate during events than the Organizer\nAPI. It provides a REST API interface to authenticate participants, performs CRUD operations on participants' database\nand puts chat requests in the queue."),(0,i.kt)("p",null,"Golang has been chosen as the programming language for this purpose because it allows creating a lightweight HTTP\nservers and simplifies efficiently utilizing all CPU cores of the host machine. The standard library HTTP server\nimplementation in Golang uses goroutines to concurrently handle incoming requests."),(0,i.kt)("h2",{id:"messenger-api"},"Messenger API"),(0,i.kt)("p",null,"The primary purpose of the Messenger API is to handle real time communication between participants and organizers, and\nto synchronize user connections from multiple devices or browser tabs. It exposes a WebSocket endpoint as well as the\nREST API interface for fetching archived chats and messages."),(0,i.kt)("p",null,"Similarly to Participant API, Messenger API is designed with performance in mind and it is written in Golang as it\ncombines code simplicity and efficiency of concurrent operations in goroutines which can be synchronized using basic\nsynchronization primitives like mutexes or Golang-specific channels."))}d.isMDXComponent=!0}}]);