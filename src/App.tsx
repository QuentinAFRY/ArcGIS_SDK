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
      basemap: "dark-gray-vector",
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

    @subclass("external.renderer")
    class ExternalRenderer extends RenderNode {
      view: SceneView = sceneRef.current!
    }




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

