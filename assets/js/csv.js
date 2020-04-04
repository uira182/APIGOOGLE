function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    console.log(allRows.length)
    var table = '';
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        if (singleRow !== 0) {
            table += '<tr>';
        }
        var rowCells = allRows[singleRow].split(',');
        for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
            if (singleRow !== 0) {
                table += '<td>';
                table += rowCells[rowCell];
                table += '</td>';
            }
        }
        if (singleRow !== 0) {
            table += '</tr>';
        }
    }
    console.log(table)
    $('#dataSearch').append(table);
}

$.ajax({
    url: './assets/files/file.csv',
    dataType: 'text',
}).done(successFunction);