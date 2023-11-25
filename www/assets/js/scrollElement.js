/* var box = document.querySelector('.box'),
 targetElm = document.querySelector('.boxChild'); // <-- Scroll to here within ".box"
 */
 /* var box = document.getElementsByClassName("box"),
 targetElm = document.getElementsByClassName("boxChild"); */
 
/* document.querySelector('button').addEventListener('click', function () {
    scrollToElm(box, targetElm, 600);
}); */


/////////////

function scroll() {
    scrollToElm(box, targetElm, 600);
    console.log("box",box)
    console.log("targetElm",targetElm)
}

function scrollToElm(container, elm, duration) {
    var pos = getRelativePos(elm);
    if(pos){
        scrollTo(container, pos.top, 0.5);  // duration in seconds
    }
    
}

function getRelativePos(elm) {
    if (elm) {
        var pPos = elm.parentNode.getBoundingClientRect(), // parent pos
            cPos = elm.getBoundingClientRect(), // target pos
            pos = {};

        pos.top = cPos.top - pPos.top + elm.parentNode.scrollTop,
            pos.right = cPos.right - pPos.right,
            pos.bottom = cPos.bottom - pPos.bottom,
            pos.left = cPos.left - pPos.left;

        return pos;
    }
}

function scrollTo(element, to, duration, onDone) {
    var start = element.scrollTop,
        change = to - start,
        startTime = performance.now(),
        val, now, elapsed, t;

    function animateScroll() {
        now = performance.now();
        elapsed = (now - startTime) / 1000;
        t = (elapsed / duration);
        let t2 = easeInOutQuad(t)
        element.scrollTop = 0
        //start + change * t2;
        console.log("t value",t)
        console.log("t2 value",t2)
        console.log("start value",start)
        console.log("change value",change)
        if (t < 1)
            window.requestAnimationFrame(animateScroll);
        else
            onDone && onDone();
    };

    animateScroll();
}

function easeInOutQuad(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t };