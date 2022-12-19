//created by Nina (s213535)

import React from 'react';
import '../../css/downloader.css';

interface DownloadProps {
    d_data: any,
    name: string
}

const Downloader: React.FC<DownloadProps> = ({d_data, name}) => {
    

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

    const export_ToCsv = (data:any, name:string, id: string) => {
    
    // Headers for each column
    const headers = ['MeasurementId,TS_or_Distance,T,lat,lon,message,isComputed,FK_Trip,FK_MeasurementType,Created_Date,Updated_Date,Description']
    
    // Convert data to a csv
    const dataRed = data.reduce(
        (acc: string[], d: { MeasurementId: any,TS_or_Distance: any,T: any,lat: any,lon: any,message: any,isComputed: any,FK_Trip: any,FK_MeasurementType: any,Created_Date: any,Updated_Date: any,Description: any}) => {
        const { MeasurementId,TS_or_Distance,T,lat,lon,message,isComputed,FK_Trip,FK_MeasurementType,Created_Date,Updated_Date,Description } = d
        acc.push([MeasurementId,TS_or_Distance,T,lat,lon,message,isComputed,FK_Trip,FK_MeasurementType,Created_Date,Updated_Date,Description].join(','))
        return acc
    }, [])
    const file_name=id+"_"+name+"_"+"data.csv"
    downloadFile([...headers, ...dataRed].join('\n'),file_name,'text/csv')
    }

    const getData = () =>{
        for(let i in d_data){
            let id = i;
            let val = d_data[i];
            export_ToCsv(val,name,id)
        }
    }

    return (
        <div className='downloader-measurement-wrapper'>
        <div className='downloadwrapper'>
            <button className='downloadbutton' onClick = {getData}>Download Data</button>
        </div>
        </div>
    )
}

export default Downloader