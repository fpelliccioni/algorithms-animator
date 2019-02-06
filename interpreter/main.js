/*
Copyright Fernando Pelliccioni 2019

Distributed under the Boost Software License, Version 1.0. (See accompanying
file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt) 
*/

var log_stats_enabled = true;

var snippets = {
find_if: 
`function find_if(f, l, p) {
    while ( ! equal(f, l) && ! p(source(f))) {
        f = successor(f)
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = add_sequence(random_array(), "d");
var f = begin(d);
var l = end(d);

var it = find_if(f, l, even);
if ( ! equal(it, l)) {
    print(source(it));
}
`
, find_backward_if: 
`function find_backward_if(f, l, p) {
    while (true) {
        if (equal(l, f)) return f;
        l = predecessor(l);
        if (p(source(l))) return successor(l);
    }    
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = add_sequence(random_array(), "d");
var f = begin(d);
var l = end(d);

var it = find_backward_if(f, l, even);
if ( ! equal(it, f)) {
    print(source(predecessor(it)));
}
`

,max_element: 
`function max_element(f, l, r) {
    if (equal(f, l)) return l;

    var m = f;
    f = successor(f);

    while ( ! equal(f, l)) {
        if ( ! r(source(f), source(m))) {
            m = f;
        }
        f = successor(f);
    }
    return m;
}

var rel = relation(function(x, y) { return x < y; }, 'less');
var d = add_sequence(random_array(), "d");

var f = begin(d);
var l = end(d);

f = max_element(f, l, rel);
if ( ! equal(f, l)) {
    print("The max element is: " + source(f));
}`

,min_element: 
`function min_element(f, l, r) {
    if (equal(f, l)) return l;

    var m = f;
    f = successor(f);

    while ( ! equal(f, l)) {
        if (r(source(f), source(m))) {
            m = f;
        }
        f = successor(f);
    }
    return m;
}

var rel = relation(function(x, y) { return x < y; }, 'less');
var d = add_sequence(random_array(), "d");

var f = begin(d);
var l = end(d);

f = min_element(f, l, rel);
if ( ! equal(f, l)) {
    print("The min element is: " + source(f));
}`


, iota: 
`function iota(f, l, start, step) {
    if ( ! start) start = 0;
    if ( ! step) step = 1;

    while ( ! equal(f, l)) {
        sink(f, start);
        start += step;
        f = successor(f);
    }
    return start;
}

var d1 = add_sequence(new Array(8), "d1");
var d2 = add_sequence(new Array(5), "d2");

var f = successor(begin(d1));
var l = predecessor(end(d1));

var r = iota(f, l);
print(r);

f = begin(d2);
l = end(d2);


r = iota(f, l, r);
print(r);`

,partition_semistable_1:
`//Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L40
function find_if(f, l, p) {
    while ( ! equal(f, l) && ! p(source(f))) {
        f = successor(f)
    }
    return f;
}

function partition_semistable_1(f, l, p) {
    f = find_if(f, l, p);
    if (f == l) return f;

    var j = f;
    j = successor(j)

    while ( ! equal(j, l)) {
        if ( ! p(source(j))) {
            iter_swap(f, j);
            f = successor(f);
        }
        j = successor(j);
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = add_sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

var it = partition_semistable_1(f, l, even);
if ( ! equal(it, l)) {
    print('partition point: ' + source(it));
}`

,partition_semistable:
`//Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L58
function partition_semistable(f, l, p) {
    while (true) {
        if (equal(f, l)) return f;
        if (p(source(f))) break;
        f = successor(f);
    }

    var j = f;
    j = successor(j)

    while ( ! equal(j, l)) {
        if ( ! p(source(j))) {
            iter_swap(f, j);
            f = successor(f);
        }
        j = successor(j);
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = add_sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

var it = partition_semistable(f, l, even);
if ( ! equal(it, l)) {
    print('partition point: ' + source(it));
}`

,partition_semistable_nonempty:
`//Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L91
function partition_semistable_nonempty(f, l, p) {
    //precondition: nonempty: ! equal(f, l)
    while ( ! p(source(f))) {
        f = successor(f);
        if (equal(f, l)) return;
    }    

    var j = f;
    j = successor(j)
    if (equal(j, l)) return;

    while ( ! equal(successor(j), l)) {
        if ( ! p(source(j))) {
            iter_swap(f, j);
            f = successor(f);
        }
        j = successor(j);
    }
    iter_swap(f, j);
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = add_sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

partition_semistable_nonempty(f, l, even);`



,select_1_3:
`// Median of 3

function select_1_2(a, b, r) {
    return r(b, a) ? a : b;
}

function select_1_3_ab(a, b, c, r) {
    // precondition: a <= b
    
    return ! r(c, b) ? 
                b :                  // a, b, c are sorted
                select_1_2(a, c, r); // b is not the median
}

function select_1_3(a, b, c, r) {
    return r(b, a) ? 
              select_1_3_ab(b, a, c, r) 
            : select_1_3_ab(a, b, c, r);
}

var r = relation(function(x, y) { return x < y; }, 'less');

var tmp = random_array(3);
var a = tmp[0];
var b = tmp[1];
var c = tmp[2];

var m = select_1_3(a, b, c, r);
print(m);`


,gcd:
`function remainder(a, b) {
    return a % b;
}

function gcd(a, b) {
    while (b != 0) {
        var r = remainder(a, b);
        a = b;
        b = r;
    }
    return a;
}

var a = random_int();
var b = random_int();

var g = gcd(a, b);
print(g);`
};

