import React, {Component} from 'react'
import cls from './HomeView.scss'

class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cls.home}>
        <h4>Welcome!</h4>
        Scroll down to see the bottom right gray button.
      </div>
    );
  }

}

export default HomeView
