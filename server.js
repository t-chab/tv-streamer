'use strict';

const express = require('express');
const basicAuth = require('basic-auth-connect');

const credentials = require('./credentials.json');
const config = require('./config.json');

// Parse command line args
var url = process.argv[2];
if (url === undefined) {
    url = config.stream_url;
}
console.log('Streaming from url: ', url);

// Set up ffmpeg
const ffbinary = require('ffmpeg-static');
console.log('ffmpeg available at: ', ffbinary.path);

const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffbinary.path);
const stream = './' + config.webdir + '/' + config.m3u8_name;

// TODO : find a way to add user_agent option
// '-user_agent', '"' + config.user_agent + '"'
ffmpeg(url).inputOptions([
    '-re',
    '-reconnect', '1',
    '-reconnect_at_eof', '0',
    '-reconnect_streamed', '1',
    '-reconnect_delay_max', '4294'
]).output(stream)
    .outputOptions([
        '-c:v', config.video_codec,
        '-x264opts', 'keyint=' + config.idr_interval + ':no-scenecut',
        '-s', config.resolution,
        '-r', config.fps,
        '-b:v', config.bitrate,
        '-profile:v', config.profile,
        '-c:a', config.audio_codec,
        '-sws_flags', config.scale_alg,
        '-hls_list_size', config.hls_list_size,
        '-hls_flags', 'delete_segments'
    ]).on('start', function (commandLine) {
        console.log('ffmpeg started with command line ', commandLine);
    }).on('stderr', function (stdErrLine) {
        console.log('Stderr output: ', stdErrLine);
    }).on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ', err.message);
        console.log('Error output: ', stderr);
    }).run();

// Set up express app
const app = express();

// Configure a protected route to static resources directory
// Enable auth only if at least a login is supplied
if (credentials.login && credentials.login > 0 && !credentials.login.trim()) {
    const auth = basicAuth(credentials.login, credentials.password);
    app.use('/', [auth, express['static'](__dirname + '/' + config.webdir)]);
} else {
    app.use('/', express['static'](__dirname + '/' + config.webdir));
}
app.listen(config.port, config.host, function () {
    console.log('Server listening on %s:%s', config.host, config.port);
});
