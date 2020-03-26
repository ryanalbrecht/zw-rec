const getThermocoupleType = require('./thermocouple-types');
const getBatteryLevel = require('./battery-level');
const getSignalLevel = require('./signal-level');
const axios = require('axios');
const merge = require('deepmerge');
const qs = require('querystring');

class ZWRec {

  /**
   *Creates an instance of ZWRec.
   * @param {string} [host='192.168.1.200'] the host address of the zw-rec
   * @param {string} [host='192.168.1.200'] the port of the zw-rec
   * @param {string} [clientUsername='login'] the username of the client login
   * @param {string} [clientPassword='12345678'] the password for the client login
   * @param {string} [adminUsername='admin'] the username of the admin login
   * @param {string} [adminPassword='000000'] the password for the admin lgoin
   * @memberof ZWRec
   */
  constructor(config) {
    config = { ...config };

    this._host = config.host || '192.168.1.200';
    this._clientUsername = config.clientUsername || 'login';
    this._clientPassword = config.clientPassword || '12345678';
    this._adminUsername = config.adminUsername || 'admin';
    this._adminPassword = config.adminPassword || '00000000';

    this._clientAuth = {
      username: this._clientUsername,
      password: this._clientPassword,
    };

    this._adminAuth = {
      username: this._adminUsername,
      password: this._adminPassword,
    };

    this._baseUrl = `http://${this._host}`;
  }

  // -------- GETTERS --------- //

  get host(){
    return this._host;
  }

  // -------- PUBLIC METHODS --------- //



  /**
   * Get a list of active thermocouple IDs
   *
   * @memberof ZWRec
   */
  getActiveThermocouples() {
    return axios.get(`${this._baseUrl}/get_active_eds.cgi`, {auth: this._clientAuth})
      .then((resp) => {
        //zw-rec will respond with a an object of {result:1,2,3,4,5...}
        return resp.data.result;
      }, (error) => {
        throw(`ZW-REC http request failed to ${err.config.url}`);
      });
  }


  /**
   * Get the current state for all thermocouples
   *
   * @memberof ZWRec
   */
  async getAllThermocouples(){
    let t2Thermocouples = [];
    let t3Thermocouples = [];
    let offset = 0;
    let data;
    let counter = 0; // just a check to prevent an infinite loop

    //get data from target 2
    do {
      data = await this._getThermocoupleData({target: 2, offset: offset});
      data.readings.forEach( tc => t2Thermocouples.push(tc) );
      offset = data.nxt;
      counter++;
    } while ( counter < 33 && data.nxt < 128 );

    offset = 0;
    counter = 0;

    //get data from target 3
    do {
      data = await await this._getThermocoupleData({target: 3, offset: offset});
      data.states.forEach( tc => t3Thermocouples.push(tc) );
      offset = data.nxt;
      counter++;
    } while ( counter < 33 && data.nxt < 128 );

    //do a check and see if there is a difference between target2 and target3 ids
    let t2Ids = t2Thermocouples.map(tc => tc.id);
    let t3Ids = t3Thermocouples.map(tc => tc.id);
    let difference = t2Ids
      .filter(x => !t3Ids.includes(x))
      .concat(t3Ids.filter(x => !t2Ids.includes(x)));

    if(difference.length > 0){
      throw("The return thermocouple IDs from target2 results does not match ID from target3 results");
    }

    //merge target2 and target3 data
    let mergedData = t2Thermocouples.map(tcA => {
      let tcB = t3Thermocouples.find(x => x.id == tcA.id);
      let mergedTc = merge(tcA, tcB);
      //remove silly temperature symbol from sensor readings;
      mergedTc.srs = this._fixTemperatureSymbols(mergedTc.srs);
      mergedTc.typeStr = getThermocoupleType(mergedTc.type).type;
      mergedTc.typeFam = getThermocoupleType(mergedTc.type).family;
      mergedTc.batteryLevel = getBatteryLevel(mergedTc.typeFam, mergedTc.battery);
      mergedTc.signalLevel = getSignalLevel(mergedTc.rssi);
      return mergedTc;
    });

    //marge data and return
    return mergedData;
  }


  /**
   * Get the state of a single thermocouple
   *
   * @param {*} id The id of the thermocouple
   * @memberof ZWRec
   */
  async getThermocouple(id){
    let target2 = await this._getThermocoupleData({target: 2, deviceID: id});
    let target3 = await this._getThermocoupleData({target: 3, deviceID: id});
    let tc = merge(target2.readings[0], target3.states[0]);
    tc.typeStr = getThermocoupleType(tc.type).type;
    tc.typeFam = getThermocoupleType(tc.type).family;
    tc.batteryLevel = getBatteryLevel(tc.typeFam, tc.battery);
    tc.signalLevel = getSignalLevel(tc.rssi);
    tc.srs = this._fixTemperatureSymbols(tc.srs);
    return tc
  }



  /**
   * Set the name and config parameters of a thermocouple
   *
   * @param {*} [config={}] a config object which hold the deviceID and config paramters
   * @returns if succesfull will return {result:0} if success
   * @memberof ZWRec
   */
  setThermocouple(config = {}){
    if(!('deviceID' in config)){
      throw("setThermocouple function requires deviceID key in config object");
    }

    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return axios({
      method: 'post',
      url: `${this._baseUrl}/zwrec_request.cgi`,
      auth: this._clientAuth,
      data: `target=1&${qs.stringify(config)}`,
      headers: headers
    })
    .then( resp => resp.data)
    .catch( err => {
      throw(`ZW-REC http request failed to ${err.config.url}`);
    })
  }




  /**
   * Send a reboot request to the device
   *
   * @returns if succesfull will return {result:0} if success
   * @memberof ZWRec
   */
  rebootReciever(){
    return axios({
      method: 'post',
      url: `${this._baseUrl}/power_cycle.cgi`,
      auth: this._adminAuth
    })
    .then( resp => resp.data )
    .catch(err => {
      throw(`ZW-REC http request failed to ${err.config.url}`);
    })
  }


  // -------- PRIVATE METHODS --------- //


  /**
   * Performs thermocouple http request with given target and either an offset or deviceID. If both are given. DeviceID will take priority.
   *
   * @param {*} target The target to use in the http request
   * @param {object} [config] A configuration object which will hold a target property and either an offset or deviceID
   * @memberof ZWRec
   */
  _getThermocoupleData(config){
    //do some check to make sure config object has a specific pattern
    if( !config.target ){
      throw("target property is required in config object when calling _getThermocoupleData");
    }

    if( 'deviceID' in config && 'offset' in config ){
      throw("config object cannot have both offset and deviceID key when calling _getThermocoupleData");
    }

    return axios.get(`${this._baseUrl}/zwrec_request.cgi`, {
      params: {
          ...config
      },
      auth: this._clientAuth
    })
    .then( resp => resp.data )
    .catch( err => {
      throw(`ZW-REC http request failed to ${err.config.url}`);
    });
  }


  /**
   * Removes the silly temperature symbols from the sesnor array readings and adds a new key as the symbol
   *
   * @param {*} sensorArray An array of sensors returned from a zw-rec reading
   * @returns array or sensor readings
   * @memberof ZWRec
   */
  _fixTemperatureSymbols(sensorArray){
    for(let temp of sensorArray){
      let split = temp.r.split(' ');
      temp.r = parseFloat(split[0]);
      temp.s = split[1];
    }

    return sensorArray;
  }
}

module.exports = ZWRec;
