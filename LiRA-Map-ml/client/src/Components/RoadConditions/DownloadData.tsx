//created by Nina (s213535)

import { downloadFriction } from "../../queries/friction";
import { downloadCondition } from "../../queries/conditions";
import React from 'react';
import '../../css/downloader.css'

interface DownloadProps {
    maxlat: number, 
    minlat: number, 
    maxlon: number, 
    minlon: number,
    type: string
}

const Downloader: React.FC<DownloadProps> = ({maxlat,minlat,maxlon,minlon, type}) => {
    

    const downloadFile = ( data: any, fileName: string, fileType: string) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const anchor = document.createElement('a')
        anchor.download = fileName
        anchor.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        anchor.dispatchEvent(clickEvt)
        anchor.remove()
      }

    const export_FrictionToCsv = (data:any) => {
    
    // Headers for each column
    const headers = ['FrictionId,TS_or_Distance,mapped_lat,mapped_lon,rpm_fl_value,\
    rpm_rl_value,friction_value,FK_Trip,MeasurementId_rl,Node_id,legDistance_MapMatched,Way_id']
    
    // Convert data to a csv
    const dataRed = data.reduce(
        (acc: string[], d: { FrictionId: any; TS_or_Distance: any; mapped_lat: any; mapped_lon: any; rpm_fl_value: any; rpm_rl_value: any; friction_value: any; FK_Trip: any; MeasurementId_rl: any; Node_id: any; legDistance_MapMatched: any; Way_id: any; }) => {
        const { FrictionId,TS_or_Distance,mapped_lat,mapped_lon,rpm_fl_value,
        rpm_rl_value,friction_value,FK_Trip,MeasurementId_rl,Node_id,legDistance_MapMatched,Way_id } = d
        acc.push([FrictionId,TS_or_Distance,mapped_lat,mapped_lon,rpm_fl_value,
        rpm_rl_value,friction_value,FK_Trip,MeasurementId_rl,Node_id,legDistance_MapMatched,Way_id].join(','))
        return acc
    }, [])

    downloadFile([...headers, ...dataRed].join('\n'),'friction_data.csv','text/csv')
    }

    const export_ConditionToCsv = (data:any) => {
    
    // Headers for each column
    const headers = ['conditions| length| coordinates']
    
    // Convert data to a csv
    console.log(data)
    const data_array = Object.keys(data).map((key) => data[key])
    const dataRed = data_array.reduce(
        (acc: string[], d: { conditions: any; length: any; coordinates: any}) => {
        const { conditions, length, coordinates } = d
        const conditions_ = Object.keys(conditions).map((key) => conditions[key])
        const cond_red = conditions_[0].reduce(
            (con: string[], d: {value: any; dist: any}) => {
                const { value,dist } = d
                con.push([value,dist].join('/'))
                return con
        },[])
        const coordinates_ = Object.keys(coordinates).map((key) => coordinates[key])
        const coords_red = coordinates_.reduce(
            (con: string[], d: {lat: any; lon: any, way_dist: any}) => {
                const { lat,lon, way_dist } = d
                con.push([lat,lon, way_dist].join('/'))
                return con
        },[])
        acc.push([cond_red, length, coords_red].join('|'))
        return acc
    }, [])

    downloadFile([...headers, ...dataRed].join('\n'),'condition_data.csv','text/csv')
    }

    const getData = async () =>{
        if (type == "Friction" || type == "FrictionLatLgn"){
            const data = await downloadFriction(maxlat,minlat,maxlon,minlon);
            const json = JSON.stringify(data)
            export_FrictionToCsv(data)
        }
        else {
            const data = await downloadCondition(maxlat,minlat,maxlon,minlon,type);
            const json = JSON.stringify(data)
            export_ConditionToCsv(data)
        }
    }

    return (
        <div className='downloader-wrapper'>
        <div className='downloadwrapper'>
            <button className='downloadbutton' onClick = {getData}>Download Data</button>
        </div>
        </div>
    )
}

export default Downloader