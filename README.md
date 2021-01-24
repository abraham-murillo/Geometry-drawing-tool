# Getting started with Geometry noob version

Just type what you need and is in the following list:

## Point
As easy as write point. 
- `p x y`
- `p x y color`
- `p x y text`
- `p x y color text`

## Infinite line 
Just write down two points where the line pass through. 
- `l x1 y1 x2 y2`
- `l x1 y1 x2 y2 color`
- `l x1 y1 x2 y2 text`
- `l x1 y1 x2 y2 color text`

## Segment
Both start and end points are needed.
- `s x1 y1 x2 y2`
- `s x1 y1 x2 y2 color`
- `s x1 y1 x2 y2 text`
- `s x1 y1 x2 y2 color text`

## Circle
Center of the circle and radio.
- `c x y radio`
- `c x y radio color`
- `c x y radio text`
- `c x y radio color text`

## Polygon
Write down at least 2 points (we know that its 3 or more, but that was easier for me to code).
- `poly x1 y1 x2 y2 ... xn yn`
- `poly x1 y1 x2 y2 ... xn yn color`
- `poly x1 y1 x2 y2 ... xn yn text`
- `poly x1 y1 x2 y2 ... xn yn color text`

## Text
Write text to know something special of that zone
- `text x y`
- `text x y color`

## Colors for a better geometric look
The color is to give it a cooler look to the geometry you are viewing opposite to the default boring black, the color can be in a HEX format too.

## Text for better understanding
Geometry is hard to understand with a bunch of objects, a little bit of text is always useful.

### Example
- `TheBird -5 40`
- `poly 0 0 8 6 -8 6 #F3B823`
- `c 5 10 4 #505A61`
- `c -5 10 4 #505A61`
- `c 5 10 2 #067cc8`
- `c -5 10 2 #067cc8`
- `c 5 10 1`
- `c -5 10 1`
- `c 0 10 11 blue`
- `s 0 20 2 25 blue`
- `s 0 20 -4 25 blue`
- `s 0 20 -2 25 blue`

## For me
### `npm run deploy`

Makes the app ready to be uploaded (https://abrahamfourteen.github.io/Geometry-drawing-tool/).
