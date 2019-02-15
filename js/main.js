
let w = window.innerWidth
let h = window.innerHeight

var app = new PIXI.Application(w, h, {
    autoResize: true,
    resolution: devicePixelRatio,
    transparent: true
});

document.body.appendChild(app.view);

// Stop app
app.stop()

// Load stuff
PIXI.loader
    .add("https://onurkerimov.github.io/damla/assets/sheet.json")
    .load(main)

function main() {



    // create two render textures... these dynamic textures will be used to draw the scene into itself
    var renderTexture = PIXI.RenderTexture.create(
        app.screen.width,
        app.screen.height
    );
    var renderTexture2 = PIXI.RenderTexture.create(
        app.screen.width,
        app.screen.height
    );

    // create a new sprite that uses the render texture we created above
    var outputSprite = new PIXI.Sprite(renderTexture);

    // align the sprite
    outputSprite.x = w / 2
    outputSprite.y = h / 2
    outputSprite.anchor.set(0.5)

    // add to stage
    app.stage.addChild(outputSprite);

    var stuffContainer = new PIXI.Container();

    stuffContainer.x = 0;
    stuffContainer.y = 0;


    app.stage.addChild(stuffContainer);












    // Get a reference to the sprite sheet we've just loaded:
    let sheet = PIXI.loader.resources["https://onurkerimov.github.io/damla/assets/sheet.json"].spritesheet

    // Get frames
    let frames = []
    let num = 79 + 64
    for (var i = 79; i < num; i++) {
        let val = i < 100 ? '0' + i : i
        frames.push(PIXI.Texture.fromFrame('a_00' + val + '.jpg'));
    }

    /*/ Set sprite
    let bg1Sprite = new PIXI.Sprite(PIXI.Texture.fromFrame('all.jpg'))
    bg1Sprite.anchor.set(0.5)
    bg1Sprite.x = w/2
    bg1Sprite.y = h/2
    bg1Sprite.scale.set(0.7)
    app.stage.addChild(bg1Sprite)*/

    // Mask
    let bgcircle = new PIXI.Graphics()
    bgcircle.lineStyle(0)
    bgcircle.beginFill(0x000000)
    bgcircle.drawCircle(w / 2, h / 2, 230)
    bgcircle.endFill()
    // Set sprite
    let bgSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('all.jpg'))
    bgSprite.anchor.set(0.5)
    bgSprite.x = w / 2
    bgSprite.y = h / 2
    bgSprite.scale.set(0.2)
    bgSprite.mask = bgcircle

    stuffContainer.addChild(bgSprite)

    // Mask
    let circle = new PIXI.Graphics()
    circle.lineStyle(0)
    circle.beginFill(0x000000)
    circle.drawCircle(w / 2, h / 2, 180)
    circle.endFill()
    // Set sprite
    let animatedSprite = new PIXI.extras.AnimatedSprite(frames)
    animatedSprite.loop = false
    animatedSprite.interactive = true
    animatedSprite.animationSpeed = 0.5
    animatedSprite.anchor.set(0.5)
    animatedSprite.x = w / 2
    animatedSprite.y = h / 2
    animatedSprite.play()
    animatedSprite.mask = circle
    stuffContainer.addChild(animatedSprite)

    // Start app
    app.start()

    // Pointer helper
    let pointerOverFlag = false
    animatedSprite.on('pointerover', () => pointerOverFlag = true)
    animatedSprite.on('pointerout', () => pointerOverFlag = false)

    let playState = true
    let videoWidth = animatedSprite.width
    let videoLeft = animatedSprite.x - videoWidth / 2
    let lastMouseX = 0
    let lastMouseY = 0

    window.addEventListener('mousemove', e => {
        lastMouseX = e.clientX
        lastMouseY = e.clientY
    })


    let avoid = false

    setInterval(function () {
        avoid = false
    }, 35)

    app.ticker.add(() => {
        if (pointerOverFlag) {

            // Stop playing on first hover
            if (playState) {
                animatedSprite.stop()
                playState = false
            }

            // Set texture according to mouseX
            let cX = lastMouseX - videoLeft
            let i = Math.floor(64 * (1 - cX / videoWidth))
            if (i === 64) { i = 63 }

            let scaleMultiplier = Math.abs(cX / videoWidth - 0.5) + 0.22
            bgSprite.scale.set(scaleMultiplier)

            animatedSprite.setTexture(frames[i])

            matrixFn()
        }





        if (avoid === false) {
            avoid = true
            // swap the buffers ...
            var temp = renderTexture;
            renderTexture = renderTexture2;
            renderTexture2 = temp;

            // set the new texture
            outputSprite.texture = renderTexture;

            // twist this up!
            outputSprite.scale.set(1.12);
            //stuffContainer.rotation -= 0.01;

            // render the stage to the texture
            // the 'true' clears the texture before the content is rendered
            app.renderer.render(app.stage, renderTexture2, false);
        }





    })

    var filter = new PIXI.filters.ColorMatrixFilter();
    bgSprite.filters = [filter];

    function matrixFn() {

        var matrix = filter.matrix;

        let count = lastMouseX / videoWidth
        count = count * 12 + 227

        matrix[1] = Math.sin(count);
        matrix[2] = Math.cos(count / 2) * .3;
        matrix[3] = Math.sin(count / 5) * .3;
        matrix[4] = Math.cos(count / 7) * .3;
        matrix[5] = Math.sin(count / 11) * 2;
        matrix[6] = Math.cos(count / 13) * 2;
    }


}
