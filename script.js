window.onload = () => {
  // Получаем канвас
  const canv = document.querySelector(".canvas")
  canv.width = 288
  canv.height = 512
  const ctx = canv.getContext("2d")

  // Получаем переменные аудио файлов
  let fly = new Audio()
  let scoreSound = new Audio()

  // Указываем путь до аудио файлов
  fly.src = "/src/sound/fly.mp3"
  scoreSound.src = "/src/sound/score.mp3"

  // Получаем переменные объектов
  const bird = new Image()
  const pipeUp = new Image()
  const pipeDown = new Image()
  const foreGround = new Image()
  const backGround = new Image()

  // Указываем путь до изображений
  bird.src = "./src/img/bird.png"
  pipeUp.src = "/src/img/pipeUp.png"
  pipeDown.src = "/src/img/pipeBottom.png"
  foreGround.src = "/src/img/fg.png"
  backGround.src = "/src/img/bg.png"

  // Создаем переменные, необходимые для самой игры
  let score = 0
  let posX = 20
  let posY = 20
  let birdJump = 50
  let pipeGap = bird.height + 100
  let pipeArr = [{ x: canv.width, y: 0 }]

  // Функция для отрисовки игры
  function gameCycle() {
    // Отрисовка объектов
    ctx.clearRect(0, 0, canv.width, canv.height)
    ctx.drawImage(backGround, 0, 0)
    ctx.drawImage(bird, posX, posY)

    for (let i = 0; i < pipeArr.length; i++) {
      // Отрисовка труб
      ctx.drawImage(pipeUp, pipeArr[i].x, pipeArr[i].y)
      ctx.drawImage(
        pipeDown,
        pipeArr[i].x,
        pipeArr[i].y + pipeUp.height + pipeGap
      )

      pipeArr[i].x -= 1

      // Когда возникает новая труба
      if (pipeArr[i].x == 130) {
        pipeArr.push({
          x: canv.width,
          y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
        })
      }

      // Проверка столкновения птицы с трубой и с землей
      if (
        (posX + bird.width >= pipeArr[i].x &&
          posX <= pipeArr[i].x + pipeUp.width &&
          (posY <= pipeArr[i].y + pipeUp.height ||
            posY + bird.height >= pipeArr[i].y + pipeUp.height + pipeGap)) ||
        posY + bird.height >= canv.height - foreGround.height
      ) {
        location.reload()
      }

      // Добавление очков
      if (pipeArr[i].x == posX) {
        score++
        scoreSound.play()
      }
    }

    ctx.drawImage(foreGround, 0, canv.height - foreGround.height)
    ctx.textAlign = "center"
    ctx.font = "24px Impact"
    ctx.fillStyle = "#000"
    ctx.fillText("Счет: " + score, canv.width / 2, 60)

    requestAnimationFrame(gameCycle)
    posY++
  }

  // Прыжок при нажатии пробела
  document.addEventListener("click", () => {
    if (posY - bird.height > 10) {
      posY -= birdJump
      fly.play()
    }
  })
  document.addEventListener("keydown", (e) => {
    if (e.code == "Space" && posY - bird.height > 10) {
      posY -= birdJump
      fly.play()
    }
  })

  backGround.onload = gameCycle
}