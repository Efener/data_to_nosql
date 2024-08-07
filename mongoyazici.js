const mongoose = require('mongoose');
const Client = require('./models/client'); // Client modelini import et, yol ve isimler modele göre ayarlanmalı
const DailyData = require('./models/dailyData'); // DailyData modelini import et, yol ve isimler modele göre ayarlanmalı

// Örnek veri ekleme
const data1 = {
    "SensorData": {"temperature":21.97,"humidity":56.24,"value":21.97,"value2":56.24,"gatewayId":43010002,"date":"2024-07-01T06:05:54+00:00","batteryLevel":100,"signalLevel":83,"error":0,"index":94145,"latitude":null,"longitude":null},
    "ThingId": 1932,
    "clientID": 432
};

const data2 = {
    "SensorData": {
        "temperature": 25.94,
        "humidity":55.34,
        "value2":55.34,
        "value": 25.94,
        "gatewayId": 43010002,
        "date": "2023-09-05T00:17:55+00:00",
        "batteryLevel": 100,
        "signalLevel": 11,
        "error": 0,
        "index": 94329,
        "latitude": null,
        "longitude": null
    },
    "ThingId": 150,
    "clientID": 45
};

// MongoDB bağlantısını oluştur
mongoose.connect('mongodb://127.0.0.1:27017/myTestApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB bağlantısı başarılı');
    })
    .catch(err => {
        console.error('MongoDB bağlantı hatası:', err);
    });

const insertSensorData = async (data) => {
    const { SensorData, ThingId, clientID } = data;
    const { temperature, value, humidity, value2, gatewayId, date, batteryLevel, signalLevel, error, index, latitude, longitude } = SensorData;
    const sensorDate = new Date(date);
    const yearT = sensorDate.getFullYear();
    const monthT = sensorDate.getMonth() + 1; // Aylar 0-11 arası olduğundan 1 ekliyoruz
    const dayT = sensorDate.getDate();

    try {
        let client = await Client.findOne({ clientID });

        if (!client) {
            client = new Client({
                clientID,
                things: [
                    {
                        thingID: ThingId,
                        yearlyData: [
                            {
                                year: yearT,
                                months: [
                                    {
                                        month: monthT,
                                        days: [
                                            {
                                                day: dayT,
                                                data: [
                                                    {
                                                        temperature,
                                                        humidity,
                                                        value,
                                                        value2,
                                                        gatewayId,
                                                        date: sensorDate,
                                                        batteryLevel,
                                                        signalLevel,
                                                        error,
                                                        index,
                                                        latitude,
                                                        longitude
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        } else {
            const thing = client.things.find(t => t.thingID === ThingId);

            if (thing) {
                const year = thing.yearlyData.find(y => y.year === yearT);

                if (year) {
                    const month = year.months.find(m => m.month === monthT);

                    if (month) {
                        const day = month.days.find(d => d.day === dayT);

                        if (day) {
                            day.data.push({
                                temperature,
                                humidity,
                                value,
                                value2,
                                gatewayId,
                                date: sensorDate,
                                batteryLevel,
                                signalLevel,
                                error,
                                index,
                                latitude,
                                longitude
                            });
                        } else {
                            month.days.push({
                                day: dayT,
                                data: [
                                    {
                                        temperature,
                                        humidity,
                                        value,
                                        value2,
                                        gatewayId,
                                        date: sensorDate,
                                        batteryLevel,
                                        signalLevel,
                                        error,
                                        index,
                                        latitude,
                                        longitude
                                    }
                                ]
                            });
                        }
                    } else {
                        year.months.push({
                            month: monthT,
                            days: [
                                {
                                    day: dayT,
                                    data: [
                                        {
                                            temperature,
                                            humidity,
                                            value,
                                            value2,
                                            gatewayId,
                                            date: sensorDate,
                                            batteryLevel,
                                            signalLevel,
                                            error,
                                            index,
                                            latitude,
                                            longitude
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                } else {
                    thing.yearlyData.push({
                        year: yearT,
                        months: [
                            {
                                month: monthT,
                                days: [
                                    {
                                        day: dayT,
                                        data: [
                                            {
                                                temperature,
                                                humidity,
                                                value,
                                                value2,
                                                gatewayId,
                                                date: sensorDate,
                                                batteryLevel,
                                                signalLevel,
                                                error,
                                                index,
                                                latitude,
                                                longitude
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    });
                }
            } else {
                client.things.push({
                    thingID: ThingId,
                    yearlyData: [
                        {
                            year: yearT,
                            months: [
                                {
                                    month: monthT,
                                    days: [
                                        {
                                            day: dayT,
                                            data: [
                                                {
                                                    temperature,
                                                    humidity,
                                                    value,
                                                    value2,
                                                    gatewayId,
                                                    date: sensorDate,
                                                    batteryLevel,
                                                    signalLevel,
                                                    error,
                                                    index,
                                                    latitude,
                                                    longitude
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
            }
        }

        await client.save();
        console.log('Veri başarıyla eklendi!');
    } catch (err) {
        console.error('Veri eklenirken hata oluştu:', err);
    }
};

module.exports = insertSensorData;
