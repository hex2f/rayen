/* global Tracer testmap */
let t = new Tracer(document.getElementById('canvas'), testmap)
t.load()

let keys = {
  up: false,
  down: false,
  left: false,
  right: false
}

window.onkeydown = (e) => {
  switch (e.which) {
    case 38:
      keys.up = true
      break
    case 40:
      keys.down = true
      break
    case 37:
      keys.left = true
      break
    case 39:
      keys.right = true
      break
    default:
      break
  }
}

window.onkeyup = (e) => {
  switch (e.which) {
    case 38:
      keys.up = false
      break
    case 40:
      keys.down = false
      break
    case 37:
      keys.left = false
      break
    case 39:
      keys.right = false
      break
    default:
      break
  }
}

setInterval(() => {
  if (keys.left) { t.rotation -= 1 }
  if (keys.right) { t.rotation += 1 }
  let dir = [Math.sin(t.rotation % 360 * (Math.PI / 180)), Math.cos(t.rotation % 360 * (Math.PI / 180))]
  if (keys.up) { t.origin[0] += dir[0]; t.origin[1] += dir[1] }
  if (keys.down) { t.origin[0] -= dir[0]; t.origin[1] -= dir[1] }
  t.trace()
}, 1000 / 30)
