const exportToPdf = async () => {
    const content = document.getElementById("content-editable");
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const fileName = prompt("Nombre del archivo", "table");
      pdf.save(fileName + ".pdf");
    });
};

const exportTableToExcel = () => {
    const dataType = "application/vnd.ms-excel";
    const tableSelect = document.getElementById("content-editable");
    const tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

    // Specify file name
    let fileName = prompt("Nombre del archivo", "table");
    if (!fileName) return;
    fileName = fileName + ".xls";

    // Create download link element
    const downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(["\ufeff", tableHTML], {
            type: dataType,
        });
        navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        // Create a link to the file
        downloadLink.href = "data:" + dataType + ", " + tableHTML;

        // Setting the file name
        downloadLink.download = fileName;

        //triggering the function
        downloadLink.click();
    }
};

const exportText = (type = '.html') => {
    // Obtiene el contenido del div
    const contenido = document.getElementById("content-editable").innerHTML;

    // Crea un objeto Blob con el contenido del div
    const blob = new Blob([contenido], { type : 'text/plain;charset=utf-8' });

    // Crea un enlace de descarga para el objeto Blob
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // Specify file name
    let fileName = prompt("Nombre del archivo", "table");
    if (!fileName) return;
    link.download = fileName + type;
    link.click();
};

const loadFile = () => {
    // Obtiene el archivo seleccionado
    const file = document.getElementById("file-upload").files[0];

    // Crea un objeto de lectura de archivos
    const reader = new FileReader();

    // Carga el archivo Excel
    reader.readAsBinaryString(file);

    // Cuando se completa la carga del archivo
    reader.onload = function (e) {
        // Obtiene los datos del archivo Excel
        const result = e.target.result;

        // Obtiene el tipo o formato del archivo
        const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);

        switch (fileType) {
            case "pdf":
                loadPdf(file);
                break;
            case "txt":
            case "html":
                loadText(result);
                break;
            case "xls":
            case "xlsx":
                loadExcel(result);
                break;
            default:
                alert("Archivo no permitido");
                break;
        }
    };
}

const loadPdf = file => {
    const pdf = document.createElement("object");
    pdf.type = "application/pdf";
    pdf.data = URL.createObjectURL(file);
    pdf.width = "100%";
    pdf.height = "600px";

    // Obtener el elemento contenedor
    const contenedor = document.getElementById("content-editable");

    // Eliminar cualquier objeto previo del contenedor
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
    contenedor.appendChild(pdf);
};

const loadText = result => {
    const content = document.getElementById("content-editable");
    content.innerHTML = result;
};

const loadExcel = result => {
    // Crea un libro de Excel a partir de los datos
    const workbook = XLSX.read(result, { type: "binary" });

    // Selecciona la primera hoja del libro
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convierte los datos de la hoja en un arreglo de JavaScript
    let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    data = data.map(row => row.map(r => r?.toString().trim()));
    // Crea la tabla HTML
    let html = "<table>";
    for (var i = 0; i < data.length; i++) {
        html += "<tr>";
        for (var j = 0; j < data[i].length; j++) {
            const value = data?.[i]?.[j] ?? "";
            html += "<td>" + value + "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";

    // Agrega la tabla HTML a la página
    document.getElementById("content-editable").innerHTML = html;
};


const loadTable = () => {
    // Preguntamos el numero de columnas y filas
    let cols = prompt("Numero de columnas", 3);
    if (!cols) return;
    let rows = prompt("Numero de filas", 6);
    if (!rows) return;

    let html = "<table>";
    for (var i = 0; i < rows; i++) {
        html += "<tr>";
        for (var j = 0; j < cols; j++) {
            html += "<td></td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("content-editable").innerHTML = html;
}

const clearContent = () => {
    document.getElementById("content-editable").innerHTML = null;
}