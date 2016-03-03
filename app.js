var fs = require('fs');
var youtubedl = require('youtube-dl');
var ffmpeg = require('ffmpeg');
var waveform = require('waveform');

var url = 'https://www.youtube.com/watch?v=';
// 'iCmHG46gY9k'
var videoId = process.argv.slice(2)[0];

url = url + videoId;

var video = youtubedl(url, ['--format=18'], {
    cwd: __dirname
}).on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.size);
});

video.pipe(fs.createWriteStream(videoId + '.mp4'));

video.on('end', getWave);

function getAudio () {
    new ffmpeg(__dirname + '/' + videoId + '.mp4', function (err, video) {
        if (!err) {
            console.log(video);
            console.log('The video is ready to be processed');
            video.fnExtractSoundToMP3(__dirname + '/' + videoId + '.mp3', getWave);
        } else {
            console.log('Error: ' + err);
        }
    });
}

function getWave (err, video) {
    if (err) {
        return console.log(err);
    }

    waveform(__dirname + '/' + videoId + '.mp4', {
      // options
      'scan': false,                  // whether to do a pass to detect duration

      // transcoding options
      transcode: videoId + ".mp3",    // path to output-file, or - for stdout as a Buffer
      bitrate: 320,                   // audio bitrate in kbps
      format: "mp3",                 // e.g. mp3, ogg, mp4
      codec: "mp3",                  // e.g. mp3, vorbis, flac, aac
      mime: "mimetype",               // e.g. audio/vorbis
      // waveform.js options
      waveformjs: videoId + ".json",  // path to output-file, or - for stdout as a Buffer
      'wjs-width': 800,               // width in samples
      'wjs-precision': 4,             // how many digits of precision
      'wjs-plain': false,             // exclude metadata in output JSON (default off)

      // png options
      png: videoId + ".png",          // path to output-file, or - for stdout as a Buffer
      'png-width': 500,               // width of the image
      'png-height': 120,               // height of the image
      'png-color-bg': '00000000',     // bg color, rrggbbaa
      'png-color-center': '000000ff', // gradient center color, rrggbbaa
      'png-color-outer': '000000ff',  // gradient outer color, rrggbbaa
    }, function(err, buf) {
      // done
      console.log(err);
    });
}
