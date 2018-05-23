// Do the layout
//	@param szPipe:String - The pipe command of string. Each command would be separated by the character "|".
//                         The default command is "", e.g.: "|", or "|theSecCmd|". It always has a "|" in pipe.
//	@return:Void
_root.layout=function(szPipe) {

	// Get layout elements
	var divHeader 	= document.getElementById("header");
	var divMenu 	= document.getElementById("menu");

	var divMenu1	= document.getElementById("menu1");
	var divMenu2	= document.getElementById("menu2");

	var divNav		= document.getElementById("nav");
	var divMain		= document.getElementById("main");
	var divToolbar	= document.getElementById("toolbar");

	var divColHeader = document.getElementById("colHeader");
	var divMainBack = document.getElementById("nav_main_frame");
	if(isExist(divColHeader))
		Ext.get(divColHeader).addClass("displayNone");


	if(!isExist(divHeader))
		_global.debug("globalFunctions.js", "In function \"layout\", #header doesn't exist");
	if(!isExist(divMenu))
		_global.debug("globalFunctions.js", "In function \"layout\", #menu doesn't exist");
	if(!isExist(divNav))
		_global.debug("globalFunctions.js", "In function \"layout\", #nav doesn't exist");
	if(!isExist(divMain))
		_global.debug("globalFunctions.js", "In function \"layout\", #main doesn't exist");
	if(!isExist(divToolbar))
		_global.debug("globalFunctions.js", "In function \"layout\", #toolbar doesn't exist");
	if(!isExist(divMainBack))
		_global.debug("globalFunctions.js", "In function \"layout\", #nav_main_frame doesn't exist");

	// Get width and height of client area
	var dwClient=getClientArea();
	var	dwClientY = dwClient[1];
		dwClientX = dwClient[0];

	// Define heigh
	var borderOffset = 3;
	var paddingOffset = 5;
	var hHeader = 70; // Total height - border size
	var hNav = 38;
	var hToolbar = 68;

	// Define width
//	var wMenu = 269;
	var wMenu = 291;

	// Global Template
	// #header
	setSize(divHeader, null, hHeader);

	// #menu
	setSize(divMenu, wMenu, dwClientY-hHeader);
	divMenu.style.top = hHeader+"px";

	// #menu1,2
	setSize(divMenu1, null, dwClientY-hHeader);
	setSize(divMenu2, null, dwClientY-hHeader);

//	var hArrows = 79; // Up and down buttons in menu 2
	var hArrows = 107; // Up and down buttons in menu 2
//	var hArrowsWO = 31;
	var hArrowsWO = 45;
//	var hArrowsWO = 59;
	var con2 = get("divMenu2Content");
	if(getHeight(get("divMenu2Content")) > getHeight(get("menu2"))){
		setSize(_root.get("divMenu2ContentMask"), null, dwClientY-hHeader-hArrows);
		showElement(get("divMenu2Top"));
		get("divMenu2Top").style.display = "block";
		showElement(get("divMenu2Bottom"));
		get("divMenu2Bottom").style.display = "block";
	}else{
		setSize(_root.get("divMenu2ContentMask"), null, dwClientY-hHeader-hArrowsWO);
		hideElement(get("divMenu2Top"));
		hideElement(get("divMenu2Bottom"));
	}

// Update-By-Eddie-20131111-Start
//	if(getHeight(get("divMenu1Content")) > getHeight(get("menu1"))){
	if(document.getElementById('divMenu1Content').clientHeight > getHeight(get("menu1"))){
// Update-By-Eddie-20131111-End
		setSize(_root.get("divMenu1ContentMask"), null, dwClientY-hHeader-hArrows);
		showElement(get("divMenu1Top"));
		get("divMenu1Top").style.display = "block";
		showElement(get("divMenu1Bottom"));
		get("divMenu1Bottom").style.display = "block";
	}else{
		setSize(_root.get("divMenu1ContentMask"), null, dwClientY-hHeader-hArrowsWO);
		hideElement(get("divMenu1Top"));
		hideElement(get("divMenu1Bottom"));
		_root.get("divMenu1Content").style.marginTop = 0 + "px";
	}
	divMenu1.style.top = "31px";
	divMenu2.style.top = "31px";
	divMenu1.style.left = 0 + "px";
	divMenu2.style.left = 155 + "px";


	// #nav
	var wTabs = _root.getWidth(_root.get("tabs")); // The div "tabs" is created by init.js
	//will add
	if(divNav != null)
	{
		setSize(divNav, dwClientX-wMenu-wTabs, hNav);
		divNav.style.top = hHeader+"px";
		divNav.style.left = wMenu+"px";
	}
	// #main
	setSize(divMain, dwClientX-wMenu, dwClientY-hHeader-hToolbar-hNav);

	divMain.style.top=(hHeader+hNav)+"px";
	divMain.style.left=wMenu+"px";
	if(divMainBack != null){
		setSize(divMainBack, dwClientX-wMenu, dwClientY-hHeader-hToolbar);
		divMainBack.style.top=(hHeader)+"px";
		divMainBack.style.left=wMenu+"px";
	}
	// #toolbar
	setSize(divToolbar, dwClientX-wMenu, hToolbar);
	divToolbar.style.bottom = "0px";
	divToolbar.style.left = wMenu+"px";

	// If there's no adjustment, return control point right now.
	if(!isExist(szPipe)) return;

	// Parse commands, and adjust it.
	var arrPipe = szPipe.split("|");
	for(var i=0; i<arrPipe.length-1; i++){
		switch(arrPipe[i].toLowerCase()){
		// Pages template
		case "setting":
			// Get views
			var elCol1 = document.getElementById("col1");
			var elCol2 = document.getElementById("col2");
			var elCol3 = document.getElementById("col3");
			var elColHeader = document.getElementById("colHeader");

			// Show elements
			hideElement(elColHeader);
			hideElement(get("col3"));
			hideElement(get("col4"));
			hideElement(get("col5"));
			showElement(elCol1);
			showElement(elCol2);

			// Build col1 and col2
			var wCol1 = 260;
			setSize(elCol1, wCol1, getAbsHeight(divMain));
			setSize(elCol2, getAbsWidth(divMain)-wCol1, getAbsHeight(divMain));
			break;

		case "col2only":
			// Get views
			var elCol1 = document.getElementById("col1");
			var elCol2 = document.getElementById("col2");
			var elCol3 = document.getElementById("col3");
			var elCol4 = document.getElementById("col4");
			var elCol5 = document.getElementById("col5");

			hideElement(get("colHeader"));
			hideElement(elCol1);
			hideElement(elCol3);
			hideElement(elCol4);
			hideElement(elCol5);
			showElement(elCol2);

			// Build col2
			setSize(elCol2, getAbsWidth(divMain), getAbsHeight(divMain));
			break;

		case "login":
			// Hide menu
			var logDiv = document.getElementById("loginPageDiv");
			var ballDiv = document.getElementById("divBall");
			hideElement(get("menu"));
			var loginTop = 35;
			var arrCols = new Array();
			for(var i=1; i<=5; i++)
				arrCols.push(document.getElementById("col"+i));

			var elColHeader = document.getElementById("colHeader");

			// Remove sub-header in div "Main"
			hideElement(elColHeader);

			// Hide navigation
			hideElement(get("nav"));

			// Move main and resize
			divMain.style.left = "";
			divMain.style.top = "";
			setChomeSize(divMain, 1180, 575);
			var x = divMain.offsetLeft + 700;
			var y = divMain.offsetTop + 230;
			logDiv.style.left = x+"px";
			logDiv.style.top = y+"px";
			ballDiv.style.top = '0';
			ballDiv.style.left = x+'px';
			// Expand col1
			(new Ext.Element(arrCols[0])).applyStyles("border:0px");
			setSize(arrCols[0], dwClientX, getAbsHeight(divMain));
			showElement(arrCols[0]);
			var bgY = 0-((452 - getAbsHeight(arrCols[0]))/2);
			arrCols[0].style.backgroundPosition = "0px " + bgY + "px";

			// Move image in col1
			var elStyle = get("col1Img").style;
			elStyle.top = bgY + "px";
			var bgX = 0-((1018 - getAbsWidth(arrCols[0]))/2);
			elStyle.left = bgX + "px";

			// Hide col 2-5
			for(var i=0; i<=4; i++)
				setSize(arrCols[i],0,0);

			// Move toolbar and resize
			setSize(divToolbar, dwClientX, null);
			divToolbar.style.left = "0px";

			break;

		case "login2":
			var arrCols = new Array();
			for(var i=1; i<=5; i++)
				arrCols.push(document.getElementById("col"+i));

			var elColHeader = document.getElementById("colHeader");
			var logDiv = document.getElementById("loginPageDiv");
			var ballDiv = document.getElementById("divBall");
			// Remove sub-header in div "Main"
			hideElement(elColHeader);

			// Hide navigation
			hideElement(get("nav"));

			// Move main and resize
			divMain.style.top = "";
			divMain.style.left = "";
			setChomeSize(divMain, 1325, 635);
			var x = divMain.offsetLeft + 844;
			var y = divMain.offsetTop + 285;
			logDiv.style.left = x+"px";
			logDiv.style.top = y+"px";
			// ballDiv.style.top = '0';
			ballDiv.style.left = x+'px';
			// Expand col1
			(new Ext.Element(arrCols[0])).applyStyles("border:0px");
			setSize(arrCols[0], getAbsWidth(divMain), getAbsHeight(divMain));
			showElement(arrCols[0]);
			var bgY = 0-((452 - getAbsHeight(arrCols[0]))/2);
			arrCols[0].style.backgroundPosition = "0px " + bgY + "px";

			// Move image in col1
			var elStyle = get("col1Img").style;
			elStyle.top = bgY + "px";
			var bgX = 0-((1018 - getAbsWidth(arrCols[0]))/2);
			elStyle.left = bgX + "px";

			// Hide col 2-5
			for(var i=1; i<=4; i++)
				setSize(arrCols[i],0,0);

			// Move toolbar and resize
			//setSize(divToolbar, dwClientX, null);
			//divToolbar.style.left = "0px";
			break;

		
		case "paging":
		case "pages":
			// Adjust navigation bar to the top
//			divNav.style.top="0";

			// Adjust main block to near bottom the navigation bar, and resize it
//			divMain.style.top=hNav+"px";
//			setSize(divMain, null, dwClientY-hNav-hToolbar);

			// Get views
			var elCol1 = _root.get("col1");
			var elCol2 = _root.get("col2");
			var elCol3 = _root.get("col3");
			var elCol4 = _root.get("col4");
			var elCol5 = _root.get("col5");
			var elColHeader = document.getElementById("colHeader");

			// Show elements
			hideElement(elCol1);
			showElement(elCol2);
			showElement(elCol3);
			showElement(elCol4);
			showElement(elCol5);
//			showElement(elColHeader);

			// Build width
			// var wCol2 = 210;
			var wCol2 = 260;
			var wCol4 = 210;
			var hColHeader = 0;
			setSize(elCol2, wCol2, getAbsHeight(divMain)-hColHeader);
			setSize(elCol4, wCol4, getAbsHeight(divMain)-hColHeader);
			setSize(elCol3, getAbsWidth(divMain)-wCol2-wCol4, getAbsHeight(divMain)-hColHeader);
			setSize(elColHeader, getAbsWidth(divMain), hColHeader);


			// Extend the columns
			var msg1H = getHeight(get("divMsgHeader"));
			//var msg2H = getHeight(get("divMainMessage"))-(get("col2Padding")!=null?getHeight(get("col2Padding")):0);
			var msg2H = getHeight(get("divMainMessage"))-getHeight(get("col2Padding"));
			var col2H = getAbsHeight(elCol2);
			if(msg1H + msg2H >= col2H) setSize(get("col2Padding"), null, 0);else
				setSize(get("col2Padding"), null, col2H-msg1H-msg2H);

			//alert(col2H-msg1H-msg2H-19);

			var c41H = getHeight(get("blockQueueServer"));
			var c42H = getHeight(get("blockAckRequirement"));
			var c43H = getHeight(get("blockPageRequirement"))-getHeight(get("col4Padding"));
			var col4H = getAbsHeight(elCol4);
			if(c41H + c42H + c43H >= col4H);else
				setSize(get("col4Padding"), null, col4H-(c41H + c42H + c43H));

			break;

		case "pagebygprs":
			// Adjust navigation bar to the top
//			divNav.style.top="0";

			// Adjust main block to near bottom the navigation bar, and resize it
//			divMain.style.top=hNav+"px";
//			setSize(divMain, null, dwClientY-hNav-hToolbar);

			// Get views
			var elCol1 = _root.get("col1");
			var elCol2 = _root.get("col2");
			var elCol3 = _root.get("col3");
			var elCol4 = _root.get("col4");
			var elCol5 = _root.get("col5");
			var elColHeader = document.getElementById("colHeader");

			// Show elements
			hideElement(elCol1);
			showElement(elCol2);
			showElement(elCol3);
			showElement(elCol4);
			showElement(elCol5);
//			showElement(elColHeader);




			// Build width
			// var wCol2 = 210;
			var wCol2 = 260;
			var wCol4 = 260;
			var hColHeader = 0;
			setSize(elCol2, wCol2, getAbsHeight(divMain)-hColHeader);
			setSize(elCol4, wCol4, getAbsHeight(divMain)-hColHeader);
			setSize(elCol3, getAbsWidth(divMain)-wCol2-wCol4, getAbsHeight(divMain)-hColHeader);
			setSize(elColHeader, getAbsWidth(divMain), hColHeader);




			break;
		case "widescreen":
			// Get views
			var elCol1 = _root.get("col1");
			var elCol2 = _root.get("col2");
			var elCol3 = _root.get("col3");
			var elCol4 = _root.get("col4");
			var elCol5 = _root.get("col5");
			showElement(elCol1);
			showElement(elCol2);
			showElement(elCol3);
			hideElement(elCol4);
			hideElement(elCol5);
			hideElement(divMenu);
			//will add
			if(divNav != null)
			{
				showElement(divNav);
			}
			var dwCol1 = 275;
			var dwCol3H = 40;

			//will add
			if(divNav != null)
			{
				var dwAvaHeight = dwClientY - hHeader - hToolbar -hNav;
			}
			else
			{
				var dwAvaHeight = dwClientY - hHeader - hToolbar;
			}

			// Move main and resize
			//will add
			if(divNav != null)
			{
				divMain.style.left = "0px";
				divMain.style.top = hHeader + hNav + "px";
				divMain.style.backgroundImage = "url(language_pack/{{Config::get('app.locale')}}/images/welcome_rep_bg.jpg)";
				setSize(divMain, dwClientX, dwAvaHeight);
			}
			else
			{
				divMain.style.left = "0px";
				divMain.style.top = hHeader + "px";
				divMain.style.backgroundImage = "url(language_pack/{{Config::get('app.locale')}}/images/welcome_rep_bg.jpg)";
				setSize(divMain, dwClientX, dwAvaHeight);
			}
			//will add
			if(divNav != null)
			{
				divNav.style.left = "0px";
				setSize(divNav, dwClientX, null);
			}
			elCol1.style.left = "0px";;
			elCol1.style.overflowY = "scroll";
			setSize(elCol1, dwCol1, getAbsHeight(divMain));

			elCol2.style.left = getWidth(elCol1) + "px";
			elCol2.style.backgroundColor = "transparent";
			elCol2.style.color = "#FFFFFF";
			setSize(elCol2, getAbsWidth(divMain)-dwCol1, getAbsHeight(divMain));

			/*
			elCol3.style.position = "relative";
			elCol3.style.left = "0px";
			elCol3.style.top = "0px";
			elCol3.style.bottom = "";
			elCol3.style.textAlign = "right";
//			elCol3.style.backgroundColor = "transparent";
*/
			// setSize(elCol3, getAbsWidth(divMain)-dwCol1, dwCol3H);

			divToolbar.style.left = "0px";
			setSize(divToolbar, dwClientX, null);
			break;
		case "levelone":
//			var w1 = 150;
			var w1 = 369;
			var w = 118;
			var el = get("nav");
			setSize(el, getWidth(el)+w-3, null);
			el.style.left = w1 + "px";
			el = get("main");
			setSize(el, getWidth(el)+w, null);
			el.style.left = w1 + "px";
			el = get("toolbar");
			setSize(el, getWidth(el)+w, null);
			el.style.left = w1 + "px";
			hideElement(get("menu2"));
//			setSize(get("menu"),150,null);
			setSize(get("menu"),w1,null);
			//get("menu").style.borderRight = "3px solid #1c3b4f";
			// get("imgMenuTitleLeft").src="language_pack/{{Config::get('app.locale')}}/images/menu-paddingTop.jpg";
			get("imgMenuTitle").src="language_pack/{{Config::get('app.locale')}}/images/menu-paddingTop.jpg";
			var divMainBack = document.getElementById("nav_main_frame");
			if(divMainBack != null){
				setSize(divMainBack, getWidth(divMainBack)+w, null);
				divMainBack.style.left=w1+"px";
			}
			break;
		default:
			_global.debug("globalFunctions.js", "In function \"layout\", The pipe command doesn't match any condition.");
		}// switch
	}// for
}