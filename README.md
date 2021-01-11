# Getting started with Geometry noob version

Just type what you need and is in the following list:

## Point
As easy as write point. 
- `point x y`

## Infinite line 
Just write down two points where the line pass through. 
- `line x1 y1 x2 y2`

## Segment
Both start and end points are needed.
- `segment x1 y1 x2 y2`

## Circle
Center of the circle and radio.
- `circle x y radio`

## Polygon
Write down at least 2 points (we know that its 3 or more, but that was easier for me to code).
- `poly x1 y1 x2 y2 ... xn yn`

## Colors for a better geometric look
Yes!, the color is to give it a cooler look to geometry you are viewing oppsite to the default boring black, the color can be in a HEX or RGB format.

### Example
- `poly 0 0 8 6 -8 6 #F3B823`
- `circle 5 10 4 #505A61`
- `circle -5 10 4 #505A61`
- `circle 5 10 2 RGB(6,124,200)`
- `circle -5 10 2 RGB(6,124,200)`
- `circle 5 10 1`
- `circle -5 10 1`
- `circle 0 10 11 blue`
- `seg 0 20 2 25 blue`
- `seg 0 20 -4 25 blue`
- `seg 0 20 -2 25 blue`

## For me
### `npm run deploy`

Makes the app ready to be uploaded (https://abrahamfourteen.github.io/Geometry-drawing-tool/).
