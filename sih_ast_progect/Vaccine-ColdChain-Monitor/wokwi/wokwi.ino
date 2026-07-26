#include <DHT.h>

#define DHTPIN 15
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

unsigned long previousMillis = 0;
const long interval = 5000;

float lastTemp = 5.0;

void setup()
{
Serial.begin(115200);

dht.begin();

Serial.println("Vaccine Cold Chain Monitoring Started");
}

void loop()
{

unsigned long currentMillis = millis();

if(currentMillis - previousMillis >= interval)
{

previousMillis = currentMillis;

float temp = dht.readTemperature();

if(isnan(temp))
{

Serial.println("Sensor Error");

return;

}

// Plausibility Check

if(temp < -20 || temp > 50)
{

Serial.println("Invalid Reading");

return;

}

// Smoothing

temp = (temp + lastTemp)/2;

lastTemp=temp;

// Breach Detection

bool breach=false;

if(temp<2 || temp>8)
{

breach=true;

}

Serial.print("Temperature : ");

Serial.print(temp);

Serial.print(" °C ");

if(breach)
Serial.println(" --> BREACH");

else
Serial.println(" --> SAFE");

}

}