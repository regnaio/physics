# physics

[Demo](https://regnaio.github.io/physics/)

</br>

Try it out yourself!

`git clone git@github.com:regnaio/physics.git`

`cd physics/docs/`

`tsc && webpack && npx serve . -p 80`

Go to [localhost](http://localhost/)

</br>

After Chromium 91, `SharedArrayBuffer` will only be available on pages with `self.crossOriginIsolated = true`, which requires the the HTTP headers `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin`

No worries! The file `serve.json` will make `npx serve` serve the page with these HTTP headers

[Source](https://developer.chrome.com/blog/enabling-shared-array-buffer/)