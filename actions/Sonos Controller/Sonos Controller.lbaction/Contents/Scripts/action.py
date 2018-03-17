#!/usr/bin/env python
#
# LaunchBar Action Script
#
import os
import sys
import json
import webbrowser
sys.path.append('../lib')
from soco import SoCo
from soco.exceptions import SoCoUPnPException

if len(sys.argv) > 1:
    action_payload = json.loads(sys.argv[1])

    action = action_payload['action_argument']
    sonos_zone = action_payload['action_zone']

    sonos = SoCo(sonos_zone)

    if action == 'pp':
        # Play / Paused based on current playback state
        try:
            playback_state = sonos.get_current_transport_info()['current_transport_state']
            if playback_state == 'STOPPED':
                sonos.play()
            elif playback_state == 'PLAYING':
                sonos.pause()
        except SoCoUPnPException as e:
            print '[{"icon": "font-awesome:times-circle", "title": "Not supported by current zone."}]'

    elif action == 'v+5':
        # Increase volume
        current_vol = sonos.volume
        new_vol = current_vol + 5
        if new_vol > 100:
            new_vol = 100
        sonos.ramp_to_volume(new_vol)

    elif action == 'v-5':
        # Decrease volume
        current_vol = sonos.volume
        new_vol = current_vol - 5
        if new_vol < 0:
            new_vol = 0
        sonos.ramp_to_volume(new_vol)

    elif action == 'mute':
        # Mute Volume
        sonos.volume = 0

    elif action == 'next':
        # Next Song (might be unsupported by playback source e.g. streams)
        try:
            sonos.next()
        except SoCoUPnPException:
            print '[{"icon": "font-awesome:times-circle", "title": "Not supported for current playback source."}]'

    elif action == 'prev':
        # Previous Song (might be unsupported by playback source e.g. streams)
        try:
            sonos.previous()
        except SoCoUPnPException:
            print '[{"icon": "font-awesome:times-circle", "title": "Not supported for current playback source."}]'

    elif action == 'set_zone':
        # Used during setup to save preferred zone
        settings_file_path = os.path.join(os.getenv('LB_SUPPORT_PATH'), 'settings.json')
        settings = {'zone_ip_address': sonos_zone}
        json.dump(settings, file(settings_file_path, 'w'))
        webbrowser.open("x-launchbar:notification-center?string=Zone%20successfully%20set!&title=Sonos%20Controller")
