/*!
 * @light-mvvm.js v1.0
 * Copyright (c) 2020-2030 WJB
 * Free developer identity Publishing
 * Date:2020-02-06
*/

// @ Template compilation
// Move page elements into memory for work

class Compile {
    constructor(el, vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm
        if(this.el){
            // Which DOM is it?
            let fragment = this.node2fragment(this.el)
            // How does it compile?
            this.compile(fragment)
            // What should it do after compiling?
            this.el.appendChild(fragment)
        }
    }

// @ Assist compile to complete the work (weight: core)
// These functions complete the work of moving into memory, compiling elements, compiling text and so on.

    compileElement(node){
        let attrs = node.attributes
        Array.from(attrs).forEach(attr => {
        let attrName = attr.name
            if(this.isDirective(attrName)){
                let expr = attr.value
                let [,type] = attrName.split('-')
                CompileUtil[type](node, this.vm, expr)
            }
        })
    }

    compileText(node){
        let expr = node.textContent
        let reg = /\{\{([^}]+)\}\}/g
        if(reg.test(expr)){
            CompileUtil['text'](node, this.vm, expr)
        }
    }

    node2fragment(el){
        let fragment = document.createDocumentFragment()
        let firstChild
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild)
        }
        return fragment
    }

    compile(fragment){
        let childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node => {
            if(this.isElementNode(node)){
                this.compileElement(node)
                this.compile(node)
            }else{
                this.compileText(node)
            }
        })
    }

// @ Assist compile to complete the work (weight: secondary)
// These functions complete the work of judging Dom and whether there are instructions.

    isElementNode(node){
        return node.nodeType == 1
    }

    isDirective(name){
        return name.includes('v-')
    }
}

// @ Compile tool library
// They are responsible for obtaining instance data, compiling results, text processing, and updating views.

CompileUtil = {

    getVal(vm, expr){
        expr = expr.split('.')
        return expr.reduce((prev, next) => {
            return prev[next]
        },vm.$data)
    },

    getTextVal(vm, expr){
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },

    text(node, vm, expr){
        let updateFn = this.updater['textUpdater']
        let value = this.getTextVal(vm, expr)
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], (newValue) => {
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })
        updateFn && updateFn(node, value)
    },

    setVal(vm, expr, value){
        expr = expr.split('.')
        return expr.reduce((prev, next, currentIndex) => {
            if(currentIndex === expr.length -1){
                return prev[next] = value
            }
            return prev[next]
        },vm.$data)
    },

    model(node, vm, expr){
        let updateFn = this.updater['modelUpdater']
        new Watcher(vm, expr, (newValue) => {
            updateFn && updateFn(node, this.getVal(vm,expr))
        })
        node.addEventListener('input', (e) => {
            let newValue = e.target.value
            this.setVal(vm, expr, newValue)
        })
        updateFn && updateFn(node, this.getVal(vm,expr))
    },

// @ Update view in real time
// It is responsible for text update and input box update.

    updater: {

        textUpdater(node, value){
            node.textContent = value
        },

        modelUpdater(node, value){
            node.value = value
        }
    }
}