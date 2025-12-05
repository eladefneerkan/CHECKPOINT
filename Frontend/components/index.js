//entrypoint for all components in this folder for easier imports elsewhere
import PotionBubbles from './globalUI/atoms/potionBubbles.jsx'; 
import PosterCard from './globalUI/atoms/PosterCard.jsx'; 
import PosterList from './globalUI/molecules/PosterList.jsx'; 
import Advertisement from './globalUI/molecules/Advertisement.jsx';
import LogoutButton from './globalUI/atoms/LogoutButton.jsx';
import GameComp from './globalUI/molecules/GameComp.jsx';
import PageTransition from './globalUI/atoms/PageTransition.jsx';
// Then, use named exports to make them available
export { 
    Advertisement,
    PotionBubbles,
    PosterCard,
    PosterList,
    LogoutButton,
    GameComp,
    PageTransition
};