function getSnippet(snippet) {
    var res = snippets[snippet];
    if (res) {
        return res;
    }
    return '';
}

function fillCatalog() {
    var list = document.getElementById('list');
    list.innerHTML = '';

    // for(var key in Object.keys(snippets)){
    for(var key in snippets){
        // var value = snippets[key];
        // console.log(key)
        // console.log(value)
    
        // list.innerHTML += '<li><a href="index.html?snippet=' + key + '">[' + key + ']</a></li>';
        list.innerHTML += '<li><a href="http://componentsprogramming.com/algorithms?snippet=' + key + '">[' + key + ']</a></li>';
    }
}

function Iterator(data, index, name) {
    this.data = data;
    this.index = index;
    this.name = name;
}

function Sequence(name, data, elements, colors) {
    this.name = name;
    this.data = data;
    this.elements = elements;
    this.colors = colors;
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
    variables = {};

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

function subscript_digit(digit) {
    if (digit == '1') return '\u2081';
    if (digit == '2') return '\u2082';
    if (digit == '3') return '\u2083';
    if (digit == '4') return '\u2084';
    if (digit == '5') return '\u2085';
    if (digit == '6') return '\u2086';
    if (digit == '7') return '\u2087';
    if (digit == '8') return '\u2088';
    if (digit == '9') return '\u2089';

    return '\u2080';
}
function subscript(number) {
    // console.log(number)
    var nText = number.toString();
    var res = '';
    // for (var c in nText) {
    //     console.log(c)
    //     console.log(subscript_digit(c))
    //     res += subscript_digit(c);
    // }

    for (var i = 0; i < nText.length; i++) {
        var c = nText.charAt(i);
        // console.log(c)
        // console.log(subscript_digit(c))
        res += subscript_digit(c);
    }
      
    return res;
}

function clearLog() {
    // var hg_right_b_b = document.getElementById('hg-right-b-b');
    // hg_right_b_b.innerHTML = '';
    var hg_right_b_b_data = document.getElementById('hg-right-b-b-data');
    // hg_right_b_b_data.innerHTML = '';
    hg_right_b_b_data.value = '';
    // hg_right_b_b_data.value = subscript('1232');

    // console.log(hg_right_b_b_data.value);

    // var text = '\u2080';
    // // $('hg-right-b-b-data').val($('hg-right-b-b-data').val() + ' ' + text);

    // hg_right_b_b_data.value += text;
    // console.log(hg_right_b_b_data.value);
}

function addLog(text) {
    if (log_stats_enabled) {
        // var hg_right_b_b = document.getElementById('hg-right-b-b');
        // hg_right_b_b.innerHTML += '<p id="Status">' + text+ '</p>';
        var hg_right_b_b_data = document.getElementById('hg-right-b-b-data');
        // hg_right_b_b_data.innerHTML += text + '\n';
        hg_right_b_b_data.value += text + '\n';
    }
}

function addLogEqual(a, b, res) {
    // addLog('equal(' + a.data.name + '<sub>' + a.index + '</sub>, ' + b.data.name + '<sub>' + b.index + '</sub>) = ' + res);
    addLog('equal(' + a.data.name + subscript(a.index) + ', ' + b.data.name  + subscript(b.index) + ') = ' + res);
}

function addLogSuccessor(it, res_it) {
    // addLog('successor(' + it.data.name + '<sub>' + it.index + '</sub>) = ' + res_it.data.name + '<sub>' + res_it.index + '</sub>');
    addLog('successor(' + it.data.name + subscript(it.index) + ') = ' + res_it.data.name + subscript(res_it.index) + '');
}

function addLogPredecessor(it, res_it) {
    // addLog('predecessor(' + it.data.name + '<sub>' + it.index + '</sub>) = ' + res_it.data.name + '<sub>' + res_it.index + '</sub>');
    addLog('predecessor(' + it.data.name + subscript(it.index) + ') = ' + res_it.data.name + subscript(res_it.index) + '');
}

function addLogSource(it, res) {
    // addLog('source(' + it.data.name + '<sub>' + it.index + '</sub>) = ' + res);
    addLog('source(' + it.data.name + subscript(it.index) + ') = ' + res);
}

function addLogSink(it, x) {
    // addLog('sink(' + it.data.name + '<sub>' + it.index + '</sub>, ' + x + ')');
    addLog('sink(' + it.data.name + subscript(it.index) + ', ' + x + ')');
}

function addLogSwap(a, b) {
    // addLog('swap(' + a.data.name + '<sub>' + a.index + '</sub>, ' + b.data.name + '<sub>' + b.index + '</sub>)');
    addLog('swap(' + a.data.name + subscript(a.index) + ', ' + b.data.name + subscript(b.index) + ')');
}

function addLogPredicate(name, x, res) {
    addLog(name + '(' + x + ') = ' + res);
}

function addLogRelation(name, x, y, res) {
    addLog(name + '(' + x + ', ' + y + ') = ' + res);
}



function updateStatus() {
    updateState();
    updateStats();
}

function resetStatus() {
    resetState();
    resetStats();
}

function showError(text) {
    var msg = '<p id="OutputMsg"><span style="color:red">ERROR: </span>' + text + '</p>';

    var output = document.getElementById('hg-right-y');
    output.innerHTML += msg;
    // hljs.highlightBlock(output);

    console.log(arguments.length ? text : '');
}


function initFunctions(interpreter, scope) {
    var alert_wrapper = function(text) {
        return alert(arguments.length ? text : '');
    };


    var print_wrapper = function(text) {
        var msg = '<p id="OutputMsg"><span style="color:cyan">INFO: </span>' + text + '</p>';

        var output = document.getElementById('hg-right-y');
        output.innerHTML += msg;
        // hljs.highlightBlock(output);

        console.log(arguments.length ? text : '');
    };

    

    // var assign_it_wrapper = function(target, source) {
    //     var elements = target.data.elements;
    //     target = new Iterator(target.data, source.index, target.name);
    //     iterators_int[target.name] = target;
    //     moveIteratorTo(two, iterators_gui[target.name], elements[target.index])
    //     two.update();
    //     //TODO: Iterator Assignment/Copy
    //     // ++stats_it_moves;
    //     updateStatus();
    //     return target;
    // };


    var successor_wrapper = function(it_par, move = true) {
        var data = it_par.data.data;
        var max = data.length;

        // console.log(it_par.index)
        if (it_par.index >= max) {
            showError('out of range');
            disable('disabled');
            return;
        }

        // if (move && iterators_gui[it_par.name]) {
        //     moveIteratorTo(two, iterators_gui[it_par.name], it_par.data.elements[it_par.index + 1])
        // }
        var it = new Iterator(it_par.data, it_par.index + 1, it_par.name);
        if (iterators_int[it.name]) {
            iterators_int[it.name] = it;
        }

        if (log_stats_enabled) {
            ++stats_it_moves;
        }

        updateStatus();
        addLogSuccessor(it_par, it)
        return it;
    };

    var predecessor_wrapper = function(it_par, move = true) {
        // console.log(it_par.index)
        if (it_par.index <= 0) {
            showError('out of range');
            disable('disabled');
            return;
        }

        // if (move && iterators_gui[it_par.name]) {
        //     moveIteratorTo(two, iterators_gui[it_par.name], it_par.data.elements[it_par.index - 1])
        // }
        var it = new Iterator(it_par.data, it_par.index - 1, it_par.name);
        if (iterators_int[it.name]) {
            iterators_int[it.name] = it;
        }
        
        if (log_stats_enabled) {
            ++stats_it_moves;
        }

        updateStatus();

        addLogPredecessor(it_par, it)
        return it;
    };
    
    var begin_wrapper = function(arr, name, color) {
        // console.log(arr)
        // console.log('begin_wrapper')

        // if (iterators_int[name] != undefined) {
        //     var gui = iterators_gui[name];
        //     // console.log(gui)
        //     color = gui.children[0].fill;
        //     // console.log(color)
        //     remove_it_wrapper(iterators_int[name]);
        // }

        // if ( ! color) {
        //     // console.log(Object.keys(iterators_int).length)
        //     color = iterators_colors[Object.keys(iterators_int).length];
        // }


        var index = 0
        // var it = new Iterator(arr, index, name);
        var it = new Iterator(arr, index, null);
        // iterators_int[name] = it;

        updateStatus();

        return it;
    };

    var end_wrapper = function(arr, name, color) {

        // if (iterators_int[name] != undefined) {
        //     var gui = iterators_gui[name];
        //     // console.log(gui)
        //     color = gui.children[0].fill;
        //     // console.log(color)
        //     remove_it_wrapper(iterators_int[name]);
        // }

        // if ( ! color) {
        //     // console.log(Object.keys(iterators_int).length)
        //     color = iterators_colors[Object.keys(iterators_int).length];
        // }

        var length = arr.data.length
        var index = length
        // var it = new Iterator(arr, index, name);
        var it = new Iterator(arr, index, null);
        // iterators_int[name] = it;

        updateStatus();

        return it;
    };

    var source_value = function(it) {
        var data = it.data.data;
        var s = data[it.index];
        return s;
    };


    var source_wrapper = function(it) {
        var data = it.data.data;
        var max = data.length;
        if (it.index >= max) {
            showError('not valid iterator to take the source.');
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
            showError('not valid iterator to take the source.');
            disable('disabled');
            return;
        }

        addLogSink(it, x)
        
        data[it.index] = x;
        elements[it.index].group.children[1].value = x;

        if (log_stats_enabled) {
            ++stats_assigments;
        }

        updateStatus();
        two.update();
    };

    var equal_wrapper = function(a, b) {
        // addLog('equal(' + a.index + ', ' + b.index + ')');
        // addLog('equal(' + a.data.name + ', ' + b.index + ')');

        if (log_stats_enabled) {
            ++stats_it_cmps;
        }

        updateStatus();
        var res = a.index == b.index;
        addLogEqual(a, b, res)
        return res;
    };

    
    // var copy_it_wrapper = function(it, name, color) {

    //     if ( ! color) {
    //         // console.log(Object.keys(iterators_int).length)
    //         color = iterators_colors[Object.keys(iterators_int).length];
    //     }

    //     var index = it.index
    //     var it = new Iterator(it.data, it.index, name);
    //     var it_gui = drawIterator(two, it.data.elements[index], name, color);
    //     iterators_gui[name] = it_gui;
    //     iterators_int[name] = it;
    //     two.update();

    //     updateStatus();

    //     return it;
    // };

    // var remove_it_wrapper = function(it) {
    //     // console.log(iterators_gui[it.name]);
    //     two.remove(iterators_gui[it.name]);
    //     two.update();
    //     delete iterators_gui[it.name];
    //     delete iterators_int[it.name];
    //     updateStatus();
    // };


    var iter_swap_wrapper = function(a, b) {
        var data = a.data.data;
        // console.log(a)
        // console.log(data)
        // var elements = a.data.elements;
        var colors = a.data.colors;

        // var tmp_fill = elements[a.index].group.children[0].fill;
        // elements[a.index].group.children[0].fill = elements[b.index].group.children[0].fill;
        // elements[b.index].group.children[0].fill = tmp_fill;

        var tmp_color = colors[a.index];
        colors[a.index] = colors[b.index];
        colors[b.index] = tmp_color;

        var tmp = source_value(a);
        data[a.index] = source_value(b);
        // elements[a.index].group.children[1].value = source_value(b);

        data[b.index] = tmp;
        // elements[b.index].group.children[1].value = tmp;

        if (log_stats_enabled) {
            ++stats_swaps;
            stats_assigments += 3;
        }

        addLogSwap(a, b);
        updateStatus();
        two.update();
    };


    var add_sequence_internal_wrapper = function(data_par, name, paint_pred) {
        // console.log(data_par);

        if (sequences[name] != undefined) {
            showError('sequence "' + name + '" already exists.');
            disable('disabled');
            return null;
        }

        var data = [];
        var colors = [];
        var length = data_par.properties['length'];

        for (let i = 0; i < length; ++i) {
            data.push(data_par.properties[i]);
            colors.push(defaultElementColor);
        }

        // var elems = drawArray(two, data, name, Object.keys(sequences).length);
        var elems = null;
        var retobj = new Sequence(name, data, elems, colors);
        sequences[name] = retobj;

        updateStatus();
        // two.update();
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
        if (log_stats_enabled) {
            ++stats_pred_appls;
        }
        updateStatus();

        addLogPredicate(name, x, res);

        if (log_stats_enabled) {
            //TODO
            var hg_right_x_a = document.getElementById('hg-right-x-a');
            var text = '<p id="Status">' + name + '(' + x + ') = ' + res + '</p>';
            hg_right_x_a.innerHTML += text;
        }
    };    

    var call_relation_internal_wrapper = function(name, x, y, res) {
        if (log_stats_enabled) {
            ++stats_pred_appls;
        }
        updateStatus();

        addLogRelation(name, x, y, res);

        if (log_stats_enabled) {
            //TODO
            var hg_right_x_a = document.getElementById('hg-right-x-a');
            var text = '<p id="Status">' + name + '(' + x + ', ' + y + ') = ' + res + '</p>';
            hg_right_x_a.innerHTML += text;
        }
    };    

    

    var fill_elem_wrapper = function(data, i, c) {
        // var elements = data.elements;
        // let elem = elements[i];
        // elem.rect.fill = c;

        var colors = data.colors;
        colors[i] = c;
    };    

    var enable_log_stats_wrapper = function() {
        log_stats_enabled = true;
    };    

    var disable_log_stats_wrapper = function() {
        log_stats_enabled = false;
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
    // interpreter.setProperty(scope, 'copy_it',        interpreter.createNativeFunction(copy_it_wrapper));
    // interpreter.setProperty(scope, 'remove_it',      interpreter.createNativeFunction(remove_it_wrapper));
    interpreter.setProperty(scope, 'iter_swap',      interpreter.createNativeFunction(iter_swap_wrapper));
    // interpreter.setProperty(scope, 'assign_it',      interpreter.createNativeFunction(assign_it_wrapper));
    interpreter.setProperty(scope, 'add_sequence_internal',   interpreter.createNativeFunction(add_sequence_internal_wrapper));
    // interpreter.setProperty(scope, 'set_predicate',  interpreter.createNativeFunction(set_predicate_wrapper));
    interpreter.setProperty(scope, 'fill_elem',      interpreter.createNativeFunction(fill_elem_wrapper));
    // interpreter.setProperty(scope, 'increment_predicate_stats', interpreter.createNativeFunction(increment_predicate_stats_wrapper));
    interpreter.setProperty(scope, 'call_predicate_internal', interpreter.createNativeFunction(call_predicate_internal_wrapper));
    interpreter.setProperty(scope, 'call_relation_internal', interpreter.createNativeFunction(call_relation_internal_wrapper));

    interpreter.setProperty(scope, 'enable_log_stats', interpreter.createNativeFunction(enable_log_stats_wrapper));
    interpreter.setProperty(scope, 'disable_log_stats', interpreter.createNativeFunction(disable_log_stats_wrapper));
    
}

function callPredCode() {
    return 'function call_predicate(p, name, x){var res = p(x); call_predicate_internal(name, x, res); return res;};\n'
         + 'function predicate(p, name) {return function(x) {return call_predicate(p, name, x);};}\n'
         + 'function call_relation(r, name, x, y){var res = r(x, y); call_relation_internal(name, x, y, res); return res;}\n'
         + 'function relation(r, name){return function(x, y){return call_relation(r, name, x, y);};}\n'
         + 'function random_int(from, to) {if ( ! from) from = 0;if ( ! to) to = 99;return Math.floor(Math.random() * to) + from;}\n'
         + 'function random_array(n, from, to) {if ( ! n) n = 10;if ( ! from) from = 0;if ( ! to) to = 99;var res = []; while (n != 0) { var rand = Math.floor(Math.random() * to) + from; res.push(rand); --n;} return res; }\n';
}

function addSequenceCode() {
    return 'function add_sequence(d, n, p) {' + '\n' +
    '    disable_log_stats();' + '\n' +
    '    var obj = add_sequence_internal(d, n, p);' + '\n' +
    '    //print(obj);' + '\n' +
    '    if ( ! obj) {enable_log_stats(); return obj;}' + '\n' +
    '    if (p) {' + '\n' +    
    '        for (var i = 0; i < d.length; ++i) {' + '\n' +
    '            var value = d[i];' + '\n' +
    '            if ( ! p(value)) {' + '\n' +
    '                fill_elem(obj, i, "#ff9191");' + '\n' +
    '                //obj.colors[i] = "#ff9191";' + '\n' +
    '            }' + '\n' +
    '        }' + '\n' +
    '    }' + '\n' +
    '    enable_log_stats();' + '\n' +
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

    var output = document.getElementById('hg-right-y');
    output.innerHTML = '';

    var hg_right_x_a = document.getElementById('hg-right-x-a');
    // console.log(hg_right_x_a.innerHTML);
    hg_right_x_a.innerHTML = '';

    clearLog();

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

    var output = document.getElementById('hg-right-y');
    output.innerHTML = '';

    var hg_right_x_a = document.getElementById('hg-right-x-a');
    hg_right_x_a.innerHTML = '';

    clearLog();

    resetStatus();
    two.clear();

    startButton();
}


function startButton() {
    var codeAll = getAllCode();
    var codeView = getViewCode();
    
    // document.getElementById('dataCodeArea').style.display = "none";
    document.getElementById('codeArea').style.display = "none";
    document.getElementById('codeHighlightPre').style.display = "block";

    document.getElementById('startButton').style.display = "none";
    document.getElementById('stepButton').style.display = "inline";
    document.getElementById('editButton').style.display = "inline";
    document.getElementById('restartButton').style.display = "inline";

    var output = document.getElementById('hg-right-y');
    output.innerHTML = '';

    var hg_right_x_a = document.getElementById('hg-right-x-a');
    hg_right_x_a.innerHTML = '';

    clearLog();

    two.clear();
    resetStatus();

    var codeHighlight = document.getElementById('codeHighlight');
    codeHighlight.innerHTML = codeView;
    hljs.highlightBlock(codeHighlight);

    // var output = document.getElementById('hg-right-y');
    // hljs.highlightBlock(output);

    try {
        myInterpreter = new Interpreter(codeAll, initFunctions);    
        disable('');
        updateStatus();
    } catch (error) {
        editButton();
        showError("parsing error");
    }
}

function addVariable(name, value, seqn) {

    var initTop = defaultTopMargin + seqn * sequenceTotalHeight;

    var elems = drawVariable(two, name, value, initTop);

    var retobj = {
        name: name,
        value: value,
        elements: elems
    };

    variables[name] = retobj;
}

function drawScope(scope) {

    var reserved = ['arguments', 'this', 'undefined', 'NaN', 'Infinity',
        'Array', 'Boolean','Date', 'Error', 'EvalError', 'Function',
        'JSON', 'Math', 'Number', 'Object', 'RangeError', 'ReferenceError',
        'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
        'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'self', 
        'window',
        'add_sequence', 'add_sequence_internal', 'alert', 'assign_it',
        'begin', 'call_predicate', 'call_predicate_internal', 'call_relation',
        'call_relation_internal', 'copy_it', 'disable_log_stats', 'enable_log_stats',
        'end',  'equal', 'fill_elem', 'find_if', 'sink', 'source', 'successor', 'remove_it',
        'print', 'random_array', 'relation', 'iter_swap', 'predecessor', 'predicate'];

    // console.clear();
    two.clear();
    variables = [];
    
    // console.log(two.width);

    var keys = Object.keys(scope.properties).sort();
    // var keys = Object.keys(scope.properties);

    // First Sequences

    var seq_internal = [];

    for (var x in keys) {
        var key = keys[x];
        if ( ! reserved.includes(key)) {
            var value = scope.properties[key];
            if (value && value instanceof Sequence) {
                seq_internal.push({key: key, value: value});
            }
        }
    }

    for (var x in keys) {
        var key = keys[x];
        if ( ! reserved.includes(key)) {
            var value = scope.properties[key];
            if (value && value instanceof Iterator) {

                var found = seq_internal.find(function(x) {
                    return x.value && x.value.name == value.data.name;
                });

                if ( ! found) {
                    seq_internal.push({key: value.data.name, value: value.data});
                }
            }
        }
    }

    var seqn = 0;
    for (var i in seq_internal) {
        var key = seq_internal[i].key;
        var value = seq_internal[i].value;
        var elems = drawArray(two, key, seqn, value.data, value.colors);
        sequences[value.name].elements = elems;
        ++seqn;
    }

    var itn = 0;
    for (var x in keys) {
        var key = keys[x];
        if ( ! reserved.includes(key)) {
            var value = scope.properties[key];
            if (value && value instanceof Iterator) {

                // console.log(key)
                // console.log(value)

                if ( ! value.name) {
                    value.name = key;
                    iterators_int[key] = value;
                    updateStatus();
                }

                if (key != value.name) {
                    value.name = key;
                    iterators_int[key] = value;
                    updateStatus();
                }


                // var it = new Iterator(arr, index, null);
                // iterators_int[name] = it;

                var color = iterators_colors[itn];
                var it_gui = drawIterator(two, value.data.elements[value.index], key, color);
                iterators_gui[value.name] = it_gui;
                ++itn;
            }
        }
    }

    for (var x in keys) {
        // console.log(x);
        // console.log(keys[x]);

        var key = keys[x];


        if ( ! reserved.includes(key)) {
            var value = scope.properties[key];
        
            // console.log(key);
            // console.log(scope.properties['start']);

            if (value != undefined) {

                if (value instanceof Sequence) {
                } else if (value instanceof Iterator) {
                } else if (value instanceof Interpreter.Object) {
                } else {
                    // console.log(key);
                    // console.log(value);
                    addVariable(key, value, seqn);
                }

                // if ( ! value.class) {
                //     addVariable(key, value, seqn);
                // }
            } else {
                // console.log(key);
                // console.log(value);
                // addVariable(key, value, seqn);
            }
        }

    }
}


function stepButton() {
    var codeHighlight = document.getElementById('codeHighlight');
    // console.log(codeHighlight.innerHTML)


    while (true) {
        // console.log(myInterpreter)
        // console.log(myInterpreter.stateStack)

        if (myInterpreter.stateStack.length) {
            // console.log("stepButton 1");
            var node = myInterpreter.stateStack[myInterpreter.stateStack.length - 1].node;
            var scope = myInterpreter.stateStack[myInterpreter.stateStack.length - 1].scope;
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


        // break; //TODO


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

        drawScope(scope);

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