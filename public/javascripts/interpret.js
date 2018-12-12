let ptThresh = 0.0005

//gesture analysis functions return a list [a, b] where a is time taken for query in ms and b is the set of states selected
function stabbingGesture(gesture) {
	let result = new Set([])
	for (let a = 0; a < 50; a++) {
		for (let b = 0; b < regionPts[a].length; b++) {
			for (let c = 0; c < gesture.length - 1; c++) {
				//test if regionPts[a][b] is close enough to line segment gesture[c], gesture[c + 1]
				let dist = distToSegment(regionPts[a][b], gesture[c], gesture[c + 1])
				if (dist < ptThresh) {
					result.add(stateCodes[a])
				}
			}
		}
	}
	return [gesture[gesture.length - 1][2], Array.from(result)]
}

function wrappingInclusiveGesture(gesture) {
	let result = new Set([])
	let gesturePts = []

	//compute gesturePts with .x and .y of gesture points to pass to convex hull function
	for (let a = 0; a < gesture.length; a++) {
		gesturePts.push({ x: gesture[a][0], y: gesture[a][1] })
	}

	for (let a = 0; a < 50; a++) {
		for (let b = 0; b < regionPts[a].length; b++) {
			if (ptInPoly({ x: regionPts[a][b][0], y: regionPts[a][b][1] }, gesturePts)) {
				result.add(stateCodes[a])
				break
			}
		}
	}
	return [gesture[gesture.length - 1][2], Array.from(result)]
}

function wrappingExclusiveGesture(gesture) {
	let result = new Set([])
	let gesturePts = []

	//compute gesturePts with .x and .y of gesture points to pass to convex hull function
	for (let a = 0; a < gesture.length; a++) {
		gesturePts.push({ x: gesture[a][0], y: gesture[a][1] })
	}

	for (let a = 0; a < 50; a++) {
		let shouldAdd = true
		for (let b = 0; b < regionPts[a].length; b++) {
			if (!ptInPoly({ x: regionPts[a][b][0], y: regionPts[a][b][1] }, gesturePts)) {
				shouldAdd = false
				break
			}
		}
		if (shouldAdd) {
			result.add(stateCodes[a])
		}
	}
	return [gesture[gesture.length - 1][2], Array.from(result)]
}

function hullInclusiveGesture(gesture) {
	let result = new Set([])
	let gesturePts = []

	//compute gesturePts with .x and .y of gesture points to pass to convex hull function
	for (let a = 0; a < gesture.length; a++) {
		gesturePts.push({ x: gesture[a][0], y: gesture[a][1] })
	}

	for (let a = 0; a < 50; a++) {
		//add state if state convex hull @regionHulls[a] intersects gesture polygon at gesturePts
		let l = regionHulls[a].length
		regionHulls[a].push(regionHulls[a][0])
		for (let b = 0; b < l; b++) {
			for (let c = 0; c <= 1000; c++) {
				if (ptInPoly({
					x: regionHulls[a][b].x + (regionHulls[a][b + 1].x - regionHulls[a][b].x) * c / 1000,
					y: regionHulls[a][b].y + (regionHulls[a][b + 1].y - regionHulls[a][b].y) * c / 1000
				}, gesturePts)) {
					result.add(stateCodes[a])
					break
				}
			}
			if (result.has(stateCodes[a])) {
				break
			}
		}
	}
	return [gesture[gesture.length - 1][2], Array.from(result)]
}
