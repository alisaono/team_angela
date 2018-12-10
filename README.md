# 6.830 Fall 2018 Team Angela

by Alisa Ono, Yang Yan

## Types of Gestures

1. Clicks
2. Curve:
   * Curve
   * Or, the curve can be connected into a polygon.

## Regions

Regions are defined as a finite set of discrete points. In this case, it's all the points which belong to the state.

## Types of Gesture Interpretations

1. Point-and-click: A region is selected if the mouse clicks within a certain distance of a point in that region.
2. Stabbing: A region is selected if any of its points are within a certain distance of the gesture line.
3. Gesture-inclusive: The mouse gesture defines a polygon, and all regions with any of their points within that polygon are selected.
4. Gesture-exclusive: The mouse gesture defines a polygon, and all regions with all of their points within that polygon are selected.
5. Variations with convex-hull defined regions.