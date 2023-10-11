const books = [];
const RENDER_EVENT = 'render-book';
document.addEventListener('DOMContentLoaded', function() {
    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function(e) {
        e.preventDefault();
        const titleBook = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = document.getElementById('inputBookYear').value;
        const bookIsComplete = document.getElementById('inputBookIsComplete');
        let finishedReading = false;
        if (bookIsComplete.checked) {
            finishedReading = true;
        }
        const generatedID = +new Date();
        const bookObject = {
            id: generatedID,
            title: titleBook,
            author: bookAuthor,
            year: bookYear,
            isComplete: finishedReading,
        }
        books.push(bookObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDatas();
    });
    if (haveStorage()) {
        getDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function() {
    console.log(books);
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (let bookItem of books) {
        const bookElement = makeDoneBook(bookItem);
        if (!bookItem.isComplete) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }
});

function makeDoneBook(bookObject) {
    const Book_Title = document.createElement('h3');
    const Penulis = document.createElement('p');
    const Tahun = document.createElement('p');
    Book_Title.innerText = bookObject.title;
    Penulis.innerText = bookObject.author;
    Tahun.innerText = bookObject.year;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(Book_Title, Penulis, Tahun);

    const action = document.createElement('div');
    action.classList.add('action');

    article.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const greenNotYet = document.createElement('button');
        greenNotYet.classList.add('green');
        greenNotYet.innerText = 'Belum Selesai dibaca';
       
        action.append(greenNotYet);
        article.append(Book_Title, Penulis, Tahun, action);

        greenNotYet.addEventListener('click', function() {
            finishedReading = false;
            bookObject.isComplete = finishedReading; 
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDatas();
        });
    } else {
        const greenDone = document.createElement('button');
        greenDone.classList.add('green');
        greenDone.innerText = 'Selesai dibaca';
        
        action.append(greenDone);
        article.append(Book_Title, Penulis, Tahun, action);

        greenDone.addEventListener('click', function() {
            finishedReading = true;
            bookObject.isComplete = finishedReading; 
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDatas();
        });
    }
    const redDelete = document.createElement('button');
    redDelete.classList.add('red');
    redDelete.innerText = 'Hapus buku';
    
    action.append(redDelete);
    article.append(Book_Title, Penulis, Tahun, action);

    redDelete.addEventListener('click', function() {
        const bookTarget = findBookindex(bookObject.id);
        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDatas();
    });

    return article;
}

function findBookindex(id) {
    for (let index in books) {
        if (books[index].id === id) {
            return index;
        }
    }
    return -1;
}

function saveDatas() {
    if (haveStorage()) {
        localStorage.setItem(BOOKCASE_KEY, JSON.stringify(books));
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const BOOKCASE_KEY = 'BOOKCASE_KEY';

function haveStorage() {
    if (typeof (Storage) !== undefined) {
        return true;
    } else {
        alert('Browser kamu tidak mendukung Web Storage. Update dong!');
    }
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(BOOKCASE_KEY));
    const modal = document.getElementById('modal');
    modal.style.position = 'static';
    modal.style.visibility = 'visible';
    setTimeout(function() {
        modal.style.position = 'absolute';
        modal.style.visibility = 'hidden';
    }, 3000)
});

function getDataFromStorage() {
    let data = JSON.parse(localStorage.getItem(BOOKCASE_KEY));
    if (data !== null) {
        for(const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
