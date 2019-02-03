/*
Copyright Fernando Pelliccioni 2019

Distributed under the Boost Software License, Version 1.0. (See accompanying
file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt) 
*/

function Iterator(data, index, name) {
    this.data = data;
    this.index = index;
    this.name = name;
}


function resetState() {
    
    var hg_right_x_a = document.getElementById('hg-right-x-a');
    hg_right_x_a.innerHTML = '';


    lines = [];
    prevLine = "";
    iterators_int = {};
    iterators_gui = {};
    predicates = [];
    sequences = {};

    stats_it_moves = 0;
    stats_it_cmps = 0;
    stats_pred_appls = 0;
    stats_swaps = 0;
    stats_assigments = 0;    
}

function resetStats() {
    var hg_right_x_b = document.getElementById('hg-right-x-b');
    hg_right_x_b.innerHTML = '';
}

function updateState() {
    var hg_right_x_a = document.getElementById('hg-right-x-a');
    hg_right_x_a.innerHTML = '';

    for (var key in iterators_int) {
        // console.log(iterators_int[key]);
        var it = iterators_int[key];
        var data = it.data.data;
        // console.log(data)
        // var length = data.properties['length'];
        // var text = '<p id="Status">source(<b>' + key + '</b>) = ' + data.properties[it.index] + '</p>';
 
        var length = data.length;
        var text = '<p id="Status">source(<b>' + key + '</b>) = ' + data[it.index] + '</p>';

        hg_right_x_a.innerHTML += text;
    }
}

function updateStats() {
    var hg_right_x_b = document.getElementById('hg-right-x-b');
    hg_right_x_b.innerHTML = '';

    hg_right_x_b.innerHTML += '<p id="Status"><b>Iterator displacements</b>: ' + stats_it_moves+ '</p>';
    hg_right_x_b.innerHTML += '<p id="Status"><b>Iterator comparisons</b>:   ' + stats_it_cmps+ '</p>';
    hg_right_x_b.innerHTML += '<p id="Status"><b>Pred/Rel applications</b>:  ' + stats_pred_appls+ '</p>';
    hg_right_x_b.innerHTML += '<p id="Status"><b>Swaps</b>:                  ' + stats_swaps+ '</p>';
    hg_right_x_b.innerHTML += '<p id="Status"><b>Assignments</b>:            ' + stats_assigments+ '</p>';
}

function addLog(text) {
    var hg_right_b_b = document.getElementById('hg-right-b-b');
    // hg_right_b_b.innerHTML = '';
    hg_right_b_b.innerHTML += '<p id="Status">' + text+ '</p>';
}

function addLogEqual(a, b, res) {
    addLog('equal(' + a.data.name + '<sub>' + a.index + '</sub>, ' + b.data.name + '<sub>' + b.index + '</sub>) = ' + res);
}

function addLogSuccessor(it, res_it) {
    addLog('successor(' + it.data.name + '<sub>' + it.index + '</sub>) = ' + res_it.data.name + '<sub>' + res_it.index + '</sub>');
}

function addLogPredecessor(it, res_it) {
    // console.log(it)
    // console.log(res_it)
    addLog('predecessor(' + it.data.name + '<sub>' + it.index + '</sub>) = ' + res_it.data.name + '<sub>' + res_it.index + '</sub>');
}

function addLogSource(it, res) {
    addLog('source(' + it.data.name + '<sub>' + it.index + '</sub>) = ' + res);
}

function addLogSink(it, x) {
    addLog('source(' + it.data.name + '<sub>' + it.index + '</sub>, ' + x + ')');
}

function addLogPredicate(name, x, res) {
    addLog(name + '(' + x + ') = ' + res);
}



function updateStatus() {
    updateState();
    updateStats();
}

function resetStatus() {
    resetState();
    resetStats();
}


