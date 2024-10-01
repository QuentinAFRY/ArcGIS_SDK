import * as React from "react"
import Map from "@arcgis/core/Map"
import SceneView from "@arcgis/core/views/SceneView"
import { Extent } from "@arcgis/core/geometry"
import Home from "@arcgis/core/widgets/Home"
import "./app.css"

function App() {

  const sceneRef = React.useRef<SceneView | null>(null)
  const mapRef = React.useRef<Map | null>(null)
  const homeRef = React.useRef<Home | null>(null)

  const sceneContainerRef = React.useRef<HTMLDivElement | null>(null)

  const mapExtent = new Extent({
    xmax: -130,
    xmin: -100,
    ymax: 40,
    ymin: 20,
    spatialReference: { wkid: 4326 },
  })

  React.useEffect(() => {

    mapRef.current = new Map({
      basemap: "hybrid",
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
          x: -12977859.07,
          y: 4016696.94,
          z: 348.61,
          spatialReference: { wkid: 102100 },
        },
        heading: 316,
        tilt: 85,
      },
    })

    if(!sceneRef.current) {return}
  
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

      homeRef.current = new Home({
        view: sceneRef.current,
      })

      console.log("success", sceneRef.current)
    
  }, [sceneContainerRef])

  if (sceneRef.current && homeRef.current) {
    sceneRef.current.ui.add(homeRef.current, "top-left")
  }
  
  //Clipping extent for the scene in "WGS84"
  
  
  //Extent = The minimum and maximum X and Y coordinates of a bounding box.
  //Camera is used to define the visible part of the map within the view.

  return (
    <>
      <div id="app-container" ref={sceneContainerRef}></div>
    </>
  )
}

export default App

