import blueBanner from '../../../../assets/ad_banner-blue.png';
import pinkBanner from '../../../../assets/ad_banner_pink.png';
import greenBanner from '../../../../assets/ad_banner_green.png';

export default function Advertisement({num}){
  
  function getBannerImage(num){
    switch(num){
      case 1: return blueBanner;
      case 2: return pinkBanner;
      case 3: return greenBanner;
      default: return pinkBanner;
    }}
    return(
    <div 
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        
        <button
          onClick={() => window.open("https://agsiddiqui.itch.io/afterworld", "_blank")}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
          }}
        >
     
          <img 
            src={getBannerImage(num)} 
            alt="Ad Banner"
            style={{
              width: "90%",
              maxWidth: "800px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </button>
        
      </div>);}