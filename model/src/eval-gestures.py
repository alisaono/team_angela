# don't use this script i guess

import rain
import configparser
from PIL import Image
import numpy
import json
import os

config = configparser.ConfigParser()
config.read(rain.toRelPath('../cfg/cfg.ini'))

stateStr = config['default']['states']
states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO',
		  'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
stateDict = {'AK': 0, 'AL': 1, 'AR': 2, 'AZ': 3, 'CA': 4, 'CO': 5, 'CT': 6, 'DE': 7, 'FL': 8, 'GA': 9, 'HI': 10, 'IA': 11, 'ID': 12, 'IL': 13, 'IN': 14, 'KS': 15, 'KY': 16, 'LA': 17, 'MA': 18, 'MD': 19, 'ME': 20, 'MI': 21, 'MN': 22, 'MO': 23, 'MS': 24,
			 'MT': 25, 'NC': 26, 'ND': 27, 'NE': 28, 'NH': 29, 'NJ': 30, 'NM': 31, 'NV': 32, 'NY': 33, 'OH': 34, 'OK': 35, 'OR': 36, 'PA': 37, 'RI': 38, 'SC': 39, 'SD': 40, 'TN': 41, 'TX': 42, 'UT': 43, 'VA': 44, 'VT': 45, 'WA': 46, 'WI': 47, 'WV': 48, 'WY': 49}

regions = []
for a in range(len(states)):
	with open(config['default']['regions-pt-dir'] + states[a] + '.json') as f:
		regions.append(json.load(f))

granularity = float(config['default']['pt-granularity'])

gestureFiles = os.listdir(config['default']['gestures'])
print(gestureFiles)
for a in range(len(gestureFiles)):
	with open(config['default']['gestures'] + gestureFiles[a]) as f:
		gestures = json.load(f)
	for b in range(len(gestures)):
		target = gestures[b][0][0]
		gesture = gestures[b][0][1]
		gType = gestureFiles[a].split('.')[0]

		stabbing = []
		inclusive = []
		exclusive = []

		for c in range(len(regions)):
			#for each point, regions[c] contains the points in the region, gesture contains the points making up the gesture
			for d in range(len(regions[c])):
				pt = regions[c][d]
				for e in range(len(gesture) - 1):
					line = [gesture[e], gesture[e + 1]]

					#check if pt is sufficiently close to line
					dist = abs((line[1][1] - line[0][1])*pt[0] - (line[1][0] - line[0][0])*pt[1] + line[1][0]*line[0][1]-line[1][1]*line[0][0])/max(((line[0][1] - line[1][1])**2 + (line[0][0] - line[1][0])**2)**0.5, 0.001)
					if dist < granularity:
						stabbing.append(states[c])

		print(gType, target, len(gesture))
		print('stabbing:', stabbing)
		