
# zw-rec



[![build status](https://img.shields.io/travis/com/ryanalbrecht/zw-rec.svg)](https://travis-ci.com/ryanalbrecht/zw-rec)

[![code coverage](https://img.shields.io/codecov/c/github/ryanalbrecht/zw-rec.svg)](https://codecov.io/gh/ryanalbrecht/zw-rec)

[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)

[![license](https://img.shields.io/github/license/ryanalbrecht/zw-rec.svg)](LICENSE)

[![npm downloads](https://img.shields.io/npm/dt/zw-rec.svg)](https://npm.im/zw-rec)



> A library to communicate with an omega zw-rec device



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
