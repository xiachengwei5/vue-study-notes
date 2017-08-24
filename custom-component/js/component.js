/**
 * Created by Jeff on 2017/8/24.
 */


//注册全局组件——父组件
Vue.component("custom-select", {
    data: function () {         //组件里面的data必须是函数
        return {
            selectShow: false,  //控制选项点击后显示，再点击后隐藏
            selectValue: ''     //接收点击选项后的参数
        }
    },
    props: ["btnValue", "list"],      //向子组件传值
    template: `<section class="warp">
					<div class="searchIpt clearFix">
						<div class="clearFix">
							<input type="text" class="keyWord" @click="selectShow = !selectShow"  :value="selectValue" />
							<input type="button" :value="btnValue">
							<span></span>
						</div>
                        <custom-list
                            :list="list"
                            v-show="selectShow"
                            @receive="selectOption"
                            >
                        </custom-list>
					</div>
				</section>`,
    methods: {
        selectOption(item){
            this.selectValue = item;
            this.selectShow = false;
        },
    }
});


//注册全局组件——子组件
Vue.component("custom-list", {
    props: ["list"],      //接收父组件传过来的值
    template: `<ul class="list">
                        <li v-for="item in list" @click="selectOption(item)">{{ item }}</li>
                    </ul>`,
    methods: {
        selectOption(item){
            //在此处用$emit调用父组件的自定义方法，与父组件进行通信
            this.$emit("receive", item);
        }
    }
});