function initFunctions(interpreter, scope) {
    var alert_wrapper = function(text) {
        return alert(arguments.length ? text : '');
    };

    var error = function(text) {
        var msg = '<p id="OutputMsg"><span style="color:red">ERROR: </span>' + text + '</p>';

        var output = document.getElementById('output');
        output.innerHTML += msg;
        // hljs.highlightBlock(output);

        console.log(arguments.length ? text : '');

    }

    var print_wrapper = function(text) {
        var msg = '<p id="OutputMsg"><span style="color:cyan">INFO: </span>' + text + '</p>';

        var output = document.getElementById('output');
        output.innerHTML += msg;
        // hljs.highlightBlock(output);

        console.log(arguments.length ? text : '');
    };

    

    var assign_it_wrapper = function(target, source) {

        var elements = target.data.elements;

        target = new Iterator(target.data, source.index, target.name);
        iterators_int[target.name] = target;

        moveIteratorTo(two, iterators_gui[target.name], elements[target.index])

        two.update();

        //TODO: Iterator Assignment/Copy
        // ++stats_it_moves;

        updateStatus();
        return target;
    };


    var successor_wrapper = function(it_par, move = true) {
        var data = it_par.data.data;
        var max = data.length;

        // console.log(it_par.index)
        if (it_par.index >= max) {
            error('out of range');
            disable('disabled');
            return;
        }

        if (move) {
            moveIteratorTo(two, iterators_gui[it_par.name], it_par.data.elements[it_par.index + 1])
        }
        var it = new Iterator(it_par.data, it_par.index + 1, it_par.name);
        iterators_int[it.name] = it;

        ++stats_it_moves;

        updateStatus();
        addLogSuccessor(it_par, it)
        return it;
    };

    var predecessor_wrapper = function(it_par, move = true) {
        // console.log(it_par.index)
        if (it_par.index <= 0) {
            error('out of range');
            disable('disabled');
            return;
        }

        if (move) {
            moveIteratorTo(two, iterators_gui[it_par.name], it_par.data.elements[it_par.index - 1])
        }
        var it = new Iterator(it_par.data, it_par.index - 1, it_par.name);
        iterators_int[it.name] = it;
        ++stats_it_moves;

        updateStatus();

        addLogPredecessor(it_par, it)
        return it;
    };
    
    var begin_wrapper = function(arr, name, color) {
        // console.log(arr)

        if (iterators_int[name] != undefined) {
            var gui = iterators_gui[name];
            // console.log(gui)
            color = gui.children[0].fill;
            // console.log(color)
            remove_it_wrapper(iterators_int[name]);
        }

        if ( ! color) {
            // console.log(Object.keys(iterators_int).length)
            color = iterators_colors[Object.keys(iterators_int).length];
        }


        var index = 0
        var it = new Iterator(arr, index, name);
        var it_gui = drawIterator(two, arr.elements[index], name, color);
        iterators_gui[name] = it_gui;
        iterators_int[name] = it;
        two.update();

        updateStatus();

        return it;
    };

    var end_wrapper = function(arr, name, color) {

        if (iterators_int[name] != undefined) {
            var gui = iterators_gui[name];
            // console.log(gui)
            color = gui.children[0].fill;
            // console.log(color)
            remove_it_wrapper(iterators_int[name]);
        }

        if ( ! color) {
            // console.log(Object.keys(iterators_int).length)
            color = iterators_colors[Object.keys(iterators_int).length];
        }

        var length = arr.data.length
        var index = length
        var it = new Iterator(arr, index, name);
        var it_gui = drawIterator(two, arr.elements[index], name, color);
        iterators_gui[name] = it_gui;
        iterators_int[name] = it;
        two.update();

        updateStatus();

        return it;
    };

    var source_wrapper = function(it) {
        var data = it.data.data;
        var max = data.length;
        if (it.index >= max) {
            error('not valid iterator to take the source.');
            disable('disabled');
            return;
        }
        

        var s = data[it.index];
        addLogSource(it, s)

        //TODO
        // ++stats_pred_appls;
        // updateStatus();

        return s;
    };

    var sink_wrapper = function(it, x) {
        var data = it.data.data;
        var elements = it.data.elements;

        var max = data.length;
        if (it.index >= max) {
            error('not valid iterator to take the source.');
            disable('disabled');
            return;
        }

        addLogSink(it, x)
        
        data[it.index] = x;
        elements[it.index].group.children[1].value = x;

        ++stats_assigments;
        updateStatus();
        two.update();
    };

    var equal_wrapper = function(a, b) {
        // addLog('equal(' + a.index + ', ' + b.index + ')');
        // addLog('equal(' + a.data.name + ', ' + b.index + ')');
        ++stats_it_cmps;
        updateStatus();
        var res = a.index == b.index;
        addLogEqual(a, b, res)
        return res;
    };

    
    var copy_it_wrapper = function(it, name, color) {

        if ( ! color) {
            console.log(Object.keys(iterators_int).length)
            color = iterators_colors[Object.keys(iterators_int).length];
        }

        var index = it.index
        var it = new Iterator(it.data, it.index, name);
        var it_gui = drawIterator(two, it.data.elements[index], name, color);
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
        var elements = a.data.elements;

        var tmp_fill = elements[a.index].group.children[0].fill;
        elements[a.index].group.children[0].fill = elements[b.index].group.children[0].fill;
        elements[b.index].group.children[0].fill = tmp_fill;

        var tmp = source_wrapper(a);
        // data[a.index] = source_wrapper(b);
        data.properties[a.index] = source_wrapper(b);
        elements[a.index].group.children[1].value = source_wrapper(b);

        // data[b.index] = tmp;
        data.properties[b.index] = tmp;
        elements[b.index].group.children[1].value = tmp;
        // console.log(data)


        ++stats_swaps;
        stats_assigments += 3;

        updateStatus();
        two.update();
    };


    var add_sequence_internal_wrapper = function(data_par, name, paint_pred) {
        // console.log(data_par);

        if (sequences[name] != undefined) {
            error('sequence "' + name + '" already exists.');
            disable('disabled');
            return null;
        }

        var data = [];
        var length = data_par.properties['length'];

        for (let i = 0; i < length; ++i) {
            data.push(data_par.properties[i]);
        }

        // console.log(data);
        // elements = drawArray(two, data, name);
        var elems = drawArray(two, data, name, Object.keys(sequences).length);

        

        var retobj = {
            name: name,
            data: data,
            elements: elems
        };

        sequences[name] = retobj;

        updateStatus();
        two.update();
        return retobj;
    };    


    var set_predicate_wrapper = function(p) {
       
        // console.log(p.node.id.name);
        // interpreter.appendCode(p.node.id.name+'();');

        predicates.push(p);
        
        updateStatus();
        two.update();
    };    

    var call_predicate_internal_wrapper = function(name, x, res) {
        ++stats_pred_appls;
        updateStatus();

        addLogPredicate(name, x, res);

        //TODO
        var hg_right_x_a = document.getElementById('hg-right-x-a');
        var text = '<p id="Status">' + name + '(' + x + ') = ' + res + '</p>';
        hg_right_x_a.innerHTML += text;
    };    

    var fill_elem_wrapper = function(i, c) {
        let elem = elements[i];
        elem.rect.fill = c;
    };    

    interpreter.setProperty(scope, 'alert',          interpreter.createNativeFunction(alert_wrapper));
    interpreter.setProperty(scope, 'print',          interpreter.createNativeFunction(print_wrapper));
    interpreter.setProperty(scope, 'successor',      interpreter.createNativeFunction(successor_wrapper));
    interpreter.setProperty(scope, 'predecessor',    interpreter.createNativeFunction(predecessor_wrapper));
    interpreter.setProperty(scope, 'begin',          interpreter.createNativeFunction(begin_wrapper));
    interpreter.setProperty(scope, 'end',            interpreter.createNativeFunction(end_wrapper));
    interpreter.setProperty(scope, 'source',         interpreter.createNativeFunction(source_wrapper));
    interpreter.setProperty(scope, 'sink',           interpreter.createNativeFunction(sink_wrapper));
    interpreter.setProperty(scope, 'equal',          interpreter.createNativeFunction(equal_wrapper));
    interpreter.setProperty(scope, 'copy_it',        interpreter.createNativeFunction(copy_it_wrapper));
    interpreter.setProperty(scope, 'remove_it',      interpreter.createNativeFunction(remove_it_wrapper));
    interpreter.setProperty(scope, 'iter_swap',      interpreter.createNativeFunction(iter_swap_wrapper));
    interpreter.setProperty(scope, 'assign_it',      interpreter.createNativeFunction(assign_it_wrapper));
    interpreter.setProperty(scope, 'add_sequence_internal',   interpreter.createNativeFunction(add_sequence_internal_wrapper));
    // interpreter.setProperty(scope, 'set_predicate',  interpreter.createNativeFunction(set_predicate_wrapper));
    interpreter.setProperty(scope, 'fill_elem',      interpreter.createNativeFunction(fill_elem_wrapper));
    // interpreter.setProperty(scope, 'increment_predicate_stats', interpreter.createNativeFunction(increment_predicate_stats_wrapper));
    interpreter.setProperty(scope, 'call_predicate_internal', interpreter.createNativeFunction(call_predicate_internal_wrapper));
    
}

