package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"performance/config"
	"performance/organizer"
	"performance/participants"
	"strings"
	"syscall"
	"time"
)

func main() {
	c := parseConstants()

	var om *organizer.Manager
	var pm *participants.Manager
	defer func() {
		if r := recover(); r != nil {
			gracefulShutdown(om, pm, c)
		}
	}()

	cfg, err := config.NewConfig("config.json")
	if err != nil {
		log.Panicf("error loading config: %v", err)
	}

	om = organizer.NewManager(cfg, c.LogWs)
	err = om.StartAcceptingChats(c.StartChatInterval)
	if err != nil {
		log.Panicf("error initializing organizer: %v", err)
	}
	log.Println("organizer initialized")

	pm = participants.NewManager(cfg, c.LogWs)
	go pm.StartAddingParticipants(c.CreateParticipantInterval, c.SendMessageInterval)

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)

	select {
	case <-stop:
		log.Panicf("performance test interrupted")
	case err = <-om.GetErrChan():
		log.Panicf("organizer error: %v", err)
	case err = <-pm.GetErrChan():
		log.Panicf("participant error: %v", err)
	}
}

type constants struct {
	StartChatInterval               time.Duration `json:"-"`
	CreateParticipantInterval       time.Duration `json:"-"`
	SendMessageInterval             time.Duration `json:"-"`
	StartChatIntervalString         string        `json:"start_chat_interval"`
	CreateParticipantIntervalString string        `json:"create_participant_interval"`
	SendMessageIntervalString       string        `json:"send_message_interval"`
	LogWs                           bool          `json:"log_ws"`
}

func parseConstants() *constants {
	sci := flag.Int("sci", 1000, "start chat interval in ms")
	cpi := flag.Int("cpi", 1000, "create participant interval in ms")
	smi := flag.Int("smi", 1000, "send message interval in ms")
	logWs := flag.Bool("logWs", false, "log websocket messages")
	flag.Parse()

	log.Printf("start chat interval: %d ms", *sci)
	log.Printf("create participant interval: %d ms", *cpi)
	log.Printf("send message interval: %d ms", *smi)
	log.Println("log websocket messages:", *logWs)
	log.Println(strings.Repeat("-", 80))

	c := &constants{
		StartChatInterval:         time.Duration(*sci) * time.Millisecond,
		CreateParticipantInterval: time.Duration(*cpi) * time.Millisecond,
		SendMessageInterval:       time.Duration(*smi) * time.Millisecond,
		LogWs:                     *logWs,
	}

	c.StartChatIntervalString = c.StartChatInterval.String()
	c.CreateParticipantIntervalString = c.CreateParticipantInterval.String()
	c.SendMessageIntervalString = c.SendMessageInterval.String()

	return c
}

type summary struct {
	Constants                *constants `json:"constants"`
	Description              string     `json:"description"`
	OrganizerTimeStarted     time.Time  `json:"organizer_time_started"`
	OrganizerDuration        string     `json:"organizer_duration"`
	ParticipantsTimeStarted  time.Time  `json:"participants_time_started"`
	ParticipantsDuration     string     `json:"participants_duration"`
	MessagesSent             int64      `json:"messages_sent"`
	ChatsCount               int        `json:"chats_count"`
	CreatedParticipantsCount int        `json:"created_participants_count"`
}

func gracefulShutdown(om *organizer.Manager, pm *participants.Manager, c *constants) {
	log.Println("starting graceful shutdown")
	om.Stop()
	pm.Stop()

	s := summary{
		Constants:                c,
		Description:              "performance test summary",
		OrganizerTimeStarted:     om.GetTimeStarted(),
		OrganizerDuration:        om.GetDuration().String(),
		ParticipantsTimeStarted:  pm.GetTimeStarted(),
		ParticipantsDuration:     pm.GetDuration().String(),
		ChatsCount:               pm.GetChatsCount(),
		CreatedParticipantsCount: pm.GetParticipantsCount(),
	}

	messageRates := pm.GetMessageRates()
	for _, messagesCount := range messageRates {
		s.MessagesSent += int64(messagesCount)
	}

	summaryJson, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		log.Panicf("error marshaling summary: %v", err)
	}
	log.Println(strings.Repeat("-", 80))
	log.Println(string(summaryJson))

	timePrefix := time.Now().Unix()

	summaryFilename := fmt.Sprintf("%d_performance_test_summary.json", timePrefix)
	summaryFile, err := os.Create(summaryFilename)
	if err != nil {
		log.Panicf("could not create %s: %s", summaryFilename, err)
	}
	defer summaryFile.Close()

	_, err = summaryFile.Write(summaryJson)
	if err != nil {
		log.Panicf("could not write to %s: %s", summaryFilename, err)
	}

	messageRatesJson, err := json.MarshalIndent(pm.GetMessageRates(), "", "  ")
	if err != nil {
		log.Panicf("error marshaling message rates: %v", err)
	}

	messageRatesFilename := fmt.Sprintf("%d_performance_test_message_rates.json", timePrefix)
	messageRatesFile, err := os.Create(messageRatesFilename)
	if err != nil {
		log.Panicf("could not create %s: %s", messageRatesFilename, err)
	}
	defer messageRatesFile.Close()

	_, err = messageRatesFile.Write(messageRatesJson)
	if err != nil {
		log.Panicf("could not write to %s: %s", messageRatesFilename, err)
	}
}
