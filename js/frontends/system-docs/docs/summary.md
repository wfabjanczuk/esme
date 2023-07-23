---
sidebar_position: 7
---

# Summary

Emergency service for mass events satisfying the [functional requirements](/docs/analysis/functional-requirements) has
been successfully implemented, deployed and stress tested. The solution is ready for friends and family tests, and it
could be used to measure the interest of event agencies. However, the standards of fault tolerance, high availability
and horizontal scalability of the system have not been achieved.

The [design](/docs/design/c4-model) of the system takes into account conditions of mass events by focusing on text
communication via WebSocket and Participant UI targeting mobile devices. It does provide some degree of fault tolerance
with the microservices architecture (system can function without the chat server) and chats storage could be later
configured for high availability and horizontal scalability.

[Implementation](/docs/implementation/authentication-and-authorization) allows organizers to register, manage their
event agencies and start chats with queued participants requesting help.
[Chats](/docs/implementation/chats-and-messages) offer responsiveness and basic features present in popular public
safety software and customer service applications, including tracking the geolocation of the participant. What makes the
service different from other solutions is the focus on mass events and mobile UI allowing to find specific event and
request help on it.

Nevertheless, Messenger API responsible for WebSocket communication between organizers and participants is not yet
prepared for horizontal scalability and cannot be running on more than one server. In the future, already present
messaging interface could be used to develop horizontal scalability of the chat service without making significant
changes in other microservices.

The results of the [performance tests](/docs/performance-tests/results) allow to roughly estimate the throughput limits
of the Messenger API for real time messaging:

* 257 active chats with 10 messages per second in each chat,
* or 731 active chats with 1 message per second in each chat,
* or 1590 active chats with 1 message per 10 seconds in each chat.

Future of the system depends on the demand for its features and business needs of potential users. The source code of
the application is [open source](https://github.com/wfabjanczuk/esme) and it is licensed under the MIT License. Anyone
can use it as a base for the next version.
