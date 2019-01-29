// function start(two) {
//     var rect = two.makeRectangle(two.width / 2, two.height / 2, 500 ,500);
//     two.bind('update', function() {
//       rect.rotation += 0.001;
//     });
// }

function drawElement(two, x, y, text, color = '#bfffb3') {
    var rect = two.makeRectangle(x, y, 80, 120);
    rect.fill = color;
    rect.stroke = 'black'
    rect.linewidth = 1;
    // console.log(rect.x)
    // console.log(rect.width)
    // console.log(rect.translation._x)


    // var text = two.makeText(text, x, y + 15);
    var text = two.makeText(text, x, y);
    text.family = "DejaVu Sans Mono"
    text.size = 100
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
    var rect = two.makeRectangle(x, y, 80, 120);
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
    var y = elem.rect.translation._y + elem.rect.height / 2 + 50;

    var tri = two.makePolygon(x, y, 15)
    tri.fill = color;
    tri.noStroke();

    var line = two.makeLine(x, y + 15, x, y+115);
    line.stroke = color;

    var text = two.makeText(text, x, y + 115 + 120);
    text.family = "DejaVu Sans Mono"
    text.size = 100
    text.alignment = 'center'
    text.baseline = 'middle'
    text.fill = color;

    var group = two.makeGroup(tri, line, text);
    return {
        group: group,
        tri: tri
    };
}

function moveIteratorTo(two, it, elem) {
    it.group.translation.set(elem.rect.translation._x - it.tri.translation._x, 0);
}


function start(two) {

    // var circle = two.makeCircle(500, 80, 120);
    // circle.fill = '#FF8000';
    // circle.stroke = 'orangered'; // Accepts all valid css color
    // circle.linewidth = 5;

    var e0 = drawElement(two,  100 + 0 * 80, 80, "0");
    var e1 = drawElement(two,  100 + 1 * 80, 80, "1");
    var e2 = drawElement(two,  100 + 2 * 80, 80, "3");
    var e3 = drawElement(two,  100 + 3 * 80, 80, "5");
    var e4 = drawElement(two,  100 + 4 * 80, 80, "6", '#ff9191');
    var e5 = drawElement(two,  100 + 5 * 80, 80, "9");
    var e6 = drawPastLast(two, 100 + 6 * 80, 80);
    // var e7 = drawPastLast(two, 100 + 7 * 80, 80);
    
    // console.log(e1.width)

    var f = drawIterator(two, e0, "f");
    var l = drawIterator(two, e6, "l", '#d80500');

    return {
        elements: [e0, e1, e2, e3, e4, e5, e6],
        its: [f, l]
    };
}

function drawArray(two, arr) {
    
    var elements = []

    for (let index = 0; index < arr.length; ++index) {
        let value = arr[index];
        var e = drawElement(two,  100 + index * 80, 80, value);
        elements.push(e)
        // console.log(value);
    }

    var e_last = drawPastLast(two, 100 + arr.length * 80, 80);
    elements.push(e_last)

    var f = drawIterator(two, elements[0], "f");
    var l = drawIterator(two, e_last, "l", '#d80500');

    two.update();

    return {
        elements: elements,
        its: [f, l]
    };
}