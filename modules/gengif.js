const { GifFrame, GifUtil, GifCodec} = require('gifwrap');
const jimp = require('jimp')
const path = require('path')
const imagepath = path.join(__dirname,"../", "1984.gif")
const cache = path.join(__dirname,'../', "cached")
const size = 498 / 2
const size2 = size * 2
const fs = require('fs')
exports.generate = async function(realtext,sendto){
    try {
        const puretext = realtext.replace(/[^a-zA-Z0-9 -]/g, '')
        const text = puretext.replace(/-/g, " ")
        const filelocation = path.join(cache, puretext + ".gif")
        if (fs.existsSync(filelocation)) {
            sendto.sendFile(filelocation)
        } else {
            GifUtil.read(imagepath).then(async function(gif) {
                const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
                const length = jimp.measureText(font, text)
                const offset = size - (length / 2)
                if (length < size2) {
                    try {
                        gif.frames.forEach(async function(frame) {
                            const j = GifUtil.copyAsJimp(jimp, frame)
                            j.print(font, offset, 0, text, size2)
                            frame.bitmap = j.bitmap
                            console.log('rendering')
                        })
                        const finished = await GifUtil.quantizeSorokin(gif.frames, 128)
                        console.log("Finished generating " + text)
                        await GifUtil.write(filelocation, gif.frames, gif)
                        sendto.sendFile(filelocation)
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    try {
                        const newfont = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)
                        const newlength = jimp.measureText(newfont, text)
                        const newoffset = size - (newlength / 2)
                        gif.frames.forEach(async function(frame) {
                            const j = GifUtil.copyAsJimp(jimp, frame)
                            j.print(newfont, newoffset, 0, text, size2)
                            frame.bitmap = j.bitmap
                            console.log("frame")
                        })
                        const finished = GifUtil.quantizeSorokin(gif.frames, 128)
                        console.log("Finished generating " + text)
                        await GifUtil.write(filelocation, gif.frames, gif)

                        sendto.sendFile(filelocation)
                    } catch (err) {
                        console.log(err)
                    }
                }

            })
        }
    } catch (err) {
        console.log(err)
    }
}