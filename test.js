/*
Copyright Fernando Pelliccioni 2019

Distributed under the Boost Software License, Version 1.0. (See accompanying
file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt) 
*/


var twp_width_ref = 1389; //926;
var two_height_ref = 409.5; //273;

function escale_gen(a) {
    var h = twp_width * a / twp_width_ref
    var v = two_height * a / two_height_ref

    if (h < v) return h;
    return v;
}
function escale_x(a) {
    return escale_gen(a);
    // return twp_width * a / twp_width_ref
}

function escale_y(a) {
    return escale_gen(a);
    // return two_height * a / two_height_ref
}

function escale_font(a) {
    return escale_gen(a);
    // var o1 = twp_width * a / twp_width_ref
    // var o2 = two_height * a / two_height_ref
    // console.log("escale_font")
    // console.log(a)
    // console.log(o1)
    // console.log(o2)
    // return twp_width * a / twp_width_ref
}

function escale_other(a) {
    return escale_gen(a);
    // return twp_width * a / twp_width_ref
}

var defaultLeftMargin = 0;
var defaultTopMargin = 0;
var sequenceTotalHeight = 0;
var variableTotalHeight = 0;
var rectWidth = 0;
var rectHeight = 0;
var fontSize = 0;
var indexFontSize = 0;
var pointerFontSize = 0;
var labelFontSize = 0;
var pointerTriangleSize = 0;

var defaultElementColor = '#bfffb3'



function setSizes() {

    defaultLeftMargin = escale_x(10);
    defaultTopMargin = escale_y(0);
    sequenceTotalHeight = escale_y(130);
    variableTotalHeight = escale_y(70);
    
    
    // console.log(defaultLeftMargin)
    // console.log(defaultTopMargin)
    // console.log(sequenceTotalHeight)
    // console.log(variableTotalHeight)
    
    // rectWidth = escale_x(80);
    // rectHeight = escale_y(120);
    // fontSize = escale_font(100);
    
    rectWidth = escale_x(40);
    rectHeight = escale_y(60);
    fontSize = escale_font(32);
    indexFontSize = escale_font(15);
    pointerFontSize = escale_font(32);
    labelFontSize = escale_font(24);
    
    pointerTriangleSize = escale_other(5);
}

function drawElement(two, x, y, text, index, color = defaultElementColor) {

    var textIndex = two.makeText(index, x, y + escale_y(8));
    textIndex.family = "Source Code Pro";
    textIndex.size = indexFontSize
    textIndex.fill = 'white';

    var rect = two.makeRectangle(x, y + escale_y(45), rectWidth, rectHeight);
    rect.fill = color;
    rect.stroke = 'black'
    rect.linewidth = 1;
    // console.log(rect.x)
    // console.log(rect.width)
    // console.log(rect.translation._x)


    var text = two.makeText(text, x, y + escale_y(45) + escale_y(1.5));
    text.family = "Source Code Pro";
    text.size = fontSize

    var group = two.makeGroup(rect, text, textIndex);
    // console.log(group.x)
    // return group;

    return {
        group: group,
        rect: rect
    };
}


