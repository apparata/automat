
function saveAsSwift() {
	$("#output").load("StateMachineTemplate.swift", function (template, textStatus, xhr) {
		var stateMachine = buildStateMachine();
		if (stateMachine == null) {
			return;
		}
		console.log(links);
		console.log(stateMachine);
		var swiftCode = generateSwiftCode(template, stateMachine);
		document.location.href = 'data:text/plain;base64,' + btoa(swiftCode);
	});
}

function generateSwiftCode(template, stateMachine) {
		
	var output = template;
	
	output = output.replace(/__CLASSNAME__/g, stateMachine.className);

	output = output.replace(/__FIRSTSTATE__/g, stateMachine.states[0].name);

	var statesString = "";
	for (var i = 0; i < stateMachine.states.length; i++) {
		statesString += "        case " + stateMachine.states[i].name + "\n";
	}
	output = output.replace(/__STATES__/g, statesString.trim());

	output = output.replace(/__FIRSTEVENT__/g, stateMachine.events[0].name);

	var eventsString = "";
	for (var i = 0; i < stateMachine.events.length; i++) {
		eventsString += "        case " + stateMachine.events[i].name + "\n";		
	}
	output = output.replace(/__EVENTS__/g, eventsString.trim());
	
	var transitions = {};
	for (var i = 0; i < stateMachine.events.length; i++) {
		var event = stateMachine.events[i];
		var from = event.from;
		var to = event.to;
		var eventName = event.name;
		
		if (from in transitions) {
			transitions[from][eventName] = to;
		} else {
			var transitionObject = {}
			transitionObject[eventName] = to;
			transitions[from] = transitionObject;
		}
	}

	var casesString = "";

	for (from in transitions) {
		var caseString = ""
		caseString += "        case ." + from + ":\n";
	    caseString += "            switch event {\n";

		var events = transitions[from];
		for (event in events) {
			var to = events[event];
			caseString += "            case ." + event + ": return ." + to + "\n";
		}

		caseString += "            default: break\n";
		caseString += "            }\n\n";
		
		casesString += caseString;
	}
	
	output = output.replace(/__TRANSITIONS__/g, casesString.trim() + "\n");
	
	return output;
}

function buildStateMachine() {
	
	var unknownEventCounter = 1
	
	var machine = {
		'className': $("#filename").val().trim(),
		'states': [],
		'events': []
	};
	for(var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var stateName = node.text
		if (stateName == "") {
			alert("All states must be named.")
			return null;
		}
		var state = {
			'name': stateName
		};
		machine.states.push(state);
	}
	for(var i = 0; i < links.length; i++) {
		var link = links[i];
		var event = null;
		var eventName = link.text
		if (eventName == "") {
			eventName = "unknownEvent" + unknownEventCounter;
			unknownEventCounter++;
		}
		if(link instanceof SelfLink) {
			event = {
				'from': link.node.text,
				'to': link.node.text,
				'name': eventName
			};
		} else if(link instanceof StartLink) {
			/*
			event = {
				'type': 'StartLink',
				'node': nodes.indexOf(link.node),
				'text': link.text,
			};*/
		} else if(link instanceof Link) {
			event = {
				'from': link.nodeA.text,
				'to': link.nodeB.text,
				'name': eventName
			};
		}
		if (event != null) {
			machine.events.push(event);
		}
	}
	
	if (machine.states.length == 0) {
	    alert("Add states to the diagram before generating Swift code.");
	    return null;
	}
	
	if (machine.events.length == 0) {
	    alert("Add transitions to the diagram before generating Swift code.");
	    return null;
	}
		
	return machine;
}
