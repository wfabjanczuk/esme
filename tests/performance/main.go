package main

import (
	"log"
	"performance/config"
	"performance/organizer"
	"performance/participants"
)

func main() {
	cfg, err := config.NewConfig("config.json")
	if err != nil {
		log.Panicf("error loading config: %v", err)
	}

	organizerManager := organizer.NewManager(cfg)
	organizerErrChan := organizerManager.GetErrChan()
	err = organizerManager.InitOrganizer()
	if err != nil {
		log.Panicf("error initializing organizer: %v", err)
	}

	participantsManager := participants.NewManager(cfg)
	participantErrChan := participantsManager.GetErrChan()

	//err = participantsManager.AddParticipant()

	for {
		select {
		case err := <-participantErrChan:
			log.Panicf("participant error: %v", err)
		case err := <-organizerErrChan:
			log.Panicf("organizer error: %v", err)
		}
	}
}
