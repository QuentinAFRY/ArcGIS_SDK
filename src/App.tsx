import * as React from "react"
import * as THREE from "three"
import * as OBC from "@thatopen/components"
import Map from "@arcgis/core/Map"
import SceneView from "@arcgis/core/views/SceneView"
import SceneLayer from "@arcgis/core/layers/SceneLayer"
import { Extent } from "@arcgis/core/geometry"
import RenderNode from "@arcgis/core/views/3d/webgl/RenderNode"
import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators.js"
import "./app.css"
import externalRenderers from "esri/views/3d/externalRenderers"
import Accessor from "esri/core/Accessor"
import ManagedFBO from "esri/views/3d/webgl/ManagedFBO"



function App() {

  const sceneRef = React.useRef<SceneView | null>(null)
  const mapRef = React.useRef<Map | null>(null)
  const sceneLayerRef = React.useRef<SceneLayer | null>(null)

  const sceneContainerRef = React.useRef<HTMLDivElement | null>(null)
  const threeContainerRef = React.useRef<HTMLDivElement | null>(null)

  const mapExtent = new Extent({
    xmax: -130,
    xmin: -100,
    ymax: 40,
    ymin: 20,
    spatialReference: { wkid: 4326 },
  })

  function initSceneView() {
    mapRef.current = new Map({
      basemap: "topo",
      ground: "world-elevation"
    })

    sceneRef.current = new SceneView({
      map: mapRef.current,
      container: sceneContainerRef.current!,
      viewingMode: "global",
      clippingArea: mapExtent,
      extent: mapExtent,
      camera: {
        position: {
          x: -74.0338,
          y: 40.6913,
          z: 707
        },
        // position: {
        //   x: -12977859.07,
        //   y: 4016696.94,
        //   z: 348.61,
        //   spatialReference: { wkid: 102100 },
        // },
        heading: 316,
        tilt: 85,
      },
    })

    if (!sceneRef.current) { return }

    sceneRef.current
      .when(() => {
        sceneRef.current!.goTo({
          center: [-112, 38],
          zoom: 13,
          heading: 30,
          tilt: 60,
        })
      })
      .catch((error: any) => {
        console.error("SceneView rejected:", error)
      })

    sceneLayerRef.current = new SceneLayer({
      portalItem: {
        id: "2e0761b9a4274b8db52c4bf34356911e"
      },
      popupEnabled: false
    })
    mapRef.current.add(sceneLayerRef.current)
  }

  function initThree() {
    const fov = 45;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const near = 1;
    const far = 10 * 1000 * 1000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    if (threeContainerRef.current) {
      threeContainerRef.current.appendChild(renderer.domElement)
      console.log("renderer successful")
    }
  }

  function init3DObject() {

      // @subclass()
      // class RenderNodeSubclass extends RenderNode {

      //   initialize () {
      //     this.consumes.required.push("opaque-color")
      //     this.produces = "opaque-color"
      //     this.initShaders()
      //     this.initData()
      //   }
        


      //   render(inputs: ManagedFBO[]): ManagedFBO {
      //     this.resetWebGLState()
      //     const output = this.bindRenderTarget()

      //     const gl = this.gl
      //     const time = Date.now() / 1000

      //     // Set some global WebGL state
      //     gl.enable(gl.DEPTH_TEST)
      //     gl.disable(gl.CULL_FACE)
      //     gl.disable(gl.BLEND)

      //   // XXX - Not implemented yet
      //   /* 
      //   // Enable our shader
      //   gl.useProgram(this.program);
      //   this.setCommonUniforms();

      //   // Draw all the bases (one draw call)
      //   this.bindWindmillBase();
      //   glMatrix.mat4.identity(this.tempMatrix4);

      //   // Apply local origin by translation the view matrix by the local origin, this will
      //   // put the view origin (0, 0, 0) at the local origin
      //   glMatrix.mat4.translate(this.tempMatrix4, this.tempMatrix4, this.localOriginRender);
      //   glMatrix.mat4.multiply(this.tempMatrix4, this.camera.viewMatrix, this.tempMatrix4);
      //   gl.uniformMatrix4fv(this.programUniformModelViewMatrix, false, this.tempMatrix4);

      //   // Normals are in world coordinates, normal transformation is therefore identity
      //   glMatrix.mat3.identity(this.tempMatrix3);
      //   gl.uniformMatrix3fv(this.programUniformNormalMatrix, false, this.tempMatrix3);

      //   gl.drawElements(gl.TRIANGLES, this.windmillBaseIndices.length, gl.UNSIGNED_SHORT, 0);

      //   // Draw all the blades (one draw call per set of blades)
      //   this.bindWindmillBlades();
      //   for (let i = 0; i < this.numStations; ++i) {
      //     // Current rotation of the blade (varies with time, random offset)
      //     const bladeRotation = (time / 60) * this.windmillInstanceRPM[i] + i;

      //     // Blade transformation:
      //     // 1. Scale (according to blade size)
      //     // 2. Rotate around Y axis (according to wind speed, varies with time)
      //     // 3. Rotate around Z axis (according to wind direction)
      //     // 4. Translate along Z axis (to where the blades are attached to the base)
      //     // 5. Transform to render coordinates
      //     // 6. Transform to view coordinates
      //     glMatrix.mat4.identity(this.tempMatrix4);
      //     glMatrix.mat4.translate(this.tempMatrix4, this.tempMatrix4, this.windmillInstanceBladeOffset[i]);
      //     glMatrix.mat4.rotateZ(this.tempMatrix4, this.tempMatrix4, this.windmillInstanceWindDirection[i]);
      //     glMatrix.mat4.rotateY(this.tempMatrix4, this.tempMatrix4, bladeRotation);
      //     glMatrix.mat4.scale(this.tempMatrix4, this.tempMatrix4, this.windmillInstanceBladeScale[i]);
      //     glMatrix.mat4.multiply(this.tempMatrix4, this.windmillInstanceInputToRender[i], this.tempMatrix4);
      //     glMatrix.mat3.normalFromMat4(this.tempMatrix3, this.tempMatrix4);
      //     glMatrix.mat4.multiply(this.tempMatrix4, this.camera.viewMatrix, this.tempMatrix4);
      //     gl.uniformMatrix4fv(this.programUniformModelViewMatrix, false, this.tempMatrix4);
      //     gl.uniformMatrix3fv(this.programUniformNormalMatrix, false, this.tempMatrix3);
      //     gl.drawElements(gl.TRIANGLES, Windmill.blades_indices.length, gl.UNSIGNED_SHORT, 0);
      //   }

      //   // Draw continuously
      //   this.requestRender();
      //   */

      //   // return output fbo (= input fbo)
      //   return output;
      // }


    }




  

  React.useEffect(() => {
    initSceneView()
    initThree()
  }, [])



  return (
    <>
      <div id="app-container" ref={sceneContainerRef}></div>
      <div id="three-container" ref={threeContainerRef}></div>
    </>
  )
}

export default App

