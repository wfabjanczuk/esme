package main

import "log"

func main() {
	hostsFilename := "hosts.json"
	hosts, err := readHosts(hostsFilename)
	if err != nil {
		log.Panicf("addresses of hosts could not be read: %s", err)
	}

	log.Println(hosts)
}
