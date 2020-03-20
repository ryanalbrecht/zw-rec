const test = require('ava');
const ping = require('ping');
let ZWRec = require('../index');
let zwRec = new ZWRec('172.17.1.127');


test.serial('zw-rec device is responding to ping', async t => {
  let res = await ping.promise.probe(zwRec.host);
  t.true(res.alive);
});

test.serial('function _getThermocoupleData with target2 and offset returns without error', async t => {
  let thermocouples = await zwRec._getThermocoupleData({target: 2, offset: 0});
  t.truthy( thermocouples );
});

test.serial('function _getThermocoupleData with target3 and offset returns without error', async t => {
  let thermocouples = await zwRec._getThermocoupleData({target: 3, offset: 0});
  t.truthy( thermocouples );
});

test.serial('function _getThermocoupleData with target2 and deviceID returns without error', async t => {
  let thermocouples = await zwRec._getThermocoupleData({target: 2, deviceID: 1});
  t.truthy( thermocouples );
});

test.serial('function getActiveThermocouples returns without error', async t => {
  let ids = await zwRec.getActiveThermocouples();
  t.true(ids === '' || ids.split(',').length > 1);
});

test.serial('function getAllThermocouples returns without error', async t => {
  let thermocouples = await zwRec.getAllThermocouples();
  t.truthy( thermocouples );
});

test.serial('function getThermocouple returns without error', async t => {
  let thermocouple = await zwRec.getThermocouple(4);
  t.truthy( thermocouple );
});

test.serial('function setThermocouple returns without error', async t => {
  let thermocouple = await zwRec.setThermocouple({
    deviceID: 1,
    EDName: 'FLOOR_1'
  });
  t.truthy( thermocouple );
});


test.serial('function rebootReciever returns without error', async t => {
  let thermocouple = await zwRec.rebootReciever();
  t.truthy( thermocouple );
});
