---
sidebar_position: 7
---

# Changelogs

Just like administrators, organizers can track changes of system entities relevant to their agency in the Changelogs
section. Every changelog stores a performed action type (one of `insert`, `update` or `delete`), information about the
modified entity, the author, time of the modification and the JSON-encoded entity properties after the modification. The
only exception is the user entity changelog, which does not store the password hash.

Changelogs are meant to help agencies supervise the work of their employees and to prevent users from concealing
malicious data manipulations (repudiation). To ensure that all modifications are logged, every change in Organizer API
database is wrapped in a transaction with an additional insert into the `changelogs` table.

![organizer changelog details](/screens/organizer_changelog_details.png)