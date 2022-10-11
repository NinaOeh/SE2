export enum MeasurementDatabases {
    "Engine rates per minute" = 'obd.rpm',
    "Acceleration" = "acc.xyz",
    "Transversal Acceleration" = "obd.acc_trans",
    "Longitudal Acceleration" = "obd.acc_long",
    "Yaw rate" = "obd.acc_yaw",
    "Electric brake torque" = "obd.brk_trq_req_el",
    "Driver brake torque" = "obd.brk_trq_req_dvr" 
}

export const MeasurementsArray = [
    {label:"Engine rates per minute", value:'obd.rpm'},
    {label:"Acceleration" , value: "acc.xyz"},
    {label:"Transversal Acceleration", value: "obd.acc_trans"},
    {label: "Longitudal Acceleration", value: "obd.acc_long"},
    {label: "Yaw rate", value: "obd.acc_yaw"},
    {label: "Electric brake torque", value: "obd.brk_trq_req_el"},
    {label: "Driver brake torque", value: "obd.brk_trq_req_dvr"}
]

