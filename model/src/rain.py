import os
import selenium
import time
import hmac, base64, struct, hashlib, time

def toRelPath(origPath):
	"""Converts path to path relative to current script

	origPath:	path to convert
	"""
	try:
		if not hasattr(toRelPath, '__location__'):
			toRelPath.__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
		return os.path.join(toRelPath.__location__, origPath)
	except NameError:
		return origPath
	
def getMBUsage():
	process = psutil.Process(os.getpid())
	return process.memory_info().rss / 1e6

def setCUDAVisible(devices):
	"""
	0: 1080Ti, 1: 940MX
	"""
	os.environ['CUDA_VISIBLE_DEVICES'] = devices
	
def seleniumFullScroll (driver, pausetime=1, limit=0):
	last_height = driver.execute_script('return document.body.scrollHeight')
	times = 0
	while limit == 0 or times < limit:
		driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
		time.sleep(pausetime)
		new_height = driver.execute_script('return document.body.scrollHeight')
		if new_height == last_height:
			break
		last_height = new_height
		times += 1

def getHTOPToken(secret, intervals_no):
    key = base64.b32decode(secret, True)
    msg = struct.pack(">Q", intervals_no)
    h = hmac.new(key, msg, hashlib.sha1).digest()
    o = ord(h[19]) & 15
    h = (struct.unpack(">I", h[o:o+4])[0] & 0x7fffffff) % 1000000
    return h

def getTOTPToken(secret):
    return getHTOPToken(secret, intervals_no=int(time.time())//30)