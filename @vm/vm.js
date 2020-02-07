/*!
 * @light-mvvm.js v1.0
 * Copyright (c) 2020-2030 WJB
 * Free developer identity Publishing
 * Date:2020-02-06
*/

// @ It is the top-level object for users to create
// let vm = new miniVM({Object})

class miniVM{
    constructor(options){

        // Which DOM area do you control?
        this.$el = options.el

        // Where is the data?
        this.$data = options.data

        // Discover the template and compile it. 
        // If the template does not exist, ignore it.
        if(this.$el){

            // Data hijacking and proxy
            new Observer(this.$data)
            this.proxyData(this.$data)

            // Compiling with data and elements.
            // Because the data object needs to mount multiple data, 
            // it is directly transferred to "this".
            new Compile(this.$el, this)
        }
    }

// @ Data broker tools
// Further responsive support.
    proxyData(data){
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get(){
                    return data[key]
                },
                set(){
                    data[key] = newValue
                }
            })
        })
    }
}