BLOCK_WIDTH = 50
BLOCK_HEIGHT = 30
GRID_WIDTH = BLOCK_WIDTH / 2
GRID_HEIGHT = BLOCK_HEIGHT / 2

gBlocks = []
gCtx = null
gMouseDown = false

gCurrentImage = 1
gImageNames = ['face1.jpg', 'face2.jpg', 'face3.jpg', 'face4.jpg']
gImages = []
gImageLoadCount = 0

requestAnimFrame = 
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (callback, element) ->
    window.setTimeout(callback, 1000/60)

setCurrentFace = (index) ->
  $('#faces button').removeClass('current')
  $('#faces button[data-face-index=' + index + ']').addClass('current')
  gCurrentImage = index

$('#faces button').mousedown (e) ->
  setCurrentFace(parseInt($(this).attr('data-face-index')))


drawBlock = (x, y) ->
  gBlocks.push { ox: x, oy: y, x: x, y: y, c: gCurrentImage } if gMouseDown
  
update = ->
  requestAnimFrame update
  # Move the block to its position in the grid
  for block in gBlocks
    dx = block.x - (Math.round(block.x / GRID_WIDTH) * GRID_WIDTH)
    dy = block.y - (Math.round(block.y / GRID_HEIGHT) * GRID_HEIGHT)
    block.x -= dx / 20
    block.y -= dy / 20
  draw()

getRelativePosition = (e) ->
   if e.layerX
      x = e.layerX
      y = e.layerY
    else if e.offsetX
      x = e.offsetX
      y = e.offsetY
    { x: x, y: y }

draw = ->
  gCtx.fillStyle = '#000'
  gCtx.fillRect(0, 0, 400, 600)
  for block in gBlocks
    sx = 0
    sy = 0
    sWidth = BLOCK_WIDTH
    sHeight = BLOCK_HEIGHT
    x = (block.c * 2) + block.x - BLOCK_WIDTH / 2
    y = (block.c * 2) + block.y - BLOCK_HEIGHT / 2
    image = gImages[block.c]
    gCtx.drawImage(image, block.ox, block.oy, BLOCK_WIDTH, BLOCK_HEIGHT, x, y, BLOCK_WIDTH, BLOCK_HEIGHT)


loadedImage = ->
  gImageLoadCount += 1
  if gImageLoadCount >= gImageNames.length
    # Start animation
    requestAnimFrame update

main = ->
  doodleCanvas = document.getElementById('doodle')
  gCtx = doodleCanvas.getContext('2d')
  
  $('#doodle')
    .mousedown (e) ->
      gMouseDown = true
      e.preventDefault()
    .mousemove (e) ->
      pos = getRelativePosition e
      drawBlock pos.x, pos.y if gMouseDown
      e.preventDefault()
    .mouseup (e) ->
      gMouseDown = false
    .mouseleave (e) ->
      gMouseDown = false
  
  $(document).keypress (e) ->
    char = String.fromCharCode(e.which)
    if '1' <= char <= '4'
      setCurrentFace(parseInt(char) - 1)

  setCurrentFace 0

  # Load the image
  for imageName, index in gImageNames
    img = new Image()
    img.src = imageName
    img.onload = -> loadedImage()
    gImages.push(img)

main()
