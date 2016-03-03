var fs = require('fs');
var youtubedl = require('youtube-dl');
var ffmpeg = require('ffmpeg');
var waveform = require('waveform');

var url = 'https://www.youtube.com/watch?v=';
// 'iCmHG46gY9k'
var videoId = process.argv.slice(2)[0];
path = __dirname + '/downloads';
url = url + videoId;

var video = youtubedl(url, ['--format=18'], {
    cwd: path
}).on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.size);
});

path = path + '/';

video.pipe(fs.createWriteStream(path + videoId + '.mp4'));

video.on('end', getWave);

function getWave (err, video) {
    if (err) {
        return console.log(err);
    }

    console.log('downloaded');

    waveform(path + videoId + '.mp4', {
      // options
      'scan': false,                  // whether to do a pass to detect duration

      // transcoding options
      transcode: path + videoId + ".mp3",    // path to output-file, or - for stdout as a Buffer
      bitrate: 320,                   // audio bitrate in kbps
      format: "mp3",                 // e.g. mp3, ogg, mp4
      codec: "mp3",                  // e.g. mp3, vorbis, flac, aac
      mime: "mimetype",               // e.g. audio/vorbis
      // waveform.js options
      waveformjs: path + videoId + ".json",  // path to output-file, or - for stdout as a Buffer
      'wjs-width': 800,               // width in samples
      'wjs-precision': 4,             // how many digits of precision
      'wjs-plain': false,             // exclude metadata in output JSON (default off)

      // png options
      png: path + videoId + ".png",          // path to output-file, or - for stdout as a Buffer
      'png-width': 500,               // width of the image
      'png-height': 120,               // height of the image
      'png-color-bg': '00000000',     // bg color, rrggbbaa
      'png-color-center': '000000ff', // gradient center color, rrggbbaa
      'png-color-outer': '000000ff',  // gradient outer color, rrggbbaa
    }, function(err, buf) {
      // done
      console.log('done');
    });
}
