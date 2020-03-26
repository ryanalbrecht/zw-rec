let getbatteryLevel = require('./battery-level');

async function run(){
  let ZWRec = require('./index');
  let zwRec = new ZWRec({host:'172.17.1.127'});
  let thermocouple = await zwRec.getThermocouple(10);
  console.log(thermocouple)
}


run();
