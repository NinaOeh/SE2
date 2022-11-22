import requests
import json

def get_ways(node_id: int):
    # query all ways that pass this node
    osm_url = f'https://api.openstreetmap.org/api/0.6/node/{node_id}/ways.json'
    response = requests.get(osm_url)
    #print(response.text)
    response = response.json()
    way_ids = [i['id'] for i in response['elements']]
    return way_ids, response