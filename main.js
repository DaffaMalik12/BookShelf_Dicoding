// Menunggu hingga seluruh dokumen HTML telah dimuat sebelum menjalankan skrip
document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan referensi ke elemen formulir untuk menambahkan buku
  const inputBookForm = document.getElementById("inputBook");
  // Mendapatkan referensi ke elemen formulir untuk mencari buku
  const searchBookForm = document.getElementById("searchBook");
  // Mendapatkan referensi ke elemen daftar buku yang belum selesai dan yang sudah selesai
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  // Menambahkan event listener untuk menangani pengiriman formulir tambah buku
  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah perilaku default formulir
    addBook(); // Memanggil fungsi untuk menambahkan buku
  });

  // Menambahkan event listener untuk menangani pengiriman formulir pencarian buku
  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah perilaku default formulir
    searchBook(); // Memanggil fungsi untuk mencari buku
  });

  // Memuat buku-buku yang tersimpan pada local storage saat dokumen dimuat
  loadBooks();

  // Fungsi untuk menambahkan buku baru ke dalam daftar
  function addBook() {
    // Mendapatkan nilai input dari formulir
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

   // Membuat objek buku
      const book = {
        id: generateId(),
        title: title,
        author: author,
        year: Number(year), // Mengonversi year ke tipe data number
        isComplete: isComplete,
      };


    // Menambahkan buku ke dalam daftar buku
    addToBookshelf(book);
    // Menyimpan perubahan ke local storage
    saveBooks();
    // Mengosongkan formulir setelah buku ditambahkan
    inputBookForm.reset();
  }

  // Fungsi untuk menambahkan elemen buku ke dalam daftar buku yang sesuai
  function addToBookshelf(book) {
    // Membuat elemen buku
    const bookItem = createBookItem(book);

    // Menambahkan elemen buku ke dalam daftar yang sesuai (belum selesai atau sudah selesai)
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }

  // Fungsi untuk membuat elemen buku berdasarkan objek buku
  function createBookItem(book) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.dataset.id = book.id; // Menambahkan dataset id pada elemen buku

    // Membuat elemen judul buku
    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;

    // Membuat elemen penulis buku
    const authorElement = document.createElement("p");
    authorElement.textContent = "Penulis: " + book.author;

    // Membuat elemen tahun terbit buku
    const yearElement = document.createElement("p");
    yearElement.textContent = "Tahun: " + book.year;

    // Membuat elemen aksi (tombol selesai/belum selesai dan tombol hapus)
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    // Membuat tombol untuk mengubah status buku (selesai/belum selesai)
    const actionButton = document.createElement("button");
    actionButton.textContent = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
    actionButton.classList.add(book.isComplete ? "green" : "red");
    actionButton.addEventListener("click", function () {
      toggleBookStatus(book, bookItem);
    });

    // Membuat tombol untuk menghapus buku
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.textContent = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(book, bookItem);
    });

    // Menyusun elemen-elemen buku dalam elemen buku utuh
    actionDiv.appendChild(actionButton);
    actionDiv.appendChild(deleteButton);
    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(actionDiv);

    return bookItem;
  }

  // Fungsi untuk mengubah status buku (selesai/belum selesai)
  function toggleBookStatus(book, bookItem) {
    book.isComplete = !book.isComplete;
    const targetBookshelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
    targetBookshelfList.appendChild(bookItem);
    updateActionButton(book, bookItem);
    saveBooks();
  }

  // Fungsi untuk memperbarui tampilan tombol aksi berdasarkan status buku
  function updateActionButton(book, bookItem) {
    const actionButton = bookItem.querySelector(".action button");
    actionButton.textContent = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
    actionButton.classList.remove(book.isComplete ? "red" : "green");
    actionButton.classList.add(book.isComplete ? "green" : "red");
  }

  // Fungsi untuk menghapus buku
  function deleteBook(book, bookItem) {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      bookItem.remove();
      saveBooks(); // Menyimpan perubahan ke local storage setelah buku dihapus
    }
  }

  // Fungsi untuk mencari buku berdasarkan judul
  function searchBook() {
    // Mendapatkan judul pencarian dari formulir
    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();

    // Melakukan iterasi pada kedua daftar buku (belum selesai dan sudah selesai)
    [incompleteBookshelfList, completeBookshelfList].forEach(function (bookshelfList) {
      // Melakukan iterasi pada setiap elemen buku dalam daftar
      bookshelfList.childNodes.forEach(function (bookItem) {
        // Mendapatkan judul buku dari elemen buku
        const title = bookItem.querySelector("h3").textContent.toLowerCase();
        // Menentukan apakah judul buku mengandung kata kunci pencarian
        if (title.includes(searchTitle)) {
          bookItem.style.display = "block"; // Menampilkan elemen buku jika sesuai dengan pencarian
        } else {
          bookItem.style.display = "none"; // Menyembunyikan elemen buku jika tidak sesuai dengan pencarian
        }
      });
    });
  }

  // Fungsi untuk menyimpan buku-buku ke dalam local storage
  function saveBooks() {
    console.log("Saving books to localStorage");
    const incompleteBooks = getBooksFromList(incompleteBookshelfList);
    const completeBooks = getBooksFromList(completeBookshelfList);

    localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }

  // Fungsi untuk memuat buku-buku dari local storage saat halaman dimuat
  function loadBooks() {
    console.log("Loading books from localStorage");
    const incompleteBooks = JSON.parse(localStorage.getItem("incompleteBooks")) || [];
    const completeBooks = JSON.parse(localStorage.getItem("completeBooks")) || [];

    // Menambahkan buku-buku ke dalam daftar masing-masing
    incompleteBooks.forEach(function (book) {
      book.id = book.id || generateId(); // Menetapkan ID jika belum ada
      addToBookshelf(book);
    });

    completeBooks.forEach(function (book) {
      book.id = book.id || generateId(); // Menetapkan ID jika belum ada
      addToBookshelf(book);
    });
  }

  function getBooksFromList(bookshelfList) {
    const books = [];
  
    // Menggunakan querySelectorAll untuk mendapatkan hanya elemen buku (article.book_item)
    const bookItems = bookshelfList.querySelectorAll(".book_item");
  
    // Membersihkan array sebelum menambahkan buku-buku baru
    books.length = 0;
  
    bookItems.forEach(function (bookItem) {
      // Pastikan elemen ini adalah elemen HTML dan memiliki dataset
      if (bookItem.nodeType === 1 && bookItem.dataset) {
        const id = bookItem.dataset.id;
        const titleElement = bookItem.querySelector("h3");
        const authorElement = bookItem.querySelector("p:nth-child(2)");
        const yearElement = bookItem.querySelector("p:nth-child(3)");
        const actionButton = bookItem.querySelector("button");
  
        // Periksa apakah elemen yang diperlukan ditemukan dan memiliki teks sebelum mengakses propertinya
        const title = titleElement && titleElement.textContent.trim();
        const author = authorElement && authorElement.textContent.replace("Penulis: ", "").trim();
        const year = yearElement && yearElement.textContent.replace("Tahun: ", "").trim();
        const isComplete = actionButton ? actionButton.classList.contains("green") : false;
  
        // Hanya tambahkan buku ke array jika elemen-elemen yang diperlukan memiliki teks
        if (title && author && year !== undefined) {
          books.push({ id: id, title: title, author: author, year: year, isComplete: isComplete });
        }
      }
    });
  
    return books;
  }
  

  // Fungsi untuk menghasilkan ID unik
  function generateId() {
    // Generate a unique ID using the current timestamp
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
});
