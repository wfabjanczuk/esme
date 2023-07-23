---
sidebar_position: 1
---

# Authentication and authorization

All users (administrators, organizers and participants) use their email and password to sign in. Both frontends have a
profile section which allows users to edit their personal data and change their password.

During the registration passwords are hashed using the `bcrypt` algorithm and during the login servers compare
provided password with the hash stored in the database. Login with correct credentials results in server issuing an
encrypted authentication token for the user. On the client side, tokens are stored either in a browser cookie or in the
Expo SecureStore. There are no refresh tokens and session expires after 24 hours.

![authentication screens](/screens/authentication.png)

Organizer and Participant APIs use JWT based authentication and middlewares for recognizing users sending the requests.
Tokens are encoded using server-side secrets and prefixed with either `organizer` or `participant`.
Messenger API is exposed to system frontends and uses the token prefix to route authentication requests to the right
server and verify users before establishing WebSocket connections or returning archived chats and messages data. Signing
out and changing the password updates the user's `timeSignOut` field to invalidate all the tokens issued before
last logout.

Authorization is present in the Organizer API and uses NestJS guards to protect access to certain endpoints on the basis
of user role in the system. Organizer UI also protects administrator routes and displays different menus for
administrators and agency users.

![organizer profile](/screens/organizer_profile.png)
![participant profile](/screens/participant_profile.png)