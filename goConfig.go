package main

import (
	"github.com/Unknwon/goconfig"
	"log"
)

func main() {

	//Load conifg
	cfg, err := goconfig.LoadConfigFile("conf.ini")
	if err != nil {
		log.Fatalf("Can't load conf.ini", err)
	}

	/*
		cfg, err := goconfig.LoadConfigFile("conf.ini", "conf_user.ini")
		if err != nil {
			log.Fatalf("Can't load conf.ini", err)
		}

		err = cfg.AppendFiles("conf_other.ini")
		if err != nil {
			log.Fatalf("Can't append file", err)
		}

		//Get Value
		value, err := cfg.GetValue("other", "key1")
		if err != nil {
			log.Fatalf("Can't get Value(%s) %s", "other", err)
		}
		log.Printf("%s > %s: %s", "other", "key1", value)
	*/
	//Get Value
	value, err := cfg.GetValue(goconfig.DEFAULT_SECTION, "key_default")
	if err != nil {
		log.Fatalf("Can't get Value(%s) %s", "key_default", err)
	}
	log.Printf("%s > %s: %s", goconfig.DEFAULT_SECTION, "key_default", value)

	//Get Value
	value, err = cfg.GetValue("dir.Go", "name")
	if err != nil {
		log.Fatalf("Can't get Value(%s) %s", "dir.Go", err)
	}
	log.Printf("%s > %s: %s", "dir.Go", "name", value)

	//Get Value
	value, err = cfg.GetValue("", "search")
	if err != nil {
		log.Fatalf("Can't get Value(%s) %s", "search", err)
	}
	log.Printf("%s > %s: %s", "", "search", value)

	//Get section
	sec, err := cfg.GetSection("courses")
	if err != nil {
		log.Fatalf("Can't get section(%s) %s", "courses", err)
	}
	log.Println(sec)

	//Get config new value retrun true else retrun false
	isInsert := cfg.SetValue(goconfig.DEFAULT_SECTION, "key_default", "new value")
	if err != nil {
		log.Fatalf("Can't set Value(%s) %s", "key_default", err)
	}
	log.Printf("set Value : %s insert value: %v ", "key_default", isInsert)

	//get section comment
	comment := cfg.GetSectionComments("courses")
	log.Printf("courses comment : %s", comment)
	//get key comment
	comment = cfg.GetKeyComments(goconfig.DEFAULT_SECTION, "key_default")
	log.Printf("key_default comment : %s", comment)

	//set section comment
	v := cfg.SetSectionComments("courses", "# This is a comment")
	log.Printf("%s comment : %v ", "coruses", v)

	//get int
	vInt, err := cfg.Int("dir", "int")
	if err != nil {
		log.Fatalf("Can't get int(%s) %s", "dir", err)
	}
	log.Printf("%s int : %v ", "dir", vInt)

	//get MustBool
	vbool := cfg.MustBool("dir", "bool")
	log.Printf("%s bool : %v ", "dir", vbool)

	//get MustBool
	vbool = cfg.MustBool("dir", "bool404")
	log.Printf("%s bool : %v ", "dir", vbool)

	//del key
	ok := cfg.DeleteKey("dir", "bool")
	log.Printf("del key = %v", ok)

	//save ini
	err = goconfig.SaveConfigFile(cfg, "conf_save.ini")
	if err != nil {
		log.Fatalf("Can't Save Config Data(%s) %s", cfg, err)
	}

}