function callPredCode() {
    return 'function call_predicate(p, name, x){var res = p(x); call_predicate_internal(name, x, res); return res;};\n'
         + 'function predicate(p, name) {return function(x) {return call_predicate(p, name, x);};}\n'
         + 'function call_relation(r, x, y){var res = r(x, y);increment_predicate_stats();return res;}\n'
         + 'function relation(r){return function(x, y){return call_relation(r, x, y);};}\n';
}

function addSequenceCode() {
    return 'function add_sequence(d, n, p) {' + '\n' +
    '    var obj = add_sequence_internal(d, n, p);' + '\n' +
    '    if ( ! obj) return obj;' + '\n' +
    '    if (p) {' + '\n' +    
    '        for (var i = 0; i < data.length; ++i) {' + '\n' +
    '            var value = data[i];' + '\n' +
    '            if ( ! p(value)) {' + '\n' +
    '                fill_elem(i, "#ff9191");' + '\n' +
    '            }' + '\n' +
    '        }' + '\n' +
    '    }' + '\n' +
    '    return obj;' + '\n' +
    '}'+ '\n'
}

function invisibleCode() {
    return callPredCode() + addSequenceCode();
}


function getAllCode() {
    // var dataCodeText = document.getElementById('dataCodeArea').value;
    // var codeText = document.getElementById('codeArea').value;
    // return dataCodeText + '\n' + codeText;

    return invisibleCode() + document.getElementById('codeArea').value;
}

