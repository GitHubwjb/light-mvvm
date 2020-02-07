/*!
 * @light-mvvm.js v1.0
 * Copyright (c) 2020-2030 WJB
 * Free developer identity Publishing
 * Date:2020-02-06
*/

(function (){
    // Determine whether the system is in IE browser
    isIE()
})()


// @ Error tips Gallery.
// These utility functions are used to provide error prompt and check and assist the main program.

function Print(title, message, color){
    console.log("%c " + title + message, "color: " + color)
}

function isIE(){
    if (!!window.ActiveXObject || "ActiveXObject" in window){
        return Print('❌light-mvvm：', 'The system detects that the current environment is IE browser, and the system will not be able to use it!','red')
    }
}