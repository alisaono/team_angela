import selenium
from selenium import webdriver
import rain
import configparser
from PIL import Image
from io import BytesIO

config = configparser.ConfigParser()
config.read(rain.toRelPath('../cfg/cfg.ini'))

stateStr = config['default']['states']
states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO',
		  'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
stateDict = {'AK': 0, 'AL': 1, 'AR': 2, 'AZ': 3, 'CA': 4, 'CO': 5, 'CT': 6, 'DE': 7, 'FL': 8, 'GA': 9, 'HI': 10, 'IA': 11, 'ID': 12, 'IL': 13, 'IN': 14, 'KS': 15, 'KY': 16, 'LA': 17, 'MA': 18, 'MD': 19, 'ME': 20, 'MI': 21, 'MN': 22, 'MO': 23, 'MS': 24,
			 'MT': 25, 'NC': 26, 'ND': 27, 'NE': 28, 'NH': 29, 'NJ': 30, 'NM': 31, 'NV': 32, 'NY': 33, 'OH': 34, 'OK': 35, 'OR': 36, 'PA': 37, 'RI': 38, 'SC': 39, 'SD': 40, 'TN': 41, 'TX': 42, 'UT': 43, 'VA': 44, 'VT': 45, 'WA': 46, 'WI': 47, 'WV': 48, 'WY': 49}

chromeOptions = webdriver.ChromeOptions()
chromeOptions.add_argument('--start-maximized')
chromeOptions.add_argument('--disable-dev-shm-usage')
chromeOptions.add_argument('--disable-gpu')
chromeOptions.add_argument('--no-sandbox')
chromeOptions.add_argument('--mute-audio')
chromeOptions.add_argument('--log-level=3')
chromeOptions.add_argument('--silent')
driver = webdriver.Chrome(rain.toRelPath(
	config['default']['chromedriver']), chrome_options=chromeOptions)
driver.implicitly_wait(0)

screenScale = float(config['default']['screen-scale'])

for a in range(len(states)):
	driver.get(config['default']['state-hl-url'] + states[a])

	element = driver.find_element_by_id('map')
	location = element.location
	size = element.size
	png = driver.get_screenshot_as_png()
	im = Image.open(BytesIO(png))
	left = location['x']
	top = location['y']
	right = location['x'] + size['width'] * screenScale
	bottom = location['y'] + size['height'] * screenScale
	im = im.crop((left, top, right, bottom))
	im.save(config['default']['screenshot-dir'] + states[a] + '.png')

driver.close()
