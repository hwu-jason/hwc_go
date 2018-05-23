// #ifdef
try{if(_FUNCTIONS);
}catch(e){
// #define
_FUNCTIONS = true;

/**	The namespace "_root" is reference of _globa_, means that you can call the static functions of 
	_root when the input on clicked. 
 	<p>E.g.: &lt;input onclick="myFunc();" /&gt;, where you've defined _root.myFunc = function () {...}</p>
	@namespace*/
var _root=this;

/** Check the element if exists or not.
 *	@param {Element} el - The input element
 *	@return {Boolean} - true for exists - false otherwise. */
_root.isExist = function(el){return(el=="undefined"||el==null)?false:true;};

/** Get the element with its id
 *	@param {String} id - The id
 *	@return {Element}*/
_root.get = function(id, bExtElement){
	return isExist(bExtElement) ? new Ext.get(id) : document.getElementById(id);
}

/** Ask browser go to the anchor
 *	@param {String} szAnchor - Name of the anchor
 *	@return {Void}*/
_root.go2Anchor = function(szAnchor){
	window.location.hash = "";
	window.location.hash = szAnchor;
}

/**	Get the area of client's browser
 * 	@return {Array&lt;Integer&rt;} value - The first element is width, the second one is height
 */
_root.getClientArea=function(){
	var viewportwidth;
 	var viewportheight;
	
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight 
	if (typeof window.innerWidth != 'undefined')
	 {
		  viewportwidth = window.innerWidth,
		  viewportheight = window.innerHeight
	 }
	 
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	 else if (typeof document.documentElement != 'undefined'
		 && typeof document.documentElement.clientWidth !=
		 'undefined' && document.documentElement.clientWidth != 0)
	 {
		   viewportwidth = document.documentElement.clientWidth,
		   viewportheight = document.documentElement.clientHeight
	 }
	 
	 // older versions of IE
	 else
	 {
		   viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
		   viewportheight = document.getElementsByTagName('body')[0].clientHeight
	 }
	var value = Array(2);
	value[0] = viewportwidth;
	value[1] = viewportheight;
	return value;
}
/**	To get the used height of the element, including its height, paddings, and margins.
 * @param {Object} el - The element
 * @return {Integer} - The used hight of the element
 */
_root.getHeight = function(el){
	var elExt = new Ext.Element(el);
	return elExt.getHeight() + elExt.getMargins("tb");
}
/**	To get the used width of the element, including its width, paddings, and margins
 * @param {Object} el - The element.
 * @return {Integer} - The used width of the element.
 */
_root.getWidth = function (el) {
	var elExt = new Ext.Element(el);
	return elExt.getWidth() + elExt.getMargins("lr");
}

_root.delayRequest = function(dwInterval, func){
	Ext.TaskMgr.start({
		count: -1,
	    run: function(){
	    	if(this.count<0){
	    		this.count++;
	    		return;
	    	}
	    	func();
	    },
	    interval: dwInterval,
	    repeat: 2
	});
};

_root.getValid = function(el){
	el.onclick();
	var szResult = el.getAttribute("valid");
	if(!isExist(szResult)){
		_global.debug("functions.js", "In function \"getValid\", the elemenet is without the verification in onclick functions");
		return false;
	}
	return el.getAttribute("valid")=="true" ? true : false;
	
}

// To get specified padding value(unit: pixel) of the specified position and element
//	@param el:Element - The specified element
//	@param pos:String - The position you want to get. There are "top", "right", "left", "bottom"
//	                    "vertial" or "v", means "top"+"bottom", 
//	                    "horizontal" or "h", means "left" + "right".
//	@return:Number - The value of padding(s) you specified.
_root.getPadding=function(el, pos){
	if(document.uniqueID && el.currentStyle){
		return getPaddingIE(el,pos);
	}
	switch(pos.toLowerCase()){
	case "top":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-top').split("px")[0];
	case "left":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-left').split("px")[0];
	case "right":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-right').split("px")[0];
	case "bottom":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-bottom').split("px")[0];
	case "v":
	case "vertical":
		return parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-top').split("px")[0])
			+ parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-bottom').split("px")[0]);
	case "h":
	case "horizontal":
		return parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-left').split("px")[0])
			+ parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('padding-right').split("px")[0]);
	default:
		_global.debug("globalFunction", "In function \"getPadding\", there is no sutiable case");
	}
}
// This function works with only IE serial browsers. Same as getPadding
_root.getPaddingIE=function(el, pos){
	switch(pos.toLowerCase()){
	case "top":
		return el.currentStyle.paddingTop.split("px")[0];
	case "left":
		return el.currentStyle.paddingLeft.split("px")[0];
	case "right":
		return el.currentStyle.paddingRight.split("px")[0];
	case "bottom":
		return el.currentStyle.paddingBottom.split("px")[0];
	case "v":
	case "vertical":
		return parseInt(el.currentStyle.paddingTop.split("px")[0])
			+ parseInt(el.currentStyle.paddingBottom.split("px")[0]);
	case "h":
	case "horizontal":
		return parseInt(el.currentStyle.paddingLeft.split("px")[0])
			+ parseInt(el.currentStyle.paddingRight.split("px")[0]);
	default:
		_global.debug("globalFunction", "In function \"getPadding\", there is no sutiable case");
	}
}

