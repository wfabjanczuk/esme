package vault

import "fmt"

type Queue struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
}

func (q Queue) GetDsn() string {
	return fmt.Sprintf(
		"amqp://%s:%s@%s:%d",
		q.User,
		q.Password,
		q.Host,
		q.Port,
	)
}

type MessengerApi struct {
	Host string `json:"host"`
	Port int    `json:"port"`
}

func (m MessengerApi) GetUrl() string {
	return fmt.Sprintf(
		"http://%s:%d",
		m.Host,
		m.Port,
	)
}

func (m MessengerApi) GetWs() string {
	return fmt.Sprintf(
		"ws://%s:%d",
		m.Host,
		m.Port,
	)
}

type MessengerDb struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
}

func (m MessengerDb) GetDsn() string {
	return fmt.Sprintf(
		"mongodb://%s:%s@%s:%d",
		m.User,
		m.Password,
		m.Host,
		m.Port,
	)
}

type OrganizerApi struct {
	Host               string `json:"host"`
	Port               int    `json:"port"`
	JwtSecret          string `json:"jwt_secret"`
	ApiKey             string `json:"api_key"`
	SuperAdminEmail    string `json:"super_admin_email"`
	SuperAdminPassword string `json:"super_admin_password"`
}

func (o OrganizerApi) GetUrl() string {
	return fmt.Sprintf(
		"http://%s:%d",
		o.Host,
		o.Port,
	)
}

type OrganizerDb struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	DbName   string `json:"db_name"`
	User     string `json:"user"`
	Password string `json:"password"`
}

type ParticipantApi struct {
	Host      string `json:"host"`
	Port      int    `json:"port"`
	JwtSecret string `json:"jwt_secret"`
	ApiKey    string `json:"api_key"`
}

func (p ParticipantApi) GetUrl() string {
	return fmt.Sprintf(
		"http://%s:%d",
		p.Host,
		p.Port,
	)
}

type ParticipantDb struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	DbName   string `json:"db_name"`
	User     string `json:"user"`
	Password string `json:"password"`
}

func (p ParticipantDb) GetDsn() string {
	return fmt.Sprintf(
		`"host=%s port=%d dbname=%s user=%s password=%s"`,
		p.Host,
		p.Port,
		p.DbName,
		p.User,
		p.Password,
	)
}
