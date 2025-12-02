--- all part of Index.php on POS system ---

fetch('api/get_products.php')
    .then(response => response.json())
    .then(data => {
        products = data;
        products.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            itemDiv.innerHTML = `
                <img src="images/${product.image}" alt="${product.name}">
                <strong>${product.name}</strong><br>
                Price: ₱${parseFloat(product.price).toFixed(2)}
            `;
            menuItemsContainer.appendChild(itemDiv);
        });

        document.querySelectorAll('.add-to-order').forEach(button => {
            button.addEventListener('click', handleAddToOrder);
        });
    });

\\break\\

function handleAddToOrder(event) {
    const button = event.target;
    const menuItem = button.closest('.menu-item');
    const productId = button.dataset.id;
    const quantity = parseInt(menuItem.querySelector('.quantity').value);

    const product = products.find(p => p.id == productId);

    if (product) {
        const existing = order.find(item => item.id == productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            order.push({ ...product, quantity });
        }
        updateOrderSummary();
    }
}

\\break\\

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    let total = 0;

    order.forEach(item => {
        const li = document.createElement('li');
        const itemTotal = item.price * item.quantity;
        li.textContent = `${item.name} - ${item.quantity} x ₱${item.price} = ₱${itemTotal}`;
        orderList.appendChild(li);
        total += itemTotal;
    });

    document.getElementById('total-amount').textContent = total.toFixed(2);
}

\\break\\

document.getElementById('pay-button').addEventListener('click', () => {
    const payment = parseFloat(document.getElementById('payment-input').value);
    const total = parseFloat(document.getElementById('total-amount').textContent);

    if (payment < total) {
        Swal.fire('Invalid Payment', 'Payment is not enough.', 'error');
        return;
    }

    const orderData = {
        total_amount: total,
        payment_amount: payment,
        change_amount: payment - total,
        items: order
    };

    fetch('api/create_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
});

