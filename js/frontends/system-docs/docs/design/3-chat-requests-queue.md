---
sidebar_position: 3
---

# Chat requests queue

To allow limiting simultaneous chats with participants, chat requests from participants are queued (FIFO) before the
chats start. [RabbitMQ](https://www.rabbitmq.com/) has been chosen for this purpose as it is easy to setup and it is one
of the most popular message brokers.

Note that Participant API database also stores some information about chat requests. The service needs to use a
persistent lock to prevent the participant from requesting a new chat while his previous request is waiting in the queue
or his chat is active. The lock is released when the organizer ends the chat.