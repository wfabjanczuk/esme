---
sidebar_position: 4
---

# Requests for help

Participant in need can either choose one of the predefined problem types (medical or security) or describe the problem
in his own words. The problem description is later sent as the first message in the chat to speed up the issue analysis
by the organizers. 

**Send request for help** button triggers two actions in Participant API sequentially:

1. saving the relation between the participant and the event he requested help on in PostgreSQL to prevent the
   participant from requesting help on the same event again,
2. publishing the chat request in agency chat requests queue (FIFO) declared in RabbitMQ.

If publishing the chat request in RabbitMQ fails, Participant API attempts to revert the insert of chat request lock in
PostgreSQL and if that fails, appropriate errors are logged.

![participant events](/screens/participant_events.png)

On the other side, an organizer can turn on the switch to start waiting for a new chat. When the switch is turned on,
the WebSocket client in the browser periodically sends `start_chat` messages every 5 seconds until it
receives `new_chat` message from the server and the switch is automatically turned off. User can also switch off waiting
for a new chat manually.

In other words, the organizer is polling his agency chat requests queue via Messenger API which checks if there are any
chat requests published in RabbitMQ and fetches one if available.

![organizer starting chat](/screens/organizer_starting_chat.png)