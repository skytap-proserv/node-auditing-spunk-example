var Skytap = require('node-skytap');
var csv = require('csvtojson');
var SplunkLogger = require('./splunk-javascript-logging-0.9.3/index.js').Logger;

// Splunk Token
var config = {
  token: "---Use your Splunk token here---",
  url: "---Use your Splunk URL here---"
}


// Create a new SplunkLogger

var Logger = new SplunkLogger(config);

Logger.error = function(err, context) {
    // Handle errors here
    console.log("error", err, "context", context);
};


var skytap = Skytap.init({
  username: '---User Your Username---',
  token: '---User Your Skytap API Token---' // Available under My Account->API Security Token
})



var poll_interval = 3000 // milliseconds
var intervalId = 0;

var dt_end = new Date();
var dt_start = new Date();
dt_start.setMonth(dt_start.getMonth() - 1); // One month ago to today


console.log("Report parameters");
console.log("------ ----------");
console.log("start date: " + dt_start.toISOString());
console.log("end date:   " + dt_end.toISOString());

// Create a report
// skytap.audit.create({ start_date: dt_start, end_date: dt_end })
skytap.audit.create({ date_start: { year: dt_start.getFullYear(), month: dt_start.getMonth(), day: dt_start.getDay(), hour: dt_start.getHours(), minute: dt_start.getMinutes() },
 date_end: { year: dt_end.getFullYear(), month: dt_end.getMonth(), day: dt_end.getDay(), hour: dt_end.getHours(), minute: dt_end.getMinutes() } })

.then(function(results) {
	// get the report id
	var report_id = results.id;
	console.log("Report id: " + report_id + " requested");
	console.log("Poll interval set to " + poll_interval + " milliseconds");

	intervalId = setInterval(function() {
		checkCompletion(report_id);
	}, poll_interval);
})
.fail(function(results) {
	console.log("audit.create() failed" + results);
})

function checkCompletion(id) {
	// Check a report status
	console.log("Checking for report completion " + id);
	skytap.audit.check({ report_id: id })
	.then(function(results) {
		if (results.ready) {
			console.log("Report complete");
			//console.log(results);
			clearInterval(intervalId);
			getReport(id);
		} else {
			console.log("Report not ready");
			//console.log(results);
		}
	})
	.fail(function(results) {
		console.log("audit.check() failed" + results);
		clearInterval(intervalId);
	})

}



function getReport(id) {
	// Retrieve report results
	console.log("Retrieving report id: " + id);
	skytap.audit.fetch({ report_id: id })
	.then(function(results) {
		console.log("Report retrieved...parsing");
    console.log(results);
    ingest(results);
		// console.log(results);
	})
	.fail(function(results) {
		console.log("audit.fetch failed: " + results);
	})
}

function ingest(response) {
  console.log("Ingesting response...");
  debugger;
  console.log("Response=" + response);
  csv({noheader:false})
    .fromString(response)
    .on("csv", (csvRow) => {
      console.log(csvRow);
      Logger.send(toSplunkObject(csvRow), function(err, resp, body) {
        // If successful, body will be { text: 'Success', code: 0 }
        console.log("Response from Splunk", body);
      });
    })
    .on('done', ()=> {
      console.log("Completed processing");
    })
}

function toSplunkObject(row) {
  // take a row from the csv parser and turn it into an object that Splunk can logging
  var newObj = {
    message: {
      time: row[0],
      region: row[1],
      user: row[2],
      project: row[3],
      department: row[4],
      action: row[5],
      environment: row[6],
      environmentId: row[7],
      vmsAffected: row[8],
      templatesAffected: row[9],
      templateIds: row[10],
      otherInfo: row[11]
    }
  }
  console.log("ToSplunkObj:" + newObj);
  return newObj;
}
