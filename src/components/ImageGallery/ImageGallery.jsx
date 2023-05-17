import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './ImageGallery.module.css';

class ImageGallery extends Component {
  render() {
    return <ul className={css.ImageGallery}>{this.props.children}</ul>;
  }
}

ImageGallery.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ImageGallery;
