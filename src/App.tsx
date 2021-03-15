import React, {useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';


const INITIAL_VIEW_STATE = {
  longitude: -74.006,
  latitude: 40.7128,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

const layersToDeckGL = (layers: any[])=>{
  return layers.filter(l=>l).map(l=>(new GeoJsonLayer({
      id:l.name,
      data: l.geojson,
      getFillColor: l.name ==='nta' ?  [200,200,200,0] : (f:any)=> [f.properties.shape_area/10000, 255,255, 255],
      getLineColor: l.name ==='nta' ? [255,0,0,255] : [0,0,0,255],
      stroked: true ,
      lineWidthUnits:'pixels'
  })))
}

function App() {
  const [tracts, setTracts] = useState<any | null>();
  const [nta, setNta] = useState<any | null>();

  const layers = layersToDeckGL([tracts,nta]) 
  useEffect(()=>{
    fetch(`${window.location}/layers/2010_census_tracts.geojson`)
      .then(r=>r.json())
      .then(result => setTracts({name:'census_tracts', geojson:result}))
  },[])

  useEffect(()=>{
    fetch(`${window.location}/layers/nta.geojson`)
      .then(r=>r.json())
      .then(result => setNta({name:'nta', geojson:result}))
  },[])

  return (
    <div className="App">
      <div className='sidebar'>

      </div>
      <div className='map'>

      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers}  
        style={{width:'100%', height:"100%"}}
      >
        <StaticMap 
          mapboxApiAccessToken={
             'pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiY2ttNDZsdTVuMDFrazJ2b2Z6bmV0dDlpZiJ9.VHg-mUZEYo4shwH4s_QnKA'
          }
          width="100%"
          height="100%"
        />
      </DeckGL>
      </div>
    </div>
  );
}

export default App;
