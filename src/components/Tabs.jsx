import { Link } from "react-router-dom";
import react, {useEffect, useState} from 'react';

const Tabs = () => {
  const [active, setActive] = useState('');
  useEffect(() => {
    const url = window.location.pathname;
    console.log(url.slice(1, url.length));
    setActive(url.slice(1, url.length));
  }, []);
    return(
        <div className="tabs">
            <ul>

                <li className={active === 'wine' && 'is-active'} >
                    <Link to = '/wine' onClick = {() => setActive('wine')}>
                        Wine
                    </Link>
                </li>
                <li className={active === 'word' && 'is-active'} >
                    <Link to = '/word' onClick = {() => setActive('word')}>
                        Word
                    </Link>
                </li>
            </ul>
        </div>
  );
}

export default Tabs;