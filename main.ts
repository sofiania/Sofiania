// ==============================================
// RYMD-SKYTTAREN
// Ett enkelt rymdskjutspel för MakeCode Arcade
//
// Kontroller:
//   Piltangenter / Joystick  → Flytta rymdskeppet
//   A-knapp                  → Skjut laser
//
// Mål: Skjut asteroider och samla poäng!
//      Tre träffar och spelet är slut.
// ==============================================

// ---------- Sprite-pixelbilder ----------

// Rymdskepp (spelaren) – blå/vit raket
const shipImage = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . 1 . . . . . . . .
    . . . . . . 1 1 1 . . . . . . .
    . . . . . 1 9 1 9 1 . . . . . .
    . . . . 1 9 9 1 9 9 1 . . . . .
    . . . . . 1 1 1 1 1 . . . . . .
    . . . . 1 1 . . . 1 1 . . . . .
    . . . 1 . . . . . . . 1 . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Laser (skott) – gul/vit prick
const laserImage = img`
    . 5 .
    5 1 5
    . 5 .
`

// Asteroid – grå/brun klump
const asteroidImage = img`
    . . . . . . . . . . . . . . . .
    . . . . 6 6 6 6 6 . . . . . . .
    . . . 6 7 7 7 7 7 6 . . . . . .
    . . 6 7 7 6 7 7 6 7 6 . . . . .
    . . 6 7 6 7 7 7 6 7 6 . . . . .
    . 6 7 7 7 7 6 7 7 7 7 6 . . . .
    . 6 7 6 7 7 7 7 6 7 7 6 . . . .
    . 6 7 7 7 6 7 7 7 7 6 6 . . . .
    . . 6 7 7 7 7 6 7 7 6 . . . . .
    . . . 6 7 6 7 7 7 6 . . . . . .
    . . . . 6 6 6 6 6 . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

// Explosion – orange/röd
const explosionImage = img`
    . . . . . . . . . . . . . . . .
    . . . . . 2 . . 2 . . . . . . .
    . . . . 2 4 2 2 4 2 . . . . . .
    . . . 2 4 5 4 4 5 4 2 . . . . .
    . . . . 2 4 5 5 4 2 . . . . . .
    . . 2 2 4 5 5 5 5 4 2 2 . . . .
    . . . . 2 4 5 5 4 2 . . . . . .
    . . . 2 4 5 4 4 5 4 2 . . . . .
    . . . . 2 4 2 2 4 2 . . . . . .
    . . . . . 2 . . 2 . . . . . . .
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
    Enemy: 2,
    Explosion: 3
}

// ---------- Globala variabler ----------
let spelare: Sprite
let asteroidHastighet = 40        // px/s, ökar med tid
let senasteAsteroid = 0           // ms sedan senaste asteroid
let asteroidInterval = 1800       // ms mellan asteroider (minskar med tid)
let kanSkjuta = true              // debounce för skjutning
let spelStartat = false

// ---------- Bakgrund ----------
function skapaBakgrund() {
    scene.setBackgroundColor(0)   // svart rymdbakgrund

    // Slumpmässiga stjärnor
    for (let i = 0; i < 60; i++) {
        const x = Math.randomRange(0, scene.screenWidth())
        const y = Math.randomRange(0, scene.screenHeight())
        const storlek = Math.randomRange(1, 3)
        const färg = storlek === 3 ? 1 : (storlek === 2 ? 5 : 15)
        scene.backgroundImage().setPixel(x, y, färg)
    }
}

// ---------- Skapa spelaren ----------
function skapaSpelare() {
    spelare = sprites.create(shipImage, SpriteKind.Player)
    spelare.setPosition(scene.screenWidth() / 2, scene.screenHeight() - 20)
    spelare.setStayInScreen(true)
    controller.moveSprite(spelare, 100, 100)
}

// ---------- Skjut laser ----------
function skjutLaser() {
    if (!kanSkjuta) return
    kanSkjuta = false

    const laser = sprites.createProjectileFromSprite(laserImage, spelare, 0, -180)
    laser.setKind(SpriteKind.Projectile)
    music.playTone(880, 50)

    pause(200)
    kanSkjuta = true
}

// ---------- Skapa asteroid ----------
function skapaAsteroid() {
    const asteroid = sprites.create(asteroidImage, SpriteKind.Enemy)
    const x = Math.randomRange(8, scene.screenWidth() - 8)
    asteroid.setPosition(x, -8)

    // Lite slumpmässig vinkel
    const vinkeln = Math.randomRange(-25, 25)
    const vx = Math.sin(vinkeln * Math.PI / 180) * asteroidHastighet
    asteroid.setVelocity(vx, asteroidHastighet)
    asteroid.setFlag(SpriteFlag.AutoDestroy, true)
}

// ---------- Explosion-effekt ----------
function visaExplosion(x: number, y: number) {
    const exp = sprites.create(explosionImage, SpriteKind.Explosion)
    exp.setPosition(x, y)
    exp.setFlag(SpriteFlag.Ghost, true)
    music.playTone(220, 100)
    pause(200)
    exp.destroy()
}

// ---------- Kollisioner: Laser träffar asteroid ----------
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (laser, asteroid) {
    const px = asteroid.x
    const py = asteroid.y
    laser.destroy()
    asteroid.destroy()
    info.changeScoreBy(10)
    visaExplosion(px, py)
})

// ---------- Kollisioner: Spelare träffar asteroid ----------
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (ship, asteroid) {
    const px = asteroid.x
    const py = asteroid.y
    asteroid.destroy()
    info.changeLifeBy(-1)
    scene.cameraShake(4, 300)
    visaExplosion(px, py)

    if (info.life() <= 0) {
        game.over(false)
    }
})

// ---------- Kontroller ----------
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (spielStartat) skjutLaser()
})

controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (spielStartat) skjutLaser()
})

// ---------- Spelloop – svårighetsgrad ökar med tid ----------
game.onUpdateInterval(500, function () {
    if (!spielStartat) return

    const tid = game.runtime()

    // Snabbare asteroider ju längre man spelar
    asteroidHastighet = 40 + Math.floor(tid / 5000) * 5

    // Tätare asteroider med tid (minimum 600ms)
    asteroidInterval = Math.max(600, 1800 - Math.floor(tid / 8000) * 150)

    // Skapa nya asteroider
    if (tid - senasteAsteroid > asteroidInterval) {
        skapaAsteroid()
        senasteAsteroid = tid

        // Chans att skapa dubbel-asteroid på svåra nivåer
        if (tid > 20000 && Math.percentChance(30)) {
            pause(100)
            skapaAsteroid()
        }
    }
})

// ---------- Startskärm ----------
function visaStartskärm() {
    game.splash("RYMD-SKYTTAREN", "Tryck A för att börja!")
    spielStartat = true
    senasteAsteroid = game.runtime()
}

// ---------- Starta spelet ----------
function startaSpelet() {
    info.setScore(0)
    info.setLife(3)
    skapaBakgrund()
    skapaSpelare()
    visaStartskärm()
}

startaSpelet()
