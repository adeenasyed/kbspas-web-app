import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const pages = [
  // {name: 'Home', path: '/'}, 
  {name: 'Services', path: '/services'}, 
  {name: 'Policies', path: '/policies'},
  {name: 'Book Now', path: '/booknow'}
];

const platforms = [
  {index: 1, link: 'https://www.instagram.com/kbspas/', logo: '/resources/logos/instagram-logo.png'}, 
  {index: 2, link: 'https://www.tiktok.com/@kbspas', logo: '/resources/logos/tiktok-logo.png'}
];

function NavBar() {
    const [showFullMenu, setShowFullMenu] = useState();

    const checkWindowWidth = () => {
      if (window.innerWidth <= 900) {
        setShowFullMenu(false);
      } else {
        setShowFullMenu(true); 
        setDrawerOpen(false);
      }
    };

    useEffect(() => {
      checkWindowWidth();
      window.addEventListener('resize', checkWindowWidth);
      return () => {
        window.removeEventListener('resize', checkWindowWidth);
      };
    }, []);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = (event) => {
      setDrawerOpen(event);
    };

    const textStyles = () => ({
      className: `text-lg hover:text-primary ${showFullMenu ? 'my-6' : ''}`,
      style: {
        fontWeight: 900, 
        marginTop: !showFullMenu && 50, 
        marginRight: !showFullMenu && 70, 
        marginLeft: !showFullMenu && 70
      }
    });
    
    const logoStyles = (platform) => ({
      width: 45, 
      height: 45, 
      minWidth: 45, 
      minHeight: 45, 
      marginRight: platform.index == 1 && 8, 
      marginLeft: platform.index == 2 && 8,
      marginTop: showFullMenu && 14
    });

    const renderPages = () => pages.map((page) => (
      <Link to={page.path} key={page.name} {...textStyles()}>
        {page.name}
      </Link>
    ));

    const renderPlatforms = () => platforms.map((platform) => (
      <a key={platform.index} href={platform.link} target="_blank" rel="noopener noreferrer">
        <img
          src={platform.logo}
          style={{...logoStyles(platform)}}
        />
      </a>
    ));
    
    return (
      <>
        <header className="flex items-start py-2 px-4">
          <img
            src="/resources/logos/text-logo.png"
            style={{width: 143, height: 62, minWidth: 143, minHeight: 62}}
          />
          {showFullMenu ? 
            <>
              <div className="flex-grow flex items-start gap-20 ml-20">
                {renderPages()}
              </div>
              {renderPlatforms()}
            </> 
            :
            <>
              <div className="flex-grow"></div>
              <button onClick={() => handleDrawerOpen(true)} style={{marginTop: '8px'}}>
                <MenuRoundedIcon sx={{width: 40, height: 55}}/>
              </button>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => handleDrawerOpen(false)}
                onClick={() => handleDrawerOpen(false)}
              >
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  {renderPages()}
                  <div style={{display: 'flex', flexDirection: 'row', marginTop: 50}}>
                    {renderPlatforms()}
                  </div>
                </div>
              </Drawer>
            </>
          }
        </header>
      </>
    );
}

export default NavBar;