// To get specified border size(unit: pixel) of the specified position and element
//	@param el:Element - The specified element
//	@param pos:String - The border size you want to get. There are "top", "right", "left", "bottom"
//	                    "vertical" or "v", means "top"+"bottom", 
//	                    "horizontal" or "h", means "left" + "right".
//	@return:Number - The value of border size(s) you specified.
_root.getBorder=function(el, pos){
	if(document.uniqueID && el.currentStyle){
		return getBorderIE(el,pos);
	}
	switch(pos.toLowerCase()){
	case "top":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('border-top-width').split("px")[0];
	case "left":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('border-left-width').split("px")[0];
	case "right":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('border-right-width').split("px")[0];
	case "bottom":
		return document.defaultView.getComputedStyle(el,null).getPropertyValue('border-bottom-width').split("px")[0];
	case "v":
	case "vertical":
		return parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('border-top-width').split("px")[0])
			+ parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('border-bottom-width').split("px")[0]);
	case "h":
	case "horizontal":
		return parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('border-left-width').split("px")[0])
			+ parseInt(document.defaultView.getComputedStyle(el,null).getPropertyValue('border-right-width').split("px")[0]);
	default:
		_global.debug("globalFunction", "In function \"getBorder\", there is no sutiable case");
	}
}

// This function works with only IE serial browsers. Same as getBorder.
_root.getBorderIE=function(el, pos){
	switch(pos.toLowerCase()){
	case "top":
		return el.currentStyle.borderTopWidth.split("px")[0];
	case "left":
		return el.currentStyle.borderLeftWidth.split("px")[0];
	case "right":
		return el.currentStyle.borderRightWidth.split("px")[0];
	case "bottom":
		return el.currentStyle.borderBottomWidth.split("px")[0];
	case "v":
	case "vertical":
		return parseInt(el.currentStyle.borderTopWidth.split("px")[0])
			+ parseInt(el.currentStyle.borderBottomWidth.split("px")[0]);
	case "h":
	case "horizontal":
		return parseInt(el.currentStyle.borderLeftWidth.split("px")[0])
			+ parseInt(el.currentStyle.borderRightWidth.split("px")[0]);
	default:
		_global.debug("globalFunction", "In function \"getBorder\", there is no sutiable case");
	}
}
_root.isPressEnter = function(event){
	try{
		if(event.keyCode==13)
			return true;
		else
			return false;
	}catch(e){
		try{
			if(window.event.keyCode==13)
				return true;
			else
				return false;
		}catch(e){              //firefox
			if(event.which==13)
				return true;
			else
				return false;
		}
	}
	
};

// To get the width without paddings, borders
//	@param el:Element - The specified element
//	@return:Number The value of absolute width
_root.getAbsWidth=function(el){
	return (new Ext.Element(el)).getWidth(true);
}

_root.getMargins=function(el, str){
	return (new Ext.Element(el)).getMargins(str);
}

