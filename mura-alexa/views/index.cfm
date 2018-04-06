<cfscript>
		askMura = $.getBean('askMuraService');
		writeOutput(askMura.getMuraResponse());
</cfscript>
