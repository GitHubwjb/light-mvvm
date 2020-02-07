/*!
 * @light-mvvm.js v1.0
 * Copyright (c) 2020-2030 WJB
 * Free developer identity Publishing
 * Date:2020-02-06
*/

// @ It is responsible for observing data changes
// Add an observer to the element that needs to change and execute the corresponding method.

class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm
        this.expr = expr
        this.cb = cb
        // Please don't abandon old value?
        this.value = this.get()
    }

// @ multiplexing compile.js => getVal()
// And external exposure.

    getVal(vm,expr){
        expr = expr.split('.')
        return expr.reduce((prev, next) => {
            return prev[next]
        },vm.$data)
    }

    get(){
        Dep.target = this
        let value = this.getVal(this.vm, this.expr)
        Dep.target = null
        return value
    }

    update(){
        // New value?
        let newValue = this.getVal(this.vm, this.expr)
        // Old value?
        let oldValue = this.value
        // If the old value is not equal to the new value?
        if(newValue != oldValue){
            // Callback corresponding to watch!
            this.cb(newValue)
        }
    }
}