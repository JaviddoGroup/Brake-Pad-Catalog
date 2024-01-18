document.addEventListener('DOMContentLoaded', function () {
    // Контейнер для страниц книги
    const pdfContainer = document.getElementById('flipbook');

    // Путь к папке с PDF-файлами
    const pdfFolderPath = './DataBase/';

    // Загружаем все PDF-файлы из папки
    fetchPDFs();

    // Функция для загрузки PDF-файлов
    function fetchPDFs() {
        // Замените fetch на код, который загружает список PDF-файлов с сервера
        // В данном примере мы просто указываем имена файлов
        const pdfFiles = ['TestBook.pdf', 'TestBook1.pdf',];

        // Перебираем каждый PDF-файл
        pdfFiles.forEach(pdfFile => {
            // Формируем полный путь к файлу
            const pdfPath = pdfFolderPath + pdfFile;

            // Создаем элемент страницы книги
            const pageElement = document.createElement('div');
            pageElement.className = 'page'; // Добавляем класс для стилизации

            // Загружаем PDF и отображаем его на странице
            loadPDF(pdfPath, pageElement);

            // Добавляем страницу к контейнеру
            pdfContainer.appendChild(pageElement);
        });

        // Инициализация эффекта перелистывания
        $('#flipbook').turn();
    }

    // Функция для загрузки и отображения PDF на странице
    function loadPDF(pdfPath, pageElement) {
        // Загружаем PDF
        pdfjsLib.getDocument(pdfPath).promise.then(function (pdfDocument) {
            // Получаем первую страницу PDF
            pdfDocument.getPage(1).then(function (pdfPage) {
                // Получаем размеры страницы в пикселях
                const viewport = pdfPage.getViewport({ scale: 1 });

                // Создаем элемент для отображения PDF
                const pdfCanvas = document.createElement('canvas');
                pdfCanvas.width = viewport.width;
                pdfCanvas.height = viewport.height;

                // Отображаем PDF на созданном элементе
                const pdfContext = pdfCanvas.getContext('2d');
                pdfPage.render({ canvasContext: pdfContext, viewport: viewport });

                // Добавляем элемент с PDF на страницу
                pageElement.appendChild(pdfCanvas);
            });
        });
    }
});
