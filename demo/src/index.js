import React, { Component } from 'react'
import { render } from 'react-dom'
import faker from 'faker';
import _ from 'lodash';

import SuperTable from '../../src'
import './index.css';

class Demo extends Component {
  state = {
    n: _.parseInt(window.location.pathname.slice(1)) || 10 * 1000
  }

  getData() {
    return _.range(0, this.state.n).map((idx) => {
      return {
        idx: idx + 1,
        name: faker.name.findName(),
        email: faker.internet.email(),
        'Favorite Color': faker.commerce.color(),
        aField: _.random(0, 1000, false),
        anotherField: _.round(_.random(0, 1, true), 2),
        'a third numeric': _.round(_.random(0, 1000000, true), 2),
        'sixth numerical field': _.round(_.random(-1000, 100, true), 2),
      };
    });
  }
  
  formatNumber(x) {
    x = x.toString();
    x = x.split('').reverse();;
    let y = [];
    y.push(x[0]);
    for(var i=1; i<x.length; i++) {
      if (i%3===0) {
        y.push(',');
      }
      y.push(x[i]);
    }

    y.reverse();
    return y.join('');
  }

  render() {
    return (
      <div>
        <a href="https://github.com/glamp/supertable">
          <img style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
            alt="Fork me on GitHub" />
        </a>
        <br />
        <h2>SuperTable</h2>
        <h4>
          {
            [100, 1000, 10000, 100000].map((i) => {
              return (
                <span>
                  <a href={`/${i}`}>
                    {this.formatNumber(i)}
                  </a>
                  {' '}
                </span>
              );
            })
          }
        </h4>
        <SuperTable data={this.getData()} />
      </div>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
