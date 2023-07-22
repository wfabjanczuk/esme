---
sidebar_position: 2
---

# Infrastructure

All the system components has been running on AWS t2.micro EC2 (1vCPU, 1GB RAM, Ubuntu 22.04) so to make sure the
machine performing stress tests will not get limited by its own hardware, a t2.xlarge EC2 (4vCPU, 16GB RAM, Ubuntu
22.04) has been created in the private subnetwork with the rest of the system.

The AWS EC2 monitoring has shown that the machine running performance tests had never utilized more than 5% of each CPU
core and had never used more than 2% of its RAM (system metrics has been observed using `htop`).

Test configuration points the concurrent workers to the private IPv4 addresses of Messenger API, Organizer API and
Participant API and provides organizer credentials for the worker starting chats.

Each test run in the AWS cloud usually creates tens of thousands of messages and hundreds of participants, chat requests
and chats. Before repeating the test Messenger API is restarted and the queue along with the databases are cleared.