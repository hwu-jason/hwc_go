try{_UNI_WINDOW}catch(a){_UNI_WINDOW=!0,UniWindow=function(a,b){_root.isExist(b)||(b=new Object),this.m_dwPaddingX=14,this.m_objWindow=null,this.m_objBnOk=null,this.m_objBnCancel=null,this.m_szOkText=_lang.window.ok,this.m_szCancelText=_lang.window.cancel,this.m_szPanelId=a,this.m_funcOnClickOk=function(){_global.debug("UniWindow.js","You have to define OnClick function first.")},this.m_funcOnClickCancel=function(){_global.debug("UniWindow.js","You have to define OnCancel function first.")},this.m_funcOnResize=function(a){},this.setOkText=function(a){this.m_szOkText=a,this.m_objBnOk.setText(a)},this.setOkDisabled=function(a){this.m_objBnOk.setDisabled(a)},this.setCancelDisabled=function(a){this.m_objBnCancel.setDisabled(a)},this.setCancelText=function(a){this.m_szCancelText=a,this.m_objBnCancel.setText(a)},this.setTitle=function(a){this.m_objWindow.setTitle(a)},this.setWidth=function(a){this.m_objWindow.setWidth(a)+this.m_dwPaddingX},this.setSize=function(a,b){this.m_objWindow.setSize(a,b)},this.hide=function(){this.m_objWindow.hide()},this.show=function(a){this.m_objWindow.show()},this.m_objBnOk=new Ext.Button({_parent:this,text:this.m_szOkText,handler:function(){this._parent.m_funcOnClickOk()}}),this.m_objBnCancel=new Ext.Button({_parent:this,text:this.m_szCancelText,handler:function(){this._parent.m_funcOnClickCancel()}});var d=(_root.getWidth(_root.get(this.m_szPanelId))+this.m_dwPaddingX,[this.m_objBnOk]);0==b.closable||d.push(this.m_objBnCancel),this.m_objWindow=new Ext.Window({width:500,closeAction:"hide",modal:!0,items:[new Ext.Panel({applyTo:this.m_szPanelId,border:!1,autoHeight:!0})],uniWindow:this,closable:0!=b.closable,resizable:!_root.isExist(b.resizable)||b.resizable,draggable:!_root.isExist(b.draggable)||b.draggable,buttons:d}),this.m_objWindow.on("afterrender",function(a){var b=Ext.get(a.uniWindow.m_szPanelId);b.applyStyles("visibility:visible")}),this.m_objWindow.on("resize",function(a){var b=a.getInnerWidth(),c=a.getInnerHeight();_root.setSize(_root.get(a.uniWindow.m_szPanelId),b,c),a.uniWindow.m_funcOnResize(a)})}}