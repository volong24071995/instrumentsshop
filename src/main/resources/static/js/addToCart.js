var orders={}||orders;
orders.addToCart=function (id) {
    $.ajax({
        url: '/api/addCart/'+id,
        method: "GET",
        dataType: "json",
        success: function (data) {
            var total=0;
            $("#simpleCart_quantity").html(data.orderDetailList.unshift());
            $.each(data.orderDetailList, function (i, v) {
                total=total+v.quantity*v.price;
                console.log(total+"lan1")
                $("#simpleCart_total").html("$"+total);
            });
            toastr.info('Add products to cart', 'INFORMATION:')
        }
    });
}

orders.showCart=function () {
    $("#listOrder").html(`<h1>My Shopping Bag (<sp id="sl">0</sp>)</h1>`)
    if ($("#addCart").empty()){
        var id=$("#id").val();
        $("#addCart").html(
            `<a href="#" onclick="orders.addToCart(${id})">buy</a>`
        )
    }
    $.ajax({
        url: '/api/showCart/',
        method: "GET",
        dataType: "json",
        success: function (data) {
            var total=0;
            $("#simpleCart_quantity").html(data.orderDetailList.unshift());
            $("#sl").html(data.orderDetailList.unshift());
            $.each(data.orderDetailList, function (i, v) {
                total=total+v.quantity*v.price;
                $("#simpleCart_total").html("$"+total);
                $("#total1").html(total);
                $("#total2").html(total);
                $("#listOrder").append(
                    `<div class="cart-header">
                        <div class="close1" onclick="orders.deleteProduct(${v.product.id})"></div>
                        <div class="cart-sec simpleCart_shelfItem">
                            <div class="cart-item cyc">
                                <img src="${v.product.image}" class="img-responsive" alt=""/>
                            </div>
                            <div class="cart-item-info">
                                <h3><a href="#">${v.product.name}</a><span>Model No: ${v.product.id}</span></h3>
                                <ul class="qty">
                                    <li><p>Size : ${v.product.size}</p></li>
                                    <li><p>Weight : ${v.product.weight}</p></li>
                                    <li><p>Color : ${v.product.color}</p></li>
                                    <li>
                                        <p>Qty :
                                            <span>
                                                <button type="button" style="width:10%" title='-' onclick="orders.upDown(${v.product.id},this.title)">-</button>
                                                <input type="text" value="${v.quantity}" id="quantity" disabled="disabled" style="width: 20%;text-align: center;justify-content: center" >
                                                <button type="button" style="width:10%" title='+' onclick="orders.upDown(${v.product.id},this.title)" >+</button>
                                            </span> 
                                        </p>
                                    </li>
                                    <li><p>Price : ${v.product.price}</p></li>
                                </ul>
                                <div class="delivery">
                                    <p>Total :$ ${v.product.price*v.quantity} </p>
                                    <span>Delivered in 2-3 bussiness days</span>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>`
                );
            });
        }
    });

}

orders.deleteProduct=function (id) {
    bootbox.confirm({
        message: "Do you want to delete this Product",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: '/api/deleteProduct/' + id,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        toastr.info('Delete products to cart', 'INFORMATION:')
                        orders.showCart().reload();
                    },
                    error: function () {
                        toastr.error('Error!! The product is not available', 'INFORMATION:')
                    }
                });
            }
        }
    });
}

orders.deleteAllProduct=function () {
    $.ajax({
        url: '/api/deleteALlProduct/',
        method: "GET",
        dataType: "json",
        success: function (data) {
            toastr.info('Delete all products to cart', 'INFORMATION:')
            location.reload();
        }
    });
}

orders.checkoutCart=function (){
    $.ajax({
        url: '/api/checkoutCart/',
        method: "GET",
        dataType: "json",
        success: function (data) {
            toastr.info('Checkout cart success', 'INFORMATION:')
            orders.showCart().reload();
        }
    });
}

orders.upDown=function (id,title){
    if (title==="-") {
        var qty = $("#quantity").val();
        if (qty - 1=== 0) {
            orders.deleteProduct(id);
        }else {
            $.ajax({
                url: "/api/down/" + id,
                method: "GET",
                dataType: "json",
                success: function () {
                    orders.showCart().reload();
                },
                error: function (jqXHR, exception) {
                    toastr.error('Error!! The product is not available', 'INFORMATION:')
                }
            });
        }
    }else {
        $.ajax({
            url: "/api/up/" + id,
            method: "GET",
            dataType: "json",
            success: function () {
                orders.showCart().reload();
            },
            error: function (jqXHR, exception) {
                toastr.error('Error!! The product is not available', 'INFORMATION:')
            }
        });
    }
}

$(document).ready(function () {
    orders.showCart();
});
