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

var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize);
    for (var i = 1; i < combinationsCount ; i++ ) {
        var combinationSum = 0;
        for (var j=0 ; j < listSize ; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
};

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

};
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
            if (this.props.usedNumber.indexOf(number) >= 0) {
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
                       <button className='btn btn-secondary' onClick={props.resetGame}> Play Again</button>
                   </div>

            );
        };

class Timer extends React.Component {

    render(){
        return (

            <div className='text-right'>
                <button onClick={this.props.startCountDown}> Start</button>
                <h2 className='timer'>{this.props.minutes}:{this.props.seconds}</h2>
            </div>

        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.startCountDown = this.startCountDown.bind(this);
        this.tick = this.tick.bind(this);
    }

    static randomNumber = () => 1 + Math.floor(Math.random() * 9);
    static initialState = () => ( {
        selectedNumbers: [],
        numberOfStars: Game.randomNumber(),
        usedNumber: [],
        isAnswerCorrect: null,
        redraws: 5,
        doneStatus: null,
        minutes: '01',
        seconds: '00',

    });
    state = Game.initialState();

    resetGame = () => {
        this.setState(Game.initialState());
    }
    selectNumber = (clickedNumber) => {
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {
            return;
        }
        this.setState(prevState => ({
            isAnswerCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));

    };
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            isAnswerCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }));

    };
    checkAnswer = () => {
        this.setState(prevState => ({
            isAnswerCorrect: prevState.numberOfStars ===
                prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)

        }));
    };
    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumber: prevState.usedNumber.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            isAnswerCorrect: null,
            numberOfStars: Game.randomNumber(), //new value
        }), this.updateDoneStatus);

    };

    redraw = () => {
        if (this.state.redraws === 0) {return; }
        this.setState(prevState => ({
            numberOfStars: Game.randomNumber(),
            selectedNumbers: [],
            isAnswerCorrect: null,
            redraws: prevState.redraws - 1,

        }), this.updateDoneStatus);
    };


    possibleSolutions = ({numberOfStars, usedNumber}) => {
        const possibleNumbers = _.range(1, 10).filter(number =>
            usedNumber.indexOf(number) === -1
        );

        return possibleCombinationSum(possibleNumbers, numberOfStars)
    };

    updateDoneStatus = () => {

        this.setState(prevState => {
            if(prevState.usedNumber.length === 9) {
                return { doneStatus: 'Done, Nice!' };
            }
            if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
                return { doneStatus: 'Game Over!' };
            }
        });
    };

    tick() {
        var min = Math.floor(this.secondsRemaining / 60);
        var sec = this.secondsRemaining - (min * 60);

        this.setState({
            minutes: min,
            seconds: sec,
        })

        if (sec < 10) {
            this.setState({
                seconds: "0" + this.state.seconds,
            })

        }

        if (min < 10) {
            this.setState({
                minutes: "0" + min,
            })

        }

        if (min === 0 && sec === 0) {

            clearInterval(this.interval);
            this.setState(() => ({
                redraws: 0,
                doneStatus: 'Game Over',
            }));



        }


        this.secondsRemaining--
    }



    startCountDown() {
        this.interval = setInterval(this.tick, 1000);
        let time = this.state.minutes;
        this.secondsRemaining = time * 60;
    }

        render () {
        return (
            <div className='container'>
                <hr />
                <h3>Play Nine</h3>
                <Timer minutes={this.state.minutes}
                       seconds={this.state.seconds}
                       startCountDown={this.startCountDown}

                />
                <div className="row">

                    <Stars numberOfStars = {this.state.numberOfStars}/>
              <Button selectedNumbers={this.state.selectedNumbers}
                      acceptAnswer ={this.acceptAnswer}
                      checkAnswer={this.checkAnswer}
                      isAnswerCorrect={this.state.isAnswerCorrect}
                      redraw = {this.redraw}
                      redraws={this.state.redraws}


              />
              <Answer selectedNumbers={this.state.selectedNumbers}
                      unselectNumber={this.unselectNumber}/>
                </div>
                <br />

                { this.state.doneStatus ?

                    <DoneFrame doneStatus={this.state.doneStatus}
                               resetGame = {this.resetGame}


                    />
                    :
                    <Numbers selectedNumbers={this.state.selectedNumbers}
                             selectNumber={this.selectNumber}
                             usedNumber= {this.state.usedNumber}
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
