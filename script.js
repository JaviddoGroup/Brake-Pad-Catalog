function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}





// База данных из эксель в таблицу
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

// Конец Функции База данных из эксель в таблицу


async function convertExcelToPDF() {
    var excelFilePath = './DataBase/TestDataBase.xlsx';
    var reader = new FileReader();

    reader.onload = async function (e) {
        try {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var firstSheetName = workbook.SheetNames[0];
            var ws = workbook.Sheets[firstSheetName];
            var jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

            // Обработка данных
            var cleanedData = removeEmptyCells(jsonData);

            // Генерация PDF
            var watermark = await createWatermarkBase64();
            var pdfDoc = {
                content: [
                    {
                        table: {
                            headerRows: 1,
                            body: cleanedData.map(row => row.map(cell => {
                                return {
                                    text: cell,
                                    alignment: 'center',
                                    lineHeight: 1.2,
                                    margin: [5, 10],
                                    noWrap: true
                                };
                            })),
                            widths: Array(cleanedData[0].length).fill('*'),
                            alignment: 'center'
                        },
                        layout: 'lightHorizontalLines'
                    }
                ],
                background: watermark,
                pageMargins: [50, 50, 50, 50],
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pagePaddings: [0, 30],
            };

            pdfMake.createPdf(pdfDoc).download("converted_data.pdf");
        } catch (error) {
            console.error('Error processing Excel data:', error);
        }
    };

    try {
        var response = await fetch(excelFilePath);
        var buffer = await response.arrayBuffer();
        reader.readAsArrayBuffer(new Blob([buffer]));
    } catch (error) {
        console.error('Error fetching the Excel file:', error);
    }
}

function removeEmptyCells(jsonData) {
    var cleanedData = jsonData.map(row => row.filter(cell => cell !== undefined && cell !== null && cell !== ''));
    var maxCells = Math.max(...cleanedData.map(row => row.length));

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
    var imagePath = './media/image/WaterMark.png';
    var img = new Image();
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL('image/png');
            resolve({ image: dataURL, width: 500, height: 500, absolutePosition: { x: 50, y: 250 }, opacity: 0.1 });
        };

        img.onerror = function (error) {
            reject(error);
        };

        img.src = imagePath;
    });
}



