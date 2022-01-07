let types = ["Unknown", "ELEMENT", "ATTRIBUTE", "TEXT", "CDATA", "INSTRUCTION", "COMMENT", "DOCUMENT", "DOCUMENT_TYPE", "FRAGMENT"];
let nodes;

function saveDoc() {
    if (nodes && nodes[0]) {
        let doc = new XMLSerializer().serializeToString(nodes[0]);
        document.getElementById("save-button").setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
    } else {
        alert("Сначала нажмите кнопку загрузки документа");
    }
}

function loadDoc() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        createTable(this.responseXML);
    }
    xhttp.open("GET", "cd_catalog.xml");
    xhttp.send();
}
function createTable(xmlDoc) {
    nodes = [];
    let table = "<tr><th>Уровень вложенности</th><th>Значение</th></tr>";
    dumpNode(xmlDoc, 1);
    document.getElementById("demo").innerHTML = table;

    function dumpNode(node, level) { //Обрабатывает один узел и всех его детей
        nodes.push(node);
        let valueElem = '';
        if (node.nodeValue !== null) {
            valueElem = `<input type='text' value='${node.nodeValue}' onchange='setNodeValue(${nodes.length - 1}, this.value)'/>`;
        }
        let addTextAtStartButton  = '';
        if (node instanceof Element) {
            addTextAtStartButton = `<button class="button-add" onclick="addTextAtStart(${nodes.length - 1})">Добавить</button>`;
        }
        table += `<tr><td>${level}</td>` +
                 `<td>${valueElem}</td>` + 
                 `<td><button class="button-delete" onclick="removeNode(${nodes.length - 1})">Удалить</button></td>` +
                 `<td>${addTextAtStartButton}</td></tr>`;
        if (node.attributes)
            for (let i = 0; i < node.attributes.length; ++i)
                dumpNode(node.attributes.item(i), level + 1);
        node.childNodes.forEach(node => dumpNode(node, level + 1));
    }
}

function removeNode(i) {
    let node = nodes[i];
    let parent = node.parentNode;
    if (parent) {
        parent.removeChild(node);
        createTable(nodes[0]);
    } else if (node instanceof Attr) {
        node.ownerElement.removeAttributeNode(node);
        createTable(nodes[0]);
    } else {
        alert("Can't remove root");
    }
}

function addTextAtStart(i) {
    nodes[i].prepend('New text');
    createTable(nodes[0]);
}

function setNodeValue(i, value) {
    nodes[i].nodeValue = value;
}