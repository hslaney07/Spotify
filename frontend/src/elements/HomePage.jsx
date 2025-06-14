import '../css-files/App.css';
import { useEffect } from 'react';  
import { setUserData } from '../stores/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import HomePageVisual from '../components/HomePageVisual';
import { getUserData } from '../helpers/SpotifyAPICalls';
import { LoadingVisual } from '../components/GeneralComponents';

const HomePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const isUserDataLoaded = userData => userData.display_name !== '';

  useEffect(() => {
    if (!isUserDataLoaded) {
      const fetchAndStoreUser = async () => {
        const userDataFromSpotify = await getUserData();
        if (userDataFromSpotify) {
          dispatch(setUserData(userDataFromSpotify));
        }
      };
      fetchAndStoreUser();
    }
  }, [dispatch, userData]);

  if (!isUserDataLoaded) {
    return <LoadingVisual />;
  }else{
    return (
      <HomePageVisual />
    );
  }
};

export default HomePage;
