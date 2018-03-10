import React, { Component } from 'react';
import { Column, Table } from 'react-virtualized';
import _ from 'lodash';
import CustomHeader from './components/CustomHeader';
import 'react-virtualized/styles.css';
import './index.css';


export default class extends Component {
  state = {
    n: 100 * 1000,
    headerHeight: 40,
    visibleData: [],
    data: [],
    filter: {},
  };

  componentDidMount() {
    this.setState({ visibleData: this.props.data });
  }

  updateFilter = (col, q) => {
    q = q.toLowerCase();
    let { filter } = this.state;
    filter[col] = q;
    this.setState({ filter });

    if (_.isEmpty(filter)) {
      this.setState({ visibleData: this.props.data });
      return;
    }
    const visibleData = this.props.data.filter((row) => {
      const matches = _.toPairs(filter).map((item) => {
        const col = item[0];
        const querystring = item[1];
        return row[col].toString().toLowerCase().indexOf(querystring) > -1 ? 1 : 0;
      });
      return _.sum(matches)===matches.length;
    });
    this.setState({ visibleData });
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

    const columns = _.keys(this.props.data[0]);

    return (
      <div>
        <Table
          width={window.innerWidth - 50}
          height={600}
          headerHeight={this.state.headerHeight}
          rowHeight={30}
          rowCount={this.state.visibleData.length}
          rowGetter={({ index }) => this.state.visibleData[index]}
        >
          {
            columns.map((columnName, i) => {
              return (
                <Column
                  width={200}
                  label={_.capitalize(columnName)}
                  dataKey={columnName}
                  headerRenderer={(col) => {
                    return (
                      <CustomHeader
                        label={col.label}
                        updateHeaderHeight={(newHeight) => this.setState({ headerHeight: newHeight })}
                        left={i * 200 - 200}
                        data={_.map(this.state.visibleData, columnName)}>
                        <input
                          type="text"
                          value={this.state.filter[columnName] || ''}
                          onChange={evt => this.updateFilter(columnName, evt.target.value)}
                        />
                      </CustomHeader>
                    );
                  }}
                />
              );
            })
          }
        </Table>
        <p><small><b>displaying {this.formatNumber(this.state.visibleData.length)} of {this.formatNumber(this.props.data.length)} rows</b></small></p>
      </div>
    ); 
  }
}
