import {
	defineStore
} from "pinia";
import {setStore, getStore} from '../config/mUtils'

export const RECORD_ADDRESS = 'RECORD_ADDRESS'
export const ADD_CART = 'ADD_CART'
export const REDUCE_CART = 'REDUCE_CART'
export const INIT_BUYCART = 'INIT_BUYCART'
export const CLEAR_CART = 'CLEAR_CART'
export const RECORD_SHOPDETAIL = 'RECORD_SHOPDETAIL'
export const RECORD_USERINFO = 'RECORD_USERINFO'
export const GET_USERINFO = 'GET_USERINFO'
export const CONFIRM_REMARK = 'CONFIRM_REMARK'
export const CONFIRM_INVOICE = 'CONFIRM_INVOICE'
export const CHOOSE_SEARCH_ADDRESS = 'CHOOSE_SEARCH_ADDRESS'
export const SAVE_GEOHASH = 'SAVE_GEOHASH'
export const CONFIRM_ADDRESS = 'CONFIRM_ADDRESS'
export const CHOOSE_ADDRESS = 'CHOOSE_ADDRESS'
export const NEED_VALIDATION = 'NEED_VALIDATION'
export const SAVE_CART_ID_SIG = 'SAVE_CART_ID_SIG'
export const SAVE_ORDER_PARAM = 'SAVE_ORDER_PARAM'
export const CHANGE_ORDER_PARAM = 'CHANGE_ORDER_PARAM'
export const ORDER_SUCCESS = 'ORDER_SUCCESS'
export const SAVE_SHOPID = 'SAVE_SHOPID'
export const SAVE_ORDER = 'SAVE_ORDER'
export const OUT_LOGIN = 'OUT_LOGIN'
export const RETSET_NAME = 'RETSET_NAME'
export const SAVE_AVANDER = 'SAVE_AVANDER'
export const SAVE_ADDDETAIL = 'SAVE_ADDDETAIL'
export const SAVE_ADDRESS = 'SAVE_ADDRESS'
export const SAVE_QUESTION = 'SAVE_QUESTION'
export const ADD_ADDRESS = 'ADD_ADDRESS'
export const BUY_CART = 'BUY_CART'


