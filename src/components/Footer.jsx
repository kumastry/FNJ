import {
  EmailIcon,
  TwitterIcon
} from 'react-share';

function Footer() {
  return(
  <footer className="footer">
      <div className="content has-text-centered">
          <hr></hr>
              <p>2021&copy;kumastry</p>
            
              
   
              <div className="columns  is-centered">
                  <div className="column  is-narrow  ">
                      <a href="https://twitter.com/kumastry1" target="_black"><TwitterIcon size={48} round /></a>
                  </div>
                  
                  <div className="column  is-narrow">
                      <a href="mailto:kumastry2212@gmail.com"><EmailIcon size={48} round /></a>
                  </div>
              </div>
      </div>
  </footer>
  );
}

export default Footer;