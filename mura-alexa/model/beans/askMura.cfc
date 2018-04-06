component extends="mura.bean.beanORM" table="mura_taskmura" entityname="askmura" bundleable="true" displayname="askMura" {

	// primary key
		property name="askmuraid" fieldtype="id";

	// foreign key
		property name="site" cfc="site" fieldtype="many-to-one" fkcolumn="siteid";

	// attributes
		property name="askmuramessage" datatype="longtext" required="true";
		property name="askmuratitle" datatype="varchar" length="255" required="true"; // title from Alexa
		property name="askmurabody" datatype="text" required="true"; // content from Alexa
		property name="askmurarating" datatype="varchar" length="25" required="true"; // rating from Alexa
		property name="askmuraremoteid" datatype="varchar" length="255" required="true"; // remote id is the current Alexa user
		property name="askmuramessagecreated" datatype="datetime" nullable="true";

		// Custom Validations
		public any function validate(siteid) {
				var obj = super.validate();
				var errors = obj.getErrors();

				if ( !Len(obj.get('askmuraid')) ) {
					obj.set('askmuraid', CreateUUID());
				}

				if ( !Len(obj.get('site')) ) {
					obj.set('site', arguments.siteid);
				}

			} // @end Custom Validation

		//After successful orm addition, create new content object
		private function postCreate(siteid){
			// setup to add content
			var getMyIdeas = getBean('content').loadBy(title="My Ideas", siteid=arguments.siteid)
			var addIdea = getBean('content').loadBy(remoteid='#this.get('askmuraid')#', siteid=arguments.siteid);

			try {
						addIdea
						.set('siteid',getMyIdeas.get('siteid'))
						.set('parentId',getMyIdeas.get('contentID'))
						.set('title',lCase(this.get('askmuratitle')))
						.set('body',lCase(this.get('askmurabody')))
						.set('summary',lCase(this.get('askmurabody')))
						.set('type','Page')
						.set('subType','Ideas')
						.set('approved',1)
						.set('display',1)
						.set('isNav',1)
						.set('releasedate', this.get('askmuramessagecreated'))
						.set('idea-rating',this.get('askmurarating'))
						.set('remoteid',this.get('askmuraid'))
						.set('remotesource',this.get('askmuraremoteid'))
						.save();

					} catch (any e) {
						var errorlog = getBean('errorlogs');
						var datatolog = ''

						datatolog = serializeJSON(addIdea.getAllValues());

						errorlog
							.set('logid', CreateUUID())
							.set('logbyfullname','Amazon Alexa')
							.set('logbyid', '')
							.set('logcreated', now())
							.set('logmessage',e.message)
							.set('logdata',datatolog)
							.set('logstacktrace',serializeJSON(e.stacktrace))
							.save();

					}

		}


}
