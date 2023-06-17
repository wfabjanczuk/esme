package organizer

type signInDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type signInResponseDTO struct {
	Token string `json:"token"`
}

type wsAuthorizationDto struct {
	Authorization string `json:"Authorization"`
}

type wsStartChatDto struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}
