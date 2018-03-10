import React, { Component } from 'react';
import { Sparklines, SparklinesBars} from 'react-sparklines';
import * as d3 from 'd3';
import _ from 'lodash';
import './index.css';

export default class CustomHeader extends Component {
  state = { hover: false };


  removeHist = () => {
    this.setState({ hist: null });
    setTimeout(() => {
      const el = document.getElementsByClassName("hist-holder");
      if (el.length===0) {
        this.props.updateHeaderHeight(40);
      }
    }, 0);
  }

  pinHistogram = () => {
    this.props.updateHeaderHeight(100);
    this.setState({ hist: true});
  }

  getHist = () => {
    const { hist } = this.buildHistogram();
    if (this.state.hist) {
      return (
        <div>
          <div onClick={this.removeHist} className="text-right" style={{ fontSize: 8 }}>
            x
          </div>
          <container className="hist-holder">{hist}</container>
        </div>
      );
    }
    return null;
  }

  getNTile(x, q) {
    return _.orderBy(x)[Math.round(q * x.length)];
  }

  buildHistogram() {
    let histData, infoTable;
    if (_.isNumber(this.props.data[0])) {
      histData = d3.histogram()(this.props.data).map((h) => h.length);;
      infoTable = (
        <table>
          <tr>
            <td>min</td>
            <td>{_.min(this.props.data)}</td>
          </tr>
          <tr>
            <td>25%</td>
            <td>{this.getNTile(this.props.data, 0.25)}</td>
          </tr>
          <tr>
            <td>Mean</td>
            <td>{_.round(_.mean(this.props.data), 2)}</td>
          </tr>
          <tr>
            <td>75%</td>
            <td>{this.getNTile(this.props.data, 0.75)}</td>
          </tr>
          <tr>
            <td>max</td>
            <td>{_.max(this.props.data)}</td>
          </tr>
        </table>
      );
    } else {
      const counts = _.countBy(this.props.data);
      histData = _.orderBy(_.values(counts));
      infoTable = (
        <table>
          {
            _.orderBy(_.toPairs(counts), (i) => -i[1]).slice(0, 5).map((item) => {
              return (
                <tr>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                </tr>
              );
            })
          }
        </table>
      );
    }
    const hist = (
      <Sparklines data={histData}>
        <SparklinesBars />
      </Sparklines>
    );
    return {
      hist,
      infoTable
    };
  }

  getHoverOver() {
    const { hist, infoTable } = this.buildHistogram();
    const position = {
      position: 'absolute',
      top: 165,
      left: this.props.left || 256,
    };

    return (
      <div className="modal modal-xsmall" style={position}>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <div className="control" style={{ width: 220 }}>
                <span>{this.props.label}</span>
              </div>
              <div className="control text-right">
                <span onClick={() => this.pinHistogram(hist)}>+</span>
                {' '}
                <span onClick={() => this.setState({ hover: false })}>x</span>
              </div>
            </div>
          </div>
          {hist}
          {infoTable}
        </div>
      </div>
    );
  }

  render() {
    return (
      <container>
        <container>
          {this.props.children}
          <br />
          <span className="column-header" onClick={() => this.setState({ hover: !this.state.hover})}>
            {this.props.label}
          </span>
          {this.getHist()}
        </container>
        {this.state.hover===true && this.getHoverOver()}
      </container>
    );
  }
}
