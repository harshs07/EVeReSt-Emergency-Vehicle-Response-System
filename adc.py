from bluetooth import *
import spidev
import time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM) 
GPIO.setup(24, GPIO.OUT) #cathode 18
GPIO.setup(27, GPIO.OUT) #green 13  
GPIO.setup(22, GPIO.OUT) #blue 15
GPIO.setup(5, GPIO.OUT)  #red 29
GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_UP)

server_sock=BluetoothSocket( RFCOMM )
server_sock.bind(("",PORT_ANY))
server_sock.listen(1)

port = server_sock.getsockname()[1]

uuid = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

#Define Variables
delay = 0.5
ldr_channel = 0

#Create SPI
spi = spidev.SpiDev()
spi.open(0, 0)
 
def readadc(adcnum):
    # read SPI data from the MCP3008, 8 channels in total
    if adcnum > 7 or adcnum < 0:
        return -1
    r = spi.xfer2([1, 8 + adcnum << 4, 0])
    data = ((r[1] & 3) << 8) + r[2]
    return data

def led_On():
    GPIO.output(27, GPIO.HIGH)  #green off
    GPIO.output(5, GPIO.LOW)   #red on
    client_sock.send('ACCIDENT ALERT')
    time.sleep(delay)
    #GPIO.output(24, GPIO.LOW)

def led_Off():
    #print('Button Pressed')
    GPIO.output(5, GPIO.HIGH)  #red off
    GPIO.output(27, GPIO.LOW)  #green on
    client_sock.send('CANCEL')
    time.sleep(delay)
    

x = 0

GPIO.output(22, GPIO.LOW)# blue on

while x<3:

        
        #GPIO.output(22, GPIO.HIGH)
        GPIO.output(24, GPIO.HIGH)
        GPIO.output(5, GPIO.HIGH)
        GPIO.output(27, GPIO.HIGH)
    
        #GPIO.output(22, GPIO.LOW)# blue on
        
        print "Waiting for connection on RFCOMM channel %d" % port

        client_sock, client_info = server_sock.accept()
        print "Accepted connection from ", client_info
        x = 1
        GPIO.output(22, GPIO.HIGH)   #blue off
        GPIO.output(27, GPIO.LOW)    #green on
                
        while x == 1:
            try:
                ldr_value = readadc(ldr_channel)
                
                print("Pressure: %f" % ldr_value)

                  
                if ldr_value > 500:
                    led_On()

                input_state = GPIO.input(17)
                if input_state == False:
                    led_Off()

                #time.sleep(delay)

            except IOError:
                pass


            except KeyboardInterrupt:

                print "disconnected"
            
                client_sock.close()
                server_sock.close()
                print "all done"
                GPIO.output(22, GPIO.HIGH)   #blue off
                break

GPIO.output(22, GPIO.HIGH)   #blue off            
print "disconnected"
client_sock.close()
server_sock.close()
print "all done"
    

