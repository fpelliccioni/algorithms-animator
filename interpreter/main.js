
function initAlert(interpreter, scope) {
    var alert_wrapper = function(text) {
        return alert(arguments.length ? text : '');
    };

    var print_wrapper = function(text) {
        return console.log(arguments.length ? text : '');
    };

    var successor_wrapper = function(i) {
        // if (index < max - 1) {
        //     return index + 1
        // } else {
        //     return 0
        // }
        // f_index = successor(f_index, objects.elements.length);


        i = i + 1
        moveIteratorTo(two, objects.its[0], objects.elements[i])
        return i


        return console.log(arguments.length ? text : '');
    };

    // interpreter.setProperty(scope, 'number', String(location));
    interpreter.setProperty(scope, 'number', 16);
    interpreter.setProperty(scope, 'alert', interpreter.createNativeFunction(alert_wrapper));
    interpreter.setProperty(scope, 'print', interpreter.createNativeFunction(print_wrapper));
    interpreter.setProperty(scope, 'successor', interpreter.createNativeFunction(successor_wrapper));
    
}

function getAllCode() {
    var dataCode = document.getElementById('dataCode').value;
    var code = document.getElementById('code').value;
    return dataCode + '\n' + code;
}

function parseButton() {
    // var dataCode = document.getElementById('dataCode').value;
    // var code = document.getElementById('code').value;
    var code = getAllCode();
    document.getElementById('dataCode').style.display = "none";
    document.getElementById('code').style.display = "none";

    var yyy = eval(document.getElementById('dataCode').value);
    console.log(data)
    // console.log(document.getElementById('sequence').innerHTML)
    // document.getElementById('sequence').innerHTML = "";
    // two.appendTo(sequence);
    two.clear();
    // console.log(document.getElementById('sequence').innerHTML)
    objects = drawArray(two, data);
    



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

        try {
            var ok = myInterpreter.step();
        } finally {
            if (!ok) {
                disable('disabled');
                console.log('break 2')
                break;
            }
        }

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

        console.log(prevLine)
        console.log(codeSelected)
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