_root.updateMousePosition = function(e){
	if (Ext.isIE) { // grab the x-y pos.s if browser is IE
    _root._xmouse = event.clientX + document.body.scrollLeft
    _root._ymouse = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    _root._xmouse = e.pageX
    _root._ymouse = e.pageY
  }  
  // catch possible negative values in NS4
  if (_root._xmouse < 0){_root._xmouse = 0}
  if (_root._ymouse < 0){_root._ymouse = 0}
  return true
}

// To get the height without paddings, borders
//	@param el:Element - The specified element
//	@return:Number The value of absolute height
_root.getAbsHeight=function(el){
	return (new Ext.Element(el)).getHeight(true);
}

// To set the element with specified width and height. The specified width contains border size, padding size, 
// and its original width. E.g.: In CSS, the total width in client is "width" + "padding-left/right" + "border-left/right"
//	@param el:Element - The target element
//	@param width:Number/NULL - Size of width, null for do not adjust
//	@param height:Number/NULL - Size of height, null for do not adjust
//	@return:Void
_root.setSize=function(el, width, height) {
	var extElement = new Ext.Element(el);
	if(width!=null){
		var margins = extElement.getMargins("lr");
		extElement.setWidth(width-margins);
	}
	if(height!=null){
		var margins = extElement.getMargins("tb");
		extElement.setHeight(height-margins);
	}
	
}
_root.setChomeSize=function(el, width, height) {
	var extElement = new Ext.Element(el);
	if(width!=null){
		var margins = extElement.getMargins("lr");
		extElement.setWidth(width);
	}
	if(height!=null){
		var margins = extElement.getMargins("tb");
		extElement.setHeight(height-margins);
	}
	
}
/**	Set the element's position
 * @param {Object} el
 * @param {Integer} x
 * @param {Integer} y
 */
_root.setPosition = function (el, x, y){
	var extElement = new Ext.Element(el);
	extElement.setXY([x,y], false); 
}

// To prevent the fact the browser is too small to read
//	@return:Void  
_root.fixSize=function(){
	var clientArea=getClientArea();
	
	// Width is invalid
	if(clientArea[0] < _validWidth || clientArea[1] < _validHeight)
		self.resizeTo(800, 600);
	
}

// To POST the form to the specified URL
//	@param szURL:String - The posting destination
//	@param szForm:String - ID of the form
//	@param funcCallback:Function - The callback function which with two parameters,
//		funcCallback(response, isSucc)
//			@param response:Object - The response of xml http request
//			@param isSucc:Boolean - Is request successfully
//	@return:Integer - The transaction ID 
_root.xmlHttpPostForm=function( szURL, szForm, funcCallback ){
	var objParams = generateFormConfig(szForm);
	objParams.uniMask = true;
	var transactionId = Ext.Ajax.request({
		url: szURL,
		method: "POST",
		params: objParams,
		success: function(response){funcCallback(response,true);},
		failure: function(response){funcCallback(response,false);}
	});
	return transactionId;
}

_root.xmlHttpPost=function( szURL, funcCallback ){
	var transactionId = Ext.Ajax.request({
		url: szURL,
		method: "POST",
		success: function(response){funcCallback(response,true);},
		failure: function(response){funcCallback(response,false);}
	});
	return transactionId;
}

// To generate an object with configuration of the current form
//	@param szForm:String - The name of the form
//	@return:Object - The configuration object
_root.generateFormConfig=function( szForm, funcString ){
	var oConf = new Object();
	var form = document.forms[szForm];
	var arrElement = form.elements;
	for(var i=0; i< arrElement.length; i++){
		if(_root.isExist(arrElement[i].name)){
			if(arrElement[i].type=="radio" && arrElement[i].checked == false) continue;
			oConf[arrElement[i].name] = arrElement[i].value;
		}
		else if (arrElement[i].id){
			if(arrElement[i].type=="radio" && arrElement[i].checked == false) continue;
			oConf[arrElement[i].id] = get(arrElement[i].id).value;
		}
		else
			_global.debug("functions.js", "In funcation \"generateFormConfig\", the element in form is without an ID.");
	}
	return oConf;
}

_root.getToolbarButtons=function(){
	var elToolbar = get("toolbar");
	var oarrElements = elToolbar.getElementsByTagName('img');
	var arrButtons = new Array();
	for(var i=0; i<oarrElements.length; i++)
		arrButtons.push(oarrElements.item(i));
	return arrButtons;
}


