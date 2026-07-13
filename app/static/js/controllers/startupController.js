'use strict'
export function start(){
    const timer = Number(document.body.dataset.timer);
    const nextUrl = document.body.dataset.nextUrl;

    splash_window_transition(timer, nextUrl);
}

function splash_window_transition(timer, nextUrl){
    setTimeout(() => {
        window.location.href = nextUrl
    }, timer)
}