package main

import (
	"log"
	"performance/config"
	"performance/participants"
)

func main() {
	cfg, err := config.NewConfig("config.json")
	if err != nil {
		log.Panicf("error loading config: %v", err)
	}

	participantsManager := participants.NewManager(cfg)
	participantErrChan := participantsManager.GetErrChan()

	err = participantsManager.AddParticipant()

	for {
		select {
		case err := <-participantErrChan:
			log.Panicf("error adding participant: %v", err)
		}
	}
}
