<template>
  <!-- <link href="test.html" rel="import" /> -->
  <!-- <div id="mainBrowser"> -->
  <!-- <v-col> -->
  <!-- <input id="fileObj" ref="file" @change="loadObject" type="file" /> -->
  <div id="brainDisplay"></div>
  <!-- <div>
        <input type="checkbox" class="button" id="meshmode" hidden @change="meshmode = !meshmode" />
        <label for="meshmode">Mesh Mode</label>
      </div>
  </v-col>-->
  <!-- </div> -->
</template>
<script>
// import session from '@/api/session'
const axios = require('axios')

export default {
  // computed: {
  //   mainBrowser() {
  //     return this.$refs['mainBrowser']
  //   }
  // },
  // mounted() {
  //   // require('../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js')
  //   require('@webcomponents/webcomponentsjs')
  //   window.addEventListener(
  //     'WebComponentsReady',
  //     function(e) {
  //       console.log('Got in!')
  //       var content = this.mainBrowser.children[0]
  //       console.log(content)
  //       console.log(document)
  //       // this.mainBrowser.replaceChild(
  //       //   document.currentScript.ownerDocument.getElementsByTagName('html')[0]
  //       //     .children[0],
  //       //   content
  //       // )
  //     },
  //     false
  //   )
  //   // var event = new Event('WebComponentsReady')
  //   // this.$loadScript(
  //   //   '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
  //   // ).then(() => {
  //   //   // window.dispatchEvent(event)
  //   // })
  //   // this.$loadScript(
  //   //   '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
  //   // ).then(() => {
  //   //   require('../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js')
  //   //   // window.dispatchEvent(event)
  //   // })
  // },
  // created() {}
  // var loadWebComps = document.createElement('script')
  // loadWebComps.setAttribute('type', 'text/html')
  // loadWebComps.setAttribute(
  //   'src',
  //   '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
  // )
  // document.head.appendChild(loadWebComps)
  // }
  // data: function() {
  //   return {
  //     bb: String
  //   }
  // }
  // data: function() {
  //   return {
  //     fileObj: null,
  //     meshmode: false
  //   }
  // },
  created() {
    require('brainbrowser/examples/js/jquery-1.6.4.min.js')
    require('brainbrowser/examples/js/jquery-ui-1.8.10.custom.min.js')
    // require('brainbrowser/examples/js/ui.js')
    // require('brainbrowser/examples/js/pako.js')
    // require('brainbrowser/src/brainbrowser/brainbrowser.js')
    // require('brainbrowser/src/brainbrowser/core/tree-store.js')
    // require('brainbrowser/src/brainbrowser/lib/utils.js')
    // require('brainbrowser/src/brainbrowser/lib/events.js')
    // require('brainbrowser/src/brainbrowser/lib/config.js')
    // require('brainbrowser/src/brainbrowser/lib/loader.js')
    // require('brainbrowser/src/brainbrowser/lib/color-map.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/lib/three.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/lib/parse-intensity-data.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/modules/annotations.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/modules/color.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/modules/loading.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/modules/rendering.js')
    // require('brainbrowser/src/brainbrowser/surface-viewer/modules/views.js')
    // require('brainbrowser/examples/surface-viewer-demo.config.js')
    // require('brainbrowser/examples/js/AnaglyphEffect.js')
  },
  mounted() {
    let display = null
    let elem = $('#app').find('#brainDisplay')[0]
    axios
      .get(
        'https://brainbrowser.cbrain.mcgill.ca/surface-viewer-widget?' +
          'version=2.5.2&' +
          'model=/brain-surface.obj'
      )
      .then(res => {
        display = res.data
        elem.innerHTML = display
      })
      .catch(err => console.log(err))
  }
  // methods: {
  //   loadObject() {
  //     let file = this.$refs.file
  //     let meshmode = this.meshmode
  //     BrainBrowser.SurfaceViewer.start('brainDisplay', function(viewer) {
  //       //Add an event listener.
  //       viewer.addEventListener('displaymodel', function() {
  //         console.log('We have a model!')
  //       })
  //       // Start rendering the scene.
  //       viewer.render()
  //       // Load a model into the scene.
  //       viewer.loadModelFromFile(file)
  //       // Hook viewer behaviour into UI.
  //       $('#meshmode').change(function(e) {
  //         viewer.setWireframe(meshmode)
  //       })
  //     })
  //   }
  // }
}
</script>
<style scoped></style>