export const useMainStore = defineStore('main', {
	state: () => { //state必须是函数，是避免在服务端渲染时的交叉请求导致的状态数据污染；必须是箭头函数，为了更好的TS类型推导
		return {
			latitude: '', // 当前位置纬度
			longitude: '', // 当前位置经度
			cartList: {}, // 加入购物车的商品列表
			shopDetail: null, //商家详情信息
			userInfo: null, //用户信息
			shopid: null, //商铺id
			remarkText: null, //可选备注内容
			inputText: '', //输入备注内容
			invoice: false, //开发票
			newAddress: [], //确认订单页新的地址
			searchAddress: null, //搜索并选择的地址
			geohash: '31.22299,121.36025', //地址geohash值
			choosedAddress: null, //选择地址
			addressIndex: null, //选择地址的索引值
			needValidation: null, //确认订单时是否需要验证
			cartId: null, //购物车id
			sig: null, //购物车sig
			orderParam: null, //订单的参数
			orderMessage: null, //订单返回的信息
			orderDetail: null, //订单详情
			login: true, //是否登录
			imgPath: null, //头像地址
			removeAddress: [], //移除地址
			addAddress: '', //新增地址
			question: null, //问题详情
			cartPrice: null, //会员卡价格
		}
	},
	getters: {
		//函数接受一个可选参数:state
		// getStore() {
		// 	return this.count + 10
		// }
		/*count10():number{   //在TS文件下，getters使用了this,则必须指定类型，否则会导致推导错误
			return this.count += 12
		  }*/
		 remarklist(){
			let str = new String();
			if (this.remarkText) {
			  Object.values(this.remarkText).forEach((item) => {
				str += item[1] + "，";
			  });
			}
			//是否有自定义备注，分开处理
			if (this.inputText) {
			  return str + this.inputText;
			} else {
			  return str.substr(0, str.lastIndexOf("，"));
			}
		  }
	},
	actions: {
		async getUserInfo() {
			let res = await getUser();
			this.userInfo = res;
		},
		async saveAddress() {
	
			if(this.removeAddress.length > 0) return;
	
			let addres = await getAddressList(this.userInfo.user_id);
			this.addAddress= addres;
		},
		//初始化购物车
		[INIT_BUYCART]() {
			let initCart = getStore('buyCart');
			if (initCart) {
				this.cartList = JSON.parse(initCart);
			}
		},
		[RECORD_ADDRESS]({
			latitude,
			longitude
		}) {
			this.latitude = latitude;
			this.longitude = longitude;
		},
	
		[RECORD_SHOPDETAIL](detail) {
			this.shopDetail = detail;
		},
		// 加入购物车
		[ADD_CART]({
			shopid,
			category_id,
			item_id,
			food_id,
			name,
			price,
			specs,
			packing_fee,
			sku_id,
			stock
		}) {
			let cart = this.cartList;
			let shop = cart[shopid] = (cart[shopid] || {});
			let category = shop[category_id] = (shop[category_id] || {});
			let item = category[item_id] = (category[item_id] || {});
			if (item[food_id]) {
				item[food_id]['num']++;
			} else {
				item[food_id] = {
						"num" : 1,
						"id" : food_id,
						"name" : name,
						"price" : price,
						"specs" : specs,
						"packing_fee" : packing_fee,
						"sku_id" : sku_id,
						"stock" : stock
				};
			}
			this.cartList = {...cart};
			//存入localStorage
			setStore('buyCart', this.cartList);
		},
		// 移出购物车
		[REDUCE_CART]({
			shopid,
			category_id,
			item_id,
			food_id,
			name,
			price,
			specs,
		}) {
			let cart = this.cartList;
			let shop = (cart[shopid] || {});
			let category = (shop[category_id] || {});
			let item = (category[item_id] || {});
			if (item && item[food_id]) {
				if (item[food_id]['num'] > 0) {
					item[food_id]['num']--;
					this.cartList = {...cart};
					//存入localStorage
					setStore('buyCart', this.cartList);
				} else {
					//商品数量为0，则清空当前商品的信息
					item[food_id] = null;
				}
			}
		},
		//网页初始化时从本地缓存获取购物车数据
		[INIT_BUYCART]() {
			let initCart = getStore('buyCart');
			if (initCart) {
				this.cartList = JSON.parse(initCart);
			}
		},
		//清空当前商品的购物车信息
		[CLEAR_CART](shopid) {
			this.cartList[shopid] = null;
			this.cartList = {...this.cartList};
			setStore('buyCart', this.cartList);
		},
		// 记录用户信息
		[RECORD_USERINFO](info) {
			this.userInfo = info;
			this.login = true;
			setStore('user_id', info.user_id);
		},
		//获取用户信息存入vuex
		[GET_USERINFO](info) {
			if (this.userInfo && (this.userInfo.username !== info.username)) {
				return;
			};
			if (!this.login) {
				return
			}
			if (!info.message) {
				this.userInfo = {...info};
			} else {
				this.userInfo = null;
			}
		},
		//修改用户名
		[RETSET_NAME](state,username) {
			this.userInfo = Object.assign({}, this.userInfo,{username})
		},
		//保存商铺id
		[SAVE_SHOPID](shopid) {
			this.shopid = shopid;
		},
		//记录订单页面用户选择的备注, 传递给订单确认页面
		[CONFIRM_REMARK]({
			remarkText,
			inputText
		}) {
			this.remarkText = remarkText;
			this.inputText = inputText;
		},
		//是否开发票
		[CONFIRM_INVOICE](invoice) {
			this.invoice = invoice;
		},
		//选择搜索的地址
		[CHOOSE_SEARCH_ADDRESS](place) {
			this.searchAddress = place;
		},
		//保存geohash
		[SAVE_GEOHASH](geohash) {
			this.geohash = geohash;
			
		},
		//确认订单页添加新的的地址
		[CONFIRM_ADDRESS](newAddress) {
			this.newAddress.push(newAddress);
		},
		//选择的地址
		[CHOOSE_ADDRESS]({
			address,
			index
		}) {
			this.choosedAddress = address;
			this.addressIndex = index;
		},
		//保存下单需要验证的返回值
		[NEED_VALIDATION](needValidation) {
			this.needValidation = needValidation;
		},
		//保存下单后购物id 和 sig
		[SAVE_CART_ID_SIG]({
			cart_id,
			sig
		}) {
			this.cart_id = cart_id;
			this.sig = sig;
		},
		//保存下单参数，用户验证页面调用
		[SAVE_ORDER_PARAM](orderParam) {
			this.orderParam = orderParam;
		},
		//修改下单参数
		[CHANGE_ORDER_PARAM](newParam) {
			this.orderParam = Object.assign({}, this.orderParam, newParam);
		},
		//下单成功，保存订单返回信息
		[ORDER_SUCCESS](order) {
			this.cartPrice = null;
			this.orderMessage = order;
		},
		//进入订单详情页前保存该订单信息
		[SAVE_ORDER](orderDetail) {
			this.orderDetail = orderDetail;
		},
		//退出登录
		[OUT_LOGIN]() {
			this.userInfo = {};
			this.login = false;
		},
		//保存图片
		[SAVE_AVANDER](imgPath) {
			this.imgPath = imgPath;
		},
		//删除地址列表
		[SAVE_ADDRESS](newAdress) {
			this.removeAddress = newAdress
		},
		//添加地址name
		[SAVE_ADDDETAIL](addAddress){
			this.addAddress=addAddress;
		},
		//保存所选问题标题和详情
		[SAVE_QUESTION](question) {
			this.question = {...question};
		},
		//增加地址
		[ADD_ADDRESS](obj) {
			this.removeAddress = [obj, ...this.removeAddress];
		},
		//会员卡价格纪录
		[BUY_CART](price) {
			this.cartPrice = price;
		}
	}
})