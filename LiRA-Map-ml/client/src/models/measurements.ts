export enum MeasurementDatabases {
    "Engine rates per minute" = 'obd.rpm',
    "Acceleration" = "acc.xyz",
    "Transversal Acceleration" = "obd.acc_trans",
    "Longitudal Acceleration" = "obd.acc_long",
    "Yaw rate" = "obd.acc_yaw",
    "Electric brake torque" = "obd.brk_trq_req_el",
    "Driver brake torque" = "obd.brk_trq_req_dvr" 
}

export let available_car_measurements = ['obd.rpm', "acc.xyz", "obd.acc_trans" , "obd.acc_long", "obd.acc_yaw",
"obd.brk_trq_req_el", "obd.brk_trq_req_dvr"] 

