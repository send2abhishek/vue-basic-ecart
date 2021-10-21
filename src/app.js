let app = Vue.createApp({
  data() {
    return {
      inventory: [],
      cart: {},
      isVisible: false,
    };
  },
  computed: {
    getTotalCartItem() {
      return Object.values(this.cart).reduce((acc, current, index) => {
        return acc + current;
      }, 0);
    },
  },
  methods: {
    addToCart(name, index) {
      if (!this.cart[name]) this.cart[name] = 0;
      this.cart[name] += this.inventory[index].quantity;
      this.inventory[index].quantity = 0;
    },
    toggleSideBar() {
      this.isVisible = !this.isVisible;
    },
    removeItem(name) {
      delete this.cart[name];
    },
  },

  async mounted() {
    const res = await fetch("./food.json");
    const data = await res.json();
    this.inventory = data;
  },
});

app.component("sidebar", {
  props: ["toggle1", "cart", "inventory", "name", "remove"],

  computed: {},
  methods: {
    getProductPrice(name) {
      const product = this.inventory.find((p) => p.name === name);
      return product ? product.price.USD : 0;
    },
    getTotalPrice() {
      // const cartsName = Object.keys(this.cart);
      console.log(Object.entries(this.cart));
      const total = Object.entries(this.cart).reduce((acc, current, index) => {
        return acc + current[1] * this.getProductPrice(current[0]);
      }, 0);

      return total.toFixed(2);
    },
  },

  template: ` <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle1" class="cart-close">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quantity,key,i) in cart" :key="i">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{key}}</td>
              <td>{{getProductPrice(key)}}</td>
              <td class="center">{{quantity}}</td>
              <td>\${{(getProductPrice(key)* quantity).toFixed(2)}}</td>
              <td class="center">
                <button @click="remove(key)" class="btn btn-light cart-remove">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong> {{getTotalPrice()}}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>`,
  // data: function () {
  //   return {
  //     isVisible: true,
  //   };
  // },
  mounted() {
    console.log("items", this.cart, this.inventory, this.name);
  },
});

app.mount("#app");
