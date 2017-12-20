Overview
--------
This repository contains an example of how to gather a Skytap Audit report using a modified version of the node.js Skytap REST API wrapper provided by FTI consulting and use the Splunk javascript SDK to log the audit report into Splunk using the HTTP collector

Author
------
rralston@skytap.com - Rich Ralston

Change Log
----------
| Version | Comment       | Author |
|---------|---------------|--------|
|0.1      |Initial version|RHR     |

Usage
-----

## Pre-requisites
You will need to have installed [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) in order for this to work.

You will need to have access to the admin account for Skytap in order to get audit reports.

You will need the Skytap API Security token from the admin account available here https://cloud.skytap.com/account under Account Information->API security token.

*NOTE: The package.json includes a reference to the modified npm package that is only visible to Skytap PS. If you want to use it outside that context you need to make a local copy and change the package.json to pull the module from the local repo.*

Clone this code using ```
git clone 'reference to this repo'
```
Download the Splunk logging for javascript SDK http://dev.splunk.com/view/splunk-logging-javascript/SP-CAAAE6U
and uncompress it at the top level directory

Run `npm install` to fetch the required node modules.

Edit the file `index.js` and replace the reference to account name and API token with your account name and API token.




Reference
---------
The original node-skytap javascript wrapper can be found at [https://github.com/fti-technology/node-skytap]

The updated version includes support for Skytap audit reports and is located at https://github.com/skytap-proserv/node-skytap
