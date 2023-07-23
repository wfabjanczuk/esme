---
sidebar_position: 1
---

# C4 model

C4 model has been used to visualize the system context and its architecture.

## Context diagram

The actors and their actions in the system has been illustrated with system context diagram. This is a high-level
overview and only the most important use cases has been specified and the hierarchies of organizers (owner, manager,
support) and administrators (superadmin, regular administrators) has been concealed to improve the clarity of the
diagram.

![context diagram](/diagrams/c4_context.drawio.png)

## Container diagram

More fine-grained view can be found in the container diagram which models the system architecture with interactions
between the clients, servers and data stores. The web services and their databases are organized on the basis of user
characteristics and use cases, imitating the microservices architecture style in search for fault tolerance of
individual components.

![container diagram](/diagrams/c4_container.drawio.png)