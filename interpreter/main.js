function Iterator(data, index, name) {
    this.data = data;
    this.index = index;
    this.name = name;
}

function initAlert(interpreter, scope) {
    var alert_wrapper = function(text) {
        return alert(arguments.length ? text : '');
    };

    var print_wrapper = function(text) {
        return console.log(arguments.length ? text : '');
    };

    var successor_wrapper = function(it, move = true) {
        // // if (index < max - 1) {
        // //     return index + 1
        // // } else {
        // //     return 0
        // // }
        // // f_index = successor(f_index, objects.elements.length);

        // // console.log(it);
        // it.index = it.index + 1
        // // console.log(it);
        // moveIteratorTo(two, iterators[it.name], elements[it.index])
        // return it

        if (move) {
            moveIteratorTo(two, iterators[it.name], elements[it.index + 1])
        }
        return new Iterator(it.data, it.index + 1, it.name);
    };

    var predecessor_wrapper = function(it, move = true) {
        // if (index < max - 1) {
        //     return index + 1
        // } else {
        //     return 0
        // }
        // f_index = successor(f_index, objects.elements.length);

        // it.index = it.index - 1
        // moveIteratorTo(two, iterators[it.name], elements[it.index])

        // console.log(it);

        if (move) {
            moveIteratorTo(two, iterators[it.name], elements[it.index - 1])
        }
        return new Iterator(it.data, it.index - 1, it.name);
    };

    var begin_wrapper = function(arr, name, color = '#000075') {
        var index = 0
        var it = new Iterator(arr, index, name);
        var it_gui = drawIterator(two, elements[index], name, color);
        iterators[name] = it_gui;
        two.update();
        return it;
    };

    var end_wrapper = function(arr, name, color = '#000075') {
        var length = arr.properties['length']
        var index = length
        var it = new Iterator(arr, index, name);
        var it_gui = drawIterator(two, elements[index], name, color);
        iterators[name] = it_gui;
        two.update();
        return it;
    };

    var source_wrapper = function(it) {
        var s = it.data.properties[it.index];
        return s;
    };

    var equal_wrapper = function(a, b) {
        return a.index == b.index;
    };

    var copy_it_wrapper = function(it, name, color = '#000075') {
        var index = it.index
        var it = new Iterator(it.data, it.index, name);
        var it_gui = drawIterator(two, elements[index], name, color);
        iterators[name] = it_gui;
        two.update();
        return it;
    };

    var remove_it_wrapper = function(it) {
        // console.log(iterators[it.name]);
        two.remove(iterators[it.name]);
        two.update();
        delete iterators[it.name];
    };


    var iter_swap_wrapper = function(a, b) {
        var data = a.data;

        var tmp_fill = elements[a.index].group.children[0].fill;
        elements[a.index].group.children[0].fill = elements[b.index].group.children[0].fill;
        elements[b.index].group.children[0].fill = tmp_fill;

        // console.log(elements[a.index].group.children[0])
        // console.log(elements[b.index].group.children[0])

        // console.log(source_wrapper(a))
        // console.log(source_wrapper(b))
        

        var tmp = source_wrapper(a);
        data[a.index] = source_wrapper(b);
        elements[a.index].group.children[1].value = source_wrapper(b);

        data[b.index] = tmp;
        elements[b.index].group.children[1].value = tmp;




        // console.log(elements[a.index].group.children[0])
        // console.log(elements[b.index].group.children[0])

        two.update();
    };

    // var paint_data_pred_wrapper = function(p) {

    //     for (let index = 0; index < elements.length - 1; ++index) {
    //         let value = data[index];
    //         let elem = elements[index];

    //         console.log(value)
    //         console.log(elem)
    //         console.log(p)

            

    //         if ( ! p(value)) {
    //             elem.rect.fill = '#ff9191';
    //         }
    //     }
    // }



    interpreter.setProperty(scope, 'alert',       interpreter.createNativeFunction(alert_wrapper));
    interpreter.setProperty(scope, 'print',       interpreter.createNativeFunction(print_wrapper));
    interpreter.setProperty(scope, 'successor',   interpreter.createNativeFunction(successor_wrapper));
    interpreter.setProperty(scope, 'predecessor', interpreter.createNativeFunction(predecessor_wrapper));
    interpreter.setProperty(scope, 'begin',       interpreter.createNativeFunction(begin_wrapper));
    interpreter.setProperty(scope, 'end',         interpreter.createNativeFunction(end_wrapper));
    interpreter.setProperty(scope, 'source',      interpreter.createNativeFunction(source_wrapper));
    interpreter.setProperty(scope, 'equal',       interpreter.createNativeFunction(equal_wrapper));
    interpreter.setProperty(scope, 'copy_it',     interpreter.createNativeFunction(copy_it_wrapper));
    interpreter.setProperty(scope, 'remove_it',   interpreter.createNativeFunction(remove_it_wrapper));
    interpreter.setProperty(scope, 'iter_swap',   interpreter.createNativeFunction(iter_swap_wrapper));

    // interpreter.setProperty(scope, 'paint_data_pred',   interpreter.createNativeFunction(paint_data_pred_wrapper));
}

