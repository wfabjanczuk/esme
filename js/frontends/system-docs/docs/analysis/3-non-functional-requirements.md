---
sidebar_position: 3
---

# Non-functional requirements

## Support for multiple sessions

✅ Messaging features for both organizers and participants have to support multiple simultaneous connections created by
one user. Chats and messages in all user sessions has to be synchronized.

## Reconnection on internet outages

✅ System has to be ready for internet problems of its users. Disconnected users have to be able to browse already
downloaded messages and automatically reconnect to the system.

## High availability and scalability of chat storage

❌ Database storing chats and messages has to support high availability and scalability (not configured).

## Data separation of organizers and participants

✅ Data collected about event participants cannot be physically placed together with organizers data.

## JWT authentication

✅ Requests and connections from both organizers and participants have to be authenticated with JWT.

## Material Design

✅ User interface has to use templates or libraries compliant with the Material Design guidelines.

## Open source under MIT License

✅ Source code of the system has to be publicly available and licensed under the MIT License.
