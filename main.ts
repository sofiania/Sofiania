// ==============================================
// RÄDDA HAVET
// Ett hållbarhetsspel för MakeCode Arcade
//
// Kontroller:
//   Piltangenter / Joystick  → Styr båten
//   A-knapp                  → Kasta nät
//
// Mål: Fånga plastskräp med nätet och rensa havet!
//      Undvik oljeflackar – tre träffar och spelet är slut.
//
// Fakta: Över 8 miljoner ton plast hamnar i
//        världens hav varje år.
// ==============================================

// ---------- Sprite-pixelbilder ----------

// Båt (spelaren)
const båtBild = img`
    . . . . . . . . . . . . . . . .
    . . . . . . 8 . . . . . . . . .
    . . . . . . 8 . . . . . . . . .
    . . . . . 8 8 8 . . . . . . . .
    . . . . 8 1 1 1 8 . . . . . . .
    . . 6 6 6 1 1 1 6 6 6 . . . . .
    . 6 6 6 6 6 6 6 6 6 6 6 . . . .
    . . 9 9 . . 9 9 . . 9 9 . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Nät (projektil)
const nätBild = img`
    1 . 1
    . 1 .
    1 . 1
`

// Plastflaska
const flaskaBild = img`
    . . . . . . . . . . . . . . . .
    . . . . . 8 8 . . . . . . . . .
    . . . . 8 1 1 8 . . . . . . . .
    . . . . . 8 8 . . . . . . . . .
    . . . . 8 1 1 8 . . . . . . . .
    . . . 8 1 1 1 1 8 . . . . . . .
    . . . 8 1 1 1 1 8 . . . . . . .
    . . . 8 1 1 1 1 8 . . . . . . .
    . . . 8 1 1 1 1 8 . . . . . . .
    . . . . 8 8 8 8 . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Plastpåse
