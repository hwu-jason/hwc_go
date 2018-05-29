package main

//go:generate go build -ldflags -H=windowsgui  -o C:\Users\jason\go\tmp\hwc_go\main.exe  C:\Users\jason\go\tmp\hwc_go\13-3.go
//go:generate go build  install.go
//go:generate go run zip.go

import (
	"archive/zip"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {

	main_path := "C:\\Users\\jason\\go\\tmp\\"
	project_path := "hwc_go\\"

	public_path := "public"
	Templates_path := "Templates"
	bin_path := "main.exe"
	star_path := "start.lnk"
	bat_path := "start_exe.bat"

	// Files to Zip
	files := []string{
		main_path + project_path + bin_path,
		main_path + project_path + public_path,
		main_path + project_path + star_path,
		main_path + project_path + bat_path,
		main_path + project_path + Templates_path}
	output := "hwu"

	err := ZipFiles(output, files)

	if err != nil {
		log.Fatal(err)
	}

	//zip
	//7zr.exe a hwu.7z hwu install.exe

	fmt.Println("Zipped File: " + output)
	out, err := exec.Command("7zr.exe", "a", "hwu.7z", "hwu", "install.exe").Output()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", out)

	//copy /b 7zS.sfx + config.txt + hwu.7z hwu.exe
	fmt.Println("Zipped File: hwu.exe")
	out, err = exec.Command("cmd", "/C", "copy", "/b", "7zS.sfx", "+", "config.txt", "+", "hwu.7z", "hwu.exe").Output()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", out)
	//rm -r hwu.7z hwu
	fmt.Println("Zipped File: hwu.exe")
	out, err = exec.Command("cmd", "/C", "del", "-r", "hwu.7z", "hwu").Output()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", out)
	fmt.Printf("Install Package Finish !\n")
}

// ZipFiles compresses one or many files into a single zip archive file
func ZipFiles(filename string, files []string) error {

	newfile, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer newfile.Close()

	zipWriter := zip.NewWriter(newfile)
	defer zipWriter.Close()

	// Add files to zip
	for _, file := range files {
		//-------------------------------------
		info, err := os.Stat(file)
		if err != nil {
			return nil
		}

		var baseDir string
		if info.IsDir() {
			baseDir = filepath.Base(file)
			// fmt.Println(baseDir)
		}

		filepath.Walk(file, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			header, err := zip.FileInfoHeader(info)
			if err != nil {
				return err
			}
			// fmt.Println(baseDir)
			if baseDir != "" {
				header.Name = filepath.Join(baseDir, strings.TrimPrefix(path, file))
				// header.Name = strings.TrimPrefix(path, file)
				// fmt.Println(header.Name)
				fmt.Print("->")
			}

			if info.IsDir() {
				header.Name += "/"
				// fmt.Println(header.Name)
			} else {
				header.Method = zip.Deflate
			}

			writer, err := zipWriter.CreateHeader(header)
			if err != nil {
				return err
			}

			if info.IsDir() {
				return nil
			}

			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()
			_, err = io.Copy(writer, file)
			return err
		})
		fmt.Println("->")

	}
	return nil
}
