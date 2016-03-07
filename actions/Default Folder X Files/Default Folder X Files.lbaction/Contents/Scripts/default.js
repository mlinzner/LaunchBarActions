// LaunchBar Action Script

function run() {
	if (LaunchBar.options.commandKey) {
        return JSON.parse(LaunchBar.executeAppleScriptFile('./GetDFXData.scpt',''));                
    } else {
        return JSON.parse(LaunchBar.executeAppleScriptFile('./GetDFXData.scpt','flat'));
    }
}
