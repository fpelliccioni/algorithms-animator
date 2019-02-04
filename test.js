/*
Copyright Fernando Pelliccioni 2019

Distributed under the Boost Software License, Version 1.0. (See accompanying
file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt) 
*/

var defaultLeftMargin = 10;
var defaultTopMargin = 0;
var sequenceTotalHeight = 140;

// var rectWidth = 80;
// var rectHeight = 120;
// var fontSize = 100;

var rectWidth = 40;
var rectHeight = 60;
var fontSize = 32;
var indexFontSize = 15;
var pointerFontSize = 40;
var labelFontSize = 24;

var pointerTriangleSize = 5;

function drawElement(two, x, y, text, index, color = '#bfffb3') {

    var textIndex = two.makeText(index, x, y + 8);
    textIndex.family = "Source Code Pro";
    textIndex.size = indexFontSize
    textIndex.fill = 'white';

    var rect = two.makeRectangle(x, y + 45, rectWidth, rectHeight);
    rect.fill = color;
    rect.stroke = 'black'
    rect.linewidth = 1;
    // console.log(rect.x)
    // console.log(rect.width)
    // console.log(rect.translation._x)


    var text = two.makeText(text, x, y + 45 + 1.5);
    // text.family = "DejaVu Sans Mono"
    // text.family = "Consolas"
    // text.family = "Lucida Console"
    // text.family = "Courier"
    text.family = "Source Code Pro";
    text.size = fontSize
    // text.alignment = 'center'
    // text.baseline = 'middle'



    var group = two.makeGroup(rect, text, textIndex);
    // console.log(group.x)
    // return group;

    return {
        group: group,
        rect: rect
    };
}

function drawPastLast(two, x, y) {
    var rect = two.makeRectangle(x, y + 45, rectWidth, rectHeight);
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

// function drawIterator(two, elem, text, color = '#000075') {
function drawIterator(two, elem, text, color = '#99ff99') {
    var x = elem.rect.translation._x;
    var y = elem.rect.translation._y + elem.rect.height / 2 + 20;

    var tri = two.makePolygon(x, y, pointerTriangleSize)
    tri.fill = color;
    tri.noStroke();

    // var line = two.makeLine(x, y + pointerTriangleSize, x, y + 50);
    // line.stroke = color;

    // var text = two.makeText(text, x, y + 80);

    var text = two.makeText(text, x, y + 30);
    // text.family = "DejaVu Sans Mono"
    // text.family = "Consolas"
    // text.family = "Lucida Console"
    // text.family = "Courier"
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

function moveIteratorTo(two, it, elem) {
    // console.log(it);
    var tri = it.children[0]
    it.translation.set(elem.rect.translation._x - tri.translation._x, 0);
    // it.group.translation.set(elem.rect.translation._x - it.tri.translation._x, 0);
}

function drawArray(two, arr, name, id) {
    
    var elements = []

    var leftMargin = defaultLeftMargin;
    var topMargin = defaultTopMargin + id * sequenceTotalHeight;

    if (name) {
        name += ":"
        var text = two.makeText(name, leftMargin, topMargin + 45);
        text.family = "Source Code Pro";
        text.size = labelFontSize
        text.alignment = 'left'
        text.fill = '#99ff99';
        leftMargin += 14.46 * name.length
    }

    for (let index = 0; index < arr.length; ++index) {
        let value = arr[index];
        var e = drawElement(two,  leftMargin + rectWidth / 2 + index * rectWidth, topMargin, value, index);
        elements.push(e)
        // console.log(value);
    }

    var e_last = drawPastLast(two, leftMargin + rectWidth / 2 + arr.length * rectWidth, topMargin);
    elements.push(e_last)

    two.update();

    return elements;
}