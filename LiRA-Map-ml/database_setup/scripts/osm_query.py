#created by Nina Oehlckers (s213535)
import requests

def get_ways(node_id: int):
    # query all ways that pass this node
    osm_url = f'https://api.openstreetmap.org/api/0.6/node/{node_id}/ways.json'
    response = requests.get(osm_url)
    response = response.json()
    way_ids = [i['id'] for i in response['elements']]
    return way_ids, response

def get_node_lat_lon(node_id: int):
    # query lat lon of node
    osm_url = f'https://api.openstreetmap.org/api/0.6/node/{node_id}.json'
    response = requests.get(osm_url)
    response = response.json()
    lat = response['elements'][0]['lat']
    lon = response['elements'][0]['lon']
    return (lon,lat)

def get_nodes_on_single_way(way_id: int):
    # get all nodes associated with one way
    osm_url = f'https://api.openstreetmap.org/api/0.6/way/{way_id}.json'
    response = requests.get(osm_url)
    response = response.json()
    node_ids = [i for i in response['elements'][0]['nodes']]
    name = response['elements'][0]['name'] if 'name' in response['elements'][0].keys() else ""
    return node_ids, name

