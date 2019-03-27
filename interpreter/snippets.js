/*
Copyright Fernando Pelliccioni 2019

Distributed under the Boost Software License, Version 1.0. (See accompanying
file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt) 
*/

var snippets_cat = {
      find: 'linear-search'
    , find_n: 'linear-search'
    , find_if: 'linear-search'
    , find_if_n: 'linear-search'
    , find_backward_if: 'linear-search'
    , find_unguarded: 'linear-search'

    , iota: null

    , gcd: null
    , equal: null 
    , swap_ranges: null
    , swap_ranges_bounded: null
    , swap_ranges_n: null

    , reverse_n_indexed: 'rearrangements-position-based-reverse'
    , reverse_bidirectional: 'rearrangements-position-based-reverse'
    , reverse_n_forward: 'rearrangements-position-based-reverse'
    , reverse_copy: 'rearrangements-position-based-reverse'
    , reverse_n_with_buffer: 'rearrangements-position-based-reverse'
    , reverse_n_adaptive: 'rearrangements-position-based-reverse'
    , rotate_bidirectional: 'rearrangements-position-based-rotate'
    , rotate_random_access: 'rearrangements-position-based-rotate'

    , partition_semistable_0: 'rearrangements-predicate-based-partition'
    , partition_semistable: 'rearrangements-predicate-based-partition'
    , partition_semistable_nonempty: 'rearrangements-predicate-based-partition'
    , partition_copy: 'rearrangements-predicate-based-partition'
    , partition_stable_with_buffer_0: 'rearrangements-predicate-based-partition'
    , partition_stable_forward_slow: 'rearrangements-predicate-based-partition'
    , partition_stable_inplace_n: 'rearrangements-predicate-based-partition'
    
    , partition_point_n: 'rearrangements-predicate-based-partition'

    , select_0_2: 'selection'
    , select_1_2: 'selection'
    , select_1_3: 'selection'
    , max_element: 'selection'
    , min_element: 'selection'
    

    , insert_naive: null
    , insert: null
    , delete_selected_n_0: null
    , delete_selected_n_1: null

    , palindrome_naive: null
    , palindrome_forward_recursive: null
    , palindrome_bidirectional: null
};
    

var categories = [
    {id: 'rearrangements', name: 'Rearrangements', categories: [
        {id: 'rearrangements-position-based', name: 'Position-based', categories: [
              {id: 'rearrangements-position-based-reverse', name: 'Reverse', categories: []}
            , {id: 'rearrangements-position-based-rotate', name: 'Rotate', categories: []}      
        ]}
      , {id: 'rearrangements-predicate-based', name: 'Predicate-based', categories: [
            {id: 'rearrangements-predicate-based-partition', name: 'Partition', categories: []}          
        ]}
          
      , {id: 'rearrangements-ordering-based', name: 'Ordering-based', categories: []}
    ]}
  , {id: 'selection', name: 'Selection', categories: []}
  , {id: 'linear-search', name: 'Linear Search', categories: []}
];


