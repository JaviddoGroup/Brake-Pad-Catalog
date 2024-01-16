function convertImageToDataURL(imagePath, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        var dataURL = canvas.toDataURL();
        callback(dataURL);
    };

    img.src = imagePath;
}

// Пример использования
convertImageToDataURL('https://www.javiddo.com/storage/gallery/39fefd06-1d16-4d8c-badb-0d3d4d71c2fa.png', function (dataURL) {
    console.log(dataURL);
});




<script>
    function convertExcelToPDF() {
    var excelFilePath = './DataBase/TestDataBase.xlsx';

    var reader = new FileReader();

    reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, {type: 'array' });
    var firstSheetName = workbook.SheetNames[0];
    var ws = workbook.Sheets[firstSheetName];
    var jsonData = XLSX.utils.sheet_to_json(ws, {header: 1 });

    // Обработка данных
    var cleanedData = removeEmptyCells(jsonData);

    // Предварительная загрузка изображения
    var watermarkImage = new Image();
    watermarkImage.crossOrigin = 'Anonymous';
    watermarkImage.src = './media/svg/WaterMark.svg';

    watermarkImage.onload = function () {
            // Конвертация изображения в Data URL
            var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = watermarkImage.width;
    canvas.height = watermarkImage.height;
    ctx.drawImage(watermarkImage, 0, 0, watermarkImage.width, watermarkImage.height);

    var dataURL = canvas.toDataURL();

    // Генерация PDF
    var pdfDoc = {
        content: [
    {
        table: {
        headerRows: 1,
    body: cleanedData
                        },
    layout: 'lightHorizontalLines' // Добавим горизонтальные линии в таблицу
                    }
    ],
    background: function (currentPage) {
                    return [
    {
        image: dataURL,
    width: 500,  // Ширина страницы в точках (A4: 595.28)
    height: 500, // Высота страницы в точках (A4: 841.89)
    absolutePosition: {x: 50, y: 250 },
    opacity: 0.1,  // Прозрачность изображения
    angle: 45  // Угол вращения (в градусах)
                        }
    ];
                },
    pageMargins: [0, 0, 0, 0],
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageAlignment: 'center' // Центрирование страницы
            };

    pdfMake.createPdf(pdfDoc).download("converted_data.pdf");
        };
    };

    fetch(excelFilePath)
        .then(response => response.arrayBuffer())
        .then(buffer => {
        reader.readAsArrayBuffer(new Blob([buffer]));
        })
        .catch(error => console.error('Error fetching the Excel file:', error));
}

    function removeEmptyCells(jsonData) {
    // Удаляем пустые ячейки из каждой строки данных
    var cleanedData = jsonData.map(row => row.filter(cell => cell !== undefined && cell !== null && cell !== ''));

    // Находим максимальное количество ячеек в строках после удаления пустых
    var maxCells = Math.max(...cleanedData.map(row => row.length));

    // Добавляем недостающие ячейки в каждую строку после удаления пустых
    cleanedData = cleanedData.map(row => {
        var diff = maxCells - row.length;
        if (diff > 0) {
            return row.concat(Array(diff).fill(''));
        }
    return row;
    });

    return cleanedData;
}
</script>