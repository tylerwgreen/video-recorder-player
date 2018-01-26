# Video Recorder Player

## Raspberry Pi project

- Plays music while recording slow motion video that are then projected via HDMI
- Uses chromium to display a browser based UI running on express

## Setup

### Desktop Icons

[How To](http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/desktop-shortcuts)

Create symbolic links

```
ls -s ~/saguaro-man/desktop/name-of-file.desktop ~/Desktop/name-of-file.desktop
```

### Auto Start & Disable Screen Saver

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
@/home/pi/saguaro-man/startup
```

### Remove Bloatware

[How To A](http://raspi.tv/2016/how-to-free-up-some-space-on-your-raspbian-sd-card-remove-wolfram-libreoffice)

[How To B](https://project.altservice.com/issues/418)

```
sudo apt-get remove --purge wolfram-engine libreoffice* penguinspuzzle
sudo apt-get autoremove
sudo apt-get clean
rm -rf /home/pi/python_games
```

### Dependent packages

```
sudo apt-get install gpac
```

### Update NodeJS

[How To](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/)

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt install nodejs
```

## Notes

Projector resolution: 1280x800
Display resoultion: 800x480

## Misc

Funded in part by The AZBurners Art Fund
