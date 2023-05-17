import React, { Component } from 'react';
import axios from 'axios';
import css from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

class App extends Component {
  state = {
    images: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    showModal: false,
    modalImage: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImages();
    }
  }

  fetchImages = () => {
    const { currentPage, searchQuery } = this.state;
    const API_KEY = '34987662-26e97d4e150e3c854c752264a';
    const BASE_URL = 'https://pixabay.com/api/';
    const PER_PAGE = 12;

    this.setState({ isLoading: true });

    axios
      .get(
        `${BASE_URL}?q=${searchQuery}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`
      )
      .then(response => {
        this.setState(prevState => ({
          images: [...prevState.images, ...response.data.hits],
          currentPage: prevState.currentPage + 1,
        }));
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleFormSubmit = query => {
    this.setState({ searchQuery: query, currentPage: 1, images: [] });
  };

  handleLoadMore = () => {
    this.fetchImages();
  };

  handleImageClick = largeImageURL => {
    this.setState({ showModal: true, modalImage: largeImageURL });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, modalImage: '' });
  };

  render() {
    const { images, isLoading, showModal, modalImage } = this.state;

    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {images.length > 0 && (
          <ImageGallery>
            {images.map(image => (
              <ImageGalleryItem
                key={image.id}
                image={image}
                onImageClick={this.handleImageClick}
              />
            ))}
          </ImageGallery>
        )}

        {isLoading && <Loader />}

        {images.length > 0 && !isLoading && (
          <Button onClick={this.handleLoadMore} />
        )}

        {showModal && (
          <Modal image={modalImage} onClose={this.handleCloseModal} />
        )}
      </div>
    );
  }
}

export default App;
