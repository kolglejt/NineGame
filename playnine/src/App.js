import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
library.add(faStar);

const Stars = (props) => {
    const numberOfStars = 1+ Math.floor( Math.random()*9); //between 1-9
    let stars = [];
    for (let i=0; i<numberOfStars; i++){
        stars.push(<FontAwesomeIcon key={i} className='star' icon="star" />);
    }
  return(

      <div className='col-5'>
          {stars}
      </div>

  );
};
const Button = (props) => {
    return(

        <div className='col-2'>
          <button>=</button>
        </div>

    );
};
const Answer = (props) => {
    return(

        <div className='col-5'>
          ....
        </div>

    );
};
const Numbers = (props) => {
    return (
        <div className='card text-center'>
            <div>
                <span>1</span>
                <span>2</span>
                <span>3</span>
            </div>
        </div>


    )
}
class Game extends React.Component {
    render () {
        return (
            <div className='container'>
                <hr />
                <h3>Play Nine</h3>
                <div className="row">

                    <Stars/>
              <Button/>
              <Answer/>
                </div>
                <br />
                <Numbers/>
            </div>
        );
    }
}

class App extends Component {
  render() {
    return (
      <div>
      <Game/>

      </div>
    );
  }
}

export default App;
