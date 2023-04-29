package enriched_chats

import (
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/participants"
)

type EnrichedChat struct {
	chats.Chat
	Participant *authentication.Participant `json:"participant,omitempty"`
}

type Service struct {
	participantsRepository *participants.Repository
	logger                 *log.Logger
}

func NewService(participantsRepository *participants.Repository, logger *log.Logger) *Service {
	return &Service{
		participantsRepository: participantsRepository,
		logger:                 logger,
	}
}

func (s *Service) EnrichWithParticipant(chats []*chats.Chat) []*EnrichedChat {
	enrichedChats := make([]*EnrichedChat, 0, len(chats))
	if len(chats) == 0 {
		return enrichedChats
	}

	participantIds := make([]int32, 0, len(chats))
	for _, chat := range chats {
		participantIds = append(participantIds, chat.ParticipantId)
	}

	participantsMap, err := s.participantsRepository.FindByIds(participantIds)
	if err != nil {
		s.logger.Printf("could not enrich chats: %s", err)
	}

	for _, chat := range chats {
		enrichedChats = append(
			enrichedChats, &EnrichedChat{Chat: *chat, Participant: participantsMap[chat.ParticipantId]},
		)
	}
	return enrichedChats
}
