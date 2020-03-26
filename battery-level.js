const hysteresis = {
  'ZWED': {
    upper: [0, 2.15, 2.4, 2.6, 2.95],
    lower: [0, 2.05, 2.3, 2.5, 2.85]
  },
  'ZED': {
    upper: [0, 2.7, 2.825, 2.95, 3.05],
    lower: [0, 2.65, 2.775, 2.9, 3.0]
  },
  'UW': {
    upper: [0, 2.7, 2.825, 2.95, 3.05],
    lower: [0, 2.65, 2.775, 2.9, 3.0]
  }
};

let getbatteryLevel = function(typeFamily, bVolts){
  bVolts = bVolts/1000 //convert from millivolts to volts
  let voltages = hysteresis[typeFamily].lower;
  let level = 0;
  for(let i=4; i>0; i--){
    if(bVolts > voltages[i]){
      level = i;
      break;
    }
  }
  return level;
}

module.exports = getbatteryLevel;
