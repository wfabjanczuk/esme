package main

import app2 "participant-api/internal/app"

func main() {
	app := app2.NewApplication()
	app.Bootstrap()
}
