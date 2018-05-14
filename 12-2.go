package main

import (
	"html/template"
	"io"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("12-2.html") //setp 1
	t.Execute(w, "Hello World!")             //step 2
}

func hwuHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("12-2.html") //setp 1
	t.Execute(w, "Hello HWU!")               //step 2
}

// 處理 request 和 response 的函式
func hello(w http.ResponseWriter, r *http.Request) {
	// 印出 hello world
	io.WriteString(w, "Hello world!")
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8000",
	}
	http.HandleFunc("/view", handler)
	http.HandleFunc("/hwu", hwuHandler)
	http.HandleFunc("/", hello)
	server.ListenAndServe()
}
