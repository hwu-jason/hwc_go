// #ifdef _GLOBAL_PARAMS
try{if(_GLOBAL);
}catch(e){
// #define
_GLOBAL = true;
/**	Global namespace object is the controller of all the flowchart in Pager Console Web Page
 *	@namespace
 */

/* Structure _global:
  		- Attributes:
			m_arrLayoutStack:Array - To contain the layout functions
			m_arrReadyStack:Array - To contain the ready functions
			m_divDebug:Element - The element of debug div(Exists if _debug is true)
 			m_dwErrorCount:Integer - For counting errors
			m_szLayoutParam:String - The pipe commands for layout

		- Methods:
			addLayoutFunc(func):Void - Add a behavior function for layout
				@param func:Function - A function call for layout

			debug(file, text):Void - For debug usage
				@param file:String - The file occurs error
				@param text:String - The display text

			doLayout():Void - Do the layout according layout pipe
			doReady():Void - Do the ready stack. It might be called by Ext.onReady.

			layoutPipe(szCommand):Void - Add a layout command to layout pipe.
				@param szCommand:String - The pipe layout command

			onReady(func):Void - Add a workflow function to ready stack. When API(Ext JS) is ready,
			                     it will call "doReady" to do all the workflows in the stack.
				@param func:Function - A function call for ready stack

			setExtLang(szLang):Void - Change language of Ext JS components
				@param szLang:String - The langage's name
 */
var _global = new Object();
	_global.m_arrInterval = Array();
	_global.m_gpsInterval = Array();
	_global.m_arrLayoutStack = Array();
	_global.m_arrLoadingStack = Array();
	_global.m_arrReadyStack = Array();
	_global.m_arrGridStack = Array();
	_global.m_bFirstInstall = false;
	_global.m_divDebug = null;
	_global.m_dwErrorCount = 0;
	_global.m_dwStartPage = 1;
	_global.m_dwFunction = "";
	_global.m_szLayoutParam = "";
	_global.m_trackStatus = false;
	_global.m_startTracking = false;
	_global.is_have_g1rcvs = false;
	_global.funcName = null;
	_global.funcPage = {};
	_global.windowopen = [];
	_global.currentFunc = Array();
	_global.m_arrVarName = Array();
	_global.m_arrFuncName = Array();
	_global.m_arrFuncOjbStack = Array();
// console.log("image====="+_rootLang.getImagesPath()+"lang======"+_rootLang.getLanguagePath());

// document.write('<script type="text/javascript" src="'+_rootLang.getLanguagePath()+'lang.js"></script>');
_global.clearExtCmp = function(){
	Ext.ComponentMgr.all.filterBy(function(c){
		if(typeof c !== 'undefined' || c != null){
			if(c.id=='ext-comp-1001'){
				return;
			}
		}
		if(typeof c !== 'undefined' && typeof c.getXType() !== 'undefined'){
			try{
				c.destroy();	
			}catch(e){
				console.log(c);
			}finally {
				return;
			}
			
		}
	});
	if(Ext.ComponentMgr.all.length > 1)
		this.clearExtCmp();
	// for(var i=0; i < _global.m_arrVarName.length; i++){
	// 	if(typeof window[_global.m_arrVarName[i]] === 'object'){
	// 		console.log('destroy ', _global.m_arrVarName[i]);
	// 		if(window[_global.m_arrVarName[i]] != null){
	//             if(typeof window[_global.m_arrVarName[i]].destroy !== 'undefined'){
	//                 window[_global.m_arrVarName[i]].destroy();
	//             }
	// 		}
	//     }
	// }	
}

_global.clearExtEl = function(){
	for (var i = 0; i < this.m_arrFuncOjbStack.length; i++) {
		_root[this.m_arrFuncOjbStack[i]] = undefined;
		delete _root[this.m_arrFuncOjbStack[i]];
	};
	for (var i = 0; i < this.m_arrGridStack.length; i++) {
		_root[this.m_arrGridStack[i]] = undefined;
		delete _root[this.m_arrGridStack[i]];
	};
	this.m_arrFuncOjbStack.length = 0;
	this.m_arrGridStack.length = 0;
	this.clearExtCmp();
}

_global.clearScript = function(){
	_global.clearExtCmp();
    var el;
    for (el in Ext.elCache) {
        Ext.elCache[el] = undefined;
        delete Ext.elCache[el];
    }
	for (var i = 0; i < this.m_arrFuncName.length; i++) {
		_root[this.m_arrFuncName[i]] = undefined;
		delete _root[this.m_arrFuncName[i]];
	};
	for (var i = 0; i < this.m_arrVarName.length ; i++){
        if(typeof _root[this.m_arrVarName[i]] !== 'undefined'){
			_root[this.m_arrVarName[i]] = undefined;
			delete _root[this.m_arrVarName[i]];        	
        }
	}
	for(var i = 0 ; i < _global.m_arrInterval.length ; i++){
		clearInterval(_global.m_arrInterval[i]);
	}
	for(var i = 0 ; i < _global.m_gpsInterval.length ; i++){
		clearInterval(_global.m_gpsInterval[i]);
	}	
	for(var i = 0 ; i < _global.windowopen.length ; i++){
		_global.windowopen[i].close();
	}
	_global.windowopen.length = 0;
	this.m_arrFuncName.length = 0;
	this.m_arrVarName.length = 0;
	_global.m_gpsInterval.length = 0;
	this.m_arrInterval.length = 0;
	this.m_arrLayoutStack.length = 0; 
	// this.m_arrReadyStack.length = 0;
}

_global.addInterval = function(fn,time){
	var fn_id = setInterval(fn,time);
	this.m_arrInterval.push(fn_id);
}
_global.addFuncName = function(fnname){
	_global.m_arrFuncName.push(fnname);
}

_global.addVarName = function (vname){
	_global.m_arrVarName.push(vname);
}

_global.addFunction = function(szFuncName, func){
	if( _root.isExist(_root[szFuncName]))
		_global.debug("global.js", "In function \"addFunction\", function \""+szFuncName+"\" existed already");
	else
		_global.m_arrFuncName.push(szFuncName);
		_root[szFuncName] = function(param1, param2, param3, param4, param5, param6, param7, param8){
			return func(param1, param2, param3, param4, param5, param6, param7, param8);
		};
};

_global.addLayoutFunc = function (func){
	this.m_arrLayoutStack.push(func);
	if(Ext.isIE)
		document.body.onresize=function(){_global.doLayout();};
	else
		window.onresize = function(){_global.doLayout();};	
};

_global.addGrid = function(gridname){
	this.m_arrGridStack = gridname.split(',');
}

/*
_global.doExtLang = function () {
	switch(_root._language.toLowerCase()){
	case "zh-tw":
		_root.setLangTW();
		break;
	}
}
*/

_global.doLayout = function () {
//	_root.fixSize();
	if (this.m_szLayoutParam.length > 0) {
		_root.layout(this.m_szLayoutParam);
	};

	// Do the layout behaviors in layout stack.
	for(var i=0; i<this.m_arrLayoutStack.length; i++)
		this.m_arrLayoutStack[i]();
};

_global.doDemoLayout = function(){
	// Do the layout behaviors in layout stack.
	for(var i=0; i<this.m_arrLayoutStack.length; i++)
		this.m_arrLayoutStack[i]();	
}

_global.doReady = function () {
	this.checkIsFirst();

	// Do the ready stack
	for(var i=0; i<this.m_arrReadyStack.length; i++)
		this.m_arrReadyStack[i]();



	// Do the layout
	this.doLayout();

	// if( navigator.userAgent.toLowerCase().indexOf("firefox") != -1 ){
	// 	window.onclick = function(event){
	// 		if(event.button == 2)
	// 			window.alert(_lang.NoRightClick);
	// 		if(event.button == 3)
	// 			window.alert(_lang.NoRightClick);
	// 	}
	// 	window.oncontextmenu = function(){return false;};
	// }else{
	// 	document.onmousedown= function(){
	// 		if(event.button == 2)
	// 			alert(_lang.NoRightClick);
	// 		if(event.button == 3)
	// 			alert(_lang.NoRightClick);
	// 	};
	// 	document.oncontextmenu = function(){return false;};
	// }
//	alert("Layout Re-Building, some functions will work failed. (BY YUEN)");

	//will add for detail
	// _global.setDetail();
};

_global.layoutPipe = function (szCommand){
	this.m_szLayoutParam += (szCommand + "|");
};

_global.onReady = function(func){
	this.m_arrReadyStack.push(func);
};

// define debug console
_global.debug = function (file, text){
	if(!_debug) return;

	if(this.m_divDebug=="undefined"||this.m_divDebug==null){
		this.m_divDebug = document.createElement("div");
		this.m_divDebug.className = "debug";
		this.m_divDebug.style.bottom = "0";
		var eltitle = document.createElement("div");
		eltitle.className="title";
		eltitle.innerHTML=_lang.DebugMsg;
		eltitle.onclick = function(){
			if(_global.m_divDebug.style.bottom=="0px")
				_global.m_divDebug.style.bottom = (_global.m_divDebug.offsetHeight*(-1)+eltitle.offsetHeight)+"px";
			else
				_global.m_divDebug.style.bottom = "0px";
		}
		this.m_divDebug.appendChild(eltitle);
		document.body.appendChild(this.m_divDebug);
	}
	var elMsg = document.createElement("div");
	var elFile = document.createElement("div");
	var elCnt  = document.createElement("div");
	elMsg.className = "msg";
	elFile.className = "infile";
	elCnt.className = "content";
	elFile.innerHTML = "(" + ++this.m_dwErrorCount + ") " + _lang.InFile +" \"" + file + "\"";
	elCnt.innerHTML = text;
	elMsg.appendChild(elFile);
	elMsg.appendChild(elCnt);
	this.m_divDebug.appendChild(elMsg);
};


_global.initHelp = function () {
	var imgBnHelp = _root.get("imgBnHelp");
	Ext.get(imgBnHelp).removeClass("displayNone");
	imgBnHelp.setAttribute("clickCount", 0);
	imgBnHelp.onclick = function(){
		var clickCount = parseInt(imgBnHelp.getAttribute("clickCount"));
		if(clickCount%2==0){
			_global.showHelp();
			_global.m_trackStatus = _global.m_startTracking;
			_global.m_startTracking = false;
		}else{
			_global.hideHelp();
			_global.m_startTracking = _global.m_trackStatus;
			if(_global.m_startTracking)
				_root.startTracking();
		}
	};

};

_global.setDetail = function(){
	//modify Safari/Chrome by Roth since nav_main_frame

	var isIE = navigator.userAgent.search("MSIE") > -1;
   	var isFirefox = navigator.userAgent.search("Firefox") > -1;
   	var isSafari = navigator.userAgent.search("Safari") > -1;
    if (isIE) {
    	if(_root.get("detail") != null)
    	{
    		if(_root.get("menu2").style.visibility == "hidden")	//only menu1
    		{
    			if((_root.get("col1").scrollHeight - _root.get("col1").style.pixelHeight)<= 0)	//no scorll bar
				{
					_root.get("detail").style.width="269px";
					_root.get("detail").style.right="0px";
				}
				else
				{
					_root.get("detail").style.right="17px";
				}

    		}
    		else
    		{
		    	if((_root.get("col1").scrollHeight - _root.get("col1").style.pixelHeight)<= 0)	//no scorll bar
				{
					_root.get("detail").style.width="269px";
					_root.get("detail").style.right="3px";
				}
			}

			if(_root.get("toolbar").style.visibility == "hidden")	//for no toolbar
			{
				_root.get("detail").style.bottom="3px";
			}

			if(_root.get("col1").style.visibility == "hidden") 		//for no col1
			{
				_root.get("detail").style.visibility="hidden";		//hide detail
			}
		}
    }
    if (isFirefox) {
    }
    if (isSafari) {
    	if(_root.get("detail") != null)
    	{
    		if(_root.get("menu2").style.visibility == "hidden")	//only menu1
    		{
    			if((_root.get("col1").scrollHeight - _root.get("col1").style.pixelHeight)<= 0)	//no scorll bar
				{
    				//console.log("WHAT");
					_root.get("detail").style.width="269px";
					_root.get("detail").style.right="17px";
				}
				else
				{
					_root.get("detail").style.width="249px";
		    		_root.get("detail").style.right="33px";
				}

    		}
    		else
    		{

	    		if((_root.get("col1").scrollHeight - _root.get("col1").style.pixelHeight)<= 0)	//no scorll bar
				{
					_root.get("detail").style.width="269px";
					_root.get("detail").style.right="16px";
				}
				else
				{
		    		_root.get("detail").style.width="249px";
		    		_root.get("detail").style.right="32px";
		    	}
		    }

		    if(_root.get("toolbar").style.visibility == "hidden")	//for no toolbar
			{
				_root.get("detail").style.bottom="3px";
			}

			if(_root.get("col1").style.visibility == "hidden") 		//for no col1
			{
				_root.get("detail").style.visibility="hidden";		//hide detail
			}
    	}
    }

};

_global.showHelp = function(){
	if(_root.DetectFlashVer(8, 0, 0));else{
		_root.messageBox(_lang.noflash, "WARNING");
	}
	_global.helpType = true;
	_global.widthCol1 = _root.getWidth(_root.get("col1"));
	//if(!_root.isExist(_global.tagMain)){
		// Create temoprary div to contain the content in col1 (the content would be restored back while calling _global.hideHelp();
		_global.divTemporaryInstruction = document.createElement("div");
		_global.divTemporaryInstruction.className = "displayNone";
		_global.divTemporaryInstruction.innerHTML = _root.get("col1").innerHTML;

		document.body.appendChild(_global.divTemporaryInstruction);
		//_global.tagMain = document.createElement("div");
		//_global.tagMain.onclick = function(){
		//	_global.hideHelp();
		//};
		//_global.tagMain.innerHTML = " <img src=\""+_rootLang.getImagesPath()+"images/tab_button.jpg\" style=\"margin-top:40%\" />";
		//_global.tagMain.id = "tagMain";
		//_global.tagMain.className = "tagMain";
		//_root.get("main").appendChild(_global.tagMain);
		var temp = _root.get("col1");
		_global.addLayoutFunc( function(){
			if(_global.helpType){
				_root.setSize(_root.get("col1"), _root.getAbsWidth(_root.get("main")), _root.getAbsHeight(_root.get("main")));
				//_root.setSize(_root.get("tagMain"), 32, _root.getAbsHeight(_root.get("main")));
				_global.orgStyle = temp.getAttribute("style");
				var tempsty = temp.getAttribute("style");
				tempsty = tempsty + " float:left;";
				temp.setAttribute("style",tempsty);
				_root.showElement(_root.get("col1"));
				//if(_root.isExist(_root.get("swfbook"))){
				//	var book = _root.get("swfbook");
				//	var fla = book.firstChild.firstChild;
				//	_root.setSize(fla, 885,  470);
					//fla.setAttribute("width", _root.getAbsWidth(_root.get("col1"))*0.95);
					//fla.setAttribute("height", _root.getAbsHeight(_root.get("col1")));
				//}
			}

		});
	//}
	// _root.showElement(_global.tagMain);
	_root.hideElement(_root.get("toolbar"));

	_global.doLayout();
	clickCount++;
	var imgBnHelp = _root.get("imgBnHelp");
	imgBnHelp.src = _rootLang.getImagesPath()+"images/Back.jpg";
	var clickCount = parseInt(imgBnHelp.getAttribute("clickCount"));
	imgBnHelp.setAttribute("clickCount", ++clickCount);
	var flashObj = '<center><div id="swfbook" style="display:inline !important;"><!--[if !IE]> --><object type="application/x-shockwave-flash" data="book.swf" width="886" height="470"><!-- <![endif]-->';
	flashObj+= '<!--[if IE]><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="886" height="470"><param name="movie" value="book.swf" /><!--><!--dgx--><param name="loop" value="true" /><param name="menu" value="false" /><!-- <![endif]-->';
	flashObj+= '<param name="allowScriptAccess" value="always">';
	flashObj+= '<param name="flashvars" value="__startPage='+_global.m_dwStartPage+'&__language='+_root.getImagesPath()+'&__function='+_global.m_dwFunction+'">';
	//flashObj+= '<param name="flashvars" value="__language='+_rootLang.getImagesPath()+'">';
	flashObj+= '<param name="wmode" value="transparent"></param></object></div></center>';
	_root.get("col1").innerHTML = flashObj;
	_global.doLayout();
};

_global.hideHelp = function(){
	_global.helpType = false;

	//try{_root.hideElement(_global.tagMain);}catch(e){}
	var imgBnHelp = _root.get("imgBnHelp");
	imgBnHelp.src = _rootLang.getImagesPath()+"images/header-help.jpg";
	var clickCount = parseInt(imgBnHelp.getAttribute("clickCount"));
	imgBnHelp.setAttribute("clickCount", ++clickCount);
	_root.showElement(_root.get("toolbar"));
	_root.get("col1").setAttribute("style",_global.orgStyle + " background-image: url(images/gridbackground.png); float:right;");
	_root.get("col1").innerHTML = _global.divTemporaryInstruction.innerHTML;
	_global.doLayout();
};

_global.checkIsFirst = function(){
	if(this.m_bFirstInstall == true)
		return;
	var c_name = "visitedPagerConsole";
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  x=x.replace(/^\s+|\s+$/g,"");
	  if (x==c_name) // Visited
	    {
		  return true;
	    }
	}

	var arrFuncnam = window.location.href.split("/");
	var szFuncnam = arrFuncnam[arrFuncnam.length-1];
	var szFuncnam = szFuncnam.split(".")[0];
	//2012-08-16 mark by roth
	//if(szFuncnam.toLowerCase() != "first"){
	//	window.location.href = "first.jsp";
	//}
};

_global.showNewMessage = function() {
	Ext.example.msg(_lang.messageBox.newMsgTitle, _lang.messageBox.newMsgContent);
	var dm = _root.get("divNewMsgIcon");
	_root.showElement(dm);
};

_global.hideNewMessage = function() {
	var dm = _root.get("divNewMsgIcon");
	_root.hideElement(dm);
};
_global.showNewTextMessage = function() {
	Ext.example.msg(_lang.textMessageBox.newMsgTitle, _lang.textMessageBox.newMsgContent);
	var dm = _root.get("divNewTextMsgIcon");
	_root.showElement(dm);
};

_global.hideNewTextMessage = function() {
	var dm = _root.get("divNewTextMsgIcon");
	_root.hideElement(dm);
};
} // #endif