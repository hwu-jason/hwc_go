function getNote(note){
	$.ajax({
	       type: "GET",
	       url: "guide/helpnote",
	       data: "note_name="+note,
	       dataType: "json",
	       cache: false,
	       ansyn: false,
	       error:function (xhr, ajaxOptions, thrownError){
	           console.log(xhr);
	       },
	       success:function( res ){
	       	var winInstruction = $("#winInstruction");
	       	// winInstruction.append("");
	       	var str = "<div id='note_content'>";
	    	for (var i =0; i < res.length; i++) {
	    		str +=  "<div class='textBlock'>"+
			       		"<div class='textTitle'>&middot; "+res[i].title+" </div>"+
			        	"<div class='textBlock'>"+res[i].content+"</div>"+
			   			"</div>";
	    	};
	    	str +="</div>";
	    	winInstruction.append(str);
	       },
	       complete:function(){
	       }
  	});
}

function getNoteChange(note){
	$.ajax({
	       type: "GET",
	       url: "guide/helpnote",
	       data: "note_name="+note,
	       dataType: "json",
	       cache: false,
	       ansyn: false,
	       error:function (xhr, ajaxOptions, thrownError){
	           console.log(xhr);
	       },
	       success:function( res ){
	       	var winInstruction = $("#winInstruction");
	       	winInstruction.html("");
	       	// winInstruction.append("");
	  		var str = "<div id='note_content'>";
	    	for (var i =0; i < res.length; i++) {
	    		str +=  "<div class='textBlock'>"+
			       		"<div class='textTitle'>&middot; "+res[i].title+" </div>"+
			        	"<div class='textBlock'>"+res[i].content+"</div>"+
			   			"</div>";
	    	};
	    	str +="</div>";
	    	winInstruction.append(str);
	       },
	       complete:function(){
	       }
  	});
}
