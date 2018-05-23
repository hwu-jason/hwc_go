/*
 * VERSION 2.0.2
 * UNIXMLGRID WORDED WITH THE FACT EDITING EVENT PAGE CHANGED
 * AUTHOR: YU-EN WU, 2011 MAY - LAST MODIFIED
 */  
// #ifdef _GLOBAL_FUNCTION
try{if(_UNI_XMLGRID);
}catch(e){
// #define _GLOBAL_FUNCTION true
_UNI_XMLGRID = true;
_UNI_TMP = null;
/**
	UniXmlGrid Class of the grid with all the available components. 
	This store of grid is via XML communication way with an AJAX server.
 	<p>The AJAX server have to receive 4 parameters which are:
		<ul>
		  <li><b>start</b>: The data start from.</li>
		  <li><b>limit</b>: The selected data amount</li>
		  <li><b>sort</b>: Sort by column id</li>
		  <li><b>dir</b>: Sort by DESC or ASC</li>
		</ul>
	</p>
	<p>
	  To create an UniXmlGrid:
	  <div style="padding:10px 10px 10px 20px; background-color:#EEE;">
	    var myGrid = new UniXmlGrid(["col1","col2"],["headerText1", "headerText2], "record", "id", "myAjaxServer.php", {checkbox:true, indexCol:true});
		
	  </div>
	</p>
	@version 2.0.3, Author: <a href="mailto:johnny_wu@uni.com.tw">Johnnie Wu</a>
	@class
	@param {Array&lt;Object&gt;} arrCols -  An array contain the structure of configurations. The attributes goes like:
		<ul>
		  <li><b>id</b>: columns' ID. *** Notice, they might be the same as the column name in database.</li>
		  <li><b>header</b>: The column's text to display</li>
		  <li><b>editor</b>: For the row editor, if you enable the row editor, you have to specify this configuration.
		  	the detail please see <a href="http://dev.sencha.com/deploy/dev/docs/#expand?class=Ext.Editor" target="_blank">ExtJs Doc#Editor</a>.</li>
		  <li><b>szUrlAddRecord</b>: For the row editor, after added a row, it will send data to the AJAX server with this location</li>
		  <li><b>szUrlEditRecord</b>: For the row editor, after edited a row, it will send data to the AJAX server with this location</li>
		</ul>
	@param {String} szRecordTag -  The record tag of XML structure data.
	@param {String} szIdTag -  The record's Id tag name
	@param {String} szUrl -  The URL of AJAX server
	@param {Object} objConfig -  The configurations for enabled checkbox column, index column or paging toolbar.
		<ul>
 		  <li><b>checkbox</b>: true for enable checkbox column, false for not</li>
		  <li><b>indexCol</b>: true for enable index column, false for not</li>
		  <li><b>rowEditor</b>: true for enable row editor, false for otherwise</li>
		</ul>
 */
UniXmlGrid = function(arrCols, szRecordTag, szIdTag, szUrl, objConfig){
	
	if(objConfig==null||objConfig=="undefined")
		objConfig={};
	
	 /** The Element ID on the grid.
	  *  @Type String */
	this.focusID = null;  //@c 
	
	
	
	/** The background on the grid.
	  *  @Type String */
	this.background = null;  
		
	this.rowSelections = [];
	/** The Ext.XmlReader instance
	 *	@type Ext.data.XmlReader
	 */
	this.m_objXmlReader = null; 
	
	/** The Ext.Store instance
	 *	@type Ext.data.Store*/
	this.m_objStore = null; 
	
	/** The Ext.CheckboxSelectionModel instance
	 *	@type Ext.grid.RowSelectionModel/Ext.grid.CheckboxSelectionModel */
	this.m_objSelModel = null; 
	
	/** The Ext.LockingColumnModel instance
	 *	@type Ext.ux.grid.LockingColumnModel */
	this.m_objColModel = null;
	
	/** The combobox on the paging toolbar 
	  *	@type Ext.form.ComboBox*/
	this.m_objComboBox = null; 
	
	/**	The drop target
	 * 	@type Ext.dd.DropTarget
	 */
	this.m_objDdDropTarget = null;
	
	/** The Ext.PagingToolbar instance
	 * @type Ext.PagingToolbar*/
	this.m_objPagingToolbar = null;
	
	/** The Ext.LockingGridView instance
	 *	@type Ext.grid.GridView*/
	this.m_objGridView = null;
	
	/** The Ext.EditorGridPanel instance
	 *	@type Ext.grid.GridPanel*/
	this.m_objGridPanel = null;

	/** The Ext.ux.RowEditor instace, if no specified, it will be null
		@type Ext.ux.RowEditor */
	this.m_objRowEditor = null;
	
	/**	The Ext.data.HttpProxy
	 * 	@type Ext.data.HttpProxy
	 */
	this.m_objProxy = null;
	
	/** The columns headers
	 *	@type Array&lt;String&gt;*/
	this.m_arrCols = arrCols;
	
	/** Record tag name
	 *	@type String*/
	this.m_szRecordTag = szRecordTag;
	
	/** Id tag
	 *	@type String*/
	this.m_szIdTag = szIdTag;	

	/** The response server location
	 *	@type String*/
	this.m_szUrl = szUrl;

	/**	When a record added, it will send data to this path via AJAX request
		@requires <span style="color:RED">Row editor enabled</span>
		@type String */
	this.m_szUrlAddRecord = objConfig.szUrlAddRecord;
	
	/** When a record edited, it will send data to this path via AJAX request.
		If you want to enable the row editor, make sure you have give the right configuration while creating
		UniXmlGrid
		@see UniXmlGrid
		@requires <span style="color:RED">Row editor enabled</span>
		@type String*/
	this.m_szUrlEditRecord = objConfig.szUrlEditRecord;

	/**	The edit mode. There are "normal", "add", "edit".
		@type String */
	this.m_szEditMode = "normal";
	
	/**	Query SQL string if server provided, this data would be constructed while store is loaded
	 * 	@type String
	 */
	this.m_szSql = null;
	
	/**	For excel export used, this data would be constructed while store is loaded
	 * 	@type String
	 */
	this.m_szColMap = null;
	
	/** Default paging size
	 *	@type Integer
	 */
	//this.m_dwPageSize = 5;
	this.m_dwPageSize = 20;
	
	/** To hold the current page
	 * 	@type Integer
	 */
	this.m_dwNowRecordIdx = 0;
	
	/**	The flag to controller if the column can be moved or not
	 * 	@type String
	 */ 
	this.m_bDisabledMoveColumn = false;
	
	/**	The flag to determine the grid need checkbox column or not
	 * 	@type Boolean
	 */
	this.m_bIsCheckboxColumn = objConfig.checkbox;
	
	/**	The flag to determine the grid need index column or not
	 * 	@type Boolean
	 */
	this.m_bIsIndexColumn = objConfig.indexCol;
	
	/**	This is the option object for containing parameters during every transcation while using row editor
	 * 	@type {Object}
	 */
	this.m_userPreviousOpt = new Object();
	

	/** The callback function of the fact fires when the row added
	 *	{@link #setEvent}.
	 *	@see #setEvent
	 *  @event 
		@requires <span style="color:RED">Row editor enabled</span>
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@param {Ext.data.Record} objRecord - The record object of the selected record(row)
	 *	@param {Object} objResponse - The response of XML request
	 *	@return {Void}
	 */
	this.m_funcAfterAdded = function(objUniXmlGrid, objRecord, objResponse){};
	
	/**	The callback function of the fact fires when row editor add data failed. 
	 * 	Occurs while 404, 500 error, including logical errors
	 * 	@event
	 * 	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 * 	@param {Ext.data.Record} objRecord - The record for adding
	 * 	@param {Object} objResponse - The response of XML request 
	 * 	@return {Void}
	 */
	this.m_funcAddedFailed = function(objUniXmlGrid, objRecord, objResponse){};
	
	/** The callback function of the fact fires when the row edited
	 *	{@link #setEvent}.
	 *	@see #setEvent
	 *  @event 
		@requires <span style="color:RED">Row editor enabled</span>
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@param {Integer} dwIndex - The index of selected row
	 *	@param {Ext.data.Record} objRecord - The record object of the selected record(row)
	 *	@param {Object} objResponse - The response object of XML request
	 *	@return {Void}
	 */
	this.m_funcAfterEdited = function(objUniXmlGrid, dwRowIndex, objRecord, objResponse){};
	
	/**	Fires when the data cache has changed in a bulk manner (e.g., it has been sorted, filtered, etc.)
	 *  and a widget that is using this Store as a Record cache should refresh its view.
	 *  @event
	 * 	@param {Object} objUniXmlGrid - The caller instance
	 * 	@return {Void}
	 */
	this.m_funcDataChanged = function(objUniXmlGrid){};
	
	/**	The callback function of the fact fires while row editor 
	 * 	Only occurs while 404, 500 error, excluding logical errors
	 * 	@event
	 * 	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 * 	@param {Integer} dwRowIndex - The index of edited record
	 * 	@param {Ext.data.Record} objRecord - The record for adding
	 * 	@param {Object} objResponse - The response of XML request 
	 * 	@return {Void}
	 */
	this.m_funcBeforeEdit = function(uniGrid, record, index){};
	
	/**	The callback function of the fact fires when row editor edit data failed. 
	 * 	Occurs while 404, 500 error, including logical errors
	 * 	@event
	 * 	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 * 	@param {Integer} dwRowIndex - The index of edited record
	 * 	@param {Ext.data.Record} objRecord - The record for adding
	 * 	@param {Object} objResponse - The response of XML request 
	 * 	@return {Void}
	 */
	this.m_funcEditedFailed = function(objUniXmlGrid, dwRowIndex, objRecord, objResponse){};
	
	/**	Fires when the item has been dropped in the grid
	 * 	@event
	 * 	@param {UniXmlGrid} uniGrid - The caller instance
	 * 	@param {Ext.dd.DragSource} ddSource - The caller instance
	 * 	@param {Event} e - The event
	 * 	@param {Object} data - An object containing arbitrary data supplied by the drag source
	 * 	@return {String} - Status The CSS class that communicates the drop status back to the source so that the 
	 * 					   underlying can be updated
	 */
	this.m_funcAfterDropped = function(uniGrid, ddSource, e, data){};
	
	/** The callback function of the fact fires when selected a row. If you want to set this event, please see
	 *	{@link #setEvent}.
	 *	@see #setEvent
	 *  @event 
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@param {Integer} dwIndex - The index of selected row
	 *	@param {Ext.data.Record} objRecord - The record object of the selected record(row)
	 *	@return {Void}
	 *	
	 */
	this.m_funcOnSelectRow = function (objUniXmlGrid, dwRowIndex, objRecord){};
	
	
	/** The callback function of the fact fires when deselected a row. If you want to set this event, please see
	 *	{@link #setEvent}.
	 *	@see #setEvent
	 *  @event 
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@param {Integer} dwIndex - The index of selected row
	 *	@param {Ext.data.Record} objRecord - The record object of the selected record(row)
	 *	@return {Void}
	 *	
	 */
	this.m_funcOnDeselectRow = function (objUniXmlGrid, dwRowIndex, objRecord){};
	
	/**	The callback function of the fact fires when the selection changed. 
	 *	If you want to set this event, please see {@link #setEvent}.
	 *	@see #setEvent
	 *	@event
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@return {Void}*/
	this.m_funcOnSelectionChange = function (objUniXmlGrid,selection){};
	
	/**	The callback function is fired when the data has been loaded.
	 *	If you want to set this event, please see {@link #setEvent}.
	 *	@see #setEvent
	 *	@event
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@param {Array&lt;Ext.Record&gt;} arrRecords - The array contained the records
	 *	@param {Object} oConf - The configurations object(structure).
	 *	@return {Void} */
	this.m_funcOnLoaded = function(objUniXmlGrid, arrRecords, oConf){};
	
	/**	The callback function is fired when the data loaded failed, 
	 * 	including timeout, 404 not found, 500 internal error of responded server.
	 *	@event
	 *	@param {UniXmlGrid} objUniXmlGrid - The caller instance
	 *	@return {Void}
	 */
	this.m_funcOnLoadException = function(objUniXmlGrid, szType, szAction, opts, res, arg ){};
	
	this.m_loadMask = objConfig.loadMask;
	
////////////////////////////////////////////////////////////////////////////////
// METHODS:
	/**	To add a row into the store. To enter the adding mode, please call "startAdding".
		@see #startAdding
		@param {Ext.data.Record} record - The record
		@return {Void}
	 */
	this.addRow = function(rec){
		// Get the last record
		lastRecord = this.m_objStore.getAt(this.getCount()-1);
		
		// Build a default record data
		var __conf = new Object();
		for(var i=0; i<this.m_arrCols.length; i++){
			var id =this.m_arrCols[i].id;
			__conf[id]=this.m_arrCols[i].defaultValue;		
		}
		
		// If specified index column, update it
		if(_root.isExist(lastRecord))
			__conf['__index'] = parseInt(lastRecord.get('__index')) + 1;
		else
			__conf['__index'] = "0";
			
			
		// Create a record instance
		r = new this.m_objStore.recordType(__conf);
		if(!_root.isExist(rec))
			this.m_objStore.add(r); // Add into
		else{
			r.markDirty(true); // Mark it
			this.m_objStore.add(rec); // Add into
		}
		this.startEdit(this.getCount()-1, "add"); // Start editing it within mode "add"
	};
	
	/**	Clear the base parameters which are sent with all the requests
	 * 	@return {Object} - The original parameters.
	 */
	this.clearParam = function (){
		var p = this.m_objStore.baseParams;
		this.m_objStore.baseParams = {};
		return p;
	};
	
	/** To clear the selections
	 *	@return {Void}*/
	this.clearSelections = function(){ this.m_objSelModel.clearSelections();};
	this.clearAllSelections = function(){ this.m_objSelModel.clearAllSelections();};	// add by Dickens @ 20111129-0930
	
	/** To destroy this object. After called this method, the grid and the components will also
	 *	be destroyed.
	 *	@return {Void}*/
	this.destroy = function(){
		try{
			// Destroy grid panel and elements
			this.m_objGridPanel.destroy();
		}catch(e){}
		// Destroy elements in UniGrid
		for(szIndex in this)
			delete this[szIndex];
	};
	

	/**	To disable any fact which cause refreshing.
	 * 	@param {Boolean} b - True for disable, false for enable toolbar
	 * 	@return {Void}
	 */
	this.disableRefresh = function(b){
		if(!_root.isExist(this.arrMenuEnable)){
			this.arrMenuEnable = new Array();
			for(var i=0; i<this.m_objColModel.getColumnCount(); i++){
				this.arrMenuEnable.push(this.m_objColModel.isSortable(i));
			}
		}
		
		if(b==true){
			this.hidePagingTB();
			try{this.m_objGridPanel.getTopToolbar().hide();}catch(e){}
			for(var i=0; i<this.m_objColModel.getColumnCount(); i++){
				if( this.m_objColModel.config[i].checkboxCol==true ||
					this.m_objColModel.config[i].id == "numberer"
					)
					continue;
				this.arrMenuEnable[i] = (this.m_objColModel.isSortable(i));
				this.m_objColModel.columns[i].sortable = false; 
				this.m_objColModel.columns[i].menuDisabled = true;
			}
			this.m_bDisabledMoveColumn = true;
		}
		else{
			this.showPagingTB();
			try{this.m_objGridPanel.getTopToolbar().show();}catch(e){}
			for(var i=0; i<this.m_objColModel.getColumnCount(); i++){
				if( this.m_objColModel.config[i].checkboxCol==true ||
						this.m_objColModel.config[i].id == "numberer"
						)
						continue;
				this.m_objColModel.columns[i].sortable = this.arrMenuEnable[i];
				this.m_objColModel.columns[i].menuDisabled = false;
			}
			this.m_bDisabledMoveColumn = false;
		}
	};
	
	/**	To export data as an excel file
	 * 	@requires The &lt;sql&gt; is provided by response server
	 * 	@return {Void}
	 */
	this.exportExcel = function(){
		if(this.m_szSql==null || this.m_szColMap==null)
			return;
		
		//will add
		//alert(window.location.toString());
		var url = window.location.pathname.toString();
		url = url.replace("/", "");
		url = url.replace(".jsp", "");
		var fun_name = _lang.sitemap[url];

		_root.g_downloadExcel(Ext.util.Format.htmlDecode(this.m_szSql), this.m_szColMap , fun_name);
	};
	
	/** To disable the movement of columns
	 * 	@param {Boolean} bMovement - True for unmoveable, false for moveable
	 * 	@return {Void}
	 */
	this.disableColumnMove = function(bMovement){
		this.m_bDisabledMoveColumn = bMovement;
	};
	
	/** To disable the paging toolbar
	 * @param {Boolean} bDisabled - True for disable, false for enable
	 * @return {Void}
	 **/
	this.disablePagingTB = function(bDisabled){
		if (bDisabled === true) {
			this.m_objPagingToolbar.disable();
		}
		else {
			this.m_objPagingToolbar.enable();
		}
	};
	
	/** To hide paging toolbar
	 * 	@return {Void}
	 */
	this.hidePagingTB = function(){
		try{
			var w=this.m_objGridPanel.getWidth();
			var h=this.m_objGridPanel.getHeight();
			this.m_objPagingToolbar.hide();
			this.m_objGridPanel.setSize(0,0);
			this.m_objGridPanel.setSize(w,h);
		}catch(e){};
	};
	
	/** To show paging toolbar
	 * 	@return {Void}
	 */
	this.showPagingTB = function (){
		try{
			var w=this.m_objGridPanel.getWidth();
			var h=this.m_objGridPanel.getHeight();
			this.m_objPagingToolbar.show();
			this.m_objGridPanel.setSize(0,0);
			this.m_objGridPanel.setSize(w,h);
		}catch(e){};
	};
	
	this.hidePagingTBSPAN = function (){
		try{
			var doc = this.m_objPagingToolbar.el.dom;			
			var els = doc.getElementsByTagName("span");
			for(var i =0; i < els.length; i++){
				//els[i].parentNode.hidden = true;
				_root.hideElement(els[i].parentNode);
			}
			//this.m_objPagingToolbar.refresh.el.dom.parentNode.hidden = true;
			_root.hideElement(this.m_objPagingToolbar.refresh.el.dom.parentNode);
			this.m_objPagingToolbar.displayItem.hide();
			var elInps = doc.getElementsByTagName("input");
			this.m_objComboBox.container.dom.firstChild.style.cssText = "width:45px;";
			for(var i =0; i < els.length; i++){
				if(elInps[i].parentNode.tagName != "div")
					elInps[i].style.cssText = "width:20px !important;";
			}
		}catch(e){};
	};
	
	/** Get all records in the grid
	 *	@return {Array&lt;Ext.Record&gt;} - The records now displaying (Reference Only)
	 **/
	this.getAllRecords = function(){return this.m_objStore.getRange();};
	
	/**	This method is used to set column width and order follows configuration command
	 * 	@param {String} szConfig - The configuration command
	 * 	@return {Void}
	 */
	this.setColumnConfigs = function(szConfig){
		var arrColumns = szConfig.split(";");
		arrColumns.pop(); // Remove the last empty element
		for(var i=0; i<arrColumns.length; i++){
			var c=arrColumns[i].split(",");
			var id = c[0];
			var oldIndex = this.m_objColModel.getIndexById(id);
			if(oldIndex != -1){
				var newIndex = 0;
				var w  = c[1];
				var hidden = c[2];
				var bool = (hidden === "true");
				if(this.m_bIsCheckboxColumn==null||this.m_bIsCheckboxColumn=="undefined"||this.m_bIsCheckboxColumn==false);else
					newIndex++;
				if( this.m_bIsIndexColumn==null||this.m_bIsIndexColumn=="undefined"||this.m_bIsIndexColumn==false);else
					newIndex++;
				newIndex += i;
				this.setColumnWidth(id, parseInt(w));
				this.setHiddenById(id,bool);
				this.m_objColModel.moveColumn(oldIndex, newIndex);	
			}
			
		}		
	};
	
	// Column Id:String,Hidden:Integer,Width:Integer;
	/** This method is used to serialize the configurations of columns
	 * 	@return {String} - The serialized configuration
	 */
	this.serializingColumnConfigs = function () {
		var szConfigs = "";
		var arrColumns = new Array();
		for(var i=0; i<this.m_arrCols.length; i++){
			var idx = this.m_objColModel.getIndexById(this.m_arrCols[i].id);
			var w = this.m_objColModel.getColumnWidth(idx);
			var hidden = this.m_objColModel.getColumnAt(idx).hidden;
			arrColumns[idx]=this.m_arrCols[i].id+","+w+","+hidden;
		};
		// console.log(arrColumns);		
		if(this.m_bIsCheckboxColumn==null||this.m_bIsCheckboxColumn=="undefined"||this.m_bIsCheckboxColumn==false);else
			arrColumns.shift();
		if( this.m_bIsIndexColumn==null||this.m_bIsIndexColumn=="undefined"||this.m_bIsIndexColumn==false);else
			arrColumns.shift();
		
		for(var i=0;i<arrColumns.length; i++)
			szConfigs += arrColumns[i] + ";";
		
		return szConfigs;
	};
	
	/** Get the amount of records
	 * @return {Integer} - The amount of records 
	 **/
	this.getCount = function(){return this.m_objStore.getCount();};
	
	/** Get the status of row editor
	 * 	@return {String} - "normal" for normal mode, "add" / "edit" for the current mode.
	 */
	this.getRowEditorStatus = function(){
		return this.m_szEditMode.toLowerCase();
	};
	
	/** To get the total record amount on the server, to get amount of now displaying please see getCount()
	 * 	@return {Integer}
	 */
	this.getTotalRecordsCount = function (){
		try{
			return this.m_objPagingToolbar.store.totalLength;
		}catch(e){
			return 0;
		}
	};
	
	/**	To get the selected record. This record is the first one you selected if selected multiple records.
	 *	@return {Ext.data.Record} - The first selected record*/
	this.getSelected = function () { return this.m_objSelModel.getSelected();};
	
	/**	To get the selected records.
	 *	@return {Array&lt;Ext.Record&gt;} - The selected records set*/
	this.getSelections = function(){ return this.m_objSelModel.getSelections();};
	
	/**	Get the editing record is modified or not
	 * 	@requires Row editor enabled
	 * 	@return {Boolean} - True for modified, false for not
	 */
	this.isChanged = function(){
		return this.m_objRowEditor.isChanged();
	};
	
	/**	Return if the columns under editing are all valid on the row editor.
	 * @requires Row editor enabled
	 * @return {Boolean}
	 **/
	this.isEditorValid = function(bShowMessage){
		var bValid = this.m_objRowEditor.isValid();
		
		// If invalid
		if(bShowMessage && bValid == false)
			this.m_objRowEditor.showTooltip_once(this.m_objRowEditor.commitChangesText);
		return bValid;
	};
	
	/**	To load the remote server with specified configuration. The callback function can be assigned.
	 *	@param {Object} oConf - The configuration object. 
	 		See also <a href="http://dev.sencha.com/deploy/dev/docs/#expand?class=Ext.data.Store" target="_blank">Ext.data.Store</a>
	 *	@return {Void} */
	this.load = function(oConf){
		if(!_root.isExist(oConf))
			oConf = new Object();
		
		if(!_root.isExist(oConf.params))
			oConf.params = {};
		oConf.params.start = 0;
		oConf.params.limit = this.m_dwPageSize; 
		this.m_objStore.load(oConf);
		// alert(this.m_objStore.getTotalCount());

	};
	
	/**	To reload the data on the remote server.
	 *	@return {Void}
	 **/
	this.refresh = function(){ this.m_objPagingToolbar.doRefresh();};
	
	/**	To render the grid panel to the specified element
	 *	@param {String} szTarget - The id of the element for rendering
	 *	@return {Void}
	 **/
	this.render=function(szTarget){
		this.m_objGridPanel.render(szTarget); // Rendered
		
		if(this.background!=null){
			this.m_objGridView.scroller.dom.style.background = this.background;
		}
		else{
			this.m_objGridView.scroller.dom.style.backgroundImage="url(/images/gridbackground.png)";
			this.m_objGridView.scroller.dom.style.backgroundRepeat="repeat";
		}

		// Enable drag and drop module or not
		
		if(_root.isExist(objConfig.ddGroup)){
			// This will make sure we only drop to the gview scroller element 
	        this.m_objDdDropTarget = new Ext.dd.DropTarget(this.m_objGridView.scroller.dom, {
	        	uniGrid: this,
	        	ddGroup: objConfig.ddTarget,
	        	notifyDrop: function(ddSource, e, data){
	        		this.uniGrid.m_funcAfterDropped(this.uniGrid, ddSource, e, data);
	        	}
	        });
			
	        // Hack the selection model
			// Due to unavailable event "rowmousedown" for checkbox column, here create a flag to remember
			// if the row has been just selected or not. If select with checkbox column, even though the row has 
			// been selected or not, it will call "processEvent" thus we should override this method below.
			// However, if the row is selected by normal row selection model(means not selected by checkbox column),
			// it will call method "handleMouseDown", thus we have to override this method, too.
			this.justSelect = false;
			this.m_objSelModel.processEvent=function(name, e, grid, rowIndex){
				// If the row is clicked by checkbox column, and it's not just selected, not in the single selecting mode, and
				// it has been selected, we will deselect this row. 
				if (this.justSelect==false && this.isSelected(rowIndex) && !this.singleSelect) {
					this.deselectRow(rowIndex);
				}
				
				// Because of that even click on the checkbox column both trigger "handleMouseDown" and "processEvent", we
				// must make the flag "justSelect" fresh every click event on checkbox column. Here we restore false to it.
				this.justSelect = false;
		    };
			
			// The override area only with the last few lines
			this.m_objSelModel.handleMouseDown=function(g, rowIndex, e){
		        if(e.button !== 0 || this.isLocked()){
		            return;
		        }
		        var view = this.grid.getView();
		        if(e.shiftKey && !this.singleSelect && this.last !== false){
		            var last = this.last;
		            this.selectRange(last, rowIndex, e.ctrlKey);
		            this.last = last; 
		            view.focusRow(rowIndex);
		        }else{
		            var isSelected = this.isSelected(rowIndex);
		            if(e.ctrlKey && isSelected){
		                this.deselectRow(rowIndex);
		            }else if(!isSelected || this.getCount() > 1){
						// Multiple selections only occurred at 
						// 1. Press control to select,
						// 2. Press shift to select,
						// 3. In multiple selection mode and click on checkbox column 
		                this.selectRow(rowIndex, e.ctrlKey || e.shiftKey || (!this.singleSelect&&e.target.className == "x-grid3-row-checker"));
		                view.focusRow(rowIndex);
						
						// If this row is selected by checkbox column, assign flag "justSelect" true to avoid deselect by method "processEvent"
						// NOTE: Selected by checkbox column will also call method "processEvent".
						if(e.target.className == "x-grid3-row-checker")
							this.justSelect = true;
		            }
		        }
		    };
		}
		// Check if customized column enable or not
		if(this.m_bEnableColConfig==false)
			return; // Not, return or gonna synchronize the column configuration on server
		
		
		// Pick up this function's name
		if( _global.funcName == null){
			// Pick up this function's name
			var arrLocations = window.location.href;
			arrLocations = arrLocations.split("/");
			var funcname = arrLocations[arrLocations.length-1];
		}else{
			var funcname = _global.funcName;
		}

		// Build id for server grids
		if(!_root.isExist(_global.funcGridCount))
		{
			_global.funcGridCount = 0;
		}else{
			_global.funcGridCount++;
		}
		funcname = funcname + _global.funcGridCount;
		// Set column configurations
		Ext.Ajax.request({
			url: "clpf/doquery",
			params:{
				uniMask: false,
				funnam: funcname,
				uniGrid: this
			},
			success: function(res, opt){
				var grid = opt.params.uniGrid;
				var szFuncName = opt.params.funnam;
				var objResult = _root.getSpecifiedResponse(["fields","totalRecords"], res);
				grid.funnam = szFuncName;
				// Un-configured
				if(objResult.totalRecords<=0){
					Ext.Ajax.request({
						url: "clpf/doinsert",
						params:{
							uniMask: false,
							funnam: szFuncName,
							fields: grid.serializingColumnConfigs()
						}
					});
					grid.m_objGridPanel.on("columnmove", function(colModel){
						_root.updateColumnConfigs(grid.serializingColumnConfigs(), szFuncName);
					});
					grid.m_objGridPanel.on("columnresize", function(colModel){
						_root.updateColumnConfigs(grid.serializingColumnConfigs(), szFuncName);
					});
					grid.setColFilterList(grid.serializingColumnConfigs(),szFuncName);
				}
				else{					
					grid.setColumnConfigs(objResult.fields); 
					grid.m_objGridPanel.on("columnmove", function(colModel){
						_root.updateColumnConfigs(grid.serializingColumnConfigs(), szFuncName);
					});
					grid.m_objGridPanel.on("columnresize", function(colModel){
						_root.updateColumnConfigs(grid.serializingColumnConfigs(), szFuncName);
					});
					var o_col = objResult.fields;
					var now_col = grid.m_objColModel.getColumnCount();
					if(o_col.split(";").length != now_col){
						now_col = grid.serializingColumnConfigs();
						_root.updateColumnConfigs(now_col, szFuncName);
						grid.setColFilterList(now_col,szFuncName);
					}else{
						grid.setColFilterList(o_col,szFuncName);
					}
					// console.log("o_col == "+o_col.split(";").length+" now_col == "+now_col.split(";").length);					
				}
			}
		});				
	};
	
	this.setColFilterList=function(szConfigs,szFuncName){
		var arrColumns = szConfigs.split(";");
		var arrColList = [];		
		arrColumns.pop(); // Remove the last empty element
		for (var i = 0; i < arrColumns.length; i++) {
			var c=arrColumns[i].split(",");			
			var id = c[0];
			var hidden = (c[2]==="false");
			var idx = this.m_objColModel.getIndexById(id);
			var name = this.m_objColModel.getColumnHeader(idx);
			if(name){
				arrColList.push(
					{
		                checked: hidden,
		                boxLabel: name,
		                name: id
					}
				);
			}
		};
		var col_list_panel = new Ext.FormPanel({
			bodyStyle: 'padding:0 10px 0; background: #fffff',
			layout:'form',
	        labelAlign:'right',
	        hideLabels:true,
			buttonAlign:'left',
			anchor: "0%",
			defaults: {
                itemCls:'colset-form-text'
            },  
	        items: {
	        	layout: "form",
	            xtype: 'fieldset',
	            autoHeight: true,
	            border: false,
	            defaultType: 'checkbox', // each item will be a checkbox
	            labelStyle: 'display:none;',
	            labelWidth: 10,
	            items: arrColList
	        }
		});
		var grid = this;
		this.ColumnFilter = new Ext.Window({
			xtype:"panel",
			// title: "▇ &nbsp; <font color='white'>{{Lang::get('UniXmlGride.ColumnFilter')}}</font>",
			// title: "Lang::get('UniXmlGride.ColumnFilter')",
			title: "▇ &nbsp; <font color='white'>"+_lang.ColumnFilter+"</font>",

			width: 400, //dwOriPanelWidth,
			closeAction: "hide",
			cls:"MonList",
			modal: true,
	        headerCfg:{
	        	cls:'x-win-header'
	        },
	        bodyBorder:false,
	        headerStyle:'padding:0px;',
	        items: [
	            {
	                layout: 'column',
	                border: false,
	                // defaults are applied to all child items unless otherwise specified by child item
	                defaults: {
	                    columnWidth: '2',
	                    border: false
	                },            
	                items: col_list_panel
	            }
	        ],
			closable: true,
			resizable: false,
			draggable: true,
			buttons: [{
	            text: _lang.save,
	            handler: function(e,v){
	            	// console.log(v);
	               	if(col_list_panel.getForm().isValid()){
	               		var list = col_list_panel.getForm().items;
	               		list.each(function(item){
	               			var id = item.name;
	               			var hidden = !item.checked;
	               			grid.setHiddenById(id,hidden);
	               		});
	               		_root.updateColumnConfigs(grid.serializingColumnConfigs(), szFuncName);
	                }
	                grid.ColumnFilter.hide();
	            }
	        }]
		});		
	}
	/**	To set the callback functions. You can also assign the function to the callback event directly.
	 *	@param {String} szType - Set events type. The types are:
	 *		<ul>
	 *		  <li><b>onSelectRow</b>: The function fires when selected row(s)</li>
	 *		  <li><b>onSelectionChange</b>: The function fires when the selection changed</li>
	 *		  <li><b>onloaded</b>: The function fires when the data loaded, even reload.</li>
	 		  <li><b>afterEdited</b>: The function fires when the row be edited by row editor</li>
			  <li><b>afterAdded</b>: The function fires when the row be added by row editor</li>
	 *		</ul>
	 *	@param {Function} func - The callback function. Please see {@link #event:m_funcOnSelectRow},
	 *		{@link #event:m_funcOnSelectionChange}, {@link #event:m_funcOnLoaded}
	 *	@return {Void}*/
	this.setEvent=function(szType, func){switch(szType.toLowerCase()){
		case "onselectrow":		this.m_funcOnSelectRow=func;break;
		case "ondeselectrow":		this.m_funcOnDeselectRow=func;break;
		case "onselectionchange":	this.m_funcOnSelectionChange=func;break;
		case "onloaded":	this.m_funcOnLoaded=func;break;
		case "afteredited": this.m_funcAfterEdited=func;break;
		case "afteradded": this.m_funcAfterAdded=func;break;
		default: _global.debug("UniXmlGrid.js", "In function \"setEvent\", the event type is unmatched.");
	}};
	
	/**	To set the column disable edit by its ID.
	 *	@param {String} szColId - The id of the column to be hided
	 *	@param {Boolean} bEnable - True for uneditable, false for editable
	 *	@return {Void}*/
	this.setDisabledById=function(szColId, bEnable){
		var colmodel=this.m_objColModel;
		// Get index of specified column
		for(var i=0; i<colmodel.config.length;i++){
			var c=colmodel.config[i];
			if(c.id == szColId){
				c.editor.disabled=bEnable;
				return;
			}
		}
		_global.debug("UniXmlGrid.js", "In function \"setDisabledById\", the specified ID doesn't exist.");
	};
	
	/**	To set the column hidden by its ID.
	 *	@param {String} szColId - The id of the column to be hided
	 *	@param {Boolean} bHidden - True for hidden, false for visible
	 *	@return {Void}*/
	this.setHiddenById=function(szColId, bHidden){
		var colmodel=this.m_objColModel;
		// Get index of specified column
		for(var i=0; i<colmodel.config.length;i++){
			var c=colmodel.config[i];
			if(c.id == szColId){
				colmodel.setHidden(i, bHidden);
				return;
			}
		}
		_global.debug("UniXmlGrid.js", "In function \"setHiddenById\", the specified ID doesn't exist.");
	};
	
	/**	To set the column hidden by its index.
	 *	@param {Integer} dwIdx - The index of the column to be hided
	 *	@param {Boolean} bHidden - True for hidden, false for visible
	 *	@return {Void}*/
	this.setHiddenByIndex = function(dwIdx, bHidden){this.m_objColModel.setHidden(dwIdx, bHidden);};
	
	/**	To set the size of page on the paging toolbar
	 *	@param {Integer} size - The page size
	 *	@return {Void} */
	this.setPageSize=function(size){
		this.m_dwPageSize = size;
		this.m_objPagingToolbar.pageSize=size;
		this.m_objComboBox.setValue(size);
	};
	
	/**	To set the parameters for all the request until reset or clear parameters.
	 * 	@param {Object} oParam - The object contained the parameters
	 * 	@return {Object} - The original parameters
	 */
	this.setParam=function(oParam, bDontClear){
		if(bDontClear == true);else
			var p = this.clearParam(); // Clear parameters first
		for(szIndex in oParam){ // Build base parameters
			this.m_objStore.setBaseParam(szIndex, oParam[szIndex]);
		}
		return p;
	};
	 
	/**	To set the header of the column
	 * 	@param {String} szColId - The ID of the column
	 * 	@param {String} szHeader - The text
	 * 	@return {Void}
	 */
	this.setColumnHeader = function(szColId, szHeader){
		this.m_objColModel.setColumnHeader(this.m_objColModel.getIndexById(szColId), szHeader);
	};
	
	/**	To set the width of the specified column
	 * @param {Object} szColId - The id of the column.
	 * @param {Object} dwWidth - The width which will be setted
	 * @return {Void}
	 */
	this.setColumnWidth = function(szColId, dwWidth){
		this.m_objColModel.setColumnWidth(this.m_objColModel.getIndexById(szColId), dwWidth);
		return;
	};
	
	/**	To set the tip of the column, showing tips while mouse over it
	 * 	@param {String} szColId - The column ID
	 * 	@param {String} szTips - The tips text
	 * 	@return {Void}
	 */
	this.setColumnTooltipById = function(szColId, szTips){
		this.m_objColModel.setColumnTooltip(this.m_objColModel.getIndexById(szColId), szTips);
	};
	
	/**	To set the renderer for the column
	 * 	@param {String} szColId - The column ID
	 * 	@param {Function} funcRender - The event for renderer
	 * 	@return {Void}
	 */
	this.setRenderer = function(szColId, funcRender){
		this.m_objColModel.setRenderer(this.m_objColModel.getIndexById(szColId), funcRender);
	};
	
	/** To make grid unselectable or selectable
	 * 	@param {Boolean} bIsSelectable - True for selectable, false for not
	 * 	@return {Void}
	 */
	this.setSelectable = function(bIsSelectable){
		if(bIsSelectable==true)
			this.m_objSelModel.unlock();
		else if(bIsSelectable==false){
			this.clearSelections();
			this.clearAllSelections();	// add by Dickens @ 20111129-0930
			this.m_objSelModel.lock();
		}	
		else;
			
	};
	
	/** To make the grid only be selected a record. Call this method the selection will be cleared.
	 *	@param {Boolean} bIsSingle - True for sigle, false for multiple
	 *	@return {Void}
	 **/
	this.setSingleSelect=function(bIsSingle){
		this.clearSelections();
		this.clearAllSelections();	// add by Dickens @ 20111129-0930
		this.m_objSelModel.singleSelect = bIsSingle;
		// Enable drag and drop module, the mouse event would be overrided in function "render"
		if(_root.isExist(objConfig.ddGroup));
		else{
			if(bIsSingle){
				if(!_root.isExist(this.m_objSelModel.oriOnMouseDown)){
					this.m_objSelModel.oriOnMouseDown = this.m_objSelModel.onMouseDown;
					this.m_objSelModel.onMouseDown=function(e, t){
				        if(e.button === 0 && t.className == 'x-grid3-row-checker'){ 
				            e.stopEvent();
				            var row = e.getTarget('.x-grid3-row');
				            if(row){
				                var index = row.rowIndex;
				                if(this.isSelected(index)){
				                    return;
				                }else{
				                    this.selectRow(index, false);
				                    this.grid.getView().focusRow(index);
				                }
				            }
				        }
				    };// onMouseDown
				}// if(_root.Exist...)
			}else{
				if(_root.isExist(this.m_objSelModel.oriOnMouseDown)){
					this.m_objSelModel.onMouseDown=this.m_objSelModel.oriOnMouseDown;
					delete this.m_objSelModel.oriOnMouseDown;
				}
			}
		}
		
		if(bIsSingle)
			this.m_objGridPanel.addClass("uniRadioColumn");
		else
			this.m_objGridPanel.removeClass("uniRadioColumn");
	};
	
	/**	To set the width and height of the grid panel
	 *	@param {Integer} width - The width of grid panel (px)
	 *	@param {Integer} height - The height of grid panel (px)
	 *	@return {Void}
	 **/
	this.setSize=function(width, height){this.m_objGridPanel.setSize(width, height);};
	
	/**	To set the title of grid
	 * 	@param {String} szTitle - The title text
	 * 	@return {Void}
	 */
	this.setTitle = function (szTitle){
		this.m_objGridPanel.setTitle(szTitle);
	};
	
	/**	To set the default URL for grid to query the AJAX server. This url is for view, not for row editor.
	 * 	@param {String} szUrl - The url
	 * 	@return {Void}
	 */
	this.setUrl=function(szUrl){
		this.m_szUrl = szUrl;
		this.m_objProxy.setUrl(this.m_szUrl, true);
	};
	
	/**	If enabled row edit, call this method can start editing
		@requires <span style="color:RED">Row editor enabled</span>
		@param {Integer} - The row index for editing
		@return {Void} */
	this.startEdit=function(dwRowIndex, szMode/*private parameter*/){
		if(this.getCount()<=0){
			_root.restoreToolbar();
			return;
		}
		
		// Default editing mode is "edit", rather than "add"
		if(_root.isExist(szMode))
			this.m_szEditMode = szMode;
		else
			this.m_szEditMode = "edit";
		
		// If the mode is "add", make sure user cannot change editing target.
		if(this.m_szEditMode!="add")
			this.m_objRowEditor.enableClicksToEdit = true;
		
		this.m_objRowEditor.startEditing(dwRowIndex==null||dwRowIndex=='undefined'?0:dwRowIndex, "auto");
		this.clearSelections();
		this.clearAllSelections();	// add by Dickens 20111129-0930
		this.m_objSelModel.lock();
		this.disableColumnMove(true);
	};
	
	/** If enabled row edit, call this method to stop editing
		@requires <span style="color:RED">Row editor enabled</span>
		@param {Boolean} bSaveChanges - True for save the changed, false for don't save it.
		@return {Void} */
	this.stopEdit=function(bSave, bFinish){
		
		if(bSave==false && bFinish==true){ // Leaving
			this.m_userTriggerReload = false;
		}
		this.m_objRowEditor.enableClicksToEdit = false;
		this.m_objRowEditor.stopEditing(bSave, bFinish,false);
		
		// Show checkbox back		
		var colmodel=this.m_objColModel;
		
		// Get index of specified column
		for(var i=0; i<colmodel.config.length;i++){
			var c=colmodel.config[i];
			if(c.checkboxCol)
				colmodel.setHidden(i, false);
		};
		this.m_objSelModel.unlock();
		this.m_szEditMode = "normal";
		
		// Finished and no saving
		if(bFinish && !bSave){
			this.refresh();
			this.disableRefresh(false);
			_root.restoreToolbar();
		}
	};
	
	/** If enabled row editor, call this method to enter adding mode.
		@requires <span style="color:RED">Row editor enabled</span>
		@return {Void}*/
	this.startAdding=function(){
		this.m_szEditMode = "add";
		this.disableRefresh(true);
		this.addRow();
	};
	
	/** If enabled row editor and started adding mode, call this method to stop adding mode.
		@requires <span style="color:RED">Row editor enabled</span>
		@param {Boolean} bSave - True for save the changes, false otherwise
		@return {Void}*/
	this.stopAdding=function(bSave){
		if(bSave && this.isEditorValid(true) == false){ // Save but input is invalid
			return;
		}
		this.stopEdit(bSave, true);
	};
  
  /**  To set default ID to focus Element.
  */
  this.setFocusId=function(bID){  //@c
  	this.focusID=bID;
  }


////////////////////////////////////////////////////////////////////////////////
// CONSTRUCT:
	// TODO: Constructs
	var arrColsIds = Array();
	
	for(var i=0; i<this.m_arrCols.length; i++)
		arrColsIds.push(this.m_arrCols[i].id);
	
	// Build a XML reader
	this.m_objXmlReader = new Ext.data.XmlReader({
		uniGrid: this,
		record: this.m_szRecordTag,
		id: this.m_szIdTag,
		totalProperty: "totalRecords"
	}, arrColsIds);
	

	// Build proxy object
	this.m_objProxy = new Ext.data.HttpProxy({
		uniGrid: this,
        url: this.m_szUrl,
        method: 'post',
        proxyLoadMask: this.m_loadMask
    }); 
	
	// The transaction event
	this.m_objProxy.on("exception",  function(proxy, szType, szAction, opts, res, arg ){
		var uniGrid = proxy.conn.uniGrid;
		switch(szType){
		case "response":
			if(res.isTimeout)
				_root.messageBox(_lang.msg.tranTimeout,"error");
			break;
		default:
			break;
		}
		uniGrid.m_funcOnLoadException(uniGrid, szType, szAction, opts, res, arg );
		
		// Pop the transcation flag from the loading mask stack
		_global.m_arrLoadingStack.pop();
		if(_global.m_arrLoadingStack.length>0)
			return;
		Ext.get('uniLoading').dom.style.visibility = "hidden";
		Ext.get('uniLoadingMask').dom.style.visibility = "hidden";
	});
	this.m_objProxy.on("beforeload",  function(proxy, szType, szAction, opts, res, arg ){
		// Push the transaction flag into the loading mask stack and show loading mask immediately
		_global.m_arrLoadingStack.push("");
		if(this.conn.proxyLoadMask == null || this.conn.proxyLoadMask == "undefined" || this.conn.proxyLoadMask==true  ){
			Ext.get('uniLoading').dom.style.visibility = "visible";
			Ext.get('uniLoadingMask').dom.style.visibility = "visible";
		}
	});
	this.m_objProxy.on("load",  function(proxy, szType, szAction, opts, res, arg ){
		// Pop the transcation flag from the loading mask stack
		_global.m_arrLoadingStack.pop();
		// if(_global.m_arrLoadingStack.length>0)
		// 	return;
		Ext.get('uniLoading').dom.style.visibility = "hidden";
		Ext.get('uniLoadingMask').dom.style.visibility = "hidden";
	});
	
	// Build a XML store object configuration
	var objStoreConfig = {
		uniGrid: this,
		proxy: this.m_objProxy,
		
		// for grouping
		groupField: _root.isExist(objConfig.groupField) ? objConfig.groupField : null,
		baseParams: {},
		reader: this.m_objXmlReader,
		remoteSort: _root.isExist(objConfig.remoteSort)?objConfig.remoteSort:true
	};
	
	// If specified group field, build the store as grouping store
	this.m_objStore = _root.isExist(objConfig.groupField) ? new Ext.data.GroupingStore(objStoreConfig) : new Ext.data.Store(objStoreConfig);
	
	// If specified default sort.
	if(_root.isExist(objConfig.defaultSort) && objConfig.defaultSort!=false && objConfig.defaultSort!=true){
			if(_root.isExist(objConfig.AscSort) && objConfig.AscSort ==true)
			  this.m_objStore.setDefaultSort(objConfig.defaultSort, "ASC");
			else
		    this.m_objStore.setDefaultSort(objConfig.defaultSort, "DESC");
	}
	else{
		if(_root.isExist(objConfig.AscSort) && objConfig.AscSort ==true)
		this.m_objStore.setDefaultSort(arrColsIds[0], "ASC");
		else
		this.m_objStore.setDefaultSort(arrColsIds[0], "DESC");
	}
		
	
	// Build a column model configuration
	var __col = new Array();
	
	// Build Checkbox selection model if specified.
	if(objConfig.checkbox==null||objConfig.checkbox=="undefined"||objConfig.checkbox==false)
		this.m_objSelModel = new Ext.grid.RowSelectionModel({uniGrid: this});
	else
	{
		// Build a row selection model
		this.m_objSelModel = new Ext.grid.CheckboxSelectionModel({
			menuDisabled: true,
			selectSingle: false,
			checkboxCol: true,
			uniGrid: this,
			getEditor: function(){},
			editor: {disabled: true}
		});
		// Build checkbox column 
		__col.push(this.m_objSelModel);
	}
	
	// Build a index column configuration if specified
	if( objConfig.indexCol==null||objConfig.indexCol=="undefined"||objConfig.indexCol==false);
	else{
		var __indexCol = new Ext.grid.RowNumberer({
			menuDisabled: true,
			width:80, // The width goes with the text on the header
			header:_lang.record.index,
			editor: {disabled:true} // For row editor works
		});
		// The index might goes with the remote server, that here is the renderer
		__indexCol.renderer = function(v, p, record, rowIndex){
	        if(this.rowspan){
	            p.cellAttr = 'rowspan="'+this.rowspan+'"';
	        }
			var pageSize = 0;
			try {
				pageSize = record.store.uniGrid.m_dwNowRecordIdx;
				// add by Dickens @ 20120808, for underline draw.
					// if((pageSize + rowIndex + 1) % 10 == 0) {
					// 	p.css += " uniGridColor_Mark_10Records ";
					// } else if((pageSize + rowIndex + 1) % 5 == 0) {
					// 	p.css += " uniGridColor_Mark_5Records ";
					// }
					// p.css += " NormalCell ";
			}catch(e){
				//alert("Numbering column cannot be used with grouping view");
			}
	        return pageSize + rowIndex + 1;
	    };
		__col.push(__indexCol);
	}
	
	// Build column configuration of data
	for(var i=0; i<this.m_arrCols.length; i++){
		var tempcount = 0;
		var tempRowCount = 0;
		var colsNum = 0;
		var isIndex = true;
		if(this.m_bIsIndexColumn == false || this.m_bIsIndexColumn == null || this.m_bIsIndexColumn == 'undefined') isIndex = false;
		for(var j=0; j < this.m_arrCols.length; j++){
			var hidden = _root.isExist( this.m_arrCols[j].hidden) ? this.m_arrCols[j].hidden : false;
			var isCount = hidden == false ? true : false;
			if(isCount == true) colsNum++;
		}

		var this_col_obj = {};
		this_col_obj = {
			xtype: _root.isExist(this.m_arrCols[i].xtype)?this.m_arrCols[i].xtype:"gridcolumn",
			header: this.m_arrCols[i].header,
			id: this.m_arrCols[i].id,
			dataIndex: this.m_arrCols[i].id,
			sortable: true,
			summaryType: _root.isExist(this.m_arrCols[i].summaryType) ? this.m_arrCols[i].summaryType : null, // Width goes with text, if no specified
			summaryRenderer:_root.isExist(this.m_arrCols[i].summaryRenderer) ? this.m_arrCols[i].summaryRenderer : null, // Width goes with text, if no specified
			width: _root.isExist(this.m_arrCols[i].width) ? this.m_arrCols[i].width : _root.getTextWidth(this.m_arrCols[i].header)+10, // Width goes with text, if no specified
			sortable:_root.isExist(this.m_arrCols[i].sortable) ? this.m_arrCols[i].sortable : true,
			menuDisabled: _root.isExist( this.m_arrCols[i].menuDisabled)? this.m_arrCols[i].menuDisabled : false,
			hidden: _root.isExist( this.m_arrCols[i].hidden) ? this.m_arrCols[i].hidden : false,
			hasIndex: isIndex,
			colsNoHiddenCnt: colsNum,
			renderer: _root.isExist( this.m_arrCols[i].manualcss) ? this.m_arrCols[i].manualcss : function(val, metadata, record){
				//do xml encode add by will 111201
				if(typeof val == "undefined" || typeof val == null) {
					val = "";
				}
				var tmp_val=val;
				if(typeof val == "string")
					tmp_val=val.replace(/\&/g,'&'+'amp;').replace(/</g,'&'+'lt;').replace(/>/g,'&'+'gt;').replace(/\"/g,'&'+'quot;');
				metadata.attr = 'ext:qtip="' + tmp_val + '"';
				//metadata.attr = 'ext:qtip="' + tmp_val + '"';
				//will end
				//metadata.attr = val;
				
				// 20111024:1555 begin modify by Dickens

				if(typeof metadata.value == "number") {
					tempcount = 0;
					tempRowCount = metadata.value;
				}
				//if(this.hidden != null && this.hidden != "undefined" && !this.hidden){
				if(typeof this.hidden == "undefined" || this.hidden == null || this.hidden != true ) {
					if(tempcount % 2 == 1) {
						//metadata.style = metadata.style+';background: #DDDDDD;';
						//this.addClass("uniGridColor_odd");
						metadata.css += " uniGridColor_odd ";
						//_global.debug("", metadata);
					} else {
						//metadata.style = metadata.style+';background: #FFFFFF;';
						//this.addClass("uniGridColor_even");
						metadata.css += " uniGridColor_even ";
						//_global.debug("", metadata);
					}
					// if(tempRowCount % 10 == 0) {
					// 	metadata.css += " uniGridColor_Mark_10Records ";
					// } else if(tempRowCount % 5 == 0) {
					// 	metadata.css += " uniGridColor_Mark_5Records ";
					// }
					tempcount++;
					if( this.hasIndex == false && (this.colsNoHiddenCnt % 2 == 1))
					{
						if(tempcount % this.colsNoHiddenCnt == 0 && tempcount > 0) tempcount = 0;
					}
				}
				// 20111024:1555 finish modify by Dickens 
				//if(this.m_arrCols[i].manualcss != null)
				//	metadata.css = this.m_arrCols[i].manualcss;
				
				metadata.css += " NormalCell ";
				return val; 
				//return this.m_arrCols[i].renderer(val, metadata, record);
			},
			editor: ( _root.isExist(this.m_arrCols[i].editor)?this.m_arrCols[i].editor:{
                xtype: 'textfield',
                allowBlank: false
			})
		};

		this_col_obj = Ext.apply(this_col_obj, this.m_arrCols[i]);
		__col.push(this_col_obj);
	}
	
	
	// Build a gridview object,
	if (_root.isExist(objConfig.groupField)) { // Specified group field
		var objGroupingViewConf = {
			uniGrid: this,
			showGroupName: false,
			enableGroupingMenu: false
			
		};
		if(_root.isExist(objConfig.groupTextTpl))
			objGroupingViewConf.groupTextTpl = objConfig.groupTextTpl;
		this.m_objGridView = new Ext.grid.GroupingView(objGroupingViewConf);
		this.m_objColModel = new Ext.grid.ColumnModel({
			uniGrid: this,
			columns: __col,
			moveColumn : function(oldIndex, newIndex) {
				if(this.uniGrid.m_bDisabledMoveColumn){
					return;
				}
		        var config = this.config,
		            c      = config[oldIndex];
		            
		        config.splice(oldIndex, 1);
		        config.splice(newIndex, 0, c);
		        this.dataMap = null;
		        this.fireEvent("columnmoved", this, oldIndex, newIndex);
		    }
		});
	}
	else { // Otherwise
		this.m_objGridView = new Ext.grid.GridView({
			markDirty: true,
			uniGrid: this
		});
		if(objConfig.rows != null)
		{
			this.m_objColModel = new Ext.grid.ColumnModel({
				uniGrid: this,
				columns:__col,
				rows:objConfig.rows,
				moveColumn : function(oldIndex, newIndex) {
					if(this.uniGrid.m_bDisabledMoveColumn){
						return;
					}
			        var config = this.config,
			            c  = config[oldIndex];
			            
			        config.splice(oldIndex, 1);
			        config.splice(newIndex, 0, c);
			        this.dataMap = null;
			        this.fireEvent("columnmoved", this, oldIndex, newIndex);
			    }
			});
		}
		else
		{
			this.m_objColModel = new Ext.grid.ColumnModel({
				uniGrid: this,
				columns:__col,
				moveColumn : function(oldIndex, newIndex) {
					if(this.uniGrid.m_bDisabledMoveColumn){
						return;
					}
			        var config = this.config,
			            c  = config[oldIndex];
			            
			        config.splice(oldIndex, 1);
			        config.splice(newIndex, 0, c);
			        this.dataMap = null;
			        this.fireEvent("columnmoved", this, oldIndex, newIndex);
			    }
			});
		}
	}
	
	// The combobox of amount of per page
	this.m_objComboBox = new Ext.form.ComboBox({
		cls: "pageSizeCombo",
		uniGrid: this,
		mode: 'local',
		width: Ext.isIE ? '50' : 'auto',
		triggerAction: 'all',
		value: this.m_dwPageSize,
		defaultTriggerWidth: Ext.isIE ? '55' : 'auto',
		store: new Ext.data.ArrayStore({
			id:0,
			fields:["text", "value"],
			//fields:[Ext.isIE ? "text" : "textContent", "value"],
			data:[
				["5", 5],
				["10", 10],
				["15", 15],
				["20", 20],
				["50", 50]
			]
		}),
		valueField: "value",
		displayField: "text",
		//displayField: Ext.isIE ? "text" : "textContent",
		editable: false
	});
	
	// Build a paging toolbar
	this.m_objPagingToolbar = new Ext.PagingToolbar({
		pageSize: this.m_dwPageSize,
		store: this.m_objStore,
		displayInfo: true,
		hidden: objConfig.hidePagingToolbar==true?true:false ,
		items:[_lang.pageSize + ":", this.m_objComboBox],
		layout: 'toolbar'
	});
	
	// Build a grid panel configuration
	var __gridPanelConf = {
		//header: true,
		header: _root.isExist(objConfig.header)?objConfig.header:true,
		width:200,
		region:'center',
		stripeRows: true,
		enableColumnHide: false,
		enableColumnMove : true,
		title: _root.isExist(objConfig.title)?objConfig.title:"",
//		Loading mask is processed by global method				
//		loadMask: true,
		store: this.m_objStore,
		colModel: this.m_objColModel,
		selModel: this.m_objSelModel,
		view: this.m_objGridView,
		bbar: this.m_objPagingToolbar
//		Disable auto-expand column feature due to customized column configurations
//		autoExpandColumn: objConfig.autoExpandColumn
	};
	
	
	if(_root.isExist(objConfig.tbar))
		__gridPanelConf.tbar = objConfig.tbar;
	// If specified enable row editor...
	if(objConfig.rowEditor==true){
		// Create a row editor
		this.m_objRowEditor = new Ext.ux.grid.RowEditor({
			uniGrid: this,
			saveText: 'Update',
			cls: 'uniRowEditor zindex99',
			commitChangesText: _lang.commitChangesText,
			errorText: _lang.messageBox.error,
			infoText: _lang.messageBox.info,
			enableClicksToEdit: false
		});
		
		// Make the grid work with row editor
		if(objConfig.plugins != null)
			__gridPanelConf.plugins = objConfig.plugins;
		else
			__gridPanelConf.plugins = [this.m_objRowEditor];
		
		// Listen event of clicked update button on row editor
		this.m_objRowEditor.on("afteredit", function(editor, obj, record, index){
			if(editor.uniGrid.m_szEditMode=="add")
				return;
		});
		
		// Listen event of the beginning of editing(adding)
		this.m_objRowEditor.on("beforeedit", function(rowEditor, index){			
			var uniGrid = rowEditor.uniGrid;
			var rec = uniGrid.m_objStore.getAt(index);
			uniGrid.m_funcBeforeEdit(uniGrid, rec, index);
		});
		
		// Listen event for canceling the editing or adding (without saving)
		this.m_objRowEditor.on("canceledit", function(editor, bInvalid){
			var uniGrid = editor.uniGrid;
			
			// If it's under mode "adding", cancel adding need to remove the last row
			if(uniGrid.m_szEditMode=="add"){
				uniGrid.m_objStore.removeAt(uniGrid.m_objStore.getCount()-1);
				uniGrid.disableRefresh(false);
				_root.restoreToolbar();
			}
			
			// If this event is not caused by Row Eidtor and it's still continousely editing...
			if(uniGrid.m_userTriggerReload == true && uniGrid.m_szEditMode !="add"){
				uniGrid.m_userTriggerReload = false;
				var index = uniGrid.m_objStore.indexOf(editor.record);
				uniGrid.m_userPreviousOpt.uniGrid = uniGrid;
				uniGrid.m_userPreviousOpt.userPreviousIndex = index;
				uniGrid.m_userPreviousOpt.callback = function(r, opt, succ){
					var index = opt.userPreviousIndex;
					var dwAmount = uniGrid.getCount();
					if(index > dwAmount ) index = dwAmount-1;
					this.uniGrid.startEdit(index, "edit");
				};
				var objSortConfig = uniGrid.m_objStore.getSortState();
				uniGrid.m_objStore.setDefaultSort(uniGrid.m_userPreviousOpt.params.sort, uniGrid.m_userPreviousOpt.params.dir);
				uniGrid.m_szEditMode = "normal";
				uniGrid.m_objStore.load(uniGrid.m_userPreviousOpt);
				
				return;
			} // Return back
			
			// Stop editing mode
			editor.uniGrid.stopEdit(false);
			uniGrid.m_userTriggerReload = false; // Reset trigger flag as default (false)
		});
		
		// TODO: The roweditor finish event
		// Finish edit mode, both adding/editing mode will call this event. This is the last event called
		// This event is fired while the data be saved
		this.m_objRowEditor.on("finishedit", function(editor, record, index, bFinish, hasChange, bShowMsg){
			var uniGrid = editor.uniGrid;
			
			// Construct the parameter(structure) for sending
			var objData = _root.cloneObject(uniGrid.m_objStore.baseParams); // Build the base parameters
			objData.uniGrid = uniGrid; // For callback use
			objData.userIndex = index; // Index
			objData.userFinish = bFinish; // Is finish(quiting) or not
			objData.userShowMsg = bShowMsg; // Show saved message or not
			objData.userRecord = record; // The current data
			objData.uniMask = true; // Loading mask during ajax transferring
			// Build data from the record
			for(var i=0; i<uniGrid.m_arrCols.length; i++){
				var id = uniGrid.m_arrCols[i].id;
				objData[id] = record.get(id);
			}
			
			// If it's adding mode...
			if(editor.uniGrid.m_szEditMode=="add"){
				Ext.Ajax.request({ // Send data
					url: uniGrid.m_szUrlAddRecord,
					success: function(response, oOption){
						var uniGrid = oOption.params.uniGrid;
						var record = oOption.params.userRecord;
						var bFinish = oOption.params.userFinish;
						var sss = null;
						
						// Determine there's any logical error or not
						try{
							resultObj = _root.getSpecifiedResponse(["ret", "msg"], response);
							if(parseInt(resultObj.ret)==0){ //OK
								sss = 0;
							}else{ // Failed, there exists some logical errors.
								sss = resultObj.ret;
								
								// Edit the row again and mark it as dirty
								record.markDirty();
								uniGrid.startEdit(index, "add"); // Keep the mode as "adding"

								// Display error message here
								uniGrid.m_objRowEditor.showTooltip_once(_root.getTableErrMsg(resultObj.msg));
								
								// Mark flag
								uniGrid.m_userTriggerReload = false; 
								
								// Call the failed event
								uniGrid.m_funcAddedFailed(uniGrid, record, response);
								return;
							}
							
						} catch(e){ // The response data doesn't match the format
							alert(_lang.WrongFormat);
						}
						record.commit(); // Commit the record
						uniGrid.m_funcAfterAdded(uniGrid, record, response); // Call the call back method
						// If it's quiting adding mode,,,
						if(bFinish){
							try{
								_root.restoreToolbar(); // Restore the toolbar back
							}catch(e){
								alert(_lang.alermsg1);
							}
							_root.messageBox(_lang.record.success, "INFO", function(){
								uniGrid.disableRefresh(false); // Activate refreshment
								uniGrid.refresh();
								if(uniGrid.focusID!=null)								
								_root.get(uniGrid.focusID).focus(); //@c 20111128 chris add			
							});
						}else{ // No quit, add the next row
							uniGrid.addRow();
						}
					},
					failure: function(response, oOption){
						var uniGrid = oOption.params.uniGrid;
						var record = oOption.params.userRecord;
						uniGrid.m_objStore.removeAt(uniGrid.m_objStore.getCount()-1);
						uniGrid.addRow();
						uniGrid.m_funcAddedFailed(uniGrid, record, response);
						_global.debug("UniXmlGrid.js", "Sending request to AJAX server failed while row editor adding.");
					},
					params: objData,
					scope: this
				});
			}
			// Editing without any change
			else{
				// No changes...
				if(hasChange == false){
					// If the finish event is caused by refresh and it's not quiting
					if(uniGrid.m_userTriggerReload == true && bFinish != true){
						uniGrid.m_userTriggerReload = false; // Mark flag
						// Get the available record amount
						var dwAmount = uniGrid.getCount();
						if(index >= dwAmount ) index = dwAmount-1;
						if(dwAmount > 0){
							uniGrid.m_userEditingCallback = null;
							uniGrid.m_objRowEditor.startEditing(index, "auto");
						}
						else{
							uniGrid.m_userEditingCallback = function(){
								this.m_objRowEditor.startEditing(0, "auto");
							};
						}
						return ;
					}
					
					// If continue editing...
					if(index+1 >= uniGrid.getCount()){
						if(bFinish!=true){
							uniGrid.m_objRowEditor.showTooltip2(_lang.lastRecord);
						}
						index--;
					}
					if(bFinish==true);else
						uniGrid.m_objRowEditor.startEditing(index+1, "auto");
					return;
				}
				
				// Changed, send data
				Ext.Ajax.request({
					url: uniGrid.m_szUrlEditRecord,
					method: "POST",
					success: function(response, oOption){
						// Parse parameters
						var uniGrid = oOption.params.uniGrid;
						var index = oOption.params.userIndex; // Get the index of editing
						var bFinish = oOption.params.userFinish;
						var bShowMsg = objData.userShowMsg;
						var record = oOption.params.userRecord;
						var editor = uniGrid.m_objRowEditor;
						var dwSize = uniGrid.getCount();
						var sss = null;
						
						// Determine there's any logical error or not
						try{
							resultObj = _root.getSpecifiedResponse(["ret", "msg"], response);
							if(parseInt(resultObj.ret)==0){ //OK
								sss = 0;
							}else{ // Failed, there exists some logical errors.
								sss = resultObj.ret;
								record.markDirty();
								uniGrid.startEdit(index, "edit"); // Edit the row again and mark it as dirty
								
								// Display error message here
								uniGrid.m_objRowEditor.showTooltip_once(_root.getTableErrMsg(resultObj.msg));
								uniGrid.m_userTriggerReload = false; // Mark flag as default
								uniGrid.m_objPagingToolbar.enable(); 
								uniGrid.m_funcEditedFailed(uniGrid, index, record, response); // Call failed event
								return;
							}
						}catch(e){
							alert("This function doesn't match the response format");
						}
						record.commit();
						
						// If this event is not caused by Row Eidtor and it's still continousely editing...
						if(uniGrid.m_userTriggerReload == true && bFinish!=true){
							uniGrid.m_userTriggerReload = false; 							
							uniGrid.m_userPreviousOpt.userPreviousIndex = index;
							uniGrid.m_userPreviousOpt.uniGrid = uniGrid;
							uniGrid.m_userPreviousOpt.callback = function(r, opt, succ){
								var index = opt.userPreviousIndex;
								var dwAmount = uniGrid.getCount();
								if(index > dwAmount ) index = dwAmount-1;
								this.uniGrid.startEdit(index, "edit");
							};
							var objSortConfig = uniGrid.m_objStore.getSortState();
							uniGrid.m_objStore.setDefaultSort(uniGrid.m_userPreviousOpt.params.sort, uniGrid.m_userPreviousOpt.params.dir);
							uniGrid.m_objStore.load(uniGrid.m_userPreviousOpt);
							return;
						}// Return back
						
						
						// If last
						if(index+1 >= dwSize){
							if(bFinish!=true){
								uniGrid.m_objRowEditor.showTooltip2(_lang.lastRecord);
							}
							index--;
						}
						// If continue editing...
						if(bFinish==true){
							if(bShowMsg==false)
								uniGrid.m_funcAfterEdited(uniGrid, index, record, response);
							else{
								_root.messageBox(_lang.record.success, "INFO", function(){
									uniGrid.disableRefresh(false);
									uniGrid.refresh();
									if(uniGrid.focusID!=null)
									_root.get(uniGrid.focusID).focus(); //@c 20111128 chris add
								});
								try{
									_root.restoreToolbar(); // Restore the toolbar back
								}catch(e){
									alert("You have to define function \"restoreToolbar\"");
								}
							}
						}
						else{
							uniGrid.m_funcAfterEdited(uniGrid, index, record, response);
							uniGrid.m_objRowEditor.startEditing(index+1, "auto");
						}
					},
					
					// Transcation error, including 404, 500..etc
					failure: function(response, oOption){
						var uniGrid = oOption.params.uniGrid;
						var index = oOption.params.userIndex;
						var record = oOption.params.userRecord;
						uniGrid.m_userTriggerReload = false; // Mark flag
						uniGrid.m_objRowEditor.startEditing(index, "auto");
						uniGrid.m_funcEditedFailed(uniGrid, index, record, response);
					},
					params: objData
				});
			}
		});
	}
	else	//not roweditor
	{
		if(objConfig.plugins != null)
			__gridPanelConf.plugins = objConfig.plugins;
	}
	
	// Create DragDrop event
	if(_root.isExist(objConfig.ddGroup)){
        __gridPanelConf.ddGroup = objConfig.ddGroup;
        __gridPanelConf.enableDragDrop = true;
	}
	
	// Create grid panel
	this.m_objGridPanel = new Ext.grid.GridPanel(__gridPanelConf);
	
	// Combobox event
	this.m_objComboBox.on("select", function(thiz, record, index){
		var dwPageSize = parseInt(record.get("value"));
		//var dwPageSize = record.get("value");
		this.uniGrid.setPageSize(dwPageSize);
		this.uniGrid.load();
	});
	
	// Selection Events
	this.m_objSelModel.on("rowselect",function(t,i,r){t.uniGrid.m_funcOnSelectRow(t.uniGrid,i,r);});
	this.m_objSelModel.on("rowdeselect",function(t,i,r){t.uniGrid.m_funcOnDeselectRow(t.uniGrid,i,r);});
	this.m_objSelModel.on("selectionchange", function(t,s){t.uniGrid.m_funcOnSelectionChange(t.uniGrid,s);});
	
	
	// Store Events, for reload, refresh while editing use
	this.m_objStore.on("beforeload", function(objStore, oConf){
		var grid = objStore.uniGrid;
		grid.m_dwNowRecordIdx = oConf.params.start;
		if(grid.m_szEditMode == "normal" || ! _root.isExist(grid.m_objRowEditor))
			return true;
	
		try{
			if(grid.isChanged()==false){
				grid.m_userTriggerReload = true;
				return true;
			} else {
				_root.messageBox(_lang.editconfirm, "confirm", function(sz){
					if(sz=="yes"){
						// Trigger by others
						if(grid.isEditorValid(true)==false){
							grid.m_objPagingToolbar.enable();
							return false;
						}
						grid.m_userTriggerReload = true;
						grid.m_userPreviousOpt = oConf;
						grid.stopEdit(true, false);
						
					}else{
						// Trigger by others
						grid.m_userTriggerReload = true;
						grid.m_userPreviousOpt = oConf;
						grid.stopEdit(false, false);
						grid.m_objPagingToolbar.enable();
						return false;
					}
				});
				return false;
			}
		} catch(e){
			return true;
		}
	});
	
	this.m_objStore.on("load", function(objStore, arrRecords, oConf){
		var unigrid = objStore.uniGrid;
		
		// Get XML data 
		var xml = unigrid.m_objXmlReader.xmlData;
		xml = xml.getElementsByTagName("itemset")[0];
		
		// Get SQL tag and parse sql and col map
		try{
			var szSql = xml.getElementsByTagName("sql")[0][Ext.isIE ? 'text' : 'textContent'];
			// Construct mapping table 
			var szColMap ="";
			var arrCols = unigrid.m_objColModel.config;
			for(var i=0; i<arrCols.length; i++){
				var c = arrCols[i];
				if(c.id == "numberer" || c.hidden == true || c.checkboxCol == true)
					continue;
				szColMap += c.id + "=" + c.header + ((i+1) >= arrCols.length ? "" : ",");
			}
			unigrid.m_szSql = szSql;
			unigrid.m_szColMap = szColMap;
			
		}catch(e){}
		
		try{ // Try to process editing callback if the during editing mode of Row Editor
			if(objStore.uniGrid.m_szEditMode!="normal")
				objStore.uniGrid.m_userEditingCallback();
		}catch(e){}
		objStore.uniGrid.m_funcOnLoaded(objStore.uniGrid, arrRecords, oConf);
	});
}

//#endif
}
