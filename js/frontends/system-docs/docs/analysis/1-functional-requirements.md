---
sidebar_position: 1
---

# Functional requirements

## User characteristics

The platform serves both the event participants reaching out for help and the event agencies. Accepting event agencies
is the responsibility of platform administrators.

* Participant — person who can request help on events. Participants have to register first.
* Agency support — employee replying to requests for help and managing issues for monitoring incidents that are
  happening during the event.
* Agency manager — employee creating events and editing their public information.
* Agency owner — account owner able to manage the whole agency and its users.
* Admin — platform representative verifying event agencies.
* Superadmin — platform owner able to add and manage other administrators.

## Functionalities

### All users

* can log in, change their password and manage their personal data.

### Participants

* can register in the application using email and password.
* can browse the events and filter them by their name, description and address.
* can request help on selected event and specify the problem description.
* can share location and chat with organizers.
* can browse messages exchanged with organizers.
* can delete their account on demand.

### All organizers

* can decide when to start and stop accepting new chats.
* can chat with the participants and view their location if shared.
* can end chats if they decide to.
* can browse messages exchanged with participants.
* can create issues, edit their status and priority and post comments about them.
* have read access to all agency data in the platform and can track all modifications to their data.

### Agency managers

* have write access to events and event contacts.
* can manage support users.

### Agency owners

* can register an agency using email and password, and delete the agency with all its users on demand.
* have write access to all agency data in the platform, in particular they can create accounts for managers and support
  users.

### Administrators

* can accept or block event agencies.
* can review event agencies.

### Superadmin

* can create and manage other admin accounts.

## Use case diagrams

Interactions of participants, organizers and administrators with the system has been illustrated in the following use
case diagrams.

### Participants

![participant use cases](/diagrams/use_case-participant.drawio.png)

### Organizers and administrators

![organizer and administrator use cases](/diagrams/use_case-agency.drawio.png)

## Sequence diagram

The main workflow of the system is establishing a connection between event participant and available agency support.

To make sure that the agency support is not overloaded with chats, requests for help are decoupled from the organizers
with a chat requests queue. New chats are started only when the organizers decide to start accepting them by turning on
polling the queue.

![sequence diagram](/diagrams/sequence_chat.drawio.png)