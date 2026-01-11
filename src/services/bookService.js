/**
 * Book Service
 * Handles book-related API calls
 */

import authService from './authService';

class BookService {
  /**
   * Get all books (testing purposes)
   * @returns {Promise<Array>} List of all books
   */
  async getAllBooks() {
    try {
      const response = await fetch('/book/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all books error:', error);
      throw error;
    }
  }

  /**
   * Get paginated list of books with optional filters
   * @param {number} offset - Starting index (default 0)
   * @param {number} limit - Max number of books (default 5)
   * @param {string} author - Optional author filter
   * @param {string} genre - Optional genre filter
   * @returns {Promise<Array>} List of books
   */
  async getBooks(offset = 0, limit = 100, author = null, genre = null) {
    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (author) params.append('author', author);
      if (genre) params.append('genre', genre);

      const response = await fetch(`/book?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      return await response.json();
    } catch (error) {
      console.error('Get books error:', error);
      throw error;
    }
  }

  /**
   * Get a single book by ID
   * @param {number} id - Book ID
   * @returns {Promise<Object>} Book data
   */
  async getBookById(id) {
    try {
      const response = await fetch(`/book/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Book not found');
        }
        throw new Error('Failed to fetch book');
      }

      return await response.json();
    } catch (error) {
      console.error('Get book by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new book (Admin only)
   * @param {Object} bookData - Book data (title, author, genre)
   * @returns {Promise<Object>} Created book
   */
  async createBook(bookData) {
    try {
      const response = await fetch('/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin only.');
        }
        if (response.status === 409) {
          throw new Error('Book already exists');
        }
        if (response.status === 400) {
          throw new Error('Missing required fields');
        }
        throw new Error('Failed to create book');
      }

      return;
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  }

  /**
   * Delete a book by ID (Admin only)
   * @param {number} id - Book ID
   * @returns {Promise<void>}
   */
  async deleteBook(id) {
    try {
      const response = await fetch(`/book/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin only.');
        }
        if (response.status === 404) {
          throw new Error('Book not found');
        }
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  }
}

export default new BookService();
