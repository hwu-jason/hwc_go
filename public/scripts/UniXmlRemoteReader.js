// #ifdef _UNI_WINDOW
try{if(_UNI_XMLREMOTEREADER);
}catch(e){
// #define _UNI_WINDOW true
_UNI_XMLREMOTEREADER = true;

/**	The class UniXmlRemoteReader provides the method that you can read a xml file with a simple way
	@class
	@version 0.01 beta
	@author Johnnie
	@param {Array&lt;String&gt;} arrCols - The columns you want to store
	@param {String} szRecordTag - The record tag in the xml
	@param {String} szIdTag - The id tag in a record
	@param {String} szUrl - The url of remote xml file
	@return {UniXmlRemoteReader}
	*/
UniXmlRemoteReader = function(arrCols, szRecordTag, szIdTag, szUrl){
////////////////////////////////////////////////////////////////////////////////
// ATTRIBUTES
	/** The record set. The data will be placed here after loaded successfully
		@type Array&lt;Ext.Record&gt;*/
	this.m_arrRecords = Array();
	
	
	//test by will
	//this.m_bMask = true;
	this.m_bMask = false;	//turn off Loading when do RemoteReader
	
	/**	The xml reader instance
		@type Ext.data.XmlReader */
	this.m_objXmlReader = null;
	
	/** The store for storing data
		@type Ext.data.Store */
	this.m_objStore = null;
	
	this.m_objProxy = null;
	
	/** The tag name of a record in the xml file
		@type String */
	this.m_szRecordTag = szRecordTag;
	
	/** The tag name of the id of a record in the xml file
		@type String */
	this.m_szIdTag = szIdTag;
	
	/** The url of the remote xml file
		@type String */
	this.m_szUrl = szUrl;
	
	/** The columns you want to store
		@type Array&lt;String&gt; */
	this.m_arrCols = Array();
	
	/**	The callback function fires when data loaded
		@event
		@param {UniXmlRemoteReader} objUniXmlRReader - The caller instance
		@param {Array&lt;Ext.Record&gt;} arrRecords - The loaded data
		@param {Boolean} bSucc - True for load success, false for otherwise*/
	this.m_funcOnLoaded = function(objUniXmlRReader, arrRecords, bSucc){}
	
	this.m_funcOnLoadException = function(objUniXmlRReader, szType, szAction, opts, res, arg ){};
	
	

////////////////////////////////////////////////////////////////////////////////
// METHODS

	/** To load remote xml file. After it loaded data, the UniXmlRemoteReader will call the callback function
		<b>m_funcOnLoaded</b>(See {@link #event:m_funcOnLoaded}).
		@param {String} szUrl - The specified url. If it's null, make default as m_szUrl
		@return {Void} */
	this.load = function(szUrl, objConf){
		if(objConf==null||objConf=="undefined")
			objConf = {UniXmlRReader: this, uniMask: this.m_bMask}
		else
			objConf.UniXmlRReader = this;
		if(szUrl==null||szUrl=="undefined")
			szUrl = this.m_szUrl;
		
		this.m_objProxy.setUrl(szUrl);
		this.m_objStore.load({
			params: objConf,
			callback: function(recordset, opt, s){
				if(s==true){						
					delete opt.params.UniXmlRReader.m_arrRecords; // Release old data
					opt.params.UniXmlRReader.m_arrRecords=new Array(); // Generate new one
					for(var i=0; i<recordset.length; i++) // Copy elements
						opt.params.UniXmlRReader.m_arrRecords.push(recordset[i].copy());
				}
				opt.params.UniXmlRReader.m_funcOnLoaded(opt.params.UniXmlRReader, recordset, s);
			}
		});
	};
	
	/**	Clear the base parameters which are sent with all the requests
	 * 	@return {Object} - The original parameters.
	 */
	this.clearParam = function (){
		var p = this.m_objStore.baseParams;
		this.m_objStore.baseParams = {};
		return p;
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
	
	this.setUrl = function(szUrl){
		this.m_szUrl = szUrl;
		this.m_objProxy.setUrl(szUrl);
	}
	
////////////////////////////////////////////////////////////////////////////////
// CONSTRUCTS

	if(typeof(arrCols[0]) == "object" ){
		for(var i=0; i<arrCols.length; i++)
			this.m_arrCols.push(arrCols[i].id);
	}
	else
		this.m_arrCols = arrCols;
		
	
	this.m_objXmlReader = new Ext.data.XmlReader({
		uniRReader: this,
		record: this.m_szRecordTag,
		id: this.m_szIdTag
	}, this.m_arrCols);
	
	this.m_objProxy = new Ext.data.HttpProxy({
		rreader: this,
        url: this.m_szUrl,
        method: 'post'
    }); 
	
	// The transaction event
	this.m_objProxy.on("exception",  function(proxy, szType, szAction, opts, res, arg ){
		var rreader = proxy.conn.rreader;
		rreader.m_funcOnLoadException(rreader, szType, szAction, opts, res, arg );
	});
	
	this.m_objStore = new Ext.data.Store({
		uniRReader: this,
		proxy: this.m_objProxy,
		reader: this.m_objXmlReader
	});
}

}

