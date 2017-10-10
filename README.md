# EVeReSt-Emergency-Vehicle-Response-System
EVeReSt is a system which aims to instantly detect motorcycle accidents and automatically communicate with emergency services to request help. The device is mounted on the handlebars of motorcycles, which in tandem with a mobile app can alert emergency services regarding an accident, and its location. Designed using Python on Raspberry Pi, NodeJS, Android and Eddy Stone Beacons.

The code for python is for the Raspberry Pi. 
This project was run on Raspberryi Pi 3.
We made use of piezo electric sensors to detect any impact. These sensors are to be placed on the points of a motorcycle where an impact could take place.

The android app is in the folder ToomuchSOS. This communicates with the raspberry pi and the node server and facilitates accident detection.
The NodeJS code will receive any accident alerts and will trigger a tweet to emergency services to inform them of the accident and provide its location.
