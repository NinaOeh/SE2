import pandas as pd
import pydantic
from typing import List, Tuple
import friction_db_schema
import json
import numpy as np
import scripts.osm_query as osm_query
from shapely.geometry import LineString
from datetime import datetime

'''
    comments: we have to think of a smart and good way of what data we want to extract from the old
    database and insert into the new database! 
'''


def estimateFrictionCoefficient(rpm_rl: np.ndarray, rpm_fl: np.ndarray) -> np.ndarray:
    '''
        Calculate the estimated friction coefficient
    '''
    r, beta_fl, beta_0 = 0.31, 3, 1

    alpha_v = np.multiply(rpm_rl, r)
    f = np.divide(np.multiply(beta_fl, r)*100,(np.multiply(rpm_fl, r) - alpha_v)*100)
    mu = (np.log(f + 1)) ** (1 / beta_0)
    return abs(mu)

def linear_interpolation(df, x, searchsort):
    #y(x)  =  y1  +  (x – x1)  \frac{(y2 – y1) }{ (x2 – x1)}
    df_int = []
    for i in range(len(searchsort)-1):
        interpolated_rpm = df["rpm_value_fl"].iloc[searchsort[i]] + (x.iloc[i]-df["TS_or_Distance"].iloc[searchsort[i]])*((df["rpm_value_fl"].iloc[searchsort[i+1]]-df["rpm_value_fl"].iloc[searchsort[i]])/(df["TS_or_Distance"].iloc[searchsort[i+1]]-df["TS_or_Distance"].iloc[searchsort[i]]))
        df_int.append(interpolated_rpm)

def extract_measurement_value(message_string: str) -> float:
    '''
        Extract the measurement value from the message
    '''
    message_dict = json.loads(message_string)
    message_keys = message_dict.keys()
    if 'obd.rpm_fl.value' in message_keys:
        return message_dict['obd.rpm_fl.value']

    if 'obd.rpm_rl.value' in message_keys:
        return message_dict['obd.rpm_rl.value']


def extract_waypointindex(message_string: str) -> float:
    '''
        Extract the way point index value from the message
    '''
    message_dict = json.loads(message_string)
    message_keys = message_dict.keys()
    if 'waypoint_index' in message_keys:
        return message_dict['waypoint_index']
    else:
        return 'no waypoint index'

def extract_Wayid(message_string: str, way_info: str) -> Tuple[int,int,str]:
    try:
        way_point_index = extract_waypointindex(way_info)
        if way_point_index == 'no waypoint index':
            way_point_index = 0
        message_dict = json.loads(message_string)[0]#['legs']['annotation']['nodes']
        nodes = message_dict['legs'][way_point_index-1]['annotation']['nodes']
        Node_id = str(nodes)
        Ways1 = osm_query.get_ways(nodes[0])
        Ways2 = osm_query.get_ways(nodes[1])
        Way_id = list(set(Ways1[0]) & set(Ways2[0]))
        wayPointName=[]
        geoList = []
        if len(Way_id) == 1:
            Way_id = str(Way_id[0])
            for i in Ways2[1]['elements']:
                if str(i['id']) == str(Way_id):
                    if 'name' in i['tags'].keys():
                        wayPointName.append(i['tags']['name'])
                    else:  
                        wayPointName.append('0')
                    for t in i['nodes']:
                        point = osm_query.get_node_lat_lon(t)
                        geoList.append(point)
                else:
                        wayPointName.append('0')
        else:
            Way_id = "Several possible ways: "+str(Way_id)
            wayPointName.append('0')
            Way_id_for_upload = str(Way_id[0])
            for i in Ways2[1]['elements']:
                if str(i['id']) == str(Way_id_for_upload):
                    if 'name' in i['tags'].keys():
                        wayPointName.append(i['tags']['name'])
                    else:  
                        wayPointName.append('0')
                    for t in i['nodes']:
                        point = osm_query.get_node_lat_lon(t)
                        geoList.append(point)
                else:
                        wayPointName.append('0')
        
        wayPointName = wayPointName[0]
        return Node_id, Way_id, wayPointName, LineString(geoList)
    except Exception as exc:
        return exc

