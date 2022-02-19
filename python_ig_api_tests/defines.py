import requests
import json

def getCreds() :
	""" Get creds required for use in the applications
	
	Returns:
		dictonary: credentials needed globally
	"""

	creds = dict()
	creds['access_token'] = open('private/access_token.txt', 'r').read()
	creds['client_id'] = '340051487987229' # client id from facebook app IG Graph API Test
	creds['client_secret'] = open('private/client_secret.txt', 'r').read()
	creds['graph_domain'] = 'https://graph.facebook.com/'
	creds['graph_version'] = 'v12.0' # version of the api we are hitting
	creds['endpoint_base'] = creds['graph_domain'] + creds['graph_version'] + '/' # base endpoint with domain and version
	creds['debug'] = 'no'
	creds['page_id'] = '608943716832615' # users page id
	creds['instagram_account_id'] = '17841451084596082' # users instagram account id
	creds['ig_username'] = 'rcplanes.global' # ig username

	return creds

def makeApiCall( url, endpointParams, type ):
	""" Request data from endpoint with params
	
	Args:
		url: string of the url endpoint to make request from
		endpointParams: dictionary keyed by the names of the url parameters
	Returns:
		object: data from the endpoint
	"""

	if type == 'POST':
		data = requests.post( url, endpointParams )
	else:
		data = requests.get( url, endpointParams )


	response = dict() # hold response info
	response['url'] = url # url we are hitting
	response['endpoint_params'] = endpointParams #parameters for the endpoint
	response['endpoint_params_pretty'] = json.dumps( endpointParams, indent = 4 ) # pretty print for cli
	response['json_data'] = json.loads( data.content ) # response data from the api
	response['json_data_pretty'] = json.dumps( response['json_data'], indent = 4 ) # pretty print for cli

	return response # get and return content