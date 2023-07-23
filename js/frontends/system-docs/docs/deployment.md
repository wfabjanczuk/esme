---
sidebar_position: 5
---

# Deployment

Randomly generating safe production environment secrets (database credentials, API keys, etc.) has been automated with a
Golang script providing config files ready to be used with appropriate `docker-compose.yml` scripts prepared in
the `/envs/prod` directory.

All the backend components and the Organizer UI were deployed in the Amazon Web Services using a separate EC2
instance for each component (t2.micro, 1vCPU, 1GB RAM, Ubuntu 22.04).

![aws instances](/screens/aws_ec2_instances.png)

Participant UI has been built for Android and the `.apk` has been published in the
[Expo platform](https://expo.dev/accounts/wfabjanczuk/projects/participant/builds/fda0130c-a662-4cdf-814e-f3bbdec07340)
and tested on Samsung Galaxy A52 (Android) and Xiaomi Redmi Note 8 PRO. The build is not functional anymore as it uses
addresses of AWS servers that are now terminated.

| Conversation                               | Event details                                |
|--------------------------------------------|----------------------------------------------|
| ![android chat](/screens/android_chat.jpg) | ![android event](/screens/android_event.jpg) |

The production environment does not meet industry standards yet. System should have a registered domain, production
servers should be secured with SSL certificates and configured for automatic scaling, web application should use secure
flags in cookies, mobile application should be published in Google Play and App Store.

The biggest architectural challenge, which is scaling the Messenger API, has not been solved yet. In the current
implementation, the Messenger API is stateful and depends on handling all chats and WebSocket connections on one server.

In the next iteration, Messenger API should be redesigned to decouple handling chats from the state of WebSocket
connections. The solution could involve an event-driven architecture pattern where the user actions in the chat would be
streamed to a cluster of consumers. The servers maintaining WebSocket connections with the users could subscribe to the
streams of chat updates.

What is more, fault tolerance and availability of the system could be significantly improved with a separate
authentication service and horizontal scalability of system components, which should be preceded with load balancers to
evenly distribute the traffic between healthy servers and to prevent sending it to the malfunctioning ones.