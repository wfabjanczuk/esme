---
sidebar_position: 5
---

# Chats and messages

If organizer is waiting for a new chat and there is a chat request in agency's queue, chat starts for both the organizer
and participant with problem description sent as the first message from the participant.

## Frontend

For better user experience, receiving a message, resizing the window or opening software keyboard on mobile devices
automatically scrolls the messages window to the last message.

If participant shares the location of his device, Organizer UI shows iframe with Google Maps centered at the participant
location coordinates rounded to 5 significant digits (rounding adds uncertainty of 1.11 meters). The location is saved
with every participant's message and the Google Maps iframe is refreshed if the rounded coordinates change in the next
message.

![organizer new chat](/screens/messenger_new_chat.png)

When the organizer is sure the case is resolved and chat is no longer needed, he can use the **Close chat** button
to end it and move it to Archives section for both parties. After the chat has ended, no more messages can be sent to it
and the chat input is hidden in both user interfaces. Closing chat releases the participant's lock on requesting help on
the associated event so he can later request another chat on the same event.

![organizer archives](/screens/messenger_archives.png)

Mobile chats screen displays both active and archived chats and distinguishes them by bolder font and green badge for
the active chats. The list of chats is split by the activity status (active first) and each group is sorted by the start
time (newest first).

![participant chats](/screens/messenger_participant_chats.png)

What is more, if the WebSocket connection is interrupted on the frontend, both Organizer and Participant UIs are
automatically reconnecting every 5 seconds using React `useEffect` hook and JavaScript `setInterval`:

```ts
useEffect(() => {
    if (messenger.hasState() && !messenger.isConnected()) {
        const restartInterval = setInterval(
            () => messenger.connect(
                authorizationHeader,
                dispatch,
                alertStore
            ),
            restartIntervalTime
        )
        return () => clearTimeout(restartInterval)
    }
}, [messenger.hasState(), messenger.isConnected()])
```

The `messenger` object in the above code is an instance of a class managing client WebSocket connection to
Messenger API. It additionally uses authorization header to authenticate, integrates `dispatch` function from
`useReducer` hook handling incoming messages from the server and signals connection errors in the application
alert bar with `alertStore` object.

To make the WebSocket easily accessible in any React component that needs it, two contexts has been created:
`InboxContext` and `MessengerContext`. The first one stores user chats and messages (with participant's
geolocation information in case of Organizer UI) and the latter exposes methods to send WebSocket messages to the
Messenger API.

## Backend

### Chat protocol

Messenger API uses custom JSON-based chat protocol for incoming and outgoing messages in the form of:

```
{
  "type": <message_type:string>,
  "payload": <data:any>
}
```

The only exception is the first message from client, which is a JSON with authorization header as the browser WebSocket
implementation does not support sending a HTTP header while establishing connection. `Authorization` is not a
required opening handshake header in the [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455#section-4) defining
the WebSocket Protocol.

After successfully connecting to the server, client implementations in React and React Native start with sending the
`get_chats` and then sending `get_chat_history` for each returned chat.

#### Messages to server

| Message type       | Data                     | Users allowed to send       |
|--------------------|--------------------------|-----------------------------|
| `get_chats`        | none                     | organizers and participants |
| `get_chat_history` | chat id                  | organizers and participants |
| `send_message`     | chat id and message text | organizers and participants |
| `start_chat`       | none                     | organizers                  |
| `close_chat`       | chat id                  | organizers                  |

All users can use `send_message` action to communicate, but only the organizers have access to
`start_chat` and `close_chat` actions to manage their active chats.

#### Messages to client

| Message type   | Data                         | Users allowed to receive    |
|----------------|------------------------------|-----------------------------|
| `chats`        | list of chats                | organizers and participants |
| `chat_history` | chat id and list of messages | organizers and participants |
| `user_message` | message                      | organizers and participants |
| `new_chat`     | chat                         | organizers and participants |
| `closed_chat`  | chat                         | organizers and participants |

### WebSocket connections

#### Single connection handlers

User's **connection handler** is running in its own goroutine with a for loop reading incoming messages from a specific
WebSocket connection of the user and it exposes methods for sending an outgoing message or an error there. To
synchronize actions between all connections from the user (they could be from different devices or browser tabs),
**connection handler** uses a Golang channel to push all the messages to the user's **connection pool
handler**.

```go
func (oc *OrganizerConnection) listenOnConnection() {
  defer func() {
    if r := recover(); r != nil {
      oc.logger.Printf("panic %v\n", r)
      oc.Close()
      return
    }
  }()
  
  for {
    msg, err := oc.read()
    if err != nil {
      if !oc.handleReadError(err) {
        return
      }
      continue
    }

    oc.resetReadTimer()
    oc.messages <- NewOrganizerMessage(msg, oc)
  }
}

func (oc *OrganizerConnection) read() (*protocol.Message, error) {
    msg := &protocol.Message{}
    return msg, oc.wsConnection.ReadJSON(msg)
}
```

#### Multiple user connections

User's **connection pool handler** exposes thread-safe methods (protected by a mutex) for adding a new WebSocket
connection and for outgoing message fan-out to all user connections. Additionally, it uses two goroutines with for loops
to listen for incoming messages and to listen for connection shutdowns. When all the user connections are closed,
**connection pool handler** starts a graceful shutdown of itself to free memory. Golang channels and select
statements are used to notify and stop hanging goroutines.

```go
func (ocp *OrganizerConnectionPool) listenOnMessages() {
  for {
    select {
    case <-ocp.doneChan:
      ocp.logger.Printf(
        "stopped listening on messages for %s\n", 
        ocp.GetInfo(),
      )
      return
    case msg := <-ocp.connectionMessages:
      go ocp.consumer.ConsumeMessage(msg)
    }
  }
}

func (ocp *OrganizerConnectionPool) listenOnShutdowns() {
  for {
    select {
    case <-ocp.doneChan:
      ocp.logger.Printf(
        "stopped listening on shutdowns for %s\n", 
        ocp.GetInfo(),
      )
      return
    case conn := <-ocp.connectionShutdowns:
      go ocp.removeConnection(conn)
    }
  }
}
```

#### Message consumers

The incoming messages consumers expose a `ConsumeMessage` method to appropriately handle each message type.
Organizer and participant messages are handled by similar consumers with a few differences in allowed message types and
logic. 

```go
func (c *Consumer) ConsumeMessage(msg *connections.OrganizerMessage) {
  switch msg.Message.Type {
  case in.MsgTypeGetChats:
    c.consumeGetChats(msg)
  case in.MsgTypeStartChat:
    c.consumeStartChat(msg)
  case in.MsgTypeSendMessage:
    c.consumeSendMessage(msg)
  case in.MsgTypeGetChatHistory:
    c.consumeGetChatHistory(msg)
  case in.MsgTypeCloseChat:
    c.consumeCloseChat(msg)
  default:
    c.logger.Printf(
      "invalid message type %s from organizer %d\n",
      msg.Message.Type, 
      msg.Source.Organizer.Id,
    )
    msg.Source.SendError(common.ErrInvalidMessageType)
  }
}
```

Incoming message consumers use a reference to `ChatsManager` which coordinates sending outgoing messages to
members of the specific chat and provides in-memory cache with active chats. To ensure that server state is up to date,
initializing a new WebSocket connection goes through the `ChatsManager` which fetches user chats and then creates
or calls an existing user's **connection pool handler** to attach a new **connection handler**. Unfortunately,
this design is stateful and does not allow horizontal scalability because it assumes that all WebSocket connections
communicate with the same chat server keeping all active chats and connection pools.
