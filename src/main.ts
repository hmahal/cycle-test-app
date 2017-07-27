import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver, h1} from '@cycle/dom';

//TODO: Work on this later today
function main() {

}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);