function getViewCode() {
    // var dataCodeText = document.getElementById('dataCodeArea').value;
    // var codeText = document.getElementById('codeArea').value;
    // return dataCodeText + '\n' + codeText;

    return document.getElementById('codeArea').value;
}


// function paint_data_pred(interpreter, p, data) {

//     for (let index = 0; index < elements.length - 1; ++index) {
//         let value = data[index];
//         let elem = elements[index];

//         // console.log(value)
//         // console.log(elem)
//         // console.log(p)
//         // interpreter.appendCode(p.node.id.name+'();');
//         var code = 'if ( ! ' + p.node.id.name+'(' + value + ')) { fill_elem(' + index + ', "#ff9191"); }';
//         // console.log(code);
//         interpreter.appendCode(code);

//         // if ( ! p(value)) {
//         //     elem.rect.fill = '#ff9191';
//         // }
//     }
// }


function editButton() {
    // document.getElementById('dataCodeArea').style.display = "inline";
    document.getElementById('codeArea').style.display = "inline";
    document.getElementById('codeHighlightPre').style.display = "none";

    document.getElementById('startButton').style.display = "inline";
    document.getElementById('stepButton').style.display = "none";
    document.getElementById('editButton').style.display = "none";
    document.getElementById('restartButton').style.display = "none";

    var output = document.getElementById('output');
    output.innerHTML = '';

    var hg_right_x_a = document.getElementById('hg-right-x-a');
    console.log(hg_right_x_a.innerHTML);
    hg_right_x_a.innerHTML = '';

    two.clear();
}

function restartButton() {
    // document.getElementById('dataCodeArea').style.display = "inline";
    document.getElementById('codeArea').style.display = "inline";
    document.getElementById('codeHighlightPre').style.display = "none";

    document.getElementById('startButton').style.display = "inline";
    document.getElementById('stepButton').style.display = "none";
    document.getElementById('editButton').style.display = "none";
    document.getElementById('restartButton').style.display = "none";

    var output = document.getElementById('output');
    output.innerHTML = '';

    var hg_right_x_a = document.getElementById('hg-right-x-a');
    hg_right_x_a.innerHTML = '';

    resetStatus();
    two.clear();

    startButton();
}


function startButton() {
    var codeAll = getAllCode();
    // console.log(codeAll);
    var codeView = getViewCode();
    
    // document.getElementById('dataCodeArea').style.display = "none";
    document.getElementById('codeArea').style.display = "none";
    document.getElementById('codeHighlightPre').style.display = "block";

    document.getElementById('startButton').style.display = "none";
    document.getElementById('stepButton').style.display = "inline";
    document.getElementById('editButton').style.display = "inline";
    document.getElementById('restartButton').style.display = "inline";

    var output = document.getElementById('output');
    output.innerHTML = '';

    var hg_right_x_a = document.getElementById('hg-right-x-a');
    hg_right_x_a.innerHTML = '';

    two.clear();
    resetStatus();

    var codeHighlight = document.getElementById('codeHighlight');
    codeHighlight.innerHTML = codeView;
    hljs.highlightBlock(codeHighlight);

    var output = document.getElementById('output');
    hljs.highlightBlock(output);

    myInterpreter = new Interpreter(codeAll, initFunctions);
    disable('');

    updateStatus();
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


        var codeAll = getAllCode();
        var codeView = getViewCode();

        try {
            var ok = myInterpreter.step();
        } finally {
            if (!ok) {
                disable('disabled');
                // console.log('break 2')

                var codeHighlight = document.getElementById('codeHighlight');
                codeHighlight.innerHTML = codeView;
                hljs.highlightBlock(codeHighlight);
        
                break;
            }
        }

        // console.log('-----------------------');
        // console.log(start);
        // console.log(end);

        if (start < invisibleCode().length) {
            continue;
        }

        start -= invisibleCode().length;
        end -= invisibleCode().length;

        // console.log(start);
        // console.log(end);
        // console.log('-----------------------');

        var codeSelected = codeView.substring(start, end);
        // console.log(codeSelected);

        var codeHtml = [codeView.slice(0, end), "</mark>", codeView.slice(end)].join('');
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