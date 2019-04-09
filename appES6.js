class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#book-form');
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className == 'delete') {
      // 1 tr, 2 td
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Load UI from local storage
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners for submit
document.getElementById('book-form').addEventListener('submit', function (e) {
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  //  Validate
  if (title === '' || author === '' || isbn === '') {


    // Error alert
    ui.showAlert('Please fill in all field', 'error')
  } else {


    // Add book to list
    ui.addBookToList(book);

    // Add to Local storage
    Store.addBook(book);

    // Show succes
    ui.showAlert('Book Added!', 'succes');
    ui.clearFields(); // title/author/#isbn
  }

  e.preventDefault();

});

// Event Listner for delete
document.getElementById('book-list').addEventListener('click', function (e) {

  // Instantiate UI & delete
  const ui = new UI();
  ui.deleteBook(e.target);

  // Remove from local storage
  // td titke
  // td author
  // td isbn child a
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show alert
  ui.showAlert('Book Remove!', 'succes');
  e.preventDefault();
})