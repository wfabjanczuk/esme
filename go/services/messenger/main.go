package main

import (
	"log"
	"messenger/internal"
	"net/http"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	log.Println("Starting requests queue listener")
	go internal.ListenOnRequestQueue()
	go receive()

	http.HandleFunc("/ws", internal.InitConnection)
	log.Println("Starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func receive() {
	conn, err := amqp.Dial("amqp://rabbit:rabbitPassword@esme_dispatcher_rabbit:5672//")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"hello", // name
		true,    // durable
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)
		}
	}()

	log.Printf(" [*] Waiting for messages.")
	<-forever

}
