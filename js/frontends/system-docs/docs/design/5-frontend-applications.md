---
sidebar_position: 5
---

# Frontend applications

Both user interfaces are created in TypeScript with React in the web application for organizers and with React Native in
the mobile application for participants. React is the most popular frontend library and together with React Native it
supports all platforms required for the system users: web browsers on all operating systems, Android and iOS.

Choosing the React ecosystem and having similar authentication mechanisms and chat protocols for both organizers and
participants makes it possible to reuse code and structure all frontend applications in the same way. Moreover, built-in
JavaScript [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) library is supported in all modern
browsers and it is sufficient for the purposes of the system described in the thesis.

To make the frontend compliant with Material Design guidelines, Organizer UI is based on
the [Material UI](https://mui.com/) components and [Paperbase](https://mui.com/store/items/paperbase/) template while
the Participant UI uses [React Native Paper](https://reactnativepaper.com/) library.