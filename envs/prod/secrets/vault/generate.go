package vault

import (
	"github.com/sethvargo/go-password/password"
	"log"
	"math/rand"
	"time"
)

var randomness = rand.New(rand.NewSource(time.Now().UnixNano()))

func generateString(length int, includeDigits bool) string {
	numDigits := 0
	if includeDigits {
		numDigits = randomness.Intn(length / 3)
	}

	s, err := password.Generate(length, numDigits, 0, false, true)
	if err != nil {
		log.Panicf("could not generate string: %s", err)
	}

	return s
}