const påseBild = img`
    . . . . . . . . . . . . . . . .
    . . . . . 1 1 1 . . . . . . . .
    . . . . 1 . . . 1 . . . . . . .
    . . . 1 . 1 . 1 . 1 . . . . . .
    . . . 1 1 . 1 . 1 1 . . . . . .
    . . . . 1 1 1 1 1 . . . . . . .
    . . . . . 1 1 1 . . . . . . . .
    . . . . . . 1 . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Oljeflack (fiende/fara)
const oljeBild = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . 12 12 12 12 . . . . . .
    . . . 12 2 2 2 2 12 12 . . . .
    . . 12 2 2 15 2 2 2 12 . . . .
    . . 12 2 15 2 2 15 2 12 . . . .
    . . . 12 2 2 2 2 12 . . . . . .
    . . . . 12 12 12 12 . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Glad fisk (bonus)
const fiskBild = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . 9 9 . . . . . . . . . .
    . . . 9 9 9 9 9 9 . . . . . . .
    . . 9 9 9 1 9 9 9 9 9 . . . . .
    . . 9 9 9 9 9 9 9 9 9 . . . . .
    . . . 9 9 9 9 9 9 . . . . . . .
    . . . . 9 9 . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// ---------- Sprite-typer ----------
const SpriteKind = {
    Player: 0,
    Projectile: 1,
    Skräp: 2,      // plastskräp att samla
    Fara: 3,       // oljeflackar att undvika
    Bonus: 4       // fiskar ger extra poäng
}

// ---------- Globala variabler ----------
let båt: Sprite
let skräpHastighet = 35
let senasteSkräp = 0
let skräpInterval = 1600
let senasteFisk = 0
let fiskInterval = 6000
let kanKastaÄt = true
let spelStartat = false
let poängMål = 100    // mål för att "rädda havet"

// ---------- Vattenbakgrund ----------
function skapaBakgrund() {
    // Djupblå havsbakgrund
    scene.setBackgroundColor(9)

    const bg = scene.backgroundImage()
    const w = scene.screenWidth()
    const h = scene.screenHeight()

    // Vågor och vatteneffekt
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            // Djupare vatten längre ner
            if (y > h * 0.7 && Math.percentChance(3)) {
                bg.setPixel(x, y, 8)   // mörkare blå
            } else if (Math.percentChance(1)) {
                bg.setPixel(x, y, 1)   // ljusa reflektioner
            }
        }
    }

    // Våglinjer
    for (let i = 0; i < 5; i++) {
        const y = Math.randomRange(5, h - 10)
        for (let x = 0; x < w - 4; x += 6) {
            bg.setPixel(x, y, 6)
            bg.setPixel(x + 1, y - 1, 6)
            bg.setPixel(x + 2, y, 6)
            bg.setPixel(x + 3, y + 1, 6)
        }
    }

    // Sol i övre hörnet
    for (let dx = -4; dx <= 4; dx++) {
        for (let dy = -4; dy <= 4; dy++) {
            if (dx * dx + dy * dy <= 16) {
                bg.setPixel(10 + dx, 10 + dy, 5)   // gul sol
            }
        }
    }
}

// ---------- Skapa spelaren ----------
function skapaBåt() {
    båt = sprites.create(båtBild, SpriteKind.Player)
    båt.setPosition(scene.screenWidth() / 2, scene.screenHeight() - 15)
    båt.setStayInScreen(true)
    controller.moveSprite(båt, 110, 0)   // bara horisontell rörelse
    båt.vy = 0
}

// ---------- Kasta nät ----------
function kastaNät() {
    if (!kanKastaÄt) return
    kanKastaÄt = false

    const nät = sprites.createProjectileFromSprite(nätBild, båt, 0, -160)
    nät.setKind(SpriteKind.Projectile)
    music.playTone(523, 80)

    pause(250)
    kanKastaÄt = true
}

// ---------- Skapa plastskräp ----------
function skapaSkräp() {
    // Slumpa mellan flaska och påse
    const bildVal = Math.percentChance(50) ? flaskaBild : påseBild
    const skräp = sprites.create(bildVal, SpriteKind.Skräp)
    const x = Math.randomRange(8, scene.screenWidth() - 8)
    skräp.setPosition(x, -8)
    skräp.vy = skräpHastighet
    skräp.vx = Math.randomRange(-15, 15)
    skräp.setFlag(SpriteFlag.AutoDestroy, true)
}

// ---------- Skapa oljeflack ----------
function skapaOljeflack() {
    const olja = sprites.create(oljeBild, SpriteKind.Fara)
    const x = Math.randomRange(8, scene.screenWidth() - 8)
    olja.setPosition(x, -8)
    olja.vy = skräpHastighet * 0.7
    olja.setFlag(SpriteFlag.AutoDestroy, true)
}

// ---------- Skapa fisk (bonus) ----------
function skapaFisk() {
    const fisk = sprites.create(fiskBild, SpriteKind.Bonus)
    // Fiskar simmar in från sidan
    const frånVänster = Math.percentChance(50)
    fisk.setPosition(frånVänster ? -8 : scene.screenWidth() + 8, Math.randomRange(20, scene.screenHeight() - 20))
    fisk.vx = frånVänster ? 40 : -40
    fisk.setFlag(SpriteFlag.AutoDestroy, true)
}

// ---------- Nät fångar plastskräp ----------
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Skräp, function (nät, skräp) {
    nät.destroy()
    skräp.destroy()
    info.changeScoreBy(10)
    music.playTone(659, 100)

    // Kontrollera om spelaren nått målet
    if (info.score() >= poängMål) {
        game.over(true)
    }
})

// ---------- Båt plockar upp skräp (direkt) ----------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Skräp, function (båtSprite, skräp) {
    skräp.destroy()
    info.changeScoreBy(5)
    music.playTone(523, 80)

    if (info.score() >= poängMål) {
        game.over(true)
    }
})

// ---------- Båt träffar oljeflack ----------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fara, function (båtSprite, olja) {
    olja.destroy()
    info.changeLifeBy(-1)
    scene.cameraShake(3, 300)
    music.playTone(196, 200)

    if (info.life() <= 0) {
        game.over(false)
    }
})

// ---------- Nät träffar oljeflack ----------
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Fara, function (nät, olja) {
    // Nätet kan inte fånga olja – låt oljan fortsätta
    nät.destroy()
    music.playTone(349, 80)
})

// ---------- Båt möter fisk (bonus!) ----------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bonus, function (båtSprite, fisk) {
    fisk.destroy()
    info.changeScoreBy(20)
    music.playTone(784, 150)
    game.showLongText("Glad fisk! +20p\nRent hav = fler fiskar!", DialogLayout.Center)
})

// ---------- Kontroller ----------
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (spelStartat) kastaNät()
})

controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (spelStartat) kastaNät()
})

// ---------- Spelloop ----------
game.onUpdateInterval(500, function () {
    if (!spelStartat) return

    const tid = game.runtime()

    // Svårighetsgrad ökar med tid
    skräpHastighet = 35 + Math.floor(tid / 8000) * 4
    skräpInterval = Math.max(600, 1600 - Math.floor(tid / 10000) * 150)

    // Skapa skräp
    if (tid - senasteSkräp > skräpInterval) {
        skapaSkräp()
        senasteSkräp = tid

        // Oljeflack var 3:e skräpvåg
        if (Math.percentChance(35)) {
            skapaOljeflack()
        }
    }

    // Skapa bonus-fisk ibland
    if (tid - senasteFisk > fiskInterval) {
        if (Math.percentChance(60)) {
            skapaFisk()
        }
        senasteFisk = tid
    }
})

// ---------- Starta spelet ----------
function startaSpelet() {
    info.setScore(0)
    info.setLife(3)
    skapaBakgrund()
    skapaBåt()

    // Startmeddelande
    game.showLongText(
        "RÄDDA HAVET!\n\nFånga plastskräp med nätet (A).\nUndvik svarta oljeflackar.\nSamla " + poängMål + " poäng för att rädda havet!\n\nÖver 8 miljoner ton plast\nhamnar i haven varje år.",
        DialogLayout.Center
    )

    spelStartat = true
    senasteSkräp = game.runtime()
    senasteFisk = game.runtime()
}

startaSpelet()
