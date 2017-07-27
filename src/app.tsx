import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { Sources, Sinks } from './interfaces';
import {TimeSource} from "@cycle/time";

export type AppSources = Sources & { onion : StateSource<AppState> };
export type AppSinks = Sinks & { onion : Stream<Reducer> };
export type Reducer = (prev : AppState) => AppState;
export type AppState = {
    count : number;
    currentTime : Date;
};

//Sources can be thought of as signals
export function App(sources : AppSources) : AppSinks
{
    const action$ : Stream<Reducer> = intent(sources.DOM, sources.Time);
    const vdom$ : Stream<VNode> = view(sources.onion.state$);

    return {
        DOM: vdom$,
        onion: action$
    };
}

function intent(DOM : DOMSource, Time: TimeSource) : Stream<Reducer>
{
    const init$ : Stream<Reducer> = xs.of<Reducer>(() => ({ count: 0, currentTime: new Date() }));

    const add$ : Stream<Reducer> = DOM.select('.add').events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count + 1 }));

    const subtract$ : Stream<Reducer> = DOM.select('.subtract').events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count - 1 }));

    const time$ : Stream<Reducer> = Time.periodic(2000)
      .mapTo<Reducer>(state => ({...state, currentTime: new Date()}));

    return xs.merge(init$, add$, subtract$, time$);
}

function view(state$ : Stream<AppState>) : Stream<VNode>
{
    return state$
        .map(s =>
            <div>
                <Dumb dummy="Haro"/>
                <h2>My Awesome Cycle.js app @{s.currentTime.toDateString()}</h2>
                <span>{ 'Counter: ' + s.count }</span>
                <button type='button' className='add'>Increase</button>
                <button type='button' className='subtract'>Decrease</button>
            </div>
        );
}

function Dumb({dummy}:{dummy:string}){
  return (
    <h1 className="dummy">Hi {dummy}!</h1>
  )
}

function Counter({count}:{count:number}) {
  return (
    <div className="counter">
      <span>{"Counter: " + count}</span>
    </div>
  )
}
