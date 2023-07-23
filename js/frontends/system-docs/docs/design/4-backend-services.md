---
sidebar_position: 4
---

# Backend services

Backend architecture has been organized into three services with separated responsibilities:

* Organizer API
* Participant API
* Messenger API

In case of one component failure, other services are able to continue their work, sometimes with limited
functionalities - depending on the broken component. For example, Organizer API is not dependent on other backend
services.

If Messenger API crashes, other services will be unaffected and platform users will still have access to all features
except real time messaging and refreshing the chat history.

Participant API depends on Organizer API to fetch events and verify them before putting them into the chat requests
queue - it shows that the separation of user-oriented services is not flawless.

Messenger API depends on Organizer API and Participant API to authenticate new connections from organizers and
participants respectively, but the ongoing chats will still be working even if the user specific service crashes.
However, Participant API is used by the Messenger API to fetch profile data and release chat request locks, which means
that without Participant API the Messenger API will not refresh the contact details of the participant and will report
an error to the organizer trying to end a chat.

## Organizer API

The goal of the Organizer API is to manage event agencies and its resources, and provide a REST API interface for other
system components. It handles authentication of organizers and CRUD operations on organizers' database.

TypeScript, TypeORM and NestJS are well-suited for these purposes and choosing them aligns with the usage of TypeScript
on the frontend.

## Participant API

Service implementing participants' use cases has to handle much higher requests rate during events than the Organizer
API. It provides a REST API interface to authenticate participants, performs CRUD operations on participants' database
and puts chat requests in the queue.

Golang has been chosen as the programming language for this purpose because it allows creating a lightweight HTTP
servers and simplifies efficiently utilizing all CPU cores of the host machine. The standard library HTTP server
implementation in Golang uses goroutines to concurrently handle incoming requests.

## Messenger API

The primary purpose of the Messenger API is to handle real time communication between participants and organizers, and
to synchronize user connections from multiple devices or browser tabs. It exposes a WebSocket endpoint as well as the
REST API interface for fetching archived chats and messages.

Similarly to Participant API, Messenger API is designed with performance in mind and it is written in Golang as it
combines code simplicity and efficiency of concurrent operations in goroutines which can be synchronized using basic
synchronization primitives like mutexes or Golang-specific channels.