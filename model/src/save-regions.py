import rain
import configparser
from PIL import Image
import numpy
import json

config = configparser.ConfigParser()
config.read(rain.toRelPath('../cfg/cfg.ini'))

stateStr = config['default']['states']
states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO',
		  'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
stateDict = {'AK': 0, 'AL': 1, 'AR': 2, 'AZ': 3, 'CA': 4, 'CO': 5, 'CT': 6, 'DE': 7, 'FL': 8, 'GA': 9, 'HI': 10, 'IA': 11, 'ID': 12, 'IL': 13, 'IN': 14, 'KS': 15, 'KY': 16, 'LA': 17, 'MA': 18, 'MD': 19, 'ME': 20, 'MI': 21, 'MN': 22, 'MO': 23, 'MS': 24,
			 'MT': 25, 'NC': 26, 'ND': 27, 'NE': 28, 'NH': 29, 'NJ': 30, 'NM': 31, 'NV': 32, 'NY': 33, 'OH': 34, 'OK': 35, 'OR': 36, 'PA': 37, 'RI': 38, 'SC': 39, 'SD': 40, 'TN': 41, 'TX': 42, 'UT': 43, 'VA': 44, 'VT': 45, 'WA': 46, 'WI': 47, 'WV': 48, 'WY': 49}

for a in range(len(states)):
	im = Image.open(config['default']['screenshot-dir'] +
					states[a] + '.png').convert('RGB')
	hsvIm = im.convert('HSV')
	npRGB = numpy.array(im)
	npHSV = numpy.array(hsvIm)
	hue = npHSV[:, :, 0]
	lo, hi = 100, 140
	lo = int((lo * 255) / 360)
	hi = int((hi * 255) / 360)
	green = numpy.where((hue > lo) & (hue < hi))
	count = green[0].size

	npRGB[green] = [0, 0, 0]
	Image.fromarray(npRGB).save(
		config['default']['regions-img-dir'] + states[a] + '.png')
	print('pixels in ' + states[a] + ':', count)

	region = numpy.array(green).T
	region[:, [0, 1]] = region[:, [1, 0]]
	width, height = im.size
	region = region / numpy.array([width, height])[None, :]
	#print(region)
	with open(config['default']['regions-pt-dir'] + states[a] + '.json', 'w') as outfile:
		json.dump(region.tolist(), outfile)
