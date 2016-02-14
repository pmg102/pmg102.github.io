import png

# Read in a png
# Split into cells 8x8
# read 64 px in each cell
# Put into a hash table
# Report what cells and how many
# output cells from hashtable into sprite sbeet
# output map as grid of indices into sprite sheet

# (2400, 288, <map object at 0x00C37B50>, {
#	'gamma': 0.45455, 'bitdepth': 8, 'size': (2400, 288), 'greyscale': False, 'alpha': True, 'interlace': 0, 'planes': 4
# })

r = png.Reader('_mario-1-1.png')
image = r.read()

width = image[0]
height = image[1]
pixels = image[2]
metadata = image[3]

CELL_SIZE = 8
VALUES_PER_PIXEL = metadata['planes']

y = 0
sprites = []
grid = []

def process(cells_rows):
	global y
	row = []
	for x in range(0, len(cells_rows[0])):
		sprite = []
		for row_idx in range(0, CELL_SIZE):
			sprite.append([pixel[0] for pixel in cells_rows[row_idx][x]])
		try:
			sprite_idx = sprites.index(sprite)
		except ValueError:
			sprite_idx = len(sprites)
			sprites.append(sprite)
		row.append(sprite_idx)
	y = y + 1
	grid.append(row)

cells_rows = []
for row in pixels:
	if len(cells_rows) == CELL_SIZE:
		process(cells_rows)
		cells_rows = []
	cells_row = []
	cell_row = []
	pixel = []
	values_index = 0
	for value in row:
		if values_index % VALUES_PER_PIXEL == 0 and len(pixel):
			cell_row.append(pixel)
			pixel = []
			if len(cell_row) == CELL_SIZE:
				cells_row.append(cell_row)
				cell_row = []
		pixel.append(value)
		values_index = values_index + 1
	cells_rows.append(cells_row)
	cells_row = []

f = open('out/sprites.png', 'wb')      # binary mode is important
w = png.Writer(CELL_SIZE, CELL_SIZE * len(sprites), greyscale=True)
w.write(f, [row for sprite in sprites for row in sprite])
f.close()

f = open('out/grid.json', 'w')
f.write(str(grid))
f.close()

print('%s distinct sprites' % len(sprites))
