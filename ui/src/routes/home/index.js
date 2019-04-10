import { h, Component } from 'preact';
import data from '../../../../content.json';
import Card from '../../components/card';
import SideNav from '../../components/sideNav';
import style from './style';

class Home extends Component {
  tags = {};

  state = {
    severity: 2,
    ruleId: ''
  };

  getTags = data => {
    this.tags = {};
    data.map(each => {
      each.messages.map(eachErr => {
        if (this.tags[eachErr.ruleId]) {
          this.tags[eachErr.ruleId] = this.tags[eachErr.ruleId] + 1;
        } else {
          this.tags[eachErr.ruleId] = 1;
        }
      });
    });
    return this.tags;
  };

  filter = (severity = 2, ruleId = '') => {
    this.setState({ severity, ruleId });
  };

  renderTags = () => {
    const allTags = this.getTags(data);
    return Object.keys(allTags).map(key => (
      <div
        className={style.tag}
        onClick={() => this.filter(this.state.severity, key)}
      >
        {key}
        &nbsp;
        <strong>{allTags[key]}</strong>
      </div>
    ));
  };

  render() {
    console.log(data);
    return (
      <div className={style.home}>
        <div>
          <SideNav data={data} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => this.filter(2)}>Errors</button>
          <button onClick={() => this.filter(1)}>Warnings</button>
        </div>
        <div style={{ marginTop: '20px' }}>{this.renderTags(data)}</div>
        {data.map(each => (
          <Card
            data={each}
            severity={this.state.severity}
            ruleId={this.state.ruleId}
          />
        ))}
      </div>
    );
  }
}
export default Home;