function getAllCode() {
    var dataCode = document.getElementById('dataCode').value;
    var code = document.getElementById('code').value;
    return dataCode + '\n' + code;
}

function paint_data_pred(p) {

    for (let index = 0; index < elements.length - 1; ++index) {
        let value = data[index];
        let elem = elements[index];

        // console.log(value)
        // console.log(elem)
        // console.log(p)

        if ( ! p(value)) {
            elem.rect.fill = '#ff9191';
        }
    }
}

function parseButton() {
    var code = getAllCode();
    document.getElementById('dataCode').style.display = "none";
    document.getElementById('code').style.display = "none";

    // console.log(data)
    var yyy = eval(document.getElementById('dataCode').value);
    // console.log(data)
    two.clear();
    elements = drawArray(two, data);

    paint_data_pred(pred);

    var code2 = document.getElementById('code2');
    code2.innerHTML = code;
    hljs.highlightBlock(code2);

    myInterpreter = new Interpreter(code, initAlert);
    disable('');
}

function stepButton() {
    while (true) {
        if (myInterpreter.stateStack.length) {
            // console.log("stepButton 1");
            var node = myInterpreter.stateStack[myInterpreter.stateStack.length - 1].node;
            var start = node.start;
            var end = node.end;
        } else {
            // console.log("stepButton 2");
            var start = 0;
            var end = 0;
        }
        // createSelection(start, end);


        var code = getAllCode();

        try {
            var ok = myInterpreter.step();
        } finally {
            if (!ok) {
                disable('disabled');
                // console.log('break 2')

                var code2 = document.getElementById('code2');
                code2.innerHTML = code;
                hljs.highlightBlock(code2);
        
                break;
            }
        }

        // var code = document.getElementById('code').value;
        var code = getAllCode();
        var codeSelected = code.substring(start, end);
        // console.log(codeSelected);

        var codeHtml = [code.slice(0, end), "</mark>", code.slice(end)].join('');
            codeHtml = [codeHtml.slice(0, start), "<mark>", codeHtml.slice(start)].join('');
        // console.log(codeHtml);
        var code2 = document.getElementById('code2');
        code2.innerHTML = codeHtml;
        hljs.highlightBlock(code2);


        if (codeSelected.length == 1) {
            // console.log('continue 1')
            continue;
        }

        var countLineEnd = (codeSelected.match(/\n/g) || []).length;
        // console.log(countLineEnd);

        if (countLineEnd > 1) {
            // console.log('continue 2')
            continue;
        }

        if (codeSelected[0] == '[' && codeSelected[codeSelected.length - 1] == ']') {
            // console.log('continue 3')
            continue;
        }

        // if (lines.indexOf(codeSelected) != -1) {
        //     continue;
        // }
        // var found = lines.findIndex(function(l) {
        //     return l.includes(codeSelected);
        // });
        // if (found != -1) {
        //     continue;
        // }

        // console.log(prevLine)
        // console.log(codeSelected)
        if (prevLine.includes(codeSelected)) {
            // prevLine = codeSelected;
            // console.log('continue 4')
            continue;
        }
        prevLine = codeSelected;


        // if (countLineEnd == 0) {
        //     break;
        // }

        // lines.push(codeSelected);

        // console.log('break 1')
        break;
    }
}

function runButton() {
    disable('disabled');
    myInterpreter.run();
}

function disable(disabled) {
    document.getElementById('stepButton').disabled = disabled;
    document.getElementById('runButton').disabled = disabled;
}

function createSelection(start, end) {
    var field = document.getElementById('code');
    if (field.createTextRange) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end);
        selRange.select();
    } else if (field.setSelectionRange) {
        field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}