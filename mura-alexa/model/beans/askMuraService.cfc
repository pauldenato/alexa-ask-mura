component extends="mura.bean.bean" output="false" displayname="askMuraService" {

	remote any function getMuraResponse($) {
		var muraResponse= 'Hi, my Name is Mura!';
		return muraResponse;
	}

	remote any function addAnIdea(message){

		var returnMessage = {};
		/* Data should come over from Alexa
			title: iname,
			contentbody: icontent,
			irating: irating
			remoteid: userId
		*/

		var alexasMessage = arguments.message;

		var askMura = getBean('askMura');
				askMura.loadBy(askmuratitle="#trim(alexasMessage.title)#",siteid=arguments.siteid);

				try {
					if( askMura.getIsNew() ) {
						askMura
						.set('askmuraid',CreateUUID())
						.set('siteid',arguments.siteid)
						.set('askmuramessage',"#trim(serializeJSON(alexasMessage))#")
						.set('askmuratitle',trim(lCase(esapiEncode('html',alexasMessage.title))))
						.set('askmurabody',trim(lCase(esapiEncode('html',alexasMessage.contentbody))))
						.set('askmurarating',trim(lcase(esapiEncode('html',alexasMessage.irating))))
						.set('askmuraremoteid',trim(esapiEncode('html',alexasMessage.remoteid)))
						.set('askmuramessagecreated', "#CreateODBCDateTime(now())#")
						.save();

					} else {
						returnMessage.added = false;
						returnMessage.ideaExist = 'This Idea already exists.';
						StructAppend(returnMessage, this.getErrors());
					}

				StructAppend(returnMessage, askMura.getErrors());

				if ( !StructIsEmpty(returnMessage) ) {
					return returnMessage
				} else {
					returnMessage.added = true;
					returnMessage.ideaExist = 'This Idea does not exists.';
					return returnMessage
				}

			} catch (any e) {
				var errorlog = getBean('errorlogs');
				var datatolog = ''

				datatolog = serializeJSON(askMura.getAllValues());

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
