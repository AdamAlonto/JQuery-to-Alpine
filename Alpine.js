--- all part of Index.php ---


<div x-data="{
        products: [],
        async loadProducts() {
            let res = await fetch('api/get_products.php');
            this.products = await res.json();
        }
    }"
    x-init="loadProducts()"
>
    <template x-for="p in products">
        <div class="menu-item">
            <img :src="'images/' + p.image" :alt="p.name">
            <div><strong x-text="p.name"></strong></div>
            <div>Price: ₱<span x-text="parseFloat(p.price).toFixed(2)"></span></div>
            <button @click="$dispatch('add-item', p)">Add to Order</button>
        </div>
    </template>
</div>

\\break\\

<div 
    x-data="{
        order: [],
        addToOrder(product, qty) {
            let existing = this.order.find(i => i.id == product.id);
            if (existing) {
                existing.quantity += qty;
            } else {
                this.order.push({ ...product, quantity: qty });
            }
        }
    }"
    @add-item.window="addToOrder($event.detail, 1)"
>
</div>

\\break\\

<div x-data="{ order: [] }">
    <ul>
        <template x-for="item in order">
            <li>
                <span x-text="`${item.name} - ${item.quantity} x ₱${item.price} = ₱${(item.quantity * item.price).toFixed(2)}`"></span>
            </li>
        </template>
    </ul>

    <h3>Total: ₱<span x-text="order.reduce((t, i) => t + (i.price * i.quantity), 0).toFixed(2)"></span></h3>
</div>

\\break\\

<div x-data="{ order: [] }">
    <ul>
        <template x-for="item in order">
            <li>
                <span x-text="`${item.name} - ${item.quantity} x ₱${item.price} = ₱${(item.quantity * item.price).toFixed(2)}`"></span>
            </li>
        </template>
    </ul>

    <h3>Total: ₱<span x-text="order.reduce((t, i) => t + (i.price * i.quantity), 0).toFixed(2)"></span></h3>
</div>

\\breal\\

<div x-data="{
    order: [],
    payment: 0,
    async pay() {
        let total = this.order.reduce((t, i) => t + (i.price * i.quantity), 0);

        if (this.payment < total) {
            Swal.fire('Invalid Payment', 'Payment is not enough.', 'error');
            return;
        }

        let data = {
            total_amount: total,
            payment_amount: this.payment,
            change_amount: this.payment - total,
            items: this.order
        };

        let res = await fetch('api/create_order.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        Swal.fire('Payment Successful', 'Order has been recorded.', 'success');
        this.order = [];
        this.payment = 0;
    }
}">
    <input type="number" x-model="payment" placeholder="Enter Amount">
    <button @click="pay()">Pay</button>
</div>

