import React, { Component } from 'react';
import css from './Loader.module.css';

class Loader extends Component {
  render() {
    return <div className={css.loader}>Loading...</div>;
  }
}

export default Loader;