def extract_node_along_way(way_id: str):
    try:
        nodes, wayPointName = osm_query.get_nodes_on_single_way(way_id)
        geoList = []
        for t in nodes:
            point = osm_query.get_node_lat_lon(t)
            geoList.append(point)
        return wayPointName, LineString(geoList)
    except Exception as exc:
        print(way_id)
        return [exc]

def extract_only_Wayid(message_string: str, way_info: str) -> Tuple[int,int,str]:
    way_point_index = extract_waypointindex(way_info)
    if way_point_index == 'no waypoint index':
        way_point_index = 0
    message_dict = json.loads(message_string)[0]#['legs']['annotation']['nodes']
    try:
        nodes = message_dict['legs'][way_point_index-1]['annotation']['nodes']
        Node_id = str(nodes)
        Ways1 = osm_query.get_ways(nodes[0])
        Ways2 = osm_query.get_ways(nodes[1])
        Way_id = list(set(Ways1[0]) & set(Ways2[0]))
        Way_id = str(Way_id[0])
        return [Node_id, Way_id]
        
    except Exception as exc:
        return [exc]



# def get_friction_info(friction_df: pd.DataFrame) -> List[friction_db_schema.MeasurementInfo]:
#     def parse(row):
#         return friction_db_schema.MeasurementInfo(
#             MeasurementId=row['MeasurementId'],
#             T=row['T'],
#             friction_value=calculate_friction(row['message']),
#             message=row['message']
#         )
#     return (parse(row) for _, row in friction_df.iterrows())

# def get_rpm_info_rl(df: pd.DataFrame) -> List[friction_db_schema.RPMs]:
#     def parse(row):
#         rpm = extract_measurement_value(row['message'])
#         if rpm!=None:
#             print("Here we are")
#             return friction_db_schema.RPMs(
#                 MeasurementId=row['MeasurementId'],
#                 TS_or_Distance=row['TS_or_Distance'],
#                 lat=row['lat'],
#                 lon=row['lon'],
#                 rpm_value_rl=extract_measurement_value(row['message']),
#                 MapReferenceId=row['MapReferenceId'],
#                 lat_MapMatched=row['lat_MapMatched'],
#                 lon_MapMatched=row['lon_MapMatched'],
#                 wayPointName=row['wayPointName'],
#                 WayPoint=row['WayPoint'],
#                 FK_Trip=row['FK_Trip']
#             )
#         else:
#             pass
#     return (parse(row) for _, row in df.iterrows())

# def get_rpm_info_fl(df: pd.DataFrame) -> List[friction_db_schema.RPMsReduced]:
#     def parse(row):
#         rpm = extract_measurement_value(row['message'])
#         if rpm!=None:
#             return friction_db_schema.RPMsReduced(
#                 MeasurementId=row['MeasurementId'],
#                 TS_or_Distance=row['TS_or_Distance'],
#                 rpm_value_fl=extract_measurement_value(row['message']),
#                 FK_Trip=row['FK_Trip']
#             )
#         else:
#             pass
#     return (parse(row) for _, row in df.iterrows())


