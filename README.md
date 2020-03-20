
# zw-rec


[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)

[![npm downloads](https://img.shields.io/npm/dt/zw-rec.svg)](https://npm.im/zw-rec)



> A library to communicate with an omega zw-rec device

https://www.omega.com/en-us/control-and-monitoring-devices/wireless-monitoring-devices/wireless-receivers/p/ZW-REC-Series


## Table of Contents




## Install



[npm][]:



```sh

npm install zw-rec

```



[yarn][]:



```sh

yarn add zw-rec

```




## Usage



```js

const  ZwRec = require('zw-rec');

/*
A config object can optionally be passed in the constructor. Default options are:
host = 192.168.1.200
clientUsername = login
clientPassword = 12345678
adminUsername = admin
adminPassword = 00000000
*/

//instatiate zeRec device
const  zwRec = new  ZwRec({
	host: '172.17.1.17'
});

//get all thermocouple data
zwRec.getAllThermocouples().then(data => {
	console.log(data)
});

//get a single thermocouple's data. Eg for deviceID 13
zwRec.getThermocouple(13).then(data => {
	console.log(data)
});

//update thermocouple configuration
zwRec.setThermocouple({
	deviceID:  13,
	EDName:  'FLOOR_1',
	EDSleepTime: 120, //expected update interval in seconds
	EDOffset0: 0, //sensor 1 offset
	EDOffset1: 0 //sensor 2 offset
});

//reboot the reciever
zwRec.rebootReciever()
```




## Contributors



no one yet!



## License

  What is a license?


##



[npm]: https://www.npmjs.com/



[yarn]: https://yarnpkg.com/
