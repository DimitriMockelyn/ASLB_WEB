var fs = require('fs');
const path = require('path');


const FILE='../../dabpf_war/src/main/webapp/focus-app.css';


var file = path.resolve(__dirname, FILE);
fs.exists(file, function (exists) {
	if (exists) {
		fs.appendFileSync(file,'\n[data-focus="error-center"]{display:none;}');
	}
});