import Map from "../components/Map";
import Marker from "../components/Marker";
import Timer from "../components/Timer";
import AltMap from "../components/AltMap";
import { Wrapper, Status} from '@googlemaps/react-wrapper';
import { useLoadScript } from '@react-google-maps/api'
const GamePlay = () => {

    // const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const position = {lat: 42.345573, lng: -71.098326}

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: 'AIzaSyBrL26kHgHcE6O9YC-F7mbxCXhwscpSsdA',
    });
    if(!isLoaded) return <div>Loading...</div>

    //This function 
    // const render = (status: Status): ReactElement => {
    //     if (status === Status.FAILURE) return <h1>failure</h1>;
    //     return <h1>loading</h1>;
    //   }; 


    return (
        <div>
            {/* <Timer/> */}
            {/* <Wrapper apiKey={key} render={render}>
                <Map position={position}>
                <Marker key='1'position={position}/>
                </Map>
            </Wrapper> */}
            <AltMap/>
        </div>
        
    )
}

export default GamePlay;