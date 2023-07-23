---
sidebar_position: 3
---

# Results

All the test runs eventually caused Messenger API to become unresponsive and failed on a timeout error from acquiring
a new WebSocket connection by one of the constantly added participant workers. Basic AWS monitoring graphs in the time
range of the test runs are shown below:

![organizer overview](/screens/aws_monitoring.png)

In total 9 valid tests has been run. Each set of configuration parameters: start chat interval `sci`, create participant
interval `cpi` and send message interval `smi` is repeated 3 times as summarized in the table below. The start chat
interval and create participant interval are constant in all test runs while send message interval varies from 100
milliseconds to 10 seconds.

| sci [ms] | cpi [ms] | smi [ms] | repetitions |
|----------|----------|----------|-------------|
| 10       | 20       | 100      | 3           |
| 10       | 20       | 1000     | 3           |
| 10       | 20       | 10000    | 3           |

## 100ms send message interval

![graph 100ms](/graphs/graph_100.png)

## 1000ms send message interval

![graph 1000ms](/graphs/graph_1000.png)

## 10000ms send message interval

![graph 10000ms](/graphs/graph_10000.png)

## Discussion

In the graphs for 100ms and 1000ms test runs it is clearly visible that the sent messages rate reaches a certain plateau
and after around 45 seconds the first timeout error from acquiring a new WebSocket connection occurs -- the default
handshake timeout in the WebSocket client used in the performance tests is 45 seconds.

The registered sent messages rate might be different from the rate of messages successfully processed by the system. To
improve quality of the performance test, organizer worker could read and report incoming user messages processed by the
Messenger API or even respond to participant workers. Moreover, the test scenario could be changed to set a pool of
organizers accepting chats.

The relationship between maximum message rate registered by the participant workers and active chats count at the moment
of the first Messenger API connection initialization timeout is depicted in the graph below:

![graph analysis](/graphs/graph_analysis.png)

In the future, configuring and running the performance test scenarios in the cloud could be automated in CI/CD process
to simplify obtaining more data points in the graph and better estimating the Messenger API throughput limits.