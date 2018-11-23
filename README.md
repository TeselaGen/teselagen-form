# Teselagen-form Generator!

this is a simple module to generate a form using a JSON schema.

    EXAMPLE_JSON = { 
	    formName:  "test", 
		isWizard:  true,
		wizard: {        // if isWizard prop is true you need specifie the initial page and number of pages
			page :0, // default 0 
			pages :2
		},
		elements: [
			{
				title:  "First Page", // title of the page
				page:  0, // if isWizard === false default page = 0
				fields: [
					{
						index:  0,
						type:  "inputField",
						name:  "test",
						label:  "Test",
						required:  true
					}
				]
			},
			{
				title:  "Second Page",
				page:  1,
				fields: [
					{
						index:  0,
						type:  "selectField",
						name:  "select-test",
						label:  "last test",
						options: [], // if externalSource === true this is optional
						externalSource:  true, // if this is true query must be completed
						query: {
							endPoint: "/someEndPoint" // endPoint where ask the data
							entity:  "role", 
							colls:  'code name', 
							parameters: {
								value:  "code",
								label:  "name"
							}
						},
					}
				]
			}
		]
	};

