import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import css from './App.module.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34987662-26e97d4e150e3c854c752264a';
const PER_PAGE = 12;

class App extends Component {
  state = {
    searchQuery: '',
    currentPage: 1,
    images: [],
    totalImages: 0,
    isLoading: false,
    showModal: false,
    selectedImage: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, currentPage } = this.state;

    if (
      prevState.searchQuery !== searchQuery ||
      prevState.currentPage !== currentPage
    ) {
      this.setState({ isLoading: true }, () => {
        fetch(
          `${BASE_URL}?q=${searchQuery}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`
        )
          .then(response => response.json())
          .then(data => {
            if (data.total === 0) {
              alert('No images found');
              return;
            }

            this.setState(prevState => ({
              images: [...prevState.images, ...data.hits],
              totalImages: data.total,
              isLoading: false,
            }));
          })
          .catch(error => {
            console.error('Error:', error);
            this.setState({ isLoading: false });
          });
      });
    }
  }

  handleSubmit = searchQuery => {
    if (this.state.searchQuery === searchQuery) {
      alert(`You already searched for "${searchQuery}"`);
      return;
    }

    this.setState({ searchQuery, currentPage: 1, images: [], totalImages: 0 });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  };

  handleImageClick = image => {
    this.setState({ showModal: true, selectedImage: image });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedImage: null });
  };

  render() {
    const { images, isLoading, showModal, selectedImage } = this.state;

    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleSubmit} />

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
          <Modal image={selectedImage} onClose={this.handleCloseModal} />
        )}
      </div>
    );
  }
}

export default App;
