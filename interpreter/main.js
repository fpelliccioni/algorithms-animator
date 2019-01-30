function Iterator(data, index, name) {
    this.data = data;
    this.index = index;
    this.name = name;
}

function updateState() {
    var MEW = document.getElementById('MEW');
    MEW.innerHTML = '';

    for (var key in iterators_int) {
        // console.log(iterators_int[key]);
        var it = iterators_int[key];
        var data = it.data;
        var length = data.properties['length'];
        var text = '<p id="Status">source(<b>' + key + '</b>) = ' + data.properties[it.index] + '</p>';
        MEW.innerHTML += text;
    }
}

function updateStats() {
    var MEE = document.getElementById('MEE');
    MEE.innerHTML = '';

    MEE.innerHTML += '<p id="Status"><b>Iterator movements</b>: ' + stats_it_moves+ '</p>';
    MEE.innerHTML += '<p id="Status"><b>Iterator comparisons</b>: ' + stats_it_cmps+ '</p>';
    MEE.innerHTML += '<p id="Status"><b>Predicate applications</b>: ' + stats_pred_appls+ '</p>';
    MEE.innerHTML += '<p id="Status"><b>Swaps</b>: ' + stats_swaps+ '</p>';
    MEE.innerHTML += '<p id="Status"><b>Assignments</b>: ' + stats_assigments+ '</p>';
}

function updateStatus() {
    updateState();
    updateStats();
}

