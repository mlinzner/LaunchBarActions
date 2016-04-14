// LaunchBar Action Script

function open(path) {
    LaunchBar.openURL(File.fileURLForPath(path));        
}

function getSheetTitle(content){    
	title = "";
    
	if (content.length > 1) {
		titleFound = false;
		startIndex = 0;
	
		while (!titleFound) {
			index = content.indexOf('\n',startIndex);
			
			if (index === -1) {
				title = content.substring(startIndex);
				titleFound = true;
			} else {
				if (index - startIndex > 0) {
					title = content.substring(startIndex, index);
					titleFound = true;	
				} else {
					startIndex = index + 1;
				}
			}
		}
	}
	
	title = title.trim()
	
    if (title.length == 0) {
		title = 'Empty Sheet';
	}
	
	return title;
}

function readFolder(path) {
    // Shift+Return should open a group in Ulysses instead of browsing.
    if (LaunchBar.options['shiftKey']) {
        open(path + '/Info.ulgroup');
    }
    
    var output = [];
    var contents = File.getDirectoryContents(path);
    var subtitle = "";
    
    if (path.startsWith('~/Library/Containers')) {
        subtitle = "On My Mac";
    } else if (path.startsWith('~/Library/Mobile Documents')) {
        subtitle = "iCloud";
    }
        
    contents.forEach(function(item) {        
        if (item.endsWith('-ulgroup')) {
            var groupPath = path + '/' + item;
            var infoFile = groupPath + '/Info.ulgroup';
            if (File.exists(infoFile)) {
                try {
                    var infoFileContent = File.readPlist(infoFile);
                    displayName = infoFileContent['displayName'];
                    output.push({title  : displayName,  
                                 action : 'readFolder',
                                 actionArgument: groupPath, 
                                 actionReturnsItems: true, 
                                 subtitle : subtitle,
                                 icon   : 'group.png',
                                 iconIsTemplate: false});
                } catch (error) {
                    LaunchBar.log('Unable to read Ulysses Group Info: ' + error); 
                }
            }
        } else if (item.endsWith('.ulysses')) {
            var sheetPath = path + '/' + item;
                        
            var plainTextRepresentation = sheetPath + '/Text.txt';      
                  
            if (File.exists(plainTextRepresentation)) {
                var text = File.readText(plainTextRepresentation);
                title = getSheetTitle(text);
                output.push({title    : title, 
                             action   : 'open', 
                             actionArgument : sheetPath,  
                             icon     : 'sheet.png', 
                             subtitle : subtitle,
                             iconIsTemplate: false}); 
            }
        }
    });
    LaunchBar.debugLog(JSON.stringify(output));
    return output;
}

function run(argument) {        
    var ulyssesFiles = [];
    var ulyssesPrefs = File.readPlist('~/Library/Containers/com.soulmen.ulysses3/Data/Library/Preferences/com.soulmen.ulysses3.plist');

    // Local Library
    if (ulyssesPrefs["sections"]["localLibrary"]) {
        LaunchBar.debugLog('Read local library');
        
        // Ungrouped Sheets
        ulyssesFiles = ulyssesFiles.concat(readFolder('~/Library/Containers/com.soulmen.ulysses3/Data/Documents/Library/Unfiled-ulgroup'));
    
        // Groups
        ulyssesFiles = ulyssesFiles.concat(readFolder('~/Library/Containers/com.soulmen.ulysses3/Data/Documents/Library/Groups-ulgroup'));
    }
    
    // iCloud Library
    if (ulyssesPrefs["sections"]["ubiquitousLibrary"]) {
        LaunchBar.debugLog('Read iCloud library');
        
        // iCloud Ungrouped Sheets
        ulyssesFiles = ulyssesFiles.concat(readFolder('~/Library/Mobile Documents/X5AZV975AG~com~soulmen~ulysses3/Documents/Library/Unfiled-ulgroup'));

        // iCloud Groups
        ulyssesFiles = ulyssesFiles.concat(readFolder('~/Library/Mobile Documents/X5AZV975AG~com~soulmen~ulysses3/Documents/Library/Groups-ulgroup'));
    }
    
    return ulyssesFiles;
}
