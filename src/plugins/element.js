//如果你一开始配置element插件时选了全局导入就不用一个个写了
import Vue from 'vue'
import { Button, Step} from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Container, Header, Aside, Main } from 'element-ui'
import { Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui'
import { Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination } from 'element-ui'
import { Dialog } from 'element-ui'
import { MessageBox } from 'element-ui';
import { Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,CheckboxGroup,Checkbox,Upload} from 'element-ui'
// 导入弹框提示组件    element-ui里面的都可以合并到 一个{}
import { Message } from 'element-ui'
//Vue的插件(组件)是一个对象,
//Vue.use()里可以是一个对象也可以是一个函数，如果是函数就会被当作install
// 插件对象必须有install字段.install字段是一个函数.
// 初始化插件对象需要通过Vue.use()，因为它会Vue.use直接调用了这个Install方法,

//2019 3月份前的没有tiemline 时间线要手动引入
import Timeline from './timeline/index'
import TimelineItem from './timeline-item/index'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
//一般插件会用USE导入 公共方法用prototype
//Message需要全局挂载  $message是自己的一个自定义属性
//每一个vue组件都是Vue的实例，所以组件内this可以拿到Vue.prototype上添加的属性和方法。
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm