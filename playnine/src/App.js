import React, { Component } from 'react';
import './App.css';
import _ from 'lodash'; //Lodash
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //FontAwesome
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';
library.add(faStar);
library.add(faCheck);
library.add(faTimes);
library.add(faSync);


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
    let button;
    switch (props.isAnswerCorrect) {
        case true:
            button =
                <button className='btn btn-success'
                        onClick={props.acceptAnswer}> <FontAwesomeIcon className='fa-check' icon="check"/>
                </button>;
                //FontAwesomeIcon className='fa-check' icon="check"
            break;
        case false:
            button =
                <button className='btn btn-danger'> <FontAwesomeIcon className='fa-times' icon="times"/> </button>;
            break;
        default:
            button =
                <button className='btn'
                        onClick={props.checkAnswer}
                        disabled={props.selectedNumbers.length ===0}>
                = </button>

    }
    return(

        <div className='col-2 text-center'>
            {button}
            <button className='btn btn-warning btm-sm' onClick={props.redraw}
            disabled={props.redraws === 0}
            >
                <FontAwesomeIcon className='fa-sync' icon="sync"/>
             {props.redraws}</button>
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
            if (this.props.usedNumbers.indexOf(number) >= 0) {
                return 'used';
            }
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

const DoneFrame = (props) => {
        return (
        <div className='text-center'>
            <h2>{props.doneStatus}</h2>
        </div>

        );
};

class Game extends React.Component {
    state = {
        selectedNumbers: [],
        numberOfStars: 1 + Math.floor(Math.random() * 9),
        usedNumber: [],
        isAnswerCorrect: null,
        redraws: 5,
        doneStatus: null,

    };
    selectNumber =(clickedNumber) => {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >=0) {return; }
        this.setState(prevState => ({
                isAnswerCorrect: null,
                selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
            }));

    };
    unselectNumber =(clickedNumber) => {
        this.setState(prevState => ({
            isAnswerCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }));

    };
    checkAnswer = () => {
        this.setState(prevState => ({
            isAnswerCorrect: prevState.numberOfStars ===
                prevState.selectedNumbers.reduce((acc,n) => acc + n, 0)

        }));
    };
    acceptAnswer = () => {
    this.setState(prevState => ({
        usedNumber: prevState.usedNumber.concat(prevState.selectedNumbers),
        selectedNumbers: [],
        numberOfStars: 1 + Math.floor(Math.random() * 9), //new value
        isAnswerCorrect: null,

    }));

    };

    redraw = () => {
        if(this.state.redraws === 0) {return; }
        this.setState(prevState => ({
            numberOfStars: 1 + Math.floor(Math.random() * 9),
            selectedNumbers: [],
            isAnswerCorrect: null,
            redraws: prevState.redraws - 1,

        }));
    };
        render () {
        return (
            <div className='container'>
                <hr />
                <h3>Play Nine</h3>
                <div className="row">

                    <Stars numberOfStars = {this.state.numberOfStars}/>
              <Button selectedNumbers={this.state.selectedNumbers}
                      redraws={this.state.redraws}
                      acceptAnswer ={this.acceptAnswer}
                      checkAnswer={this.checkAnswer}
                      isAnswerCorrect={this.state.isAnswerCorrect}
                      redraw = {this.redraw}
              />
              <Answer selectedNumbers={this.state.selectedNumbers}
                      unselectNumber={this.unselectNumber}/>
                </div>
                <br />
                { this.state.doneStatus ?
                    <DoneFrame doneStatus={this.state.doneStatus}/>
                    :
                    <Numbers selectedNumbers={this.state.selectedNumbers}
                             selectNumber={this.selectNumber}
                             usedNumbers= {this.state.usedNumber}
                    />
                }



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