var snippets = {

find: 
`var r = range_bounded('f', 'l');
function find(f, l, x) {
    while ( ! equal(f, l) && x != source(f, false)) {
        f = successor(f)
    }
    return f;
}

var d = sequence(random_array(), "d");
var f = begin(d);
var l = end(d);

f = find(f, l, 42);
if ( ! equal(f, l)) {
    print(source(f));
}`

,find_n: 
`var _r = range_counted('f', 'n');
function find_n(f, n, x) {
    while ( n != 0 && x != source(f, false)) {
        f = successor(f)
        --n;
    }
    return [f, n];
}

var d = sequence(random_array(), "d");
var f = begin(d);
var n = size(d);

var r = find_n(f, n, 42);
f = r[0];
n = r[1];
if (n != 0) {
    print(source(f));
}`


,find_if: 
`var r = range_bounded('f', 'l');
function find_if(f, l, p) {
    while ( ! equal(f, l) && ! p(source(f))) {
        f = successor(f)
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d");
var f = begin(d);
var l = end(d);

f = find_if(f, l, even);
if ( ! equal(f, l)) {
    print(source(f));
}`


, find_backward_if: 
`function find_backward_if(f, l, p) {
    while (true) {
        if (equal(l, f)) return f;
        l = predecessor(l);
        if (p(source(l))) return successor(l);
    }    
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d");
var f = begin(d);
var l = end(d);

var it = find_backward_if(f, l, even);
if ( ! equal(it, f)) {
    print(source(predecessor(it)));
}
`

,find_unguarded: 
`var r = range_infinite('f');
function find_unguarded(f, x) {
    while (x != source(f, false)) {
        f = successor(f)
    }
    return f;
}

var x = 42;

var d = sequence(random_array(), "d");
var l = predecessor(end(d));
var tmp = source(l, false);
sink(l, x);

var f = begin(d);
f = find_unguarded(f, x);

if ( ! equal(f, l)) {
    sink(f, x + x);
    sink(l, tmp);
} else {
    if (tmp == x) {
        sink(f, x + x);
    } else {
        sink(f, tmp);
    }
}

print(d);
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
var d = sequence(random_array(), "d");

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
var d = sequence(random_array(), "d");

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

var d1 = sequence(new Array(8), "d1");
var d2 = sequence(new Array(5), "d2");

var f = successor(begin(d1));
var l = predecessor(end(d1));

var r = iota(f, l);
print(r);

f = begin(d2);
l = end(d2);


r = iota(f, l, r);
print(r);`

,partition_semistable_0:
`//Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L40

function partition_semistable_0(f, l, p) {
    f = tao.find_if(f, l, p);
    if (f == l) return f;

    var j = f;
    j = successor(j)

    while ( ! equal(j, l)) {
        if ( ! p(source(j))) {
            swap_iter(f, j);
            f = successor(f);
        }
        j = successor(j);
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

var it = partition_semistable_0(f, l, even);
if ( ! equal(it, l)) {
    print('partition point: ' + source(it));
}`

,partition_semistable:
`//Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L58

var r = range_bounded("f", "l");
var r2 = range_bounded("j", "l");
var r3 = range_bounded("p", "l");

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
            swap_iter(f, j);
            f = successor(f);
        }
        j = successor(j);
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

var p = partition_semistable(f, l, even);
if ( ! equal(p, l)) {
    print('partition point: ' + source(p));
}`

,partition_semistable_nonempty:
`//Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L91

var r = range_bounded("f", "l");
var r2 = range_bounded("j", "l");

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
            swap_iter(f, j);
            f = successor(f);
        }
        j = successor(j);
    }
    swap_iter(f, j);
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

partition_semistable_nonempty(f, l, even);`


,partition_copy:
`function partition_copy(f, l, r_b, r_g, p) {
    while ( ! equal(f, l)) {
        if (p(source(f))) {
            sink(r_g, source(f));
            r_g = successor(r_g);
        } else {
            sink(r_b, source(f));
            r_b = successor(r_b);
        }
        f = successor(f);
    }
    return [r_b, r_g];
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
var bad = sequence(new Array(size(d)), "bad");
var good = sequence(new Array(size(d)), "good");

var res = partition_copy(begin(d), end(d), begin(bad), begin(good), even);

var fg = res[0];
var fb = res[1];

print('...');`



,partition_stable_with_buffer_0:
`
function partition_stable_with_buffer_0(f, l, p, b) {
    var tmp = tao.partition_copy(f, l, f, b, p);
    var tf = tmp[0];
    var ts = tmp[1];
    tao.copy(b, ts, tf);
    return tf;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
var buf = sequence(new Array(size(d)), "buf");

var p = partition_stable_with_buffer_0(begin(d), end(d), even, begin(buf));
if ( ! equal(p, end(d))) {
    print('partition point: ' + source(p).toString());
    //print('partition point: ' + source(p));
}`


,partition_stable_forward_slow:
`//Variation of Nico Lomutos's partition algorithm: https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
//Code taken from: https://github.com/tao-cpp/algorithm/blob/master/include/tao/algorithm/partition/partition.hpp#L58

var r = range_bounded("f", "l");
var r2 = range_bounded("j", "l");
var r3 = range_bounded("p", "l");

function partition_stable_forward(f, l, p) {
    while (true) {
        if (equal(f, l)) return f;
        if (p(source(f))) break;
        f = successor(f);
    }

    var j = f;
    j = successor(j)

    while ( ! equal(j, l)) {
        if ( ! p(source(j))) {
            tao.rotate(f, j, successor(j));
            f = successor(f);
        }
        j = successor(j);
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
var f = begin(d);
var l = end(d);

var p = partition_stable_forward(f, l, even);
if ( ! equal(p, l)) {
    print('partition point: ' + source(p));
}`


,partition_stable_inplace_n:
`//Stepanov Algorithm [Stepanov 1987]
var r = range_counted("f", "n");

function partition_stable_inplace_n(f, n, p) {
    if (n == 0) {
        return [f, f];
    }

    if (n == 1) {
        var l = successor(f);
        if (p(source(f))) {
            return [f, l];
        }
        return [l, l];
    }

    var i = partition_stable_inplace_n(f, tao.half_nonnegative(n), p);
    var i0 = i[0];
    var i1 = i[1];
    var j = partition_stable_inplace_n(i1, n - tao.half_nonnegative(n), p);
    var j0 = j[0];
    var j1 = j[1];
    return [tao.rotate(i0, i1, j0), j1];
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence(random_array(), "d", even);
print(d);
var p = partition_stable_inplace_n(begin(d), size(d), even);

var p0 = p[0];
var p1 = p[1];
print('...');
`


,partition_point_n:
`var r = range_counted("f", "n");

function partition_point_n(f, n, p) {
    while (n != 0) {
        var h = tao.half_nonnegative(n);
        var m = successor(f, h);

        if (p(source(m))) {
            n = h;
        } else {
            n -= h + 1;
            f = successor(m);
        }
    }
    return f;
}

var even = predicate(function(x) {return x % 2 == 0;}, "even");
var d = sequence([1, 5, 1, 1, 3, 3, 3, 7, 3, 2, 6, 4], "d", even);

var p = partition_point_n(begin(d), size(d), even);
print('partition point: ' + source(p));`




,select_0_2:
`// Same as min(a, b)

function select_0_2(a, b, r) {
    return r(b, a) ? b : a;
}
var r = relation(function(x, y) { return x < y; }, 'less');

var tmp = random_array(2);
var a = tmp[0];
var b = tmp[1];

var m = select_0_2(a, b, r);
print(m);`


,select_1_2:
`// Same as max(a, b)

function select_1_2(a, b, r) {
    return r(b, a) ? a : b;
}
var r = relation(function(x, y) { return x < y; }, 'less');

var tmp = random_array(2);
var a = tmp[0];
var b = tmp[1];

var m = select_1_2(a, b, r);
print(m);`


,select_1_3:
`// Median of 3

function select_1_3_ab(a, b, c, r) {
    // precondition: a <= b
    return ! r(c, b) ? 
                b :                      // a, b, c are sorted
                tao.select_1_2(a, c, r); // b is not the median
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
`function gcd(a, b) {
    while (b != 0) {
        var r = tao.remainder(a, b);
        a = b;
        b = r;
    }
    return a;
}

var a = random_int();
var b = random_int();

var g = gcd(a, b);
print(g);`


, equal_r: 
`function equal_r(f, l, f2, r) {
    while ( ! equal(f, l)) {
        if ( ! r(source(f), source(f2))) {
            return false;
        }

        f = successor(f);
        f2 = successor(f2);
    }
    return true;
}

var d1_raw = ['e', 'v', 'i', 't', 'a', 't', 'i', 'v', 'e'];
var d2_raw = ['e', 'v', 'i', 't', 'x', 't', 'i', 'v', 'e'];

var eq = relation(function(x, y) {return x == y;}, "eq");
var d1 = sequence(d1_raw, "d1");
var d2 = sequence(d2_raw, "d2");

var f = begin(d1);
var l = end(d1);
var f2 = begin(d2);

var res = equal_r(f, l, f2, eq);
print(res);`


, palindrome_naive:
`function palindrome_naive(seq_arr, r) {
    var seq = sequence(seq_arr, "seq");
    var seq_arr_rev = seq_arr.slice().reverse();
    var seq_rev = sequence(seq_arr_rev, "seq_rev");

    var f = begin(seq);
    var l = end(seq);
    var f2 = begin(seq_rev);

    var res = tao.equal_r(f, l, f2, r);

    return res;
}

var eq_rel = relation(function(x, y) {return x == y;}, "eq_rel");

//var word_arr = ['e', 'v', 'i', 't', 'a', 't', 'i', 'v', 'e'];
var word_arr = ['e', 'v', 'i', 'x', 'a', 't', 'i', 'v', 'e'];

var res = palindrome_naive(word_arr, eq_rel);
if (res) {
    print('the word is palindrome');
} else {
    print('the word not is palindrome');
};`



, palindrome_forward_recursive:
`var r = range_counted("f", "n");
function palindrome_forward_recursive(f, n, r) {
    if (n == 0) return [true, f];
    if (n == 1) return [true, successor(f)];

    var ret = palindrome_forward_recursive(successor(f), n - 2, r);
    var ret_first = ret[0];
    var f2 = ret[1];

    if ( ! ret_first) return ret;
    if ( ! r(source(f), source(f2))) return [false, f2];

    return [true, successor(f2)];
}

function palindrome_forward(f, n, r) {
    return palindrome_forward_recursive(f, n, r)[0];
}

var eq_rel = relation(function(x, y) {return x == y;}, "eq_rel");

var word = sequence(['e', 'v', 'i', 't', 'a', 't', 'i', 'v', 'e'], "word");
// var word = sequence(['e', 'v', 'i', 'x', 'a', 't', 'i', 'v', 'e'], "word");

var f = begin(word);
var n = size(word);

var res = palindrome_forward(f, n, eq_rel);


if (res[0]) {
    print('the word is palindrome');
} else {
    print('the word not is palindrome');
};`




, palindrome_bidirectional:
`function palindrome_bidirectional(f, l, r) {
    while (true) {
        if (equal(f, l)) break;
        l = predecessor(l);

        if ( ! r(source(f), source(l))) return false;

        f = successor(f);
        if (equal(f, l)) break;
    }
    return true;
}

var eq_rel = relation(function(x, y) {return x == y;}, "eq_rel");

//var word = sequence(['e', 'v', 'i', 't', 'a', 't', 'i', 'v', 'e'], "word");
//var word = sequence(['e', 'v', 'i', 'x', 'a', 't', 'i', 'v', 'e'], "word");
var word = sequence(['e', 'v', 'i', 't', 't', 'i', 'v', 'e'], "word");

var f = begin(word);
var l = end(word);

var res = palindrome_bidirectional(f, l, eq_rel);

if (res) {
    print('the word is palindrome');
} else {
    print('the word not is palindrome');
};`



,swap_ranges:
`function swap_ranges(f0, l0, f1) {
    while ( ! equal(f0, l0)) {
        swap_iter(f0, f1);
        f0 = successor(f0);
        f1 = successor(f1);
    }
    return f1; 
}

var s1 = sequence(random_array(), "s1");
var s2 = sequence(random_array(), "s2");

var r = swap_ranges(begin(s1), end(s1), begin(s2));
print('...');`


,swap_ranges_bounded:
`function swap_ranges_bounded(f0, l0, f1, l1) {
    while ( ! equal(f0, l0) && ! equal(f1, l1)) {
        swap_iter(f0, f1);
        f0 = successor(f0);
        f1 = successor(f1);
    } 
    return [f0, f1];
}

var s1 = sequence(random_array(), "s1");
var s2 = sequence(random_array(5), "s2");

var r = swap_ranges_bounded(begin(s1), end(s1), begin(s2), end(s2));
var f0 = r[0];
var f1 = r[1];
print('...');`



,swap_ranges_n:
`var r0 = range_counted("f0", "n");
var r1 = range_counted("f1", "n");

function swap_ranges_n(f0, f1, n) {
    while (n != 0) {
        swap_iter(f0, f1);
        f0 = successor(f0);
        f1 = successor(f1);
        --n;
    }
    return [f0, f1];
}

var s1 = sequence(random_array(), "s1");
var s2 = sequence(random_array(5), "s2");

var r = swap_ranges_n(begin(s1), begin(s2), 5);
var f0 = r[0];
var f1 = r[1];
print('...');`


,reverse_n_indexed:
`var r = range_counted("f", "n");

function reverse_n_indexed(f, n) {
    var i = 0;
    --n;
    while (i < n) {
        swap_iter(successor(f, i), successor(f, n)); 
        ++i;
        --n;
    } 
}

var s = sequence(random_array(), "s1");
print(s);
reverse_n_indexed(begin(s), size(s));
print(s);
print('...');`



,reverse_bidirectional:
`var r = range_bounded("f", "l");

function reverse_bidirectional(f, l) {

    while (true) {
        if (equal(f, l)) return;
        l = predecessor(l);
        if (equal(f, l)) return;
        swap_iter(f, l);
        f = successor(f);        
    }
}

var s = sequence(random_array(), "s1");
print(s);
reverse_bidirectional(begin(s), end(s));
print(s);
print('...');`

,reverse_n_forward:
`var r = range_counted("f", "n");

function reverse_n_forward(f, n) {
    if (n < 2) return successor(f, n);
    var h = tao.half_nonnegative(n);
    var n_mod_2 = n - tao.twice(h);

    var m = successor(reverse_n_forward(f, h), n_mod_2);
    var l = reverse_n_forward(m, h);

    tao.swap_ranges_n(f, m, h);
    return l;
}

var s = sequence(random_array(), "s1");
print(s);
var r = reverse_n_forward(begin(s), size(s));
print(s);
print('...');`


,reverse_copy:
`//var r = range_counted("f", "n");
function reverse_copy(f_i, l_i, f_o) {
    while ( ! equal(f_i, l_i)) {
        l_i = predecessor(l_i);
        sink(f_o, source(l_i));
        f_o = successor(f_o);

    } 
    return f_o;
}

var d = sequence(random_array(), "d");
var b = sequence(new Array(size(d)), "b");

var res = reverse_copy(begin(d), end(d), begin(b));
print(d);
print(b);`


,reverse_n_with_buffer:
`//var r = range_counted("f", "n");

function reverse_n_with_buffer(f_i, n, f_b) {
    return tao.reverse_copy(f_b, tao.copy_n(f_i, n, f_b)[1], f_i);
}

var s = sequence(random_array(), "s");
var b = sequence(new Array(size(s)), "b");
print(s);
var r = reverse_n_with_buffer(begin(s), size(s), begin(b));
print(s);`

,reverse_n_adaptive:
`var r = range_counted("f_i", "n_i");

function reverse_n_adaptive(f_i, n_i, f_b, n_b) {
    if (n_i < 2) return successor(f_i, n_i);
    if (n_i <= n_b) return tao.reverse_n_with_buffer(f_i, n_i, f_b);

    var h_i = tao.half_nonnegative(n_i);
    var n_mod_2 = n_i - tao.twice(h_i);
    var m_i = successor(reverse_n_adaptive(f_i, h_i, f_b, n_b), n_mod_2);
    var l_i = reverse_n_adaptive(m_i, h_i, f_b, n_b);

    tao.swap_ranges_n(f_i, m_i, h_i);
    return l_i;

}

var s = sequence(random_array(16), "s");
//var b = sequence(new Array(size(s)), "b");
var b = sequence(new Array(4), "b");
print(s);
var r = reverse_n_adaptive(begin(s), size(s), begin(b), size(b));
print(s);`



,rotate_bidirectional:
`var r0 = range_bounded("f", "m");
var r1 = range_bounded("m", "l");

function rotate_bidirectional(f, m, l) {
    tao.reverse(f, m);
    tao.reverse(m, l);
    tao.reverse(f, l);
}

var s = sequence(random_array(), "s");
print(s);
rotate_bidirectional(begin(s), successor(begin(s), 3), end(s));
print(s);
print('...');`



,rotate_random_access:
`//skip_debug("k_rotate_from_permutation_random_access");

function cycle_from(i, f) {
    var tmp = source(i);
    var j = i;
    var k = f(i);
    while ( ! equal(k, i)) {
        sink(j, source(k));
        j = k;
        k = f(k);
    }
    sink(j, tmp);
}

function rotate_cycles(f, m, l, from) {
    var d = tao.gcd(distance(f, m), distance(m, l));

    while (d != 0) {
        --d;
        cycle_from(successor(f, d), from);
    }
    return successor(f, distance(m, l));
}

function k_rotate_from_permutation_random_access(f, m, l) {
    var k = distance(m, l);
    var n_minus_k = distance(f, m);
    var m_prime = successor(f, distance(m, l));

    return function(x) {
        if ( distance(x, m_prime) > 0) return successor(x, n_minus_k);
        return predecessor(x, k);
    };
}

function rotate_random_access_nontrivial(f, m, l) {
    var p = k_rotate_from_permutation_random_access(f, m, l);
    return rotate_cycles(f, m, l, p);
}

var s = sequence(random_array(16), "s");
fill_elem(s, 1, "#ff9191");
print(s);
rotate_random_access_nontrivial(begin(s), successor(begin(s), 6), end(s));
print(s);
print('...');`





,insert_naive:
`function insert_naive(s, ip, f, l) {
    var d = distance(begin(s), ip);
    
    while ( ! equal(f, l)) {
        // s = increase_capacity(s, 1)
        s = push_back(s, 0);
        ip = successor(begin(s), d)
        tao.shift_right_by_one(ip, end(s));
        sink(ip, source(f));
        f = successor(f);
        ++d;
    }

    return s;
}

var s = sequence(random_array(), "s");
var i = sequence(random_array(5), "i");

print(s);
print(i);
s = insert_naive(s, begin(s), begin(i), end(i));
print(s);
print('...');`



,insert:
`function insert(s, ip, f, l) {
    var d = distance(begin(s), ip);
    var ld = distance(ip, end(s));
    
    while ( ! equal(f, l)) {
        s = push_back(s, source(f));
        f = successor(f);
        ++d;
    }

    tao.rotate(begin(s), successor(begin(s), ld), end(s));

    return s;
}

var s = sequence(random_array(), "s");
var i = sequence(random_array(5), "i");

print(s);
print(i);
s = insert(s, begin(s), begin(i), end(i));
print(s);
print('...');`

,delete_selected_n_0:
`
skip_debug("is_selected");
skip_debug("Shape");
skip_debug("createSeq");

function delete_selected_n_0(seq) {
    var f = begin(seq);
    var n = size(seq);

    var i = 0;    
    while (i < n) {
        if (source(f).selected) {
            remove_at(seq, i);
            --n;
        } else {
             f = successor(f);
             ++i;
        }
    }
}

function Shape(value, selected) {
    this.value = value;
    this.selected = selected;
}

Shape.prototype.toString = function() {
    return String(this.value);
}

function is_selected(s) {
    return ! s.selected;
}

function createSeq() {
    var tmp = [new Shape(0, false), new Shape(1, true), new Shape(2, false) 
        , new Shape(3, true), new Shape(4, false), new Shape(5, false)
        , new Shape(6, false), new Shape(7, false), new Shape(8, true)
        , new Shape(9, false)]

    var s = sequence(tmp, "s", is_selected);
    return s;

}

var s = createSeq();

print(s);
delete_selected_n_0(s);
print(s);
print('...');`



,delete_selected_n_1:
`
skip_debug("is_selected");
skip_debug("Shape");
skip_debug("createSeq");

function delete_selected_n_1(seq) {
    var f = end(seq);
    var n = size(seq);

    while (n != 0) {
        f = predecessor(f);
        if (source(f).selected) {
            remove_at(seq, n - 1);
        }
        --n;
    }
}

function Shape(value, selected) {
    this.value = value;
    this.selected = selected;
}

Shape.prototype.toString = function() {
    return String(this.value);
}

function is_selected(s) {
    return ! s.selected;
}

function createSeq() {
    var tmp = [new Shape(0, false), new Shape(1, true), new Shape(2, false) 
        , new Shape(3, true), new Shape(4, false), new Shape(5, false)
        , new Shape(6, false), new Shape(7, false), new Shape(8, true)
        , new Shape(9, false)]

    var s = sequence(tmp, "s", is_selected);
    return s;

}

var s = createSeq();

print(s);
delete_selected_n_1(s);
print(s);
print('...');`

};

