---
sidebar_position: 2
---

# Administrators and agencies

Organizer API creates a unique superadmin account on application bootstrap using the credentials (email and password)
provided in environmental variables.

After signing in, administrators can browse all administrator users but only superadmin is able to create accounts for
other administrators. Superadmin provides first-time login password for
other administrators who can later edit their credentials in the profile section. In the same way agency owners and
managers can create other user accounts.

![administrator users](/screens/administrator_users.png)

Administrators can browse all registered agencies data, verify them and change agency approved status to either true or
false. Only organizers from approved agencies can sign in and use the system. The approval can be revoked.

Agency details view contains a **Preview** button, which allows administrators to browse the agency data if
necessary. Agency preview gives administrator read and write access to all agency data except chats and messages.

Administrators can browse changelogs documenting all the modifications of Organizer API database entities. The
changelogs section is discussed in [Changelogs](/docs/implementation/changelogs).

![administrator agencies](/screens/administrator_agencies.png)
![administrator agency details](/screens/administrator_agency_details.png)
![administrator agency preview](/screens/administrator_agency_preview.png)
![administrator changelogs](/screens/administrator_changelogs.png)

