const ZWED = 'ZWED';
const ZED = 'ZED';
const UW = 'UW';

const familyTypes = [
  ZWED,
  ZED,
  UW,
]

const transmitterTypes = {
  0:    ctt("Unknown",null),
  1:    ctt("T",ZWED) ,
  2:    ctt("T_BTP",ZWED) ,
  3:    ctt("T_THP",ZWED) ,
  4:    ctt("T_TP",ZWED) ,
  5:    ctt("TH",ZWED) ,
  6:    ctt("TH_BTP",ZWED) ,
  7:    ctt("TH_THP",ZWED) ,
  8:    ctt("TH_TP",ZWED) ,
  9:    ctt("BT",ZWED) ,
  10:   ctt("BT_BTP",ZWED) ,
  11:   ctt("BT_THP",ZWED) ,
  12:   ctt("BT_TP",ZWED) ,
  13:   ctt("BTH",ZWED) ,
  14:   ctt("BTP",ZWED) ,
  15:   ctt("THP",ZWED) ,
  16:   ctt("TP",ZWED) ,
  17:   ctt("VI",ZWED) ,
  20:   ctt("ZED_TC",ZWED) ,
  220:  ctt("UWTC_PH",UW) ,
  221:  ctt("UWTC_B",UW) ,
  222:  ctt("UWTC_C",UW) ,
  224:  ctt("UWTC_E",UW) ,
  227:  ctt("UWTC_RH",UW) ,
  228:  ctt("UWTC_IR",UW) ,
  229:  ctt("UWTC_J",UW) ,
  230:  ctt("UWTC_K",UW) ,
  233:  ctt("UWTC_N",UW) ,
  235:  ctt("UWTC_RTD",UW) ,
  237:  ctt("UWTC_R",UW) ,
  238:  ctt("UWTC_S",UW) ,
  239:  ctt("UWTC_T",UW) ,
  250:  ctt("ZRTR",null),
  255:  ctt("ZW_ED",ZWED),
};

//create transmitter type. simply return an object {type,family}
function ctt(type,family){
  return {type,family}
};


getThermocoupleType = function(typeId){
  if(!(typeId in transmitterTypes)){
    throw('Thermocouple type does not exist');
  }
  return transmitterTypes[typeId];
}



module.exports = getThermocoupleType;
