/*var list = [
 {
 title: '吃饭',
 isChecked: true         //true表示选中状态(已办任务)
 },{
 title: '睡觉',
 isChecked: false        //false表示未选中状态（待办任务）
 },{
 title: '打豆豆',
 isChecked: false
 }
 ];
 */


//本地存储
var store = {
    save(key, value){
        //将数据存到本地缓存中，将获取的对象转换为字符串
        localStorage.setItem(key, JSON.stringify(value));
    },
    fetch(key){
        //从本地缓存中获取缓存数据并转换为Json对象，如果没有则返回空数组
        return JSON.parse(localStorage.getItem(key)) || [];
    }
};

//从本地缓存中获取数据
var list = store.fetch("todoList");

//配置过滤器
var filter = {
    all: function (list) {
        return list;
    },
    unfinished: function (list) {
        return list.filter(function (item) {
            return !item.isChecked;
        })
    },
    finished: function (list) {
        return list.filter(function (item) {
            return item.isChecked;
        })
    }
};


var vm = new Vue({
    el: '.main',
    data: {
        list,               //数据列表
        todo: '',           //记录新增的数据
        visibility: 'all',  //通过控制该属性的值进行筛选
        beforeTitle: '',    //记录当前项的值
        editTodos: ''        //记录当前项
    },
    methods: {
        addTodo(){      //添加任务
            if ("" != this.todo.trim()) {
                //向list中添加任务
                this.list.push({
                    title: this.todo,
                    isChecked: false
                });
                //调用本地缓存的方法将最新的数据存到本地缓存中
                //store.save(this.list);
            } else {
                alert("任务名称不能为空");
            }
            //添加完成后清空文本框中的值
            this.todo = '';
            //刷新页面
            this.refresh();
        },
        deleteTodo(item){      //删除任务
            //获取当前项在数组中的索引
            var index = this.list.indexOf(item);
            //根据索引删除当前项，splice()是变异方法，会触发视图更新
            this.list.splice(index, 1);
            //刷新页面
            this.refresh();
        },
        editTodo(item){     //编辑任务
            //在编辑前现将当前值存起来，供取消编辑时使用
            this.beforeTitle = item.title;
            this.editTodos = item;
        },
        editedTodo(){       //编辑任务完成
            //通过改变editTodos的值来切换编辑模式（隐藏input）达到编辑完成的目的
            this.editTodos = '';
        },
        cancelEditTodo(item){   //取消编辑
            //将title设置为编辑前的值
            item.title = this.beforeTitle;
            this.beforeTitle = '';
            this.editTodos = '';
        },
        refresh(){
            //本来不需要刷新页面，但是通过hash来筛选数据之后是通过监控visibility的值来刷新页面的，所以需要手动刷新
            //通过重新给visibility属性赋值来刷新页面，这种处理方式肯定不好，但暂未找到更好的方式
            let temp = this.visibility;
            this.visibility = '';
            this.visibility = temp;
        }
    },
    watch: {
        //监控list属性，如果对象的个数发生变化时就会调用此函数
        /*list: function () {
         //调用本地缓存的方法将最新的数据存到本地缓存中
         store.save("todoList", this.list);
         }*/

        list: {
            handler: function () {
                store.save("todoList", this.list);
            },
            deep: true          //深度监控：可以发现对象内部值的变化
        }
    },
    computed: {
        //利用计算属性，计算未完成任务的个数
        unfinishedCount: function () {
            return this.list.filter(function (item) {
                return !item.isChecked;
            }).length
        },
        filteredList: function () {
            //如果能匹配上过滤函数就返回过滤后的值，如果没有就返回所有list中的值
            return filter[this.visibility] ? filter[this.visibility](list) : list;
        }
    },
    directives: {                       //自定义指令
        "focus": {
            update(el, binding, vnode){        //钩子函数，所在组件的 VNode 更新时调用
                if(binding.value){
                    el.focus();
                }
            }
        }
    }
});


function watchHashChage() {
    //获取url中的第一个参数
    var hash = window.location.hash.slice(1);
    //设置过滤函数的参数为hash
    vm.visibility = hash;
}

//注册事件监听器
window.addEventListener("hashchange", watchHashChage);



