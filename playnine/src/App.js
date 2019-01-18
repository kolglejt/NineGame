import React, { Component } from 'react';
import './App.css';
import _ from 'lodash'; //Lodash
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //FontAwesome
import { faStar } from '@fortawesome/free-solid-svg-icons';
library.add(faStar);


const Stars = (props) => {

    const numberOfStars = props.numberOfStars; //between 1-9
    let stars = [];
    for (let i=0; i<numberOfStars; i++){
        stars.push(<FontAwesomeIcon key={i} className='star' icon="star" />);
    }
  return(

      <div className='col-5'>
          {stars}
      </div>

  );

}
const Button = (props) => {
    return(

        <div className='col-2'>
            <button className='btn' disabled={props.selectedNumbers.length ===0 }>=</button>
        </div>

    );
};
const Answer = (props) => {
    return (

        <div className='col-5'>
            {props.selectedNumbers.map((number,i) =>
                <span key={i} onClick={() => props.unselectNumber(number)}>
                    {number}
                </span>
            )}

        </div>

    );
};
class Numbers extends React.Component {
    render() {
        //const arrayOfNumbers = _.range(1, 10); //lodash
        const numberClassName = (number) => {
            if (this.props.selectedNumbers.indexOf(number) >= 0) {
                return 'selected';
            }
        }; //it will receive a number and check if that number is included in the selectedNumbers array

        return (
            <div className='card text-center'>
                <div>
                    {Numbers.list.map((number, i) =>
                        <span key={i} className={numberClassName(number)}
                              onClick={() => this.props.selectNumber(number)}>{number}</span> //give class selected on number el
                    )}
                </div>
            </div>


        )
    }
}

Numbers.list = _.range(1, 10); //lodash


class Game extends React.Component {
    state = {
        selectedNumbers: [],
        numberOfStars: 1 + Math.floor(Math.random() * 9),

    };
    selectNumber =(clickedNumber) => {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >=0) {return; }
        this.setState(prevState => ({
                selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
            }));

    };
    unselectNumber =(clickedNumber) => {
        this.setState(prevState => ({
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }));

    }
    render () {
        return (
            <div className='container'>
                <hr />
                <h3>Play Nine</h3>
                <div className="row">

                    <Stars numberOfStars = {this.state.numberOfStars}/>
              <Button selectedNumbers={this.state.selectedNumbers}/>
              <Answer selectedNumbers={this.state.selectedNumbers}
                      unselectNumber={this.unselectNumber}/>
                </div>
                <br />
                <Numbers selectedNumbers={this.state.selectedNumbers}
                         selectNumber={this.selectNumber}
                />
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
