---
sidebar_position: 2
---

# System entities

## Agency

Consists of unique name, address and optional website. It can be either approved or not and the state of the approval
can be changed by an administrator. If agency is not approved, its users cannot make any changes to its entities and its
events are not publicly available.

## Organizer

Consists of email, first name, last name, phone number, time of creation, time of last sign out
and role in the CRM. Organizer's role is one of `agency owner`, `agency manager` and `agency support`. Organizer is
associated with the agency he belongs to.

## Event

Consists of unique name, description, address with geographic coordinates and time range. Events created by an approved
agency are publicly available and participants can request help on them.

## Event contact

Consists of first name, last name, email, phone number and optional additional notes. Event contacts serve as an
optional emergency contact list.

## Participant

Consists of first name, last name, email, phone number, time of creation and time of last sign out. Organizers can see
participant's data in the chat window.

## Request for help

Consists of problem description, time of creation and optional device location if event participant shares them. It is
associated with the particular event and the participant who asks for help. Requests are put in a FIFO queue and are
handled by agency support who open chats with participants in need.

## Chat

Consists of start time and end time if it has been already ended by the organizer. It serves as a container for all
messages exchanged between the participant and agency support. Chat is associated with the specific event and the
participant in need.

## Message

Consists of textual content, sending time and can contain device location if event participant is the author and shares
it. Message is associated with the author and the particular chat.

## Issue

Consists of name, description, status and priority, time of creation and time of closure if it has already been closed.
Issue's status is one of `to do`, `in progress`, `resolved` and `cancelled`. Issue's priority is one of `low`, `medium`
and `high`. Issue is associated with the author and the specific event. New issue starts with the status `to do` and the
first time its status changes to `resolved` or `cancelled` it is considered closed.

## Issue comment

Consists of textual content and time of creation. It is associated with the author and the particular issue. Only the
author can edit or delete his own comment.

## Changelog

Represents a system entity modification done by an organizer in the CRM. It consists of the edited entity class name,
edited entity id, type of change (one of `insert`, `update` and `delete`), time of change and JSON-encoded entity
properties after the change. Changelog is associated with the author of the change.