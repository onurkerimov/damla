let w = window.innerWidth
let h = window.innerHeight

var app = new PIXI.Application(w, h, {
    autoResize: true,
    resolution: devicePixelRatio,
    transparent: true
});

document.body.appendChild(app.view);

// Listen for a click/tap event to start playing the video
// this is useful for some mobile platforms. For example:
// ios9 and under cannot render videos in PIXI without a
// polyfill - https://github.com/bfred-it/iphone-inline-video
// ios10 and above require a click/tap event to render videos
// that contain audio in PIXI. Videos with no audio track do
// not have this requirement
window.addEventListener('mousedown', playVideo);

let videoSource
let duration


function playVideo() {

    // create a video texture from a path
    var texture = PIXI.Texture.fromVideo('./assets/video3.mp4');
    texture.baseTexture.autoPlay = false
    videoSource = texture.baseTexture.source

    videoSource.onseeked = function () {
        texture.update()
    };

    // create a new Sprite using the video texture (yes it's that easy)
    var videoSprite = new PIXI.Sprite(texture);
    videoSprite.width = 640;
    videoSprite.height = 360;
    videoSprite.anchor.set(0.5)
    videoSprite.x = w / 2
    videoSprite.y = h / 2


    app.stage.addChild(videoSprite);
}

window.addEventListener('mousemove', (e) => {
    if (videoSource !== undefined) {

        if (duration) {
            let time = (e.clientX / w) * duration
            videoSource.currentTime = time
        } else {
            duration = videoSource.duration
        }

    }

})

