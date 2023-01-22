package scratches

import (
	"messenger/internal/modules/api"
	"messenger/internal/modules/storage"
)

type Container struct {
	StorageModule *storage.Module
	ApiModule     *api.Module
}