_root.getTextWidth = function(szText){
	if(!_root.isExist(_root.get("__grid_text_width"))){
		var elTextWidth = document.createElement("div");
		elTextWidth.id = "__grid_text_width";
		document.body.appendChild(elTextWidth);
		/* 2017/02/15 by francis hide text */
		document.getElementById("__grid_text_width").style.visibility = "hidden";
	}
	var el = _root.get("__grid_text_width");
	el.innerHTML = szText;
	
	return _root.getAbsWidth(el)+25;
}

_root.getSafeString=function(str){
	return addSlashes(Ext.util.Format.htmlEncode(str));
};  

_root.setImgButtonDisabled=function(objButton, bDisabled){
	objButton.disabled = bDisabled ? "disabled" : "";
	if(!bDisabled){
		if(_root.isExist(objButton.funcDisable))
			objButton.onclick=objButton.funcDisable;
		objButton.funcDisable = null;
		Ext.get(objButton).removeClass("disabled");
	}
	else{
		objButton.funcDisable=objButton.onclick;
		objButton.onclick=function(){};
		Ext.get(objButton).addClass("disabled");
	}
}


_root.messageBox=function(szMsg, szType, funcConfirm ,szFocus){
	if(isExist(szMsg));else
		szMsg = " "; 
	var l = szMsg.length;
	var w = 300;
	var FocusIdx = 5;
	if (l<100);
	else if(l<300)
		w = 450;
	else 
		w = 600;
	if(_root.isExist(szFocus)){
		switch(szFocus.toLowerCase()){
			case "ok":
			      FocusIdx=0;
			      break;
			case "yes":
			      FocusIdx=1;
			      break;
			case "no":
			      FocusIdx=2;
			      break;
			case "cancel":
			      FocusIdx=3;
			      break;
			default:
			      FocusIdx=5;
		}
	}	
	
	
	var oMsgConf = {
		width:w,
		msg: szMsg,
		icon: null,
		buttons: Ext.MessageBox.OK
	};
	Ext.MessageBox.minWidth = 300;
	switch(szType.toLowerCase()){
	case "error":
		oMsgConf.title = _lang.messageBox.error;
		oMsgConf.icon = Ext.MessageBox.ERROR;break;
	case "info":
		oMsgConf.title =_lang.messageBox.info;
		oMsgConf.icon = Ext.MessageBox.INFO;break;
	case "warning":
		oMsgConf.title = _lang.messageBox.warning;
		oMsgConf.icon = Ext.MessageBox.WARNING;break;
		break;
	case "confirm":
		Ext.MessageBox.confirm(_lang.messageBox.confirm, szMsg, funcConfirm);
		if(FocusIdx !=5){
			  _root.delayRequest("50",function(){
			  	Ext.MessageBox.getDialog().buttons[FocusIdx].focus();
			  	});
			}
		return;
		break;
	}
	if(_root.isExist(funcConfirm))
		oMsgConf.fn = funcConfirm;
	
	Ext.MessageBox.show(oMsgConf);
}

_root.hideAllToolbarButtons = function(){
	var arrButtons = _root.getToolbarButtons();
	for(var i=0; i<arrButtons.length; i++){
		_root.hideElement(arrButtons[i]);
	}
}

_root.showAllToolbarButtons = function(){
	var arrButtons = _root.getToolbarButtons();
	for(var i=0; i<arrButtons.length; i++){
		_root.showElement(arrButtons[i]);
	}
}

_root.checkToolbarButtons=function(dwAmount){
	
	var arrButtons = _root.getToolbarButtons();
	for(var i=0; i<arrButtons.length; i++){
		var szKind = arrButtons[i].getAttribute("kind");
		if(!_root.isExist(szKind)){
			return;
		}
		switch(szKind.toLowerCase()){// Only selected a record...
		case "single": _root.setImgButtonDisabled(arrButtons[i], (dwAmount-1==0?false:true));
			break;
		case "multiple": _root.setImgButtonDisabled(arrButtons[i], (dwAmount>=1?false:true));
			break;
		default:
			_root.setImgButtonDisabled(arrButtons[i], false); // enabled
		}
	}
		
}

