var leftMargin = 30;

// var rectWidth = 80;
// var rectHeight = 120;
// var fontSize = 100;

var rectWidth = 40;
var rectHeight = 60;
var fontSize = 50;
var pointerFontSize = 40;

var pointerTriangleSize = 5;


function drawElement(two, x, y, text, color = '#bfffb3') {
    var rect = two.makeRectangle(x, y, rectWidth, rectHeight);
    rect.fill = color;
    rect.stroke = 'black'
    rect.linewidth = 1;
    // console.log(rect.x)
    // console.log(rect.width)
    // console.log(rect.translation._x)


    // var text = two.makeText(text, x, y + 15);
    var text = two.makeText(text, x, y);
    // text.family = "DejaVu Sans Mono"
    // text.family = "Consolas"
    // text.family = "Lucida Console"
    text.family = "Courier"

    text.size = fontSize
    text.alignment = 'center'
    text.baseline = 'middle'

    var group = two.makeGroup(rect, text);
    // console.log(group.x)
    // return group;

    return {
        group: group,
        rect: rect
    };
}

function drawPastLast(two, x, y) {
    var rect = two.makeRectangle(x, y, rectWidth, rectHeight);
    rect.fill = '#cacaca';
    rect.stroke = 'black'
    rect.linewidth = 1;

    var group = two.makeGroup(rect);
    // return group;

    return {
        group: group,
        rect: rect
    };

}

function drawIterator(two, elem, text, color = '#000075') {
    var x = elem.rect.translation._x;
    var y = elem.rect.translation._y + elem.rect.height / 2 + 20;

    var tri = two.makePolygon(x, y, pointerTriangleSize)
    tri.fill = color;
    tri.noStroke();

    var line = two.makeLine(x, y + pointerTriangleSize, x, y + 50);
    line.stroke = color;

    var text = two.makeText(text, x, y + 80);
    // text.family = "DejaVu Sans Mono"
    // text.family = "Consolas"
    // text.family = "Lucida Console"
    text.family = "Courier"
    
    text.size = pointerFontSize //80
    text.alignment = 'center'
    text.baseline = 'middle'
    text.fill = color;

    var group = two.makeGroup(tri, line, text);
    return group;
    // return {
    //     group: group,
    //     tri: tri
    // };
}

function moveIteratorTo(two, it, elem) {
    // console.log(it);
    var tri = it.children[0]
    it.translation.set(elem.rect.translation._x - tri.translation._x, 0);
    // it.group.translation.set(elem.rect.translation._x - it.tri.translation._x, 0);
}


function start(two) {

    var e0 = drawElement(two, leftMargin + 0 * rectWidth, rectWidth, "0");
    var e1 = drawElement(two, leftMargin + 1 * rectWidth, rectWidth, "1");
    var e2 = drawElement(two, leftMargin + 2 * rectWidth, rectWidth, "3");
    var e3 = drawElement(two, leftMargin + 3 * rectWidth, rectWidth, "5");
    var e4 = drawElement(two, leftMargin + 4 * rectWidth, rectWidth, "6", '#ff9191');
    var e5 = drawElement(two, leftMargin + 5 * rectWidth, rectWidth, "9");
    var e6 = drawPastLast(two,leftMargin + 6 * rectWidth, rectWidth);
    // var e7 = drawPastLast(two, leftMargin + 7 * rectWidth, rectWidth);
    
    // console.log(e1.width)

    var f = drawIterator(two, e0, "f");
    var l = drawIterator(two, e6, "l", '#d80500');

    return {
        elements: [e0, e1, e2, e3, e4, e5, e6],
        its: [f, l]
    };
}

// function drawArray(two, arr) {
    
//     var elements = []

//     for (let index = 0; index < arr.length; ++index) {
//         let value = arr[index];
//         var e = drawElement(two,  100 + index * rectWidth, rectWidth, value);
//         elements.push(e)
//         // console.log(value);
//     }

//     var e_last = drawPastLast(two, 100 + arr.length * rectWidth, rectWidth);
//     elements.push(e_last)

//     var f = drawIterator(two, elements[0], "f");
//     var l = drawIterator(two, e_last, "l", '#d80500');

//     two.update();

//     return {
//         elements: elements,
//         its: [f, l]
//     };
// }

function drawArray(two, arr) {
    
    var elements = []

    for (let index = 0; index < arr.length; ++index) {
        let value = arr[index];
        var e = drawElement(two,  leftMargin + index * rectWidth, rectWidth, value);
        elements.push(e)
        // console.log(value);
    }

    var e_last = drawPastLast(two, leftMargin + arr.length * rectWidth, rectWidth);
    elements.push(e_last)

    two.update();

    return elements;
}