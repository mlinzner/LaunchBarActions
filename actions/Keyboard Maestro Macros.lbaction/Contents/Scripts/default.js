function executeMacro(argument) {
    if (argument != undefined) {
        LaunchBar.executeAppleScript('tell application id "com.stairways.keyboardmaestro.engine" to do script "' + argument + '"');
    }
}

function run() {
    var output = [];
    var macros = Plist.parse(LaunchBar.executeAppleScript('tell application id "com.stairways.keyboardmaestro.engine" to gethotkeys with asstring and getall'));

    macros.forEach(function (macroGroup, index, array){
        macroGroup['macros'].forEach(function(macro, index, array) {
            var name = macro['name'];
            if (name == undefined) {
              name = macro['namev2'];
            }

            output.push({
                title: name,
                actionArgument: macro['uid'],
                icon: 'com.stairways.keyboardmaestro.editor',
                action: 'executeMacro',
                actionRunsInBackground: true
            });
        });
    });

    return output;
}