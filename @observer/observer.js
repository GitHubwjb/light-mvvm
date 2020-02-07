/*!
 * @light-mvvm.js v1.0
 * Copyright (c) 2020-2030 WJB
 * Free developer identity Publishing
 * Date:2020-02-06
*/

// @ Data hijacking
// It is mainly responsible for data response of data objects.

class Observer{
    constructor(data){
        this.observe(data)
    }

// @ Assist the observer to complete the work
// It can change object set / get properties, define responsive views, and so on.

    observe(data){
        if(!data || typeof data !== 'object'){return;}
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            // Deep recursive hijacking
            this.observe(data[key])
        })  
    }

    defineReactive(obj, key, value){
        let that = this
        let dep = new Dep()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
                get(){
                    Dep.target && dep.addSub(Dep.target)
                    return value
                },
                set(newValue){
                    if(newValue != value){
                    that.observe(newValue)
                    value = newValue
                    dep.notify()
                }
            }
        })
    }
}

// @ Trigger monitor (publish subscription)
// It will be a bridging Gua.

class Dep{  
    constructor(){
        // Where do subscribers put it?
        this.subs = []
    }

    // How to add subscribers?
    addSub(watcher){
        this.subs.push(watcher)
    }

    // How to inform everyone?
    notify(){
        this.subs.forEach(watcher => watcher.update())
    }
}