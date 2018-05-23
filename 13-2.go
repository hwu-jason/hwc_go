package main

import (
	"fmt"
	"log"
	"net/http"
)

type messageHandler struct {
	message string
}

func (m *messageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, m.message)
}
func main() {
	mux := http.NewServeMux()
	mh1 := &messageHandler{"Welcome to Go Web Development"}
	mh2 := &messageHandler{"net/http is awesome"}
	mux.Handle("/welcome", mh1)
	mux.Handle("/message", mh2)
	log.Println("Listening...")
	http.ListenAndServe(":8000", mux)
}