def get_rpm_info_rl1(df: pd.DataFrame) -> List[friction_db_schema.RPM_rl1]:
    def parse(row):
        rpm = extract_measurement_value(row['message'])
        if rpm!=None:
            if 'Expecting value:' in extract_Wayid(row['PossibleMatchingRoutes']):
                print(f"Here we had an error. The row will be ignored.")
                pass
            else:
                print('Way id found')
                node_id, way_id, wayPointName, geoList= extract_Wayid(row['PossibleMatchingRoutes'])
            
                return friction_db_schema.RPM_rl(
                    MeasurementId=row['MeasurementId'],
                    TS_or_Distance=row['TS_or_Distance'],
                    T=row['T'],
                    lat_MapMatched=row['lat_MapMatched'],
                    lon_MapMatched=row['lon_MapMatched'],
                    rpm_value_rl=extract_measurement_value(row['message']),
                    FK_Trip=row['FK_Trip'],
                    WayPoint_index=extract_waypointindex(row['WayPoint']),
                    wayPoint_Name=wayPointName if wayPointName != '0' else row['wayPointName'],
                    legDistance_MapMatched=row['legDistance_MapMatched'],
                    Node_id=node_id,
                    lane=row['lane'],
                    direction=row['direction'],
                    Way_id=way_id,
                    geometry=geoList
                )            
        else:
            pass
    return (parse(row) for _, row in df.iterrows())



def get_rpm_info_rl(df: pd.DataFrame) -> List[List[friction_db_schema.RPM_rl]]:
    def parse(row):
        rpm = extract_measurement_value(row['message'])
        if rpm!=None:
            way_extraction = extract_only_Wayid(row['PossibleMatchingRoutes'], row['WayPoint'])
            if len(way_extraction) == 2:
                node_id = way_extraction[0]
                way_id = way_extraction[1]
                return friction_db_schema.RPM_rl(
                    MeasurementId=row['MeasurementId'],
                    TS_or_Distance=row['TS_or_Distance'],
                    T=row['T'],
                    lat_MapMatched=row['lat_MapMatched'],
                    lon_MapMatched=row['lon_MapMatched'],
                    rpm_value_rl=extract_measurement_value(row['message']),
                    FK_Trip=row['FK_Trip'],
                    legDistance_MapMatched=row['legDistance_MapMatched'],
                    Node_id=node_id,
                    Way_id=way_id
                )
            
            else:
                print(f"Here we had an error. The row will be ignored.")
                return
        else:
            pass
    return (parse(row) for _, row in df.iterrows())

def get_rpm_info_fl(df: pd.DataFrame) -> List[friction_db_schema.RPM_fl]:
    def parse(row):
        rpm = extract_measurement_value(row['message'])
        if rpm!=None:
            return friction_db_schema.RPM_fl(
                MeasurementId=row['MeasurementId'],
                TS_or_Distance=row['TS_or_Distance'],
                T=row['T'],
                lat=row['lat'],
                lon=row['lon'],
                rpm_value_fl=extract_measurement_value(row['message']),
                FK_Trip=row['FK_Trip']
            )
        else:
            return
    return (parse(row) for _, row in df.iterrows())

def get_geometry_info(df: pd.DataFrame) -> List[friction_db_schema.Geometry]:
    def parse(row):
        if 'Expecting value:' in str(extract_Wayid(row['PossibleMatchingRoutes'], row['WayPoint'])):
            print(f"Here we had an error. The row will be ignored.")
            return
        else:
            node_id, way_id, wayPointName, geoList= extract_Wayid(row['PossibleMatchingRoutes'])
            if not geoList.is_empty:
                return friction_db_schema.Geometry(
                    wayPoint_Name=wayPointName,
                    lane=row['lane'],
                    direction=row['direction'],
                    Way_id=way_id,
                    geometry=geoList,
                    dateUploaded=datetime.now()
                )
            else:
                pass
    return (parse(row) for _, row in df.iterrows())

def get_geometry_info_by_wayid(geos: List[str]) -> List[friction_db_schema.Geometry]:
    def parse(way_id):
        try:
            wayPointName, geoList= extract_node_along_way(way_id)
            if not geoList.is_empty:
                return friction_db_schema.Geometry(
                    wayPoint_Name=wayPointName,
                    lane=0,
                    direction=0,
                    Way_id=way_id,
                    geometry=geoList,
                    dateUploaded=datetime.now()
                )
            else:
                pass
        except:
            return
    return (parse(geo) for geo in geos)
