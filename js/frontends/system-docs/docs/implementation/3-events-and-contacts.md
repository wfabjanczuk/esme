---
sidebar_position: 3
---

# Events and contacts

Organizers with the role of agency owner or agency manager can perform CRUD operations on events and contacts associated
with them. Agency support have only read access to this data which can be used to appropriately react to incidents and
notify the right people.

![organizer events](/screens/organizer_events.png)

Participants can browse events belonging to approved agencies and filter them by text query which is used to
build SQL where clause with TypeORM query builder. Phrase entered by participants is searched in event name, description
or address. Additional filters for time range of event start time are also available in the backend.

![participant events](/screens/participant_events.png)
