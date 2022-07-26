import React, { useCallback, useState } from 'react'
// import Confirm from './Confirm'
import Button from './Button'
import { GoogleMap, Marker, Polyline, StreetViewPanorama} from '@react-google-maps/api'
import midpoint from '@turf/midpoint'

export default function Map({position, confirm, results}) {

    const [choice, setChoice] = useState(null)
    const [mapActive, setMapActive] = useState(false)
    const [gameEnd, setGameEnd] = useState(false)

    //MAP INITIALIZATION
    //custom map controls
    //can't figure out how to do this with jsx but I guess it's not
    //the end of the world.
    //custom control to minimize map 
    const controlDiv = document.createElement('div')
    controlDiv.innerText = '-'
    controlDiv.setAttribute('class', 'control')
    controlDiv.addEventListener('click', () => {
        setMapActive(false)
    })
     //allows access to map instance
    //so I can add a custom control
    const mapLoad = useCallback((map: google.maps.Map) => {
        //adds controls to the choice map
        //called in the onLoad prop
        map.data.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv)
    }, [controlDiv])
    //choice map
    const mapOptions = {
        styles: [
            {
                featureType: 'poi',
                stylers: [
                    {'visibility': 'off'}
                ]
            },
            {
                featureType: 'transit',
                stylers: [
                    {'visibility': 'off'}
                ]
            }
        ],
        disableDefaultUI: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
        clickableIcons: false,
    }
    //streetview 
    const streetOptions = { 
        disableDefaultUI: true,
        showRoadLabels: false,
        clickToGo: true, 
        enableScrollWheel: false,
        enableCloseButton: false,
    }

    //click handles 
    function handleClick(event){
        if(!mapActive){
            setMapActive(true)
            controlDiv.setAttribute('class', 'control')
        }
        else{
            setChoice({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            })
        }
        
    }
    //handler for confirm button
    function handleConfirm(event){
        //lifting state
        confirm([choice.lat, choice.lng]);
        setGameEnd(true);
        

    }

    function getMiddle() {
        let pointa = ([choice.lat, choice.lng])
            let pointb = ([position.lat, position.lng])
            const middle = midpoint(pointa, pointb)
            const halfway = {lat: middle.geometry.coordinates[0] + 0.003, lng:middle.geometry.coordinates[1] }
            return halfway
    }


    const GameEndSettings = () => {
        let zoom = 0
        if(results < 2000) zoom = 14
        else if (results < 5000) zoom = 12
        else if(results < 15000) zoom = 10
        else if(results < 40000) zoom = 9
        else zoom = 8
        if(gameEnd){
            return (
                <GoogleMap
                onLoad={mapLoad}
                options={mapOptions}
                onClick={handleClick}
                mapContainerClassName={mapActive ? 'map-active' : 'map'}
                zoom={zoom} 
                center={getMiddle()}>
                    <Marker position={choice}
                    // label={
                    //     {text:"Your Guess",
                    //     className:"marker",
                    //     fontFamily: 'poppins',
                    //     fontSize: '20px',
                    //     fontWieght: 700,
                    // }
                    //     }
                        />
                    <Marker position={position} 
                    icon={'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'}
                    // label={
                    //     {text:"Answer",
                    //     className:"marker",
                    //     fontFamily: 'poppins',
                    //     fontSize: '20px',
                    //     fontWieght: 700,
                    // } } 
                    />
                <Polyline 
                path={[choice, position]}
                strokeColor={'red'}
                strokeOpacity={0}
                strokeWeight={2}/>
                </GoogleMap>
            )
        }
        else{
            return (
            <GoogleMap
            onLoad={mapLoad}
            options={mapOptions}
            onClick={handleClick}
            mapContainerClassName={mapActive ? 'map-active' : 'map'}
            zoom={10} 
            center={position}>
                <Marker position={choice}/>
                <Button 
                handleClick={handleConfirm} 
                active={mapActive}
                text={'Confirm'}
                classes={"btn confirm"}/>  </GoogleMap> )
        }
    }

    return (
        <>
        {gameEnd ? <></> : <GoogleMap
        onLoad={mapLoad}
        zoom={10}
        mapContainerClassName='streetview'
        center={position}>
           <StreetViewPanorama

           visible={true}
           position={position}
           options={streetOptions}>
           </StreetViewPanorama>
        </GoogleMap> }
                {GameEndSettings()}
        </>
    )
}