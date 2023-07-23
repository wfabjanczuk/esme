---
sidebar_position: 2
---

# Databases

In order to meet requirement for organizers' and participants' data separation, system has two different PostgreSQL
database servers for services handling participants and organizers respectively. SQL is the default choice for CRUD
applications like this and PostgreSQL is one of the most popular open-source solutions in the area.

## Organizer API database

Database for Organizer API stores agencies, their events, contacts, issues, comments,
all the users including administrators and changelogs documenting modifications of system entities.

![organizers database](/diagrams/organizer_db.drawio.png)

## Participant API database

Participant API database consists of users and chat request locks to prevent participants from repeatedly sending
requests for help on the same event.

![participants database](/diagrams/participant_db.drawio.png)

## Messenger API database

Database containing chats and messages is a different case. Messenger API data does not
need table joins nor transactions, the structure of its data is vulnerable to frequent changes during the development of
the system and messages may vary in structure and size. In the future, each message might be stored with nested
information available for quick retrieval, for example file attachments or metadata describing forms and clickable
buttons triggering custom actions in chat (like starting a video call).

![messenger database](/diagrams/messenger_db.drawio.png)