/**
 * Library Service
 * Handles user library-related API calls
 */

import authService from './authService';

class LibraryService {
  /**
   * Get user's library with pagination and optional status filter
   * @param {number} offset - Starting index (default 0)
   * @param {number} limit - Max number of items (default 5)
   * @param {string} status - Optional status filter (WantToRead, CurrentlyReading, Read)
   * @returns {Promise<Array>} List of books in user's library
   */
  async getLibrary(offset = 0, limit = 100, status = null) {
    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (status) params.append('status', status);

      const response = await fetch(`/library?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('User not authenticated');
        }
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        throw new Error('Failed to fetch library');
      }

      return await response.json();
    } catch (error) {
      console.error('Get library error:', error);
      throw error;
    }
  }

  /**
   * Add a book to user's library
   * @param {number} bookId - Book ID
   * @param {string} status - Book status (WantToRead, CurrentlyReading, Read)
   * @returns {Promise<Object>} Added library entry
   */
  async addToLibrary(bookId, status = 'WantToRead') {
    try {
      const params = new URLSearchParams({
        bookId: bookId.toString(),
        status: status,
      });

      const response = await fetch(`/library?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Book is already in your library');
        }
        if (response.status === 404) {
          throw new Error('Book not found');
        }
        if (response.status === 401) {
          throw new Error('User not authenticated');
        }
        if (response.status === 503) {
          throw new Error('Book service unavailable');
        }
        throw new Error('Failed to add book to library');
      }

      return ;
    } catch (error) {
      console.error('Add to library error:', error);
      throw error;
    }
  }

  /**
   * Remove a book from user's library
   * @param {number} bookId - Book ID
   * @returns {Promise<void>}
   */
  async removeFromLibrary(bookId) {
    try {
      const response = await fetch(`/library/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Book not found in library');
        }
        if (response.status === 401) {
          throw new Error('User not authenticated');
        }
        throw new Error('Failed to remove book from library');
      }
    } catch (error) {
      console.error('Remove from library error:', error);
      throw error;
    }
  }
}

export default new LibraryService();
