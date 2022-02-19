from defines import getCreds, makeApiCall
import sys

def getHashtagInfo( params ) :
	""" Get info on a hashtag
	
	API Endpoint:
		https://graph.facebook.com/{graph-api-version}/ig_hashtag_search?user_id={user-id}&q={hashtag-name}&fields={fields}
	Returns:
		object: data from the endpoint
	"""

	endpointParams = dict() # parameter to send to the endpoint
	endpointParams['user_id'] = params['instagram_account_id'] # user id making request
	endpointParams['q'] = params['hashtag_name'] # hashtag name
	endpointParams['fields'] = 'id,name' # fields to get back
	endpointParams['access_token'] = params['access_token'] # access token

	url = params['endpoint_base'] + 'ig_hashtag_search' # endpoint url

	return makeApiCall( url, endpointParams, params['debug'] ) # make the api call

def getHashtagMedia( params ) :
	""" Get posts for a hashtag
	
	API Endpoints:
		https://graph.facebook.com/{graph-api-version}/{ig-hashtag-id}/top_media?user_id={user-id}&fields={fields}
		https://graph.facebook.com/{graph-api-version}/{ig-hashtag-id}/recent_media?user_id={user-id}&fields={fields}
	Returns:
		object: data from the endpoint
	"""

	endpointParams = dict() # parameter to send to the endpoint
	endpointParams['user_id'] = params['instagram_account_id'] # user id making request
	endpointParams['fields'] = 'id,children,caption,media_type,media_url,permalink' # fields to get back
	endpointParams['access_token'] = params['access_token'] # access token

	url = params['endpoint_base'] + params['hashtag_id'] + '/' + params['type'] # endpoint url

	return makeApiCall( url, endpointParams, params['debug'] ) # make the api call

params = getCreds() # params for api call
params['hashtag_name'] = 'aeromodelismo' # add on the hashtag we want to search for
hashtagInfoResponse = getHashtagInfo( params ) # hit the api for some data!
params['hashtag_id'] = hashtagInfoResponse['json_data']['data'][0]['id']; # store hashtag id

# params['type'] = 'top_media' # set call to get top media for hashtag
# hashtagTopMediaResponse = getHashtagMedia( params ) # hit the api for some data!

# for post in hashtagTopMediaResponse['json_data']['data'] : # loop over posts

print("\n\n\n\t\t\t >>>>>>>>>>>>>>>>>>>> HASHTAG RECENT MEDIA <<<<<<<<<<<<<<<<<<<<\n") # section heading
params['type'] = 'recent_media' # set call to get recent media for hashtag
hashtagRecentMediaResponse = getHashtagMedia( params ) # hit the api for some data!

for post in hashtagRecentMediaResponse['json_data']['data'] : # loop over posts
    print(post)
        
    # id,children,caption,media_type,media_url,permalink
    # post['']