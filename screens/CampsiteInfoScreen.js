import RenderCamspite from '../features/campsites/RenderCampsite';


const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
  return <RenderCamspite campsite={campsite} />
};

export default CampsiteInfoScreen