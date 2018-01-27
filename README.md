# Video Recorder Player

## Raspberry Pi project

- Plays music while recording slow motion video that are then projected via HDMI
- Uses chromium to display a browser based UI running on express

## Setup

### Raspberry PI

- Format SD card with SD Formatter
- Write Raspian Img with Win32DiskImager
- Run Menu > Preferences > Raspberry Pi Configuration
  - System
    - Change Password
    - Disable Splash Screen
  - Interfaces
    - Enable
      - Camera
      - SSH
  - Localisation
    - Locale
      - en, US, UTF-8
    - Timezone
      - America, Denver
    - Keyboard
      - United States, English (US)
    -WiFi Country
      - US United States
- Update Raspbian
  - ```sudo apt update```
  - ```sudo apt full-upgrade```
- Install dependencies
  - ```sudo apt-get install vim```
  - ```sudo apt-get install mpg123```
  - ```sudo apt-get install gpac``` (MP4Box)
  - ```npm install -g grunt-cli```
- Update Node (see below)
- Remove Bloatware (see below)
- Disable Screen Saver (see below)
- Auto start (see below)
- Set default display (see below)
- Desktop Icons (see below)

### Desktop Icons

[How To](http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/desktop-shortcuts)

Create symbolic links

```
ln -s ~/video-recorder-player/desktop/video-recorder-player.desktop ~/Desktop/video-recorder-player.desktop
```

### Disable Screen Saver

[How To](https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=163316)

```
vim ~/.config/lxsession/LXDE-pi/autostart
```

Update to:

```
#@xscreensaver -no-splash # comment this line out to disable screensaver
@xset s off
@xset -dpms
@xset s noblank
```

### Auto Start

[How To](https://obrienlabs.net/setup-raspberry-pi-kiosk-chromium/)

Ensure ~/.config/autostart/ exists before creating symlink

```
ln -s ~/video-recorder-player/desktop/video-recorder-player-autostart.desktop ~/.config/autostart/video-recorder-player-autostart.desktop
```

### Set default display

```sudo vim /boot/config.txt```

```
# TWG EDITS

# make hdmi default
#display_default_lcd=0
#make lcd default
display_default_lcd=1
```

### Remove Bloatware

[How To A](http://raspi.tv/2016/how-to-free-up-some-space-on-your-raspbian-sd-card-remove-wolfram-libreoffice)

[How To B](https://project.altservice.com/issues/418)

```
sudo apt-get remove --purge wolfram-engine libreoffice*
sudo apt-get autoremove
sudo apt-get clean
rm -rf /home/pi/python_games
```

### Update NodeJS

[How To](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/)

```
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt install nodejs
```

## Notes

Projector resolution: 1280x800
Display resoultion: 800x480

## Misc

Funded in part by The AZBurners Art Fund