_root.resetForm=function(szFormId){
	document.forms[szFormId].reset();
}

_root.verifyForm=function(szFormId){
	var form = document.forms[szFormId];
	var arrElement = form.elements;
	var bIsValid = true;
	for(var i=0; i< arrElement.length; i++){
		try{arrElement[i].onclick();}catch(e){}
		if(bIsValid&&arrElement[i].getAttribute("valid")=="false")
			bIsValid = false;
	}
	return bIsValid;
}

_root.verifyInput=function(elInput, szOpt, szRegExp, qtip, para1){
	var bValid = verifyString(elInput.value, szOpt, szRegExp, para1);
	Ext.get(elInput).removeClass(!bValid?"valid":"invalid");
	Ext.get(elInput).addClass(bValid?"valid":"invalid");
	elInput.setAttribute("valid", bValid ? true:false);
	elInput.setAttribute("ext:qclass", bValid ? "": "x-form-invalid-tip");
	if(isExist(qtip)){
		elInput.setAttribute("ext:qtip", bValid ? "" : qtip);
	}
	if(bValid){
		var qt = Ext.QuickTips.getQuickTip();
		qt.hide();
	}
	return bValid;
}

_root.verifyString=function(szStr, szOpt, szRegExp,para1){
	var bIsValid = false;
	
	// If specified szOpt
	try{
		switch(szOpt.toLowerCase()){
		case "":
			bIsValid = /^.+$/.exec(szStr);
			break;
			
		case "email":
			bIsValid = /^([a-zA-Z0-9\.\_]+)@([\w\.]+)\w$/.exec(szStr);
			break;
		
		case "manual":
			var regexp = new RegExp(szRegExp,''); 
			bIsValid = regexp.exec(szStr);
			break;
			
		case "test":
			bIsValid = /^[^\x00-\x1F\x22\x5C\x7F]{1,50}$/.exec(szStr);
			break;
			
		case "function":
			bIsValid = _root[szRegExp]();
			break;

		case "functionwithonepara":
			bIsValid = _root[szRegExp](para1);
			break;
			
		default:
			bIsValid = true;
			break;
		}

	}catch(e){ // No specified, for all case
		return true;
	}
	return bIsValid?true:false;
}
_root.hideAllMenuS = function(){
	var el=_root.get("divMenu2Content");
	var els = el.getElementsByTagName("div");
	for(var i=0; i<els.length; i++){
		if(els[i].className == "menuButton"){
			_root.hideElement(els[i]);
		}
	}
}

_root.restoreFirstLevelMenu = function (){
	var el=_root.get("divMenu1Content");
	var els = el.getElementsByTagName("div");
	for(var i=0; i<els.length; i++){
		if(els[i].className == "menuButton"){
			els[i].attrImgButton.funcDefault(); // This function is defined in "global.js"
		}
	}
}
_root.restoreSecondLevelMenu = function (){
	var el=_root.get("divMenu2Content");
	var els = el.getElementsByTagName("div");
	for(var i=0; i<els.length; i++){
		if(els[i].className == "menuButton"){
			els[i].attrImgButton.funcDefault(); // This function is defined in "global.js"
		}
	}
}

_root.hideElement=function(el){
	Ext.get(el).addClass("displayNone");
	el.style.display = "none";
	el.style.visibility = "hidden";
}

_root.showElement=function(el){
	Ext.get(el).removeClass("displayNone");
	el.style.display = "inline";
	el.style.visibility = "visible";
}
_root.showNowLoading = function(){
	Ext.get('uniLoading').dom.style.visibility = "visible";
	Ext.get('uniLoadingMask').dom.style.visibility = "visible";
}
_root.hideNowLoading = function () {
	Ext.get('uniLoading').dom.style.visibility = "hidden";
	Ext.get('uniLoadingMask').dom.style.visibility = "hidden";
}

_root.cloneObject=function(obj){
	var oNewObj = new Object();
	for(var szId in obj)
		oNewObj[szId] = obj[szId];
	return oNewObj;
}

