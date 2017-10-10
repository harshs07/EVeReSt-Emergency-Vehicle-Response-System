# EVeReSt-Emergency-Vehicle-Response-System
EVeReSt is a system which aims to instantly detect motorcycle accidents and automatically communicate with emergency services to request help. The device is mounted on the handlebars of motorcycles, which in tandem with a mobile app can alert emergency services regarding an accident, and its location. Designed and implemented using Python on Raspberry Pi 3, NodeJS and Android.

This project was run on Raspberryi Pi 3.
We made use of piezo electric sensors to detect any impact. These sensors are to be placed on the points of a motorcycle where an impact could take place.

The android app is in the folder ToomuchSOS. It acts as the edge between the cloud server and the raspberry pi, in the Cloud-Edge-Beneath architecture. 
The NodeJS server receives accident alerts and triggers a tweet to emergency services to notify about the accident and provide its location.
Also, provided a push button to notify false alarms. 
