// LaunchBar Action Script

function run() {
    var output = [];
    
    var result = LaunchBar.execute('/bin/sh', '-c', 'pmset -g log | grep LidOpen | sort -r');
    result = result.trim().split('\n');
    i = 0;
    
    output = result.map(function (line) {        
        var wakeReason = line.match(/Wake from[^[]*/im);
        var additionalInfo = line.match(/(AC|BATT) \(Charge:\d{1,3}%\)/im);
        var time = line.substring(0,19);

        return {'title'    : wakeReason[0], 
                'subtitle' : time, 
                'label'    : additionalInfo[0],
                'icon'     : 'font-awesome:laptop',
                'alwaysShowsSubtitle' : true,
                };

    });
    
    return output;
}