_root.getSpecifiedResponse = function(arrTags, objRes){
	var objReturn = new Object();
	// console.log(objRes);
	tagItemset = objRes.responseXML.getElementsByTagName("itemset")[0];
//	objRes.responseXML.ignoreWhitespace = false;
	for(var i=0; i<arrTags.length; i++){
		try {
				objReturn[arrTags[i]] = tagItemset.getElementsByTagName(arrTags[i])[0][Ext.isIE ? 'text' : 'textContent'];
		}catch(e){
			objReturn[arrTags[i]] = null;
		}
	}
	return objReturn;
}

_root.getResponse = function(objRes){
	var objReturn = new Object();
	try {
		var tagResult = objRes.responseXML.getElementsByTagName("result")[0];
	}catch(e){}
	try {
		
		objReturn.value = tagResult.getElementsByTagName("value")[0][Ext.isIE ? 'text' : 'textContent'];
	}catch(e){}
	for (var i = 1; i <= 6; i++) 
		try {
			objReturn["param" + i] = tagResult.getElementsByTagName("param" + i)[0][Ext.isIE ? 'text' : 'textContent'];
		}catch(e){}
	return objReturn;
}

_root.ignoreSpaces = function (string) {
	var temp = "";
	string = '' + string;
	splitstring = string.split(" ");
	for(i = 0; i < splitstring.length; i++)
	temp += splitstring[i];
	return temp;
};

_root.updateColumnConfigs = function(szConfigs, szFuncName){
	Ext.Ajax.request({
		url: "clpf/doupdate",
		params:{
			uniMask: false,
			funnam: szFuncName,
			fields: szConfigs
		},
		success: function(res, opt){}
	});
};

_root.getTableErrMsg = function (code) {
	var temp = "";
	var table,status, tStr,sStr
	if(code.split(",").length!=3) return "["+code+"]"+_lang.MsgCodeErr;
	
	status=code.split(",")[1].toUpperCase();
	table=code.split(",")[2].toUpperCase();
	//alert(status+","+table);
	
	if(status == "10") return _lang.tableErrMsg["10"];
	
	tStr = _lang.tableErrMsg[table];
	sStr= _lang.tableErrMsg[status];

	if(status == "20") return _lang.tableErrMsg["20"];
	//add modify by jun
	if(status == "30") return _lang.tableErrMsg["30"];//"Data has been Modified!";//
	if(status == "40") return _lang.tableErrMsg["40"];//"Data has been Deleted!";//
	if(status == "80") return _lang.tableErrMsg["80"];
	if(status == "81") return _lang.tableErrMsg["81"];
	if(status == "82") return _lang.tableErrMsg["82"];
	if(status == "83") return _lang.tableErrMsg["83"];
	if(status == "84") return _lang.tableErrMsg["84"];

	//add end 
	//alert(_lang.tableErrMsg["20"]);
	if(status == "00") return _lang.tableErrMsg.OK;
	if(typeof(tStr ) === "undefined" || typeof(sStr) === "undefined" )	return _lang.tableErrMsg["10"];
	return tStr + " " + sStr;
};

_root.addSlashes = function(str) {
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\\/g,'\\\\');
//	str=str.replace(/\(/g,'\\\(');
//	str=str.replace(/\)/g,'\\\)');
//	str=str.replace(/\0/g,'\\0');
	return str;
};
_root.stripSlashes = function (str) {
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
	str=str.replace(/\\\\/g,'\\');
	str=str.replace(/\\/g,'\\\\');
//	str=str.replace(/\(/g,'\\\(');
//	str=str.replace(/\)/g,'\\\)');
//	str=str.replace(/\\0/g,'\0');
	return str;
};

/** To centralize the image inside a div element
 * 	@param {Element} elDiv - The div element contented only an image element.
 * 	@return {Null}
 */
_root.centralizeElement = function (elDiv) {
	var elPar = elDiv.parentElement;
	var w = getAbsWidth(elPar);
	var h = getAbsHeight(elPar);
	var w2 = getWidth(elDiv);
	var h2 = getHeight(elDiv);
	elDiv.style.marginLeft = (w - w2)/2 + "px";
	elDiv.style.marginTop  = (h - h2)/2 + "px";
};

