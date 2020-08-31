var a=1;
function f() {
    function f1() {
        a=3
    }
    f1();
}
f();
console.log(a);
