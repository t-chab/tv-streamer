# Description

Simple video streamer through html5 browser using HLS

# Usage

Clone this repository, then just launch the script

```
./streamToHls.sh "http://url.to.your.stream"
```

Then serve the directory content to browser, for example using a simple http server :

```
python3 -m http.server 5000
```
