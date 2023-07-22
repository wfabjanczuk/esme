---
sidebar_position: 1
---

# Scenario

The crucial part of the system is the Messenger API and the performance tests focus solely on this component. While
participants on mass events using the mobile application can fetch events data and change their personal data, the most
effort should be put on assuring that in the flood of requests for help, already opened communication with support will
endure until the organizers can diagnose the problem and take the necessary action.

To partially simulate real life scenario, a performance test setup in Golang creates concurrent workers for one
organizer starting chats and steadily increasing number of participants registering in the system, requesting help,
waiting for the chat to begin and then regularly writing messages. For easier debugging, each message sent by the
participant worker is of the form:

```go
fmt.Sprintf(
    "connection %s: message number %d", 
    conn.LocalAddr(), messageNumber,
)
```

The test counts the numbers of registered participants and started chats, and Unix timestamp of every WebSocket message
successfully sent by the participants is collected to measure the message rate per second:

```go
func (m *Manager) startMessageRateTracker() {
    for {
        select {
        case <-m.doneChan:
            log.Println("stopping message rate tracker")
            return
        case timeSent := <-m.messageTimeSentChan:
            m.messageRates[timeSent]++
        }
    }
}
```

Execution stops when the first error occurs and in the end the time series of message rates and the test summary are
saved to files.

The test can be parameterized with start chat interval `sci`, create participant interval `cpi` and send message
interval `smi` where interval represents sleep time of concurrent worker between actions of a given type. Starting the
test takes place in the command line in `/esme/tests/performance` directory where the relevant parameters are
passed as flags representing time durations in milliseconds:

```bash
go run main.go -sci 10 -cpi 20 -smi 100
```

The test uses only the system backend services and does not evaluate the UI behavior during high traffic. However, an
organizer's overview of created chats and messages and single participant's screen with messages sent during the
performance test are shown below:

![organizer overview](/screens/organizer_performance_test.png)
![participant screen](/screens/participant_performance_test.png)