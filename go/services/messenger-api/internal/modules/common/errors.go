package common

import "errors"

var ErrChatNotFound = errors.New("chat not found")
var ErrMessageNotCreated = errors.New("message not created")
var ErrMessageNotSent = errors.New("message not sent")
