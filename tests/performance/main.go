package main

import (
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

const (
	startChatInterval         = 1 * time.Second
	createParticipantInterval = 1 * time.Second
	sendMessageInterval       = 1 * time.Second
	logWs                     = true
)

func main() {
	var om *organizer.Manager
	var pm *participants.Manager
	defer func() {
		if r := recover(); r != nil {
			gracefulShutdown(om, pm)
		}
	}()

	cfg, err := config.NewConfig("config.json")
	if err != nil {
		log.Panicf("error loading config: %v", err)
	}

	om = organizer.NewManager(cfg, logWs)
	err = om.StartAcceptingChats(startChatInterval)
	if err != nil {
		log.Panicf("error initializing organizer: %v", err)
	}
	log.Println("organizer initialized")

	pm = participants.NewManager(cfg, logWs)
	go pm.StartAddingParticipants(createParticipantInterval, sendMessageInterval)

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

func gracefulShutdown(om *organizer.Manager, pm *participants.Manager) {
	log.Println("starting graceful shutdown")
	om.Stop()
	pm.Stop()

	log.Println(strings.Repeat("-", 80))
	log.Println("performance test summary")
	log.Printf("chats count: %d", pm.GetChatsCount())
	log.Printf("created participants count: %d", pm.GetParticipantsCount())
	log.Printf("created participants count: %d", pm.GetParticipantsCount())
}