function initAlert(interpreter, scope) {
    var alert_wrapper = function(text) {
        return alert(arguments.length ? text : '');
    };

    var print_wrapper = function(text) {

        var output = document.getElementById('output');
        output.innerHTML += text;
        // hljs.highlightBlock(output);

        console.log(arguments.length ? text : '');
    };

    

    var assign_it_wrapper = function(target, source) {

        // console.log(target)
        // console.log(source)
        // console.log(iterators_gui[target.name])

        target = new Iterator(target.data, source.index, target.name);
        iterators_int[target.name] = target;

        moveIteratorTo(two, iterators_gui[target.name], elements[target.index])

        two.update();

        //TODO: Iterator Assignment/Copy
        // ++stats_it_moves;

        updateStatus();
        return target;
    };


    var successor_wrapper = function(it, move = true) {
        var max = it.data.properties['length'];

        // console.log(it.index)
        if (it.index >= max) {
            print_wrapper('ERROR: out of range');
            disable('disabled');
            return;
        }

        if (move) {
            moveIteratorTo(two, iterators_gui[it.name], elements[it.index + 1])
        }
        var it = new Iterator(it.data, it.index + 1, it.name);
        iterators_int[it.name] = it;

        ++stats_it_moves;

        updateStatus();
        return it;
    };

    var predecessor_wrapper = function(it, move = true) {
        // console.log(it.index)
        if (it.index <= 0) {
            print_wrapper('ERROR: out of range');
            disable('disabled');
            return;
        }

        if (move) {
            moveIteratorTo(two, iterators_gui[it.name], elements[it.index - 1])
        }
        var it = new Iterator(it.data, it.index - 1, it.name);
        iterators_int[it.name] = it;
        ++stats_it_moves;

        updateStatus();

        return it;
    };

    var begin_wrapper = function(arr, name, color = '#000075') {
        var index = 0
        var it = new Iterator(arr, index, name);
        var it_gui = drawIterator(two, elements[index], name, color);
        iterators_gui[name] = it_gui;
        iterators_int[name] = it;
        two.update();

        updateStatus();

        return it;
    };

    var end_wrapper = function(arr, name, color = '#000075') {
        var length = arr.properties['length']
        var index = length
        var it = new Iterator(arr, index, name);
        var it_gui = drawIterator(two, elements[index], name, color);
        iterators_gui[name] = it_gui;
        iterators_int[name] = it;
        two.update();

        updateStatus();

        return it;
    };

    var source_wrapper = function(it) {
        var max = it.data.properties['length'];
        if (it.index >= max) {
            // print_wrapper('ERROR: not valid iterator to take the source');
            print_wrapper('<p><span style="color:red">ERROR: </span>not valid iterator to take the source.</p>');

            disable('disabled');
            return;
        }
        var s = it.data.properties[it.index];

        ++stats_pred_appls;
        updateStatus();

        return s;
    };

    var equal_wrapper = function(a, b) {
        ++stats_it_cmps;
        updateStatus();
        return a.index == b.index;
    };

    var copy_it_wrapper = function(it, name, color = '#000075') {
        var index = it.index
        var it = new Iterator(it.data, it.index, name);
        var it_gui = drawIterator(two, elements[index], name, color);
        iterators_gui[name] = it_gui;
        iterators_int[name] = it;
        two.update();

        updateStatus();

        return it;
    };

    var remove_it_wrapper = function(it) {
        // console.log(iterators_gui[it.name]);
        two.remove(iterators_gui[it.name]);
        two.update();
        delete iterators_gui[it.name];
        delete iterators_int[it.name];
        updateStatus();
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
        
        // console.log(data)
        var tmp = source_wrapper(a);
        // data[a.index] = source_wrapper(b);
        data.properties[a.index] = source_wrapper(b);
        elements[a.index].group.children[1].value = source_wrapper(b);

        // data[b.index] = tmp;
        data.properties[b.index] = tmp;
        elements[b.index].group.children[1].value = tmp;
        // console.log(data)




        // console.log(elements[a.index].group.children[0])
        // console.log(elements[b.index].group.children[0])

        ++stats_swaps;
        stats_assigments += 3;

        updateStatus();
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
    interpreter.setProperty(scope, 'assign_it',   interpreter.createNativeFunction(assign_it_wrapper));

    // interpreter.setProperty(scope, 'paint_data_pred',   interpreter.createNativeFunction(paint_data_pred_wrapper));
}

function getAllCode() {
    var dataCodeText = document.getElementById('dataCodeArea').value;
    var codeText = document.getElementById('codeArea').value;
    return dataCodeText + '\n' + codeText;
}

function paint_data_pred(p) {

    for (let index = 0; index < elements.length - 1; ++index) {
        let value = data[index];
        let elem = elements[index];

        // console.log(value)
        // console.log(elem)
        console.log(p)

        if ( ! p(value)) {
            elem.rect.fill = '#ff9191';
        }
    }
}

function editButton() {
    document.getElementById('dataCodeArea').style.display = "inline";
    document.getElementById('codeArea').style.display = "inline";
    document.getElementById('codeHighlightPre').style.display = "none";

    document.getElementById('startButton').style.display = "inline";
    document.getElementById('stepButton').style.display = "none";
    document.getElementById('editButton').style.display = "none";

    var output = document.getElementById('output');
    output.innerHTML = '';

    var MEW = document.getElementById('MEW');
    MEW.innerHTML = '';

    two.clear();
}

function startButton() {
    var code = getAllCode();
    document.getElementById('dataCodeArea').style.display = "none";
    document.getElementById('codeArea').style.display = "none";
    document.getElementById('codeHighlightPre').style.display = "block";

    document.getElementById('startButton').style.display = "none";
    document.getElementById('stepButton').style.display = "inline";
    document.getElementById('editButton').style.display = "inline";

    var output = document.getElementById('output');
    output.innerHTML = '';

    var MEW = document.getElementById('MEW');
    MEW.innerHTML = '';


    // console.log(data)
    var yyy = eval(document.getElementById('dataCodeArea').value);
    // console.log(data)
    two.clear();
    elements = drawArray(two, data);

    if (pred) {
        paint_data_pred(pred);
    } 

    var codeHighlight = document.getElementById('codeHighlight');
    codeHighlight.innerHTML = code;
    hljs.highlightBlock(codeHighlight);

    var output = document.getElementById('output');
    hljs.highlightBlock(output);

    myInterpreter = new Interpreter(code, initAlert);
    disable('');
}

function stepButton() {
    var codeHighlight = document.getElementById('codeHighlight');
    // console.log(codeHighlight.innerHTML)


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

                var codeHighlight = document.getElementById('codeHighlight');
                codeHighlight.innerHTML = code;
                hljs.highlightBlock(codeHighlight);
        
                break;
            }
        }

        // var code = document.getElementById('codeArea').value;
        var code = getAllCode();
        var codeSelected = code.substring(start, end);
        // console.log(codeSelected);

        var codeHtml = [code.slice(0, end), "</mark>", code.slice(end)].join('');
            codeHtml = [codeHtml.slice(0, start), "<mark>", codeHtml.slice(start)].join('');
        // console.log(codeHtml);
        var codeHighlight = document.getElementById('codeHighlight');
        codeHighlight.innerHTML = codeHtml;
        hljs.highlightBlock(codeHighlight);


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
    // document.getElementById('runButton').disabled = disabled;
}

function createSelection(start, end) {
    var field = document.getElementById('codeArea');
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