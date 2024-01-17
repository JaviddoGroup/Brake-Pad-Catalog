function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}
function convertExcelToPDF() {
    var excelFilePath = './DataBase/TestDataBase.xlsx';

    var reader = new FileReader();

    reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        var firstSheetName = workbook.SheetNames[0];
        var ws = workbook.Sheets[firstSheetName];
        var jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Обработка данных
        var cleanedData = removeEmptyCells(jsonData);

        // Генерация PDF
        var pdfDoc = {
            content: [
                {
                    table: {
                        headerRows: 1,
                        body: cleanedData.map(row => row.map(cell => {
                            return {
                                text: cell,
                                alignment: 'center', // Выравнивание текста по горизонтали
                                lineHeight: 1.2, // Высота строки (множитель)
                                margin: [5, 10],
                                noWrap: true // Отступы вокруг текста в ячейке (вертикальный отступ больше)
                            };
                        })),
                        widths: Array(cleanedData[0].length).fill('*'), // Установим ширину колонок по содержимому
                        alignment: 'center' // Центрирование таблицы
                    },
                    layout: 'lightHorizontalLines' // Сохраняем горизонтальные линии
                }
            ],
            background: createWatermarkBase64(),
            pageMargins: [50, 50, 50, 50],
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pagePaddings: [0, 30],
        };

        pdfMake.createPdf(pdfDoc).download("converted_data.pdf");
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

function createWatermarkBase64() {
    // Замените 'path/to/your/image.png' на путь к вашему изображению в формате PNG
    var imagePath = './media/svg/WaterMark.svg';

    // Преобразование изображения в base64
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();

    img.src = imagePath;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    var dataURL = canvas.toDataURL('image/png');

    return { image: dataURL, width: 500, height: 500, absolutePosition: { x: 50, y: 250 }, opacity: 0.1 };
}




// Путь к вашему Excel-файлу
var excelFilePath = './DataBase/TestDataBase.xlsx';

var req = new XMLHttpRequest();
req.open('GET', excelFilePath, true);
req.responseType = 'arraybuffer';

req.onload = function (e) {
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, { type: 'array' });
    var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    document.getElementById('table-container').innerHTML = jsonToTable(jsonData);
};

req.send();

function jsonToTable(jsonData) {
    var table = '<table>';
    table += '<tr>';
    for (var key in jsonData[0]) {
        table += '<th>' + key + '</th>';
    }
    table += '</tr>';

    for (var i = 0; i < jsonData.length; i++) {
        table += '<tr>';
        for (var key in jsonData[i]) {
            table += '<td>' + jsonData[i][key] + '</td>';
        }
        table += '</tr>';
    }
    table += '</table>';

    return table;
}