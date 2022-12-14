# created by Nina Oehlckers (s213535)
# extended by Colin Hoffmann (s212711)

import pandas as pd
from typing import List, Tuple
import friction_db_schema
import json
import numpy as np
import scripts.osm_query as osm_query
from shapely.geometry import LineString
from datetime import datetime


def estimateFrictionCoefficient(rpm_rl: np.ndarray, rpm_fl: np.ndarray) -> np.ndarray:
    '''
        Authored by Colin Hoffmann (s212711)
        Calculate the estimated friction coefficient
    '''
    r, beta_fl, beta_0 = 0.31, 3, 1

    alpha_v = np.multiply(rpm_rl, r)
    f = np.divide(np.multiply(beta_fl, r)*100,(np.multiply(rpm_fl, r) - alpha_v)*100)
    mu = (np.log(f + 1)) ** (1 / beta_0)
    return abs(mu)

def linear_interpolation(df, x, searchsort):
    '''
        Do a linear interpolation
    '''
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
    '''
        Map exact wayID with OSM
    '''
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
    '''
        Query all nodes along a way from OSM
    '''
    try:
        nodes, wayPointName = osm_query.get_nodes_on_single_way(way_id)
        geoList = []
        for t in nodes:
            point = osm_query.get_node_lat_lon(t)
            geoList.append(point)
        return wayPointName, LineString(geoList)
    except Exception as exc:
        return [exc]

def extract_only_Wayid(message_string: str, way_info: str) -> Tuple[int,int,str]:
    '''
        Only extract node id
    '''
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


def get_rpm_info_rl1(df: pd.DataFrame) -> List[friction_db_schema.RPM_rl1]:
    '''
        get info of rpm rl (with map reference informations)
    '''
    def parse(row):
        rpm = extract_measurement_value(row['message'])
        if rpm!=None:
            if 'Expecting value:' in extract_Wayid(row['PossibleMatchingRoutes']):
                pass
            else:
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
    '''
        get info of rpm rl (with map reference informations)
    '''
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
                return
        else:
            return
    return (parse(row) for _, row in df.iterrows())

def get_rpm_info_fl(df: pd.DataFrame) -> List[friction_db_schema.RPM_fl]:
    '''
        get info of rpm fl (without map reference information)
    '''
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
    '''
        get info for geometry upload from map reference data
    '''
    def parse(row):
        if 'Expecting value:' in str(extract_Wayid(row['PossibleMatchingRoutes'], row['WayPoint'])):
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
                return
    return (parse(row) for _, row in df.iterrows())

def get_geometry_info_by_wayid(geos: List[str]) -> List[friction_db_schema.Geometry]:
    '''
        get info for geometry upload from individual way ids
        can be expended by lane and direction
    '''
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