function drawPastLast(two, x, y) {
    var rect = two.makeRectangle(x, y + escale_y(45), rectWidth, rectHeight);
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

function drawIterator(two, elem, text, color = '#99ff99') {
    var x = elem.rect.translation._x;
    var y = elem.rect.translation._y + elem.rect.height / 2 + escale_y(20);

    var tri = two.makePolygon(x, y, pointerTriangleSize)
    tri.fill = color;
    tri.noStroke();

    // var line = two.makeLine(x, y + pointerTriangleSize, x, y + 50);
    // line.stroke = color;

    // var text = two.makeText(text, x, y + 80);

    var text = two.makeText(text, x, y + escale_y(24));
    text.family = "Source Code Pro";
    
    text.size = pointerFontSize //80
    text.alignment = 'center'
    text.baseline = 'middle'
    text.fill = color;

    // var group = two.makeGroup(tri, line, text);
    var group = two.makeGroup(tri, text);
    return group;
    // return {
    //     group: group,
    //     tri: tri
    // };
}

// function moveIteratorTo(two, it, elem) {
//     // console.log(it);
//     var tri = it.children[0]
//     it.translation.set(elem.rect.translation._x - tri.translation._x, 0);
//     // it.group.translation.set(elem.rect.translation._x - it.tri.translation._x, 0);
// }

function drawArray(two, name, id, arr, colors) {
    
    var elements = []

    var leftMargin = defaultLeftMargin;
    var topMargin = defaultTopMargin + id * sequenceTotalHeight;

    if (name) {
        name += ":"
        var text = two.makeText(name, leftMargin, topMargin +  escale_y(45));
        text.family = "Source Code Pro";
        text.size = labelFontSize
        text.alignment = 'left'
        text.fill = '#99ff99';
        leftMargin += 14.46 * name.length
    }

    for (let index = 0; index < arr.length; ++index) {
        let value = arr[index];
        let color = colors[index];
        var e = drawElement(two,  leftMargin + rectWidth / 2 + index * rectWidth, topMargin, value, index, color);
        elements.push(e)
        // console.log(value);
    }

    var e_last = drawPastLast(two, leftMargin + rectWidth / 2 + arr.length * rectWidth, topMargin);
    elements.push(e_last)

    two.update();

    return elements;
}




function drawNamedElementFinish(x, name, text) {

    var min_width = 2 * escale_x(19.2) + escale_x(5);

    if (text && text.toString().length > 2) {
        var w = text.toString().length * escale_x(19.2) + escale_x(5);
    } else {
        var w = min_width
    }
    
    return x + escale_x(14.46) * name.length + w / 2 + w
}

function drawNamedElementSimple(two, x, y, name, text, color = defaultElementColor) {

    // console.log(text)
    // console.log(text.toString())
    // console.log(text.toString().length)

    var min_width = 2 * escale_x(19.2) + escale_x(5);

    if (text != undefined && text.toString().length > 2) {
        var w = text.toString().length * escale_x(19.2) + escale_x(5);
    } else {
        // var w = rectWidth
        var w = min_width
    }
    
    if (name) {
        name += ":"
        var nameElement = two.makeText(name, x, y + escale_y(30));
        nameElement.family = "Source Code Pro";
        nameElement.size = labelFontSize
        nameElement.alignment = 'left'
        nameElement.fill = '#99ff99';
        // leftMargin += 14.46 * name.length
    }

    var rect = two.makeRectangle(x + escale_x(14.46) * name.length + w / 2, y + escale_y(30), w, rectHeight);
    rect.fill = color;
    rect.stroke = 'black'
    rect.linewidth = 1;

    var textElement = two.makeText(text, x + escale_x(14.46) * name.length + w / 2, y + escale_y(30) + escale_y(1.5));
    textElement.family = "Source Code Pro";
    textElement.size = fontSize

    var group = two.makeGroup(nameElement, rect, textElement);

    return {
        group: group,
        rect: rect,
        x_finish: x + escale_x(14.46) * name.length + w / 2 + w,
        y: y,
    };
}

function last_elem(dic) {
    var key = Object.keys(dic)[Object.keys(dic).length - 1];
    return dic[key];
}

function drawVariable(two, name, value, initTop) {
    
    // console.log(name)
    // console.log(value)

    var elements = []

    if ( ! initTop) {
        initTop = defaultTopMargin
    }

    if (Object.keys(variables).length > 0) {
        var last = last_elem(variables);
        var leftMargin = last.elements[0].x_finish;
        var topMargin = last.elements[0].y;

        // console.log('drawNamedElementFinish')
        var finish = drawNamedElementFinish(leftMargin, name, value);
        if (finish > two.width) {
            var leftMargin = defaultLeftMargin;
            topMargin = topMargin + variableTotalHeight;
        }
    } else {
        var topMargin = initTop
        var leftMargin = defaultLeftMargin;
    }
    
    // console.log('drawNamedElementSimple')

    // var e = drawNamedElementSimple(two,  leftMargin + rectWidth / 2, topMargin + 30, name, value);
    var e = drawNamedElementSimple(two, leftMargin, topMargin, name, value);
    elements.push(e)

    two.update();

    return elements;
}


function drawCountedRange(f, n) {
    
    // console.log(iterators_int[f.name]);
    // console.log(iterators_gui[f.name]);

    var color = iterators_gui[f.name].children[0].fill;
    // console.log(color);

    var elem = f.data.elements[f.index];
    var x = elem.rect.translation._x;
    var y = elem.rect.translation._y + elem.rect.height / 2 + escale_y(24);

    if (n != 0) {
        var elem_last = f.data.elements[f.index + n - 1];
        var x_last = elem_last.rect.translation._x + rectWidth / 2;
        var y_last = elem_last.rect.translation._y + elem_last.rect.height / 2 + escale_y(20);
    } else {
        var elem_last = f.data.elements[f.index + n];
        var x_last = elem_last.rect.translation._x + rectWidth / 2;
        var y_last = elem_last.rect.translation._y + elem_last.rect.height / 2 + escale_y(20);
    }


    var line = two.makeLine(x + escale_x(10), y, x_last, y);
    line.stroke = color;
    line.fill = color;

    // var x1 = two.makeLine(x, y, x, y + 100);
    // x1.stroke = "blue";

    // var x2 = two.makeLine(x_last, y, x_last, y + 100);
    // x2.stroke = "green";

    // var x3 = two.makeLine(elem_last.rect.translation._x, y, elem_last.rect.translation._x, y + 100);
    // x3.stroke = "red";


    // console.log("-------------------------")
    // console.log(x)
    // console.log(x_last)
    // console.log(elem_last.rect.translation._x)
    // console.log("-------------------------")

    var line2 = two.makeLine(x_last, y, x_last, y - escale_y(15));
    line2.stroke = color;
    line2.fill = color;


    var line3 = two.makeLine(x - escale_x(10), y, x - rectWidth / 2, y);
    line3.stroke = color;
    line3.fill = color;

    var line4 = two.makeLine(x - rectWidth / 2, y, x - rectWidth / 2, y - escale_y(15));
    line4.stroke = color;
    line4.fill = color;


    two.update();











    // var tri = two.makePolygon(x, y, pointerTriangleSize)
    // tri.fill = color;
    // tri.noStroke();

    // // var line = two.makeLine(x, y + pointerTriangleSize, x, y + 50);
    // // line.stroke = color;

    // // var text = two.makeText(text, x, y + 80);

    // var text = two.makeText(text, x, y + 30);
    // text.family = "Source Code Pro";
    
    // text.size = pointerFontSize //80
    // text.alignment = 'center'
    // text.baseline = 'middle'
    // text.fill = color;

    // // var group = two.makeGroup(tri, line, text);
    // var group = two.makeGroup(tri, text);
    // return group;
    // // return {
    // //     group: group,
    // //     tri: tri
    // // };    

}


function drawBoundedRange(f, l) {
    // console.log(f);
    // console.log(l);
    
    // console.log(iterators_int[f.name]);
    // console.log(iterators_gui[f.name]);

    var color = iterators_gui[f.name].children[0].fill;
    // console.log(color);

    var elem = f.data.elements[f.index];
    var x = elem.rect.translation._x;
    var y = elem.rect.translation._y + elem.rect.height / 2 + escale_y(24);


    var n = l.index - f.index

    if (n != 0) {
        var elem_last = f.data.elements[f.index + n - 1];
        var x_last = elem_last.rect.translation._x + rectWidth / 2;
        var y_last = elem_last.rect.translation._y + elem_last.rect.height / 2 + escale_y(20);
    } else {
        var elem_last = f.data.elements[f.index + n];
        var x_last = elem_last.rect.translation._x + rectWidth / 2;
        var y_last = elem_last.rect.translation._y + elem_last.rect.height / 2 + escale_y(20);
    }


    var line = two.makeLine(x + escale_x(10), y, x_last, y);
    line.stroke = color;
    line.fill = color;

    // var x1 = two.makeLine(x, y, x, y + 100);
    // x1.stroke = "blue";

    // var x2 = two.makeLine(x_last, y, x_last, y + 100);
    // x2.stroke = "green";

    // var x3 = two.makeLine(elem_last.rect.translation._x, y, elem_last.rect.translation._x, y + 100);
    // x3.stroke = "red";


    // console.log("-------------------------")
    // console.log(x)
    // console.log(x_last)
    // console.log(elem_last.rect.translation._x)
    // console.log("-------------------------")

    var line2 = two.makeLine(x_last, y, x_last, y - escale_y(15));
    line2.stroke = color;
    line2.fill = color;


    var line3 = two.makeLine(x - escale_x(10), y, x - rectWidth / 2, y);
    line3.stroke = color;
    line3.fill = color;

    var line4 = two.makeLine(x - rectWidth / 2, y, x - rectWidth / 2, y - escale_y(15));
    line4.stroke = color;
    line4.fill = color;


    two.update();


}
