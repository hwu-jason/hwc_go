// #ifdef _GLOBAL_FUNCTION
try{if(_INIT);
}catch(e){
// #define _GLOBAL_FUNCTION true
_INIT = true;
$(document).ready(function(){
	window.onbeforeunload = function(e) {
		if(_global.windowopen.length>0){
			console.log(_global.windowopen);
			_global.windowopen[0].close();
			_global.windowopen.length=0;
		}
		var dialogText = 'Are you sure?';
		e.returnValue = dialogText;
		return dialogText;
	};
	
	// Build loading mask
	var elDivMask = document.createElement("div");
	elDivMask.id = "uniLoadingMask";
	var elDivLoading = document.createElement("div");
	elDivLoading.id = "uniLoading";
	var elDivIndicator = document.createElement("div");
	elDivIndicator.id = "uniLoadingIndicator";
	elDivLoading.appendChild(elDivIndicator);
	
	elDivIndicator.innerHTML = _lang.loading;
	
	document.body.appendChild(elDivMask);
	document.body.appendChild(elDivLoading);
	Ext.get("uniLoadingMask").setOpacity(.5);
	Ext.get('uniLoading').dom.style.visibility = "hidden";
	Ext.get('uniLoadingMask').dom.style.visibility = "hidden";
	
	// Define ajax behaviors events., Before request.
	// Ext.Ajax.on("beforerequest", function(conn, conf){
	// 	try{if(conf.params.uniMask==true){
	// 		_global.m_arrLoadingStack.push("");
	// 		Ext.get('loader').dom.style.visibility = "visible"
	// 	}}catch(e){}
	// });
	
	// //Request complete
	// Ext.Ajax.on("requestcomplete", function(conn, resp, conf){
	// 	try{if(conf.params.uniMask==true){
	// 		_global.m_arrLoadingStack.pop();
	// 		if(_global.m_arrLoadingStack.length>0)
	// 			return;
	// 		Ext.get('loader').dom.style.visibility = "hidden";
	// 	}}catch(e){}
	// });
	
	// Request exception
	Ext.Ajax.on("requestexception", function(conn, resp, conf){
		try{if(conf.params.uniMask==true){
			_global.m_arrLoadingStack.pop();
			if(_global.m_arrLoadingStack.length>0)
				return;
			Ext.get('loader').dom.style.visibility = "hidden";
		}}catch(e){}
	    if (resp.status === 401) {
	    	// _root.messageBox("{{Lang::get('validation.sessionExpire')}}", "INFO"); 
	    	_root.messageBox(_lang.SessionExpired, "INFO"); 
	    	setTimeout(function(){				    		
	        	window.location = 'login';
	    	},1000);
	    }
	   	if (resp.status === 403) {
	    	// _root.messageBox("{{Lang::get('validation.PerMissionDeny')')}}", "INFO"); 
			_root.messageBox("Permission Deny!", "INFO"); 
	    	setTimeout(function(){				    		
	        	window.location = '/';
	    	},1300);
	    }
	});

	//jQeury Ajax Error Listener
	$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
	    if (jqxhr.status === 401) {
	    	// _root.messageBox("{{Lang::get('validation.sessionExpire')}}", "INFO"); 
	    	_root.messageBox(_lang.SessionExpired, "INFO");
	    	setTimeout(function(){				    		
	        	window.location = 'login';
	    	},1000);
	    }	
	   	if (jqxhr.status === 403) {
	    	// _root.messageBox("{{Lang::get('validation.PerMissionDeny')')}}", "INFO"); 
			_root.messageBox("Permission Deny!", "INFO"); 
	    	setTimeout(function(){				    		
	        	window.location = '/';
	    	},1000);
	    }
	});
	
	// Create a tab div
	var elDivTabs = document.createElement("div");
	elDivTabs.id = "tabs";
	document.body.appendChild(elDivTabs);
	
	// Detect if the browser is IE or not.
	// If it is not IE, we assume that the browser is NS.
	var IE = document.all?true:false
	
	// If NS -- that is, !IE -- then set up for mouse capture
	// if (!IE) document.captureEvents(Event.MOUSEMOVE)
	
	// Set-up to use getMouseXY function onMouseMove
	// document.onmousemove = _root.updateMousePosition;
	
	// Temporary variables to hold mouse x-y pos.s
	// _root._xmouse = 0;
	// _root._ymouse = 0;
	
	
	// Do ready stack
	_global.doReady();
	// window.onload = function(e){
	// 	console.log(e);
	// };





});
}