_root.g_downloadExcel = function(szSql, szColMap, func_name){
	var form=null;
	//will add
	//var input1 = input2 = null;
	var input1 = input2 = input3 = null;
	if(_root.isExist(_root.get("execeldownloadform"))){
		form = _root.get("execeldownloadform");
		input1 = form.firstChild;
		input2 = input1.nextSibling;
		input3 = input2.nextSibling;
	}else{
		form = document.createElement("form");
		form.id="execeldownloadform";
		form.method = "POST";
		form.action = "excelDownload.jsp";
		input1 = document.createElement("input");
		input2 = document.createElement("input");
		//will add
		input3 = document.createElement("input");
		input1.name = "EXCEL_SQL";
		input2.name = "EXCEL_COL_MAP";
		//will add
		input3.name = "EXCEL_FUN_NAME";
		form.className = "displayNone";
		form.appendChild(input1);
		form.appendChild(input2);
		form.appendChild(input3);
		document.body.appendChild(form);
	}
		
	input1.value = szSql;
	input2.value = szColMap;
	input3.value = func_name;
	form.submit();
}; 

_root.firstInstallProgress = function (dwPosition, totleSteps) {
	var path = _rootLang.getImagesPath()+"images/finstall/";
	var d = _root.get("col3");
	var simg = document.createElement("img");
	simg.src = path + "fleft_a.png";
	d.appendChild(simg);
	
	var bUnion = false;
	for(var i=1; i<=totleSteps; i++){
		var i1 = document.createElement("img");
		var i2 = document.createElement("img");
		if(i <= dwPosition){
			i1.src = path + "s" + i + "_a.png";
			i2.src = path +  "fmidd_a.png";
		}else{
			if(bUnion==false){
				d.removeChild(d.lastChild);
				var img = document.createElement("img");
				img.src = path + "fmidd_u.png";
				d.appendChild(img);
				bUnion = true;
			}
			i1.src = path +  "s" + i + ".png";
			i2.src = path +  "fmidd.png";
		}
		d.appendChild(i1);
		d.appendChild(i2);
	}
	var lastElement = d.lastChild;
	d.removeChild(lastElement);
	var rightImg = document.createElement("img");
	if(dwPosition>=totleSteps)
		rightImg.src = path + "fright_a.png";
	else
		rightImg.src = path + "fright.png";
	d.appendChild(rightImg);
}; 
  
_root.highlightHelp = function(dwIndex, szTarget){
	var col1 = null;
	var keyPosition = 0;
	if(isExist(szTarget))
		col1 = Ext.get(szTarget);
	else
		col1 = Ext.get("col1");
	var arrBlocks = col1.query(".textBlock");
	for(var i=0; i<arrBlocks.length; i++){
		if(dwIndex<0){
			Ext.get(arrBlocks[i]).removeClass("textBorder");
			continue;
		}
		else if(i==dwIndex*2){
			keyPosition = Ext.get(arrBlocks[0]).dom.offsetTop;
			var c = Ext.get(arrBlocks[i]);
			var y = c.dom.offsetTop-keyPosition;
			c.addClass("textBorder");
			col1.scrollTo("top", y, true);
		}
		else
			Ext.get(arrBlocks[i]).removeClass("textBorder");
	}
};

function getFlashMovie(movieName) {
	var isIE = navigator.appName.indexOf("Microsoft") != -1;
	return (isIE) ? window[movieName] : document[movieName];
}

function gotoNewMessage(){
	showNowLoading();
	window.location = "page_histroyPagesV.jsp";
}

