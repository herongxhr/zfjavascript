let vm = new Vue({
    el: "#app",
    data: {
        todos: [
            {isSelected: false, title: '睡觉'},
            {isSelected: false, title: '吃饭'}
        ],
        title: "",
        hash: "#all"
    },
    created() {
        //window可以监听当前页面hash值的变化：hashchange
        window.addEventListener("hashchange", () => {
            //一旦页面中的hash发生变化，对data中的hash赋值
            //window.location.hash获取当前页面的hash值；
            this.hash = window.location.hash;
        })
    },
    methods: {
        add() {
            this.todos.push({
                isSelected: false,
                title: this.title
            })
            //每回车一次，向todo中新增一个对象；当新增完成之后，清空当前input中的val
            this.title = "";
        },
        remove(val) {
            this.todos = this.todos.filter(item => item !== val);
        }

    },
    computed: {
        filterTodo() {
            if (this.hash === "#all") {
                return this.todos;
            }
            if (this.hash === "#finish") {
                return this.todos.filter(item => item.isSelected)
            }
            if (this.hash === "#unfinish") {
                return this.todos.filter(item => !item.isSelected)
            }
        }
    }
});
