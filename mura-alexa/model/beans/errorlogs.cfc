component extends="mura.bean.beanORM" table="mura_terrorlogs" entityname="errorlogs" bundleable="true" displayname="ErrorLogs"{

	// primary key
		property name="logid" fieldtype="id";

	// attributes
		property name="logmessage" datatype="text" nullable=true;
		property name="logstacktrace" datatype="longtext" nullable=true;
		property name="logdata" datatype="longtext" nullable=true;
		property name="logbyfullname" datatype="varchar" length="255" nullable=true;
		property name="logbyid" datatype="varchar" length="255" nullable=true;
		property name="logcreated" datatype="datetime" nullable=true;


		// Custom Validations
			public any function validate(siteid) {
				var obj = super.validate();
				var errors = obj.getErrors();
				var $=getBean('$').init(arguments.siteid);

				if ( !Len(obj.get('logid')) ) {
					obj.set('logid', CreateUUID());
				}

				if ( !Len(obj.get('logcreated')) ) {
					obj.set('logcreated',now());
				}

			} // @end Custom Validation

}