_root.isBuildInACKUsed = function(){
	if(!_root.isExist(_root.get("divE5BuildinAck")))
		return "f";
	/*var ackopt = _root.get("divE5BuildinAck").children;
	for(var i = 0; i < ackopt.length; i++){
		if(ackopt[i].firstChild.checked == true)
			return "t";
	}*/
	var ackopt = _root.get("divBuildinNoAtt").children;
	for(var i = 0; i < ackopt.length; i++){
		if(ackopt[i].firstChild.checked == true)
			return "t";
	}
	ackopt = _root.get("divBuildinAtt").children;
	for(var i = 0; i < ackopt.length; i++){
		if(ackopt[i].firstChild.checked == true)
			return "t";
	}
	ackopt = _root.get("divBuildinNoRec").children;
	for(var i = 0; i < ackopt.length; i++){
		if(ackopt[i].firstChild.checked == true)
			return "t";
	}
	return "f";
}
_root.getCannedACKBySelected = function(){
	var arrRecords = gridSelectedPagers.getAllRecords();
	var callids = "";
	for(var i = 0; i < arrRecords.length; i++){
		callids += "'" + arrRecords[i].get("callid")+ "'";
		if( i < arrRecords.length -1 )
		callids += ",";
	}
	
	Ext.Ajax.request({
		url: "page_/page_ajax_queryCannedACKBySelected.jsp",
		params:{callids:callids},
		success: function(res, opt){
			var objResult = _root.getSpecifiedResponse([
				"result",
				"ack1",
				"ack2",
				"ack3",
				"ack4"
			], res);
			
			if(objResult.result == "conflict")
				_root.messageBox(_lang.ackconflict, "WARNING", function(){
						_root.delayRequest(100, function(){
							_root.get("manualCapcode").focus();
						});
					});
			_root.get("divManualAck").innerHTML = "";
			if(Ext.util.Format.htmlEncode(objResult.ack1) != ""
					|| Ext.util.Format.htmlEncode(objResult.ack2) != "" 
					|| Ext.util.Format.htmlEncode(objResult.ack3) != "" 
					|| Ext.util.Format.htmlEncode(objResult.ack4) != "" )
			{
				_root.get("divManualAck").innerHTML += "<div ack_tp='0' msganm='"+Ext.util.Format.htmlEncode(objResult.ack1)+"' >1. " + Ext.util.Format.htmlEncode(objResult.ack1) + "</div>";
				if(Ext.util.Format.htmlEncode(objResult.ack2) != "")
					_root.get("divManualAck").innerHTML += "<div ack_tp='0' msganm='"+Ext.util.Format.htmlEncode(objResult.ack2)+"' >2. " + Ext.util.Format.htmlEncode(objResult.ack2) + "</div>";
				if(Ext.util.Format.htmlEncode(objResult.ack3) != "")
					_root.get("divManualAck").innerHTML += "<div ack_tp='0' msganm='"+Ext.util.Format.htmlEncode(objResult.ack3)+"' >3. " + Ext.util.Format.htmlEncode(objResult.ack3) + "</div>";
				if(Ext.util.Format.htmlEncode(objResult.ack4) != "")
					_root.get("divManualAck").innerHTML += "<div ack_tp='0' msganm='"+Ext.util.Format.htmlEncode(objResult.ack4)+"' >4. " + Ext.util.Format.htmlEncode(objResult.ack4) + "</div>";
			}
		}
	});
}


_root.httpGet = function(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
/*
_root.getImagesPath = function(){
	var lt = _root.get("langtp").getAttribute("value");
	var lp = "/language_pack/en/";
	if(lt == "en"){
		lp = "/language_pack/en/";
	}else{
		lp = "/language_pack/de/";
	}
	return lp;		
}
*/
// Function : imposeMaxLength
// Add this function to limit the length of textarea for IE
// This function does not accept ENTER for our requirment.
// example : onkeypress="return imposeMaxLength(event, this, 255);"
_root.imposeMaxLength = function(Event, Object, MaxLen) {
  return ( ( Object.value.length < MaxLen ) || Event.keyCode == 8   ) && Event.keyCode!=13  ;
}
/* 20170320 by francis massage error box */
_root.getNoDataMessage = function (){
		if($(".NodataMessage").css("opacity") != "1"){
			$(".NodataMessage").css("opacity","1")
		}else{
			var marginTop = $("#mcpe-iframe").height() / 2 - $(".NodataMessage").height(); 
			var marginLeft = $("#mcpe-iframe").width() / 2 - $(".NodataMessage").width() / 2;
			$(".NodataMessage").css({
				"margin-top": marginTop,
				"marginLeft": marginLeft
			});
			$(".NodataMessage").fadeIn(300);
			clearInterval(_FlagIntervalRefresh);
		}
	};

_root.removeButton = function(){
	var el = document.querySelectorAll('div.mcpe-toolbar > img:not(.Colfilter)');
	for(var i=0; i<el.length; i++){
		el[i].remove()
	}
}

}// #endif
