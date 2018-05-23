FlotGraph = function(arrSpec, ajaxUrl, setting = null){

	this.spec = arrSpec;
	this.url = ajaxUrl;
	this.setting = setting;
	this.id = null;
	this.field_name = null;
	this.endtime = null;
	this.el_modal = null;
	this.el_graph_container = null;
	this.el_date_input = null;
	this.el_clockpicker_input = null;
	this.el_search = null;
	this.el_starttime = null;
	this.el_endtime = null;

	this.render = function(el_modal){
		var window_width = window.innerWidth;
		var window_height = window.innerHeight;

		var el_modal = this.el_modal = document.getElementById(el_modal);
		var el_modal_width = window_width*0.7;
		el_modal.setAttribute('class', 'modal fade');
		el_modal.setAttribute('role', 'dialog');

		var el_modal_dialog = document.createElement('div');
		el_modal_dialog.setAttribute('class', 'modal-dialog');
		el_modal.appendChild(el_modal_dialog);
		
		var el_modal_content = document.createElement('div');
		el_modal_content.setAttribute('class', 'modal-content');
		el_modal_dialog.appendChild(el_modal_content);
		
		// modal-header
		var el_modal_header = document.createElement('div');
		el_modal_header.setAttribute('class', 'modal-header');
		el_modal_content.appendChild(el_modal_header);	
		var el_close_btn1 = document.createElement('button');
		el_close_btn1.setAttribute('type', 'button');
		el_close_btn1.setAttribute('class', 'close');
		el_close_btn1.setAttribute('data-dismiss', 'modal');
		el_close_btn1.innerHTML = "&times;";
		el_modal_header.appendChild(el_close_btn1);
		var el_modal_title = document.createElement('h4');
		el_modal_title.setAttribute('class', 'modal-title');
		el_modal_header.appendChild(el_modal_title);

		// modal-body
		var el_modal_body = document.createElement('div');
		el_modal_body.setAttribute('class', 'modal-body');
		el_modal_content.appendChild(el_modal_body);
		var el_container = document.createElement('div');
		el_container.setAttribute('class', 'container');
		el_modal_body.appendChild(el_container);
		var el_row = document.createElement('div');
		el_row.setAttribute('class', 'row');
		el_container.appendChild(el_row);

		// modal-footer
		var el_modal_footer = document.createElement('div');
		el_modal_footer.setAttribute('class', 'modal-footer');
		el_modal_content.appendChild(el_modal_footer);
		var el_close_btn2 = document.createElement('button');
		el_close_btn2.setAttribute('type', 'button');
		el_close_btn2.setAttribute('class', 'btn btn-default');
		el_close_btn2.setAttribute('data-dismiss', 'modal');
		el_close_btn2.innerHTML = 'Close';
		el_modal_footer.appendChild(el_close_btn2);
		
		var grid_class1, grid_class2, ratio;
		// if(el_modal_width >= 1200){
		// 	grid_class1 = "col-xl-2";
		// 	grid_class2 = "col-xl-10";
		// 	ratio = 0.8;
		// }else if(el_modal_width >= 992){
		// 	grid_class1 = "col-xl-2 col-lg-2 col-md-3";
		// 	grid_class2 = "col-xl-10 col-lg-10 col-md-7";
		// 	ratio = 0.8;
		// }else{
		// 	grid_class1 = "col-md-3";
		// 	grid_class2 = "col-md-7";
		// 	ratio = 0.7;
		// }
		grid_class1 = "col-xl-2 col-lg-2 col-md-3";
		grid_class2 = "col-xl-10 col-lg-10 col-md-7";
		ratio = 0.8; 
		var class_graph_info = grid_class1+" graph-info";
		var class_graph_container = grid_class2+" graph-container";

		var el_modal_graph_info = document.createElement('div');
		el_modal_graph_info.setAttribute('class', class_graph_info);
		el_row.appendChild(el_modal_graph_info);
		el_modal_graph_info.innerHTML = "<div class='form-group' id='starttime'><label>"+_lang.startTime+"</label><input class='form-control' type='text' readonly /></div><div class='form-group' id='endtime'><label>"+_lang.endTime+"</label><input class='form-control' type='text' readonly /></div>";
		var el_modal_graph_container = document.createElement('div');
		el_modal_graph_container.setAttribute('class', class_graph_container);
		el_row.appendChild(el_modal_graph_container);
		el_modal_graph_container.innerHTML = "<div id='graph-container'></div>";

		if(setting === true){
			$(el_modal).find(".graph-info").prepend("<div class='form-group'><label>"+_lang.SearchTime+"</label><div class='input-group date' data-provide='datepicker'><input class='form-control' type='text' /><div class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></div></div><div class='input-group clockpicker'><input class='form-control' type='text'><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div><button id='search'class='btn btn-primary btn-block' type='button'>"+_lang.Search+"</button></div>");
			$(el_modal).find('.date').datepicker({
				autoclose: true,
				format: 'yyyy-mm-dd'
			});
			$(el_modal).find('.clockpicker').clockpicker({
			    autoclose: true
			});
			
			this.el_date_input = $(el_modal).find(".date input");
			this.el_clockpicker_input = $(el_modal).find('.clockpicker input');
			this.el_search = $(el_modal).find("#search");

			var _this = this;
			$(this.el_search).click(function(){
				var enddate = $(el_modal).find('.date input').val();
				var endtime	= $(el_modal).find('.clockpicker input').val();
				if(enddate == "" || endtime == ""){
					_root.messageBox("Please set the date and time.", "WARNING");
					return;
				}
				endtime = enddate+" "+endtime+":00";
				endtime = Date.parse(endtime);		
				_this.setParam({
					endtime: endtime
				});
				_this.load();
			});
		}
		var el_graph_container_width = el_modal_width*ratio;
		var el_graph_container_height = window_height*0.55;
		el_modal_dialog.style.width = el_modal_width+"px";
		el_modal_dialog.style.paddingBottom = "15px";
		el_container.style.width = el_modal_width+"px";
		el_row.style.width = el_modal_width+"px";
		el_row.style.paddingRight = "45px";
		el_modal.querySelector('#graph-container').style.width = el_graph_container_width+"px";
		el_modal.querySelector('#graph-container').style.height = el_graph_container_height+"px";
		el_modal.getElementsByClassName('form-control')[0].style.fontSize = "13px";
		el_modal.getElementsByClassName('form-control')[0].style.padding = "6px";

		this.el_graph_container = el_modal.querySelector('#graph-container');
		this.el_starttime = el_modal.querySelector('#starttime');
		this.el_endtime = el_modal.querySelector('#endtime');
	}

	this.setParam = function(obj_param){
		if(obj_param.id !== undefined)
			this.id = obj_param.id;
		if(obj_param.field_name !== undefined)
			this.field_name = obj_param.field_name;
		if(obj_param.endtime !== undefined)
			this.endtime = obj_param.endtime;
	}

	this.load = function(){
		var spec = this.spec;
		var url = this.url;
		var id = this.id;
		var field_name = this.field_name;
		var endtime = this.endtime;
		var el_modal = this.el_modal;
		var el_graph_container = this.el_graph_container;
		var el_date_input = this.el_date_input;
		var el_clockpicker_input = this.el_clockpicker_input;
		var el_starttime = this.el_starttime;
		var el_endtime = this.el_endtime;
		var dataset, options, starttime, endtime;
		$(el_graph_container).html('');
		$(el_date_input).val('');
		$(el_clockpicker_input).val('');
		$.ajax({
			url: url,
			type: "POST",
			data: {
				id: id,
				field_name: field_name,
				endtime: endtime
			},
			dataType: "json",
			cache: false,
			ansyn: true,
			success: function(res){
				starttime = res.starttime;
				endtime = res.endtime;
				var width = $(el_modal).find(el_graph_container).width()+'px';
				var height = $(el_modal).find(el_graph_container).height()+'px';
				if(res.data.length == 0){
					$(el_modal).find(".modal-title").text(_lang.NoDataFound);
					$(el_modal).find(el_graph_container).html('<p>No Data Found</p>');
					$(el_modal).find(el_graph_container).css({
						'display':'block',
						'width':width,
						'height':height,
						'border':'1px solid #ccc'
					});
					var top = $(el_modal).find(el_graph_container).height()*0.5-25+"px";
					$(el_modal).find(el_graph_container).find("p").css({
						'position':'relative',
						'text-align':'center',
						'top':top,
						'font-size':'50px',
						'color':'#E86542'
					});					
					return;
				}else{
					$(el_modal).find(el_graph_container).removeAttr('style');
					$(el_modal).find(el_graph_container).css({
						'display':'block',						
						'width':width,
						'height':height
					});
				}
				var i = 0, data = [], index;
				var max = (res.spec['max'] == '') ? null: res.spec['max']; //status最大標準值
				var min = (res.spec['min'] == '') ? null: res.spec['min']; //status最小標準值
				var opt_y_max; //圖表最大值
				var opt_y_min; //圖表最大值
				var opt_x_max = 0;
				var opt_x_min = 0;
				var label_max = null; //最大值圖例
				var label_min = null; //最小值圖例
				var markings = [];
				var time_offset = 0;
				var tickSize = [];
				var y_tickSize;

				if(max == null)
					opt_y_max = null;
				else if(max > 0)
					opt_y_max = max*1.1;
				else if(max == 0)
					opt_y_max = parseFloat(max)+60;
				else if(max < 0)
					opt_y_max = max*0.8;

				if(min == null)
					opt_y_min = null;
				else if(min > 0)
					opt_y_min = min*0.8;
				else if(min == 0)
					opt_y_min = parseFloat(min)-60;
				else if(min < 0)
					opt_y_min = min*1.1;

				$.each(spec, function(key, value){
					if(field_name == value.field_name){
						index = key;
						return false;
					}
				});
		        for(i = 0; i < res.data.length; i++){
		            data[i] = [];
		            data[i][0] = Date.parse(res.data[i]['time']);
		            data[i][1] = res.data[i][field_name];
		            var val = data[i][1];
		            var buffer_maximum; //數列中最大值
		            var buffer_minimum; //數列中最小值
		            if(i == 0)
		            	buffer_maximum = val;
		            else if(parseFloat(val) > buffer_maximum)
		            	buffer_maximum = val;
		            if(i == 0)
		            	buffer_minimum = val;
		            else if(parseFloat(val) < buffer_minimum)
		            	buffer_minimum = val;

					if(max != null && parseFloat(val) > max){
						opt_y_max = null;
						continue;
					}
					if(min != null && parseFloat(val) < min){
						opt_y_min = null;
						continue;
					}
		        }
		        y_tickSize = (buffer_maximum-buffer_minimum)/8;
		        if(max != null && parseFloat(buffer_minimum) >　max){
		        	if(max > 0){
		        		if(min != null){
		        			if(min > 0)
		        				opt_y_min = min*0.8;
		        			else if(min == 0)
		        				opt_y_min = min-y_tickSize;
		        			else if(min < 0)
		        				opt_y_min = min*1.1;
		        		}else
		        			opt_y_min = max*0.8;
		        	}else if(max == 0){
		        		if(min != null)
		        			opt_y_min = min*1.1;
		        		else
		        			opt_y_min = max-y_tickSize;
		        	}else if(max < 0){
		        		if(min != null)
		        			opt_y_min = min*1.1;
		        		else
		        			opt_y_min = max*1.1;
		        	}
		        }		        	
		        if(min != null && parseFloat(buffer_maximum)　< min){
		        	if(min > 0){
		        		if(max != null)
		        			opt_y_max = max*1.1;
		        		else
		        			opt_y_max = min*1.1;
		        	}else if(min == 0){
		        		if(max != null)
		        			opt_y_max = max*1.1;
		        		else
		        			opt_y_max = parseFloat(min)+y_tickSize;
		        	}else if(min < 0){
		        		if(max != null){
		        			if(max > 0)
		        				opt_y_max = max*1.1
		        			else if(max == 0)
		        				opt_y_max = parseFloat(max)+y_tickSize;
		        			else if(max < 0)
		        				opt_y_max = max*0.8;
		        		}else
		        			opt_y_max = min*0.8;
		        	}
		        }

		        opt_x_min = (data.length > 1) ? null : data[0][0] - 200;
		        opt_x_max = (data.length > 1) ? null : data[0][0] + 200 ;
		        time_offset =  (data[0][0] - data[data.length-1][0])/1000/60;
                if (time_offset > 10) {
                    tickSize.push(10, "minute");
                }else if(data.length > 1 ){
                    var offset = time_offset/data.length;
                    var intervals_block = time_offset / offset;
                    if (intervals_block > 6){
                        offset = (intervals_block/(intervals_block-6)) + offset;
                    }
                    if (offset < 1 || Number.NEGATIVE_INFINITY === offset) offset = 1;
                    tickSize.push(offset, "minute");
                }else{
                    tickSize = null;
                }

		        if(max == null && min == null){
		        	markings = null;
		        }else{
			        if(max != null){
			        	label_max = "&nbsp;&nbsp;<td class='legendColorBox'><div style='border:1px solid #000000;padding:1px'><div style='width:4px;height:0;border:5px solid #FF0000;overflow:hidden'></div></div></td>"+
					        	    "<td class='legendLabel'><font color=\"black\">UpperLimit</font></td>&nbsp;&nbsp;";
			      	}
			      	if(min != null){
			        	label_min = "<td class='legendColorBox'><div style='border:1px solid #000000;padding:1px'><div style='width:4px;height:0;border:5px solid #00FF00;overflow:hidden'></div></div></td>"+
					        	    "<td class='legendLabel'><font color=\"black\">LowerLimit</font></td>";
			      	}
		        }
		        dataset = [{
		        	label: spec[index].title,
		        	data: data,
					color: "#0062E3",
					points: {
						show: true,
						radius: 3.5 
					},
					lines: { 
						show: true 
					}
		        }];
		        options = {
					legend: {
						show:true,
					    labelFormatter: function(label, series){
					    	var label = "<font color='black'>"+label+"</font>";
					    	if(label_max != null)
					    		label += label_max;
					    	if(label_min != null)
					    		label += label_min;
					    	return label;
					    },            
					    backgroundColor: "#FFFFFF",
					    backgroundOpacity: 0.9,
					    labelBoxBorderColor: "#000000",
					    position: "ne"
					}, 
		            series: {
						shadowSize: 5
		            },
		            xaxes: [{
				        mode: "time",             
				        timeformat: "%Y/%m/%d<br />%H:%M:%S",
				        tickSize: tickSize,
				        timezone: "browser",
				        min: opt_x_min,
				        max: opt_x_max
				    }],
					yaxis: {        				        
				        axisLabel: spec[index].title,
				        axisLabelUseCanvas: true,
				        axisLabelFontSizePixels: 12,
				        axisLabelFontFamily: "Verdana, Arial",
				        axisLabelPadding: 10,
				        min: opt_y_min,
      					max: opt_y_max
				    },
				    grid: {
				        hoverable: true,
				        clickable: false,
				        borderWidth: 1,
				        mouseActiveRadius: 50,
				        axisMargin: 20,
				        backgroundColor: "white",
				        markings: function(axes){
						    if(markings == null){
						    	return [];
						    }else{
						    	var range = Math.floor(axes.xaxis.max) - Math.floor(axes.xaxis.min);
							    for (var x = Math.floor(axes.xaxis.min); x < axes.xaxis.max; x += (range*0.03)){
							        var step = x+(range*0.02);
							        if(max != null)
										markings.push({yaxis:{from:max,to:max},xaxis: { from: x, to: step },color:"#FF0000"});
									if(min != null)
										markings.push({yaxis:{from:min,to:min},xaxis: { from: x, to: step },color:"#00FF00"});
							    }
							    return markings;
						    }
						}
				    }
		        };

				var plot = $.plot($(el_modal).find(el_graph_container), dataset, options);
				$(el_modal).find(el_graph_container).UseTooltip();
				$(el_modal).find(".modal-title").text(spec[index].title);
				if(starttime != "" && el_starttime != null)
					$(el_modal).find(el_starttime).find("input").val(starttime);
				if(endtime != "" && el_endtime != null)
					$(el_modal).find(el_endtime).find("input").val(endtime);
			}			
		});
	}

	this.show = function(){
		$(this.el_modal).modal('show');
	}

	this.hide = function(){
		$(this.el_modal).modal('hide');
	}

}

$.fn.UseTooltip = function(){
	var previousPoint = null;
	var previousLabel = null;
    $(this).bind("plothover", function(event, pos, item){
        if(item){
            if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;
                $("#tooltip").remove();
                
                var x = item.datapoint[0];
                var y = item.datapoint[1];
                var date = new Date(x);
                var color = item.series.color;

                showTooltip(item.pageX, item.pageY, color, "<strong>"+item.series.label+"</strong><br>Time:"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"<br>Value:<strong>"+y+"</strong>");
            }
        }else{
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};

function showTooltip(x, y, color, contents){
    $('<div id="tooltip">' + contents + '</div>').css({
        'position': 'absolute',
        'display': 'none',
        'top': y - 40,
        'left': x - 120,
        'border': '2px solid ' + color,
        'padding': '3px',
        'font-size': '9px',
        'border-radius': '5px',
        'background-color': '#fff',
        'font-family': 'Verdana, Arial',
        'opacity': 0.9,
        'z-index': 9999
    }).appendTo("body").fadeIn(200);
}