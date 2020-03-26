let rssiLevels = [0,15,21,26,37];

getSignalLevel = function(rssi){
  rssi = parseInt(rssi)
  let level = 0;
  for(let i=4; i>0; i--){
    if(rssi > rssiLevels[i]){
      level = i;
      break;
    }
  }
  return level+1;
}

module.exports = getSignalLevel;
