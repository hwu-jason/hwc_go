package main

import (
	"html/template"
	"net/http"
)

func handler1(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("Templates/t1.html", "Templates/t2.html")
	t.Execute(w, "Jason")
}

func handler2(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("Templates/t1.html", "Templates/t2.html")
	t.ExecuteTemplate(w, "t2.html", "Golang")
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8000",
	}

	http.HandleFunc("/t1", handler1)
	http.HandleFunc("/t2", handler2)
	server.ListenAndServe()
}
